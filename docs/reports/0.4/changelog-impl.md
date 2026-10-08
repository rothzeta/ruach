---
task: RUACH-0.4-changelog
status: complete
outcome: Review fixes B1, S1-S5, O1, O2 applied on top (see Review round). skills/ruach-changelog added (hook script, register command, docs), plugin hooks/hooks.json, CHANGELOG, justfile test line, design §8 marked implemented. Not pushed or merged.
candidate_revision: b76ec14a9c16be7d88539a76a15838786dbc16c0
tested_revision: b76ec14a9c16be7d88539a76a15838786dbc16c0
artifacts:
  - skills/ruach-changelog/
  - hooks/hooks.json
  - docs/reports/0.4/changelog-impl.md
verification:
  - "review round: new tests written first, 13 failed before the fixes; then skill suite 30 pass 0 fail, just check exit 0, bun run test 90 pass 0 fail"
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

## Review round (changelog-review)

- B1: target must be relative; realpath of the nearest existing ancestor must be inside the realpath of the project; symlinked target refused; file opened with O_NOFOLLOW. Failures: stderr, exit 0, `{}`. Tests: `../`, absolute, symlinked file, symlinked directory, plus an in-project nested control.
- S1: plugin command passes `--project "${CLAUDE_PROJECT_DIR}"`; for Claude the script also prefers `CLAUDE_PROJECT_DIR` over payload cwd; empty `--project` falls through.
- S2: lock removed. One O_APPEND write per line, documented in SKILL.md. Tests that can fail: a leftover `.lock` file neither blocks nor is touched (the old code waited 5 s and failed), no lock is created, existing content is preserved, plus the 12-writer 200 KB concurrency test.
- S3: all paths single-quoted; test runs the written command via `sh -c` from a path with a space.
- S4: own entries recognised by `ruach-changelog/scripts/changelog.ts` and replaced; test registers from two copies.
- S5: subagent test asserts exit 0 and `{}` plus a non-subagent control; added agy merge, exact Claude async command, and missing-bun tests.
- O1: non-array/non-object shapes exit 2 with a message, nothing written. O2: stray test file removed.
- Plugin command guarded with `command -v bun`; tested with an empty PATH.
- Not changed: O3 (PROVENANCE wording, repo-wide). `bun run test` excludes skill suites; `just test` includes this one.
