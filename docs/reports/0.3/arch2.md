---
task: 0.3-arch2
role: architect
status: needs-decision
outcome: "Design for closing the RU-02 forged-clean class is written and ready for implementation once four decisions are confirmed. dirty() stops relying on git status and instead compares committed HEAD tree objects, index entry OIDs and checker-hashed raw worktree bytes and types, using ignore rules only from committed, unchanged .gitignore files. Four further open variants were found and reproduced (info/exclude, core.excludesFile, core.filemode=false, self-ignoring untracked .gitignore), plus an incomplete-assessment case; the design closes them and N2."
baseline: 7cad2f7
artifacts:
  - docs/design/0.3-clean-check.md
  - docs/reports/0.3/arch2.md
  - docs/assignments/0.3/arch2.md
verification:
  - "Read skills/ruach-harness-eval/scripts/{common,scope-check}.ts, acceptance.ts dirty call sites, tests/eval.test.ts, references/config.md, docs/operations.md known limitations, roadmap A1/A4, reports rev-sec, rev2, rev3 (via git show ruach/ruach03-rev2), integ-fix1, integ-fix2"
  - "Probes against the 7cad2f7 dirty() (imported from the worktree, temp repos in session scratch): info/exclude, core.excludesFile, core.filemode=false and self-ignoring untracked sub/.gitignore each return []; a modified root .gitignore reports only .gitignore and hides the untracked file"
  - "Probes on Git 2.47.3: ls-files --others --exclude-per-directory=.gitignore ignores info/exclude; --ignored --directory lists a self-ignoring sub/.gitignore individually; untracked nested repo listed as dir/; a missing submodule dir gives ' D', an empty one is clean; N2 trustctime=false edit with mtime restored gives empty status, while a 15-line prototype comparing ls-tree OIDs with checker-computed blob SHA-1 flags it DIFF"
  - "Measured Node SHA-1 throughput about 360 MB/s on this loaded 8-core host"
  - "Not run: no implementation; regression tests listed but not written; core.symlinks=false and the hand-written index stat variant reasoned, not probed"
review: not-run
discoveries:
  - "New open RU-02 variants beyond N2 (reproduced): .git/info/exclude and repository core.excludesFile hide untracked files; core.filemode=false hides mode changes; an untracked self-ignoring .gitignore hides itself and its siblings; a modified tracked .gitignore hides untracked additions from assessed_paths when require_clean is false"
  - "The design retires hidden_index_state and content_filter_state as redundant. Those cases still fail, but as dirty records (scope exit 1 instead of 2), and false rejections of -filter, no-op smudge filters and untouched assume-unchanged files go away"
  - "Byte-exact comparison makes CRLF/ident/working-tree-encoding checkouts read as dirty; with LF-normalized blobs on Linux nothing changes"
  - "Sparse checkouts read as dirty (D records); harness-eval requires a full checkout"
blockers:
  - "needs-decision D1: byte-exact worktree comparison without eol/ident/encoding conversions (recommended) or conversion-aware hashing (reopens the class)"
  - "needs-decision D2: output contract changes, which are retiring hidden_index_state/content_filter_state, no R/C dirty records (a rename becomes D old plus A new) and a new clean_check_budget code (recommended: accept)"
  - "needs-decision D3: budget values CLEAN_ENTRY_LIMIT 100000 paths and CLEAN_HASH_LIMIT 1 GiB per dirty() call"
  - "needs-decision D4: accept the SHA-1 collision of candidate-authored blobs as a documented trust boundary (recommended) or require byte comparison against blobs"
---

# Architect report: 0.3 content-based clean check

Design: [docs/design/0.3-clean-check.md](../../design/0.3-clean-check.md).

## Proposed design

The cleanliness decision no longer uses `git status`. It is derived from three manifests:
- **H:** the HEAD tree, from `ls-tree -r -l -z`, pinned with `--no-replace-objects`.
- **I:** the index entry OIDs, from `ls-files -s -z`. They are used only to classify a difference as staged or unstaged.
- **W:** the worktree, observed by the checker with `lstat`, `readlink` and streamed hashing (`"blob <n>\0"` with SHA-1 or SHA-256). Exec bits and file types are compared directly. Special files are never opened.

Every path in H ∪ I yields a porcelain-like `XY` record. Untracked files come from `ls-files --others --exclude-per-directory=.gitignore`, which does not read `info/exclude` or `core.excludesFile`. Those rules are trusted only when every `.gitignore` is committed and unchanged. Otherwise the offending files are reported and the listing is redone without excludes.

Consequences:
- No stat field, index flag, `core.*` comparison setting, attribute, filter or exclude config affects the result. That closes N2, the hand-written index variant and the newly found variants, rather than the next single one.
- Submodules are checked recursively with the same algorithm.
- Explicit entry and hash budgets fail closed with `clean_check_budget`.
- The record shape and the consumers' derivations (`dirty_before`/`dirty_after`, `dirty`, `clean`, `assessed_paths`) stay the same, apart from the dropped rename grouping.

## Affected components

- `skills/ruach-harness-eval/scripts/common.ts` (`dirty()`, new constants).
- Tests in `skills/ruach-harness-eval/tests/eval.test.ts`.
- `references/config.md`, `docs/operations.md`, `docs/regression-cases.md` and `CHANGELOG.md`.

`changes()`, canonical/tree checks, `acceptance.ts`/`scope-check.ts` logic and `ready` are unchanged.

## Risks and boundaries

- **Trust boundary** (to document): the checker's own bun, scripts and the `git` on `PATH`; processes that escaped the owned group; candidate-controlled filesystems and case-insensitive filesystems; SHA-1 collisions (D4); ignored files under committed rules.
- **Performance:** every equal-size tracked file is hashed on every call. That is the cost of not trusting stat, and it is bounded by the 1 GiB hash budget, about 3 s of SHA-1 on this loaded host.

## Implementation readiness

Ready to implement once D1 to D4 are confirmed. The defaults recommended in the design can be taken if the Coordinator accepts them. The design lists 34 regression tests (Section 14):
- every probe from rev-sec, rev2 and rev3, plus the new probes P-a to P-e;
- each marked failing-first (**F**) or keep-green (**K**).

Two **F** expectations (`core.symlinks=false` and the hand-written index) rest on reasoning and must be confirmed when they are written. The byte budget is not testable at the public boundary; the test plan says so.

Validation scope: the handoff validator was run with `--repo` (result in the terminal handoff); it checks structure and revision resolution only.
