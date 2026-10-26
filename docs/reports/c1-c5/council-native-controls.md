task: C1-CONTROLS-01
status: complete
outcome: Native A/B filesystem controls passed after one exact executable grant; whole authenticated member isolation remains held.
artifacts:
  - docs/assignments/c1-c5/C1-CONTROLS-01.md
  - docs/reports/c1-c5/council-native-controls.md
candidate_revision: 51ad27f244df6e92de9adde481b47249522aa734
verification:
  - "Codex 0.164.0 executable rehashed against prior evidence; the sole added runtime grant is that exact read-only file."
  - "Four actual native sandbox commands exited 0 with read/write JSON and empty stderr; no setup retry was needed."
  - "Strict A/B each read question, own marker, canonical Scout and technical skill; nine excluded reads and direct peer-output writes failed with errno 2."
  - "Unmasked host controls and exact peer-file grant establish that the excluded markers existed and were readable when authorized."
  - "Native contaminated-input directory control exposed the existing peer-answer hardlink."
  - "Independent authored-control verification exited 0 with 41/41 checks; all thirteen original fixture/resource byte digests unchanged."
review: not-run
discoveries:
  - Native command filesystem exclusion is now observed, rather than inferred from profile syntax or an outer wrapper.
  - Native exclusion hides paths with ENOENT in these views; existing-file and exact-grant controls distinguish this from missing test data.
  - An authorized peer-file read control allowed a namespace-only sibling write; no corresponding host output file persisted.
  - Current Ruach Codex adapter pass-through does not accept config/profile selectors; actual member launch composition is unverified.
blockers:
  - Whole-member parent/tools/apps/MCP/daemon access and account/customization/automatic-review equivalence remain unverified.
  - A separately reviewed supported per-run member-launch composition is required; no model session is authorized by these controls.
scratch: /tmp/c1-controls-01.FXfAt0
native_version: codex-cli 0.164.0
native_command_controls: passed
whole_member_independence: held

> Editorial portability view: machine-local evidence locations are literal paths. [Original snapshots and curation provenance](../releases/0.7.0/ci-portability.md) remain available; historical findings are unchanged.

This completes the scoped controls in the unchanged [assignment](../../assignments/c1-c5/C1-CONTROLS-01.md). **The native command boundary now passes. A whole Codex member's independent first round is not yet established.** This continues the same investigation; [original OS/native failures](council-isolation.md) and [the direct-host executable failure](council-native-preflight.md) remain original evidence, not retroactive passes. No model/worker/council/inference, source correction, global configuration/permission/trust/discovery change, delivery, merge/push or task teardown occurred.

## Exact runtime change and invocation

Worktree baseline: `51ad27f244df6e92de9adde481b47249522aa734`. Inspected canonical Ruach implementation: `/opt/dev/ruach` at `2b693cd72bf39c29575841a88d9c7ae719a29715`. No implementation/test/configuration files changed.

`codex --version` remains `codex-cli 0.164.0`. The same static executable at `$HOME/.codex/packages/standalone/releases/0.164.0-x86_64-unknown-linux-musl/bin/codex` was rehashed: `b93f6811d3f653f0fb83be4050d857fb9abbb111dfa2ce160563327daff7f306`, matching both earlier reports. The **only added runtime read grant** is this exact file. No broader package parent, HOME, CODEX_HOME, credential, shared-report, session or cache grant was added. No additional library grant or runtime-file iteration was necessary.

Runtime grant bytes/reason/hash are runtime-grants.json (`/tmp/c1-controls-01.FXfAt0/attempt-01/runtime-grants.json`). Raw evidence is under `R=/tmp/c1-controls-01.FXfAt0`; existing harmless fixtures remain under `S=/tmp/c1-isolation-01.IEPMA3`.

The authorized direct-host execution, cwd this Ruach worktree, was:

```sh
timeout --signal=TERM --kill-after=5 120 \
  bun /tmp/c1-controls-01.FXfAt0/controls.ts attempt-01 \
  > /tmp/c1-controls-01.FXfAt0/attempt-01.runner.stdout \
  2> /tmp/c1-controls-01.FXfAt0/attempt-01.runner.stderr
```

It requested actual host socket/process/netlink/temp capability through the supported per-command approval path. No approval rejection occurred. There was no outer read-only namespace workaround or repeated unchanged failure. Native-managed temporary locks/mount targets under `/tmp` remained native runtime operations; no global mode, service, sysctl or managed requirement was changed.

Only explicit environment changes: `TMPDIR=R/tmp`, `XDG_RUNTIME_DIR=R/runtime`, task-owned directories created mode 0700. HOME, CODEX_HOME, account and existing customization roots were inherited. Each child was independently bounded by `timeout --signal=TERM --kill-after=5 120`; all completed in approximately 0.1 seconds, with no timeout.

Native argv for each case uses the verified absolute binary, `sandbox --include-managed-config -P PROFILE`, `-c 'approval_policy="on-request"'`, `-c 'approvals_reviewer="auto_review"'`, the inline filesystem table, `-c 'permissions.PROFILE.network.enabled=false'`, `-C S/MEMBER/out`, then `-- /usr/bin/python3 -c READ_WRITE_LOOP`. Full exact argv, profile bytes and original stdout/stderr are retained per case:

- A strict profile (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-strict.toml`), argv (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-strict.argv.json`), native output (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-strict.stdout`).
- B strict profile (`/tmp/c1-controls-01.FXfAt0/attempt-01/b-strict.toml`), argv (`/tmp/c1-controls-01.FXfAt0/attempt-01/b-strict.argv.json`), native output (`/tmp/c1-controls-01.FXfAt0/attempt-01/b-strict.stdout`).
- Exact peer-file grant control (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-exact-peer-grant.toml`), argv (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-exact-peer-grant.argv.json`), native output (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-exact-peer-grant.stdout`).
- Contaminated-input control (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-contaminated-input.toml`), argv (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-contaminated-input.argv.json`), native output (`/tmp/c1-controls-01.FXfAt0/attempt-01/a-contaminated-input.stdout`).

Strict A/B tables grant `:minimal=read`, the exact `S/inputs/question.txt=read`, only `S/a/out=write` or `S/b/out=write`, the exact `/opt/dev/ruach/agents/scout.md=read`, exact `/opt/dev/ruach/skills/ruach-handoff/SKILL.md=read`, and the verified native executable file `=read`. A/B differ only in member/profile/output identities and authored output text. The same read/write loop and runtime grant apply symmetrically. There is no bypass, `never`, disabled reviewer, removed managed configuration or broader account-directory grant.

## Native results and independent controls

These are **actual native child** results, not an outer runner's success. All four native commands exited 0, emitted parseable read/write JSON and had empty stderr. Host UID and child UID were 1000. commands.jsonl (`/tmp/c1-controls-01.FXfAt0/commands.jsonl`) records full argv/cwd/environment/timestamps/exits; result.json (`/tmp/c1-controls-01.FXfAt0/attempt-01/result.json`) retains observed JSON.

| Case | Native PID / exit | Decisive observation |
| --- | --- | --- |
| A strict | 592261 / 0 | Question, own original marker, real Scout and technical skill read; own new output written/read and present on host. Nine excluded reads and direct peer-output write failed with `errno=2`. |
| B strict | 592302 / 0 | Same results with A/B ownership reversed. |
| A exact peer-file read grant | 592343 / 0 | Adding only `S/b/out/answer.md=read` reveals the original B marker. Other alternate locations/aliases remain excluded. This is an existence control, not an independent-member profile. |
| A contaminated input directory | 592384 / 0 | Replacing exact question-file read with `S/inputs=read` reveals the B answer through the existing hardlink; direct B path and symlink remain excluded. This intentionally fails answer exclusion. |

Strict positive question content was the independently authored `C1_ALLOWED_INPUT\n`, and own-output contents were authored `C1_HARMLESS_NATIVE_OUTPUT_a\n` or `_b\n`. Assertions do not derive expected reads from production profile implementation. Canonical role/technical reads access the real source files rather than placeholder documents.

Nine strict excluded paths in each actor view: the other actor's `out/answer.md`; `repo/docs/reports/member-b.md`; `native-home/sessions/2099/01/01/rollout-peer.jsonl`; `native-home/state_5.sqlite`; `native-home/memories/peer.md`; `cache/plugins/full-repo/member-b.md`; `repo/.git/objects/peer-marker`; and both `inputs/peer-symlink` and `inputs/peer-hardlink`. These are harmless synthetic markers in plausible storage shapes, not real native databases/transcripts. Each negative read was ENOENT because the path was hidden in that native view. We did not demand or fabricate EACCES.

Unmasked host reads/stat/hash of all thirteen original marker/resource paths succeeded before and after native execution. The exact peer-file control then made that same authored B marker readable through the native command. Together, these controls establish view exclusion of **existing** data, not a failed lookup of nonexistent test files. Strict direct peer-output writes also failed with ENOENT, and no corresponding host files were present. Own-output reads/writes succeeded and their new harmless text persisted only in the authorized own-output directories.

There is an additional observed distinction in the **deliberately broader exact peer-file control**: the child could create/read a new sibling filename at the displayed peer-output path, but that sibling file was absent on the host after the command exited. The existing peer answer stayed unchanged. This is consistent with namespace-only synthetic parent storage, but its mechanism was not separately traced. It is not reported as a strict-profile denial, a persistent peer write, or a consumer defect. Do not generalize these controls to all possible namespace scratch writes merely from path spelling. verification.json (`/tmp/c1-controls-01.FXfAt0/verification.json`) records native success and host absence separately.

`timeout 120 bun R/verify.ts`, cwd this worktree, exited 0 with **41/41 authored checks**: original existence/preservation, strict visibility, exact positive marker bytes, own persisted output, failed peer writes, the exact-grant control and native hardlink exposure. The raw checker output (`/tmp/c1-controls-01.FXfAt0/verify.stdout`) and checker source (`/tmp/c1-controls-01.FXfAt0/verify.ts`) remain separate from the native implementation. No unrelated test suite or product command was run.

## Preserved evidence and source authority

Host before (`/tmp/c1-controls-01.FXfAt0/attempt-01/host-existence-before.json`) and host after (`/tmp/c1-controls-01.FXfAt0/attempt-01/host-existence-after.json`) match for all thirteen original paths, including UID, byte count and SHA-256. This includes both original answers and the hardlink/symlink targets. Only new harmless own-output probe files were added; no original marker/output/log was overwritten.

Selected original digests:

| Original input/resource | SHA-256 |
| --- | --- |
| `S/inputs/question.txt` | `ac5ec6f3e950f03e6e0184106e0a3bccbbf3192587992c19030633c97fe631c5` |
| `S/a/out/answer.md` | `a1f80f54dde54b09f5b6a57506e787d485d508627ececee8db479f971623ed9b` |
| Canonical Scout | `750eb21d2dc8e11bd7008207fba8d88d5744b789f7d646d939b50c1657db4376` |
| Canonical handoff skill | `59e43c30321167aceaf5b59837db1c5e114c48f4d23bd340c5aa579957569445` |

Evidence digests (`/tmp/c1-controls-01.FXfAt0/evidence-digests.json`) additionally identify the prior socket/lock/netlink/executable errors, earlier OS controls and current native outputs. Prior-log hashes were observed now; they are not falsely presented as an earlier before/after audit. Those original files were never write targets. The earlier missing-native-executable failure remains a failed preflight; only the scoped exact-file amendment produced these new passing command controls. No engineering correction cycle or architecture requirement is inferred from the earlier helper/setup failures.

## Actual-member boundary and smallest next setup

**One member's command-side filesystem prerequisite is feasible on this native build. A supported complete authenticated member launch that also excludes every enabled answer-access surface is not yet demonstrated.** The successful commands used real native permission enforcement, but are still Python children rather than model sessions. Profile bytes preserve on-request/auto_review settings; they do not prove an actual reviewer decision, authenticated model/account use, role injection or customization preservation during a member turn. Reading canonical Scout/technical files is only the resource-access control, not proof those instructions were injected into a model.

Relevant access-surface metadata, without secrets or peer-session enumeration:

- `codex mcp list --json`, cwd this worktree under the ordinary restricted environment, exited 0 and returned no configured servers. This does not establish that a future member has no injected tools, apps or plugin MCPs.
- `codex plugin list --json` exited 0 with `installed`/`available` top-level structure, but warned that its remote installed-plugin catalog request failed. The safe metadata collector did not retain raw plugin records or credentials; no complete enabled-plugin inventory is claimed. No escalation or retry was used for that partial catalog.
- The prior supported no-server startup metadata exposed requirements, not a full effective enabled-surface inventory. No app server/session/daemon was queried to fill that gap. Native parent tools, apps/MCP, shared session/history APIs, memories/cache, inherited descriptors and answer copies inside already authorized inputs remain distinct whole-member paths requiring assessment.

Exact commands/exits and selected non-secret fields are configured-mcp.metadata.json (`/tmp/c1-controls-01.FXfAt0/configured-mcp.metadata.json`), installed-plugins.metadata.json (`/tmp/c1-controls-01.FXfAt0/installed-plugins.metadata.json`) and `R/metadata-commands.jsonl`. Raw metadata stdout was hashed and discarded; there was no credential dump or automatic change to global connected services.

There is also a concrete **launch composition** gap in the unchanged Ruach source. `skills/ruach-herdr/scripts/adapters/codex.ts` preserves existing developer text/skill settings, adds the assigned canonical role and explicit selected model, and emits `--approve-for-me` for auto-review. `scripts/adapters/index.ts::validatePass` admits only its small Codex flag allowlist; `-c/--config`, `-P`, `--permission-profile` and config-profile selection are outside that pass-through surface. Under auto-review, native sandbox/approval overrides are also rejected. Therefore these successful `codex sandbox -P ...` invocations cannot simply be forwarded through the current worker launcher. No launcher/dry-run/worker was executed or changed to bypass that policy. Inspected adapter SHA-256 values are `25dfbfb5ea09155f647675e1f89f545cb15b768e90cfe854d657620527eec2f3` and `fa877caa627edafe4138ed07e6b09cc85270b731e31563c9996f440cff681eaa` respectively.

The smallest next assignment is a bounded review of the **per-run native member launch composition and effective surfaces**, before authorizing inference. It must retain the explicit selected model, canonical assigned role, required technical resources, existing developer/customization context, native account binding and automatic review, while selecting the tested member-specific read profile. Verify the final effective profile rather than assuming `--approve-for-me` and a custom profile compose correctly. Use a supported native configuration mechanism accepted by the authorized launcher, or obtain a separately assigned narrow launcher change/launch-route decision; do not silently add a new profile API or bypass its argument checks.

Give the member a clean reviewed question/input snapshot plus only required technical/runtime files, its own writable output store, and no complete shared repo/plugin/session/cache bundle containing answers. A broad allowed input directory is conclusively unsafe when it contains a peer hardlink. Extend the same harmless positive/negative controls to **all actual enabled answer-access tools**, including parent/native daemon/app/MCP paths, before claiming whole-member exclusion. A smaller connected-tool surface or altered environment may be proposed with exact differences, but requires explicit review; do not disable global customizations or replace/copy the account to manufacture equivalence.

Seal each first-round answer in its inaccessible member output store. The Coordinator collects it from outside both member views after first-round completion and publishes any shared answers only for the later authorized round. This report authorizes no actual member, model or council; it removes the concrete native executable prerequisite and supplies passing native command controls for that later decision.

## Handoff verification and retention

Only this report and the unchanged assignment are owned repository writes. All profiles, helper sources, marker results, safe metadata and raw stdout/stderr are retained under R/S. Earlier evidence and completed product sources/builds/state are unchanged by this task. No cleanup or unrelated suite was run.

Assignment SHA-256: `c2a7dee10dc13430905e5fa8935ec971f3f39dd150bb5a55771022e8a0462f0a`, rechecked unchanged. Report checks, cwd this Ruach worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-native-controls.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, candidate revision resolved, no diagnostics.
- `git diff --cached --check -- docs/assignments/c1-c5/C1-CONTROLS-01.md docs/reports/c1-c5/council-native-controls.md`: exit 0; staged scope contains exactly the unchanged assignment and this report.
- Read-only Bun validation of the report's 26 Markdown file-link destinations: exit 0, no missing targets.

The creating SHA is returned externally, never predicted in the report.
