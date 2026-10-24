# External waiting release evidence — 0.6.0

The Coordinator now ends its turn when only delegated work remains. Its role and both workflows explicitly prohibit idle wait timers, native wait tools, repeated Herdr status calls, sleep loops and still-waiting messages. The external Bun watcher owns waiting. The existing task record distinguishes `active`, `awaiting-workers` and `completed`; only the Coordinator writes handled dispositions. Worker launching and route selection are unchanged.

## Acceptance evidence

The focused suite has 20 passing tests covering these public behaviors with controllable lifecycle inputs and time: quiet waiting (200 reconciliations over 100 seconds of virtual time, zero wake submissions); recovery from a dropped notification; pinned same-session delivery; submission versus a started native turn versus handling; stable event identity and uncertain-send recovery across watcher reconstruction; duplicate delivery and durable dispositions; batching; busy/blocked retention; completion during parking; removed/replaced workers; transient lifecycle snapshots; immutable unactivated batches; explicit completion versus parking; bounded unhandled-delivery failure; and malformed task-record failure. Native-protocol fixtures reject thread creation/resumption, direct turn input, steering, interruption and settings mutation. One 100 ms notification test checks the real subprocess boundary; there are no long real sleeps in the focused suite.

The independent [technical review](technical-review.md) reproduced two defects in the first candidate: discarded transient notifications and changing a queued batch's identity without changing its native payload. Both were fixed and have regression coverage. It found no remaining blocking code finding. The independent evaluator's [actual isolated output](isolated-evaluation.md) reconciles duplicate EVT-1 without repeating VERIFY-1, preserves pending resources, keeps verification/review gates, and parks without timers. It identifies missing assignment-submission evidence as uncertainty to preserve, rather than permission to resend. This is one isolated evaluation, not proof of universal model adherence.

The reviewer also copied the skill without node_modules, installed frozen dependencies offline and ran all 20 focused tests from a foreign `/tmp` cwd successfully. Its retained artifact manifest identifies the reviewed candidate; the later comment correction, all-settled notification draining and this evidence report are assessed in the [review addendum](review-addendum.md).

## Real native continuation

The live smoke used Herdr 0.9.0 (protocol 22), Codex CLI/daemon 0.164.0 and Bun 1.4.2, with two disposable background sessions. The normal native CLI's session was reported `notLoaded` by the separate daemon; `canAcceptDirectInput` was null. A direct-input/loaded-thread assumption was therefore rejected. The existing CLI consumes its shared native submission queue successfully without resuming into that daemon.

Procedure: prime the Coordinator with a private synthetic memory marker, register the ready worker's native identity and pre-assignment sequence in a private task record, start the external watcher, check it armed, verify the Coordinator's native turn IDs remain unchanged during healthy waiting, then send the worker a bounded handoff-writing assignment. The external watcher observes completion and queues its batch. The existing Coordinator reads its record and handoff, writes a handled disposition and marks the test workflow completed. The driver then verifies native correlation, memory, route and cleanup. No source repository files were assigned to the test agents.

The [sanitized native result](native-evidence.json) records:

- zero new Coordinator turns and zero pending events before triggering worker completion;
- one lifecycle event and one external delivery attempt;
- the same named Coordinator and native session;
- the same `gpt-6.1-sol` model and high effort;
- a native user-message UUID matching a turn with an actual start timestamp, separately from queue acceptance;
- the remembered prior-turn marker in the final response;
- a matching handled disposition, explicit `completed`, watcher exit 0 and released singleton lock;
- zero explicit Coordinator idle-wait commands in the completed smoke turn.

The first live pass woke correctly but the model copied the event's `id` field into the handled record instead of using `event`. The watcher refused that invalid disposition. The wake prompt now states the exact handled-entry shape; failure journaling and a regression test protect the boundary. A fresh final task record using the same native sessions then completed successfully with the final prompt and notification capture changes. No malformed disposition was accepted to make the test pass.

The temporary untrusted-folder attempt was closed without approving its native trust dialog. Both successful smoke sessions and their task-created workspaces were closed after verification. The original caller and unrelated sessions were preserved. Raw private identities and native histories remain outside Git; this report contains only sanitized results.

## Verification and limits

`just check`, `bun run release-check` and all 101 root tests passed. The affected skill's frozen dependency install passed. Its complete final suite passed all 222 tests (2,101 assertions; 157.89 seconds; exit 0). The root suite passed all 101 tests (879 assertions; exit 0). Focused final source and copied-skill runs each passed all 20 tests. No dependency or worker-launch contract changed.

Only the Codex Coordinator queue path is enabled by this integration. Other harnesses' launch support remains unchanged; Claude, OpenCode, Pi and Goose continuation are not claimed. Ruach's development routing remains consumer policy: a preferred Claude Coordinator does not acquire a Codex route automatically. An incompatible watcher/route is an operational failure for the operator to resolve, never authority to switch routes or poll with the model.

Busy transitions, duplicate/restart races and dropped notifications are controlled-boundary tests. The real native smoke establishes idle queue consumption and durable handling; it is not a live production workflow or an exhaustive native busy/approval-dialog test. Queue safety relies on the native follow-up queue's semantics. The watcher does not inspect healthy worker transcripts or promise recovery of a transient state that neither the lifecycle source nor a status observation exposed. The operator must supervise the watcher and alert on nonzero exit/heartbeat loss; the parked Coordinator cannot detect a dead watcher without violating zero-call waiting. Native queue activation is searched in 20 recent Coordinator turn summaries; older unhandled events may be redelivered under stable event identities, so external actions still require task-record reconciliation.

Setup, arming, stopping and recovery commands are in the [external waiting guide](../../../../skills/ruach-herdr/references/waiting.md). No monitor is armed for a real consumer workflow merely by installing this release.
