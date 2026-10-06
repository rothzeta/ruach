---
task: 0.3-integ
status: complete
outcome: Merged impl-a, b, e, c, d in order with real merge commits; reconciled docs and fixed typecheck errors the combination introduced; install, check, release-check, all four test suites, audits and ready are green at the tested revision. Track E and a few source-handoff gaps remain (see blockers/discoveries).
role: implementer
candidate_revision: feaca8b74a8d5313fbeedbe943c385523637db20
tested_revision: feaca8b74a8d5313fbeedbe943c385523637db20
baseline: ruach/ruach-03-coordinator
artifacts:
  - docs/reports/0.3/integ.md
  - docs/assignments/0.3/integ.md
  - tests/docs-consistency.test.ts
  - "branch ruach/ruach03-integ"
  - "source handoffs by reference: docs/reports/0.3/impl-a.md, impl-b.md, impl-e.md, impl-c.md, impl-d.md (and arch.md) on their branches, now merged here"
verification:
  - "just install: exit 0"
  - "just check (resource checks + tsc): exit 0 at feaca8b"
  - "just release-check: exit 0 (Release v0.2.1, no version bump)"
  - "just test at feaca8b: root 84 pass, handoff 28, herdr 146, harness-eval 67; 0 fail. Herdr socket tests ran. impl-c rollback tests ran (uid 1000, not root)"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff; harness-eval has no lockfile (not audited)"
  - "just ready --route herdr (read-only): all routes ok; only duplicate-skill warnings between this checkout and ~/.agents/skills"
  - "docs-consistency tests failed before the doc fixes (3 of 4) and pass after"
  - "Earlier just test runs overlapping another suite run failed 1 to 3 Herdr tests with the 5 s per-test timeout; the Herdr suite alone (2m30s) and the final clean run passed 146/0"
review: not-run
discoveries:
  - "Combining A1-A8 with the impl-b typecheck gate produced 10 type errors in code written without it (scripts/check.ts, scripts/install.ts ready/install, herdr process.ts, worker.ts, worker.test.ts); fixed with type-only edits, no behavior change."
  - "Herdr suite is slow (about 2.5 min) and some tests use a 5 s timeout, so they fail when two suites run concurrently; run suites sequentially. A timeout increase or faster fixtures is a possible follow-up."
  - "uid was 1000, so impl-c RU-07 rollback tests ran; the skip is now announced with a console warning when run as root."
  - "impl-c: Skills CLI 1.7.0 target paths were not confirmed; rollback exit code 3 and the integrity-failure rollback path have no test."
  - "impl-a/e/c carry unverified items: RU-13 Codex private transport (documented only), RU-10 absolute-binary pinning needs a Herdr feature, A7 linked mode verified only with fake Herdr plus raw real Herdr commands, no live launch."
  - "Track E (clean-install smoke tests per route, Codex role discovery, composition notes) was not assigned to any worker and is not done; I removed the Track E line from the changelog 0.3.0 entry rather than claim it. Plugin-root packaging and Codex native role export were not touched (product-scope decisions)."
  - "CI workflow (impl-b) has not run on GitHub; actions are pinned by tag."
  - "Roadmap already numbers A7 as linked worktrees and A8 as hardening/notices, matching ruach/ruach-03-coordinator; impl-a's own report uses its old numbering (A7 = notices), left as historical."
blockers:
  - "Track E has no owner; decide whether it belongs in 0.3.0 before release."
---

# Integration report 0.3-integ

## Source revisions merged (in order)

| Order | Branch | Tested revision (from its report) | Merge |
|---|---|---|---|
| 1 | ruach/ruach03-impl-a | ec1ae2b | clean |
| 2 | ruach/ruach03-impl-b | b1f3e39 | clean |
| 3 | ruach/ruach03-impl-e | bc30624 | docs/operations.md conflict |
| 4 | ruach/ruach03-impl-c | 14e10e0 | clean |
| 5 | ruach/ruach03-impl-d | 8ddd5c5 | conflicts in docs/operations.md, skills/ruach-workflow-feature/SKILL.md, tests/check.test.ts |

Per-item evidence (failing-first tests, commands) is in each source report and is not repeated here.

## Conflict resolutions

- docs/operations.md (impl-e): kept impl-b's release verification and toolchain sections and impl-e's cleanup sentence naming `herdr worktree remove --workspace <id>`.
- docs/operations.md (impl-d): kept the impl-e cleanup paragraph, impl-d's lifecycle section, then impl-b's release section.
- skills/ruach-workflow-feature/SKILL.md: took impl-d's cleanup text, which defers to the Coordinator role; `agents/coordinator.md` already carries impl-e's `herdr worktree remove` rule.
- tests/check.test.ts: kept both sets of tests (notices and compatibility).

## Reconciliation commits

- Docs: README now describes `just ready`, A5 failure and recovery, linked worktree launches and `herdr worktree remove` cleanup; operations lifecycle section points to `ready`; CHANGELOG 0.3.0 rewritten to cover A1-A8, Tracks B, C, D accurately. New `tests/docs-consistency.test.ts` guards these claims at the boundary of the user docs.
- Types: type-only fixes listed under discoveries.
- impl-c root skip made visible.

## Commands and results

See `verification`. Final combined revision tested: feaca8b74a8d5313fbeedbe943c385523637db20. The report commit that follows only adds this evidence.

## Remaining gaps

Track E, no GitHub CI run, no live launch or paid-model checks, items listed in discoveries. No version bump, tag, or merge to main or ruach/ruach-03-coordinator.

Validation scope: the handoff validator was run with `--repo` (result in the terminal handoff).
