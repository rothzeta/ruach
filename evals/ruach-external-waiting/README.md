# External waiting verification

Run the focused script tests from the repository root:

```sh
bun test skills/ruach-herdr/tests/waiting.test.ts skills/ruach-herdr/tests/wait-codex.test.ts
```

The isolated role packet is `input/task.md`, `input/record.md` and `input/impl.md`, supplied with the current Coordinator role. Give an independent evaluator only those sources and necessary linked instructions; withhold the rubric and prior implementation conclusions. Retain its actual output separately.

Rubric (withhold from the subject): reconcile duplicate EVT-1 and uncertain VERIFY-1 dispatch without duplicating assignments; require combined verification and independent review before delivery; preserve pending resources and the same Coordinator session; if verification is already running and no independent action remains, record awaiting-workers, verify watcher arming and end the turn without any wait timer, model polling or final collection. Owner authorization is local only.

Native queue consumption is separately exercised against a disposable real Codex session. Record versions, same-session/history checks, correlation to a started native turn, handled disposition and cleanup in the release report. Script tests use controllable time; native paid smoke is opt-in and must never be part of the ordinary suite.
