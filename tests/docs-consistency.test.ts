import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(import.meta.dir, '..');
const read = (path: string) => readFileSync(join(repo, path), 'utf8');
const changelog030 = () => read('CHANGELOG.md').split(/^## /m).find((s) => s.startsWith('0.3.0'))!;

test('user docs describe the shipped readiness command instead of calling it planned', () => {
  for (const path of ['README.md', 'docs/operations.md', 'CHANGELOG.md']) {
    expect(read(path), path).not.toMatch(/readiness command[^.]*(is planned|planned in parallel)|planned just ready/i);
  }
  expect(read('README.md')).toContain('just ready');
  expect(read('README.md')).toContain('docs/operations.md#check-readiness');
});

test('the 0.3.0 changelog entry covers the integrated tracks accurately', () => {
  const entry = changelog030();
  expect(entry).not.toContain('delivered by another worker');
  expect(entry).not.toContain('parallel work');
  for (const word of ['ready', 'linked worktree', 'herdr worktree remove', 'rollback', 'notices', 'typecheck']) {
    expect(entry.toLowerCase(), word).toContain(word.toLowerCase());
  }
});

test('operations guide documents recovery and linked-worktree cleanup', () => {
  const ops = read('docs/operations.md');
  expect(ops).toContain('.ruach-staging');
  expect(ops).toContain('herdr worktree remove --workspace');
  expect(read('README.md')).toContain('linked worktree');
});

test('roadmap numbers linked worktrees A7 and hardening A8', () => {
  const roadmap = read('docs/roadmap.md');
  expect(roadmap).toMatch(/\| A7 \| Herdr-linked worktrees/);
  expect(roadmap).toMatch(/\| A8 \| Hardening and notices/);
});
