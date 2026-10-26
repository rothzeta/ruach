# Ruach

Latest release: **0.7.1**. See the [changelog](CHANGELOG.md), [CI](https://github.com/rothzeta/ruach/actions/workflows/ci.yml) and [roadmap](docs/roadmap.md) for shipped changes, verification and remaining capability limits.

Portable agent roles and self-contained skills for bounded engineering and knowledge maintenance. Consumer projects supply their own decisions, knowledge structure and routing policy.

- `agents/`: Coordinator, Architect, Scout, Implementer, Reviewer, Tester and Librarian contracts.
- `skills/`: debugging, runtime testing, testing, simplification, structured handoffs, Herdr launch preparation, explicit harness evaluation, Librarian upkeep and Coordinator-only feature/knowledge/council/bugfix/QA/hunt workflows.
- `docs/`: [operations guide](docs/operations.md), [native packaging and parity evidence](docs/native-parity.md), [examples](docs/examples/), [coordination ownership](docs/coordination.md), [roadmap](docs/roadmap.md) and the source/consumer ownership [ADR](docs/adr/0001-source-and-consumer-ownership.md).
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
| Work as a named role in Claude Code in your current terminal | [Direct native role](#standard-installation) through the Claude plugin | All skills and named agents (`ruach:coordinator`, `ruach:implementer`, …) | Claude Code. Nested skill dependencies are not installed automatically. No background workers. |
| Coordinate separate workers in background worktrees | [Coordinated Herdr use](#install-a-pinned-project-snapshot) with a pinned project snapshot | Roles and skills together under `.agents/`, with a manifest for integrity checks | Bun, Git, Herdr, the selected native harness and account, consumer-owned routing or a direct model, and nested skill dependencies. |

The snapshot route is for projects that want an auditable, committed installation. Start with the smallest route that covers the job; you can add another later. Avoid installing the same skills twice into one harness. The [lifecycle guide](docs/operations.md#lifecycle-inspect-upgrade-and-remove) covers inspecting, upgrading and removing an installation. To check, read-only, whether a copy can serve a route, run `just ready --route skill|native|herdr` from a checkout or `bun .agents/ruach-install.ts ready --route native` from a snapshot ([readiness](docs/operations.md#check-readiness)). If a snapshot install is interrupted or fails, see [failures and recovery](docs/operations.md#snapshot-installation-failures-and-recovery).

For a small task, start one role and give it the outcome and checks:

```sh
claude --agent ruach:implementer
```

For example: “Fix the CSV export so names containing commas round-trip. Add a regression test and run the relevant checks. Leave the change for review.” This needs neither a Coordinator nor Herdr.

Use [direct, compact or full coordination](docs/examples/direct-compact-full.md) according to the task. The [worked consumer example](docs/examples/consumer-example.md) shows a larger task; the [assignment specimen](docs/examples/assignment-specimen.md) is for the Coordinator preparing worker instructions. Each coordinated task has [one owner](docs/coordination.md).

To request several advisory perspectives, use the [council setup guide](docs/council.md) to choose members, routes, rounds and budgets with your Coordinator.

For a known failure, use [debugging](skills/ruach-debugging/SKILL.md) with the [bugfix assignment specimen](docs/examples/bugfix-assignment.md). For runtime evidence, assign the [Tester](agents/tester.md) with [runtime testing](skills/ruach-runtime-testing/SKILL.md) and its [QA specimen](docs/examples/runtime-qa-assignment.md). The Coordinator owns [council](skills/ruach-workflow-council/SKILL.md), [bugfix](skills/ruach-workflow-bugfix/SKILL.md), [QA](skills/ruach-workflow-qa/SKILL.md) and [bounded hunt](skills/ruach-workflow-bug-hunt/SKILL.md) orchestration; workers receive bounded assignments. The [council member specimen](docs/examples/council-member-assignment.md) does not establish an independent execution boundary. See the roadmap for demonstrated results and remaining gates; static [capability cases](evals/ruach-capabilities/) are preparation, not behavioral proof.

The [roadmap](docs/roadmap.md) links the worked examples, review evidence and remaining native/runtime checks.

## Design and testing expectations

The [Architect](agents/architect.md) plans the smallest complete increment that delivers every requested outcome; one cohesive implementation assignment is valid. Splitting work needs useful boundaries and concurrency that justify its coordination cost. Architect and [Implementer](agents/implementer.md) prefer clear, direct code, immutable data, pure transformations and explicit state transitions, keeping necessary mutation local and visible.

[Testing guidance](skills/ruach-testing/SKILL.md) protects supported observable behavior with independently derived expectations. Tests must exercise what they claim to cover; private-helper assertions and mocks that bypass that behavior do not establish black-box coverage. Fixed seeds make failures reproducible, but exact seeded results become requirements only under a documented seed-to-output compatibility contract. The [Reviewer](agents/reviewer.md) checks test meaning and identifies required behavior left unprotected.

## Choose your models

Ruach does not ship model policy. A consumer declares it in three files under `.agents/` of its repository (the default; `--catalogs DIR` selects another directory). The schema and validation rules are in the [routing reference](skills/ruach-herdr/references/routing.md); Ruach's own [development catalogs](config/agent-routing/) are a working example.

- `models.yaml`: each model ID maps to a `harness` (`claude`, `codex`, `opencode`, `pi`, `goose` or non-Coordinator `agy`; other registered harnesses fail at preparation) and a `native_model`. Pi and Goose use `provider/model`; Goose also requires a Herdr version advertising its kind. Agy preparation is pinned to the verified 1.4.7 interface; see its [capability limits](skills/ruach-herdr/references/agy.md).
- `routing.yaml`: each route ID names a model and an `effort`.
- `roles.yaml`: each role names a `preferred` route and an optional list of `alternatives`.

```yaml
# .agents/models.yaml
models:
  claude-sonnet: { harness: claude, native_model: claude-sonnet-5-5 }
  claude-opus: { harness: claude, native_model: claude-opus-5-5 }
  codex-main: { harness: codex, native_model: gpt-6.1-sol }
# .agents/routing.yaml
routes:
  sonnet-medium: { model: claude-sonnet, effort: medium }
  opus-high: { model: claude-opus, effort: high }
  codex-high: { model: codex-main, effort: high }
# .agents/roles.yaml
roles:
  coordinator: { preferred: opus-high }
  implementer: { preferred: sonnet-medium, alternatives: [codex-high] }
  reviewer: { preferred: codex-high, alternatives: [opus-high] }
```

Alternatives are explicit-only: the launcher uses the preferred route unless you pass `--route ID` naming the preference or one of that role's alternatives. It rejects other routes, and a launch failure never switches route or model. A selected model still needs native account access. Skip the catalogs entirely with direct selection (`--kind`, `--model`, `--effort`).

**Escalation.** If two completed, handed-off correction attempts for the same blocking outcome still fail required verification or independent review (set an override in the assignment or consumer guidance), the Coordinator stops looping, preserves the evidence and either reports to you with a recommendation or, if you or your policy authorize it, launches the role's declared alternative with the prior handoff and findings. Declaring a stronger model as an `alternatives` entry is what makes that step possible; without one, the Coordinator reports to you. See the [escalation rule](skills/ruach-workflow-feature/SKILL.md#escalation).

## Standard installation

Ruach follows the [Agent Skills specification](https://agentskills.io/specification). Like [Vercel's agent-skills](https://github.com/vercel-labs/agent-skills), it can be installed through the [Skills CLI](https://github.com/vercel-labs/skills). Like [Anthropic's skills](https://github.com/anthropics/skills) and [Superpowers](https://github.com/obra/superpowers), it also ships native Claude plugin metadata. The shared specification covers skills; native agent definitions and plugin packaging depend on the harness.

Install a standalone technique, such as testing, globally for Codex and Claude Code:

```sh
bunx --bun skills@1.7.0 add https://github.com/rothzeta/ruach/tree/v0.7.1 --global --agent codex --agent claude-code --skill ruach-testing
```

Omit `--global` for a project installation, or name other techniques after `--skill`. From this checkout, `just install-global` installs the nine technical skills without the six Coordinator workflows. The CLI manages skill discovery links, but does not install role files.

**Workflow dependency:** `ruach-workflow-*` skills require the sibling `agents/` role contracts in the combined layout. Use the native plugin or [project snapshot](#install-a-pinned-project-snapshot) for workflows. Installing every skill with `--skill '*'` alone does not supply that layout; a plugin installed elsewhere does not repair standalone workflow links.

For Pi and Goose skill discovery, select their agent IDs through the same CLI:

```sh
bunx --bun skills@1.7.0 add https://github.com/rothzeta/ruach/tree/v0.7.1 --global --agent pi --agent goose --skill ruach-testing
```

Skill discovery works independently of Herdr launch support. See the [Pi and Goose launch prerequisites](docs/operations.md#pi-and-goose-harnesses).

For Claude Code, install the native plugin to expose Ruach skills and named agents together:

```sh
claude plugin marketplace add rothzeta/ruach#v0.7.1 --scope user
claude plugin install ruach@ruach --scope user
claude --agent ruach:coordinator
```

The marketplace tag fixes the release, and `.claude-plugin/plugin.json` supplies its semantic version. For development from this checkout, `just install-plugin` (also `just install-plugins` or `just install-plugin ruach`) registers the local marketplace, or `claude --plugin-dir . --agent ruach:coordinator` loads it for one session. Use the plugin installation for Claude when you want native agents; the Skills CLI is sufficient for skill discovery in other harnesses. Avoid installing the same skills twice into Claude.

Executable skills require Bun and their own frozen dependency install. A copied or cached skill keeps its local `package.json` and `bun.lock`: run `bun install --frozen-lockfile` inside `ruach-handoff`, `ruach-herdr` and `ruach-harness-eval` before running their scripts. `just install` prepares those dependencies in this source checkout. Native plugin installation does not automatically install these nested skill packages.

## Install a pinned project snapshot

For a combined, auditable project installation of roles and skills, use Ruach's snapshot installer. Requires Bun and Git. From a local checkout containing the release tag:

```sh
bun scripts/install.ts install --source . --version 0.7.1 --target /path/to/project/.agents
bun /path/to/project/.agents/ruach-install.ts check --target /path/to/project/.agents
bun /path/to/project/.agents/ruach-install.ts check --target /path/to/project/.agents --source /path/to/ruach
```

`--version 0.7.1` selects exactly the `v0.7.1` Git tag and checks that its committed package version matches. Installation reads committed objects, never uncommitted source files; records release version, upstream origin, resolved commit and file hashes in `ruach.json`; and includes the installer, provenance and license. The resolved commit is integrity metadata; users select a release version. Existing managed drift or conflicting files require explicit `--replace`. Unrelated consumer configuration and extra local skills/roles stay with the consumer. `check` needs no source checkout for local integrity; adding `--source` verifies the snapshot against its recorded upstream tree and version. Advanced or legacy callers can still use `--revision` instead of `--version`. The snapshot installer does not fetch, push, install global links or change persistent harness settings.

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
# Direct OpenCode v2 selection from this source checkout:
bun skills/ruach-herdr/scripts/worker.ts start --name ruach-open --role implementer --cwd . --resources . --kind opencode --model provider/model --effort auto --permissions inherit
# Direct Pi selection (exact ID from pi --offline --list-models):
bun skills/ruach-herdr/scripts/worker.ts start --name ruach-pi --role implementer --cwd . --resources . --kind pi --model provider/model --effort high --permissions inherit
# Goose requires Herdr to advertise its kind; currently fails before resource creation:
bun skills/ruach-herdr/scripts/worker.ts start --name ruach-goose --role implementer --cwd . --resources . --kind goose --model provider/model --effort auto --permissions inherit
# Explicitly use a sibling pane instead of a new worktree workspace:
just architect ruach-designer --placement pane
```

Run `just agent-routing resolve ROLE` to inspect the current model and effort selection. The [development catalogs](config/agent-routing/roles.yaml) are Ruach-local policy and are not installed into consumers. The wrapper requires `auto-review` for Claude and Codex, and `inherit` for OpenCode and Agy; conflicting requests fail before launch. Preflight identifies the effective mode and policy source.

`resolve` selects offline without native config reads or launch spaces. `start --dry-run` checks prerequisites without creating a checkout. `start` creates a background Git worktree and Herdr workspace and starts once, preserving caller layout and focus. It uses a Herdr linked worktree when the parent workspace supports it, otherwise a standalone workspace. Send tasks separately after startup; monitored work also needs [verified native identity](skills/ruach-herdr/references/waiting.md#initialize-worker-identity). See [launch prerequisites and recovery](skills/ruach-herdr/SKILL.md). Catalog selection does not authorize model calls or establish native advisory acceptance.

For `just architect`, the default worker name is `ruach-architect`, checkout `/path/to/ruach-worktrees/ruach-architect` next to this repo, branch `ruach/ruach-architect`, and base committed HEAD. Choose a fresh worker name for each launch; existing branches and paths are rejected. Uncommitted source edits are not copied. Use `--worktree DIR`, `--branch NAME` and `--base REF` to customize the checkout. Native settings are read again from the actual worker checkout before startup. `--placement pane` explicitly uses the supplied source cwd and requires a caller pane ID.

With access to the same Herdr session, inspect a background worker or bring its workspace into view using the returned workspace ID:

```sh
herdr agent read ruach-designer --source recent-unwrapped
herdr workspace focus <returned-workspace-id>
```

Results include workspace/pane IDs, worktree path/branch/base and inspection commands. If creation or startup fails after mutation, inspect those resources and the reported state before retrying. The launcher retains them for recovery. After reuse ends, close the owned session/workspace and remove its worktree only after committing useful work to a retained branch: `herdr worktree remove --workspace <id>` for a linked launch (the result reports which), otherwise `git worktree remove`; keep the branch.

A native trust or onboarding dialog returns `action: awaiting-input` with `ready: false` and the existing workspace ID. Open that workspace and complete the confirmation with user approval. This is a waiting session, not a reason to create another worker. See [first launch and recovery](docs/operations.md#first-launch-and-native-confirmations).

Use `BUN_BIN` to override Bun, otherwise Just uses `~/.bun/bin/bun` when present, then `bun` on PATH. `bun run agent-routing -- resolve coordinator` is also available. `--root DIR` selects another Ruach worktree's routing catalogs and working directory while retaining the launcher and canonical resources from this checkout.

Global discovery uses the standard installation commands above. The source launcher injects the selected role from its canonical source, exposes source skills privately for Claude/OpenCode/Agy and supplies their source location to Codex. Launch commands do not perform a global installation. OpenCode requires v2.1.4+ within major 2; use `--permissions inherit` and a model from its native catalog. Explicit effort selects an offered model variant; `auto` uses its default. See the [OpenCode adapter contract](skills/ruach-herdr/references/adapters.md#opencode-v2).

## Verify

```sh
bun run check
bun run release-check
bun run test
# In each of skills/ruach-handoff, skills/ruach-herdr, skills/ruach-harness-eval:
bun install --frozen-lockfile
bun test --timeout 30000   # Herdr suite only: real processes need more than the 5 s default
```

Bun is required for executable skill suites. Herdr tests require local socket binding. Claude/Codex/OpenCode/Pi/Goose and bounded non-Coordinator Agy preparation are supported subject to runtime gates; DSH and OMP fail before mutation for unsupported/unverified capabilities. Pi requires v1.4+ within major 1; Goose requires v1.56+ within major 1 and Herdr support for `goose` (absent in the inspected Herdr). Both use `--permissions inherit`; Goose effort must be omitted or `auto`. Agy requires exactly 1.4.7 and inherited permissions; its [source review and actual linked advisory gates](docs/roadmap.md#c2--gemini-workeradvisor-adapter) remain open. No Agy continuation or ambient/global workflow exclusion is claimed. See [Herdr prerequisites and limits](skills/ruach-herdr/SKILL.md). Fake CLI tests and static checks do not establish model/account availability, live prompt discovery or behavioral quality. Librarian [evaluation cases](evals/ruach-librarian/README.md) are prepared for a separate blind evaluator.

## External Coordinator waiting

The Coordinator parks with no wait timer or idle model calls when only delegated work remains. Run `just agent-waiting watch --record TASK.md --journal PRIVATE/events.json` as a separate supervised process, and use `just agent-waiting status` with the same paths before parking ([setup and recovery](skills/ruach-herdr/references/waiting.md)); it queues actionable worker events into the same named Codex session and waits for durable task-record dispositions. Worker launching is unchanged. The setup guide names the tested continuation path and recovery requirements.

## Releases

Use Semantic Versioning for the repository bundle. Update the root `package.json` version, `.claude-plugin/plugin.json` version, marketplace metadata version, the current release and installation examples in this README, and `CHANGELOG.md` together. Skill-local private package versions remain independent implementation-package metadata.

An untagged preparation synchronizes metadata and records open gates before independent review; it is not publication or installation authority. Keep remote examples on the latest published version, and update release status and examples when the new tags are published. Inspect a concrete preparation using `--revision` in a new temporary consumer. Refresh outstanding source/live/product evidence and independently review the exact combined candidate before assigning delivery.

Run `just release-check`, `just check`, the root tests and affected skill suites before committing. Create an annotated `vMAJOR.MINOR.PATCH` tag on the release commit. `claude plugin tag .` creates the additional native `ruach--vMAJOR.MINOR.PATCH` tag used for Claude plugin dependency-version resolution; both tags name the same commit. Never move or overwrite a released tag. Remote publication is a separate explicit step.
