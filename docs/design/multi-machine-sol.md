# Application development across Herdr machines: Sol independent proposal

Round: 2, following independent round 1. Date: 2026-10-11. Author: Sol 6.1, Architect.
Status: advice for owner decision; no implementation or remote-operation authority.
Inspected source baseline: `d75039aa7b82b262e2f28af08630258fb7f77180`.
The independent first-round reasoning below is preserved from commit `e4f2dc207e4324c9719e0d179e3725f42882b639`. Peer answers were not inspected before that commit. The current recommendation and explicit changes are in the second-round section at the end; it supersedes first-round sequencing where identified. The roadmap and other workers' artifacts were not edited.

## Recommendation

Keep Git as the default handoff for committed application source, with one independent clone and local worktrees per machine. Add a small explicit machine/transport boundary to `ruach-herdr` that runs the existing launcher logic on the selected host. Keep native configuration, accounts, temporary material and Git worktree administration on that host. Herdr remains the terminal control plane; Git remains the source exchange plane; a consumer task record links them through receipts. No scheduler, shared writable checkout, credential replication or new persistent service is necessary.

For this setup, first use an explicitly selected SSH execution transport to the saved Herdr target, with absolute remote executable paths. Do not rely on the documented `herdr --machine` prefix until both CLI and server capabilities have been established. For source transfer today, use an outbound Git bundle when the remote cannot fetch the source, and fetch the completed remote branch back over SSH. An existing central Git remote is the preferred longer-term rendezvous when its access and feature-ref publication policy are authorized. Neither preference grants permission to push.

The central guarantee is that the receiver gets the specified commit and sufficient context to continue, not that an agent session migrates. A change of machine normally starts a fresh worker with the preserved assignment, report and commit. Reconnecting to a surviving remote worker is a separate operation.

## Verified facts and supplied setup

Repository facts below are verified by inspection at the baseline, rather than inferred from roadmap intentions:

| Fact | Evidence and consequence |
| --- | --- |
| Resources and consumer policy have different owners. | [Ownership ADR](../adr/0001-source-and-consumer-ownership.md): roles, skills and validators belong to Ruach; product decisions, routing and durable task evidence belong to consumers. Remote copies must be pinned installations or source checkouts, never a second editable resource tree inside this repo. |
| Workers have bounded assignments; one Coordinator owns a task. | [Role contracts](../../agents/coordinator.md), [coordination ownership](../coordination.md), [assignment specimen](../examples/assignment-specimen.md). Integration/delivery can be assigned to an Implementer; the Coordinator does not implement, test or merge. |
| The current launcher has no machine selector or transport abstraction. | [worker.ts](../../skills/ruach-herdr/scripts/worker.ts), [process.ts](../../skills/ruach-herdr/scripts/process.ts): filesystem reads, subprocesses, native configuration and Herdr probes execute on the invocation host. It requires live authorized Herdr context for online preparation. |
| Worktree planning pins a commit and rejects existing paths/branches. | [spaces.ts](../../skills/ruach-herdr/scripts/spaces.ts): default branch `ruach/<name>` and sibling worktree directory, committed HEAD base, Git replacement objects disabled in identity probes, canonical checkout/cwd verification. Dirty source work is not copied. |
| Startup and task delivery are separate. | [Launch skill](../../skills/ruach-herdr/SKILL.md): exactly one native startup submission, no task prompt, monitoring or automatic retry. Exit 4 preserves partial worktree/launch state. A verified native dialog returns exit 0 with `ready: false`. |
| Native preparation must use the worker's actual checkout. | [Adapters](../../skills/ruach-herdr/references/adapters.md): Codex reads effective config via a matching local daemon or short-lived stdio reader; Claude uses canonical role and private local settings/skill links. Codex inspection may initialize runtime state. Account/model access is not proved by preparation. |
| Routing never switches automatically after failure. | [Routing reference](../../skills/ruach-herdr/references/routing.md), [development catalogs](../../config/agent-routing/roles.yaml), [wrapper](../../scripts/agent-routing.ts). Machine eligibility must not become model fallback policy. The README's prose about preferred high-effort Coordinator/Architect routes differs from inspected catalogs; catalogs are the executable policy, and this design changes neither. |
| Handoffs are extensible but do not certify their evidence. | [Skill](../../skills/ruach-handoff/SKILL.md), [schema](../../skills/ruach-handoff/handoff.schema.json): extra metadata is permitted; commit-reference fields are checked with Git; artifact existence, ancestry, technical verification and acceptance are not checked. |
| The roadmap already separates launch bookkeeping from application resources. | [Roadmap](../roadmap.md): proposes resource ledgers/idempotency, consumer-owned ports/profiles/saves/databases, no allocator/scheduler or new always-running service. These are proposals, not evidence of implemented recovery. |

Owner-supplied verified setup, not independently probed in this assignment: `/opt/dev` contains ruach, ramec, enoch, pralice, dirtest, eden with independent jachin and boaz, ramec-brainlab and tehom-brainlab. Enabled saved SSH machines oholiab and tubal run Debian 13 x86_64, provide writable `/opt/dev` for metatron, an existing ramec checkout, user-directory Bun/.NET, Git/Just/Python/Docker, installed Codex/Claude and running Herdr servers. Noninteractive SSH PATH omits user bins. Local Herdr 0.9.0 protocol 22 rejects `--machine` although the installed Herdr skill documents it. Remote commands can run through saved SSH targets using remote user-bin Herdr. The Coordinator is preparing repositories/toolchains without stopping/upgrading servers or copying credentials.

Assumptions to validate before implementation: saved profile discovery supplies enough nonsecret connection information for the authorized SSH executor; local-to-remote SSH remains available; selected repositories can receive the required Git objects; project guidance can define resource recipes. Remote-to-local SSH, matching harness versions, model entitlement, GUI/audio/GPU access, Docker socket permissions and complete project build readiness are **not** assumed.

## Smallest launch boundary

Proposed interface: an explicit `--machine <saved-profile-id-or-unique-label>` on `ruach-herdr` and thin wrapper forwarding. Omission preserves local behavior. Resolve labels once to a stable saved profile ID, record the session selection, and retain that endpoint for the whole operation. Reject disabled/ambiguous profiles and arbitrary hostname substitution. Consumer configuration chooses target repository, resources, catalogs and executable paths; model/effort catalogs remain unchanged. Start with an explicit invocation descriptor rather than a new mandatory machine catalog.

Separate a bounded dispatcher from the existing machine-local execution core. The dispatcher sends a versioned request to that core on the target host; the core performs filesystem checks, native preparation and launch. It is the same pinned skill, not a different SSH-specific harness adapter. Do not invoke local Codex/Claude configuration readers and then send their argv to a remote pane. Do not send local HOME, CODEX_HOME, CLAUDE_CONFIG_DIR, PATH, sockets or native effective configuration across the boundary.

Two transport modes can share the endpoint contract, but only implement the one needed first:

1. **SSH execution, selected explicitly for current deployment.** Execute a fixed, reviewed remote helper entrypoint with absolute Bun/skill paths. Feed a bounded structured request through stdin or a private request file, preserve argument bytes, and keep stdout to one structured result. SSH commands are shell-mediated: an argv array on the caller alone does not guarantee quoting on the target. Reject or safely encode profile/path inputs; never interpolate JSON, native argv or role text into shell command text. No agent forwarding, credentials or session database copy is needed.
2. **Herdr machine API forwarding, later and capability gated.** It can carry terminal operations if supported, but remote filesystem/native preparation still needs remote execution. Adopt it only if it simplifies actual use. Missing `--machine` or incompatible API must give a targeted unavailable-capability result before mutation. No silent transport, host or route fallback after failure.

The launch skill still excludes assignments and monitoring. It returns an endpoint descriptor and machine-aware inspection/recovery commands. The Coordinator uses its declared communication mechanism for prompt/read/wait on that endpoint. A shared endpoint representation is sufficient; a generic remote-control service is unnecessary.

Do not forward inherited local `HERDR_*` IDs or use remote `--current`. The remote executor must establish an explicitly authorized, reachable remote session context using a verified mechanism. Setting `HERDR_ENV=1` alone is not authorization. If the current gate cannot support a headless remote invocation, add a narrowly scoped endpoint authorization check; do not bypass it or claim an SSH login is itself a Herdr pane. Initially create standalone remote workspaces. Linked worktrees are optional only when a parent workspace is explicitly discovered on that remote and belongs to its local clone. Sibling-pane placement requires an explicit remote caller pane and verified layout; it should remain unsupported remotely in phase 1.

## Identity, preflight and ownership

Treat workspace, tab, pane and agent IDs as opaque values. A usable handle is `(machine profile ID, session identity, opaque ID)`. Human labels are display metadata. Do not derive IDs, strip their qualifiers, or infer repository identity from a matching path. Two servers can both return `w1:p1`; both machines can run `reviewer`. Use a reported server-instance discriminator when available; otherwise retain session identity plus observed server/version data and revalidate every reconnect. Do not invent a Herdr server UUID contract. After a server restart or profile retargeting, stale handles require discovery and identity confirmation.

Target-side preflight should establish:

- Remote host/session identity, reachable running server, CLI/server version and protocol evidence, and required command flags/API response shapes. Check the selected transport as well as `agent start`, workspace creation, environment forwarding and optional linked-worktree support. Version strings alone do not establish capabilities.
- Pinned launcher/request/result protocol compatibility; selected role content hash, resource snapshot release/manifest integrity or source revision plus tracked/dirty content status, and catalog hashes. The remote request must use the intended route from those exact catalogs, or an explicit policy-authorized direct selection. Reject disagreement rather than silently choosing the remote checkout's different preference.
- Correct repository identity, object format, full resolved base commit and cwd, fresh branch/path, writable checkout and worktree Git administration paths, dependency availability, and private temp storage. Resolve symbolic source refs on the sender and verify the resulting commit on the receiver. Existing unrelated dirty files are neither source input nor cleanup targets.
- Target PATH built from target user bins and system tools; absolute selected executable identities; target-local HOME/config roots and sockets; native capability/permissions checks in the actual new worktree before startup. Frozen dependencies and source/snapshot installation are explicit setup prerequisites, not hidden launch side effects.
- Assignment-required application capabilities and resources: .NET SDK/workloads, Bun packages, Docker/socket access, disk, relevant devices, display/browser/audio/GPU where needed. Debian x86_64 and installed .NET do not prove a desktop/music/game verification environment.

The consumer owns repository mappings, accounts, toolchain provisioning, network ports, databases, caches, datasets and devices. A launch records the resources it owns and the assignment names application resources and retention rules. A port reservation is machine scoped; a shared external database or CI environment may require serialization across machines. No general allocator belongs in Ruach. Global harness settings, trust choices and credential installation stay explicit owner/native actions. Temporary overlays and symlinks must reference target-local pinned resources and preserve unrelated native customizations. Preflight claims distinguish fully write-free offline selection from online native inspection's documented runtime writes.

## Partial failure, idempotency and reconnect

Do not promise exactly-once distributed execution. Provide an idempotent request identity and conservative reconciliation. Proposed addition: a consumer task launch ID and request digest, with a small private durable launch record on the target and its reference in the consumer ledger. This is a per-launch file, not a daemon/database. Acquire a target-local exclusive lock before mutation; duplicate requests with a different digest fail. A matching completed request returns its existing receipt after live identity checks, without submitting another start. Concurrent matching requests return the current phase or wait within a bound.

Persist intent before each mutating phase and record observed results atomically afterward: worktree, native material, workspace/pane, startup. Keep per-resource state distinct from startup submission state. Existing code sometimes marks `submission_state: unknown` at topology creation; a transport extension must not turn that into proof that an agent was submitted. Lost responses or crash gaps remain unknown until target-side inventory resolves them. An existing unrecorded directory/name is never automatically adopted or deleted merely because it resembles a request.

| Failure point | Recovery rule |
| --- | --- |
| Unsupported CLI/protocol/helper, absent prerequisite or wrong base/resource hashes | Fail before launch resources; fix setup or select an explicitly approved transport, then repeat preflight. Never upgrade/restart a server automatically. |
| Transfer interrupted | Keep source refs; stage transfer privately, verify before import/ref publication, retry transport safely. No launch until base and context are complete. |
| Worktree created, native preparation fails | Retain branch/path and record phase. Inspect actual identity and dirty state; explicit recovery may reuse a verified owned checkout. A fresh ordinary `start` continues to reject existing destinations. |
| Workspace/start request may have arrived but SSH disconnects | Reconnect to the same machine/session, inspect receipt and live worktree/workspace/agent state. Do not retry startup or assignment while receipt/live evidence is ambiguous. The remote agent may continue working. |
| Native trust/onboarding/approval blocks | Retain original agent; report `awaiting-input`, `ready: false`. Complete the native decision under existing user authority; do not replace it or send work first. |
| Server restarted, profile changed, receipt conflicts with live identity | Mark stale/unknown; preserve work and rediscover. Only replace after confirming prior execution has ended and its resources are free. |
| Cleanup cannot prove safe reachability or dirty evidence remains | Retain resource and report residue. Do not force-remove or prune another task's branch. |

A reconnect revalidates machine/session, worktree branch/cwd, role/route and live agent name/kind/pane. Herdr idle/done is not proof that the assigned report exists or its revision is accepted. Assignment submission needs its own task ID/content hash and worker acknowledgement in durable evidence; lost prompt responses are reconciled before resend. Launcher idempotency does not make `agent prompt` idempotent.

## Git and the alternatives

Git is the best default for source commits because its immutable object identities and graph let different machines agree on inputs, preserve parallel histories, review a precise candidate and integrate without overwriting a checkout. A branch is a mutable pointer, so a handoff always names a full commit and retained ref. Git does not transport live processes, native sessions, ignored files or all application data.

| Approach | Strength | Costs and recommended role |
| --- | --- | --- |
| Existing central Git remote | Common rendezvous, durable refs, independent fetch/review/CI; avoids requiring machines to reach each other. | Needs remote access and explicit publication authority. Preferred ongoing option when available; feature publication is distinct from protected-branch delivery. No automatic push, force-push or merge. |
| Direct SSH Git fetch | Preserves commits and ancestry without a hosted service or worker push credentials. Receiver pulls a retained ref from the source clone. | Requires receiver-to-source reachability and remote Git executable/PATH; source host/ref must remain available. Good completed-work return path here: local receiver can fetch oholiab/tubal. Remote-to-local access is not assumed. Use explicit refspec into a unique receiving ref; do not configure automatic broad synchronization. |
| Git bundle | Preserves commits/refs in a file; can relay through the Coordinator when machines cannot reach each other. | Extra staging/retention and incremental prerequisite tracking. Verify bundle prerequisites and expected commit after import. A full bundle is larger but simpler for bootstrap; incremental bundle requires a recorded receiver baseline. Good initial outbound/offline fallback here. |
| Git patches / binary diffs | Compact proposed change; useful for a deliberately uncommitted, bounded review handoff. | Does not preserve original commit identity/merge history; staged and unstaged changes require explicit treatment, untracked files need a separate inventory, application can conflict. Apply only to the named base in an isolated checkout; commit and reverify the result. Not the default feature exchange. |
| rsync / file archive | Appropriate for explicitly selected non-Git payloads or a documented dirty-work rescue. | Needs allowlist, deletions policy, content hashes and destination staging; does not establish source ancestry, clean state or acceptance. Never mirror an entire HOME, active checkout or `.git` directory. |
| Shared filesystem checkout | Avoids transfer; shared read-only immutable datasets can be useful. | Shared writable working trees, Git administration, index, builds and application state couple failures and concurrency. Network locking/availability add risk. Reject as default development topology; separate clones/worktrees remain local. |

Each independent repository needs a separate receipt and baseline. Treat eden's jachin and boaz as independent until consumer policy says otherwise; directory nesting is not a dependency/monorepo contract. Do not fabricate a single multi-repository Git transaction. The consumer can record a coherent tuple of revisions when an application needs several repositories.

Keep one clone/Git common directory per repository **per machine**, with locally registered worktrees beneath a consumer-selected root. Transfer Git objects, never copy live worktree `.git` pointers or common-dir metadata. Allocate globally distinct feature refs such as `ruach/<task>/<machine>/<worker>/<attempt>` using validated task/machine aliases; keep the full machine profile ID in the receipt, not necessarily in the branch spelling. Worker agent names retain Herdr's 32-character constraint and can stay short. Receiving refs such as `refs/ruach/incoming/<transfer-id>` should never overwrite an active local branch. For central publication, use an explicitly agreed server-supported feature namespace, for example `refs/heads/ruach/...`.

## What crosses a handoff

Default source input/output is committed tracked content. Before freezing a handoff, record staged, unstaged and untracked state separately; check for hidden index state where required by project integrity rules. The launcher currently does not require the source checkout to be clean, so cleanliness is a handoff acceptance policy, not an existing launcher guarantee. Unrelated dirty documentation in the original source remains outside this assignment and outside transfers.

Prefer a scoped WIP commit on the assigned branch for useful unfinished source work when authorized. If the task explicitly requests an uncommitted result, preserve a base-relative tracked binary diff plus staged/unstaged status and allowlisted untracked payload manifest. Mark the result dirty and identify omissions; do not claim the candidate SHA alone represents it. Never automatically stage all files or commit someone else's work.

Ignored assets, large datasets and model weights use a consumer-approved artifact store, existing Git LFS policy, or explicit hashed archive. Git refs/bundles alone do not contain LFS payloads. Submodule repositories also require their referenced objects. Rebuild caches and installed dependencies from lockfiles/toolchain pins; do not copy `node_modules`, build output or runtime caches by default. Secrets remain machine-local or come from the consumer's existing secret mechanism. Gitignore is not a secret detector, and already tracked secrets would still travel in Git history. No credentials or account stores belong in roles, assignments, receipts or transfer archives.

Machine-specific test evidence travels as evidence, not as a portability guarantee. Record tested revision, machine/session or stable machine alias, OS/architecture, relevant toolchain versions, command/cwd, exit status, environment/resource identifiers without secret values, dataset hashes, logs/artifact hashes and limitations. Distinguish source failures from absent environment capabilities. A headless Debian test does not establish desktop/audio behavior; run the consumer's required target-platform checks on an appropriate machine. Combining/rebasing/cherry-picking changes creates a new candidate that needs the relevant verification and review.

## Practical handoff sequence and receipts

1. The owning Coordinator records task ownership, allowed machine/transport, source repository, resolved base SHA, selected route/permissions, scope, runtime resources, output/report paths and transfer/merge authority. Freeze the self-contained assignment and required context. Relative links must resolve at the destination; remote workers must not depend on the originating pane transcript or local-only absolute paths.
2. An authorized setup/transfer worker makes the exact base and pinned role/skill/catalog resources available in the remote clone, without touching unrelated dirty work. With only local-to-remote connectivity, create/copy/verify/import a Git bundle rather than assuming the remote can fetch local. Confirm repository identity and the full expected commit; register a retained input ref. Transfer protocol success alone is insufficient.
3. `ruach-herdr` performs target-side preflight and one launch under a unique launch ID. Return a machine-qualified launch receipt. Record it in the consumer task record before sending the assignment. Send work only to the matching ready agent, through the separate authorized communication mechanism.
4. The worker changes only assigned paths, verifies within the machine's capabilities, and writes the canonical handoff with existing source/test/review revisions. Validate with the target repository. Commit the unchanged assignment and report when required. A report records the already-existing candidate/tested revision; its creating evidence commit is returned separately in the terminal receipt, never predicted inside itself.
5. Freeze and retain the output ref; record its exact tip and candidate/evidence relationship. Receiver fetches it into a new incoming ref over direct SSH, or imports a verified bundle/authorized central ref. Resolve the expected full commits without replacement objects, confirm report/assignment hashes and expected base relationship, inspect scope, then validate the report against the receiving repository. Fetching source does not mean accepting it.
6. An assigned Integrator prepares a combined candidate on the designated integration machine, with conflicts restricted to its assignment. Run required checks on that new revision; Reviewer evaluates that exact candidate. Deliver only with authorized target and confirmed `destination_before`; if it moved or the candidate changes, prepare and review again as required. Cross-machine workers do not race to merge main.
7. The Coordinator records acceptance/delivery and receiver acknowledgement. Keep sender resources until useful work and evidence are durably reachable at the receiver and no fix/review step needs the session. Release only owned resources; use machine-local Herdr removal for registered worktrees, Git removal otherwise, from a retained checkout. Keep retained branches under the consumer's policy and report residue.

Proposed receipt convention, additive to the current handoff rather than a wholesale schema rewrite:

| Receipt | Minimum fields |
| --- | --- |
| Launch | Receipt/request protocol version, task/launch ID and request hash, coordination owner, resolved machine profile ID/display label, transport, session identity and available server-instance evidence, CLI/server/protocol versions and checked capabilities, repository ID/path/object format, base SHA, worktree path/cwd/branch/mode, resources/catalog/role identities, route/kind/model/effort/permissions, opaque workspace/pane/agent handles, phase and per-resource/submission/readiness states, owned temp/receipt paths, next recovery action. |
| Transfer | Transfer ID, task/assignment hash, sender/receiver machine and repository identity, mode and source/receiving refs, expected base and tip commits, candidate/tested/reviewed commits when they exist, evidence/report commit and relative paths/hashes, graph relation expected by assignment, dirty/untracked/ignored omissions, non-Git payload manifests, timestamps, sent/imported/verified/acknowledged state, retained locations and residue. |
| Verification/delivery | Exact command/cwd/result, tested commit and environment/artifact evidence, review report and reviewed commit, integration inputs, destination and observed `destination_before`, delivered commit, publication remote/ref state only if authorized, cleanup/reachability acknowledgement and unresolved limitations. |

Keep Git commit references in top-level fields such as `source_baseline`, `candidate_revision`, `tested_revision`, `reviewed_revision`, `evidence_revision`, `destination_before` and `delivered_revision` when using the handoff validator. Its revision checks do not recursively validate arbitrary receipt metadata or graph relationships; add targeted receipt validation/tests when implemented. Leave unavailable roles/values absent or explicitly unknown, never prefill review/verification success. Receipt hashes establish identity, not trust or approval.

## Concurrency and integration authority

One task has one Coordinator regardless of machine count. Workers get disjoint ownership and dependencies, not shared main-branch write authority. Every attempt owns one branch/worktree; concurrent duplicate launch IDs are serialized by the target launch lock. A machine-qualified name is still checked against live names on its server. Cross-task ports, datasets, devices and external services follow consumer leases/recipes; serialization is justified where these cannot be isolated.

An integration machine is explicit per task, not implicitly whichever worker finishes first. Incoming source refs can be fetched concurrently; updating an integration/delivery target needs one assigned writer and expected-old-commit checks. Publication may use compare-and-swap/lease semantics under consumer Git hosting policy, but never blind force-push. Returning a branch, reporting complete, passing mechanical validation and receiving Git objects grant no merge or push authority.

## Bounded implementation phases and required evidence

| Phase | Scope and exit evidence |
| --- | --- |
| 0: operational specimen | Document one authorized remote launch and round-trip source/report handoff using SSH, existing launcher and pinned resources. Coordinator/setup workers own provisioning. Establish actual profile discovery, session context and remote executable paths. No production server upgrades or credentials copied. |
| 1: launch endpoint | Add explicit selector and SSH dispatcher/request/result contract within `ruach-herdr`; thin consumer wrapper forwarding, target-local preflight, machine-qualified receipts and reconnect inspection. Remote standalone worktree launch only. Preserve local defaults, route restrictions and partial-state retention. |
| 2: recoverable requests and source exchange | Add per-launch request lock/journal and explicit reconciliation/reuse, transfer receipt convention and bundle/direct-fetch examples. Validate sender/receiver identity, revisions and omission manifests. No automatic transfer, prompt, merge or cleanup inside the launcher. |
| 3: demonstrated needs | Adopt compatible Herdr machine forwarding/linked remote worktrees only when it reduces friction; central remote publication only under selected policy. Add consumer platform/resource verification recipes. Expand after real application handoffs expose a gap, not to build a generic farm. |

Implementation will affect `worker.ts`, `process.ts`, `contracts.ts`, `spaces.ts`, native preparation call boundaries, launcher references/tests, optional wrapper flags and handoff examples/receipt validation. It should not redesign model catalogs, role separation, consumer resources or workflows. Executable changes/tests stay TypeScript/Bun. Do not implement another snapshot installer or copy vendor prompts.

Required future tests: local behavior regressions; two fake endpoints returning identical IDs/names; selector ambiguity/disabled/retargeted profiles; shell-sensitive and Unicode paths/arguments; noninteractive missing user-bin PATH; target-local config and sockets versus local sentinels; role/catalog/resource drift; helper schema mismatch, missing `--machine`, incompatible server protocol and optional linked capability; missing native flag/account distinction; Git replacement/environment defenses, wrong repo/base/object format and unrelated dirt preservation; failed creation and response loss before/after every mutation; two concurrent identical/different requests; crash/journal gap and lost assignment response; blocked trust dialog without replacement; restart/stale handles; bundle prerequisite failures, wrong tip, moved source refs, partial payload, LFS/submodule omissions; imported report missing a cited revision; integration target movement; safe cleanup retention and receiver acknowledgement.

Use fake SSH/Herdr/native CLIs plus real isolated Git repositories for contract tests, including invocation from a foreign cwd/copied skill. Target-side frozen dependency installs and socket access remain explicit prerequisites. After implementation run `just check`, `bun run test`, affected `ruach-herdr`/`ruach-handoff` suites and documentation/release checks. Separately run authorized named-session smoke tests on an appropriate remote proving sandboxed Git add/commit, real native role/config preservation, reconnect after control-link loss, and a bounded application round trip. Paid/native and runtime application evidence must be identified separately from fixtures. This architecture assignment runs documentation checks only; it provides no new application/runtime test evidence.

## Owner decisions and readiness

No implementation is authorized by this report. The following decisions should precede phase 1:

1. Approve the explicit SSH transport boundary for the current unsupported-forwarding installation, and establish how saved profile/session identity is exposed without secrets. Recommended: preserve profile authority and use a verified remote helper, with no machine/transport fallback.
2. Select initial application/repository and integration machine. Recommended: one bounded ramec handoff before extending to other independent repositories; choose a verification task these Debian machines can actually perform.
3. Select source rendezvous and publication policy. Recommended today: outbound bundle plus inbound direct SSH fetch; longer term existing central remote with a dedicated authorized feature namespace. Protected target delivery remains separate.
4. Set retention, dirty-work exception and external artifact rules. Recommended: committed scoped source plus durable reports by default; preserve explicit dirty outcomes with manifests; rebuild caches and keep secrets local.
5. Decide which environment checks are required for acceptance, especially desktop/audio/game targets. Installed toolchains alone are insufficient evidence.

The design is ready for a bounded implementation assignment after those endpoint and policy decisions. Actual saved-profile export syntax, remote session authorization and compatible helper/Herdr contracts need phase-0 confirmation. These are specific prerequisites, not reasons to build a scheduler or to stop existing servers. A second council round can revise this independent position after the Coordinator supplies peer summaries.

## Round 2: evidence, peer comparison and revised recommendation

This section is the current recommendation. The preceding first-round body is retained to make changes and their reasons reviewable. Advice remains separate from implementation authority.

### New verified preparation evidence supplied by the owner

Both remotes run Herdr 0.9.3 protocol 22 with compatible running servers. A copy of that installed client in a local `/tmp` path successfully forwarded `workspace list` and `workspace create` through `--machine`, while the default local client remains 0.9.0. No server restart was needed. Ten independent repositories were seeded through bundles from exact committed source; Eden children remain separate, and clean existing ramec was fast-forwarded. Bun 1.4.2, Node 22.23.3 and .NET SDKs 8.0.425, 10.0.110 and 10.0.401 were verified on both machines. Existing Bun 1.4.3 was preserved. A user-local dev-env sets PATH. Git push authentication, data and secrets were not copied. Dependency/build/test checks remain underway. Background Ruach development handles are `(oholiab, <oholiab-pane-id>)` and `(tubal, <tubal-pane-id>)`; these are observed resources, not launch ownership or cleanup authorization for this Architect.

These facts were supplied, not independently probed here. They establish a viable forwarding client and successful bundle bootstrap, not complete native launch or application readiness. The temporary client's use is evidence, not an accepted Ruach transport decision or durable dependency. Record the actual selected executable and version; do not assume the default client changed. Coexisting Bun versions require explicit target executable selection. Existing workspaces make a remote parent possible, but do not prove linked-worktree creation or native preparation there.

### Actual peer inputs and common position

Read both designs and their structured handoff reports using their absolute paths under `/opt/dev/ruach/.worktrees/council-machines-opus` and `/opt/dev/ruach/.worktrees/council-machines-sonnet`. Opus inputs were observed at checkout commit `c79d6650feb0bd0bc4617e29dac8ffe44c544d4e`; Sonnet at `511c329c111c618e087dce72a0fc8af02ebf08d5`. The consumed files are `docs/design/multi-machine-{opus,sonnet}.md` and `docs/reports/multi-machine-council/{opus,sonnet}.md`. Their observed SHA-256 values, in design/report order, are:

- Opus: `51d55cb495a895ad67cb28b10e19fc423d93c26ed5f200b413e4510970c7dedc`, `4dd7e45714b349cef9e8ad41f59abf2054a4372a8c189c27ff2967a282bde87b`.
- Sonnet: `3a85a1584f87148b2eb4a6fdf7d4ca995f8abc408923e771b8cb27ee9aae0f41`, `83fdf649411937c0df1e818a3b13cc9a800eb53f7c89f69647d0aa7fa3d62035`.

These identify the consumed artifacts, not later peer revisions. Opus's design incorporates the preparation update, while its report still includes older unknown-version language; Sonnet's consumed artifacts predate that update. Neither stale passage overrides the owner's newer facts. Peer report validation claims are attributed to their authors; this Architect did not rerun their technical validation.

All three agree on target-side launcher execution, machine-scoped opaque IDs, host-owned native config/resources/worktrees, Git commits for source, separate non-Git payloads/secrets, one task Coordinator and integration authority, and inspect-before-retry recovery. This agreement supports a small machine wrapper rather than remoteizing every filesystem/subprocess operation.

| Difference | Sol second-round judgment |
| --- | --- |
| Sonnet's sibling `scripts/machine.ts` versus Opus's `worker.ts --machine` and my dispatcher | Prefer a sibling machine entrypoint **inside the same skill**, with optional thin `--machine` forwarding from consumer wrappers. Keep `worker.ts` machine-local. Do not refactor `run()`, adapters or filesystem helpers for SSH. Initially expose preflight, start and launch-recovery inspection; machine listing can reuse Herdr. A general observe/monitor command remains outside launch scope. |
| Opus's `env -i` versus Sonnet's declared PATH and my target-local environment preservation | Use a target-derived allowlist, preserving that target's declared HOME, native config roots and required XDG/session values. No local environment forwarding, agent forwarding or global changes. Blind `env -i` can discard custom remote config/socket settings; a plain remote shell can import unrelated settings. Pin the known target dev-env/bootstrap path or equivalent normalized values and verify actual executable paths. The exact encoding is an implementation choice, not an owner vote on shell syntax. |
| Opus's durable result file/detached launcher, Sonnet's observation-first optional detachment, my full phase journal | Durable request identity, exclusive claim, recorded dispatch intent and atomic result are essential initially. The bounded remote recorder should survive SSH hangup with stdin/output detached, and expose its result/exit status on reconnect. Observation alone cannot exclude a still-running launcher that has not created resources yet. A full phase journal, automatic partial-launch reuse and phase resumption can wait. |
| My bundle-first outbound proposal versus peers' direct SSH incoming refs | Accept direct control-to-remote SSH Git transfer as the steady-state default when the consumer permits its private incoming namespace and receive hooks. It uses existing SSH access, not remote-to-local or hosted push authentication. Bundles remain the proven bootstrap, offline/archive option and fallback. No operational push is performed in this council. |
| Sonnet's always-control integration and peers' broad WIP restrictions versus my declared integration machine | Keep one integration authority per task/repository; declare its location, defaulting to control. An assigned integration worktree on a remote may be appropriate for Linux verification. WIP commits may be transferred or stored in private/ordinary authorized feature refs; delivery to a polled deployment/protected ref is separate. Do not require the owner to reconsider already authorized local/ref operations. |

Three specific corrections matter. Opus's `git push --no-verify` example should not be adopted: transfer does not justify bypassing existing push hooks, and receiver hooks/pollers must also be considered. Sonnet's wildcard forced/pruned tracking fetch is useful for a moving inventory, but cannot serve as an immutable receipt store. Both tip-equals-receipt recipes conflate a tested candidate with its later evidence commit and reject otherwise valid branch progress: retrieve the retained evidence commit named by the receipt, then resolve the earlier candidate/tested commits. Finally, `git rev-parse H:path` returns a Git object ID, not the assignment's raw-byte SHA-256; compare the original file's hash against the bytes from `git show H:path` using the same algorithm, or compare Git blob IDs to Git blob IDs.

Online `start --dry-run` can initialize Codex native runtime files, as the inspected adapter reference says. A read-only inventory preflight and write-free `resolve --offline` are distinct from this authorized native preparation. Fingerprints should summarize their underlying fields and evidence scope; a fingerprint alone is not proof of capability or of account access. A server restart or absent named agent does not prove all prior launch processes ended; reconnect must establish that before replacement.

### Concrete smallest reliable deliverable

Implement a machine-local execution wrapper and runbook for one bounded application handoff, with these essentials:

1. Resolve an enabled saved profile by ID/unique label, include its session in every handle, and accept explicit target repo/resource/executable mappings through the consumer wrapper. Use existing saved profiles as the connection authority. A mandatory `machines.yaml`, capacity model and automatic mirror fast-forward are unnecessary. Peer observations establish that current `machine list --json` exposes target/session fields; implementation still validates its installed response contract.
2. Resolve the allowed model/effort/permissions through existing local policy and send a bounded request with its provenance and expected resource/role hashes. Validate the target's pinned launcher, resources and requested selection. Direct-mode target invocation must carry exactly that authorized selection; it must not silently discard routing restrictions. Probe target Git/Herdr/native capabilities and application prerequisites using target config and explicit paths. No capability mismatch installs or upgrades anything.
3. Run the existing launch core on the target, initially using SSH for the whole preparation/start sequence. Preserve local behavior and the existing partial-state/awaiting-input contract. The machine wrapper returns a versioned endpoint envelope with the unchanged core result, resource identities and recovery instructions. Require explicit authorized remote endpoint context; setting `HERDR_ENV` alone remains insufficient. This is a narrow contract extension, not permission to use arbitrary focused panes.
4. Before mutation, create an exclusive request record containing launch ID, request digest, machine/session, expected branch/path/name, resource provenance and dispatch state. A matching repeat returns recorded/current state; a conflicting digest fails. Keep an active/uncertain claim across disconnect or recorder failure. An atomic private result file records core JSON and exit status. No automatic stale-claim expiry, alternate name launch or resubmission. Recovery inspects both recorder and Herdr/Git identities; partial resources are preserved and reported. Whole-phase journaling and automated reuse are later work.
5. Document one outbound input transfer and inbound return with exact retained refs, self-contained assignment/hash, durable report, per-machine verification limits and receiver acknowledgement. The Coordinator assigns Git transfer/verification/integration to the authorized worker roles. Initial helper code need not automate Git. Include the existing clean/dirty exceptions rather than imposing a blanket cross-machine dirty-output ban.

Capability-checked Herdr forwarding can be evaluated immediately for separate Coordinator read/prompt/wait operations with an owner-selected client path. `workspace list/create` success does not establish forwarded `agent start/prompt/wait`, worktree support or remote preparation. The wrapper must still execute role/skill reads, Claude materialization and Codex effective-config inspection on the target. Avoid a hybrid launch that unnecessarily alternates transports within those phases. No upgrade/restart or copying another client is part of the first deliverable.

### Exact returned commits and illustrative transfer recipes

Let `B` be input base, `C` the candidate and `H` the later evidence/report commit. The worker's report names already-existing `C` and any tested/reviewed commits; its terminal handoff returns existing `H`. After `H` exists, an authorized worker creates an exclusive retained export ref for this receipt and keeps it until receiver acknowledgement. Subsequent worker-branch movement must not change that ref. If receipt metadata would change, issue a new receipt/ref rather than overwrite the old one.

The commands below are runbook illustrations, not authorization to execute them here. Values are full commit IDs and validated unique names. On the producer machine, freeze the return:

```sh
git --no-replace-objects -C "$producer_repo" update-ref "$export_ref" "$H" ''
```

Use, for example, `export_ref=refs/ruach/export/task-42/receipt-7`. The empty expected-old value requires the ref not to exist. If it already exists, compare its exact commit and treat a mismatch as a conflict. The ref is retained and immutable by consumer contract, not because Git enforces an immutable namespace.

The control-side transfer worker retrieves it using **local-to-remote** authentication:

```sh
git --no-replace-objects -C "$control_repo" fetch --no-tags --no-write-fetch-head --no-recurse-submodules \
  oholiab:/opt/dev/ramec "$export_ref:$staging_ref"
git --no-replace-objects -C "$control_repo" rev-parse --verify "$staging_ref^{commit}"
git --no-replace-objects -C "$control_repo" cat-file -e "$H^{commit}"
git --no-replace-objects -C "$control_repo" merge-base --is-ancestor "$B" "$H"
git --no-replace-objects -C "$control_repo" update-ref "$received_ref" "$H" ''
```

Compare the resolved staging commit to the receipt's exact `H` **before** publishing `received_ref`; a new transfer attempt uses a fresh staging ref. Example receiving ref: `refs/ruach/received/oholiab/receipt-7`. Validate the report and assignment bytes at `H`, resolve `C`/tested revisions, and check the graph relation required by the assignment. These checks do not assume `H` was tested or that the current worker branch still equals `H`. Do not prune/force-update retained receipt refs. Asking a server for an unadvertised raw SHA is not a dependable substitute for a retained named ref. If it is missing, ask the producer to restore that exact ref from retained objects or supply a named-ref bundle; never silently take the latest branch tip.

If the controller relays a source/base to another machine, direct outbound transfer may use:

```sh
git --no-replace-objects -C "$control_repo" push --porcelain \
  --force-with-lease="$incoming_ref:" tubal:/opt/dev/ramec "$H:$incoming_ref"
```

Example incoming ref: `refs/ruach/incoming/task-42/transfer-8`. The expected-absent lease guards unique creation; it is not permission to replace an existing ref. On a repeat, verify existing equality or allocate a new transfer ID. Preserve local and receiver hooks, check that this private namespace has no deployment consumers, and verify exact `H` remotely before launch. No remote-origin credentials, remote-to-control SSH or remote-to-remote access are needed. This does not update a checked-out branch. It is nevertheless a ref mutation, distinct from a fetch, and must fit the consumer's transfer authority.

The verified bundle alternative exports a **named retained ref**, with optional prerequisite base:

```sh
git --no-replace-objects -C "$producer_repo" bundle create "$bundle_path" "$export_ref" "^$B"
git --no-replace-objects -C "$receiver_repo" bundle verify "$bundle_path"
git --no-replace-objects -C "$receiver_repo" fetch --no-tags "$bundle_path" "$export_ref:$staging_ref"
```

Copy the file over the established control-to-machine path, record/compare its SHA-256, and perform the same exact-`H` checks. The incremental receiver must already contain `B`; omit `"^$B"` for a self-contained bundle. Do not use `known..A` where `A` is just a detached raw SHA: use a named export ref so the bundle has an advertised tip. A bundle's content hash and prerequisite verification do not replace expected-commit checks. Git LFS/submodule/non-Git payload obligations remain separate.

Disposable Git 2.47.3 fixtures checked exclusive export refs, exact named fetch, expected ancestry, branch movement while receipt refs stayed anchored, incremental prerequisite rejection, full named-ref bundle import, and expected-absent incoming-push syntax/lease rejection using **dry-run only**. The unforced divergent fetch was rejected in this fixture; a forced tracking fetch moved the inventory ref while the receipt ref stayed intact. This supports fresh per-receipt refs rather than relying on a moving tracking namespace. No SSH, operational push, merge, live launch or application test was run.

### Authority, WIP and remaining disagreements

Local WIP commits, private ref exchange and ordinary feature-branch storage are not deployment. Consumer policy may already authorize them; no new approval should be inferred solely because an operation spells `git push`. Conversely, a branch polled by a deployment/build system can trigger effects even when it is called a feature branch. The receipt names the destination remote/ref and known consumers. Integration/delivery to the named protected or deployment target uses existing review and authorization rules. Central feature storage remains a valid option without requiring push credentials on every worker: the control machine can relay commits with its own authorized access.

I retain explicitly requested dirty handoffs as an exception with base, tracked binary diff, staged/unstaged/untracked inventory, allowlisted payload hashes and omissions. Scoped WIP commits are the simpler default. Peer proposals to reject every dirty remote result are stricter than the current role contract and unnecessary for an explicit rescue/review assignment. Never auto-stage unrelated work. Assigned integrators decide whether source scope requires squash/rebase; they reverify/review changed candidates under consumer policy.

My remaining disagreement with Sonnet is timing of durable request/result protection: include it before advertising reliable remote start, not after a first lost response. My remaining disagreement with Opus is requiring a machine catalog and blanket environment clearing initially: explicit wrapper mappings and target-derived config are enough. All agree that a full journal/resume engine, generic scheduler, cross-machine shared checkout and credential copying are unnecessary. Default integration on control is useful; making it universal would restrict tasks needing a different verification environment without improving authority.

### At most five consequential owner decisions

1. **Endpoint policy:** choose the accepted execution/communication transports and durable client/bootstrap locations. Recommendation: SSH target-side launch; an explicitly selected compatible Herdr client for separately verified forwarding. Temporary-client evidence does not settle this choice.
2. **Ref destinations and side effects:** identify allowed incoming/export/receiving namespaces and hosted feature/deployment targets. Recommendation: direct private-ref transfer through control with hooks preserved; bundles fallback. Existing authorized local transfers remain authorized; this decision concerns future reusable policy.
3. **Acceptance location:** choose the first bounded application task, integration authority and required platform checks. Recommendation: one ramec handoff, control as default integrator, explicit remote verification where needed; dependency/build/test checks are still pending.
4. **Preservation policy:** define checkpoint/receipt retention and intentional dirty/non-Git outcomes. Recommendation: scoped commits and retained exact export/received refs until acknowledgement, hashed exception manifests, rebuildable caches and machine-local secrets.
5. **Implementation scope/priority:** authorize the bounded wrapper plus durable recorder/inspection and one handoff demonstration, or keep the runbook only. Recommendation: that small deliverable before optional catalogs, full phase journal, automated reuse or linked worktrees. Council advice and setup authority do not themselves authorize implementation.

CLI spelling, branch alias convention, receipt hashing algorithm and placement of a helper inside the skill are routine implementation choices within that assignment; no separate owner votes are needed. These decisions are proposals for the owner, not a request to approve already authorized council work.

Future checks for the first implementation are narrowed to endpoint/selector identity, argument encoding, target-only config and executable pins, exact route/resource provenance, capability mismatch without fallback, duplicate/conflicting request claims, disconnect before/after dispatch and recorder death, atomic result recovery, native blocked startup, stale-session handles and owned-resource retention. Git fixtures cover retained-receipt equality, moved worker tips, missing bundle prerequisites, lease conflicts, assignment-byte hashes and cited revisions after import. Run the required repository/affected-skill suites and separately authorized live smoke when implementing; this council supplies documentation and disposable Git evidence only.
