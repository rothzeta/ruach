task: 0.3-impl-b
status: complete
outcome: A2 dependency patches, Track B typecheck/CI/docs and regression-case inventory done; all checks pass locally. CI workflow not yet exercised on GitHub.
candidate_revision: b1f3e39676605ecf16f77fcb90face81bc4f1f1f
tested_revision: b1f3e39676605ecf16f77fcb90face81bc4f1f1f
artifacts:
  - docs/reports/0.3/impl-b.md
  - branch ruach/ruach03-impl-b (commits df482a6, 6a3cf59, b1f3e39)
  - .github/workflows/ci.yml
  - tsconfig.json
  - docs/regression-cases.md
  - docs/operations.md (release verification section)
  - tests/dependencies.test.ts
  - tests/typecheck.test.ts
verification:
  - "just install: exit 0 (frozen)"
  - "just check (resource checks + tsc): exit 0"
  - "just release-check: exit 0 (v0.2.1)"
  - "just test: exit 0; root 53, handoff 24, Herdr 126, harness-eval 59 pass, 0 fail"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff"
  - "dependencies.test.ts failed against old ws 8.18.3 lock before the fix, passes after"
  - "CI workflow: not run (no GitHub runner here)"
discoveries:
  - "TypeScript resolves skill dependencies from each skill's node_modules, so typecheck requires just install first; just install now also installs root dev deps."
  - "Typecheck needed @types/ws at root; the two source errors were agent-routing.ts parseArgs union (cast) and native-codex.ts ws types. native-codex.ts itself was not edited."
  - "Test annotations (as any casts on Bun.TOML.parse, env record cast) touch skills/ruach-herdr/tests/spaces.test.ts and worker.test.ts; impl-a may conflict there."
  - "RU-xx mappings in docs/regression-cases.md are inferred from the roadmap, marked as such; audit text unavailable."
  - "All Track B regression cases belong to impl-a items or A5, so none implemented here beyond RU-12 and A2; A5 cases are listed only."
  - "CI actions pinned by tag, not SHA; Bun 1.4.2 and Just 1.40.0 pins reflect local versions; harness-eval has no lockfile so is not audited."
blockers: []
