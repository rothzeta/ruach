#!/usr/bin/env bun
// Write project-level Codex and agy hook registrations for one consumer repository.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, 'changelog.ts');
const bun = process.execPath;
const marker = 'ruach-changelog';

const i = process.argv.indexOf('--project');
const project = i >= 0 && process.argv[i + 1] ? resolve(process.argv[i + 1]) : '';
if (!project || !existsSync(project) || !statSync(project).isDirectory()) {
  console.error('usage: register.ts --project <existing consumer repository directory>');
  process.exit(2);
}

const command = (harness: string) => `${bun} ${script} --harness ${harness} --project ${project}`;
const isOurs = (entry: any) => JSON.stringify(entry).includes(script);

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
codex.hooks ??= {};
for (const event of ['Stop', 'PostCompact']) {
  const others = (codex.hooks[event] ?? []).filter((entry: unknown) => !isOurs(entry));
  codex.hooks[event] = [...others, { hooks: [{ type: 'command', command: command('codex'), async: true }] }];
}

// agy: map of hook name -> event arrays; synchronous, Stop only.
const agyPath = join(project, '.agents/hooks.json');
const agy = read(agyPath);
agy[marker] = { Stop: [{ type: 'command', command: command('agy'), timeout: 30 }] };

write(codexPath, codex);
write(agyPath, agy);
console.log(`Next: approve the Codex hooks yourself with /hooks (and set [features] hooks = true), trust the workspace in agy, and add the changelog target to .gitignore. Opt in with ${join(project, '.ruach/changelog.json')}.`);
