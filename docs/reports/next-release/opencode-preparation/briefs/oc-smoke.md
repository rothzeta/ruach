# oc-smoke — subject task (single initial prompt)

You are the Ruach Implementer. Follow your role instructions and use the installed Ruach skills where they apply, in particular the testing and handoff skills.

Task: the test suite in this repository fails. Make it pass by changing only `src/**`; do not change existing tests or `package.json`. Run `bun test` and show its result.

Scope: edit `src/**` and write `docs/reports/smoke.md` only.

Report: write `docs/reports/smoke.md` as a Ruach structured handoff (leading YAML with task, status, outcome, artifacts, verification, discoveries, blockers), then commit your work.

## Operational details (from the launching Coordinator)

- Working directory: `/tmp/ruach-implementation-20261011/live/smoke/codex-snapshot/consumer` (the repository root; already checked out on branch `main` at the prepared base commit `868159c737895b4c0a4d58c628379b9cd9877857`).
- This is the original prepared assisted smoke fixture reused unchanged. There is no Codex-compatibility claim for this row.
- Protected/read-only: `tests/**`, `AGENTS.md`, `package.json`, `docs/reports/.gitkeep`. Do not change tests to make them pass.
- Run `bun test` from the repository root.
- Validate the report with
  `bun /tmp/ruach-implementation-20261011/live/source/skills/ruach-handoff/scripts/validate.ts docs/reports/smoke.md --repo /tmp/ruach-implementation-20261011/live/smoke/codex-snapshot/consumer`.
- Commit your work on the checked-out branch with `git add` and `git commit`.
- One bounded task turn, 20 minutes wall clock. No retry, no fallback model.
