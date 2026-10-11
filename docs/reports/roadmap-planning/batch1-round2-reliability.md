---
task: roadmap-batch1-round2-reliability
role: architect
status: complete
batch: 1
round: 2
agreement: changes
outcome: "Combined R1-R3 peer review completed. Three correctable ownership, blind-evaluation and cleanup-boundary issues prevent agreement on the exact unchanged pair; no substantive arbitration question is needed now."
inspected_revision: a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76
reliability_plan_revision: a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76
coordination_plan_revision: fc31e91f859f62320d7535321c935ebedd921411
reviewed_plan_digests:
  reliability: ccb146fbcc1f1bc07930a4a37aa666dbd0801227c67b082800b13aaf7360fe94
  coordination: 2a343fad1fa6fa0f14d29ce57a37a16b3b0d1dfbfa8f44d46dfe8879358f85d9
artifacts:
  - docs/reports/roadmap-planning/batch1-round2-reliability.md
  - docs/reports/roadmap-planning/assignment-batch1-round2-reliability.md
verification:
  - "Read both frozen actual plans and both handoffs from batch1/round1; plan SHA-256 values matched the assignment."
  - "Read the read-only current roadmap planning task record; inspected relevant Coordinator/task-record/coordination contracts and Librarian blind-evaluation boundary. No workflow bodies or unrelated suites loaded."
  - "Canonical source handoff validator with --repo: exit 0, ok true; inspected and both plan revisions resolved."
  - "Owned-link check: exit 0; two owned documents and four relative links checked. Staged whitespace check limited to the new report passed. Staged git diff --cached --check: exit 2 for a pre-existing blank line at EOF in the supplied unchanged assignment; preserved per assignment authority. No unrelated suites rerun."
review:
  - "Architect plan peer review completed; agreement changes. This is not implementation review or certification of evaluation/release outcomes."
discoveries:
  - "The plans agree on one coordination record, authority preservation, bounded source changes, independent combined review and future execution holds."
  - "B1-A-001 through B1-A-003 are narrow plan corrections, including defects in this Architect's own reliability plan; neither frozen plan was edited in this round."
blockers:
  - "B1-A-001: specify CHANGELOG.md shared-edit serialization and preservation between R3-B and R-IN."
  - "B1-A-002: separate held-out behavioral cases from the worked specimen supplied to blind subjects."
  - "B1-A-003: align specific reliability packets with Coordinator-owned native task-resource cleanup."
findings:
  - id: B1-A-001
    classification: must-fix
    owner: both plan authors
  - id: B1-A-002
    classification: must-fix
    owner: coordination plan author
  - id: B1-A-003
    classification: must-fix
    owner: reliability plan author
  - id: B1-A-004
    classification: factual-investigation-hold
  - id: B1-A-005
    classification: owner-decision
  - id: B1-A-006
    classification: optional-suggestion
---

# Batch 1, round 2: combined Architect review

Agreement: **changes**. The review is complete, but the exact unchanged R1-R3 pair needs the three corrections below before implementation handoff agreement. R1-D diagnosis and R3-A specimen work have usable future first packets once a Coordinator supplies ordinary launch inputs and implementation authority. That readiness does not make the entire pair agreed, authorize those launches, or close release/behavioral evidence.

Reviewed inputs were the frozen `reliability-plan.md`, `reliability-handoff.md`, `coordination-plan.md`, and `coordination-handoff.md` under `/tmp/ruach-roadmap-planning-20261011/batch1/round1/`. Their durable sources are `docs/design/next-release-reliability-plan.md` at `a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76` and `docs/design/next-coordination-plan.md` at `fc31e91f859f62320d7535321c935ebedd921411`; digests are recorded above. Line references below refer to those exact frozen plans. Both commits resolve locally. Frozen current roadmap inputs remain binding; neither an old worktree roadmap nor this review supersedes them.

The [round-2 assignment](assignment-batch1-round2-reliability.md) and read-only current task record supply the owner's sequential-batch, at-most-five-round steering. That supersedes the historical one-correction-round sentences in the initial plans/handoffs. No next batch begins in this session. No round-2 peer report was consumed or presumed; the Coordinator closes both reports before distributing them.

## Necessary corrections

**B1-A-001 — Must-fix: name and serialize the actual shared changelog ownership.** Reliability plan line 62 assigns `CHANGELOG.md` Unreleased edits to R-IN; coordination plan line 181 assigns a single R3 Unreleased bullet in the same file to R3-B. Reliability line 68 names coordination for `docs/roadmap.md` and `tests/docs-consistency.test.ts`, which R3's listed packages do not own, while omitting this actual overlap. Coordination line 153 gives only a general instruction to coordinate shared docs. Neither packet names the other changelog editor or a concrete ordering/preservation condition.

Impact: otherwise disjoint workers can prepare the same Unreleased area against different bases, and the integration worker must choose how to preserve a peer's accepted entry without a named assignment dependency. This is a predictable ownership question, not a reason to serialize all of R3 behind R1/R2.

Correction: both authors should name this overlap explicitly and choose one compatible rule. For example, R3-B writes its one bullet first; R-IN's changelog-edit phase waits for the accepted R3-B commit, refreshes that file to include it, and preserves it while adding R1/R2 entries. Earlier disjoint R-IN preparation may continue. Alternatively, give the shared file exclusively to one final integration packet and have the other worker propose its exact entry in its report. Record the chosen rule in both ownership/dependency sections; do not give Implementers discretion to negotiate it. Future role-contract changes from R3 must also be identified when selecting the actual resource revision for R1 native smoke; older route evidence must retain its original SHA.

Accepted peer argument: R3 specimens/guidance/packet preparation can proceed independently of R1/R2. Rejected implication: generic shared-doc coordination alone makes the listed package ownership complete. Resolving evidence: revised actual plans with one matching changelog rule and named gate; no product decision or new merge service needed.

**B1-A-002 — Must-fix: keep blind R3 cases distinct from the supplied solved specimen.** Coordination lines 94-142 give a worked CSV-142 interruption with handled quoting, active screen despite stale state, ended partial help, help-placement supersession, ambiguous lists, preserved local merge authority and a concrete resume sequence. R3-A embeds that filled example in the candidate specimens (lines 173-175). Subjects receive the linked candidate specimens (line 226), while case 01 again resumes CSV-142 with those same distinctive facts (line 232). Cases 02/03 also draw directly on that specimen's ambiguity/authorization situations (lines 233-236).

Impact: withholding the plan and `expected/` cannot make case 01 a held-out behavioral test when the subject's normal resource contains the task's worked disposition. A copied answer can satisfy the proposed observations without demonstrating interpretation of independent raw evidence. This conflicts with the [Librarian give/withhold boundary](../../../evals/ruach-librarian/README.md), which requires no intended answer or prior outcome supplied to the subject.

Correction: keep the useful public worked specimen, but require R3-C to create independent case facts and decision topology. Vary decisive liveness, handled/unhandled identity, supersession scope and authorization/target evidence so the actual next actions cannot be copied from that example; include controls whose correct disposition differs. Renaming CSV-142 alone is insufficient. The packet reviewer should compare subject-accessible examples with case inputs for answer leakage before any paid execution. Maintain raw evidence, protected-file checks and the same invariant rubric; no new evaluation framework is needed.

Accepted peer arguments: separate native execution from independent grading, whitelist resources, retain pristine/output copies, and grade observable invariants rather than prose. Rejected implication: withholding evaluator files is sufficient despite this worked-case overlap. Assumption: implementation follows the explicit filled-example/case instructions; the plan currently imposes no contrary held-out requirement. Resolving evidence: corrected R3-C/subject-boundary instructions and later independently prepared raw cases demonstrating decisive differences. This is a correctable evaluation-design issue, not a current failed model run.

**B1-A-003 — Must-fix: make specific reliability cleanup instructions match the common Coordinator boundary.** Reliability's common contract (line 78) correctly assigns cleanup to the Coordinator. However, the Scout R2-B steps tell the worker to perform cleanup of owned throwaway resources (line 227), and its permissions allow “Coordinator-directed cleanup” (line 243). R1-C line 301 groups delivery/merge/cleanup under a consumer Coordinator **or** delivery Implementer. For task-owned native workspaces/worktrees this leaves cleanup delegated or ambiguous. The [canonical Coordinator boundary](../../../agents/coordinator.md) explicitly keeps task-session/workspace/worktree cleanup with the Coordinator and forbids delegation; the [coordination owner contract](../../coordination.md) agrees.

Impact: a future worker could remove native task resources under a direction that the existing role contract forbids, while the owner record claims a different cleanup actor. Owned subprocess termination and disposal of an offline test's scratch files are separate implementation/probe mechanics and remain allowed within their assigned scope.

Correction: say R2-B preserves evidence, reports exact resource IDs/state and readiness for release; the Coordinator personally releases the dedicated live Herdr task resources. Split R1-C's sentence: an authorized delivery Implementer delivers/merges; the consumer Coordinator performs task-resource cleanup under consumer retention policy. If a consumer explicitly overrides this role boundary, that is a separately stated owner override, not implied by a generic “authorized” packet. Keep uncertain IDs as inspection hints; no automatic cleanup from an unverified receipt.

Accepted peer argument: R3 preserves active/partial work and gives cleanup to its single Coordinator. Rejected wording is in my own reliability plan, not a disputed peer position. Resolving evidence: revised reliability packets consistently distinguish scratch/probe cleanup from native task-resource release. No owner arbitration is required for alignment with the current role.

## Accepted interfaces and named holds

| Review area | Disposition and reason |
| --- | --- |
| Scope and packages | Accept R2-I vs R2-L code/test/support separation and R3-A → B dependency with C preparation alongside B. Fix-only file sets and protected paths are bounded; B1-A-001 is the actual shared edit needing repair. |
| First packets | R1-D and R3-A supply roles, outcome, files/support/docs, checks, reports, branch checks, base-resolution rules and permission limits. Filling existing SHA/route/authority at assignment time is a legitimate launch prerequisite. R1-F depends on diagnosis and R1-C on actual consumer scope; neither is falsely executable now. |
| Source versus inference | Both plans label local setup failure, historical observations, source findings and future outcomes. The reliable local `EPERM` symptom does not prove hosted cause. Tests/probes proposed in a plan are not claimed as implemented regressions. |
| Native/Git trust | Accept pinned private reads, exact base-tree type preflight, uncertain receipt preservation with retained identity checks, and Herdr-server replacement-ref investigation. Reject no peer trust argument: both preserve accepted harness-eval Git-configuration trust and exclude content-hashing redesign/automatic fallback. |
| Interrupted work and authority | Accept R3-D03/D04/D06/D07: durable words/interpretation, scoped authorization survives interruption, state observation precedes replacement, partial work persists, and observed/handled report identity prevents repeated actions. Role/schema/consumer authority remains intact. |
| Review and delivery | Both require existing exact candidate/tested/reviewed revisions, independent combined review, refreshed target and separately authorized delivery. Completion and static validation do not certify acceptance. No claim that this Architect peer review substitutes for those future gates. |
| Blind boundaries | Accept reliability's assisted native-role brief and separately labelled skill-path fallback, with unassisted variants withholding route/skill hints. Accept R3 execution/grading separation subject to B1-A-002. |

**B1-A-004 — Factual investigation hold, not disagreement.** Hosted logs/green CI, full worktree-local dependency setup, changelog stdin diagnosis, actual native discovery/task behavior, real Herdr-server replacement-ref behavior and selected workflow compatibility remain open. R3's assigning Coordinator alone reads workflow bodies; its workers receive exact resulting compatibility findings and a separately owned amendment if needed. The current planning task record additionally reports a green installed-source baseline distinct from the fresh worktrees' setup failures; this is supplied Coordinator evidence, not a test rerun or hosted result verified by this reviewer. No unrelated suites or network diagnostics were rerun in this review.

**B1-A-005 — Owner decisions, not Architect disagreement.** Implementation authority, paid native/behavioral runs and budget, actual consumer task/resource scope, publication/external writes, parked D1-D3, and optional replacement-ref compatibility refusal remain separately gated. Existing valid authority must be preserved; neither elapsed time nor agreement on a plan supplies missing authorization. These holds can remain named in an agreed revised pair.

**B1-A-006 — Optional suggestion.** A short joint launch-order note could enumerate R1-D/R2-I/R2-L/R2-B and R3-A/B/C with their candidate/resource revisions and accepted changelog rule. Keep it in the existing task record/plan interface, without creating another ledger or scheduler. This is optional once B1-A-001 is corrected, and is not an additional architecture gate.

## Readiness and next round

No consequential incompatible design position remains: manual assignment completeness checks, a consumer-owned record and source-backed narrow reliability corrections are compatible. The precise owner arbitration question is **none at this round**. B1-A-001 through B1-A-003 are proposed bounded corrections to review against actual revised artifacts; the peer has not yet accepted or rejected them. If a later round leaves a substantive disagreement, record both positions, evidence and the exact question for owner arbitration by round five, as directed.

Wait for the Coordinator to distribute both completed round-2 reports and assign corrections or the next actual round. This report changes neither plan and starts no later batch. Planning agreement does not assert implementation, evaluation or release completion.

## Verification and commit boundary

Assignment SHA-256 at review start: `b58fc055195d20ebe23ee73e348b6a8b85faef7a4e15d1b6040d069128a4c05c`. Only that unchanged assignment and this report are owned outputs. No plan/source/test edits, workflow-body loading, extra workers, native/paid runs, publication, merge/tag or global configuration were performed. Creating commit SHA is returned externally after commit.

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/roadmap-planning/batch1-round2-reliability.md --repo /opt/dev/ruach/.worktrees/sol-roadmap-reliability` exited 0 with `ok: true` and resolved all three supplied revisions. A temporary TypeScript/Bun owned-link checker exited 0 for the report/assignment (four relative links). `git diff --check` before staging exited 0. The report-only staged whitespace check (`git diff --cached --check -- docs/reports/roadmap-planning/batch1-round2-reliability.md`) passed. The no-index new-file comparison emitted no whitespace diagnostics, but returned 1 for its diff. The full staged `git diff --cached --check` exited 2: the supplied assignment has a new blank line at EOF, line 18. Its SHA-256 matches the original; the explicit unchanged-assignment requirement takes precedence over trimming that supplied line. These checks establish report structure and existing references with the named assignment whitespace exception, not implementation or behavioral outcomes.
