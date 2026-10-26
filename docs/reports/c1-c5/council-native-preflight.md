task: C1-NATIVE-PREFLIGHT-01
status: complete
outcome: Direct-host native preflight reached a new executable-visibility failure; stopped at A before any marker loop or model session.
artifacts:
  - docs/assignments/c1-c5/C1-NATIVE-PREFLIGHT-01.md
  - docs/reports/c1-c5/council-native-preflight.md
candidate_revision: a51f414a91ecaa71e41ba5a753a9b0f7f5c51593
verification:
  - "Installed Codex 0.164.0 help/version and documented no-server startup metadata inspected."
  - "Exactly one authorized direct-host execution; first native sandbox command exited 1 before Python."
  - "A/B pair and hardlink contamination control not completed; own-output write/read and peer-read denial not established."
  - "Thirteen existing fixture/resource paths hashed before/after; all original bytes and recorded metadata unchanged."
  - "Native executable exists on host, mode 0755, UID 1000, static PIE, matching the previously inspected binary SHA-256."
review: not-run
discoveries:
  - Native Bubblewrap reports execvp of the Codex binary path as ENOENT inside the restricted view, despite the host executable existing.
  - The minimum profile grants role/input/output access but does not explicitly grant the native executable path outside the minimal system roots.
  - Startup metadata exposes managed-requirement metadata rather than a complete enabled app/plugin/tool inventory.
blockers:
  - Native helper executable visibility needs a separately reviewed exact runtime-file grant and verification; no second direct-host attempt is authorized here.
  - Whole-member native account/customization/auto-review and parent/tool/app/MCP/daemon exclusion remain unverified.
scratch: /tmp/c1-native-preflight-01.iYUSr0
native_version: codex-cli 0.164.0
native_marker_pair: not-run-to-completion
independence_claim: held

> Editorial portability view: machine-local evidence locations are literal paths. [Original snapshots and curation provenance](../releases/0.7.0/ci-portability.md) remain available; historical findings are unchanged.

The bounded follow-up is complete under the unchanged [assignment](../../assignments/c1-c5/C1-NATIVE-PREFLIGHT-01.md). **Keep C1 native independence held.** The changed direct-host route advanced to a different native setup error; no positive/negative marker result was obtained. This is neither a passing native marker pair nor a universal statement that native isolation is impossible.

No model/worker/council session, inference, security-dialog answer, source correction, global configuration/permission/trust/discovery change, merge/push, delivery or task-resource teardown occurred. Completed music/prototype source/build/state artifacts were not rerun or modified. Earlier failures and OS controls remain intact in the [prior report](council-isolation.md) and `/tmp/c1-isolation-01.IEPMA3`.

## Inspected native and profile facts

Worktree baseline: `a51f414a91ecaa71e41ba5a753a9b0f7f5c51593`. `codex --version` returned `codex-cli 0.164.0`. Its actual resolved binary remains `$HOME/.codex/packages/standalone/releases/0.164.0-x86_64-unknown-linux-musl/bin/codex`; SHA-256 `b93f6811d3f653f0fb83be4050d857fb9abbb111dfa2ce160563327daff7f306`. Host `stat`, `file`, and `sha256sum` exited 0: regular executable, mode 0755, UID 1000, 308,139,304 bytes, ELF x86-64 static PIE. Their full output is retained as `R/binary-{stat,file,sha256}.stdout`, where `R=/tmp/c1-native-preflight-01.iYUSr0`.

Native `codex sandbox --help` confirms the previously documented `-P/--permission-profile`, `-c`, `-C` and `--include-managed-config` interface. No guessed RPC, socket flag, opaque sandbox-state object or unsupported strict-config flag was used. The same on-request/auto_review values and explicit managed-requirement inclusion were retained. Neither CODEX_HOME nor HOME was redirected; no account credentials, user customization files or real peer stores were copied or read by the marker loop.

The supported `timeout 120 codex app-server --print-startup-config`, cwd this Ruach worktree, exited 0 without starting an app server. A small metadata helper immediately selected non-secret structure/settings metadata and discarded the raw stdout, retaining its SHA-256, exit and original stderr in startup-metadata.json (`/tmp/c1-native-preflight-01.iYUSr0/startup-metadata.json`). It exposed top-level `appServerVersion` and `configRequirements`; the latter has `supportsIndependentSpeedModes` and `requirements`. This is not an effective enabled app/plugin/MCP/tool inventory. No session enumeration, daemon query, model turn or credential inspection was used to fill that gap. Help/metadata emitted the existing read-only PATH-alias warning in the restricted read-only check; no setting was changed to suppress it.

## Single direct-host execution

Authorized escalation, cwd this Ruach worktree:

```sh
timeout --signal=TERM --kill-after=5 120 \
  bun /tmp/c1-native-preflight-01.iYUSr0/direct.ts \
  > /tmp/c1-native-preflight-01.iYUSr0/direct.stdout \
  2> /tmp/c1-native-preflight-01.iYUSr0/direct.stderr
```

This was a **direct host-capability exec**. It did not reuse the prior outer read-only Bubblewrap wrapper or the prior unprivileged private-/tmp route. Native code could perform its ordinary authorized `/tmp` lock/mount-target operations. The only explicitly changed runtime environment values were `TMPDIR=R/tmp` and `XDG_RUNTIME_DIR=R/runtime`; both task directories were created mode 0700. There was no global socket-mode, shared registry permission, sysctl, service or managed-requirement change. Environment values other than these paths were inherited without dumping them.

The helper (`/tmp/c1-native-preflight-01.iYUSr0/direct.ts`) constructs A, then B, then the scoped hardlink-contamination control, stopping at the first native setup failure. It actually executed only A. The native argv, cwd, explicit environment, timestamps, native PID/UID and exit are retained in commands.jsonl (`/tmp/c1-native-preflight-01.iYUSr0/commands.jsonl`) and result.json (`/tmp/c1-native-preflight-01.iYUSr0/result.json`). Every native child has its own `timeout --signal=TERM --kill-after=5 120` bound. The direct helper and native A both exited 1; no outer-runner exit is relabelled as a native success.

A's native command used the inspected absolute binary, `sandbox --include-managed-config -P c1_native_a`, four `-c` overrides shown below, `-C /tmp/c1-isolation-01.IEPMA3/a/out`, then `-- /usr/bin/python3 -c READ_LOOP`. Exact argv and actual inline loop are native-a-exact-input.argv.json (`/tmp/c1-native-preflight-01.iYUSr0/native-a-exact-input.argv.json`). Exact profile bytes are native-a-exact-input.toml (`/tmp/c1-native-preflight-01.iYUSr0/native-a-exact-input.toml`):

```toml
approval_policy="on-request"
approvals_reviewer="auto_review"
[permissions.c1_native_a.filesystem]
":minimal"="read"
"/tmp/c1-isolation-01.IEPMA3/inputs/question.txt"="read"
"/tmp/c1-isolation-01.IEPMA3/a/out"="write"
"/opt/dev/ruach/agents/scout.md"="read"
"/opt/dev/ruach/skills/ruach-handoff/SKILL.md"="read"
[permissions.c1_native_a.network]
enabled=false
```

The filesystem scope is the prior minimum A profile, under a fresh profile name; no broader root, session-store or native-home grant was added. No `never`, bypass or auto-review-disable setting was used.

## Actual result and stopping condition

Native stdout is empty. Its stderr is one Bubblewrap launch failure, with the absolute native binary path (the path above) followed by:

```text
bwrap: execvp <inspected absolute Codex binary>: No such file or directory
```

The full original bytes are preserved in native-a-exact-input.stderr (`/tmp/c1-native-preflight-01.iYUSr0/logs/native-a-exact-input.stderr`); stdout is native-a-exact-input.stdout (`/tmp/c1-native-preflight-01.iYUSr0/logs/native-a-exact-input.stdout`). The error names **Codex itself**, not the Python marker input or a peer marker. No read, own-output write, peer-output write or contamination result was produced. No command timed out.

Unlike earlier attempts, this execution did not emit the socket-directory ownership error, shared-/tmp lock panic or NETLINK_ROUTE error. That is observed progress to another setup boundary, not proof of a generally working route. The executable is present and executable on the host and is static PIE. The profile does not explicitly expose its package path inside the restricted view. The most direct explanation is exclusion of the native executable needed for sandbox self-execution; the exact native mount dependency has not been proven by a corrected run. Do not report ENOENT as successful peer exclusion, or as evidence that the host binary is missing.

Per the single-execution/stop gate, the helper stopped immediately. B and the hardlink-contamination command were **not executed**, and their success cannot be inferred from the earlier OS-only experiment. No second escalation or alternate toolchain/route was attempted. A newly broadened profile was not tried to obtain a green result.

## Existing controls and preservation

The planned loop reuses all prior harmless existing marker paths: original input; A/B answers; shared report copy; synthetic native transcript, state and memory paths; plugin/full-repository cache copy; object-store-shaped marker; and symlink/hardlink aliases. It also reads the exact canonical Scout and technical handoff skill. It would create/read only a new own-output probe file and attempt a separate peer-output probe file; neither write ran. No existing marker or real peer file was a write target.

Before native execution, the host helper read/stat/hashed all thirteen existing marker/resource paths. After the failed native command, it repeated those reads. fixtures-before.json (`/tmp/c1-native-preflight-01.iYUSr0/fixtures-before.json`) and fixtures-after.json (`/tmp/c1-native-preflight-01.iYUSr0/fixtures-after.json`) match exactly, including UID, size and SHA-256. This confirms existing-path controls and original-byte preservation; it does **not** establish their visibility/denial inside the unstarted native marker loop. The prior hardlink contamination result remains an OS-only warning against broadly readable input directories, not a newly executed native counter-control.

## Exact remaining prerequisite and scope of future claims

The smallest next source/member resource decision is a separately reviewed **exact native runtime-file read grant**, beginning with the inspected static Codex executable path, in both minimal member profiles. It is executable runtime code outside the minimal system roots, not an input answer or account directory. The grant would use the already documented absolute-path filesystem entry; do not broadly expose `$HOME`, CODEX_HOME, its package parent or session/cache stores. A future assignment must verify any additional concrete native runtime dependencies from errors, not assume this one grant fixes everything. This follow-up did not implement or test that profile change, and its one direct-host execution is exhausted.

After an authorized runtime prerequisite is met, the real native A/B pair must read the allowed input and exact role/technical files, write/read only its own output, fail harmless reads of existing peer/alternate markers, reject peer writes, and execute the contamination counter-control under the same effective member permissions. Full argv/profile bytes, actual native exits, native read results and unchanged originals must be recorded. A loaded TOML table or an outer helper's exit is insufficient.

Even a passing pair would establish **native command** restrictions, not a native-independent council member. On-request/auto_review are present in this attempted configuration, but no model approval decision, authenticated turn or native customization injection was exercised. The original native account context was not replaced; its correct propagation through an actual restricted member remains unverified. No claim of member equivalence follows from leaving account paths unchanged.

The distinct whole-member hold includes native parent filesystem/search tools, app/plugin/MCP access, shared native session/history daemon APIs, memory/state stores, caches, inherited descriptors and any answer bytes already present in authorized inputs. Enabled effective surfaces could not be inventoried from the supported no-server requirements output; no real peer stores or sessions were inspected to compensate. A future reviewed member setup must either demonstrate exclusion across its actual enabled surfaces or narrow them with explicitly authorized supported controls while preserving account, role, technical input and automatic-review requirements. Do not silently disable connected services, change home/account binding, copy credentials or claim that a child-only filesystem profile controls the parent and remote tools.

Answers still belong in separately inaccessible per-member first-round output stores. The Coordinator collects sealed round-one answers outside both member views and makes any shared collection visible only for a later authorized round. This investigation authorizes neither those members nor a private-home/account-binding implementation. It reports a concrete new runtime prerequisite and keeps whole-member independence held.

## Report verification

Owned repository writes are only this report and the unchanged assignment. Raw evidence is under R; prior raw failures and product baselines remain retained. No unrelated suite was run. Assignment SHA-256 was rechecked as `fa4fa04759f739abd89afd16702af47d09ebf1c196b9b6bcab5d81fc18328e06`.

Executed report checks, cwd this Ruach worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-native-preflight.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, candidate base resolved, no diagnostics.
- `git diff --cached --check -- docs/assignments/c1-c5/C1-NATIVE-PREFLIGHT-01.md docs/reports/c1-c5/council-native-preflight.md`: exit 0. Staged scope contains exactly the unchanged assignment and this report.
- A read-only Bun check of this report's Markdown file-link destinations found 12 links and no missing targets (exit 0).

The creating SHA is returned externally and is not predicted in this report.
