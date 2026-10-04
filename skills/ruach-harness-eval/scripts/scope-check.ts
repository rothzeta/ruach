import { lstatSync, readFileSync, readdirSync, readlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { args, boolean, changes, diagnostic, dirty, emit, fail, git, hash, loadJson, object, outputPath, repoPath, revision, root, string, strings, version } from './common';

const result: any = { schema_version: 1, ok: false, diagnostics: [], review_checks: {}, canonical_hashes: {}, tree_checks: {}, evidence_checks: {} };
let output: string | undefined, exit = 2;
function pathList(value: any, field: string, prefixes = false) {
  return strings(value, field).map(path => repoPath(path, field, prefixes || path.endsWith('/')));
}
function matches(path: string, entries: string[]) { return entries.some(entry => entry.endsWith('/') ? path.startsWith(entry) : path === entry); }
function filesUnder(repo: string, path: string): string[] {
  let stat;
  try { stat = lstatSync(join(repo, path)); } catch (error: any) { if (error.code === 'ENOENT') return []; throw error; }
  if (!stat.isDirectory() || stat.isSymbolicLink()) return [path];
  return readdirSync(join(repo, path)).sort().flatMap(name => filesUnder(repo, `${path}/${name}`));
}
function worktreeHash(repo: string, path: string): string | null {
  try {
    let current = repo;
    const parts = path.split('/');
    for (const [i, part] of parts.entries()) { current = join(current, part); if (i < parts.length - 1 && lstatSync(current).isSymbolicLink()) return null; }
    const stat = lstatSync(current);
    return stat.isSymbolicLink() ? hash(readlinkSync(current)) : stat.isFile() ? hash(readFileSync(current)) : null;
  } catch { return null; }
}
try {
  const options = args(['--repo', '--baseline', '--candidate', '--allow']);
  if (!options) { process.stdout.write('scope-check.ts --repo DIR --baseline REV --candidate REV --allow FILE.json [--output NEW_FILE.json]\n'); process.exit(0); }
  const repo = root(options['--repo']), allowFile = resolve(options['--allow']), base = dirname(allowFile);
  const allow = object(loadJson(allowFile), 'allow', ['schema_version', 'paths', 'prefixes', 'require_clean', 'protected_paths', 'reviewed_revision', 'technical_paths', 'expected_branch', 'canonical_files', 'expected_tree_paths', 'evidence', 'task', 'run']);
  version(allow.schema_version);
  const paths = pathList(allow.paths ?? [], 'paths'), prefixes = pathList(allow.prefixes ?? [], 'prefixes', true);
  // paths are exact; directory prefixes belong in prefixes.
  if (paths.some(p => p.endsWith('/'))) fail('paths', 'Use prefixes for directory entries');
  if (allow.require_clean !== undefined) boolean(allow.require_clean, 'require_clean');
  const protectedPaths = pathList(allow.protected_paths ?? [], 'protected_paths');
  const technicalPaths = pathList(allow.technical_paths ?? [], 'technical_paths');
  if (allow.technical_paths !== undefined && allow.reviewed_revision === undefined) fail('technical_paths', 'A reviewed_revision is required');
  const canonicalFiles = pathList(allow.canonical_files ?? [], 'canonical_files');
  if (canonicalFiles.some(p => p.endsWith('/'))) fail('canonical_files', 'Canonical entries must be file paths');
  const expectedTree = allow.expected_tree_paths === undefined ? undefined : pathList(allow.expected_tree_paths, 'expected_tree_paths');
  if (expectedTree && (!expectedTree.length || expectedTree.some(p => p.endsWith('/')))) fail('expected_tree_paths', 'Specify a nonempty list of exact file paths');
  if (allow.expected_branch !== undefined) string(allow.expected_branch, 'expected_branch');
  if (allow.task !== undefined) string(allow.task, 'task'); if (allow.run !== undefined) string(allow.run, 'run');
  if (allow.evidence !== undefined) {
    object(allow.evidence, 'evidence', ['acceptance', 'scope']);
    if (!Object.keys(allow.evidence).length) fail('evidence');
    for (const [key, value] of Object.entries(allow.evidence)) string(value, `evidence.${key}`);
    string(allow.task, 'task'); string(allow.run, 'run');
  }
  output = outputPath(options['--output'], repo);
  result.task = allow.task ?? null; result.run = allow.run ?? null;
  result.baseline_revision = revision(repo, options['--baseline'], 'baseline'); result.candidate_revision = revision(repo, options['--candidate'], 'candidate');
  result.worktree_head = revision(repo, 'HEAD', 'HEAD');
  result.branch = git(repo, ['symbolic-ref', '--quiet', '--short', 'HEAD'], true).stdout.toString().trimEnd() || null;
  result.changes = changes(repo, result.baseline_revision, result.candidate_revision);
  result.dirty = dirty(repo); result.clean = result.dirty.length === 0;
  const committed = result.changes.flatMap((c: any) => c.paths), dirt = result.dirty.flatMap((d: any) => d.paths);
  result.changed_paths = [...new Set(committed)].sort();
  result.assessed_paths = [...new Set([...committed, ...dirt])].sort();
  result.unexpected_paths = result.assessed_paths.filter((path: string) => !matches(path, [...paths, ...prefixes]));
  result.protected_changes = result.assessed_paths.filter((path: string) => matches(path, protectedPaths));
  const violation = (code: string, field: string, message: string) => result.diagnostics.push({ code, field, message });
  if (result.unexpected_paths.length) violation('unexpected_paths', 'paths', 'Changes fall outside the allowed scope');
  if (result.protected_changes.length) violation('protected_changes', 'protected_paths', 'Protected paths changed');
  if ((allow.require_clean ?? true) && !result.clean) violation('dirty_worktree', 'require_clean', 'Working tree has staged, unstaged, untracked, or submodule changes');
  if (allow.expected_branch !== undefined && result.branch !== allow.expected_branch) violation('branch_mismatch', 'expected_branch', 'Current branch does not match');
  if (allow.reviewed_revision !== undefined) {
    const reviewed = revision(repo, allow.reviewed_revision, 'reviewed_revision');
    const ancestry = git(repo, ['merge-base', '--is-ancestor', reviewed, result.candidate_revision], true);
    if (ancestry.exit > 1) fail('reviewed_revision', 'Ancestry probe failed');
    const technical = changes(repo, reviewed, result.candidate_revision).flatMap(c => c.paths).filter(p => matches(p, technicalPaths));
    result.review_checks = { reviewed_revision: reviewed, ancestor: ancestry.exit === 0, technical_changes: [...new Set(technical)].sort(), ok: ancestry.exit === 0 && !technical.length };
    if (!result.review_checks.ok) violation('review_violation', 'reviewed_revision', 'Candidate is not an evidence-only successor of the review on configured technical paths');
  }
  for (const path of canonicalFiles) {
    const blobHash = (rev: string) => { const probe = git(repo, ['show', `${rev}:${path}`], true); return probe.exit === 0 ? hash(probe.stdout) : null; };
    const baseline = blobHash(result.baseline_revision), candidate = blobHash(result.candidate_revision), worktree = worktreeHash(repo, path);
    const ok = baseline !== null && baseline === candidate && candidate === worktree;
    result.canonical_hashes[path] = { baseline, candidate, worktree, ok };
    if (!ok) violation('canonical_changed', `canonical_files.${path}`, 'Canonical file is absent or differs');
  }
  if (expectedTree) {
    const roots = [...new Set(expectedTree.map(p => p.split('/')[0]))];
    const observed = [...new Set(roots.flatMap(path => filesUnder(repo, path)))].sort();
    const missing = expectedTree.filter(p => !observed.includes(p)), unexpected = observed.filter(p => !expectedTree.includes(p));
    result.tree_checks = { roots, expected: expectedTree, observed, missing, unexpected, ok: !missing.length && !unexpected.length };
    if (!result.tree_checks.ok) violation('tree_mismatch', 'expected_tree_paths', 'Worktree files (including ignored files) differ from the expected tree');
  }
  for (const [kind, path] of Object.entries(allow.evidence ?? {})) {
    const evidence = loadJson(resolve(base, path as string));
    const aligned = evidence && !Array.isArray(evidence) && evidence.schema_version === 1 && evidence.task === allow.task && evidence.run === allow.run && evidence.candidate_revision === result.candidate_revision;
    const passed = evidence?.ok === true && Array.isArray(evidence.diagnostics) && evidence.diagnostics.length === 0;
    const constraints = kind === 'acceptance'
      ? Array.isArray(evidence?.checks) && evidence.checks.length > 0 && evidence.checks.every((c: any) => c.status === 'passed' && Array.isArray(c.diagnostics) && !c.diagnostics.length && !c.timed_out && !c.launch_error) && evidence.head_before === result.candidate_revision && evidence.head_after === result.candidate_revision && evidence.tested_revision === result.candidate_revision && Array.isArray(evidence.dirty_before) && !evidence.dirty_before.length && Array.isArray(evidence.dirty_after) && !evidence.dirty_after.length
      : evidence?.baseline_revision === result.baseline_revision && Array.isArray(evidence.unexpected_paths) && !evidence.unexpected_paths.length && Array.isArray(evidence.protected_changes) && !evidence.protected_changes.length && Array.isArray(evidence.dirty) && (!(allow.require_clean ?? true) || evidence.dirty.length === 0);
    result.evidence_checks[kind] = { path, aligned: !!aligned, passed: !!passed, constraints: !!constraints, ok: !!aligned && !!passed && !!constraints };
    if (!result.evidence_checks[kind].ok) violation('evidence_mismatch', `evidence.${kind}`, 'Evidence has mismatched identity, schema, or negative/incomplete results');
  }
  result.ok = result.diagnostics.length === 0; exit = result.ok ? 0 : 1;
} catch (error) { result.diagnostics.push(diagnostic(error)); }
emit(result, exit, output);
