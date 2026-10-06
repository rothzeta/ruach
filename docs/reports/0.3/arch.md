task: 0.3-arch
role: architect
status: complete
outcome: "Design for A5 recoverable installation (RU-07/08/09) and the C2 readiness command written; ready for implementation, with three needs-decision items that do not block A5."
artifacts:
  - docs/design/0.3-install-and-readiness.md
  - docs/reports/0.3/arch.md
  - docs/assignments/0.3/arch.md
verification:
  - "Inspected scripts/install.ts, tests/install.test.ts, tests/plugin-install.test.ts, justfile, README, docs/operations.md, docs/roadmap.md, ADR-0001, ruach-herdr skills.ts/worker.ts write paths"
  - "No code changed; design not executed; regression tests listed but not written"
review: not-run
discoveries:
  - "scripts/install.ts is the only Ruach-owned installation writer; other routes delegate to bun install, Skills CLI and claude plugin"
  - "Current writeFileSync/chmodSync on existing managed paths write through hardlinks (RU-08); drift/conflict walks skip incoming skill roots not in the old manifest (RU-09)"
  - "Rollback after a post-commit integrity failure cannot be triggered on Linux without a fault seam; design recommends no test-only hook and recording the gap"
  - "Proposed additive installer exit code 3 (rollback incomplete) must be documented"
blockers:
  - "needs-decision: add install --recover now, or defer to the documented manual recovery (recommend defer)"
  - "needs-decision (product scope): readiness for the Skills-CLI-only route, which has no installer script (recommend README guidance)"
  - "needs-decision (product scope): plugin-root vs per-skill packaging, to be decided after the clean installed-plugin checks listed in the design"

# Architect report: 0.3 installation and readiness

Design: [docs/design/0.3-install-and-readiness.md](../../design/0.3-install-and-readiness.md).

## Summary

- **A5:** each path is written by staged rename under an exclusive `target/.ruach-staging`, which also acts as the lock and the interrupted-install marker. Old entries are moved to backups before replacement. Files are never opened or chmodded in place, so outside hardlinks are not touched. A journal is written before the commit, and `ruach.json` is renamed last. An immediate integrity check runs before the staging directory is removed. Bounded reverse-order rollback uses identity-guarded unlinks. Preflight walks the union of old and incoming skill roots. Twelve CLI-level regression tests are listed to write first.
- **C2:** a read-only `ready` subcommand of the installer script (plus a `just ready` recipe) reports the active copy, its locations, nested package state and prerequisites. It gives per-route verdicts for `skill`, `native` and `herdr`, offers text or `--json` output, and uses exit codes 0/1/2/3. Tests are listed.
- **Packaging:** not decided. The design lists seven checks to run on a clean installed-plugin path first.

## Implementation boundaries

`scripts/install.ts`, the installer tests, a new `tests/ready.test.ts`, a `just ready` recipe, and README/operations text. No root dependencies, no global settings or discovery-link changes, no version bump or tag. Implement A5 before C2.

## Readiness

A5 is ready for implementation; none of the open decisions blocks it. C2 is ready apart from the standalone-route placement decision.
