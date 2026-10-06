---
task: 0.3-impl-f
status: needs-decision
outcome: "Track E documented in docs/native-parity.md with offline evidence (Codex discovery, skill exposure, plugin cache, snapshot, Skills CLI), Claude --agent versus Herdr append comparison, Codex TOML export evaluation and a smoke checklist. Paid smoke checks not run (PENDING authorization). Packaging and Codex export await decisions. just test needs a longer per-test timeout on this loaded host."
candidate_revision: 1bc4ec746ad526f1a8d8f798b084cc3f242dd898
tested_revision: 1bc4ec746ad526f1a8d8f798b084cc3f242dd898
artifacts:
  - docs/native-parity.md
  - docs/reports/0.3/impl-f.md
  - tests/docs-consistency.test.ts
  - CHANGELOG.md
  - README.md
  - docs/roadmap.md
  - "branch ruach/ruach03-impl-f"
verification:
  - "just install: exit 0"
  - "just check: exit 0 (resources, links, tsc)"
  - "just release-check: exit 0 (v0.2.1, no version bump)"
  - "bun test tests/docs-consistency.test.ts: 2 new tests failed first (missing guide, missing Track E line), then 6 pass"
  - "just test: root 86 pass, handoff 28 pass, harness-eval 67 pass; herdr suite failed 5 of 146 at the default 5 s timeout (JSON parse EOF), different tests each run (5, then 3 failures) while host load average was about 20"
  - "skills/ruach-herdr: bun test --timeout 60000: 146 pass, 0 fail; so just test is not green as run, only the timeout-extended herdr run is"
  - "Offline experiments with temporary HOME/CODEX_HOME/CLAUDE_CONFIG_DIR: codex app-server config/read and skills/list, claude plugin marketplace add/install/list/details, ruach installer install/check/ready, skills@1.7.0 add --list and add --global; no model prompt"
  - "Not run: any paid session, native role behavior, claude --agent versus append comparison, session-level skill listing in Claude"
discoveries:
  - "Codex registers roles via [agents.<name>] tables (description, config_file) in user or trusted-project config.toml; untrusted project config agents are ignored; bare .codex/agents/*.toml files are not surfaced by config/read (convention loading unverified); Markdown roles are never discovered by Codex"
  - "Codex skills: repo scope .agents/skills, user scope CODEX_HOME/skills and ~/.agents/skills, not .claude/skills; a snapshot at <project>/.agents exposes 8 skills as repo"
  - "Claude plugin install copies the whole repository tree (about 39 MB) into plugins/cache/ruach/ruach/<version>, runs a root install (root devDependencies appear in node_modules) but installs no skill-level dependencies; ruach-handoff validator exits 2 DEPENDENCY_UNAVAILABLE and ready reports missing until bun install --frozen-lockfile is run per skill"
  - "Skills CLI global install writes real files to ~/.agents/skills and symlinks into CLAUDE_CONFIG_DIR/skills; no dependencies installed"
  - "Herdr tests use a 5 s default timeout and fail intermittently under host load; consider a larger per-test timeout in skills/ruach-herdr (not changed here, outside scope)"
  - "Real ~/.claude/plugins/known_marketplaces.json was touched at the same time by a running Claude session (claude-plugins-official timestamp); the experiments' own entries stayed in the temporary config dir and the pre-existing ruach entry is unchanged"
blockers:
  - "needs-decision: plugin-root versus per-skill packaging and dependency installation; evidence is in docs/native-parity.md (Clean-install plugin cache facts)"
  - "needs-decision: exporting canonical roles to native Codex agent TOML; recommendation D for 0.3, generated-and-checked export later (docs/native-parity.md)"
  - "PENDING user authorization: paid clean-install smoke tests per route and the --agent versus append same-task comparison"
  - "Herdr suite timeouts under load: just test needs a quieter host or an extended timeout to be green"
---

# impl-f report (Track E)

See [native-parity.md](../../native-parity.md) for all evidence, the export evaluation and the smoke checklist.

## Changes

- New docs/native-parity.md; links from README, roadmap and a Track E CHANGELOG line (no version bump).
- tests/docs-consistency.test.ts: guide sections, three route headings, PENDING and needs-decision markers, relative links resolve, README and roadmap reference it, changelog states Track E as pending.

## Pending and needs-decision

- Paid smoke checks per route, and the same-task comparison of claude --agent and the Herdr append.
- Packaging (plugin root versus per-skill) and Codex TOML export: no implementation attempted.

## Validation scope

The handoff validator was run on this report with --repo; the result is recorded in the terminal handoff.
