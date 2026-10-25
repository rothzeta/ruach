task: FIX-LAUNCH-02
status: complete
outcome: "Committed the bounded LR-01 correction and verified actual initialized-shell transport; live native role/policy/identity acceptance and independent review remain held."
source_baseline: a88d44b7aa84143307a7298e4cd423c7f7e75c68
source_revision: c90fc3bc0cc957e1ba771e153272dcd117fb96f8
candidate_revision: f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f
tested_revision: f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f
prior_review_report_revision: 4f86897c654ddc6f3a610c01aaed2383f9fd3997
artifacts:
  - docs/reports/c1-c5/launch-fix-02.md
  - docs/assignments/c1-c5/FIX-LAUNCH-02.md
  - /tmp/ruach-fix-launch02-QRC4dvhF
verification:
  - "Exact prior production transport plus final public-worker fixtures: expected exit 1, both LR-01 tests fail; ready with zero prepared arguments and wrong executable are observed."
  - "Unchanged physical canonical-input reproducer: exit 0, 6000 bytes sent and exactly 4095 received before newline; hashes match prior evidence."
  - "Final focused initialized-shell/PTY/source checks: exit 0, 21 pass/0 fail."
  - "just check: exit 0, resource/link/notices and TypeScript checks pass."
  - "bun run test with authorized sockets: exit 0, 108 pass/0 fail."
  - "bun run release-check: exit 0, existing 0.6.1 metadata unchanged."
  - "Full affected Herdr suite with sockets/PTY: exit 0, 243 pass/0 fail in 193.79 seconds."
  - "Protected instruction/Tester/routing comparison, assignment integrity and git diff --check: exit 0."
  - "Canonical handoff validator --repo and final resource check: exit 0, all five revision references resolved without diagnostics."
review: not-run
discoveries:
  - "Shell binding is established after initialization via existing pane run/wait-output primitives; inherited PATH is no longer the dispatch mechanism."
  - "Ready/blocked acceptance now requires a private payload receipt and the expected foreground process/group, preventing a default native process from silently passing."
blockers: []

# LR-01 correction handoff

Bounded implementation and assigned local verification are complete. `c90fc3b` creates the correction; `f6d9c2c` changes only the executable-selection regression's explicit startup precondition and decoy fixture. The final candidate and required tested revision are `f6d9c2c`. This report/unchanged assignment are a later evidence-only commit; its creating SHA is returned externally. No independent acceptance, native-session acceptance, integration or delivery is claimed.

## Same outcome and prior evidence

The outcome remains **LAUNCH-LONG-ARGV**. Attempt 1, source `2c114e8b10768862d0dd9eafab4f982dc4fff1e9` / report `0d9b2f06d87ac5ee81a5917b9d0f7a035f89640d`, failed required live verification and independent review `4f86897c654ddc6f3a610c01aaed2383f9fd3997` with P1 **LR-01**. That review's public summary and rcfile/PTY reproduction were read at `/tmp/c15-launch-review-01-M8KtgM`; their files and the review were not changed. Its observed missing canonical Reviewer role, actual user approval reviewer and unbound Herdr native identity remain failed/held evidence. Matching default model/effort is not acceptance.

One failed completed correction cycle is recorded by FIX-LAUNCH-02, with one remaining before this correction's handoff. This is the next correction of that same outcome, not a reset. Initial implementation/type/test iterations and supported socket remediation are not completed correction cycles. If required verification or independent review rejects this handed-off correction, the count reaches two and normal fix looping must stop for escalation with preserved evidence.

The original 6000 → 4095 physical truncation, original-worker long-command red result and historic released-pane symptom remain unchanged at their original artifacts/reports. The invalid fresh resource was not prompted, altered, queried, registered or assumed live here; its disposition belongs to the Coordinator. No private native UUID or authoritative task-record/journal data was read or copied.

## Supported cause, correction and tradeoff

Ordinary interactive shell initialization can prepend user executable directories before an inherited bootstrap PATH prefix. Attempt 1 then submitted only the canonical executable name, allowing the default native program to report ready with all prepared arguments absent. Our public-worker regression reproduced that exact false-ready result before correction: `ready: true`, zero arguments and a retained startup sentinel. It also detects a different native executable selected from the startup directory. Replaying both final controls against exact baseline production transport files fails both cases; all three replaced production files match their `a88d44b7` bytes (`baseline-source-comparison.json`). Other replay files are explicitly the final test fixtures, not a claimed pristine baseline checkout.

The correction retains full prepared argv in private JSON and uses supported installed Herdr primitives **after shell initialization**:

1. `pane run` sources a private POSIX `setup.sh` defining the declared kind as a function bound to its absolute private bootstrap. Other startup customization remains active; no rcfile or global setting is removed or changed.
2. `pane wait-output --match ... --timeout ...` confirms the unique marker emitted only by that file, never by echoed command text. Missing confirmation holds startup before the single intended native submission.
3. The existing named `agent start --kind ... --pane ...` submits the short canonical command. The helper restores explicitly forwarded PATH/config/adapter environment and execs the already-probed absolute executable with exact argv, including role/config, model/effort and permission flags.
4. Before ready or matching blocked-input acceptance, require a private receipt matching the per-launch nonce and payload SHA-256, plus `pane process-info` matching the helper's exec-preserved PID and foreground group. Missing/foreign receipts or unrelated foreground processes fail closed as `bootstrap_unconfirmed`, with material/state retained and no resubmission. Exec failure removes only its own new receipt; an existing receipt cannot be overwritten.

Installed 0.9.0 help and bundled protocol-22 schema were inspected for `pane run`, `pane wait-output` and `pane process-info`, including actual response fields. Preflight verifies these primitives and Bun `process.execve` before launch-space mutation when large transport is needed; actual-cwd preparation is rechecked. This adds one initialization submission, not a second native start, launcher, scheduler or retry/event policy. There are no new native flags, routes, dependencies or permission mappings. Short/direct behavior is retained.

The tradeoff is an explicit POSIX-compatible binding plus a safely short setup pathname and additional local acknowledgements. Unsupported binding/capability/process evidence stays held. Temp roots containing a PATH delimiter are now valid; the old PATH-entry restriction is obsolete because PATH no longer selects the bootstrap. Its test was replaced with positive delimiter-path coverage and meaningful missing-runtime/primitive pre-mutation cases. Native argv visibility and OS argument limits remain as documented.

## Changed scope and oracle

Production: `skills/ruach-herdr/scripts/{worker,launch-transport,native-launch}.ts`; affected `SKILL.md` and `references/adapters.md`. Tests: `tests/{worker,spaces,launch-transport}.test.ts` and fixtures `fake-cli.ts`, `terminal-start.ts`, new `terminal-host.ts` / `terminal-client.ts` within that skill. The fixture host retains one real Bash/PTY across separate fake Herdr CLI calls, so sourcing, marker observation, startup customization and native execution occur in the same actual shell. It is test support only; readiness/kind are fixture observations, not real Codex acceptance.

Twenty-one focused cases cover clean versus isolated PATH-prepending rcfiles, different native executable, actual foreground PID/group, copied scripts, literal/empty/Unicode/quote/backtick/dollar data and independent SHA-256/array oracles; retained rc bytes/sentinel; requested role/config/auto-review/environment; failed exec, missing/forged receipt, lost binding, wrong foreground, blocked/uncertain retention, no start after setup failure and pre-mutation capability failure. Expectations use authored public inputs and contracts, not the production quoting/serializer. No formatting/prose unit tests were added or assertions weakened.

An initial replay showed that one decoy-executable control loaded its rcfile only when the new binding existed. The final test explicitly requires the real terminal/rcfile regardless of implementation; the prior code now fails both controls and the candidate passes both. Earlier logs are retained rather than replaced as historical successes. The original physical reproducer still yields 4095 of 6000 bytes; corrected long startup submits seven quoted executable-name bytes after private binding and delivers the full payload.

All new instruction bodies, Tester and accepted routing/defaults at `8c6ab62a777c9b229be7fcb1001e69ae9a84eb9a`, agy, root docs/CI/package/version metadata and prior evidence are unchanged. The unsubmitted `C-IN-01.md` draft is not this assignment and remains untracked. No main-checkout writes occurred.

## Exact verification receipt

Final required checks ran after the candidate existed. Full logs precede tails and remain under `/tmp/ruach-fix-launch02-QRC4dvhF`; `verification.json` lists commands/cwds/exits/digests and `SHA256SUMS` covers evidence files. Existing pinned dependencies were reused (Bun 1.4.2). Worktree cwd below is `/opt/dev/ruach-worktrees/c15-instructions`; skill cwd is its `skills/ruach-herdr`.

| Command | Cwd / result | Log |
| --- | --- | --- |
| `timeout 300s bun test tests/worker.test.ts --test-name-pattern 'LR-01:'` | Skill / initial socket EPERM, exit 1 before assertions; not product proof | `before-lr01-default.log` |
| Same command, authorized socket/PTY access before correction | Skill / expected exit 1, ready with zero arguments | `before-lr01.log` |
| Same command, exact prior production files with final fixtures | Evidence `baseline-skill` / expected exit 1, 0 pass/2 fail, including wrong executable | `baseline-replay.log` |
| `timeout 10s bun docs/reports/c1-c5/launch-artifacts/canonical-input.ts` | Worktree / 0, 6000 → 4095 with unchanged hashes | `canonical-input.json`, `canonical-input.stderr` |
| `timeout 300s bun test tests/launch-transport.test.ts tests/worker.test.ts --test-name-pattern 'canonical PTY\|LR-01:\|large startup\|private binding\|post-initialization launch\|long literal\|missing Bun\|failed native exec'` | Skill, authorized sockets/PTY / 0, 21 pass/0 fail | `focused.log` |
| `timeout 300s just check` | Worktree / 0 | `check.log` |
| `timeout 300s bun run test` | Worktree, authorized sockets / 0, 108 pass/0 fail | `root-test.log` |
| `timeout 300s bun run release-check` | Worktree / 0 | `release-check.log` |
| `timeout 300s bun test --timeout 30000` | Skill, authorized sockets/PTY / 0, 243 pass/0 fail, 193.79 seconds | `herdr-test.log` |
| `git diff --check a88d44b7aa84143307a7298e4cd423c7f7e75c68 HEAD` | Worktree / 0 | `diff-check.log` |
| `sha256sum -c /tmp/ruach-fix-launch02-QRC4dvhF/assignment.sha256` | Worktree / 0, unchanged assignment | `assignment-check.log` |

The initial `just check` compilation failure (new fixture JSON response types and changed helper return type) is retained in `check-initial.log`; annotations and fixture use were corrected, not classified as environment or hidden. Earlier `c90-*` checks and baseline observations remain separate from final-candidate logs. No registered-flake retry or forbidden command was used.

The default final-report commit hit read-only shared-gitdir `index.lock` protection; the assignment-authorized exact-path Git remediation was required. No lock was deleted and no Git/global permission setting changed.

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/launch-fix-02.md --repo /opt/dev/ruach-worktrees/c15-instructions` exited 0 with `ok: true`, all five revision references resolved and no diagnostics (`handoff-validate.log`). Final `bun scripts/check.ts` including the report exited 0 (`final-resource-check.log`). Mechanical validation does not establish independent review or native acceptance.

## Required live check and retained resources

Root must separately commission the real source-wrapper original-failure retest at **f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f**, with normal startup customization and the exact canonical role/hash, declared model/effort, permission policy, actual cwd/config and pinned executable. Require binding/receipt/foreground evidence, then actual recorded native role and approval-reviewer/policy evidence against the prepared payload. Matching model defaults, a process title, a marker or a helper receipt alone is not native role/policy acceptance. Authoritative Herdr pane-to-native session binding remains a separate mandatory identity check; never register a discovered/inferred UUID or treat the bootstrap nonce/PID as that identity. Independent exact-candidate review remains pending.

No actual native model/worker session, paid probe, prompt, dialog answer or native registration ran here. Local tests cannot close those live/identity holds. Private roots/directories/executable remain 0700; argv/setup/receipt data are 0600. Keep `temporary_directory` and its selected skill helper source after active, blocked or uncertain startup. The task-local function remains in its pane until Coordinator disposition; release only after reuse ends and evidence is preserved, under existing worktree/branch retention rules.

Retain this worktree/branch/session, ignored dependencies, `/tmp/ruach-fix-launch02-QRC4dvhF` (logs and baseline copy), and bundled-schema scratch `/tmp/fix-launch-02-api-schema.json`. Fixture-owned terminals/native recorders were closed by test cleanup. No real worker/session/workspace or task resource was released, and no merge/delivery, tag/push/global installation or new ownership amendment occurred.
