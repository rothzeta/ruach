task: five-bounded-improvements-runtime-review
status: complete
outcome: No outstanding blocking findings after semantic identity comparison correction; focused tests support shared watcher and wrapper contracts
artifacts:
  - /tmp/ruach-bounded-evaluation-Nz6DpD/runtime-review.md
  - /tmp/ruach-bounded-evaluation-Nz6DpD/identity-order.ts
  - /tmp/ruach-bounded-evaluation-Nz6DpD/runtime-focused-tests.log
  - /tmp/ruach-bounded-evaluation-Nz6DpD/runtime-socket-tests.log
  - /tmp/ruach-bounded-evaluation-Nz6DpD/identity-order-after.log
  - /tmp/ruach-wait-final.log
verification:
  - "Passed: 37 focused routing, watcher and Codex queue tests; 3 consumer tests initially environment-blocked by EPERM on Unix socket listen"
  - "Passed after supported socket-capable escalation: bun test --timeout 30000 tests/agent-waiting.test.ts; 3 tests, 265 assertions, exit 0"
  - "Reproduced: bun /tmp/ruach-bounded-evaluation-Nz6DpD/identity-order.ts; first reconciliation armed, second with semantically identical reordered Coordinator fields failed, exit 1"
  - "Passed after correction: same isolated reproducer now prints armed for both reconciliations, exit 0"
  - "Inspected parent final focused log: 23 waiting/consumer/Codex tests passed, 582 assertions, exit 0; includes consumer key-reordering and duplicate-notification coverage"
review:
  - "Resolved P2: Coordinator pinning now compares the four authoritative identity fields semantically in both journal and status checks"
discoveries:
  - "Only Codex continuation is supported; preferred Claude Coordinator remains an explicit operational capability failure rather than gaining a fallback"
blockers: []

# Reviewed scope

Read-only review of the current uncommitted candidate's `scripts/agent-routing.ts`, `scripts/agent-waiting.ts`, canonical waiting runtime, Codex adapter, focused routing/waiting tests and waiting reference. No repository files were changed. The prior bounded guidance evaluation is separate. The parent supplied native-smoke evidence at `/tmp/ruach-061-native-rpF9aX/evidence.json`; its contents report same-session continuation, marker retention, zero quiet turns/deliveries, actual turn correlation and durable handling. This reviewer did not independently repeat that paid native smoke.

# Resolved finding

P2 — `skills/ruach-herdr/scripts/waiting.ts:285` and the analogous `status` condition compare pinned Coordinator objects with `JSON.stringify`. JSON object property order is not part of native identity. If the Coordinator rewrites the same task record with keys ordered `session,pane,kind,name` instead of `name,kind,pane,session`, the first reconciliation arms, then the second reports “Journal Coordinator identity mismatch” and the watcher eventually exits. The one-shot arming command also rejects this same-identity rewrite. A routine record rewrite can therefore leave the same native session without its watcher, despite all four identity values remaining unchanged.

The isolated reproducer in `identity-order.ts` uses the public `Watcher.step` boundary, a single fixed lifecycle identity and no worker events. It changes only property order after the initial armed reconciliation; it does not emulate an actual session replacement. Expected behaviour follows the native identity contract independently from production comparison logic: the four values identify the same session, so it should remain armed. Use a field-wise identity comparison in both paths, preserving rejection when any identity value changes. Include coverage for record key reordering and retain changed-session rejection.

Correction review: the implementation now uses `sameIdentity` to compare name, kind, pane and native session at both affected checks. The isolated reproducer was rerun by this reviewer and now remains armed for the reordered record. The updated consumer-entry test rewrites field order, waits for a fresh watcher heartbeat, requires a successful status receipt, and then requires changed-session rejection. This closes the finding without weakening native identity validation. The parent's final focused log reports all 23 watcher/consumer/Codex tests passing. No outstanding blocking finding remains in this reviewed scope.

# Other assessment

The real Ruach consumer entry delegates directly to canonical `main`, so it does not implement another event journal, acknowledgement or retry loop. The adapter interface exposes native continuation operations while `Watcher` retains persistence and retry ownership. Persist-before-send and stable delivery identity remain visible, submission/start/handling stay distinct, and default continuation rejects unsupported harnesses or unavailable authoritative identity. Lifecycle matching pins name, kind, pane and native session.

The development routing wrapper invokes the canonical resolver before launcher invocation, chooses permission mode from a small harness mapping independent of caller mode, rejects explicit conflicts and disallows native overrides at its CLI boundary. Resolve, dry-run and start share this resolution path. Portable worker defaults and native capability checks remain delegated. Wrapper tests replace the launcher only to assert argument/policy forwarding and non-invocation on conflicts; they do not establish native launch success. Existing portable adapter checks and the parent suite supply that separate evidence.

Consumer-entry tests preserve real shared watcher and Codex queue operations across process/Unix-socket boundaries. Controlled lifecycle/native-protocol fixtures establish dropped-notification recovery, interrupted delivery/restart, busy parking, durable acknowledgement, changed/missing native identity and unsupported harness failures. Existing watcher tests separately cover duplicate events, transient lifecycle snapshots, removed/replaced workers and stable event identities. Their doubles supply external lifecycle/protocol effects rather than replacing the watcher behaviour under claim.

Touched runtime and new wrapper/test bodies use readable multiline formatting. No unnecessary retry abstraction or second policy framework was introduced. No other concrete blocker was identified in this bounded review.

# Verification evidence and limits

Command from `/opt/dev/ruach`: `bun test --timeout 30000 tests/agent-routing.test.ts tests/agent-waiting.test.ts skills/ruach-herdr/tests/waiting.test.ts skills/ruach-herdr/tests/wait-codex.test.ts`. Exit 1: 37 passed, 3 failed before consumer assertions because the sandbox rejected Unix socket binding with `EPERM`. Full log retained, then only those three environment-blocked tests were rerun with supported local socket access. That rerun passed all 3, exit 0. Neither original failure nor its classification is hidden by the rerun.

This review does not claim Sandalphon's consumer bridge is migrated, non-Codex continuation is supported, every native busy/trust state is exercised, or an independently repeated live smoke passed. Broad release checks, global installation, push and tag publication belong to the parent delivery work.

Full-log SHA-256 digests: original focused run `d3ae9dc19237fab146f8265780719429fdb7217a8dcb0c6df234f03149f1ee54`; supported socket rerun `6ef91fdede21d8f7c07aa9561b2f1ce59d211ee221f306a0039cae88f426b6ef`.
