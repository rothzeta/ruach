task: RUACH-ROADMAP-IMPLEMENTATION/R-COMBINED-RV
status: complete
outcome: "Independent combined review of the R1-R3 union at 5b9d554 is done: 1 blocking and 3 optional findings. All required local gates passed once at the exact revision, but the new CI smoke-packet step fails when herdr is not on PATH, as on a GitHub-hosted runner (B1). Union not acceptable until B1 is resolved. No hosted, native, blind or consumer claim."
verdict: changes-required
candidate_revision: 0364cc32a00e8bd74336e9210e1bbe2bb1d0069e
tested_revision: 5b9d554081f4b38050fd1076f62907e64ae9ee1f
reviewed_revision: 5b9d554081f4b38050fd1076f62907e64ae9ee1f
baseline: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/next-release/combined-review.md
  - docs/assignments/next-release/combined-review.md
  - docs/reports/next-release/enoch-prep-review.md
verification:
  - "cwd /opt/dev/ruach/.worktrees/r1-r3-combined-review at HEAD 5b9d554 (tree only differs by the untracked assignment); bun 1.4.2, just 1.40.0, git 2.47.3; every command under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock with timeout 300 s (600 s for bun run test and just test)"
  - "just install: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "just test: exit 0 (root 100, handoff 28, herdr 162, harness-eval 71, changelog 35; 0 fail; 146 s)"
  - "bun audit in root, skills/ruach-handoff, skills/ruach-herdr: exit 0 each"
  - "node_modules/.bin/tsc -p for both packet tsconfigs: exit 0 each"
  - "bun test --timeout 30000 evals/next-release-native-smoke: exit 0, 13 pass; evals/ruach-coordination: exit 0, 10 pass"
  - "bun evals/ruach-coordination/prepare.ts --out <fresh scratch>: exit 0, 3 cases, reports_validated 9, invalid 0. Each of the 9 committed reports separately extracted and run through the canonical validator --repo <case repo>: exit 0, ok true, 0 diagnostics. Manifest refs and commit names resolve; every file digest and mode matches; subject equals protected copy; no unrendered template tokens. A second fresh prepare produced a byte-identical manifest and an identical subject tree"
  - "Smoke CLI flow: prepare.ts live; check.ts before a subject commit exit 2 (candidate equals base); after a subject commit on main exit 0, candidate = acceptance candidate_revision = tested_revision = HEAD 1eed9a3 (fixture repo), checks passed x3, scope ok. Protected-test negative control: scope exit 1, protected_changes [tests/range.test.ts]. Orphan branch not descending from base: exit 2"
  - "CI simulation with a file:// origin (not hosted evidence): depth-1 push checkout, depth-1 detached fork-style merge ref and full clone each ran the new fetch step (exit 0; the full clone printed the expected --unshallow fatal and fell back), then shallow=false and v0.3.0 resolved; then just install, smoke tsc, and 13/13 smoke tests passed with the host PATH. Control without the fetch step: historical 0.3.0 test fails (rev-parse exit 128)"
  - "Same push checkout with herdr, claude and codex removed from PATH: smoke packet exit 1, 12 pass 1 fail (B1); coordination packet 10 pass and just test exit 0 under the same PATH"
  - "Frozen inputs: owner checkout /opt/dev/ruach roadmap, native-parity, RAMEC and both plans hash equal to /tmp/.../inputs (7e81217f, 248a8931, c2487a28, 13e0ca35, 37a72430). Union roadmap = frozen + 3 added status paragraphs, 0 frozen lines removed; native-parity = frozen except one sentence (line 40); docs/design unchanged from d75039a, so the RAMEC owner edit is excluded"
  - "Imported records: all 27 files added by 29f48a5 are byte-identical (blob ids) at HEAD to af3da3e or c170d27. Packet code vs accepted exact revisions: coordination differs from 25aadf1 only in README and rubric N1; smoke differs from 2e14d3d only in README, the probe.ts comment and two test titles"
  - "git diff --check d75039a..HEAD: only r2-i.md and r2-l.md assignment EOF (historical) and 8 lines in the imported r2-b-evidence/herdr-version-help.txt; 29f48a5..HEAD (owned final edits): clean"
  - "Canonical handoff validator --repo . and git diff --check on this report: see the Validation section"
discoveries:
  - "Hosted CI has never passed on main. The two recent hosted runs (37986084683, 37661762155) failed in just test at the herdr order assertion, so the harness-eval and changelog suites have never run hosted. Locally, with no herdr, claude or codex on PATH, all of just test passes, so B1 is the only host dependency found."
  - "The repository is public (gh repo view), so the credential-free git fetch after checkout with persist-credentials false should work hosted. Not observed."
  - "Live smoke results label a subject run as run base, kind control, model none-no-model-subject (O1)."
blockers:
  - "B1: the CI smoke-packet step fails wherever herdr is not on PATH (expected on GitHub-hosted ubuntu-24.04). The union must not be accepted or delivered until the packet owner or Coordinator resolves this within the no-skip constraint."

# R1–R3 combined review

Reviewer: canonical Reviewer, fresh session `r1-r3-combined-review`. Scope is the complete union `d75039a..5b9d554`. The implementation and tested union is `0364cc3`, and `5b9d554` adds only the R-IN-FINAL assignment and report. I made no source edits, read or searched no workflow bodies, ran no native subject, worker launch, merge, push or tag. The Enoch preparation review is a separate report: [enoch-prep-review.md](enoch-prep-review.md).

## Blocking findings

### B1. The new CI smoke step fails on runners without herdr

- **Location:** `.github/workflows/ci.yml` (step "Native smoke packet typecheck and tests"). The failing assertion is in `evals/next-release-native-smoke/tests/smoke.test.ts:99`, test "offline install uses an explicit existing revision and isolated child roots, not the caller config". The step that causes it is in `evals/next-release-native-smoke/scripts/offline-install.ts:37`.
- **Problem:** the offline control runs the installed `ready --route herdr --json` and the test requires exit 0. `ready` exits 1 when `herdr` is not found ("herdr not found or not working", `routes.herdr.ready: false`). The child environment isolates HOME, CODEX_HOME and CLAUDE_CONFIG_DIR but inherits PATH, so the result depends on the host. GitHub-hosted `ubuntu-24.04` runners do not install herdr, claude or codex.
- **Why it matters:** once delivered, this step would turn every push and PR run red, after the R1 order-assertion fix has removed the existing failure. The packet is meant to be an "offline" control, but it actually depends on the host's PATH. Local gates passed only because this machine has herdr in `~/.local/bin`. The integration report and roadmap do say hosted CI never ran, so no false claim was made, but the authorized CI amendment does not work as intended.
- **Evidence:** I ran a depth-1 push-style checkout of `5b9d554` after the fetch step, with PATH limited to bun, just and `/usr/bin:/bin`. `bun test --timeout 30000 evals/next-release-native-smoke` gave exit 1, 12 pass 1 fail. The failure output shows install, check and both frozen-deps steps at exit 0 and `ready` at exit 1, with prerequisites `herdr found:false`, `claude found:false` and `codex found:false`. With the host PATH the same checkout passes 13/13. Under the restricted PATH the coordination packet (10 pass) and the full `just test` (exit 0) still pass.
- **Suggested direction:** the S packet owner makes the control independent of the host, without a skip or a wider timeout. For example: assert readiness for a route that needs no external executable, or keep `--route herdr` and assert the package and snapshot fields rather than the overall exit. Run the packet once under a herdr-free PATH as the regression. If the owner prefers, the Coordinator could instead decide not to add the step to CI. Either way the CI amendment needs re-review.

## Optional findings

### O1. Live check results label a subject run as a base/control run

- **Location:** `evals/next-release-native-smoke/scripts/prepare.ts` (`runs[0]`: id `base` unless `--control`, `kind: 'control'`, `model: 'none-no-model-subject'`). `check.ts` copies this into the pinned config.
- **Evidence:** in my live-flow probe the subject commit was evaluated correctly, but the results are named `base-flow-*.json` with `run: "base"` and `declared_route: {kind: control, model: none-no-model-subject}`.
- **Direction:** before live rows, let `check.ts` record the declared run label and route, or state in the README that route metadata in checker output is a placeholder. `model_use_verified` is already false, so this only affects evidence readability.

### O2. The README's non-descending refusal has no packet test

- **Location:** `evals/next-release-native-smoke/README.md` (Commands) and `scripts/check.ts` (`merge-base --is-ancestor`). The test that used to imply this coverage was renamed to "a detached HEAD is refused rather than guessed", as authorized.
- **Evidence:** my CLI probe with an orphan branch got exit 2, "does not descend from the prepared base". The behavior works but nothing guards it against regression.
- **Direction:** optionally add one case when the packet is next changed. Do not add it only to match a name.

### O3. The fetch step's fallback prints a `fatal:` line on full checkouts

- **Location:** `.github/workflows/ci.yml` (fetch step).
- **Evidence:** in the full-clone simulation, `--unshallow` prints "fatal: --unshallow on a complete repository does not make sense" and `git fetch --tags` then succeeds (step exit 0).
- **Direction:** harmless. Optionally test `git rev-parse --is-shallow-repository` first so logs are not misleading. If both fetches fail, the step fails visibly; it does not skip.

## Areas reviewed without material findings

- **Installer:** all planning (metadata load, drift, roots, leftovers, conflicts, parent types, removals, operation kinds) now runs after the exclusive `.ruach-staging` mkdir. A planning failure removes only the staging this run just created. The symlink preflight (`destination(target, 'ruach-install.ts')` walks the target and its ancestors) runs before `mkdirSync(target)` and the lock. The public-CLI race tests use a test-only preload barrier with a real filesystem and assert a product refusal, not a timeout or rollback. Pre-lock refusals create nothing, and the missing-root note in operations is accurate.
- **Herdr linked launches:** receipt IDs are passed through `hint()` one at a time before the exit, response and identity checks, and are reported in the failure JSON with the inspect-first cleanup text. There is no new retry, kill or fallback. The `--cwd` preflight uses `cat-file -t <base>:<inside>` and requires `tree` before any checkout, which refuses file, symlink and gitlink. This was tested in both modes, including an older base and Unicode or space directories.
- **CI order fix:** the only change is `.sort()` on the `readdir` listing in the standalone-skill test. The other `readdir` equality assertions compare with `[]`, which does not depend on order.
- **New CI steps (apart from B1):** they run after the existing gates. Permissions (`contents: read`), the 30-minute job timeout, the pinned Bun and Just versions, the audits and `persist-credentials: false` are unchanged. There is no new dependency, skip or timeout change. Local timings are a few seconds per packet, so the steps fit the timeout. The fetch is needed: without it the historical 0.3.0 control fails.
- **Coordination guidance:** the Coordinator role adds record duties: pre-send check, decision and phase writes before dependent action, re-read after compaction, reconciliation, report identity, separation of proposal, choice and operation, reuse of valid authority, and never approving a native security dialog. The Architect adds package proposals that leave scheduling to the Coordinator. The assignment specimen and task record are complete and actionable, and records scale with task size (`direct-compact-full.md`). The consumer-example delivery wording uses "different target branch". The rubric N1 addition does not change raw cases or control obligations.
- **Packets:** raw coordination cases are deterministic, as the double prepare and digest checks show. Grading material (`expected/`, `git/`, `prepare.ts`, tests) stays outside `subject/`. The smoke checker evaluates the actual checked-out subject commit and refuses base-equal, detached and unrelated candidates. Both READMEs give the resource-revision instruction (accepted A+B, or A+B+S, resolved at execution) with no self-SHA and no model-run claim.
- **Documentation truth:** CHANGELOG Unreleased entries, operations (installer lock, exit-4 hint guidance, known limitations with the R2-B replacement-ref boundary), regression-cases, and the three roadmap status paragraphs match the code and evidence. None claims a hosted green run, a native or consumer result, or a done R3-E. The native-parity correction matches the no-`node_modules` cache observation.
- **Ownership:** the owner checkout's modified and untracked planning files are unchanged, matching the frozen hashes, and RAMEC is excluded from the union.

## Not verified

Hosted CI, GitHub runner images, native or model behavior, live Herdr, blind boundaries and consumer installation were not exercised. The CI simulation is a local `file://` approximation. I did not reread the full prose of the earlier independently accepted A, B, S and C units beyond the integration deltas and the interactions listed above.

## Validation

I ran the canonical `skills/ruach-handoff/scripts/validate.ts <report> --repo .` and `git diff --check` on this report before committing it. I removed the verification scratch (clones, prepared packets, logs) under the session scratch directory after recording the results above.
