task: C2-AR01-FIX-01
status: complete
outcome: "Corrected short Agy executable binding; exact-candidate focused/full checks and original fixture replay pass. Independent source review, actual native acceptance and delivery remain held."
source_baseline: 1a2b3748cec0477a5dfff7f1bccd0895ad38f5b0
candidate_revision: 4c5defcd13691f9b6754fd0c9bc3fde311e45061
tested_revision: 4c5defcd13691f9b6754fd0c9bc3fde311e45061
prior_adapter_revision: f17e9233ddf00830aa11032bebd9d8df2ff1b0f3
prior_review_revision: 823be77f4e35e73107470d276c0fad2f0f6a4797
accepted_long_argv_revision: f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f
blocking_outcome: C2-AR-01
completed_failed_cycles_before: 1
default_cycle_limit: 2
remaining_cycles_before_handoff: 1
artifacts:
  - docs/reports/c1-c5/c2-executable-fix.md
  - docs/assignments/c1-c5/C2-AR01-FIX-01.md
  - docs/reports/c1-c5/c2-executable-fix-artifacts/public-summary.json
  - docs/reports/c1-c5/c2-executable-fix-artifacts/before-pty.txt
  - docs/reports/c1-c5/c2-executable-fix-artifacts/after-focused.txt
  - /tmp/ruach-c2-ar01-YVZ9wPlA
verification:
  - "Before correction, actual unchanged public-worker Bash/PTY regression: expected exit 1, clean control passes and startup PATH-prepend control selects 1.4.6 while claiming ready/version 1.4.7; all four arguments survive."
  - "Exact candidate focused checks: exit 0, 36 pass/0 fail, including new short Agy and unchanged accepted long/normal controls."
  - "Copies of original review startup helpers: clean/customized controls exit 0, intended recorder and all four arguments retained; customization sentinel preserved."
  - "just check, 110 repository tests and prepared 0.7.0 release-check: exit 0."
  - "Full affected Herdr suite: exit 0, 285 pass/0 fail in 237.82 seconds. Safe evidence, helper/source/metadata integrity checks pass."
  - "Canonical handoff validator --repo: exit 0, six revisions resolved; final resource, artifact checksums, assignment integrity and owned diff checks pass."
review: not-run
discoveries:
  - "Only bootstrap selection needed extending: Agy always uses the existing verified binding, execve payload receipt and foreground proof; other harnesses retain size-based behavior."
  - "Initial regression/setup commands are diagnostic iterations, not completed failed correction cycles; the existing C2 failure count and LAUNCH/MQ histories are unchanged."
blockers:
  - "Independent exact corrected-source review must pass before any actual Agy worker/advisory."
  - "Actual native role/policy/authoritative identity, linked discovery, aggregate budget/ambient visibility, literal brief, skill activation and useful advisory remain unverified."
  - "Final refreshed union review, hosted CI and separately authorized delivery remain open."

# C2-AR-01 executable correction

Candidate and tested source is `4c5defcd13691f9b6754fd0c9bc3fde311e45061`, committed before required final checks. This report, unchanged assignment and safe evidence packet are a later evidence-only commit; its creating SHA is returned externally. No source acceptance, real native acceptance or delivery is claimed.

## Same outcome and immutable evidence

The blocking outcome remains **C2-AR-01** in the existing C2 adapter capability outcome. Initial handed-off `f17e923` failed independent review `823be77f4e35e73107470d276c0fad2f0f6a4797`; its exact `c2-adapter-review.md`, safe packet and raw `/tmp/c2-adapter-review-01-miZYl3` remain immutable. One completed failed cycle is recorded, default limit two, one remaining. This correction awaits independent review; red tests, setup errors and supported socket/PTY remediation do not add or reset cycles. If this handed-off correction fails required source/live verification, the total reaches two: stop normal correction work and return preserved evidence for Architect/authority escalation. No task-record authority or unrelated MQ budget was changed.

The separately accepted LAUNCH-LONG-ARGV history retains its original failure, failed first correction and bounded `f6d9c2c` Codex/Bash acceptance. C2-AR-01 is executable selection with four surviving arguments, not another zero-argument/truncation result; it does not reopen or reset that history. Completed C-IN-01 preparation, safe imports and untagged 0.7.0 metadata remain intact.

## Supported cause, smallest correction and proof

Before correction, the exact-version Agy adapter preflight resolves one executable, but usual four-argument starts bypass the large-only bootstrap and submit the bare kind to the initialized shell. A normal rcfile can prepend another directory and select a distinct unsupported recorder after preflight. The worker then falsely accepts ready/version 1.4.7. The clean control distinguishes startup PATH precedence from argument loss or an incorrect model/role payload.

The new regression first establishes a real persistent Bash/PTY, explicitly writes the PATH-prepending rcfile and a distinct executable that independently reports 1.4.6, then invokes the unchanged public worker. Setup does not depend on whether binding exists. Baseline production comparison is exit 0 before edits. Baseline result is one pass/one fail: the clean shell executes the intended 1.4.7 path; the customized shell executes the 1.4.6 path with all four intended arguments and `customization-retained`, while the worker claims ready/1.4.7. Full red evidence is retained, not reclassified.

Production changes only `needsBootstrap` selection to require the existing bootstrap for **every Agy argv length**, and makes its execve prerequisite diagnostic accurate for short launches. The existing worker and native helper remain unchanged. Existing supported post-initialization shell function, private JSON argv/environment, nonce/hash receipt and foreground process/group proof now apply to short Agy as well as large payloads. The single named native submission, literal four arguments, pinned PATH/config, source/actual-cwd preparation, role hash, inherited permissions, readiness, blocked/uncertain retention and cleanup ownership remain on their existing paths. No padding argument, native effort/permission flag, startup-file removal, second launcher/submission, retry/event policy or new permissions framework was added. Other harnesses' short paths are not claimed fixed.

Both corrected regression controls execute the intended 1.4.7 path with exact authored argv, source role/config/model/inherit checks, unchanged rcfile and preserved customization. Independently copied, byte-identical original review `startup-probe.ts`, `run-startup.ts` and `common.ts` also pass in new scratch: the candidate alias points to this existing revision; original files/evidence are untouched. Assertions additionally check actual expected fixture executable, version, literal argv, restored PATH/home/inherit and original helper hashes; collector exit 0 alone is not treated as acceptance. All programs are harmless local recorders; no actual Agy/model inference or native role acceptance occurred.

Added public-worker failure controls cover missing/lost binding, missing/foreign receipt, wrong foreground group on both ready and blocked outcomes, setup/marker failure without submission, all three missing Herdr binding/inspection primitives and missing execve before mutation, late capability failure after actual-checkout creation, and retained additive/bootstrap material. Existing normal short Codex and accepted long-argv tests are unchanged. Expected versions, executable paths, rcfile, four arguments and preservation values are authored independently of production serialization; the fixture preserves real shell selection.

## Changed paths and protected source

Within `skills/ruach-herdr/`, five source-candidate paths changed: `scripts/launch-transport.ts`, `tests/agy.test.ts`, `tests/fixtures/fake-cli.ts`, `SKILL.md` and `references/agy.md`. The sixth path is the single C2 status paragraph in `docs/roadmap.md`. The fake adds Agy version observation and scoped capability-failure controls; one existing mutation expectation now includes binding. The roadmap records rejection/correction/review holds without rewriting historical handoffs or other outcomes. No configured formatter exists; new handwritten code follows the project's readable multiline conventions.

The exact six-path diff proves all other source remains unchanged from `1a2b374`. In particular `worker.ts`, `native-launch.ts`, `launch-transport.test.ts` and the three persistent-terminal fixtures remain byte-identical to `f6d9c2c`. `worker.test.ts` is unchanged from this assignment's baseline, and its complete accepted long-argv regression block matches `f6d9c2c`; the original C2 removal of Agy from two obsolete gated-adapter loops remains separate. Adapter exact 1.4.7/help/catalog/role/size/conflict gates, catalogs/Scout alternative/permissions, all roles/other skill bodies, root metadata/release notes, C-IN evidence and product/runtime/MQ resources remain protected. No main/retained-consumer/global settings or discovery-link edit occurred.

## Exact checks and remaining gates

Evidence root is `/tmp/ruach-c2-ar01-YVZ9wPlA`; full logs and explicit exit receipts precede displayed tails. Worktree cwd is `/opt/dev/ruach-worktrees/c15-instructions`; skill cwd is its `skills/ruach-herdr`. Exact commands/cwds/exits/log SHA-256 values and original-control/helper comparisons are recorded in [public-summary.json](c2-executable-fix-artifacts/public-summary.json); safe full [before](c2-executable-fix-artifacts/before-pty.txt) and [after](c2-executable-fix-artifacts/after-focused.txt) focused logs accompany it. Raw fixture process/private material stays in scratch, without native IDs/raw global context/credentials in release artifacts.

| Command | Cwd / result | Private receipt |
| --- | --- | --- |
| `timeout 120s bun test --timeout 30000 tests/agy.test.ts --test-name-pattern 'C2-AR-01:'` | Skill, authorized sockets/PTY / expected 1, one pass/one fail before production edits | `before-pty.log`, `.exit` |
| `timeout 120s bun test --timeout 30000 tests/agy.test.ts` | Skill, authorized sockets/PTY / initial corrected iteration 0, 44 pass/0 fail | `after-agy-initial.log`, `.exit` |
| `timeout 300s just check` | Worktree / 0 | `check.log`, `.exit` |
| `timeout 300s bun run test` | Worktree, authorized sockets / 0, 110 pass/0 fail; routing covered | `root-test.log`, `.exit` |
| `timeout 300s bun run release-check` | Worktree / 0, prepared 0.7.0 unchanged | `release-check.log`, `.exit` |
| Focused three-file command and explicit pattern in safe summary | Skill, authorized sockets/PTY / 0, 36 pass/0 fail | `focused.log`, `.exit` |
| `timeout 600s bun test --timeout 30000` | Skill, authorized sockets/PTY / 0, 285 pass/0 fail, 237.82 seconds | `herdr-test.log`, `.exit` |
| `timeout 120s bun /tmp/ruach-c2-ar01-YVZ9wPlA/run-startup.ts corrected-customized` and `clean` | New scratch / 0 each; assertions compare original controls to required contract | `original-customized.log`, `original-clean.log`, exits and helper command receipts |
| `timeout 120s bun /tmp/ruach-c2-ar01-YVZ9wPlA/safe-evidence.ts` | Worktree / 0, seven passing final command receipts, two original controls, exact helper/source and privacy checks | `safe-evidence.log`, `.exit` |
| `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/c2-executable-fix.md --repo /opt/dev/ruach-worktrees/c15-instructions` | Worktree / 0, six existing revisions resolve, no diagnostics | `handoff-validate.log`, `.exit` |
| `bun scripts/check.ts` | Worktree / 0, final report and artifact links included | `final-resource.log`, `.exit` |
| `sha256sum -c SHA256SUMS` | Safe artifact directory / 0, all three files match | `artifact-integrity.log`, `.exit` |
| `sha256sum -c /tmp/ruach-c2-ar01-YVZ9wPlA/assignment.sha256`; `git diff --check`; `git diff --check 1a2b3748cec0477a5dfff7f1bccd0895ad38f5b0 HEAD` | Worktree / 0 each | Original assignment receipt; final owned/staged checks |

The initial checksum setup used a repository-relative assignment path from the skill cwd and failed; its empty receipt and diagnostic are retained separately. It was corrected to the absolute assignment path, without editing the assignment. The production comparison was repeated from repository cwd before edits to avoid a vacuous skill-relative path selection. The first evidence-helper audit also exited 1: it overbroadly compared the whole `worker.test.ts` to f6, although original C2 already changed two unrelated loops. That original helper/log/exit remains `safe-evidence-initial.*`. The corrected audit compares the whole file to the current baseline and separately proves the accepted long block unchanged from f6. Because the first audit stopped before artifact creation, an initial final-resource check found the three missing artifact links (`final-resource-initial.*`); those links resolve after successful evidence creation. No production/test change or broad-suite rerun was needed for either helper issue. No behavioral failure besides the intended baseline red occurred in the initial corrected Agy or final completed checks; no registered flake/retry was invoked. Existing pinned dependencies were reused. No current native help/catalog refresh was needed or performed.

Independent exact corrected-source review remains mandatory before any real Agy launch. Native full role inlining under the aggregate rule budget, inherited permission/authoritative identity, intended skill source under actual ambient/declared/plugin precedence, preserved consumer/built-in context, linked behavior, literal brief reading, skill activation and useful advisory evidence remain held. No global workflow absence or Agy watcher/continuation support is claimed. Final C-IN union refresh/review, hosted CI and separate authorized delivery/publication/install remain open; no broader acceptance follows from local transport checks. Preserve this worktree/branch/session, all private evidence and original review resources. No task-resource cleanup, actual native/model/trust/account operation, merge/tag/push/install or delivery occurred; only fixture-owned terminals/recorders use their existing test cleanup.
