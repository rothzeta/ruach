#!/usr/bin/env bun
// Check resource names, eval placement and relative Markdown targets (not behavior).
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..'), errors: string[] = [];
const ignored = new Set(['node_modules', '.git', '__pycache__']);
function* walk(directory: string, prefix = ''): Generator<string> {
  for (const name of readdirSync(directory).sort()) {
    if (ignored.has(name)) continue;
    const relative = prefix ? `${prefix}/${name}` : name;
    yield relative;
    if (lstatSync(join(root, relative)).isDirectory()) yield* walk(join(root, relative), relative);
  }
}
for (const name of readdirSync(join(root, 'skills')).sort()) {
  const skill = join(root, 'skills', name);
  if (!lstatSync(skill).isDirectory()) { errors.push(`Unexpected skill entry: ${name}`); continue; }
  const entry = join(skill, 'SKILL.md'), text = existsSync(entry) ? readFileSync(entry, 'utf8') : '';
  const header = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1];
  const identity = header && /^name: (.+)$/m.exec(header)?.[1];
  const description = header && /^description: (.+)$/m.exec(header)?.[1];
  if (!/^ruach-[a-z0-9-]+$/.test(name) || identity !== name || !description) errors.push(`Invalid skill identity/description: ${name}`);
  const compatibility = header && /^compatibility:(.*)$/m.exec(header)?.[1].trim();
  if (compatibility !== undefined && compatibility !== false && (!compatibility || compatibility.length > 500)) errors.push(`Invalid compatibility metadata (1-500 characters on one line): ${name}`);
  if (existsSync(join(skill, 'package.json')) && !/\bBun\b/.test(compatibility || '')) errors.push(`Executable skill must declare Bun compatibility: ${name}`);
}
for (const relative of walk(root)) {
  const path = join(root, relative), info = lstatSync(path), name = relative.split('/').at(-1)!;
  if (relative.startsWith('skills/') && (name === 'evals' || name.toLowerCase().includes('rubric'))) errors.push(`Evaluation material inside installed skills: ${relative}`);
  if (info.isSymbolicLink()) errors.push(`Symlink in source: ${relative}`);
  if (!path.endsWith('.md') || !info.isFile()) continue;
  const text = readFileSync(path, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0].replace(/^<|>$/g, '');
    if (!target || /^[a-z]+:/.test(target)) continue;
    let decoded: string;
    try { decoded = decodeURIComponent(target); } catch { errors.push(`Invalid encoded target in ${relative}: ${target}`); continue; }
    if (!existsSync(resolve(dirname(path), decoded))) errors.push(`Broken target in ${relative}: ${target}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Resource identities, eval placement and relative Markdown file targets passed; behavioral quality untested');
