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
  // The checkout is now assessed by content: the tampered file is reported as dirt and acceptance fails on it.
  expect(accepted.value.dirty_before.flatMap((d: any) => d.paths)).toContain('protected');
  expect(accepted.value.diagnostics.map((d: any) => d.code)).toContain('dirty_candidate');
});

// A repository-local fsmonitor hook that reports no changes must not make a tampered tracked file look clean.
test('core.fsmonitor cannot hide changes from clean checks', () => {
  const f = fixture();
  const hook = join(f.base, 'fsmonitor.sh');
  write(hook, '#!/bin/sh\nprintf "tok\\0"\n'); chmodSync(hook, 0o755);
  git(f.repo, 'config', 'core.fsmonitor', hook);
  // Prime the index fsmonitor token; the fixture helper disables optional locks, which would skip the index write.
  spawnSync('git', ['-C', f.repo, 'status', '--porcelain'], { env: process.env });
  write(join(f.repo, 'protected'), 'tampered\n');
  expect(spawnSync('git', ['-C', f.repo, 'status', '--porcelain'], { encoding: 'utf8', env: process.env }).stdout).toBe('');
  const observed = scope(f, {});
  expect(observed.exit).not.toBe(0); expect(observed.value.ok).toBe(false);
  expect(observed.value.diagnostics.length).toBeGreaterThan(0);
});

// A clean filter selected through untracked repository config can rewrite a tampered file to its committed content
// while status hashes it, so filtered tracked files must fail closed rather than read as clean.
for (const source of ['info-attributes', 'tracked-gitattributes']) test(`a clean filter from ${source} cannot forge a clean checkout`, () => {
  const f = fixture();
  git(f.repo, 'config', 'filter.forge.clean', "printf 'stable\\n'");
  if (source === 'info-attributes') write(join(f.repo, '.git', 'info', 'attributes'), 'protected filter=forge\n');
  else { write(join(f.repo, '.gitattributes'), 'protected filter=forge\n'); git(f.repo, 'add', '.gitattributes'); git(f.repo, 'commit', '-q', '-m', 'attributes'); }
  Bun.sleepSync(1100); // let the tampered file's stat data differ from the index entry
  write(join(f.repo, 'protected'), 'TAMPER\n');
  const observed = scope(f, {}, 'HEAD', [], git(f.repo, 'rev-parse', 'HEAD'));
  expect(observed.exit).not.toBe(0); expect(observed.value.ok).toBe(false);
  expect(observed.value.diagnostics.length).toBeGreaterThan(0);
  const accepted = accept(f); expect(accepted.exit).not.toBe(0); expect(accepted.value.ok).toBe(false);
});
test('repositories without filter attributes are unaffected', () => {
  const f = fixture();
  write(join(f.repo, '.gitattributes'), '*.txt text eol=lf\n'); git(f.repo, 'add', '.gitattributes'); git(f.repo, 'commit', '-q', '-m', 'eol');
  expect(scope(f, { paths: ['.gitattributes'] }).exit).toBe(0);
});

// A descendant in its own session keeps inherited output pipes open without being in the check's process group.
const holder = (seconds: number) => `require("child_process").spawn(process.execPath,["-e","setTimeout(()=>{},${seconds * 1000})"],{detached:true,stdio:["ignore","inherit","inherit"]}).unref()`;
test('a descendant holding output pipes cannot stall a completed check past its bound', () => {
  const f = fixture(); const started = Date.now();
  const observed = accept(f, acceptance(f, [check([bun, '-e', holder(15)], { exit: 0 }, { timeout_ms: 5000 })]));
  expect(Date.now() - started).toBeLessThan(9000);
  expect(observed.exit).toBe(1); expect(observed.value.checks[0].status).toBe('failed');
  expect(observed.value.checks[0].diagnostics.map((d: any) => d.code)).toContain('orphaned_output');
});
test('timeout settles once within a bound even when a descendant keeps the pipes open', () => {
  const f = fixture(); const started = Date.now();
  const observed = accept(f, acceptance(f, [check([bun, '-e', `${holder(15)}; setInterval(()=>{},1000)`], { exit: 0 }, { timeout_ms: 500 })]));
  expect(Date.now() - started).toBeLessThan(9000);
  expect(observed.value.checks[0].timed_out).toBe(true); expect(observed.value.checks[0].status).toBe('failed');
});
test('FIFO and oversized expected files yield structured failed checks within a bound', () => {
  const f = fixture(); const started = Date.now();
  const script = 'const fs=require("fs");require("child_process").execFileSync("mkfifo",["pipe"]);fs.closeSync(fs.openSync("big","w"));fs.truncateSync("big",20*1024*1024)';
  const observed = accept(f, acceptance(f, [check([bun, '-e', script], { exit: 0, files: [{ path: 'pipe', content: 'x' }, { path: 'big', sha256: '0'.repeat(64) }] }, { cwd: '{foreign_cwd}' })]));
  expect(Date.now() - started).toBeLessThan(9000);
  expect(observed.exit).toBe(1); const diagnostics = observed.value.checks[0].diagnostics;
  expect(diagnostics.filter((d: any) => d.code === 'file_unreadable').map((d: any) => d.field)).toEqual(['expect.files.pipe', 'expect.files.big']);
});
test('special files as configuration inputs are structured setup errors, not hangs', () => {
  const f = fixture(); const fifo = join(f.base, 'assignment.fifo');
  expect(spawnSync('mkfifo', [fifo]).status).toBe(0);
  const config = acceptance(f); config.assignment = fifo;
  const observed = accept(f, config);
  expect(observed.exit).toBe(2); expect(observed.value.diagnostics.map((d: any) => d.code)).toContain('unreadable_artifact');
  const evidence = join(f.base, 'evidence.fifo'); expect(spawnSync('mkfifo', [evidence]).status).toBe(0);
  const checked = scope(f, { evidence: { acceptance: 'evidence.fifo' }, task: 't', run: 'r' });
  expect(checked.exit).toBe(2); expect(checked.value.diagnostics.map((d: any) => d.code)).toContain('unreadable_artifact');
});

test('the evidence output is reserved before checks run and cannot be redirected during them', () => {
  const f = fixture(), output = join(f.base, 'reserved.json'), victim = join(f.base, 'victim.txt'); write(victim, 'untouched\n');
  const observed = accept(f, acceptance(f, [check([bun, '-e', `process.exit(require("fs").existsSync(${JSON.stringify(output)}) ? 0 : 5)`], { exit: 0 })]), 'one', ['--output', output]);
  expect(observed.exit).toBe(0); expect(JSON.parse(readFileSync(output, 'utf8')).ok).toBe(true);
  const second = join(f.base, 'swapped.json');
  const swap = `const fs=require("fs");fs.unlinkSync(${JSON.stringify(second)});fs.symlinkSync(${JSON.stringify(victim)},${JSON.stringify(second)})`;
  const swapped = accept(f, acceptance(f, [check([bun, '-e', swap], { exit: 0 })]), 'one', ['--output', second]);
  expect(swapped.exit).toBe(2); expect(swapped.value.diagnostics.map((d: any) => d.code)).toContain('output_error');
  expect(readFileSync(victim, 'utf8')).toBe('untouched\n');
});

// ---- Content-based clean check (RU-02, docs/design/0.3-clean-check.md section 14) ----
// The numbers in the test names are the design's test numbers. "Forged" states must read as dirty with a
// record naming the path; controls must stay clean. Each forgery asserts its precondition (plain git status
// is clean) so a test cannot fail or pass for the wrong reason.
function plain(repo: string, ...args: string[]) {
  const result = spawnSync('git', ['-C', repo, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8', env: process.env });
  return result.stdout;
}
function settle(f: ReturnType<typeof fixture>) { Bun.sleepSync(1100); plain(f.repo, 'status', '--porcelain'); } // index entries no longer racy
function tamperKeepingMtime(f: ReturnType<typeof fixture>, file = 'protected', body = 'TAMPER\n') {
  const ref = join(f.base, `mtime-ref-${file.replace(/\W/g, '_')}`);
  spawnSync('touch', ['-r', join(f.repo, file), ref]); write(join(f.repo, file), body); spawnSync('touch', ['-r', ref, join(f.repo, file)]);
}
function expectDetected(observed: ReturnType<typeof scope>, path: string, extra = true) {
  expect(observed.exit).toBe(1); expect(observed.value.ok).toBe(false); expect(observed.value.clean).toBe(false);
  expect(observed.value.dirty.flatMap((d: any) => d.paths)).toContain(path);
  return extra;
}
function expectClean(observed: ReturnType<typeof scope>) { expect(observed.exit, observed.stdout).toBe(0); expect(observed.value.ok).toBe(true); expect(observed.value.clean).toBe(true); expect(observed.value.dirty).toEqual([]); }
function viaAcceptance(f: ReturnType<typeof fixture>) {
  const accepted = accept(f, acceptance(f, [check([bun, '-e', '0'], { exit: 0 })]));
  return accepted;
}

for (const [number, setting] of [['1', ['core.trustctime', 'false']], ['2', ['core.checkStat', 'minimal']]] as const) test(`${number}. ${setting[0]}=${setting[1]} cannot hide an equal-size edit with restored mtime`, () => {
  const f = fixture(); git(f.repo, 'config', setting[0], setting[1]); settle(f);
  tamperKeepingMtime(f);
  expect(plain(f.repo, 'status', '--porcelain')).toBe(''); // precondition: the forgery works against plain status
  expectDetected(scope(f, {}), 'protected');
  const accepted = viaAcceptance(f); expect(accepted.value.ok).toBe(false); expect(accepted.value.dirty_before.flatMap((d: any) => d.paths)).toContain('protected');
});
test('3. an index whose stat and checksum were rewritten to claim the committed blob cannot hide a tampered file', () => {
  const f = fixture(), blob = git(f.repo, 'rev-parse', 'HEAD:protected');
  git(f.repo, 'config', 'index.version', '2'); write(join(f.repo, 'protected'), 'TAMPER\n'); Bun.sleepSync(1100); git(f.repo, 'add', 'protected');
  const path = join(f.repo, '.git', 'index'), index = readFileSync(path);
  let offset = 12, patched = false;
  for (let i = 0, count = index.readUInt32BE(8); i < count; i++) {
    const length = index.readUInt16BE(offset + 60) & 0xfff, name = index.subarray(offset + 62, offset + 62 + length).toString();
    if (name === 'protected') { Buffer.from(blob, 'hex').copy(index, offset + 40); patched = true; }
    offset += Math.ceil((62 + length + 1) / 8) * 8;
  }
  expect(patched).toBe(true);
  createHash('sha1').update(index.subarray(0, index.length - 20)).digest().copy(index, index.length - 20); writeFileSync(path, index);
  expect(plain(f.repo, 'status', '--porcelain')).toBe(''); // precondition
  expectDetected(scope(f, {}), 'protected');
});
test('4. default configuration still detects the same edit (control)', () => {
  const f = fixture(); settle(f); tamperKeepingMtime(f);
  expectDetected(scope(f, {}), 'protected');
});
test('5. a check that forges equality inside acceptance cannot make dirty_after clean', () => {
  const f = fixture(); git(f.repo, 'config', 'core.trustctime', 'false'); settle(f);
  const script = `set -e; touch -r protected ../ref; printf 'TAMPER\\n' > protected; touch -r ../ref protected`;
  const accepted = accept(f, acceptance(f, [check(['sh', '-c', script], { exit: 0 })]));
  expect(accepted.value.ok).toBe(false); expect(accepted.value.dirty_after.flatMap((d: any) => d.paths)).toContain('protected');
  expect(accepted.value.diagnostics.map((d: any) => d.code)).toContain('dirty_candidate');
});
test('8. core.filemode=false cannot hide a changed executable bit', () => {
  const f = fixture(); git(f.repo, 'config', 'core.filemode', 'false'); chmodSync(join(f.repo, 'protected'), 0o755);
  expect(plain(f.repo, 'status', '--porcelain')).toBe('');
  expectDetected(scope(f, {}), 'protected');
});
test('9. core.symlinks=false cannot hide a symlink replaced by a regular file', () => {
  const f = fixture(); symlinkSync('protected', join(f.repo, 'link')); const baseline = commit(f.repo);
  git(f.repo, 'config', 'core.symlinks', 'false'); rmSync(join(f.repo, 'link')); write(join(f.repo, 'link'), 'protected');
  expect(plain(f.repo, 'status', '--porcelain')).toBe('');
  expectDetected(scope(f, {}, 'HEAD', [], baseline), 'link');
});
test('10. an untouched assume-unchanged or skip-worktree file is clean', () => {
  for (const flag of ['--assume-unchanged', '--skip-worktree']) {
    const f = fixture(); git(f.repo, 'update-index', flag, 'protected'); expectClean(scope(f, {}));
  }
});
test('13. a clean filter named by core.attributesFile cannot forge a clean checkout', () => {
  const f = fixture(), attributes = write(join(f.base, 'attributes'), 'protected filter=forge\n');
  git(f.repo, 'config', 'filter.forge.clean', "printf 'stable\\n'"); git(f.repo, 'config', 'core.attributesFile', attributes);
  settle(f); tamperKeepingMtime(f); expect(plain(f.repo, 'status', '--porcelain')).toBe('');
  expectDetected(scope(f, {}), 'protected');
});
test('14. an [attr] macro expanding to a clean filter cannot forge a clean checkout', () => {
  const f = fixture();
  write(join(f.repo, '.git', 'info', 'attributes'), '[attr]forged filter=forge\nprotected forged\n');
  git(f.repo, 'config', 'filter.forge.clean', "printf 'stable\\n'");
  settle(f); tamperKeepingMtime(f); expect(plain(f.repo, 'status', '--porcelain')).toBe('');
  expectDetected(scope(f, {}), 'protected');
});
test('15. a smudge-only filter on an untouched file is clean', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'protected filter=smudgeonly\n'); git(f.repo, 'config', 'filter.smudgeonly.smudge', 'cat');
  expectClean(scope(f, {}));
});
test('16. a filtered file whose worktree bytes differ from the committed pointer is dirty, not a setup error', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'protected filter=lfs\n');
  git(f.repo, 'config', 'filter.lfs.clean', "printf 'pointer\\n'"); git(f.repo, 'config', 'filter.lfs.smudge', 'cat');
  write(join(f.repo, 'protected'), 'stable\n'); git(f.repo, 'add', '-f', 'protected'); git(f.repo, 'commit', '-q', '-m', 'pointer'); const baseline = git(f.repo, 'rev-parse', 'HEAD');
  const observed = scope(f, {}, 'HEAD', [], baseline); expectDetected(observed, 'protected');
  expect(observed.value.diagnostics.map((d: any) => d.code)).toContain('dirty_worktree');
});
test('17. an unset filter attribute on an untouched file is clean', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'protected -filter\n'); expectClean(scope(f, {}));
});
test('18. a textconv driver cannot mask a tampered file', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'protected diff=masked\n'); git(f.repo, 'config', 'diff.masked.textconv', 'echo stable; true');
  settle(f); tamperKeepingMtime(f); expectDetected(scope(f, {}), 'protected');
});
test('19. a working-tree-encoding attribute cannot mask a tampered file', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'protected working-tree-encoding=UTF-16\n');
  settle(f); tamperKeepingMtime(f); expectDetected(scope(f, {}), 'protected');
});
test('20. an ident attribute cannot let a foreign expanded $Id$ read as the committed blob', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), 'identity.txt ident\n');
  write(join(f.repo, 'identity.txt'), '$Id$\n'); git(f.repo, 'add', 'identity.txt'); git(f.repo, 'commit', '-q', '-m', 'ident'); const baseline = git(f.repo, 'rev-parse', 'HEAD');
  settle(f); write(join(f.repo, 'identity.txt'), `$Id: ${'f'.repeat(40)} $\n`); // plain status already reports this one; the test pins raw-byte semantics
  expectDetected(scope(f, {}, 'HEAD', [], baseline), 'identity.txt');
});
test('21. eol and autocrlf configuration on an untouched LF checkout is clean', () => {
  const f = fixture(); write(join(f.repo, '.git', 'info', 'attributes'), '* text\n'); git(f.repo, 'config', 'core.autocrlf', 'true'); expectClean(scope(f, {}));
});
test('22. an untracked file listed in .git/info/exclude is detected', () => {
  const f = fixture(); write(join(f.repo, 'evil.ts'), 'x\n'); write(join(f.repo, '.git', 'info', 'exclude'), 'evil.ts\n');
  expectDetected(scope(f, {}), 'evil.ts');
});
test('23. an untracked file listed in a repository core.excludesFile is detected', () => {
  const f = fixture(); write(join(f.repo, 'evil.ts'), 'x\n'); git(f.repo, 'config', 'core.excludesFile', write(join(f.base, 'excludes'), 'evil.ts\n'));
  expectDetected(scope(f, {}), 'evil.ts');
});
test('24. an untracked self-ignoring .gitignore and the file it hides are both reported', () => {
  const f = fixture(); mkdirSync(join(f.repo, 'sub')); write(join(f.repo, 'sub', '.gitignore'), '*\n'); write(join(f.repo, 'sub', 'evil.ts'), 'x\n');
  const observed = scope(f, {}); expectDetected(observed, 'sub/.gitignore');
  expect(observed.value.dirty.flatMap((d: any) => d.paths)).toContain('sub/evil.ts');
});
test('25. an edited root .gitignore cannot hide untracked files from scope when cleanliness is optional', () => {
  const f = fixture(); write(join(f.repo, '.gitignore'), '*\n'); write(join(f.repo, 'evil.ts'), 'x\n');
  const observed = scope(f, { paths: ['.gitignore'], require_clean: false });
  expect(observed.exit).toBe(1); expect(observed.value.unexpected_paths).toContain('evil.ts');
});
test('26. files ignored by committed .gitignore are not dirty', () => {
  const f = fixture(); mkdirSync(join(f.repo, 'ignored')); write(join(f.repo, 'ignored', 'x'), 'x\n'); expectClean(scope(f, {}));
});
test('28. a submodule edit with core.trustctime=false and a restored mtime still marks the parent dirty', () => {
  const f = fixture(), source = join(f.base, 'module-source'); mkdirSync(source); git(source, 'init', '-q'); write(join(source, 'file'), 'original'); commit(source);
  git(f.repo, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', source, 'module'); const baseline = commit(f.repo);
  git(join(f.repo, 'module'), 'config', 'core.trustctime', 'false'); Bun.sleepSync(1100); plain(join(f.repo, 'module'), 'status', '--porcelain');
  tamperKeepingMtime(f, 'module/file', 'DIRTYEDT');
  expectDetected(scope(f, { paths: ['module'] }, 'HEAD', [], baseline), 'module');
});
test('29. a removed submodule directory is dirty and an empty one is clean', () => {
  const f = fixture(), source = join(f.base, 'module-source'); mkdirSync(source); git(source, 'init', '-q'); write(join(source, 'file'), 'original'); commit(source);
  git(f.repo, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', source, 'module'); const baseline = commit(f.repo);
  rmSync(join(f.repo, 'module'), { recursive: true, force: true }); expectDetected(scope(f, { paths: ['module'] }, 'HEAD', [], baseline), 'module');
  mkdirSync(join(f.repo, 'module')); expectClean(scope(f, {}, 'HEAD', [], baseline));
});
test('30. a tracked file replaced by a FIFO is dirty and never blocks', () => {
  const f = fixture(); rmSync(join(f.repo, 'protected')); expect(spawnSync('mkfifo', [join(f.repo, 'protected')]).status).toBe(0);
  const started = Date.now(); expectDetected(scope(f, {}), 'protected'); expect(Date.now() - started).toBeLessThan(8000);
});
test('31. a tracked file replaced by a directory, and a path behind a parent symlink, are dirty', () => {
  const f = fixture(); rmSync(join(f.repo, 'protected')); mkdirSync(join(f.repo, 'protected')); write(join(f.repo, 'protected', 'inner'), 'x'); expectDetected(scope(f, {}), 'protected');
  const g = fixture(); mkdirSync(join(g.repo, 'dir')); write(join(g.repo, 'dir', 'file'), 'x\n'); const baseline = commit(g.repo);
  rmSync(join(g.repo, 'dir'), { recursive: true }); symlinkSync(g.base, join(g.repo, 'dir')); expectDetected(scope(g, {}, 'HEAD', [], baseline), 'dir/file');
});
test('33. an untracked listing beyond the entry budget is a setup error, never clean', () => {
  // The 1 GiB hash budget is not tested at its boundary: that would need a committed file over 1 GiB.
  const f = fixture(); mkdirSync(join(f.repo, 'bulk'));
  for (let i = 0; i < 100_001; i++) writeFileSync(join(f.repo, 'bulk', `f${i}`), '');
  const observed = scope(f, {}); expect(observed.exit).toBe(2); expect(observed.value.ok).toBe(false);
  expect(observed.value.diagnostics.map((d: any) => d.code)).toContain('clean_check_budget'); expect(observed.value.clean).not.toBe(true);
}, 120000);
test('34. a committed file over the artifact limit is hashed by streaming: untouched is clean, an equal-size edit is dirty', () => {
  const f = fixture(), size = 17 * 1024 * 1024; writeFileSync(join(f.repo, 'big.bin'), Buffer.alloc(size, 97)); const baseline = commit(f.repo);
  expectClean(scope(f, {}, 'HEAD', [], baseline));
  const edited = Buffer.alloc(size, 97); edited[size - 1] = 98; writeFileSync(join(f.repo, 'big.bin'), edited);
  expectDetected(scope(f, {}, 'HEAD', [], baseline), 'big.bin');
}, 60000);
test('R1. the hash budget is shared across submodules within one dirty() call', async () => {
  // The limit is injected because the real 1 GiB bound is too large to exercise. Three sibling submodules of
  // 600 bytes each plus .gitmodules exceed 1500 bytes only if their counts accumulate.
  const { dirty, SetupError } = await import('../scripts/common');
  const f = fixture();
  for (const name of ['a', 'b', 'c']) {
    const source = join(f.base, `module-${name}`); mkdirSync(source); git(source, 'init', '-q'); write(join(source, 'file'), 'x'.repeat(600)); commit(source);
    git(f.repo, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', source, `module-${name}`);
  }
  commit(f.repo);
  expect(dirty(f.repo)).toEqual([]); // under the real limit the checkout is clean
  let thrown: any; try { dirty(f.repo, { hashLimit: 1500 }); } catch (error) { thrown = error; }
  expect(thrown).toBeInstanceOf(SetupError); expect(thrown.code).toBe('clean_check_budget');
});
test('R4. the documented budget values are the exported constants', async () => {
  const { CLEAN_ENTRY_LIMIT, CLEAN_HASH_LIMIT } = await import('../scripts/common');
  const docs = readFileSync(join(skill, 'references/config.md'), 'utf8');
  expect(docs).toContain(`At most ${CLEAN_ENTRY_LIMIT.toLocaleString('en-US')} paths per listing`);
  expect(docs).toContain(`${CLEAN_HASH_LIMIT / 1024 ** 3} GiB hashed per call`);
  expect(readFileSync(join(skill, '../../docs/operations.md'), 'utf8')).toContain(`${CLEAN_ENTRY_LIMIT.toLocaleString('en-US')} paths per listing and ${CLEAN_HASH_LIMIT / 1024 ** 3} GiB hashed per call`);
});
