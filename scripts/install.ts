#!/usr/bin/env bun
// Install/check a committed Ruach snapshot without touching consumer policy.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { accessSync, chmodSync, constants, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { parseArgs } from 'node:util';

const ORIGIN = 'https://github.com/rothzeta/ruach.git', METADATA = 'ruach.json', STAGING = '.ruach-staging';
const EXTRAS: Record<string, string> = { 'scripts/install.ts': 'ruach-install.ts', LICENSE: 'ruach/LICENSE', 'PROVENANCE.md': 'ruach/PROVENANCE.md' };
const IGNORED = new Set(['node_modules', '__pycache__']);
type FileRecord = { sha256: string; mode: number };
type Manifest = { schema_version: 1; origin: string; version?: string; revision: string; files: Record<string, FileRecord> };
type Snapshot = Map<string, { body: Buffer; mode: number }>;
type Options = { target: string; source?: string; version?: string; revision?: string; replace?: boolean };
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function git(source: string, args: string[], input?: string): Buffer {
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.toUpperCase().startsWith('GIT_')));
  const result = spawnSync('git', ['--no-replace-objects', '-C', source, ...args], { input, env, maxBuffer: 128 * 1024 * 1024 });
  // Git stderr may contain source/host configuration; do not echo it.
  if (result.error || result.status !== 0) throw new Error('Git source/revision unavailable');
  return result.stdout;
}
function digest(body: Buffer) { return createHash('sha256').update(body).digest('hex'); }
function stat(path: string) {
  try { return lstatSync(path); }
  catch (error: any) { if (error.code === 'ENOENT') return undefined; throw error; }
}
function safeParts(name: string): string[] {
  const parts = name.split('/');
  if (isAbsolute(name) || name.includes('\\') || name.includes('\0') || parts.some(p => !p || p === '.' || p === '..')) throw new Error('Invalid managed snapshot path');
  return parts;
}
function destination(target: string, name: string): string {
  const parts = safeParts(name);
  // Accept the previous installer name so updates can prune old snapshots.
  if (!['agents', 'skills', 'ruach'].includes(parts[0]) && !['ruach-install.ts', 'ruach-install.py'].includes(name)) throw new Error('Invalid managed snapshot path');
  const dest = join(target, ...parts);
  for (let current = dest;; current = dirname(current)) {
    if (stat(current)?.isSymbolicLink()) throw new Error('Snapshot destinations must not be symlinks');
    if (dirname(current) === current) break;
  }
  return dest;
}
function committed(source: string, revision: string): { sha: string; files: Snapshot; version?: string } {
  const sha = git(source, ['rev-parse', '--verify', '--end-of-options', `${revision}^{commit}`]).toString().trim();
  const entries = git(source, ['ls-tree', '-r', '-z', sha, '--', 'agents', 'skills', 'package.json', ...Object.keys(EXTRAS)])
    .toString().split('\0').filter(Boolean).map(entry => {
      const match = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(entry);
      if (!match || match[2] !== 'blob' || !['100644', '100755'].includes(match[1])) throw new Error('Source tree must contain only safe regular files');
      const [, mode, , oid, name] = match;
      if (safeParts(name).some(part => IGNORED.has(part))) throw new Error('Source tree contains installed dependencies or cache');
      return { mode: mode === '100755' ? 0o755 : 0o644, oid, name: EXTRAS[name] ?? name };
    });
  // Batch reads preserve binary bytes and avoid a process per resource. Nothing is extracted to disk.
  const bodies = git(source, ['cat-file', '--batch'], entries.map(entry => entry.oid + '\n').join(''));
  const files: Snapshot = new Map();
  let version: string | undefined;
  let offset = 0;
  for (const entry of entries) {
    const end = bodies.indexOf(10, offset);
    const header = /^(\S+) blob (\d+)$/.exec(bodies.subarray(offset, end).toString());
    if (end < offset || !header || header[1] !== entry.oid) throw new Error('Invalid committed file response');
    const size = Number(header[2]), start = end + 1;
    if (!Number.isSafeInteger(size) || start + size >= bodies.length || bodies[start + size] !== 10) throw new Error('Invalid committed file response');
    const body = bodies.subarray(start, start + size);
    if (entry.name === 'package.json') version = JSON.parse(body.toString()).version;
    else files.set(entry.name, { body, mode: entry.mode });
    offset = start + size + 1;
  }
  if (!Object.values(EXTRAS).every(name => files.has(name)) || ![...files.keys()].some(p => p.startsWith('agents/')) || ![...files.keys()].some(p => p.startsWith('skills/'))) throw new Error('Source commit lacks required resources');
  return { sha, files, version };
}
function manifest(sha: string, files: Snapshot, version?: string): Manifest {
  return { schema_version: 1, origin: ORIGIN, ...(version ? { version } : {}), revision: sha,
    files: Object.fromEntries([...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, { body, mode }]) => [name, { sha256: digest(body), mode }])) };
}
function object(value: unknown): value is Record<string, any> { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function load(target: string): Manifest {
  const path = join(target, METADATA);
  if (stat(path)?.isSymbolicLink()) throw new Error('Snapshot metadata must not be a symlink');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (!object(data) || data.schema_version !== 1 || data.origin !== ORIGIN || typeof data.revision !== 'string' || !/^[0-9a-f]{40}$/.test(data.revision)) throw new Error('Invalid snapshot metadata');
  if (!object(data.files) || !Object.keys(data.files).length) throw new Error('Invalid snapshot file manifest');
  if (data.version !== undefined && (typeof data.version !== 'string' || !VERSION.test(data.version))) throw new Error('Invalid snapshot release version');
  for (const [name, expected] of Object.entries(data.files)) {
    destination(target, name);
    if (!object(expected) || Object.keys(expected).sort().join(',') !== 'mode,sha256' || typeof expected.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(expected.sha256) || ![0o644, 0o755].includes(expected.mode)) throw new Error('Invalid snapshot file record');
  }
  return data as Manifest;
}
function* walk(directory: string, prefix: string): Generator<string> {
  if (!stat(directory)?.isDirectory()) return;
  for (const name of readdirSync(directory).sort()) {
    if (IGNORED.has(name) || name.endsWith('.pyc')) continue;
    const path = join(directory, name), relative = `${prefix}/${name}`, info = stat(path);
    yield relative;
    if (info?.isDirectory()) yield* walk(path, relative);
  }
}
function drift(target: string, data: Manifest, extraSkills: Iterable<string> = []): string[] {
  const problems = new Set<string>();
  for (const [name, expected] of Object.entries(data.files)) {
    const path = destination(target, name), info = stat(path);
    if (!info?.isFile() || digest(readFileSync(path)) !== expected.sha256 || (info.mode & 0o111 ? 0o755 : 0o644) !== expected.mode) problems.add(name);
  }
  // New files within managed skills are drift; extra consumer skills/roles are allowed.
  const skills = new Set([...Object.keys(data.files).filter(name => name.startsWith('skills/')).map(name => name.split('/')[1]), ...extraSkills]);
  for (const skill of skills) for (const name of walk(join(target, 'skills', skill), `skills/${skill}`)) {
    const info = stat(join(target, name));
    if (info?.isSymbolicLink() || info?.isFile() && !Object.hasOwn(data.files, name)) problems.add(name);
  }
  return [...problems].sort();
}
const skillRoots = (names: Iterable<string>) => new Set([...names].filter(name => name.startsWith('skills/')).map(name => name.split('/')[1]));
class RollbackIncomplete extends Error {}
type Step = { kind: 'mkdir'; path: string } | { kind: 'backup'; path: string; saved: string } | { kind: 'place'; path: string; dev: number; ino: number };
// Undo this run's steps in reverse, once each; never delete recursively or follow links. Returns paths needing manual recovery.
function rollback(done: Step[]): string[] {
  const failed: string[] = [];
  for (const step of done.reverse()) {
    try {
      if (step.kind === 'place') {
        const info = stat(step.path);
        if (!info) continue;
        if (!info.isFile() || info.dev !== step.dev || info.ino !== step.ino) throw new Error('changed');
        unlinkSync(step.path);
      } else if (step.kind === 'backup') {
        if (stat(step.path)) throw new Error('occupied');
        renameSync(step.saved, step.path);
      } else rmdirSync(step.path);
    } catch { failed.push(step.path); }
  }
  return failed;
}
function install(options: Options) {
  if (options.version !== undefined && !VERSION.test(options.version)) throw new Error('Release version must be MAJOR.MINOR.PATCH');
  const ref = options.version !== undefined ? `refs/tags/v${options.version}` : options.revision!;
  const target = resolve(options.target), { sha, files, version } = committed(options.source!, ref), staging = join(target, STAGING);
  if (options.version !== undefined && version !== options.version) throw new Error('Release tag does not match the committed package version');
  if (stat(staging)) throw new Error(`Interrupted install: ${STAGING} exists in the target; recover or remove it before installing`);
  if (stat(join(target, METADATA))?.isSymbolicLink()) throw new Error('Snapshot metadata must not be a symlink');
  const old = existsSync(join(target, METADATA)) ? load(target) : undefined;
  const roots = skillRoots([...Object.keys(old?.files ?? {}), ...files.keys()]);
  const problems = old ? drift(target, old, roots) : [];
  const known = new Set([...Object.keys(old?.files ?? {}), ...files.keys()]);
  const leftovers = new Set<string>();
  for (const skill of roots) for (const name of walk(join(target, 'skills', skill), `skills/${skill}`)) {
    const info = stat(join(target, name));
    if (info?.isSymbolicLink() || info && !info.isFile() && !info.isDirectory()) throw new Error('Skill roots contain a non-regular entry; remove it manually');
    if (info?.isFile() && !known.has(name)) leftovers.add(name);
  }
  if ((problems.length || leftovers.size) && !options.replace) throw new Error('Installed snapshot has drift or unrecorded files; use --replace to overwrite explicitly');
  for (const [name, { body }] of files) {
    const path = destination(target, name), info = stat(path);
    if (info && !info.isFile()) throw new Error('Managed destination is not a regular file');
    if (info && (!old || !Object.hasOwn(old.files, name)) && !readFileSync(path).equals(body) && !options.replace) throw new Error('Conflicting destination; use --replace to adopt explicitly');
    // A file standing where a parent directory is needed would fail mid-commit.
    for (let parent = dirname(path); parent !== target && parent.startsWith(target); parent = dirname(parent)) if (stat(parent) && !stat(parent)!.isDirectory()) throw new Error('Managed destination parent is not a directory');
  }
  const removals = new Set<string>();
  if (old) {
    if (options.replace) for (const name of problems) if (!Object.hasOwn(old.files, name) && !files.has(name)) removals.add(name);
    for (const name of Object.keys(old.files)) if (!files.has(name)) removals.add(name);
  }
  if (options.replace) for (const name of leftovers) removals.add(name);
  // Validate every removal before mutation, including obsolete managed paths.
  const paths = [...removals].map(name => destination(target, name));
  for (const path of paths) if (stat(path) && !stat(path)!.isFile()) throw new Error('Managed destination is not a regular file');
  const next = JSON.stringify(manifest(sha, files, options.version), null, 2) + '\n';
  type Operation = { index: number; name: string; path: string; kind: 'create' | 'replace' | 'remove'; body?: Buffer; mode?: number };
  const operations: Operation[] = [...removals].filter(name => stat(destination(target, name))).map((name): Omit<Operation, 'index'> => ({ name, path: destination(target, name), kind: 'remove' }))
    .concat([...files].map(([name, { body, mode }]) => ({ name, path: destination(target, name), kind: stat(destination(target, name)) ? 'replace' as const : 'create' as const, body, mode })))
    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    .concat([{ name: METADATA, path: join(target, METADATA), kind: stat(join(target, METADATA)) ? 'replace' as const : 'create' as const, body: Buffer.from(next), mode: 0o644 }])
    .map((operation, index) => ({ ...operation, index }));
  // The exclusive mkdir is both the concurrency lock and the marker of an interrupted install.
  mkdirSync(target, { recursive: true });
  try { mkdirSync(staging); }
  catch (error: any) { throw error.code === 'EEXIST' ? new Error(`Interrupted install: ${STAGING} exists in the target`) : error; }
  const saved = (operation: Operation) => join(staging, 'old', String(operation.index)), fresh = (operation: Operation) => join(staging, 'new', String(operation.index));
  try {
    mkdirSync(join(staging, 'new')); mkdirSync(join(staging, 'old'));
    for (const operation of operations) if (operation.body) {
      writeFileSync(fresh(operation), operation.body, { flag: 'wx' });
      chmodSync(fresh(operation), operation.mode!);
    }
    writeFileSync(join(staging, 'journal.json'), JSON.stringify({ schema_version: 1, operations: operations.map(({ index, name, kind }) => ({ index, path: name, kind })) }, null, 2) + '\n');
  } catch (error) { rmSync(staging, { recursive: true, force: true }); throw error; }
  const done: Step[] = [];
  try {
    const made = new Set<string>();
    for (const operation of operations) if (operation.body) {
      const missing: string[] = [];
      for (let parent = dirname(operation.path); parent !== target && !made.has(parent) && !stat(parent); parent = dirname(parent)) missing.unshift(parent);
      for (const parent of missing) { mkdirSync(parent); made.add(parent); done.push({ kind: 'mkdir', path: parent }); }
    }
    for (const operation of operations) if (operation.kind !== 'create') {
      renameSync(operation.path, saved(operation)); done.push({ kind: 'backup', path: operation.path, saved: saved(operation) });
    }
    for (const operation of operations) if (operation.body) {
      const info = lstatSync(fresh(operation));
      renameSync(fresh(operation), operation.path); done.push({ kind: 'place', path: operation.path, dev: info.dev, ino: info.ino });
    }
    load(target);
    const remaining = drift(target, manifest(sha, files, options.version), roots);
    if (remaining.length || readFileSync(join(target, METADATA), 'utf8') !== next) throw new Error('Installed tree does not match the manifest: ' + remaining.join(', '));
  } catch (error) {
    const failed = rollback(done);
    if (!failed.length) { rmSync(staging, { recursive: true, force: true }); throw new Error('Install failed and was rolled back; the target is unchanged: ' + (error instanceof Error ? error.message : String(error))); }
    throw new RollbackIncomplete(`Install failed and rollback is incomplete; manual recovery needed using ${staging}/journal.json and ${staging}/old. Unrestored: ${failed.join(', ')}`);
  }
  console.log(`Installed ${files.size} files from ${options.version ? `v${options.version}` : sha}`);
  try { rmSync(staging, { recursive: true }); }
  catch { console.error(`Warning: the install is verified, but ${staging} could not be removed; delete it before the next install.`); }
}
// ---- ready: read-only readiness report. It only reads files and runs `--version` probes. ----
type Check = { ready: boolean; missing: string[]; warnings: string[] };
type Item = { name: string; path: string; version?: string };
type Location = { scope: string; kind: 'skills' | 'agents'; path: string; items: Item[] };
type PackageReport = { skill: string; path: string; state: 'ready' | 'missing' | 'mismatched' | 'no-dependencies'; remediation?: string };
const ROLES = ['architect', 'coordinator', 'implementer', 'librarian', 'reviewer', 'scout'];
const ROUTES = ['skill', 'native', 'herdr'] as const;
class UsageError extends Error {}
const home = () => process.env.HOME || homedir();
function tilde(path: string): string { const h = home(); return h && h !== '/' && (path === h || path.startsWith(h + '/')) ? '~' + path.slice(h.length) : path; }
function shellWord(path: string): string { return /^[\w@%+=:,./-]+$/.test(path) ? path : `'${path.replaceAll("'", "'\\''")}'`; }
function which(name: string): string | undefined {
  for (const directory of (process.env.PATH ?? '').split(':').filter(Boolean)) {
    const path = join(directory, name);
    try { if (statSync(path).isFile()) { accessSync(path, constants.X_OK); return path; } } catch {}
  }
}
function probe(name: string, run: boolean): { name: string; found: boolean; path?: string; version?: string } {
  const path = which(name);
  if (!path) return { name, found: false };
  if (!run) return { name, found: true, path: tilde(path) };
  const result = spawnSync(path, ['--version'], { encoding: 'utf8', timeout: 5000 });
  const version = (result.stdout ?? '').trim().split('\n')[0] || undefined;
  return result.status === 0 ? { name, found: true, path: tilde(path), ...(version ? { version } : {}) } : { name, found: false, path: tilde(path) };
}
function frontmatterName(file: string): string | undefined {
  try { return /^name:\s*["']?([^\s"']+)/m.exec(readFileSync(file, 'utf8').split('\n').slice(0, 20).join('\n'))?.[1]; } catch { return undefined; }
}
function readJson(path: string): any { try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return undefined; } }
// Unreadable existing locations are inspection failures (exit 3), absent ones are simply empty.
function entries(directory: string): string[] {
  try { return readdirSync(directory).sort(); } catch (error: any) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return []; throw error; }
}
function scan(scope: string, kind: 'skills' | 'agents', directory: string): Location | undefined {
  const items: Item[] = [];
  for (const entry of entries(directory)) {
    const path = join(directory, entry);
    if (kind === 'skills') {
      const skill = join(path, 'SKILL.md');
      if (!existsSync(skill)) continue;
      items.push({ name: frontmatterName(skill) ?? entry, path: tilde(path), ...(readJson(join(path, 'package.json'))?.version ? { version: readJson(join(path, 'package.json')).version } : {}) });
    } else if (entry.endsWith('.md')) items.push({ name: frontmatterName(path) ?? entry.slice(0, -3), path: tilde(path) });
  }
  return items.length ? { scope, kind, path: tilde(directory), items } : undefined;
}
function packageState(directory: string): PackageReport['state'] {
  const dependencies = Object.keys(readJson(join(directory, 'package.json'))?.dependencies ?? {});
  if (!dependencies.length) return 'no-dependencies';
  const lock = readFileSync(join(directory, 'bun.lock'), 'utf8');
  let mismatched = false;
  for (const dependency of dependencies) {
    const escaped = dependency.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const locked = new RegExp(`^\\s*"${escaped}": \\["${escaped}@([^"]+)"`, 'm').exec(lock)?.[1];
    const installed = readJson(join(directory, 'node_modules', dependency, 'package.json'))?.version;
    if (installed === undefined) return 'missing';
    if (installed !== locked) mismatched = true;
  }
  return mismatched ? 'mismatched' : 'ready';
}
function gitState(root: string) {
  const path = which('git');
  if (!path) return {};
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.toUpperCase().startsWith('GIT_')));
  const run = (args: string[]) => spawnSync(path, ['--no-replace-objects', '--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', 'core.untrackedCache=false', '-C', root, ...args], { env, encoding: 'utf8', timeout: 5000 });
  const head = run(['rev-parse', 'HEAD']), status = run(['status', '--porcelain']);
  return { ...(head.status === 0 ? { revision: head.stdout.trim() } : {}), ...(status.status === 0 ? { dirty: status.stdout.trim() !== '' } : {}) };
}
function ready(argv: string[]): { report: any; code: number } {
  let values;
  try { values = parseArgs({ args: argv, strict: true, allowPositionals: false, options: { route: { type: 'string' }, json: { type: 'boolean' }, project: { type: 'string' }, skills: { type: 'string', multiple: true } } }).values; }
  catch (error) { throw new UsageError(error instanceof Error ? error.message : String(error)); }
  if (values.route !== undefined && !(ROUTES as readonly string[]).includes(values.route)) throw new UsageError('--route must be skill, native or herdr');
  const dir = import.meta.dir, root = dirname(dir);
  let active: any, scope: string, copy: string;
  if (existsSync(join(dir, METADATA))) {
    scope = 'snapshot'; copy = dir;
    const data = load(dir); let integrity: string;
    try {
      if (stat(join(dir, STAGING))) throw new Error(`interrupted install: ${STAGING} present`);
      const problems = drift(dir, data);
      integrity = problems.length ? 'drift: ' + problems.join(', ') : 'ok';
    } catch (error) { integrity = 'failed: ' + (error instanceof Error ? error.message : String(error)); }
    active = { kind: 'snapshot', version: data.version, revision: data.revision, path: tilde(dir), integrity };
  } else if (existsSync(join(root, '.git'))) {
    scope = 'source'; copy = root;
    active = { kind: 'source', version: readJson(join(root, 'package.json'))?.version, path: tilde(root), ...gitState(root) };
  } else {
    scope = 'plugin'; copy = root;
    active = { kind: 'plugin', version: readJson(join(root, '.claude-plugin', 'plugin.json'))?.version, path: tilde(root) };
  }
  const locations: Location[] = [], seen = new Set<string>();
  const add = (where: string, kind: 'skills' | 'agents', directory: string) => {
    let real: string;
    try { real = realpathSync(directory); } catch { return; }
    if (seen.has(kind + real)) return;
    seen.add(kind + real);
    const location = scan(where, kind, directory);
    if (location) locations.push(location);
  };
  add(scope, 'skills', join(copy, 'skills')); add(scope, 'agents', join(copy, 'agents'));
  const project = resolve(values.project ?? process.cwd()), codex = process.env.CODEX_HOME || join(home(), '.codex');
  for (const [where, kind, directory] of [['project', 'skills', join(project, '.agents/skills')], ['project', 'agents', join(project, '.agents/agents')], ['project', 'skills', join(project, '.claude/skills')],
    ['user', 'skills', join(home(), '.claude/skills')], ['user', 'skills', join(home(), '.agents/skills')], ['user', 'skills', join(codex, 'skills')]] as const) add(where, kind, directory);
  for (const directory of values.skills ?? []) add('extra', 'skills', resolve(directory));
  const roleNames = new Set([...ROLES, ...(locations.find(l => l.scope === scope && l.kind === 'agents')?.items.map(i => i.name) ?? [])]);
  const ruachSkills = locations.filter(l => l.kind === 'skills').flatMap(l => l.items.filter(i => i.name.startsWith('ruach-')).map(i => ({ ...i, scope: l.scope })));
  const ruachRoles = locations.filter(l => l.kind === 'agents').flatMap(l => l.items.filter(i => roleNames.has(i.name)).map(i => ({ ...i, scope: l.scope })));
  const packages: PackageReport[] = [];
  const absolute = (shown: string) => shown.startsWith('~') ? home() + shown.slice(1) : shown;
  for (const skill of ruachSkills) {
    const directory = absolute(skill.path);
    if (!existsSync(join(directory, 'package.json')) || !existsSync(join(directory, 'bun.lock'))) continue;
    const state = packageState(directory);
    packages.push({ skill: skill.name, path: skill.path, state, ...(state === 'missing' || state === 'mismatched' ? { remediation: `(cd ${shellWord(directory)} && bun install --frozen-lockfile)` } : {}) });
  }
  const prerequisites = [probe('bun', true), probe('git', true), probe('herdr', true), probe('claude', false), probe('codex', false), ...(scope === 'source' ? [probe('just', false)] : [])]
    .map(item => ({ ...item, ...(item.name === 'herdr' ? { session: Boolean(process.env.HERDR_ENV) } : {}) }));
  const found = (name: string) => prerequisites.find(item => item.name === name)?.found;
  const duplicates = new Map<string, string[]>();
  for (const item of [...ruachSkills.map(i => ({ ...i, label: 'skill' })), ...ruachRoles.map(i => ({ ...i, label: 'role' }))]) duplicates.set(`${item.label} ${item.name}`, [...duplicates.get(`${item.label} ${item.name}`) ?? [], item.path]);
  const warnings = [...duplicates].filter(([, paths]) => paths.length > 1).map(([name, paths]) => `duplicate ${name}: ${paths.join(', ')}`);
  const needsPackages = (name: string, missing: string[]) => {
    const copies = packages.filter(p => p.skill === name);
    if (copies.length && !copies.some(p => p.state === 'ready' || p.state === 'no-dependencies')) missing.push(`${name} packages ${copies[0].state}: ${copies[0].remediation}`);
  };
  const skill: Check = { ready: false, missing: [], warnings: [...warnings] };
  if (!found('bun')) skill.missing.push('bun not found or not working');
  if (!ruachSkills.length) skill.missing.push('no Ruach skills located');
  for (const name of new Set(ruachSkills.map(i => i.name))) needsPackages(name, skill.missing);
  const native: Check = { ready: false, missing: [...skill.missing], warnings: [...warnings] };
  if (!ruachRoles.length) native.missing.push('no Ruach roles located');
  if (active.integrity && active.integrity !== 'ok') native.missing.push('snapshot integrity ' + active.integrity);
  if (!prerequisites.find(i => i.name === 'claude')?.found) native.warnings.push('claude not found on PATH');
  const herdr: Check = { ready: false, missing: [...native.missing], warnings: [...native.warnings] };
  if (!found('git')) herdr.missing.push('git not found or not working');
  if (!found('herdr')) herdr.missing.push('herdr not found or not working');
  if (!ruachSkills.some(i => i.name === 'ruach-herdr')) herdr.missing.push('ruach-herdr not located');
  if (!process.env.HERDR_ENV) herdr.warnings.push('live launch needs a Herdr session');
  const routes = { skill, native, herdr };
  for (const check of Object.values(routes)) check.ready = !check.missing.length;
  const report = { schema_version: 1, active, locations, packages, prerequisites, routes };
  const code = values.route && !routes[values.route as keyof typeof routes].ready ? 1 : 0;
  if (values.json) return { report: JSON.stringify(report, null, 2), code };
  const lines = [`Active: ${active.kind} ${active.version ? 'v' + active.version : ''} ${active.revision ?? ''} at ${active.path}${active.dirty ? ' (dirty)' : ''}`.replace(/ +/g, ' ')];
  if (active.integrity) lines.push(`  ${active.integrity === 'ok' ? 'ok' : 'missing'} integrity: ${active.integrity}`);
  lines.push('Locations:', ...locations.map(l => `  ok ${l.kind} (${l.scope}) ${l.path}: ${l.items.map(i => i.name).join(', ')}`));
  lines.push('Nested packages:', ...packages.map(p => `  ${p.state === 'ready' || p.state === 'no-dependencies' ? 'ok' : 'missing'} ${p.skill} ${p.path}: ${p.state}${p.remediation ? ' -> ' + p.remediation : ''}`));
  lines.push('Prerequisites:', ...prerequisites.map(p => `  ${p.found ? 'ok' : ['claude', 'codex', 'just'].includes(p.name) ? 'warn' : 'missing'} ${p.name}${p.version ? ' ' + p.version : ''}${p.path ? ' ' + p.path : ''}`));
  lines.push('Routes:');
  for (const [name, check] of Object.entries(routes)) lines.push(`  ${check.ready ? 'ok' : 'missing'} ${name}`, ...check.missing.map(m => `    missing ${m}`), ...check.warnings.map(w => `    warn ${w}`));
  return { report: lines.join('\n'), code };
}
function canonical(value: unknown): string {
  if (object(value)) return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
function check(options: Options) {
  const target = resolve(options.target);
  if (stat(join(target, STAGING))) throw new Error(`interrupted install: ${STAGING} present`);
  const data = load(target), problems = drift(target, data);
  if (problems.length) throw new Error('Snapshot drift: ' + problems.join(', '));
  if (options.source) {
    const { sha, files, version } = committed(options.source, data.revision);
    if (data.version !== undefined && data.version !== version) throw new Error('Snapshot version differs from the committed release');
    if (canonical(data) !== canonical(manifest(sha, files, data.version))) throw new Error('Snapshot manifest differs from recorded upstream Git tree');
  }
  console.log(`Snapshot verified: ${data.version ? `v${data.version}` : data.revision} (${Object.keys(data.files).length} files)`);
}
const usage = 'bun install.ts install --source DIR --version VERSION --target DIR [--replace]\nbun ruach-install.ts check --target DIR [--source DIR]\nbun ruach-install.ts ready [--route skill|native|herdr] [--json] [--project DIR] [--skills DIR]\nAdvanced/legacy installation may use --revision COMMIT instead of --version.';
try {
  const [command, ...argv] = process.argv.slice(2);
  if (command === '--help' || (['install', 'check', 'ready'].includes(command) && argv.includes('--help'))) { console.log(usage); process.exit(0); }
  if (command === 'ready') {
    try { const { report, code } = ready(argv); console.log(report); process.exitCode = code; }
    catch (error) {
      console.error('Ready failed: ' + (error instanceof Error ? error.message : String(error)));
      process.exitCode = error instanceof UsageError ? 2 : 3;
    }
    process.exit(process.exitCode);
  }
  if (!['install', 'check'].includes(command)) throw new Error(usage);
  const { values, positionals } = parseArgs({ args: argv, strict: true, allowPositionals: false, options: {
    source: { type: 'string' }, target: { type: 'string' },
    ...(command === 'install' ? { version: { type: 'string' as const }, revision: { type: 'string' as const }, replace: { type: 'boolean' as const } } : {}),
  } });
  if (positionals.length || !values.target || (command === 'install' && (!values.source || (Boolean(values.version) === Boolean(values.revision))))) throw new Error(usage);
  (command === 'install' ? install : check)(values as Options);
} catch (error) {
  console.error('Snapshot failed: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = error instanceof RollbackIncomplete ? 3 : 1;
}
