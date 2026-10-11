# Durable coordination planning assignment

Role: Architect. Task: roadmap-coordination-plan. Worker: sol-roadmap-coordination.
Workspace: assigned worktree on branch `ruach/sol-roadmap-coordination`.
Base: `d75039aa7b82b262e2f28af08630258fb7f77180`.
Route: user explicitly requested Sol; use `gpt-6.1-sol`, high effort, auto-review permissions. This is an explicit selection rather than a change to repository routing policy.

Outcome: a detailed, implementation-ready plan for R3, the roadmap's next durable coordination/assignment feature. A second Architect independently plans R1/R2. Define R3's interfaces with R4/R5/R6 and C1 so the next work will not require redesign, while keeping implementation packages within R3.

Binding authority: the user requested two Sol Architects to plan next features from docs/roadmap and create detailed handoff plans. Planning and source investigation are authorized; implementation, publication, paid smoke/eval sessions beyond these two Architects, global harness settings, and packaging decisions are outside this assignment. Do not load Coordinator workflow bodies, spawn more workers, or edit reusable resources. You may inspect workflow callers without opening workflow SKILL.md bodies; report any needed Coordinator-only inspection as a bounded follow-up.

Current inputs: source checkout has uncommitted updates to docs/roadmap.md, docs/native-parity.md, and docs/design/0.4-suggestions-from-ramec-orchestration.md. Read frozen copies under `/tmp/ruach-roadmap-planning-20261011/` for those three documents instead of the older worktree versions. Roadmap SHA256: `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`. Cite canonical repository paths in your plan. Read agents/coordinator.md, agents/architect.md, existing task-record/assignment specimens, handoff skill/schema and validator, CONTRIBUTING.md, relevant eval packet structure, and the integrated changelog boundaries. The main source checkout is read-only to you.

Owned artifacts only:
- docs/design/next-coordination-plan.md (detailed plan).
- docs/reports/roadmap-planning/coordination.md (structured handoff).
- This assignment, committed unchanged with plan/report.

Acceptance:
- Ground the design in existing specimens and role contracts. Identify exact gaps with source references, preserving supported current behavior.
- Extend the existing durable task record and assignment specimen before proposing executable lint, bookkeeping skills, a task database, or a new role. Decide explicitly whether manual assignment completeness checks suffice; do not treat roadmap wording as authority for additional tooling.
- Specify stable decision/work IDs, owner words/date/authority/supersession, proposal-versus-choice records, ambiguous responses, durable authorization, phase updates, compaction resumption, running/queued units and dependency reasons, assignment/report paths, revisions, branches/workers/resources/route overrides, blockers and next actions. Consumers choose paths, retention and commit policy. Handle existing text saying approvals must be reconfirmed in a way that preserves still-valid user authorization.
- Provide a realistic filled specimen for an interrupted multi-unit task with a superseded decision, unresolved ambiguous response, active/complete work, retained partial work, route override, and owned port/profile/save resources. Show concrete resume steps and avoid resubmitting handled work. The specimen must not invent product decisions for consumers.
- Decompose implementation into bounded packages naming role, owned source/tests/support/docs, dependency reasons, base resolution, unused branch naming, implementation steps, acceptance, exact checks/permissions, report paths, and review/delivery boundaries. Serialise overlapping specimen/role guidance edits and explain which units can proceed independently of R1/R2.
- Define a realistic isolated behavioral evaluation packet with raw inputs separated from hidden expected outcomes/rubrics. Include interrupted continuation, ambiguous owner answer, stale-but-active worker, partial work, supersession, and authorization preservation. Static links/frontmatter checks alone do not establish instruction behavior. A future independent evaluator is assigned separately; do not claim one was run.
- Include copyable first implementer and independent reviewer/evaluator assignments. Future assignments contain pending outcomes and concrete evidence requirements, never fabricated success.
- Clearly separate ready work, dependencies, factual investigation gaps, and owner decisions. Cover R4/R5/R6/C1 interfaces only, with a concise deferred boundary for the remaining roadmap.

Verification: run `/opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts` on the report with --repo pointing at this worktree. Check links and git diff --check. Run source `just check` and other relevant checks where dependencies are available; accurately record environment/setup limitations. Code/test implementation and paid sessions are not required for planning. Do not install globally or weaken checks.

Commit: stage only the three owned artifacts, commit locally, and return the creating SHA. If staging hits gitdir permission failure, request the narrowly scoped escalation once through your own approval system. Do not change another checkout. No push, merge, tags, or cleanup.

Handoff: leading YAML per `/opt/dev/ruach/skills/ruach-handoff/SKILL.md`, including task, status, outcome, artifacts, verification, discoveries, blockers, and review status. Record the inspected base in a revision field; never predict the report's creating SHA inside itself. Detailed design belongs in the plan. Finish with report/plan paths, commit SHA, readiness, and consequential blockers. This Architect session remains available for one review/correction round.
