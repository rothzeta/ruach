# Configuration and results (schema_version 1)

JSON only; unknown fields, duplicate IDs, wrong types, unsupported versions, and unknown options are errors. JSON object keys should be unique (the JSON parser uses the final duplicate value). All filesystem paths in configuration are relative to the configuration file unless absolute. CLI paths are relative to the invocation cwd. Git refs must resolve to commits; option-like refs are rejected. Files are read from supplied worktrees, never from an implicit checkout. Internal Git probes remove inherited `GIT_*` environment variables, then set `GIT_OPTIONAL_LOCKS=0`; repository-selection, index/object/discovery overrides, and environment-injected Git configuration cannot redirect them. The resolved worktree must contain the explicitly requested directory (subdirectories and symlink aliases are supported). Output protection uses that verified worktree and its actual Git metadata. Acceptance check processes retain their inherited/configured environment, including intentional Git variables, separately from these private probes.

## Acceptance

```json
{
  "schema_version": 1,
  "task": "directory-cli",
  "assignment": "assignment.md",
  "acceptance": {
    "fixtures": [
      {"id": "spaced", "copy": ["bin/entry", "scripts/entry.sh"], "directory": "checkout with spaces"}
    ],
    "checks": [
      {"id": "foreign", "argv": ["{repo}/bin/entry"], "cwd": "{foreign_cwd}", "timeout_ms": 10000,
       "expect": {"exit": 0, "stdout": "{repo}\n", "stderr": ""}},
      {"id": "negative", "argv": ["{fixture:spaced}/bin/entry", "unexpected"], "cwd": "{foreign_cwd}", "timeout_ms": 10000,
       "expect": {"exit_nonzero": true, "stdout": "", "stderr_contains": "usage"}}
    ]
  },
  "runs": [
    {"id": "trial-a", "repo": "worktrees/a", "candidate": "refs/heads/trial-a", "kind": "harness-a", "model": "explicit-model-a", "effort": "explicit-effort"},
    {"id": "trial-b", "repo": "worktrees/b", "candidate": "refs/heads/trial-b", "kind": "harness-b", "model": "explicit-model-b"}
  ]
}
```

Required root fields: `schema_version`, nonempty `task`, assignment file path, `acceptance`, and nonempty `runs`. Each run requires unique nonempty `id`, `repo`, `candidate`, `kind`, and `model`; `effort` and `evidence` (array of independent native-evidence file paths) are optional. Evidence files are hashed and referenced, never interpreted as proof of model use. `model_use_verified` always remains false.

`acceptance.checks` is nonempty. Each check requires unique `id`, nonempty `argv` array, `cwd`, integer `timeout_ms` from 1 to 3600000, and `expect`. Optional `env` maps environment names to strings; checks inherit the current environment and apply only the explicit overrides. No environment dump is emitted. Executable lookup honors the effective PATH (including empty entries as the check cwd); an absent PATH has no implicit fallback. Absolute or slash-containing executable paths resolve directly against the check cwd. `acceptance.secret_env` optionally lists additional environment names whose values should be redacted.

`cwd` must be exactly `{repo}`, `{foreign_cwd}`, or `{fixture:ID}`. These tokens also expand inside individual argv, env, and expected-output strings without word splitting. `{foreign_cwd}` is a fresh, empty directory outside the candidate. Token-shaped `{unknown}` strings are rejected; other literal braces are allowed. No shell, arbitrary evaluator expressions, or command interpolation is supported. Empty argv elements are permitted after the executable.

`expect` requires exactly one of `exit` (integer 0..255) or `exit_nonzero: true`. Optional `stdout`/`stderr` demand exact strings; `stdout_contains`, `stderr_contains`, `stdout_not_contains`, `stderr_not_contains` test literal substrings, case sensitive. For example, a Bun test-suite check can require `stderr_not_contains: "\n 0 pass\n"` to reject the zero-pass summary. A signal, timeout, or output-limit termination always fails, even with a nonzero-exit expectation.

Optional `expect.files` is an array of `{path, content?, sha256?}` relative to the check cwd. At least one expected value is required; both are enforced when present. Content supports root tokens; sha256 is lowercase hex. Missing/unreadable files and symlinks fail the check.

Fixtures are optional. Each `{id, copy, directory}` copies nonempty, non-overlapping repository-relative files/directories from the selected candidate into a private temporary fixture. IDs use letters, digits, `_` or `-`; directory names can contain spaces. Copy paths and destination directories reject absolute paths, traversal, empty segments, backslashes, and `.git` components. Symlinks, including parent links, special files, and nested Git metadata are rejected. File/directory modes are preserved. Cleanup removes the private parent after recording results. No extra fixture package install is implicit.

HEAD must equal the resolved candidate at setup; mismatch returns exit 2 with not-run checks. Checks run sequentially and retain earlier failures. Missing/unlaunchable executables produce not-run records and exit 2, while later checks still run. Acceptance requires a clean worktree before and after; dirty candidates, HEAD movement, and movement of the configured candidate ref produce exit 1. A failure to resolve the ref after checks is a setup error (exit 2). Candidate commands are trusted supplied programs, not sandboxed by this tool.

Each result includes task/run and declared route; SHA-256 of assignment bytes, canonicalized acceptance object, and fixture manifest; candidate/tested revisions; HEAD before/after and candidate ref after; dirty before/after; checks; diagnostics; `ok`. Checks contain ID, fingerprint, status (`passed`, `failed`, `not-run`), expanded argv/cwd, timeout, expected values, exit/signal, `timed_out`, `launch_error`, `output_truncated`, stdout/stderr, and diagnostics. Setup failures may omit unavailable fields and leave checks not-run. Test fingerprints hash assignment/acceptance/fixture hashes and the canonical unexpanded check, excluding run identity and absolute candidate roots. Different fixture bytes or modes change their hash. Object-key ordering does not change hashes; array ordering does.

Outputs retain up to 1 MiB per stream, decoded as UTF-8. Exceeding that bound terminates the command and fails the check; truncated evidence cannot pass. Timeout kills the process group on Unix; Windows uses direct child termination. Credential-like argv values and known values from token/secret/password/credential/API-key/authorization environment names are replaced with `[REDACTED]` in emitted records and excerpts. Fingerprints still use the original configuration. Redaction is bounded to these known values; avoid putting other credentials in arbitrary command strings or outputs. No unrestricted environment/auth configuration is read into results.

## Scope

```json
{
  "schema_version": 1,
  "paths": ["README.md"],
  "prefixes": ["src/", "tests/"],
  "require_clean": true,
  "protected_paths": ["canonical/", "existing-command"],
  "reviewed_revision": "reviewed-commit",
  "technical_paths": ["src/", "tests/"],
  "expected_branch": "delivery",
  "canonical_files": ["canonical/role.md"],
  "expected_tree_paths": ["prototype/source", "prototype/assets/image"],
  "task": "directory-cli",
  "run": "trial-a",
  "evidence": {"acceptance": "trial-a.json", "scope": "prior-scope-a.json"}
}
```

Only `schema_version` is required. `paths` and `prefixes` default empty (no changes allowed). `paths` are exact repository-relative paths; `prefixes` must end in `/`. `protected_paths` and `technical_paths` accept exact paths or explicit prefixes ending `/`. There are no glob rules. Paths reject absolute/traversal/backslash/empty segments and `.git` components. All configured protections override allowances.

Compare the specified baseline directly with the specified candidate, using NUL-delimited Git records. Added/deleted files, modes, and both paths of detected renames/copies are assessed. Separately report current HEAD, branch, and content-based dirtiness (see Clean check), including staged, unstaged, untracked, and submodule changes. `require_clean` defaults true. When false, dirty paths still count toward allowed/protected scope; `clean` never becomes true for a dirty checkout. The observed HEAD can differ from the committed candidate being compared; no implicit checkout occurs.

Optional review requires commit ancestry. Changes on `technical_paths` between reviewed revision and candidate fail. Technical paths require a review revision; their default is empty (ancestry only). Optional branch constraint checks the current worktree branch; detached HEAD is null.

`canonical_files` requests equality of baseline blob, candidate blob, and worktree bytes, returning SHA-256 for each. Absent files fail; symlink blobs are hashed as their link-target text, and parent symlinks are rejected. `expected_tree_paths` is a nonempty exact list of worktree files. Its first path components select the trees to scan (e.g. `prototype/…` scans all of `prototype`); every regular file, symlink, and special file is counted, including ignored additions. Empty directories are not counted. This opt-in tree constraint is independent of Git's dirty set.

Optional evidence requires explicit nonempty `task` and `run`. Each evidence file must be a single v1 result object, match task/run/candidate, report `ok: true`, and have no diagnostics. Acceptance evidence additionally requires nonempty passed checks without check diagnostics/timeouts/launch errors, matching tested and before/after HEAD revisions, and clean before/after states. Prior scope evidence must match baseline and have no unexpected/protected paths, and satisfy the configured clean requirement. This checks supplied records, not their truth; no SHA search in prose, historical-array coercion, positional join, or reinterpretation of negative evidence is supported.

Scope output includes baseline/candidate revisions, worktree HEAD, branch, detailed changes, committed changed paths, combined assessed paths, unexpected/protected paths, detailed dirty records and `clean`, optional review/canonical/tree/evidence checks, task/run when supplied, diagnostics, and `ok`. A dirty record has a porcelain-style two-letter `status`, its affected `paths` (always exactly one path), and `staged`, `unstaged`, `untracked` flags. 0.3 contract change: renames and copies are no longer grouped into one `R`/`C` record; a dirty rename is a deletion of the old path plus an addition of the new path, and both paths still appear in `assessed_paths`. The setup errors `hidden_index_state` and `content_filter_state` are retired, and `clean_check_budget` (exit 2) is new. Git probes use `GIT_OPTIONAL_LOCKS=0`, disable external diff/textconv for change listing, and never checkout/reset/stash/add/commit or refresh the index.

## Evidence files and exits

`--output` must name a new file outside the checkout, per-worktree Git directory, and common Git directory. Parent directories must already exist. Symlink parents are resolved when checking this boundary. Writes use exclusive creation with mode 0600. A pre-existing path is rejected before checks, retaining earlier evidence. Final exclusive-create errors return exit 2 with JSON on stdout. Stdout remains the structured result even without an output file. `--help` emits usage text and exits 0.

Exit 0 means configured checks passed; exit 1 means observable/constraint failure; exit 2 means usage/config/input/revision/executable/setup/evidence-write failure. Diagnostic objects have stable `code`, `field`, and concise `message`; errors do not echo process output or private environment values. A clean JSON result or metadata validation does not certify native harness behavior or establish a reviewed implementation.

## Clean check

`dirty` is decided from committed objects and raw worktree bytes only, never from `git status`. The HEAD tree is read with replacement refs disabled. Each tracked worktree path is observed with `lstat`/`readlink`/streamed reads and hashed by the checker, and compared with the HEAD tree and the index entry object IDs. The index can mark a path staged but can never make it clean. No index stat data or flag (assume-unchanged, skip-worktree, fsmonitor), `core.*` comparison setting, attribute, filter, `info/exclude`, `core.excludesFile` or `status.*`/submodule ignore setting is consulted, so none of them can forge a clean result.

- **Path names** that are not valid UTF-8 resolve to a different filesystem path, so an untouched checkout containing one reads as dirty (fail closed).
- **Plain `.git` directories.** An untracked file inside a directory named `.git` that is not a repository is invisible to the listing, as it is to `git status`; such a directory cannot be committed. Treat it like ignored files, which are outside `clean`.
- **Byte-exact.** Working copies converted by `autocrlf`/`eol`, `ident`, filters (for example Git LFS) or another working-tree encoding read as dirty. Use `canonical_files` or check such checkouts another way. A full checkout is required: sparse-checkout paths outside the cone read as deleted.
- **Ignore rules.** Untracked files are ignored only by `.gitignore` files that are tracked, in HEAD and unchanged. If any `.gitignore` is modified, staged, deleted or untracked, it is reported as dirt and every untracked file is assessed.
- **Executable bit** is `S_IXUSR` regardless of `core.filemode`; symlinks are compared by target bytes regardless of `core.symlinks`. Special files (FIFO, socket, device) are never opened and read as dirty.
- **Submodules** are checked recursively (depth 4): a missing directory is ` D`, an empty directory is clean, a non-repository directory or another commit is changed, and any inner change marks the gitlink path modified.
- **Budgets.** At most 100,000 paths per listing (counted per repository, so each submodule has its own) and 1 GiB hashed per call, shared across the parent and all submodules; exceeding either is a setup error (`clean_check_budget`, exit 2), never clean. Files whose size already differs from the committed blob are not read.
- **Trust boundary.** The `bun` runtime, these scripts and the `git` binary on the caller's PATH are trusted; candidate processes that outlive the checks, candidate-controlled filesystems, case-insensitive or normalizing filesystems, and SHA-1 collisions authored by the candidate (equality is by object ID, without Git's collision detection; SHA-256 repositories are unaffected) are out of scope. Ignored files under committed rules are outside `clean`.
