# Native packaging and parity evidence

Evidence for roadmap [Track E](roadmap.md) collected 2026-10-06 with Claude Code 2.1.292, codex-cli 0.160.1, Skills CLI 1.7.0, Bun 1.4.2 and Herdr 0.9.0 on Linux. Every experiment used a temporary `HOME`, `CODEX_HOME` and `CLAUDE_CONFIG_DIR`, and none sent a model prompt. Nothing here was run with a paid session. Statements are marked **verified** (observed locally, offline), **documented** (taken from vendor documentation or installed help, not observed in a session) or **unverified**.

Two decisions are deliberately left open and marked `needs-decision`: plugin-root versus per-skill packaging, and native Codex agent export.

## Codex role and skill discovery

Observed through `codex app-server --listen stdio://` (`initialize`, `config/read`, `skills/list` only), the same read the Herdr adapter uses.

| Fact | Status |
| --- | --- |
| Roles are registered as `[agents.<name>]` tables (`description`, `config_file`, optional `nickname_candidates`) in the user `config.toml` and in a trusted project's `.codex/config.toml`; `config_file` is a native agent TOML. `config/read` returned both. | verified |
| An untrusted project's `.codex/config.toml` layer is listed but its `agents` table is ignored; adding `[projects."<path>"] trust_level = "trusted"` to the user config made it effective. | verified |
| A bare `.codex/agents/*.toml` or `$CODEX_HOME/agents/*.toml` file is not surfaced by `config/read` unless referenced from an `[agents.<name>]` table. Whether Codex loads such files at spawn time by directory convention is not established by the config read. | unverified |
| Codex has no discovery of the canonical Markdown roles in `agents/` (or `.agents/agents`). Ruach roles reach Codex only through the Herdr adapter's `-c developer_instructions=...`, or by being pasted/referenced by the user. | verified (no `[agents]` entry or skill results from them) |
| Codex reads `AGENTS.md` as project guidance (the binary carries the `AGENTS.override.md`/`AGENTS.md` loader and `project_doc_max_bytes` reads as 32768). That is project instruction text, not a role definition. Its effect on a model turn was not observed. | documented / unverified in a session |

Source-mode skill exposure (`skills/list`):

| Harness | Where skills are found | Status |
| --- | --- | --- |
| Codex | Repository scope: `<project>/.agents/skills` (scope `repo`); user scope: `$CODEX_HOME/skills` and `~/.agents/skills` (scope `user`); bundled `system` skills. `.claude/skills` was not listed. A snapshot installed at `<project>/.agents` therefore exposes all 8 Ruach skills as `repo`; a Skills CLI global install exposes them as `user`. | verified |
| Claude Code | Plugin skills (`claude plugin details ruach@ruach`: 8 skills, 6 agents, 0 hooks, about 752 always-on tokens); the Skills CLI symlinks skills into `$CLAUDE_CONFIG_DIR/skills` (verified install layout). Reading `.claude/skills` and `--add-dir` directories is documented and relied on by the Herdr adapter; that a running session lists them was not observed. | install layout verified; session exposure documented |
| Skills CLI | `skills add <dir> --global --agent codex --agent claude-code --skill '*'` wrote the real files to `~/.agents/skills/<skill>` (universal, read by Codex) and symlinked them into `$CLAUDE_CONFIG_DIR/skills/<skill>`. No `node_modules` was installed. | verified |

Source mode means the repository's own skills are visible only when they sit in a harness-readable location. A Ruach checkout's `skills/` is not one, so a Ruach checkout needs the plugin (`--plugin-dir .`), a snapshot, or the Skills CLI to expose them.

## Clean-install plugin cache facts

`claude plugin marketplace add <checkout> --scope user` then `claude plugin install ruach@ruach --scope user`, with a temporary `CLAUDE_CONFIG_DIR`:

- Installed at `plugins/cache/ruach/ruach/<version>/` (here 0.2.1), recorded with `gitCommitSha` of the checkout `HEAD`; `plugin list` reports the version and the checkout as the read source.
- The cache holds the whole repository tree (`agents/`, `skills/`, `docs/`, `scripts/`, `tests/`, `evals/`, `justfile`, `package.json`, `bun.lock`, about 39 MB), not only `agents/` and `skills/`.
- A root `node_modules/` appeared in the cache even though the source worktree had none. It held only the root `devDependencies` (`typescript`, `bun-types`, `@types/*`, `undici-types`). Claude therefore ran a root package install during plugin installation.
- No `node_modules/` exists under any `skills/*/` folder. `ruach-handoff` needs `ajv`/`yaml` and `ruach-herdr` needs `ws`/`yaml`.
- Consequences, verified in the cache: `bun scripts/install.ts ready --route native` reports `missing` nested packages for `ruach-handoff` and `ruach-herdr`; `bun skills/ruach-handoff/scripts/validate.ts <report>` exits 2 with `DEPENDENCY_UNAVAILABLE`. After `bun install --frozen-lockfile` in each skill (no `--ignore-scripts` needed, packages come from the lock) the same readiness check is `ok`. This is the same for the snapshot route (verified below).
- The marketplace declaration `source: "./"` makes the plugin root the repository root. Skills are found at `skills/`, agents at `agents/` without any extra manifest field.

Evidence for the packaging decision, not a decision: the plugin-root approach copies everything and already triggers a root install but never installs skill-level dependencies; a per-skill approach (each skill folder self-contained) would need a post-install step either way because the Skills CLI also installs no dependencies. `needs-decision`: whether to ship a plugin that is rooted at a trimmed directory, add a documented post-install step, vendor dependencies, or keep the current behavior with the existing `ready` remediation.

Snapshot route, run offline into a temporary directory:

- `bun scripts/install.ts install --source <checkout> --revision HEAD --target <project>/.agents` installed 76 files (`agents/`, `skills/`, `ruach/`, `ruach.json`, `ruach-install.ts`), no `node_modules`.
- `bun .agents/ruach-install.ts check --target .agents` printed `Snapshot verified`.
- `ready --route native` before dependencies exited 1 with the exact `bun install --frozen-lockfile` remediation for `ruach-handoff` and `ruach-herdr`; after running those two commands, `ready --route herdr` exited 0.
- Codex `skills/list` for the project listed the 8 Ruach skills with scope `repo`.

One caution: a plain `claude` run elsewhere refreshed `~/.claude/plugins/known_marketplaces.json` (the `claude-plugins-official` timestamp) during the experiment window. The cause is unattributed: it could be a background refresh by a running Claude session or one of the experiment commands, and no evidence here separates them. The experiments' own marketplace and plugin entries are only in the temporary config directory; the pre-existing `ruach` entry in the real file is unchanged.

## Claude `--agent` versus the Herdr adapter

| | `claude --agent ruach:<role>` (plugin route) | Herdr adapter (`--append-system-prompt-file <role.md>`) |
| --- | --- | --- |
| Mechanism | Runs the main session as the named native agent. Per Claude Code documentation, the agent definition body acts as the session's system prompt in place of the default Claude Code prompt, and the definition's frontmatter can also set tools and model. | Keeps Claude Code's default system prompt and appends the canonical role Markdown to it. Model is set by `--model`; tools are not restricted by the role file. |
| Role source | Plugin copy of `agents/<role>.md` (name `ruach:<role>`). | The canonical `agents/<role>.md` of the checkout, referenced by path. |
| Plugin dependency | Needs the plugin installed (or `--plugin-dir`). | None; skills are exposed with `--add-dir` and a private overlay hides local `ruach-workflow-*` skills from workers (`skillOverrides`). |
| Composition result | The role is the system prompt; whether any default Claude Code guidance is retained alongside it is not observed here. | Default prompt plus role text; the role is one part of a longer prompt, so instruction precedence is by position and wording, not by replacement. |

Status: the flags (`--agent`, `--append-system-prompt`, `--add-dir`, `--plugin-dir`, `--settings`) are verified in the installed 2.1.292 help, and the adapter's argv is verified by fixture tests. That `--agent` replaces rather than appends, and what an agent actually sees in each mode, are documented but not observed. The roadmap's "check it with the same small task" comparison needs paid sessions and is **PENDING**: run the same Implementer task (see the checklist) once through each mode and compare the handoff, scope discipline and instruction adherence. Until then, treat the two modes as equivalent only for role text delivery, not for behavior.

## Native Codex agent export evaluation

Question: should the canonical Markdown roles also be exported to native Codex agent TOML (`[agents.<name>]` plus a `config_file` TOML with `developer_instructions`) while keeping one source of truth? `needs-decision`; nothing was implemented.

What a native entry offers (verified fields: `description`, `config_file`, `nickname_candidates`): roles selectable by Codex's own multi-agent features without the Herdr adapter, and a way for an ordinary Codex session to spawn Ruach roles.

| Option | Description | Risks |
| --- | --- | --- |
| A. Do nothing | Codex roles come only from the Herdr adapter. | Direct Codex users get skills but no named roles; documented gap. |
| B. Generated export, committed | A TypeScript script renders `agents/*.md` into TOML under a generated directory; a check fails when it is stale. | A second committed copy of role text; drift if the check is skipped; contradicts the "no second editable copy" rule unless clearly marked generated. |
| C. Generated at install time | The installer (snapshot or a new `export` command) writes TOML into the consumer's `.codex` and registers `[agents.*]`. | Writes consumer config (`config.toml`), which Ruach's rules forbid doing as a side effect; needs explicit user command and conflict handling. |
| D. Adapter only | Keep `developer_instructions` through the Herdr adapter and document it as the Codex role route. | Same as A for direct use; argv exposure of role text already documented. |

Cross-cutting risks: Markdown frontmatter has no tool or model fields, so mapping is lossy and each field needs a decision; role bodies link to skills by relative path, which Codex TOML does not resolve; native role registration is project-trust dependent (observed above); registration of agents by directory convention is unverified; role instructions would then exist in two paths for Herdr-launched Codex workers (adapter text plus native role).

Recommendation: choose D for 0.3 and document it, then, if direct Codex role use is wanted, take option B-as-generated-and-checked in 0.3.x with a pure rendering function, a staleness check in `just check`, and no consumer-config writes. Not implemented; requires a product-scope decision.

## Clean-install smoke checklist

All items are **PENDING user authorization** for paid sessions. Offline-checkable steps are recorded above; the rest must not be run without that authorization. Use a throwaway consumer repository and temporary `HOME`/`CODEX_HOME`/`CLAUDE_CONFIG_DIR` where possible.

Small task for every route: in a repository with one failing unit test caused by an off-by-one, run the Implementer with this assignment: "fix the defect, edit only `src/`, run the tests, return a ruach-handoff report." Expected on every route:

- the Implementer role is active (it states its scope and boundaries);
- `ruach-testing` and `ruach-handoff` are used or visible, and workflow skills are not loaded by the worker;
- authority is respected (edits only the assigned files, no merge, tag or push);
- a report with the leading YAML block is written and `ruach-handoff`'s validator exits 0.

Before each run, `ready` must report the route as `ok` (offline, results above for snapshot).

### Plugin

1. Install: `claude plugin marketplace add <checkout> --scope user` then `claude plugin install ruach@ruach --scope user` (temporary config dir). Offline-verified.
2. `bun scripts/install.ts ready --route native` from the plugin cache, run the two remediation installs, rerun until `ok`. Offline-verified.
3. PENDING: `claude --agent ruach:implementer` and send the small task. Record the role, skills, authority and handoff outcome.

### Snapshot

1. Install into `<project>/.agents` with `bun scripts/install.ts install --source <checkout> --version <v> --target <project>/.agents`; `check`; the remediation installs; `ready --route herdr`. Offline-verified for `HEAD` into a temporary project.
2. PENDING: with Codex, start in the project and ask it to follow `.agents/agents/implementer.md` for the small task; with Claude, use a Herdr launch of the Implementer (adapter route). Record the same four expectations.

### Skills CLI

1. `skills add <checkout>/skills --global --agent codex --agent claude-code --skill '*'` into a temporary `HOME`. Offline-verified layout (no dependencies installed; run `bun install --frozen-lockfile` in `ruach-handoff` before validating a report).
2. PENDING: in each harness invoke the skills for the small task. There are no roles on this route, so the expected role evidence is the assignment text alone (skills only; no native role enforcement).
