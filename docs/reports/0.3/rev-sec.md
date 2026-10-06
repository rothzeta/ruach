---
task: 0.3-rev-sec
role: reviewer
status: complete
outcome: "Security/state/concurrency review of feaca8b (Tracks A and B) is complete. Two blocking findings: an RU-02 bypass where core.fsmonitor hides tampered files from harness-eval clean checks, and an A4 bypass where the Codex stdio config reader has no hard deadline when a descendant holds its stdout. Both were reproduced. Five optional findings. Suites pass apart from timeout flakiness under host load."
reviewed_revision: feaca8b74a8d5313fbeedbe943c385523637db20
baseline: 639e24b
artifacts:
  - docs/reports/0.3/rev-sec.md
  - docs/assignments/0.3/rev-sec.md
verification:
  - "Worktree HEAD bdab5e8 (feaca8b plus the integ report commit only); reviewed feaca8b via git diff 639e24b..feaca8b"
  - "just install: exit 0"
  - "just check (resource checks + tsc): exit 0"
  - "just release-check: exit 0"
  - "just test: root 84 pass/0 fail; handoff 28/0; herdr 134 pass/12 fail, every failure at the 5 s per-test timeout with load average 17-26 from other sessions; just stopped, so harness-eval did not run in that invocation"
  - "Rerun alone: harness-eval bun test 67 pass/0 fail; herdr bun test --timeout 30000 146 pass/0 fail (226 s)"
  - "Probe: core.fsmonitor hook printing an empty v2 response makes harness-eval dirty() return [] for a modified tracked file (ls-files -v shows H)"
  - "Probe: fake codex whose app-server child exits leaving a same-group descendant holding stdout makes codexRead take 25.2 s (the descendant's lifetime), despite the 10 s timer"
  - "Probe: git worktree add of a commit with a refs/replace entry checks out the replacement tree while HEAD equals the requested base (Herdr verifyWorktree would pass)"
  - "Probe: 30 concurrent pairs of scripts/install.ts install (639e24b vs feaca8b) into one target; every final state passed check; the stale-plan window was not hit"
  - "Read-only herdr worktree list --workspace wB2: source.repo_key equals git --git-common-dir, confirming the linkedParent comparison basis"
  - "CI workflow not executed (no GitHub runner); reviewed statically"
review:
  - "Blocking 2, optional 5; see report body"
discoveries:
  - "Herdr suite timeouts are environmental (they pass with --timeout 30000) but make just test fail on a loaded host; CI on a shared runner may be flaky"
  - "docs/regression-cases.md still marks every A1/A3-A6 case [ ] although tests exist"
  - "Herdr git probes strip all GIT_* including GIT_CONFIG_GLOBAL/GIT_CONFIG_PARAMETERS; setups that supply safe.directory only through env would fail probes (not reproduced; noted only)"
blockers: []
---

# Review 0.3-rev-sec

Reviewed revision: `feaca8b74a8d5313fbeedbe943c385523637db20`. The worktree HEAD is `bdab5e8`, which only adds the integ report. Baseline is `639e24b`. Acceptance conditions: roadmap 0.3 Track A/B "Done when" on `ruach/ruach-03-coordinator`, plus AGENTS.md.

## Blocking

### B1. RU-02 bypass: `core.fsmonitor` hides tracked edits from clean checks
- **Location:** `skills/ruach-harness-eval/scripts/common.ts:84-91` (`git()`), `:116-121` (`dirty()`).
- **Problem:** `dirty()` fails closed only for the assume-unchanged and skip-worktree tags in `ls-files -v`. Repository config still applies to the probes. If `core.fsmonitor` names a hook that returns an empty change list, `git status` treats every fsmonitor-valid entry as unchanged, and `ls-files -v` shows `H`.
- **Why it matters:** A1/RU-02 exists so that "clean" cannot be forged through index state. A candidate checkout can set this local config and pass `dirty_before`/`dirty_after` and scope-check `clean` with tampered tracked files. The bypass needs only one config line.
- **Evidence:** In a temp repo, set `core.fsmonitor=<script printing "tok\0">`, run `git status` once, then edit `f`. `bun -e "dirty('<repo>')"` printed `[]`; `git -c core.fsmonitor=false status --porcelain` printed ` M f`.
- **Direction:** Pass `-c core.fsmonitor=false` in the private probes, and consider `-c core.untrackedCache=false` too. Add a failing-first test next to the index-flag tests. Also check `scripts/install.ts` and `ready`'s `gitState` for the same pattern.

### B2. A4/RU-05 gap: the Codex stdio config reader has no hard deadline
- **Location:** `skills/ruach-herdr/scripts/native-codex.ts:43-74` (`stdioRead`).
- **Problem:** The reader is spawned without `detached`, and the 10 s timer kills only the direct child. `reader.read()` and the cleanup then wait for EOF. A descendant that inherited stdout keeps both open for as long as it lives. This helper does not use the bounded `run()` from `process.ts`.
- **Why it matters:** A4 requires a hard deadline and bounded cleanup for helpers. A Codex launch or resolve can hang indefinitely and block the Coordinator.
- **Evidence:** A fake `codex` whose `app-server` invocation spawns a same-group child holding stdout for 25 s and then exits made `codexRead` return `codex_config_unavailable` after 25 236 ms. The wait scales with the descendant's lifetime.
- **Direction:** Spawn detached, kill the owned group on deadline, and cancel the reader on a bounded race, as `run()` does. Add a fixture test like the herdr `helper descendant` test.

## Optional

### O1. Install lock is taken after preflight (stale plan / TOCTOU)
- **Location:** `scripts/install.ts:141-187`. Drift, leftovers, conflicts and operation kinds are computed before `mkdirSync(staging)` at line 181.
- **Problem:** A second install can plan against state that changes before it acquires the lock. A path planned as `create` is then renamed over an existing file without a backup. If the later integrity check fails, `rollback` unlinks that file and reports "the target is unchanged" even though the file was lost. The `--replace` conflict guard is also evaluated on stale state.
- **Evidence:** Source reading only. 30 concurrent pairs did not hit the window: every outcome was either one rejected with `Interrupted install` or both serialized cleanly.
- **Direction:** Acquire staging before reading the target, or re-`lstat` each operation after locking and abort if its kind changed.

### O2. Herdr launcher reads through replacement refs
- **Location:** `skills/ruach-herdr/scripts/spaces.ts:32,55,81-88`. `rev-parse`, `worktree add` and `verifyWorktree` run without `--no-replace-objects`.
- **Problem:** With a `refs/replace` entry for the base, the worker checkout contains the replacement tree while HEAD equals the reported base, so `verifyWorktree` passes. Probe confirmed: `content=forged`, HEAD equal to base.
- **Why optional:** The repository is user-controlled, and the roadmap's RU-01 wording targets "private probes". Even so, the launcher reports a pinned base its checkout does not match.

### O3. Linked-mode failures lose the created workspace ID; launches from an untracked subdirectory fail after creation
- **Location:** `spaces.ts:62-75`, which calls `verifyWorktree` before parsing the response, and `spaces.ts:78-88`.
- **Problem:** If verification fails after `herdr worktree create` succeeded, the failure JSON reports `workspace: null`, although Herdr opened a workspace. Separately, a `--cwd` subdirectory that is absent from the base commit (untracked or empty) is detected only after creation, giving exit 4 with the worktree, branch and, in linked mode, the workspace left behind. That check could run in `worktreePlan` with `git cat-file -e <base>:<inside>`.

### O4. Herdr tests rely on the 5 s default timeout
- **Location:** `skills/ruach-herdr/tests/*.test.ts`.
- **Evidence:** 12 failures at about 5.0 s under load, then 146/0 with `--timeout 30000`. The roadmap's exit criterion of green CI on a clean checkout is at risk on shared runners. Raise the per-test timeouts.

### O5. Track B records are stale or weak
- `docs/regression-cases.md` marks all A1/A3-A6 cases `[ ]` although their tests exist. Track B release discipline needs an accurate inventory.
- `tests/dependencies.test.ts:24` uses `if (!match) continue;`, so it passes vacuously if the lock format changes. Assert that the expected packages are present.
- `.github/workflows/ci.yml` pins actions by tag, not SHA. This is noted in impl-b; it is a supply-chain hardening choice, not a defect.

## Checked without findings

- **RU-03:** GIT_* stripping for git argv; canonical cwd and git root; post-create identity verification (top-level, HEAD, cwd).
- **RU-04:** alias keys rejected via `visit`.
- **RU-11:** non-strict scan only affects workflow hiding; symlinks are made only from strictly validated canonical skills.
- **RU-15:** escaping and pointers.
- **RU-14:** O_EXCL/O_NOFOLLOW descriptor held across the run.
- **A4:** `run()` and harness-eval `execute` settle once and signal only their own groups. A theoretical PID-reuse window after leader exit was not judged material.
- **A5:** rename-only writes leave outside hardlinks untouched; rollback is reverse-ordered and identity-guarded; EXDEV leads to rollback; leftovers are preflighted; integrity check runs before staging removal.
- **A6:** pinned PATH is used for probes, helpers and the pane env.
- **A7:** `repo_key` matches `--git-common-dir` (checked read-only against real Herdr); fallback reasons are reported.
- **A8 notices:** byte-equality checks are in check and release-check.
- **AGENTS.md constraints:** no global settings or discovery-link writes and no version bump were seen.

**Unverified:** a real Herdr linked launch, real Codex reader behavior, the CI run on GitHub, and root-uid rollback tests.
