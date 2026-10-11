import { afterAll, beforeAll, expect, test } from 'bun:test';
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { prepare } from '../prepare';

const root = resolve(import.meta.dir, '../../..');
let temp: string, out: string, manifest: any;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const git = (repo: string, ...args: string[]) => {
  const r = Bun.spawnSync(['git', '--no-replace-objects', '-C', repo, ...args], { stdout: 'pipe', stderr: 'pipe', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' } });
  if (r.exitCode !== 0) throw new Error(r.stderr.toString());
  return r.stdout.toString().trim();
};
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name === '.git' ? [] : e.isDirectory() ? files(join(dir, e.name)).map(f => join(e.name, f)) : [e.name]);
const corpus = (name: string) => join(out, 'subject', name, 'corpus');

beforeAll(async () => {
  temp = mkdtempSync(join(tmpdir(), 'ruach-coordination-'));
  out = join(temp, 'first');
  manifest = (await prepare(out)).manifest;
}, 120000);
afterAll(() => { rmSync(temp, { recursive: true, force: true }); });

test('preparation refuses an existing output path and is reproducible', async () => {
  await expect(prepare(out)).rejects.toThrow('fresh');
  const second = (await prepare(join(temp, 'second'))).manifest;
  expect(second.cases).toEqual(manifest.cases);
}, 120000);

test('every committed handoff report passes the existing validator individually', () => {
  const reports = Object.values<any>(manifest.cases).flatMap(c => c.reports);
  expect(reports.length).toBe(9);
  expect(reports.filter(r => !r.valid)).toEqual([]);
  const validator = join(root, 'skills/ruach-handoff/scripts/validate.ts');
  const advisor = Bun.spawnSync([process.execPath, validator, join(corpus('02-ambiguity'), 'reports/advisor-labels.md')], { stdout: 'pipe' });
  expect(advisor.exitCode).toBe(0);
});

test('subject trees hold only task and corpus; evaluator material and the public specimen facts are absent', () => {
  for (const name of Object.keys(manifest.cases)) {
    const subject = join(out, 'subject', name);
    expect(readdirSync(subject).sort()).toEqual(['corpus', 'task.md']);
    for (const file of files(subject)) {
      expect(file).not.toMatch(/rubric|expected|prepare|spec\.json/i);
      const text = readFileSync(join(subject, file), 'utf8');
      expect(text, file).not.toMatch(/CSV-142|csv-142|4173|\bSol\b|\brubric\b/);
    }
  }
});

test('protected evidence is mode 0444 and byte-identical to the pristine copy; generated state stays under the output', () => {
  for (const [name, info] of Object.entries<any>(manifest.cases)) {
    for (const [file, meta] of Object.entries<any>(info.files)) {
      const live = join(corpus(name), file), pristine = join(out, 'protected', name, 'corpus', file);
      expect(sha256(live)).toBe(meta.sha256);
      expect(sha256(pristine)).toBe(meta.sha256);
      if (/^(inputs|observations|retained)\//.test(file)) expect(lstatSync(live).mode & 0o777).toBe(0o444);
    }
  }
  expect(existsSync(join(root, 'evals/ruach-coordination/subject'))).toBe(false);
});

test('01-resume realizes its source facts: liveness, partial digest, report identities, resource holder', () => {
  const c = corpus('01-resume'), repo = join(c, 'repo'), m = manifest.cases['01-resume'];
  const feed = JSON.parse(readFileSync(join(c, 'observations/feed.json'), 'utf8')), chart = JSON.parse(readFileSync(join(c, 'observations/chart.json'), 'utf8'));
  expect(feed.execution).toBe('ended');
  expect(feed.branch_head).toBe(m.refs['refs/heads/task/tide-77-feed']);
  expect(chart.execution).toBe('active');
  expect(readFileSync(join(c, 'inputs/resources.md'), 'utf8')).toContain(String(chart.holds.port));
  expect(readFileSync(join(c, 'retained/TIDE-77/manifest.md'), 'utf8')).toContain(sha256(join(c, 'retained/TIDE-77/feed.diff')));
  const record = readFileSync(join(c, 'record.md'), 'utf8');
  const blob = (ref: string, path: string) => git(repo, 'rev-parse', `${ref}:${path}`);
  const datumNow = blob('refs/heads/task/tide-77-datum', 'reports/TIDE-77/datum.md');
  const datumHandled = blob(m.commit_names['datum-report-1'], 'reports/TIDE-77/datum.md');
  expect(record).toContain(datumHandled);
  expect(datumNow).not.toBe(datumHandled);
  expect(record).toContain(blob('refs/heads/task/tide-77-docs', 'reports/TIDE-77/docs.md'));
  expect(record).not.toContain(blob('refs/heads/task/tide-77-units', 'reports/TIDE-77/units.md'));
  const before = JSON.parse(readFileSync(join(c, 'observations/reports-before-wait.json'), 'utf8')).reports.map((r: any) => r.blob).sort();
  const continuation = readFileSync(join(c, 'inputs/continuation-1.md'), 'utf8');
  for (const id of before) expect(continuation).toContain(id);
  const waitStart = Date.parse(JSON.parse(readFileSync(join(c, 'observations/wait.json'), 'utf8')).observed_at);
  for (const r of JSON.parse(readFileSync(join(c, 'observations/reports-before-wait.json'), 'utf8')).reports.slice(0, 2)) expect(Date.parse(r.committed_at)).toBeLessThan(waitStart);
});

test('01-resume recording stub prints raw facts and records intents without starting anything', () => {
  const c = corpus('01-resume');
  const status = Bun.spawnSync([process.execPath, join(c, 'app/workers.ts'), 'status'], { cwd: c, stdout: 'pipe' });
  expect(status.exitCode).toBe(0);
  expect(status.stdout.toString().trim().split('\n').map(l => JSON.parse(l).session).sort()).toEqual(['tide-chart', 'tide-feed']);
  const launch = Bun.spawnSync([process.execPath, join(c, 'app/workers.ts'), 'launch', 'WORK-X', 'probe'], { cwd: c, stdout: 'pipe' });
  expect(launch.exitCode).toBe(0);
  expect(JSON.parse(readFileSync(join(c, 'intents.jsonl'), 'utf8').trim())).toEqual({ command: 'launch', unit: 'WORK-X', note: 'probe' });
  expect(Bun.spawnSync([process.execPath, join(c, 'app/workers.ts'), 'bogus'], { cwd: c, stderr: 'pipe' }).exitCode).toBe(2);
});

test('03-authorization realizes its target topology: one target unmoved at review, one moved, one outside the grant', () => {
  const c = corpus('03-authorization'), repo = join(c, 'repo'), m = manifest.cases['03-authorization'];
  const tips = JSON.parse(readFileSync(join(c, 'observations/targets.json'), 'utf8')).branches;
  for (const [branch, sha] of Object.entries<string>(tips)) expect(m.refs[`refs/heads/${branch}`]).toBe(sha);
  const reviewed = (n: number) => git(repo, 'show', `${m.commit_names[`review-${n}`]}:reports/BADGE-9/review-${['queue', 'fonts', 'labels', 'preview', 'frames'][n - 1]}.md`).match(/reviewed_revision: (\w+)/)![1];
  const base = (n: number, target: string) => git(repo, 'merge-base', reviewed(n), tips[target]);
  expect(reviewed(1)).toBe(m.commit_names['cand-1']);
  expect(base(1, 'task/badge-integration-a')).toBe(tips['task/badge-integration-a']);
  expect(base(5, 'task/badge-integration-b')).not.toBe(tips['task/badge-integration-b']);
  expect(base(2, 'release/2.1')).toBe(tips['release/2.1']);
  expect(readFileSync(join(c, 'inputs/owner-request.md'), 'utf8')).not.toContain('release/2.1');
  expect(git(repo, 'status', '--porcelain')).toBe('');
});

test('02-ambiguity question lists use disjoint IDs and the reply sources exist', () => {
  const c = corpus('02-ambiguity');
  const ids = readdirSync(join(c, 'inputs')).filter(f => f.startsWith('questions-')).flatMap(f => [...readFileSync(join(c, 'inputs', f), 'utf8').matchAll(/^([A-Z]-\d):/gm)].map(m => m[1]));
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.length).toBe(8);
  for (const f of ['owner-reply-1', 'owner-note-1', 'owner-reply-2', 'owner-continuation', 'owner-supersede', 'owner-soundsgood']) expect(existsSync(join(c, 'inputs', f + '.md'))).toBe(true);
});
