---
task: 0.3-simp
status: complete
outcome: "Content-based clean check reversed to the pre-redesign git status check; boundary documented; plugin-cache install path verified; linked-worktree launcher defect fixed. All gates pass."
role: implementer
candidate_revision: b5fabab21669c17a43164a88f7f5284980d3cbd0
tested_revision: b5fabab21669c17a43164a88f7f5284980d3cbd0
baseline: b985d89
artifacts:
  - docs/reports/0.3/simp.md
  - docs/assignments/0.3/simp.md
  - skills/ruach-harness-eval/scripts/common.ts
  - skills/ruach-harness-eval/tests/eval.test.ts
  - skills/ruach-herdr/scripts/spaces.ts
  - "branch ruach/ruach03-simp; commits 34933a9 (clean check), babfbd1 (launcher), b5fabab (docs)"
verification:
  - "just install, just check (incl. tsc), just release-check (v0.2.1, no bump), just test, bun audit, run sequentially at b5fabab: all exit 0; no vulnerabilities"
  - "just test: root 149 pass, handoff 28, herdr 90 (spaces 31), harness-eval 71; 0 fail"
  - "Launcher: new fake-Herdr test failed first with exit 4 worktree_uncertain, passes after the fix; real herdr 0.9.0 throwaway repo confirmed linked_worktree_source from a linked workspace and source.source_workspace_id in worktree list; all throwaway workspaces, worktrees and temp dirs removed"
  - "Item 4(a): claude 2.1.292, temporary HOME and CLAUDE_CONFIG_DIR, clean git clone as marketplace with a root postinstall marker and a typescript range differing from bun.lock: cache has no node_modules and the marker never ran. The earlier node_modules came from a source worktree that had one"
  - "Net change vs b985d89 excluding docs/reports and docs/assignments: 14 files changed, 58 insertions, 358 deletions (300 net lines removed). The common.ts and eval.test.ts restore alone is 355 deletions of the 358"
  - "Not run: GitHub CI, a real consumer-task run, the Claude plugin install with other Claude versions or remote Git sources"
review: not-run
discoveries:
  - "Council 4(a) done: Claude plugin install installs nothing at the root (no frozen install, no lifecycle scripts) from a clean clone; docs/native-parity.md corrected, with other versions and remote sources recorded as unverified known risk"
  - "Council 4(b) done: CHANGELOG 0.3.0 exit notes and docs/roadmap.md 0.3 exit criteria say GitHub CI and a real consumer-task run are outstanding"
  - "No output contract break remains: the restore brings back hidden_index_state, content_filter_state and R/C record grouping; the filter check was kept (a few lines of git check-attr)"
  - "docs/design/0.3-clean-check.md is marked superseded and kept; regression-cases, operations, CHANGELOG, config.md and the docs-consistency test now describe the git status check and the trust boundary (not a defense against a hostile candidate)"
  - "The linked-launch fix uses source.source_workspace_id; with no parent reported for a linked launching workspace the launcher falls back to standalone and reports linked_unavailable. SKILL.md updated"
  - "D1-D4 are reversed per Addendum 3; reports integ-fix3, integ-fix4 and rev4 are historical and unchanged"
  - "Out of scope, unchanged: evals/ruach-librarian rubric mentions 'content-based' in an unrelated sense"
blockers: []
---

# Report 0.3-simp

Three commits: 34933a9 restores `common.ts` and `eval.test.ts` from 3093323; babfbd1 fixes the launcher (separate commit, failing-first); b5fabab holds the documentation. Version not bumped. This report and the unchanged assignment are committed after b5fabab.
