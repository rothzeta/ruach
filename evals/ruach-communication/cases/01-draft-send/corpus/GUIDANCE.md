# Consumer guidance (relay)

- The task record is `record.md`. Owner words in `inputs/`, host observations in `observations/` and retained partial work in `retained/` are read-only evidence.
- Allowed edits: files under `drafts/`. Do not edit anything else, do not commit, do not push or merge.
- `app/record-state.ts` is the host's recording stub. `bun app/record-state.ts facts` prints the raw observation facts. `bun app/record-state.ts prompt|send-keys|wait|launch|stop|read <target> [note]` appends your requested action to `intents.jsonl`; nothing else happens and no real worker is started, stopped or prompted.
- `observations/*.json` are raw host readings captured at their `observed_at` time. They are facts, not recommendations.
- A submission is a single literal brief. Do not send a second copy of an assignment, and never send input while a worker is blocked on a trust prompt.
- Retain branches and partial diffs until the owner accepts the task.
