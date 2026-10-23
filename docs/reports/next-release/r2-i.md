task: R2-I
status: complete
outcome: Installer now acquires the existing .ruach-staging lock first and plans metadata, drift, roots, leftovers, conflicts, parent types, removals and operation kinds from the target state read under that lock; five stale-plan races fail on the original source and pass on the correction.
candidate_revision: 3f55313fa5d0dfc28c51a94738d519dbc514fdac
tested_revision: 3f55313fa5d0dfc28c51a94738d519dbc514fdac
baseline: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - scripts/install.ts
  - tests/install.test.ts
  - tests/fixtures/install-lock-preload.ts
  - docs/assignments/next-release/r2-i.md
  - docs/reports/next-release/r2-i.md
verification:
  - "just install: exit 0"
  - "bun test --timeout 30000 tests/install.test.ts: exit 0, 40 pass 0 fail"
  - "bun test --timeout 30000 tests/ready.test.ts tests/docs-consistency.test.ts: exit 0, 18 pass"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 98 pass 0 fail across 10 files"
  - "failing-before: tests/install.test.ts against original scripts/install.ts (base d75039a) with the new tests: 35 pass 5 fail, exit 1"
  - "bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-i.md --repo . and git diff --check: run after writing, results in the Validation section"
review: not-run
discoveries:
  - "Under uid 1000 the three RU-07 chmod rollback tests ran (not skipped) and pass."
  - "Bun mock.module rewrites the live node:fs namespace; the preload must copy the real functions before mocking or mkdirSync recurses forever."
  - "A refused install into a nonexistent target leaves an empty target root (mkdir precedes the lock, as the plan allows)."
  - "--replace cannot recover malformed or symlinked ruach.json; this is existing behavior and is now also enforced under the lock."
blockers: []


# R2-I report

All verifier commands ran sequentially under `flock` on `/tmp/ruach-implementation-20261011/verification.lock` (every command, including the focused install suite); bounds were 300 s per command (600 s for the full suite). Runtime: Bun 1.4.2, uid 1000, Linux. Review of this work is not run.

## Change

`scripts/install.ts`: `install()` reads the immutable pinned snapshot outside the lock, keeps the cheap early refusals (existing staging, symlinked metadata), creates a missing target root, then takes the lock with the exclusive `mkdirSync(staging)`. Everything target-dependent (metadata load, drift, union of old and incoming roots, leftovers, conflicts, parent types, removals, operation kinds and the metadata operation) now runs after acquisition and inside a try that removes only this run's staging on failure. A failure to acquire never removes the existing staging. Staging writes, metadata-last placement, inode-guarded rollback, integrity check and exits 0/1/3 are unchanged. `Operation` moved to module scope. No new abstraction, wait loop or production flag.

`tests/fixtures/install-lock-preload.ts`: test-only Bun preload replacing `node:fs` `mkdirSync` for the bare `.ruach-staging` path; it writes `reached`, waits for `release` (deadline 20 s), then calls the real function. It supplies no product result.

`tests/install.test.ts`: eight public-CLI tests (`paused()` runs the CLI with the preload; the child is killed in `finally`).

## Failing-before vs after (public CLI)

| Test | Original source | Corrected |
| --- | --- | --- |
| drift made after pause refused, tree/inodes byte-identical, no staging | exit 0, overwrote user edit | exit 1 |
| removal from current manifest (extra.md added by other install) | exit 1, rolled back: "Installed tree does not match the manifest: skills/ruach-example/extra.md" | exit 0, check --source passes |
| path created by another install plus leftover: A's SKILL.md inode/content, manifest, roles.yaml preserved | B's rollback deleted A's SKILL.md (ENOENT on stat) | exit 1, treeHash identical |
| malformed / symlink ruach.json appearing under lock | exit 0, replaced metadata | exit 1, tree unchanged, no staging, outside file untouched |
| `--replace` with managed file deleted while waiting | exit 1, rename ENOENT rolled back | exit 0, file recreated, check passes |
| controls, passing before and after: foreign staging (marker/journal preserved), unsafe skill entry under `--replace`, `--replace` overwriting drift | pass | pass |

Existing unsafe-entry, manifest, hardlink, rollback and copied-installer tests pass unchanged.

## Remaining gaps

- Independent review not run. The lock serializes cooperating installers only; unrelated writers during renames are out of scope.
- The foreign-staging control passes on the original source too: the original already refused via `EEXIST`, so it is a control, not a failing-before case.

## Proposed documentation corrections for R-IN (not edited here)

Active `.ruach-staging` means inspect or wait for its owner; never delete it blindly. An interrupted one: follow the journal/backups recovery or reinstall deliberately after preserving useful changes. `--replace` does not override unsafe entry types or invalid metadata. A refused first install may leave an empty target root.

## Validation

`bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-i.md --repo .` exited 0 (ok, revisions resolved) and `git diff --check` exited 0, both run on the report before its commit.
