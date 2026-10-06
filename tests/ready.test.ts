// Exercise the read-only `ready` subcommand as a CLI with a fake HOME, CODEX_HOME and PATH stubs.
import { afterEach, beforeEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, '../scripts/install.ts');
let base: string, home: string, project: string, target: string, source: string, bin: string, log: string, installed: string;
function write(path: string, body: string) { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, body); }
function stub(name: string, version = '1.0.0') {
  write(join(bin, name), `#!/bin/sh\necho "${name} $*" >> "$STUB_LOG"\necho "${version}"\n`);
  chmodSync(join(bin, name), 0o755);
}
function git(...args: string[]) {
  const result = spawnSync('git', ['-C', source, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
}
function fixtureSkill(name: string) {
  write(join(source, `skills/${name}/SKILL.md`), `---\nname: ${name}\ndescription: Fixture\n---\n`);
  write(join(source, `skills/${name}/package.json`), JSON.stringify({ name, version: '1.0.0', dependencies: { dep: '1.0.0' } }));
  write(join(source, `skills/${name}/bun.lock`), '{\n  "packages": {\n    "dep": ["dep@1.0.0", "", {}, "sha512-x"],\n  }\n}\n');
}
function dependency(skillDirectory: string, version: string) { write(join(skillDirectory, 'node_modules/dep/package.json'), JSON.stringify({ name: 'dep', version })); }
function ready(args: string[], options: { tools?: string[]; cwd?: string; installedScript?: string; env?: Record<string, string> } = {}) {
  rmSync(bin, { recursive: true, force: true }); mkdirSync(bin);
  for (const tool of options.tools ?? ['bun', 'git', 'herdr', 'claude']) stub(tool);
  return spawnSync(process.execPath, [options.installedScript ?? installed, 'ready', ...args], {
    cwd: options.cwd ?? project, encoding: 'utf8',
    env: { BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0', HOME: home, CODEX_HOME: join(home, '.codex'), PATH: bin, STUB_LOG: log, ...options.env },
  });
}
function json(args: string[] = [], options = {}) { const result = ready([...args, '--json'], options); return { ...result, data: result.stdout ? JSON.parse(result.stdout) : undefined }; }
function hashTree(root: string): string[] {
  const rows: string[] = [];
  (function visit(directory: string, prefix: string) {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name), info = lstatSync(path);
      rows.push(`${prefix}${name} ${info.mode} ${info.mtimeMs} ${info.isFile() ? createHash('sha256').update(readFileSync(path)).digest('hex') : ''}`);
      if (info.isDirectory()) visit(path, `${prefix}${name}/`);
    }
  })(root, '');
  return rows;
}
beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'ruach-ready-test-'));
  home = join(base, 'home'); project = join(home, 'project'); target = join(project, '.agents'); source = join(base, 'source'); bin = join(base, 'bin'); log = join(base, 'stub.log');
  mkdirSync(project, { recursive: true }); writeFileSync(log, '');
  write(join(source, 'agents/implementer.md'), '---\nname: implementer\n---\nRole\n');
  fixtureSkill('ruach-example'); fixtureSkill('ruach-herdr');
  for (const name of ['LICENSE', 'PROVENANCE.md']) write(join(source, name), name + '\n');
  write(join(source, 'package.json'), JSON.stringify({ name: 'ruach', version: '0.1.0' }));
  mkdirSync(join(source, 'scripts')); copyFileSync(script, join(source, 'scripts/install.ts'));
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'Fixture');
  const sha = spawnSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const result = spawnSync(process.execPath, [script, 'install', '--source', source, '--revision', sha, '--target', target], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  installed = join(target, 'ruach-install.ts');
  for (const skill of ['ruach-example', 'ruach-herdr']) dependency(join(target, 'skills', skill), '1.0.0');
});
afterEach(() => { try { chmodSync(join(home, '.claude/skills'), 0o755); } catch {} rmSync(base, { recursive: true, force: true }); });

test('ready never changes files and runs only version probes', () => {
  write(join(home, '.claude/skills/ruach-example/SKILL.md'), '---\nname: ruach-example\n---\n');
  const before = hashTree(base).filter(row => !row.startsWith('stub.log') && !row.startsWith('bin'));
  for (const args of [[], ['--route', 'herdr'], ['--route', 'skill', '--json']]) ready(args);
  expect(hashTree(base).filter(row => !row.startsWith('stub.log') && !row.startsWith('bin'))).toEqual(before);
  const calls = readFileSync(log, 'utf8').trim().split('\n');
  expect(calls.length).toBeGreaterThan(0);
  expect(calls.every(call => call.endsWith(' --version'))).toBe(true);
});
test('a snapshot reports its version and revision, and drift makes the native route fail', () => {
  const manifest = JSON.parse(readFileSync(join(target, 'ruach.json'), 'utf8'));
  let result = json(['--route', 'native']);
  expect(result.status, result.stderr).toBe(0);
  expect(result.data.active).toMatchObject({ kind: 'snapshot', revision: manifest.revision, integrity: 'ok' });
  writeFileSync(join(target, 'agents/implementer.md'), 'local edit\n');
  result = json(['--route', 'native']); expect(result.status).toBe(1);
  expect(result.data.routes.native.ready).toBe(false); expect(result.data.routes.skill.ready).toBe(true);
  expect(ready(['--route', 'skill']).status).toBe(0);
});
test('nested package state is missing, mismatched or ready with a remediation command', () => {
  const directory = join(target, 'skills/ruach-herdr');
  const state = () => json().data.packages.find((p: any) => p.skill === 'ruach-herdr');
  expect(state().state).toBe('ready');
  rmSync(join(directory, 'node_modules'), { recursive: true });
  expect(state().state).toBe('missing'); expect(state().remediation).toContain('bun install --frozen-lockfile');
  dependency(directory, '2.0.0'); expect(state().state).toBe('mismatched');
  const result = json(['--route', 'herdr']); expect(result.status).toBe(1);
  expect(result.data.routes.herdr.missing.join('\n')).toContain('bun install --frozen-lockfile');
  dependency(directory, '1.0.0'); expect(state().state).toBe('ready');
});
test('a missing prerequisite fails only the routes that need it', () => {
  expect(ready(['--route', 'herdr'], { tools: ['bun', 'git', 'claude'] }).status).toBe(1);
  expect(ready(['--route', 'skill'], { tools: ['bun', 'git', 'claude'] }).status).toBe(0);
  expect(ready(['--route', 'native'], { tools: ['bun', 'git'] }).status).toBe(0);
  const noGit = json(['--route', 'herdr'], { tools: ['bun', 'herdr'] }); expect(noGit.status).toBe(1);
  expect(noGit.data.routes.herdr.missing.join('\n')).toContain('git'); expect(noGit.data.routes.skill.ready).toBe(true);
  const noBun = json(['--route', 'skill'], { tools: ['git', 'herdr'] }); expect(noBun.status).toBe(1);
  expect(noBun.data.routes.skill.missing.join('\n')).toContain('bun');
  expect(json([], { env: { HERDR_ENV: '' } }).data.routes.herdr.warnings).toContain('live launch needs a Herdr session');
});
test('a Ruach skill duplicated across locations warns without changing the exit code', () => {
  cpSync(join(target, 'skills/ruach-example'), join(home, '.claude/skills/ruach-example'), { recursive: true });
  const result = json(['--route', 'skill']);
  expect(result.status).toBe(0);
  expect(result.data.routes.skill.warnings.join('\n')).toContain('duplicate skill ruach-example');
});
test('--json is stable and renders home paths with a tilde', () => {
  const { data, status } = json(); expect(status).toBe(0);
  expect(data.schema_version).toBe(1);
  expect(Object.keys(data).sort()).toEqual(['active', 'locations', 'packages', 'prerequisites', 'routes', 'schema_version']);
  expect(Object.keys(data.routes).sort()).toEqual(['herdr', 'native', 'skill']);
  for (const route of Object.values<any>(data.routes)) expect(Object.keys(route).sort()).toEqual(['missing', 'ready', 'warnings']);
  expect(data.active.path).toBe('~/project/.agents');
  expect(JSON.stringify(data)).not.toContain(home);
});
test('exit codes: usage 2, unreadable location 3, no route 0', () => {
  expect(ready(['--bogus']).status).toBe(2); expect(ready(['--route', 'nowhere']).status).toBe(2); expect(ready(['extra']).status).toBe(2);
  expect(ready([], { tools: ['bun'] }).status).toBe(0);
  if (process.getuid?.() !== 0) {
    mkdirSync(join(home, '.claude/skills'), { recursive: true }); chmodSync(join(home, '.claude/skills'), 0o000);
    expect(ready(['--route', 'skill']).status).toBe(3);
  }
});
test('ready works from the source layout and from an installed snapshot after the source is removed', () => {
  const result = json([], { installedScript: script, cwd: base }); expect(result.status, result.stderr).toBe(0);
  expect(result.data.active.kind).toBe('source');
  expect(result.data.active.version).toBe(JSON.parse(readFileSync(resolve(import.meta.dir, '../package.json'), 'utf8')).version);
  rmSync(source, { recursive: true });
  const snapshot = json(['--route', 'skill'], { cwd: base }); expect(snapshot.status, snapshot.stderr).toBe(0);
  expect(snapshot.data.active.kind).toBe('snapshot');
});
