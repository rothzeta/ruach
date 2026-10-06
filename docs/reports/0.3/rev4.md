---
task: 0.3-rev4
role: reviewer
status: complete
outcome: "Content-based clean check at 09fe3fc reviewed. Every earlier forged-clean probe (B1 fsmonitor, N1 filters, N2 trustctime/checkStat, the architect's exclude, filemode, self-ignoring and rewritten-index variants) is detected, all 20 new or updated tests fail on the old dirty(), controls and callers are unaffected, and all gates pass. One blocking finding: the hash budget is not shared across submodules, contrary to the design and docs (reproduced). Three optional findings. D1-D4 evaluated, not blocking."
reviewed_revision: 09fe3fca6c8dec2b33eafadd8ad02fb06491ea32
tested_revision: 09fe3fca6c8dec2b33eafadd8ad02fb06491ea32
baseline: 3093323411b125e419785f0dedeb43d46d32ceea
artifacts:
  - docs/reports/0.3/rev4.md
  - docs/assignments/0.3/rev4.md
verification:
  - "ruach/ruach03-integ head 1201c79 differs from 09fe3fc only by docs/reports/0.3/integ-fix3.md (git diff --stat)"
  - "Gates at 09fe3fc in a detached temporary worktree (removed afterwards), sequential: just install 0, just check 0, just release-check 0 (v0.2.1), just test 0: root 90/0, handoff 28/0, herdr 148/0, harness-eval 99/0; load average 24-41"
  - "Fail-without-fix: harness-eval suite of 09fe3fc with common.ts from 7cad2f7 (the same file as 3093323) in an OS-temp copy: 79 pass, 20 fail. The failures are design tests 1, 2, 3, 5, 8, 9, 10, 13, 14, 15, 16, 17, 22, 23, 24, 25, 28, 33 plus the two updated assume-unchanged/skip-worktree tests; this matches integ-fix3's list"
  - "My earlier standalone probe repos run against the new dirty(): rev-sec B1 fsmonitor gives ' M f'; rev2 N1 info/attributes filter gives ' M f'; rev3 core.attributesFile filter gives ' M f'; rev3 N2 trustctime=false with ns-restored mtime and advanced index mtime gives ' M protected' while plain git status is empty"
  - "Further probes, new dirty(): HEAD tree object rewritten as a loose object or inside a pack with a forged idx name gives git_error (Git verifies tree hashes on read, fails closed); sparse index with out-of-cone files restored plus untracked out/evil.ts gives '?? out/evil.ts'; core.worktree pointing at the parent directory gives git_error; untouched latin-1 file name gives ' D' (false dirty, fail closed); untracked file inside a plain sub/.git directory gives [] (also invisible to git status)"
  - "Budget probe: copy of common.ts with CLEAN_HASH_LIMIT=1500 and a trace; three sibling submodules with 600-byte files plus a 525-byte .gitmodules hashed 2325 bytes in one dirty() call without clean_check_budget. Each submodule restarted from the parent count (1125)"
  - "Static: design doc, implementation diff, config.md, CHANGELOG, operations.md, regression-cases.md, docs-consistency test"
  - "Not run: 1 GiB boundary, SHA-256 repositories, case-insensitive filesystems, GitHub CI"
review:
  - "Blocking 1, optional 3; see report body"
discoveries:
  - "Git verifies tree and commit object hashes on read (loose and packed), so the design's committed-objects principle holds against a rewritten object store; a forged tree fails closed as git_error"
  - "All probe copies and repositories lived in the session scratch directory; branch files were not modified apart from this report"
blockers:
  - "Blocking finding R1 (submodule hash budget not shared) needs an Implementer fix"
  - "D1-D4 remain pending user ratification (not a review blocker)"
---

# Review 0.3-rev4: content-based clean check

Reviewed revision: `09fe3fc`. Diff: `3093323..09fe3fc`, including the arch2 design merge. The branch head `1201c79` adds only reports.

## Design fidelity

`dirty()` (`skills/ruach-harness-eval/scripts/common.ts:116-247`) implements Sections 3-11 of `docs/design/0.3-clean-check.md` faithfully:

- **Inputs:** the HEAD manifest comes from `ls-tree -r -l -z --full-tree`, and the index manifest from `ls-files -s -z`, used only for the X column.
- **Worktree observation:** paths are walked with `lstat` and never followed through symlinks. Regular files are opened with `O_NOFOLLOW|O_NONBLOCK`, the descriptor is checked against the `lstat` identity and size, and the content is streamed in 1 MiB chunks. Symlinks are hashed from `readlink` bytes. Special files are never opened. The size shortcut is applied only when the index matches HEAD.
- **Ignore rules:** only committed, unchanged `.gitignore` files are trusted. If any `.gitignore` is untrusted, the check falls back to listing every untracked file.
- **Submodules:** they are checked recursively to depth 4.
- **Retirements:** `hidden_index_state` and `content_filter_state` are retired as specified.

The one deviation is R1.

## Blocking

### R1. The hash budget is not shared across submodules
- **Location:** `common.ts:240`. `cleanCheck(inner, { format, hashed: context.hashed, depth })` copies the counter into a new context and never adds the inner bytes back.
- **Problem:** each sibling submodule starts again from the parent's count. One `dirty()` call can therefore hash up to (number of submodules) × 1 GiB, multiplied again by nesting. The design (§8: "the budgets shared"), `references/config.md` ("1 GiB hashed per call") and `docs/operations.md` all state a per-call bound, so the A4 time bound is not what is documented. Acceptance calls `dirty()` twice with no outer deadline.
- **Evidence:** I set the limit to 1500 bytes in an OS-temp copy and traced the hashing. A parent with a 525-byte `.gitmodules` and three submodules holding 600-byte files hashed 2325 bytes with no `clean_check_budget`; the trace shows 1125 for each submodule.
- **Direction:** pass the same context object (or add the inner `hashed` back), and add a small test with a lowered limit or an injected budget. The entry budget is per listing by design; state in the docs whether it is per repository.

## Optional

### R2. File names that are not valid UTF-8 read as dirty in an untouched checkout
- **Evidence:** a committed latin-1 name `caf\xe9` gives ` D`, while `git status` reports clean.
- **Assessment:** this fails closed, and design §5 accepts it, but neither `references/config.md` nor `docs/operations.md` mentions it.
- **Direction:** add one line to the Clean check section.

### R3. A plain directory named `.git` hides untracked files
- **Evidence:** `sub/.git/evil.ts`, where `sub/.git` is not a repository, is invisible to `ls-files --others`. The same holds for `git status`; this is pre-existing Git behavior.
- **Assessment:** it cannot be committed, so it only matters for acceptance runs whose code reads it. It sits beside the documented "ignored files are outside `clean`" boundary.
- **Direction:** document it with that boundary, or fail closed when any non-repository `.git` directory exists below the root.

### R4. Docs-consistency coverage is thin
- **Location:** `tests/docs-consistency.test.ts`.
- **Problem:** the test asserts only `clean_check_budget` and "0.3 contract change". It would not catch the per-call budget wording drifting from the implementation (as R1 shows).
- **Direction:** acceptable as is; consider asserting the budget values from the exported constants.

## Hunt for further variants (all detected or fail closed)

| Variant | Result |
|---|---|
| Rewritten HEAD tree object (loose, or packed with a forged idx entry) | `git_error`: Git verifies tree and commit hashes on read |
| Racy index | Not consulted |
| Hand-written index stat | Test 3 |
| Inherited `GIT_*` environment | Stripped; existing tests |
| `core.worktree` pointing at a parent | `git_error` (`root()`'s containment check and discovery) |
| Sparse index with an untracked file inside a collapsed directory | Reported as `??` |
| Symlinked parent, file replaced by a directory, FIFO | Tests 30-31 |
| Hash-budget bypass | R1 |
| TOCTOU during the hash | The descriptor identity and size checks plus the EOF check make a concurrent change read `unreadable`, which is `M`. Same-size rewrites racing the read are covered by design §12.2 (processes that outlive the checks) |
| `require_clean: false` | Test 25 |

Controls are unaffected: the eol control, autocrlf, ignored files, an untouched assume-unchanged file, a 17 MiB streamed file and the existing scope and acceptance tests.

## D1-D4 (Coordinator decisions, pending ratification; not blocking)

- **D1 byte-exact comparison:** agree. Conversion-aware hashing would reopen the class. The cost is that CRLF, ident and LFS checkouts read as dirty, which is documented.
- **D2 contract changes:** reasonable and documented in config.md and CHANGELOG. Consumers that parse `R`/`C` records or the two retired codes must adapt. In this repository, only tests consume them.
- **D3 budgets:** the values are sensible. At about 360 MB/s the 1 GiB bound costs a few seconds, but it only holds once R1 is fixed. 100,000 paths will reject large monorepos with `clean_check_budget`; that is acceptable if documented as such.
- **D4 SHA-1 collisions:** accepting them as a documented boundary is proportionate. A chosen-prefix collision requires the candidate to author the committed blob too.

**Unverified:** the 1 GiB boundary, SHA-256 repositories, case-insensitive filesystems and GitHub CI.
