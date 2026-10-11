import { afterEach, beforeEach, expect, test } from 'bun:test';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { check } from '../scripts/check';
import { fixtureGit, git, listFiles, packet, run, sourceRoot } from '../scripts/lib';
import { offlineInstall } from '../scripts/offline-install';
import { prepare } from '../scripts/prepare';
import { probe } from '../scripts/probe';

const MARKER = 'RUACH_SMOKE_ANSWER_MARKER_7f3a1c';
let temp: string;
beforeEach(() => { temp = mkdtempSync(join(tmpdir(), 'ruach-smoke-packet-')); });
afterEach(() => { try { chmodSync(join(temp, 'sealed'), 0o755); } catch {} rmSync(temp, { recursive: true, force: true }); });
const bun = process.execPath;

test('subject-visible files contain neither the answer marker nor the solved disposition', () => {
  const visible = [...listFiles(join(packet, 'fixture')).map(f => join(packet, 'fixture', f)), ...listFiles(join(packet, 'briefs')).map(f => join(packet, 'briefs', f))];
  for (const file of visible) {
    const text = readFileSync(file, 'utf8');
    expect(text, file).not.toContain(MARKER);
    expect(text, file).not.toMatch(/<=|off-by-one|exclusive upper|upper bound is/i);
  }
  const unassisted = readFileSync(join(packet, 'briefs', 'unassisted.md'), 'utf8');
  expect(unassisted).not.toMatch(/ruach|implementer|skill|route|install/i);
  expect(readFileSync(join(packet, 'briefs', 'assisted.md'), 'utf8')).toMatch(/Implementer/);
});

test('the prepared base fails its original tests, and prepare refuses an existing path', async () => {
  const out = join(temp, 'base');
  const prepared = await prepare(out);
  const tests = await run([bun, 'test', '--timeout', '30000'], prepared.consumer, undefined, 60000);
  expect(tests.exit).not.toBe(0);
  expect(tests.stderr).toMatch(/\bfail\b/);
  expect(await git(prepared.consumer, ['status', '--porcelain'])).toBe('');
  expect(existsSync(join(prepared.evidence, 'config.json'))).toBe(true);
  expect(prepared.consumer.startsWith(prepared.evidence)).toBe(false);
  await expect(prepare(out)).rejects.toThrow('fresh');
});

test('the corrected control passes the checker and scope; a second run needs a new tag', async () => {
  const prepared = await prepare(join(temp, 'control'), { control: true });
  expect(prepared.candidate).not.toBe(prepared.base);
  const result = await check(join(temp, 'control'), undefined, 'one');
  expect(result.acceptance.exit, JSON.stringify(result.acceptance.result?.diagnostics)).toBe(0);
  expect(result.scope.exit, JSON.stringify(result.scope.result)).toBe(0);
  expect(result.acceptance.result.checks.map((c: any) => c.status)).toEqual(['passed', 'passed', 'passed']);
  expect(result.acceptance.result.declared_route.model_use_verified).toBe(false);
  expect(existsSync(result.acceptance.output)).toBe(true);
  await expect(check(join(temp, 'control'), undefined, 'one')).rejects.toThrow('exists');
});

test('the unfixed base fails acceptance, and a protected test edit fails scope', async () => {
  const prepared = await prepare(join(temp, 'base'));
  const base = await check(join(temp, 'base'), undefined, 'base', { allowBase: true });
  expect(base.acceptance.exit).toBe(1);
  expect(base.acceptance.result.checks.map((c: any) => c.status)).toEqual(['failed', 'failed', 'failed']);

  const tampered = await prepare(join(temp, 'tampered'), { control: true });
  writeFileSync(join(tampered.consumer, 'tests', 'range.test.ts'), '// weakened\n');
  await fixtureGit(tampered.consumer, ['add', '-A']);
  await fixtureGit(tampered.consumer, ['commit', '--quiet', '-m', 'Weaken tests']);
  const scope = await check(join(temp, 'tampered'), undefined, 'scope'); // no manifest edit: the candidate is resolved from the checked-out branch
  expect(scope.scope.exit).toBe(1);
  expect(JSON.stringify(scope.scope.result.protected_changes)).toContain('tests/range.test.ts');
});

test('probe: exposed marker or missing positive read prevents an exclusion verdict; sealed marker is denied', () => {
  if (process.getuid?.() === 0) return; // permission denial cannot be demonstrated as root
  const open = join(temp, 'open'), sealed = join(temp, 'sealed'), task = join(temp, 'task.md');
  mkdirSync(open); mkdirSync(sealed);
  writeFileSync(join(open, 'answer.ts'), `// ${MARKER}\n`); writeFileSync(join(sealed, 'answer.ts'), `// ${MARKER}\n`); writeFileSync(task, 'raw task\n');
  symlinkSync(open, join(temp, 'alias'));
  const digest = new Bun.CryptoHasher('sha256').update('raw task\n').digest('hex');
  const positive = [{ path: task, sha256: digest }];

  const exposed = probe({ marker: MARKER, negative: [join(open, 'answer.ts')], positive, inventory_roots: [join(temp, 'alias')] });
  expect(exposed.verdict).toBe('non-blind-or-unverified');
  expect(exposed.negative[0].state).toBe('exposed');
  expect(exposed.inventory.marker_paths).toContain(resolve(open, 'answer.ts'));

  chmodSync(sealed, 0o000);
  const denied = probe({ marker: MARKER, negative: [join(sealed, 'answer.ts')], positive, inventory_roots: [sealed] });
  expect(denied.negative[0].state).toBe('denied');
  expect(denied.verdict).toBe('exclusion-evidenced-for-this-boundary-only');

  const wrongBytes = probe({ marker: MARKER, negative: [join(sealed, 'answer.ts')], positive: [{ path: task, sha256: '0'.repeat(64) }] });
  expect(wrongBytes.verdict).toBe('non-blind-or-unverified');
  const noControls = probe({ marker: MARKER, negative: [], positive: [] });
  expect(noControls.verdict).toBe('non-blind-or-unverified');
});

test('offline install uses an explicit existing revision and isolated child roots, not the caller config', async () => {
  const head = await git(sourceRoot, ['rev-parse', 'HEAD']);
  const before = process.env.HOME;
  const report = await offlineInstall({ source: sourceRoot, work: join(temp, 'install'), revision: head, label: 'current-head' });
  expect(process.env.HOME).toBe(before);
  expect(report.source_revision).toBe(head);
  expect(report.steps.map(s => [s.name, s.exit]), JSON.stringify(report.outputs)).toEqual([['install', 0], ['check', 0], ['frozen-deps:ruach-handoff', 0], ['frozen-deps:ruach-herdr', 0], ['ready', 0]]);
  expect(report.ok).toBe(true);
  expect(report.final_candidate_evidence).toBe(false);
  for (const root of [report.isolated_env.HOME, report.isolated_env.CODEX_HOME, report.isolated_env.CLAUDE_CONFIG_DIR]) expect(root.startsWith(join(temp, 'install'))).toBe(true);
  expect(JSON.parse(report.outputs.ready.stdout).routes).toBeDefined();
}, 200000);

test('the historical 0.3.0 route resolves its tag separately and is not final-candidate evidence', async () => {
  const tag = await git(sourceRoot, ['rev-parse', 'v0.3.0^{commit}']);
  const report = await offlineInstall({ source: sourceRoot, work: join(temp, 'historical'), version: '0.3.0' });
  expect(report.source_revision).toBe(tag);
  expect(report.historical_release).toBe(true);
  expect(report.final_candidate_evidence).toBe(false);
  expect(report.steps.find(s => s.name === 'install')!.exit, JSON.stringify(report.outputs.install)).toBe(0);
}, 200000);

test('the matrix names five rows plus a separate fallback and forbids live operation here', () => {
  const matrix = JSON.parse(readFileSync(join(packet, 'matrix.json'), 'utf8'));
  expect(matrix.rows.map((r: any) => r.id)).toEqual(['claude-plugin-native-agent', 'claude-snapshot-adapter', 'codex-snapshot', 'claude-skills-cli', 'codex-skills-cli', 'codex-skills-cli-fallback']);
  expect(matrix.rows.at(-1).separately_named).toBe(true);
  expect(matrix.status).toContain('no row has been run');
});

// The documented live flow: the subject commits on the checked-out branch, then the checker runs with no manifest edit.
async function subjectCommit(consumer: string, reportFrom: string) {
  copyFileSync(join(packet, 'evaluator', 'solved', 'src', 'range.ts'), join(consumer, 'src', 'range.ts'));
  copyFileSync(reportFrom, join(consumer, 'docs', 'reports', 'smoke.md'));
  await fixtureGit(consumer, ['add', '-A']);
  await fixtureGit(consumer, ['commit', '--quiet', '-m', 'Subject work']);
  return fixtureGit(consumer, ['rev-parse', 'HEAD']);
}
test('documented flow: a subject commit on the checked-out branch is the evaluated candidate', async () => {
  const reference = await prepare(join(temp, 'reference'), { control: true });
  const prepared = await prepare(join(temp, 'live'));
  const head = await subjectCommit(prepared.consumer, join(reference.consumer, 'docs', 'reports', 'smoke.md'));
  expect(head).not.toBe(prepared.base);
  const result = await check(join(temp, 'live'), undefined, 'flow');
  expect(result.acceptance.exit, JSON.stringify(result.acceptance.result?.diagnostics)).toBe(0);
  expect(result.scope.exit, JSON.stringify(result.scope.result)).toBe(0);
  expect(result.candidate).toBe(head);
  expect(result.acceptance.result.candidate_revision).toBe(head); expect(result.acceptance.result.tested_revision).toBe(head);
  expect(result.scope.result.baseline_revision).toBe(prepared.base); expect(result.scope.result.candidate_revision).toBe(head);
  expect(JSON.stringify(result.scope.result.changes)).toContain('src/range.ts');
});
test('a live check refuses a candidate equal to the base unless the base run is explicit', async () => {
  await prepare(join(temp, 'idle'));
  await expect(check(join(temp, 'idle'), undefined, 'idle')).rejects.toThrow(/equals the base/);
  expect(existsSync(join(temp, 'idle', 'results'))).toBe(true);
  expect(readFileSync(join(temp, 'idle', 'evidence', 'manifest.json'), 'utf8')).toContain('"base"');
});
test('a detached HEAD is refused rather than guessed', async () => {
  const prepared = await prepare(join(temp, 'detached'));
  await subjectCommit(prepared.consumer, join(prepared.consumer, 'docs', 'reports', '.gitkeep'));
  await fixtureGit(prepared.consumer, ['checkout', '--quiet', '--detach']);
  await expect(check(join(temp, 'detached'), undefined, 'detached')).rejects.toThrow(/checked-out branch/);
});
test('probe: an absent negative path or inventory root is unverified without evaluator confirmation', () => {
  const task = join(temp, 'task.md'); writeFileSync(task, 'raw task\n');
  const positive = [{ path: task, sha256: new Bun.CryptoHasher('sha256').update('raw task\n').digest('hex') }];
  const missing = join(temp, 'typo', 'answer.ts');
  const blind = probe({ marker: MARKER, negative: [missing], positive, inventory_roots: [join(temp, 'no-root')] });
  expect(blind.verdict).toBe('non-blind-or-unverified');
  expect(blind.reasons.join(' ')).toMatch(/absent/);
  const confirmed = probe({ marker: MARKER, negative: [missing], positive, inventory_roots: [join(temp, 'no-root')], evaluator_confirmed: [missing, join(temp, 'no-root')] });
  expect(confirmed.verdict).toBe('exclusion-evidenced-for-this-boundary-only');
});
test('fixture Git commit ignores a hostile host signing configuration', async () => {
  const home = join(temp, 'home'); mkdirSync(home);
  writeFileSync(join(home, '.gitconfig'), '[commit]\n\tgpgsign = true\n[core]\n\thooksPath = /nonexistent\n[gpg]\n\tprogram = /nonexistent-signer\n');
  const saved = process.env.HOME; process.env.HOME = home;
  try { const prepared = await prepare(join(temp, 'hermetic')); expect(prepared.base).toMatch(/^[0-9a-f]{40}$/); }
  finally { process.env.HOME = saved; }
});
