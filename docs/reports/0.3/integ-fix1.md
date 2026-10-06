---
task: 0.3-integ-fix1
status: needs-decision
outcome: Both blocking security findings (B1, B2) and both blocking docs findings fixed; optional O2, O4, O5 and rev-docs 3-6 done; O1 and O3 documented as known limitations; impl-f (Track E docs) merged. All checks pass at the tested revision. Remaining decisions are impl-f's packaging, Codex export and paid smoke items.
role: implementer
candidate_revision: d31b98d0a5518ff69d550a8d4e636a7b13313143
tested_revision: d31b98d0a5518ff69d550a8d4e636a7b13313143
baseline: bdab5e8
artifacts:
  - docs/reports/0.3/integ-fix1.md
  - docs/assignments/0.3/integ-fix1.md
  - "branch ruach/ruach03-integ"
  - "commits B1 0233da2, B2 45b5cd5, O2 16d2a25, O4/O5/O1/O3 af7f2c3, docs efa3cfa, O4 final d31b98d"
  - "merges: rev-sec a970ca8, rev-docs 476c327, impl-f 0c123c2"
  - "evidence by reference: docs/reports/0.3/rev-sec.md, rev-docs.md, impl-f.md, integ.md"
verification:
  - "just install: exit 0"
  - "just check (resource checks + tsc): exit 0 at d31b98d"
  - "just release-check: exit 0 (Release v0.2.1, no bump)"
  - "just test, run sequentially at d31b98d: root 89 pass, handoff 28, herdr 148, harness-eval 68; 0 fail"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff"
  - "B1 test (harness-eval, core.fsmonitor hook reporting no changes after a priming status): failed with exit 0 before the fix, passes after"
  - "B2 test (herdr worker, fake codex whose reader exits leaving a same-group descendant on stdout): failed at 26.7 s against a 15 s bound before the fix, passes after; descendant reaped"
  - "O2 test (herdr spaces, refs/replace on the base): checked-out tracked.txt held the forged content before the fix, passes after"
  - "rev-docs 1/2 and 3/4 tests (docs-consistency): 2 new tests failed before the wording fixes, pass after"
  - "O4: a preload-based default timeout did not cover setup hooks (a run at load average about 12 failed 1-2 tests at 5.0 s), so it was replaced by `bun test --timeout 30000` in just test; final sequential run green. Two earlier runs at the merged revision with the preload failed 1 and 2 Herdr tests at the 5 s limit"
  - "Not run: ready gitState test with a real Git (its tests use stub binaries); GitHub CI; paid-model or live launch checks"
review: not-run
discoveries:
  - "B1: untrackedCache alone cannot hide tracked edits, so no failing test exists for it; `-c core.untrackedCache=false` was added defensively next to the tested fsmonitor fix. scripts/install.ts reads Git objects only; its `ready` gitState status probe got the same two flags without a dedicated test (informational dirty flag, not a trust boundary)."
  - "O2: in linked mode Herdr runs `git worktree add` itself, so replacement refs cannot be disabled there; documented in operations known limitations."
  - "O4: Bun's per-test default also bounds beforeEach hooks; setDefaultTimeout via preload did not prevent hook timeouts, the CLI flag does. Running `bun test` directly in skills/ruach-herdr still needs the flag on loaded hosts (documented)."
  - "O1 (install lock after preflight) and O3 (workspace id lost on linked verification failure; subdirectory-absent-from-base check after creation) not implemented; recorded under Known limitations in docs/operations.md."
  - "impl-f merge: one conflict, tests/docs-consistency.test.ts (both sides appended tests; kept both). Its CHANGELOG Track E line and README link merged cleanly and agree with my earlier removal of the unowned Track E line."
  - "impl-f needs-decision items, unchanged by this work: plugin-root versus per-skill packaging and dependency installation (plugin install copies the repo tree, installs no skill dependencies); exporting canonical roles to native Codex agent TOML (impl-f recommends D for 0.3, generated-and-checked export later); PENDING user authorization for paid clean-install smoke tests per route and the claude --agent versus Herdr append comparison. Evidence: docs/native-parity.md."
  - "CI workflow still not run on GitHub; harness-eval has no lockfile so is not audited."
blockers:
  - "needs-decision: plugin-root versus per-skill packaging (impl-f, docs/native-parity.md)"
  - "needs-decision: Codex native agent TOML export (impl-f recommendation D for 0.3)"
  - "PENDING user authorization: paid smoke tests per route and --agent versus append comparison (impl-f)"
---

# Integration fix 1 report

## Findings

| Finding | Commit | Failing-before evidence |
|---|---|---|
| rev-sec B1 fsmonitor | 0233da2 | harness-eval test: scope-check exit 0 on a tampered tracked file |
| rev-sec B2 Codex stdio deadline | 45b5cd5 | worker test: resolve took 26.7 s (bound 15 s) |
| rev-docs 1 workflow wording; 2 examples | efa3cfa | docs-consistency delivery test failed |
| rev-sec O2 replacement refs in launcher | 16d2a25 | spaces test: forged tree checked out |
| rev-sec O4 timeouts | af7f2c3, d31b98d | observed 5 s failures under load; green sequentially with the flag |
| rev-sec O5 inventory, dependency test | af7f2c3 | dependency test no longer skips silently (expected packages asserted) |
| rev-docs 3, 4, 5, 6 | efa3cfa | docs-consistency tests failed for 3 and 4; 5 and 6 wording edits |
| rev-sec O1, O3 | af7f2c3 | not implemented; known limitations in docs/operations.md |

Details of the fixes: B1 adds `-c core.fsmonitor=false -c core.untrackedCache=false` to the harness-eval private Git probe and to `ready`'s status probe. B2 runs the Codex stdio reader detached, kills its own group at the deadline, races every read against the deadline and bounds cleanup. Docs: feature workflow step 2 now plans integration only and defers delivery to step 8; consumer-example section 6 is a gated delivery assignment (user authorization, exact reviewed revision, destination not moved, `delivered_revision`, Coordinator cleanup); direct-compact-full uses a separate delivery Implementer; the escalation count is set in the assignment or consumer guidance; README harness wording; numeric comparator in the testing example.

## Merges

rev-sec, rev-docs and impl-f merged with real merge commits; only impl-f conflicted (tests/docs-consistency.test.ts).

## Validation scope

The handoff validator was run with `--repo` (result in the terminal handoff). It checks structure and revision resolution only.
