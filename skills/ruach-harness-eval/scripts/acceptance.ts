import { chmodSync, copyFileSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { args, canonical, readArtifact, diagnostic, dirty, emit, executable, fail, hash, object, outputPath, repoPath, revision, root, SetupError, string, strings, version } from './common';

const result: any = { schema_version: 1, ok: false, checks: [], diagnostics: [] };
let output: string | undefined, temporary: string | undefined, repo: string | undefined;
const secrets = new Set<string>();
function redact(text: string) {
  for (const value of [...secrets].sort((a, b) => b.length - a.length)) text = text.split(value).join('[REDACTED]');
  return text;
}
function safe(value: any): any {
  if (typeof value === 'string') return redact(value);
  if (Array.isArray(value)) return value.map(safe);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, safe(v)]));
  return value;
}
function literal(value: any, field: string) { if (typeof value !== 'string' || value.includes('\0')) fail(field, 'Expected a string without NUL'); }
function validate(config: any) {
  object(config, 'config', ['schema_version', 'task', 'assignment', 'acceptance', 'runs']); version(config.schema_version);
  string(config.task, 'task'); string(config.assignment, 'assignment');
  const acceptance = object(config.acceptance, 'acceptance', ['fixtures', 'checks', 'secret_env']);
  if (acceptance.secret_env !== undefined) strings(acceptance.secret_env, 'acceptance.secret_env');
  const ids = new Set<string>();
  if (acceptance.fixtures !== undefined && !Array.isArray(acceptance.fixtures)) fail('acceptance.fixtures');
  for (const [i, fixture] of (acceptance.fixtures ?? []).entries()) {
    const field = `acceptance.fixtures[${i}]`;
    object(fixture, field, ['id', 'copy', 'directory']); string(fixture.id, `${field}.id`);
    if (!/^[a-zA-Z0-9_-]+$/.test(fixture.id) || ids.has(fixture.id)) fail(`${field}.id`, 'Fixture IDs must be unique portable identifiers');
    ids.add(fixture.id); repoPath(fixture.directory, `${field}.directory`);
    const copies = strings(fixture.copy, `${field}.copy`); if (!copies.length) fail(`${field}.copy`);
    for (const path of copies) repoPath(path, `${field}.copy`);
    if (copies.some((p, index) => copies.some((q, j) => j !== index && (p === q || p.startsWith(q + '/'))))) fail(`${field}.copy`, 'Overlapping copies are ambiguous');
  }
  function tokens(value: string, field: string) {
    for (const token of value.match(/\{[a-zA-Z_][a-zA-Z0-9_:.-]*\}/g) ?? []) {
      if (token !== '{repo}' && token !== '{foreign_cwd}' && !(token.startsWith('{fixture:') && ids.has(token.slice(9, -1)))) fail(field, 'Unknown substitution token');
    }
  }
  if (!Array.isArray(acceptance.checks) || !acceptance.checks.length) fail('acceptance.checks', 'At least one observable check is required');
  const checkIds = new Set<string>();
  for (const [i, check] of acceptance.checks.entries()) {
    const field = `acceptance.checks[${i}]`;
    object(check, field, ['id', 'argv', 'cwd', 'timeout_ms', 'expect', 'env']); string(check.id, `${field}.id`);
    if (checkIds.has(check.id)) fail(`${field}.id`, 'Duplicate check ID'); checkIds.add(check.id);
    if (!Array.isArray(check.argv) || !check.argv.length) fail(`${field}.argv`);
    check.argv.forEach((v: any) => { literal(v, `${field}.argv`); tokens(v, `${field}.argv`); }); string(check.argv[0], `${field}.argv[0]`);
    string(check.cwd, `${field}.cwd`); tokens(check.cwd, `${field}.cwd`);
    if (!(check.cwd === '{repo}' || check.cwd === '{foreign_cwd}' || (/^\{fixture:[^{}]+\}$/.test(check.cwd) && ids.has(check.cwd.slice(9, -1))))) fail(`${field}.cwd`, 'cwd must be a documented root token');
    if (!Number.isInteger(check.timeout_ms) || check.timeout_ms < 1 || check.timeout_ms > 3600000) fail(`${field}.timeout_ms`, 'Timeout must be 1..3600000 milliseconds');
    if (check.env !== undefined) {
      if (!check.env || typeof check.env !== 'object' || Array.isArray(check.env)) fail(`${field}.env`);
      for (const [name, value] of Object.entries(check.env)) { if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) fail(`${field}.env`); literal(value, `${field}.env.${name}`); tokens(value as string, `${field}.env.${name}`); }
    }
    const expect = object(check.expect, `${field}.expect`, ['exit', 'exit_nonzero', 'stdout', 'stderr', 'stdout_contains', 'stderr_contains', 'stdout_not_contains', 'stderr_not_contains', 'files']);
    if ((expect.exit === undefined) === (expect.exit_nonzero === undefined)) fail(`${field}.expect`, 'Specify exactly one exit expectation');
    if (expect.exit !== undefined && (!Number.isInteger(expect.exit) || expect.exit < 0 || expect.exit > 255)) fail(`${field}.expect.exit`);
    if (expect.exit_nonzero !== undefined && expect.exit_nonzero !== true) fail(`${field}.expect.exit_nonzero`);
    for (const key of ['stdout', 'stderr', 'stdout_contains', 'stderr_contains', 'stdout_not_contains', 'stderr_not_contains']) if (expect[key] !== undefined) { literal(expect[key], `${field}.expect.${key}`); tokens(expect[key], `${field}.expect.${key}`); }
    if (expect.files !== undefined) {
      if (!Array.isArray(expect.files)) fail(`${field}.expect.files`);
      for (const file of expect.files) {
        object(file, `${field}.expect.files`, ['path', 'content', 'sha256']); repoPath(file.path, `${field}.expect.files.path`);
        if (file.content === undefined && file.sha256 === undefined) fail(`${field}.expect.files`, 'Expected content or sha256 is required');
        if (file.content !== undefined) { literal(file.content, `${field}.expect.files.content`); tokens(file.content, `${field}.expect.files.content`); }
        if (file.sha256 !== undefined && (typeof file.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(file.sha256))) fail(`${field}.expect.files.sha256`);
      }
    }
  }
  if (!Array.isArray(config.runs) || !config.runs.length) fail('runs');
  const runs = new Set<string>();
  for (const [i, run] of config.runs.entries()) {
    const field = `runs[${i}]`; object(run, field, ['id', 'repo', 'candidate', 'kind', 'model', 'effort', 'evidence']);
    for (const key of ['id', 'repo', 'candidate', 'kind', 'model']) string(run[key], `${field}.${key}`);
    if (runs.has(run.id)) fail(`${field}.id`, 'Duplicate run ID'); runs.add(run.id);
    if (run.effort !== undefined) string(run.effort, `${field}.effort`);
    if (run.evidence !== undefined) strings(run.evidence, `${field}.evidence`);
  }
  return config;
}
function noSymlinks(base: string, path: string) {
  let current = base;
  for (const part of path.split('/')) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new SetupError('unsafe_symlink', 'path', 'Symlink inputs are not permitted');
  }
  return current;
}
function copyTree(source: string, destination: string, path: string, manifest: any[]) {
  const stat = lstatSync(source);
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) throw new SetupError('unsafe_fixture', 'acceptance.fixtures', 'Only regular files and directories can be copied');
  if (stat.isDirectory()) {
    mkdirSync(destination, { recursive: true });
    manifest.push({ path, directory: true, mode: stat.mode & 0o777 });
    for (const name of readdirSync(source).sort()) {
      if (name.toLowerCase() === '.git') throw new SetupError('unsafe_fixture', 'acceptance.fixtures', 'Git metadata cannot be copied');
      copyTree(join(source, name), join(destination, name), `${path}/${name}`, manifest);
    }
    chmodSync(destination, stat.mode & 0o777);
  } else {
    mkdirSync(dirname(destination), { recursive: true }); copyFileSync(source, destination); chmodSync(destination, stat.mode & 0o777);
    manifest.push({ path, mode: stat.mode & 0o777, sha256: hash(readArtifact(source, 'acceptance.fixtures')) });
  }
}
// Grace for output pipes to close after the command exits or is killed. A descendant that left
// our process group can hold them open indefinitely, so settlement never waits past this.
const DRAIN_MS = 1000;
async function execute(argv: string[], cwd: string, env: any, timeout: number): Promise<any> {
  return await new Promise(resolveResult => {
    let stdout = Buffer.alloc(0), stderr = Buffer.alloc(0), overflow = false, timedOut = false, launchError = false, orphaned = false, settled = false;
    let exitCode: number | null = null, exitSignal: NodeJS.Signals | null = null;
    const command = executable(argv[0], cwd, env);
    if (!command) { resolveResult({ exit: null, signal: null, timed_out: false, stdout: '', stderr: '', launch_error: true, output_truncated: false, orphaned_output: false }); return; }
    let child: ReturnType<typeof spawn>;
    try { child = spawn(command, argv.slice(1), { cwd, env, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch { resolveResult({ exit: null, signal: null, timed_out: false, stdout: '', stderr: '', launch_error: true, output_truncated: false, orphaned_output: false }); return; }
    // Only the group this check created is ever signalled.
    function kill() {
      try { if (process.platform !== 'win32') process.kill(-child.pid!, 'SIGKILL'); else child.kill('SIGKILL'); } catch {}
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    function settle() {
      if (settled) return; settled = true;
      for (const timer of timers) clearTimeout(timer);
      child.stdout!.destroy(); child.stderr!.destroy();
      resolveResult({ exit: exitCode, signal: exitSignal, timed_out: timedOut, stdout: stdout.toString('utf8'), stderr: stderr.toString('utf8'), launch_error: launchError, output_truncated: overflow, orphaned_output: orphaned });
    }
    function bound() { timers.push(setTimeout(() => { orphaned = !timedOut && !overflow; kill(); settle(); }, DRAIN_MS)); }
    timers.push(setTimeout(() => { timedOut = true; kill(); bound(); }, timeout));
    const capture = (which: 'stdout' | 'stderr', chunk: Buffer) => {
      const previous = which === 'stdout' ? stdout : stderr;
      const next = Buffer.concat([previous, chunk.subarray(0, Math.max(0, 1048576 - previous.length))]);
      if (previous.length + chunk.length > 1048576 && !overflow) { overflow = true; kill(); bound(); }
      if (which === 'stdout') stdout = next; else stderr = next;
    };
    child.stdout!.on('data', chunk => capture('stdout', chunk)); child.stderr!.on('data', chunk => capture('stderr', chunk));
    child.on('error', () => { launchError = true; settle(); });
    child.on('exit', (exit, signal) => { exitCode = exit; exitSignal = signal; bound(); });
    child.on('close', (exit, signal) => { exitCode = exit; exitSignal = signal; settle(); });
  });
}
let exit = 2;
try {
  const options = args(['--config', '--run']);
  if (!options) { process.stdout.write('acceptance.ts --config FILE.json --run ID [--output NEW_FILE.json]\n'); process.exit(0); }
  const configFile = resolve(options['--config']);
  const config = validate(JSON.parse(readArtifact(configFile, 'config').toString('utf8'))), base = dirname(configFile);
  const run = config.runs.find((r: any) => r.id === options['--run']);
  if (!run) fail('run', 'Run ID is not declared');
  repo = root(resolve(base, run.repo)); output = outputPath(options['--output'], repo);
  result.task = config.task; result.run = run.id;
  result.declared_route = { kind: run.kind, model: run.model, effort: run.effort ?? null, model_use_verified: false, evidence: (run.evidence ?? []).map((p: string) => ({ path: p, sha256: hash(readArtifact(resolve(base, p), 'runs.evidence')) })) };
  result.assignment_sha256 = hash(readArtifact(resolve(base, config.assignment), 'assignment'));
  result.acceptance_sha256 = hash(canonical(config.acceptance));
  result.candidate_revision = revision(repo, run.candidate, 'candidate');
  result.head_before = revision(repo, 'HEAD', 'HEAD'); result.tested_revision = result.head_before; result.dirty_before = dirty(repo);
  result.checks = config.acceptance.checks.map((check: any) => ({ id: check.id, status: 'not-run', diagnostics: [] }));
  if (result.head_before !== result.candidate_revision) throw new SetupError('candidate_mismatch', 'candidate', 'Worktree HEAD must equal candidate revision');
  temporary = mkdtempSync(join(tmpdir(), 'ruach-eval-'));
  const foreign = join(temporary, 'foreign cwd'); mkdirSync(foreign);
  const fixtures: Record<string, string> = {}, manifests: any = {};
  for (const fixture of config.acceptance.fixtures ?? []) {
    const destination = join(temporary, fixture.id, fixture.directory); mkdirSync(destination, { recursive: true }); fixtures[fixture.id] = destination;
    const manifest: any[] = [];
    for (const path of fixture.copy) copyTree(noSymlinks(repo, path), join(destination, path), path, manifest);
    manifests[fixture.id] = manifest.sort((a, b) => a.path.localeCompare(b.path));
  }
  result.fixture_sha256 = hash(canonical(manifests));
  const expand = (value: string) => value.replace(/\{repo\}|\{foreign_cwd\}|\{fixture:([a-zA-Z0-9_-]+)\}/g, (token, id) => token === '{repo}' ? repo! : token === '{foreign_cwd}' ? foreign : fixtures[id]);
  const sensitive = (name: string) => /token|secret|password|credential|api[_-]?key|authorization/i.test(name) || (config.acceptance.secret_env ?? []).includes(name);
  for (const [name, value] of Object.entries(process.env)) if (sensitive(name) && value) secrets.add(value);
  let setupError = false;
  for (const [i, check] of config.acceptance.checks.entries()) {
    const argv = check.argv.map(expand), cwd = expand(check.cwd);
    const env = { ...process.env, ...Object.fromEntries(Object.entries(check.env ?? {}).map(([k, v]) => [k, expand(v as string)])) };
    for (const [name, value] of Object.entries(env)) if (sensitive(name) && value) secrets.add(value as string);
    for (let j = 0; j < argv.length; j++) if (/^--?[^=]*(token|secret|password|credential|api[-_]?key|authorization)/i.test(argv[j])) {
      const eq = argv[j].indexOf('='); const value = eq >= 0 ? argv[j].slice(eq + 1) : argv[j + 1]; if (value) secrets.add(value);
    }
    const expected = structuredClone(check.expect);
    for (const key of Object.keys(expected)) if (typeof expected[key] === 'string') expected[key] = expand(expected[key]);
    for (const file of expected.files ?? []) if (file.content !== undefined) file.content = expand(file.content);
    const observed = await execute(argv, cwd, env, check.timeout_ms), diagnostics: any[] = [];
    const add = (code: string, field: string, message: string) => diagnostics.push({ code, field, message });
    if (observed.launch_error) { setupError = true; add('missing_executable', 'argv[0]', 'Executable unavailable or failed to start'); }
    if (observed.timed_out) add('timeout', 'timeout_ms', 'Command exceeded timeout');
    if (observed.orphaned_output) add('orphaned_output', 'output', 'A descendant kept the output streams open after the command exited');
    if (observed.output_truncated) add('output_limit', 'output', 'Output exceeded the 1 MiB per-stream limit');
    if (observed.signal && !observed.timed_out && !observed.output_truncated) add('signal', 'exit', 'Command terminated by signal');
    if (expected.exit !== undefined ? observed.exit !== expected.exit : observed.exit === null || observed.exit === 0) add('exit_mismatch', 'expect.exit', 'Exit expectation failed');
    for (const stream of ['stdout', 'stderr']) {
      if (expected[stream] !== undefined && observed[stream] !== expected[stream]) add('output_mismatch', `expect.${stream}`, 'Exact output expectation failed');
      if (expected[`${stream}_contains`] !== undefined && !observed[stream].includes(expected[`${stream}_contains`])) add('output_mismatch', `expect.${stream}_contains`, 'Required output absent');
      if (expected[`${stream}_not_contains`] !== undefined && observed[stream].includes(expected[`${stream}_not_contains`])) add('output_mismatch', `expect.${stream}_not_contains`, 'Forbidden output present');
    }
    for (const file of expected.files ?? []) {
      try {
        const bytes = readArtifact(noSymlinks(cwd, file.path), 'expect.files');
        if (file.content !== undefined && bytes.toString('utf8') !== file.content || file.sha256 !== undefined && hash(bytes) !== file.sha256) add('file_mismatch', `expect.files.${file.path}`, 'File expectation failed');
      } catch { add('file_unreadable', `expect.files.${file.path}`, 'Expected regular file unavailable'); }
    }
    result.checks[i] = { id: check.id, fingerprint: hash(canonical({ assignment: result.assignment_sha256, acceptance: result.acceptance_sha256, fixtures: result.fixture_sha256, check })), status: observed.launch_error ? 'not-run' : diagnostics.length ? 'failed' : 'passed', argv, cwd, timeout_ms: check.timeout_ms, expected, ...observed, diagnostics };
  }
  result.head_after = revision(repo, 'HEAD', 'HEAD'); result.dirty_after = dirty(repo);
  result.candidate_after = revision(repo, run.candidate, 'candidate');
  if (result.head_after !== result.head_before || result.candidate_after !== result.candidate_revision) result.diagnostics.push({ code: 'candidate_changed', field: 'candidate', message: 'Candidate or HEAD changed during evaluation' });
  if (result.dirty_before.length || result.dirty_after.length) result.diagnostics.push({ code: 'dirty_candidate', field: 'dirty', message: 'Acceptance requires a clean worktree before and after checks' });
  result.ok = !setupError && !result.diagnostics.length && result.checks.every((c: any) => c.status === 'passed'); exit = setupError ? 2 : result.ok ? 0 : 1;
} catch (error) { result.diagnostics.push(diagnostic(error)); }
finally {
  if (repo && result.head_before && result.head_after === undefined) {
    try { result.head_after = revision(repo, 'HEAD', 'HEAD'); result.dirty_after = dirty(repo); } catch (error) { result.diagnostics.push(diagnostic(error)); }
  }
  if (temporary) {
    try { rmSync(temporary, { recursive: true, force: true }); }
    catch { result.ok = false; exit = 2; result.diagnostics.push({ code: 'cleanup_error', field: 'fixtures', message: 'Private fixture cleanup failed' }); }
  }
}
emit(safe(result), exit, output);
