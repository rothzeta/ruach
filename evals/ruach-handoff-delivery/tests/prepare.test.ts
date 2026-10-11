import { afterAll, beforeAll, expect, test } from 'bun:test';
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { prepare } from '../prepare';

const root = resolve(import.meta.dir, '../../..');
let temp: string, out: string, manifest: any;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const gitEnv = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' } as Record<string, string>;
const git = (repo: string, ...args: string[]) => {
  const r = Bun.spawnSync(['git', '--no-replace-objects', '-C', repo, ...args], { stdout: 'pipe', stderr: 'pipe', env: gitEnv });
  if (r.exitCode !== 0) throw new Error(r.stderr.toString());
  return r.stdout.toString().trim();
};
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name === '.git' ? [] : e.isDirectory() ? files(join(dir, e.name)).map(f => join(e.name, f)) : [e.name]);
const corpus = (name: string) => join(out, 'subject', name, 'corpus');
const report = (repo: string, ref: string, path: string) => git(repo, 'show', `${ref}:${path}`);

beforeAll(async () => {
  temp = mkdtempSync(join(tmpdir(), 'ruach-handoff-delivery-'));
  out = join(temp, 'first');
  manifest = (await prepare(out)).manifest;
}, 120000);
afterAll(() => { rmSync(temp, { recursive: true, force: true }); });

test('preparation refuses an existing output path and is reproducible', async () => {
  await expect(prepare(out)).rejects.toThrow('fresh');
  const second = (await prepare(join(temp, 'second'))).manifest;
  expect(second.cases).toEqual(manifest.cases);
}, 120000);

test('every committed handoff report is validated and only the tree-object report is invalid', () => {
  const reports = Object.values<any>(manifest.cases).flatMap(c => c.reports);
  expect(reports.length).toBe(13);
  expect(reports.filter(r => !r.valid).map((r: any) => r.commit)).toEqual(['export-bad']);
});

test('subject trees hold only task and corpus; evaluator material is absent', () => {
  for (const name of Object.keys(manifest.cases)) {
    const subject = join(out, 'subject', name);
    expect(readdirSync(subject).sort()).toEqual(['corpus', 'task.md']);
    for (const file of files(subject)) {
      expect(file).not.toMatch(/rubric|expected|prepare|spec\.json/i);
      const text = readFileSync(join(subject, file), 'utf8');
      expect(text, file).not.toMatch(/\bgrader-only\b|\bexpected outcome\b/i);
    }
  }
  expect(existsSync(join(root, 'evals/ruach-handoff-delivery/subject'))).toBe(false);
});

test('protected owner evidence is mode 0444 and byte-identical to the pristine copy', () => {
  for (const [name, info] of Object.entries<any>(manifest.cases)) {
    for (const [file, meta] of Object.entries<any>(info.files)) {
      const live = join(corpus(name), file), pristine = join(out, 'protected', name, 'corpus', file);
      expect(sha256(live)).toBe(meta.sha256);
      expect(sha256(pristine)).toBe(meta.sha256);
      if (/^(inputs|observations|retained|publications)\//.test(file)) expect(lstatSync(live).mode & 0o777).toBe(0o444);
    }
  }
});

test('01-evidence-identity separates tested, evidence-only, changed and invalid revisions', () => {
  const c = corpus('01-evidence-identity'), repo = join(c, 'repo'), m = manifest.cases['01-evidence-identity'];
  const n = m.commit_names;
  expect(m.refs['refs/heads/task/gate-12-export']).toBe(n['export-bad']);
  expect(report(repo, n['export-tested'], 'reports/GATE-12/export.md')).toContain(`tested_revision: ${n['export-impl']}`);
  // The evidence-only successor changes only a report path; no executable file moves.
  expect(git(repo, 'diff', '--name-only', n['export-reviewed'], n['export-evidence'])).toBe('reports/GATE-12/export-evidence.md');
  // The changed candidate moves an exercised executable path after the reviewed revision.
  expect(git(repo, 'diff', '--name-only', n['export-evidence'], n['export-changed-impl'])).toContain('src/export.ts');
  // Its refreshed report still claims the older tested revision, so a resolving candidate is semantically wrong.
  const changed = report(repo, n['export-changed-report'], 'reports/GATE-12/export.md');
  expect(changed).toContain(`candidate_revision: ${n['export-changed-impl']}`);
  expect(changed).toContain(`tested_revision: ${n['export-impl']}`);
  // The invalid report names an existing tree, which does not resolve to a commit.
  const bad = report(repo, n['export-bad'], 'reports/GATE-12/export-bad.md').match(/candidate_revision: (\w+)/)![1];
  expect(git(repo, 'cat-file', '-t', bad)).toBe('tree');
  expect(m.reports.find((r: any) => r.commit === 'export-bad').valid).toBe(false);
});

test('02-target-authority distinguishes unmoved, moved and unauthorized targets and forwards only the authorized one', () => {
  const c = corpus('02-target-authority'), repo = join(c, 'repo'), m = manifest.cases['02-target-authority'];
  const n = m.commit_names;
  expect(m.refs['refs/heads/task/ledger-balance']).toBe(n['int-balance-0']);
  expect(m.refs['refs/heads/task/ledger-ledger']).toBe(n['int-ledger-1']);
  expect(m.refs['refs/heads/task/ledger-reconcile']).toBe(n['int-reconcile-0']);
  expect(git(repo, 'merge-base', n['int-balance-0'], n['balance-impl'])).toBe(n['int-balance-0']);
  expect(git(repo, 'merge-base', n['ledger-impl'], n['int-ledger-1'])).not.toBe(n['int-ledger-1']);
  expect(git(repo, 'merge-base', n['int-reconcile-0'], n['reconcile-impl'])).toBe(n['int-reconcile-0']);
  const grant = readFileSync(join(c, 'inputs/owner-request.md'), 'utf8');
  expect(grant).toContain('task/ledger-balance');
  expect(grant).toContain('task/ledger-ledger');
  expect(grant).not.toContain('task/ledger-reconcile');
  // The authorized fixture action fast-forwards the unmoved target to exactly the reviewed candidate.
  mkdirSync(join(out, 'evaluator'), { recursive: true });
  const copy = join(out, 'evaluator', 'ff-checkout');
  cpSync(repo, copy, { recursive: true });
  git(copy, 'switch', '--quiet', 'task/ledger-balance');
  git(copy, 'merge', '--ff-only', n['balance-impl']);
  expect(git(copy, 'rev-parse', 'task/ledger-balance')).toBe(n['balance-impl']);
  // The moved target cannot be fast-forwarded to its stale reviewed candidate.
  git(copy, 'switch', '--quiet', 'task/ledger-ledger');
  const ff = Bun.spawnSync(['git', '-C', copy, 'merge', '--ff-only', n['ledger-impl']], { stdout: 'pipe', stderr: 'pipe', env: gitEnv });
  expect(ff.exitCode).not.toBe(0);
  expect(git(copy, 'rev-parse', 'task/ledger-ledger')).toBe(n['int-ledger-1']);
});

test('03-queue-partials realizes individual reviews, a combined review and preserved working state', () => {
  const c = corpus('03-queue-partials'), repo = join(c, 'repo'), m = manifest.cases['03-queue-partials'];
  const n = m.commit_names;
  const reviewed = (commit: string, path: string) => report(repo, n[commit], path).match(/reviewed_revision: (\w+)/)?.[1];
  expect(reviewed('unit-a-review', 'reports/PRS-9/review-captions.md')).toBe(n['unit-a-impl']);
  expect(reviewed('unit-b-review', 'reports/PRS-9/review-colors.md')).toBe(n['unit-b-impl']);
  expect(reviewed('combined-review-1', 'reports/PRS-9/review-combined.md')).toBe(n['combined-1']);
  expect(m.refs['refs/heads/task/prs-9-integration']).toBe(n['int-0']);
  expect(git(repo, 'merge-base', n['int-0'], n['combined-1'])).toBe(n['int-0']);
  const status = git(repo, 'status', '--porcelain=v1').split('\n').filter(Boolean).map(l => l.trim());
  expect(status).toContain('M docs/notes.md');
  expect(status).toContain('?? src/preview.ts');
  expect(status).toContain('?? notes/');
  // The authorized combined candidate does not touch the untracked author path; the second would overwrite it.
  expect(git(repo, 'show', '--name-only', '--format=', n['combined-1'])).not.toContain('src/preview.ts');
  expect(git(repo, 'show', '--name-only', '--format=', n['combined-2'])).toContain('src/preview.ts');
  expect(existsSync(join(c, 'retained/prs-9-checkout/note.md'))).toBe(true);
});

test('04-receipt-remote keeps local delivery and cached remote state separate', () => {
  const c = corpus('04-receipt-remote'), repo = join(c, 'repo'), m = manifest.cases['04-receipt-remote'];
  const n = m.commit_names;
  expect(m.refs['refs/heads/task/dsp-3-shipping']).toBe(n['shipping-review']);
  expect(m.refs['refs/remotes/origin/task/dsp-3-shipping']).toBe(n['base']);
  expect(git(repo, 'remote', 'get-url', 'origin')).toBe('https://git.example.test/dispatch.git');
  expect(git(repo, 'rev-parse', 'refs/remotes/origin/task/dsp-3-shipping')).not.toBe(git(repo, 'rev-parse', 'refs/heads/task/dsp-3-shipping'));
  expect(readFileSync(join(c, 'publications/local-delivery.txt'), 'utf8')).toContain('exit=0');
  expect(readFileSync(join(c, 'publications/push-failed.txt'), 'utf8')).toContain('exit=128');
});
