task: RUACH-ROADMAP-IMPLEMENTATION/R-COMBINED-FIX1
status: complete
outcome: "B1 is resolved: the offline install control now verifies snapshot, resources and frozen skill dependencies independently of host-native tools, and reports the actual ready result. Optional O1 (README note) and O3 (shallow-aware fetch) are done. Enoch preparation findings E1-E3 are corrected in the future assignment with a versioned correction note, and the 2.1.296 plugin-install observation is added to native-parity. Independent exact re-review is required. No hosted, native, blind or consumer claim."
baseline_revision: 5b9d554081f4b38050fd1076f62907e64ae9ee1f
candidate_revision: ac187d465337c33e0e35549ae245501ae10906ad
tested_revision: ac187d465337c33e0e35549ae245501ae10906ad
artifacts:
  - docs/reports/next-release/combined-fix1.md
  - docs/assignments/next-release/combined-fix1.md
  - evals/next-release-native-smoke/scripts/offline-install.ts
  - evals/next-release-native-smoke/tests/smoke.test.ts
  - evals/next-release-native-smoke/README.md
  - .github/workflows/ci.yml
  - docs/reports/next-release/enoch-prep/future-assignment.md
  - docs/reports/next-release/enoch-prep/correction-1.md
  - docs/native-parity.md
verification:
  - "cwd /opt/dev/ruach/.worktrees/r1-r3-portability-fix; bun 1.4.2, just 1.40.0; heavy commands under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock with timeout 300 s (600 s for bun run test and just test)"
  - "Before (reproduction, old script and test from 5b9d554, PATH = bun, just, /usr/bin:/bin): bun test evals/next-release-native-smoke 12 pass 1 fail, the offline install test (ready exit 1)"
  - "After, same restricted PATH: 14 pass 0 fail; host PATH (herdr, claude, codex present, ready exit 0): 14 pass 0 fail"
  - "just install, just check, just release-check: exit 0 each; bun run test: exit 0, 100 pass; just test: exit 0; bun audit in root, skills/ruach-handoff and skills/ruach-herdr: exit 0 each"
  - "tsc -p for the smoke and coordination packet tsconfigs: exit 0 each; bun test --timeout 30000 evals/next-release-native-smoke 14 pass; evals/ruach-coordination 10 pass; bun evals/ruach-coordination/prepare.ts --out <fresh scratch>: exit 0, 3 cases, reports_validated 9, invalid 0"
  - "Smoke actual-commit flow and protected-test negative control are tests in the smoke packet (documented flow, corrected control, tampered scope) and pass with and without native CLIs on PATH"
  - "CI simulation with a file:// origin of ac187d4 (not hosted evidence): depth-1 push checkout, depth-1 detached checkout and full clone each ran the new fetch step text from ci.yml: exit 0, no fatal line in any log, shallow=false afterwards and v0.3.0 resolved; then just install, smoke tsc and the 14 smoke tests passed with the host PATH and with herdr, claude and codex absent from PATH (node added for tsc only). The coordination packet passes 10/10 under the bare PATH"
  - "Enoch validator: a temporary valid report under the scratchpad (outside the clone) validated with bun skills/ruach-handoff/scripts/validate.ts <abs path>/docs/exercise/report.md --repo <clone>: exit 0, ok true; the clone-as-cwd form also exit 0; the old relative form exits 2 INPUT_UNREADABLE. Clone remained at ea33fc7 with a clean status"
  - "git diff --check on the staged candidate (including imports): clean. Canonical handoff validator --repo . and git diff --check on this report: see Validation"
discoveries:
  - "The control is deliberately not a native-readiness proof. ok requires install, check and both frozen dependency steps at exit 0 and a ready result that is consistent (JSON parses, exit 0 exactly when routes.herdr.ready, integrity ok, skill route ready, all packages ready). On a bare host ready exits 1, route herdr is not ready with its missing items, and native_readiness records it; nothing is faked, skipped or widened"
  - "A fresh worktree without just install makes the harness-eval-based smoke tests fail (missing skill dependencies); this is an environment step, not a change"
  - "Imports: Enoch prep records at e10156d (r1-enoch-prep assignment and report, enoch-prep/**) and native-prep.md with native-prep/** at eb7ae94 were added byte-identically with git checkout; the review records from 0a469dc were copied unchanged. No conflicts. Historical report, provenance, patch and log bytes are unchanged"
  - "Hosted CI is still unobserved. Node 22 preparation remains owned by the other worker and pending"
blockers: []

# R-COMBINED-FIX1 report

Source revisions: base `5b9d554`, findings `0a469dc3`, Enoch preparation `e10156d`, native preparation `eb7ae94`. Candidate `ac187d4` holds all source and document edits; this report and the unchanged assignment are committed after it. No installer, runtime, role, checker schema or dependency change; no native subject, credential, original Enoch, merge, push or tag.

## B1 and O1/O3

- `offline-install.ts`: `ok` no longer demands `ready` exit 0. It requires a consistent actual result (above) and records `native_readiness` (herdr route state, missing items, prerequisite found flags). An optional `path` override exists only so the regression can run with a native-free PATH.
- `smoke.test.ts`: the existing test now expects `ready` to exit 0 exactly when the host's route is ready, and a new test runs the real offline installer with herdr, claude and codex absent from PATH and asserts the actual outputs (steps, prerequisites found false, route not ready with missing items, `ok` true).
- README: control semantics, plus the O1 note that run id, kind and `none-no-model-subject` are offline placeholders; native runs record their actual route and model separately; `model_use_verified` stays false. No checker change.
- `ci.yml`: the fetch step tests `git rev-parse --is-shallow-repository` and runs `--unshallow --tags` or `--tags`. Failure stays visible; no timeout, permission or other gate changed.

## Enoch and native-parity

`future-assignment.md` now classifies the exercise as answer-accessible ordinary non-blind smoke (E1), assigns native dialogs to the user with the Coordinator only recording status (E2), and uses the absolute `<clone>/docs/exercise/report.md` validator invocation (E3). `enoch-prep/correction-1.md` supersedes the report premise explicitly. The brief is unchanged. `docs/native-parity.md` gains one dated paragraph for Claude 2.1.296, citing `native-prep.md` at eb7ae94, with the uncertainty kept and the 2.1.292 lines untouched.

## Not verified

Hosted CI, native or model behavior, blind boundaries, Node 22 and consumer installation. The CI simulation is a local approximation.

## Validation
