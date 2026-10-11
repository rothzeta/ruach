---
task: roadmap-batch4-round3-reliability
role: architect
status: complete
batch: 4
round: 3
agreement: changes
outcome: "All actual review arguments accepted; owned plan's CI/test scope, usage output joins and producer/polling gates made explicit. Exact revised-pair review remains pending."
inspected_revision: 07f5b60831bce0d68f235e4fd31b3fba677c7c1a
original_reliability_plan_revision: ea9971a21de4d72a252137ac59dd6e7b06dc56d4
original_coordination_plan_revision: 9576f9999e4afae411a6dba1a496b94ac93abc11
closed_reliability_review_revision: 07f5b60831bce0d68f235e4fd31b3fba677c7c1a
closed_coordination_review_revision: 0ea7f9b0e34c474e590c26799c9e1bea90817fa5
original_reliability_plan_sha256: e41b494d959124402745aa2a4e659010eecdbb4d01276c58d2efb93e14834df8
original_coordination_plan_sha256: 1726a85b1102d371980df4c85b345d6dd79d074548fc02f6f63c8ff97cc776a0
closed_reliability_review_sha256: a68039b609a1835751e79f2586ea6ce303e8265be27bdbabf3b4f1a23c090871
closed_coordination_review_sha256: b850f4cdb1d2bd83f00e8eea077b0205687a025b3cd56c5035b631134bc621ac
plan_sha256: 5f4cd47dc71be4b82dc522f73a8440f0eb6e423798a20ff9eb35974b6f997447
assignment_sha256: f4854a42849d81cf867b4132a892ba9f4f6b79e5caab05a8c5531aec3fa18b08
artifacts:
  - docs/design/next-comparative-pilot-plan.md
  - docs/reports/roadmap-planning/batch4-reliability.md
  - docs/reports/roadmap-planning/batch4-round3-reliability.md
  - docs/reports/roadmap-planning/assignment-batch4-round3-reliability.md
finding_dispositions:
  B4-A-01: accepted-owned-scope-clarified-peer-correction-awaits-exact-review
  B4-B-01: accepted-owned-scope-clarified-peer-correction-awaits-exact-review
  B4-A-02: accepted-owned-consumer-controls-explicit-peer-correction-awaits-exact-review
  B4-A-03: retained-factual-execution-holds
  B4-B-02: retained-factual-execution-holds
  B4-A-04: retained-owner-execution-holds
  B4-B-03: retained-owner-execution-holds
arbitration_questions: []
verification:
  - "Read both actual closed round-2 reports and relevant frozen round-1 sections; both reviews and both original plans equal named Git blobs, with matching original plan hashes. Reviewed owned diff only; no peer correction read or inferred."
  - "Both source handoff validators --repo passed exit 0/ok true, resolving thirteen and five revision fields; four owned documents/seventeen links, git diff --check and two-new-file whitespace checks passed. Both handoffs' plan digest matches final bytes; original/current assignment hashes unchanged. Final bytes revalidated before commit."
  - "Default exact four-file staging failed exit 128 on linked index.lock (read-only filesystem); narrow owned staging/check/local-commit escalation required. Staged scope/byte/digest/whitespace checks gate that action; actual creating SHA returned externally. No unrelated suites run."
review:
  - "Accepted every actual peer argument with reasons/dispositions below. No corrected-pair agreement, native proof, human judgment or measurement result claimed."
discoveries:
  - "Owned integration scope now explicitly matches two-packet CI intent and conditional bounded docs-consistency scope; canonical usage outputs have one writer and evaluator reruns stay in allocated scratch."
blockers:
  - "Exact actual peer CI/polling correction and final pair still require round-4 review; factual/owner execution holds remain."
readiness: "Owned correction complete; wait for both correction reports to close and exact revised-pair review."
---

Agreement: changes, pending exact revised-pair review. Both actual closed round-2 reports were consumed, with exact identities above. The [assignment](assignment-batch4-round3-reliability.md) confines this correction to owned artifacts. No peer correction is presumed and no argument is rejected or referred to arbitration.

**B4-A-01/B4-B-01 — accepted.** The peer's own report acknowledges its CI table excludes the comparative packet while broader verification includes it. That is an executable ownership gap: root compiler/CI coverage does not include top-level eval TypeScript. Its proposed two-packet recipes correctly address the gap without a new runner. The [owned plan](../../design/next-comparative-pilot-plan.md), “Future units” and “Verification,” now explicitly names comparative-pilot plus Librarian tests/local pinned typechecks, preserving existing CI tools/permissions/checks and existing root analyzer coverage. It also makes docs-consistency ownership conditional on a demonstrated shared-doc invariant and a Coordinator-named bounded integration assignment/amendment. This answers the peer's shared-test reservation rather than treating “justified” as implicit authority. Accepted C-IN lineage, named pilot/measurement/Librarian definition/source inputs and reviews, refresh/preserve, full-union checks and independent exact review remain binding. The coordination-owned table/summary correction awaits actual revised-pair inspection.

**B4-A-02 — accepted and retained as peer-owned correction.** The earlier definition excluded Git/search/approval tools categorically despite promising target/context evidence. The decisive distinction is ordinary verification versus repeated observation of the same unchanged pending target. Owned “Waiting/activity” and the evaluator brief now require contrasting same-tool controls, unclassified ambiguous intent, explicit initial/repeat episodes and state/disposition/target changes, blocking wait/wake separation and actual approval-trigger deduplication. This records the consumer requirement; it does not implement or edit the peer's definitions, fixtures or Reviewer brief. A repeated call is not automatically avoidable overhead, and counts do not measure saved time. Peer disposition and actual revised producer-definition wording remain future exact-review inputs.

**Actual M-I-01–05 arguments — accepted.** The peer accepts complete pilot membership/outcome authority and disjoint canonical measurement outputs. Owned “Measurements and peer seam” now records those exact propositions with writer paths and revision joins: M-UE owns docs/reports/m1/usage/<run>/{usage.json,report.md}; pilot native/evaluation records stay in their separate evidence subtrees. M-E may independently rerun the reviewed producer only in explicitly allocated scratch/evaluation scope. Its copyable assignment now references immutable canonical results and forbids writing M-UE paths. Run/attempt plus definition/resource/producer identities join evidence; no positional join or concurrent writer is introduced.

M-I-03 explicitly requires independently reviewed definitions, actual supported native-format evidence, exact producer and discovered historical/source predecessor ownership before execution. Proposed script/test/CLI paths identify the closed peer proposal, not implemented or verified availability. M-U0 and packet preparation can proceed independently. Missing original audit cohort prevents historical remeasurement; it does not justify a second editable analyzer, inferred telemetry or a universal 3×/1.8× adjustment. M-I-04 preserves distinct assistance/access labels and checker model_use_verified=false; M-I-05 preserves the sole shared-writer lineage and conditional scope above.

**B4-A-03/B4-B-02 and B4-A-04/B4-B-03 — retained.** Actual formats/cohort, R1/resources/access equivalence, implemented predecessors, native subjects/checks, human comparison and hosted evidence remain factual holds. Project/case selection, budget/repeat/stop/overhead bands, effective grants/privacy/retention and submission/delivery remain owner inputs. These are not architectural disputes and no owner decision is adopted here.

The peer's acceptance of matched primary routes versus heterogeneous systems, twelve proposed attempts, retained failures/censored time, setup/task/external-assessment separation and actual human/native/checker layers is retained. Hidden controls/access proof, protected-state preservation, all-worker usage/unknown coverage, independent grading, exact review/separate delivery and Coordinator resource ownership remain unchanged. D1–D3/catalog/parked boundaries are preserved. Only substantive seam/scope clarifications changed the plan. The [refreshed original handoff](batch4-reliability.md) records the new digest/readiness and dispositions; original assignments/reviews stay unchanged. Return the creating SHA externally and wait for both correction reports and actual exact-pair review.
