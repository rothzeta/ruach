#!/usr/bin/env python3
"""Install/check a committed Ruach snapshot without touching consumer policy."""
import argparse
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import tarfile

ORIGIN = 'https://github.com/rothzeta/ruach.git'
METADATA = 'ruach.json'
EXTRAS = {'scripts/install.py': 'ruach-install.py', 'LICENSE': 'ruach/LICENSE',
          'PROVENANCE.md': 'ruach/PROVENANCE.md'}
IGNORED = {'node_modules', '__pycache__'}


def git(source, *args):
    return subprocess.check_output(['git', '-C', str(source), *args], stderr=subprocess.PIPE)


def digest(body):
    return hashlib.sha256(body).hexdigest()


def committed(source, revision):
    sha = git(source, 'rev-parse', '--verify', revision + '^{commit}').decode().strip()
    archive = git(source, 'archive', '--format=tar', sha, 'agents', 'skills', *EXTRAS)
    files = {}
    with tarfile.open(fileobj=io.BytesIO(archive)) as bundle:
        for entry in bundle:
            if entry.isdir():
                continue
            name = PurePosixPath(entry.name)
            if name.is_absolute() or '..' in name.parts or not entry.isfile():
                raise ValueError('Source archive must contain only safe regular files')
            if any(part in IGNORED for part in name.parts):
                raise ValueError('Source archive contains installed dependencies or cache')
            dest = EXTRAS.get(str(name), str(name))
            files[dest] = (bundle.extractfile(entry).read(), 0o755 if entry.mode & 0o111 else 0o644)
    if not set(EXTRAS.values()) <= files.keys() or not any(p.startswith('agents/') for p in files) or not any(p.startswith('skills/') for p in files):
        raise ValueError('Source commit lacks required resources')
    return sha, files


def manifest(sha, files):
    return {'schema_version': 1, 'origin': ORIGIN, 'revision': sha,
            'files': {name: {'sha256': digest(body), 'mode': mode}
                      for name, (body, mode) in sorted(files.items())}}


def destination(target, name):
    path = PurePosixPath(name)
    # Do not let metadata or destination symlinks direct writes outside installation.
    if path.is_absolute() or '..' in path.parts or not path.parts or not (
        path.parts[0] in ('agents', 'skills', 'ruach') or str(path) == 'ruach-install.py'
    ):
        raise ValueError('Invalid managed snapshot path')
    dest = target / path
    for current in [target, *dest.parents, dest]:
        if current.is_symlink():
            raise ValueError('Snapshot destinations must not be symlinks')
    return dest


def load(target):
    path = target / METADATA
    if path.is_symlink():
        raise ValueError('Snapshot metadata must not be a symlink')
    data = json.loads(path.read_text())
    if data.get('schema_version') != 1 or data.get('origin') != ORIGIN or not re.fullmatch('[0-9a-f]{40}', data.get('revision', '')):
        raise ValueError('Invalid snapshot metadata')
    if not isinstance(data.get('files'), dict) or not data['files']:
        raise ValueError('Invalid snapshot file manifest')
    for name, expected in data['files'].items():
        destination(target, name)
        if not isinstance(expected, dict) or set(expected) != {'sha256', 'mode'} or not re.fullmatch('[0-9a-f]{64}', expected.get('sha256', '')) or expected.get('mode') not in (0o644, 0o755):
            raise ValueError('Invalid snapshot file record')
    return data


def drift(target, data):
    problems = []
    for name, expected in data['files'].items():
        path = destination(target, name)
        if not path.is_file() or digest(path.read_bytes()) != expected['sha256'] or (0o755 if path.stat().st_mode & 0o111 else 0o644) != expected['mode']:
            problems.append(name)
    # New files within managed skills are drift too; extra consumer skills/roles are allowed.
    skills = {PurePosixPath(name).parts[1] for name in data['files'] if name.startswith('skills/')}
    for skill in skills:
        directory = target / 'skills' / skill
        for path in directory.rglob('*'):
            relative = path.relative_to(target)
            if any(part in IGNORED for part in relative.parts) or path.suffix == '.pyc':
                continue
            if path.is_symlink() or path.is_file() and str(relative) not in data['files']:
                problems.append(str(relative))
    return sorted(set(problems))


def install(args):
    target = args.target.absolute()
    sha, files = committed(args.source, args.revision)
    if (target / METADATA).is_symlink():
        raise ValueError('Snapshot metadata must not be a symlink')
    old = load(target) if (target / METADATA).exists() else None
    if old and drift(target, old) and not args.replace:
        raise ValueError('Installed snapshot has drift; use --replace to overwrite explicitly')
    for name, (body, mode) in files.items():
        path = destination(target, name)
        if path.exists() and not path.is_file():
            raise ValueError('Managed destination is not a regular file')
        if path.exists() and not old and path.read_bytes() != body and not args.replace:
            raise ValueError('Conflicting destination; use --replace to adopt explicitly')
        if old and name not in old['files'] and path.exists() and path.read_bytes() != body and not args.replace:
            raise ValueError('Unmanaged destination conflict; use --replace explicitly')
    extras = []
    if old and args.replace:
        for name in drift(target, old):
            if name not in old['files'] and name not in files:
                extras.append(destination(target, name))
    # All preflight checks happen before mutation. Remove only managed paths.
    for path in extras:
        path.unlink()

    for name in old['files'] if old else ():
        if name not in files:
            destination(target, name).unlink(missing_ok=True)
    for name, (body, mode) in files.items():
        path = destination(target, name)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        path.chmod(mode)
    target.mkdir(parents=True, exist_ok=True)
    metadata = target / METADATA
    if metadata.is_symlink():
        raise ValueError('Snapshot metadata must not be a symlink')
    metadata.write_text(json.dumps(manifest(sha, files), indent=2, sort_keys=True) + '\n')
    print(f'Installed {len(files)} files at {sha}')


def check(args):
    target = args.target.absolute()
    data = load(target)
    problems = drift(target, data)
    if problems:
        raise ValueError('Snapshot drift: ' + ', '.join(problems))
    if args.source:
        sha, files = committed(args.source, data['revision'])
        if data != manifest(sha, files):
            raise ValueError('Snapshot manifest differs from recorded upstream Git tree')
    print(f'Snapshot verified: {data["revision"]} ({len(data["files"])} files)')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    add = sub.add_parser('install')
    add.add_argument('--source', type=Path, required=True)
    add.add_argument('--revision', required=True)
    add.add_argument('--target', type=Path, required=True)
    add.add_argument('--replace', action='store_true', help='Explicitly overwrite conflicts or managed drift')
    verify = sub.add_parser('check')
    verify.add_argument('--target', type=Path, required=True)
    verify.add_argument('--source', type=Path, help='Also compare to the recorded committed source tree')
    args = parser.parse_args()
    try:
        (install if args.command == 'install' else check)(args)
        return 0
    except (OSError, ValueError, TypeError, subprocess.CalledProcessError, tarfile.TarError) as error:
        # Git stderr can contain source/host configuration; do not echo it.
        print('Snapshot failed: ' + ('Git source/revision unavailable' if isinstance(error, subprocess.CalledProcessError) else str(error)), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
