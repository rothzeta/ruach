# Multi-machine application development through Herdr (Opus council design)

Status: council round 1, independent proposal by the Opus 5.5 Architect, revised once for the Coordinator's setup update (§1, F21–F28). That revision did not change the recommendation. It made Herdr `--machine` forwarding a near-term monitoring transport, recorded bundles as the proven seeding path, and added decisions D11 and D12. This is architecture advice. It is not implementation authority and does not change the roadmap, routing or any existing contract.

Question: how should Ruach support application development across machines that Herdr controls, and is Git the best tool for feature/branch handoffs between those machines?

Short answer:

1. **Smallest boundary.** Add an explicit `--machine` selection to `ruach-herdr` that runs the *existing, unchanged* launcher on the target machine over that machine's saved SSH target, then relays its one JSON result with machine-qualified identifiers. Do not reimplement Git, filesystem, native-config or Herdr operations as remote calls one by one. Herdr API forwarding (`--machine`), when the installed CLI supports it, replaces SSH only for Herdr monitoring commands. It cannot replace remote native preparation.
2. **Git is the right tool for source handoff,** because commits give the content-addressed identity that handoff revision fields already depend on. The recommended transport is **direct Git over SSH between the integration checkout and each machine's checkout**. The integration machine writes only a private ref namespace on the remote to deliver bases, and fetches result branches back into a machine-scoped namespace. A central remote (GitHub) is an owner option, not the default. Git bundles are the fallback when direct SSH Git is unavailable. Patches, rsync and shared filesystems are not source-handoff mechanisms.
3. **Authority stays single.** One Coordinator owns the task. One integration checkout, normally on the Coordinator's machine, is the only place where integration and merges happen. Remote machines host workers and their branches. They never merge.

The rest of this document separates **verified facts** (§1), **assumptions** (§2), **proposals** (§3–§11) and **owner decisions** (§12).

---

## 1. Verified facts

Repository facts were checked in this worktree at `d75039a`. Environment facts were checked on the local machine on 2026-10-11 with read-only commands. Facts marked *(coordinator)* come from the assignment and were not re-verified here.

### Ruach launcher (`skills/ruach-herdr`)

- F1. `worker.ts` is single-machine throughout. It resolves the repository and cwd with local `realpath` and Git (`worker.ts:48-56`), probes local executables through `Bun.which` over a pinned PATH (`process.ts:7-11`, `process.ts:52-56`), reads native config in the local filesystem (adapters, `references/adapters.md`), and calls the local `herdr` CLI, which talks to the inherited session socket.
- F2. `start` requires `HERDR_ENV=1` (`worker.ts:81`). Linked worktree mode also needs `HERDR_WORKSPACE_ID` resolving to a workspace of the same repository (`worker.ts:76`, `spaces.ts:39-59`). Otherwise the launch falls back to a standalone workspace and reports `linked_unavailable`.
- F3. Agent-name uniqueness is checked against `herdr agent list` on the current server only (`worker.ts:92-96`).
- F4. Defaults: worktree `<checkout-parent>/<checkout>-worktrees/<name>` (`spaces.ts:22`), branch `ruach/<name>` (`spaces.ts:27`), base = committed HEAD resolved to a full SHA before mutation (`spaces.ts:32-33`). Existing paths and branches are rejected and never reused.
- F5. The pane environment forwards the launcher's own `PATH`, `HOME`, `CODEX_HOME` and `CLAUDE_CONFIG_DIR` (`worker.ts:120`). On a remote launcher process these are the remote process's values, which is the correct ownership.
- F6. Failure semantics: exit 4 after any mutation, with `worktree_state` and `submission_state` set to `unknown` or `created`. There is no retry, no rollback of the worktree, and private material is kept while submission is uncertain (`worker.ts:157-165`). Exactly one `herdr agent start` submission is made. A blocked native dialog yields `action: awaiting-input` (`worker.ts:138-150`).
- F7. The role file content hash is computed at selection time and checked again before submission (`worker.ts:62`, `worker.ts:117`).
- F8. `resolve --offline` is write-free and returns the selection, including `roleHash`, with `launchable: false` (`worker.ts:64-68`). This is a natural remote compatibility probe.
- F9. The development wrapper (`scripts/agent-routing.ts`) delegates once to `worker.ts` by subprocess argv and forwards its stdout, stderr and exit status. `references/routing.md` makes this the consumer wrapper boundary: keep native flags, route selection, role injection, launch-space operations and retries inside the skill, and invent no second result schema.

### Handoff and coordination

- F10. The handoff schema accepts extra top-level fields (`additionalProperties: true`). Every top-level field ending in `_revision` or `_baseline` is validated as a commit reference resolvable in the report's repository (`handoff.schema.json:16-18`, `skills/ruach-handoff/SKILL.md`). Receipt revision fields therefore validate locally only after the commits have been fetched there.
- F11. Each task has exactly one Coordinator. Cleanup authority follows ownership (`docs/coordination.md`). The Coordinator does not implement, validate, integrate or merge. Delivery goes to an Implementer only after review and with user authorization for the named target (`agents/coordinator.md`).
- F12. Implementer delivery merges only the named reviewed revision, and only if the destination has not moved (`agents/implementer.md`). The documented default delivery stops at a local merge. Push needs its own authorization (`docs/examples/consumer-example.md:38`).
- F13. Roadmap principles: Herdr owns terminal primitives, existing services own Git hosting, and there is no new service, scheduler or mailbox. Planned 0.3.x work includes a resource ledger and idempotent launch, and consumer-owned runtime resources. The roadmap does not mention multiple machines (`docs/roadmap.md`).
- F14. `docs/operations.md:180-181` already distinguishes snapshot integrity from per-machine runtime/bootstrap integrity: Bun, Git, Herdr and native versions, frozen installs and resolved executables must be verified per machine.

### Herdr and environment

- F15. Local `herdr 0.9.0`: client and server protocol 22, server running on `~/.config/herdr/herdr.sock` (`herdr status`). Its usage lists `herdr --remote <ssh-target>` (TUI attach) and `herdr machine list|add|rename|remove|enable|disable`. `herdr --machine oholiab agent list` fails with `unknown option: --machine`.
- F16. The installed Herdr skill at `~/.agents/skills/herdr/SKILL.md:91-103` documents `herdr --machine <label-or-id> …` API forwarding. That documentation is ahead of the installed binary. `herdr --skill` from the 0.9.0 binary instead says to run remote control commands on the intended host and rediscover IDs there. Both state that **IDs and live agent names are scoped to one server**. The installed skill also states that forwarding never installs, starts or falls back to Local, and does not forward local configuration.
- F17. `herdr machine list --json` returns two enabled profiles: `oholiab` (id `69400a0f6ff332188a4262a1eb7b3490`, target `oholiab`, session `default`) and `tubal` (id `ef2f73192ee18b604361105f720963e9`, target `tubal`, session `default`).
- F18. `herdr worktree create` supports `--workspace --cwd --branch --base --path --label --focus --no-focus --trust-repository`. The bundled `herdr api schema` contains no machine-related fields.
- F19. Local repositories `ruach`, `ramec`, `enoch` and `eden` each have a GitHub `origin` (`git@github.com:rothzeta/<repo>.git`). Local `ramec` has Herdr worktrees under `~/.herdr/worktrees/ramec/`.
- F20. *(coordinator)* `oholiab` and `tubal` run Debian 13 x86_64. `/opt/dev` there is writable by `metatron`, and each has an existing `ramec` checkout. Bun and .NET are installed under user directories, and Git, Just, Python and Docker are present. Herdr servers are running, and Codex and Claude are installed. Noninteractive SSH PATH omits user bins. Remote commands work over the saved SSH targets using the remote user-bin Herdr.

### Setup update (coordinator, 2026-10-11, after the first draft)

Supplied by the Coordinator and not re-verified here. A read-only local search did not find the temporary client.

- F21. Both remote machines run Herdr 0.9.3, protocol 22, with compatible running servers.
- F22. A copy of the 0.9.3 client in a local `/tmp` path forwarded `workspace list` and `workspace create` with `--machine`. The local default client stays 0.9.0, and no server was restarted. Forwarding therefore depends on the **client** binary used, not on the local server version. The Coordinator classifies this as evidence, **not an accepted Ruach transport decision**.
- F23. Ten independent repositories were seeded on the remotes through Git bundles from exact committed source. Eden's children (jachin, boaz) are separate repositories. The existing clean `ramec` checkout was fast-forwarded.
- F24. Bun 1.4.2, Node 22.23.3 and .NET SDKs 8.0.425, 10.0.110 and 10.0.401 are present on both hosts. An existing Bun 1.4.3 was preserved, so two Bun versions coexist and PATH order decides which one runs.
- F25. A user-local dev-env sets PATH on the remotes.
- F26. Git push authentication, data and secrets were **not** copied to the remotes. Dependency, build and test checks are still running, so no claims are made about them.
- F27. Background Ruach development workspaces exist: `oholiab/w4:p1` and `tubal/w2:p1`. Under identical-looking local IDs these would collide, which illustrates §4.
- F28. Local Bun in this worktree reported 1.4.2 (`bun install v1.4.2`, observed here).

## 2. Assumptions (not verified here)

- A1. *Partly resolved by F21 and F24.* Remote Herdr is 0.9.3. Remote Claude and Codex versions are still unknown. Keep probing every version at use, because the versions can drift.
- A2. It is not known whether the remote machines can reach the local machine over SSH (remote→local). Assume they cannot: only local→remote SSH is established.
- A3. *Confirmed for push by F26:* the remotes have no Git push credentials. GitHub *read* access from the remotes is still unknown. Bases must therefore come from the integration machine, either pushed into incoming refs or delivered as bundles (F23), unless read access is later shown.
- A4. No shared filesystem spans the machines.
- A5. *Partly resolved by F23.* The repositories were seeded from exact commits, and `ramec` was fast-forwarded clean. Remote `origin` URLs and the `.agents` snapshot versions of the other repositories are unknown, so the role-hash preflight (§5.1 step 5) still applies.
- A6. The remote Herdr default session socket is reachable by a noninteractive SSH command when `herdr` is invoked by absolute path or with an explicit PATH. Behavior for non-default sessions is unverified. F22 shows forwarding works for the default session. It does not show how a noninteractive SSH launcher reaches the socket under the `env -i` allowlist.
- A7. Remote native accounts (Claude, Codex) are already authenticated by the owner on each machine.

## 3. Machine selection and transport boundary in `ruach-herdr`

### 3.1 Proposal: remote delegation of the whole launcher

Add `--machine SELECTOR` to `worker.ts resolve|start`. Without it, behavior is unchanged and byte-for-byte compatible. With it:

1. **Resolve the profile locally** from `herdr machine list --json`. Accept an enabled profile ID or a unique case-sensitive label, which mirrors Herdr's own selector rule (F16). Record `{id, label, target, session}`. Labels can be renamed, so the **profile ID is the stable key** and the label is for display.
2. **Resolve the selection locally** from the Coordinator checkout's catalogs (`--route` or preferred). The local catalogs are the consumer's authoritative routing policy. The remote launcher is then invoked in direct mode (`--kind --model --effort`), and the local route provenance is recorded in the wrapped result. This avoids requiring remote catalog copies to stay synchronized, and it never lets a remote catalog silently pick a different model.
3. **Invoke the remote launcher once over SSH** with a fixed argv and no shell interpolation of values. The argv is built locally and quoted for a POSIX remote shell exactly once:

   ```
   ssh -o BatchMode=yes -o ConnectTimeout=10 <target> -- \
     env -i HOME="$HOME" PATH=<declared remote PATH> HERDR_ENV=1 RUACH_LAUNCH_ID=<nonce> \
     <remote bun> <remote resources>/skills/ruach-herdr/scripts/worker.ts start \
       --name N --role R --cwd <remote checkout> --repo <remote checkout> --resources <remote resources> \
       --kind K --model M --effort E \
       --branch ruach/<machine-label>/<N> --base <full SHA> --permissions P \
       --result-file <remote temp>/ruach-launch-<nonce>.json
   ```

   `env -i` with a declared PATH addresses the noninteractive-PATH gap (F20) without depending on login-shell dotfiles. It also guarantees that the caller's `CODEX_HOME`, `CLAUDE_CONFIG_DIR` and Git variables never cross the boundary (`$HOME` above expands remotely). Locale variables are forwarded only if the owner wants them. Caveat to verify in Phase 0: `env -i` also drops `USER`, `XDG_*` and `TERM`. The Herdr socket path (`~/.config/herdr/herdr.sock` locally, F15) and native config readers may depend on these. The final allowlist (likely `HOME`, `USER`, `LOGNAME`, `LANG`, and any `XDG_*` the remote already sets) is fixed by a remote probe, not guessed. The worker pane itself receives the Herdr server's environment plus the forwarded `PATH` and `HOME` (F5), not the launcher's SSH environment.
4. **Relay the remote JSON unchanged** inside a wrapper: `{schema_version: 1, machine: {...}, remote: <remote result>, inspection: <ssh-prefixed argv>}`. Exit codes follow the existing contract (F6). One addition: SSH or transport failure *before* the remote launcher reports anything is exit 3 if no remote mutation can have started, and exit 4 if it may have (§5).

Why this boundary:

- Native config ownership must stay on the machine that runs the harness. The Claude adapter materializes a private settings overlay and symlinks into a temp directory, and Codex reads effective config through a daemon or stdio app-server in the requested cwd. Both are filesystem- and process-local to the remote machine. Herdr API forwarding cannot do either (F16: local configuration is not forwarded).
- The remote launcher already has every safety property: pinned base, fresh path and branch, role-hash recheck, a single submission, uncertain-state reporting and awaiting-input detection. Delegation reuses them without duplication.
- It is the same delegation boundary that `references/routing.md` already prescribes for wrappers (F9): forward one result and do not invent a second schema. Here the wrapper only adds a machine envelope.

Rejected alternatives:

- *Per-operation remote calls* (remote `git`, remote `realpath`, remote `herdr` one call at a time from the local launcher). This touches nearly every function in `spaces.ts` and the adapters, multiplies partial-failure points, and still cannot run native config readers remotely.
- *Herdr `--machine` forwarding as the launch transport.* A 0.9.3 client forwards workspace operations (F22), but forwarding covers only the Herdr API. Workspaces, splits and `agent start` could run remotely through it. The Claude settings overlay and symlinks, the Codex effective-config reader, skill discovery and the role-hash recheck would still need the remote filesystem and processes. A hybrid (SSH for preparation, forwarding for the launch space) would split one launch across two transports with two partial-failure seams, and the private material would live on a different machine than the launcher that created it. Use forwarding for monitoring and inspection (§3.3). Revisit if Herdr gains remote native preparation, which is not expected given its configuration-is-not-forwarded rule (F16).
- *A Ruach daemon or agent on each machine.* This contradicts the roadmap's no-service principle (F13).

### 3.2 Machine declaration (consumer-owned)

The launcher needs per-machine facts that Herdr profiles do not hold: the remote checkout of *this* repository, the remote PATH and the remote Bun. These are consumer policy and belong with the other catalogs. I propose an optional `machines.yaml` in the catalogs directory, validated like the other catalogs (exact keys, no aliases, no multiline strings):

```yaml
# .agents/machines.yaml (or config/agent-routing/machines.yaml for Ruach itself)
machines:
  oholiab:
    herdr_machine: 69400a0f6ff332188a4262a1eb7b3490   # saved profile id (label also accepted)
    checkout: /opt/dev/ramec                          # remote canonical checkout of this repository
    path: [/home/metatron/.bun/bin, /home/metatron/.local/bin, /usr/local/bin, /usr/bin, /bin]
    temp: /tmp                                        # optional remote temp root
    resources: /opt/dev/ramec/.agents                 # optional; default <checkout>/.agents (Ruach itself: its source checkout)
```

- Only declared machines can be selected. An undeclared `--machine` fails exit 2 before any SSH call.
- Bun is resolved from the declared PATH on the remote, never from a guessed path.
- No credentials, keys or hostnames beyond the Herdr profile reference. The SSH target comes from Herdr's profile, so there is one source of truth for connection identity.
- Ruach never writes this file or any SSH configuration.

### 3.3 After launch: monitoring and inspection

- Inspection argv in results is machine-qualified, for example `["ssh","oholiab","--","env","PATH=…","herdr","agent","read","N","--source","recent-unwrapped"]`. Users attach interactively with `herdr --remote oholiab` (supported in 0.9.0, F15).
- When the *selected client's* `--help` (feature detection, never documentation) shows a global `--machine`, inspection argv may switch to `herdr --machine <id> agent read …`. This is a transport substitution for Herdr API calls only. Launch remains remote delegation.
- F22 shows that the client version, not the local server, determines forwarding. Ruach must not download, install or copy a client. An owner-supplied client path, declared per consumer or user (D12), is feature-detected and recorded with its version in results. Without one, SSH remains the monitoring transport. The temporary `/tmp` client is not a durable dependency.
- Read-only monitoring (`agent list|get|read|wait`) is the first forwarding use. Mutating forwarded calls (`agent prompt`, `send-keys`) follow the same no-retry rule as launch: after a connection failure, inspect before resending (F16).

## 4. Machine-scoped opaque identifiers

Herdr IDs (`w1`, `w1:p1`) and agent names are unique only within one server (F16). Proposal:

- Every launch result, task record and receipt carries the machine identity next to each Herdr ID. Its shape is `{machine_id, machine_label, workspace, pane, agent}`, where `machine_id` is the Herdr profile ID or the literal `local` for the caller's own server.
- In prose and ledgers, write a qualified string `<machine_label>/<workspace_id>`, for example `oholiab/w3:p2`. Comparisons use `machine_id`.
- Never pass an ID to a command on another server. Never treat `--current` or an inherited `HERDR_*` variable as identifying a remote object. Rediscover remote IDs from the remote's own responses (F16).
- Agent names: Herdr enforces uniqueness only per server, so the Coordinator keeps worker names **unique per task across all machines**. Monitoring by name then cannot hit the wrong worker if a command is mis-targeted.

## 5. Preflight, partial failure, idempotency, reconnect and capability mismatch

### 5.1 Remote preflight (read-only, before any mutation)

In order, each failing closed with exit 2 or 3 and no fallback to local:

1. The profile exists, is enabled, and its label resolves to the declared ID.
2. SSH reachability with `BatchMode=yes`. Interactive auth prompts are failures, not dialogs to answer.
3. Remote executables are present under the declared PATH: `bun`, `git`, `herdr` and the selected harness, recording **resolved absolute paths and versions**. Two Bun versions coexist (F24), so the preflight reports which one the declared PATH selects. An assignment or consumer recipe that needs a specific version names it, and a mismatch fails exit 3.
4. Remote Herdr server status and protocol come from remote `herdr status`. The client and server on the remote must be compatible with each other. Local↔remote protocol equality is required only once `--machine` forwarding is used.
5. Remote Ruach resources come from remote `worker.ts resolve --offline --role R --kind K --model M` in the declared checkout. Its `selection.roleHash` must equal the local role hash, which catches stale or locally edited remote snapshots. Its `schema_version` must be one the local wrapper understands. For a consumer with a committed `.agents` snapshot, matching role hashes mostly follows from both checkouts being at the same snapshot version.
6. The base commit exists on the remote: `git -C <checkout> cat-file -e <SHA>^{commit}`. If it is absent, deliver it first (§8). The launcher never fetches or pushes on its own.
7. The remote dry-run (`start --dry-run` remotely) checks the destination path, branch freshness and native capability.

### 5.2 Partial failure and idempotency

SSH adds one new failure mode: **the connection drops after the remote launcher has mutated state**, so the result is lost.

- The remote launcher writes its single JSON result to a caller-chosen `--result-file` as well as stdout. The file is created exclusively, with mode 0600, under the declared remote temp. Proposed launcher change: one option, written atomically by rename.
- The remote command runs under `setsid`, so an SSH hangup does not kill it mid-launch and leave a half-created worktree with no record.
- On transport loss, the wrapper reports exit 4 with `machine_state: unknown`, the nonce, the expected result-file path, and recovery argv: read the result file, `herdr agent get N`, `git worktree list`, and `git show-ref ruach/<machine>/<N>`, all on that machine.
- **No automatic retry.** A relaunch uses a fresh name, or the same name only after the caller has established that no agent, worktree or branch with that name exists on that machine. Fresh-name-or-fail (F4) already makes accidental double launches visible instead of silent.
- `RUACH_LAUNCH_ID` is recorded in the result. It may also go into the workspace label so that a recovering Coordinator can match orphaned resources to a launch.

### 5.3 Reconnect

Remote Herdr sessions are server-side and persist independently of SSH. A dropped SSH connection or a sleeping laptop does not stop a remote worker. Reconnecting means re-running a remote `herdr agent get/read` or `herdr --remote`. The task record (machine-qualified) is enough to resume (§9).

If the remote Herdr server was restarted, sessions are gone but the worktree and branch remain. Confirm the old agent is absent, then relaunch with a fresh name and `--base <branch head>` on a new branch, or continue the same branch by owner-approved convention.

### 5.4 Capability mismatch

The remote launcher already probes native help and versions and Herdr kind support (F1, adapters). Its exit 3 is relayed verbatim with the machine identity. **Routes and machines never change automatically.** A missing Codex on `tubal` does not move the worker to `oholiab` or to local. The Coordinator reports to the user, and the user or consumer policy decides. This extends the existing "routes are explicit" rule to "machine is part of the selection."

## 6. Per-machine worktrees and branch namespace

- Worktrees are created by the remote launcher under the remote checkout's default parent, `/opt/dev/<repo>-worktrees/<name>`, or an explicit `--worktree`. Remote paths are always absolute in results.
- Default branch for remote launches: **`ruach/<machine-label>/<worker-name>`**. Local launches keep `ruach/<name>`. Branches created on different machines therefore cannot collide when fetched into one integration repository, even if a name were reused. `ruach/oholiab/x` and `ruach/x` can coexist as ref names, because `ruach/oholiab` is not itself a branch.
- In the integration checkout, fetched branches land in **`refs/remotes/<machine-label>/<branch>`** through an explicit refspec, without adding a configured remote unless the owner chooses to (§12, D4). Local `refs/heads` stay owned by the integration machine, so a remote can never move a local branch.
- Bases delivered to a remote land in **`refs/ruach/incoming/<task>/<worker>`** on the remote. That namespace is outside `refs/heads`, so it never touches the remote's checked-out branch and cannot trip `receive.denyCurrentBranch`. It is removed during cleanup.
- Linked mode on a remote requires a remote parent workspace ID for that repository. Background development workspaces now exist (F27, for example `oholiab/w4:p1` for Ruach), so linked mode is practical sooner than first assumed. Pass the remote parent explicitly as `--parent-workspace <id>`. The remote launcher sets `HERDR_WORKSPACE_ID` from it, and the existing `linkedParent` check verifies it against the remote repository (F2). An ID from another machine fails that check. Without a parent, Phase 2 keeps standalone remote workspaces.

## 7. Self-contained assignments and durable reports

- **The assignment travels as a file plus a hash.** After launch, the Coordinator writes the assignment into the remote worktree at the consumer's assignment path by piping it over SSH stdin to an exclusive-create write. It then verifies the remote SHA-256 and sends the prompt through remote `herdr agent prompt`. The prompt names the path and its hash. This keeps the existing contract ("write the assignment in the worker's workspace; send it through the authorized mechanism") with no Coordinator commits.
- The worker commits the assignment **unchanged** with its report when required. After fetch, the integration side checks `git rev-parse <H>:<assignment path>` against the hash recorded at send time, which proves that the worker saw the intended assignment.
- **Reports travel with Git.** The durable report is committed on the worker branch, validated remotely by the worker with `ruach-handoff validate --repo`, and validated again on the integration machine after fetch, where its `_revision` fields must resolve (F10).
- Assignments must be machine-explicit. They name the machine, the remote worktree path, which commands run on which machine, whether out-of-sandbox execution is allowed there, and the declared machine-local resources (ports, datasets, Docker), which remain consumer-owned as in roadmap 0.3.x.

## 8. Git versus alternatives for handoff

### 8.1 What has to move

| Material | Moves between machines? | Mechanism |
|---|---|---|
| Committed source, assignment and report | Yes, with identity | Git objects (§8.3) |
| Dirty work (uncommitted tracked or untracked files) | **No.** It must become a commit first | Worker commits; a salvage commit for crash recovery (§10) |
| Ignored build outputs and caches (`node_modules`, `bin/obj`, `.bun`, Docker layers) | No | Rebuilt per machine from lockfiles (`bun install --frozen-lockfile`, `dotnet restore`) |
| Datasets and large binary inputs | Only when declared | Consumer-declared manifest `{path, size, sha256, source}` and a consumer recipe (rsync or download) with checksum verification, or Git LFS if the consumer already uses it |
| Secrets, accounts, tokens | **Never** | Provisioned by the owner per machine; receipts say "none transferred" |
| Test evidence | As claims in the committed report; large logs stay put | Evidence is bound to `(revision, machine, toolchain)` (§8.4) |

### 8.2 Comparison

| Approach | Identity | New credentials | Publishes outside owned machines | Moves dirty or ignored state | Failure behavior | Verdict |
|---|---|---|---|---|---|---|
| **Central remote** (GitHub origin) | Exact SHAs | Remote push credentials (A3; owner is not copying them) | Yes: WIP branches on the hosting service | No | Durable even if a machine dies; idempotent push and fetch | Good when the owner authorizes credentials and WIP publication. Not the default |
| **Direct SSH Git** (integration↔remote) | Exact SHAs | None beyond the existing local→remote SSH (F17, F20) | No | No | Fetch and push are atomic per ref and idempotent to rerun; work since the last fetch depends on the remote disk | **Recommended default** |
| **Git bundle** (create, copy, verify, fetch) | Exact SHAs; the bundle file can be checksummed and archived | None, but a file transfer is still required | No | No | Works without live bidirectional Git; stale-prerequisite errors are explicit (`git bundle verify`) | **Proven for initial seeding** (F23). **Fallback** for steady-state handoff when direct Git is unavailable, and for archival or offline transfer |
| **Patches** (`format-patch`/`am`) or diffs | **Lost**: `am` creates new commits, and binaries or modes are fragile | None | No | Only what the diff contains | Partial application possible | Not for reviewed handoff. Acceptable only as a human-readable proposal |
| **rsync of a worktree** | None | None | No | **Yes** (danger: secrets, caches, half-written files, `.git` corruption if included) | Non-atomic | Not for source. Allowed only for declared non-source assets with a checksum manifest |
| **Shared filesystem** (NFS or sshfs for `/opt/dev`) | Same repository, so no transfer | Mount setup | No | Everything is shared | Cross-host Git locking, `index.lock` and mmap hazards, a single point of failure, latency; absolute `gitdir` paths tie worktrees to one mount layout | Rejected for source repositories. At most a read-only dataset mount, owner-provisioned |

**Is Git the best tool?** Yes, for source and handoff artifacts. Every downstream contract (`candidate_revision`, `tested_revision`, `reviewed_revision`, `delivered_revision`, merge-only-if-destination-unmoved) assumes content-addressed commits. Any non-Git transport would have to recreate that identity. The real choice is the *Git transport*, and direct SSH is the smallest one that adds no credentials and publishes nothing.

### 8.3 Recommended transport details

- **Base to a remote, push into a private namespace from the integration machine:**
  `git push --no-verify ssh://<target>/<abs checkout> <SHA>:refs/ruach/incoming/<task>/<worker>`
  This needs only local→remote SSH (A2). If the base is already on origin and the remote can read origin, a remote `git fetch origin <SHA>` is equivalent. Either way, the launcher only *checks* for the base (§5.1 step 6).
- **Results from a remote, fetch into a machine namespace on the integration machine:**
  `git fetch --no-tags ssh://<target>/<abs checkout> refs/heads/ruach/<label>/<worker>:refs/remotes/<label>/ruach/<label>/<worker>`
  Do not use a `+` force prefix. A non-fast-forward update means the branch history was rewritten, and that is surfaced for a decision.
- `git -c protocol.version=2` is fine. The remote needs only `git-upload-pack` and `git-receive-pack` on the noninteractive PATH; `/usr/bin` already covers them (F20).
- Fetching from a non-bare remote repository with linked worktrees is safe, because refs and objects are shared by the main checkout's `.git`.
- **Seeding versus steady state.** Bundles suit creating a repository on a new machine (F23): one verified file per repository and no pre-existing remote repository needed. Once a checkout exists, direct SSH Git is cheaper per handoff, because it transfers only missing objects and no file has to be copied, verified and cleaned up. Both preserve exact SHAs, so a later receipt can name either method.
- **Several repositories.** Eden's children and the other seeded repositories are independent (F23). Each repository gets its own base, branch, fetch and receipt, so a feature that spans repositories has one receipt per repository. Ruach claims no cross-repository atomicity. The task record lists the set of per-repository revisions that were integrated and verified together.

### 8.4 Machine-specific test evidence

A test result is a claim about `(revision, machine, toolchain, environment)`, not about the revision alone. The report and receipt record `tested_on: {machine_id, label, os/arch, bun/dotnet/node versions, harness}` alongside each command and exit code. A pass on `oholiab` does not count as a pass on the integration machine. **The integrated candidate is verified on the integration machine, or on the consumer-declared verification machine, before review and delivery.** Remote results are useful earlier evidence and for platform-specific coverage. Environment failures on a machine (sockets, disk, Docker) are classified "not verified: environment", following roadmap Track F2.

## 9. Practical handoff sequence

Roles follow the existing contracts. The Coordinator does launch preparation and sends assignments. Fetching, verification, integration and delivery go to an Implementer on the integration machine (F11, F12).

**Outbound (integration machine → remote worker)**

1. The Coordinator selects base `B`, a full SHA from the integration checkout, and the machine `M`, by user request or consumer policy.
2. The Coordinator delivers `B` to `M` (§8.3 push into `refs/ruach/incoming/<task>/<worker>`) and records it in the task record.
3. Remote preflight (§5.1), read-only.
4. `start --machine M --base B` creates `ruach/<M>/<worker>` on `M` and returns machine-qualified IDs.
5. The Coordinator writes the assignment into the remote worktree, verifies the hash, and prompts through remote `herdr agent prompt` after the worker reports ready (handle `awaiting-input` per F6 with user approval, for example through `herdr --remote M`).

**Return (remote worker → integration machine)**

6. The worker commits the code, the unchanged assignment and its report, validates the report, and returns a terminal handoff with SHA `H`.
7. The integration Implementer verifies the remote state read-only. `git -C <remote worktree> status --porcelain --untracked-files=all` must be empty, and `git rev-parse HEAD` must equal `H`.
8. Fetch (§8.3), then verify: `cat-file -e H^{commit}`, the fetched ref equals `H`, `merge-base --is-ancestor B H`, the assignment blob hash matches, and the report validates locally with `--repo`.
9. Create a retained local branch from the fetched ref, for example `task/<worker>`. From this point the work no longer depends on `M`'s disk.
10. Write the receipt (below). Integration, verification on the integration machine, review and delivery then proceed exactly as for a local worker.
11. Cleanup by the Coordinator, once `H` is reachable from a retained local branch: close the remote worker session, remove the remote worktree remotely (`git worktree remove` in the remote checkout), delete `refs/ruach/incoming/<task>/<worker>` on `M`, and remove the remote result file and private material. Keep the remote branch until delivery or by owner retention policy, then delete it remotely.

**Receipt fields.** Proposed as an optional block in the integration report; the handoff schema needs no change (F10):

```yaml
transfer_receipts:
  - direction: from-machine            # or to-machine
    method: ssh-fetch                  # ssh-push-incoming | ssh-fetch | bundle | origin
    machine_id: 69400a0f6ff332188a4262a1eb7b3490
    machine_label: oholiab
    source: oholiab:/opt/dev/ramec refs/heads/ruach/oholiab/feat-x
    destination: local:/opt/dev/ramec refs/remotes/oholiab/ruach/oholiab/feat-x
    retained_branch: task/feat-x
    remote_clean: "status --porcelain --untracked-files=all empty at <time>"
    assignment: "docs/assignments/T/feat-x.md sha256=<hex> (matches sent)"
    report: docs/reports/T/feat-x.md
    tested_on: "oholiab Debian13 x86_64 bun <v> dotnet <v> (claims from worker report)"
    not_transferred: "ignored caches rebuilt per machine; datasets per manifest <ref>; secrets none"
    bundle_sha256: null                # set for method bundle
    residue: "remote worktree removed; remote branch retained until delivery; incoming ref deleted"
base_revision: <B>
received_revision: <H>
```

The top-level `base_revision` and `received_revision` are validated mechanically (F10) once fetched. Per-receipt SHAs inside the list are prose and are covered by those top-level fields.

## 10. Failure recovery

| Failure | Detection | Recovery (never automatic route, machine or name change) |
|---|---|---|
| SSH unreachable or auth prompt | Preflight step 2, exit 3 | Fix connectivity. Relaunch on the same machine only. |
| Transport lost during launch | Wrapper exit 4, `machine_state: unknown` | Read the remote result file, then `agent get`, `worktree list`, `show-ref`. Proceed from the known state. |
| Base missing on remote | Preflight step 6, exit 2 | Deliver the base (§8.3), then repeat preflight. |
| Remote role hash differs | Preflight step 5, exit 2 | Owner or Coordinator updates the remote snapshot as a separate preparation task. The launcher never updates remote checkouts. |
| Capability mismatch (harness, Herdr kind, Bun) | Remote exit 3, relayed | Report. Policy or the user chooses. |
| Native trust or onboarding dialog | `awaiting-input` | The user answers on the remote (`herdr --remote M`). No replacement worker. |
| Remote Herdr restarted, session lost | `agent get` absent; worktree present | Relaunch with a fresh name from the branch head. Preserve the branch. |
| Worker finished but tree dirty | Return step 7 | Ask the worker to commit. If the worker is gone, the Coordinator assigns a salvage commit to a fresh worker on that machine, on branch `ruach/<M>/<worker>-salvage`. Never rsync. |
| Branch rewritten (non-fast-forward fetch) | Fetch rejects | Treat as a decision: inspect both histories and choose explicitly. |
| Fetch interrupted | Non-zero fetch | Rerun. Ref updates are atomic and objects are content-addressed. |
| No direct Git path | Fetch or push fails for structural reasons | Bundle fallback: remote `git bundle create` of `B..H` (with branch ref), copy, `git bundle verify`, fetch from the bundle, record `bundle_sha256`. |
| Machine lost before fetch | SSH fails persistently | Work after the last fetch is lost. Mitigation: checkpoint fetches at worker milestones (cheap and read-only to the remote), or authorized origin pushes (D1). |

## 11. Concurrency and merge authority

- One Coordinator per task (F11), and one **integration checkout** per task, declared in the task record. Only that checkout creates integration branches, merges and deliveries.
- Remote machines own only their worker branches (one worker per branch, append-only by convention) and the incoming refs the Coordinator pushed. They never merge into `main` or into other workers' branches, and never push to origin unless D1 authorizes it.
- Fetches are read-only to remotes and safe to run concurrently. Pushes to `refs/ruach/incoming/*` are made only by the Coordinator, one per worker, before launch.
- Parallel workers on several machines are integrated serially on the integration checkout, following the existing destination-unmoved delivery rule (F12). A cross-machine merge queue is not needed beyond that.
- Delivery to origin (`git push`) remains a separately authorized delivery step from the integration checkout only.

## 12. Owner decisions required

- D1. **Central remote.** Should remote machines get GitHub push credentials, so that WIP branches are published to origin (durability, but outward-facing and credential-bearing)? *Recommendation:* no. Use direct SSH Git, plus checkpoint fetches.
- D2. **Pushing into remote repositories.** May the integration machine write `refs/ruach/incoming/*` in remote checkouts? This is a mutation of owned machines, outside `refs/heads`. The alternative is remote→local SSH (A2) or origin-published bases only. *Recommendation:* allow it, limited to that namespace.
- D3. **Integration machine.** Should integration always happen on the Coordinator's local machine, or may a remote be declared the integration machine, for example for Linux-only verification? *Recommendation:* the Coordinator's machine by default, with a declared alternative per task.
- D4. **Configured remotes.** Fetch by URL with explicit refspecs (no repository config changes), or add named Git remotes (`oholiab`, `tubal`) to local checkouts? *Recommendation:* URL and refspec. Named remotes are a user convenience the owner can add.
- D5. **Machine declaration location.** Consumer `machines.yaml` beside the catalogs (recommended), or CLI flags only through wrappers?
- D6. **Remote `HERDR_ENV=1`.** The launcher's "authorized Herdr session" check would be satisfied by an explicit machine launch over SSH rather than by an inherited pane. Is that acceptable authorization semantics? *Recommendation:* yes, only through `--machine` with a declared machine and a passing remote `herdr status`.
- D7. **Branch namespace.** `ruach/<machine-label>/<worker>` for remote launches (recommended) or a flat `ruach/<worker>` with task-unique names only.
- D8. **Herdr upgrade.** If and when to make a forwarding-capable client (0.9.3 or later, F21 and F22) the local default. The launch design does not depend on it. Monitoring benefits from it. Not done by the current Coordinator.
- D11. **Remote environment source.** Should the launcher use an explicitly declared PATH (recommended: reproducible, recorded, independent of dotfiles), or source the user-local dev-env (F25), which runs user-owned shell code on every launch? If dev-env is chosen, declare its path in `machines.yaml`, and record its hash and the resulting PATH in the result.
- D12. **Forwarding client.** Should an owner-supplied Herdr client path be declared for `--machine` monitoring (per user or per consumer), and where? Ruach never installs or copies one.
- D9. **Roadmap placement.** For example, as a 0.3.x item next to the resource ledger and idempotent launch, which it extends with a machine field, or as a 0.4 or after-0.4 task-driven item. Other roadmap agents own that file.
- D10. **Datasets and secrets.** Per-machine provisioning of datasets, Docker images and accounts stays with the owner. Confirm that Ruach should only reference declared manifests and never transport them.

## 13. Phased implementation plan

Each phase starts with a failing public-boundary regression (roadmap principle). No phase mutates remote machines in tests.

**Phase 0: runbook only, no code (immediately usable).**
Document in `docs/operations.md` the manual sequence from §9, using today's tools: `ssh <target> env PATH=… herdr …`, the remote launcher invoked over SSH, push-into-incoming, fetch-into-namespace, and the receipt template. Record the read-only verification of the remaining assumptions on `oholiab` and `tubal`: remote harness versions, GitHub read access, the socket under the `env -i` allowlist, which Bun the PATH selects, and the dev-env PATH contents (F24, F25). Include the bundle seeding procedure already used (F23) as the documented new-machine bootstrap. This lets the owner run multi-machine work now with full auditability. Tests: docs and link checks only.

**Phase 1: transport checks as receipt conventions (no launcher change).**
Add the receipt block and the "evidence is per machine" rule to `ruach-handoff` guidance and to the assignment specimen. Optionally add a tiny verification script, `verify-received.ts` (ancestor, ref equality, assignment blob hash, report validation), if Phase 0 use shows repeated friction. Tests: real temporary Git repositories standing in for two machines (file-path URLs), covering fetch into a namespace, rejection of non-fast-forward, assignment hash mismatch, and report revision resolution only after fetch.

**Phase 2: `--machine` remote delegation in `ruach-herdr`.**
`machines.yaml` validation; profile resolution against `herdr machine list --json`; local selection with direct remote invocation; the SSH argv builder with `env -i` and declared PATH; remote `resolve --offline` role-hash comparison; `--result-file` with `setsid`; the machine envelope and qualified inspection argv; the default branch `ruach/<label>/<name>`; optional `--parent-workspace <remote id>` for linked mode, verified remotely (a wrong-machine ID must fail before mutation). Required tests, using a **fake `ssh`** that executes the remote argv locally under a separate fake HOME, PATH and Herdr (the existing `fake-cli.ts` pattern):
- an undeclared, disabled or ambiguous machine fails exit 2 with zero SSH invocations;
- a label renamed so that it no longer matches the declared ID fails before mutation;
- remote PATH missing `bun` or `herdr` fails exit 3 with a diagnostic naming the remote and the executable, and never falls back to local;
- remote role-hash mismatch fails before mutation;
- the remote result is relayed unchanged inside the envelope, with machine-qualified IDs and the exit status preserved for 0, 2, 3 and 4;
- the caller's `CODEX_HOME`, `CLAUDE_CONFIG_DIR` and `GIT_*` variables are absent from the remote environment;
- a simulated drop after mutation yields exit 4, the nonce and result-file recovery argv; the result file is written exactly once; no second start is submitted;
- remote dry-run and resolve issue no mutating remote commands (the fake records argv);
- remote `awaiting-input` is relayed as `ready: false` with remote inspection argv;
- argument quoting: names, paths and models containing shell metacharacters are rejected by existing validation or arrive byte-exact.

Plus one owner-authorized live smoke per machine: dry-run, then a trivial assignment start, fetch back and cleanup. It is recorded as runtime evidence, separate from the fake tests.

**Phase 3: monitoring transport and feature detection.**
Inspection and readiness commands through SSH, switching to `herdr --machine` only when the declared client's `--help` shows it (F22 makes this immediately useful with a 0.9.3 client). This phase can run in parallel with Phase 2, because it touches only result inspection argv and documentation. Tests: feature detection on fake help output; a fake 0.9.0-style client rejecting `--machine` proves SSH is still used; a forwarded connection failure on a mutating call yields inspect-first diagnostics with no resend.

**Phase 4 (task-driven only): bundle fallback helper, checkpoint-fetch convention in the ledger.** (The remote linked-worktree parent moved into Phase 2 as an optional `--parent-workspace`, because remote parent workspaces exist (F27).)
Each item only after Phase 0–2 use shows the need.

## 14. Tradeoffs accepted

- Remote delegation requires a Ruach snapshot and Bun on each machine, plus `bun install --frozen-lockfile` in the remote skill. That bootstrap is per machine (F14) and is already the Coordinator's current preparation work. In exchange, native config handling has a single implementation and stays on the machine that owns it.
- Direct SSH Git leaves unfetched work on the remote disk only. Checkpoint fetches reduce that exposure without credentials or publication. Owners who want hosted durability choose D1.
- Fetching by URL without named remotes is more verbose for humans, but changes no repository configuration as a side effect of development.
- Standalone remote workspaces in Phase 2 lose linked-worktree grouping in the remote Herdr UI. That is cosmetic, and an explicit remote parent can be added later.
- Per-machine verification can double some test time. It is the only honest basis for a claim about the integrated candidate.
