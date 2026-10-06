import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, '../scripts/check.ts');
let root: string, skill: string;
const header = '---\nname: ruach-example\ndescription: Example skill.\n---\n\nBody\n';
function write(path: string, text: string) { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, text); }
function check() { return spawnSync(process.execPath, [join(root, 'scripts/check.ts')], { cwd: tmpdir(), encoding: 'utf8' }); }
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'ruach-check-test-')); skill = join(root, 'skills/ruach-example');
  mkdirSync(join(root, 'scripts')); copyFileSync(script, join(root, 'scripts/check.ts'));
  write(join(skill, 'SKILL.md'), header);
  for (const name of ['LICENSE', 'PROVENANCE.md']) { write(join(root, name), `Root ${name}\n`); write(join(skill, name), `Root ${name}\n`); }
  write(join(root, 'evals/ruach-example/expected/rubric.md'), 'Evaluator-only rubric\n');
});
afterEach(() => rmSync(root, { recursive: true, force: true }));
test('top-level evals pass from a foreign cwd', () => { const result = check(); expect(result.status, result.stderr).toBe(0); });
for (const relative of ['evals/cases/01/task.md', 'references/rubric.md']) test(`installed ${relative} fails`, () => {
  write(join(skill, relative), 'Evaluation material\n'); const result = check();
  expect(result.status).toBe(1); expect(result.stderr).toContain(`skills/ruach-example/${relative.split('/')[0]}`);
  rmSync(join(skill, relative.split('/')[0]), { recursive: true }); expect(check().status).toBe(0);
});
test('skill identity and description are required', () => {
  write(join(skill, 'SKILL.md'), '---\nname: wrong\n---\n\nBody\n');
  expect(check().status).toBe(1); expect(check().stderr).toContain('Invalid skill identity/description');
});
test('relative links resolve encoded filenames and anchors and ignore code and external URLs', () => {
  write(join(skill, 'notes with spaces.md'), 'Notes\n');
  write(join(skill, 'SKILL.md'), header + '[notes](notes%20with%20spaces.md#section)\n[external](https://example.invalid)\n```md\n[example](missing.md)\n```\n');
  expect(check().status).toBe(0);
  write(join(skill, 'SKILL.md'), header + '[missing](missing.md)\n');
  expect(check().status).toBe(1); expect(check().stderr).toContain('Broken target');
});
test('source symlinks are rejected and dependencies are excluded', () => {
  write(join(skill, 'node_modules/package/rubric.md'), '[missing](missing.md)\n');
  expect(check().status).toBe(0);
  symlinkSync('SKILL.md', join(skill, 'alias.md'));
  expect(check().status).toBe(1); expect(check().stderr).toContain('Symlink in source');
});
for (const name of ['LICENSE', 'PROVENANCE.md']) {
  test(`standalone skill folder must carry the root ${name}`, () => {
    unlinkSync(join(skill, name));
    let result = check(); expect(result.status).toBe(1); expect(result.stderr).toContain(`skills/ruach-example/${name}`);
    write(join(skill, name), 'Altered\n');
    result = check(); expect(result.status).toBe(1); expect(result.stderr).toContain(`skills/ruach-example/${name}`);
    write(join(skill, name), `Root ${name}\n`); expect(check().status).toBe(0);
  });
}
test('compatibility metadata must be a single bounded line', () => {
  write(join(skill, 'SKILL.md'), header.replace('Example skill.\n', 'Example skill.\ncompatibility: Requires Bun and Git on PATH.\n')); expect(check().status).toBe(0);
  write(join(skill, 'SKILL.md'), header.replace('Example skill.\n', `Example skill.\ncompatibility: ${'x'.repeat(501)}\n`));
  expect(check().status).toBe(1); expect(check().stderr).toContain('Invalid compatibility');
  write(join(skill, 'SKILL.md'), header.replace('Example skill.\n', 'Example skill.\ncompatibility:\n'));
  expect(check().status).toBe(1); expect(check().stderr).toContain('Invalid compatibility');
});
test('an executable skill must declare its Bun prerequisite early', () => {
  write(join(skill, 'package.json'), '{}\n');
  expect(check().status).toBe(1); expect(check().stderr).toContain('Executable skill must declare Bun compatibility');
  write(join(skill, 'SKILL.md'), header.replace('Example skill.\n', 'Example skill.\ncompatibility: Requires Bun.\n')); expect(check().status).toBe(0);
});
