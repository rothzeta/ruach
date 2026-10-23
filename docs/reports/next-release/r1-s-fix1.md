task: R1-S-FIX1
status: complete
outcome: B1 corrected (the live check now evaluates the commit on the consumer's checked-out branch and pins it) and O1-O3 resolved in the smoke packet; retained 405ffe2 was assembled into this branch first. The packet remains unaccepted and needs independent re-review before live use.
candidate_revision: e102a4010dd0a3e358c79e90b233d28fa694b82a
tested_revision: e102a4010dd0a3e358c79e90b233d28fa694b82a
baseline: 3d512e7866f5472ce5c3a92043f8de6e04fb38f7
reviewed_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
artifacts:
  - evals/next-release-native-smoke/scripts/check.ts
  - evals/next-release-native-smoke/scripts/lib.ts
  - evals/next-release-native-smoke/scripts/prepare.ts
  - evals/next-release-native-smoke/scripts/probe.ts
  - evals/next-release-native-smoke/tests/smoke.test.ts
  - evals/next-release-native-smoke/README.md
  - evals/next-release-native-smoke/matrix.json
  - docs/assignments/next-release/r1-s-fix1.md
  - docs/reports/next-release/r1-s-fix1.md
verification:
  - "red: documented-flow tests on the assembled previous packet (bun test --timeout 30000 evals/next-release-native-smoke, filtered to the six new or changed tests): exit 1, 0 pass 6 fail; acceptance exit 2 candidate_mismatch (Worktree HEAD must equal candidate revision); protected-test case without manifest edit gives scope exit 0, vacuous; candidate==base, detached HEAD and absent-path probe not refused; fixture commit fails under a hostile host gitconfig (exit 128)"
  - "green: bun test --timeout 30000 evals/next-release-native-smoke: exit 0, 13 pass 0 fail"
  - "node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail (root suite only)"
  - "skills/ruach-herdr bun test --timeout 30000: exit 0, 162 pass 0 fail (assembly sanity for imported R2-L/R1-F sources; not combined-candidate acceptance)"
  - "validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "Frozen R3-B code is unchanged: git diff 3d512e7 over agents/, CHANGELOG.md and scripts/install.ts is empty."
  - "Assembling 405ffe2 does not certify a combined candidate; the imported R1-S packet, R2-L and R1-F were accepted separately and the smoke packet is accepted only after re-review."
  - "Historical base/control evidence under docs/reports/next-release/r1-s-prep-evidence/ was produced by the old wiring and is preserved unchanged; it did not exercise the live flow."
blockers: []


# R1-S-FIX1 report

All commands ran sequentially under `flock` on `/tmp/ruach-implementation-20261011/verification.lock`, uid 1000, Bun 1.4.2. No model, native CLI or Herdr live operation ran. Independent exact re-review is mandatory before any live use; nothing here is accepted.

## Source provenance

Branch `ruach/r2-install-lock` was at `3d512e7866f5472ce5c3a92043f8de6e04fb38f7`. `git merge --no-ff` of `405ffe2bc33b0f2587bc1790099b05e4e306bfb8` produced merge commit `08f3010adb2c56eb59a5a3c80baa71bdab45e3e3` (parents `3d512e7`, `405ffe2`) without conflicts. It brings the R1-S smoke packet and its evidence, R2-L and R1-F sources and reports. The fix is `e102a4010dd0a3e358c79e90b233d28fa694b82a`. No `main` merge or push.

## B1 disposition: fixed

Old defect: a subject committing on the checked-out `main` left `refs/heads/candidate` at base, so acceptance failed with `candidate_mismatch` and scope compared `base..base` and passed vacuously. The protected-test control only worked by hand-editing the manifest.

Fix (`scripts/check.ts`): the candidate is the commit on the branch currently checked out in `<packet>/consumer`, found with `symbolic-ref` and `rev-parse`; a detached HEAD or a branch that does not descend from the prepared base is refused; a candidate equal to the base is refused unless `--allow-base` marks the explicit base run. The SHA is pinned into a per-check copy `evidence/config-<run>-<tag>.json` for acceptance and passed as `--candidate` to scope. The output records base, evaluated SHA, ref, prepared candidate and pinned config. README, matrix common checks and the unchanged briefs agree; no unassisted route hints were added.

Regressions: documented flow (commit on the checked-out branch, then `check`, no manifest edit) is accepted at the actual SHA with scope `baseline_revision` and `candidate_revision` equal to base and head and `src/range.ts` in the changes; the protected-test edit now fails scope without manifest mutation; candidate equal to base and detached HEAD are refused. Red and green results are in the verification list. The earlier base-run result is kept by passing `allowBase` explicitly.

## O1-O3 dispositions: fixed

- **O1:** `probe.ts` treats an absent negative path or nonexistent inventory root as unverified unless it appears in the new `evaluator_confirmed` list recorded from outside the boundary. ENOENT alone no longer yields the exclusion verdict. Documented in README.
- **O2:** README column renamed "Provided to the subject (intended; not enforced)".
- **O3:** packet-owned fixture repositories use a new `fixtureGit` with no host global or system config, no signing and no hooks; installer and source clones keep the host Git behavior. A test with a hostile `HOME` gitconfig proves it. No global Git config or real home was changed.

## Remaining gaps

Re-review not run. Native, blind-claim and live-route behavior remain unverified; the packet proves nothing about a subject. Shared R1/R2 docs and the changelog are not edited. The imported report text still describes the old wiring as shipped; this report labels it a defect and does not rewrite old evidence.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
