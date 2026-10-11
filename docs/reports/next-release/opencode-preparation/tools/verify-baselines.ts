// Grader-side baseline verification for the five OpenCode subjects.
// Reads baselines.json next to this script. No model, network or subject is used.
//   bun verify-baselines.ts            # all subjects
//   bun verify-baselines.ts --smoke    # one subject (repeatable)
import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const here = import.meta.dir;
const baselines = JSON.parse(readFileSync(join(here, "..", "baselines.json"), "utf8"));
const selected = process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => a.slice(2));
const want = (name: string) => selected.length === 0 || selected.includes(name);
const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
let failures = 0;
const fail = (msg: string) => { failures++; console.log(`  FAIL ${msg}`); };
const ok = (msg: string) => console.log(`  ok   ${msg}`);

function walk(root: string): string[] {
  const out: string[] = [];
  const visit = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) visit(p);
      else if (e.isFile()) out.push(relative(root, p));
    }
  };
  visit(root);
  return out.sort();
}

function checkFixed(root: string, entries: Record<string, string>, label: string) {
  for (const [rel, digest] of Object.entries(entries)) {
    try {
      const got = sha(join(root, rel));
      if (got === digest) ok(`${label} ${rel}`);
      else fail(`${label} ${rel} expected ${digest} got ${got}`);
    } catch (e) {
      fail(`${label} ${rel} unreadable: ${(e as Error).message}`);
    }
  }
}

if (want("smoke")) {
  console.log("smoke:");
  checkFixed(baselines.smoke.root, baselines.smoke.protected, "protected");
  checkFixed(baselines.smoke.root, baselines.smoke.baseline_unmodified, "pre-edit");
}

if (want("enoch")) {
  console.log("enoch:");
  checkFixed(baselines.enoch.root, baselines.enoch.protected, "protected");
  const api = baselines.enoch.seed_unmodified["src/Enoch.Ui/src/api.ts"];
  const mutable = new Set(baselines.enoch.mutable);
  const got = (() => { try { return sha(join(baselines.enoch.root, "src/Enoch.Ui/src/api.ts")); } catch { return ""; } })();
  if (got === api) ok("api.ts still at seed (subject has not edited it)");
  else if (mutable.has("src/Enoch.Ui/src/api.ts")) console.log(`  note api.ts changed from seed (mutable): ${got}`);
  else fail("api.ts changed unexpectedly");
}

if (want("r3")) {
  console.log("r3:");
  for (const c of baselines.r3.cases) {
    const pRoot = join(baselines.r3.protected_root, c, "corpus");
    const sRoot = join(baselines.r3.subject_root, c, "corpus");
    let pFiles: string[], sFiles: string[];
    try { pFiles = walk(pRoot); sFiles = walk(sRoot); }
    catch (e) { fail(`${c}: ${(e as Error).message}`); continue; }
    const set = new Set(sFiles);
    const allowed = (rel: string) =>
      baselines.r3.allowed_edits.some((a: string) => rel === a || rel.startsWith(a));
    let changed = 0, added = 0, unexpected = 0;
    for (const rel of pFiles) {
      if (!set.has(rel)) { console.log(`  note ${c} removed: ${rel}${allowed(rel) ? "" : " (UNEXPECTED)"}`); if (!allowed(rel)) unexpected++; continue; }
      const a = sha(join(pRoot, rel)), b = sha(join(sRoot, rel));
      if (a !== b) { changed++; if (!allowed(rel)) { unexpected++; fail(`${c} changed outside allowed set: ${rel}`); } }
    }
    const pSet = new Set(pFiles);
    for (const rel of sFiles) if (!pSet.has(rel)) { added++; if (!allowed(rel)) { unexpected++; fail(`${c} added outside allowed set: ${rel}`); } }
    if (unexpected === 0) ok(`${c}: no unexpected changes (allowed changed=${changed}, added=${added}, removed=${pFiles.length - (pFiles.length - changed)})`);
  }
}

console.log(failures === 0 ? "\nRESULT: PASS (baseline expectations met)" : `\nRESULT: FAIL (${failures} unexpected differences)`);
process.exitCode = failures === 0 ? 0 : 1;
