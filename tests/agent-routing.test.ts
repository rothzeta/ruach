import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const source = resolve(import.meta.dir, '..'), script = join(source, 'scripts/agent-routing.ts');
let fixture: string, wrapper: string;
beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'ruach-routing with spaces-'));
  mkdirSync(join(fixture, 'scripts'));
  mkdirSync(join(fixture, 'skills/ruach-herdr/scripts'), { recursive: true });
  wrapper = join(fixture, 'scripts/agent-routing.ts'); copyFileSync(script, wrapper);
  writeFileSync(join(fixture, 'skills/ruach-herdr/scripts/worker.ts'), `
import { appendFileSync } from 'node:fs';
appendFileSync(${JSON.stringify(join(fixture, 'calls.jsonl'))}, JSON.stringify({argv:process.argv.slice(2),cwd:process.cwd()})+'\\n');
console.log('worker stdout'); console.error('worker stderr'); process.exit(Number(process.env.WORKER_EXIT ?? 0));
`);
});
afterEach(() => rmSync(fixture, { recursive: true, force: true }));
function run(args: string[], entry = wrapper, env: Record<string, string> = {}) {
  return spawnSync(process.execPath, [entry, ...args], { cwd: tmpdir(), encoding: 'utf8', env: { ...process.env, ...env } });
}
function calls() { return readFileSync(join(fixture, 'calls.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line)); }

for (const role of ['coordinator', 'architect', 'scout', 'implementer', 'reviewer', 'librarian']) test(`real source offline selection for ${role} works from a foreign cwd`, () => {
  const result = run(['resolve', role], script, { HERDR_ENV: '0', HERDR_PANE_ID: '' });
  expect(result.status, result.stderr).toBe(0);
  const data = JSON.parse(result.stdout);
  expect(data.action).toBe('resolved-offline'); expect(data.launchable).toBe(false);
  expect(data.selection.roleFile).toBe(join(source, 'agents', `${role}.md`));
  expect(data.selection.resources).toBe(source); expect(data.selection.cwd).toBe(source);
  expect(data.permissions).toBe('auto-review'); expect(data.argv).toEqual([]);
  expect(data.selection.kind).toBe(['coordinator', 'architect'].includes(role) ? 'claude' : 'codex');
});
test('offline resolution honors declared alternatives and rejects other routes', () => {
  const result = run(['resolve', 'architect', '--route', 'gpt-6.1-sol-high'], script);
  expect(result.status, result.stderr).toBe(0); expect(JSON.parse(result.stdout).selection.kind).toBe('codex');
  const invalid = run(['resolve', 'coordinator', '--route', 'gpt-6.1-sol-high'], script);
  expect(invalid.status).toBe(2); expect(JSON.parse(invalid.stdout).diagnostics[0].code).toBe('disallowed_route');
});
test('start delegates once with default name, source roots, and exact output forwarding', () => {
  const result = run(['start', 'coordinator']);
  expect(result.status).toBe(0); expect(result.stdout).toBe('worker stdout\n'); expect(result.stderr).toBe('worker stderr\n');
  expect(calls()).toEqual([{ cwd: fixture, argv: ['start', '--role', 'coordinator', '--name', 'ruach-coordinator',
    '--repo', fixture, '--cwd', fixture, '--resources', fixture, '--catalogs', join(fixture, 'config/agent-routing'), '--permissions', 'auto-review'] }]);
});
test('external worktree selects policy and cwd while source code and resources remain canonical', () => {
  const worktree = join(fixture, 'external checkout'); mkdirSync(worktree);
  const result = run(['start', 'architect', 'designer', '--root', worktree, '--route', 'chosen', '--dry-run', '--permissions', 'inherit']);
  expect(result.status).toBe(0); expect(calls()).toEqual([{ cwd: worktree,
    argv: ['start', '--role', 'architect', '--name', 'designer', '--repo', worktree, '--cwd', worktree,
      '--resources', fixture, '--catalogs', join(worktree, 'config/agent-routing'), '--permissions', 'inherit', '--dry-run', '--route', 'chosen'] }]);
});
for (const code of [2, 3, 4]) test(`worker exit ${code} is preserved without retry`, () => {
  expect(run(['start', 'reviewer', 'reviewer-a'], wrapper, { WORKER_EXIT: String(code) }).status).toBe(code);
  expect(calls()).toHaveLength(1);
});
test('invalid arguments do not invoke the worker', () => {
  for (const args of [[], ['start'], ['start', '../coordinator'], ['start', 'coordinator', '--permissions', 'bypass'],
    ['resolve', 'coordinator', 'extra'], ['resolve', 'coordinator', '--dry-run'], ['start', 'coordinator', '--unknown']]) {
    expect(run(args).status).toBe(2);
  }
  expect(existsSync(join(fixture, 'calls.jsonl'))).toBe(false);
});
