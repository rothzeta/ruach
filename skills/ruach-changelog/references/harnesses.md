# Harness reference

Facts come from probes on this machine (Claude Code hooks reference, Codex 0.161, agy 1.3.1). Detection: `conversationId`/`transcriptPath` → agy; `turn_id` → codex; otherwise claude. Registrations also pass `--harness`, which takes precedence. `--project` fixes the project root; otherwise for Claude `CLAUDE_PROJECT_DIR` (the payload `cwd` moves when the agent `cd`s), then `cwd`, `workspacePaths[0]`, then the process cwd.

| | Claude Code | Codex 0.161 | agy 1.3.1 |
|---|---|---|---|
| Registration | plugin `hooks/hooks.json`, `async: true`, `${CLAUDE_PLUGIN_ROOT}` | `<repo>/.codex/hooks.json`, `async: true`; trust per hook via `/hooks` | `<repo>/.agents/hooks.json`, synchronous (30 s default timeout); trusted workspace only |
| Turn text | `Stop.last_assistant_message` | `Stop.last_assistant_message`, `turn_id` | none; last `type == "PLANNER_RESPONSE"` entry's `content` in `transcriptPath` |
| Session / turn | `session_id` / null | `session_id` / `turn_id` | `conversationId` / `executionNum` |
| Compaction | `PostCompact.compact_summary` | `PostCompact`, no text (encrypted): marker with `text: null` | no event |
| Subagents | `agent_id` present: skipped | `agent_id` present: skipped | no documented marker; `agent_id`/`agentId` skipped if present |
| stdout | `{}` | `{}` | must be valid JSON: `{}` |

The agy `hooks.json` shape written is `{"ruach-changelog": {"Stop": [{"type": "command", "command": "...", "timeout": 30}]}}`; the exact entry fields were not verified against a live agy.
