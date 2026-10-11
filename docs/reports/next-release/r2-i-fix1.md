task: R2-I-FIX1
status: complete
outcome: B1 corrected (symlinked target or ancestor refused before anything is created or locked) with a failing-before regression; O1 resolved (race tests assert the product diagnostic and exclude barrier timeout and full rollback).
candidate_revision: ac55d44c9ff867ba018bcb8b7f9d50d4c1a09ba0
tested_revision: ac55d44c9ff867ba018bcb8b7f9d50d4c1a09ba0
baseline: 725041b2d54ce131c3d20679ca564fdde2b8ddb6
reviewed_revision: 033b10c748da004e1675c893756979a22c0f6336
artifacts:
  - scripts/install.ts
  - tests/install.test.ts
  - docs/assignments/next-release/r2-i-fix1.md
  - docs/reports/next-release/r2-i-fix1.md
verification:
  - "red: bun test --timeout 30000 tests/install.test.ts on the previous installer with the new tests: exit 1, 40 pass 2 fail (both symlink tests)"
  - "green: same command on the corrected installer: exit 0, 42 pass 0 fail"
  - "bun test --timeout 30000 tests/install.test.ts at candidate: exit 0, 42 pass"
  - "bun test --timeout 30000 tests/ready.test.ts tests/docs-consistency.test.ts: exit 0, 18 pass"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "Reviewed revision above is the one the independent review covered (033b10c); the re-review must cover the candidate."
  - "R3-A docs, assignment and report were not touched (git diff 725041b over docs/examples is empty)."
blockers: []


# R2-I-FIX1 report

All commands ran sequentially under `flock` on `/tmp/ruach-implementation-20261011/verification.lock`; uid 1000, Bun 1.4.2. Independent re-review of the candidate is required and not run.

## B1 disposition: fixed

`scripts/install.ts`: before `mkdirSync(target, { recursive: true })` the installer calls the existing `destination(target, 'ruach-install.ts')`, whose ancestor walk rejects a symlink at the target or any ancestor, exactly as the baseline did during planning. No new abstraction. The under-lock authoritative revalidation, rollback and exits are unchanged.

Regressions (public CLI, through the preload with a 300 ms deadline so that reaching the staging `mkdir` is observable by the `reached` marker):

- a symlinked target ancestor (`link -> real`, target `link/consumer/.agents`): exit 1, diagnostic mentions symlinks, `real` stays empty, lock boundary not reached;
- a symlinked target root to an empty directory, with `--replace`: exit 1, diagnostic mentions symlinks, destination stays empty, lock boundary not reached.

Failing-before: on the previous installer both fail because the installer reached the staging boundary (it had already created directories through the link); after the correction both pass.

## O1 disposition: fixed

A `refused()` helper in `tests/install.test.ts` requires exit 1, a specific diagnostic, and stderr containing neither `barrier deadline` nor `rolled back`. Applied to the stale-create case (`drift or unrecorded files`), invalid metadata (`JSON Parse error`, and `metadata must not be a symlink`) and the unsafe skill entry (`non-regular entry`). Tree, inode and no-staging assertions are kept. The preload still only schedules the race.

## Correction to the earlier documentation proposal

R2-I report's note that a refused first install may leave an empty target root is revised: after this fix a refusal that precedes the lock (staging present, symlinked metadata, symlinked target or ancestor, bad revision) creates nothing. A target root is created only when the install proceeds to take the lock, so a missing root may remain empty only if a post-lock check refuses (for example an unsafe entry or conflict). R-IN should word it that way, not as benign for every refusal. The old report is not rewritten.

## Remaining gaps

Non-cooperating writers remain out of scope; re-review not run; no race test runs the copied `ruach-install.ts`.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
