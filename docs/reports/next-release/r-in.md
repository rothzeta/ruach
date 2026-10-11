task: RUACH-ROADMAP-IMPLEMENTATION/R-IN
status: blocked
outcome: "Disjoint preparation is done on the new integration branch: recovery and regression docs, roadmap and native-parity status, R1/R2 changelog entries added to the accepted R3 content, and the accepted-B clarity amendment. Final packet assembly, CI amendment and the single full verification gate are held until the Coordinator names independently accepted S-fix and C SHAs."
candidate_revision: 202da6f46c6112c9bfb1feac72115f0c3bf5047e
tested_revision: 202da6f46c6112c9bfb1feac72115f0c3bf5047e
baseline: 2e14d3dde8792f5c01a3ffda1edf1a6eae5ed0d4
artifacts:
  - docs/operations.md
  - docs/regression-cases.md
  - docs/native-parity.md
  - docs/roadmap.md
  - CHANGELOG.md
  - agents/coordinator.md
  - docs/examples/consumer-example.md
  - docs/assignments/next-release/r-in.md
  - docs/reports/next-release/r-in.md
verification:
  - "just check: exit 0 (under verification.lock)"
  - "bun test --timeout 30000 tests/docs-consistency.test.ts tests/ready.test.ts: exit 0, 18 pass 0 fail (no test edit was needed)"
  - "Not run, held: just install refresh, just release-check, bun run test, just test, audits, packet typechecks and tests, fresh coordination prepare, smoke flow controls, CI amendment"
  - "validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "Branch ruach/r1-r2-r3-integration was created from exactly 2e14d3d (absent before); ruach/r2-install-lock stays at 2e14d3d. main is untouched at d75039a."
  - "Frozen owner inputs verified by SHA256 (roadmap 7e81217f, native-parity 248a8931, RAMEC c2487a28 read-only) and used as the starting bytes of docs/roadmap.md and docs/native-parity.md; the roadmap differs from the frozen bytes only by three added local-status paragraphs, native-parity only by one corrected sentence."
  - "The R2-B report and evidence (c170d27) are not on this branch, so docs cite it by commit and do not link it; just check validates relative links."
  - "The accepted B3d512e content was kept; the changelog R3 bullet was refreshed in place, keeping the changelog-hook entry, with actor attribution. No version bump."
blockers:
  - "Coordinator must name the independently accepted S-fix SHA (current candidate e102a40 and report 2e14d3d) and C packet SHA (09f5afc) before final assembly."
  - "Independent fresh combined review is required afterwards."


# R-IN partial report

Everything below ran in the reused worktree on `ruach/r1-r2-r3-integration`; no merge of `main`, push, tag, native or model use.

## Source and input provenance

Base `2e14d3dde8792f5c01a3ffda1edf1a6eae5ed0d4` already contains accepted installer `877fc68`, A `123ade3`, B `3d512e7` (with the A/B accepted reviews named in the assignment) and R2-L/R1-F `405ffe2`, plus the unaccepted corrected smoke packet. No merges were needed in this phase and no conflicts occurred. Packet C (`09f5afc`) and the S-fix acceptance are not incorporated.

## Prepared content

- `docs/operations.md`: lock-ordered install, symlink preflight, active versus interrupted staging, `--replace` limits, root-creation note (preflight refusal creates nothing; a missing root may stay empty after a lost or failed lock or a post-lock refusal), cwd preflight exit 2 before checkout resources (approved native preparation may still have run), partial receipt IDs as hints that can be null with an inspect-then-explicit-release procedure, and the replacement-ref limitation worded from the R2-B fake and public-source evidence with live behavior unverified.
- `docs/regression-cases.md`: rows with actual suites and case names (R2-I, FIX1 symlink, R2-L receipt and cwd, R1-F order assertion) and a documented-only row for linked replacement refs.
- `docs/roadmap.md` (from the frozen bytes) and `docs/native-parity.md`: local status paragraphs for R1 (diagnosed assertion fixed locally, failed run URLs kept, no hosted or native claim), R2 and R3 (static, behavioral evaluation pending); the unsupported "already triggers a root install" sentence corrected while keeping the no-install facts and open D1/D2.
- `CHANGELOG.md`: R1, R2 installer and R2 launch entries, the R3 bullet with Coordinator-versus-Architect attribution, hook entry kept.
- B amendment: Coordinator pre-send checklist duty, the "different target branch" delivery phrase.

## Held and remaining

Final packet incorporation, resource-instruction refresh, CI steps and the single full verification are not done and not claimed; this phase's two checks do not certify the combined candidate. Review is not run. Historical immutable assignment EOF whitespace was not examined yet.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
