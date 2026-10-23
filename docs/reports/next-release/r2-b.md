task: RUACH-ROADMAP-IMPLEMENTATION/R2-B
status: complete
outcome: Fake-fixture probe plus public Herdr v0.9.0 source establish that Herdr's worktree creation runs plain `git worktree add` without replacement-ref suppression, so a linked checkout can contain replacement bytes while Ruach's HEAD check passes; standalone creation is protected. Live server behaviour is not verified.
artifacts:
  - docs/reports/next-release/r2-b.md
  - docs/reports/next-release/r2-b-evidence/
  - docs/assignments/next-release/r2-b.md
verification:
  - "Probe (Bun/TypeScript, OS temp, fake linked fixture copy + real spaces.ts createLinkedWorktree/createWorktree) exit 0 under verification flock; output in evidence"
  - "herdr --version, herdr status, herdr worktree create --help read-only; no workspace, worktree, pane or agent created; live daemon not touched"
  - "Herdr public source v0.9.0 read via gh api; handoff validator and git diff --check run after writing, results in terminal handoff"
review: not-run
discoveries:
  - "Verified (fake): with standard refs/replace at base, fake linked create then real Ruach verifyWorktree succeeded and returned a receipt; checkout tracked.txt was the replacement 'FORGED' while `--no-replace-objects rev-parse HEAD` equalled the pinned base. Standalone createWorktree produced 'ORIGINAL'."
  - "Verified (public source, v0.9.0): Herdr builds `git [-c safe.directory=..] -C <repo> worktree add -b <branch> <path> <base>` with no --no-replace-objects, no GIT_NO_REPLACE_OBJECTS, no env_remove/env_clear in the inspected files. `herdr worktree create --help` lists no replacement-ref option."
  - "Not verified: the installed 0.9.0 binary's build revision, the live daemon's environment/Git config and actual output of a real `herdr worktree create` against a replace ref. The fake models the unprotected command from source, it is not Herdr."
  - "Docs accuracy: operations.md line 186 (launcher cannot disable replacement refs in linked mode) is supported; add that HEAD equality does not prove checked-out bytes."
blockers: []
candidate_revision: 8137e8ea7b79c694568dd583d4ac45f50c56df9f
tested_revision: 8137e8ea7b79c694568dd583d4ac45f50c56df9f

# R2-B: Herdr replacement-ref boundary

Ruach source inspected at 8137e8e (docs-only change over d75039a; skill sources identical to d75039a). Probe and receipts: [r2-b-evidence/](r2-b-evidence/).

## 1. Versions and real vs fake

| Item | Value | Status |
| --- | --- | --- |
| Herdr client / server | 0.9.0 / 0.9.0, channel stable, protocol 22, endpoint compatible | observed (`herdr status`) |
| Public source | herdrdev/herdr tag v0.9.0, commit b99002ac99b09e00b4ca692436cb15a6b0d676f1 | tag read; build identity of installed binary not verifiable |
| Git (probe) | 2.47.3 | observed |
| Real Herdr `worktree create` against a replace ref | never run | **unverified** (not allocated) |
| Fake linked fixture | `skills/ruach-herdr/tests/fixtures/fake-cli.ts` line 22 runs `git -C repo worktree add -b B -- P base` | real Git, fake Herdr |

## 2. Evidence

- **Source** ([excerpt](r2-b-evidence/herdr-v0.9.0-source-excerpt.txt)): `src/worktree.rs` `build_worktree_add_new_branch_command` (lines 238-258) emits `worktree add -b <branch> <path> <base>` via `repository_git_args` (lines 160-169: optional `-c safe.directory=`, `-C <repo>`). `noninteractive_process::command` only configures background console behaviour. No match for `replace-objects`, `GIT_NO_REPLACE`, `env_remove`, `env_clear` in worktree.rs, app/api/worktrees.rs, workspace/git/mod.rs, noninteractive_process.rs. Help ([herdr-version-help.txt](r2-b-evidence/herdr-version-help.txt)) options: workspace, cwd, branch, base, path, label, focus, no-focus, trust-repository; nothing for replacement refs. Source scanning was limited to those files; other call paths are not excluded.
- **Probe** ([probe.ts](r2-b-evidence/probe.ts), [output](r2-b-evidence/probe-output.json)): repo with base commit (`ORIGINAL`), a forged commit (`FORGED`), `git replace base forged`, so `refs/replace/<base>` exists.

| Path | Result |
| --- | --- |
| Fake linked create via real `createLinkedWorktree`, base = original SHA | receipt returned (w9 / w9:p1); no error; tracked.txt = `FORGED`; `--no-replace-objects rev-parse HEAD` = base |
| Standalone real `createWorktree` (`--no-replace-objects`) | tracked.txt = `ORIGINAL`; HEAD = base |
| Same linked create with `GIT_NO_REPLACE_OBJECTS=1` in the probe's env | tracked.txt = `ORIGINAL` |

The last row only shows a flag reaches a child inherited from the caller (fake is a child process). It says nothing about the Herdr daemon.

## 3. Cause, hypotheses, coverage

- **Supported:** `verifyWorktree()` (spaces.ts lines 85-96) checks top-level and `HEAD` with `--no-replace-objects`; it does not compare tree bytes, so a replacement-altered checkout passes it. With Herdr issuing unprotected `git worktree add`, checked-out content follows replacements; the Ruach pin proves the commit id only.
- **Hypothesis:** the real server behaves as source suggests for the installed binary, and its Git runs in the daemon's environment/cwd, not the client's, so a client `GIT_NO_REPLACE_OBJECTS` would not reach it. Source shows no per-request environment transfer in the inspected files but the daemon environment was not inspected. Unproved.
- **Coverage:** `spaces.test.ts` line 189 replacement test covers standalone mode only; fake-cli covers linked mode with ordinary Git and never sets a replace ref. No test currently asserts linked bytes.
- **Unsupported mitigations:** no Herdr option, and no client env flag demonstrably, suppresses replacement refs for linked creation. Do not claim protection from either.

## 4. Partial-failure recovery

Unchanged and fail-closed: linked identity failure leaves the checkout and branch retained (exit 4), no retry, no foreign cleanup. A content mismatch cannot be detected by HEAD alone; detection would need a tree comparison (see proposal). No native resource IDs were created by this task.

## 5. Proposal for R-IN (docs only; no code claim)

In `docs/operations.md` known limitations (near line 186) and `docs/regression-cases.md`: state that linked creation is performed by Herdr (v0.9.0 source: plain `git worktree add`, no replacement-ref option); that a standard `refs/replace` at the base can alter linked checkout bytes while Ruach's `--no-replace-objects` HEAD check passes; that standalone creation is protected; that live Herdr behaviour was not measured; and that users with replacement refs should use standalone placement or inspect the checkout. Optional later options, not decided here: a post-create tree-vs-`git ls-tree --no-replace-objects` comparison, or conservative refusal of linked placement when `refs/replace` exists (compatibility decision for the owner). A separately assigned live probe (dedicated session/workspace, `herdr worktree create` on a throwaway repo, compare bytes, Coordinator releases resources) is needed to close the live-behaviour gap.

## 6. Constraints

Probe copied scratch lives in OS temp and is not source. No live Herdr mutation, push, merge or paid run. Review: not run.
