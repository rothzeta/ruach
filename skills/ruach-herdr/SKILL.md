---
name: ruach-herdr
description: Resolve a repository role and model route, prepare native harness instructions, and start one named worker in a background Git worktree workspace. Supports an explicitly requested sibling pane. Use for an authorized worker launch; excludes assignments, monitoring, prompts, evaluation, and benchmarks.
compatibility: Requires Bun, Git, Herdr with the selected kind, and its native CLI (Claude, Codex, OpenCode v2.1.4+, Pi v1.4+ or Goose v1.56+). Run `bun install --frozen-lockfile` in the skill directory first.
---

# Ruach Herdr

Run with Bun. Install the skill's pinned dependencies from this directory once:

```sh
bun install --frozen-lockfile
bun test
```

The test suite binds local Unix-domain sockets to simulate native config reads. Its sandbox must permit socket binding; a prerequisite probe fails immediately with an explanation when binding is denied. Tests use temporary HOME/config directories and fake CLIs; they do not silently skip unsupported environments.

`resolve` without `--offline`, `start --dry-run`, and `start` require an authorized live Herdr session (`HERDR_ENV=1` and readable live names), plus the selected native prerequisites. Default worktree placement does not require a caller pane ID or layout. Resolve effective selection or prepare a launch without creating worktrees, launch material or workspaces:

```sh
bun scripts/worker.ts resolve --name task-worker --role implementer --cwd /path/to/worktree
bun scripts/worker.ts start --dry-run --name task-worker --role implementer --cwd /path/to/worktree
```

For selection only without Herdr or native executable/config prerequisites, use:

```sh
bun scripts/worker.ts resolve --offline --name task-worker --role implementer --cwd /path/to/worktree
```

For direct selection, supply `--kind KIND --model NATIVE_MODEL [--effort LEVEL]` instead of a route. Otherwise the role's preferred route comes from `.agents/models.yaml`, `.agents/routing.yaml`, and `.agents/roles.yaml`; `--route ID` selects a declared alternative. There are no model defaults or harness fallbacks. Supply `--repo DIR` if Git cannot infer the intended canonical repository from cwd. Relative launcher paths resolve from invocation cwd. See [routing schema and root delegation](references/routing.md).

`--resources DIR` selects the canonical resource root containing `agents/` and `skills/`; `--catalogs DIR` selects the directory containing `models.yaml`, `routing.yaml` and `roles.yaml`. Both default to `<repo>/.agents`. A source-development wrapper can point resources at its checkout and catalogs at its own development configuration, without installing a duplicate snapshot. Relative values resolve from invocation cwd. Explicit source resources remain available to native preparation; Coordinator workflow visibility and worker suppression use that selected skill root.

Start only after authorization to create the named worker:

```sh
bun scripts/worker.ts start --name task-worker --role implementer --cwd /path/to/worktree
```

`start` defaults to `--placement worktree`: create a new Git branch and worktree, then a Herdr workspace with `--no-focus`, and submit one `herdr agent start` in its initial terminal. The caller's layout and focus stay intact. When the caller's Herdr context supplies `HERDR_WORKSPACE_ID` and Herdr resolves that workspace to this same repository, the checkout is created with `herdr worktree create --workspace <parent> --no-focus`, so the worker appears as a linked worktree of the launching workspace (`is_linked_worktree`, listed by `herdr worktree list`), and the agent runs in a pane split from its root pane to carry the forwarded environment. Herdr creates worktrees only from the repo parent workspace, so when the launching workspace is itself a linked worktree (the normal case for a Coordinator in a worktree) the launcher uses the parent that `herdr worktree list` reports as `source.source_workspace_id`, or falls back to standalone when none is reported. Without a usable parent (no workspace ID, a non-Git or other-repository workspace, or no linked-worktree support) the launch keeps a standalone workspace; the result reports `worktree_mode` (`linked` or `standalone`), `linked_parent` and, for standalone, `linked_unavailable`. The default destination is `<checkout-parent>/<checkout-name>-worktrees/<worker-name>`, branch `ruach/<worker-name>`, and base the source checkout's committed HEAD. `--worktree DIR`, `--branch NAME` and `--base REF` customize these values. Existing paths and branches are rejected; the launcher never overwrites or reuses them. Uncommitted source changes are not copied. Canonical resources and routing remain in their selected source locations.

Preflight checks the native route, destination, branch and resolved base before creating anything. Native configuration is read again in the actual worktree before startup, so project settings and relative native arguments use the worker's checkout. Dry-run reports the planned destination and pinned commit, but inspects native configuration in the source cwd because the destination does not yet exist. A failure after worktree creation returns exit 4 with recovery information and preserves the checkout and branch.

`--placement pane` explicitly requests a sibling pane in the supplied cwd. Only this mode requires `HERDR_PANE_ID` and readable caller layout. It splits once with `--no-focus`; worktree-specific options are invalid in this mode. Both modes preserve executable PATH and harness configuration roots in the new terminal. Neither sends a task prompt or retries.

Large prepared argv uses a private bootstrap to avoid terminal canonical-input truncation. After shell initialization, `pane run` sources a private POSIX shell function that binds the declared kind to its absolute bootstrap; `pane wait-output` confirms a marker emitted only by that file. It does not depend on inherited PATH order or disable startup customization. The single named `agent start` still owns same-pane readiness. The helper restores the explicitly forwarded native environment and execs the probed absolute executable with complete prepared argv. Ready or blocked-input acceptance additionally requires the private payload receipt and matching pane foreground process group; an unrelated default native process cannot pass. User argument text stays JSON data. Short argv keeps the direct path. Preflight verifies Bun `process.execve`, supported Herdr primitives and a safely short setup path. Resolve/dry-run create no bootstrap. Retain reported private material after active or uncertain startup for Coordinator cleanup. See [transport and lifecycle evidence](references/adapters.md#lifecycle-and-failure).

Successful results report `workspace`, `pane`, `worktree_mode`, `worktree` (path, cwd, branch and resolved base), `worktree_state` and inspection argv. An authorized caller with access to the same Herdr session can read or focus the background worker when needed:

```sh
herdr agent read task-worker --source recent-unwrapped
herdr workspace focus <returned-workspace-id>
```

Native startup can pause at a folder-trust, onboarding or approval dialog. When Herdr reports a failed readiness check, the launcher reads the named agent and verifies its name, kind and pane. A matching blocked agent returns exit 0 with `action: awaiting-input`, `ready: false`, `awaiting_user_input: true` and `submission_state: awaiting-input`. The agent and launch resources already exist; inspect the dialog and obtain user approval before answering it. Do not send an assignment until it is ready, or start a replacement to work around the dialog. A timeout without a verified matching blocked agent remains exit 4.

Coordinator workflow skills remain visible according to existing native settings; workers receive the canonical role and known local `ruach-workflow-*` names are disabled where the native mechanism supports it. The launcher never supplies workflow bodies as worker instructions. Only the Coordinator loads and executes workflow bodies; workers follow their canonical role and the Coordinator’s self-contained assignment. Existing developer and technical skill configuration is preserved.

Claude, Codex, OpenCode, Pi and Goose have launch preparation enabled. Codex prefers an already-running matching-version local daemon for native effective config discovery; otherwise it uses a short-lived stdio app-server and terminates it after config/catalog reads. OpenCode v2.1.4+ uses owned short-lived standalone servers for native inspection and its own standalone server for the worker, preserving the shared service. DSH, OMP and Agy currently fail before mutation for missing or unverified capabilities. Read [adapter evidence and limits](references/adapters.md) before selecting a harness. A prepared argv does not establish account access, native acceptance, or a successful paid session.

Pi v1.4+ within major 1 uses `--kind pi --model provider/model --permissions inherit`. Explicit effort maps to native `--thinking`; `auto` or omitted effort keeps its default. The exact provider/model must appear in `pi --offline --list-models`; fuzzy selections are rejected. A private per-run extension appends the canonical role to Pi's composed system prompt, preserving native `APPEND_SYSTEM.md`, project trust and ambient context. Canonical skills are added individually with `--skill`; workers receive technical skills only. Existing native skill discovery remains active, including ambient workflow descriptions; only the Coordinator may load workflow bodies.

Goose v1.56+ within major 1 uses `--kind goose --model provider/model --permissions inherit`. Omit effort or use `auto`; other efforts have no verified portable mapping. Preparation emits `session --provider ... --model ... --system ...`, appending the canonical role and on-demand canonical skill paths while retaining native configuration and extensions. System instruction text is redacted in launcher output but visible in native process arguments. Goose startup also requires Herdr to advertise `goose` in `agent start --help`; the installed Herdr inspected on 2026-10-24 omits it, so startup fails exit 3 before creating resources until that upstream capability is available. Neither adapter supports auto-review or native pass-through flags.

For OpenCode, use `--kind opencode --model provider/model --permissions inherit`. Optional `--effort LEVEL` selects an exact variant from that model's native catalog; omit effort or use `auto` for the provider default. A model may include `#variant`; conflicting explicit effort fails. Preparation rejects unavailable/disabled models and unoffered variants without fallback. OpenCode's native `--auto` blindly approves requests and is not a Ruach auto-review mapping; `--permissions auto-review` fails before mutation. Ruach's development wrapper resolves OpenCode to its configured `inherit` policy; a contradictory request fails before resource creation.

Claude keeps native account-synced, plugin, managed and legacy customizations. Their complete live catalog visibility is unverified and does not prohibit worker preparation. Targeted local workflow overrides preserve unrelated settings; no broad disabling or persistent customization changes occur. See [visibility limits and Codex reader investigation](references/adapters.md#visibility-limits-and-codex-reader-investigation).

`resolve --offline` is fully write-free and reads selection and canonical role only; it returns `launchable: false` and no native argv. It cannot authorize a start.

One versioned JSON result goes to stdout; concise diagnostics go to stderr. Exit codes: `0` resolved/prepared/started or verified waiting for native input; `2` usage or invalid data/config; `3` unavailable executable, Herdr context/kind, or native capability; `4` preparation failure or post-mutation state requiring inspection. Check `action` and `ready` before prompting; exit 0 alone does not establish interactive readiness. Developer text and native pass-through values are redacted in this launcher's results, but Codex role instructions travel in the native command line (`-c developer_instructions=...`) and are visible to local process listings; see [Codex instruction transport](references/adapters.md#configuration-preservation-and-visibility). Never treat a failed startup as proof that submission did not occur: inspect the reported launch space before launching again.

For launch recovery, exit `2` requires fixing the usage or config error. For exit `3`, read the diagnostic: a missing executable, Herdr context/kind, or native capability can be fixed, after which the same route can be relaunched. Exit `3` does not prove the model or account is unavailable. For exit `4`, inspect the reported worktree/branch, workspace, pane, `worktree_state` and `submission_state` before any relaunch. Never send a new assignment into a session that is still working or waiting for input. Route changes follow the caller's route policy; the launcher itself never falls back.

Private generated material uses the OS temporary root, or existing `--temp-dir DIR`, with restricted permissions. Successful or uncertain launches retain it; the caller removes it after the session ends and state is known. Release an owned workspace once no pending assignment needs it. Remove an owned worktree only when its work is committed and reachable from a retained branch, running `git worktree remove` from a retained checkout; keep the branch. Preserve unrelated resources and uncommitted evidence. Resolve/dry-run create no worktrees, launch material or workspaces, but native Codex/OpenCode readers may initialize runtime state. Do not change persistent user harness settings or install global symlinks.

Pass native arguments after `--`. The bounded supported flags are Codex `--no-alt-screen`, `--sandbox`/`-s`, `--ask-for-approval`/`-a`, `--add-dir`; Claude `--verbose`, `--permission-mode`, `--add-dir`. Value flags accept one value each (repeat `--add-dir` for multiple directories) or `--flag=value`. Accepted argv elements retain their bytes and ordering. Model, effort, role/config, resume, prompt, print, credential, and unknown flags are rejected before mutation. Under the default inherit policy, existing supported native permission flags remain available.

`--permissions inherit|auto-review` defaults to `inherit`. Adapters own the mapping: Claude auto-review uses `--permission-mode auto`; Codex uses `--approve-for-me` (automatic approval review with workspace-write). Neither maps to a bypass mode. Unsupported adapters fail exit 3. With auto-review, native permission/approval/sandbox flags are conflicting and rejected; use the portable option in root wrappers instead of constructing harness flags. Resolve/dry-run report `permissions`; offline reports the requested policy without verifying native support.

Without a daemon, normal Codex resolve/dry-run may initialize Codex runtime files in CODEX_HOME (or configured runtime storage): SQLite state/goals/logs/memories/queue databases and WAL/SHM files, installation_id, bundled `.system` skills/marker, and `.tmp` plugin-lock/git files. The native reader uses actual config layers and environment. User config.toml, AGENTS.md, user-authored skills, profiles and credentials are not written by the launcher or its inspection protocol. Bundled system skills are native runtime assets and may be initialized separately from user-authored skills. Only `resolve --offline` guarantees fully write-free preparation. See [reader evidence and permission policy](references/adapters.md#codex-runtime-state-and-permission-policy).

Consumer wrappers resolve consumer permission policy before launch-space mutation and pass the effective mode explicitly to the portable launcher. Reject a conflicting request. Resolve, dry-run and start must use the same policy. Adapter capability checks remain mandatory. Native pass-through flags must not override the resolved requirement. Report the effective mode and policy source in preflight evidence; keep permissions out of model/effort catalogs.

The separate [external waiting integration](references/waiting.md) lives beside this launcher for installation portability. It does not extend `worker.ts` or this skill's launch-only invocation contract; the Coordinator uses it through its parking guidance. Consumer integrations reuse the canonical watcher's event journal, delivery, retry and acknowledgement logic. Harness adapters supply verified native session identity and continuation operations. They do not implement separate retry or event-handling policies.
