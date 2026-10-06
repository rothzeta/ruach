import { createHash } from 'node:crypto';
import { accessSync, closeSync, writeSync, constants, fstatSync, lstatSync, openSync, readFileSync, statSync, realpathSync } from 'node:fs';
import { delimiter, dirname, isAbsolute, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

export type Diagnostic = { code: string; field: string; message: string };
export class SetupError extends Error {
  constructor(public code: string, public field: string, message: string) { super(message); }
}
export function fail(field: string, message = 'Invalid value'): never { throw new SetupError('invalid_config', field, message); }
export function object(value: any, field: string, allowed: string[]): any {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field, 'Expected an object');
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${field}.${key}`, 'Unknown field');
  return value;
}
export function string(value: any, field: string): string {
  if (typeof value !== 'string' || !value.length || value.includes('\0')) fail(field, 'Expected a nonempty string without NUL');
  return value;
}
export function strings(value: any, field: string): string[] {
  if (!Array.isArray(value)) fail(field, 'Expected an array');
  return value.map((v, i) => string(v, `${field}[${i}]`));
}
export function boolean(value: any, field: string) { if (typeof value !== 'boolean') fail(field, 'Expected a boolean'); }
export function version(value: any) { if (value !== 1) fail('schema_version', 'Supported schema_version is 1'); }
export function repoPath(value: any, field: string, prefix = false): string {
  const path = string(value, field);
  const parts = (prefix ? path.slice(0, -1) : path).split('/');
  if (isAbsolute(path) || path.includes('\\') || parts.some(p => !p || p === '.' || p === '..' || p.toLowerCase() === '.git') || (prefix && !path.endsWith('/'))) fail(field, 'Expected a repository-relative path (directory prefixes end in /)');
  return path;
}
// Largest input or expected-file artifact read into memory.
export const ARTIFACT_LIMIT = 16 * 1024 * 1024;
// Read only a bounded regular file. O_NONBLOCK keeps a FIFO from stalling the open and
// the descriptor check keeps devices, directories and growing files from being read.
export function readArtifact(path: string, field = 'artifact', limit = ARTIFACT_LIMIT): Buffer {
  let fd: number | undefined;
  try {
    fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK);
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > limit) throw new Error('unsuitable');
    const body = readFileSync(fd);
    if (body.length > limit) throw new Error('unsuitable');
    return body;
  } catch { throw new SetupError('unreadable_artifact', field, 'Input must be a readable regular file within the size budget'); }
  finally { if (fd !== undefined) try { closeSync(fd); } catch {} }
}
export function loadJson(path: string): any {
  const body = readArtifact(path, 'config').toString('utf8');
  try { return JSON.parse(body); }
  catch { throw new SetupError('unreadable_config', 'config', 'Cannot read JSON input'); }
}
export function hash(value: string | Buffer) { return createHash('sha256').update(value).digest('hex'); }
export function canonical(value: any): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
export function args(required: string[]): Record<string, string> | null {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === '--help') return null;
  const result: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (![...required, '--output'].includes(key) || result[key] !== undefined || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new SetupError('usage', 'argv', 'Unknown, duplicate, or missing option');
    result[key] = argv[i + 1];
  }
  for (const key of required) if (!result[key]) throw new SetupError('usage', key, 'Required option missing');
  return result;
}
export function executable(command: string, cwd: string, env: Record<string, any>): string | null {
  const locations = isAbsolute(command) || command.includes('/') || command.includes('\\')
    ? [resolve(cwd, command)]
    : typeof env.PATH === 'string' ? env.PATH.split(delimiter).map((entry: string) => resolve(cwd, entry, command)) : [];
  const suffixes = process.platform === 'win32' ? ['', ...(env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';')] : [''];
  for (const path of locations) for (const suffix of suffixes) {
    try { const target = path + suffix; accessSync(target, constants.X_OK); if (statSync(target).isFile()) return target; } catch {}
  }
  return null;
}
export function git(repo: string, argv: string[], allowFailure = false): { exit: number; stdout: Buffer } {
  const command = executable('git', process.cwd(), process.env);
  if (!command) throw new SetupError('git_error', 'repo', 'Git is unavailable on PATH');
  // Git's -C does not override repository/config selection from the environment.
  // Keep these private probes independent of acceptance checks' intentional env.
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.toUpperCase().startsWith('GIT_')));
  env.GIT_OPTIONAL_LOCKS = '0';
  const child = spawnSync(command, ['--no-replace-objects', '-C', repo, ...argv], { env, maxBuffer: 32 * 1024 * 1024 });
  if (child.error || (!allowFailure && child.status !== 0)) throw new SetupError('git_error', 'repo', 'Git probe failed; check repository and Git availability');
  return { exit: child.status ?? 2, stdout: child.stdout ?? Buffer.alloc(0) };
}
export function root(path: string) {
  const requested = realpathSync(resolve(path));
  const result = git(requested, ['rev-parse', '--show-toplevel']).stdout.toString().replace(/\n$/, '');
  if (!result) throw new SetupError('invalid_repository', 'repo', 'A working tree is required');
  const selected = realpathSync(result), location = relative(selected, requested);
  if (location === '..' || location.startsWith('../') || location.startsWith('..\\') || isAbsolute(location)) throw new SetupError('invalid_repository', 'repo', 'Resolved worktree must contain the explicitly requested directory');
  return selected;
}
export function revision(repo: string, ref: string, field: string) {
  string(ref, field);
  if (ref.startsWith('-')) throw new SetupError('invalid_revision', field, 'Option-like revision rejected');
  const result = git(repo, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`], true);
  if (result.exit !== 0) throw new SetupError('invalid_revision', field, 'Revision must resolve to a commit');
  return result.stdout.toString().trim();
}
export function changes(repo: string, from: string, to: string) {
  const tokens = git(repo, ['diff', '--no-ext-diff', '--no-textconv', '--name-status', '-z', '--find-renames', '--find-copies', '--find-copies-harder', from, to, '--']).stdout.toString().split('\0');
  const result: { status: string; paths: string[] }[] = [];
  for (let i = 0; i < tokens.length - 1;) {
    const status = tokens[i++];
    result.push({ status, paths: /^[RC]/.test(status) ? [tokens[i++], tokens[i++]] : [tokens[i++]] });
  }
  return result;
}
export function dirty(repo: string) {
  // assume-unchanged (lowercase tag) and skip-worktree (S) entries hide edits from status; fail closed.
  const hidden = git(repo, ['ls-files', '-v', '-z']).stdout.toString().split('\0').filter(entry => /^[a-zS] /.test(entry));
  if (hidden.length) throw new SetupError('hidden_index_state', 'repo', 'Index assume-unchanged or skip-worktree entries hide changes from clean checks');
  const tokens = git(repo, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignore-submodules=none']).stdout.toString().split('\0');
  const result: { status: string; paths: string[]; staged: boolean; unstaged: boolean; untracked: boolean }[] = [];
  for (let i = 0; i < tokens.length - 1;) {
    const token = tokens[i++], status = token.slice(0, 2), paths = [token.slice(3)];
    if (/[RC]/.test(status)) paths.push(tokens[i++]);
    result.push({ status, paths, staged: status !== '??' && status[0] !== ' ', unstaged: status !== '??' && status[1] !== ' ', untracked: status === '??' });
  }
  return result;
}
export function diagnostic(error: any): Diagnostic {
  return error instanceof SetupError ? { code: error.code, field: error.field, message: error.message } : { code: 'setup_error', field: 'input', message: 'Input or filesystem operation failed' };
}
// Evidence destination reserved exclusively before any check runs. The descriptor is held for the whole
// run, so a check cannot redirect the final write by replacing the path with a link or another file.
export type Output = { path: string; fd: number; dev: number; ino: number };
export function outputPath(path: string | undefined, repo?: string): Output | undefined {
  if (!path) return undefined;
  const target = resolve(realpathSync(dirname(resolve(path))), relative(dirname(resolve(path)), resolve(path)));
  let exists = false;
  try { lstatSync(target); exists = true; }
  catch (error: any) { if (error.code !== 'ENOENT') throw error; }
  if (exists) throw new SetupError('output_exists', 'output', 'Refusing to overwrite prior evidence');
  if (repo) {
    const gitDirs = ['--absolute-git-dir', '--git-common-dir'].map(option => resolve(repo, git(repo, ['rev-parse', option]).stdout.toString().replace(/\n$/, '')));
    for (const forbidden of [repo, ...gitDirs]) {
      const rel = relative(realpathSync(forbidden), target);
      if (!rel.startsWith('../') && !isAbsolute(rel)) throw new SetupError('invalid_output', 'output', 'Evidence output must be outside the checkout and Git metadata');
    }
  }
  let fd: number;
  try { fd = openSync(target, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600); }
  catch { throw new SetupError('output_error', 'output', 'Cannot create exclusive evidence file'); }
  const { dev, ino } = fstatSync(fd);
  return { path: target, fd, dev, ino };
}
export function emit(result: any, exit: number, output?: Output) {
  if (output) {
    try {
      const now = lstatSync(output.path);
      if (!now.isFile() || now.dev !== output.dev || now.ino !== output.ino) throw new Error('replaced');
      writeSync(output.fd, `${JSON.stringify(result, null, 2)}\n`);
    } catch { result.ok = false; result.diagnostics.push({ code: 'output_error', field: 'output', message: 'Evidence file was replaced or cannot be written' }); exit = 2; }
    finally { try { closeSync(output.fd); } catch {} }
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (exit) process.stderr.write(`Evaluation failed (${exit}); see JSON diagnostics.\n`);
  process.exitCode = exit;
}
