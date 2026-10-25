task: C1-ISOLATION-01
status: complete
outcome: OS namespace marker exclusion demonstrated; equivalent native Codex member isolation remains unverified and must not be claimed.
artifacts:
  - docs/assignments/c1-c5/C1-ISOLATION-01.md
  - docs/reports/c1-c5/council-isolation.md
candidate_revision: 56540a6868f771f605dbff8a52d8c7c3d371a623
verification:
  - "Codex 0.164.0 native help and generated experimental protocol schema inspected without inference."
  - "Bubblewrap 0.12.0 and util-linux unshare 2.41.5 namespace startup probes exited 0."
  - "Two OS member views each read allowed input, own marker, canonical Scout and technical skill; nine alternate/peer reads returned EACCES."
  - "Unmasked control read all thirteen paths; contaminated-input control exposed a peer hardlink as intended."
  - "Native sandbox probes failed before marker execution; original errors and the single escalation are retained."
review: not-run
discoveries:
  - Native CLI supports named per-run filesystem profiles and managed-requirement inclusion, but their enforcement was not demonstrated here.
  - A broad input directory containing a peer-answer hardlink defeats scoped output-path exclusion.
  - A child command namespace is not proof that the native harness, plugins or shared session daemon cannot obtain peer answers.
blockers:
  - Native sandbox startup remains blocked by socket/temp/network-namespace setup; no native member positive/negative pair passed.
  - Whole-member account, customization, automatic-review and alternate-tool equivalence require a separately reviewed bounded assignment.
scratch: /tmp/c1-isolation-01.IEPMA3
native_version: codex-cli 0.164.0
scope: No inference, model/worker sessions, global configuration changes or product baseline mutations

Investigation on 2026-10-25, under the unchanged [assignment](../../assignments/c1-c5/C1-ISOLATION-01.md). Recommendation: **hold C1's native first-round independence claim.** A supported Linux namespace primitive passed real file-read controls, including cache/session-shaped fixtures, but this is an altered command environment. It is not an equivalence result for two Codex council members with their real native account/approval context. No council or model session was started.

## Inspected authority and supported interfaces

This worktree began at `56540a6868f771f605dbff8a52d8c7c3d371a623`. Canonical `/opt/dev/ruach` source remained at `2b693cd72bf39c29575841a88d9c7ae719a29715`. Scout and technical handoff source files were read from `/opt/dev/ruach`; no Coordinator workflow was loaded or executed. The current canonical skills directory has no `ruach-workflow-council` body. The assignment supplies the applicable first-round gate: positive input reads plus negative existing harmless marker reads under the same effective permissions. The investigation does not substitute a different workflow contract.

Applied source skill-creator guidance from `$HOME/.codex/skills/.system/skill-creator/SKILL.md`: preserve authorization scope, distinguish structural validation from observable behavior, and provide minimum raw inputs without intended answers for later independent evaluation. No skill/framework was created or modified, and no evaluating subagent was launched. Its inspected SHA-256 is `6656e54755638e8efcf275a472b9672eaa8a9a1b9e59dc210e275b03b59e1e66`.

OpenAI Docs was applied, with local no-inference CLI/help first as explicitly assigned, then official documentation fallback. The official [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) documents named `permissions.<name>.filesystem` profiles with absolute-path/special-token read/write/deny entries, and `approvals_reviewer="auto_review"` under on-request approvals. It also documents that network-domain restrictions do not restrict apps or MCP servers. These are configuration semantics, not evidence that all native member access routes are isolated. The official [security page](https://learn.chatgpt.com/docs/security) was opened but did not settle the needed local filesystem enforcement details. Native help/schema and actual probes determine this report's narrower claims.

Verified local executable: `$HOME/.codex/packages/standalone/releases/0.164.0-x86_64-unknown-linux-musl/bin/codex`, `codex-cli 0.164.0`, binary SHA-256 `b93f6811d3f653f0fb83be4050d857fb9abbb111dfa2ce160563327daff7f306`. `codex sandbox --help` documents `-P/--permission-profile`, per-command `-c` overrides, `-C`, and `--include-managed-config`. It also advertises opaque sandbox-state input, which was **not** manufactured or used. No undocumented flag/RPC was invoked.

`timeout 120 codex app-server generate-json-schema --experimental --out S/schema` exited 0; it only generated schema files. `S=/tmp/c1-isolation-01.IEPMA3`. `schema/v2/ConfigReadResponse.json` describes `auto_review`; permission-profile-list and requirement schemas are also present. No app-server/model service or session was started. `codex --help`, `sandbox --help`, `debug --help` and `app-server --help` were read. Help emitted a read-only PATH-alias warning; no global discovery/trust/config change was made to suppress it.

Available OS tools: `/usr/bin/unshare` (util-linux 2.41.5), `/usr/bin/bwrap` (Bubblewrap 0.12.0), setpriv and ACL tools. nsjail/firejail were not found by the capability lookup. Only unshare/bwrap were exercised; ACL/UID changes, privileges, sysctls and services were not used.

## Fixtures and counter-controls

All fixtures are harmless, task-owned files under S, created before any namespace attempt and retained. The marker named `state_5.sqlite` is intentionally plain marker bytes in a known storage-shaped path, not a real database or real worker transcript. File reads never targeted another worker's session or actual account credentials.

| S-relative location | Purpose |
| --- | --- |
| `inputs/question.txt` | Positive input, `C1_ALLOWED_INPUT` |
| `a/out/answer.md`, `b/out/answer.md` | Own/peer output markers |
| `repo/docs/reports/member-b.md` | Alternate shared report copy |
| `native-home/sessions/2099/01/01/rollout-peer.jsonl` | Alternate native transcript shape |
| `native-home/state_5.sqlite`, `native-home/memories/peer.md` | Alternate native state/memory shapes |
| `cache/plugins/full-repo/member-b.md` | Complete-source/plugin cache copy |
| `repo/.git/objects/peer-marker` | Repository object-store-shaped copy |
| `inputs/peer-symlink`, `inputs/peer-hardlink` | Aliases of the existing B output marker |

The same Python read loop also opens the actual canonical `/opt/dev/ruach/agents/scout.md` and `/opt/dev/ruach/skills/ruach-handoff/SKILL.md`. SHA-256 values are respectively `750eb21d2dc8e11bd7008207fba8d88d5744b789f7d646d939b50c1657db4376` and `59e43c30321167aceaf5b59837db1c5e114c48f4d23bd340c5aa579957569445`. Thus positive controls include actual role/technical-resource access, not just an unrelated executable starting successfully.

`timeout 120 python3 S/read-probe.py`, cwd this worktree, exited 0 and read all thirteen paths, including both aliases. Full results are [host-marker-control.stdout](/tmp/c1-isolation-01.IEPMA3/logs/host-marker-control.stdout). This establishes file existence and readability without isolation; denied reads below are not nonexistent-file tests. All probes use UID 1000.

## Native per-run profiles: attempted, not established

`S/probe.ts` records exact argv/cwd/exit in [commands.jsonl](/tmp/c1-isolation-01.IEPMA3/commands.jsonl) and separate original stdout/stderr under `S/logs/`. Each command is bounded by `timeout --signal=TERM --kill-after=5 120`. Per-member profile bytes and argv are retained as `S/c1_{a,b}.toml` and `.argv.json`. Representative A configuration, supplied only with `-c` overrides:

```toml
approval_policy="on-request"
approvals_reviewer="auto_review"
[permissions.c1_a.filesystem]
":minimal"="read"
"/tmp/c1-isolation-01.IEPMA3/inputs/question.txt"="read"
"/tmp/c1-isolation-01.IEPMA3/a/out"="write"
"/opt/dev/ruach/agents/scout.md"="read"
"/opt/dev/ruach/skills/ruach-handoff/SKILL.md"="read"
[permissions.c1_a.network]
enabled=false
```

B changes only its own output root. The command is `codex sandbox --include-managed-config -P c1_a -c ... -C S/a/out -- /usr/bin/python3 -c READ_LOOP`; exact serialized values/loop are in the argv file. There was no `approval_policy=never`, bypass switch, altered CODEX_HOME, account copy or omitted managed-requirement check. This preserves the requested settings in the attempted configuration, **not** a proven active automatic reviewer during a model turn.

Execution evidence, all before any marker-read output:

| Probe | Actual result / disposition |
| --- | --- |
| Initial native helper | Each native call exited 1: top-level `--strict-config`, although advertised in general help, is explicitly unsupported for `codex sandbox`. The original helper is `probe.strict-rejected.ts`; corrected commands omit it. This was a probe-construction error, not an isolation result. |
| Corrected native A/B and broad-read control | Each exited 1: `error building bubblewrap command: app-server socket directory must be a user-owned directory with mode 0700`. No positive or negative read executed. |
| Corrected native calls with task-local XDG_RUNTIME_DIR mode 0700 | Same socket-directory failure. This standard environment adjustment did not resolve native startup and is not a successful native route. |
| Single assignment-authorized socket/process escalation | Ran the same no-model probes inside an outer `bwrap --ro-bind / / --bind S S --proc /proc --dev /dev`, keeping global files read-only. Native commands exited 101 with panic opening `/tmp/codex-bwrap-synthetic-mount-targets-1000/lock`: read-only filesystem. The outer runner exited 0 because it records child exits; its success is not native success. |
| Further **unprivileged** private-/tmp namespace probe | Outer bwrap used `--tmpfs /tmp --bind S S`, task TMPDIR/XDG_RUNTIME_DIR. Native sandbox children exited 1: `bwrap: loopback: Failed to create NETLINK_ROUTE socket: Operation not permitted`. No second escalation was attempted. |

Full original failures: `S/logs/{restricted,supported,runtime,host-socket,private-tmp}-native-{a,b,control}.{stdout,stderr}`. The corresponding outer runner outputs remain in S. The failed lock's shared location was not made writable or modified. No policy was weakened to make any native probe green. Native probing stopped at this bounded capability limit.

These errors do not prove named read profiles are unsupported by Codex generally. They prove that this investigation did not obtain an effective native sandbox read pair in the current execution route. No native worker-equivalent first-round exclusion follows from the profile syntax being accepted.

## Actual OS namespace result

Initial `unshare --user --map-root-user --mount --fork /bin/true` and `bwrap --unshare-user --unshare-pid --ro-bind / / --proc /proc --dev /dev -- /bin/true`, cwd S, exited 0. The actual marker experiment is [os-markers.ts](/tmp/c1-isolation-01.IEPMA3/os-markers.ts), not a mock wrapper. It ran two member views and a deliberate input-contamination control for each, all exit 0. Exact argv is in the command ledger.

For each view it sets a task-owned empty `S/mask` directory to mode 000, then invokes bwrap with `--unshare-user --unshare-pid --cap-drop ALL --ro-bind / / --proc /proc --dev /dev`. Read-only bind mounts of that inaccessible mask cover the other member's root, `S/repo`, `S/native-home`, and `S/cache`. The clean-input view also masks all `S/inputs`, then exposes **only the original question file** via a read-only bind at an existing `S/work/input.txt` mount target. It runs the actual Python open/read loop. Mask permissions are restored to 0700 only after all commands finish; rerunning the script reestablishes 000 for its probes.

| View | Positive reads | Negative reads | Counter-control |
| --- | --- | --- | --- |
| A, exact input | Original question via selected mount, A answer, actual Scout role, actual technical skill | B answer plus report/session/state/memory/cache/object-store copies and both aliases: nine `errno=13` / EACCES results | Original files remain present and readable in the unmasked control. |
| B, exact input | Original question via selected mount, B answer, same role/skill | A answer plus the same alternate locations/aliases: nine EACCES results | Same positive/negative command boundary, reversed ownership. |
| A, broadly readable inputs | Question, own marker, role/skill **and peer hardlink** | Direct peer and other masked paths denied; symlink resolves into denied peer root | Actual peer bytes leak through allowed-directory hardlink. This control intentionally fails exclusion. |

Raw [A exact-input output](/tmp/c1-isolation-01.IEPMA3/logs/os-a-exact-input.stdout), [B exact-input output](/tmp/c1-isolation-01.IEPMA3/logs/os-b-exact-input.stdout), and [contamination output](/tmp/c1-isolation-01.IEPMA3/logs/os-a-contaminated-input.stdout) retain paths, successful marker bytes and actual error numbers. Symlink denial alone would not catch the hardlink. Broadly mounting a full repository/input/plugin snapshot that contains answer bytes is invalid even when the conventional answer path is masked.

**Limits:** this is read access for Python child processes in deliberately altered mount views. The root remains broadly readable outside the listed fixture masks. It does not hide the real shared account's other session/cache paths, constrain a native parent harness or MCP/app service, test inherited descriptors, or prove denial through native session/history APIs. No output-write control, native customization/credential flow, active automatic review or actual member run was exercised. Therefore these OS marker passes cannot be promoted to the required native-member independence claim.

## Smallest next boundary and member requirements

The smallest useful follow-up is a separately reviewed **no-model native preflight** with host-supported namespace/netlink/temp capability and a task-private `/tmp` view. Reuse supported `codex sandbox -P ... --include-managed-config` and the exact positive/negative fixture set; preserve native on-request/auto_review and account/customization context. It must first resolve the reported setup errors without granting a model broader filesystem access. Do not modify global socket permissions, shared registry state, trust or sysctls. A successful marker pair must come from the actual effective native permissions, not an outer runner's exit.

Only after that gate should the Coordinator consider separately authorized real members. Each member needs its own clean reviewed input snapshot, exact canonical assigned role and required technical files; allow only its own writable output root. Do not grant a complete shared checkout, parent output directory, plugin clone, memory/session store or cached report bundle containing either first-round answer. Same-user chmod 0700 or separate worktree names alone do not separate members. Do not mount all of CODEX_HOME merely to preserve account access: it can expose peer session/state/memory contents or a shared daemon that returns them. Account/customization preservation and answer-free session storage require explicit native verification; an altered empty home or anonymous provider is not an equivalent substitute.

Apply the effective boundary to **every** member access path, including filesystem/search tools, plugins, native daemon/session APIs, shared databases/cache, network/MCP/app access and inherited descriptors. If native tool sandboxing cannot cover those paths, a reviewed whole-harness namespace/environment with explicitly supplied account/customization access is a scope/capability change, not an already demonstrated mechanism here. No isolation framework was built.

Member answers should remain only in separately inaccessible per-member output stores during round one. The Coordinator collects them from outside both member views after each round-one response is sealed; publish the shared collection only for a later authorized round. Positive input/role/technical reads, own-output write/read, existing peer markers at output/session/cache alternates and contamination counter-controls must all run under the actual member permissions before any blind/independent claim. Report the exact input hashes, native effective profile, reviewer settings, storage endpoints and limitations. A provider/model/session launch is not authorized by this investigation.

## Preservation and report checks

All raw fixtures, helpers, generated schema and probe logs remain under S; only this report and unchanged assignment are owned repository writes. No product baseline command was rerun, source/build/database changed, task session/worktree released or unrelated personal/session data inspected. Completed product baselines at `/tmp/c15-provision-01.6o1CPD` remain retained. No privilege/service/global policy change occurred.

Assignment SHA-256: `7faba4cf0a274e6436cda1cfb881c667fd7672919fddedb3909aaa2ed1ddb8a7`, rechecked unchanged with `sha256sum` (exit 0). Report-only checks, cwd this worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-isolation.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, candidate revision resolved, no diagnostics.
- `git diff --cached --check -- docs/assignments/c1-c5/C1-ISOLATION-01.md docs/reports/c1-c5/council-isolation.md`: exit 0. Staged scope contains exactly the unchanged assignment and this report.

No unrelated suite was run. The creating SHA is returned externally, never predicted here.
