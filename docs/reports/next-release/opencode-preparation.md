task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-PREP
status: needs-decision
outcome: "Five restricted OpenCode subject configs and briefs, a separated root-launch packet, an independent reviewer-grading packet and a grader-side baseline tool are prepared under docs/reports/next-release/opencode-preparation/ for model opencode-go/deepseek-v4.1-flash. No subject was launched and no workflow body, credential or raw provider config was read. Two launch preconditions need a root decision: the clean wrapper strips the environment flag that suppresses the smoke consumer's auto-discovered workflow skills, and Go Flash entitlement plus run-time permission enforcement remain first-turn evidence."
artifacts:
  - docs/reports/next-release/opencode-preparation.md
  - docs/reports/next-release/opencode-preparation/README.md
  - docs/reports/next-release/opencode-preparation/prep-evidence.md
  - docs/reports/next-release/opencode-preparation/root-launch-packet.md
  - docs/reports/next-release/opencode-preparation/reviewer-grading-packet.md
  - docs/reports/next-release/opencode-preparation/baselines.json
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
  - "Assignments committed unchanged: docs/assignments/next-release/opencode-preparation.md, -v2.md, -v3.md, -v4.md"
baseline_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
candidate_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
tested_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
verification:
  - "Native write probe: write to /tmp/ruach-implementation-20261011/opencode/launch/write-probe.txt returned Wrote file successfully; scratch configs/ writes were denied, so configs live in the committed evidence directory"
  - "opencode --version: exit 0, 1.19.0 (wrapper with runtime config)"
  - "opencode models opencode-go: exit 0, lists opencode-go/deepseek-v4.1-flash; the provider resolves with no provider block or embedded key"
  - "provider.opencode-go.models whitelist probe: catalog still lists all 31 opencode-go models, so a static model whitelist is not enforceable; model selection is pinned at model/small_model/agent and --model with no fallback"
  - "Per-subject config-only load (opencode debug skill, debug agent <role>, models opencode-go) for all five subjects: all exit 0; coordinator set exposes only the feature workflow; implementer sets expose handoff and testing"
  - "opencode debug agent <role> for oc-enoch: the last matching permission rules are the prepared default-deny block with exact edit/bash/external allows, so unspecified tools stay denied"
  - "tools/verify-baselines.ts against pristine fixtures: RESULT: PASS (smoke and enoch protected digests, api.ts still at seed, three r3 corpora with no unexpected changes)"
  - "Not run: any subject launch or task prompt, Go entitlement check, run-time permission enforcement, workflow-content or credential inspection, product/test edits, full root suites"
review: not-run
discoveries:
  - "The clean wrapper forwards only proxy/cert variables, so OPENCODE_DISABLE_EXTERNAL_SKILLS and Git identity cannot be passed through it; the root-launch packet uses a direct-CLI clean env (or an equivalent root-owned enriched wrapper)."
  - "The smoke consumer's project .agents/skills is auto-discovered by OpenCode, exposing ruach-workflow-feature and ruach-workflow-knowledge bodies to an Implementer unless external skills are disabled; this was not verifiable through the wrapper and must be confirmed with opencode debug skill before oc-smoke."
  - "opencode debug agent resolves a base allow-all default ahead of the prepared rules, but opencode evaluates the last matching rule and the prepared block is last for edit/bash/external_directory/task, so the exact allows win and everything else is denied; narrow base allows (tool-output, *.env.example) remain."
  - "The smoke consumer is checked out on branch main at the base commit, not on a candidate branch; check.ts evaluates the current branch and requires a fresh tag and a clean tree."
  - "Prepared asset digests are recorded in baselines.json and prep-evidence.md; the r3 subject corpus currently equals its protected copy (no subject edits yet)."
blockers:
  - "Decision: resolve the smoke .agents/skills workflow-body exposure (set OPENCODE_DISABLE_EXTERNAL_SKILLS via the direct-CLI recipe, or accept and record the exception) before launching oc-smoke; not resolvable within this turn's permissions."
  - "First-turn evidence required: Go Flash entitlement and actual allow/deny enforcement at run time were not exercised; no subject was launched."
  - "The wrapper cannot carry the extra environment variables the recipes specify; if the root prefers the wrapper, an enriched root-owned wrapper must be provided."

# R-OPENCODE-PREP preparation report

Preparation only. Assets are under
`docs/reports/next-release/opencode-preparation/`; details are in
`README.md`, `prep-evidence.md`, `root-launch-packet.md`,
`reviewer-grading-packet.md`, `baselines.json` and `tools/verify-baselines.ts`.

## Subjects

Five restricted configs and single-prompt briefs, all pinned to
`opencode-go/deepseek-v4.1-flash`, default-deny with exact owned targets, no
`--auto`, no fallback, one 20-minute turn each:

| Subject | Role | cwd | Owned edits |
| --- | --- | --- | --- |
| oc-smoke | Implementer | `live/smoke/codex-snapshot/consumer` | `src/**`, `docs/reports/smoke.md` |
| oc-resume | Coordinator | `live/r3/packet/subject/01-resume` | `record.md`, `drafts/**` (+ `intents.jsonl` via stub) |
| oc-ambiguity | Coordinator | `live/r3/packet/subject/02-ambiguity` | `record.md`, `drafts/**` |
| oc-authorization | Coordinator | `live/r3/packet/subject/03-authorization` | `record.md`, `drafts/**` |
| oc-enoch | Implementer | `enoch-exercise/clone` | `api.ts`, `docs/TASK_LOGS.md`, `docs/exercise/report.md` |

## Separation

`root-launch-packet.md` holds launch mechanics only (env, cwd, argv, provenance,
cleanup). `reviewer-grading-packet.md` holds checker commands, expected
baselines and grading inputs only. Subjects see only their `briefs/*.md`.

## Honest limits

No subject ran, so subject success, Go entitlement and run-time permission
behavior are unproven. The independent Reviewer must inspect this preparation
and confirm the smoke skills exposure is resolved before any subject starts.
