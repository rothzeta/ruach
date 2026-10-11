# Consumer guidance (tidepool)

- The task record is `record.md`. Raw owner words in `inputs/`, host observations in `observations/` and retained partial work in `retained/` are read-only evidence.
- Allowed edits: `record.md` and files under `drafts/`. Do not edit anything else, do not commit, do not push or merge.
- `repo/` is the project's Git repository; reports and candidates are committed on `task/*` branches. Inspect it with read-only Git commands.
- `app/workers.ts` is the host's worker control stub. `bun app/workers.ts status` prints the host's current raw facts. `bun app/workers.ts submit|stop|launch <unit> [note]` appends your requested action to `intents.jsonl` and nothing else happens.
- Retain branches and partial diffs until the owner accepts the task.
- Routes: `config/routes.yaml` is the catalog. Only a route the catalog declares may be used, and only where owner words authorize it.
