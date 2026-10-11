---
task: roadmap-batch2-reliability
role: architect
status: complete
batch: 2
round: 3
agreement: changes
outcome: "R4/R5 implementation plan corrected for B2-B-01: B2-IN is sole final shared-doc/changelog writer and R4–R7 assembler after accepted HV-IN and named R4/R5 inputs. Exact revised-pair review remains pending."
inspected_revision: 59b41e0cb6b3f5b2d96e976f973f41cdb476c040
initial_inspected_revision: da07e92b78b3d6468147a711cc58f74ba57258c9
source_revision: d75039aa7b82b262e2f28af08630258fb7f77180
accepted_reliability_plan_revision: 4b62d7b97d6400c4fb2a340c2466ce52d0d86f6e
accepted_coordination_plan_revision: 6a08b3f5fa1fb03e0b19024fcec3503d2708e64b
closed_reliability_review_revision: 59b41e0cb6b3f5b2d96e976f973f41cdb476c040
closed_coordination_review_revision: aa0353fb731bf37357df93b2de92893b3836aae8
plan_sha256: 9476eb2d9b770cef722f185976de85d0ced6fa0901a4c14538fff791e1576998
artifacts:
  - docs/design/next-permissions-communication-plan.md
  - docs/reports/roadmap-planning/batch2-reliability.md
  - docs/reports/roadmap-planning/assignment-batch2-reliability.md
  - docs/reports/roadmap-planning/batch2-round3-reliability.md
  - docs/reports/roadmap-planning/assignment-batch2-round3-reliability.md
verification:
  - "Historical round-1 investigation: frozen input digests, relevant prior interfaces and adapter/readiness/startup/process/fixture source inspected independently. Original artifact checks passed at cc84be0049218f5c84d555c2ea077b4a1e585d32; those are not checks of this revised plan."
  - "Historical native evidence: Herdr 0.9.0 help/schema and status-server exit 0; own-pane inspection exit 1 Operation not permitted. Codex 0.162.1/Claude 2.1.296 help confirmed mapped syntax, not realized access. No native subject or suite rerun in round 3."
  - "Round 3 read both closed frozen round-2 reviews, matched their SHA-256 to creating-commit blobs (git show exit 0), and checked relevant plan/prior shared-file interface."
  - "Both changed handoffs passed canonical source validator --repo: exit 0, ok true, seven/four existing revisions resolved, no diagnostics. Owned links: exit 0, four documents/24 relative targets. Revised plan and current/initial unchanged assignment digests matched."
  - "Tracked and new-file whitespace passed (new-file diff exit 1 denotes different files, no diagnostics; wrapper exit 0). Owned-file staging and git diff --cached --check exited 0; exactly four owned paths staged. Final-byte checks repeated before commit."
  - "Final restaging of completed handoffs failed exit 128 on linked index.lock (read-only filesystem). One narrow owned-path staging/check/local-commit escalation is required; actual result/creating SHA returned externally."
review:
  - "Round-2 own agreement rested on launch reservations; peer required named final ownership. B2-B-01 accepted and corrected; round-4 exact revised-pair review not run."
finding_dispositions:
  B2-B-01: accepted-corrected
  B2-B-02: retained-factual-execution-hold
  B2-B-03: retained-owner-execution-hold
discoveries:
  - "Portable permission mappings already exist; actual linked Git/socket/recipe permission needs isolated native proof, not bypass flags or automatic common-gitdir grants."
  - "Herdr prompt/wait lifecycle semantics are not report/turn identities. R5 reads durable reports before waiting and persists handled dispositions through the accepted R3 record."
  - "B2-IN is sole final batch-2 shared-doc/changelog writer and R4–R7 assembler after accepted HV-IN R6/R7 subcandidate and named accepted R4/R5 inputs. HV-IN proposes its entry in its report; R3-B → R-IN → B2-IN shared-doc gate is retained."
blockers: []
remaining_gaps:
  - "Native policy decisions, linked stage/commit, socket/temp verification, prefix mechanism and trust/draft/exited/timeout behavior remain unverified; current socket denial limits live own-session inspection."
  - "Implementation, dedicated native/paid scope/budget/dialogs, delivery/publication and D1-D3 remain owner holds. No prior-batch arbitration hold exists."
readiness: "Own bounded correction complete, pending round-4 exact revised-pair review. No unseen peer correction or agreement certified; live execution gates retained; no batch 3."
---

The [plan](../../design/next-permissions-communication-plan.md) preserves existing adapter-owned `inherit`/`auto-review`, read-only readiness and Herdr terminal primitives. It supplies disjoint permission/communication fixture packets, startup CLI coverage, new guides, independent review and authorized execution packets, shared-file gates, exact checks/resource ownership and two copyable first Implementer assignments with pending outcomes. No new scheduler, schema, role, global configuration or terminal wrapper is proposed.

R4 records actual Git admin/common-directory and recipe access, whole-argument prefix distinctions, one scoped index-lock request on denial, verification permissions and user-resolved native dialogs. R5 separates accepted send, observed activity and durable report completion; it handles pre-wait reports, uncertain drafts, shell exit, native blocks, timeout and verifier exit without duplicate work. Actual resource revisions, evidence/classification and limitations remain explicit.

The [round-3 correction](batch2-round3-reliability.md) accepts the actual peer argument B2-B-01: launch reservations alone left duplicate changelog owners. B2-IN now owns final shared docs/changelog and full R4–R7 assembly after accepted HV-IN and named R4/R5 inputs. HV-IN supplies an independently reviewed R6/R7 subcandidate and exact proposed entry through its report. Coordinator supplies predecessor SHAs/reserves the active shared phase; B2-IN preserves R1–R3/all accepted R4–R7 entries, runs full union checks and obtains independent exact final review. Disjoint preparation remains independent.

Factual/owner holds B2-B-02/03 remain execution gates. Existing schema/status/revision semantics, read-only readiness, consumer flake policy, requested diff/retained checkout, moved-target delivery and Coordinator-personal resource release remain intact. The [initial assignment](assignment-batch2-reliability.md) is unchanged and protected; its SHA-256 remains `59cf15e8aa5a41cbe97002e59623529f64bf89be95337a9bb4b56c315672fb69`. Current owned artifacts are the plan, this handoff, correction report and [unchanged correction assignment](assignment-batch2-round3-reliability.md). Creating SHA is returned externally. Wait for round 4; no batch 3.

Both changed handoffs passed `bun <ruach>/skills/ruach-handoff/scripts/validate.ts <report> --repo <ruach>/.worktrees/sol-roadmap-reliability`; owned links, assignment digests and whitespace passed. Exactly the four assigned artifacts were staged; staged whitespace passed. Checks are repeated on final bytes before commit. Earlier round-1/2 scoped local-commit escalations succeeded after linked `index.lock` denials; these historical observations do not establish native smoke outcomes. No implementation, unrelated suite, workflow-body load, native/paid subject or task cleanup occurred in this correction.
