#!/usr/bin/env bun
// Write project-level Codex and agy hook registrations for one consumer repository.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, 'changelog.ts');
const bun = process.execPath;
const marker = 'ruach-changelog';
// Stable across copies (source checkout, consumer snapshot, plugin cache): recognises our own entries.
const signature = 'ruach-changelog/scripts/changelog.ts';
const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;

const i = process.argv.indexOf('--project');
const project = i >= 0 && process.argv[i + 1] ? resolve(process.argv[i + 1]) : '';
if (!project || !existsSync(project) || !statSync(project).isDirectory()) {
  console.error('usage: register.ts --project <existing consumer repository directory>');
  process.exit(2);
}

const command = (harness: string) => `${quote(bun)} ${quote(script)} --harness ${harness} --project ${quote(project)}`;
const isOurs = (entry: any) => JSON.stringify(entry).includes(signature);

function read(path: string): any {
  if (!existsSync(path)) return {};
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch (error) {
    console.error(`${path}: not valid JSON; leaving it untouched`);
    process.exit(2);
  }
}
function write(path: string, value: unknown): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  console.log(`wrote ${path}`);
}

// Codex: same shape as Claude hook files; Stop and PostCompact.
const codexPath = join(project, '.codex/hooks.json');
const codex = read(codexPath);
const invalid = (what: string): never => { console.error(`${what}: unexpected shape; leaving both files untouched`); process.exit(2); };
const plain = (v: unknown) => typeof v === 'object' && v !== null && !Array.isArray(v);
if (!plain(codex)) invalid(codexPath);
codex.hooks ??= {};
if (!plain(codex.hooks)) invalid(`${codexPath} hooks`);
for (const event of ['Stop', 'PostCompact']) {
  if (codex.hooks[event] !== undefined && !Array.isArray(codex.hooks[event])) invalid(`${codexPath} hooks.${event}`);
  const others = (codex.hooks[event] ?? []).filter((entry: unknown) => !isOurs(entry));
  codex.hooks[event] = [...others, { hooks: [{ type: 'command', command: command('codex'), async: true }] }];
}

// agy: map of hook name -> event arrays; synchronous, Stop only.
const agyPath = join(project, '.agents/hooks.json');
const agy = read(agyPath);
if (!plain(agy)) invalid(agyPath);
agy[marker] = { Stop: [{ type: 'command', command: command('agy'), timeout: 30 }] };

write(codexPath, codex);
write(agyPath, agy);
console.log(`Next: approve the Codex hooks yourself with /hooks (and set [features] hooks = true), trust the workspace in agy, and add the changelog target to .gitignore. Opt in with ${join(project, '.ruach/changelog.json')}.`);
