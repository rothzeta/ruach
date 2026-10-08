import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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
  test('subagent payloads produce nothing, but the same project logs a non-subagent control', () => {
    optIn();
    for (const payload of [{ ...claudeStop(), agent_id: 'a-1' }, { ...codexStop(), agent_id: 'a-2' }, { ...agyStop([{ type: 'PLANNER_RESPONSE', content: 'z' }]), agent_id: 'a-3' }]) {
      const r = run(payload);
      expect([r.status, r.stdout]).toEqual([0, '{}']);
    }
    expect(lines()).toEqual([]);
    run(claudeStop());
    expect(lines().length).toBe(1);
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


describe('target confinement', () => {
  const rejected = (r: ReturnType<typeof run>) => { expect([r.status, r.stdout]).toEqual([0, '{}']); expect(r.stderr.length).toBeGreaterThan(0); };
  test('relative escape is refused', () => {
    const outside = fresh();
    optIn(['turn'], `../${outside.split('/').pop()}/esc.jsonl`);
    rejected(run(claudeStop()));
    expect(readdirSync(outside)).toEqual([]);
  });
  test('absolute target is refused', () => {
    const outside = fresh();
    optIn(['turn'], join(outside, 'abs.jsonl'));
    rejected(run(claudeStop()));
    expect(readdirSync(outside)).toEqual([]);
  });
  test('symlinked target file is refused', () => {
    const outside = fresh();
    writeFileSync(join(outside, 'victim.txt'), 'keep\n');
    symlinkSync(join(outside, 'victim.txt'), join(project, 'log.jsonl'));
    optIn(['turn'], 'log.jsonl');
    rejected(run(claudeStop()));
    expect(readFileSync(join(outside, 'victim.txt'), 'utf8')).toBe('keep\n');
  });
  test('symlinked directory in the target path is refused', () => {
    const outside = fresh();
    symlinkSync(outside, join(project, 'linked'));
    optIn(['turn'], 'linked/sub/log.jsonl');
    rejected(run(claudeStop()));
    expect(readdirSync(outside)).toEqual([]);
  });
  test('a nested relative target inside the project still works', () => {
    optIn(['turn'], 'a/b/c.jsonl');
    expect(run(claudeStop()).stderr).toBe('');
    expect(readFileSync(join(project, 'a/b/c.jsonl'), 'utf8').length).toBeGreaterThan(0);
  });
});

describe('project root and appending', () => {
  test('Claude prefers CLAUDE_PROJECT_DIR over a moved cwd', () => {
    optIn();
    mkdirSync(join(project, 'sub'));
    run({ ...claudeStop(), cwd: join(project, 'sub') }, [], { CLAUDE_PROJECT_DIR: project });
    expect(lines().length).toBe(1);
  });
  test('an empty --project falls back to the payload cwd', () => {
    optIn();
    run(claudeStop(), ['--project', '']);
    expect(lines().length).toBe(1);
  });
  test('no lock file is created and a leftover one never blocks or is removed', () => {
    optIn();
    mkdirSync(join(project, 'logs'));
    const lock = join(project, 'logs/changelog.jsonl.lock');
    writeFileSync(lock, '');
    const r = run(claudeStop());
    expect([r.status, r.stdout, r.stderr]).toEqual([0, '{}', '']);
    expect(lines().length).toBe(1);
    expect(readdirSync(join(project, 'logs')).sort()).toEqual(['changelog.jsonl', 'changelog.jsonl.lock']);
  });
  test('appends to existing content without rewriting it', () => {
    optIn();
    mkdirSync(join(project, 'logs'));
    writeFileSync(join(project, 'logs/changelog.jsonl'), '{"old":1}\n');
    run(claudeStop());
    const raw = readFileSync(join(project, 'logs/changelog.jsonl'), 'utf8').split('\n');
    expect(raw[0]).toBe('{"old":1}');
    expect(raw.length).toBe(3);
  });
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
    expect(command).toContain(`'${script}'`);
    expect(command).toContain(`--project '${project}'`);
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
  test('quotes paths with spaces and the written command really runs', () => {
    const spaced = join(fresh(), 'my repo');
    mkdirSync(spaced);
    expect(spawnSync(process.execPath, [register, '--project', spaced], { encoding: 'utf8' }).status).toBe(0);
    mkdirSync(join(spaced, '.ruach'));
    writeFileSync(join(spaced, '.ruach/changelog.json'), JSON.stringify({ target: 'log.jsonl', kinds: ['turn'] }));
    const command = JSON.parse(readFileSync(join(spaced, '.codex/hooks.json'), 'utf8')).hooks.Stop[0].hooks[0].command as string;
    const r = spawnSync('sh', ['-c', command], { input: JSON.stringify({ hook_event_name: 'Stop', session_id: 'q', turn_id: 't', last_assistant_message: 'hi' }), encoding: 'utf8', cwd: tmpdir() });
    expect([r.status, r.stdout]).toEqual([0, '{}']);
    expect(readFileSync(join(spaced, 'log.jsonl'), 'utf8')).toContain('"hi"');
  });
  test('running from another copy replaces rather than duplicates own entries', () => {
    const copy = join(fresh(), 'skills/ruach-changelog/scripts');
    mkdirSync(copy, { recursive: true });
    writeFileSync(join(copy, 'register.ts'), readFileSync(register, 'utf8'));
    writeFileSync(join(copy, 'changelog.ts'), readFileSync(script, 'utf8'));
    for (const r of [register, join(copy, 'register.ts')]) expect(spawnSync(process.execPath, [r, '--project', project], { encoding: 'utf8' }).status).toBe(0);
    const codex = JSON.parse(readFileSync(join(project, '.codex/hooks.json'), 'utf8'));
    expect(codex.hooks.Stop.length).toBe(1);
    expect(codex.hooks.Stop[0].hooks[0].command).toContain(join(copy, 'changelog.ts'));
  });
  test('merges with an existing agy hooks.json', () => {
    mkdirSync(join(project, '.agents'));
    writeFileSync(join(project, '.agents/hooks.json'), JSON.stringify({ other: { Stop: [{ type: 'command', command: 'echo x' }] } }));
    expect(spawnSync(process.execPath, [register, '--project', project], { encoding: 'utf8' }).status).toBe(0);
    const agy = JSON.parse(readFileSync(join(project, '.agents/hooks.json'), 'utf8'));
    expect(Object.keys(agy).sort()).toEqual(['other', 'ruach-changelog']);
    expect(agy.other.Stop[0].command).toBe('echo x');
  });
  test('a non-array event value is a clear error (exit 2) and writes nothing', () => {
    mkdirSync(join(project, '.codex'));
    writeFileSync(join(project, '.codex/hooks.json'), JSON.stringify({ hooks: { Stop: 'nope' } }));
    const r = spawnSync(process.execPath, [register, '--project', project], { encoding: 'utf8' });
    expect(r.status).toBe(2);
    expect(r.stderr).not.toContain('TypeError');
    expect(existsSync(join(project, '.agents'))).toBe(false);
  });
  test('rejects a missing project directory without writing', () => {
    const r = spawnSync(process.execPath, [register, '--project', join(project, 'nope')], { encoding: 'utf8' });
    expect(r.status).not.toBe(0);
    expect(existsSync(join(project, 'nope'))).toBe(false);
  });
});

test('Ruach plugin hook file registers async Stop and PostCompact with the project dir and a bun guard', () => {
  const file = join(import.meta.dir, '../../../hooks/hooks.json');
  const hooks = JSON.parse(readFileSync(file, 'utf8')).hooks;
  for (const event of ['Stop', 'PostCompact']) {
    const entry = hooks[event][0].hooks[0];
    expect(entry.async).toBe(true);
    expect(entry.command).toBe('command -v bun >/dev/null 2>&1 || exit 0; bun "${CLAUDE_PLUGIN_ROOT}/skills/ruach-changelog/scripts/changelog.ts" --harness claude --project "${CLAUDE_PROJECT_DIR}"');
  }
});

test('plugin command exits 0 silently when bun is missing', () => {
  const entry = JSON.parse(readFileSync(join(import.meta.dir, '../../../hooks/hooks.json'), 'utf8')).hooks.Stop[0].hooks[0];
  const r = spawnSync('/bin/sh', ['-c', entry.command], { input: '{}', encoding: 'utf8', env: { PATH: '/nonexistent' } });
  expect([r.status, r.stdout, r.stderr]).toEqual([0, '', '']);
});
