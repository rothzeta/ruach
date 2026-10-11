# Release evidence and reliability planning assignment

Role: Architect. Task: roadmap-reliability-plan. Worker: sol-roadmap-reliability.
Workspace: assigned worktree on branch `ruach/sol-roadmap-reliability`.
Base: `d75039aa7b82b262e2f28af08630258fb7f77180`.
Route: user explicitly requested Sol; use `gpt-6.1-sol`, high effort, auto-review permissions. This is an explicit selection rather than a change to repository routing policy.

Outcome: detailed, implementation-ready plans for the roadmap's next packages R1 and R2, grounded in current source. Explain the implementation order and interface with R3, which a second Architect plans independently. Limit later R4–R7/C1–C5/M1 discussion to dependencies and deferred work.

Binding authority: the user requested two Sol Architects to plan next features from docs/roadmap and create detailed handoff plans. Planning and source investigation are authorized; implementation, publication, paid smoke/eval sessions beyond these two Architects, global harness settings, and packaging decisions are outside this assignment. Do not load Coordinator workflow bodies, spawn more workers, or edit reusable resources.

Current inputs: source checkout has uncommitted updates to docs/roadmap.md, docs/native-parity.md, and docs/design/0.4-suggestions-from-ramec-orchestration.md. Read the frozen copies at `/tmp/ruach-roadmap-planning-20261011/` for these three documents instead of their older worktree versions. Roadmap SHA256: `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`. Cite their canonical repository paths in the resulting plans. Read relevant existing source, tests, operations limitations, regression inventory, CI configuration, CONTRIBUTING.md, and docs/examples/assignment-specimen.md. The main source checkout is read-only to you.

Owned artifacts only:
- docs/design/next-release-reliability-plan.md (detailed plan).
- docs/reports/roadmap-planning/reliability.md (structured handoff).
- This assignment, committed unchanged with the plan/report.

Acceptance:
- Separate verified current behavior, hypotheses, proposed design, and decisions requiring owner authorization.
- For R1, inspect actual CI/test configuration and local evidence; never assert a cause from the roadmap alone. Read-only network access to public GitHub evidence is allowed when available. Link evidence if checked; otherwise explicitly mark hosted diagnostics pending. Supply bounded diagnostic/fix and native/consumer smoke assignments, evidence matrices, execution permissions, and real acceptance criteria. Preserve unassisted/assisted harness-eval distinction and require authorization for future paid runs or publication.
- For R2, inspect code and tests for every documented limitation: installer revalidation under lock, linked identity failure workspace receipt, requested subdirectory preflight, and Herdr replacement-ref boundary. Identify source/test ownership, public entry points, failure scenarios, smallest compatible changes, failing-before regression cases, and recovery instructions. Preserve accepted Git configuration trust boundaries.
- Each work package states purpose, role, concrete file scope including source/tests/support/docs, prerequisites and dependency reasons, input revisions to resolve at launch, unused branch naming, implementation steps, acceptance, exact verification commands, permissions/resources, report location and delivery/review boundaries. Copyable assignments must remain future assignments, not fabricated outcomes.
- Explain parallelizable packages versus shared-file edits that must serialize. Provide a first executable handoff with no predictable ownership questions. Identify factual investigation gaps separately from actual product decisions.
- Preserve source ownership and existing contracts; no new scheduler, package manager, task database, broad content-hashing design, role, or automatic route switching.

Verification: run the source handoff validator against your report with --repo pointing at this worktree. Source tool path is `/opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts`. Check your documentation links and git diff --check. Run source `just check` and other relevant checks where dependencies are available; record any environment/setup limitation accurately. Code/test implementation and paid sessions are not required for planning. Do not install globally or weaken checks.

Commit: stage only the three owned artifacts, commit locally, and return the creating SHA. If staging hits gitdir permission failure, request the narrowly scoped escalation once through your own approval system. Do not change another checkout. No push, merge, tags, or cleanup.

Handoff: leading YAML per `/opt/dev/ruach/skills/ruach-handoff/SKILL.md`, including task, status, outcome, artifacts, verification, discoveries, blockers, and review status. Record the inspected base in a revision field; never predict the report's creating SHA inside itself. Detailed design belongs in the plan. Finish with report/plan paths, commit SHA, readiness, and consequential blockers. This Architect session remains available for one review/correction round.
