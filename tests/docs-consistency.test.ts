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

test('delivery is a separate gated Implementer assignment everywhere, with no Merger role or integration-and-merging pairing', () => {
  const files = ['agents/coordinator.md', 'agents/implementer.md', 'skills/ruach-workflow-feature/SKILL.md', 'docs/examples/consumer-example.md', 'docs/examples/direct-compact-full.md', 'README.md'];
  for (const path of files) {
    const text = read(path);
    expect(text, path).not.toMatch(/\bMerger\b(?! role)/);
    expect(text, path).not.toMatch(/integration (and|&) merging|own integration and merg|integration Implementer merges/i);
  }
  const workflow = read('skills/ruach-workflow-feature/SKILL.md');
  expect(workflow).not.toMatch(/^description:.*independent review, merging/m);
  for (const path of ['agents/implementer.md', 'skills/ruach-workflow-feature/SKILL.md', 'docs/examples/consumer-example.md']) expect(read(path), path).toContain('delivered_revision');
  expect(read('docs/examples/consumer-example.md')).toMatch(/destination has not moved|destination.*not moved/i);
  expect(read('docs/examples/consumer-example.md')).toMatch(/authoriz/i);
  expect(read('docs/examples/direct-compact-full.md')).toMatch(/delivery Implementer|separate delivery/i);
});

test('the escalation count names where a consumer sets it', () => {
  for (const path of ['agents/coordinator.md', 'skills/ruach-workflow-feature/SKILL.md', 'README.md']) expect(read(path), path).toMatch(/assignment or (the )?consumer guidance/i);
});
