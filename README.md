# Ruach

Current release: **0.2.1**. See the [changelog](CHANGELOG.md) and [operations guide](docs/operations.md) for installation, consumer launches and troubleshooting.

Portable agent roles and self-contained skills for bounded engineering and knowledge maintenance. Consumer projects supply their own decisions, knowledge structure and routing policy.

- `agents/`: Coordinator, Architect, Scout, Implementer, Reviewer and Librarian contracts.
- `skills/`: testing, simplification, structured handoffs, Herdr launch preparation, explicit harness evaluation, Librarian upkeep and Coordinator-only feature/knowledge workflows.
- `docs/`: [operations guide](docs/operations.md), [roadmap](docs/roadmap.md) and the source/consumer ownership [ADR](docs/adr/0001-source-and-consumer-ownership.md).
- `scripts/`: explicit pinned snapshot installation and resource checks.
- `config/agent-routing/`: routing policy for developing Ruach itself.
- `tests/`: installation contract checks. Skill-specific suites live with their skills.
- `evals/`: developer behavior-evaluation packets with separate rubrics. Snapshot and skill installations exclude them; they are not native plugin components.

Only Coordinators load workflow bodies. Workers use a role plus a self-contained assignment with scope, document ownership, acceptance, verification and handoff instructions. See [authoring guidance](CONTRIBUTING.md), [ownership ADR](docs/adr/0001-source-and-consumer-ownership.md), [provenance](PROVENANCE.md) and [MIT license](LICENSE).

## Choose by job

Pick the route that matches what you want to do. Each route installs different things and still needs the prerequisites shown.

| Job | Route | Installs | Still needs |
| --- | --- | --- | --- |
| Use a technique (testing, simplification, handoff format) in any harness | [Standalone skills](#standard-installation) through the Skills CLI | Skill folders and native discovery links | Bun and a local `bun install --frozen-lockfile` for the executable skills (`ruach-handoff`, `ruach-herdr`, `ruach-harness-eval`). No role files. |
| Work as a named role in Claude Code in your current terminal | [Direct native role](#standard-installation) through the Claude plugin | All skills and the six named agents (`ruach:coordinator`, `ruach:implementer`, …) | Claude Code. Nested skill dependencies are not installed automatically. No background workers. |
| Coordinate separate workers in background worktrees | [Coordinated Herdr use](#install-a-pinned-project-snapshot) with a pinned project snapshot | Roles and skills together under `.agents/`, with a manifest for integrity checks | Bun, Git, Herdr, the selected native harness and account, consumer-owned routing or a direct model, and nested skill dependencies. |

The snapshot route is for projects that want an auditable, committed installation. Start with the smallest route that covers the job; you can add another later. Avoid installing the same skills twice into one harness. The [lifecycle guide](docs/operations.md#lifecycle-inspect-upgrade-and-remove) covers inspecting, upgrading and removing an installation. A readiness command (`just ready`) that checks a route end to end is planned for 0.3 and is not described here; see the [design](docs/design/0.3-install-and-readiness.md) and the [changelog](CHANGELOG.md) for its status.

## Standard installation

Ruach follows the [Agent Skills specification](https://agentskills.io/specification). Like [Vercel's agent-skills](https://github.com/vercel-labs/agent-skills), it can be installed through the [Skills CLI](https://github.com/vercel-labs/skills). Like [Anthropic's skills](https://github.com/anthropics/skills) and [Superpowers](https://github.com/obra/superpowers), it also ships native Claude plugin metadata. The shared specification covers skills; native agent definitions and plugin packaging depend on the harness.

Install the released skills globally for Codex and Claude Code:

```sh
bunx --bun skills@1.7.0 add https://github.com/rothzeta/ruach/tree/v0.2.1 --global --agent codex --agent claude-code --skill '*'
```

Omit `--global` for a project installation. From a checkout of the desired release, `just install-global` uses the same CLI with the local `skills/` directory. The CLI installs skill folders and manages native discovery links; this route does not install role files or the combined Ruach snapshot manifest.

For Claude Code, install the native plugin to expose all eight skills and six named agents together:

```sh
claude plugin marketplace add rothzeta/ruach#v0.2.1 --scope user
claude plugin install ruach@ruach --scope user
claude --agent ruach:coordinator
```

The marketplace tag fixes the release, and `.claude-plugin/plugin.json` supplies its semantic version. For development from this checkout, `just install-plugin` (also `just install-plugins` or `just install-plugin ruach`) registers the local marketplace, or `claude --plugin-dir . --agent ruach:coordinator` loads it for one session. Use the plugin installation for Claude when you want native agents; the Skills CLI is sufficient for skill discovery in other harnesses. Avoid installing the same skills twice into Claude.

Executable skills require Bun and their own frozen dependency install. A copied or cached skill keeps its local `package.json` and `bun.lock`: run `bun install --frozen-lockfile` inside `ruach-handoff`, `ruach-herdr` and `ruach-harness-eval` before running their scripts. `just install` prepares those dependencies in this source checkout. Native plugin installation does not automatically install these nested skill packages.

## Install a pinned project snapshot

For a combined, auditable project installation of roles and skills, use Ruach's snapshot installer. Requires Bun and Git. From a local checkout containing the release tag:

```sh
bun scripts/install.ts install --source . --version 0.2.1 --target /path/to/project/.agents
bun /path/to/project/.agents/ruach-install.ts check --target /path/to/project/.agents
bun /path/to/project/.agents/ruach-install.ts check --target /path/to/project/.agents --source /path/to/ruach
```

`--version 0.2.1` selects exactly the `v0.2.1` Git tag and checks that its committed package version matches. Installation reads committed objects, never uncommitted source files; records release version, upstream origin, resolved commit and file hashes in `ruach.json`; and includes the installer, provenance and license. The resolved commit is integrity metadata; users select a release version. Existing managed drift or conflicting files require explicit `--replace`. Unrelated consumer configuration and extra local skills/roles stay with the consumer. `check` needs no source checkout for local integrity; adding `--source` verifies the snapshot against its recorded upstream tree and version. Advanced or legacy callers can still use `--revision` instead of `--version`. The snapshot installer does not fetch, push, install global links or change persistent harness settings.

Roles and skills install together as `agents/` and `skills/`, preserving cross-resource links. Skill-local scripts remain usable from independently copied skill folders after their local dependency install. Consumers can expose skills through their harness discovery mechanism; global discovery is installation, not a new canonical source.

To update a snapshot installed with the previous Python installer, run the TypeScript installer from a new checkout with the desired commit. It reads the existing manifest and removes the previous managed installer during the update; consumer policy and drift checks are preserved.

## Develop Ruach itself

The development launcher uses `agents/` and `skills/` directly from this checkout. It does not install Ruach into itself. Requires Just, Bun and Git; live startup additionally requires Herdr and the selected native harness.

```sh
just install
just agent-routing resolve coordinator
# Run in an authorized Herdr session:
just coordinator
just architect ruach-designer
just coordinator ruach-lead --dry-run
just agent-routing start implementer ruach-builder
just agent-routing start architect ruach-designer --route gpt-6.1-sol-high
# Explicitly use a sibling pane instead of a new worktree workspace:
just architect ruach-designer --placement pane
```

The Coordinator and Architect prefer Claude Opus 5.5 at high effort; other roles follow [Ruach's development catalogs](config/agent-routing/roles.yaml), initially matching Brainlab's routes. These catalogs are local development policy and are not installed into consumers. The launcher defaults to automatic approval review; `--permissions inherit` preserves native permission settings. `resolve` selects offline without native config reads or launch spaces. `start --dry-run` checks source prerequisites and reports a planned checkout without creating it. `start` creates a new Git worktree and Herdr workspace in the background and starts once. It preserves caller layout and focus and needs no caller pane ID. Send the task separately after startup. See [launch prerequisites and recovery](skills/ruach-herdr/SKILL.md).

For `just architect`, the default worker name is `ruach-architect`, checkout `/path/to/ruach-worktrees/ruach-architect` next to this repo, branch `ruach/ruach-architect`, and base committed HEAD. Choose a fresh worker name for each launch; existing branches and paths are rejected. Uncommitted source edits are not copied. Use `--worktree DIR`, `--branch NAME` and `--base REF` to customize the checkout. Native settings are read again from the actual worker checkout before startup. `--placement pane` explicitly uses the supplied source cwd and requires a caller pane ID.

With access to the same Herdr session, inspect a background worker or bring its workspace into view using the returned workspace ID:

```sh
herdr agent read ruach-designer --source recent-unwrapped
herdr workspace focus <returned-workspace-id>
```

Results include workspace/pane IDs, worktree path/branch/base and inspection commands. If creation or startup fails after mutation, inspect those resources and the reported state before retrying. The launcher retains them for recovery. After reuse ends, close the owned session/workspace and remove its worktree only after committing useful work to a retained branch; keep the branch.

A native trust or onboarding dialog returns `action: awaiting-input` with `ready: false` and the existing workspace ID. Open that workspace and complete the confirmation with user approval. This is a waiting session, not a reason to create another worker. See [first launch and recovery](docs/operations.md#first-launch-and-native-confirmations).

Use `BUN_BIN` to override Bun, otherwise Just uses `~/.bun/bin/bun` when present, then `bun` on PATH. `bun run agent-routing -- resolve coordinator` is also available. `--root DIR` selects another Ruach worktree's routing catalogs and working directory while retaining the launcher and canonical resources from this checkout.

Global discovery uses the standard installation commands above. The source launcher injects the selected role from its canonical source, exposes source skills privately for Claude and supplies their source location to Codex. Launch commands do not perform a global installation.

## Verify

```sh
bun run check
bun run release-check
bun run test
# In each of skills/ruach-handoff, skills/ruach-herdr, skills/ruach-harness-eval:
bun install --frozen-lockfile
bun test
```

Bun is required for executable skill suites. Herdr tests require local socket binding. Claude/Codex preparation is supported subject to runtime gates; Pi, OpenCode, DSH, OMP and Agy deliberately fail before mutation for unsupported/unverified capabilities. See [Herdr prerequisites and limits](skills/ruach-herdr/SKILL.md). Fake CLI tests and static checks do not establish model/account availability, live prompt discovery or behavioral quality. Librarian [evaluation cases](evals/ruach-librarian/README.md) are prepared for a separate blind evaluator.

## Releases

Use Semantic Versioning for the repository bundle. Update the root `package.json` version, `.claude-plugin/plugin.json` version, marketplace metadata version, the current release and installation examples in this README, and `CHANGELOG.md` together. Skill-local private package versions remain independent implementation-package metadata.

Run `just release-check`, `just check`, the root tests and affected skill suites before committing. Create an annotated `vMAJOR.MINOR.PATCH` tag on the release commit. `claude plugin tag .` creates the additional native `ruach--vMAJOR.MINOR.PATCH` tag used for Claude plugin dependency-version resolution; both tags name the same commit. Never move or overwrite a released tag. Remote publication is a separate explicit step.
