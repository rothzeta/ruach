task: RUACH-ROADMAP-IMPLEMENTATION/R1-S-PREP-TYPES
status: complete
outcome: The packet's TypeScript is now typechecked by a packet-local tsconfig extending the root compiler options; it passes with no source changes needed. Root config, CI, package and justfile are unchanged, so root checks still do not cover the packet. Review not run.
candidate_revision: f363628fbedfb495d5baae9114c6241c0105f07e
tested_revision: f363628fbedfb495d5baae9114c6241c0105f07e
artifacts:
  - docs/reports/next-release/r1-s-prep-types.md
  - docs/assignments/next-release/r1-s-prep-types.md
  - evals/next-release-native-smoke/tsconfig.json
  - evals/next-release-native-smoke/README.md
verification:
  - "node_modules/.bin/tsc --version: 7.0.2 (root pinned compiler)"
  - "node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json from the root: exit 0; --listFilesOnly shows scripts/*.ts (5), tests/smoke.test.ts, fixture/consumer/src/range.ts, evaluator/solved/src/range.ts"
  - "Negative control: a deliberate string-to-number assignment appended temporarily to scripts/lib.ts made the same command exit 1 (TS2322); the file was restored and git status showed it unmodified"
  - "bun test --timeout 30000 evals/next-release-native-smoke: 8 pass, 0 fail; exit 0"
  - "just check: exit 0; just release-check: exit 0"
  - "bun run test not re-run: no runtime or root file changed (one config file and README prose); the previous root run at 5ab142b was 90 pass, exit 0"
  - "Heavy commands serialized through /tmp/ruach-implementation-20261011/verification.lock"
review: not-run
discoveries:
  - "No type errors existed in packet-owned files, so no source edits were made. Fixture tests stay as *.fixture and are neither discovered nor typechecked; the check is static only and is not behavior evidence."
  - "Root just check and root tsconfig still do not cover the packet; the README documents the separate command. Adding it to root checks would need a scoped root amendment (not made)."
blockers: []

# R1-S-PREP-TYPES report

Scope: only evals/next-release-native-smoke/tsconfig.json and the README typecheck section changed. Native, blind and live-route holds from the R1-S-PREP report are unchanged. Hosted CI was not run.
