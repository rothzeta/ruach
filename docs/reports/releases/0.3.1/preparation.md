task: RELEASE-0.3.1-PREP
status: complete
outcome: "Prepared the reviewable Ruach 0.3.1 candidate on ruach/release-0.3.1: the reviewed R1-R3 product source/tests/public docs, two developer eval packets, the eight accepted roadmap plans, the owner RAMEC disposition document and sanitized public planning receipts, with package/plugin/marketplace/README/CHANGELOG advanced to 0.3.1. Required checks passed on the exact candidate. No hosted, native, blind or behavioral result is claimed; independent review is pending."
candidate_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
artifacts:
  - docs/reports/releases/0.3.1/preparation.md
  - docs/reports/releases/0.3.1/publication-manifest.txt
  - docs/reports/releases/0.3.1/r2-b-boundary.md
  - docs/assignments/release-0.3.1/preparation.md
  - "branch ruach/release-0.3.1"
  - "tested candidate 4cca79b9c628f80d4d20b897ac65dac7bcc85190"
verification:
  - "Dependency setup, cwd /opt/dev/ruach/.worktrees/release-0.3.1 (or the named skill dir): bun install --frozen-lockfile in the root, skills/ruach-handoff, skills/ruach-herdr, skills/ruach-harness-eval and skills/ruach-changelog, exit 0 each; no global installs."
  - "just check: exit 0 (bun scripts/check.ts printed 'Resource identities, eval placement and relative Markdown file targets passed'; tsc -p tsconfig.json no diagnostics)."
  - "just release-check: exit 0, 'Release v0.3.1: package, plugin, marketplace, agents and changelog verified'."
  - "bun run test: exit 0, 100 pass 0 fail, 867 expect() calls across 10 files."
  - "skills/ruach-herdr (cwd that dir): bun test --timeout 30000: exit 0, 162 pass 0 fail; bound 180 s, 122.35 s; the temporary Unix socket bound locally with no escalation."
  - "skills/ruach-handoff (cwd that dir): bun test: exit 0, 28 pass 0 fail."
  - "skills/ruach-harness-eval (cwd that dir): bun test: exit 0, 71 pass 0 fail."
  - "skills/ruach-changelog (cwd that dir): bun test: exit 0, 35 pass 0 fail."
  - "Packet typechecks (cwd root): bun x tsc -p evals/next-release-native-smoke/tsconfig.json and bun x tsc -p evals/ruach-coordination/tsconfig.json, exit 0 each, no diagnostics."
  - "Packet suites (cwd root): bun test --timeout 30000 evals/next-release-native-smoke exit 0, 14 pass 0 fail; bun test --timeout 30000 evals/ruach-coordination exit 0, 10 pass 0 fail; bound 120 s each."
  - "Integrity (helper verify.ts): 92 delivered files byte-identical to the reviewed revision 94cdfa1a68e214a07d27fc5d413863dcbe3e7459, 0 mismatches; docs/operations.md differs only by the sanctioned link repair."
  - "Publication scope (helper scope.ts): 0 excluded private paths present (.worktrees/.agents/.codex, node_modules, next-release/r3 reports and assignments, roadmap-implementation, release-wave2, native prep/login, enoch prep)."
  - "Content scan (helper scan.ts; diagnostics only, values never echoed): no credentials, private keys or home paths; only benign matches, 'source/root/release' prose and the pre-existing synthetic test literals in skills/ruach-herdr/tests."
  - "git diff --check HEAD: exit 0, no whitespace diagnostics."
review: not-run
discoveries:
  - "The reviewed docs/operations.md linked the excluded private R2-B report. Per the publication policy it now links the sanitized public summary docs/reports/releases/0.3.1/r2-b-boundary.md; that is the only deviation from the reviewed product bytes."
  - "Public planning receipts and the accepted plans were sanitized for portable paths (/opt/dev/ruach, /tmp scratch, /home/<user>); originals are archived outside the repository under the task scratch helper directory."
  - "Roadmap and native-parity remain the reviewed blobs that incorporate the owner edits; the RAMEC disposition document is copied byte-for-byte unchanged from the owner's working-tree version."
  - "No hosted CI, native route, blind or behavioral result exists for this candidate. The task-local OpenCode evaluation is not release evidence: the smoke subject was accepted, the synthetic non-blind Enoch exercise was accepted then discarded, authorization was accepted, resume failed (runtime write denial, replacement without recorded preservation) and ambiguity was unverified. The source OpenCode launcher remains unsupported; the task-local native entry was an exception, not an adapter feature."
  - "The accepted next-*.md plans are specifications for future assignments, not completed implementation; every execution hold named in them remains open."
blockers: []

# Ruach 0.3.1 preparation

Prepared the reviewable candidate on branch `ruach/release-0.3.1` at `4cca79b9c628f80d4d20b897ac65dac7bcc85190` from base `d75039aa7b82b262e2f28af08630258fb7f77180`. The exact published path set is `docs/reports/releases/0.3.1/publication-manifest.txt` (174 payload files). No tag, merge, main write, push or publication was performed, and main was not mutated.

## What is in the candidate

- Version bump to 0.3.1 in `package.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, the README current-release and install examples, and a dated 0.3.1 `CHANGELOG.md` entry moved from Unreleased and including the `ruach-changelog` addition. Skill-local versions are untouched.
- The reviewed R1-R3 delivery from `94cdfa1a68e214a07d27fc5d413863dcbe3e7459` (source and reviewed paths): installer and Herdr changes, coordination guidance docs and examples, and both developer eval packets (`evals/next-release-native-smoke`, `evals/ruach-coordination`) plus the CI packet steps.
- The eight accepted roadmap plans and the index under `docs/design/`, the owner RAMEC disposition document, and the public planning receipts under `docs/reports/roadmap-planning/`.
- This preparation report, the publication manifest and the sanitized R2-B boundary summary.

## Not verified

Hosted CI, native/model behavior, blind boundaries and any real consumer task were not observed. This candidate does not establish Claude/Codex compatibility, a green hosted run or the R3 held-out behavioral evaluation. Independent review is required before any promotion, tagging or publication.
