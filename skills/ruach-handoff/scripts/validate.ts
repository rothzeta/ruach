import { readFile, realpath } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type Diagnostic = { code: string; path: string; message: string; line?: number; column?: number };
const pointer = (key: string) => key.replace(/~/g, "~0").replace(/\//g, "~1");
const diagnostics: Diagnostic[] = [];
const revisions: { path: string; resolved: string }[] = [];
let report: string | undefined;
let repo: string | undefined;
function finish(exit: number, extra = {}): never {
  // Paths can contain report-controlled keys; keep control characters from forging terminal lines.
  const printable = (text: string) => text.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
  for (const d of diagnostics) console.error(`${d.code} ${printable(d.path)}: ${d.message}`);
  console.log(JSON.stringify({ schema_version: 1, ok: exit === 0, report, repo, revisions, diagnostics, ...extra }));
  process.exit(exit);
}
function fail(exit: number, code: string, path: string, message: string): never {
  diagnostics.push({ code, path, message });
  return finish(exit);
}
const usage = "bun <skill>/scripts/validate.ts REPORT.md [--repo DIR]";
const args = process.argv.slice(2);
if (args.length === 1 && args[0] === "--help") finish(0, { usage });
let repoArg: string | undefined;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--repo" && repoArg === undefined && args[i + 1] && !args[i + 1].startsWith("-")) {
    repoArg = args[++i];
  } else if (!arg.startsWith("-") && report === undefined) {
    report = resolve(arg);
  } else fail(2, "USAGE", "/argv", usage);
}
if (!report) fail(2, "USAGE", "/argv", usage);

// Load dynamically so a copied, not-yet-installed skill gets an actionable error.
let parseDocument: typeof import("yaml").parseDocument;
let visit: typeof import("yaml").visit;
let isScalar: typeof import("yaml").isScalar;
let Ajv: typeof import("ajv").default;
try {
  // Bun can auto-install bare imports; require the documented local install first.
  await Promise.all(["yaml", "ajv"].map(name =>
    readFile(new URL(`../node_modules/${name}/package.json`, import.meta.url), "utf8")));
  ({ parseDocument, visit, isScalar } = await import("yaml"));
  ({ default: Ajv } = await import("ajv"));
} catch {
  fail(2, "DEPENDENCY_UNAVAILABLE", "/dependencies", "Run bun install --frozen-lockfile in the skill directory.");
}
let validate: ReturnType<InstanceType<typeof Ajv>["compile"]>;
try {
  const schema = JSON.parse(await readFile(new URL("../handoff.schema.json", import.meta.url), "utf8"));
  validate = new Ajv({ allErrors: true, strict: true }).compile(schema);
} catch {
  fail(2, "SCHEMA_UNAVAILABLE", "/schema", "Cannot load or compile skill-local handoff.schema.json.");
}
let source: string;
try {
  report = await realpath(report);
  source = (await readFile(report, "utf8")).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
} catch {
  fail(2, "INPUT_UNREADABLE", "/report", "Cannot read the report file.");
}
const lines = source.split("\n");
let header: string;
let offset = 0;
if (lines[0] === "---") {
  const end = lines.indexOf("---", 1);
  if (end === -1) fail(1, "HEADER_INVALID", "/header", "Leading YAML delimiter has no closing delimiter.");
  header = lines.slice(1, end).join("\n");
  offset = 1;
} else {
  if (!/^[A-Za-z_][A-Za-z0-9_-]*:/.test(lines[0])) {
    fail(1, "HEADER_INVALID", "/header", "Expected a leading YAML mapping, not a Markdown heading or fenced block.");
  }
  const end = lines.findIndex(line => /^\s*$/.test(line));
  header = lines.slice(0, end === -1 ? lines.length : end).join("\n");
}
const doc = parseDocument(header, { uniqueKeys: true, strict: true, prettyErrors: false });
for (const error of [...doc.errors, ...doc.warnings]) {
  const before = header.slice(0, error.pos[0]);
  diagnostics.push({
    code: error.code === "DUPLICATE_KEY" ? "YAML_DUPLICATE" : "YAML_INVALID",
    path: "/header",
    message: `Invalid YAML (${error.code}).`,
    line: before.split("\n").length + offset,
    column: before.length - before.lastIndexOf("\n"),
  });
}
if (diagnostics.length) finish(1);
// Alias and collection keys can smuggle duplicate or non-string field names past uniqueKeys.
visit(doc, {
  Pair(_key, pair) {
    if (isScalar(pair.key)) return;
    const before = header.slice(0, (pair.key as { range?: number[] } | null)?.range?.[0] ?? 0);
    diagnostics.push({ code: "YAML_INVALID", path: "/header", message: "Mapping keys must be plain scalars, not aliases or collections.", line: before.split("\n").length + offset, column: before.length - before.lastIndexOf("\n") });
  },
});
if (diagnostics.length) finish(1);
let data: Record<string, unknown>;
try {
  data = doc.toJS({ maxAliasCount: 100 });
} catch {
  fail(1, "YAML_INVALID", "/header", "Cannot materialize YAML aliases or keys.");
}
if (!validate(data)) {
  for (const error of validate.errors ?? []) {
    const missing = error.keyword === "required" ? `/${pointer(error.params.missingProperty)}` : "";
    const codes: Record<string, string> = { required: "FIELD_REQUIRED", type: "FIELD_TYPE", enum: "FIELD_ENUM" };
    const code = codes[error.keyword] ?? "FIELD_INVALID";
    diagnostics.push({ code, path: (error.instancePath + missing) || "/", message: `Schema constraint failed (${error.keyword}).` });
  }
  finish(1);
}

const supplied = Object.entries(data).filter(([field]) => /(^|_)(revision|baseline)$|^destination_before$/.test(field));
if (repoArg !== undefined || supplied.length) {
  // Invocation Git environment must not redirect discovery to the caller's repository.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
  function git(argv: string[]) {
    try {
      return Bun.spawnSync(["git", ...argv], { env, stdout: "pipe", stderr: "pipe" });
    } catch {
      fail(2, "GIT_UNAVAILABLE", "/repo", "Git must be available on PATH to check repository references.");
    }
  }
  const root = git(["--no-replace-objects", "-C", repoArg === undefined ? dirname(report) : resolve(repoArg), "rev-parse", "--show-toplevel"]);
  if (root.exitCode !== 0) fail(2, "REPO_UNAVAILABLE", "/repo", "Cannot locate a Git worktree from --repo or the report's directory.");
  repo = root.stdout.toString().trim();
  for (const [field, revision] of supplied) {
    const checked = git(["--no-replace-objects", "-C", repo, "rev-parse", "--verify", "--end-of-options", `${revision}^{commit}`]);
    if (checked.exitCode !== 0) {
      diagnostics.push({ code: "REVISION_MISSING", path: `/${pointer(field)}`, message: "Revision does not resolve to an existing commit in the selected repository." });
    } else revisions.push({ path: `/${pointer(field)}`, resolved: checked.stdout.toString().trim() });
  }
}
finish(diagnostics.length ? 1 : 0);
