task: RUACH-ROADMAP-IMPLEMENTATION/R-RV-LFS/R2-L
status: complete
outcome: "No material findings for R2-L. Partial linked-worktree receipts are kept before identity validation (including parseable nonzero results) as individually validated hints only, and a requested cwd must be an ordinary tree in the pinned base before any checkout/branch/workspace/pane/agent mutation. The documented 30 pass / 14 fail baseline and 44 pass correction were reproduced independently."
reviewed_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
candidate_revision: ac675dc9a811416323185a2b6b3a0a58d344d458
tested_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
baseline: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/next-release/r2-l-review.md
  - docs/assignments/next-release/r2-l-r1-f-smoke-review.md
verification:
  - "Shared gate for all three R-RV-LFS reports, run once on the unchanged reviewed revision. Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/lfs-review-VIfz/c; git checkout --detach 405ffe2bc33b0f2587bc1790099b05e4e306bfb8 (HEAD verified); cwd = clone root; uid 1000, Bun 1.4.2; one flock -w 1800 hold on /tmp/ruach-implementation-20261011/verification.lock, sequential, timeout 300 s per command (600 s for the two full suites)"
  - "just install: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 90 pass 0 fail"
  - "just test: exit 0; root 90, ruach-handoff 28, ruach-herdr 162, ruach-harness-eval 71, ruach-changelog 35 pass; 0 fail"
  - "bun audit (root, skills/ruach-handoff, skills/ruach-herdr): each exit 0, no vulnerabilities (26, 6, 2 packages); this queries the registry audit service"
  - "node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json: exit 0"
  - "bun test --timeout 30000 evals/next-release-native-smoke: exit 0, 8 pass 0 fail"
  - "R2-L red check: OS-temp git archive of 405ffe2 with skills/ruach-herdr/scripts/spaces.ts and worker.ts from d75039a, frozen skill install, then (cd skills/ruach-herdr && bun test --timeout 30000 tests/spaces.test.ts) under the lock: exit 1, 30 pass 14 fail. The 14 failures are exactly the receipt cases (unconfirmed, missing pane, wrong HEAD, wrong path, nonzero receipt, ID validation) and the standalone/linked untracked, empty, older-base and blob/symlink/gitlink cwd cases. Green: 44 pass within the Herdr 162 of just test"
  - "git diff --check d75039a 405ffe2: exit 2, solely 'docs/assignments/next-release/r2-l.md:16: new blank line at EOF' (historical assignment, preserved, see discoveries)"
review:
  - "R2-L: no blocking or optional findings"
discoveries:
  - "The committed historical assignment docs/assignments/next-release/r2-l.md ends with an extra blank line, so git diff --check over the range reports it. It is preserved unchanged and disclosed here, not rewritten."
  - "As the author reported and the plan allows, native preparation (prepare) runs before worktreePlan, so a cwd refusal can follow approved harness runtime preparation. Only checkout/branch/workspace/pane/agent mutation is excluded, and that is what the tests assert."
  - "No workflow SKILL body was opened or searched during this review."
blockers: []

# R2-L review (part of R-RV-LFS)

Scope: `d75039a..ac675dc` for `skills/ruach-herdr/scripts/spaces.ts`, `scripts/worker.ts`, `tests/spaces.test.ts` and `tests/fixtures/fake-cli.ts`, plus the R2-L assignment and report at `3bf1942`. Checked against the frozen reliability plan's R2-L section and the common contract. R1-F and R1-S are reported separately in [r1-f-review.md](r1-f-review.md) and [r1-s-prep-review.md](r1-s-prep-review.md). No source or test was edited.

## Receipt before validation: confirmed

- `createLinkedWorktree` (`spaces.ts:76-93`) parses the response first, then passes `hint()`-validated IDs to `receipt` before checking the exit code or timeout, verifying the worktree, or validating the response.
- `hint()` accepts only nonempty, non-whitespace strings with no `\p{Cc}` characters. That rejects newline, CR and tab, as well as non-strings and objects. Each ID is validated individually.
- The success path still requires a zero exit, `verifyWorktree`, string IDs, `is_linked_worktree === true` and a canonical path match. The returned IDs are still assigned on success.
- In `worker.ts:104`, the callback only sets `workspace`/`pane`. Both are undefined before this phase in worktree placement.
- The failure output keeps schema version 1, exit 4, `worktree_state: unknown`, `submission_state: not-submitted` and phase `worktree`. The cleanup text is the generic "Inspect …" string. Receipt IDs are never used for split, start, focus or cleanup commands: split uses the verified `made.pane`, and inspection/focus commands are built only on success.
- Raw native stdout/stderr is never echoed. The nonzero-leak test asserts that the secret is absent from both stdout and stderr.
- There is no retry or fallback. The tests assert a single `worktree` mutation, no `git worktree add`, and no native launches.

## Base-tree cwd preflight: confirmed

- `worktreePlan` (`spaces.ts:34-39`) runs `git --no-replace-objects -C <cwd> cat-file -t <resolved-sha>:<inside>` with separate argv, but only for a non-root canonical `inside`.
- It requires exit 0, no timeout and exactly `tree`. Otherwise it fails with `worktree_cwd_unavailable`, exit 2, field `cwd`, with no Git stderr.
- The check runs inside `worktreePlan`, before resolve/dry-run output and before any checkout, branch, workspace, pane or agent mutation.
- Inherited `GIT_*` variables are stripped by `process.ts` `environment()`.
- The tests run `start`, `resolve` and `start --dry-run` in both standalone and linked modes. They cover untracked, empty, older-base, blob, symlink and gitlink paths, and assert no mutations, no branch, no worktree, an absent target and an empty temp directory.
- Controls: a tracked directory named with spaces, Unicode and a colon launches in its counterpart in both modes. The root, symlink-alias and GIT-env controls are unchanged and pass.

## Findings

None material.

## Limitations

- No live Herdr daemon or native model was used; the review relies on fake-CLI behavior.
- Hosted CI on this revision is not established.
- This unit review is not combined-candidate acceptance.
