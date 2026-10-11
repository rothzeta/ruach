// Shared helpers for the offline smoke packet: bounded child processes, Git probes, digests.
import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export const packet = join(import.meta.dir, '..');
export const sourceRoot = join(packet, '..', '..');
export const sha256 = (body: string | Uint8Array) => createHash('sha256').update(body).digest('hex');

/** Environment for a child: inherited minus Git selection variables, plus explicit overrides. */
export function childEnv(overrides: Record<string, string> = {}): Record<string, string> {
  const base = Object.fromEntries(Object.entries(process.env).filter(([k, v]) => v !== undefined && !k.toUpperCase().startsWith('GIT_'))) as Record<string, string>;
  return { ...base, ...overrides };
}

export interface RunResult { argv: string[]; cwd: string; exit: number; timedOut: boolean; stdout: string; stderr: string }

/** Run argv without a shell in its own process group; the group is killed on timeout and always on return. */
export async function run(argv: string[], cwd: string, env: Record<string, string> = childEnv(), timeoutMs = 120000): Promise<RunResult> {
  const proc = Bun.spawn(argv, { cwd, env, stdin: 'ignore', stdout: 'pipe', stderr: 'pipe', detached: true });
  const kill = () => { try { process.kill(-proc.pid, 'SIGKILL'); } catch {} };
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; kill(); }, timeoutMs);
  const collect = async (stream: ReadableStream<Uint8Array>) => {
    const chunks: Uint8Array[] = [];
    try { for await (const chunk of stream) chunks.push(chunk); } catch {}
    return Buffer.concat(chunks).toString('utf8');
  };
  const out = collect(proc.stdout), err = collect(proc.stderr);
  try {
    const exit = await proc.exited;
    // A descendant can hold the pipes open after the child exits: bound the drain, then reap the group.
    const drained = await Promise.race([Promise.all([out, err]).then(() => true), Bun.sleep(1000).then(() => false)]);
    if (!drained) kill();
    const [stdout, stderr] = await Promise.all([Promise.race([out, Bun.sleep(200).then(() => '')]), Promise.race([err, Bun.sleep(200).then(() => '')])]);
    return { argv, cwd, exit: timedOut ? -1 : exit, timedOut, stdout, stderr };
  } finally { clearTimeout(timer); kill(); }
}

export async function git(repo: string, args: string[], extra: string[] = []): Promise<string> {
  const result = await run(['git', '--no-replace-objects', '-c', 'user.name=Smoke Fixture', '-c', 'user.email=smoke@example.test', ...extra, '-C', repo, ...args], repo, childEnv({ GIT_OPTIONAL_LOCKS: '0' }), 30000);
  if (result.exit !== 0) throw new Error(`git ${args[0]} failed (exit ${result.exit})`);
  return result.stdout.trim();
}

/** Regular files under a root as sorted relative paths; symlinks and special files are rejected. */
export function listFiles(root: string): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.name === '.git') continue;
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile()) found.push(relative(root, path));
      else throw new Error(`Unsupported entry in packet tree: ${relative(root, path)}`);
    }
  };
  walk(root);
  return found.sort();
}

export function digests(root: string): Record<string, string> {
  return Object.fromEntries(listFiles(root).map(f => [f, sha256(readFileSync(join(root, f)))]));
}

export function arg(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}
export function isDirectory(path: string) { try { return lstatSync(path).isDirectory(); } catch { return false; } }
