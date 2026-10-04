import { basename, dirname, join, relative, resolve } from 'node:path';
import { lstat } from 'node:fs/promises';
import { fail } from './contracts';
import { executable, run } from './process';

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
  const checkout = root.stdout.trim();
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
  return { path, cwd: join(path, relative(checkout, cwd)), branch, base: base.stdout.trim() };
}

export async function createWorktree(cwd: string, worktree: Worktree) {
  const result = await run([executable('git'), '-C', cwd, 'worktree', 'add', '-b', worktree.branch, '--', worktree.path, worktree.base], cwd, 30000);
  if (result.exit !== 0 || result.timedOut) fail(4, 'worktree_uncertain', 'Worktree creation failed or timed out; inspect the reported path and branch before retrying', 'worktree');
}
