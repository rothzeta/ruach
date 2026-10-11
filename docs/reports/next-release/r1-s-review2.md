task: RUACH-ROADMAP-IMPLEMENTATION/R1-S-RV2
status: complete
outcome: "No blocking findings. B1 is fixed: the documented live flow (subject commits on the checked-out branch, then check.ts with no manifest edit) evaluates and pins the actual subject commit, scope compares base to that same commit, and candidate==base, detached HEAD and unrelated history are refused. O1-O3 are resolved. Three optional findings on test naming/coverage and probe confirmation semantics."
reviewed_revision: 2e14d3dde8792f5c01a3ffda1edf1a6eae5ed0d4
candidate_revision: e102a4010dd0a3e358c79e90b233d28fa694b82a
tested_revision: 2e14d3dde8792f5c01a3ffda1edf1a6eae5ed0d4
baseline: 08f3010adb2c56eb59a5a3c80baa71bdab45e3e3
artifacts:
  - docs/reports/next-release/r1-s-review2.md
  - docs/assignments/next-release/r1-s-review2.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r1s2-review-QAxr/c; git checkout --detach 2e14d3dde8792f5c01a3ffda1edf1a6eae5ed0d4 (HEAD verified; the moving integration checkout was not used); cwd = clone root; uid 1000, Bun 1.4.2; one sequential flock -w 1800 hold on /tmp/ruach-implementation-20261011/verification.lock, timeout 300 s per command (600 s for bun run test)"
  - "Assembly: git merge-tree --write-tree 3d512e7 405ffe2 equals the tree of 08f3010 (e1c88884…), so the merge is exact. git diff 08f3010 2e14d3d touches only evals/next-release-native-smoke/{README.md,matrix.json,scripts/check.ts,lib.ts,prepare.ts,probe.ts,tests/smoke.test.ts} plus the fix assignment and report. Unchanged versus 405ffe2: skills/ and the historical r1-s-prep evidence and reports. Unchanged versus 3d512e7: agents/, CHANGELOG.md, scripts/, tests/, docs/examples and docs/coordination.md"
  - "just install: exit 0"
  - "bun test --timeout 30000 evals/next-release-native-smoke: exit 0, 13 pass 0 fail"
  - "node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "Public CLI flows (disposable OS-temp script; prepare.ts and check.ts only; real Git; subject commits made with plain git) on the reviewed packet. Documented flow, commit on checked-out main: check exit 0, acceptance 0, scope 0, candidate equals the subject HEAD, scope baseline/candidate equal base and HEAD. Protected-test edit: exit 1 (scope 1). No commit: exit 2 'candidate equals the base'. Same with --allow-base: exit 1 (acceptance 1 on the unfixed base, scope 0). Detached HEAD: exit 2. Orphan branch with its own commit: exit 2 'does not descend from the prepared base', with no pinned config or results written. Dirty after commit: exit 1, acceptance diagnostic dirty_candidate. Fix committed without report: exit 1, checks visible-tests passed, hidden-cases passed, handoff-valid failed. Reused tag: exit 2"
  - "Same flows on the old packet (08f3010 evals/ tree in a copy of the clone): documented flow exit 1 with acceptance 2 (candidate_mismatch, all checks not-run) and scope 0 ok over base..base. Protected-test, detached and missing-report cases likewise give acceptance 2 with vacuous scope 0. No-commit runs instead of refusing. This independently reproduces the old defect"
  - "git diff --check 08f3010 2e14d3d: exit 0"
review:
  - "B1 (R1-S-PREP review): fixed"
  - "O1: resolved"
  - "O2: resolved"
  - "O3: resolved"
  - "Optional P1: unrelated-history refusal has no packet test despite the test name"
  - "Optional P2: hermeticity test does not cover its 'installer clones keep it' claim"
  - "Optional P3: probe confirmation for negative paths records existence, not marker presence"
discoveries:
  - "The historical r1-s-prep evidence and report remain unchanged and describe the old wiring. The fix report labels them as old-wiring evidence; they are not live-flow proof."
  - "Static and offline evidence only. No model subject, native CLI, plugin, Skills CLI or live Herdr was run, and blind evaluation remains unverified. The live holds in matrix.json and the README (combined candidate SHA, model/effort/permissions, readiness, budget, access boundary, fallback approval) are unchanged."
  - "No workflow SKILL body was opened or searched."
blockers: []

# R1-S-RV2 re-review of the smoke packet correction

Scope: `08f3010..2e14d3d`, where `e102a40` holds the fix and `2e14d3d` adds the fix assignment and report. Checked against my earlier review (`3a9681e`, `r1-s-prep-review.md`), the frozen R1-S plan and common contract, and the harness-eval technical contract (`references/config.md`). No source was edited. The disposable clone, the old-packet copy and the work directories were removed after this report was written.

## B1 disposition: fixed

`scripts/check.ts` now resolves the candidate from the consumer's checked-out branch (`symbolic-ref` then `rev-parse`) and pins that SHA in two places:
- the acceptance input, through a per-check copy `evidence/config-<run>-<tag>.json`, outside the candidate; the prepared config is untouched;
- the scope check's `--candidate`.

It refuses three cases:
- a detached HEAD;
- a branch whose history does not descend from the prepared base;
- a candidate equal to the base, unless `--allow-base` marks the explicit base run.

All refusals happen before any pinned config or result is written. The result records the base, the evaluated SHA and ref, and the prepared candidate.

The protected-test control no longer edits the manifest by hand. The README, the matrix common checks and the usage line document the flow and the detached-HEAD policy. The briefs are unchanged, so no hints were added to the unassisted variant.

Through the public CLI (see verification), the old packet reproduces the defect: acceptance exits 2 and scope passes vacuously. The new packet evaluates the subject commit, and every negative control gives a different, correct outcome. Acceptance and setup outcomes stay distinct: a setup refusal exits 2; a constraint or check failure exits 1. The corrected control still runs the evaluator's solution, and neither the README nor the report presents it as native behavior.

## O1-O3 dispositions

- **O1, resolved.** `probe.ts` adds unconfirmed absent negative paths and nonexistent inventory roots to the reasons, giving `non-blind-or-unverified`. ENOENT alone no longer yields an exclusion verdict. The README keeps evaluator confirmation and the actual effective boundary as separate future requirements. See P3 for a residual nuance.
- **O2, resolved.** The README column now reads "Provided to the subject (intended; not enforced)", next to the existing paragraph on plugin exposure.
- **O3, resolved.** `fixtureGit`, used by `prepare.ts` and by `check.ts` on the consumer, runs with `GIT_CONFIG_GLOBAL=/dev/null`, `GIT_CONFIG_NOSYSTEM=1`, signing disabled and `core.hooksPath=/dev/null`. `git` for source and installer clones (`offline-install.ts`) still inherits host behavior. The hostile-gitconfig test passes under a fake HOME; the real home is untouched.

All other contracts are preserved:
- the scope rules (`src/`, the report path, protected tests, `AGENTS.md`, `package.json`) and the clean-tree requirement;
- the pristine fixture and the stored `*.fixture` tests;
- the separation of brief assistance from answer access;
- the five-row matrix plus fallback, with its live holds;
- bounded child processes and fresh-output and tag refusal;
- the packet typecheck.

## Optional findings

**P1: the unrelated-history refusal has no packet test.**
- **Location:** `tests/smoke.test.ts`, "a detached or unrelated HEAD is refused rather than guessed".
- **Problem:** The test only exercises a detached HEAD. The `merge-base --is-ancestor` refusal I verified through the CLI (orphan branch, exit 2) is untested in the packet.
- **Direction:** Add an orphan or unrelated branch case, or rename the test.

**P2: the hermeticity test does not cover its own title.**
- **Location:** `tests/smoke.test.ts`, "fixture Git commands ignore host signing and hook configuration but installer clones keep it".
- **Problem:** The test asserts only the fixture side. It is made meaningful by `gpgsign` with a nonexistent signer; `hooksPath=/nonexistent` would not fail a commit anyway. Nothing asserts that installer clones keep host configuration.
- **Direction:** Narrow the title, or add a check on the installer side.

**P3: confirmation of an absent negative path records existence, not marker presence.**
- **Location:** `scripts/probe.ts` comment and README "Blind claims" paragraph.
- **Problem:** `evaluator_confirmed` is described as the evaluator having recorded that "the path or root exists", while the code comment says "marker presence (or existence)". For a negative path, the plan requires a known marker location. Confirming existence alone could accept a wrong file that does not contain the marker.
- **Direction:** State that a negative-path confirmation must record marker presence outside the boundary; existence is sufficient only for inventory roots. Not blocking, since no blind claim is made.

## Limitations

- The review is static and offline. No hosted CI, combined-candidate acceptance or native, model or blind evidence is established.
- The assembled R2-L and R1-F sources are unchanged from their accepted `405ffe2` scope and were not re-gated here, beyond `bun run test` and the packet suite.
