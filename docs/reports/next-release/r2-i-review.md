task: R-RV-I
status: complete
outcome: "Changes requested: one blocking finding (the target root is now created through a symlinked target or ancestor before any symlink check, which the baseline refused without mutation) and one optional test-evidence finding. Lock-ordering, owned-staging cleanup, failing-before evidence and all required checks are otherwise confirmed."
reviewed_revision: 033b10c748da004e1675c893756979a22c0f6336
candidate_revision: 3f55313fa5d0dfc28c51a94738d519dbc514fdac
tested_revision: 033b10c748da004e1675c893756979a22c0f6336
baseline: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/next-release/r2-i-review.md
  - docs/assignments/next-release/r2-i-review.md
verification:
  - "just install: exit 0"
  - "bun test --timeout 30000 tests/install.test.ts: exit 0, 40 pass 0 fail"
  - "bun test --timeout 30000 tests/ready.test.ts tests/docs-consistency.test.ts: exit 0, 18 pass 0 fail"
  - "just check: exit 0"
  - "just release-check: exit 0 (v0.3.0 verified)"
  - "bun run test: exit 0, 98 pass 0 fail across 10 files"
  - "Baseline comparison (OS-temp git archive of 3f55313 with scripts/install.ts from d75039a), bun test --timeout 30000 tests/install.test.ts: exit 1, 35 pass 5 fail; the five failing tests match the author's failing-before table"
  - "Disposable symlink probe (baseline vs candidate installer, OS temp): both exit 1; candidate leaves directories created through the symlink, baseline creates nothing"
  - "Disposable barrier-timeout probe (preload with RUACH_INSTALL_BARRIER_MS=300, never released): exit 1, target unchanged, no staging"
review:
  - "Blocking B1: scripts/install.ts:147 creates the target root through a symlinked target ancestor before any symlink check"
  - "Optional O1: three R2-I race tests assert only exit 1 plus unchanged tree, which a barrier timeout or a full rollback also satisfies"
discoveries:
  - "The report's 'refused first install may leave an empty target root' is, for a nonexistent target, effectively only reachable via the unsafe-ancestor case in B1; the R-IN documentation proposal should not present it as benign until B1 is resolved."
  - "Runs used uid 1000 and Bun 1.4.2, so RU-07 chmod rollback tests executed rather than skipped."
blockers:
  - "B1 must be corrected (with a regression) by the R2-I Implementer and re-reviewed before R-IN integrates R2-I."

# R-RV-I review of R2-I

Scope: full diff `d75039a..033b10c` (code at `3f55313`; `033b10c` adds only `docs/assignments/next-release/r2-i.md` and `docs/reports/next-release/r2-i.md`). Files reviewed: `scripts/install.ts`, `tests/install.test.ts`, `tests/fixtures/install-lock-preload.ts`, the R2-I assignment and report, against the frozen plan `/tmp/ruach-implementation-20261011/inputs/next-release-reliability-plan.md` (SHA-256 `37a72430…086a`, verified) R2-I section and common contract. No source or test files were edited.

Environment: Linux, uid 1000, Bun 1.4.2, worktree `/opt/dev/ruach/.worktrees/r1-r2-review` at `033b10c`. Every required command ran sequentially under `flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock` with `timeout 300` (600 for `bun run test`); true exits are recorded above, with no pipeline masking.

## Confirmed acceptance items

- The immutable snapshot (`committed()`, `rev-parse` to a SHA plus `cat-file --batch`) is read before the lock and never reread.
- All target-dependent reads now run after the exclusive `mkdirSync(staging)`: metadata `load`, `drift`, the union of roots, leftovers, conflicts, parent types, removals, operation kinds and the metadata operation. The early staging and metadata-symlink refusals stay as cheap pre-checks.
- Cleanup is owned. A planning failure removes only the staging this run created (new `catch`). An `EEXIST` on acquisition throws before any `rmSync`. The R2-I owner test keeps the foreign journal and `old/0`.
- The commit/rollback section (metadata-last ordering, inode-guarded `rollback`, integrity check, exits 0/1/3) is byte-identical apart from the hoisted `Operation` type. The existing RU-07/08/09, symlink, hardlink and copied-installer tests pass unchanged.
- The preload only delays the real `mkdirSync` of the bare `.ruach-staging` path, and `paused()` kills the child in `finally`. No product result is injected (but see O1).
- The failing-before evidence was reproduced independently: the same five tests fail on the baseline installer with the same mechanisms (overwrite exit 0, `extra.md` integrity rollback, rollback loss, metadata replaced, rename `ENOENT`).
- No new lock service, wait loop, production flag or abstraction was added, and nothing claims to protect against unrelated writers.

## Findings

### B1 (blocking): the target root is created through a symlink before any symlink check

- **Location:** `scripts/install.ts:146-149` (`mkdirSync(target, { recursive: true })`, then `mkdirSync(staging)`), now ahead of every `destination()` call.
- **Problem:** On the baseline, `destination()` ran during planning, before any mutation. It walks every ancestor and rejects symlinks. The correction moved all of planning after the root `mkdir` and the lock, and added no symlink check before them. Suppose the target, or any ancestor of it, is a symlink. The candidate then creates the missing target directories at the symlink's destination, and creates and removes `.ruach-staging` there, before it refuses with `Snapshot destinations must not be symlinks`.
- **Why it matters:** This violates plan R2-I step 4 ("Symlink/unsafe-parent checks must occur before trusting it … acquiring a lock never legitimizes an unsafe destination") and the acceptance item "unsafe parent semantics preserved". A refused install now writes outside the lexical target. For a symlinked existing root, it also briefly holds a lock directory inside the foreign directory.
- **Evidence:** A disposable probe in OS temp ran the same commit with each installer.
  - Target `W/link/consumer/.agents` with `link -> W/real`: baseline exit 1 and `W/real` stays empty. Candidate exit 1 and leaves `W/real/consumer/.agents`.
  - Target is a symlink to an existing empty directory: both exit 1, and the directory is empty afterwards. On the candidate, that emptiness comes from cleaning up the transient staging.
  - The existing test `symlink destination and source are rejected` only symlinks `target/skills`, so it cannot catch this.
- **Suggested direction:** Before `mkdirSync(target, …)`, reject a symlink at the target or at any existing ancestor, the same way `destination()`'s ancestor walk already does (no new abstraction). Keep the under-lock checks. Add a public-CLI regression with a symlinked target ancestor that asserts exit 1 and that nothing is created at the link destination. After the fix, recheck the report's "empty target root" note and the R-IN documentation proposal.

### O1 (optional): some race tests cannot tell a refusal from a barrier timeout or a full rollback

- **Location:** `tests/install.test.ts` R2-I tests "a path another install creates…", "metadata that becomes invalid…" and "an unsafe skill entry…". Each asserts only `status === 1`, an unchanged `treeHash` and no staging.
- **Problem:** If the barrier deadline expires, the preload throws `Install barrier deadline exceeded`. That gives exit 1 with the target untouched, which satisfies all three assertions. A mutate-then-full-rollback outcome also restores original inodes, because backups are renamed back, so it passes the stale-create test too. The plan requires "Corrected B refuses drift before mutation". The drift and owner tests do assert diagnostics; these three do not.
- **Why it matters:** The preload's own failure mode can stand in for the expected product result. The evidence for "refused before mutation" is therefore weaker than the report's table implies. Today's timing (20 s deadline, sub-second `during()` callbacks) makes a false pass unlikely, but it is possible on a heavily loaded verifier.
- **Evidence:** In the barrier-timeout probe (preload, `RUACH_INSTALL_BARRIER_MS=300`, never released), the CLI exited 1 with `Snapshot failed: Install barrier deadline exceeded`, left the target unchanged and left no staging.
- **Suggested direction:** Assert the specific diagnostic in each case: `drift` for the stale-create case, the metadata/JSON message, and `non-regular entry`. Optionally also assert that stderr does not contain `barrier deadline` and does not contain `rolled back`.

No other material findings.

## Unverified or out of scope

- Hosted CI, native/Herdr behaviour and acceptance of any later candidate are not established by this review.
- Concurrency with unrelated, non-cooperating writers is out of scope by design and was not assessed.
- The copied `ruach-install.ts` path was exercised only through the existing tests. No race test runs the copied installer; the plan does not require one.

## Validation

`bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-i-review.md --repo .` and `git diff --check` were run on this report before commit; results are given in the terminal handoff.
