---
task: 0.3-impl-c
status: complete
outcome: A5 (RU-07/08/09 staged, rollback-capable, hardlink-safe install with leftover and integrity checks) and C2 (read-only `ready` subcommand, `just ready`) implemented per docs/design/0.3-install-and-readiness.md.
artifacts:
  - docs/reports/0.3/impl-c.md
  - scripts/install.ts
  - tests/install.test.ts
  - tests/ready.test.ts
  - justfile
  - docs/operations.md
  - branch ruach/ruach03-impl-c
candidate_revision: 14e10e020e94fbb584186bc6eeb706e3a5df34fc
tested_revision: 14e10e020e94fbb584186bc6eeb706e3a5df34fc
verification:
  - "just check: passed"
  - "just release-check: passed (v0.2.1)"
  - "just test: passed (root 70, handoff 24, herdr 126, harness-eval 59; 0 failures; Herdr socket tests ran). Needed `just install` first, as skill deps were absent."
  - "Install tests written first: 10 of the 12 new tests failed against the old installer (hardlink x3, rollback x3, leftover x3 incl. non-regular, interrupted install). Test 9 (dependencies not leftovers) and 12 (structural conflict) already passed before: the old code already rejected a directory at a file destination and a file at a parent (lstat ENOTDIR), so they are kept as regression guards, not failing-first tests."
  - "ready tests: tests/ready.test.ts, 8 tests, new command so trivially failing before."
review: not-run
discoveries:
  - "Rollback-after-integrity-failure path (design step 7) has no fault-injection seam on Linux; it shares rollback() with tests 4-6. Gap recorded as the design recommends, no test-only hook added."
  - "Rollback tests are skipped when uid is 0 (chmod 0555 does not block root). Rollback exit code 3 (incomplete rollback) is implemented but not exercised by a test."
  - "Pre-commit failures remove staging and leave the target untouched; a rename across filesystems (EXDEV) fails the commit and rolls back."
  - "Skills CLI 1.7.0 target paths were NOT confirmed (no verification run); the scanned user/project root list is the design's list. Please confirm before 0.3 release."
  - "Added ready options beyond the design: --project DIR (default cwd) and --skills DIR (repeatable) so the Skills-CLI-only route can be inspected from a checkout."
  - "Route logic: a Ruach skill needs one ready copy (ready or no-dependencies) across locations; duplicates only warn. `native` also requires a located Ruach role set and snapshot integrity; `herdr` adds git, herdr and a located ruach-herdr."
  - "ready runs `git rev-parse`/`git status --porcelain` (GIT_* stripped, --no-optional-locks) only for a source checkout, plus `--version` probes for bun/git/herdr; claude/codex/just are PATH presence only."
  - "Tests spawn bun with BUN_RUNTIME_TRANSPILER_CACHE_PATH=0, since bun otherwise writes ~/.bun under a fake HOME."
  - "README suggestions for impl-d: document `bun .agents/ruach-install.ts ready [--route skill|native|herdr] [--json]` and `just ready`; exit code 3 for incomplete install rollback and `.ruach-staging` interrupted-install behaviour (see docs/operations.md section 'Snapshot installation failures and recovery'); for Skills-CLI-only users, run `ready --skills DIR` from a checkout or plugin copy."
  - "Coordinator decisions applied: no install --recover (manual recovery documented), no packaging change, Skills-CLI route documented not scripted."
blockers: []
---

# impl-c report

Commits: 7b16c9b (A5), 14e10e0 (C2). Branch ruach/ruach03-impl-c, based on the approved design.

## A5
`install` stages files in `target/.ruach-staging` (exclusive mkdir as lock), writes nothing through existing paths (rename-only, so outside hardlinks are untouched), journals operations, commits in sorted order, verifies (`load` + `drift` over the union of old/incoming skill roots + byte-equal `ruach.json`), rolls back on failure (exit 1 if complete, exit 3 and kept staging if not), and then removes staging. Preflight rejects leftovers in incoming skill roots (removed with `--replace` when regular files; symlinks/FIFOs always fail), structural conflicts, and an existing staging directory. `check` fails with `interrupted install` if staging exists. Docs: docs/operations.md.

## C2
`ready` subcommand in scripts/install.ts and `just ready`. Docs in docs/operations.md. Works with the current per-skill packaging; no packaging change was made.
