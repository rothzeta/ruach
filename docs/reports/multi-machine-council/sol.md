task: multi-machine-council-sol-round-1
status: complete
outcome: Independent architecture proposal completed; implementation remains subject to owner decisions
artifacts:
  - docs/design/multi-machine-sol.md
  - docs/reports/multi-machine-council/sol.md
verification:
  - "just check: exit 0 after frozen skill dependency installation; resource/link checks and TypeScript typecheck passed"
  - "bun run release-check: exit 0; synchronized release metadata passed"
  - "git diff --cached --check: exit 0 for the two assigned artifacts"
  - "Canonical ruach-handoff validator with --repo: exit 0; structure and source_baseline resolved"
review: not-run
discoveries:
  - "Current launcher is local and preserves partial state; it has no machine selector, transport layer or durable idempotent launch record"
  - "Supplied local Herdr 0.9.0 protocol 22 rejects documented --machine; use explicitly selected SSH execution pending capability evidence"
  - "README route prose differs from executable development catalogs; proposal treats catalogs as policy and edits neither"
blockers: []
source_baseline: d75039aa7b82b262e2f28af08630258fb7f77180
role: architect
council_round: 1
member: Sol 6.1
implementation_authorized: false

# Independent first-round handoff

The [design](../../design/multi-machine-sol.md) recommends Git for committed source exchange, independent clones and local worktrees on each machine, and a small machine/transport dispatcher around the existing machine-local `ruach-herdr` launcher. Use explicitly selected SSH execution in the verified deployment; gate eventual Herdr machine forwarding on actual CLI/server capabilities. Keep native accounts/configuration, sockets, temporary material and application resources local to their owning machines.

For the current connectivity, outbound bundles and inbound direct SSH fetch avoid assuming remote-to-local access or copying publication credentials. An existing central remote becomes the preferred ongoing rendezvous only when access and feature-ref publication are authorized. Git is not the transfer mechanism for dirty state, ignored assets, caches, datasets, secrets or native sessions. The design compares central remotes, direct fetch, bundles, patches/rsync and shared filesystems, with separate payload manifests and environment-specific verification evidence.

Machine/session-qualified opaque handles, target-side capability/resource checks, per-launch request identity and conservative journal reconciliation address lost responses and reconnect. A timeout never grants permission to repeat startup or a task prompt. One Coordinator owns the task across machines; an assigned Integrator/Reviewer/Deliverer handles a pinned combined candidate and explicit merge/publication authority. Receipts connect launches, transfers, reports and acceptance without introducing a scheduler or service.

## Scope, evidence and boundaries

Inspected all role contracts, `skills/ruach-herdr` launch/process/worktree/routing/native preparation code and references, existing launch test contracts, canonical handoff skill/schema/validator, development routing/wrapper, README, roadmap, ownership ADR, authoring guidance, and assignment/task-record specimens. This isolated worktree was clean at inspection; the owner's unrelated dirty documentation in the original source was not included. Supplied machine setup is attributed separately from repository facts; no remote host was probed or mutated. No Coordinator workflow body or peer answer was loaded.

Only this report and `docs/design/multi-machine-sol.md` were authored. No roadmap, routing, implementation, application or peer artifact changes; no remote mutation, push or merge. Detailed assumptions, constraints, receipt fields, failure recovery, practical handoff sequence, implementation boundaries, phased plan and required future tests are in the design.

Potential implementation components are the launch skill's dispatcher/contracts/process/worktree boundaries, machine-aware result and recovery handling, thin wrapper forwarding, references/tests, and additive handoff receipt examples/validation. Consumer routing and resource policy retain their current ownership. The report is ready for the second council round; it does not represent peer review, acceptance or implementation authority.

## Verification and limits

The first `just check` exited 1 after its documentation checks passed because this isolated checkout lacked `yaml`/`ajv` skill dependencies. Ran `bun install --frozen-lockfile` in `skills/ruach-handoff` and `skills/ruach-herdr`; both exited 0 without tracked changes. Repeated `just check`, exit 0. `bun run release-check` exited 0. Final staged whitespace and canonical report checks are listed in the leading block; the canonical validator was invoked as:

```sh
bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/multi-machine-council/sol.md --repo /opt/dev/ruach/.worktrees/council-machines-sol
```

The source canonical skill and checkout skill instructions matched. Mechanical report validation checks structure and revision availability, not architecture correctness or application behavior. No root test suite, skill behavior suite, paid/native smoke test or application/runtime test was run for these documentation artifacts. The creating commit is returned in the terminal handoff; this report intentionally does not predict its own commit.

## Decisions required before implementation

- Confirm SSH endpoint/profile discovery and explicit remote-session authorization contract; recommend no automatic transport/machine fallback.
- Select an initial bounded application handoff and integration machine; recommend a ramec task these remote Debian hosts can verify.
- Choose source rendezvous and publication authority; recommend bundle/direct fetch now, authorized central feature refs later.
- Set retention, dirty-work exceptions and non-Git artifact rules; recommend committed scoped source and durable reports by default.
- Specify acceptance environments, especially desktop/audio/game capabilities and machine-specific test obligations.

These are implementation prerequisites, not blockers to this completed advice assignment. Actual profile export/helper/session contracts need confirmation before launch implementation. Await the Coordinator's peer summaries before revising the independent position.
