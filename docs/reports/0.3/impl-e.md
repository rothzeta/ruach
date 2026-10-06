---
task: 0.3-impl-e
status: complete
outcome: A7 implemented. Launches with a same-repository launching workspace create the worktree via herdr worktree create --workspace and register as a linked worktree; otherwise standalone is unchanged.
artifacts:
  - docs/reports/0.3/impl-e.md
  - docs/assignments/0.3/impl-e.md
  - skills/ruach-herdr/scripts/spaces.ts
  - skills/ruach-herdr/scripts/worker.ts
  - skills/ruach-herdr/tests/spaces.test.ts
  - skills/ruach-herdr/tests/fixtures/fake-cli.ts
  - "branch ruach/ruach03-impl-e commits b7d0421 (tests+fix) and bc30624 (docs)"
verification:
  - "Throwaway real herdr 0.9.0 check: see below; cleaned up (workspaces closed, temp repo removed)"
  - "New tests failed against base scripts (7 fail, 22 pass) then pass with fix: bun test skills/ruach-herdr/tests/spaces.test.ts, 29 pass"
  - "just check: exit 0"
  - "just release-check: exit 0 (v0.2.1)"
  - "just test: all suites pass (54, 28, 146, 67 tests, 0 fail) after just install; an earlier run under load timed out at 5s per test and was rerun clean"
  - "Not run: any real launch of a worker agent through the changed launcher, paid-model smoke tests; linked mode against the real Herdr was verified only by raw herdr commands, not through worker.ts"
tested_revision: bc30624
candidate_revision: bc30624
discoveries:
  - "herdr worktree create has no --env; its pane gets the Herdr server environment, not the caller's PATH/CODEX_HOME/CLAUDE_CONFIG_DIR (observed). Linked mode therefore splits the new workspace's root pane with --env (verified: CODEX_HOME propagated) and starts the agent there. The unused root shell pane remains. This keeps RU-10 PATH pinning and config-home forwarding intact."
  - "Parent comes from HERDR_WORKSPACE_ID (present in this session). Herdr rejects non-Git parents (not_git_worktree) and unknown IDs (workspace_not_found); worktree create uses the parent's repository, not --cwd, so the launcher compares herdr worktree list --workspace source.repo_key with git --git-common-dir and falls back to standalone on any mismatch or missing support."
  - "herdr worktree create with an existing path fails but leaves the new branch behind (observed a7/y); preflight rejects existing paths/branches so this is only reachable on races, and any failed creation is reported exit 4 worktree_uncertain with path and branch retained."
  - "herdr worktree remove --workspace <id> removed the checkout and kept the branch (observed). Workspace worktrees created by plain workspace create show no worktree key in workspace list until Herdr resolves a Git cwd."
  - "Assumption: the pane is split rightwards from the root pane; chosen without product input. A closed root pane was not tried."
  - "impl-d edits the same coordinator/workflow files; my edits there are single cleanup sentences (agents/coordinator.md line 76, skills/ruach-workflow-feature/SKILL.md line 113); merge conflicts should be trivial."
  - "A7 roadmap read from ruach/ruach-03-coordinator; no ambiguity needing needs-decision."
blockers: []
---

# impl-e report: A7 Herdr-linked worktree launches

## Real Herdr 0.9.0 check (throwaway)

Temp repo under /tmp, workspace `a7parent` (wAS) created with `herdr workspace create --cwd <repo> --label a7parent --no-focus`.

- `herdr worktree create --workspace wAS --branch a7/child --base HEAD --path <T>/child --label a7child --no-focus` exit 0; response `workspace.worktree.is_linked_worktree: true`, `worktree.branch a7/child`, `root_pane wAT:p1`.
- `herdr worktree list --workspace wAS` listed the main checkout (`is_linked_worktree:false`) and the child (`true`, `open_workspace_id wAT`); `git worktree list` agreed.
- Failure modes: unknown parent id `workspace_not_found`; non-Git parent `not_git_worktree`; existing path `worktree_create_failed` (leaves branch `a7/y`); existing branch in use `worktree_create_failed`. All exit 1.
- `herdr worktree remove --workspace wAT` exit 0 (`worktree_removed`, `forced:false`); checkout gone, branch `a7/child` kept.
- Env: pane from `worktree create` had the server's PATH, no caller CODEX_HOME. `herdr pane split wAW:p1 --direction right --cwd <path> --env CODEX_HOME=/tmp/zz --no-focus` pane saw `CODEX_HOME=/tmp/zz`, correct cwd.
- Cleanup: `herdr worktree remove` for wAW, `herdr workspace close` for wAS and wAV, temp dir deleted; listing showed no a7 workspaces left. No real workspaces or worktrees were touched.

## Changes

- `spaces.ts`: `linkedParent` (validates parent), `createLinkedWorktree`, shared `verifyWorktree` identity check.
- `worker.ts`: linked mode selection, `worktree create`, root-pane split with `--env`, result fields `worktree_mode`, `linked_parent`, `linked_unavailable`, linked cleanup text. Standalone and pane placement unchanged.
- Tests (fake Herdr extended): linked args and preserved result fields, standalone fallback for four causes, no overwrite, dry-run, create failure (exit 4, retained), unconfirmed registration, missing root pane, split failure.
- Docs: SKILL.md, references/adapters.md, docs/operations.md, agents/coordinator.md, ruach-workflow-feature cleanup sentence.

## Limits

Tests use a fake Herdr; the real-Herdr behavior was verified manually only for the raw commands above. docs/roadmap.md untouched.
