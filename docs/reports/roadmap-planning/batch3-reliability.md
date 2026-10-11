---
task: roadmap-batch3-reliability
role: architect
status: complete
batch: 3
round: 1
outcome: "Independent conditional C2 and C3 implementation handoff designed; actual peer review and execution remain pending."
inspected_revision: 50f867a3da58a600e37a5dfc602dd459a7a04d30
source_revision: d75039aa7b82b262e2f28af08630258fb7f77180
accepted_batch1_reliability_plan_revision: 4b62d7b97d6400c4fb2a340c2466ce52d0d86f6e
accepted_batch1_coordination_plan_revision: 6a08b3f5fa1fb03e0b19024fcec3503d2708e64b
accepted_batch2_reliability_plan_revision: 0588d5639f52347a116aeb457c63f6d651cbf587
accepted_batch2_coordination_plan_revision: 36716b46aeab878cc8737a9f980888c28b3be44e
plan_sha256: 6d986d93816ac6a76f5390529ad98862a5416eec4bc1bf17fc4055ad12b866ce
assignment_sha256: 0892c8af61e367cb815920730c5f1acdebb2226deb5d1ba4c149200cb94b2ba4
artifacts:
  - docs/design/next-adapter-bugfix-plan.md
  - docs/reports/roadmap-planning/batch3-reliability.md
  - docs/reports/roadmap-planning/assignment-batch3-reliability.md
verification:
  - "Read frozen roadmap/native-parity/RAMEC inputs and verified their digests; read only relevant accepted prior interfaces and existing contracts/source/tests/authoring. No batch-3 peer answers or workflow bodies loaded."
  - "Read-only native probes: agy exists but help/version both abort SIGILL, exit 132; gemini absent; Herdr 0.9.0 help recognizes both kinds. Primary agy docs inspected; no native subject or configuration mutation performed."
  - "Source handoff validator --repo: exit 0, ok true, all six revision fields resolved. Owned links: exit 0, three documents/33 links; two initial source-path errors were corrected before this result."
  - "git diff --check: exit 0; all three new-file whitespace checks clean (diff exit 1 means different files). Assignment SHA-256 unchanged; status contains only the three owned paths. Default staging failed exit 128 on the linked index.lock (read-only filesystem). One narrow staging/check/local-commit escalation is required; staged whitespace and exact three-file scope gate that action, and its actual result/creating SHA are returned externally."
review: not-run
discoveries:
  - "C2 remains need/capability-gated; changelog support and native agent-file docs do not prove additive interactive launch. Initial proposed adapter is non-Coordinator, inherit-only; explicit inherit is required through the auto-review-default development wrapper."
  - "C3 instruction-only skills can prepare independently. C-IN exclusively writes shared root metadata/docs after accepted prior shared integration and feature inputs; feature packets own local notices and propose shared entries."
blockers:
  - "Execution holds: concrete C2 need and functional/versioned additive native proof; authorized isolated subjects; real C3 defect selection/original retest; Coordinator workflow compatibility; actual source/predecessor/delivery scope."
readiness: "Design ready for actual peer review and Coordinator acceptance; no feature implementation or later batch authorized."
---

The [detailed plan](../../design/next-adapter-bugfix-plan.md) separates a capability-first thin agy adapter from technical ruach-debugging guidance and the Coordinator-only ruach-workflow-bugfix. It supplies bounded file ownership, prerequisite reasons, source-base/branch resolution, exact future checks/resources, copyable pending Implementer/Reviewer/evaluator assignments, one future advisory task and one actual defect-selection protocol.

Matching C-IN ownership is preserved without an alternative: accepted R3-B → R-IN → B2-IN shared phases precede its shared-file phase; independently reviewed HV-IN stays a B2-IN input. Disjoint preparation remains independent. C2 fixture edits follow accepted overlapping R2-L/R5-L inputs. Root notices/version/catalog edits are distinct from feature-owned local copies; no route activation or release is implied.

Proposed C1 → C3 → C4 → C5 interfaces and optional C2 remain subject to actual peer review. Native/behavioral/real-defect proof is held rather than inferred from source, fixtures, metadata or documentation. No planning blocker or arbitration question was found; the listed holds apply to later execution.

Only the plan, this handoff and the [unchanged assignment](assignment-batch3-reliability.md) are owned. Final artifact checks and local commit results are recorded below/returned externally; no unrelated suites, source changes, feature subjects or later batch. Wait for actual closed peer reports and Coordinator direction within the five-round agreement limit.
