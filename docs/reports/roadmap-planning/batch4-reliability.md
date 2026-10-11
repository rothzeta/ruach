---
task: roadmap-batch4-reliability
role: architect
status: complete
batch: 4
round: 1
agreement: independent-awaiting-peer-review
outcome: "Independent M1 comparative pilot and worked native/checker/human pair plan prepared; no execution or combined-plan agreement claimed."
inspected_revision: 44238ee564b03fa2603058ecb1640899e8f6cf0e
source_revision: d75039aa7b82b262e2f28af08630258fb7f77180
accepted_batch1_reliability_plan_revision: 4b62d7b97d6400c4fb2a340c2466ce52d0d86f6e
accepted_batch1_coordination_plan_revision: 6a08b3f5fa1fb03e0b19024fcec3503d2708e64b
accepted_batch2_reliability_plan_revision: 0588d5639f52347a116aeb457c63f6d651cbf587
accepted_batch2_coordination_plan_revision: 36716b46aeab878cc8737a9f980888c28b3be44e
accepted_batch3_reliability_plan_revision: dc8a4a41657009bcb274be23ee6250402e7ebabe
accepted_batch3_coordination_plan_revision: 2de675bcc7bacfcbe6acc72732bd7a2b7daafb5d
closed_batch3_reliability_review_revision: 44238ee564b03fa2603058ecb1640899e8f6cf0e
closed_batch3_coordination_review_revision: 7d963731694224d69aafe8ce7fd3160dccf3b34d
plan_sha256: e41b494d959124402745aa2a4e659010eecdbb4d01276c58d2efb93e14834df8
assignment_sha256: 5b4a6d7bfb01e71248e654a496ff65d5019c367a039c27d3dbef46a57991f343
artifacts:
  - docs/design/next-comparative-pilot-plan.md
  - docs/reports/roadmap-planning/batch4-reliability.md
  - docs/reports/roadmap-planning/assignment-batch4-reliability.md
verification:
  - "Read assignment, canonical Architect/handoff, canonical task record, prior-batch summary and relevant accepted interfaces; inspected frozen M1/D1-D3/RAMEC/native inputs, checker contracts/source/tests and consumer examples. Frozen input hashes match task record."
  - "Source handoff validator --repo passed exit 0/ok true and resolved ten revision fields; owned links passed for three documents/13 links. Final bytes revalidated before commit."
  - "git diff --check and explicit new-file whitespace checks passed for all three owned artifacts; plan digest and unchanged assignment hash match recorded values. Initial staging succeeded; final default staging failed exit 128 on linked index.lock (read-only filesystem). Narrow three-file staging/check/local-commit escalation is required; staged path/byte/whitespace checks gate it. No unrelated suites were run."
review: not-run
discoveries:
  - "Existing checker v1 accepts declared routes/evidence hashes, always reports model_use_verified false, and trusts Git configuration/runtime; native receipts and actual human comparison remain separate mandatory evidence."
  - "M-P owns only its eval packet; peer discovers/owns measurement script/tests/Librarian files. Minimal usage definitions precede execution; M-IN alone writes shared roots after accepted prior lineage and named definition inputs."
blockers:
  - "Future execution holds: R1 readiness/exact resources, accepted packet/usage definitions and producer, matched route/grants, authorized project/account/budget/stop bands, actual access controls and human assessor."
readiness: "Ready for actual independent-pair peer review, then bounded offline preparation after agreement/arbitration; wait for peer review."
---

The [plan](../../design/next-comparative-pilot-plan.md) proposes three task families with two paired repetitions each, matched primary model/effort/permissions, retained failures, separate assistance/access labels, all-worker usage coverage and descriptive ranges. A worked bugfix pair requires actual native receipts, candidates, acceptance/scope evidence and independent human comparison. No measured result, charge or savings is invented.

It supplies bounded unit ownership, exact checker/verification commands, minimal peer usage semantics, sole M-IN shared-edit gates and copyable Implementer/independent Reviewer/evaluator assignments. D1–D3 evidence is collected without settling packaging/export/conventions; catalogs and parked proposals stay unchanged.

Only the plan, this handoff and the [unchanged assignment](assignment-batch4-reliability.md) are owned. First-round peer M1 answers remain unread. No feature implementation, subjects, extra workers, workflow bodies, unrelated suites, shared-root edits or delivery were performed. Creating commit SHA is returned externally; combined-plan agreement awaits actual peer review.
