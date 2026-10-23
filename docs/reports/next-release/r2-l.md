task: RUACH-ROADMAP-IMPLEMENTATION/R2-L
status: complete
outcome: Linked worktree creation now preserves valid workspace/root-pane receipt IDs through every post-create or nonzero failure, and a requested cwd must be an ordinary tree in the pinned base before any mutation. Review not run.
candidate_revision: ac675dc9a811416323185a2b6b3a0a58d344d458
tested_revision: ac675dc9a811416323185a2b6b3a0a58d344d458
artifacts:
  - docs/reports/next-release/r2-l.md
  - docs/assignments/next-release/r2-l.md
  - skills/ruach-herdr/scripts/spaces.ts
  - skills/ruach-herdr/scripts/worker.ts
  - skills/ruach-herdr/tests/spaces.test.ts
  - skills/ruach-herdr/tests/fixtures/fake-cli.ts
verification:
  - "just install: exit 0 (under verification.lock)"
  - "Baseline: new spaces.test.ts + fake-cli against original spaces.ts/worker.ts (copy at HEAD d75039a in scratchpad): 30 pass, 14 fail (unconfirmed-registration and missing-pane receipt assertions, wrong HEAD, wrong path, nonzero receipt, ID validation, and standalone+linked untracked/empty/older-base/blob-symlink-gitlink cwd cases); exit 1"
  - "(cd skills/ruach-herdr && bun test --timeout 30000 tests/spaces.test.ts) on corrected source: 44 pass, 0 fail; exit 0"
  - "(cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts): 118 pass; exit 0"
  - "bun test --timeout 30000 tests/agent-routing.test.ts: 14 pass; exit 0"
  - "just check: exit 0; just release-check: exit 0 (v0.3.0)"
  - "bun run test: 90 pass, 0 fail; exit 0"
  - "Full Herdr suite (cd skills/ruach-herdr && bun test --timeout 30000): 162 pass, 0 fail; exit 0"
  - "All heavy runs serialized through /tmp/ruach-implementation-20261011/verification.lock; commands bounded 300s (600s bun run test)"
review: not-run
discoveries:
  - "Per plan, native preparation runs before worktreePlan, so a cwd refusal may leave approved harness runtime state; only checkout/branch/workspace/pane/agent mutation is excluded."
  - "Proposed R-IN recovery docs: preflight failure creates no checkout resources, so fix cwd/base/name; receipt failure requires inspecting herdr worktree list for the expected path/branch and returned workspace, verifying association before focusing/removing, preserving work and branches, then explicitly releasing owned resources. A null receipt remains possible (timeout/malformed/no-ID nonzero) and must be documented."
  - "IDs are recovery hints only; never used for split, start, focus or cleanup commands. Submodule/gitlink launch directories are refused, not supported."
blockers: []


# R2-L report

Changes (owned paths only):
- `spaces.ts`: `createLinkedWorktree` parses the Herdr response (also on nonzero exit/timeout) before any check and reports individually valid IDs (nonempty, non-whitespace, no control characters) to an optional receipt callback; checks and success semantics are unchanged. `worktreePlan` runs `git --no-replace-objects -C <cwd> cat-file -t <sha>:<inside>` for a non-root cwd and refuses with `worktree_cwd_unavailable` (exit 2, field `cwd`) unless the type is exactly `tree`.
- `worker.ts`: passes a callback storing the IDs in `workspace`/`pane`, so the failure JSON retains them (exit 4, unknown, not-submitted, phase worktree). Output schema version 1 unchanged.
- `fake-cli.ts`: behaviors `linkedWrongHead`, `linkedWrongPath`, `linkedIds`, `linkedNonzero`.
- `spaces.test.ts`: actual worker CLI, recorded mutations and Git state; existing unlinked/missing-pane/partial tests gained ID assertions; controls for tracked Unicode/space directory in both modes (root, symlink alias and GIT_* controls already exist and pass).

Not run / gaps: no live Herdr or native model; independent review not run; `git diff --check` and report validation results are recorded in the terminal handoff after commit, not predicted here.
