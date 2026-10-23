#!/usr/bin/env bun
// Offline, deterministic fixture builder for the handoff-delivery packet (evaluator side; withhold from subjects).
//   bun evals/ruach-handoff-delivery/prepare.ts --out <fresh-temp-dir>
// Writes, under the fresh directory only:
//   subject/<case>/task.md + subject/<case>/corpus/   what a subject may see (rendered corpus, real Git repo when the case has one)
//   protected/<case>/corpus/                          byte-identical pristine copy for later comparison
//   evaluator/manifest.json                           refs, digests, modes and per-report validation results
// No model, Herdr or network is used. Child processes are bounded and their process groups killed on return.
import { chmodSync, cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';

const here = import.meta.dir;
const root = resolve(here, '..', '..');
const sha256 = (body: string | Uint8Array) => createHash('sha256').update(body).digest('hex');
// Raw owner evidence, observations and retained artifacts are read-only for the subject.
const PROTECTED = /^(inputs|observations|retained|publications)\//;

interface Result { exit: number; stdout: string; stderr: string; timedOut: boolean }
async function run(argv: string[], cwd: string, env: Record<string, string>, timeoutMs = 60000): Promise<Result> {
  const proc = Bun.spawn(argv, { cwd, env, stdin: 'ignore', stdout: 'pipe', stderr: 'pipe', detached: true });
  const kill = () => { try { process.kill(-proc.pid, 'SIGKILL'); } catch {} };
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; kill(); }, timeoutMs);
  const text = async (s: ReadableStream<Uint8Array>) => { const c: Uint8Array[] = []; try { for await (const x of s) c.push(x); } catch {} return Buffer.concat(c).toString('utf8'); };
  const out = text(proc.stdout), err = text(proc.stderr);
  try {
    const exit = await proc.exited;
    if (!(await Promise.race([Promise.all([out, err]).then(() => true), Bun.sleep(1000).then(() => false)]))) kill();
    const [stdout, stderr] = await Promise.all([Promise.race([out, Bun.sleep(200).then(() => '')]), Promise.race([err, Bun.sleep(200).then(() => '')])]);
    return { exit: timedOut ? -1 : exit, stdout, stderr, timedOut };
  } finally { clearTimeout(timer); kill(); }
}

// Git runs with no inherited repository selection or user/system configuration; dates and identity are fixed so hashes are reproducible.
function gitEnv(date?: string): Record<string, string> {
  const base = Object.fromEntries(Object.entries(process.env).filter(([k, v]) => v !== undefined && !k.toUpperCase().startsWith('GIT_'))) as Record<string, string>;
  return { ...base, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_OPTIONAL_LOCKS: '0', ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) };
}
async function git(repo: string, args: string[], date?: string): Promise<string> {
  const r = await run(['git', '--no-replace-objects', '-c', 'user.name=Fixture Consumer', '-c', 'user.email=consumer@example.test', '-c', 'commit.gpgsign=false', '-C', repo, ...args], repo, gitEnv(date), 30000);
  if (r.exit !== 0) throw new Error(`git ${args.join(' ')} failed (exit ${r.exit})`);
  return r.stdout.trim();
}

interface FileSpec { text?: string; file?: string }
interface CommitSpec { name: string; branch: string; from: string | null; date: string; message: string; files: Record<string, FileSpec> }
interface PostSpec {
  checkout?: string;
  update_ref?: { ref: string; to: string }[];
  remote_add?: { name: string; url: string }[];
  dirty?: { path: string; text: string }[];
  untracked?: { path: string; text: string }[];
  remove_worktree?: string[];
}
interface GitSpec { commits: CommitSpec[]; invalid_reports?: string[]; post?: PostSpec }

function walk(dir: string, skip = (_: string) => false): string[] {
  const found: string[] = [];
  const visit = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const path = join(d, entry.name);
      if (skip(entry.name)) continue;
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) found.push(relative(dir, path));
      else throw new Error(`Unsupported entry ${relative(dir, path)}`);
    }
  };
  visit(dir);
  return found.sort();
}

// Tokens: {{sha:NAME}} commit, {{blob:NAME:path}} object id at that commit (file or tree), {{digest:path}} sha256 of a rendered corpus file.
async function render(text: string, shas: Map<string, string>, repo: string | null, digest: (path: string) => string): Promise<string> {
  const tokens = [...text.matchAll(/\{\{(sha|blob|digest):([^}]+)\}\}/g)];
  const values = new Map<string, string>();
  for (const [token, kind, arg] of tokens) {
    if (kind === 'sha') { const v = shas.get(arg); if (!v) throw new Error(`Unknown commit name ${arg}`); values.set(token, v); }
    else if (kind === 'blob') {
      const [name, ...path] = arg.split(':'); const sha = shas.get(name);
      if (!sha || !repo) throw new Error(`Unknown commit name ${name}`);
      values.set(token, await git(repo, ['rev-parse', `${sha}:${path.join(':')}`]));
    } else values.set(token, digest(arg));
  }
  return text.replace(/\{\{(sha|blob|digest):([^}]+)\}\}/g, m => values.get(m)!);
}

async function buildRepo(caseDir: string, repo: string, shas: Map<string, string>) {
  const spec = JSON.parse(readFileSync(join(caseDir, 'git', 'spec.json'), 'utf8')) as GitSpec;
  mkdirSync(repo, { recursive: true });
  await git(repo, ['init', '--quiet', '--initial-branch=main']);
  for (const commit of spec.commits) {
    if (commit.from === null) await git(repo, ['switch', '--quiet', '--orphan', commit.branch]);
    else await git(repo, ['switch', '--quiet', '-C', commit.branch, shas.get(commit.from) ?? (() => { throw new Error(`Unknown parent ${commit.from}`); })()]);
    for (const [path, content] of Object.entries(commit.files)) {
      const body = content.file !== undefined ? readFileSync(join(caseDir, content.file), 'utf8') : content.text ?? '';
      mkdirSync(dirname(join(repo, path)), { recursive: true });
      writeFileSync(join(repo, path), await render(body, shas, repo, () => { throw new Error('digest tokens are not allowed in committed files'); }));
    }
    await git(repo, ['add', '-A']);
    await git(repo, ['commit', '--quiet', '--allow-empty', '-m', commit.message], commit.date);
    shas.set(commit.name, await git(repo, ['rev-parse', 'HEAD']));
  }
  // The final branch is the case's inspectable starting state; restore main when it exists.
  const post = spec.post;
  if (post?.update_ref) for (const u of post.update_ref) await git(repo, ['update-ref', u.ref, shas.get(u.to) ?? (() => { throw new Error(`Unknown ref target ${u.to}`); })()]);
  if (post?.remote_add) for (const r of post.remote_add) await git(repo, ['remote', 'add', r.name, r.url]);
  // Detached checkout at a named commit gives the case a deterministic working tree for dirty/untracked state.
  if (post?.checkout) await git(repo, ['checkout', '--quiet', '--detach', shas.get(post.checkout) ?? (() => { throw new Error(`Unknown checkout ${post.checkout}`); })()]);
  if (post?.remove_worktree) for (const p of post.remove_worktree) rmSync(join(repo, p), { recursive: true, force: true });
  // Deliberate working-tree state (requested dirty diff / untracked partials) is applied after history is fixed.
  if (post?.dirty) for (const d of post.dirty) { mkdirSync(dirname(join(repo, d.path)), { recursive: true }); writeFileSync(join(repo, d.path), await render(d.text, shas, repo, () => { throw new Error('no digest tokens in dirty state'); })); }
  if (post?.untracked) for (const u of post.untracked) { mkdirSync(dirname(join(repo, u.path)), { recursive: true }); writeFileSync(join(repo, u.path), await render(u.text, shas, repo, () => { throw new Error('no digest tokens in untracked state'); })); }
  const branches = (await git(repo, ['for-each-ref', '--format=%(refname) %(objectname)'])).split('\n').filter(Boolean);
  return { spec, branches };
}

export async function prepare(out: string) {
  out = resolve(out);
  if (existsSync(out)) throw new Error('Output path must be fresh');
  const casesDir = join(here, 'cases');
  const manifest: any = { schema_version: 1, cases: {} as Record<string, any>, limits: ['Static fixture preparation only; no model subject was run or graded.'] };
  const bun = process.execPath, validator = join(root, 'skills', 'ruach-handoff', 'scripts', 'validate.ts');
  for (const name of readdirSync(casesDir).filter(n => /^\d\d-/.test(n)).sort()) {
    const caseDir = join(casesDir, name), subject = join(out, 'subject', name), corpus = join(subject, 'corpus');
    mkdirSync(corpus, { recursive: true });
    writeFileSync(join(subject, 'task.md'), readFileSync(join(caseDir, 'task.md')));
    const shas = new Map<string, string>();
    const caseManifest: any = { refs: {}, reports: [], expected_invalid: [] };
    if (existsSync(join(caseDir, 'git', 'spec.json'))) {
      const built = await buildRepo(caseDir, join(corpus, 'repo'), shas);
      caseManifest.refs = Object.fromEntries(built.branches.map(l => l.split(' ')));
      caseManifest.commit_names = Object.fromEntries(shas);
      caseManifest.expected_invalid = built.spec.invalid_reports ?? [];
      // Each committed handoff report is validated individually by the existing validator, at its own commit.
      for (const commit of built.spec.commits) for (const path of Object.keys(commit.files).filter(p => p.startsWith('reports/') && p.endsWith('.md'))) {
        const body = await git(join(corpus, 'repo'), ['show', `${shas.get(commit.name)}:${path}`]);
        const scratch = join(out, 'evaluator', 'scratch', `${name}-${commit.name}.md`);
        mkdirSync(dirname(scratch), { recursive: true }); writeFileSync(scratch, body + '\n');
        const v = await run([bun, validator, scratch, '--repo', join(corpus, 'repo')], root, { ...process.env as Record<string, string> }, 60000);
        let ok = false; try { ok = JSON.parse(v.stdout).ok === true; } catch {}
        caseManifest.reports.push({ commit: commit.name, sha: shas.get(commit.name), path, valid: ok, validator_exit: v.exit });
      }
      rmSync(join(out, 'evaluator', 'scratch'), { recursive: true, force: true });
    }
    // Corpus files: copy as-is; `*.tmpl` files are rendered with commit, blob and file-digest tokens.
    const source = join(caseDir, 'corpus'), templates: string[] = [];
    if (existsSync(source)) for (const file of walk(source, n => n === '.git')) {
      if (file.endsWith('.tmpl')) { templates.push(file); continue; }
      mkdirSync(dirname(join(corpus, file)), { recursive: true });
      cpSync(join(source, file), join(corpus, file), { preserveTimestamps: false });
    }
    const digest = (path: string) => sha256(readFileSync(join(corpus, path)));
    for (const file of templates) {
      const target = join(corpus, file.slice(0, -5));
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, await render(readFileSync(join(source, file), 'utf8'), shas, existsSync(join(corpus, 'repo')) ? join(corpus, 'repo') : null, digest));
    }
    // Protected raw evidence is read-only for the subject; modes are recorded and compared later.
    for (const file of walk(corpus, n => n === '.git')) if (PROTECTED.test(file)) chmodSync(join(corpus, file), 0o444);
    cpSync(corpus, join(out, 'protected', name, 'corpus'), { recursive: true, preserveTimestamps: true });
    caseManifest.files = Object.fromEntries(walk(corpus, n => n === '.git').map(f => [f, { sha256: sha256(readFileSync(join(corpus, f))), mode: (lstatSync(join(corpus, f)).mode & 0o777).toString(8) }]));
    manifest.cases[name] = caseManifest;
  }
  mkdirSync(join(out, 'evaluator'), { recursive: true });
  writeFileSync(join(out, 'evaluator', 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return { out, manifest };
}

if (import.meta.main) {
  const i = process.argv.indexOf('--out');
  if (i < 0 || !process.argv[i + 1]) { console.error('usage: bun evals/ruach-handoff-delivery/prepare.ts --out <fresh-temp-dir>'); process.exit(2); }
  try {
    const { out, manifest } = await prepare(process.argv[i + 1]);
    const unexpected = Object.entries<any>(manifest.cases).flatMap(([, c]) => c.reports.filter((r: any) => r.valid !== !c.expected_invalid.includes(r.commit)));
    console.log(JSON.stringify({ ok: unexpected.length === 0, out, cases: Object.keys(manifest.cases), reports_validated: Object.values<any>(manifest.cases).flatMap(c => c.reports).length, unexpected_reports: unexpected.length }));
    process.exitCode = unexpected.length ? 1 : 0;
  } catch (error: any) { console.error(error.message); process.exit(2); }
}
