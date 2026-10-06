import { afterEach, expect, test } from 'bun:test';
import { chmodSync, copyFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const skill = resolve(import.meta.dir, '..'), bun = process.execPath;
const temporary: string[] = [];
afterEach(() => { for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true }); });
function area() { const path = mkdtempSync(join(tmpdir(), 'ruach-eval-test-')); temporary.push(path); return path; }
function write(path: string, data: any) { writeFileSync(path, typeof data === 'string' ? data : JSON.stringify(data)); return path; }
function git(repo: string, ...args: string[]) {
  const result = spawnSync('git', ['-C', repo, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8', env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
  if (result.status !== 0) throw new Error(`Fixture Git failed: ${result.stderr}`);
  return result.stdout.trim();
}
function commit(repo: string) { git(repo, 'add', '-A'); git(repo, 'commit', '-qm', 'fixture'); return git(repo, 'rev-parse', 'HEAD'); }
function fixture() {
  const base = area(), repo = join(base, 'candidate checkout with spaces'); mkdirSync(repo);
  git(repo, 'init', '-q'); git(repo, 'config', 'core.filemode', 'true');
  copyFileSync(join(skill, 'tests/fixtures/task.ts'), join(repo, 'task.ts')); chmodSync(join(repo, 'task.ts'), 0o644);
  write(join(repo, 'protected'), 'stable\n'); write(join(repo, '.gitignore'), 'ignored/\n');
  const baseline = commit(repo), assignment = join(base, 'assignment.md'); copyFileSync(join(skill, 'tests/fixtures/assignment.md'), assignment);
  return { base, repo, baseline, assignment };
}
function acceptance(f: ReturnType<typeof fixture>, checks?: any[]) {
  return { schema_version: 1, task: 'directory-cli', assignment: f.assignment, acceptance: { fixtures: [{ id: 'spaced', copy: ['task.ts'], directory: 'fixture with spaces' }], checks: checks ?? [
    { id: 'foreign', argv: [bun, '{repo}/task.ts'], cwd: '{foreign_cwd}', timeout_ms: 2000, expect: { exit: 0, stdout: '{repo}\n', stderr: '' } },
    { id: 'spaced', argv: [bun, '{fixture:spaced}/task.ts'], cwd: '{foreign_cwd}', timeout_ms: 2000, expect: { exit: 0, stdout: '{fixture:spaced}\n', stderr: '' } },
    { id: 'reject', argv: [bun, '{repo}/task.ts', 'unexpected'], cwd: '{foreign_cwd}', timeout_ms: 2000, expect: { exit_nonzero: true, stdout: '', stderr_contains: 'usage' } }
  ] }, runs: [ { id: 'one', repo: f.repo, candidate: f.baseline, kind: 'harness-one', model: 'model-one', effort: 'explicit-effort' }, { id: 'two', repo: f.repo, candidate: f.baseline, kind: 'harness-two', model: 'model-two' } ] };
}
function check(argv: string[], expectValue: any = { exit: 0 }, extra: any = {}) { return { id: 'probe', argv, cwd: '{repo}', timeout_ms: 2000, expect: expectValue, ...extra }; }
function cli(script: string, args: string[], cwd?: string, env?: any) {
  const child = spawnSync(bun, [join(skill, 'scripts', `${script}.ts`), ...args], { encoding: 'utf8', cwd: cwd ?? '/', env: env ?? process.env, timeout: 10000, maxBuffer: 8 * 1024 * 1024 });
  expect(child.error).toBeUndefined();
  let value: any; try { value = JSON.parse(child.stdout); } catch { throw new Error(`Invalid JSON: ${child.stdout}; ${child.stderr}`); }
  expect(value.schema_version).toBe(1); expect(typeof value.ok).toBe('boolean');
  return { exit: child.status, value, stdout: child.stdout, stderr: child.stderr };
}
function accept(f: ReturnType<typeof fixture>, config = acceptance(f), run = 'one', extra: string[] = []) {
  const path = write(join(f.base, 'config.json'), config);
  return cli('acceptance', ['--config', path, '--run', run, ...extra]);
}
function scope(f: ReturnType<typeof fixture>, allow: any = {}, candidate = 'HEAD', extra: string[] = [], baseline = f.baseline) {
  const path = write(join(f.base, 'allow.json'), { schema_version: 1, ...allow });
  return cli('scope-check', ['--repo', f.repo, '--baseline', baseline, '--candidate', candidate, '--allow', path, ...extra]);
}
function digest(bytes: Buffer | string) { return createHash('sha256').update(bytes).digest('hex'); }
function snapshot(repo: string): any {
  const entries: any[] = [];
  function walk(path: string, relative: string) {
    const stat = lstatSync(path);
    entries.push({ path: relative, mode: stat.mode, size: stat.size, mtime: stat.mtimeMs, bytes: stat.isFile() ? digest(readFileSync(path)) : stat.isSymbolicLink() ? readlinkSync(path) : null });
    if (stat.isDirectory()) for (const name of readdirSync(path).sort()) walk(join(path, name), `${relative}/${name}`);
  }
  walk(repo, ''); return entries;
}

test('same assignment and acceptance yield identical fingerprints for two harness/model declarations and candidate roots', () => {
  const f = fixture(), second = join(f.base, 'second checkout'); git(f.base, 'clone', '-q', f.repo, second);
  chmodSync(join(f.repo, 'task.ts'), 0o644); chmodSync(join(second, 'task.ts'), 0o644);
  const config = acceptance(f); config.runs[1].repo = second;
  const one = accept(f, config), two = accept(f, config, 'two');
  expect(one.exit).toBe(0); expect(two.exit).toBe(0); expect(one.value.ok).toBe(true); expect(two.value.ok).toBe(true);
  expect(one.value.declared_route.model_use_verified).toBe(false);
  for (const key of ['assignment_sha256', 'acceptance_sha256', 'fixture_sha256']) expect(one.value[key]).toBe(two.value[key]);
  expect(one.value.checks.map((c: any) => c.fingerprint)).toEqual(two.value.checks.map((c: any) => c.fingerprint));
  expect(one.value.checks[2].exit).toBe(7); expect(one.value.checks[2].stderr).toContain('usage');
  expect(one.value.checks[0].cwd).not.toBe(f.repo);
});

test('failures, zero-test rejection, missing executable, and subsequent checks retain negative evidence', () => {
  const f = fixture();
  const checks = [check([bun, '-e', 'console.log("actual"); process.exit(4)'], { exit: 0, stdout: 'wanted\n' }),
    { ...check([bun, '-e', 'console.error("Ran 0 tests")'], { exit: 0, stderr_not_contains: 'Ran 0 tests' }), id: 'zero-tests' },
    { ...check(['/missing-evaluator-executable'], { exit: 0 }), id: 'missing' },
    { ...check([bun, '-e', 'console.log("later")']), id: 'later' }];
  const observed = accept(f, acceptance(f, checks));
  expect(observed.exit).toBe(2); expect(observed.value.ok).toBe(false);
  expect(observed.value.checks.map((c: any) => c.status)).toEqual(['failed', 'failed', 'not-run', 'passed']);
  expect(observed.value.checks[0].exit).toBe(4); expect(observed.value.checks[0].stdout).toBe('actual\n');
  expect(observed.value.checks[2].diagnostics.some((d: any) => d.code === 'missing_executable')).toBe(true);
});

test('timeout kills command and records its prior output', () => {
  const f = fixture(); const observed = accept(f, acceptance(f, [check([bun, '-e', 'console.log("started"); setInterval(()=>{},1000)'], { exit: 0 }, { timeout_ms: 1000 })]));
  expect(observed.exit).toBe(1); expect(observed.value.checks[0].timed_out).toBe(true); expect(observed.value.checks[0].stdout).toBe('started\n');
  expect(observed.value.checks[0].status).toBe('failed');
});

test('exclusive evidence outputs preserve failed result across successful rerun', () => {
  const f = fixture(), failure = join(f.base, 'failed.json'), success = join(f.base, 'success.json');
  const first = accept(f, acceptance(f, [check([bun, '-e', 'process.exit(3)'])]), 'one', ['--output', failure]);
  expect(first.exit).toBe(1); const bytes = readFileSync(failure, 'utf8');
  expect(accept(f, acceptance(f), 'one', ['--output', failure]).exit).toBe(2); expect(readFileSync(failure, 'utf8')).toBe(bytes);
  expect(accept(f, acceptance(f), 'one', ['--output', success]).exit).toBe(0);
  expect(JSON.parse(readFileSync(failure, 'utf8')).ok).toBe(false); expect(JSON.parse(readFileSync(success, 'utf8')).ok).toBe(true);
});

test('checks can assert file contents/hash in copied fixtures without modifying the candidate', () => {
  const f = fixture(), content = 'observable result\n';
  const checks = [check([bun, '-e', 'require("fs").writeFileSync("result", "observable result\\n")'], { exit: 0, files: [{ path: 'result', content, sha256: digest(content) }] }, { cwd: '{fixture:spaced}' })];
  expect(accept(f, acceptance(f, checks)).exit).toBe(0); expect(existsSync(join(f.repo, 'result'))).toBe(false);
  checks[0].expect.files[0].content = 'wrong'; expect(accept(f, acceptance(f, checks)).exit).toBe(1);
});

test('argv bytes, spaces, and metacharacters are preserved without a shell', () => {
  const f = fixture(), argument = 'spaces; $(touch injected) `echo surprise`\nquoted " text';
  expect(accept(f, acceptance(f, [check([bun, '-e', 'process.stdout.write(process.argv[1])', argument], { exit: 0, stdout: argument })])).exit).toBe(0);
  expect(existsSync(join(f.repo, 'injected'))).toBe(false);
});

test('secrets from environment and credential arguments are redacted in JSON and evidence', () => {
  const f = fixture(), output = join(f.base, 'redacted.json');
  const secret = 'environment-super-secret', argument = 'argv-super-secret';
  const config = acceptance(f, [check([bun, '-e', 'process.stdout.write(process.env.API_TOKEN + process.argv.slice(1).join(" "))', '--', '--password', argument], { exit: 0, stdout_contains: secret }, { env: { API_TOKEN: secret } })]);
  const observed = accept(f, config, 'one', ['--output', output]); expect(observed.exit).toBe(0);
  for (const text of [observed.stdout, observed.stderr, readFileSync(output, 'utf8')]) { expect(text).not.toContain(secret); expect(text).not.toContain(argument); }
  expect(observed.value.checks[0].stdout).toContain('[REDACTED]');
});

test('output limit is a failure and never a passing truncated expectation', () => {
  const f = fixture(); const observed = accept(f, acceptance(f, [check([bun, '-e', 'process.stdout.write("x".repeat(1100000))'], { exit_nonzero: true })]));
  expect(observed.exit).toBe(1); expect(observed.value.checks[0].output_truncated).toBe(true); expect(observed.value.checks[0].status).toBe('failed');
});

test('candidate mismatch rejects execution; candidate changes and dirty writes cannot pass', () => {
  const f = fixture(); write(join(f.repo, 'later'), 'later'); const next = commit(f.repo);
  let observed = accept(f); expect(observed.exit).toBe(2); expect(observed.value.checks.every((c: any) => c.status === 'not-run')).toBe(true); expect(observed.value.head_after).toBe(next);
  const config = acceptance(f, [check(['git', 'update-ref', 'HEAD', f.baseline])]); config.runs[0].candidate = next;
  observed = accept(f, config); expect(observed.exit).toBe(1); expect(observed.value.head_before).toBe(next); expect(observed.value.head_after).toBe(f.baseline);
  expect(observed.value.diagnostics.some((d: any) => d.code === 'candidate_changed')).toBe(true);
});

test('dirty state before and after acceptance is recorded as failure', () => {
  const f = fixture();
  let observed = accept(f, acceptance(f, [check([bun, '-e', 'require("fs").writeFileSync("new-file","dirty")'])]));
  expect(observed.exit).toBe(1); expect(observed.value.dirty_before).toEqual([]); expect(observed.value.dirty_after[0].paths).toContain('new-file');
  observed = accept(f); expect(observed.exit).toBe(1); expect(observed.value.dirty_before.length).toBe(1);
});

for (const mutation of [
  (c: any) => { c.schema_version = 2; },
  (c: any) => { c.runs[0].candidate = '--bad'; },
  (c: any) => { c.runs[0].candidate = 'missing-revision'; },
  (c: any) => { c.acceptance.checks[0].argv = ['{unknown}/task']; },
  (c: any) => { c.acceptance.checks[0].cwd = '/'; },
  (c: any) => { c.acceptance.fixtures[0].copy = ['../outside']; },
  (c: any) => { c.acceptance.fixtures[0].directory = '/outside'; },
  (c: any) => { c.acceptance.checks[0].timeout_ms = 0; },
  (c: any) => { c.acceptance.checks[0].expect.exit_nonzero = true; },
  (c: any) => { c.acceptance.checks.push(c.acceptance.checks[0]); },
  (c: any) => { c.extra = 'unknown'; }
]) test('invalid acceptance configuration is a structured setup error', () => {
  const f = fixture(), config = acceptance(f); mutation(config); const observed = accept(f, config);
  expect(observed.exit).toBe(2); expect(observed.value.ok).toBe(false); expect(observed.value.diagnostics.length).toBeGreaterThan(0);
});

test('unsafe fixture symlinks (including parent links) and absent inputs are rejected', () => {
  const f = fixture(); symlinkSync(join(f.base, 'assignment.md'), join(f.repo, 'link')); mkdirSync(join(f.repo, 'directory')); symlinkSync(f.base, join(f.repo, 'directory', 'external')); commit(f.repo);
  for (const path of ['link', 'directory', 'directory/external/assignment.md', 'missing']) {
    const config = acceptance(f); config.runs[0].candidate = 'HEAD'; config.acceptance.fixtures[0].copy = [path];
    expect(accept(f, config).exit).toBe(2);
  }
});

test('scope covers additions, deletions, rename sides, executable modes, and unusual filenames', () => {
  const f = fixture(); write(join(f.repo, 'delete-me'), 'delete'); write(join(f.repo, 'old-name'), 'rename content'); const baseline = commit(f.repo);
  rmSync(join(f.repo, 'delete-me')); git(f.repo, 'mv', 'old-name', 'new-name'); chmodSync(join(f.repo, 'task.ts'), 0o755); write(join(f.repo, 'added\nwith\ttabs'), 'added'); const candidate = commit(f.repo);
  let observed = scope(f, {}, candidate, [], baseline); expect(observed.exit).toBe(1);
  expect(new Set(observed.value.changed_paths)).toEqual(new Set(['delete-me', 'old-name', 'new-name', 'task.ts', 'added\nwith\ttabs']));
  expect(observed.value.changes.some((c: any) => c.status.startsWith('R') && c.paths.includes('old-name') && c.paths.includes('new-name'))).toBe(true);
  expect(scope(f, { paths: observed.value.changed_paths }, candidate, [], baseline).exit).toBe(0);
  observed = scope(f, { paths: ['delete-me', 'new-name', 'task.ts', 'added\nwith\ttabs'] }, candidate, [], baseline);
  expect(observed.value.unexpected_paths).toContain('old-name');
});

test('staged, unstaged, untracked and dirty renames are assessed even when clean is optional', () => {
  const f = fixture(); git(f.repo, 'mv', 'task.ts', 'renamed-task.ts'); write(join(f.repo, 'protected'), 'dirty'); write(join(f.repo, 'untracked\nfile'), 'new');
  let observed = scope(f, { paths: ['task.ts', 'renamed-task.ts', 'protected', 'untracked\nfile'] }); expect(observed.exit).toBe(1);
  expect(observed.value.dirty.some((d: any) => d.staged && d.paths.includes('task.ts'))).toBe(true);
  expect(observed.value.dirty.some((d: any) => d.unstaged && d.paths.includes('protected'))).toBe(true);
  expect(observed.value.dirty.some((d: any) => d.untracked && d.paths.includes('untracked\nfile'))).toBe(true);
  expect(scope(f, { paths: observed.value.assessed_paths, require_clean: false }).exit).toBe(0);
  expect(scope(f, { paths: ['task.ts', 'renamed-task.ts'], require_clean: false }).exit).toBe(1);
});

test('protected paths override allowed paths for committed and dirty changes', () => {
  const f = fixture(); write(join(f.repo, 'protected'), 'changed'); commit(f.repo);
  expect(scope(f, { paths: ['protected'], protected_paths: ['protected'] }).value.protected_changes).toEqual(['protected']);
  git(f.repo, 'reset', '--hard', f.baseline); write(join(f.repo, 'protected'), 'dirty');
  expect(scope(f, { paths: ['protected'], protected_paths: ['protected'], require_clean: false }).exit).toBe(1);
});

test('explicit directory prefixes do not allow similarly named sibling paths', () => {
  const f = fixture(); mkdirSync(join(f.repo, 'owned')); write(join(f.repo, 'owned', 'a'), 'a'); write(join(f.repo, 'owned-other'), 'b'); commit(f.repo);
  const observed = scope(f, { prefixes: ['owned/'] }); expect(observed.exit).toBe(1); expect(observed.value.unexpected_paths).toEqual(['owned-other']);
});

test('scope never changes checkout, index bytes or metadata, including dirty state and output failures', () => {
  const f = fixture(); write(join(f.repo, 'protected'), 'staged'); git(f.repo, 'add', 'protected'); write(join(f.repo, 'protected'), 'unstaged'); write(join(f.repo, 'untracked'), 'new');
  const before = snapshot(f.repo), status = git(f.repo, 'status', '--porcelain=v1', '-z');
  expect(scope(f, { paths: ['protected', 'untracked'], require_clean: false }, 'HEAD', ['--output', join(f.base, 'scope.json')]).exit).toBe(0);
  expect(snapshot(f.repo)).toEqual(before); expect(git(f.repo, 'status', '--porcelain=v1', '-z')).toBe(status);
  expect(scope(f, {}, 'missing').exit).toBe(2); expect(snapshot(f.repo)).toEqual(before);
  expect(scope(f, {}, 'HEAD', ['--output', join(f.repo, 'forbidden.json')]).exit).toBe(2); expect(snapshot(f.repo)).toEqual(before);
});

test('scope can evaluate explicit old candidate while identifying a different worktree HEAD', () => {
  const f = fixture(); write(join(f.repo, 'later'), 'later'); const later = commit(f.repo);
  const observed = scope(f, {}, f.baseline); expect(observed.exit).toBe(0); expect(observed.value.worktree_head).toBe(later); expect(observed.value.candidate_revision).toBe(f.baseline);
});

test('review ancestry and configured technical equivalence allow only evidence successors', () => {
  const f = fixture(); write(join(f.repo, 'report.md'), 'evidence'); const successor = commit(f.repo);
  const allow = { paths: ['report.md', 'task.ts'], reviewed_revision: f.baseline, technical_paths: ['task.ts'] };
  expect(scope(f, allow, successor).exit).toBe(0);
  write(join(f.repo, 'task.ts'), 'technical changes'); commit(f.repo); expect(scope(f, allow).exit).toBe(1);
  const before = git(f.repo, 'rev-parse', 'HEAD'); git(f.repo, 'checkout', '--orphan', 'unrelated'); git(f.repo, 'rm', '-rf', '.'); write(join(f.repo, 'other'), 'other'); const unrelated = commit(f.repo);
  expect(scope(f, { prefixes: ['anything/'], paths: ['protected', 'task.ts', '.gitignore', 'other'], reviewed_revision: before }, unrelated).value.review_checks.ancestor).toBe(false);
});

test('canonical equality and exact tree membership detect ignored files', () => {
  const f = fixture(); mkdirSync(join(f.repo, 'prototype')); write(join(f.repo, 'prototype', 'source'), 'source'); const baseline = commit(f.repo);
  expect(scope(f, { canonical_files: ['protected'], expected_tree_paths: ['prototype/source'] }, 'HEAD', [], baseline).exit).toBe(0);
  write(join(f.repo, '.gitignore'), 'prototype/extra\n'); commit(f.repo); write(join(f.repo, 'prototype', 'extra'), 'ignored');
  const observed = scope(f, { paths: ['.gitignore'], canonical_files: ['protected'], expected_tree_paths: ['prototype/source'] }, 'HEAD', [], baseline);
  expect(observed.value.clean).toBe(true); expect(observed.exit).toBe(1); expect(observed.value.tree_checks.unexpected).toContain('prototype/extra');
  write(join(f.repo, 'protected'), 'altered'); expect(scope(f, { paths: ['.gitignore', 'protected'], require_clean: false, canonical_files: ['protected'] }, 'HEAD', [], baseline).value.canonical_hashes.protected.ok).toBe(false);
});

test('dirty submodules are reported without mutating parent or submodule', () => {
  const f = fixture(), source = join(f.base, 'module-source'); mkdirSync(source); git(source, 'init', '-q'); write(join(source, 'file'), 'original'); commit(source);
  git(f.repo, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', source, 'module'); const baseline = commit(f.repo);
  write(join(f.repo, 'module', 'file'), 'dirty'); const before = snapshot(f.repo);
  const observed = scope(f, { paths: ['module'] }, 'HEAD', [], baseline); expect(observed.exit).toBe(1); expect(observed.value.dirty.some((d: any) => d.paths.includes('module') && d.unstaged)).toBe(true);
  expect(snapshot(f.repo)).toEqual(before);
});

test('scope joins versioned evidence by identity and rejects fabricated passes over negative check fields', () => {
  const f = fixture(), a = join(f.base, 'acceptance.json'), s = join(f.base, 'scope.json');
  expect(accept(f, acceptance(f), 'one', ['--output', a]).exit).toBe(0);
  const allow: any = { task: 'directory-cli', run: 'one', evidence: { acceptance: a } };
  expect(scope(f, allow, 'HEAD', ['--output', s]).exit).toBe(0); allow.evidence.scope = s; expect(scope(f, allow).exit).toBe(0);
  let evidence = JSON.parse(readFileSync(a, 'utf8')); evidence.run = 'wrong'; write(a, evidence); expect(scope(f, allow).exit).toBe(1);
  evidence.run = 'one'; evidence.checks[0].status = 'failed'; write(a, evidence); expect(scope(f, allow).exit).toBe(1);
  write(a, [{ passed: true }]); expect(scope(f, allow).exit).toBe(1);
});

for (const allow of [ { schema_version: 2 }, { paths: ['/absolute'] }, { prefixes: ['not-a-prefix'] }, { protected_paths: ['../escape'] }, { paths: ['.git/config'] }, { extra: true }, { require_clean: 'false' }, { reviewed_revision: 'missing' }, { technical_paths: ['task.ts'] }, { expected_tree_paths: [] }, { evidence: { acceptance: 'missing.json' } } ]) test('invalid scope config returns structured setup error', () => {
  const f = fixture(); expect(scope(f, allow).exit).toBe(2);
});

test('invalid revisions, branch constraint, unknown CLI options, malformed JSON, and help', () => {
  const f = fixture(); expect(scope(f, {}, 'missing').exit).toBe(2); expect(scope(f, {}, 'HEAD', [], 'missing').exit).toBe(2); expect(scope(f, { expected_branch: 'wrong-branch' }).exit).toBe(1);
  for (const script of ['scope-check', 'acceptance']) {
    expect(cli(script, ['--unknown', 'value']).exit).toBe(2);
    const help = spawnSync(bun, [join(skill, 'scripts', `${script}.ts`), '--help'], { encoding: 'utf8' }); expect(help.status).toBe(0); expect(help.stdout).toContain('--');
  }
  const bad = write(join(f.base, 'bad.json'), '{broken'); expect(cli('acceptance', ['--config', bad, '--run', 'one']).exit).toBe(2);
  expect(cli('scope-check', ['--repo', f.repo, '--baseline', 'HEAD', '--candidate', 'HEAD', '--allow', bad]).exit).toBe(2);
});

test('copies assess the original source path as well as the new path', () => {
  const f = fixture(); copyFileSync(join(f.repo, 'task.ts'), join(f.repo, 'copied-task.ts')); commit(f.repo);
  const observed = scope(f, { paths: ['copied-task.ts'] });
  expect(observed.exit).toBe(1); expect(observed.value.unexpected_paths).toContain('task.ts');
  expect(observed.value.changes.some((c: any) => c.status.startsWith('C') && c.paths.includes('task.ts') && c.paths.includes('copied-task.ts'))).toBe(true);
  expect(scope(f, { paths: ['copied-task.ts', 'task.ts'] }).exit).toBe(0);
});

test('moving the candidate ref is detected even when HEAD remains stable and clean', () => {
  const f = fixture(); write(join(f.repo, 'later'), 'later'); const later = commit(f.repo); git(f.repo, 'checkout', '--detach', '-q', f.baseline); git(f.repo, 'branch', 'evaluated', f.baseline);
  const config = acceptance(f, [check(['git', 'update-ref', 'refs/heads/evaluated', later])]); config.runs[0].candidate = 'evaluated';
  const observed = accept(f, config); expect(observed.exit).toBe(1); expect(observed.value.head_after).toBe(f.baseline); expect(observed.value.candidate_after).toBe(later);
  expect(observed.value.diagnostics.some((d: any) => d.code === 'candidate_changed')).toBe(true);
});

test('evidence creation rejects dangling links and links into checkout before executing checks', () => {
  const f = fixture(), dangling = join(f.base, 'dangling.json'), inside = join(f.base, 'alias');
  symlinkSync(join(f.base, 'absent-target'), dangling); symlinkSync(f.repo, inside);
  const config = acceptance(f, [check([bun, '-e', 'require("fs").writeFileSync("should-not-run", "bad")'])]);
  for (const path of [dangling, join(inside, 'evidence.json')]) expect(accept(f, config, 'one', ['--output', path]).exit).toBe(2);
  expect(existsSync(join(f.repo, 'should-not-run'))).toBe(false);
  const before = snapshot(f.repo); expect(scope(f, {}, 'HEAD', ['--output', join(inside, 'scope.json')]).exit).toBe(2); expect(snapshot(f.repo)).toEqual(before);
});

test('missing Git is an explicit setup failure without an environment dump', () => {
  const f = fixture(), config = write(join(f.base, 'config.json'), acceptance(f));
  const observed = cli('acceptance', ['--config', config, '--run', 'one'], undefined, { PATH: '' });
  expect(observed.exit).toBe(2); expect(observed.value.diagnostics.some((d: any) => d.code === 'git_error')).toBe(true);
  const allow = write(join(f.base, 'allow.json'), { schema_version: 1 });
  expect(cli('scope-check', ['--repo', f.repo, '--baseline', 'HEAD', '--candidate', 'HEAD', '--allow', allow], undefined, { PATH: '' }).exit).toBe(2);
});

test('configured PATH and executable permissions are honored without fallback', () => {
  const f = fixture(); write(join(f.repo, 'not-executable'), '#!/bin/sh\nexit 0\n'); const revision = commit(f.repo);
  for (const probe of [check(['git', '--version'], { exit: 0 }, { env: { PATH: '' } }), check(['{repo}/not-executable'])]) {
    const config = acceptance(f, [probe]); config.runs[0].candidate = revision;
    const observed = accept(f, config); expect(observed.exit).toBe(2); expect(observed.value.checks[0].status).toBe('not-run');
  }
  const helpers = join(f.base, 'helper executables'); mkdirSync(helpers); write(join(helpers, 'probe'), '#!/bin/sh\nprintf "configured"\n'); chmodSync(join(helpers, 'probe'), 0o755);
  const config = acceptance(f, [check(['probe'], { exit: 0, stdout: 'configured' }, { env: { PATH: helpers } })]); config.runs[0].candidate = revision;
  expect(accept(f, config).exit).toBe(0);
});

const inheritedGitOverrides = [
  ['repository-selection', (requested: any, other: any) => ({ GIT_DIR: join(other.repo, '.git'), GIT_WORK_TREE: other.repo })],
  ['index', (requested: any, other: any) => ({ GIT_INDEX_FILE: join(other.repo, '.git', 'index') })],
  ['common-directory', (requested: any, other: any) => ({ GIT_COMMON_DIR: join(other.repo, '.git') })],
  ['object-storage', (requested: any, other: any) => ({ GIT_OBJECT_DIRECTORY: join(other.repo, '.git', 'objects'), GIT_ALTERNATE_OBJECT_DIRECTORIES: join(other.base, 'absent-objects') })],
  ['discovery', (requested: any, other: any) => ({ GIT_CEILING_DIRECTORIES: requested.repo, GIT_DISCOVERY_ACROSS_FILESYSTEM: 'invalid' })],
  ['config-worktree', (requested: any, other: any) => ({ GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.worktree', GIT_CONFIG_VALUE_0: other.repo })]
] as const;
for (const [name, overrides] of inheritedGitOverrides) test(`scope isolates inherited Git ${name} overrides and never writes to the selected checkout`, () => {
  const requested = fixture(), other = fixture(); write(join(other.repo, 'protected'), 'other repository'); other.baseline = commit(other.repo);
  write(join(requested.repo, 'protected'), 'staged content'); git(requested.repo, 'add', 'protected'); write(join(requested.repo, 'protected'), 'unstaged content'); write(join(requested.repo, 'unexpected'), 'untracked content');
  const allow = write(join(requested.base, 'allow.json'), { schema_version: 1 });
  const args = ['--repo', requested.repo, '--baseline', 'HEAD', '--candidate', 'HEAD', '--allow', allow];
  const env = { ...process.env, ...overrides(requested, other) };
  const beforeRequested = snapshot(requested.repo), beforeOther = snapshot(other.repo);
  const observed = cli('scope-check', args, '/', env);
  expect(observed.exit).toBe(1); expect(observed.value.ok).toBe(false);
  expect(observed.value.baseline_revision).toBe(requested.baseline); expect(observed.value.candidate_revision).toBe(requested.baseline); expect(observed.value.worktree_head).toBe(requested.baseline);
  expect(observed.value.clean).toBe(false); expect(new Set(observed.value.unexpected_paths)).toEqual(new Set(['protected', 'unexpected']));
  expect(observed.value.dirty.some((d: any) => d.paths.includes('protected') && d.staged && d.unstaged)).toBe(true);
  expect(observed.value.dirty.some((d: any) => d.paths.includes('unexpected') && d.untracked)).toBe(true);
  expect(observed.value.diagnostics.some((d: any) => d.code === 'dirty_worktree')).toBe(true);
  const forbidden = join(requested.repo, 'forbidden-evidence.json');
  const rejected = cli('scope-check', [...args, '--output', forbidden], '/', env);
  expect(rejected.exit).toBe(2); expect(rejected.value.diagnostics.some((d: any) => d.code === 'invalid_output')).toBe(true);
  expect(existsSync(forbidden)).toBe(false); expect(snapshot(requested.repo)).toEqual(beforeRequested); expect(snapshot(other.repo)).toEqual(beforeOther);
});

test('acceptance selects the requested repository while preserving configured check Git environment', () => {
  const requested = fixture(), other = fixture(); write(join(other.repo, 'protected'), 'other repository'); other.baseline = commit(other.repo);
  const overrides = { GIT_DIR: join(other.repo, '.git'), GIT_WORK_TREE: other.repo, GIT_INDEX_FILE: join(other.repo, '.git', 'index') };
  const config = acceptance(requested, [check(['git', 'rev-parse', 'HEAD'], { exit: 0, stdout: other.baseline + '\n' }, { env: overrides })]); config.runs[0].candidate = 'HEAD';
  const configFile = write(join(requested.base, 'config.json'), config), args = ['--config', configFile, '--run', 'one'];
  const env = { ...process.env, GIT_DIR: join(other.base, 'missing-git-dir'), GIT_WORK_TREE: other.repo };
  const beforeRequested = snapshot(requested.repo), beforeOther = snapshot(other.repo);
  const clean = cli('acceptance', args, '/', env);
  expect(clean.exit).toBe(0); expect(clean.value.candidate_revision).toBe(requested.baseline); expect(clean.value.head_before).toBe(requested.baseline); expect(clean.value.head_after).toBe(requested.baseline);
  expect(clean.value.checks[0].cwd).toBe(requested.repo); expect(clean.value.checks[0].status).toBe('passed'); expect(clean.value.checks[0].stdout).toBe(other.baseline + '\n');
  expect(snapshot(requested.repo)).toEqual(beforeRequested); expect(snapshot(other.repo)).toEqual(beforeOther);
});

test('acceptance records dirty requested checkout under inherited Git overrides and rejects evidence inside it', () => {
  const requested = fixture(), other = fixture(); write(join(other.repo, 'protected'), 'other repository'); other.baseline = commit(other.repo);
  write(join(requested.repo, 'unexpected'), 'untracked content');
  const config = acceptance(requested, [check([bun, '-e', 'process.stdout.write(process.cwd() + "\\n" + process.env.GIT_DIR)'], { exit: 0, stdout: requested.repo + '\n' + join(other.repo, '.git') })]); config.runs[0].candidate = 'HEAD';
  const configFile = write(join(requested.base, 'config.json'), config), args = ['--config', configFile, '--run', 'one'];
  const env = { ...process.env, GIT_DIR: join(other.repo, '.git'), GIT_WORK_TREE: other.repo };
  const beforeRequested = snapshot(requested.repo), beforeOther = snapshot(other.repo);
  const observed = cli('acceptance', args, '/', env);
  expect(observed.exit).toBe(1); expect(observed.value.candidate_revision).toBe(requested.baseline);
  for (const state of ['dirty_before', 'dirty_after']) expect(observed.value[state].some((d: any) => d.paths.includes('unexpected') && d.untracked)).toBe(true);
  expect(observed.value.checks[0].status).toBe('passed'); expect(observed.value.diagnostics.some((d: any) => d.code === 'dirty_candidate')).toBe(true);
  const forbidden = join(requested.repo, 'forbidden-acceptance.json'), rejected = cli('acceptance', [...args, '--output', forbidden], '/', env);
  expect(rejected.exit).toBe(2); expect(rejected.value.diagnostics.some((d: any) => d.code === 'invalid_output')).toBe(true);
  expect(existsSync(forbidden)).toBe(false); expect(snapshot(requested.repo)).toEqual(beforeRequested); expect(snapshot(other.repo)).toEqual(beforeOther);
});

test('fixture permission differences change hashes and fingerprints without changing assignment or acceptance', () => {
  const f = fixture(); chmodSync(join(f.repo, 'task.ts'), 0o644); const readable = accept(f);
  chmodSync(join(f.repo, 'task.ts'), 0o600); const restricted = accept(f);
  expect(readable.exit).toBe(0); expect(restricted.exit).toBe(0);
  expect(readable.value.assignment_sha256).toBe(restricted.value.assignment_sha256); expect(readable.value.acceptance_sha256).toBe(restricted.value.acceptance_sha256);
  expect(readable.value.fixture_sha256).not.toBe(restricted.value.fixture_sha256);
  for (let i = 0; i < readable.value.checks.length; i++) expect(readable.value.checks[i].fingerprint).not.toBe(restricted.value.checks[i].fingerprint);
});

test('repository identity permits selected subdirectories and aliases but rejects a redirected worktree', () => {
  const requested = fixture(), other = fixture(), nested = join(requested.repo, 'nested'); mkdirSync(nested);
  const alias = join(requested.base, 'checkout alias'); symlinkSync(requested.repo, alias);
  const allow = write(join(requested.base, 'allow.json'), { schema_version: 1 });
  for (const selected of [nested, alias]) {
    const observed = cli('scope-check', ['--repo', selected, '--baseline', 'HEAD', '--candidate', 'HEAD', '--allow', allow]);
    expect(observed.exit).toBe(0); expect(observed.value.worktree_head).toBe(requested.baseline);
    const rejected = cli('scope-check', ['--repo', selected, '--baseline', 'HEAD', '--candidate', 'HEAD', '--allow', allow, '--output', join(requested.repo, 'forbidden-evidence.json')]);
    expect(rejected.exit).toBe(2); expect(existsSync(join(requested.repo, 'forbidden-evidence.json'))).toBe(false);
  }
  git(requested.repo, 'config', 'core.worktree', other.repo);
  const beforeRequested = snapshot(requested.repo), beforeOther = snapshot(other.repo);
  const redirected = scope(requested);
  expect(redirected.exit).toBe(2); expect(redirected.value.diagnostics.some((d: any) => d.code === 'invalid_repository')).toBe(true);
  const rejectedAcceptance = accept(requested); expect(rejectedAcceptance.exit).toBe(2); expect(rejectedAcceptance.value.diagnostics.some((d: any) => d.code === 'invalid_repository')).toBe(true);
  expect(snapshot(requested.repo)).toEqual(beforeRequested); expect(snapshot(other.repo)).toEqual(beforeOther);
});

test('replacement refs cannot alter the commits that scope checks read', () => {
  const f = fixture();
  write(join(f.repo, 'allowed.txt'), 'real change\n'); const real = commit(f.repo);
  git(f.repo, 'checkout', '-q', '--detach', f.baseline); write(join(f.repo, 'outside.txt'), 'forged change\n'); const forged = commit(f.repo);
  git(f.repo, 'checkout', '-q', real);
  git(f.repo, 'replace', real, forged);
  const observed = scope(f, { paths: ['allowed.txt'] }, real);
  expect(observed.value.diagnostics).toEqual([]); expect(observed.exit).toBe(0);
  expect(observed.value.changed_paths).toEqual(['allowed.txt']);
});

for (const flag of ['--assume-unchanged', '--skip-worktree']) test(`index flag ${flag} cannot hide a modified tracked file from clean checks`, () => {
  const f = fixture();
  write(join(f.repo, 'protected'), 'tampered\n'); git(f.repo, 'update-index', flag, 'protected');
  const observed = scope(f, {});
  expect(observed.exit).not.toBe(0); expect(observed.value.ok).toBe(false);
  expect(observed.value.diagnostics.length).toBeGreaterThan(0);
  const accepted = accept(f); expect(accepted.exit).not.toBe(0); expect(accepted.value.ok).toBe(false);
  expect(accepted.value.checks.every((c: any) => c.status !== 'passed')).toBe(true);
});
