task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-PREP-FIX1
status: complete
outcome: "PREP-FIX1 corrected the two INSPECT1 blockers and the bounded recipe/path/flag issues. tools/verify-baselines.ts is now fail-closed on any protected removal/addition/modification outside allowed paths and checks full smoke/enoch git scope plus append-only TASK_LOGS.md. Worker configs explicitly deny workflow read/skill; coordinators get only the feature workflow. An enriched task-local runner suppresses external skill discovery while preserving selected skills.paths, requires an explicit Go Flash config, and supplies a fixed Git identity. All five corrected configs were verified at their real cwds config-only; no subject was launched. Independent exact re-review is required before the five subjects."
artifacts:
  - docs/reports/next-release/opencode-preparation.md
  - docs/reports/next-release/opencode-preparation/README.md
  - docs/reports/next-release/opencode-preparation/prep-evidence.md
  - docs/reports/next-release/opencode-preparation/root-launch-packet.md
  - docs/reports/next-release/opencode-preparation/reviewer-grading-packet.md
  - docs/reports/next-release/opencode-preparation/baselines.json
  - docs/reports/next-release/opencode-preparation/runners/opencode
  - docs/reports/next-release/opencode-preparation/tools/verify-baselines.ts
  - docs/reports/next-release/opencode-preparation/configs/oc-smoke.json
  - docs/reports/next-release/opencode-preparation/configs/oc-resume.json
  - docs/reports/next-release/opencode-preparation/configs/oc-ambiguity.json
  - docs/reports/next-release/opencode-preparation/configs/oc-authorization.json
  - docs/reports/next-release/opencode-preparation/configs/oc-enoch.json
  - docs/reports/next-release/opencode-preparation/briefs/oc-smoke.md
  - docs/reports/next-release/opencode-preparation/briefs/oc-resume.md
  - docs/reports/next-release/opencode-preparation/briefs/oc-ambiguity.md
  - docs/reports/next-release/opencode-preparation/briefs/oc-authorization.md
  - docs/reports/next-release/opencode-preparation/briefs/oc-enoch.md
  - "Corrected tested assets commit: a5e3cec1c1b81b289c6700e3763af1642441865c"
  - "Assignments committed unchanged: opencode-preparation.md, -v2.md, -v3.md, -v4.md, -fix1.md"
baseline_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
tested_revision: a5e3cec1c1b81b289c6700e3763af1642441865c
verification:
  - "B1 fixture self-test bun launch/fixture-tests.ts: ALL FIXTURE CHECKS PASS — r3 pristine PASS; r3 legitimate outputs PASS; r3 protected removal/change/addition FAIL exit 1; r3 boundary name record.md.evil FAIL; enoch legitimate PASS; enoch protected test change FAIL; enoch out-of-scope add docs/OTHER.md FAIL; enoch mutable boundary docs/TASK_LOGS.md.evil FAIL; enoch TASK_LOGS non-append FAIL; real smoke/enoch/r3 pristine PASS"
  - "B2 native verification bun launch/fix-native-verify.ts at all five actual cwds: ALL CHECKS PASS — implementer subjects discover 0 workflow skills and keep handoff+testing; coordinators discover only ruach-workflow-feature and keep handoff+herdr; every resolved agent permission contains read workflow deny, skill default-deny allowlists, edit default-deny with a relative and an absolute owned target, task deny and external_directory deny"
  - "Suppression-flag demonstration bun launch/fix-verify.ts: with OPENCODE_DISABLE_EXTERNAL_SKILLS=true the smoke project .agents/skills workflows are gone while configured skills.paths survive (01-resume still lists ruach-workflow-feature); with the flag false the workflow bodies reappear"
  - "Runner copies are byte-identical and mode 755 (scratch launch/runners/opencode and committed runners/opencode)"
  - "Not run: any subject launch or model call, Go entitlement, run-time allow/deny enforcement, native edit relative/absolute path matching at run time, workflow-body reads"
review: not-run
discoveries:
  - "OPENCODE_DISABLE_EXTERNAL_SKILLS suppresses auto-discovered project .agents/skills but preserves config skills.paths and OPENCODE_CONFIG_DIR skills, so one runner default is safe for both implementer and coordinator subjects (O1 resolved without a per-role exception)."
  - "The subject configs can deny workflow access three independent ways: discovery suppression, read pattern deny for **/ruach-workflow-*/**, and a skill allowlist with default deny. Run-time enforcement of the read/skill permission still needs a first-turn observation."
  - "INSPECT1's reported pass-on-removal was reproduced and is fixed by calling fail() on removals/additions/modifications outside the boundary-safe allowlist; git diff --name-only output has no status prefix and required its own parser."
  - "O2/O4: the reused smoke packet's evidence/config.json bun path /home/metatron/.local/bin/bun was verified to exist, so the canonical checker is reused with the distinct OpenCode-only tag opencode1 and no separate checker config is needed; all recipes now use absolute paths and stated cwds."
  - "O5: a literal opencode-go model whitelist is not enforceable in OpenCode 1.19.0; the Go Flash-only route relies on pinned model/small_model/agent plus enabled_providers and the explicit --model."
blockers: []

# R-OPENCODE-PREP-FIX1 correction report

Correction of preparation `0fdc42bd` following independent INSPECT1
(`reviewed_revision` `0fdc42bd4b3afb693c9a669eaf244264c2da62f0`). Historical
turn-1 evidence is preserved in `prep-evidence.md`; new correction checks are
recorded separately there.

## B1 — grader tool fail-closed

`tools/verify-baselines.ts` now fails (non-zero) on every protected removal,
addition or modification outside the declared allowed/mutable paths, with
boundary-safe matching (`rel === a || rel.startsWith(a + "/")`), correct
counters, and no silent pass on missing setup. Enoch scope is checked from the
full tracked diff and status subset of `{api.ts, docs/TASK_LOGS.md,
docs/exercise/report.md}` plus an append-only `TASK_LOGS.md` check, not sampled
digests. Validated with synthetic positives and negatives (see `verification`).

## B2 — worker workflow denial

Implementer configs deny workflow `read` (`**/skills/ruach-workflow-*/**`,
`**/ruach-workflow-*/**`) and restrict `skill` to `handoff`/`testing`.
Coordinator configs deny all workflows then re-allow only
`ruach-workflow-feature`, with `skill` allowlisted to handoff/herdr/feature. The
enriched runner additionally suppresses external skill discovery. No worker
workflow exception is accepted.

## Runner and recipes

`runners/opencode` (committed, 755; byte-identical scratch copy) requires an
explicit existing `OPENCODE_RUN_CONFIG`, binds Go Flash through the config and
`--model`, uses `env -i` with private HOME/XDG and one existing auth store,
forwards only safe proxy/cert variables without printing values, sets a fixed
local Git identity, and preserves inherited `OPENCODE_CONFIG`/`OPENCODE_CONFIG_DIR`
for nested diagnostics. Root `bin`/`config`/auth store were not changed. O3 adds
absolute equivalents of every owned edit target; O2/O4 make all recipes absolute
with stated cwds and the `opencode1` tag.

## Corrected revision and limits

Corrected tested assets are commit
`a5e3cec1c1b81b289c6700e3763af1642441865c`; this report is a separate later
commit (its creating SHA is returned in the terminal handoff). No subject ran;
Go Flash entitlement, run-time permission enforcement and native relative vs
absolute edit-path matching remain first-turn evidence for the root and the
independent re-review.
