import { afterEach, beforeEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { parse } from 'yaml';
import { closeTerminal } from './fixtures/terminal-client';

const worker = resolve(import.meta.dir, '../scripts/worker.ts');
const fake = join(import.meta.dir, 'fixtures/fake-cli.ts');
const git = Bun.which('git')!;
const model = 'gemini-3.8-flash-medium';
const roleBody = "Investigate only the assigned evidence. Literal ü ' \" `text` $value remains data.";
const role = `---\nname: scout\ndescription: Fixture role\n---\n\n${roleBody}\n`;
let root: string, repo: string, home: string, resources: string, temporary: string, bin: string;
let behavior: Record<string, unknown>;

function command(args: string[]) {
  const result = Bun.spawnSync([git, '-C', repo, ...args]);
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}
async function skill(path: string, name: string) {
  await mkdir(path, { recursive: true });
  await writeFile(join(path, 'SKILL.md'), `---\nname: ${name}\ndescription: Fixture technical context\n---\nUnchanged fixture skill.\n`);
}
async function records(name: string) {
  const text = await readFile(join(root, name), 'utf8').catch(() => '');
  return text.trim() ? text.trim().split('\n').map(line => JSON.parse(line)) : [];
}
async function launch(action = 'start', extra: string[] = [], roleName = 'scout', environment: Record<string, string> = {}) {
  await writeFile(join(root, 'behavior.json'), JSON.stringify(behavior));
  const placement = extra.includes('--placement') ? [] : ['--placement', 'pane'];
  const process = Bun.spawn([
    globalThis.process.execPath, worker, action, '--name', 'advisory', '--role', roleName,
    '--cwd', repo, '--repo', repo, '--resources', resources, '--kind', 'agy', '--model', model,
    '--temp-dir', temporary, ...placement, ...extra,
  ], {
    cwd: root,
    env: {
      ...globalThis.process.env,
      HOME: home, PATH: bin, FIXTURE_ROOT: root,
      HERDR_ENV: '1', HERDR_PANE_ID: 'w1:p1', HERDR_WORKSPACE_ID: '',
      ...environment,
    },
    stdout: 'pipe', stderr: 'pipe',
  });
  const [stdout, stderr, exit] = await Promise.all([
    new Response(process.stdout).text(), new Response(process.stderr).text(), process.exited,
  ]);
  return { stdout, stderr, exit, result: JSON.parse(stdout) };
}
async function noMutation() {
  expect(await records('mutations.jsonl')).toEqual([]);
  expect(await readdir(temporary)).toEqual([]);
  expect(await records('native-launches.jsonl')).toEqual([]);
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ruach-agy-'));
  repo = join(root, "checkout ü ' \"");
  resources = join(root, "canonical sources ü ' \"");
  home = join(root, 'home');
  bin = join(root, 'bin');
  temporary = join(root, "private ü ' \" `literal` $(literal)");
  for (const directory of [repo, home, bin, temporary, join(resources, 'agents')]) await mkdir(directory, { recursive: true });
  await writeFile(join(resources, 'agents/scout.md'), role);
  await writeFile(join(resources, 'agents/coordinator.md'), 'Coordinator fixture body.');
  await skill(join(resources, 'skills/technical'), 'ruach-technical');
  await skill(join(resources, 'skills/workflow-alias'), 'ruach-workflow-fixture');
  await skill(join(repo, '.agents/skills/native'), 'native-existing');
  await skill(join(home, '.gemini/antigravity-cli/builtin/skills/guide'), 'antigravity-guide');
  await mkdir(join(home, '.gemini/config'), { recursive: true });
  await writeFile(join(home, '.gemini/config/config.json'), '{"fixture":"keep native config"}\n');
  await writeFile(join(repo, 'AGENTS.md'), 'Consumer authority remains active.\n');
  command(['init', '--quiet']);
  command(['add', '.']);
  command(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '--quiet', '-m', 'Fixture']);
  for (const executable of ['herdr', 'agy']) {
    await writeFile(join(bin, executable), `#!${globalThis.process.execPath}\nimport ${JSON.stringify(fake)};\n`, { mode: 0o700 });
  }
  await symlink(git, join(bin, 'git'));
  behavior = { repo, git };
});
afterEach(async () => {
  await closeTerminal(root);
  await rm(root, { recursive: true, force: true });
});

test('additive private rule/source include and technical links preserve literal argv, sources and native configuration', async () => {
  const settings = await readFile(join(home, '.gemini/config/config.json'));
  const baseline = await readFile(join(repo, 'AGENTS.md'));
  const result = await launch('start', ['--effort', 'auto']);
  expect(result.exit, result.stderr).toBe(0);
  const temp = result.result.temporary_directory;
  const native = (await records('native-launches.jsonl'))[0];
  expect(native.args).toEqual(['--model', model, '--add-dir', temp]);
  expect(native.cwd).toBe(repo);
  expect(native.configHomes.home).toBe(home);
  expect(result.result.permissions).toBe('inherit');
  expect(result.result.selection.roleHash).toBe(createHash('sha256').update(role).digest('hex'));
  const rule = await readFile(join(temp, '.agents/rules/ruach-scout.md'), 'utf8');
  const header = /^---\n([\s\S]*?)\n---/.exec(rule)![1];
  expect(parse(header).trigger).toBe('always_on');
  expect(/@\[[^\]]*\]\(([^\n]+)\)/.exec(rule)![1]).toBe(join(resources, 'agents/scout.md'));
  expect(rule).toContain(JSON.stringify(join(resources, 'skills')));
  expect(rule).toContain(JSON.stringify(join(resources, 'agents')));
  expect(rule).not.toContain(roleBody);
  expect(await readdir(join(temp, '.agents/skills'))).toEqual(['ruach-technical']);
  expect(await realpath(join(temp, '.agents/skills/ruach-technical'))).toBe(join(resources, 'skills/technical'));
  expect(result.result.hidden_workflows).toEqual([]);
  expect(await readFile(join(home, '.gemini/config/config.json'))).toEqual(settings);
  expect(await readFile(join(repo, 'AGENTS.md'))).toEqual(baseline);
  expect(await readFile(join(resources, 'agents/scout.md'), 'utf8')).toBe(role);
  expect((await stat(temp)).mode & 0o777).toBe(0o700);
  expect((await stat(join(temp, '.agents/rules/ruach-scout.md'))).mode & 0o777).toBe(0o600);
  expect(result.stdout + result.stderr).not.toContain(roleBody);
  expect(result.stdout).not.toContain(temporary);
  expect((await records('mutations.jsonl')).map(item => item.action)).toEqual(['split', 'start']);
});

test('resolve, dry-run and start agree on exact selection without eager material or task submission', async () => {
  for (const [action, extra] of [['resolve', []], ['start', ['--dry-run']]] as const) {
    const result = await launch(action, [...extra]);
    expect(result.exit, result.stderr).toBe(0);
    expect(result.result.argv).toEqual(['--model', model, '--add-dir', '<private-temp>']);
    expect(result.result.permissions).toBe('inherit');
    await noMutation();
  }
  const result = await launch();
  expect(result.exit).toBe(0);
  expect((await records('native-launches.jsonl'))[0].args[1]).toBe(model);
});

test('Coordinator and auto-review fail before native inspection or mutation', async () => {
  const coordinator = await launch('start', [], 'coordinator');
  expect(coordinator.exit).toBe(2);
  expect(coordinator.result.diagnostics[0].code).toBe('unsupported_role');
  const policy = await launch('start', ['--permissions', 'auto-review']);
  expect(policy.exit).toBe(3);
  expect(policy.result.diagnostics[0].code).toBe('unsupported_permissions');
  expect((await records('calls.jsonl')).filter(call => call.exe === 'agy')).toEqual([]);
  await noMutation();
});
test('missing Agy executable remains an unavailable prerequisite', async () => {
  await rm(join(bin, 'agy'));
  const result = await launch();
  expect(result.exit).toBe(3);
  expect(result.result.diagnostics[0].code).toBe('missing_cli');
  await noMutation();
});
test('unrepresentable canonical include path stays held before mutation', async () => {
  const unsupported = join(root, 'canonical (unverified include grammar)');
  await cp(resources, unsupported, { recursive: true });
  resources = unsupported;
  const result = await launch();
  expect(result.exit).toBe(3);
  expect(result.result.diagnostics[0].code).toBe('unsupported_role_path');
  await noMutation();
});

for (const effort of ['none', 'low', 'medium', 'high']) test(`separate effort ${effort} is not inferred from native slug`, async () => {
  const result = await launch('start', ['--effort', effort]);
  expect(result.exit).toBe(2);
  expect(result.result.diagnostics[0].code).toBe('unsupported_effort');
  await noMutation();
});
for (const args of [['--agent', 'replacement'], ['--print', 'task'], ['--add-dir', 'other'], ['--mode', 'auto']]) {
  test(`unsupported native pass-through is held: ${args[0]}`, async () => {
    const result = await launch('start', ['--', ...args]);
    expect(result.exit).toBe(2);
    expect(result.result.diagnostics[0].code).toBe('conflicting_native_argument');
    await noMutation();
  });
}
for (const behaviorChange of [
  { agyVersion: '1.4.6' }, { agyVersion: '1.4.8' }, { agyMissingFlag: true },
  { agyModels: [model + '-other'] }, { agyCatalogFailure: true, leak: 'private native catalog detail' },
]) test(`native capability failure stays before mutation: ${JSON.stringify(behaviorChange)}`, async () => {
  Object.assign(behavior, behaviorChange);
  const result = await launch();
  expect(result.exit).toBe(3);
  expect(result.stdout + result.stderr).not.toContain('private native catalog detail');
  await noMutation();
});

test('expanded oversized roles and nested include uncertainty are held without shortening', async () => {
  for (const [body, exit, code] of [
    ['x'.repeat(25000), 2, 'role_too_large'],
    ['@[Nested](other.md)', 3, 'unsupported_role_include'],
  ] as const) {
    await writeFile(join(resources, 'agents/scout.md'), body);
    const result = await launch();
    expect(result.exit).toBe(exit);
    expect(result.result.diagnostics[0].code).toBe(code);
    expect(await readFile(join(resources, 'agents/scout.md'), 'utf8')).toBe(body);
    await noMutation();
  }
});
test('valid large role stays a canonical source reference', async () => {
  await writeFile(join(resources, 'agents/scout.md'), 'Canonical large role.\n'.repeat(800));
  const result = await launch();
  expect(result.exit, result.stderr).toBe(0);
  expect((await records('native-launches.jsonl'))[0].args).toHaveLength(4);
});
test('different same-name native skill is held, shared canonical realpath is retained', async () => {
  await skill(join(repo, '.agents/skills/conflict'), 'ruach-technical');
  const conflict = await launch();
  expect(conflict.exit).toBe(2);
  expect(conflict.result.diagnostics[0].code).toBe('skill_conflict');
  await noMutation();
  await rm(join(repo, '.agents/skills/conflict'), { recursive: true });
  await symlink(join(resources, 'skills/technical'), join(repo, '.agents/skills/shared'), 'dir');
  expect((await launch()).exit).toBe(0);
});
test('duplicate canonical skill names fail before materialization', async () => {
  await skill(join(resources, 'skills/duplicate'), 'ruach-technical');
  const result = await launch();
  expect(result.exit).toBe(2);
  expect(result.result.diagnostics[0].code).toBe('duplicate_skill');
  await noMutation();
});

test('linked startup repeats native preparation in the actual checkout and retains sources', async () => {
  const result = await launch('start', ['--placement', 'worktree'], 'scout', { HERDR_WORKSPACE_ID: 'w1' });
  expect(result.exit, result.stderr).toBe(0);
  expect(result.result.worktree_mode).toBe('linked');
  const target = result.result.worktree.cwd;
  expect((await records('calls.jsonl')).filter(call => call.exe === 'agy' && call.args[0] === 'models').map(call => call.cwd)).toEqual([repo, target]);
  expect((await records('native-launches.jsonl'))[0].cwd).toBe(target);
  expect(result.result.selection.roleFile).toBe(join(resources, 'agents/scout.md'));
  expect(await readFile(join(target, 'AGENTS.md'), 'utf8')).toBe('Consumer authority remains active.\n');
});
test('second-cwd conflict retains the created checkout without a launch-space start', async () => {
  behavior.agySecondCwdConflict = true;
  const result = await launch('start', ['--placement', 'worktree']);
  expect(result.exit).toBe(4);
  expect(result.result.diagnostics[0].code).toBe('skill_conflict');
  expect(result.result.worktree_state).toBe('created');
  expect(result.result.submission_state).toBe('not-submitted');
  expect(await records('mutations.jsonl')).toEqual([]);
  expect(await readdir(temporary)).toEqual([]);
});
for (const fault of ['startFailure', 'splitFailure', 'startBlocked']) {
  test(`private additive material survives uncertain or blocked startup: ${fault}`, async () => {
    behavior[fault] = true;
    behavior.inspectPane = 'w1:p2';
    behavior.inspectKind = 'agy';
    const result = await launch();
    expect(result.exit).toBe(fault === 'startBlocked' ? 0 : 4);
    expect(result.result.submission_state).toBe(fault === 'startBlocked' ? 'awaiting-input' : 'unknown');
    expect(await Bun.file(join(result.result.temporary_directory, '.agents/rules/ruach-scout.md')).exists()).toBe(true);
    expect((await records('mutations.jsonl')).filter(item => item.action === 'start')).toHaveLength(fault === 'splitFailure' ? 0 : 1);
  });
}
