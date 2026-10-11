task: multi-machine-council-sol-round-2
status: complete
outcome: Second-round design reconciled against actual peer artifacts and new setup evidence; bounded wrapper and durable recorder recommended
artifacts:
  - docs/design/multi-machine-sol.md
  - docs/reports/multi-machine-council/sol.md
verification:
  - "just check: exit 0 on revised artifacts; resource/link checks and TypeScript typecheck passed"
  - "bun run release-check: exit 0; synchronized release metadata passed"
  - "git diff --cached --check: exit 0 for the two assigned artifacts"
  - "Canonical ruach-handoff validator with --repo: exit 0; structure and source_baseline resolved"
  - "bun /tmp/ruach-sol-git-examples.ts: exit 0; disposable Git 2.47.3 named refs, fetches, bundles and push dry-run/lease examples passed"
review: not-run
discoveries:
  - "Current launcher is local and preserves partial state; it has no machine selector, transport layer or durable idempotent launch record"
  - "Owner verified Herdr 0.9.3 protocol 22 on both remotes and workspace forwarding with an explicitly selected temporary client; transport adoption remains undecided"
  - "Private control-to-remote incoming-ref transfer requires existing SSH access, not remote hosted push credentials; bundles are proven bootstrap/fallback"
  - "README route prose differs from executable development catalogs; proposal treats catalogs as policy and edits neither"
blockers: []
source_baseline: d75039aa7b82b262e2f28af08630258fb7f77180
prior_round_revision: e4f2dc207e4324c9719e0d179e3725f42882b639
role: architect
council_round: 2
member: Sol 6.1
implementation_authorized: false

## Second-round handoff: current position

The [design's second-round section](../../design/multi-machine-sol.md#round-2-evidence-peer-comparison-and-revised-recommendation) supersedes tentative first-round sequencing while preserving the independent reasoning below and at `prior_round_revision`. Read the actual Opus and Sonnet designs and handoff reports from their absolute worktree paths; their observed checkout commits and content hashes are recorded in the design. Peers were read only. No Coordinator workflow body was loaded.

All three agree on target-local preparation/launch, machine-scoped IDs, independent host resources/worktrees, Git source commits, separate assets/secrets, single task/integration authority and conservative recovery. Revised choices are:

- Prefer a sibling machine entrypoint within `ruach-herdr`, preserving its local execution core. Expose preflight/start/launch-recovery inspection; consumer wrappers forward selection. Defer mandatory machine catalogs and generic monitoring.
- Narrow my full journal proposal to an essential exclusive request claim, durable dispatch intent and atomic result, with a bounded recorder that survives control-link loss. Matching repeats inspect/return state; uncertain requests never resubmit. Full phase journaling and automatic reuse are later work. This is stronger than Sonnet's observation-only initial proposal and combines Opus's result/detachment proposal with request ownership.
- Accept the peers' direct SSH private incoming refs as the steady-state recommendation through control, with bundles for proven bootstrap/fallback. No remote-to-local authentication or hosted push credentials are assumed. Do not bypass push hooks. Central feature storage remains possible through an authorized control-side relay.
- Retain exact per-receipt export/receiving refs and distinguish candidate/tested commits from the later report commit. Fetch the named export ref over control-to-remote SSH, verify its full returned SHA, then validate the report and assignment at that commit. Worker branch progress does not invalidate a retained earlier receipt. Avoid forced/pruned inventory refs as receipt stores.
- Preserve explicitly requested dirty exceptions and distinguish WIP/private ref storage from delivery to deployment-polled/protected refs. Declare one integration authority per task rather than always requiring the control machine to integrate.

The latest owner-supplied evidence is incorporated: both remotes Herdr 0.9.3 protocol 22; successful temporary-client workspace forwarding without restarts; ten independent repositories bundled from exact commits, clean ramec fast-forward and separate Eden children; verified Bun 1.4.2/Node 22.23.3/.NET SDKs 8.0.425, 10.0.110, 10.0.401 with existing Bun 1.4.3 preserved; target dev-env PATH; no push authentication/data/secrets copied; background `(oholiab, <oholiab-pane-id>)` and `(tubal, <tubal-pane-id>)`. Build/dependency/test checks remain underway. I did not independently probe these machines. The temporary client is evidence, not an accepted transport or durable installation.

Herdr API forwarding can carry separately verified terminal operations. It cannot perform target filesystem reads, private native settings materialization or effective-config inspection. Machine-local preparation through SSH remains the first launch recommendation; a capability-checked compatible client can be evaluated now for communication rather than deferred solely because the default client lacks `--machine`.

The smallest deliverable is the bounded machine wrapper plus request/result recorder and recovery inspection, with a runbook and one application round-trip demonstration. Essential checks cover target-only configuration, exact policy/resources/base, duplicate/conflicting requests, lost responses/recorder death, native blocked state, stale handles, retained commit/ref equality and safe resource preservation. No scheduler, global config rewrite, credential copy, remote mirror update or launch resumption engine is needed.

Remaining disagreement is explicit: include durable request/result protection in the first reliable start (earlier than Sonnet), avoid a mandatory catalog and blanket `env -i` (narrower than Opus), allow declared integration location/dirty exceptions and authorized feature storage (less restrictive than peers). The design limits consequential owner choices to five: endpoint policy, ref destinations/side effects, acceptance location, preservation policy and implementation scope/priority. These are future policy decisions, not requests to reapprove council or setup work.

## Second-round verification

Ran the disposable TypeScript/Bun Git example script outside the repository. It passed retained export creation and exclusive conflict checks, named exact-SHA fetch, ancestry, moving/rewritten branch versus anchored receipt, incremental prerequisite rejection, full bundle import and expected-absent push lease syntax/rejection using **dry-run only**. An initial fixture assumed an unforced custom-namespace divergent fetch would succeed; Git 2.47.3 rejected it. The corrected fixture verifies that rejection and compares a forced inventory update with the unchanged receipt ref. No operational push, SSH, merge or live launch occurred. Scratch repositories were removed.

Repeated the applicable repository documentation/type/release checks, report validation and both staged/unstaged whitespace checks. The leading verification fields describe those results. No application/runtime tests, root/skill behavior suites or paid/native smoke tests were run. The initial first-round verification history below remains historical. Independent advice and mechanically valid reports do not establish acceptance or implementation authority. Return the new creating commit in the terminal; do not cite it inside its own report.

---

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
