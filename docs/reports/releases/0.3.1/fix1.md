task: RELEASE-0.3.1-FIX1
status: complete
outcome: "Applied the four low/nit publication documentation findings from the independent review cf7c77eb on dac18d3f: F1 payload count (173 listed + manifest = 174 changed), F2 byte-identity wording (91 identical; operations.md link repair and CHANGELOG.md entry deviations), F3 an empty Unreleased changelog heading restored above 0.3.1 so the accepted plan #unreleased anchor resolves, and F4 the two trailing receipt blank lines trimmed. Documentation only; no product/source/test/plan semantic change. Full root/skill/packet suites are reused from the tested 4cca79b9 because the candidate is doc-only."
candidate_revision: d5b4d60b3475d74d7aadd70326e8a9a6297ab50c
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
baseline: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/fix1.md
  - docs/assignments/release-0.3.1/fix1.md
  - "branch ruach/release-0.3.1"
  - "doc-only candidate d5b4d60b3475d74d7aadd70326e8a9a6297ab50c (parent dac18d3fc2de67ecd2ab92d445040b2aed768e9b)"
verification:
  - "Fix scope: git show --stat d5b4d60 = 4 files, 4 insertions / 4 deletions (CHANGELOG.md, docs/reports/releases/0.3.1/preparation.md, and the two docs/reports/roadmap-planning/assignment-batch1-round2-* receipts); no product, source, skill, eval or plan file changed."
  - "Zero-source-change comparison (bounded helper): git diff --name-only 4cca79b -- scripts skills agents tests evals .github = empty; the doc-only candidate is source-identical to the tested candidate."
  - "just check: exit 0 (bun scripts/check.ts passed; tsc -p tsconfig.json no diagnostics)."
  - "just release-check: exit 0, 'Release v0.3.1: package, plugin, marketplace, agents and changelog verified'."
  - "git diff --check d75039aa7b82b262e2f28af08630258fb7f77180 d5b4d60b3475d74d7aadd70326e8a9a6297ab50c: exit 0, no diagnostics; the F4 trailing-blank-line findings are gone."
  - "Targeted anchors/counts (bounded helper): 385 relative .md link targets across the tree resolve, 0 unresolved anchors (F3 fixed); publication-manifest header count 173 equals the 173 listed payload paths."
  - "Reused, not rerun (doc-only candidate, zero source change): full root bun run test (100 pass 0 fail, 10 files), skills/ruach-herdr (162 pass), skills/ruach-handoff (28 pass), skills/ruach-harness-eval (71 pass), skills/ruach-changelog (35 pass), packet typechecks and packet suites (14 and 10 pass) from the tested 4cca79b9; the independent review reproduced the same on dac18d3f (source-identical)."
  - "Handoff validated: bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/fix1.md --repo .: exit 0, ok true, candidate and tested revisions resolved."
review: not-run
discoveries:
  - "F1: the manifest header and its 173 listed paths are correct; only the preparation report's prose count was wrong (174 is the baseline->candidate changed-file count including the manifest itself)."
  - "F2: 91 of the 93 payload paths shared with the reviewed R1-R3 delivery are byte-identical to 94cdfa1a; docs/operations.md carries the sanctioned R2-B link repair and CHANGELOG.md the 0.3.1 entry."
  - "F3: the accepted docs/design/next-coordination-plan.md links CHANGELOG.md#unreleased, so an empty Unreleased heading is retained above the 0.3.1 entry as the anchor and next-wave changelog target; release-check still verifies '## 0.3.1 — '."
  - "No production or behavioral claim changes; the reviewed real-behavior limits are unchanged (hosted/native/blind/real-consumer/R3 held-out evaluation not observed; resume failed and ambiguity unverified in the task-local OpenCode evaluation)."
blockers: []

# Ruach 0.3.1 FIX1

Bounded documentation fixes for the independent review cf7c77eb8255204938ffd6dbaddbb8cdb68bbbcf of dac18d3f. No main write, tag, merge or push. The follow-up exact-candidate review and authorized publication remain with the root.
