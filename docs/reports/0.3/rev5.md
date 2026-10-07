---
task: 0.3-rev5
role: reviewer
status: complete
outcome: "R1 is closed at c6594f5: one hash budget is shared across the parent, sibling submodules and nested submodules; reproduced with my rev4 probe; the new test fails without the fix. R2 and R3 are documented accurately in config.md and operations.md, and R4's assertion is in place. All gates pass. No blocking findings; two optional notes."
reviewed_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
tested_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
baseline: 09fe3fca6c8dec2b33eafadd8ad02fb06491ea32
artifacts:
  - docs/reports/0.3/rev5.md
  - docs/assignments/0.3/rev5.md
verification:
  - "ruach/ruach03-integ head d9aae24 differs from c6594f5 only by docs/reports/0.3/integ-fix4.md (git diff --stat)"
  - "Gates at c6594f5 in a detached temporary worktree (removed afterwards), sequential: just install 0, just check 0, just release-check 0 (v0.2.1), just test 0: root 90/0, handoff 28/0, herdr 148/0, harness-eval 101/0"
  - "R1 probe (rev4 repo: three 600-byte sibling submodules plus a 525-byte .gitmodules, 2325 bytes in total) with the c6594f5 dirty(): hashLimit 1500 throws clean_check_budget; 2400 and 99999 pass. At 09fe3fc the same probe hashed 2325 bytes against a 1500 limit without an error"
  - "Nested probe (r > mid > leaf, 600 bytes each in mid and leaf): hashLimit 1300 throws clean_check_budget; 99999 gives []"
  - "Fail-without-fix: c6594f5 suite with common.ts from 09fe3fc in an OS-temp copy: test R1 fails and R4 passes; with the fix both pass"
  - "Static: diff 09fe3fc..c6594f5 for common.ts, eval.test.ts, config.md, operations.md"
  - "Not run: real 1 GiB boundary, GitHub CI"
review:
  - "Blocking 0, optional 2"
discoveries:
  - "The R1 test drives the hash bound through a new optional dirty() parameter, limits.hashLimit, that callers do not use; acceptance and scope-check call dirty(repo) unchanged"
blockers:
  - "D1-D4 remain pending user ratification (unchanged; not a review blocker)"
---

# Re-review 0.3-rev5 (R1-R4)

Reviewed revision: `c6594f5`. Diff: `09fe3fc..c6594f5`. The branch head `d9aae24` adds only the integ-fix4 report.

## Verdicts

- **R1: closed.**
  - `skills/ruach-harness-eval/scripts/common.ts:122-124`: `Context` carries one `Budget` object.
  - `:157-158`: hashing is counted against `context.budget`.
  - `:242`: the submodule recursion passes the same object, so siblings and nested submodules accumulate into one count.
  - `:250`: `dirty()` creates a single budget per call.
  - My rev4 probe and a nested probe both now stop at the lowered limit.
- **R2/R3: documented accurately.** `references/config.md` (Clean check) and `docs/operations.md` describe the behaviour I observed in rev4: non-UTF-8 names read as dirty, and plain `.git` directories hide untracked files. The entry budget is stated per repository, which matches `split()` being called per listing in each `cleanCheck`.
- **R4: asserted.** The new test reads both budget values from the exported constants.
- **No regressions.** All suites pass, and the callers are unchanged.

## Optional

1. **The R1 test fails without the fix only partly because of sharing.**
   - The old `dirty()` ignores the new `hashLimit` argument, so the test would fail against it whatever the sharing behaviour.
   - My rev4 evidence (old code with the constant lowered: 2325 bytes hashed against a 1500 limit) and today's probe (new code throws) show that sharing itself is what changed.
   - A stronger test would compare limits just above and just below the per-repository maximum and the total, for example 1500 against 2400, which I checked by hand.
2. **The R4 test would also have passed before the fix.**
   - It asserts the numbers (100,000 and 1 GiB), which the old docs already contained, but not the new "shared across submodules" or "per repository" wording.
   - It still prevents the values from drifting away from the constants. Adding the sharing phrase is optional.

**Unverified:** the real 1 GiB boundary and GitHub CI.
