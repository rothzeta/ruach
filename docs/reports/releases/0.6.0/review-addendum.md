task: external-waiting-review-addendum
status: complete
outcome: Executable delta and native evidence reviewed; no remaining blocking technical findings
artifacts:
  - /tmp/ruach-external-waiting-review-addendum.md
  - /tmp/ruach-external-waiting-addendum-artifacts.sha256
  - /tmp/ruach-wait-addendum-tests.log
  - /tmp/ruach-wait-drain-review.test.ts
  - docs/reports/releases/0.6.0/external-waiting.md
  - docs/reports/releases/0.6.0/native-evidence.json
baseline: 0be014658a3ee61aa2e705f1fbdff67c6064625f
verification:
  - "Personally run: focused source suite and independent notification-drain probe, 21 tests passed, exit 0"
  - "Evidence reviewed only: sanitized native smoke result and its setup, pre-trigger assertion and consolidation drivers"
review:
  - No remaining blocking code or native evidence accuracy findings in reviewed artifacts
discoveries: []
blockers: []

This addendum supplements /tmp/ruach-external-waiting-technical-review.md; the original report remains unchanged. The accompanying manifest identifies current uncommitted source and evidence hashes. waiting.ts is SHA-256 90fd16ea1fef0f25576e1c34e2eedac0dc2c08db9d0ff76112e4f0634f927d55; wait-codex.ts remains 3d8d4d58640cc5b42955ec00f285eb822440f101dac1dd812ab8cce6c2c812cd.

The stated executable delta is accurate: Transport.wake's misleading activation comment is corrected, and notification() uses Promise.allSettled before propagating any rejection (waiting.ts:179–189). This drains remaining lifecycle waits and synchronous capture callbacks before the next reconciliation, preventing a failed wait from leaving callbacks active across a later journal rewrite. No other executable delta was found against my retained copied candidate.

I personally ran `bun test skills/ruach-herdr/tests/waiting.test.ts skills/ruach-herdr/tests/wait-codex.test.ts /tmp/ruach-wait-drain-review.test.ts` from /opt/dev/ruach: 21 passed, 282 assertions, exit 0. The independent fake-Herdr probe supplies an early malformed wait response and a later valid blocker, then checks that the blocker is captured before notification rejects and no callbacks arrive after return. Full log: /tmp/ruach-wait-addendum-tests.log, SHA-256 f78297aac43fa691e00c043982a7f6044f55c8a1580c865983d3b76c8ae44705. No live Herdr control, real transcript inspection or native smoke was personally run.

I reviewed external-waiting.md, native-evidence.json and the three private driver source files named in the manifest. The sanitized result records the same named/native Coordinator, unchanged model/effort, remembered marker, one event/submission, correlated started turn, handling, completion and released lock. The pre-trigger driver independently compares the exact turn-ID list against the setup snapshot before assigning the worker; thus the final consolidation driver's literal quiet-turn count reflects that earlier assertion rather than an untested inference. Its cleanup code closes only the two recorded disposable workspaces. The author reports that this final live run exited 0 and those workspaces were closed; this addendum reviews that evidence and source, not a second live execution.

The report appropriately separates controlled busy/restart cases from the live idle-queue smoke and limits continuation support to Codex. Prior missing-evidence and stale-comment findings are resolved. No remaining blocking technical findings were found. The author subsequently reported final complete skill-suite success (222 tests, 2101 assertions, exit 0), root-suite success (101 tests, 879 assertions, exit 0), and check/release-check success. I reread the main report's updated verification paragraph; the pending-result sentence is resolved. These broader checks were reported by the author and were not independently rerun here.

Mechanical handoff validation: passed, exit 0.
