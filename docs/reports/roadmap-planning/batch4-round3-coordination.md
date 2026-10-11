---
task: roadmap-batch4-round3-coordination
role: architect
worker: sol-roadmap-coordination
status: complete
batch: 4
round: 3
agreement: changes
outcome: "Accepted and applied both actual closed reviews' coordination-owned CI and polling corrections. Refreshed handoff/digest; exact revised-pair agreement remains pending."
inspected_revision: 0ea7f9b0e34c474e590c26799c9e1bea90817fa5
original_coordination_plan_revision: 9576f9999e4afae411a6dba1a496b94ac93abc11
original_reliability_plan_revision: ea9971a21de4d72a252137ac59dd6e7b06dc56d4
read_reliability_review_revision: 07f5b60831bce0d68f235e4fd31b3fba677c7c1a
read_coordination_review_revision: 0ea7f9b0e34c474e590c26799c9e1bea90817fa5
original_coordination_plan_sha256: 1726a85b1102d371980df4c85b345d6dd79d074548fc02f6f63c8ff97cc776a0
original_reliability_plan_sha256: e41b494d959124402745aa2a4e659010eecdbb4d01276c58d2efb93e14834df8
plan_sha256: c360cfc2a921d96e52528fce49617c55a8f6dabd1544125ee8ca052af358329e
closed_review_sha256:
  reliability: a68039b609a1835751e79f2586ea6ce303e8265be27bdbabf3b4f1a23c090871
  coordination: b850f4cdb1d2bd83f00e8eea077b0205687a025b3cd56c5035b631134bc621ac
assignment_sha256: 31533074e6cc08c8ef4ddf2fcb8782467da6ed4378d902a60c17f599ca33bd29
artifacts:
  - docs/design/next-usage-librarian-plan.md
  - docs/reports/roadmap-planning/batch4-coordination.md
  - docs/reports/roadmap-planning/batch4-round3-coordination.md
  - docs/reports/roadmap-planning/assignment-batch4-round3-coordination.md
finding_dispositions:
  B4-A-01: accepted-applied-CI-scope-and-conditional-shared-test
  B4-B-01: accepted-applied-CI-scope-and-conditional-shared-test
  B4-A-02: accepted-applied-target-context-polling-fixtures-and-review-brief
  B4-A-03: retained-factual-execution-holds
  B4-B-02: retained-factual-execution-holds
  B4-A-04: retained-owner-execution-holds
  B4-B-03: retained-owner-execution-holds
rejected_arguments: []
arbitration_questions: []
verification:
  - "Both closed round-2 reviews and all four original frozen plan/handoff files equal their named Git blobs; original plan digests match assignment. Read actual review arguments and relevant original ownership/definitions/checks/briefs."
  - "Applied only assigned plan/handoff/report corrections; all earlier reviews and peer/source/owner artifacts preserved. No implementation, subjects, private transcripts, extra workers, workflow bodies or unrelated suites."
  - "Canonical source validator --repo passed refreshed handoff/correction report, resolving eleven/five revision fields without diagnostics. Four owned files/24 links, whitespace, matching final plan digests and unchanged assignment hash passed."
review:
  - "Actual peer arguments accepted with reasons below; no presumed peer correction or revised-pair agreement."
discoveries:
  - "Executable-based exclusions can undercount real pending-target polls; target/context classification needs opposing fixtures, explicit ambiguity and approval-request dedup separate from status polls."
blockers: []
readiness: owned-corrections-ready-for-exact-revised-pair-review
next_action: "Return creating SHA/digest/dispositions; wait for actual closed revised pair and exact review. No implementation or later batch."
---

**Disposition: changes applied; agreement pending exact revised-pair review.** The [assignment](assignment-batch4-round3-coordination.md) governs. Both actual closed reviews were read and verified against their creating commits; the [plan](../../design/next-usage-librarian-plan.md) and [refreshed handoff](batch4-coordination.md) carry the final digest above.

**B4-A-01/B4-B-01 accepted.** Both reviewers correctly identify that my explicit Librarian-only CI scope excludes comparative-pilot coverage despite the general union-check promise. Root compilation excludes eval trees. M-IN's ownership row now includes both accepted packets' tests/local pinned typechecks, and the verification table supplies exact comparative and Librarian commands. Handoff scope matches. Existing CI tools/permissions/checks are preserved; the proposed analyzer uses existing root test/typecheck coverage without duplicate jobs. `tests/docs-consistency.test.ts` is explicitly conditional on accepted shared-document changes and must be named in M-IN's bounded assignment. Other root edits still need amendment. Sole M-IN writer, accepted C-IN lineage/named definitions/source/reviews, refresh/preserve, full union and independent exact final review remain mandatory. Disjoint preparation is unaffected.

**B4-A-02 accepted.** The peer's example is consequential: `git log` can inspect candidate history or await a named worker report commit. A blanket Git/search/approval exclusion can undercount real polling. The waiting definition now uses tool/argv/target plus surrounding context, classifying ordinary inspection separately and leaving ambiguous intent unclassified. First observation starts the initial episode; subsequent unchanged-target observations are repeats; report/activity/disposition/target changes end it. Blocking waits/wakes and timed pauses stay distinct. M-U0's fixture requirements/check table and copyable assignment contrast the same tool/argv in both uses and cover ambiguity/episode changes; the Reviewer brief checks those controls. Repeated approval-status observations never become additional approval requests: original trigger taxonomy and request/review-ID dedup are preserved. Avoidability and time-savings limits remain unchanged. This is a planning correction, not fabricated fixtures or measured totals.

Accept both reviews' actual M-I-01–05 arguments. Added explicit producer rerun wording to M-I-02: M-E may use the exact reviewed CLI/version only in allocated private scratch, referencing canonical M-UE results by run/attempt and definition/resource identity without overwriting their outputs/receipts. Pilot outcomes/native/evaluation paths remain disjoint. Definitions, supported native-format evidence, predecessor discovery and analyzer review gate execution. No unknown peer round-3 bytes are claimed corrected or accepted.

**B4-A-03/B4-B-02 factual holds and B4-A-04/B4-B-03 owner holds retained.** Matched versus heterogeneous comparison, retained failures/censored attempts, setup/task/assessment clocks, actual human/native/checker layers, hidden-access controls, protected Librarian diffs/stages, privacy and historical uncertainty remain binding. Original cohort availability cannot justify correction factors or billing claims. R1/implemented predecessor/hosted evidence and explicit private-data/route/budget/dialog/delivery authority remain future requirements. D1–D3 and parked subjects remain owner-controlled. No rejected argument, consequential dispute or arbitration question; wait for exact revised-pair review.
