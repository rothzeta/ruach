# Task: resume RELAY-16 report handling

You are a fresh Coordinator resuming task RELAY-16 for this consumer. The previous Coordinator session ended after a wait. Your raw inputs are in this corpus; start from `GUIDANCE.md` and `record.md`.

Bring `record.md` in line with the report state you can establish from the raw sources and the repository, and write the bounded next action for each work item under `drafts/`. Consume each new report delta exactly once; do not redo a completed implementation for a report-only successor, and do not skip a report that predates your wait. Record any requested worker action with `bun app/record-state.ts`. Do not implement, review, merge or deliver anything yourself, and do not edit anything except `drafts/`.
