#!/usr/bin/env python3
"""Check Ruach resource names and relative Markdown file targets (not behavior)."""
from pathlib import Path
import re
import sys
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
errors = []
for skill in (root / 'skills').iterdir():
    if not skill.is_dir():
        errors.append(f'Unexpected skill entry: {skill.name}')
        continue
    entry = skill / 'SKILL.md'
    text = entry.read_text() if entry.exists() else ''
    header = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    name = re.search(r'^name: (.+)$', header[1], re.M) if header else None
    desc = re.search(r'^description: (.+)$', header[1], re.M) if header else None
    if not re.fullmatch(r'ruach-[a-z0-9-]+', skill.name) or not name or name[1] != skill.name or not desc:
        errors.append(f'Invalid skill identity/description: {skill.name}')
for path in root.rglob('*'):
    if any(part in ('node_modules', '.git', '__pycache__') for part in path.relative_to(root).parts):
        continue
    if path.is_symlink():
        errors.append(f'Symlink in source: {path.relative_to(root)}')
    if path.suffix != '.md' or not path.is_file():
        continue
    text = re.sub(r'```.*?```', '', path.read_text(), flags=re.S)
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', text):
        target = target.split('#')[0].strip('<>')
        if not target or re.match(r'[a-z]+:', target):
            continue
        resolved = path.parent / unquote(target)
        if not resolved.exists():
            errors.append(f'Broken target in {path.relative_to(root)}: {target}')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print('Resource identities and relative Markdown file targets passed; behavioral quality untested')
