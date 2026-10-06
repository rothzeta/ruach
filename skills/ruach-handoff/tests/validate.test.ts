import { afterAll, describe, expect, test } from "bun:test";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import Ajv from "ajv";

const skill = resolve(import.meta.dir, "..");
const cli = join(skill, "scripts/validate.ts");
const base = mkdtempSync(join(tmpdir(), "ruach-handoff-tests-"));
let serial = 0;
// Grouped cases budget 2s per validator probe for CPU contention; single-probe
// cases retain Bun's default timeout. These tests assert behavior, not latency.
afterAll(() => rmSync(base, { recursive: true, force: true }));
function dir() {
  const path = join(base, `fixture ${serial++}`);
  mkdirSync(path);
  return path;
}
const minimal = `task: example
status: complete
outcome: Reported result
artifacts: []
verification: not-run
discoveries: []
blockers: []`;
function file(text = minimal, folder = dir()) {
  const path = join(folder, "report.md");
  writeFileSync(path, text);
  return path;
}
function run(args: string[], cwd = base, script = cli, env = {}) {
  const result = Bun.spawnSync([process.execPath, script, ...args], {
    cwd, env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe",
  });
  return { exit: result.exitCode, json: JSON.parse(result.stdout.toString()), stderr: result.stderr.toString() };
}
function invalid(text: string, code: string, path?: string) {
  const result = run([file(text)]);
  expect(result.exit).toBe(1);
  expect(result.json.ok).toBe(false);
  expect(result.json.schema_version).toBe(1);
  expect(result.json.diagnostics.some((d: any) => d.code === code && (!path || d.path === path))).toBe(true);
  expect(result.stderr).toContain(code);
}
function git(cwd: string, ...args: string[]) {
  const result = Bun.spawnSync(["git", "-C", cwd, ...args], {
    env: { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" },
    stdout: "pipe", stderr: "pipe",
  });
  if (result.exitCode !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}
function repository() {
  const path = dir();
  git(path, "init", "-q");
  git(path, "config", "user.name", "Fixture");
  git(path, "config", "user.email", "fixture@example.invalid");
  git(path, "-c", "commit.gpgsign=false", "commit", "--allow-empty", "-qm", "Initial fixture");
  return path;
}

describe("leading block and schema through the CLI", () => {
  for (const status of ["complete", "blocked", "needs-decision", "failed"]) {
    test(`valid minimal report: ${status}`, () => {
      const result = run([file(minimal.replace("status: complete", `status: ${status}`))]);
      expect(result.exit).toBe(0);
      expect(result.json).toMatchObject({ schema_version: 1, ok: true, diagnostics: [], revisions: [] });
      expect(result.stderr).toBe("");
    });
  }
  test("delimited YAML, CRLF/BOM, quoted narratives and legacy single-key mappings", () => {
    const text = minimal.replace("verification: not-run", 'verification:\n  - Build: exit 0\n  - "Quoted: not-run"') + "\nreview: not-run";
    expect(run([file(`\uFEFF---\r\n${text.replaceAll("\n", "\r\n")}\r\n---\r\n\r\n# Details`)]).exit).toBe(0);
    expect(run([file(text + "\n\n# Details\nnot YAML: [broken")]).exit).toBe(0);
  });
  for (const field of ["task", "status", "outcome", "artifacts", "verification", "discoveries", "blockers"]) {
    test(`required field ${field}`, () => invalid(minimal.split("\n").filter(line => !line.startsWith(field + ":")).join("\n"), "FIELD_REQUIRED", `/${field}`));
  }
  test("invalid status and types", () => {
    invalid(minimal.replace("status: complete", "status: success"), "FIELD_ENUM", "/status");
    invalid(minimal.replace("status: complete", "status: []"), "FIELD_ENUM", "/status");
    invalid(minimal.replace("task: example", "task: 17"), "FIELD_TYPE", "/task");
    invalid(minimal.replace("artifacts: []", "artifacts: foo"), "FIELD_TYPE", "/artifacts");
    invalid(minimal.replace("verification: not-run", "verification: passed"), "FIELD_INVALID", "/verification");
    invalid(minimal.replace("blockers: []", "blockers: null"), "FIELD_TYPE", "/blockers");
    invalid(minimal.replace("outcome: Reported result", 'outcome: "  "'), "FIELD_INVALID", "/outcome");
    invalid(minimal + "\ntested_revision: [HEAD]", "FIELD_TYPE", "/tested_revision");
  }, 2_000 * 8);
  test("malformed and missing headers, syntax, duplicate keys, tags", () => {
    for (const text of ["", "# Historical\n" + minimal, "```yaml\n" + minimal + "\n```", "\n" + minimal, "---\n" + minimal]) invalid(text, "HEADER_INVALID", "/header");
    invalid(minimal.replace("artifacts: []", "artifacts: ["), "YAML_INVALID", "/header");
    invalid(minimal + "\nstatus: complete", "YAML_DUPLICATE", "/header");
    invalid(minimal.replace("verification: not-run", "verification:\n  - Build: exit 0\n    Build: exit 1"), "YAML_DUPLICATE");
    invalid(minimal.replace("task: example", "task: !unsupported example"), "YAML_INVALID");
    invalid("---\n[one, two]\n---", "FIELD_TYPE", "/");
    const result = run([file(minimal + "\nstatus: failed")]);
    expect(result.json.diagnostics[0].line).toBeGreaterThan(1);
    expect(result.json.diagnostics[0].column).toBeGreaterThan(0);
  }, 2_000 * 11);
  test("alias and collection mapping keys are rejected, including aliases that duplicate a field", () => {
    invalid(minimal.replace("status: complete", "&k status: complete") + "\n*k : failed", "YAML_INVALID");
    invalid(minimal + "\n? [a, b]\n: value", "YAML_INVALID");
    invalid(minimal + "\n? {a: b}\n: value", "YAML_INVALID");
    invalid(minimal.replace("verification: not-run", "verification:\n  - ? [a]\n    : b"), "YAML_INVALID");
  }, 2_000 * 4);
  test("diagnostic paths are escaped JSON Pointers and stderr cannot be forged by report keys", () => {
    const result = run([file(`---\n${JSON.stringify({ task: "t", status: "complete", outcome: "o", artifacts: [], verification: "not-run", discoveries: [], blockers: [], "a/b~c_revision": "", "x\nFORGED ok_revision": [] })}\n---`)]);
    expect(result.exit).toBe(1);
    const paths = result.json.diagnostics.map((d: any) => d.path);
    expect(paths).toContain("/a~1b~0c_revision");
    expect(result.stderr.split("\n").some((line: string) => line.startsWith("FORGED"))).toBe(false);
    const missing = run([file(`---\n${JSON.stringify({ task: "t", status: "complete", outcome: "o", artifacts: [], verification: "not-run", discoveries: [], blockers: [], "a/b_revision": "no-such-ref" })}\n---`, repository())]);
    expect(missing.json.diagnostics.map((d: any) => d.path)).toContain("/a~1b_revision");
  }, 2_000 * 2);
  test("NUL in a revision is a field error before Git runs", () => {
    const repo = repository();
    const result = run([file(`---\ntask: t\nstatus: complete\noutcome: o\nartifacts: []\nverification: not-run\ndiscoveries: []\nblockers: []\ntested_revision: "HEAD\\0"\n---`, repo)], base, cli, { PATH: "/nonexistent" });
    expect(result.exit).toBe(1);
    expect(result.json.diagnostics.map((d: any) => d.code)).toEqual(["FIELD_INVALID"]);
    expect(result.json.diagnostics[0].path).toBe("/tested_revision");
  });
  test("the shipped schema is the structural oracle, including role metadata", () => {
    const schema = JSON.parse(readFileSync(join(skill, "handoff.schema.json"), "utf8"));
    const validate = new Ajv({ strict: true }).compile(schema);
    const sample = { task: "task", status: "complete", outcome: "result", artifacts: [], verification: "not-run", discoveries: [], blockers: [] };
    const variants = [sample, { ...sample, role: "implementer" }, { ...sample, review: "not-run" },
      { ...sample, verification: [{ Build: "exit 0" }] }, { ...sample, verification: [{ A: "yes", B: "yes" }] },
      { ...sample, artifacts: [{}] }, { ...sample, discoveries: [false] }, { ...sample, review: true },
      { ...sample, task: null }, { ...sample, source_baseline: [] }, { ...sample, outcome: "" },
      { ...sample, status: "unknown" }, { ...sample, verification: [] }];
    for (const data of variants) {
      const valid = validate(data);
      const result = run([file(`---\n${JSON.stringify(data)}\n---`)]);
      expect(result.exit).toBe(valid ? 0 : 1);
    }
  }, 2_000 * 13);
  test("the documented starting template has neutral verification and review", () => {
    const doc = readFileSync(join(skill, "SKILL.md"), "utf8");
    const template = doc.match(/```yaml\n([\s\S]*?)\n```/)![1];
    expect(template).toContain("verification: not-run");
    expect(template).toContain("review: not-run");
    expect(template).toContain("status: needs-decision");
    expect(run([file(template)]).exit).toBe(0);
  });
});

describe("repository and revision contract", () => {
  test("resolve from report location, ignoring caller cwd and Git environment", () => {
    const repo = repository();
    const caller = repository();
    const sha = git(repo, "rev-parse", "HEAD");
    const nested = join(repo, "docs", "mailbox", "task");
    mkdirSync(nested, { recursive: true });
    const result = run([file(minimal + `\ntested_revision: ${sha}`, nested)], caller, cli, { GIT_DIR: join(caller, ".git"), GIT_WORK_TREE: caller });
    expect(result.exit).toBe(0);
    expect(result.json.repo).toBe(repo);
    expect(result.json.revisions).toContainEqual({ path: "/tested_revision", resolved: sha });
  });
  test("worktree branch HEAD belongs to the report's worktree", () => {
    const repo = repository();
    const worktree = join(base, `worktree ${serial++}`);
    git(repo, "worktree", "add", "-qb", "report-branch", worktree);
    git(worktree, "-c", "commit.gpgsign=false", "commit", "--allow-empty", "-qm", "Worktree successor");
    const sha = git(worktree, "rev-parse", "HEAD");
    expect(sha).not.toBe(git(repo, "rev-parse", "HEAD"));
    const result = run([file(minimal + "\ntested_revision: HEAD", worktree)], repo);
    expect(result.exit).toBe(0);
    expect(result.json.repo).toBe(worktree);
    expect(result.json.revisions[0].resolved).toBe(sha);
  });
  test("explicit repository overrides report association and cwd", () => {
    const repo = repository();
    const other = repository();
    const sha = git(repo, "rev-parse", "HEAD");
    const report = file(minimal + `\nreviewed_revision: ${sha}`, other);
    expect(run([report, "--repo", repo], base).exit).toBe(0);
    const external = file(minimal + "\ntested_revision: HEAD");
    expect(run([external, "--repo", repo], base).json.repo).toBe(repo);
    const result = run([external], repo);
    expect(result.exit).toBe(2);
    expect(result.json.diagnostics[0].code).toBe("REPO_UNAVAILABLE");
    expect(run([report, "--repo", "missing"], base).exit).toBe(2);
  }, 2_000 * 4);
  test("missing commits, noncommit objects and all revision roles fail with field paths", () => {
    const repo = repository();
    for (const field of ["candidate_revision", "tested_revision", "reviewed_revision", "delivered_revision", "evidence_revision", "source_baseline", "destination_before", "revision", "baseline"]) {
      const result = run([file(minimal + `\n${field}: missing-ref`, repo)]);
      expect(result.exit).toBe(1);
      expect(result.json.diagnostics).toContainEqual({ code: "REVISION_MISSING", path: `/${field}`, message: expect.any(String) });
    }
    const tree = git(repo, "rev-parse", "HEAD^{tree}");
    expect(run([file(minimal + `\ntested_revision: ${tree}`, repo)]).exit).toBe(1);
    expect(run([file(minimal + "\ntested_revision: --help", repo)]).exit).toBe(1);
  }, 2_000 * 11);
  test("evidence-only successor and report written before its creating commit", () => {
    const repo = repository();
    const tested = git(repo, "rev-parse", "HEAD");
    const path = file(minimal.replace("artifacts: []", "artifacts: [report.md]") + `\ncandidate_revision: ${tested}\ntested_revision: ${tested}`, repo);
    expect(git(repo, "status", "--porcelain")).toContain("report.md");
    expect(run([path]).exit).toBe(0); // No circular requirement for the report's future commit.
    git(repo, "add", "report.md");
    git(repo, "-c", "commit.gpgsign=false", "commit", "-qm", "Record evidence only");
    const evidence = git(repo, "rev-parse", "HEAD");
    expect(evidence).not.toBe(tested);
    writeFileSync(path, readFileSync(path, "utf8") + `\nevidence_revision: ${evidence}\ndelivered_revision: ${evidence}`);
    const result = run([path]);
    expect(result.exit).toBe(0);
    expect(result.json.revisions).toContainEqual({ path: "/tested_revision", resolved: tested });
    expect(result.json.revisions).toContainEqual({ path: "/evidence_revision", resolved: evidence });
  });
});

describe("portable setup and usage diagnostics", () => {
  test("help, bad arguments, unreadable input, unavailable Git", () => {
    expect(run(["--help"]).exit).toBe(0);
    for (const args of [[], ["--unknown"], [file(), "--repo"], [file(), "--repo", base, "--repo", base], [file(), "extra.md"]]) {
      const result = run(args);
      expect(result.exit).toBe(2);
      expect(result.json.diagnostics[0].code).toBe("USAGE");
    }
    const unreadable = run([join(base, "absent.md")]);
    expect(unreadable.exit).toBe(2);
    expect(unreadable.json.diagnostics[0].code).toBe("INPUT_UNREADABLE");
    const result = run([file(minimal + "\ntested_revision: HEAD")], base, cli, { PATH: base });
    expect(result.exit).toBe(2);
    expect(result.json.diagnostics[0].code).toBe("GIT_UNAVAILABLE");
  }, 2_000 * 8);
  test("copied skill without dependencies fails clearly", () => {
    const copy = dir();
    cpSync(join(skill, "scripts"), join(copy, "scripts"), { recursive: true });
    cpSync(join(skill, "handoff.schema.json"), join(copy, "handoff.schema.json"));
    const result = run([file()], base, join(copy, "scripts/validate.ts"));
    expect(result.exit).toBe(2);
    expect(result.json.diagnostics[0].code).toBe("DEPENDENCY_UNAVAILABLE");
    expect(result.stderr).toContain("bun install --frozen-lockfile");
  });
  test("copied skill with local dependencies works from unrelated cwd", () => {
    const copy = dir();
    cpSync(skill, copy, { recursive: true });
    const result = run([file()], base, join(copy, "scripts/validate.ts"));
    expect(result.exit).toBe(0);
    expect(result.json.ok).toBe(true);
  });
});
