# Multi-machine application development: design (Architect, Sonnet 5.5, council round 1)

Status: proposal, independent first-round answer. It is architecture advice, not implementation authority. It was written without reading the other council members' answers. Nothing here has been run against a remote machine.

Labels used throughout: **Fact (repo)** is read from this checkout. **Fact (session)** was observed locally in this session with read-only commands. **Fact (given)** comes from the assignment's verified setup context and was not re-verified. **Assumption** is unverified. **Proposal** is my recommendation. **Decision** needs the owner.

## 1. Recommendation in brief

1. **Keep `ruach-herdr` single-host and run it where the worker will live.** The smallest viable machine boundary is a thin wrapper that executes the existing `worker.ts` on the selected machine over its saved SSH target, with a pinned `PATH` and the Herdr authorization gate set deliberately. `worker.ts` does not change in the first two phases. Do not thread a transport through the launcher: it touches the filesystem, Git, native config and Herdr in dozens of places (§4.1).
2. **Machine identity is explicit and structured.** Every Herdr ID or agent name that crosses a machine boundary is stored as a pair `{machine, id}`, where `machine` is the saved Herdr profile ID (not the renameable label). Ruach never parses or compares native IDs across machines (§4.3).
3. **Git remains the transport for committed source, but not as a shared central remote.** Use the control machine as a hub: it fetches over SSH from each machine into per-machine tracking refs and pushes only pinned commits into a non-branch namespace on the receiving machine. Bundles are the verified fallback. Patches, rsync and shared filesystems are not source transports (§4.7). Git is the best tool for *commits*; it is the wrong tool for dirty work, ignored assets, caches, datasets, secrets and machine-specific evidence, each of which gets its own rule (§4.8).
4. **Single writer per ref and a single integration authority.** A machine writes only `refs/heads/ruach/<machine>/…`. Only the control machine merges into integration branches and, with owner approval, publishes (§4.12).
5. **Reconnect by observation, never by relaunch.** An SSH drop after dispatch is an uncertain launch (exit 4). Recovery reads remote state by deterministic keys (name, branch, path); it does not retry `start` (§4.5).
6. **Build in phases, read-only first:** documented runbook, then `machine preflight`, then `machine start`/`observe`, then Git handoff recipes, then optional `herdr --machine` transport and publication (§6).

## 2. Verified basis

### Fact (repo)

- `skills/ruach-herdr/scripts/worker.ts` is one local process. It resolves `herdr` and the native CLI from the local `PATH` (`worker.ts:71`), requires `HERDR_ENV=1` (`:81`), reads `<repo>/.agents` for resources and catalogs from the *source checkout* (`:55`), checks live agent-name uniqueness on that Herdr server only (`:92-96`), plans and creates the worktree (`:98`), prepares native argv, forwards `PATH`, `HOME`, `CODEX_HOME` and `CLAUDE_CONFIG_DIR` into the new pane (`:120`), and submits one `herdr agent start`. It never retries.
- Every subprocess goes through `run()` in `scripts/process.ts:24`, with a pinned absolute `PATH` and `GIT_*` stripped for Git. Adapters also use local filesystem reads directly (Claude settings, skill scans, symlinks into a private temp dir; Codex reader and config), so a transport hidden inside `run()` would not cover them.
- Worktree defaults: destination `<checkout-parent>/<checkout-name>-worktrees/<name>`, branch `ruach/<name>`, base the source checkout's committed `HEAD`. Existing paths, branches and live names are rejected, never reused (`spaces.ts:14-33`, `worker.ts:96`). Linked-worktree mode needs `HERDR_WORKSPACE_ID` of a workspace of the same repository; otherwise the launcher falls back to a standalone workspace and reports why.
- Failure contract: exit 4 means post-mutation uncertainty; the result reports `worktree_state`, `submission_state`, workspace and pane; "never treat a failed startup as proof that submission did not occur". Awaiting-input (native trust dialog) is exit 0 with `ready: false`.
- Handoff: `ruach-handoff` requires a leading YAML block, allows additional metadata, and checks every top-level `*_revision`, `*_baseline`, `revision`, `baseline` and `destination_before` field with Git against the report's repository. Reports never cite their own commit.
- Policy: one coordination owner per task (`docs/coordination.md`); never-push default and "remote publication is a separate explicit step" (README, roadmap F4); no global harness settings, no credential copying, no new always-running service (roadmap, "Explicitly not planned"); uncommitted source is not copied into a worktree; resource ledger and runtime isolation per worktree are consumer-owned (roadmap 0.3.x).
- Nothing in the repository mentions machines, SSH or remote launch except the operations guide's note that runtime integrity must be verified per machine (`docs/operations.md:181`).

### Fact (session, read-only, local)

- Local Herdr is 0.9.0, protocol 22, server running and endpoint-compatible (`herdr status`).
- `herdr --machine oholiab agent list` fails with `unknown option: --machine`. The user-installed Herdr skill (`~/.agents/skills/herdr/SKILL.md`, lines 93-103) documents `--machine`, while `herdr --skill` of the installed 0.9.0 binary instead says to run remote control commands on the intended host with its explicit session. The documentation is ahead of the binary.
- `herdr machine list --json` returns for each saved profile `id` (32 hex), `label`, `target` (SSH target), `session`, `enabled`, `selected`. Both `oholiab` and `tubal` are enabled with session `default`.
- Herdr's own guidance: IDs and agent names are scoped to one server; two machines can both have `w1:p1` or an agent named `reviewer`; remote worktree paths must be absolute or `~`-prefixed; a connection failure does not prove a mutation was not applied; a missing method is not permission to stop or upgrade a server.

### Fact (given)

`/opt/dev` is the local root (ruach, ramec, enoch, pralice, dirtest, eden, ramec-brainlab, tehom-brainlab). `oholiab` and `tubal` are Debian 13 x86_64, with `/opt/dev` writable by `metatron`, an existing ramec checkout, Bun and .NET under user directories, Git, Just, Python, Docker, running Herdr servers and installed Codex and Claude. Non-interactive SSH `PATH` omits user bins. Remote commands work over the saved SSH targets with the remote user-bin Herdr. The Coordinator is preparing toolchains and repositories and will not stop or upgrade servers or copy credentials.

### Assumptions

- A1. A non-interactive SSH session can reach the remote Herdr server through its default socket without `HERDR_ENV` (the Coordinator reports remote commands work; the mechanism is not verified).
- A2. The remote machines cannot necessarily reach the control machine or each other, and hold no credentials for any hosted Git remote.
- A3. Native logins (Claude and Codex accounts) exist on each machine only if the owner created them there; Ruach cannot verify account access (consistent with `references/adapters.md`).
- A4. Herdr IDs may be reused after a server restart. Not verified.
- A5. A dropped non-pty SSH session lets the remote launcher run to completion, with only its final output lost. Not verified; the design must hold either way.
- A6. The consumer repositories on the remote machines carry a `.agents` snapshot (or a Ruach checkout exists) so a remote launcher and its dependencies can be present. Only ramec is known to exist remotely, and its `.agents` state is unknown.

## 3. Principles

- Reuse before invention: Herdr owns the saved-machine profile and SSH target; Git owns commits; the consumer owns policy and the task record. No daemon, scheduler, database or universal mailbox.
- The control machine is authoritative; remote machines produce candidates.
- Fail closed and read-only until authorized: preflight never mutates; capability mismatch is an error, not a fallback.
- Evidence is bound to what produced it: a revision, a machine and an environment fingerprint.

## 4. Design

### 4.1 Machine boundary: run the launcher on the target

Options considered for the smallest boundary:

| Option | Reach | Verdict |
| --- | --- | --- |
| A. Prefix Herdr calls with `--machine X` inside `worker.ts` | Herdr only; Git, native config, role files and private temp files stay local, so worktrees and agents would disagree about where they are. Also the local binary rejects the flag (Fact, session). | Rejected |
| B. Abstract `run()` and every filesystem read behind a local/SSH transport | Complete, but touches `process.ts`, `spaces.ts`, `skills.ts`, `native-codex.ts`, both adapters, and the symlink and temp-file materialization. Large surface and new failure modes in security-sensitive code (roadmap A4, A6). | Rejected |
| **C. Execute the unchanged launcher on the target** | Everything the launcher assumes (one host) stays true. Only inputs change: remote `--cwd`, `--repo`, resources and catalogs paths. | **Proposed** |

Shape (Proposal): a new `scripts/machine.ts` in `skills/ruach-herdr`, a sibling of `worker.ts`, with subcommands `list`, `preflight`, `start` and `observe`. `start` and `--dry-run` build one fixed remote command, for example:

```
ssh -a -o BatchMode=yes -o ConnectTimeout=10 -o ServerAliveInterval=15 <target> -- \
  env PATH=<declared, absolute> HERDR_ENV=1 bun <repo>/.agents/skills/ruach-herdr/scripts/worker.ts start <quoted args>
```

Rules:

- Arguments are POSIX single-quoted by one tested function; NUL, newline in values and option-looking values are rejected. SSH hands the string to a remote shell, so quoting is a security boundary.
- SSH options never relax host-key checking and never forward the agent (`-a`), so a worker cannot borrow the control machine's credentials. Ruach does not add or edit SSH config; it uses the target string from Herdr's saved profile.
- `PATH` for the remote command is built from a declared list of absolute directories (for example `$HOME/.bun/bin`, `$HOME/.local/bin`, the .NET directory, then system directories). The launcher's `pinnedPath()` and pane `--env PATH=` forwarding then give the remote agent the same toolchain visibility. It is declared, not discovered through a login shell, so it is auditable and unaffected by dotfiles.
- `HERDR_ENV=1` is set on the remote only when the *local* caller already satisfies the same gate (an authorized local Herdr session) and the profile is enabled. The gate keeps meaning "an authorized session asked for this"; it is not forged.
- The wrapper prints the launcher's JSON unchanged inside an envelope (§4.3) and keeps exit codes: 0, 2, 3, 4 as today. New codes in the same classes: `machine_unknown`, `machine_disabled`, `machine_ambiguous` (2); `machine_unreachable`, `machine_incompatible` (3, before any dispatch); `result_lost` (4, after dispatch).
- Launcher in the remote Ruach copy: the remote runs *its own* installed `ruach-herdr` and role files, so it needs a snapshot or checkout with `bun install --frozen-lockfile` done (preflight verifies). Resource and catalog skew is detected by comparing the dry-run's `selection.roleHash`, route and model with the control machine's `resolve` result, a contract the launcher already provides.

Decision-free consequence: remote launches are standalone workspaces, because there is no launching workspace on the remote (`worktree_mode: standalone`, already a supported, reported fallback).

### 4.2 Machine selection and the catalog

Selection input is a saved Herdr profile ID or unique case-sensitive label of an *enabled* profile, resolved from `herdr machine list --json`. The SSH `target` and `session` are read from Herdr and never copied into a Ruach file, so there is one source of truth for connection data. The reserved name `local` means the control machine and cannot be a label.

What Herdr does not know goes in an optional consumer-owned catalog beside the three existing ones (Proposal, minimal):

```yaml
# .agents/machines.yaml
machines:
  oholiab:                         # Herdr label (resolved to a profile ID at run time)
    path: [~/.bun/bin, ~/.local/bin, ~/.dotnet]   # expanded on the remote; must be absolute after expansion
    repos: { ramec: /opt/dev/ramec }              # logical name -> checkout on that machine
    harnesses: [claude, codex]                    # allowed kinds on this machine
```

It is validated like the others (nonempty mapping, no aliases, no unknown fields). Phase 1 may omit it and take `--remote-path` and `--remote-repo` flags; add it only when the flags repeat. No scheduling, no capacity model, no load balancing: the Coordinator names the machine in the assignment, exactly as it names a role.

### 4.3 Machine-scoped opaque IDs

- A reference is a structured pair, never a concatenated string: `{machine: "<profile id>", id: "<native id>"}`. Native IDs contain colons (`w1:p1`), so a string join would be ambiguous; the profile ID is hex, and `local` is the reserved control value.
- The profile ID is the key; the label is recorded for humans and can change (`herdr machine rename` exists).
- The wrapper adds `machine: {id, label, session}` and a `refs` object to the launcher's result: `refs.workspace`, `refs.pane`, `refs.agent` (name), plus `worktree` path and branch (already on that machine). The launcher's own fields (`workspace`, `pane`, …) stay raw and unchanged, so existing consumers do not break. Result `schema_version` stays 1; the envelope fields are additive.
- Ruach never compares native IDs across machines and never passes a remote ID to a local `herdr` command (inherited local IDs do not identify remote panes). Inspection commands in the result are machine-qualified argv (`ssh … herdr agent read NAME …`).
- IDs are *hints*, validated before use by the same triple the launcher already checks: agent name, kind and pane (`worker.ts:141-143`). After a server restart or any doubt, rediscover by agent name (A4).
- Task records key resources by `(machine, name)`. Agent names need only be unique per server, but Coordinator-generated names should be globally unique anyway so humans and logs stay unambiguous.

### 4.4 Remote preflight, resources and ownership

`machine preflight --machine M [--repo NAME] [--base SHA] [--harness KIND]` is strictly read-only and prints one JSON document: `{schema_version, machine, environment, checks[], fingerprint}`. Each check is `pass`, `fail` or `unverified` with short evidence. Remote commands are drawn from a fixed read-only allowlist (`uname`, `cat /etc/os-release`, `command -v`, `--version`, `herdr status`, `herdr agent start --help`, `herdr worktree create --help`, `git rev-parse`, `git status --porcelain`, `git cat-file -e`, `git worktree list`, `df`, `test`-style checks). It does not create files, even probes.

Checks:

| Area | Check |
| --- | --- |
| Reachability | SSH connects with `BatchMode`; time bounded |
| OS | Debian 13, `x86_64` (reported; policy lives in the assignment) |
| Toolchain | Absolute path and version of git, bun, just, python3, docker (reachable, read-only), dotnet when requested |
| Herdr | client and server version, protocol, `endpoint_compatible`, supported agent kinds, linked-worktree flags |
| Harness | claude and codex executable and version, against the adapter's gates (for example Claude 2.1.x with patch ≥ 260, `adapters/claude.ts`). Account and model access: `unverified`, always |
| Repository | checkout exists, is Git, dirty state, current HEAD, base commit present, worktree parent writable, free space |
| Ruach copy | snapshot manifest version and resolved commit, launcher dependencies installed, role hash for the requested role |
| Provisioning | Consumer-declared recipe readiness (for example `just ready` output), reported not run by Ruach |

The `fingerprint` is a SHA-256 over the normalized `environment` object (OS, architecture, tool versions, Herdr and harness versions, Ruach snapshot commit). It goes into receipts so test evidence can be bound to an environment.

Ownership:

| Owner | Owns |
| --- | --- |
| Remote machine's user (the owner) | OS, Herdr server and `config.toml`, server upgrades and restarts, native harness installs, logins and `~/.claude`/`~/.codex`, Docker, toolchains, SSH keys |
| Consumer repository | `.agents` snapshot and catalogs, recipes (`just install`), assignments, per-worktree runtime isolation |
| Ruach, when authorized | A worktree under `<repo>-worktrees/`, branch `ruach/<machine>/<name>`, refs under `refs/ruach/in/…`, private launch material in the remote OS temp, the Herdr workspace and agent. The documented Codex reader runtime state remains a side effect |
| Ruach never | Remote global harness settings, credentials, server stop/upgrade, SSH configuration, the main checkout's working tree and HEAD (§4.6) |

### 4.5 Launch lifecycle: partial failure, idempotency, reconnect

Remote launch adds one uncertainty the local launcher does not have: the SSH session can end after dispatch, so the result is lost while the remote launcher may continue. The local rule ("inspect before launching again") extends naturally.

Sequence:

1. `preflight` (read-only), then remote `start --dry-run` through the wrapper; compare role hash, route and model with the control machine's expectation. Mismatch is exit 3 `machine_incompatible`, nothing created.
2. The wrapper generates `launch_id` and derives deterministic keys from the worker name: agent name, branch `ruach/<machine>/<name>`, worktree path. It records `launch_id`, machine and keys in the task record *before* dispatch.
3. Dispatch `start`. On a returned launcher JSON, wrap it (§4.3) and finish.
4. If SSH fails *before* dispatch (connect refused, auth failed): exit 3, nothing mutated.
5. If SSH ends *after* dispatch with no JSON: exit 4 `result_lost`, `submission_state: unknown`. The only permitted next step is `machine observe --machine M --name N`.
6. `observe` is read-only. It reports by the deterministic keys: `herdr agent get N` (name, kind, pane, status), the workspace, `git worktree list` and the branch tip, whether the worktree is clean, and whether a report file exists. It classifies the launch as `not-started`, `partial` (worktree without agent), `started`, `awaiting-input` or `unknown`.
7. `not-started` after a confirmed absence of the worktree, branch and agent allows a fresh launch with a *new* name (existing rejection of used names and branches already makes a same-name retry safe by failing). `partial` and `started` are adopted, never recreated; a partial launch is completed by the owner or removed after its work is known to be reachable from a retained branch.
8. Phase 2 hardening: run the remote launcher detached (`setsid`, output to a private result file under the remote OS temp) so a dropped connection cannot interrupt it between worktree creation and agent start; the wrapper reads the file on reconnect. Needed only if A5 proves false or `result_lost` occurs in practice.

Awaiting-input (native trust or onboarding dialog) is the same exit-0 state as locally. The result's inspection argv is machine-qualified; the owner opens the remote session with `herdr --remote <target>` (the TUI) to answer the dialog. Ruach never answers it.

Capability mismatch rules:

- Server `endpoint_compatible: no`, a missing agent kind, or a missing `worktree create`/`pane split`/`workspace create` flag fails closed (exit 3) or falls back exactly as the launcher already does (standalone workspace). Never stop, restart or upgrade a remote server; the message tells the owner what to upgrade.
- The wrapper must not depend on `--machine`: the local binary rejects it. If a later local and remote Herdr both support machine forwarding, a transport probe may select it behind the same wrapper (Phase 4). The probe, not documentation, decides.
- Local/remote launcher or snapshot version skew: `unverified` in preflight, `machine_incompatible` only when role hash or catalogs differ for the selected route.

### 4.6 Per-machine worktrees and branch namespace

- Each machine has its own checkout at its own `/opt/dev/<repo>` and its own worktrees at `/opt/dev/<repo>-worktrees/<name>`. Worktrees, and especially `.git` directories, are never shared between machines.
- The remote main checkout is a **mirror**: Ruach never edits its working tree and never moves its HEAD. Every launch passes `--base <full-sha>` (never `HEAD`), so a stale or divergent mirror cannot change the base. The launcher resolves it with `rev-parse --verify <sha>^{commit}` and requires it to be present, so a missing commit fails before anything is created (`spaces.ts:32`).
- **Resource skew caveat (Fact, repo):** the launcher reads role files, skills and catalogs from the *source* checkout's `.agents`, not from the new worktree. A mirror whose `.agents` differs from the base commit would launch with the older roles. Phase 1 detects this (role hash comparison) and refuses. An owner-approved mirror policy could later fast-forward a *clean* mirror (Decision D5).
- Branch names for remote launches: `ruach/<machine>/<name>`, passed with the launcher's existing `--branch`. The control machine's own launches keep today's `ruach/<name>`. Reasons: (a) it makes the single-writer rule enforceable by pattern, because the control fetch refspec for machine M can only map `refs/heads/ruach/M/*`; (b) humans can read origin from the ref; (c) names cannot collide across machines. Git cannot hold both `ruach/oholiab` and `ruach/oholiab/x`, so the launcher's existing `branch_unavailable` check rejects a worker accidentally named like a machine. Machine labels must satisfy the same safe-identifier rule as roles.
- Control-side layout: `refs/machines/<machine>/ruach/<name>` (tracking, read-only for humans and agents), `refs/ruach/in/<from-machine>/<task>/<seq>` on a receiving machine (a non-branch namespace, so no checkout or `receive.denyCurrentBranch` conflict), and integration branches only on the control machine.
- A branch is never continued by two machines. Continuing on another machine creates a new branch `ruach/<M2>/<name>` based on the transferred commit, and the receipt records the lineage.

### 4.7 Transport comparison for source commits

| Approach | Needs | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- | --- |
| **Direct SSH Git via the control machine** (fetch from M into tracking refs; push a pinned SHA to `refs/ruach/in/…` on M) | SSH from control to each machine (given); Git on non-interactive `PATH` (system package) | No credentials on remotes; no hosted service; incremental; content-addressed; verifiable; atomic per ref; pull-only for results; fits star topology and the single integration authority | Control must reach every machine; no remote-to-remote path (by design); each machine's repo is a mutable endpoint | **Default** |
| **Git bundle** (`git bundle create`, `scp`, `git bundle verify`, `git fetch`) | File copy only | Works when no direct Git path exists; prerequisites are checked by `verify`; the bundle plus its SHA-256 is a durable, archivable receipt artifact | Extra steps and files; not incremental unless prerequisite commits are named; large files linger | **Verified fallback** and archival form |
| **Central remote** (GitHub or a hub bare repo) | Credentials or SSH on every machine; network from each | Standard review, CI and branch protection; durable and observable; best for teams | Needs credentials on remotes (currently excluded); pushing is outward-facing and conflicts with never-push default; transient agent branches and WIP pollute a shared remote; a hub bare repo adds a new thing to run and secure | **Not the default**; use only as owner-approved publication after merge |
| **Patches** (`format-patch`, `am`) | Text transfer | Human-readable; tiny | New SHAs, so receipts and `*_revision` checks lose identity; fails on binary files, renames and conflicts; loses merge ancestry | Only for a small, explicit, reviewed diff; never as transport of record |
| **rsync / scp of a working tree** | Copy tool | Moves dirty and ignored files | No identity or integrity story; copies `.git`, caches, build output and secrets indiscriminately; races with writers; machine-specific paths | Never for source; allowed only for owner-listed ignored assets with hashes (§4.8) |
| **Shared filesystem** (NFS/sshfs) | Mount | No transfer step | Git relies on file locking, atomic renames and fast stat: unsafe and slow over network filesystems; two machines writing one `.git` or index can corrupt it; couples machines' availability; paths and permissions leak | Never for `.git` or worktrees; at most a read-only dataset share |

Answer to "is Git the best tool?": yes for committed source, because content addressing gives the verifiable identity the whole handoff system already depends on (`*_revision` fields, `git cat-file -e`, never-cite-own-commit, merge-base freshness). The choice that needs care is *topology*, not tool: hub-and-spoke through the control machine, SSH fetch as default, bundle as fallback, central remote as publication only.

### 4.8 What is transferred, and what is not

| Category | Rule |
| --- | --- |
| Source commits | Git, as above. Only commits. Receiver verifies the exact SHA before use |
| Dirty or uncommitted work | Not transferred as dirty. A producer that must hand off unfinished work makes an explicit **WIP commit** on its own branch with `tree_state: wip` in the receipt. The integrator never merges `wip` commits as-is. A handoff with a dirty tree and no WIP commit is rejected. (The roadmap's "explicitly requested uncommitted diff" delivery stays a local-checkout case, not a cross-machine one.) |
| Untracked, not ignored | Included only by being committed. Producer stages deliberately; `git status --porcelain` must be empty at handoff |
| Ignored build output, `node_modules`, `bin`/`obj`, caches | Never transferred. Rebuilt per machine by consumer recipes (`just install`, restore, build). Declared as prerequisites in the assignment |
| Datasets, models and other large assets | A tracked manifest (path, size, SHA-256, source). Provisioned per machine by a consumer recipe; if the owner authorizes a copy, `rsync` or `scp` of only manifest entries, verified by hash after transfer, recorded in the receipt (`ignored_assets`). Git LFS is not proposed |
| Secrets and credentials | Never transferred by Ruach; not in commits; provisioned per machine by the owner. The receipt records `secrets_transferred: none` by assertion of the sending worker, not as proof. Because transport is Git, an ignored `.env` cannot travel by accident, but a committed secret can; assignments state the rule and the Reviewer checks diffs |
| Machine-specific test evidence | Valid only for the tuple (`tested_revision`, machine, environment fingerprint). Another machine re-runs, or the integrator states it did not. Timing- or load-sensitive tests are labeled as such (a RAMEC example: timing assertions failing under load average 64) |

### 4.9 Practical handoff sequence

Producer machine P (`oholiab`), consumer machine R (`tubal`), control machine C (the Coordinator's machine, authoritative). C is always the relay; P and R never talk to each other.

1. **Seal on P.** The worker commits (final or WIP), the tree is clean, the report is committed with `candidate_revision`, `tested_revision`, machine and fingerprint fields (§4.10). Tests that ran are recorded with the machine.
2. **Pull to C.** `git fetch --no-tags --prune --atomic <target>:<repo-path> +refs/heads/ruach/P/*:refs/machines/P/ruach/*` over SSH (agent forwarding off).
3. **Verify on C.** `git cat-file -e <candidate>^{commit}`; tracking ref tip equals the receipt's `candidate_revision`; `git merge-base --is-ancestor <base> <candidate>`; `git rev-list --objects <candidate> --not <known-tips>` completes without a missing-object error (connectivity of the new history); report validates with `ruach-handoff … --repo` on C; tree state is not `dirty`. Any failure stops the sequence and is reported, not repaired.
4. **Decide on C.** Review, integrate or request changes on C (§4.12).
5. **Assign R.** C writes the self-contained assignment (§4.11) and commits it on a coordinator-owned branch as a child of the transferred commit. The resulting SHA `A` is R's base.
6. **Push to R.** `git push <target>:<repo-path> A:refs/ruach/in/P/<task>/<seq>` (objects only; no branch or checkout touched). R's side verifies `git cat-file -e A^{commit}` through preflight `--base A`. Bundle fallback: `git bundle create h.bundle <known>..A`, record its SHA-256, copy it, `git bundle verify`, then `git fetch h.bundle A:refs/ruach/in/P/<task>/<seq>`.
7. **Launch on R** with `--base A --branch ruach/R/<name>` through `machine start`; send a short prompt naming the assignment file path (a pointer, since the assignment is already in the worktree).
8. **Return the same way** (steps 1-4 with R as producer). The assignment's unchanged-ness is checked by diffing `A:docs/assignments/…` against the branch tip.
9. **Release.** Remove the remote worktree only when its work is reachable from a branch C has fetched and C's receipt verified it; keep the branch (existing cleanup rule). Optionally remove `refs/ruach/in/…` on R.

Idempotency: steps 2, 3 and 6 are pure functions of a SHA and a ref name; repeating them with the same inputs is a no-op, which makes interruption recovery trivial.

### 4.10 Receipt fields

A receipt is additive metadata in the report's leading block (the schema permits extra keys) plus an entry in the task record. Fields avoid the `_revision`/`_baseline` suffix unless they are commits that must resolve on C.

```yaml
# report leading block, producer side (illustrative values)
task: FEAT-12-impl-tubal
status: complete
outcome: Implemented export on tubal; unit tests pass there
artifacts: [docs/reports/FEAT-12/impl-tubal.md]
verification: ["just test on tubal at <tested_revision>: exit 0"]
discoveries: []
blockers: []
base_revision: 1f2e3d4c...           # commit the work started from (resolves on C)
candidate_revision: 9a8b7c6d...      # exact tip handed over (resolves on C after fetch)
tested_revision: 9a8b7c6d...
machine:
  id: ef2f73192ee18b604361105f720963e9   # Herdr profile ID
  label: tubal
  session: default
environment_fingerprint: 5c0d…           # from preflight, sha256
tree_state: clean                        # clean | wip
```

```yaml
# task-record entry on C, transfer side
transfer:
  from: {machine: ef2f…, label: tubal}
  to:   {machine: local}
  method: ssh-fetch                       # ssh-fetch | bundle
  ref_source: refs/heads/ruach/tubal/feat-12-impl
  ref_local: refs/machines/tubal/ruach/feat-12-impl
  verified: [cat-file, tip-equals-receipt, base-ancestor, report-validates]
  bundle_sha256: null                     # set when method is bundle
launch:
  launch_id: 7e1c…
  keys: {agent: feat-12-impl, branch: ruach/tubal/feat-12-impl, worktree: /opt/dev/ramec-worktrees/feat-12-impl}
  refs: {workspace: {machine: ef2f…, id: w3}, pane: {machine: ef2f…, id: w3:p1}}
  submission_state: started
ignored_assets: []                        # [{path, sha256, method}]
secrets_transferred: none
```

Validation note: `base_revision` and `candidate_revision` are checked by `ruach-handoff` where the report lives; for a remote-authored report that means the validation must run where those commits exist (C, after fetch, or the remote with `--repo`). The fetch-then-validate order in §4.9 handles this. No change to `handoff.schema.json` is required.

### 4.11 Assignments and durable reports across machines

- Self-contained means no reference to the control machine's absolute paths, no "see the transcript" and no reliance on another machine's files. Paths are repository-relative; machine facts (toolchain locations, ports, Docker) are stated as that machine's prerequisites.
- The assignment travels as a **commit** (step 5), so it is versioned, verified by SHA and present in the worktree when the worker starts. The startup prompt is a one-line pointer. This also satisfies "commit the unchanged assignment with the report".
- Reports are written in the worker's worktree, committed on its branch and fetched by C. They are the only authoritative return channel. `herdr agent read` over SSH is for monitoring only.
- Waiting uses one blocking `herdr agent wait` with a timeout over SSH with keepalives, consistent with the roadmap's waiting guidance. Monitoring and prompting stay outside `ruach-herdr`'s scope (its description excludes them); they are documented as machine-qualified commands for the Coordinator.
- Checkpoints: long tasks record a WIP fetch at milestones, so a lost machine loses bounded work. This is Coordinator wording, not a feature.

### 4.12 Concurrency and merge authority

- **One integration authority per repository: the control machine's canonical checkout.** Remote machines never merge into integration branches, never push to a hosted remote, and never move another machine's namespace.
- Single-writer refs: `refs/heads/ruach/<M>/*` is written only by M. The fetch refspec for M maps only that prefix; a ref outside it is ignored and reported.
- Parallel work on different machines is allowed when assignments declare disjoint ownership paths (the roadmap's assignment lint). Overlap is serialized by the Coordinator, as RAMEC did by merging one unit at a time.
- Merge procedure (a merge steward on C): fetch, verify (§4.9 step 3), rebase or merge the latest integration base, re-verify on C or explicitly record that remote evidence was not reproduced, record the final SHA, clean up. Base freshness is checked with `merge-base` against the receipt's `base_revision`.
- Publication to a hosted remote is a separate, owner-authorized step after merge, never a side effect of any worker or transfer.
- This extends, and does not replace, "one coordination owner per task": one Coordinator owns the task across machines; machines do not coordinate each other.

### 4.13 Failure recovery

| Failure | Detection | Recovery |
| --- | --- | --- |
| Machine unreachable before dispatch | `machine_unreachable`, exit 3 | Nothing changed. Fix SSH or the machine; rerun preflight |
| Connection lost after dispatch | `result_lost`, exit 4 | `machine observe`; adopt what exists; never relaunch blindly |
| Launch partial (worktree, no agent) | `observe` returns `partial` | Owner inspects; finish by hand or remove after work is reachable from a retained branch |
| Native trust dialog | `awaiting-input`, exit 0 | Owner attaches (`herdr --remote`) and approves; no replacement worker |
| Fetch interrupted | Tracking ref unchanged (`--atomic`) | Rerun; same inputs, same outputs |
| Tip moved after report | Tip ≠ `candidate_revision` | Reject; producer issues a new report; do not "accept the newer tip" |
| Base missing on receiver | Preflight `--base` check fails | Push or bundle the base; relaunch is unnecessary because nothing was created |
| Dirty or WIP-less handoff | `tree_state` missing or porcelain not empty | Producer commits as WIP or stops |
| Bundle verify fails | `git bundle verify` non-zero | Rebuild with the correct prerequisite commits; never apply a failed bundle |
| Server restarted, IDs stale | `observe` name/kind/pane triple mismatch | Rediscover by agent name; update the task record; do not reuse stored IDs |
| Remote machine lost | Unreachable permanently | Work after the last fetch is lost; the checkpoint rule bounds it |
| Remote role/catalog skew | Dry-run role hash mismatch | Owner updates the remote snapshot; no silent fallback |

## 5. Required tests (public-boundary, failing first, offline)

Existing conventions: Bun test with temporary HOME and fake CLIs (`tests/fixtures/fake-cli.ts`); no claim about live runtime. I have not run any application or runtime tests for this proposal.

Wrapper (`skills/ruach-herdr/tests/machine.test.ts`, fake `ssh` and `herdr` on `PATH`):

1. Profile resolution: by ID, by unique label; disabled, unknown, ambiguous label, label `local`, and an SSH target containing option-looking text are rejected before any SSH call.
2. Quoting: hostile values (`'; touch x`, `$(…)`, newline, leading `-`, NUL) reach the fake `ssh` as inert data or are rejected; the remote command is the documented fixed shape.
3. SSH options: `-a`, `BatchMode`, `ConnectTimeout`; no host-key relaxation. Agent forwarding never enabled.
4. Preflight read-only: the fake `ssh` records every remote command; each must match the allowlist; none writes; a created-file probe fails the test.
5. Transport failure classes: exit 255 before dispatch gives exit 3; stream closed after dispatch gives exit 4 with `result_lost` and keys present; a successful launcher JSON is passed through with an envelope and unchanged launcher fields.
6. `HERDR_ENV` gate: refused when the local caller lacks `HERDR_ENV=1`; set remotely only for `start`/`--dry-run`.
7. Capability mismatch: server `endpoint_compatible: no`, missing agent kind, missing worktree flags (falls back to standalone and reports), harness version below gate, role-hash mismatch, none of which mutates.
8. `observe`: fixtures for not-started, partial, started, awaiting-input, and stale-ID cases.
9. Scoped IDs: two machines returning `w1:p1` and the same agent name stay distinct in the envelope; a local `herdr` command is never built from a remote ID.
10. Unchanged launcher: the existing `worker.test.ts` suite passes untouched.

Git handoff (real temporary repositories, local-path stand-ins for SSH via a fake `GIT_SSH_COMMAND`, if scripts are built in Phase 3):

11. Fetch maps only `refs/heads/ruach/<M>/*`; a ref outside it, or another machine's namespace, is ignored and reported.
12. Idempotence: repeating fetch and push with the same inputs changes nothing.
13. Tip ≠ receipt, base not an ancestor, missing commit, and unclean `tree_state` are each rejected.
14. Push to `refs/ruach/in/…` does not touch the receiver's checked-out branch, index or working tree.
15. Bundle: verify success, verify failure for a missing prerequisite, SHA-256 recorded.
16. A report authored with machine fields validates with `ruach-handoff` after fetch, and fails as expected before it.

Documentation and repository checks for each phase: `just check`, `bun run test`, `cd skills/ruach-herdr && bun test --timeout 30000`, affected skill suites. A live read-only smoke (`machine preflight` against `oholiab` and `tubal`) is an owner-authorized manual step and is reported as such, never as a unit test.

## 6. Phased implementation plan

| Phase | Content | Mutates remote? | Exit condition |
| --- | --- | --- | --- |
| 0. Decisions and runbook | Owner answers §8. A manual runbook (ssh command shape, `PATH`, `--base SHA`, branch namespace, fetch/push recipes) in `docs/operations.md`. Note the Herdr documentation drift (`--machine`) | No | Owner decisions recorded |
| 1. Read-only machine layer | `machine list`, `machine preflight`, profile resolution, fingerprint, optional `machines.yaml`, quoting module | No (read-only allowlist) | Tests 1-4, 7 pass; a live read-only smoke on both machines reported |
| 2. Remote launch | `machine start` (dry-run first, role-hash comparison, envelope with scoped refs, `result_lost`), `machine observe`; optional detached launcher | Yes, only worktree, branch, workspace, agent under authorization | Tests 5, 6, 8, 9, 10 pass; one authorized real launch on a throwaway name |
| 3. Git handoff | Recipes in operations docs; a small script only if the same recipe is repeated. Receipt wording in the assignment specimen and task-record example; Coordinator wording for relay, WIP commits, checkpoints | Yes, refs only | Tests 11-16 pass if scripts exist; one end-to-end P→C→R→C rehearsal |
| 4. Later, task-driven | `herdr --machine` transport behind the same wrapper when both Herdr versions pass a probe; linked worktrees via remote parent workspace; publication step; mirror fast-forward policy | Varies | Driven by recurring friction, per roadmap |

Roadmap placement is an owner decision (D1). This design adds no catalog of agents and no service. The roadmap's "pause catalog expansion after 0.4; add only task-driven items" is consistent with Phases 0-2 only.

## 7. Tradeoffs and rejected alternatives

- **Wrapper vs launcher refactor.** The wrapper duplicates a little transport knowledge and cannot make the launcher's internals remote-aware, but it leaves the audited launcher untouched and leaves room to swap in `herdr --machine` later.
- **Hub through the control machine vs peer transfers.** The hub adds a hop and requires the control machine to be up, but avoids credentials on remotes, avoids unknown network paths and gives one place to verify.
- **Machine-qualified branch names** lengthen names and differ from local launches, for enforceable single-writer refs. A flat name would also work if the owner prefers; the enforcement then moves entirely to the fetch refspec.
- **WIP commits** pollute history but keep identity and review possible. Squash or exclusion at integration is the integrator's job.
- **No remote credentials** means no remote-to-hosted-Git flow. If the owner wants remotes to publish, a central remote becomes sensible, with the cost of credentials, review of publication rights and branch protection.
- **Declared `PATH`** is more setup than a login shell but is explicit and reproducible.
- **Not proposed:** a scheduler, a capacity model, a cross-machine pane inventory, automatic failover to another machine, copying native config or credentials, Git LFS, a hub bare repository, shared worktrees.

## 8. Owner decisions

- **D1.** Is multi-machine work in scope now, and where does it sit in the roadmap (this proposal assumes after 0.4 as a task-driven item, Phases 0-2 first)?
- **D2.** Control machine as the single integration authority and hub, with remotes holding no hosted-Git credentials: accept? If remotes may publish, say which remote and under what approval.
- **D3.** Machine-qualified branch names `ruach/<machine>/<name>` for remote launches, versus the flat default.
- **D4.** Authorization to set `HERDR_ENV=1` on a remote command when the local caller is an authorized Herdr session with the profile enabled.
- **D5.** Remote main checkouts: declared mirrors (Ruach may fast-forward them when clean) or owner-managed (Ruach only detects skew and refuses)?
- **D6.** Which machine properties to put in `machines.yaml` (declared `PATH`, repo map, allowed harnesses), or whether flags suffice for now.
- **D7.** WIP commits as the only cross-machine representation of unfinished work: accept?
- **D8.** Policy for ignored assets and datasets: which are provisioned per machine by recipe, and which, if any, may be copied with hash verification.
- **D9.** Whether native logins are created by the owner on each machine (assumed), and whether Ruach should report `claude`/`codex` login status when a safe, non-mutating probe exists.
- **D10.** Checkpoint cadence for long remote tasks (milestone fetches), and who removes remote worktrees and `refs/ruach/in/…` after release.

## 9. Risks and open facts to verify before Phase 2

- A1, A4 and A5 (remote socket reachability over non-interactive SSH, ID reuse after restart, behavior of a dropped session) are cheap to verify read-only or on a throwaway name and should be recorded before the launch phase.
- Remote Herdr server versions and protocol were not read in this session. Machine forwarding support on both sides is unknown.
- The remote `.agents` snapshot and launcher dependency state is unknown (A6).
- Native login state on the remote machines is unverifiable by Ruach and affects every launch.
