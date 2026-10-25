import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  symlinkSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const source = resolve(import.meta.dir, '..'),
  script = join(source, 'scripts/agent-routing.ts');
let fixture: string, wrapper: string;
beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'ruach-routing with spaces-'));
  mkdirSync(join(fixture, 'scripts'));
  mkdirSync(join(fixture, 'skills/ruach-herdr/scripts'), { recursive: true });
  wrapper = join(fixture, 'scripts/agent-routing.ts');
  copyFileSync(script, wrapper);
  cpSync(
    join(source, 'skills/ruach-herdr/scripts'),
    join(fixture, 'skills/ruach-herdr/scripts'),
    { recursive: true },
  );
  copyFileSync(
    join(source, 'skills/ruach-herdr/package.json'),
    join(fixture, 'skills/ruach-herdr/package.json'),
  );
  symlinkSync(
    join(source, 'skills/ruach-herdr/node_modules'),
    join(fixture, 'skills/ruach-herdr/node_modules'),
  );
  cpSync(join(source, 'agents'), join(fixture, 'agents'), { recursive: true });
  cpSync(join(source, 'config'), join(fixture, 'config'), { recursive: true });
  writeFileSync(
    join(fixture, 'skills/ruach-herdr/scripts/worker.ts'),
    `
import { appendFileSync } from 'node:fs';
appendFileSync(${JSON.stringify(join(fixture, 'calls.jsonl'))}, JSON.stringify({argv:process.argv.slice(2),cwd:process.cwd()})+'\\n');
console.log('worker stdout'); console.error('worker stderr'); process.exit(Number(process.env.WORKER_EXIT ?? 0));
`,
  );
});
afterEach(() => rmSync(fixture, { recursive: true, force: true }));
function run(
  args: string[],
  entry = wrapper,
  env: Record<string, string> = {},
) {
  return spawnSync(process.execPath, [entry, ...args], {
    cwd: tmpdir(),
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}
function calls() {
  return readFileSync(join(fixture, 'calls.jsonl'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
}

for (const role of [
  'coordinator',
  'architect',
  'scout',
  'implementer',
  'reviewer',
  'librarian',
])
  test(`real source offline selection for ${role} works from a foreign cwd`, () => {
    const result = run(['resolve', role], script, {
      HERDR_ENV: '0',
      HERDR_PANE_ID: '',
    });
    expect(result.status, result.stderr).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data.action).toBe('resolved-offline');
    expect(data.launchable).toBe(false);
    expect(data.selection.roleFile).toBe(join(source, 'agents', `${role}.md`));
    expect(data.selection.resources).toBe(source);
    expect(data.selection.cwd).toBe(source);
    expect(data.permissions).toBe('auto-review');
    expect(data.argv).toEqual([]);
    expect(data.selection.kind).toBe('claude');
  });
test('offline resolution honors declared alternatives and rejects other routes', () => {
  const result = run(
    ['resolve', 'architect', '--route', 'claude-opus-5.5-high'],
    script,
  );
  expect(result.status, result.stderr).toBe(0);
  expect(JSON.parse(result.stdout).selection.effort).toBe('high');
  const invalid = run(
    ['resolve', 'coordinator', '--route', 'claude-opus-5.5-high'],
    script,
  );
  expect(invalid.status).toBe(2);
  expect(JSON.parse(invalid.stdout).diagnostics[0].code).toBe(
    'disallowed_route',
  );
});
test('start delegates once with default name, source roots, and exact output forwarding', () => {
  const result = run(['start', 'coordinator']);
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toBe('worker stdout\n');
  expect(result.stderr).toContain('worker stderr\n');
  expect(result.stderr).toContain(
    'claude=auto-review; source: scripts/agent-routing.ts',
  );
  expect(calls()).toEqual([
    {
      cwd: fixture,
      argv: [
        'start',
        '--role',
        'coordinator',
        '--name',
        'ruach-coordinator',
        '--repo',
        fixture,
        '--cwd',
        fixture,
        '--resources',
        fixture,
        '--catalogs',
        join(fixture, 'config/agent-routing'),
        '--permissions',
        'auto-review',
      ],
    },
  ]);
});
test('external worktree selects policy and cwd while source code and resources remain canonical', () => {
  const worktree = join(fixture, 'external checkout');
  mkdirSync(worktree);
  cpSync(join(source, 'config'), join(worktree, 'config'), { recursive: true });
  const result = run([
    'start',
    'architect',
    'designer',
    '--root',
    worktree,
    '--route',
    'claude-opus-5.5-high',
    '--dry-run',
    '--permissions',
    'auto-review',
  ]);
  expect(result.status, result.stderr).toBe(0);
  expect(calls()).toEqual([
    {
      cwd: worktree,
      argv: [
        'start',
        '--role',
        'architect',
        '--name',
        'designer',
        '--repo',
        worktree,
        '--cwd',
        worktree,
        '--resources',
        fixture,
        '--catalogs',
        join(worktree, 'config/agent-routing'),
        '--permissions',
        'auto-review',
        '--dry-run',
        '--route',
        'claude-opus-5.5-high',
      ],
    },
  ]);
});
test('Architect wrapper forwards exact background worktree options once', () => {
  const path = join(fixture, 'design space $() `literal`');
  const result = run([
    'start',
    'architect',
    'design-a',
    '--placement',
    'worktree',
    '--worktree',
    path,
    '--branch',
    'design/a',
    '--base',
    'v0.1.0',
  ]);
  expect(result.status, result.stderr).toBe(0);
  expect(calls()).toHaveLength(1);
  expect(calls()[0].argv.slice(-8)).toEqual([
    '--placement',
    'worktree',
    '--worktree',
    path,
    '--branch',
    'design/a',
    '--base',
    'v0.1.0',
  ]);
});
for (const code of [2, 3, 4])
  test(`worker exit ${code} is preserved without retry`, () => {
    expect(
      run(['start', 'reviewer', 'reviewer-a'], wrapper, {
        WORKER_EXIT: String(code),
      }).status,
    ).toBe(code);
    expect(calls()).toHaveLength(1);
  });
test('invalid arguments do not invoke the worker', () => {
  for (const args of [
    [],
    ['start'],
    ['start', '../coordinator'],
    ['start', 'coordinator', '--permissions', 'bypass'],
    ['resolve', 'coordinator', 'extra'],
    ['resolve', 'coordinator', '--dry-run'],
    ['start', 'coordinator', '--unknown'],
  ]) {
    expect(run(args).status).toBe(2);
  }
  expect(existsSync(join(fixture, 'calls.jsonl'))).toBe(false);
});

function useHarness(kind: string) {
  writeFileSync(
    join(fixture, 'config/agent-routing/models.yaml'),
    'models:\n  selected:\n    harness: ' +
      kind +
      '\n    native_model: provider/model\n',
  );
  writeFileSync(
    join(fixture, 'config/agent-routing/routing.yaml'),
    'routes:\n  selected:\n    model: selected\n    effort: ' +
      (kind === 'codex' ? 'medium' : 'auto') +
      '\n',
  );
  writeFileSync(
    join(fixture, 'config/agent-routing/roles.yaml'),
    'roles:\n  implementer:\n    preferred: selected\n',
  );
}
for (const [kind, mode] of [
  ['codex', 'auto-review'],
  ['opencode', 'inherit'],
  ['agy', 'inherit'],
]) {
  test(
    kind +
      ' policy agrees across resolve, dry-run and start regardless of caller harness',
    () => {
      useHarness(kind);
      for (const args of [
        ['resolve', 'implementer'],
        ['start', 'implementer', '--dry-run'],
        ['start', 'implementer'],
      ]) {
        const result = run(args, wrapper, { OPENCODE_CONFIG_CONTENT: '{}' });
        expect(result.status, result.stderr).toBe(0);
        expect(result.stderr).toContain(kind + '=' + mode);
        expect(result.stderr).toContain('source: scripts/agent-routing.ts');
      }
      expect(calls()).toHaveLength(3);
      for (const call of calls())
        expect(call.argv[call.argv.indexOf('--permissions') + 1]).toBe(mode);
    },
  );
}
test('permission conflicts, undeclared policy and native permission overrides fail before launcher invocation', () => {
  useHarness('codex');
  expect(run(['start', 'implementer', '--permissions', 'inherit']).status).toBe(
    2,
  );
  expect(
    run(['start', 'implementer', '--', '--sandbox', 'danger-full-access'])
      .status,
  ).toBe(2);
  useHarness('opencode');
  expect(
    run(['start', 'implementer', '--permissions', 'auto-review']).status,
  ).toBe(2);
  for (const kind of ['pi', 'goose']) {
    useHarness(kind);
    expect(run(['start', 'implementer']).status).toBe(2);
  }
  useHarness('agy');
  expect(run(['start', 'implementer', '--permissions', 'auto-review']).status).toBe(2);
  expect(existsSync(join(fixture, 'calls.jsonl'))).toBe(false);
});
test('Agy advisory is an explicit Scout-only development alternative with native slug effort', () => {
  const result = run(['resolve', 'scout', '--route', 'gemini-3.8-flash-medium'], script);
  expect(result.status, result.stderr).toBe(0);
  const data = JSON.parse(result.stdout);
  expect(data.selection.kind).toBe('agy');
  expect(data.selection.model).toBe('gemini-3.8-flash-medium');
  expect(data.selection.effort).toBe('auto');
  expect(data.permissions).toBe('inherit');
  expect(data.launchable).toBe(false);
  expect(result.stderr).toContain('agy=inherit; source: scripts/agent-routing.ts');
  for (const role of ['coordinator', 'implementer', 'tester']) {
    const rejected = run(['resolve', role, '--route', 'gemini-3.8-flash-medium'], script);
    expect(rejected.status).toBe(2);
    expect(JSON.parse(rejected.stdout).diagnostics[0].code).toBe('disallowed_route');
  }
});
