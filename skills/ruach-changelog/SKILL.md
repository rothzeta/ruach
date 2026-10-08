---
name: ruach-changelog
description: Append each finished turn and, where the harness exposes it, each compaction summary from Claude Code, Codex or agy to a consumer-declared JSONL changelog file through one opt-in hook script. Use to enable, register or troubleshoot that session changelog hook in a consumer repository; not for release changelogs or Ruach's own CHANGELOG.md.
compatibility: Requires Bun. Tests run with `bun test` in the skill directory; no dependencies to install.
---

# Ruach changelog hook

One script, `scripts/changelog.ts`, reads one hook payload on stdin, detects the harness from its keys, and appends one JSON line `{ timestamp, harness, session, turn, kind, text }` (plus `reason` when `text` is `null`) to the consumer's target file with one `O_APPEND` write per line (no lock; concurrent writers cannot interleave lines on a local file). It always exits 0 and prints `{}`; malformed input or config is reported on stderr only. Subagent payloads (`agent_id`) are skipped.

## Opt in (per project)

The hook does nothing until the project has `.ruach/changelog.json`:

```json
{ "target": "docs/session-changelog.jsonl", "kinds": ["turn", "compaction"] }
```

There is no default target. `target` must be relative and stay inside the project: absolute paths, `..` escapes and symlinked files or directories are refused (stderr note, exit 0, `{}`). Summaries quote the conversation: git-ignore the target. The hook never commits.

## Register

- Claude Code: the Ruach plugin ships `hooks/hooks.json` (async `Stop` and `PostCompact`, passing `--project "${CLAUDE_PROJECT_DIR}"`, skipped when `bun` is missing); it is a no-op for projects without the config.
- Codex and agy: `bun skills/ruach-changelog/scripts/register.ts --project <consumer repo>` writes only `<repo>/.codex/hooks.json` and `<repo>/.agents/hooks.json` with absolute paths, replacing earlier Ruach entries (recognised by `ruach-changelog/scripts/changelog.ts`, whichever copy wrote them) and keeping others; paths are shell-quoted. It never touches user-level or global settings.
- The user approves Codex hook trust (`/hooks`, `[features] hooks = true`) and agy workspace trust; do it for them neither here nor elsewhere.

Per-harness facts and limits: [harnesses](references/harnesses.md).

## Limits

- Codex compactions log a marker with `text: null`: the harness gives no summary.
- agy has no compaction event; its end-of-turn text is read from the transcript.
- A summary is the model's paraphrase, not the owner's words; decisions belong in the consumer's own records.
