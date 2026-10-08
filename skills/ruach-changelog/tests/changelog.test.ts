import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(import.meta.dir, '../scripts/changelog.ts');
const register = join(import.meta.dir, '../scripts/register.ts');
const roots: string[] = [];
let project = '';

function fresh(): string {
  const directory = mkdtempSync(join(tmpdir(), 'ruach-changelog-'));
  roots.push(directory);
  return directory;
}
function optIn(kinds: string[] = ['turn', 'compaction'], target = 'logs/changelog.jsonl'): void {
  mkdirSync(join(project, '.ruach'), { recursive: true });
  writeFileSync(join(project, '.ruach/changelog.json'), JSON.stringify({ target, kinds }));
}
function run(payload: unknown, args: string[] = [], env: Record<string, string> = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    cwd: tmpdir(), encoding: 'utf8', env: { PATH: process.env.PATH ?? '', HOME: fresh(), ...env },
  });
}
function lines(): Record<string, unknown>[] {
  const path = join(project, 'logs/changelog.jsonl');
  return existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
}
function stamped(entry: Record<string, unknown>): Record<string, unknown> {
  const { timestamp, ...rest } = entry;
  expect(new Date(timestamp as string).toISOString()).toBe(timestamp as string);
  return rest;
}

beforeEach(() => { project = fresh(); });
afterAll(() => { for (const r of roots) rmSync(r, { recursive: true, force: true }); });

const claudeStop = () => ({ hook_event_name: 'Stop', session_id: 's-claude', cwd: project, last_assistant_message: 'Done with A.' });
const claudeCompact = () => ({ hook_event_name: 'PostCompact', session_id: 's-claude', cwd: project, trigger: 'auto', compact_summary: 'Summary of work.' });
const codexStop = () => ({ hook_event_name: 'Stop', session_id: 's-codex', turn_id: 't-9', cwd: project, last_assistant_message: 'Codex done.' });
const codexCompact = () => ({ hook_event_name: 'PostCompact', session_id: 's-codex', cwd: project, trigger: 'manual' });
function agyStop(transcript: unknown[] | null) {
  const transcriptPath = join(project, 'agy-transcript.jsonl');
  if (transcript) writeFileSync(transcriptPath, transcript.map(e => JSON.stringify(e)).join('\n') + '\n');
  return { conversationId: 'c-1', workspacePaths: [project], transcriptPath, executionNum: 4, terminationReason: 'done', fullyIdle: true };
}

describe('normalized lines', () => {
  test('Claude Stop and PostCompact', () => {
    optIn();
    expect(run(claudeStop()).status).toBe(0);
    expect(run(claudeCompact()).status).toBe(0);
    const [a, b] = lines();
    expect(stamped(a)).toEqual({ harness: 'claude', session: 's-claude', turn: null, kind: 'turn', text: 'Done with A.' });
    expect(stamped(b)).toEqual({ harness: 'claude', session: 's-claude', turn: null, kind: 'compaction', text: 'Summary of work.' });
  });
  test('Codex Stop and PostCompact (no summary text)', () => {
    optIn();
    run(codexStop(), ['--harness', 'codex']);
    run(codexCompact(), ['--harness', 'codex']);
    const [a, b] = lines();
    expect(stamped(a)).toEqual({ harness: 'codex', session: 's-codex', turn: 't-9', kind: 'turn', text: 'Codex done.' });
    expect(stamped(b)).toEqual({ harness: 'codex', session: 's-codex', turn: null, kind: 'compaction', text: null, reason: 'harness provides no compaction text' });
  });
  test('Codex Stop is detected by its keys without a flag', () => {
    optIn();
    run(codexStop());
    expect(lines()[0].harness).toBe('codex');
  });
  test('agy Stop reads the last PLANNER_RESPONSE from the transcript', () => {
    optIn();
    const r = run(agyStop([
      { type: 'PLANNER_RESPONSE', content: 'first' }, { type: 'TOOL_CALL', content: 'x' },
      { type: 'PLANNER_RESPONSE', content: 'final answer' }, { type: 'USER_INPUT', content: 'y' },
    ]));
    expect(r.stdout).toBe('{}');
    expect(stamped(lines()[0])).toEqual({ harness: 'agy', session: 'c-1', turn: 4, kind: 'turn', text: 'final answer' });
  });
  test('agy with an unreadable transcript logs null text with a reason', () => {
    optIn();
    run(agyStop(null));
    expect(stamped(lines()[0])).toEqual({ harness: 'agy', session: 'c-1', turn: 4, kind: 'turn', text: null, reason: 'transcript unreadable' });
  });
  test('kinds not enabled are skipped', () => {
    optIn(['compaction']);
    run(claudeStop());
    expect(lines()).toEqual([]);
    run(claudeCompact());
    expect(lines().length).toBe(1);
  });
});

describe('never blocks, never writes unasked', () => {
  test('subagent payloads produce nothing', () => {
    optIn();
    run({ ...claudeStop(), agent_id: 'a-1' });
    run({ ...codexStop(), agent_id: 'a-2' });
    run({ ...agyStop([{ type: 'PLANNER_RESPONSE', content: 'z' }]), agent_id: 'a-3' });
    expect(lines()).toEqual([]);
  });
  test('project without config produces nothing, exit 0, stdout {}', () => {
    const r = run(claudeStop());
    expect(r.status).toBe(0);
    expect(r.stdout).toBe('{}');
    expect(existsSync(join(project, 'logs'))).toBe(false);
    expect(readdirSync(project)).toEqual([]);
  });
  test('malformed input and malformed config exit 0 with {} and stderr only', () => {
    optIn();
    const bad = run('not json');
    expect([bad.status, bad.stdout]).toEqual([0, '{}']);
    expect(bad.stderr.length).toBeGreaterThan(0);
    writeFileSync(join(project, '.ruach/changelog.json'), '{oops');
    const badConfig = run(claudeStop());
    expect([badConfig.status, badConfig.stdout]).toEqual([0, '{}']);
    expect(badConfig.stderr.length).toBeGreaterThan(0);
    expect(lines()).toEqual([]);
  });
  test('config without a target does nothing and reports on stderr', () => {
    writeFileSync(join(project, '.ruach-tmp'), '');
    mkdirSync(join(project, '.ruach'));
    writeFileSync(join(project, '.ruach/changelog.json'), JSON.stringify({ kinds: ['turn'] }));
    const r = run(claudeStop());
    expect([r.status, r.stdout]).toEqual([0, '{}']);
    expect(r.stderr).toContain('target');
  });
  test('--project selects the project when the payload has no cwd', () => {
    optIn();
    const { cwd, ...payload } = claudeStop();
    run(payload, ['--project', project]);
    expect(lines().length).toBe(1);
  });
});

test('concurrent appends do not interleave lines', async () => {
  optIn();
  const big = 'x'.repeat(200_000);
  const jobs = Array.from({ length: 12 }, (_, i) => new Promise<number | null>(resolve => {
    const child = spawn(process.execPath, [script], { env: { PATH: process.env.PATH ?? '', HOME: fresh() } });
    child.stdin.end(JSON.stringify({ ...claudeStop(), session_id: `s${i}`, last_assistant_message: `${i}:${big}` }));
    child.on('close', resolve);
  }));
  expect(await Promise.all(jobs)).toEqual(Array(12).fill(0));
  const parsed = lines();
  expect(parsed.length).toBe(12);
  expect(new Set(parsed.map(p => p.session)).size).toBe(12);
});

describe('registration command', () => {
  function tree(directory: string, prefix = ''): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(e =>
      e.isDirectory() ? tree(join(directory, e.name), `${prefix}${e.name}/`) : [`${prefix}${e.name}`]).sort();
  }
  test('writes exactly the two project files and nothing else', () => {
    const outside = fresh(), home = fresh();
    const r = spawnSync(process.execPath, [register, '--project', project], { cwd: outside, encoding: 'utf8', env: { PATH: process.env.PATH ?? '', HOME: home } });
    expect(r.status).toBe(0);
    expect(tree(project)).toEqual(['.agents/hooks.json', '.codex/hooks.json']);
    expect(tree(outside)).toEqual([]);
    expect(tree(home)).toEqual([]);
    const codex = JSON.parse(readFileSync(join(project, '.codex/hooks.json'), 'utf8'));
    expect(Object.keys(codex.hooks).sort()).toEqual(['PostCompact', 'Stop']);
    const command = codex.hooks.Stop[0].hooks[0].command as string;
    expect(command).toContain(script);
    expect(command).toContain(`--project ${project}`);
    expect(command).toContain('--harness codex');
    expect(codex.hooks.Stop[0].hooks[0].async).toBe(true);
    const agy = JSON.parse(readFileSync(join(project, '.agents/hooks.json'), 'utf8'));
    expect(Object.keys(agy['ruach-changelog'])).toEqual(['Stop']);
    expect(JSON.stringify(agy)).toContain('--harness agy');
  });
  test('rerun is idempotent and preserves unrelated hooks', () => {
    mkdirSync(join(project, '.codex'));
    writeFileSync(join(project, '.codex/hooks.json'), JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: 'command', command: 'echo mine' }] }] } }));
    for (let i = 0; i < 2; i++) expect(spawnSync(process.execPath, [register, '--project', project], { encoding: 'utf8' }).status).toBe(0);
    const stop = JSON.parse(readFileSync(join(project, '.codex/hooks.json'), 'utf8')).hooks.Stop;
    expect(stop.length).toBe(2);
    expect(JSON.stringify(stop)).toContain('echo mine');
  });
  test('rejects a missing project directory without writing', () => {
    const r = spawnSync(process.execPath, [register, '--project', join(project, 'nope')], { encoding: 'utf8' });
    expect(r.status).not.toBe(0);
    expect(existsSync(join(project, 'nope'))).toBe(false);
  });
});

test('Ruach plugin hook file registers async Stop and PostCompact', () => {
  const file = join(import.meta.dir, '../../../hooks/hooks.json');
  const hooks = JSON.parse(readFileSync(file, 'utf8')).hooks;
  for (const event of ['Stop', 'PostCompact']) {
    const entry = hooks[event][0].hooks[0];
    expect(entry.async).toBe(true);
    expect(entry.command).toContain('${CLAUDE_PLUGIN_ROOT}/skills/ruach-changelog/scripts/changelog.ts');
  }
});
