# Ruach roadmap

Status: **proposed**, 2026-10-04. This is not accepted direction until the maintainer accepts it. Once a phase's scope is settled, record any lasting decision it produces as an ADR in `docs/adr/`.

Precondition: 0.2.x bug stabilisation is complete and released through the [release procedure](../README.md#releases).

## Context

As of 0.2.0, Ruach distributes six roles and eight skills. Installation works three ways: through the Skills CLI, as a Claude plugin, and as a pinned snapshot installed by version. Workers launch into background Git worktrees through Herdr. Contract tests, static checks and fake-CLI suites cover installation, routing and launch preparation. They show that the contracts are consistent. As [CONTRIBUTING](../CONTRIBUTING.md) notes, they do not prove behaviour.

Verified gaps at this date:

- **Agent behaviour is mostly unproven.** The consumer's status record lists these as untested or unverified:
  - live model sessions and native discovery of roles and skills;
  - Scout execution;
  - live `ruach-handoff` behaviour;
  - native invocation of technical skills by Claude workers;
  - reliability across repeated or conflicting assignments.

  Librarian evaluation cases each ran once, on synthetic fixtures, on the Claude route only. No real mailbox triage has been done.
- **The only consumer has not adopted a release.** [tehom-brainlab](https://github.com/rothzeta/tehom-brainlab) is pinned to `be77030`, which predates v0.1.0. It still syncs by `--revision` and uses sibling-pane launches through its own wrapper. The release-by-version and background-worktree paths have no consumer use yet.
- **Portability is unproven.** Ruach was extracted from that consumer and has run nowhere else. The ownership boundary in [ADR-0001](adr/0001-source-and-consumer-ownership.md) has not been tested against a second project.
- **Harness support is narrow.** Only Claude and Codex launch. Pi, OpenCode, DSH, OMP and Agy fail before mutation by design ([adapter evidence](../skills/ruach-herdr/references/adapters.md)). A Gemini seat on a multi-model review panel was dropped because Agy cannot launch.
- **Workflow coverage is minimal.** Two Coordinator workflows exist, feature and knowledge. More specific implementation workflows are recorded as future work.

## Direction

Prove before expanding. Each phase produces evidence that decides whether the next phase is needed and what it should contain. New roles, workflows or adapters need a demonstrated consumer need or an evaluation failure behind them, not anticipated demand.

## Phase 1: Consumer adoption of the current release

Goal: make the release and installation contract real for the existing consumer.

Scope:

- update Brainlab's snapshot with `--version` to the stabilised 0.2.x release;
- retire `--revision` use in its sync command;
- move its launcher wrapper to the background-worktree default, keeping `--placement pane` only where explicitly needed;
- record any friction as Ruach issues, not consumer-side workarounds.

Acceptance:

- the consumer's `check` passes, both locally and against the recorded upstream with `--source`;
- one Coordinator-led feature task completes end to end through background worktrees, with all task resources released;
- any Ruach defects found are fixed upstream and released before the consumer pins them.

Out of scope: changing consumer policy, routing catalogs or knowledge schema beyond what the update requires.

## Phase 2: Behavioural evidence

Goal: replace "untested" with recorded results for the existing roles and skills.

Scope: evaluation packets under `evals/`, following the Librarian packet's give/withhold boundary, for:

1. Scout investigation: an evidence-based report with no implementation;
2. handoff conformance: workers produce `ruach-handoff` reports that pass the validator, with accurate revision and verification claims;
3. Coordinator cleanup: task sessions, worktrees and workspaces are released, and protected resources are preserved;
4. Librarian triage on a real but isolated mailbox copy, with the owner's consent;
5. repeated and conflicting assignments for at least one worker role.

Run each case several times on both supported routes (Claude and Codex). Use `ruach-harness-eval` for mechanical acceptance and scope checks. Use separate blind graders for rubric judgement.

Acceptance:

- each case has preserved subject outputs and grades per route and run;
- failures lead to narrow instruction fixes, each re-evaluated on the same case;
- a short results summary records pass rates and remaining known limits.

Out of scope: benchmarking models against each other, scheduling and long-running evaluation infrastructure.

## Phase 3: Second consumer

Goal: test the source/consumer boundary and find Brainlab-specific assumptions left in shared resources.

Scope: install a pinned snapshot into one other project with a different knowledge structure and routing policy. The maintainer chooses the project. Run at least one feature workflow and one knowledge workflow there.

Acceptance:

- the consumer runs with only its own policy, guidance and catalogs, and no edits to generated resources;
- shared resources that needed consumer-specific wording are generalised upstream, or the ADR boundary is revised by a new ADR;
- installation and onboarding steps a new consumer needed are reflected in the README.

## Phase 4: Expansion on demand

Only work items backed by evidence from Phases 1–3 qualify:

- **Workflows.** Add a specific workflow (for example bug-fix or review-only) when evaluations or consumer tasks show the feature workflow fits badly. Give it its own evaluation packet.
- **Harness adapters.** Enable an adapter only after it passes the existing capability gates: verified additive role injection, selective skill exposure, read-only native configuration and exact model identity. Prioritise by an actual need, such as restoring a third model to a review panel.
- **Distribution.** If Ruach is to serve users beyond the maintainer, add onboarding documentation and a supported-harness matrix (see open decisions).

## Deferred

These are not planned. Revisit one only when an accepted phase result requires it:

- monitoring, assignment sending or a long-running supervisor inside `ruach-herdr`, which excludes these by design;
- new roles beyond the current six;
- automatic route fallback, since routes change only by explicit authority.

## Open decisions

1. **Audience.** Is Ruach a public toolkit for other users, or the maintainer's shared base across their own projects? A public toolkit moves harness breadth and onboarding ahead of Phase 3. A personal base keeps the order above.
2. **Second consumer.** Which project serves as the Phase 3 consumer, and whether its owner authorises installation.
3. **Real-data evaluation.** Whether Phase 2 may use an isolated copy of a real consumer mailbox, and who grades it.
