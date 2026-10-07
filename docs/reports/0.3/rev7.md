---
task: 0.3-rev7
status: complete
outcome: "Release candidate c9d48dc passes all gates; no blocking findings; two optional findings (stale Herdr skill package version, changelog heading still says Unreleased)"
artifacts:
  - docs/reports/0.3/rev7.md
  - docs/assignments/0.3/rev7.md
verification:
  - "Detached temporary worktree at c9d48dc, sequential: just install 0, just check 0, just release-check 0 (Release v0.3.0 verified), just test 0 (root 90/0, handoff 28/0, herdr 149/0, harness-eval 71/0 pass/fail), bun audit 0 (no vulnerabilities, 26 packages)"
  - "git diff --stat 06d3801..c9d48dc: 8 files (3 version files, CHANGELOG, README, roadmap, rev6 assignment and report); c9d48dc..60ad1ba adds only docs/assignments/0.3/rel.md and docs/reports/0.3/rel.md"
discoveries:
  - "Optional: skills/ruach-herdr/package.json:3 still has version 0.2.1; release-check does not validate it (root, plugin, marketplace only), and other skills version independently (1.0.0), so it is not a stale-release defect unless Herdr is meant to track the release"
  - "Optional: CHANGELOG.md:5 heading is '0.3.0 — Unreleased' (release-check only requires the '## 0.3.0 — ' prefix); set the date at tagging"
blockers: []
candidate_revision: c9d48dcddb972c78ab3437ff1e586f22de7f1c67
reviewed_revision: c9d48dcddb972c78ab3437ff1e586f22de7f1c67
review:
  - "No blocking findings"
role: reviewer
---

# Review of release preparation 0.3.0

Scope: diff 06d3801..c9d48dc. Head 60ad1ba is c9d48dc plus the rel assignment and report only (verified by diff --stat).

1. **Version.** package.json, .claude-plugin/plugin.json and marketplace.json metadata.version are 0.3.0; release-check passes. README tag and `--version` references are v0.3.0. Remaining 0.2.1 mentions are legitimate: roadmap.md:3 baseline, native-parity.md:33 observed install, CHANGELOG 0.2.1 entry, historical reports. Exception: skills/ruach-herdr/package.json:3 (optional finding above).
2. **Roadmap.** Headings 21-178 show no duplicated sections or rows after the merges. Track F (line 70), the 0.3.x section (89, with Measurement at 104), Gemini (136), user-level conventions (132) and the exit notes (81-87) are present. The A7/A8 rows are in Track A, and the changelog covers both. Gemini cross-reference at line 174 is consistent. I did not run a link checker beyond `just check` (relative Markdown targets passed).
3. **Changelog accuracy.** Supported by code: scripts/common.ts:88 (`--no-replace-objects`, `core.fsmonitor=false`, `core.untrackedCache=false`), :119 `hidden_index_state`, :125 `content_filter_state`, and config.md:88 (exit 2). Trust-boundary sentence present. The changelog and README contain no content-based or budget wording. A7 parent-workspace wording, Track E documentation-only and the known-gaps list are consistent with the roadmap and with native-parity. I did not re-verify the A7 parent-workspace behavior against the Herdr code; I only checked wording consistency with the roadmap.
4. **README.** Current release is 0.3.0; `just ready` is described as an existing read-only check (README:27) and nowhere as planned.
5. **Nothing else changed.** Confirmed by diff --stat.

Unverified: link integrity beyond `just check`, A7 behavior in code, and the GitHub CI job (not run).
