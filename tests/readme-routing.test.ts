import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dir, '..');
let consumer: string;
function resolveRoute(role: string, route: string) {
  return spawnSync(process.execPath, [join(repo, 'skills/ruach-herdr/scripts/worker.ts'), 'resolve', '--offline', '--name', 'doc-check', '--role', role, '--route', route, '--cwd', consumer], { cwd: tmpdir(), encoding: 'utf8' });
}
beforeEach(() => {
  consumer = mkdtempSync(join(tmpdir(), 'ruach-readme-routing-')); mkdirSync(join(consumer, '.agents/agents'), { recursive: true });
  spawnSync('git', ['init', '-q'], { cwd: consumer });
  const example = /```yaml\n(# \.agents\/models\.yaml[\s\S]*?)```/.exec(readFileSync(join(repo, 'README.md'), 'utf8'))![1];
  for (const m of example.matchAll(/# \.agents\/(\w+)\.yaml\n([\s\S]*?)(?=# \.agents\/|$)/g)) writeFileSync(join(consumer, `.agents/${m[1]}.yaml`), m[2]);
  for (const role of ['coordinator', 'implementer', 'reviewer']) copyFileSync(join(repo, `agents/${role}.md`), join(consumer, `.agents/agents/${role}.md`));
});
afterEach(() => rmSync(consumer, { recursive: true, force: true }));
test('the README "Choose your models" catalogs are valid and alternatives are explicit-only', () => {
  expect(resolveRoute('implementer', 'sonnet-medium').status).toBe(0);
  expect(resolveRoute('implementer', 'codex-high').status).toBe(0);
  const undeclared = resolveRoute('implementer', 'opus-high');
  expect(undeclared.status).not.toBe(0); expect(undeclared.stdout).toContain('disallowed_route');
});
