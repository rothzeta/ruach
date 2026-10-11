---
task: roadmap-batch1-round3-reliability
role: architect
status: complete
batch: 1
round: 3
agreement: changes
outcome: "Own R1/R2 plan corrections completed for shared changelog ordering, native cleanup actor and evidenced blind-answer access. Both closed peer reports consumed; exact revised-pair agreement remains pending round 4."
inspected_revision: d4ffa4b5eca92b54dfecfc8f48a10243fd8db66b
source_revision: d75039aa7b82b262e2f28af08630258fb7f77180
prior_plan_revision: a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76
plan_sha256: 37a72430abe975baf3710e91932a554f4b226f82dfd741edae8722ebb9d3086a
prior_plan_sha256: ccb146fbcc1f1bc07930a4a37aa666dbd0801227c67b082800b13aaf7360fe94
review_input_digests:
  reliability: eec96d2f55db9036cd14d8cbb00c069d9db71548ce8a1c2532a1a5af83d1e111
  coordination: 38421e8351cd313e6906827839f10717df8bf29dfa71bb8b378b049f7a211617
artifacts:
  - docs/design/next-release-reliability-plan.md
  - docs/reports/roadmap-planning/reliability.md
  - docs/reports/roadmap-planning/batch1-round3-reliability.md
  - docs/reports/roadmap-planning/assignment-batch1-round3-reliability.md
verification:
  - "Read both actual closed round-2 reports and the round-3 assignment; recorded input digests and inspected current HEAD. Prior own-plan digest matched the frozen round-1 plan."
  - "Own revised plan and unchanged assignment SHA-256 matched the digests below; no executable code/test change or unrelated suite rerun."
  - "Canonical source validator on both changed handoffs with --repo pointing at this worktree: exit 0, ok true, no diagnostics; existing inspected/source revisions resolved."
  - "Owned Markdown link check: exit 0, four documents and 37 relative file targets passed. git diff --cached --check: exit 0; staged file set is exactly the four owned artifacts."
review:
  - "Accepted and reconciled closed round-2 arguments. Own corrections are complete; exact revised-pair round-4 review has not occurred and peer corrections are not certified."
discoveries:
  - "Assisted/unassisted prompt hints and blind/non-blind answer access require separate recorded classifications; whole-repository plugin cache exposure can invalidate a blind claim."
  - "The accepted changelog gate is phase-specific: R3-B writes its accepted entry first; R-IN refreshes/preserves it in the final changelog-edit phase without blocking disjoint preparation."
blockers:
  - "Exact revised-pair agreement remains pending round 4; no next batch is started."
dispositions:
  - id: B1-A-001
    decision: accepted-and-applied-in-owned-plan
  - id: B1-A-002
    decision: accepted-peer-owned-correction-awaiting-exact-review
  - id: B1-A-003
    decision: accepted-and-applied-in-owned-plan
  - id: B1-B-01
    decision: accepted-and-applied-in-owned-plan
  - id: B1-A-006
    decision: optional-interface-note-applied-within-existing-scope
  - id: B1-B-02
    decision: accepted-and-covered-by-B1-A-001
  - id: B1-B-03
    decision: accepted-peer-owned-variation-covered-by-B1-A-002
arbitration_question: none
---

# Batch 1 correction round 3

The [owned plan](../../design/next-release-reliability-plan.md) now contains the accepted corrections. **Agreement: changes** means these own-plan edits are complete and exact revised-pair review is still required. This report does not imply that the peer's new plan has been received, its corrections verified, a model subject run, or an implementation package authorized.

Authority is the [round-3 assignment](assignment-batch1-round3-reliability.md). Both actual closed reports were read from `/tmp/ruach-roadmap-planning-20261011/batch1/round2/`: `reliability-review.md` and `coordination-review.md`, identified by digests above. The durable own round-2 review remains [unchanged](batch1-round2-reliability.md); the peer report's canonical path is `docs/reports/roadmap-planning/batch1-round2-coordination.md`. Frozen current roadmap inputs remain authoritative. The same two Sol sessions may complete sequential batches with up to five total agreement rounds or recorded arbitration; historical one-correction-round statements are superseded. No later batch starts here.

## Actual dispositions and resolving changes

| Finding / argument | Disposition and reason | Owned change / remaining evidence |
| --- | --- | --- |
| B1-A-001 / B1-B-02: shared changelog ownership | Accept the peer's point that the original generic serialization rule did not authorize concurrent edits. Retain the requirement for a named phase/order because a handoff should not leave workers to resolve the actual overlap. This is compatible clarification, not a majority vote about severity. | Package table, ordering paragraph, R-IN and R3 interface now require accepted R3-B entry first; R-IN's final changelog-edit phase waits for its accepted commit, refreshes and preserves it. Non-overlapping roadmap/docs-consistency references no longer imply R3 ownership. Disjoint work remains independent. Peer must mirror the rule; its actual revised bytes await review. |
| B1-A-002 / B1-B-03: public specimen versus raw cases | Accept that useful general/worked examples are legitimate resource inputs. Retain decisive held-out case variation so copied specimen dispositions cannot pass as interpretation of new evidence; names alone do not resolve it. Severity labels need not be identical if the corrected requirement is compatible. | R3 owns its held-out cases; this Architect does not edit or claim completion of them. R1-S packet acceptance now also checks accessible worked examples for solved-disposition leakage. Positive/negative controls and changed liveness/handled/supersession/authority facts remain the peer correction to inspect in round 4. |
| B1-A-003: cleanup actor | Accept and correct my specific packet wording to match the common contract and canonical Coordinator role. No argument supports worker release of live task resources absent an explicit consumer override. | Common execution contract, R2-B steps/permissions, R1-S resources and R1-C delivery boundary now require Coordinator-personal native session/workspace/worktree release. Workers retain evidence and report IDs/state; bounded owned verification subprocess/offline scratch cleanup remains allowed. Delivery/merge is an explicitly assigned Implementer action. Uncertain IDs never authorize automatic release. |
| B1-B-01: plugin-cache answer access | Accept the peer's must-fix. Prompt omission, isolated homes and non-registration of eval files do not establish inaccessible answers in a whole-repository cache. Reject treating prompt separation alone as blind access proof. | R1-S now inventories actual visible source/cache/snapshot/user-skill/evaluator/prior-output roots, records revision/digests/access mechanism, and requires evidenced exclusion plus offline negative and positive controls under actual subject permissions. Independent packet review checks those results before a blind claim. If separation/equivalent route access is unproved, retain ordinary non-blind native-use smoke and leave blind evaluation unverified. |
| B1-A-006: launch-order note | Apply within existing interface; no new ledger or scope expansion. | Existing R3 interface now identifies independent starters, the R3-A → R3-B dependency and phase-specific changelog edge, with actual resource revisions recorded in the consumer's existing task record. |

No accepted correction was rejected. The earlier gap-producing interpretations above are rejected, without inventing an opposing current peer position. No consequential incompatible position or owner arbitration question remains in these dispositions. Round 4 must inspect actual revised artifacts rather than assume the proposed matching changes occurred.

## Native resource and evaluation boundaries

The R1-S package/acceptance now records the actual installed resource revision and bytes. Accepted R3 guidance is identified when testing the combined batch; older results retain their original SHA. A combined R1-R3 technical candidate requires an explicitly authorized integration assignment, the union of affected checks and independent review of its exact SHA. R-IN's existing no-role-edit scope is preserved. A later relevant guidance change requires affected authorized smoke to be repeated or coverage left pending; old evidence is not relabelled as new.

Prompt assistance and answer access are distinct: a hinted role/skill brief remains assisted even if answers are inaccessible; an unhinted brief is not blind if cached rubrics are readable. The new access manifest covers plans, expected answers, hidden checks, rubrics, prior conclusions and other outputs, including alternative paths/aliases. The offline control must attempt forbidden reads inside the effective subject filesystem/tool boundary and confirm allowed task/runtime reads with correct installed digests. Host-side guesses or instructions to avoid files are insufficient. Realized access observations and limitations must be retained by the future execution/report; none were fabricated in this planning round.

The correction preserves actual install-route/runtime bytes and native lifecycle. It does not authorize silently trimming cache/source packaging, substituting a copied skill view as proof of the plugin route, changing global settings, or settling D1. A materially different restricted-resource experiment is separate evidence. Native smoke is still useful when non-blind, and its discovery/scope/outcome reports remain retained. No new evaluator service, packaging decision or paid run is introduced.

## Holds, readiness and record ownership

Factual holds remain: hosted logs/cause and resulting green CI; missing worktree-local dependencies and changelog stdin diagnosis; actual native discovery/composition/consumer behavior; Herdr-server replacement-ref behavior; R3 workflow compatibility and behavioral evidence; future actual access-control probes. This round did not revisit those investigations or convert proposed controls into successful results.

Owner holds remain: implementation authority; paid/launch budget and dialogs; actual consumer task/resources; external writes/delivery target; parked D1-D3 and optional replacement-ref refusal. Existing valid authority remains valid within scope; agreement itself would not supply missing authorization. These holds are future execution gates rather than a new Architect disagreement.

The [original handoff](reliability.md) was updated only to reference current corrections/digest and review/authority state. Its initial source/test verification entries remain historical; no unrelated suites were rerun. Prior assignments/reviews and peer artifacts were not edited. The plan and both handoffs remain planning evidence, not implemented outcomes.

Ready for round 4's exact revised-pair review. Wait for the Coordinator's frozen actual pair/assignment; do not start another round or batch autonomously. The creating commit will be returned outside this report and is not predicted here.

## Verification and commit scope

Revised plan SHA-256: `37a72430abe975baf3710e91932a554f4b226f82dfd741edae8722ebb9d3086a`. Unchanged round-3 assignment SHA-256: `118eed58085b4c3c10f3ea3133a2d6e77f9f6354f98064b591e4c36d47818f08`. Only the plan, original handoff, this new handoff and that assignment are owned/staged for this round.

Canonical source validation of both changed handoffs with `--repo` passed (exit 0, `ok: true`, no diagnostics and existing revisions resolved). The owned link check passed for four documents and 37 relative file targets. Staged whitespace passed with `git diff --cached --check` (exit 0), and the staged paths are exactly the four owned artifacts. No code/test implementation, extra worker, workflow-body loading, native/paid run, global configuration, publication, merge/tag or task-resource cleanup occurred.
