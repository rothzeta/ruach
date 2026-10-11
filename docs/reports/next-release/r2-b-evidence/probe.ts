// Disposable R2-B probe: fake linked create vs Ruach standalone create, with refs/replace at the base.
import { mkdtemp, writeFile, readFile, mkdir, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createLinkedWorktree, createWorktree } from '<repo>/skills/ruach-herdr/scripts/spaces';
const git = Bun.which('git')!;
const g = (cwd: string, ...a: string[]) => { const r = Bun.spawnSync([git, '-C', cwd, ...a], { env: { ...process.env, GIT_AUTHOR_NAME: 'F', GIT_AUTHOR_EMAIL: 'f@e.test', GIT_COMMITTER_NAME: 'F', GIT_COMMITTER_EMAIL: 'f@e.test' } }); if (r.exitCode) throw new Error(a.join(' ') + r.stderr); return r.stdout.toString().trim(); };
const root = await realpath(await mkdtemp(join(tmpdir(), 'r2b-')));
const repo = join(root, 'repo'); await mkdir(repo); g(repo, 'init', '-q', '-b', 'main');
await writeFile(join(repo, 'tracked.txt'), 'ORIGINAL\n'); g(repo, 'add', '.'); g(repo, 'commit', '-q', '-m', 'base');
const base = g(repo, 'rev-parse', 'HEAD');
await writeFile(join(repo, 'tracked.txt'), 'FORGED\n'); g(repo, 'commit', '-qam', 'forged');
const forged = g(repo, 'rev-parse', 'HEAD'); g(repo, 'reset', '-q', '--hard', base); g(repo, 'replace', base, forged);
await writeFile(join(root, 'behavior.json'), JSON.stringify({ git, repo }));
process.env.FIXTURE_ROOT = root;
const out: Record<string, unknown> = { git: g(repo, '--version').toString(), base, forged };
out.refsReplace = g(repo, '--no-replace-objects', 'for-each-ref', '--format=%(refname)', 'refs/replace/');
out.defaultRevParseBase = g(repo, 'rev-parse', base); // replacement honoured by ordinary git
const mk = (n: string) => ({ path: join(root, n), cwd: join(root, n), branch: n, base });
// 1. fake linked: ordinary `git worktree add` as Herdr v0.9.0 source builds it; real Ruach verifyWorktree runs afterwards.
const L = mk('linked'); let linkedError: string | null = null;
try { out.linkedReceipt = await createLinkedWorktree('<tmp>/bin/herdr', repo, 'w1', 'r2-boundary', L); } catch (e: any) { linkedError = String(e?.message ?? e); }
out.linkedError = linkedError;
out.linkedBytes = await readFile(join(L.path, 'tracked.txt'), 'utf8').catch(() => null);
out.linkedHeadNoReplace = g(L.path, '--no-replace-objects', 'rev-parse', 'HEAD');
// 2. standalone Ruach (--no-replace-objects)
const S = mk('standalone'); let standaloneError: string | null = null;
try { await createWorktree(repo, S); } catch (e: any) { standaloneError = String(e?.message ?? e); }
out.standaloneError = standaloneError;
out.standaloneBytes = await readFile(join(S.path, 'tracked.txt'), 'utf8').catch(() => null);
out.standaloneHeadNoReplace = g(S.path, '--no-replace-objects', 'rev-parse', 'HEAD');
// 3. does an env flag reach git? GIT_NO_REPLACE_OBJECTS=1 in the client env passed to the fake (a child of the caller)
process.env.GIT_NO_REPLACE_OBJECTS = '1';
const E = mk('linked-env');
try { await createLinkedWorktree('<tmp>/bin/herdr', repo, 'w1', 'r2-boundary', E); } catch {}
out.linkedWithClientEnvBytes = await readFile(join(E.path, 'tracked.txt'), 'utf8').catch(() => null);
console.log(JSON.stringify(out, null, 2));
