# Assignment changelog-review (role: reviewer)

Task id: RUACH-0.4-changelog-review. Workspace: this worktree, based on main. Review target: branch `task/changelog` at `fea6aab` (implementation `a8d42df`), worktree `/opt/dev/ruach-worktrees/ruach-changelog`. Requested by the owner (2026-10-08): "launch a ruach reviewer".

Inputs: the implementer's assignment `docs/assignments/0.4/changelog-impl.md` (outcome, acceptance, scope) and report `docs/reports/0.4/changelog-impl.md` on that branch; `docs/design/0.4-suggestions-from-ramec-orchestration.md` §8 (harness facts from the Claude, Codex 0.161 and agy 1.3.1 probes).

Review against the assignment's acceptance and scope. In particular:
- Correctness of the normalization per harness and event (Claude `Stop`/`PostCompact`, Codex `Stop`/`PostCompact` without summary text, agy `Stop` reading `transcriptPath`), subagent skipping, opt-in silence, exit 0 and `{}` on stdout in every path (agy requires valid JSON on stdout; a failure must never block a turn).
- The lock: exclusive `<target>.lock` with a 10 s stale rule — races, a crashed holder, interleaving, and whether a stale-lock takeover can corrupt lines.
- Security: the hook runs with user permissions on every turn for every project with the Ruach plugin installed. Path handling of the config's `target` (relative to the project root — can it escape the project via `..` or a symlink?), handling of untrusted payload fields, nothing written outside the project, nothing global.
- The registration command: writes exactly the documented project files with absolute paths, merges with (does not clobber) existing `.codex/hooks.json` / `.agents/hooks.json` content, and never touches user-level config.
- The Claude plugin hook location and format (`hooks/hooks.json` at the plugin root, `${CLAUDE_PLUGIN_ROOT}`, `async`): confirm against the current Claude Code plugin documentation if you can, or mark it unverified.
- Test quality: black-box, failing first, and whether the 2 "vacuous passes" the report mentions hide a gap.
- Unnecessary complexity (ruach-simplification) and scope violations.

Verification: run the skill suite, `bun run test` and `just check` in the reviewed worktree (run `just install` there first if needed), and record exact results. Do not edit the reviewed branch.

Handoff: write `docs/reports/0.4/changelog-review.md` with the ruach-handoff leading block, findings ordered by severity (location, problem, why it matters, evidence, suggested direction), blocking vs optional clearly separated; run its validator with `--repo`; commit this assignment unchanged with the report in your own worktree. Do not push or merge.
