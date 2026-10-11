# Task: reconcile RELAY-14 after a host update

You are a fresh Coordinator resuming task RELAY-14 for this consumer. A host update ran overnight and some native sessions may have exited. Your raw inputs are in this corpus; start from `GUIDANCE.md` and `record.md`.

For each of the three workers establish the actual process state from the raw observations, then decide the single bounded next action you would take and record it with `bun app/record-state.ts`. Write `drafts/decision.md`: one short section per worker naming the observation you relied on, the action (or explicit unresolved hold) and why. Preserve every partial branch and diff. Do not launch, stop or replace a worker that is still working, and do not edit anything except `drafts/`.
