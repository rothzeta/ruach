#!/usr/bin/env bun
// Install/check a committed Ruach snapshot without touching consumer policy.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const ORIGIN = 'https://github.com/rothzeta/ruach.git', METADATA = 'ruach.json';
const EXTRAS: Record<string, string> = { 'scripts/install.ts': 'ruach-install.ts', LICENSE: 'ruach/LICENSE', 'PROVENANCE.md': 'ruach/PROVENANCE.md' };
const IGNORED = new Set(['node_modules', '__pycache__']);
type FileRecord = { sha256: string; mode: number };
type Manifest = { schema_version: 1; origin: string; version?: string; revision: string; files: Record<string, FileRecord> };
type Snapshot = Map<string, { body: Buffer; mode: number }>;
type Options = { target: string; source?: string; version?: string; revision?: string; replace?: boolean };
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function git(source: string, args: string[], input?: string): Buffer {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.toUpperCase().startsWith('GIT_')));
  const result = spawnSync('git', ['--no-replace-objects', '-C', source, ...args], { input, env, maxBuffer: 128 * 1024 * 1024 });
  // Git stderr may contain source/host configuration; do not echo it.
  if (result.error || result.status !== 0) throw new Error('Git source/revision unavailable');
  return result.stdout;
}
function digest(body: Buffer) { return createHash('sha256').update(body).digest('hex'); }
function stat(path: string) {
  try { return lstatSync(path); }
  catch (error: any) { if (error.code === 'ENOENT') return undefined; throw error; }
}
function safeParts(name: string): string[] {
  const parts = name.split('/');
  if (isAbsolute(name) || name.includes('\\') || name.includes('\0') || parts.some(p => !p || p === '.' || p === '..')) throw new Error('Invalid managed snapshot path');
  return parts;
}
function destination(target: string, name: string): string {
  const parts = safeParts(name);
  // Accept the previous installer name so updates can prune old snapshots.
  if (!['agents', 'skills', 'ruach'].includes(parts[0]) && !['ruach-install.ts', 'ruach-install.py'].includes(name)) throw new Error('Invalid managed snapshot path');
  const dest = join(target, ...parts);
  for (let current = dest;; current = dirname(current)) {
    if (stat(current)?.isSymbolicLink()) throw new Error('Snapshot destinations must not be symlinks');
    if (dirname(current) === current) break;
  }
  return dest;
}
function committed(source: string, revision: string): { sha: string; files: Snapshot; version?: string } {
  const sha = git(source, ['rev-parse', '--verify', '--end-of-options', `${revision}^{commit}`]).toString().trim();
  const entries = git(source, ['ls-tree', '-r', '-z', sha, '--', 'agents', 'skills', 'package.json', ...Object.keys(EXTRAS)])
    .toString().split('\0').filter(Boolean).map(entry => {
      const match = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(entry);
      if (!match || match[2] !== 'blob' || !['100644', '100755'].includes(match[1])) throw new Error('Source tree must contain only safe regular files');
      const [, mode, , oid, name] = match;
      if (safeParts(name).some(part => IGNORED.has(part))) throw new Error('Source tree contains installed dependencies or cache');
      return { mode: mode === '100755' ? 0o755 : 0o644, oid, name: EXTRAS[name] ?? name };
    });
  // Batch reads preserve binary bytes and avoid a process per resource. Nothing is extracted to disk.
  const bodies = git(source, ['cat-file', '--batch'], entries.map(entry => entry.oid + '\n').join(''));
  const files: Snapshot = new Map();
  let version: string | undefined;
  let offset = 0;
  for (const entry of entries) {
    const end = bodies.indexOf(10, offset);
    const header = /^(\S+) blob (\d+)$/.exec(bodies.subarray(offset, end).toString());
    if (end < offset || !header || header[1] !== entry.oid) throw new Error('Invalid committed file response');
    const size = Number(header[2]), start = end + 1;
    if (!Number.isSafeInteger(size) || start + size >= bodies.length || bodies[start + size] !== 10) throw new Error('Invalid committed file response');
    const body = bodies.subarray(start, start + size);
    if (entry.name === 'package.json') version = JSON.parse(body.toString()).version;
    else files.set(entry.name, { body, mode: entry.mode });
    offset = start + size + 1;
  }
  if (!Object.values(EXTRAS).every(name => files.has(name)) || ![...files.keys()].some(p => p.startsWith('agents/')) || ![...files.keys()].some(p => p.startsWith('skills/'))) throw new Error('Source commit lacks required resources');
  return { sha, files, version };
}
function manifest(sha: string, files: Snapshot, version?: string): Manifest {
  return { schema_version: 1, origin: ORIGIN, ...(version ? { version } : {}), revision: sha,
    files: Object.fromEntries([...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, { body, mode }]) => [name, { sha256: digest(body), mode }])) };
}
function object(value: unknown): value is Record<string, any> { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function load(target: string): Manifest {
  const path = join(target, METADATA);
  if (stat(path)?.isSymbolicLink()) throw new Error('Snapshot metadata must not be a symlink');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (!object(data) || data.schema_version !== 1 || data.origin !== ORIGIN || typeof data.revision !== 'string' || !/^[0-9a-f]{40}$/.test(data.revision)) throw new Error('Invalid snapshot metadata');
  if (!object(data.files) || !Object.keys(data.files).length) throw new Error('Invalid snapshot file manifest');
  if (data.version !== undefined && (typeof data.version !== 'string' || !VERSION.test(data.version))) throw new Error('Invalid snapshot release version');
  for (const [name, expected] of Object.entries(data.files)) {
    destination(target, name);
    if (!object(expected) || Object.keys(expected).sort().join(',') !== 'mode,sha256' || typeof expected.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(expected.sha256) || ![0o644, 0o755].includes(expected.mode)) throw new Error('Invalid snapshot file record');
  }
  return data as Manifest;
}
function* walk(directory: string, prefix: string): Generator<string> {
  if (!stat(directory)?.isDirectory()) return;
  for (const name of readdirSync(directory).sort()) {
    if (IGNORED.has(name) || name.endsWith('.pyc')) continue;
    const path = join(directory, name), relative = `${prefix}/${name}`, info = stat(path);
    yield relative;
    if (info?.isDirectory()) yield* walk(path, relative);
  }
}
function drift(target: string, data: Manifest): string[] {
  const problems = new Set<string>();
  for (const [name, expected] of Object.entries(data.files)) {
    const path = destination(target, name), info = stat(path);
    if (!info?.isFile() || digest(readFileSync(path)) !== expected.sha256 || (info.mode & 0o111 ? 0o755 : 0o644) !== expected.mode) problems.add(name);
  }
  // New files within managed skills are drift; extra consumer skills/roles are allowed.
  const skills = new Set(Object.keys(data.files).filter(name => name.startsWith('skills/')).map(name => name.split('/')[1]));
  for (const skill of skills) for (const name of walk(join(target, 'skills', skill), `skills/${skill}`)) {
    const info = stat(join(target, name));
    if (info?.isSymbolicLink() || info?.isFile() && !Object.hasOwn(data.files, name)) problems.add(name);
  }
  return [...problems].sort();
}
function install(options: Options) {
  if (options.version !== undefined && !VERSION.test(options.version)) throw new Error('Release version must be MAJOR.MINOR.PATCH');
  const ref = options.version !== undefined ? `refs/tags/v${options.version}` : options.revision!;
  const target = resolve(options.target), { sha, files, version } = committed(options.source!, ref);
  if (options.version !== undefined && version !== options.version) throw new Error('Release tag does not match the committed package version');
  if (stat(join(target, METADATA))?.isSymbolicLink()) throw new Error('Snapshot metadata must not be a symlink');
  const old = existsSync(join(target, METADATA)) ? load(target) : undefined;
  const problems = old ? drift(target, old) : [];
  if (problems.length && !options.replace) throw new Error('Installed snapshot has drift; use --replace to overwrite explicitly');
  for (const [name, { body }] of files) {
    const path = destination(target, name), info = stat(path);
    if (info && !info.isFile()) throw new Error('Managed destination is not a regular file');
    if (info && (!old || !Object.hasOwn(old.files, name)) && !readFileSync(path).equals(body) && !options.replace) throw new Error('Conflicting destination; use --replace to adopt explicitly');
  }
  const removals = new Set<string>();
  if (old) {
    if (options.replace) for (const name of problems) if (!Object.hasOwn(old.files, name) && !files.has(name)) removals.add(name);
    for (const name of Object.keys(old.files)) if (!files.has(name)) removals.add(name);
  }
  // Validate every removal before mutation, including obsolete managed paths.
  const paths = [...removals].map(name => destination(target, name));
  for (const path of paths) if (stat(path) && !stat(path)!.isFile()) throw new Error('Managed destination is not a regular file');
  for (const path of paths) if (stat(path)) unlinkSync(path);
  for (const [name, { body, mode }] of files) {
    const path = destination(target, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
    chmodSync(path, mode);
  }
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, METADATA), JSON.stringify(manifest(sha, files, options.version), null, 2) + '\n');
  console.log(`Installed ${files.size} files from ${options.version ? `v${options.version}` : sha}`);
}
function canonical(value: unknown): string {
  if (object(value)) return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
function check(options: Options) {
  const target = resolve(options.target), data = load(target), problems = drift(target, data);
  if (problems.length) throw new Error('Snapshot drift: ' + problems.join(', '));
  if (options.source) {
    const { sha, files, version } = committed(options.source, data.revision);
    if (data.version !== undefined && data.version !== version) throw new Error('Snapshot version differs from the committed release');
    if (canonical(data) !== canonical(manifest(sha, files, data.version))) throw new Error('Snapshot manifest differs from recorded upstream Git tree');
  }
  console.log(`Snapshot verified: ${data.version ? `v${data.version}` : data.revision} (${Object.keys(data.files).length} files)`);
}
const usage = 'bun install.ts install --source DIR --version VERSION --target DIR [--replace]\nbun ruach-install.ts check --target DIR [--source DIR]\nAdvanced/legacy installation may use --revision COMMIT instead of --version.';
try {
  const [command, ...argv] = process.argv.slice(2);
  if (command === '--help' || (['install', 'check'].includes(command) && argv.includes('--help'))) { console.log(usage); process.exit(0); }
  if (!['install', 'check'].includes(command)) throw new Error(usage);
  const { values, positionals } = parseArgs({ args: argv, strict: true, allowPositionals: false, options: {
    source: { type: 'string' }, target: { type: 'string' },
    ...(command === 'install' ? { version: { type: 'string' as const }, revision: { type: 'string' as const }, replace: { type: 'boolean' as const } } : {}),
  } });
  if (positionals.length || !values.target || (command === 'install' && (!values.source || (Boolean(values.version) === Boolean(values.revision))))) throw new Error(usage);
  (command === 'install' ? install : check)(values as Options);
} catch (error) {
  console.error('Snapshot failed: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
}
