# INSTR-01 v1 — C1/C3/C4/C5 canonical instruction resources (Implementer)

Authority: user requests "do c1-c5 use ruach skills an agents as needed, codex only" and then authorizes Gemini calls for C2. You are a Codex Implementer; preserve your canonical role. Retained consumer repos are unchanged. No global setting writes, trust answers, route fallback, merge/push/install or task-resource release.
Workspace/base: /opt/dev/ruach-worktrees/c15-instructions, branch ruach/c15-instructions, base 2b693cd72bf39c29575841a88d9c7ae719a29715. Canonical roles/skills are currently /opt/dev/ruach/agents and /opt/dev/ruach/skills; use skill-creator, ruach-testing, ruach-simplification and ruach-handoff as relevant. Source workflow documents assigned as product material may be authored/read as source data, never executed or adopted as your operating procedure. You receive this self-contained implementation assignment rather than a Coordinator workflow.

Outcome: implement the smallest complete C1/C3/C4/C5 source resource set and useful specimens/evaluation cases. Existing detailed design plans are inputs, not mandatory extra phases or shipped evidence. Preserve the current 0.6.1 boundaries and simplicity; avoid a new runtime, framework, scheduler, vote engine or database.

Owned source:
- skills/ruach-workflow-council/**
- skills/ruach-debugging/**
- skills/ruach-workflow-bugfix/**
- skills/ruach-runtime-testing/**
- skills/ruach-workflow-qa/**
- skills/ruach-workflow-bug-hunt/**
- agents/tester.md
- new docs/examples/council-member-assignment.md, docs/examples/runtime-qa-assignment.md and docs/examples/bugfix-assignment.md (combine examples if that is clearer; report final names).
- new evals/ruach-capabilities/** only when useful for realistic reusable behavior cases/support. Keep rubrics/expected decisions outside installed skills and separate from subject briefs; existing evaluator infrastructure may suffice. Do not add wording-matching or formatting unit tests.
- docs/reports/c1-c5/instructions.md and this unchanged assignment.
Protected: all existing source/skills/roles/tests, root docs, catalogs, CI, package/release metadata and canonical notices. Propose shared-file integration edits in the handoff; the integration Implementer will own them. The native adapter/launch-transport correction belongs to another assignment, not yours. Report a concrete ownership amendment if necessary.
Read task-relevant source and existing patterns before writing. Read docs/roadmap.md C1/C3/C4/C5 and docs/design/next-council-qa-hunt-plan.md plus next-adapter-bugfix-plan.md C3 contract as existing design. Historic planning-only authority or prior package phases do not revoke the current user's implementation request. Use only relevant parts; do not redo planning.

C1 acceptance:
- Coordinator-only council workflow with precise trigger; existing roles suffice for members and optional Architect synthesis. One Coordinator owns dispatch, closed rounds, artifacts, decisions and cleanup.
- Manual mode: one closed independent round then pause. Automatic exact N includes the first round and runs N unless blocked/cancelled/amended. Up-to-N stability is an explicit separate mode. No universal three rounds, voting/majority adoption or implicit consensus rule.
- Do not expose first-round peer answers; later rounds receive actual closed reports and new evidence. Report access limitations honestly; unsupported independence is not a pass. Named missing/blocked member stays visible; terminal state is not a report.
- Member and synthesis outputs preserve evidence, assumptions, attributed accepted/rejected arguments/reasons, changes, supported minority objections and resolving evidence. Owner adoption is distinct from recommendation. Resumption from retained artifacts keeps round counts and handled identities; release sessions when reuse ends.

C3 acceptance:
- Technical ruach-debugging for known/reported defects: intended behavior/authority, bounded original reproduction, discriminating evidence-supported cause, narrow authorized correction, meaningful independent regression oracle, repeat original failing experience, required independent review/delivery. Architect optional; unknown/environment failures retain their actual label.
- Coordinator-only bugfix workflow translates those phases into bounded assignments and reuses canonical correction-cycle definition, verification dispositions, exact revision/review/delivery/cleanup contracts. Do not copy definitions into multiple authoritative places or require an Architect for every red test.
- No fabricated real-defect demonstration. A real startup truncation has been observed in this task and will be separately assigned as a possible C3 exercise after your debugging skill is available.

C4 acceptance:
- Tester role owns actual runtime exercise, evidence and reproducibility against assigned build/goals/capabilities; does not edit application source/tests/config, implement fixes, architect, accept review, coordinate workers or deliver. Disposable explicitly assigned runtime fixture state is allowed. Handoffs name gaps.
- Technical runtime-testing skill and Coordinator-only QA workflow separate technique from orchestration. Identify actual build/artifact as well as source revision; record configuration/tools/state/input sequence and independent expected behavior.
- Browser/desktop input, screenshots/logs, playback/capture/listening are distinct capabilities. Reading audio code or a waveform is not hearing playback. Missing required experience stays held; observations do not become fabricated acceptance.
- Consumers allocate isolated profiles/saves/ports/databases, preserve originals/raw evidence and own resource release. Measurements use actual declared workloads, named viewports, units/tools/repeats/ranges/cold-warm state and contractual budgets. Do not freeze incidental seeds/startup times or invent universal UI budgets/palettes.
- QA can close as findings-only if authorized, but correction/retest/review/delivery requires its own scope and evidence.

C5 acceptance:
- Coordinator-only bounded bug-hunt: named area/risk/budget/build, source-supported vs reproduced vs suspected vs product observations, exact repro/state/evidence/confidence, independent confirmation of consequential findings. "No confirmed defects" is valid with actual coverage/uncertainty.
- Findings-only ends at a report; discovery grants no implicit fix or release authority. Authorized find-and-fix chains to bugfix and Tester original-failure retest then review/delivery. Preserve source/cause/runtime uncertainty and minority findings.
- Source resources support later music-software and playable-prototype demonstration; actual runs will be separately assigned to workers. Synthetic fixtures are mechanics evidence, never substitute claims of real defects or product acceptance.

Packaging/readability: canonical new resource paths and concise discriminating frontmatter; root LICENSE/PROVENANCE copied byte-for-byte into every skill; valid links within portable skill installations. Add references only where conditional detail warrants it. Format touched human-authored files with project conventions; no dense handwritten compression. No new dependency unless a concrete requirement justifies an amendment.

Verification from your worktree: prepare pinned dependencies with existing just install if needed (ordinary installation and supported per-command escalation for sockets/temp/Git are authorized; no global settings writes), then just check, bun run test, bun run release-check, relevant existing/new packet tests/typechecks, git diff --check. Retain exact command/cwd/exit and logs outside repo. No tests mirroring prose or implementation, no arbitrary global end-to-end mandate. Source/packaging passes do not establish model behavior, actual native capabilities or real product demonstrations. Report anything blocked with evidence, not a guessed pass.

Ordinary initial implementation/test iterations do not consume a correction budget. A failed correction cycle is a completed, handed-off attempt on a specified blocking outcome whose required verification or later independent review still fails; default limit two. Same unresolved outcome and correction regressions retain their count across renamed assignments/branches/workers. Escalate earlier for no viable justified step, missing authority/capability or design decision. Preserve evidence/partial work; never retry forbidden commands or relabel failures to evade limits.

Handoff: docs/reports/c1-c5/instructions.md with canonical leading YAML, existing candidate/tested revisions, files/source outcomes/verification, proposed root-doc/catalog/CI integration changes and honest behavioral/demo holds. Concise handoff must support scheduling; detailed evidence belongs in linked artifacts. Commit source first, run affected checks, write report against actual existing revisions, validate via bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts REPORT --repo THIS_WORKTREE, then commit report and this assignment unchanged. Return the creating SHAs externally; do not put a report's future creating SHA inside itself. Independent reviewer and runtime exercises follow separately. Do not self-accept, merge, release or clean up task resources.
