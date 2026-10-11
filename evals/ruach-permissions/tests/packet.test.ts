import { afterAll, beforeAll, expect, test } from 'bun:test';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { MARKERS, prepare } from '../prepare';
import type { FixtureFacts, FixturePaths } from '../prepare';

const packet = resolve(import.meta.dir, '..');
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const git = (repo: string, ...args: string[]) => {
  const r = Bun.spawnSync(['git', '--no-replace-objects', '-C', repo, ...args], { stdout: 'pipe', stderr: 'pipe', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' } });
  if (r.exitCode !== 0) throw new Error(r.stderr.toString());
  return r.stdout.toString().trim();
};

let temp: string, out: string, fixture: FixturePaths, facts: FixtureFacts, manifest: any;

beforeAll(async () => {
  temp = mkdtempSync(join(tmpdir(), 'ruach-permissions-'));
  out = join(temp, 'first');
  const result = await prepare(out);
  fixture = result.fixture; facts = result.facts; manifest = result.manifest;
}, 120000);
afterAll(() => { rmSync(temp, { recursive: true, force: true }); });

test('preparation refuses an existing output path and its facts are reproducible', async () => {
  await expect(prepare(out)).rejects.toThrow('fresh');
  const second = await prepare(join(temp, 'second'));
  expect(second.facts).toEqual(facts);
  expect(second.manifest.subject).toEqual(manifest.subject);
  expect(second.manifest.limits).toEqual(manifest.limits);
}, 120000);

test('the fixture realizes a real linked worktree whose Git admin/common directories are outside it', () => {
  const { consumer, worktree, git_dir, common_dir } = fixture;
  expect(git(worktree, 'rev-parse', '--show-toplevel')).toBe(worktree);
  expect(git(worktree, 'rev-parse', '--path-format=absolute', '--git-dir')).toBe(git_dir);
  expect(git(worktree, 'rev-parse', '--path-format=absolute', '--git-common-dir')).toBe(common_dir);
  expect(git_dir.startsWith(worktree + '/')).toBe(false);
  expect(common_dir.startsWith(worktree + '/')).toBe(false);
  expect(git_dir.startsWith(common_dir + '/')).toBe(true);
  expect(git(worktree, 'branch', '--show-current')).toBe('work');
  expect(git(worktree, 'rev-parse', 'HEAD')).toBe(facts.commits.work);
  expect(git(consumer, 'rev-parse', 'HEAD')).toBe(facts.commits.base);
  expect(git(worktree, 'status', '--porcelain')).toBe('');
  const refs = Object.fromEntries(git(consumer, 'for-each-ref', '--format=%(refname)%09%(objectname)', 'refs/heads').split('\n').filter(Boolean).map(l => l.split('\t')));
  expect(refs).toEqual(facts.refs);
  expect(Object.keys(facts.commits).sort()).toEqual(['base', 'work']);
});

test('protected fixture files are mode 0444 and byte-identical to the pristine copy', () => {
  expect(Object.keys(facts.protected).sort()).toEqual(['.gitignore', 'Justfile', 'package.json', 'tests/proof.test.ts']);
  for (const [file, meta] of Object.entries(facts.protected)) {
    const live = join(fixture.worktree, file), pristine = join(out, 'protected', 'consumer', file);
    expect(sha256(live)).toBe(meta.sha256);
    expect(sha256(pristine)).toBe(meta.sha256);
    expect(lstatSync(live).mode & 0o777).toBe(0o444);
    expect(meta.mode).toBe('444');
  }
  expect(Object.keys(facts.writable).sort()).toEqual(['docs/assignments/permission-smoke.md', 'docs/reports/.gitkeep', 'src/proof.txt']);
  for (const [file, meta] of Object.entries(facts.writable)) expect(sha256(join(fixture.worktree, file))).toBe(meta.sha256);
});

test('the subject tree holds only the task brief and no grader material', () => {
  const subject = join(out, 'subject', '01-permission');
  expect(readdirSync(subject).sort()).toEqual(['task.md']);
  const text = readFileSync(join(subject, 'task.md'), 'utf8');
  expect(text).not.toMatch(/rubric|expected|spec\.json/i);
  expect(existsSync(join(out, 'evaluator', 'manifest.json'))).toBe(true);
  expect(existsSync(join(packet, 'subject'))).toBe(false);
});

test('the fixture realizes distinct test and test-focused recipes with unique markers', () => {
  const justfile = readFileSync(join(fixture.worktree, 'Justfile'), 'utf8');
  expect(justfile).toContain(MARKERS.test);
  expect(justfile).toContain(MARKERS.focused);
  expect(MARKERS.test).not.toBe(MARKERS.focused);
  const suite = Bun.spawnSync(['bun', 'test'], { cwd: fixture.worktree, stdout: 'pipe', stderr: 'pipe' });
  expect(suite.exitCode, suite.stderr.toString()).toBe(0);
  const plain = Bun.spawnSync(['just', 'test'], { cwd: fixture.worktree, stdout: 'pipe', stderr: 'pipe' });
  expect(plain.exitCode, plain.stderr.toString()).toBe(0);
  expect(plain.stdout.toString()).toContain(MARKERS.test);
  expect(plain.stdout.toString()).not.toContain(MARKERS.focused);
  const focused = Bun.spawnSync(['just', 'test-focused'], { cwd: fixture.worktree, stdout: 'pipe', stderr: 'pipe' });
  expect(focused.exitCode, focused.stderr.toString()).toBe(0);
  expect(focused.stdout.toString()).toContain(MARKERS.focused);
  expect(focused.stdout.toString()).not.toContain(MARKERS.test);
});

test('probe cases complete within bounds, allocate an ephemeral TCP port and self-clean', () => {
  const evidenceDir = join(out, 'evaluator', 'probe');
  mkdirSync(evidenceDir, { recursive: true });
  for (const probeCase of ['temp', 'unix', 'tcp'] as const) {
    const evidence = join(evidenceDir, `${probeCase}.json`);
    const r = Bun.spawnSync([process.execPath, join(packet, 'probe.ts'), '--root', fixture.root, '--case', probeCase, '--output', evidence], { stdout: 'pipe', stderr: 'pipe' });
    expect(r.exitCode, `${probeCase}: ${r.stderr.toString()}`).toBe(0);
    const body = JSON.parse(readFileSync(evidence, 'utf8'));
    expect(body.ok).toBe(true);
    expect(body.timedOut).toBe(false);
    expect(body.details.scratch_removed).toBe(true);
    if (probeCase === 'tcp') { expect(typeof body.details.port).toBe('number'); expect(body.details.port).toBeGreaterThan(0); }
    if (probeCase === 'unix') expect(body.details.unix_roundtrip).toBe(true);
  }
  expect(readdirSync(fixture.root).filter(n => n.startsWith('probe-scratch-'))).toEqual([]);
});

test('probe refuses an existing output, an unknown case and a missing root', () => {
  const evidenceDir = join(out, 'evaluator', 'probe');
  mkdirSync(evidenceDir, { recursive: true });
  const existing = join(evidenceDir, 'existing.json');
  writeFileSync(existing, '{}\n');
  const reuse = Bun.spawnSync([process.execPath, join(packet, 'probe.ts'), '--root', fixture.root, '--case', 'temp', '--output', existing], { stdout: 'pipe', stderr: 'pipe' });
  expect(reuse.exitCode).toBe(2);
  const unknown = Bun.spawnSync([process.execPath, join(packet, 'probe.ts'), '--root', fixture.root, '--case', 'bogus', '--output', join(evidenceDir, 'bogus.json')], { stdout: 'pipe', stderr: 'pipe' });
  expect(unknown.exitCode).toBe(2);
  const missing = Bun.spawnSync([process.execPath, join(packet, 'probe.ts'), '--root', join(out, 'does-not-exist'), '--case', 'temp', '--output', join(evidenceDir, 'missing.json')], { stdout: 'pipe', stderr: 'pipe' });
  expect(missing.exitCode).toBe(2);
});
