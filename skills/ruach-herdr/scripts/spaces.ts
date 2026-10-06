import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { lstat, realpath } from 'node:fs/promises';
import { fail } from './contracts';
import { executable, json, run } from './process';

export interface Worktree {
  path: string;
  cwd: string;
  branch: string;
  base: string;
}

// Resolve the base now so another process moving HEAD cannot change the launch.
export async function worktreePlan(cwd: string, name: string, values: Record<string, string>): Promise<Worktree> {
  const git = executable('git');
  const root = await run([git, '-C', cwd, 'rev-parse', '--show-toplevel'], cwd);
  if (root.exit !== 0 || root.timedOut) fail(2, 'worktree_repository_required', 'Background worktree launch requires a Git checkout', 'cwd');
  const checkout = await realpath(root.stdout.trim());
  cwd = await realpath(cwd);
  const inside = relative(checkout, cwd);
  if (inside === '..' || inside.startsWith('..' + sep) || isAbsolute(inside)) fail(2, 'worktree_repository_required', 'Launch directory is outside its Git checkout', 'cwd');
  const path = resolve(values.worktree ?? join(dirname(checkout), basename(checkout) + '-worktrees', name));
  if (await lstat(path).catch(error => {
    if (error.code === 'ENOENT') return null;
    return fail(2, 'worktree_path_unavailable', 'Cannot inspect the requested worktree path', 'worktree');
  })) fail(2, 'worktree_exists', 'Worktree destination already exists; choose a fresh name or path', 'worktree');
  const branch = values.branch ?? `ruach/${name}`;
  const valid = await run([git, 'check-ref-format', '--branch', branch], cwd);
  if (branch.startsWith('-') || valid.exit !== 0 || valid.timedOut || valid.stdout.trim() !== branch) fail(2, 'invalid_branch', 'Expected a literal valid Git branch name', 'branch');
  const exists = await run([git, '-C', cwd, 'show-ref', '--verify', '--quiet', `refs/heads/${branch}`], cwd);
  if (exists.exit !== 1 || exists.timedOut) fail(2, 'branch_unavailable', 'Branch exists or cannot be checked; choose a fresh branch', 'branch');
  const base = await run([git, '-C', cwd, 'rev-parse', '--verify', '--end-of-options', `${values.base ?? 'HEAD'}^{commit}`], cwd);
  if (base.exit !== 0 || base.timedOut || !/^[a-f0-9]{40,64}$/.test(base.stdout.trim())) fail(2, 'invalid_base', 'Worktree base must resolve to a commit', 'base');
  return { path, cwd: join(path, inside), branch, base: base.stdout.trim() };
}

// A parent is usable only when Herdr resolves it to a workspace of this same repository.
// Anything else (absent, unreachable, other repository, missing flags) keeps a standalone workspace.
export async function linkedParent(herdr: string, cwd: string, parent: string | undefined): Promise<{ parent: string | null; reason: string | null }> {
  if (!parent) return { parent: null, reason: 'no launching workspace in the Herdr context' };
  const help = await run([herdr, 'worktree', 'create', '--help'], cwd);
  if (help.exit !== 0 || help.timedOut || !['--workspace', '--branch', '--base', '--path', '--label', '--no-focus'].every(flag => help.stdout.includes(flag)))
    return { parent: null, reason: 'installed Herdr lacks linked worktree creation' };
  const listed = await run([herdr, 'worktree', 'list', '--workspace', parent], cwd);
  let key: unknown;
  try { key = json(listed.stdout, 'worktree list').result?.source?.repo_key; } catch {}
  const common = await run([executable('git'), '-C', cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir'], cwd);
  if (listed.exit !== 0 || listed.timedOut || typeof key !== 'string' || common.exit !== 0 || common.timedOut)
    return { parent: null, reason: 'launching workspace is not a Git worktree workspace' };
  const [a, b] = await Promise.all([realpath(key).catch(() => null), realpath(common.stdout.trim()).catch(() => null)]);
  if (!a || a !== b) return { parent: null, reason: 'launching workspace belongs to a different repository' };
  return { parent, reason: null };
}

export async function createWorktree(cwd: string, worktree: Worktree) {
  const result = await run([executable('git'), '-C', cwd, 'worktree', 'add', '-b', worktree.branch, '--', worktree.path, worktree.base], cwd, 30000);
  if (result.exit !== 0 || result.timedOut) fail(4, 'worktree_uncertain', 'Worktree creation failed or timed out; inspect the reported path and branch before retrying', 'worktree');
  await verifyWorktree(worktree);
}

// Registers the checkout with Herdr as a linked worktree of the parent workspace.
export async function createLinkedWorktree(herdr: string, cwd: string, parent: string, label: string, worktree: Worktree): Promise<{ workspace: string; pane: string }> {
  const created = await run([herdr, 'worktree', 'create', '--workspace', parent, '--branch', worktree.branch, '--base', worktree.base, '--path', worktree.path, '--label', label, '--no-focus'], cwd, 30000);
  if (created.exit !== 0 || created.timedOut) fail(4, 'worktree_uncertain', 'Worktree creation failed or timed out; inspect the reported path and branch before retrying', 'worktree');
  await verifyWorktree(worktree);
  let workspace: unknown, pane: unknown, linked: unknown, path: unknown;
  try {
    const result = JSON.parse(created.stdout).result;
    workspace = result?.workspace?.workspace_id; pane = result?.root_pane?.pane_id;
    linked = result?.worktree?.is_linked_worktree; path = result?.worktree?.path;
  } catch {}
  const canonical = async (value: string) => realpath(value).catch(() => null);
  if (typeof workspace !== 'string' || !workspace || typeof pane !== 'string' || !pane || linked !== true || typeof path !== 'string' || await canonical(path) !== await canonical(worktree.path))
    fail(4, 'worktree_uncertain', 'Linked worktree response does not confirm its workspace and checkout; inspect the reported path and branch before retrying', 'worktree');
  return { workspace: workspace as string, pane: pane as string };
}

async function verifyWorktree(worktree: Worktree) {
  // The worker must run inside the checkout just created, not any other repository.
  const git = executable('git');
  const [top, head, cwdTop] = await Promise.all([
    run([git, '-C', worktree.path, 'rev-parse', '--show-toplevel'], worktree.path),
    run([git, '-C', worktree.path, 'rev-parse', 'HEAD'], worktree.path),
    run([git, '-C', worktree.cwd, 'rev-parse', '--show-toplevel'], worktree.path).catch(() => null),
  ]);
  const canonical = async (path: string) => realpath(path).catch(() => null);
  const expected = await canonical(worktree.path);
  if (top.exit !== 0 || head.exit !== 0 || !cwdTop || cwdTop.exit !== 0 || !expected
    || await canonical(top.stdout.trim()) !== expected || await canonical(cwdTop.stdout.trim()) !== expected || head.stdout.trim() !== worktree.base)
    fail(4, 'worktree_uncertain', 'Created worktree identity or launch directory could not be verified; inspect the reported path and branch before retrying', 'worktree');
}
