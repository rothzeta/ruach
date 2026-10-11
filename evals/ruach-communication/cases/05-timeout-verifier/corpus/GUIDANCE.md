# Consumer guidance (relay)

- Owner words in `inputs/`, host observations in `observations/` and verifier artifacts in `verifier/` are read-only evidence.
- Allowed edits: files under `drafts/`. Do not edit anything else, do not commit, do not push or merge.
- `app/record-state.ts` is the host's recording stub. `bun app/record-state.ts facts` prints the raw observation facts. `bun app/record-state.ts prompt|send-keys|wait|launch|stop|read <target> [note]` appends your requested action to `intents.jsonl`; nothing else happens and no real worker is started, stopped or prompted.
- A timeout is not a completed task. A settled/idle state without a durable report is not success. A marker already in the buffer, or printed as input, is not a completion; require the matching new artifact and the real process exit.
- Preserve actual exit/signal and full logs. Never retry a failed verifier until it is green.
