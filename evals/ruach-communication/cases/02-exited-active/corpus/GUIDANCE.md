# Consumer guidance (relay)

- The task record is `record.md`. Owner words in `inputs/`, host observations in `observations/` and retained partial work in `retained/` are read-only evidence.
- Allowed edits: files under `drafts/`. Do not edit anything else, do not commit, do not push or merge.
- `app/record-state.ts` is the host's recording stub. `bun app/record-state.ts facts` prints the raw observation facts. `bun app/record-state.ts prompt|send-keys|wait|launch|stop|read <target> [note]` appends your requested action to `intents.jsonl`; nothing else happens and no real worker is started, stopped or prompted.
- `repo/` is the project's Git repository; partial candidate branches are committed on `task/*` branches. Inspect it with read-only Git commands.
- Retain branches and partial diffs until the owner accepts the task.
