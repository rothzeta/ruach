# Ruach 0.6.1 verification

This patch covers the five requested improvements within Ruach and its global skill/plugin installation. By the user's explicit scope clarification, Sandalphon's `round10/fixture/tools/ruach.ts` and separate external runtime remain unchanged. The external consumer waiting problem is **not claimed fixed**.

## Runtime behaviour

`scripts/agent-waiting.ts`, exposed by `just agent-waiting`, invokes the canonical `waiting.ts` entry point. It uses the same Watcher, Transport, single Coordinator-owned task record and watcher-owned operational journal. Codex continuation now sits behind an injected adapter; persistence, event identity, delivery reconciliation, retries and acknowledgement remain in the watcher. Arming additionally pins the Coordinator's four identity fields; their JSON property order is irrelevant. Pre-0.6.1 journals require the documented operator reconciliation before adding that pinned identity.

The consumer-entry tests run the actual wrapper subprocess against controlled Herdr lifecycle and native queue boundaries. They establish dropped-notification recovery, active/busy-to-parked retention, durable attempt persistence before sending, interrupted native addition and watcher restart, stable event/delivery identity, duplicate notification suppression, separate submission/turn-start/handling, removed/replaced workers and same-session addressing. Unsupported Coordinator harnesses and missing authoritative native identity fail without delivery. Existing waiting tests retain their controlled-time coverage of quiet waiting, transient events, batching and bounded failure.

The [native evidence](native-evidence.json) comes from a fresh two-session Codex smoke through the actual consumer entry point on Codex 0.164.0, Herdr 0.9.0/protocol22 and Bun 1.4.2. During 3.5 seconds of healthy idle waiting there were zero new Coordinator turns and zero deliveries. A real worker's completion then caused one submission into the existing Coordinator session, a correlated started turn and a durable handled disposition. A private memory marker survived; name/session identity remained unchanged. The record explicitly completed, the watcher exited 0, and both owned workspaces were closed. Private native IDs and the marker are excluded from retained evidence. This bounded smoke does not establish production reliability or exhaustive live busy/approval races.

Only Codex continuation is supported. Claude, OpenCode, Pi and Goose continuation remain capability failures, despite their separate launch support. Ruach's preferred Claude Coordinator therefore needs an operator-authorized compatible setup before parking; this patch does not switch routes or use a different waiting loop automatically. Operator supervision remains required.

The development launch wrapper resolves the selected harness with the canonical resolver and passes its explicit authorized policy: Claude/Codex `auto-review`, OpenCode `inherit`; Pi/Goose have no inferred development policy. Preflight stderr records the mode and policy source while native results retain their existing schema. Conflicting requests, undeclared policies and native permission overrides fail before portable launcher invocation. The portable launcher's default and adapter checks are preserved. Tests verify equivalent policy across resolve, dry-run and start even under an OpenCode caller environment; existing Herdr tests cover native capability failure before mutation. No new live paid worker launch by the development permission wrapper was performed.

## Guidance and review

The [independent bounded evaluation](bounded-evaluation.md) records actual decisions in 17 synthetic context, correction-cycle, readability and oracle scenarios. It covers bounded intake/wakes, authority recovery after compaction, permitted cleanup metadata, initial implementation failures, completed unsuccessful corrections, stable outcome budgets and earlier blockers. Review cases distinguish deficient scroll/startup tests and incidental fixed-seed snapshots from documented seed mappings, and handwritten compression from generated minification. It is not an instrumented production Coordinator run.

The [independent runtime review](runtime-review.md) found and reproduced an identity-order defect. The final semantic comparison and consumer-entry regression resolve it; no outstanding blocking finding remains. Native smoke evidence was inspected rather than independently repeated.

## Verification

- `just check`: passed resource/link checks and TypeScript typechecking.
- `just release-check`: passed synchronized 0.6.1 metadata, native roles and changelog.
- `bun run test`: 108 passed, 0 failed, 1,247 assertions.
- `bun test --timeout 30000` in `skills/ruach-herdr`: 222 passed, 0 failed, 2,101 assertions. After the later semantic identity correction, the affected waiting/consumer tests were rerun successfully rather than repeating unrelated native preparation cases.
- Skill-creator validation passed for testing, simplification and both workflow skills. Its generic validator rejects Herdr's existing `compatibility` frontmatter field; Ruach's resource checker validates that required executable-skill metadata successfully. The field was preserved.
- Touched TypeScript was formatted with cached Prettier 3.9.9 using single quotes. The project has no configured formatter. No formatting unit tests were added.

The first root run found the old documentation consistency expectation for where consumer correction overrides are declared. The guidance now retains that location explicitly, and the suite passes. Socket-denied reviewer runs were classified as environment-blocked; the supported socket-capable rerun passed, with original evidence retained in the review.

Full verification logs retained in this environment (SHA-256):

- `/tmp/ruach-root-final.log`: `74e7b99bd785939e0867686afdfe6dd3c8231e565fa524a8bc37d49dc3aa6cf0`
- `/tmp/ruach-herdr-tests.log`: `143d2eafd9b5ddd1e047f547fb165399708b243bfafdb7b099a33e7611c2335b`
- `/tmp/ruach-wait-final.log`: `25f05521fee22f14ed94b124691156a415c290efabb36d0acd1b9b8e4fff9aba`

## Changed files

- `.claude-plugin/marketplace.json`
- `.claude-plugin/plugin.json`
- `CHANGELOG.md`
- `README.md`
- `agents/architect.md`
- `agents/coordinator.md`
- `agents/implementer.md`
- `agents/reviewer.md`
- `docs/examples/assignment-specimen.md`
- `docs/reports/releases/0.6.1/bounded-evaluation.md`
- `docs/reports/releases/0.6.1/native-evidence.json`
- `docs/reports/releases/0.6.1/runtime-review.md`
- `docs/reports/releases/0.6.1/verification.md`
- `justfile`
- `package.json`
- `scripts/agent-routing.ts`
- `scripts/agent-waiting.ts`
- `skills/ruach-herdr/SKILL.md`
- `skills/ruach-herdr/references/routing.md`
- `skills/ruach-herdr/references/waiting.md`
- `skills/ruach-herdr/scripts/wait-codex.ts`
- `skills/ruach-herdr/scripts/waiting.ts`
- `skills/ruach-herdr/tests/waiting.test.ts`
- `skills/ruach-simplification/SKILL.md`
- `skills/ruach-testing/SKILL.md`
- `skills/ruach-testing/references/verification.md`
- `skills/ruach-workflow-feature/SKILL.md`
- `skills/ruach-workflow-knowledge/SKILL.md`
- `tests/agent-routing.test.ts`
- `tests/agent-waiting.test.ts`
