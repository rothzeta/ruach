task: REVIEW-INSTR-01
status: complete
outcome: "No material findings in the pinned new-resource source unit; behavioral, runtime and combined-candidate acceptance remain open."
source_baseline: 2b693cd72bf39c29575841a88d9c7ae719a29715
reviewed_revision: 90230d165f41b90969037fdf7cf93e1a85d69396
evidence_revision: d0124e2
artifacts:
  - docs/reports/c1-c5/instruction-review.md
  - docs/assignments/c1-c5/REVIEW-INSTR-01.md
  - /tmp/ruach-review-instr01-880bXf
  - /tmp/ruach-instr01-evidence-PVrsb4qU
verification:
  - "Independent pinned-source resource check, diff whitespace check, fresh snapshot install/check and byte/notice/relocated-link/evidence audit: passed, each exit 0."
  - "Implementation receipts inspected and digests verified: install/check/release, 108 root tests, 28 handoff tests and snapshot/readiness checks passed within their stated scopes."
  - "Initial root run: environment-blocked socket setup, exit 1, 104 pass/4 fail; retained separately from the authorized socket-enabled passing run. No flake disposition applied."
  - "Own handoff validator and owned-document whitespace/assignment-integrity checks: passed, exit 0."
review:
  - "No material findings; no source corrections requested. This is partial source-unit review, not final C1–C5 acceptance."
discoveries:
  - "The diff has exactly 37 additions and no existing-file edits. Fresh installation includes all 23 new installable files and excludes docs/evals."
  - "Static evaluation packets require runner provisioning and independent subject/grading assignments; their existence establishes no model or product behavior."
blockers: []

# Independent review

Reviewed only `90230d165f41b90969037fdf7cf93e1a85d69396` against `2b693cd72bf39c29575841a88d9c7ae719a29715`. The evidence-only successor `d0124e2` supplied the implementation assignment/report. Source inspection and focused reruns used an exact Git archive under `/tmp/ruach-review-instr01-880bXf/candidate`; installation selected the full pinned SHA explicitly. The later launch correction and its working tree were not reviewed. No product files were edited and no workflow was executed.

No material findings. No optional source changes are requested. The six skills, Tester role, three assignment specimens and four static evaluation families satisfy the bounded source-authoring conditions. This conclusion does not accept an eventual combined revision, certify actual member isolation, or close the required independent behavioral and real-product exercises. Coordinator-owned workflow compatibility observations remain separate.

## Contract and design assessment

| Area | Evidence and assessment at the reviewed revision |
| --- | --- |
| Scope and simplicity | All 37 changed paths are additions in the assigned scope. No existing source, test, catalog, CI or release metadata changed. No executable runtime, dependency, scheduler, schema, default route or global policy was added. Handwritten fixture code is readable multiline TypeScript. Conditional references have concrete purposes. |
| Council | `skills/ruach-workflow-council/SKILL.md:14` distinguishes manual, exact-N and explicit up-to-N modes, including N=1 honesty. Its round reference requires effective access evidence, actual reports and dispositions before closure, named missing members, later closed inputs, attributable reasons/minority objections, and retained counts/handled identities. Synthesis remains advisory; session release uses the canonical Coordinator contract. |
| Debugging and bugfix | `skills/ruach-debugging/SKILL.md:11` requires contract provenance, baseline reproduction, discriminating cause evidence, narrow correction, an independent regression and original-experience retest. `skills/ruach-workflow-bugfix/SKILL.md:23` retains separate checks, exact-candidate review, canonical correction cycles and authorized delivery. Architect use is proportional; no command-failure quota or fabricated real-defect demonstration appears. |
| Tester and runtime QA | `agents/tester.md:19` protects source/tests/configuration and restricts fixture writes to assigned disposable state. Runtime guidance identifies both source and artifact/configuration/state, required/optional experiences, isolated resources, actual capabilities and appropriate measurement boundaries. `skills/ruach-workflow-qa/SKILL.md:21` requires corrected-build original-failure retest and independent review before separate delivery. Missing required listening/browser/trace experience stays held. |
| Hunt | `skills/ruach-workflow-bug-hunt/SKILL.md:15` defines four evidence classes, bounded coverage and independent consequential confirmation. Findings-only grants no fix authority; authorized corrections use bugfix, Tester retest and exact review. No confirmed defects is valid, and synthetic mechanics cannot establish a real-consumer demonstration. |
| Specimens and portable resources | The three examples carry authority, ownership, exact inputs/builds, protected state, budgets, evidence and neutral handoff requirements. All 12 new skill notices equal pinned root bytes. All 23 new installable files equal Git bytes in a fresh snapshot. All 33 direct relative Markdown links and 10 referenced anchors resolve after relocating the supported roles/skills bundle without root docs/evals. |

## Evaluation oracle and coverage review

The expected decisions are in `evals/ruach-capabilities/grader/rubric.md`, separate from installed resources and subject inputs. Contract expectations are independently stated: the clip API must return an existing ID-zero record without mutation, recovery must survive failed export, and checkpoint zero must persist. The grader does not derive expected results from a production function, copy its algorithm, or assert private calls. It permits alternate valid fixes/report layouts and requires actual baseline/candidate executions before claiming red/green evidence. No mocked public-entry test or source/wording regex is presented as proof of workflow behavior.

Contrasting controls cover mode/closure/access, expectation conflict/environment denial, stale versus matched builds, missing versus actual listening/measurement, and findings-only versus authorized correction/clean scope. Skill-hinted briefs are explicitly assisted; blind answer access requires observed exclusion controls. Seeded output mappings are not asserted as compatibility contracts. These are static input/rubric cases, not executed tests.

Unverified behavior remains explicit: actual peer/answer exclusion under native permissions; member argument changes and interrupted resumption; exact-N=1 and up-to-N=1 behavior; changing versus stable closed rounds; actual debugging red/green and original-failure repetition; real browser/desktop/playback/capture/listening; measured workload budgets; consequential hunt confirmation; corrected-build retest/review/delivery. Several controls require runner-created records, builds or tools before use. Later evaluation assignments must supply those artifacts and grade actual actions rather than treating these packets or this review as a pass. The real startup-defect exercise, music-software/playable-prototype demonstrations, hosted CI and final combined review are not run here.

## Verification dispositions

Own commands below completed with whole-command bounds of 120 seconds, from `/tmp` except the Git diff check from this worktree. Full logs and JSON receipts record argv, cwd, start/end, exit/signal and SHA-256 under `/tmp/ruach-review-instr01-880bXf`; `run.ts` is disposable review support, not product code.

| Independent command/check | Disposition and evidence |
| --- | --- |
| `bun /tmp/ruach-review-instr01-880bXf/candidate/scripts/check.ts` | Passed, exit 0; `candidate-resource-check.{log,json}`. Resource/frontmatter/link placement only. |
| `git diff --check 2b693cd72bf39c29575841a88d9c7ae719a29715 90230d165f41b90969037fdf7cf93e1a85d69396` | Passed, exit 0; `candidate-diff-check.{log,json}`. |
| `bun /tmp/ruach-review-instr01-880bXf/candidate/scripts/install.ts install --source /opt/dev/ruach-worktrees/c15-review --revision 90230d165f41b90969037fdf7cf93e1a85d69396 --target /tmp/ruach-review-instr01-880bXf/consumer/.agents` | Passed, exit 0; 116 committed files installed; `snapshot-install.{log,json}`. |
| `bun /tmp/ruach-review-instr01-880bXf/consumer/.agents/ruach-install.ts check --target /tmp/ruach-review-instr01-880bXf/consumer/.agents --source /opt/dev/ruach-worktrees/c15-review` | Passed, exit 0; exact snapshot integrity; `snapshot-check.{log,json}`. |
| `bun /tmp/ruach-review-instr01-880bXf/audit.ts` | Passed, exit 0; 37 archive comparisons, 23 installed comparisons, 12 notices, 33 links/10 anchors, 25 supplied evidence digests and 17 receipt/log digest matches; `independent-audit.{log,json}`. This is a packaging/evidence audit, not behavioral proof. |
| `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/instruction-review.md --repo /opt/dev/ruach-worktrees/c15-review` | Passed, exit 0; `report-validation.{log,json}`. Structure and three existing revision references only. |
| `git diff --cached --check -- docs/assignments/c1-c5/REVIEW-INSTR-01.md docs/reports/c1-c5/instruction-review.md`; assignment digest comparison | Passed, exit 0; `owned-diff-check.{log,json}` and `assignment-integrity.{log,json}`. Assignment SHA-256: `83b41da61f9040216f02e9334ee7fe4d20ccb67fec783d82e7d357979ee8d05b`. |

The implementation checks were not rerun wholesale. I inspected their full stored logs/receipts and independently verified all supplied evidence digests, rather than inferring success from a shortened viewer. Dispositions below refer to that implementation evidence at the pinned source, not independent execution by this Reviewer.

| Supplied required check | Evidence disposition |
| --- | --- |
| `timeout 300s just install`; `timeout 300s just check` | Passed, exit 0 each; frozen dependency setup, resources and pinned root TypeScript check. `install.log`, `check.log`, `verification.json`. |
| Initial `timeout 300s bun run test` | Not verified: environment for four socket-dependent cases; exit 1, 104 pass/4 `listen` EPERM setup failures before their assertions. Original `root-test.log` retained. |
| Authorized socket-enabled `timeout 300s bun run test` | Passed in that environment, exit 0, 108 pass/0 fail; `root-test-sockets.log`. The assignment permits this capability escalation. It is not a registered-flake retry and does not erase the initial failure. No retry/escalation was applied by this Reviewer. |
| `timeout 300s bun run release-check`; handoff-directory `timeout 120s bun test` | Passed, exit 0 each; release v0.6.1 metadata/notices and 28 handoff tests. `release-check.log`, `handoff-test.log`. |
| Snapshot install/check, three frozen executable-skill installs, foreign-cwd `ready --route skill --json`, portable check | Passed, exit 0 each; exact commands/cwds in supplied `verification.json`. Readiness includes Tester and existing duplicate-skill warnings; this is packaging/discovery, not native launch or runtime capability proof. |
| Source diff/assignment integrity; implementation handoff validation; final resource check | Passed, exit 0 each in supplied receipts. Their later evidence-only report does not change the reviewed source identity. |
| New packet suite/typecheck; skill-creator Python validator | Not run. There is no executable packet package/suite/typecheck in this instruction-only candidate. Skill naming/frontmatter, unfinished scaffolding, discriminating triggers and references were reviewed through source inspection and the Bun resource check; no Python-validator pass is claimed. |
| Behavioral/native/product exercises and final union/hosted checks | Not run/unverified, intentionally outside this assignment. They remain acceptance holds for their responsible later assignments. |

No registered flake authority was used, no failed mandatory source check was hidden, and no technical regression was established. Retain both evidence directories and task resources for Coordinator disposition. This report completes the assigned review only; it grants no integration, delivery, publication or cleanup authority.
