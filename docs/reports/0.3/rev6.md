---
task: 0.3-rev6
status: complete
outcome: "No blocking findings. The clean-check reversal matches the user decision (common.ts and eval.test.ts byte-identical to 3093323, no budget remnants, pre-redesign contract restored and probed), the boundary is documented, and the A7 launcher fix is correct and failing-first. The simp report swaps the root and Herdr test counts: the Herdr suite did not shrink (148 + 1 = 149). Five optional findings."
role: reviewer
reviewed_revision: b5fabab21669c17a43164a88f7f5284980d3cbd0
tested_revision: b5fabab21669c17a43164a88f7f5284980d3cbd0
evidence_revision: 06d3801a0e8c557a0e7b3e072d76f3c83f2e9065
baseline: b985d89
artifacts:
  - docs/reports/0.3/rev6.md
  - docs/assignments/0.3/rev6.md
  - "branch ruach/ruach03-rev6"
verification:
  - "06d3801 vs b5fabab: only docs/assignments/0.3/simp.md and docs/reports/0.3/simp.md added (git diff --stat)"
  - "git diff --quiet 3093323 b5fabab on harness-eval common.ts and eval.test.ts: identical. git diff 3093323..b5fabab over skills/ tests/ scripts/ touches only config.md, herdr SKILL.md, spaces.ts, fake-cli.ts, spaces.test.ts and docs-consistency.test.ts"
  - "Detached temp worktree at b5fabab (removed afterwards), sequential: just install 0, just check 0, just release-check 0 (v0.2.1), just test 0, bun audit 0 (no vulnerabilities, 26 packages)"
  - "just test actual counts: root 90 pass (10 files), handoff 28, herdr 149 (2 files, 279 s), harness-eval 71; 0 fail"
  - "Failing-first: new spaces test with b985d89 spaces.ts fails (exit 4 worktree_uncertain, expected 0); with b5fabab spaces.ts it passes, along with the other 7 tests matching 'linked'"
  - "Contract probes with scope-check.ts at b5fabab on throwaway repos: assume-unchanged and skip-worktree give exit 2 hidden_index_state; filter via core.attributesFile and via an [attr] macro in info/attributes give exit 2 content_filter_state; a staged rename gives one 'R ' record with paths [b, a]; a FIFO replacing a tracked file reads ' M' in about 1 s"
  - "git grep at b5fabab (excluding reports, assignments and the superseded design): no clean_check_budget, CLEAN_ENTRY_LIMIT, CLEAN_HASH_LIMIT, '0.3 contract change', byte-exact or raw-worktree text; the only 'content-based' hit is the unrelated librarian eval rubric"
  - "ruach-handoff validate.ts on this report with --repo: ok, 4 revisions resolved"
  - "Not run: GitHub CI, the Claude plugin-cache re-test (claims in docs/native-parity.md reviewed for consistency only), real Herdr 0.9.0 linked launch, a real consumer-task run"
review:
  - "Independent review of b5fabab against baseline b985d89 and the rev6 assignment (this report)"
discoveries:
  - "Herdr count: no tests are missing. b985d89 had 148 Herdr tests; babfbd1 adds one (spaces.test.ts:253), so 149. The simp report (docs/reports/0.3/simp.md:18) swapped the labels: its 'root 149' is Herdr and its 'herdr 90' is root. Root stays 90 because the docs-consistency test was replaced one for one"
  - "harness-eval 101 to 71 is the intended removal of the redesign tests (26 numbered design tests plus R1 and R4 and the parameterised stat-setting tests), back to the 3093323 count"
  - "Retained protections stay tested: replacement refs, assume-unchanged, skip-worktree, core.fsmonitor, clean filters from info/attributes and tracked .gitattributes, the no-filter control and the R/C rename grouping. Removed tests 13 (core.attributesFile filter) and 14 ([attr] macro) exercised the retained filter check; behavior still holds by probe but is untested (finding O2)"
blockers: []
---

# Review 0.3-rev6

Reviewed `ruach/ruach03-simp` at candidate b5fabab against b985d89. Head 06d3801 adds only the simp report and assignment. Experiments ran in a detached worktree and throwaway repositories under the session scratch directory, which were removed afterwards.

## Blocking findings

None.

## Findings (non-blocking, by severity)

**M1. The simp report swaps the root and Herdr test counts.**
- Location: `docs/reports/0.3/simp.md:18` ("root 149 pass, handoff 28, herdr 90 (spaces 31)").
- Problem: the actual run at b5fabab gives root 90 (10 files) and herdr 149 (2 files). The report has the labels the wrong way round.
- Why it matters: it suggests that 58 Herdr tests disappeared, which caused this review question. It is a false verification claim in a durable handoff.
- Evidence: my `just test` output above. The Herdr test files differ from b985d89 only by the added test `spaces.test.ts:253` (148 + 1). The root suite changed only by replacing one docs-consistency test. I could not confirm the "spaces 31" figure separately.
- Direction: the Coordinator should record the corrected counts (this report is enough). The historical simp report does not need rewriting unless the Coordinator wants that.

**O1. The launcher does not fall back after a failed create from the repo parent, and the report does not say so.**
- Location: `skills/ruach-herdr/scripts/spaces.ts:57-58` and `spaces.ts:70` (`worktree_uncertain`).
- Problem: assignment item 6 says "if that fails or is unavailable fall back to the standalone behavior; never exit 4 for this reason". The fix falls back only when `source_workspace_id` is not reported. If `herdr worktree create --workspace <source>` fails (for example a stale or closed parent workspace), the launch still exits 4.
- Why it matters: this is a small gap against the assignment wording. Exit 4 after a create call is arguably the safer choice, because Herdr may have partly mutated state (compare the `linkedPartial` fixture). But simp.md presents the behavior as complete without noting the deviation.
- Direction: keep exit 4, but record it as a deliberate deviation in the record or SKILL.md. Change it only if the user wants the literal fallback.

**O2. Two tests for retained filter protections were removed; the restored error codes are not asserted.**
- Location: `skills/ruach-harness-eval/tests/eval.test.ts:404-445` (b5fabab). Removed b985d89 tests '13. a clean filter named by core.attributesFile…' and '14. an [attr] macro…'.
- Problem: `docs/operations.md:188` documents `core.attributesFile` as a source the filter check covers, but no test exercises it now. No test asserts `hidden_index_state`, `content_filter_state` or their exit 2. The retained tests check only `exit != 0` and `diagnostics.length > 0`.
- Why it matters: the "no contract break remains" claim relies on code names that only the docs-consistency string check protects. A regression to a different code or exit would go unnoticed.
- Evidence: my probes show exit 2 with the right codes for each case. `git grep` finds the codes only in common.ts, docs and the docs test.
- Direction: add `core.attributesFile` to the filter test loop, and assert the codes and exit 2 in the existing hidden-index and filter tests. These are a few lines of tests only.

**O3. The fallback for a linked launching workspace with no reported parent is untested.**
- Location: `skills/ruach-herdr/scripts/spaces.ts:58` (`repo parent workspace … unavailable`).
- Problem: the new test covers only a reported `source_workspace_id`. No test covers the branch that sets `linked_unavailable` when the workspace is linked but no source is reported.
- Direction: add one tuple to the standalone loop at `spaces.test.ts:259` (fixture `linkedLaunching` without `sourceWorkspace`).

**O4. The boundary lists the accepted forged-clean variants by class, not by name.**
- Location: `skills/ruach-harness-eval/references/config.md:90`, `docs/operations.md:188`.
- Problem: config.md says the evaluator trusts "stat data, `core.*` settings, attributes, exclude files, `.gitignore`", and operations.md says only that it trusts the checkout's Git configuration. The accepted variants the user named (`core.trustctime=false`/`core.checkStat=minimal`, `info/exclude`) appear only as classes. That meets the requirement not to hide them, but just barely.
- Direction (optional): name those settings in the operations.md known-limitations entry.

**O5. Plugin-cache evidence was not independently reproduced.**
- Location: `docs/native-parity.md:33-35`.
- Problem: none found. The corrected bullet is consistent with the rest of the section and records the unverified versions and sources as a known risk. The "about 39 MB whole tree" bullet comes from the earlier run and was not re-measured.
- Direction: none needed. I mark this unverified by the reviewer.

## Assignment checks

- Reversal against the user decision: fsmonitor and the untracked cache are disabled and `--no-replace-objects` is set (`common.ts:88`). The hidden-flag fail-closed check, the few-line `git check-attr` filter check and R/C grouping are restored (`common.ts:116-133`). Hashing, budgets, `clean_check_budget` and submodule recursion are gone. There are no dead exports or leftover budget code (`common.ts` equals 3093323). `docs/design/0.3-clean-check.md` carries the superseded note.
- A7 fix: correct for a repo-parent launch (falls through to `parent`) and for a linked launch with `source_workspace_id`. The repository identity is still checked against the launching workspace's `repo_key`. I found no regression risk to standalone paths: all 7 existing linked and standalone tests pass, as do 149/149 in the full suite.
- Exit notes: `CHANGELOG.md:22` and `docs/roadmap.md:74` both state that GitHub CI and a real consumer-task run are outstanding.
- CHANGELOG 0.3.0: the A1 bullet now matches the code (identity, hidden flags, fsmonitor neutralized, filter rejected), the boundary statement is present, and the retired contract-change paragraph is removed. Track B's "CI job" is defined but has not been run, which the exit note covers. I found no inaccuracy.
