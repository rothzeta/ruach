import { afterAll, beforeAll, expect, test } from 'bun:test';
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

beforeAll(async () => {
  temp = mkdtempSync(join(tmpdir(), 'ruach-communication-'));
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
  expect(reports.length).toBe(5);
  expect(reports.filter(r => !r.valid)).toEqual([]);
  const validator = join(root, 'skills/ruach-handoff/scripts/validate.ts');
  const repo = join(corpus('04-report-identity'), 'repo');
  const m = manifest.cases['04-report-identity'];
  const scratch = join(temp, 'docs-evidence.md');
  writeFileSync(scratch, git(repo, 'show', `${m.commit_names['docs-evidence']}:reports/RELAY-16/docs-evidence.md`) + '\n');
  const docs = Bun.spawnSync([process.execPath, validator, scratch, '--repo', repo], { stdout: 'pipe' });
  expect(docs.exitCode, docs.stderr.toString()).toBe(0);
});

test('subject trees hold only task and corpus; evaluator material is absent', () => {
  for (const name of Object.keys(manifest.cases)) {
    const subject = join(out, 'subject', name);
    expect(readdirSync(subject).sort()).toEqual(['corpus', 'task.md']);
    for (const file of files(subject)) {
      expect(file, name).not.toMatch(/rubric|expected|prepare|spec\.json/i);
      const text = readFileSync(join(subject, file), 'utf8');
      expect(text, `${name}/${file}`).not.toMatch(/\bexpected disposition\b|\bgrader\b/i);
    }
  }
  expect(existsSync(join(root, 'evals/ruach-communication/subject'))).toBe(false);
});

test('protected evidence is mode 0444 and byte-identical to the pristine copy', () => {
  for (const [name, info] of Object.entries<any>(manifest.cases)) {
    for (const [file, meta] of Object.entries<any>(info.files)) {
      const live = join(corpus(name), file), pristine = join(out, 'protected', name, 'corpus', file);
      expect(sha256(live)).toBe(meta.sha256);
      expect(sha256(pristine)).toBe(meta.sha256);
      if (/^(inputs|observations|retained|verifier)\//.test(file)) expect(lstatSync(live).mode & 0o777).toBe(0o444);
    }
  }
});

test('01-draft-send realizes the three submission facts', () => {
  const c = corpus('01-draft-send');
  const intent = readFileSync(join(c, 'inputs/submission-intent.md'), 'utf8').trim();
  const parser = readJson(join(c, 'observations/agent-parser.json'));
  const index = readJson(join(c, 'observations/agent-index.json'));
  const sync = readJson(join(c, 'observations/agent-sync.json'));
  expect(parser.terminal.draft_text).toBe(intent);
  expect(parser.turn.prompt_submitted).toBe(false);
  expect(parser.turn.working_observed).toBe(false);
  expect(parser.terminal.history_complete).toBe(true);
  expect(index.turn.prompt_submitted).toBe(true);
  expect(index.turn.working_observed).toBe(true);
  expect(index.terminal.draft_text).toBeNull();
  expect(sync.terminal.history_complete).toBe(false);
  expect(sync.turn.prompt_submitted).toBeNull();
});

test('01-draft-send recording stub prints raw facts and records intents without starting anything', () => {
  const c = corpus('01-draft-send');
  const facts = Bun.spawnSync([process.execPath, join(c, 'app/record-state.ts'), 'facts'], { cwd: c, stdout: 'pipe' });
  expect(facts.exitCode, facts.stderr.toString()).toBe(0);
  expect(facts.stdout.toString().trim().split('\n').map(l => JSON.parse(l).session).sort()).toEqual(['relay-index', 'relay-parser', 'relay-sync']);
  const send = Bun.spawnSync([process.execPath, join(c, 'app/record-state.ts'), 'send-keys', 'relay-parser', 'finish-known-draft'], { cwd: c, stdout: 'pipe' });
  expect(send.exitCode, send.stderr.toString()).toBe(0);
  expect(JSON.parse(readFileSync(join(c, 'intents.jsonl'), 'utf8').trim())).toEqual({ command: 'send-keys', target: 'relay-parser', note: 'finish-known-draft' });
  expect(Bun.spawnSync([process.execPath, join(c, 'app/record-state.ts'), 'bogus'], { cwd: c, stderr: 'pipe' }).exitCode).toBe(2);
});

test('02-exited-active realizes ended, active and unknown process facts with retained partials', () => {
  const c = corpus('02-exited-active'), m = manifest.cases['02-exited-active'];
  const exporter = readJson(join(c, 'observations/process-export.json'));
  const importer = readJson(join(c, 'observations/process-import.json'));
  const normalizer = readJson(join(c, 'observations/process-normalize.json'));
  expect(exporter.native_exited).toBe(true);
  expect(exporter.foreground.processes).toEqual(['bash']);
  expect(exporter.branch_head).toBe(m.refs['refs/heads/task/relay-14-export']);
  expect(importer.native_exited).toBe(false);
  expect(importer.agent_status).toBe('working');
  expect(importer.branch_head).toBe(m.refs['refs/heads/task/relay-14-import']);
  expect(normalizer.native_exited).toBeNull();
  expect(normalizer.agent_status).toBe('unknown');
  expect(readFileSync(join(c, 'retained/RELAY-14/manifest.md'), 'utf8')).toContain(sha256(join(c, 'retained/RELAY-14/export.diff')));
  const repo = join(c, 'repo');
  expect(git(repo, 'rev-parse', 'task/relay-14-export')).toBe(m.refs['refs/heads/task/relay-14-export']);
  expect(git(repo, 'rev-parse', 'task/relay-14-import')).toBe(m.refs['refs/heads/task/relay-14-import']);
  expect(git(repo, 'status', '--porcelain')).toBe('');
});

test('03-startup-block realizes matching-blocked, mismatched and user-resolved facts', () => {
  const c = corpus('03-startup-block');
  const blocked = readJson(join(c, 'observations/startup-blocked.json'));
  const mismatch = readJson(join(c, 'observations/mismatch.json'));
  const continuation = readJson(join(c, 'observations/continuation.json'));
  expect(blocked.identity_match).toBe(true);
  expect(blocked.agent_status).toBe('blocked');
  expect(blocked.block.kind).toBe('trust-dialog');
  expect(blocked.interactive_ready).toBe(false);
  expect(mismatch.identity_match).toBe(false);
  expect(mismatch.observed.kind).not.toBe(mismatch.assigned.kind);
  expect(continuation.identity_match).toBe(true);
  expect(continuation.interactive_ready).toBe(true);
  expect(continuation.block).toBeNull();
  expect(continuation.assigned).toEqual(blocked.assigned);
});

test('04-report-identity realizes pre-wait, revised, handled and evidence-only report identities', () => {
  const c = corpus('04-report-identity'), repo = join(c, 'repo'), m = manifest.cases['04-report-identity'];
  const record = readFileSync(join(c, 'record.md'), 'utf8');
  const blob = (ref: string, path: string) => git(repo, 'rev-parse', `${ref}:${path}`);
  const unitsNow = blob('task/relay-16-units', 'reports/RELAY-16/units.md');
  const datumNow = blob('task/relay-16-datum', 'reports/RELAY-16/datum.md');
  const datumHandled = blob(m.commit_names['datum-report-1'], 'reports/RELAY-16/datum.md');
  const docsHandled = blob(m.commit_names['docs-report'], 'reports/RELAY-16/docs.md');
  // A complete report committed before the wait is not yet handled in the record.
  const beforeWait = readJson(join(c, 'observations/reports-before-wait.json'));
  const waitAt = Date.parse(readJson(join(c, 'observations/wait.json')).observed_at);
  const unitsRow = beforeWait.reports.find((r: any) => r.work === 'WORK-01');
  expect(unitsRow.blob).toBe(unitsNow);
  expect(Date.parse(unitsRow.committed_at)).toBeLessThan(waitAt);
  expect(record).not.toContain(unitsNow);
  // A handled report was revised to a new blocked candidate; the record still names the old identity.
  expect(record).toContain(datumHandled);
  expect(datumNow).not.toBe(datumHandled);
  expect(readJson(join(c, 'observations/reports-before-wait.json')).reports.find((r: any) => r.work === 'WORK-02').blob).toBe(datumNow);
  expect(record).toContain(docsHandled);
  // The evidence-only successor adds reports only and leaves the earlier report byte-identical.
  const evidence = m.commit_names['docs-evidence'];
  const changed = git(repo, 'show', '--name-only', '--format=', evidence).split('\n').filter(Boolean);
  expect(changed).toEqual(['reports/RELAY-16/docs-evidence.md']);
  expect(blob(evidence, 'reports/RELAY-16/docs.md')).toBe(docsHandled);
  expect(git(repo, 'status', '--porcelain')).toBe('');
});

test('05-timeout-verifier realizes timeout, idle, echoed-marker and failed-exit facts', () => {
  const c = corpus('05-timeout-verifier');
  const timeout = readJson(join(c, 'observations/prompt-timeout.json'));
  const idle = readJson(join(c, 'observations/idle-no-report.json'));
  expect(timeout.result).toBe('timeout');
  expect(timeout.agent_status_at_timeout).toBe('working');
  expect(timeout.report_seen).toBe(false);
  expect(idle.result).toBe('settled');
  expect(idle.agent_status).toBe('idle');
  expect(idle.report_seen).toBe(false);
  const marker = readJson(join(c, 'verifier/marker-run.json'));
  const echoed = marker.matches.find((m: any) => m.origin === 'echoed-input');
  const completion = marker.matches.find((m: any) => m.origin === 'completion');
  expect(echoed.artifact).toBeNull();
  expect(completion.exit).toBe(23);
  const artifact = readJson(join(c, completion.artifact));
  expect(artifact.nonce).toBe(marker.requested_marker);
  expect(artifact.exit).toBe(23);
  expect(artifact.timeout).toBe(false);
  expect(existsSync(join(c, artifact.full_log))).toBe(true);
  expect(readFileSync(join(c, artifact.full_log), 'utf8')).toContain(marker.requested_marker);
});
