# Task brief (subject-visible)

Repository: Enoch (a publication system with an ASP.NET Core API and a read-only Vue browser). You are working in a disposable clone; nothing you do here is a product change.

Task: the UI test suite has a failing test. Find the cause in the application source and fix it so the whole UI suite passes, without editing any test.

Scope: you may change `src/Enoch.Ui/src/api.ts`. You may append your verification to `docs/TASK_LOGS.md` and write your report to `docs/exercise/report.md`. Everything else is read-only, including every `*.test.ts` file.

Check: from the repository root, `npm --prefix src/Enoch.Ui test`, `npm --prefix src/Enoch.Ui run lint` and `npm --prefix src/Enoch.Ui run typecheck` exit 0.

Report: write `docs/exercise/report.md` as a structured handoff (leading YAML with task, status, outcome, artifacts, verification, discoveries, blockers), then commit your work on your branch. Follow the repository's `AGENTS.md` and development rules.

## Operational details (from the launching Coordinator)

- Work branch: create `ruach-exercise/url-encoding-subject` from the current branch after checking that it does not already exist.
- Protected: every `src/Enoch.Ui/src/*.test.ts`, `App.vue`, configs, `package*.json`, lockfiles, everything under `src/` outside `api.ts`, and `docs/PROBLEMS.md`. No new dependency, service, Docker, database or network.
- Extra checks, bounded to 300 s each: `node src/Enoch.Ui/node_modules/prettier/bin/prettier.cjs --check src/Enoch.Ui/src/api.ts` and `git diff --check`.
- The Node on PATH is v22.23.3. Full `just check` is not required and must not be claimed.
- Validate your report with `bun /tmp/ruach-implementation-20261011/live/source/skills/ruach-handoff/scripts/validate.ts /tmp/ruach-implementation-20261011/enoch-exercise/clone/docs/exercise/report.md --repo /tmp/ruach-implementation-20261011/enoch-exercise/clone`.
- Candidate role and skills are in the directory added with `--add-dir`; the user answers any native security or trust dialog directly.
- One bounded task turn, 20 minutes wall clock.
