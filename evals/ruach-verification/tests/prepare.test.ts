import { afterAll, beforeAll, expect, test } from 'bun:test';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { prepare } from '../prepare';
import { captureVerifier, naivePipeline } from '../support/transport';

const root = resolve(import.meta.dir, '../../..');
const support = resolve(import.meta.dir, '../support');
let temp: string, out: string, manifest: any;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name === '.git' ? [] : e.isDirectory() ? files(join(dir, e.name)).map(f => join(e.name, f)) : [e.name]);
const corpus = (name: string) => join(out, 'subject', name, 'corpus');
const text = (name: string, path: string) => readFileSync(join(corpus(name), path), 'utf8');

beforeAll(async () => {
  temp = mkdtempSync(join(tmpdir(), 'ruach-verification-'));
  out = join(temp, 'first');
  manifest = (await prepare(out)).manifest;
}, 120000);
afterAll(() => { rmSync(temp, { recursive: true, force: true }); });

test('preparation refuses an existing output path and is reproducible', async () => {
  await expect(prepare(out)).rejects.toThrow('fresh');
  const second = (await prepare(join(temp, 'second'))).manifest;
  expect(second.cases).toEqual(manifest.cases);
}, 120000);

test('the committed durable report is validated by the existing validator', () => {
  const reports = Object.values<any>(manifest.cases).flatMap(c => c.reports);
  expect(reports.length).toBe(1);
  expect(reports.filter(r => !r.valid)).toEqual([]);
});

test('subject trees hold only task and corpus; evaluator material is absent', () => {
  for (const name of Object.keys(manifest.cases)) {
    const subject = join(out, 'subject', name);
    expect(readdirSync(subject).sort()).toEqual(['corpus', 'task.md']);
    for (const file of files(subject)) {
      expect(file).not.toMatch(/rubric|expected|prepare|spec\.json/i);
      expect(readFileSync(join(subject, file), 'utf8'), file).not.toMatch(/\bgrader-only\b|\bexpected outcome\b/i);
    }
  }
  expect(existsSync(join(root, 'evals/ruach-verification/subject'))).toBe(false);
});

test('protected policy, logs and owner evidence are mode 0444 and byte-identical to the pristine copy', () => {
  for (const [name, info] of Object.entries<any>(manifest.cases)) {
    for (const [file, meta] of Object.entries<any>(info.files)) {
      const live = join(corpus(name), file), pristine = join(out, 'protected', name, 'corpus', file);
      expect(sha256(live)).toBe(meta.sha256);
      expect(sha256(pristine)).toBe(meta.sha256);
      if (/^(inputs|observations|retained|policy|logs)\//.test(file)) expect(lstatSync(live).mode & 0o777).toBe(0o444);
    }
  }
});

test('01-environment-defect-unknown keeps an environment gap, a candidate failure and an unclassified capture separate', () => {
  const m = manifest.cases['01-environment-defect-unknown'];
  expect(m.refs['refs/heads/task/prb-7-transport']).toBe(m.commit_names['cand-1']);
  const policy = text('01-environment-defect-unknown', 'policy/capabilities.md');
  expect(policy).toContain('not verified: environment');
  expect(policy).toContain('unclassified');
  const env = text('01-environment-defect-unknown', 'logs/run-env.txt');
  expect(env).toContain('0 tests executed');
  expect(env).toContain('EPERM');
  const defect = text('01-environment-defect-unknown', 'logs/run-defect.txt');
  expect(defect).toContain('assertions executed before the failure');
  const unknown = text('01-environment-defect-unknown', 'logs/run-unknown.txt');
  expect(unknown).toContain('truncated');
});

test('02-registered-retry retains matching, forbidden, mismatched, changed-candidate and second-failure captures', () => {
  const m = manifest.cases['02-registered-retry'];
  expect(m.commit_names['cand-1']).not.toBe(m.commit_names['cand-2']);
  expect(m.reports[0].path).toBe('reports/PRB-7/prior-disposition.md');
  const policy = text('02-registered-retry', 'policy/flakes.md');
  expect(policy).toContain('**one** same-state retry only');
  expect(policy).toContain('no rerun');
  const match = text('02-registered-retry', 'logs/retry-match.txt');
  expect(match).toContain(m.commit_names['cand-1']);
  expect(match).toContain('exit=0');
  expect(text('02-registered-retry', 'logs/retry-mismatch.txt')).toContain('TypeError');
  expect(text('02-registered-retry', 'logs/retry-changed-candidate.txt')).toContain(m.commit_names['cand-2']);
  expect(text('02-registered-retry', 'logs/retry-second-fail.txt')).toContain('also failed');
});

test('03-main-recurrence scopes the exemption to the worker sandbox and preserves primary recurrences', () => {
  const m = manifest.cases['03-main-recurrence'];
  expect(m.refs['refs/heads/task/prb-7-cache']).toBe(m.commit_names['cand-1']);
  const register = text('03-main-recurrence', 'policy/register.md');
  expect(register).toContain('worker sandbox only');
  expect(register).toContain('defect investigation');
  expect(text('03-main-recurrence', 'logs/main-recurrence-1.txt')).toContain('Primary supported environment');
  expect(text('03-main-recurrence', 'logs/main-recurrence-2.txt')).toContain('independent later run');
  expect(text('03-main-recurrence', 'logs/worker-isolated.txt')).toContain('Matches FLAKE-004');
});

test('04-exit-truncation records verifier, viewer and log-writer outcomes distinctly', () => {
  const c = corpus('04-exit-truncation');
  expect(readFileSync(join(c, 'logs/verifier-exit23.txt'), 'utf8')).toContain('verifier exit: 23');
  expect(readFileSync(join(c, 'logs/logwriter-failure.txt'), 'utf8')).toContain('log writer:          failed');
  expect(readFileSync(join(c, 'logs/full-pass.txt'), 'utf8')).toContain('A genuine full pass');
});

test('the transport support preserves a nonzero verifier exit beyond the displayed prefix and never reads a viewer exit as a pass', async () => {
  const verifier = join(support, 'verifier.ts');
  const log = join(temp, 'verifier.log');
  const captured = await captureVerifier([process.execPath, verifier, '--lines', '130', '--exit', '23'], log);
  expect(captured.exit).toBe(23);
  expect(captured.viewerExit).toBe(0);
  expect(captured.log.split('\n').filter(Boolean).length).toBe(130);
  expect(captured.displayed.split('\n').filter(Boolean).length).toBe(120);
  // The naive pipeline exposes the viewer's 0 while the verifier's own status is not 0.
  const naive = naivePipeline([process.execPath, verifier, '--lines', '130', '--exit', '23']);
  expect(naive.viewerExit).toBe(0);
  expect(naive.verifierExit).not.toBe(0);
  expect(naive.displayed).not.toContain('verifier line 121');
  // A genuine full pass is not underclaimed.
  const pass = await captureVerifier([process.execPath, verifier, '--lines', '130', '--exit', '0'], join(temp, 'pass.log'));
  expect(pass.exit).toBe(0);
  expect(pass.log.split('\n').filter(Boolean).length).toBe(130);
}, 30000);

test('a log-writer failure leaves the evidence incomplete instead of a pass', async () => {
  const dir = join(temp, 'not-a-file');
  mkdirSync(dir, { recursive: true });
  await expect(captureVerifier([process.execPath, join(support, 'verifier.ts'), '--lines', '5', '--exit', '0'], dir)).rejects.toThrow();
}, 30000);

test('05-invariant-split separates an unspecified-order membership contract from an explicit seeded-order contract', () => {
  const m = manifest.cases['05-invariant-split'];
  expect(m.refs['refs/heads/task/prb-7-order']).toBe(m.commit_names['cand-1']);
  const policy = text('05-invariant-split', 'policy/order.md');
  expect(policy).toContain('not contractual');
  expect(policy).toContain('explicit reproducible');
  const suite = readFileSync(join(corpus('05-invariant-split'), 'repo/tests/order.test.ts'), 'utf8');
  expect(suite).toContain("toEqual(['c', 'a', 'b'])");
  expect(suite).toContain('seeded(4, 7)');
  expect(text('05-invariant-split', 'logs/missing-member.txt')).toContain('missing a distinct input member');
  expect(text('05-invariant-split', 'logs/duplicate-member.txt')).toContain('more than once');
});
