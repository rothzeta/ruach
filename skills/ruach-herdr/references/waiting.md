# External waiting

The Coordinator ends its turn when only delegated work remains. **Do not set a Coordinator wait timer.** Healthy waiting makes no wake submissions and no Coordinator model calls. `worker.ts` still only launches workers; `scripts/waiting.ts` is a separate external process and never launches, replaces, restarts or closes sessions.

Consumer integrations reuse the canonical watcher's event journal, delivery, retry and acknowledgement logic. Harness adapters supply verified native session identity and continuation operations. They do not implement separate retry or event-handling policies. `HerdrTransport` accepts a small `Continuation` adapter; its default remains the verified Codex queue implementation. Missing authoritative native identity is a capability failure, never permission to relax identity validation.

Ruach's consumer entry point is `just agent-waiting watch|status` (`scripts/agent-waiting.ts`), delegating to this same watcher. Operator supervision, paths and interval configuration remain external. Consumer-specific bridges are not fixed by this release unless their actual entry points are migrated and exercised.

## Supported continuation path

This integration supports an existing **named Codex Coordinator**, identified by its Herdr name, kind, pane and native session UUID. It uses the already running matching Codex daemon's shared submission queue, which the existing CLI consumes. It never calls `thread/start`, `thread/resume`, `turn/start`, steering, interruption or settings mutation. A follow-up queued during a race with an active turn waits for that turn; blocked Coordinators retain events. History, route and instructions belong to the existing session. Other Coordinator harnesses fail explicitly during setup; their worker-launch support is unchanged. Workers must also expose native session IDs in Herdr; do not register an unidentifiable worker or approve its startup dialog automatically.

Verified versions and exact live evidence are recorded in the release report. A successful queue addition proves submission, not activation. The watcher correlates its persisted native message UUID with a started native turn in the Coordinator's recent turn summaries. Only the Coordinator's task-record disposition acknowledges handling. No worker transcripts, source, diffs or logs are read. Twenty recent Coordinator turns are searched; an older unhandled delivery can be redelivered with the same event identity. Actions must therefore reconcile durable assignment/acceptance/delivery identities before repeating anything.

## Initialize worker identity

Before the first monitored assignment:

1. Resolve native startup dialogs with user approval in the existing workspace. `ready: true` means interactive startup, not that a native session ID exists.
2. Use the launcher's `native_identity` when `assignment_ready` is true. Otherwise inspect `herdr agent get <worker-name>` once and compare its name, kind and pane with the launch receipt. Require `agent_session.kind: id` and a nonempty string value without control characters. A pending ID, transcript hint or guessed UUID is not authoritative.
3. If that harness creates its ID only on a first turn, an authorized operator can initialize the existing idle worker using the bounded commands below. This is a separate model call, never automatic launcher behavior or a Coordinator waiting fallback. Require observed turn activity followed by `idle` or `done`, then check the same name, kind and pane and authoritative session ID. A blocked dialog, stalled prompt or unavailable identity is a capability blocker. Reconcile an interrupted bootstrap before considering any resubmission; do not send the real assignment or replace the worker to bypass missing identity.
4. Record the verified tuple and current `state_change_seq` in the task record before sending the real assignment. Arm the canonical watcher for this registration. Reuse the same native session; identity changes require reconciliation, not silently accepting a replacement.

Operator bootstrap, only when needed and authorized:

```sh
herdr agent prompt <worker-name> "Reply READY; do no task work or tool calls." --wait --timeout 120000
herdr agent get <worker-name>
```

An initial `assignment_ready: false` receipt remains a historical launch receipt. Later initialization is established by native metadata, not by rerunning `start`. This sequence does not add continuation support for another Coordinator harness.

## Task record

Add exactly one `ruach-wait` JSON fence to the **existing** Markdown task record. The Coordinator remains its sole writer. This operational section accompanies its ordinary pending assignments, expected next events, decisions and next actions; it does not replace them. Replace illustrative IDs below with actual `herdr agent list` lifecycle metadata (`agent_session.kind` must be `id`). Never commit private native IDs to Ruach.

````markdown
```ruach-wait
{
  "workflow": "PROJ-142",
  "generation": "attempt-1",
  "state": "active",
  "coordinator": {"name":"coord-proj-142","kind":"codex","pane":"w1:p1","session":"native-coordinator-uuid"},
  "workers": [
    {"assignment":"review-1","name":"proj-142-review","kind":"codex","pane":"w2:p1","session":"native-worker-uuid","after_seq":42,"handoff":"docs/reports/PROJ-142/review-1.md"}
  ],
  "handled": []
}
```
````

Keep the generation stable for watcher recovery. Each assignment ID is unique; use a new one for a new assignment, even with a reused worker. Register the worker's identity and current `state_change_seq` as `after_seq` **before sending its assignment**; later idle/done/blocked/unknown transitions are actionable. Missing/replaced workers produce failure events using the recorded old identity. Unchanged startup idle state is not completion. If an assignment already completed before registration, use its recorded pre-assignment sequence, not a new baseline that would hide the event.

Event identities derive from workflow/generation, assignment, worker/native identity, lifecycle sequence and state. The watcher fsyncs events and uncertain delivery attempts before delivery; native message UUIDs persist across uncertain-send recovery. A watcher restart reconstructs missed notifications through current status. Events are never discarded just because a worker disappeared or its assignment was removed. Do not delete the operational journal during recovery: it also retains transient blockers that may no longer appear in current status.

On delivery, read the linked handoff and reconcile worker identity and prior actions. Write a disposition such as `{"event":"<event ID>","disposition":"review accepted; FIX-2 recorded before dispatch"}` into `handled` and persist the next action identity before acting. A blocker awaiting the owner can be handled with that durable disposition; it need not repeatedly wake the model. Record an intended assignment as pending, then reconcile whether it was actually submitted after any crash. This is duplicate-safe coordination, not a transactional guarantee across arbitrary external delivery actions.

## Start, park, stop and recover

Install the skill's pinned dependencies once (`bun install --frozen-lockfile` inside `ruach-herdr`). Run the watcher under an external supervisor or an operator-owned persistent terminal, in the **same Herdr and Codex configuration environment** as the Coordinator:

```sh
bun /path/to/ruach-herdr/scripts/waiting.ts watch \
  --record /consumer/docs/task-record.md \
  --journal /consumer-private/wait/events.json
```

Use a private writable journal directory separate from the task record. The process owns all lifecycle waits, four-second reconciliation intervals, activation/handling deadlines and bounded retries. Herdr lifecycle waits plus periodic lightweight status reads recover lost notifications. Native queue and actual activation receipts are checked only when relevant; healthy waiting sends nothing to the Coordinator. Related pending events are batched.

While independent work remains, use `active`. When parking, persist `awaiting-workers` and expected next events, then run this **one-shot readiness check** with the same options/environment and end the turn:

```sh
bun /path/to/ruach-herdr/scripts/waiting.ts status \
  --record /consumer/docs/task-record.md \
  --journal /consumer-private/wait/events.json
```

`armed` requires a live watcher PID, a fresh heartbeat and matching workflow/generation and Coordinator native identity. The journal pins that identity; changing the Coordinator in the task record cannot reuse an old arming receipt. Registration and reconciliation run while active as well as parked, closing the transition gap. The watcher rereads record and native identity before delivery. It retains events while busy/blocked, observes actual activation separately from submission, and retries only after the Coordinator can accept work and its handling deadline passes. There are at most three delivery attempts without durable handling. Three consecutive operational errors terminate nonzero; the journal records failures. Configure the external supervisor to alert on failure and heartbeat loss. An operator, not a parked model, owns that alert. Do not install a Coordinator polling timer as a fallback.

For an intentional pause, send SIGTERM to the PID in `events.json.lock/pid`; the journal remains recoverable and the record stays parked. To recover, confirm the old PID has ended, remove only its stale `events.json.lock` directory if necessary, fix the operational failure, and rerun the same command with the same journal and generation. Never run two watchers against the same journal. A pre-0.6.1 journal lacks the pinned Coordinator field: after stopping its watcher and reconciling its delivery against the original native session, the operator must add that exact `coordinator` identity from the task record before restart. Do not infer a replacement session or discard pending events. If the retry budget is exhausted, first reconcile the queued message, actual native turn and task-record dispositions; the Coordinator/operator must repair the cause before the operator resets `attempts` in the operational journal. Do not clear events or reset the task record. A reused PID or ambiguous lock needs operator inspection, not automatic killing.

When the workflow's acceptance, delivery and cleanup obligations are finished, the Coordinator writes `completed`. The watcher cancels its own still-queued batch if necessary, records completion and exits. Idle workers, an idle Coordinator, or a quiet interval never imply completion and never trigger resource cleanup.

## Verification limits

Focused tests control lifecycle inputs and time without long real sleeps. They establish queue durability, stable identities, batching, restart and duplicate handling at the script's public boundaries. The live smoke exercises actual Codex queue consumption, history/session preservation, actual turn correlation and task-record handling. These are distinct from a full production workflow or proof that every model will follow the role. Supported behavior requires a live compatible daemon, shared native queue storage, the original CLI remaining open and the external supervisor remaining available. No Claude/OpenCode/Pi/Goose wake support is implied.

The lifecycle-bridge idea comes from Sandalphon's `ruach-round9-complete-2026-10-24` monitor/remote examples supplied with this task; benchmark paths, transcript inspection, automatic trust handling and idle-based collection were not imported.
