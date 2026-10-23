task: RUACH-ROADMAP-IMPLEMENTATION/R3-B
status: complete
outcome: Coordinator and Architect roles, coordination and example docs now carry the R3 duties by link to the accepted specimens, one R3 Unreleased bullet is added, and the P1/P2 clarity amendment is applied to the task-record specimen.
candidate_revision: b0effa2766be681e757380636128391e94a4f847
tested_revision: b0effa2766be681e757380636128391e94a4f847
baseline: 123ade32ad05b980cb3efa14abff08b2503193e5
artifacts:
  - agents/coordinator.md
  - agents/architect.md
  - docs/coordination.md
  - docs/examples/consumer-example.md
  - docs/examples/direct-compact-full.md
  - docs/examples/task-record.md
  - CHANGELOG.md
  - docs/assignments/r3/guidance.md
  - docs/reports/r3/guidance.md
verification:
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail (root suite only; excludes skill suites)"
  - "skills/ruach-handoff: bun test: exit 0, 28 pass 0 fail (supporting existing-contract suite for the combined candidate)"
  - "git diff 123ade3 --name-only lists only the seven owned guidance paths"
  - "manual: role and doc links resolve; headings unchanged except the added Coordinator section; guidance trace below"
  - "validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "Compatibility with the canonical feature and knowledge workflow bodies was obtained by the assigning Coordinator before this work (no contradiction requiring workflow edits). I did not read or search those bodies and cannot verify that observation."
  - "Gate held: R-IN's final CHANGELOG phase must wait for this commit's independent acceptance, then refresh the file and preserve the R3 bullet while adding R1/R2 entries."
blockers: []


# R3-B report

Checks ran sequentially under `flock` on `/tmp/ruach-implementation-20261011/verification.lock`, uid 1000, Bun 1.4.2, from the reused worktree on branch `ruach/r2-install-lock`. Installer, tests, handoff, hooks, routing, workflows, roadmap and R-IN-owned docs are untouched. Independent review of this exact revision is required and not run; no behavioral evaluation is claimed.

## Changes

- `agents/coordinator.md`: new "Durable record and resumption" section. It requires the record as sole authoritative state, decision (exact words) and phase/work/resource writes before dependent action, re-reading the record and raw sources after resume or compaction, reconciling with actual worker/Git/native state (age, silence or ownership change is not liveness), observed versus handled report identity, separate proposals/owner/operational choices, reuse of still-valid authorization and preservation of ambiguous replies. It separates harness permissions from owner authorization and keeps the ban on approving native dialogs. Existing boundaries (no technical validation, review, merge; sole cleanup duty) are unchanged.
- `agents/architect.md`: one bullet requiring bounded packages with disjoint source/tests/support/docs ownership, dependency and serial-step reasons, base/branch/resource needs and a copyable first assignment; scheduling and routes stay with the Coordinator, and the Architect still never coordinates or implements.
- `docs/coordination.md`: the single owner also resumes from the task record; the changelog hook is a breadcrumb, not the record.
- `docs/examples/consumer-example.md`: links the checklist and the filled specimen; the request-as-authorization wording now says recorded, still valid for action and target, survives interruption, and a changed target or revocation needs a new answer. Cleanup paragraph untouched.
- `docs/examples/direct-compact-full.md`: record scales with the level; direct/compact/full choice unchanged.
- `CHANGELOG.md`: one R3 bullet under Unreleased, above the changelog-hook entry.
- `docs/examples/task-record.md` (P1/P2 only): the port/profile/save cleanup row now names the Coordinator and the same condition as the session row (report handled, commits reachable, needed reproduction captured); phase events add the 09:05 unresolved reply and the 09:17 active observation.

## Guidance trace (manual)

Interrupted Coordinator: reads the record and raw sources, observes `csv-screen` alive, keeps AUTH-001 (unrevoked, target re-observed before use), keeps REPLY-001 unresolved, consumes reports once. Matches coordinator.md bullets one to six. Architect output feeds the assignment checklist. Direct/compact/full proportion and single-owner rule are preserved.

## Gaps

Not behaviorally evaluated. Workflow-body consistency rests on the Coordinator-supplied observation only; I suspect no contradiction and cite no locations.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
