task: 0.3-rel
status: complete
outcome: Merged rev6 report and release-0.3 roadmap commits (real merge commits, roadmap conflicts resolved with every row once), bumped to 0.3.0, corrected changelog and docs; all checks pass.
candidate_revision: c9d48dcddb972c78ab3437ff1e586f22de7f1c67
tested_revision: c9d48dcddb972c78ab3437ff1e586f22de7f1c67
artifacts:
  - docs/reports/0.3/rel.md
  - docs/assignments/0.3/rel.md
  - "branch ruach/ruach03-rel, candidate c9d48dc"
verification:
  - "just install: exit 0"
  - "just check (check + typecheck): exit 0"
  - "just release-check: Release v0.3.0 verified, exit 0"
  - "just test, sequential, exit 0: root 90 pass/0 fail (10 files); ruach-handoff 28 pass/0 fail; ruach-herdr 149 pass/0 fail (2 files); ruach-harness-eval 71 pass/0 fail"
  - "bun audit: No vulnerabilities found (26 packages)"
  - "Not run: GitHub CI, real consumer-task run, paid smoke tests"
discoveries:
  - "Changelog already had a detailed 0.3.0 entry from earlier tracks; edited rather than rewritten"
  - "Clean check adds two fail-closed setup errors (hidden_index_state, content_filter_state, exit 2); no output shape change"
blockers: []


# Report 0.3-rel

Commits on ruach/ruach03-rel (on top of 06d3801): ff0a9ee merge ruach/ruach03-rev6 (adds rev6 assignment and report); a964e8e merge release-0.3 (conflicts in docs/roadmap.md: kept the native-parity link and Track F section, and the release-0.3 wording of the adapters bullet; A7/A8 rows and the 0.3 exit notes retained, no duplicate rows); c9d48dc release preparation.

Release metadata: package.json, .claude-plugin/plugin.json and marketplace.json set to 0.3.0 (the files release-check validates). README current release and install examples moved to 0.3.0 and docs/roadmap.md status line updated. Skill-local package versions are independent per README and untouched. docs/native-parity.md still says "here 0.2.1" because it records an observed installation.

CHANGELOG: the A1 line no longer claims fsmonitor handling as a check; it describes the git-status clean check and its two fail-closed errors with a link to the trust boundary section. A7 notes the parent-workspace fix. Exit notes replaced by a known gaps line (GitHub CI not run, no consumer-task run, paid smoke tests pending, packaging and Codex TOML decisions open). Track E marked documentation only. Grep found no remaining content-based check or budget text outside the superseded design file and the roadmap's A4 "size budget" row (a different, delivered feature). No "planned" wording about `just ready` remains.

Decisions: the changelog heading stays "0.3.0 — Unreleased" (no tag or date yet; release-check only requires the `## 0.3.0 — ` prefix); set the date at tagging. No push, tag or merge to main.

Handoff validation: validate.ts --repo passed (ok: true, both revisions resolved).
