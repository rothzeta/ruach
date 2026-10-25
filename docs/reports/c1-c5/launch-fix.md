task: LAUNCH-01
status: complete
outcome: "Committed the bounded large-argv transport correction with failing-before and passing canonical-PTY evidence; actual Codex source-wrapper launch and independent review remain separately held."
source_baseline: d0124e20a078fa3f0cc720679387c485a8e40f7a
candidate_revision: 2c114e8b10768862d0dd9eafab4f982dc4fff1e9
tested_revision: 2c114e8b10768862d0dd9eafab4f982dc4fff1e9
artifacts:
  - docs/reports/c1-c5/launch-fix.md
  - docs/assignments/c1-c5/LAUNCH-01.md
  - docs/reports/c1-c5/launch-artifacts/canonical-input.ts
  - docs/reports/c1-c5/launch-artifacts/canonical-input.json
  - /tmp/ruach-launch01-evidence-qPAtkMsT
verification:
  - "Original worker blob plus final PTY regression fixtures: expected exit 1, 21180-byte startup leaves continuation prompt and never reaches the native recorder."
  - "Canonical input reproducer: exit 0, 6000 ASCII bytes sent and exactly 4095 received before newline; independent input/received hashes retained."
  - "Committed candidate focused transport tests: exit 0, 8 pass/0 fail; long startup sends 7 terminal bytes and preserves complete native payload."
  - "just check: exit 0, resource/link/notice checks and root TypeScript check passed."
  - "bun run test with authorized sockets: exit 0, 108 pass/0 fail."
  - "bun run release-check: exit 0, existing 0.6.1 metadata and notices preserved."
  - "Full affected Herdr suite with authorized sockets/PTY: exit 0, 230 pass/0 fail on the committed candidate."
  - "git diff --check and unchanged-assignment SHA-256 check: exit 0."
  - "Canonical handoff validator --repo and final resource/link check: exit 0; all three revision references resolved with no diagnostics."
review: not-run
discoveries:
  - "Direct-spawn fake coverage missed physical canonical terminal input loss; the new regression crosses a real Bash/PTY boundary."
  - "Large launches temporarily prefix the task pane PATH; the bootstrap restores the native PATH and execs the already-probed absolute executable. Private material must survive uncertain or active startup."
  - "Large starts require Bun process.execve and a temp root without the platform PATH delimiter; incompatible preparation fails closed."
blockers: []

# Launch correction handoff

The bounded implementation and assigned local verification are complete on `ruach/c15-instructions`. The source candidate above changes only the authorized Herdr transport/tests/documentation and safe reproducer artifacts. INSTR-01 skills, Tester, specimens/evals, root docs/catalogs/CI/package/release metadata and the agy adapter are untouched. No independent acceptance, integration, delivery or native model session is claimed. This report and unchanged assignment are a later evidence-only commit; its creating SHA is returned externally.

## Intended behavior and supported cause

`LAUNCH-LONG-ARGV` requires the declared route, composed canonical instructions/config, model/effort, permission flags, exact native argument data and effective native environment to survive terminal startup. The original source report is `docs/reports/c1-c5/c2-capability.md` at `5a44779` in the assigned Scout checkout: a 4095-byte unfinished command, Bash foreground only and no named native agent. The recovery-preparation receipt identifies the original selection/role hash and operational recovery, not production verification. Neither private task record nor watcher journal was read or changed; private native identities are not copied here.

The old worker sent full native argv to Herdr, whose [0.9.0 startup implementation](https://github.com/herdrdev/herdr/blob/v0.9.0/src/app/agents.rs) constructs a shell command from the canonical executable and supplied args. Existing fakes directly spawned argv instead of traversing that terminal boundary. Our harmless [canonical-input reproducer](launch-artifacts/canonical-input.ts) actually sent 6000 ASCII bytes through a Linux ICANON PTY; the receiving process read exactly 4095, with distinct independently recorded [input/output hashes](launch-artifacts/canonical-input.json).

The public worker regression then reproduced the failure before correction: a 21180-byte serialized shell command left Bash at a continuation prompt and produced no native argv observation. Replaying the final regression against the exact original worker blob reproduces that result. Baseline and replayed worker blob IDs both equal `6abac3b4cb73cc5f35708ef0bbf1528819939476`; other replay files are explicitly the candidate's PTY fixtures, not a claimed pristine full-baseline checkout.

This demonstrates the dropping mechanism and source exposure at a matching recreated boundary. Historical pane termios were not measured. The released Architect resource was neither accessed nor recreated, and the recovered live Implementer was not disturbed. Actual original-resource/native source-wrapper retesting is therefore still held, as explicitly reserved for the next assignment.

## Implementation and changed files

| Files | Change |
| --- | --- |
| `skills/ruach-herdr/scripts/worker.ts` | Preserve the probed executable; check transport support during source preflight and actual-cwd preparation; use the private bootstrap only for large argv. Existing single named start, readiness, blocked-input, retention and no-retry paths remain. |
| `skills/ruach-herdr/scripts/launch-transport.ts` | Select bootstrap when conservatively shell-quoted argv exceeds 3000 bytes, leaving room below the observed line boundary. Write private JSON data and a tiny executable named for the selected kind. Only filesystem paths enter the shell script; native/user text remains JSON data. |
| `skills/ruach-herdr/scripts/native-launch.ts` | Read prepared data, restore native PATH, then `process.execve` the already-probed absolute executable with complete prepared argv in the same terminal/process group. Withhold raw values on bootstrap failure. |
| `skills/ruach-herdr/tests/fixtures/terminal-start.ts`, `tests/fixtures/fake-cli.ts` | Real canonical Bash/PTY startup fixture, exact native argv/environment observations and pane PATH resolution. The direct-spawn fixture remains for ordinary contracts; no existing assertions were weakened. |
| `skills/ruach-herdr/tests/launch-transport.test.ts`, `tests/worker.test.ts` | Eight focused cases cover independent literal byte/hash oracle, copied scripts, long worker role/config, normal argv, restrictive material, uncertain/blocked retention and incompatible temp-path preflight. |
| `skills/ruach-herdr/SKILL.md`, `references/adapters.md` | Describe the transport, native argv visibility, runtime/path prerequisites and retained material/cleanup contract. No invented native instruction-file flag or permission mapping. |
| `docs/reports/c1-c5/launch-artifacts/canonical-input.ts`, `canonical-input.json` | Harmless physical-boundary reproducer and actual safe observation. No private process/session IDs or production transcripts. |

The corrected long worker regression sends only seven quoted executable-name bytes through the terminal and records the full role/config and pass-through payload at the native process. Expectations come from independently authored inputs and public contracts, not the production quoting algorithm. Cases include spaces, Unicode, quotes, backticks, literal dollar substitution and empty arguments; sentinel files verify user text was not executed. Native model/effort, auto-review, preserved unrelated skill settings, workflow restrictions, config homes, cwd and PATH are checked. A short-argv PTY control retains the direct path. Copied-script execution validates portable helper/path resolution independently of repository layout. These are harmless process/transport results, not native prompt acceptance or product behavior.

## Exact verification receipt

Full output was captured before displaying tails. Retained evidence directory: `/tmp/ruach-launch01-evidence-qPAtkMsT`; `verification.json` records exact commands/cwds/results and log digests; `SHA256SUMS` covers retained files. Existing pinned dependencies were already prepared by INSTR-01, with no dependency change here. Bun is 1.4.2. Unless stated, cwd is `/opt/dev/ruach-worktrees/c15-instructions`.

| Command | Cwd / result | Full log |
| --- | --- | --- |
| `timeout 300s bun test tests/worker.test.ts --test-name-pattern 'long literal native argv'` | Herdr skill / initial sandbox exit 1 before assertions: Unix-socket EPERM; not a reproduction or pass | `before-pty-default.log` |
| Same command with authorized sockets/PTY before source correction | Herdr skill / expected exit 1, no native observation, continuation prompt | `before-pty.log`, `before-pty-observed.log` |
| Same command with authorized sockets/PTY against exact original worker and final fixtures | Evidence `baseline-skill` / expected exit 1, 0 pass/1 regression failure, 21180-byte command | `baseline-replay.log`, baseline/replayed blob receipts |
| `timeout 10s bun docs/reports/c1-c5/launch-artifacts/canonical-input.ts` | Worktree / 0, observed 6000 → 4095 bytes | `canonical-input.json`, `canonical-input.stderr` |
| `timeout 300s bun test tests/launch-transport.test.ts tests/worker.test.ts --test-name-pattern 'canonical PTY\|private argv\|large startup\|long literal\|unrepresentable bootstrap'` | Herdr skill, authorized sockets/PTY / 0, 8 pass/0 fail | `focused.log` |
| `timeout 300s just check` | Worktree / 0 | `check.log` |
| `timeout 300s bun run test` | Worktree, authorized sockets / 0, 108 pass/0 fail | `root-test.log` |
| `timeout 300s bun run release-check` | Worktree / 0 | `release-check.log` |
| `timeout 300s bun test --timeout 30000` | Herdr skill, authorized sockets/PTY / 0, 230 pass/0 fail, 183.63 seconds | `herdr-test.log` |
| `git diff --check d0124e20a078fa3f0cc720679387c485a8e40f7a HEAD` | Worktree / 0 | `diff-check.log` |
| `sha256sum -c /tmp/ruach-launch01-evidence-qPAtkMsT/assignment.sha256` | Worktree / 0, unchanged assignment | `assignment-check.log` |

The earlier full diagnostic suite also passed 230 tests (`herdr-initial.log`), but began before the source commit. Final required checks above ran after the candidate existed. Expected red regressions and the initial socket environment block are retained separately; neither is a failed handed-off correction cycle. The source staging attempt hit shared-gitdir `index.lock` read-only protection and then succeeded with the authorized exact-path escalation; no lock deletion, settings write, trust response or route fallback occurred.

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/launch-fix.md --repo /opt/dev/ruach-worktrees/c15-instructions` exited 0, `ok: true`, all three revisions resolved and no diagnostics (`handoff-validate.log`). `bun scripts/check.ts` including this report exited 0 (`final-resource-check.log`). Mechanical validation establishes structure/revision resolution, not independent acceptance or a live startup result.

## Holds and cleanup expectations

The next separately authorized check must launch the real Codex source wrapper at this exact candidate, preserving the original canonical role/hash, declared route/model/effort, effective permissions, native configuration and selected executable/environment. Record actual command/version/build and verify the expected named native process in the same pane reaches ready or honestly blocked-input state, with full prepared payload intact. No paid model/worker test session was authorized or started here. Independent exact-candidate review follows separately; no self-acceptance or delivery is inferred from local passes.

Large launches need Bun `process.execve` and a temp root representable as one PATH entry. Unsupported preparation fails closed; the bridge does not bypass OS/native argv limits. The task pane's shell retains its private PATH prefix until resource cleanup, while the running native process receives its original pinned PATH. Do not treat that retained shell as a new launch or remove material while startup is uncertain. Actual native startup/config acceptance and the real shell's handling of forwarded environment remain live-check gaps.

Keep the reported `temporary_directory` after working, awaiting-input or uncertain startup. It contains a 0700 root/subdirectory, 0600 `bootstrap/argv.json` and 0700 executable; helper source stays in the selected skill's `scripts/`. The Coordinator releases task sessions/spaces/private material only when reuse ends and evidence is preserved. Existing worktree/branch retention rules remain. Failures before submission still remove only safe unsubmitted private material under the existing contract.

This assignment created no real workers, worktrees, workspaces or servers outside bounded test fixtures. Retained task resources are this assigned worktree/branch/session, the evidence directory (including disposable baseline skill copy), ignored pinned dependencies and the bundled API-schema scratch file `/tmp/ruach-launch-api-schema.json`. Fixture-owned processes/socket/PTY resources were reaped by their tests. No task-resource teardown, merge, push/tag, global installation, publication or retained-consumer changes occurred. No additional ownership amendment is needed; LAUNCH-LONG-ARGV has no completed unsuccessful handed-off correction cycles in this assignment.
