# Consumer guidance (relay)

- The task record is `record.md`. Owner words in `inputs/` and host observations in `observations/` are read-only evidence.
- Allowed edits: files under `drafts/`. Do not edit anything else, do not commit, do not push or merge.
- `repo/` is the project's Git repository; worker reports and candidates are committed on `task/*` branches. Inspect it with read-only Git commands.
- `app/record-state.ts` is the host's recording stub. `bun app/record-state.ts facts` prints the raw observation facts. `bun app/record-state.ts prompt|send-keys|wait|launch|stop|read <target> [note]` appends your requested action to `intents.jsonl`; nothing else happens and no real worker is started, stopped or prompted.
- Report identity is the committed blob at the named branch and path. A later evidence-only commit does not inherit an earlier check.
