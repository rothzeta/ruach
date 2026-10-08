# Assignment changelog-impl (role: implementer)

Task id: RUACH-0.4-changelog. Workspace: this worktree, based on main.

Requested by the owner (2026-10-08, verbatim): "is there a way to create a hook so the summary is writen to a changelog file? can it be made generic hook so it can be installed in ruach?", "for the hook is it generic and work with codex, agy, and more or what?", "hook feedback you can have and agent build in ruach."

Context (read first): `docs/design/0.4-suggestions-from-ramec-orchestration.md` §8 (the harness comparison table and the proposal), and the probe answers it cites, copied here for you:
- Claude Code: `Stop` gives `last_assistant_message`; `PostCompact` gives `compact_summary`; snake_case; `agent_id` on subagent input; `${CLAUDE_PROJECT_DIR}`; `async: true` allowed; plugin `hooks/hooks.json`.
- Codex 0.161: `[features] hooks = true`; `<repo>/.codex/hooks.json`; `Stop` gives `last_assistant_message`, `turn_id`, `session_id`, `cwd`; `PostCompact` has `trigger` but NO summary text (rollout compactions are encrypted) — log a compaction marker only; `agent_id` on subagent input; no project-dir variable (absolute paths); per-hook trust approved by the user via `/hooks`.
- agy 1.3.1: `<repo>/.agents/hooks.json` (map of hook name → event arrays); events PreToolUse, PostToolUse, PreInvocation, PostInvocation, Stop; camelCase stdin (`conversationId`, `workspacePaths`, `transcriptPath`, `executionNum`, `terminationReason`, `fullyIdle`); no final text in the payload: read `transcriptPath` (JSONL, last entry with `type == "PLANNER_RESPONSE"`, field `content`); no compaction event; hooks are synchronous, default timeout 30 s, cwd is the hooks.json folder, **stdout must be valid JSON** (print `{}`); project hooks load only in a trusted workspace.

Outcome: a new skill folder `skills/ruach-changelog/` with:
1. **One Bun script** that reads one hook payload on stdin, detects the harness by its keys, normalizes to `{ timestamp, harness, session, turn, kind: "turn" | "compaction", text }` (text null with a reason when the harness provides none, e.g. Codex compaction), skips subagent payloads (`agent_id` present, and for agy the documented subagent marker if any), and appends one JSON line under an exclusive file lock to the consumer-declared target. It always exits 0 and prints `{}` on stdout, so it never blocks or fails a turn; malformed input or a missing config is reported on stderr only.
2. **Opt-in per project:** the script does nothing unless the project has a config file declaring the target path and the enabled kinds (`turn`, `compaction`); no default target. Recommend in the docs that the target be git-ignored, because summaries quote the conversation; the hook never commits.
3. **Registrations:** a Claude plugin hook entry (`PostCompact` and `Stop`, async) shipped with the Ruach plugin (it must be a no-op for projects that did not opt in), plus a command that writes the project-level `.codex/hooks.json` and `.agents/hooks.json` entries for a given consumer repo with absolute paths. Never write user-level or global settings; tell the user to approve Codex hook trust and agy workspace trust themselves.
4. `SKILL.md` (name `ruach-changelog`, precise trigger description), a short reference for each harness, and a CHANGELOG entry.

Acceptance:
- Fixture payloads for each harness and event (turn and compaction; Claude, Codex, agy) produce the exact normalized line; subagent payloads produce nothing; a project without the config produces nothing and exit 0; concurrent appends do not interleave lines; agy output on stdout is exactly `{}`.
- The registration command writes exactly the documented project files into a temporary consumer repo and nothing outside it.
- Tests are black-box over the script and the command (stdin in, file and stdout out), failing first.

Scope: `skills/ruach-changelog/**`, the plugin hook file the Ruach plugin needs (e.g. `hooks/hooks.json` at the plugin root — confirm the location from the Claude plugin docs before adding it), `justfile` (one recipe if needed), `CHANGELOG.md`, `docs/design/0.4-suggestions-from-ramec-orchestration.md` §8 (mark the proposal as implemented, with the skill path). Report, do not edit, anything else.

Verification: failing tests first, then `just check`, `bun run test` and the new skill's suite. Keep disposable files outside the repository.

Handoff: write `docs/reports/0.4/changelog-impl.md` with the ruach-handoff leading block, run its validator with `--repo`, and commit this assignment unchanged with the report and the change. Do not push or merge.
