task: multi-machine-preparation-and-council
status: complete
outcome: Oholiab and Tubal prepared for headless application development; three high-effort Architects completed independent and peer-review rounds
artifacts:
  - docs/reports/multi-machine-council/result.md
  - docs/reports/multi-machine-council/preparation.md
  - docs/reports/multi-machine-council/sol.md
  - docs/reports/multi-machine-council/opus.md
  - docs/reports/multi-machine-council/sonnet.md
  - docs/design/multi-machine-sol.md
  - docs/design/multi-machine-opus.md
  - docs/design/multi-machine-sonnet.md
  - branch docs/multi-machine-council
verification:
  - "Both machines: application dependency installation, builds and selected tests passed; exact scope and initial failures are recorded in preparation.md"
  - "Both machines: Ruach checks, release check, 90 root tests and 283 executable-skill tests passed"
  - "Both machines: Codex and Claude native launch dry-runs passed without starting remote model turns"
  - "Both machines: source returned over real SSH Git fetch into a temporary bare repository at the exact expected Ruach commit"
  - "Council: all three members validated their structured reports and documentation; disposable Git examples checked pins, rewrites and bundles"
  - "Collected documentation: just check and 90 root tests passed; canonical report validation passed"
review: not-run
discoveries:
  - "The default local Herdr client is 0.9.0 and lacks --machine; an explicitly selected temporary 0.9.3 client successfully forwarded to both running 0.9.3 servers without replacing or restarting a server"
  - "Target-side launch preparation remains necessary even when Herdr API forwarding works"
  - "Git bundles omit ignored runtime assets; two historical model bundles required an explicit hashed transfer"
blockers: []
source_baseline: d75039aa7b82b262e2f28af08630258fb7f77180
tested_revision: d75039aa7b82b262e2f28af08630258fb7f77180
implementation_authorized: false

# Multi-machine preparation and council result

Oholiab and Tubal have ten independent source checkouts under `/opt/dev`, the required toolchains and dependencies, verified native agent logins, and background Herdr development workspaces. The [preparation record](preparation.md) gives the revisions, checks, resolved setup failures and remaining coverage limits. The original source checkout's unrelated documentation edits were preserved. This collection is on `docs/multi-machine-council`; it does not change the active checkout's roadmap or launcher.

The council used Architect roles with **GPT-6.1-Sol, Claude Opus 5.5 and Claude Sonnet 5.5, all high effort**. Each wrote an independent design, read the other members' artifacts and revised its position. Their [Sol](sol.md), [Opus](opus.md) and [Sonnet](sonnet.md) reports distinguish their own checks from coordinator-supplied machine evidence. Detailed designs retain first-round reasoning and mark second-round changes. Advisory agreement does not establish implementation approval.

## Recommendation

**Keep Git for feature and branch handoffs.** The useful design choice is how commits travel and how receipts survive moving branches. Use independent clones and local worktrees on each machine. The control machine can send bases into unique private incoming refs and fetch retained return refs over its existing SSH connections. Bundles support bootstrap, archives and disconnected transfers. Remote-to-control SSH credentials and hosted Git credentials on every worker are unnecessary. A central remote remains useful when its feature namespaces and publication rights are declared.

Git transfers committed source, assignments and reports. Each return needs an exact retained export ref, a full returned commit, its earlier candidate/tested revisions, and a receiver acknowledgement. A report commit may follow the tested candidate. Verify the returned commit and ancestry, assignment bytes and report before integration. A moving branch is an inventory handle; it must not overwrite an accepted receipt. Compare raw assignment hashes with raw bytes, or Git blob IDs with Git blob IDs.

Use explicit checksum manifests for ignored models, datasets and other required assets. Rebuild caches and dependencies per machine. Keep native accounts, credentials and session state with their owning machines. Patches can support an expressly assigned dirty-work rescue; they should not be the normal feature handoff. A shared writable checkout adds cross-host Git and build contention without replacing the receipt protocol.

## Smallest Ruach integration

The revised council converges on a sibling machine entrypoint inside `ruach-herdr`, with a thin consumer wrapper. Keep the existing launcher machine-local. Resolve the authorized model, effort and permissions through existing policy, then send a bounded request to a fixed target-side helper. That helper checks the target repository, resource identity, executable paths, native configuration, Herdr capabilities and pinned base before invoking the local launch core.

Return the existing launcher result inside a machine/session envelope. Every pane, workspace and agent handle belongs to its selected endpoint. Native config inspection, private settings files and Git worktree operations run on that endpoint. Herdr forwarding can carry separately verified inspection and communication operations; forwarding an API call does not move filesystem or native preparation work.

The first reliable remote start needs an exclusive request claim before mutation, an immutable request digest, durable dispatch intent and an atomic result with exit status. Its recorder must survive the control connection closing. Reconnect inspects the record and live Herdr/Git state. Partial or uncertain resources remain preserved. A full phase journal, automatic resumption, machine scheduler and mandatory machine catalog can wait.

One missing-record observation can race an in-flight dispatch. It must not authorize a replacement attempt. A repeat is safe only through the same immutable request ID and the target's exclusive claim, with no mutation before that claim. Conflicting requests fail; uncertain attempts are inspected. Sonnet corrected its initial negative-observation claim after this coordination review.

## Differences that remain

- **Unfinished work:** Opus favors WIP commits only. Sol and Sonnet retain explicitly assigned dirty-diff rescue with a bounded manifest. Prefer scoped commits for normal handoffs and preserve user-authorized exceptions.
- **Integration location:** control is a useful default; a named remote integration worktree can serve tasks with platform-specific verification. Preserve one integration authority per task/repository.
- **Environment:** all require explicit target paths and native config ownership. A fixed helper with a target-derived environment avoids copying local config or interpolating a task into shell text. Exact helper spelling is an implementation choice.
- **Publication:** private machine ref transfer, ordinary hosted feature storage and updates to deployment-polled/protected refs have different effects. Preserve hooks and existing publication authority. The current preparation transferred commits privately and did not publish to origin.

## Proposed implementation sequence

1. Add the bounded runbook and receipt examples to existing operations/coordination documentation. Use the verified bundle bootstrap and SSH return path as evidence.
2. Implement machine selection and target preflight, with profile/session identity, explicit resource/executable mapping and capability checks. Preserve the existing local launcher contract.
3. Add target-side request/result recording, start and recovery inspection. Test duplicate/conflicting requests, disconnects before/after dispatch, delayed dispatch, recorder death, native blocked state and stale handles.
4. Exercise one bounded RAMEC task across the prepared machines. Retain exact return refs, validate reports after import and verify the combined candidate on the declared integration/acceptance environments.

Use TypeScript/Bun, fake SSH/native boundaries and real disposable Git repositories. Run `just check`, `bun run test` and the affected skill suites. Live launch and application evidence must remain separate from fixture tests.

Future implementation choices are roadmap priority, accepted feature/deployment destinations, integration and acceptance environments, and retention/asset policy. The preparation and council request were already authorized and are complete. Implementing the reusable machine layer is a separate task.

## Evidence location and scope

The collected copies replace private saved-profile identifiers, live pane handles and personal executable paths with illustrative placeholders. Original author revisions remain on their council branches. Resolve placeholder paths and IDs from the selected target before using any example. A parent-workspace option takes a workspace ID, not a pane ID.

Private machine receipts, package/download details and full test logs stay in each user's `ruach-dev` state directory. Local copies of preparation scripts and verification receipts are in the OS temporary directory. They are operational evidence, not another editable installation of Ruach's shared resources. Host configuration, account identifiers, credentials and raw transcripts are not included in this collection.

The council checked architecture documents and disposable Git examples; the coordinator ran the remote setup, native dry-runs, real SSH fetch and application checks. There was no independent implementation review because no reusable machine implementation was produced. Platform-specific coverage limits are in the preparation record.
