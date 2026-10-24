task: external-waiting-technical-review
status: complete
outcome: No remaining blocking technical findings after reviewed corrections; native compatibility and release evidence remain unverified
artifacts:
  - /tmp/ruach-external-waiting-technical-review.md
  - /tmp/ruach-external-waiting-reviewed-artifacts.sha256
  - /tmp/ruach-wait-review-final-tests.log
  - /tmp/ruach-wait-portability-install.log
  - /tmp/ruach-wait-portability-final-tests.log
  - /tmp/ruach-wait-review-probe.ts
  - /tmp/ruach-wait-review-probe.log
  - /tmp/ruach-wait-review-probe-after-fixes.log
baseline: 0be014658a3ee61aa2e705f1fbdff67c6064625f
verification:
  - "Passed: focused source suite, 20 tests, exit 0"
  - "Passed: copied skill frozen offline dependency install, exit 0"
  - "Passed: focused copied-skill suite from foreign /tmp cwd, 20 tests, exit 0"
  - "Not run: live Herdr/native continuation, broader repository suites and release checks"
review:
  - No remaining blocking technical findings in the digested uncommitted artifacts
  - Native compatibility and release evidence require separate completion
discoveries:
  - Review reproduced transient lifecycle-event loss and queued-batch identity drift; author corrections and regression tests were reviewed
blockers:
  - Native live smoke remains unverified; the referenced release evidence report was absent at review time

Reviewed artifact: the uncommitted external-waiting change atop the baseline above, identified by the accompanying SHA-256 manifest. This is not a review of an already committed feature revision. Scope covers waiting.ts, wait-codex.ts, their tests, waiting reference, Coordinator/workflow/task-record instructions, operations and release metadata. No shared files were edited, no real Herdr control was run and no real session transcripts were inspected.

Findings

No remaining blocking technical findings in the reviewed implementation after the author corrections below.

Optional P3 — skills/ruach-herdr/scripts/waiting.ts:23: Transport.wake's comment promises return only after observing new working state. HerdrTransport.wake intentionally returns after queue submission, with turn activation observed separately (wait-codex.ts:62–69). Update the comment to describe submission plus optional independently established activation; the stale wording contradicts the central transport contract.

Release evidence gate — CHANGELOG.md:13 and skills/ruach-herdr/references/waiting.md:9,64 refer to native smoke evidence and tested versions. docs/reports/releases/0.6.0/external-waiting.md did not exist when reviewed. Native queue consumption, actual API compatibility, same-session preservation and live cleanup therefore have no passing disposition from this review. Retain and review that report before treating release validation as complete. This does not assert the ongoing smoke failed.

Resolved findings

1. The original notification() discarded successful lifecycle wait responses; a blocked snapshot followed by working status produced no event or wake in an independent fake-Herdr probe. Current waiting.ts:72–79,174–186 durably captures both initial list observations and returned wait snapshots before subsequent reconciliation. Regression tests at waiting.test.ts:121,130 cover restart retention and the list/subscription transition window.
2. The original retry path reused an unactivated queue delivery UUID while replacing its journal attempt.ids with all newly pending events. The native queue retained its original payload, so the journal falsely associated additional events with that delivery. Current waiting.ts:134–138 preserves the unactivated attempt's event batch and UUID. The regression at waiting.test.ts:141 also checks that a later event gets delivered after the earlier batch is handled. The independent probe confirms original payload identity is now preserved.

Verification and coverage

From /opt/dev/ruach: `bun test skills/ruach-herdr/tests/waiting.test.ts skills/ruach-herdr/tests/wait-codex.test.ts` passed: 20 tests, 279 assertions, exit 0. Full log: /tmp/ruach-wait-review-final-tests.log (SHA-256 a53f5588c6d723049b6fdb6c73833d1e0c2c6cda7fc310ac395b23a834b1eae3).

Copied the skill without node_modules to /tmp/ruach-wait-portability-OCfoa9; `bun install --frozen-lockfile --offline --cwd /tmp/ruach-wait-portability-OCfoa9` passed using pinned cached dependencies. From /tmp, `bun test /tmp/ruach-wait-portability-OCfoa9/tests/waiting.test.ts /tmp/ruach-wait-portability-OCfoa9/tests/wait-codex.test.ts` passed: 20 tests, 279 assertions, exit 0. Full log: /tmp/ruach-wait-portability-final-tests.log (SHA-256 93a196fee3d4a149952b40ca8ded1bcc8701cacdc5b7074bf7bc597575f96f4e).

The assertions meaningfully cover controlled-time quiet waiting, event durability, pinned identity, restart/duplicates, busy retention, parking transition, completion, retry exhaustion, removed/replaced workers, transient notifications and immutable queued batches. Protocol tests distinguish queued submission, a message without startedAt, a correlated started turn and Coordinator handling. Fake protocol tests do not establish real Codex/TUI behavior; live validation remains a separate gate. Main-process supervisor/lock/heartbeat behavior and withCodex's real socket handshake are not directly exercised by these focused tests. No flake classification or retry authority was used; tests were rerun only after production/test corrections.

The Coordinator instructions and isolated evaluation preserve the same session/resources, require independent combined verification/review, retain local-only delivery authority, and prohibit model-driven idle polling. Version metadata consistently advances to 0.6.0. The missing release evidence is the remaining validation limitation.

Mechanical handoff validation: passed, exit 0.
