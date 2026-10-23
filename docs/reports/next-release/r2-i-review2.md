task: RUACH-ROADMAP-IMPLEMENTATION/R-RV-I2
status: complete
outcome: "No blocking findings. B1 (symlinked target/ancestor written through before refusal) is fixed and O1 (race tests satisfiable by barrier timeout or full rollback) is resolved at the reviewed revision; original R2-I acceptance items are rechecked as preserved. One optional wording note on the revised empty-root proposal."
reviewed_revision: 877fc68394c2e417922e2d10c4907d2120c650b6
candidate_revision: ac55d44c9ff867ba018bcb8b7f9d50d4c1a09ba0
tested_revision: 877fc68394c2e417922e2d10c4907d2120c650b6
baseline: 033b10c748da004e1675c893756979a22c0f6336
artifacts:
  - docs/reports/next-release/r2-i-review2.md
  - docs/assignments/next-release/r2-i-review2.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r2i2-review-5rHh/c; git checkout --detach 877fc68394c2e417922e2d10c4907d2120c650b6 (HEAD verified); uid 1000, Bun 1.4.2; checks below ran with cwd = that clone root under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock"
  - "just install: exit 0"
  - "bun test --timeout 30000 tests/install.test.ts: exit 0, 42 pass 0 fail"
  - "bun test --timeout 30000 tests/ready.test.ts tests/docs-consistency.test.ts: exit 0, 18 pass 0 fail"
  - "just check: exit 0"
  - "just release-check: exit 0 (v0.3.0 verified)"
  - "bun run test: exit 0, 100 pass 0 fail across 10 files"
  - "Red check (OS-temp git archive of 877fc68 with scripts/install.ts from 725041b, identical to 3f55313), bun test --timeout 30000 tests/install.test.ts under the lock: exit 1, 40 pass 2 fail; the two failures are exactly the new symlink tests, failing on the not-reached-barrier assertion (Expected false, Received true)"
  - "Earlier disposable symlink probe rerun on the candidate installer: ancestor-symlink and symlinked-root targets both exit 1 with 'Snapshot destinations must not be symlinks' and the link destinations stay empty (earlier candidate left real/consumer/.agents)"
  - "git diff --quiet 3f55313 725041b -- scripts tests and git diff --quiet ac55d44 877fc68 -- scripts tests: both exit 0 (installer delta under review is only 3f55313..ac55d44)"
review:
  - "B1 (R-RV-I): fixed"
  - "O1 (R-RV-I): resolved"
  - "Optional N1: revised empty-root wording slightly overstates which post-lock refusals can leave an empty root"
discoveries:
  - "Workflow-body visibility disclosure: during the earlier R3-A review (report ebe14e7, docs/reports/r3/specimens-review.md) I ran grep for 'task-record|earlier approval|approval' over agents/coordinator.md, docs/coordination.md and skills/ruach-workflow-*/SKILL.md inside the R3-A clone. The grep scanned every workflow SKILL.md matched by that glob and displayed two lines of skills/ruach-workflow-feature/SKILL.md (lines 94 and 129, on delivery authorization and silence-is-not-approval). I did not open or read any workflow body in full, and no R3-A finding depended on those lines. That report nevertheless names skills/ruach-workflow-feature/SKILL.md as an adjacent input; the report is preserved unchanged. No workflow body was opened or searched in this re-review or in the first R2-I review."
  - "R3-A specimen documents (95f1712/725041b) are ancestors of the reviewed revision but are outside this review's acceptance scope; their separate review (ebe14e7) requested changes and they are under correction. This review does not accept them."
blockers: []

# R-RV-I2 re-review of the R2-I installer correction

Scope: `scripts/install.ts` and `tests/install.test.ts` delta `725041b..ac55d44`, plus the fix assignment and report at `877fc68`. All original R2-I acceptance was rechecked against the frozen plan R2-I packet and common contract, the R2-I report and my earlier review `4042b8f`. No source or test was edited. The disposable clone `/tmp/r2i2-review-5rHh` was removed after this report was written.

## B1 disposition: fixed

`scripts/install.ts:146-147` calls the existing `destination(target, 'ruach-install.ts')` before `mkdirSync(target, …)` and the staging lock. Its ancestor walk rejects a symlink at the target itself or at any existing ancestor, the same primitive that the baseline reached during planning. The extra path segment `ruach-install.ts` is always a managed destination (`EXTRAS`), so a symlink there was already refused on baseline; it is not a new refusal. The authoritative planning under the lock is unchanged, including `destination()` for every managed path. A swap between the preflight and the `mkdir` is an unrelated-writer race and stays out of scope, as the plan states.

The two new public-CLI regressions use the preload with a 300 ms deadline and assert that the `reached` marker is absent. That proves the staging `mkdir` was never attempted. They also check exit 1 with a symlink diagnostic, no `barrier deadline` or `rolled back` text, and an empty link destination. Both an ancestor symlink and a symlinked root with `--replace` are covered. I reproduced red-before (2 fail) and green-after (42 pass) independently.

## O1 disposition: resolved

`refused()` requires exit 1, the specific product diagnostic, and the absence of both `barrier deadline` and `rolled back`. It is applied to:
- the stale-create race (`drift or unrecorded files`);
- both invalid-metadata cases (`JSON Parse error`, `metadata must not be a symlink`);
- the unsafe-entry race (`non-regular entry`).

The existing tree-hash, inode, manifest, `roles.yaml` and no-staging assertions are kept. The drift and foreign-owner tests already asserted diagnostics (`drift`, `.ruach-staging`) that a barrier timeout cannot produce. The preload is unchanged and still only schedules the race.

## Original R2-I acceptance, rechecked

- The immutable incoming snapshot is still read outside the lock. All target-dependent reads are still inside the lock, and owned staging is the only thing cleaned on a planning failure. A foreign staging directory is never removed.
- Metadata-last ordering, inode-guarded rollback, exits 0/1/3, and the copied-installer, symlink, hardlink, leftover and consumer-extras tests all pass unchanged.
- The RU-07 chmod tests executed under uid 1000.
- The original five race tests still pass, and no installer behavior changed apart from the preflight. Their failing-before evidence against `d75039a` was established in `4042b8f`. It was not rerun here, because the change touches only the preflight and assertion strength.

## Optional finding

**N1: the revised empty-root wording is slightly imprecise.**
- **Location:** `docs/reports/next-release/r2-i-fix1.md`, section "Correction to the earlier documentation proposal".
- **Problem:** For a target that did not exist, the examples "an unsafe entry or conflict" can only arise if another process creates them after the root `mkdir`. The realistic ways an empty root can be left behind are a concurrent installer winning the staging `mkdir` (`EEXIST`), or a non-`EEXIST` `mkdir` failure.
- **Why it matters:** Only for the accuracy of the future R-IN documentation. The safety claim, that refusals before the lock create nothing, is correct and verified.
- **Direction:** When R-IN writes the recovery documentation, say that a missing root can be left empty only if the install loses or fails the lock, or is refused after taking it.

No other material findings.

## Limitations

- Non-cooperating writers are out of scope by design.
- No race test drives the copied `ruach-install.ts`; the plan does not require one.
- Hosted CI, native behavior, R-IN integration and acceptance of any later revision are not established here.
- Compatibility with workflow source bodies was not assessed and is Coordinator-owned.
