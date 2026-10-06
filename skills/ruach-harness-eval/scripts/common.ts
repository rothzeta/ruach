import { createHash } from 'node:crypto';
import { accessSync, closeSync, writeSync, constants, fstatSync, lstatSync, openSync, readdirSync, readFileSync, readlinkSync, readSync, statSync, realpathSync } from 'node:fs';
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
  const child = spawnSync(command, ['--no-replace-objects', '-c', 'core.fsmonitor=false', '-c', 'core.untrackedCache=false', '-c', 'core.ignorecase=false', '-C', repo, ...argv], { env, maxBuffer: 32 * 1024 * 1024 });
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
// Bounds for one dirty() call (A4 consistency): paths per listing and bytes hashed. Exceeding either is a
// setup error, never "clean". The check streams file bytes, so memory does not depend on file size.
export const CLEAN_ENTRY_LIMIT = 100_000;
export const CLEAN_HASH_LIMIT = 1024 * 1024 * 1024;
export type Dirt = { status: string; paths: string[]; staged: boolean; unstaged: boolean; untracked: boolean };
type Manifest = { mode: string; oid: string; size?: number };
type Context = { format: string; hashed: number; depth: number };
const budget = (what: string) => new SetupError('clean_check_budget', 'repo', `Clean check exceeded its ${what} budget; the checkout is not assessed as clean`);
const typeOf = (mode: string) => mode === '160000' ? 'gitlink' : mode === '120000' ? 'symlink' : 'file';
function split(output: Buffer): string[] {
  const entries = output.toString().split('\0'); entries.pop();
  if (entries.length > CLEAN_ENTRY_LIMIT) throw budget('entry');
  return entries;
}
// Observe one worktree path from raw bytes and file types only: never the index stat data, Git attributes,
// filters or comparison settings. Returns undefined when absent, 'special' for non-regular files (never opened),
// 'directory', or the mode/oid/size of a regular file or symlink. A read that cannot be verified is 'unreadable'.
type Observed = undefined | 'special' | 'directory' | 'unreadable' | 'empty-directory' | { mode: string; oid: string; size: number };
function blobHash(context: Context, size: number) { return createHash(context.format).update(`blob ${size}\0`); }
function observe(repo: string, path: string, context: Context, directories: Map<string, boolean>, expectedSize?: number): Observed {
  const parts = path.split('/');
  for (let i = 1; i < parts.length; i++) {
    const prefix = parts.slice(0, i).join('/');
    let ok = directories.get(prefix);
    if (ok === undefined) { try { ok = lstatSync(resolve(repo, prefix)).isDirectory(); } catch { ok = false; } directories.set(prefix, ok); }
    if (!ok) return undefined;
  }
  const full = resolve(repo, path);
  let stat;
  try { stat = lstatSync(full); } catch { return undefined; }
  if (stat.isDirectory()) { try { return readdirSync(full).length === 0 ? 'empty-directory' : 'directory'; } catch { return 'directory'; } }
  if (stat.isSymbolicLink()) {
    try { const target = readlinkSync(full, { encoding: 'buffer' }); return { mode: '120000', oid: blobHash(context, target.length).update(target).digest('hex'), size: target.length }; }
    catch { return 'unreadable'; }
  }
  if (!stat.isFile()) return 'special';
  const mode = stat.mode & 0o100 ? '100755' : '100644';
  // A differing size already proves a difference from a same-size committed blob, so skip reading it.
  if (expectedSize !== undefined && stat.size !== expectedSize) return { mode, oid: '', size: stat.size };
  context.hashed += stat.size;
  if (context.hashed > CLEAN_HASH_LIMIT) throw budget('hash');
  let fd: number | undefined;
  try {
    fd = openSync(full, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const opened = fstatSync(fd);
    if (!opened.isFile() || opened.dev !== stat.dev || opened.ino !== stat.ino || opened.size !== stat.size) return 'unreadable';
    const hasher = blobHash(context, opened.size), chunk = Buffer.allocUnsafe(1024 * 1024);
    let total = 0;
    for (;;) {
      const count = readSync(fd, chunk, 0, chunk.length, null);
      if (count === 0) break;
      total += count; if (total > opened.size) return 'unreadable';
      hasher.update(chunk.subarray(0, count));
    }
    return total === opened.size ? { mode, oid: hasher.digest('hex'), size: total } : 'unreadable';
  } catch { return 'unreadable'; }
  finally { if (fd !== undefined) try { closeSync(fd); } catch {} }
}
function cleanCheck(repo: string, context: Context): Dirt[] {
  if (context.depth > 4) throw budget('submodule depth');
  const format = git(repo, ['rev-parse', '--show-object-format']).stdout.toString().trim();
  if (format !== 'sha1' && format !== 'sha256') throw new SetupError('git_error', 'repo', 'Unsupported object format');
  context.format = format;
  // H: the HEAD tree. I: index entries, used only to tell staged from unstaged, never to make a path clean.
  const head = new Map<string, Manifest>(), index = new Map<string, Manifest>(), unmerged = new Set<string>();
  for (const entry of split(git(repo, ['ls-tree', '-r', '-l', '-z', '--full-tree', 'HEAD']).stdout)) {
    const tab = entry.indexOf('\t'), [mode, , oid, size] = entry.slice(0, tab).split(/\s+/);
    head.set(entry.slice(tab + 1), { mode, oid, size: size === '-' ? undefined : Number(size) });
  }
  for (const entry of split(git(repo, ['ls-files', '-s', '-z']).stdout)) {
    const tab = entry.indexOf('\t'), [mode, oid, stage] = entry.slice(0, tab).split(' '), path = entry.slice(tab + 1);
    if (stage !== '0') unmerged.add(path); else index.set(path, { mode, oid });
  }
  const paths = [...new Set([...head.keys(), ...index.keys(), ...unmerged])].sort();
  const records: Dirt[] = [], directories = new Map<string, boolean>(), seen = new Set<string>();
  const emit = (status: string, path: string) => {
    seen.add(path);
    records.push({ status, paths: [path], staged: status !== '??' && status[0] !== ' ', unstaged: status !== '??' && status[1] !== ' ', untracked: status === '??' });
  };
  for (const path of paths) {
    if (unmerged.has(path)) { emit('UU', path); continue; }
    const h = head.get(path), i = index.get(path);
    let x = ' ', y = ' ';
    if (!h && i) x = 'A'; else if (h && !i) x = 'D';
    else if (h && i && (typeOf(h.mode) !== typeOf(i.mode))) x = 'T';
    else if (h && i && (h.mode !== i.mode || h.oid !== i.oid)) x = 'M';
    if (i) {
      if (i.mode === '160000') y = submodule(repo, path, i, context, directories);
      else {
        const same = h && h.mode === i.mode && h.oid === i.oid;
        const w = observe(repo, path, context, directories, same ? h.size : undefined);
        if (w === undefined || w === 'directory' || w === 'empty-directory') y = 'D';
        else if (w === 'special' || (w !== 'unreadable' && typeOf(w.mode) !== typeOf(i.mode))) y = 'T';
        else if (w === 'unreadable' || w.mode !== i.mode || w.oid !== i.oid) y = 'M';
      }
    }
    if (x !== ' ' || y !== ' ') emit(x + y, path);
  }
  // Untracked files. Ignore rules come only from .gitignore files that are tracked, in HEAD and unchanged;
  // info/exclude and core.excludesFile are never read (no --exclude-standard).
  const ignoreFile = (path: string) => path === '.gitignore' || path.endsWith('/.gitignore');
  const others = split(git(repo, ['ls-files', '-z', '--others', '--exclude-per-directory=.gitignore']).stdout);
  const hiddenIgnores = split(git(repo, ['ls-files', '-z', '--others', '--ignored', '--directory', '--exclude-per-directory=.gitignore']).stdout).filter(ignoreFile);
  const untrustedIgnore = records.some(r => ignoreFile(r.paths[0])) || others.some(ignoreFile) || hiddenIgnores.length > 0;
  let untracked = others;
  if (untrustedIgnore) {
    // A modified, staged, deleted or untracked .gitignore may be hiding files: report every untracked file.
    untracked = [...new Set([...others, ...hiddenIgnores, ...split(git(repo, ['ls-files', '-z', '--others']).stdout)])];
    if (untracked.length > CLEAN_ENTRY_LIMIT) throw budget('entry');
  }
  for (const path of untracked) if (!seen.has(path)) emit('??', path);
  return records.sort((a, b) => a.paths[0] < b.paths[0] ? -1 : a.paths[0] > b.paths[0] ? 1 : 0);
}
// Gitlink state: absent, not a repository, other commit, or any inner change.
function submodule(repo: string, path: string, entry: Manifest, context: Context, directories: Map<string, boolean>): string {
  const w = observe(repo, path, context, directories);
  if (w === undefined) return 'D';
  if (w === 'empty-directory') return ' ';
  if (w !== 'directory') return 'T';
  const inner = resolve(repo, path);
  try {
    lstatSync(resolve(inner, '.git'));
    if (realpathSync(root(inner)) !== realpathSync(inner)) return 'T';
    if (git(inner, ['rev-parse', '--verify', 'HEAD'], true).stdout.toString().trim() !== entry.oid) return 'M';
    return cleanCheck(inner, { format: context.format, hashed: context.hashed, depth: context.depth + 1 }).length ? 'M' : ' ';
  } catch (error) { if (error instanceof SetupError && error.code === 'clean_check_budget') throw error; return 'T'; }
}
// Cleanliness is decided from committed objects and raw worktree bytes only. The index can never make a path
// clean and no stat data, index flag, comparison setting, attribute or exclude file is consulted
// (docs/design/0.3-clean-check.md). Comparison is byte-exact: a checkout whose working copies are converted
// (CRLF, expanded $Id$, filters, other encodings) reads as dirty.
export function dirty(repo: string): Dirt[] { return cleanCheck(repo, { format: 'sha1', hashed: 0, depth: 0 }); }
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
