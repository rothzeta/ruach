# Installing, launching and recovering Ruach

## Install from the Ruach checkout

```sh
just install
just install-plugins
```

`install` prepares pinned executable-skill dependencies. `install-plugins` registers this checkout as a user-level Claude marketplace and installs `ruach@ruach`. The equivalent spellings `just install-plugin` and `just install-plugin ruach` work too. The marketplace receives the absolute checkout path; bare `.` is not a supported source for the installed Claude CLI. Repeating installation is supported. This local plugin loads in place, so source edits take effect in a new Claude session or after `/reload-plugins`.

`just install-global` installs skills through the Skills CLI for Codex and Claude. It does not install role definitions or consumer launch shortcuts. Choose the native plugin for Claude when you want its named agents and skills together. See the [README](../README.md#standard-installation) for versioned remote installation. Remote version tags must be published before those commands can fetch them.

## Snapshot installation failures and recovery

`ruach-install.ts install` stages every file under `.ruach-staging` in the target, then renames it into place and verifies the result. It never writes through an existing path, so hardlinks to managed files outside the snapshot keep their content and mode.

| Exit | Meaning | Next step |
| --- | --- | --- |
| 0 | Installed and verified. | None. A warning names `.ruach-staging` if it could not be removed; delete it before the next install. |
| 1 | Refused or failed with no change: drift, leftovers in a skill root, conflicts, a non-regular entry, or a commit failure that rolled back completely. | Fix the reported cause; `--replace` adopts drift, conflicts and regular-file leftovers, never symlinks, FIFOs or directories. |
| 3 | Rollback incomplete. `.ruach-staging` is kept with `journal.json` and `old/`. | Manual recovery below. |

An install killed mid-commit also leaves `.ruach-staging`. `install` refuses and `check` fails with `interrupted install` until it is resolved. To recover manually, move each `old/<index>` file named in `journal.json` back to its recorded path, delete files the journal marks `create` that the failed run placed, then remove `.ruach-staging`. Alternatively remove `.ruach-staging` and run `install --replace` to reinstall the snapshot. There is no `install --recover` command.

For hosts that receive only skill folders through the Skills CLI, there is no installer script; run `ready` and installation commands from a Ruach checkout or plugin copy.

## Check readiness

`ready` reports, read-only, whether this Ruach copy can serve a route. It reads files and runs only `--version` probes; it never installs, writes settings or changes discovery links, and prints remediation commands instead of running them.

```sh
just ready --route skill|native|herdr [--json]      # source checkout
bun .agents/ruach-install.ts ready --route native   # installed snapshot
```

It scans the active copy plus project (`.agents/skills`, `.agents/agents`, `.claude/skills`; `--project DIR` changes the project root), user (`~/.claude/skills`, `~/.agents/skills`, `$CODEX_HOME/skills`) and any `--skills DIR` locations, then checks each executable skill's nested packages against its `bun.lock` (`ready`, `missing`, `mismatched` or `no-dependencies`) and the Bun, Git and Herdr prerequisites. Duplicate Ruach skill or role names are warnings. Exit codes: 0 ready, or no route requested; 1 the requested route is not ready; 2 usage error; 3 inspection failed. For the standalone Skills CLI route no script is installed, so run it from a checkout or plugin copy with `--skills DIR`.

## Launch while developing Ruach

Run these in an authorized Herdr session with `HERDR_ENV=1`, Bun, Git and the selected native harness available:

```sh
just agent-routing resolve architect
just architect design-a --dry-run
just architect design-a
just coordinator lead-a
```

Offline `resolve` selects the route without starting anything. Dry-run checks live prerequisites and reports the planned checkout. A live launch creates a fresh Git branch and worktree next to the source checkout and a background Herdr workspace, preserving caller focus and layout. From a Herdr workspace of the same repository the worker is registered as a linked worktree of that workspace; otherwise it gets a standalone workspace. It starts from committed HEAD; uncommitted source changes stay in the source checkout. Named workers must have fresh branch/path destinations.

Architect and Coordinator use the configured preferred routes. Use an explicitly declared alternative with `--route ID`; route failures never switch harnesses or models automatically. `--worktree DIR`, `--branch NAME` and `--base REF` customize the checkout. `--placement pane` explicitly requests a sibling pane in the source cwd.

## Launch in another repository

With the user-level Claude plugin installed, change into the consumer repository and start a native role in the current terminal:

```sh
claude --agent ruach:architect
claude --agent ruach:coordinator
```

For background worktree launches, install the combined project snapshot described in the [README](../README.md#install-a-pinned-project-snapshot). From the consumer repo, prepare the installed Herdr skill and select a native model directly:

```sh
(cd .agents/skills/ruach-herdr && bun install --frozen-lockfile)
bun .agents/skills/ruach-herdr/scripts/worker.ts start \
  --name design-a --role architect --cwd . \
  --kind claude --model claude-opus-5-5 --effort high
```

Change `--role` to `coordinator` for orchestration. A selected model still needs native account availability. Direct selection needs no routing catalogs. Routed selection instead reads consumer-owned `.agents/models.yaml`, `.agents/routing.yaml` and `.agents/roles.yaml`; see the installed skill's [routing schema](../skills/ruach-herdr/references/routing.md). Ruach's source-development Just recipes are not copied into consumers.

## First launch and native confirmations

A fresh Claude worktree can display “Yes, I trust this folder” before the interactive prompt is ready. Herdr recognizes it as blocked and its startup readiness check returns `agent_not_ready`. This means the process started and needs input; it is not evidence of a missing model or a failed process.

The launcher reports `action: awaiting-input`, `ready: false`, `awaiting_user_input: true`, the existing workspace/pane IDs and inspection commands. Exit 0 means the waiting state was verified, not that assignments can be submitted. Open the returned workspace:

```sh
herdr workspace focus <returned-workspace-id>
```

Read and answer the native dialog yourself. An assistant must obtain explicit permission before answering a blocked security or approval dialog. Once the agent becomes idle or done, use that existing session for the assignment. Do not launch another worker to answer the first worker's dialog. Ordinary startup does not submit a task prompt.

## Inspect and recover

Use the reported agent name and pane ID in the same Herdr session:

```sh
herdr agent get <worker-name>
herdr agent read <worker-name> --source recent-unwrapped --lines 120
herdr pane read <returned-pane-id> --source recent-unwrapped --lines 120
```

| Result | Meaning | Next step |
| --- | --- | --- |
| Exit 0, `action: started`, `ready: true` | Native startup was confirmed. | Submit the assignment separately. |
| Exit 0, `action: awaiting-input` | The matching native agent is blocked on a dialog. | Open its existing workspace and answer with user approval. |
| Exit 2 | Invalid arguments, catalogs, role source, branch or path. | Correct the reported configuration; existing destinations are never overwritten. |
| Exit 3 | A required executable, Herdr session or native capability is unavailable. | Resolve the prerequisite without assuming the model/account is unavailable. |
| Exit 4 | Mutation occurred or startup cannot be confirmed. | Inspect the reported resources before retrying. Keep private launch material while a process may need it. |

Older releases reported a folder-trust dialog as `start_uncertain` with exit 4. If the existing agent is blocked and the pane shows that dialog, complete the confirmation in that workspace; another launch is unnecessary. A timeout does not prove a start command was never delivered. The launcher does not retry or delete uncertain resources.

After reuse ends, close only the owned session/workspace. Commit useful work and preserve it on a retained branch before removing its worktree: `herdr worktree remove --workspace <id>` for a worktree registered by a linked launch, otherwise `git worktree remove` from another retained checkout. Keep the branch and unrelated resources. Never discard uncommitted evidence to make cleanup succeed.

## Release verification and toolchain versions

CI (`.github/workflows/ci.yml`) is the reference gate: frozen installs (`just install`), `just check` (resource checks and typecheck), `just release-check`, `bun audit` for the root and each locked skill, and `just test` (root tools plus the handoff, Herdr and harness-eval suites). The runner must permit local sockets because Herdr tests open them. Locally run the same recipes.

Recorded toolchain for the 0.3 line (update with each release that changes it; the CI `BUN_VERSION`/`JUST_VERSION` must match):

| Tool | Version | Pinned in |
| --- | --- | --- |
| Bun | 1.4.2 | `.github/workflows/ci.yml` |
| Just | 1.40.0 | `.github/workflows/ci.yml` |
| TypeScript | 7.0.2 | root `package.json` and `bun.lock` |
| `@types/bun`, `@types/ws` | 1.4.2, see lock | root `package.json` and `bun.lock` |
| Git | 2.47.3 (observed; no pin) | not pinned |
| Herdr CLI | 0.9.0 (observed) | not pinned; native harness CLIs (`claude`, `codex`) are likewise consumer-provided |

CI action references use version tags, not commit SHAs.

### Snapshot integrity versus runtime/bootstrap integrity

- **Snapshot integrity** covers the files copied into a consumer: resource identities, links, release metadata, and that skill `bun.lock` files exist and are frozen. `just check` and `just release-check` verify it. It says nothing about the machine that runs the snapshot.
- **Runtime/bootstrap integrity** covers what a run depends on that the snapshot does not contain: the Bun, Git, Herdr and native harness versions, `bun install --frozen-lockfile` having been run inside each executable skill, and resolved executables on `PATH`. Verify it per machine (readiness checks, `bun audit`, the suites); a passing snapshot check does not establish it, and a passing local run does not establish snapshot integrity.
