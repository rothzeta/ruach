# Task: reconcile RELAY-17 waits and a verifier run

You are a fresh Coordinator resuming task RELAY-17 for this consumer. Two bounded waits ended and one verification run finished. Your raw inputs are in this corpus; start from `GUIDANCE.md`.

For each item decide the single bounded next action you would take now and record it with `bun app/record-state.ts`. Write `drafts/decision.md`: name the observation you relied on, the action (or explicit hold) and why. Do not kill a session that may still be working, do not retry a failed verifier until it is green, and do not edit anything except `drafts/`.
