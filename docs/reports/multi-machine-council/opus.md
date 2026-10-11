---
task: multi-machine-council-round-2-opus
role: architect
council_member: Opus 5.5 (high)
round: 2
status: needs-decision
outcome: "Round 2 after reading Sol (e4f2dc2) and Sonnet (511c329). All three agree on target-side launcher execution, machine-scoped IDs, per-host native config, resources and worktrees, Git for committed source only, one integration authority and inspect-first recovery. My revised first version is a sibling skills/ruach-herdr/scripts/machine.ts (list, preflight, start, observe) with worker.ts unchanged. A wrapper-owned remote launch record (atomic mkdir by launch ID, request digest before dispatch, setsid -w with outputs to files) replaces my launcher --result-file and is the minimal form of Sol's request identity; Sol's per-phase journal is deferred. Ref transfer is control-initiated only: push into refs/ruach/incoming/* (bundles first-class), create-only pin refs refs/ruach/handoff/* on the remote and refs/ruach/receipts/* locally, non-forced fetch, and a bundle streamed over the same SSH when direct Git fails. Ref transfer, feature publication and deployment-branch publication are separated. Herdr forwarding carries monitoring later; target-side preparation cannot be forwarded. Five owner decisions remain."
baseline: d75039a
artifacts:
  - docs/design/multi-machine-opus.md
  - docs/reports/multi-machine-council/opus.md
  - branch ruach/council-machines-opus
verification:
  - "Peer artifacts read only (absolute paths): council-machines-sol docs/design/multi-machine-sol.md and docs/reports/multi-machine-council/sol.md at e4f2dc2; council-machines-sonnet docs/design/multi-machine-sonnet.md and docs/reports/multi-machine-council/sonnet.md at 511c329. Not edited."
  - "Disposable Git repositories in session scratch (git 2.47.3, file transport; SSH transport not exercised): base push into refs/ruach/incoming of a non-bare clone with main checked out left its status unchanged; create-only update-ref pin succeeded, then a second attempt failed with 'reference already exists'; pin and branch fetched without force into new refs, received ref equals H, base is an ancestor; after the remote branch was rewritten a non-forced fetch exited 1 and the local receipt pin still named H; fetch by bare SHA worked under protocol v2 (via pin and, before gc, unreferenced)."
  - "Bundles in the same repositories: 'bundle create - <ref> ^B' streamed to stdout; verify exit 0 where B exists and failed where it is missing ('lacks these prerequisite commits'); fetch from the bundle gave H; a bare-SHA bundle was refused ('Refusing to create empty bundle'); an outbound ref bundle verified and imported into the remote incoming ref at the expected commit."
  - "Launch-record primitives: setsid -w returned the child's exit status (4) with output redirected to files; mkdir of an existing launch directory failed."
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/multi-machine-council/opus.md --repo . : ok true, exit 0, baseline d75039a resolved (round-2 content)"
  - "just check and git diff --check on both artifacts: exit 0 before the round-2 commit"
  - "Round 1: repository inspection at d75039a and local read-only Herdr probes (0.9.0 rejects --machine; two enabled profiles); setup-update facts F21-F28 Coordinator-supplied, not re-verified."
  - "not run: application or runtime tests, remote machine probes, live launches, SSH Git transport"
review: not-run
discoveries:
  - "A dropped non-pty SSH session may let the remote launcher continue, but worker.ts writes its one result to stdout at the end, so that result is lost exactly in the uncertain case. Redirecting launcher output to a remote launch record makes detached execution essential in v1, not hardening."
  - "A single remote mkdir per launch ID gives both a lock and duplicate-request detection without changing worker.ts."
  - "Git bundles must name a ref; bundling a bare SHA is refused. Transfer recipes therefore pin a ref first and bundle the ref."
  - "Protocol v2 fetch by bare SHA succeeds even for unreferenced objects until gc. That is useful for diagnosis but not durable, so pin refs are required."
  - "Git cannot hold both ruach/<label> and ruach/<label>/<x>. A worker named like a machine label would fail only at worktree add, after mutation began, so the wrapper must reject it before SSH."
  - "Herdr API forwarding can carry workspace, pane and agent operations, but the agent start argv references target-side temp material from native preparation. Launch cannot be split across forwarding and SSH without two partial-failure seams."
blockers:
  - "D1 remote launch authorization: machine.ts sets HERDR_ENV=1 on the target only for an authorized Herdr caller naming an enabled machine with a passing remote herdr status (recommend yes)"
  - "D2 acceptance environment: which machine's verification counts for each repository or target, and whether a remote may be a task's integration machine (recommend control machine integrates; acceptance environments named per repository)"
  - "D3 feature publication: may the control machine publish ruach/* and task/* feature refs (including WIP) to origin, and which branches are deployment-polled and delivery-only (recommend yes; list polled branches)"
  - "D4 unfinished work across machines: WIP commits only vs also manifest-described uncommitted diffs (recommend WIP commits only)"
  - "D5 roadmap placement and first real cross-machine task (recommend 0.3.x with a bounded ramec task)"
---

# Multi-machine council: Opus

The full design is in [docs/design/multi-machine-opus.md](../../design/multi-machine-opus.md). §0 holds the round-2 position. §1–§14 keep the independent round-1 reasoning and its setup-update revision.

## Round 2

### Agreement

All three members favor:
- launcher execution on the target, with native config, accounts, temp material and worktrees kept on that host;
- machine-scoped opaque IDs, keyed by the Herdr profile ID;
- target-side preflight that fails closed;
- Git for committed source only; dirty work, caches, datasets, secrets and sessions use their own channels;
- one Coordinator and one integration checkout;
- inspect-first recovery after a lost response.

Herdr API forwarding is not a launch transport.

### Differences and resolutions

- **Wrapper.** Adopt Sonnet's sibling `machine.ts` (`list`, `preflight`, `start`, `observe`). `worker.ts` stays unchanged. My launcher `--machine` flag is withdrawn.
- **Lost response.** The essential v1 is a remote launch record:
  - atomic `mkdir` keyed by launch ID;
  - `request.json` written before dispatch;
  - `setsid -w` with stdout, stderr and exit status in files;
  - a read-only `observe`.

  This is the minimal form of Sol's request identity, and it is stronger than Sonnet's "detach later". Sol's per-phase journal is deferred until `observe` cannot classify real gaps.
- **Outbound transport.** Push into `refs/ruach/incoming/*` by default. Bundles (Sol) are first-class and already proven for seeding. Both are control-initiated.
- **Publication.** Separate ref transfer between owned machines, feature publication to origin (allowed by policy, from the control machine only), and deployment-branch publication (delivery only, with an expected-old-value check). My round-1 "no central remote" was too broad.
- **IDs.** Structured `{machine, id}` pairs (Sonnet), carrying the profile session (Sol).
- **Assignment.** It travels as a commit where possible (Sonnet).
- **Branch name.** `ruach/<machine>/<worker>`, with task- and attempt-unique worker names. The wrapper rejects a worker name equal to a machine label.
- **Machine descriptor.** Flags in v1; `machines.yaml` once the flags repeat.

### Smallest deliverable

`machine.ts` v1:
- profile resolution;
- read-only preflight with an environment fingerprint and role-hash comparison;
- start through the remote launch record, with an unchanged launcher result inside a machine envelope;
- observe classifications: `not-started`, `running`, `partial`, `started`, `awaiting-input`, `unknown`.

Alongside it: a documentation runbook for ref transfer, pins and receipts, and tests with a fake `ssh` and real temporary repositories. Later: Herdr forwarding for monitoring, `machines.yaml`, a per-phase journal, a receive-verification script, remote linked mode.

### Retrieval, exact SHAs and uncertain launches

- **Retrieval.** Every connection starts on the control machine:
  - The worker pins `H` create-only at `refs/ruach/handoff/<task>/<worker>/<n>`.
  - The control machine fetches that pin and the worker branch without force over SSH into `refs/ruach/received/…` and `refs/remotes/<M>/…`.
  - It verifies `H`, base ancestry, the assignment blob and the report.
  - It pins `refs/ruach/receipts/…` create-only and branches `task/<worker>` from `H`.
  - Fallback: `ssh <target> git -C <checkout> bundle create - <pin> ^<B> > h.bundle`, then verify and fetch.
- **Exact SHAs.** Receipts name SHAs, not branches. Pins on both sides survive rewrites and garbage collection. Non-forced fetch surfaces rewrites. A tip that moves forward after the report means a new candidate with a new pin number.
- **Uncertain launches.** Each `observe` classification has one allowed next step (design §0.9). `running` means wait, never dispatch again. `partial` means keep and decide. A relaunch always uses a new launch ID, and an existing name or branch is rejected by the launcher.

### Owner decisions (five)

D1–D5 in the leading block and design §0.10:
1. remote launch authorization semantics;
2. acceptance environment and integration machine;
3. feature publication policy and the list of deployment-polled branches;
4. WIP-only rule for unfinished work across machines;
5. roadmap placement and the first real task.

Branch and ref namespaces, push into incoming refs (bundles are the drop-in), flags versus `machines.yaml`, the Herdr client upgrade and per-machine provisioning are no longer asked.

## Round 1 record

### Position

1. **Boundary.** `ruach-herdr start|resolve --machine <declared>`:
   - resolves the saved Herdr profile (stable profile ID, label for display);
   - resolves the route locally from the Coordinator checkout's catalogs;
   - runs the remote `worker.ts` once over the profile's SSH target, in direct mode, with `env -i` and a declared remote PATH;
   - relays its JSON result inside a machine envelope.

   Native config, accounts and launch material stay on the remote. The safety properties already in the launcher (pinned base, fresh branch, single submission, uncertain-state exit 4, awaiting-input) are reused, not duplicated. A small set of launcher changes is proposed: `--result-file` written atomically, `setsid` around the remote launch, machine envelope, and machine-qualified inspection argv. Herdr `--machine` forwarding is adopted later, for monitoring only, once `--help` shows it.
2. **Identifiers.** Every Herdr ID is paired with `machine_id`, written as `<label>/<id>`. IDs are never reused across servers. Worker names are unique per task across machines.
3. **Preflight, read-only and in order:** profile, SSH with BatchMode, remote executables, remote `herdr status`, remote `resolve --offline` role-hash equality, base commit present remotely, remote dry-run. Machines and routes never change automatically.
4. **Failure.** A transport drop after mutation gives exit 4 with `machine_state: unknown`. Recovery uses the remote result file, `agent get`, `worktree list` and `show-ref`. There is no retry. Remote sessions survive SSH loss, so reconnecting is only a re-read.
5. **Git is the right tool** for source and handoff artifacts, because every revision contract depends on commit identity.
   - Default transport is direct SSH Git: push the base into `refs/ruach/incoming/<task>/<worker>` on the remote, and fetch `refs/heads/ruach/<machine>/<worker>` into `refs/remotes/<machine>/…` without force.
   - Bundles are the fallback.
   - Origin needs owner authorization (credentials, WIP publication).
   - Patches lose identity, rsync carries dirty, ignored and secret state, and shared filesystems create cross-host Git locking hazards.
6. **What moves.** Only commits move. Dirty work becomes a commit, or a salvage commit after a crash. Ignored caches are rebuilt per machine. Datasets move only by a declared checksum manifest. Secrets never move. Test evidence is bound to `(revision, machine, toolchain)`, and the integrated candidate is verified on the integration machine.
7. **Authority.** One Coordinator. One integration checkout per task. Remotes own only their worker branches and never merge or push to origin.

### Handoff sequence (summary)

Outbound:
- deliver the base;
- run preflight;
- `start --machine` creates `ruach/<M>/<worker>`;
- write the assignment through SSH stdin, check its hash, then prompt.

Return:
- the worker commits code, the unchanged assignment and its report, and validates the report;
- an integration Implementer checks that the remote tree is clean, fetches, and verifies ancestor, ref equality, assignment blob hash and the local report validation;
- that Implementer creates the retained local branch and writes the receipt;
- integration and verification then run on the integration machine;
- the Coordinator cleans up the remote worktree, incoming ref and result file.

The receipt fields are in design §9.

### Phases

| Phase | Content |
|---|---|
| 0 | Runbook with today's tools, plus read-only verification of the assumptions on oholiab and tubal |
| 1 | Receipt and per-machine evidence conventions; an optional received-revision verifier, tested with real temporary repositories |
| 2 | `--machine` delegation, tested with a fake `ssh` that executes against a separate fake HOME, PATH and Herdr; the test list is in design §13. Plus one owner-authorized live smoke per machine |
| 3 | Monitoring through SSH, switching to Herdr `--machine` when feature-detected |
| 4 | Bundle helper, checkpoint fetches, remote linked parent; only when use shows the need |

### Setup update (revision of round 1)

The Coordinator's update did not change the boundary, for one reason: Herdr forwarding still forwards only the Herdr API, and remote native preparation must run on the remote machine. What changed:

- **Monitoring.** Herdr `--machine` is now a practical monitoring and inspection transport, through an owner-declared 0.9.3+ client that is feature-detected (D12). The temporary `/tmp` client remains evidence only.
- **Bundles.** The bundle seeding path is recorded as the new-machine bootstrap. Steady-state handoffs stay on direct SSH Git.
- **PATH and Bun.** Preflight records resolved Bun paths, because 1.4.2 and 1.4.3 coexist. D11 settles declared PATH versus dev-env.
- **Remote linked mode** uses an explicit `--parent-workspace` checked remotely, for example `oholiab/w4:p1`.
- **Credentials.** No push credentials on the remotes confirms that bases come from the integration machine.
- **Several repositories.** Each repository gets its own receipt, with no cross-repository atomicity.

### Assumptions to verify before Phase 2

These are not verified:
- remote harness versions (Herdr itself is now 0.9.3);
- which Bun the declared PATH selects;
- remote GitHub read access;
- whether remote→local SSH exists;
- that no shared filesystem exists;
- remote `.agents` snapshot versions per repository (ramec was fast-forwarded clean);
- whether a noninteractive `herdr` reaches the default socket under the `env -i` allowlist;
- remote native account login.

### Scope and limits

- Only the two artifacts above were written.
- Nothing was mutated on oholiab or tubal. No branch was pushed, nothing was merged, and routing and the roadmap were not changed.
- No application or runtime tests are claimed.
- The single `herdr --machine` probe was local and read-only, and the local CLI rejected it.
- Round 2: peer artifacts were read only. Git and bundle commands were checked in disposable scratch repositories over file transport only. No SSH transport, remote command or launch was run.
