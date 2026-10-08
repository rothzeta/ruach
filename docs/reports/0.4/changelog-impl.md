---
task: RUACH-0.4-changelog
status: complete
outcome: skills/ruach-changelog added (hook script, register command, docs), plugin hooks/hooks.json, CHANGELOG, justfile test line, design §8 marked implemented. Not pushed or merged.
candidate_revision: a8d42df27f8d56430cddee2c5beb934766f5f869
tested_revision: a8d42df27f8d56430cddee2c5beb934766f5f869
artifacts:
  - skills/ruach-changelog/
  - hooks/hooks.json
  - docs/reports/0.4/changelog-impl.md
verification:
  - "tests written first: 14 of 16 failed before implementation (2 vacuous passes)"
  - "cd skills/ruach-changelog && bun test: 16 pass, 0 fail"
  - "just check: exit 0 (identities, links, tsc)"
  - "bun run test: 90 pass, 0 fail"
  - "just release-check: ok (v0.3.0 metadata; changelog entry under Unreleased)"
  - "not run: live Codex/agy/Claude hook invocations; agy hooks.json entry shape unverified against a real agy"
discoveries:
  - "Claude plugin hooks live at plugin-root hooks/hooks.json (auto-loaded; uses CLAUDE_PLUGIN_ROOT). Not confirmed against the docs in this session; confirm on first plugin install."
  - "No documented agy subagent marker; agent_id/agentId skipped if present."
  - "Config is .ruach/changelog.json {target, kinds}; target relative to project root; hook is silent when absent."
  - "Skill PROVENANCE.md is the identical root copy and does not list the new skill (check requires identical copies); root PROVENANCE.md is out of scope."
  - "Fresh worktrees need just install before just check."
blockers: []
---

# changelog-impl

Script `skills/ruach-changelog/scripts/changelog.ts`, command `scripts/register.ts --project <repo>`, docs in SKILL.md and references/harnesses.md. Lock is a `<target>.lock` file created exclusively (stale after 10 s). Codex/agy registrations pass `--harness` and `--project`. Release version left at 0.3.0; changelog entry is under Unreleased.
