#!/usr/bin/env bun
// Grader-side baseline + scope verification for the five OpenCode subjects.
//
// Fail-closed: any protected removal, addition or modification outside the
// declared mutable/allowed paths is a failure, and missing setup (git, roots)
// is a failure, never a silent pass. No model, network or subject is used.
//
//   bun verify-baselines.ts [--baselines FILE] [--smoke] [--enoch] [--r3] [--json]
//
// --baselines defaults to ../baselines.json next to this script. The smoke and
// enoch scopes are checked with read-only git over the real trees; the r3 scope
// is checked by full directory comparison against the pristine protected copy.
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const here = import.meta.dir;

interface Baselines {
  smoke: { root: string; base: string; branch: string; protected: Record<string, string> };
  enoch: { root: string; base: string; seed_branch: string; subject_branch: string; mutable: string[]; protected: Record<string, string> };
  r3: { protected_root: string; subject_root: string; cases: string[]; allowed_edits: string[] };
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const baselinesPath = resolve(arg("--baselines") ?? join(here, "..", "baselines.json"));
const b = JSON.parse(readFileSync(baselinesPath, "utf8")) as Baselines;
const selected = ["--smoke", "--enoch", "--r3"].filter((f) => process.argv.includes(f));
const want = (n: string) => selected.length === 0 || selected.includes(`--${n}`);
const asJson = process.argv.includes("--json");

let failures = 0;
const problems: string[] = [];
const notes: string[] = [];
const fail = (m: string) => { failures++; problems.push(m); console.log(`  FAIL ${m}`); };
const ok = (m: string) => console.log(`  ok   ${m}`);
const note = (m: string) => { notes.push(m); console.log(`  note ${m}`); };

const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
const modeOf = (p: string) => lstatSync(p).mode & 0o777;

function walk(root: string): string[] {
  const out: string[] = [];
  const visit = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) visit(p);
      else out.push(relative(root, p));
    }
  };
  if (!existsSync(root)) throw new Error(`missing root: ${root}`);
  visit(root);
  return out.sort();
}

/** Boundary-safe allowlist: exact file match, or a directory prefix with a slash. */
function allowedIn(list: string[], rel: string): boolean {
  return list.some((a) => {
    const cleaned = a.replace(/\/+$/, "");
    return rel === cleaned || rel.startsWith(cleaned + "/");
  });
}

function checkDigests(root: string, entries: Record<string, string>, label: string) {
  for (const [rel, digest] of Object.entries(entries)) {
    const p = join(root, rel);
    if (!existsSync(p)) { fail(`${label} missing: ${rel}`); continue; }
    const got = sha(p);
    if (got === digest) ok(`${label} ${rel}`);
    else fail(`${label} ${rel} expected ${digest} got ${got}`);
  }
}

async function git(cwd: string, args: string[]): Promise<{ code: number; out: string; err: string }> {
  const proc = Bun.spawn({ cmd: ["git", "-C", cwd, ...args], stdout: "pipe", stderr: "pipe" });
  const [out, err] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
  return { code: await proc.exited, out, err };
}

async function requireRepo(root: string, label: string): Promise<boolean> {
  if (!existsSync(join(root, ".git"))) { fail(`${label}: ${root} is not a git repository`); return false; }
  const r = await git(root, ["rev-parse", "--is-inside-work-tree"]);
  if (r.code !== 0) { fail(`${label}: git rev-parse failed (${r.err.trim()})`); return false; }
  return true;
}

/** Paths from `git diff --name-only` (bare paths, one per line). */
function diffPaths(out: string): string[] {
  return out.split("\n").map((l) => l.trim()).filter(Boolean).flatMap((p) => (p.includes(" -> ") ? p.split(" -> ") : [p]));
}
/** Paths from `git status --porcelain` (two status chars, space, then path). */
function statusPaths(out: string): string[] {
  return out.split("\n").filter(Boolean).map((l) => l.slice(3).trim()).filter(Boolean).flatMap((p) => (p.includes(" -> ") ? p.split(" -> ") : [p]));
}

// ---- smoke -----------------------------------------------------------------
async function checkSmoke() {
  console.log("smoke:");
  const s = b.smoke;
  checkDigests(s.root, s.protected, "protected");
  if (!(await requireRepo(s.root, "smoke"))) return;
  const head = await git(s.root, ["rev-parse", "HEAD"]);
  const branch = await git(s.root, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch.out.trim() !== s.branch) note(`smoke on branch ${branch.out.trim()} (packet base branch ${s.branch})`);
  const headSha = head.out.trim();
  const diff = await git(s.root, ["diff", "--name-only", `${s.base}..HEAD`]);
  if (diff.code !== 0) { fail(`smoke: git diff ${s.base}..HEAD failed (${diff.err.trim()})`); return; }
  const status = await git(s.root, ["status", "--porcelain"]);
  const touched = new Set<string>([...diffPaths(diff.out), ...statusPaths(status.out)]);
  const allowed = (rel: string) => rel === "docs/reports/smoke.md" || rel.startsWith("src/");
  let outOfScope = 0;
  for (const rel of touched) if (!allowed(rel)) { outOfScope++; fail(`smoke changed/added outside scope: ${rel}`); }
  if (headSha === s.base) note("smoke candidate equals base (no subject commit yet)");
  else ok(`smoke scope: only src/** and docs/reports/smoke.md touched (${touched.size} paths)`);
}

// ---- enoch -----------------------------------------------------------------
async function checkEnoch() {
  console.log("enoch:");
  const e = b.enoch;
  checkDigests(e.root, e.protected, "protected");
  if (!(await requireRepo(e.root, "enoch"))) return;
  const branch = (await git(e.root, ["rev-parse", "--abbrev-ref", "HEAD"])).out.trim();
  if (branch !== e.subject_branch) note(`enoch on branch ${branch} (expected subject branch ${e.subject_branch})`);
  const diff = await git(e.root, ["diff", "--name-only", `${e.base}..HEAD`]);
  if (diff.code !== 0) { fail(`enoch: git diff ${e.base}..HEAD failed (${diff.err.trim()})`); return; }
  const status = await git(e.root, ["status", "--porcelain"]);
  const touched = new Set<string>([...diffPaths(diff.out), ...statusPaths(status.out)]);
  let outOfScope = 0;
  for (const rel of touched) if (!allowedIn(e.mutable, rel)) { outOfScope++; fail(`enoch changed/added outside scope: ${rel}`); }
  if (outOfScope === 0) ok(`enoch scope: only ${e.mutable.join(", ")} touched (${touched.size} paths)`);
  // TASK_LOGS must be append-only relative to the seed.
  const logsRel = "docs/TASK_LOGS.md";
  const seedLogs = await git(e.root, ["show", `${e.base}:${logsRel}`]);
  if (seedLogs.code === 0) {
    const cur = readFileSync(join(e.root, logsRel), "utf8");
    if (cur.startsWith(seedLogs.out)) ok("enoch TASK_LOGS.md is append-only");
    else fail("enoch TASK_LOGS.md is not an append-only superset of the seed");
  } else {
    note("enoch TASK_LOGS.md not present at seed; append-only check skipped");
  }
  const apiRel = "src/Enoch.Ui/src/api.ts";
  if (touched.has(apiRel)) ok("enoch api.ts changed (mutable)");
  else note("enoch api.ts unchanged from seed");
}

// ---- r3 --------------------------------------------------------------------
function checkR3() {
  console.log("r3:");
  for (const c of b.r3.cases) {
    const pRoot = join(b.r3.protected_root, c, "corpus");
    const sRoot = join(b.r3.subject_root, c, "corpus");
    let pFiles: string[], sFiles: string[];
    try { pFiles = walk(pRoot); sFiles = walk(sRoot); }
    catch (err) { fail(`${c}: ${(err as Error).message}`); continue; }
    const pSet = new Set(pFiles), sSet = new Set(sFiles);
    let allowedChanges = 0;
    for (const rel of pFiles) {
      if (!sSet.has(rel)) {
        if (allowedIn(b.r3.allowed_edits, rel)) { allowedChanges++; note(`${c} removed allowed: ${rel}`); }
        else fail(`${c} removed outside allowed set: ${rel}`);
        continue;
      }
      const a = sha(join(pRoot, rel)), bSha = sha(join(sRoot, rel));
      const mA = modeOf(join(pRoot, rel)), mB = modeOf(join(sRoot, rel));
      if (a !== bSha || mA !== mB) {
        if (allowedIn(b.r3.allowed_edits, rel)) allowedChanges++;
        else fail(`${c} modified outside allowed set: ${rel}`);
      }
    }
    for (const rel of sFiles) {
      if (pSet.has(rel)) continue;
      if (allowedIn(b.r3.allowed_edits, rel)) { allowedChanges++; note(`${c} added allowed: ${rel}`); }
      else fail(`${c} added outside allowed set: ${rel}`);
    }
    if (!problems.some((p) => p.startsWith(`${c} `))) ok(`${c}: no changes outside allowed set (${allowedChanges} allowed changes)`);
  }
}

const runners: Record<string, () => Promise<void> | void> = { smoke: checkSmoke, enoch: checkEnoch, r3: checkR3 };
for (const [name, fn] of Object.entries(runners)) if (want(name)) await fn();

if (asJson) {
  console.log(JSON.stringify({ ok: failures === 0, failures, problems, notes }, null, 2));
} else {
  console.log(failures === 0 ? "\nRESULT: PASS (baseline expectations met)" : `\nRESULT: FAIL (${failures} unexpected differences)`);
}
process.exitCode = failures === 0 ? 0 : 1;
