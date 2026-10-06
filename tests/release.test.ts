import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

let root: string;
function json(name: string, value: unknown) { writeFileSync(join(root, name), JSON.stringify(value)); }
function run() { return spawnSync(process.execPath, [join(root, 'scripts/release-check.ts')], { cwd: tmpdir(), encoding: 'utf8' }); }
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'ruach-release-test-'));
  for (const name of ['scripts', '.claude-plugin', 'agents']) mkdirSync(join(root, name));
  copyFileSync(resolve(import.meta.dir, '../scripts/release-check.ts'), join(root, 'scripts/release-check.ts'));
  json('package.json', { version: '0.1.0' });
  json('.claude-plugin/plugin.json', { name: 'ruach', version: '0.1.0' });
  json('.claude-plugin/marketplace.json', { name: 'ruach', metadata: { version: '0.1.0' }, plugins: [{ name: 'ruach', source: './' }] });
  writeFileSync(join(root, 'CHANGELOG.md'), '# Changelog\n\n## 0.1.0 — 2026-10-04\n');
  writeFileSync(join(root, 'agents/coordinator.md'), '---\nname: coordinator\ndescription: Coordinate assigned work.\n---\n\nRole\n');
});
afterEach(() => rmSync(root, { recursive: true, force: true }));
test('matching semantic release metadata passes from a foreign cwd', () => {
  const result = run(); expect(result.status, result.stderr).toBe(0); expect(result.stdout).toContain('Release v0.1.0');
});
test('plugin version drift fails', () => {
  json('.claude-plugin/plugin.json', { name: 'ruach', version: '0.2.0' }); expect(run().status).toBe(1);
});
test('marketplace release drift fails', () => {
  json('.claude-plugin/marketplace.json', { name: 'ruach', metadata: { version: '0.2.0' }, plugins: [{ name: 'ruach', source: './' }] }); expect(run().status).toBe(1);
});
test('an unreleased package version needs a changelog entry', () => {
  writeFileSync(join(root, 'CHANGELOG.md'), '# Changelog\n'); expect(run().status).toBe(1);
});
test('invalid semantic version and native agent identity fail', () => {
  json('package.json', { version: '01.0.0' }); expect(run().status).toBe(1);
  json('package.json', { version: '0.1.0' });
  writeFileSync(join(root, 'agents/coordinator.md'), '---\nname: wrong\ndescription: Coordinate.\n---\n'); expect(run().status).toBe(1);
});
test('release requires every standalone skill folder to carry the root LICENSE and PROVENANCE', () => {
  const skill = join(root, 'skills/ruach-example'); mkdirSync(skill, { recursive: true });
  for (const name of ['LICENSE', 'PROVENANCE.md']) { writeFileSync(join(root, name), name + '\n'); writeFileSync(join(skill, name), name + '\n'); }
  expect(run().status).toBe(0);
  for (const name of ['LICENSE', 'PROVENANCE.md']) {
    writeFileSync(join(skill, name), 'different\n'); let result = run(); expect(result.status).toBe(1); expect(result.stderr).toContain(`skills/ruach-example/${name}`);
    rmSync(join(skill, name)); result = run(); expect(result.status).toBe(1); expect(result.stderr).toContain(`skills/ruach-example/${name}`);
    writeFileSync(join(skill, name), name + '\n');
  }
});
