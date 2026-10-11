---
task: roadmap-batch1-round3-coordination
role: architect
worker: sol-roadmap-coordination
batch: 1
round: 3
status: complete
agreement: changes
outcome: "Accepted corrections applied to the owned R3 plan and original handoff. Exact revised-pair review awaits round 4; no unseen peer correction is certified."
inspected_revision: 911aef754e7875f9e8a0463e9098ddf496216794
source_plan_revision: fc31e91f859f62320d7535321c935ebedd921411
peer_round1_plan_revision: a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76
previous_plan_sha256: 2a343fad1fa6fa0f14d29ce57a37a16b3b0d1dfbfa8f44d46dfe8879358f85d9
plan_sha256: 13e0ca350c59567a845b2aa4486636e3cb199be938dd40bdbda990ac4937e9ed
artifacts:
  - docs/design/next-coordination-plan.md
  - docs/reports/roadmap-planning/coordination.md
  - docs/reports/roadmap-planning/batch1-round3-coordination.md
  - docs/reports/roadmap-planning/assignment-batch1-round3-coordination.md
verification:
  - "Both closed actual round-2 reports read from the assigned frozen paths; inspected HEAD resolved and own initial plan matched its recorded digest before correction."
  - "Revised plan sha256sum matched plan_sha256 above; original handoff records the same value."
  - "Canonical handoff validator with --repo on both changed handoffs: exit 0; all existing revision references resolved."
  - "Owned Markdown relative targets/headings and whitespace checked; git diff --check and owned staged diff check passed. Frozen current roadmap used for its referenced R3 heading."
  - "Assignment unchanged SHA256: df2d3590f40da214fc50cb3faec0378432ffc2f8404e8323ed6615aed2e3b393."
  - "Not run: unrelated suites, implementation, native/paid subjects, fixture preparation, behavioral grading or exact revised-pair review."
review:
  - "Round-2 arguments reconciled and narrow corrections applied; own revised plan ready for round-4 peer review, with agreement changes as assigned."
discoveries:
  - "Explicit changelog serialization is limited to R-IN's final file-edit phase; disjoint R1/R2/R3 work remains independent."
  - "Held-out controls now require decisive fact/action differences from the public solved example, not renamed versions; packet leakage review precedes paid execution."
  - "No substantive point is rejected and no owner arbitration question remains in this correction round."
blockers:
  - "Exact revised-pair agreement pending: reliability-author corrections and actual revised artifacts must be supplied for round 4. Existing factual/owner execution holds remain named, not new design disagreements."
findings_dispositions:
  - id: B1-A-001
    disposition: accepted-applied-owned-side
  - id: B1-A-002
    disposition: accepted-applied
  - id: B1-A-003
    disposition: accepted-peer-owned-awaiting-revised-artifact
  - id: B1-B-01
    disposition: accepted-peer-owned-awaiting-revised-artifact
  - id: B1-A-004
    disposition: factual-holds-retained
  - id: B1-A-005
    disposition: owner-holds-retained
  - id: B1-A-006
    disposition: optional-no-scope-expansion
  - id: B1-B-02
    disposition: subsumed-by-B1-A-001
  - id: B1-B-03
    disposition: strengthened-by-B1-A-002
---

# Batch 1 round 3: coordination plan corrections

**Agreement: changes.** Own corrections are complete; agreement on the exact revised pair is pending round 4. This report follows the [unchanged assignment](assignment-batch1-round3-coordination.md). The [revised plan](../../design/next-coordination-plan.md) and [original handoff](coordination.md) are the only existing artifacts changed. Prior assignments/reviews and the peer's artifacts remain protected.

Read `<planning-scratch>/batch1/round2/reliability-review.md` and `coordination-review.md` as actual closed reports. They both review the frozen round-1 pair at the recorded creating revisions/digests. These are the arguments reconciled below, not assumed peer success or later revisions. Frozen roadmap inputs retain authority. The newer owner's sequential batches and up-to-five-total-rounds-or-arbitration instruction supersedes historical one-correction-round limits without another approval request for the same two sessions.

## Actual dispositions and reasons

| ID | Disposition, reasoning and owned change | Remaining resolving evidence |
| --- | --- | --- |
| B1-A-001 / B1-B-02 | Accept the peer's must-fix assessment. My earlier optional assessment relied on generic shared-file serialization; it did not identify the actual editor/dependency. The plan's interface and R3-B steps/acceptance now state: R3-B writes its one Unreleased bullet first; R-IN's final changelog-edit phase waits for the independently accepted R3-B commit, refreshes the file and preserves the entry. Coordinator names the SHA and phase gate; integration Implementer checks preservation. R-IN-owned roadmap/native-parity/operations/inventory/docs-consistency are explicitly outside R3 ownership. R1 smoke records its actual installed/tested resource SHA and retains older evidence at its original revision. | The peer's revised reliability plan must name the matching gate. No all-package dependency or new merge service is introduced; disjoint work stays independent. |
| B1-A-002 / B1-B-03 | Accept the stronger argument and revise my earlier optional-only assessment. Distinct names/order alone do not make a copied worked disposition independent evidence. R3-C, the behavioral specification, R3-D packet review and execution/grading briefs now require different decisive facts/topology, positive/negative controls, and comparison against all subject-accessible solved examples before paid execution. CSV-142 remains the useful public specimen and is explicitly excluded as a held-out corpus. | Independently prepared raw cases and packet-review evidence remain future work; no case or subject was run. Exact plan correction can be reviewed now without pretending those results exist. |
| B1-A-003 | Accept the reliability author's self-correction: native task sessions/workspaces/worktrees are personally released by Coordinator; delivery/merge belongs to a separate explicitly assigned delivery Implementer. Offline scratch and bounded verifier subprocess cleanup are different operations. Existing R3 cleanup responsibility was compatible; its boundary paragraph now makes the distinction explicit and preserves uncertain IDs as inspection hints. | Specific R2-B/R1-C corrections belong to the reliability author and await their actual revised plan. I did not edit or certify them. |
| B1-B-01 | Retain/accept the need for subject-visible source/cache inventory and evidenced exclusion plus an offline negative control before blind claims. If exclusion cannot be established, ordinary non-blind smoke can still preserve native-use observations. Prompt assistance and answer accessibility are separate dimensions; installed route bytes and D1 remain intact. R3's existing accessible-resource exclusion remains; it now also checks solved-example leakage. | The R1-S correction is peer-owned and must be inspected in round 4. No actual native cache or subject-access control was exercised here. |
| B1-A-004 | Retain as factual investigation holds: hosted logs/cause/green CI, local dependency setup where absent, stdin diagnosis, native behavior/discovery, real Herdr replacement-ref behavior and Coordinator-only workflow compatibility inspection. | Assigned source/runtime evidence, not an Architect vote. No unrelated checks rerun. |
| B1-A-005 | Retain implementation, paid-run/budget, real consumer scope/resources, external writes/delivery, D1–D3 and optional replacement-ref refusal as future owner holds. Continued valid authorization is preserved; missing authority is not supplied by agreement. | Explicit applicable owner authority at the dependent execution step. |
| B1-A-006 | No additional artifact or ledger. The named interface/phase gate supplies the useful shared-order detail within existing plan ownership. | None as an agreement gate. |

No peer argument is rejected. The severity change follows the specific missing gate and repeated solved-case evidence, not a vote between reviewers. No stable substantive disagreement or owner arbitration question is needed. Both corrected mechanisms preserve the original narrow product scope and role boundaries.

## Held-out design changes that determine different actions

The revised raw-case requirements intentionally differ from the visible solved specimen:

- **Liveness:** a unit recorded running is confirmed ended with partial work, permitting a preserved replacement; another recorded ended is actually active and must be retained. Resource allocations follow the actual active identity, not the stale ledger. This is a source-state contrast rather than a rename of the active-screen story.
- **Report handling:** a completed unhandled report must be consumed; a changed identity/candidate with a blocker must be reconsidered once; an unchanged already-handled report must not trigger another assignment. Checks on the earlier candidate do not verify the amendment. Inputs arrive before a resumed wait and the same identity is later repeated.
- **Supersession/mapping:** an explicit raw owner source resolves one otherwise ordinal reply without a needless confirmation; its negative control lacks that source and stays unresolved. A later ruling removes the scope of one queued unit, leaving independent authority intact, rather than copying help-placement changes.
- **Authorization/target:** valid local merge authority names a task branch, not the public example's main target. A request for an unapproved new target must be held even when Git is unmoved; a moved but authorized destination instead needs refreshed integration/checks/review. Revocation and unrelated resource-choice supersession have distinct effects.

These are requirements for future synthetic consumer fixtures, not actual consumer decisions or completed runs. Hidden expected controls/example comparisons stay in grader-only files, with pristine raw sources and subject outputs separate. Packet Reviewer must reject answer leakage before execution, while allowing public examples to teach general invariants. Static leakage review itself remains distinct from observed behavioral success.

## Verification, readiness and boundary

Both changed handoffs use canonical ruach-handoff leading YAML. Existing inspected/source commit references resolve; the revised plan digest identifies the bytes to freeze for round 4. Original handoff's round-1 check evidence remains labelled historical and does not claim to verify this correction. It now links this report and the newer authority, records the new digest and names peer review as performed with exact revised-pair agreement pending.

Validation commands: `bun <ruach>/skills/ruach-handoff/scripts/validate.ts docs/reports/roadmap-planning/coordination.md --repo <ruach>/.worktrees/sol-roadmap-coordination` and the same command for `docs/reports/roadmap-planning/batch1-round3-coordination.md`. Links/headings are checked for the four owned files, using the frozen current roadmap for the plan's R3 anchor. Whitespace and staged ownership are checked separately; assignment digest is preserved. No unrelated suites, implementation or paid subjects are run.

Ready for the Coordinator to freeze both actual revised artifacts and assign round-4 exact-pair review. There is no correction blocker on the owned R3 side. Peer corrections, Coordinator-only inspection and future owner/factual holds remain explicitly pending. This worker waits for round 4, starts no later batch, and performs no source implementation, worker launch, workflow-body load, publication, global setting change, merge/push/tag or cleanup. Only owned plan/handoffs/report/unchanged assignment are committed; the creating SHA is returned externally after commit, never predicted inside them.
