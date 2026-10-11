task: RUACH-ROADMAP-IMPLEMENTATION/R1-S-PREP
status: complete
outcome: Offline smoke packet prepared at evals/next-release-native-smoke (fixture, assisted and unassisted briefs, evaluator-only material, prepare/check/probe/offline-install scripts, five-row route matrix plus separate fallback) and exercised offline; no model, native CLI, marketplace, Skills CLI, Herdr or account operation was performed. Live execution and any blind claim remain unauthorized or unverified.
candidate_revision: 5ab142bd9e1307681b87df8443ca4dcf771eec19
tested_revision: 5ab142bd9e1307681b87df8443ca4dcf771eec19
artifacts:
  - docs/reports/next-release/r1-s-prep.md
  - docs/assignments/next-release/r1-s-prep.md
  - evals/next-release-native-smoke/README.md
  - evals/next-release-native-smoke/matrix.json
  - evals/next-release-native-smoke/scripts/
  - evals/next-release-native-smoke/tests/smoke.test.ts
  - docs/reports/next-release/r1-s-prep-evidence/
verification:
  - "bun test --timeout 30000 evals/next-release-native-smoke: 8 pass, 0 fail; exit 0 (under verification.lock)"
  - "Original fixture tests at the prepared base: bun test exit 1 (3 of 4 fail: both-endpoints, single-value, size); asserted in packet test and in base-acceptance evidence (all 3 checks failed, scope ok)"
  - "Corrected control (evaluator solution applied by script, committed on branch candidate) vs pinned skills/ruach-harness-eval acceptance.ts + scope-check.ts: visible-tests, hidden-cases, handoff-valid all passed, scope ok; both exit 0. Protected-test edit fails scope (exit 1), asserted in packet test"
  - "Offline install control from explicit revision 5ab142bd9e1307681b87df8443ca4dcf771eec19 in a temp clone with isolated child HOME/CODEX_HOME/CLAUDE_CONFIG_DIR: install, check, frozen deps (ruach-handoff, ruach-herdr), ready --route herdr --json all exit 0"
  - "Historical v0.3.0 route (--version 0.3.0) separately: resolved commit 91ea9b2bd85f404e8e148ca9908217f3e7cb3307, same five steps exit 0; labelled historical, final_candidate_evidence false"
  - "just check: exit 0; just release-check: exit 0; bun run test: 90 pass, exit 0"
  - "Access probe offline controls (packet test): exposed marker, alias-path inventory hit, wrong digest and missing controls all yield non-blind-or-unverified; a mode-000 directory is denied and yields an exclusion verdict for that boundary only"
review: not-run
discoveries:
  - "Blind: not established. Offline probes run in the caller's permissions prove nothing about a subject. The plugin layout copies the whole repository, including evals/ (marker and solved answer) and docs/reports (the control evidence contains the hidden-check program), so default disposition for every row is ordinary non-blind smoke with blind unverified unless probes pass inside the actual subject boundary. D1 packaging is not decided here."
  - "Fixture tests are stored as tests/range.test.ts.fixture and restored by prepare.ts so bun test of the packet does not discover the intentionally failing tests; scripts and tests are outside root tsconfig include, so just check does not typecheck them (no tsconfig change made; scoped amendment would be needed to typecheck them)."
  - "Pinned checker is the in-repo skills/ruach-harness-eval at the source revision of the future run; the matrix lists what live execution must supply (help, readiness, account, registry, native context, resource digests, combined candidate SHA, budget)."
  - "Frozen skill dependency installs in the offline control used the caller's existing Bun package cache (BUN_INSTALL_CACHE_DIR recorded in the install report), not the network; no credential or config root was read."
blockers: []

# R1-S-PREP report

Evidence (sanitized, host paths replaced) is in [r1-s-prep-evidence](r1-s-prep-evidence/): base and control acceptance/scope results, manifests, the generated acceptance configuration, and both install reports. Install-control source revision is the packet commit above, not the final combined candidate.

Coverage: fixture failure and corrected-control behavior; checker, scope and handoff-validator behavior against real Git refs; bounded child processes (own process group, killed on return); fresh-path refusal; no overwrite of earlier result files. Not covered: any model subject, live route row, Claude plugin/Skills CLI/Codex discovery, Herdr, the unassisted variant in a live run, hosted CI.

Live authority holds: native execution needs a separate assignment after a reviewed combined resource SHA, hosted green or explicit waiver, a named budget and the supplied context listed in matrix.json.
