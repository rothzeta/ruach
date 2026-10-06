import { expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');

test('sources and tests typecheck under the pinned compiler', () => {
  const result = spawnSync(process.execPath, ['run', 'typecheck'], { cwd: root, encoding: 'utf8' });
  expect(result.stdout + result.stderr).not.toMatch(/error TS/);
  expect(result.status).toBe(0);
}, 120000);
