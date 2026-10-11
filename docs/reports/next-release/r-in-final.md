task: RUACH-ROADMAP-IMPLEMENTATION/R-IN-FINAL
status: complete
outcome: "The accepted R1-R3 union is assembled on ruach/r1-r2-r3-integration: exact accepted C packet merged, named review and R2-B records imported, packet clarifications and scoped CI steps added, and the full union gate passed locally once on the committed tested revision. No hosted, native, smoke-matrix, behavioral or Enoch result is claimed; fresh combined review is pending."
candidate_revision: 0364cc32a00e8bd74336e9210e1bbe2bb1d0069e
tested_revision: 0364cc32a00e8bd74336e9210e1bbe2bb1d0069e
baseline: 58ed66d9f43ec48afdc3d5e7465aac3002a30e8e
artifacts:
  - docs/reports/next-release/r-in-final.md
  - docs/assignments/next-release/r-in-final.md
  - docs/reports/next-release/r-in.md
  - evals/ruach-coordination
  - evals/next-release-native-smoke
  - .github/workflows/ci.yml
verification:
  - "just install: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "just test: exit 0 (herdr 162 pass, harness-eval 71 pass, changelog 35 pass, handoff 28 pass; 0 fail)"
  - "bun audit in root, skills/ruach-handoff, skills/ruach-herdr: exit 0 each"
  - "node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json and evals/ruach-coordination/tsconfig.json: exit 0 each"
  - "bun test --timeout 30000 evals/next-release-native-smoke: exit 0, 13 pass 0 fail (includes the documented live flow, base, control and protected-test negative controls)"
  - "bun test --timeout 30000 evals/ruach-coordination: exit 0, 10 pass 0 fail"
  - "bun evals/ruach-coordination/prepare.ts --out <fresh temp>: exit 0, 3 cases, reports_validated 9, invalid_reports 0; the one generated subject report found by path also validates individually (exit 0)"
  - "All commands sequential under /tmp/ruach-implementation-20261011/verification.lock, bounds 300 s (600 s for bun run test and just test); logs in OS temp"
  - "git diff --check: no diagnostic in files changed since 58ed66d except whitespace inside the imported immutable evidence file docs/reports/next-release/r2-b-evidence/herdr-version-help.txt; the earlier known EOF diagnostics of the original r2-i.md and r2-l.md assignments (range from d75039a) are preserved, not rewritten"
  - "handoff validator for this report: see Validation"
review: not-run
discoveries:
  - "Frozen owner inputs: docs/roadmap.md equals the frozen bytes (SHA256 7e81217f...) plus only added local-status paragraphs (0 frozen lines removed); docs/native-parity.md (248a8931...) differs by one corrected sentence; RAMEC untouched."
  - "The ci.yml fetch step (git fetch --unshallow --tags) exists so the smoke packet's offline install control can clone and resolve v0.3.0 on a shallow hosted checkout; it has never run hosted."
  - "Dependent C review af3da3e supersedes nothing here; imported records are copies, byte-identical to the source commit (checked per file)."
blockers: []


# R-IN-FINAL report

Branch `ruach/r1-r2-r3-integration`; `ruach/r2-install-lock` stays at `2e14d3d`; `main` is untouched at `d75039a`; no push, tag or native use. The earlier blocked `r-in.md` report is kept unchanged. Independent fresh combined review is required and not run.

## Assembly provenance

| Step | Source | Result |
| --- | --- | --- |
| Base | partial report `58ed66d9f43ec48afdc3d5e7465aac3002a30e8e` | contains accepted installer, A `123ade3`, B `3d512e7`, R2-L/R1-F `405ffe2` and S correction `2e14d3d` (review `fb38b368`) |
| Merge | accepted C exact `25aadf1ddc52f811d270389eb47fc7e9fe61eba9` (review `af3da3e0`), merge commit `14a7f84eb52238be388136e807f6dfeda3a9f8f3` | no conflicts; only `evals/ruach-coordination/**` and `docs/{assignments,reports}/r3/**` added; the moving C branch was not merged |
| Import | 20 review records added by `af3da3e0b0c0ec3edbaeef1a891b67987fbf5408` under `docs/assignments/{next-release,r3}` and `docs/reports/{next-release,r3}`, copied byte-identical, plus R2-B assignment, report and `r2-b-evidence/` from `c170d27734225e5b7928f2597e2cd3734120fad8` (commit `29f48a5d1a1f683afbb9a2302d050cc9eb29465a`) | no name conflicts; no source duplicates |
| Edits | commits `6d3b15072dee5d2542772f1eb8a42fa0776c0e33` and `0364cc32a00e8bd74336e9210e1bbe2bb1d0069e` | below |

Both packets' code and accepted history stay auditable by those SHAs.

## Authorized deltas

- Smoke packet: renamed the two misleading test titles to their coverage (detached HEAD; fixture signing configuration) without redundant tests; probe comment and README state that a negative-path confirmation needs known marker presence outside the effective boundary, an inventory-root confirmation needs existence; README gains a resource-revision section naming the accepted combined A+B+S resources resolved at execution, with no self-SHA.
- Coordination packet: README refreshed to the accepted A+B union (A and B SHAs, exact integrated commit resolved at execution); rubric N1 adds that holding the export screen pending E-1 is also acceptable. Raw cases, sources and control obligations unchanged.
- `.github/workflows/ci.yml`: after the existing `just test` step, added a history-and-tags fetch and one step each for the smoke and coordination packets (pinned local `tsc` then `bun test --timeout 30000`). Existing gates, permissions, timeout and pinned toolchain unchanged. Not run hosted.
- `docs/operations.md` now links the imported R2-B report; `docs/roadmap.md` records the independently reviewed offline packets and classifies the owner-chosen temporary fake Enoch task as a synthetic consumer exercise that leaves the real-product criterion open. No Enoch source change.

## Remaining gaps and holds

No hosted CI run, smoke-matrix row, native or model subject, behavioral evaluation, Enoch exercise or blind claim exists. The CI fetch step is unverified hosted. Fresh combined review pending.

## Validation

The handoff validator and the owned-delta whitespace check exited 0 on this report before its commit.
