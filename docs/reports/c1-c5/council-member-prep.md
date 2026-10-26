task: C1-MEMBER-PREP-01
status: complete
outcome: Restrictive named permissions coexist with explicit automatic review in owned native readers; complete tool-free or whole-member exclusion is not established.
artifacts:
  - docs/assignments/c1-c5/C1-MEMBER-PREP-01.md
  - docs/reports/c1-c5/council-member-prep.md
candidate_revision: a892f5a0c05894ed9b52b49d95d8e153078de585
verification:
  - "Codex 0.164.0 local help/schema and official configuration/app-server documentation inspected."
  - "Owned short-lived config/status readers exited 0 after one recorded restricted-runtime failure; no thread/turn or persistent daemon started."
  - "Named profile allowed; on-request/auto_review, gpt-6.1-sol/high and canonical-role developer composition observed as effective fields."
  - "Actual --approve-for-me added workspace-write; explicit/default named-profile command controls still hid the existing peer marker."
  - "Native MCP status exposed codex_apps with 195 tools; documented per-run restriction candidate reduced that inventory to zero."
  - "No complete built-in/request tool manifest was available through the inspected no-thread interfaces; tool-free claim remains held."
review: not-run
discoveries:
  - Configured-MCP list alone missed the runtime-injected app service; actual status metadata changes the member-launch decision.
  - Native config/read can retain both legacy sandbox_mode and default_permissions; that does not make the documented mixed configuration a recommended TUI/exec composition.
  - Tool restrictions preserve observed model/effort/approval/role fields but leave inherited multi_agent_v2 enabled and do not certify an empty initial tool list.
blockers:
  - No authoritative complete pre-inference tool/request-input manifest was established; whole-member or tool-free independence cannot yet be claimed.
  - Portable member launch needs a narrowly reviewed per-run profile composition; current config/profile pass-through is rejected and LR-01 was not retried.
scratch: /tmp/c1-member-prep-01.idf0Wd
native_version: codex-cli 0.164.0
native_child_controls: preserved
whole_member_independence: held

> Editorial portability view: machine-local evidence locations are literal paths. [Original snapshots and curation provenance](../releases/0.7.0/ci-portability.md) remain available; historical findings are unchanged.

This completes the bounded [assignment](../../assignments/c1-c5/C1-MEMBER-PREP-01.md). The prior [41 passing native controls](council-native-controls.md) remain valid child-boundary evidence; all earlier setup failures remain failures. The smallest verified native composition is an explicitly named profile plus `approval_policy="on-request"` and `approvals_reviewer="auto_review"`, preserving the observed account/model/effort/config environment. **A real two-member independent round is still held:** neither the complete enabled tool surface nor all expanded member inputs have been frozen/attested through a supported no-inference interface.

No model/member/worker/council launch, inference, thread creation, real-peer enumeration/read, credential copy, persistent daemon, global setting/trust/socket-mode change, source/test/catalog change, LR-01 retry, merge/push/delivery or task teardown occurred. Native ordinary runtime/log initialization was used only for owned short-lived readers, as authorized.

## Supported native configuration facts

Worktree/report baseline: `a892f5a0c05894ed9b52b49d95d8e153078de585`. Native version remains `codex-cli 0.164.0`; the exact executable/runtime grant is unchanged from the prior controls. Local `exec --help` documents `--approve-for-me` and its workspace-write mapping; `app-server --help` documents `--listen stdio://`. Generated 0.164.0 schemas under `/tmp/c1-isolation-01.IEPMA3/schema` define the configuration/status/command methods actually used here.

The official [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) describes `default_permissions` as the named sandboxed-tool profile selector and explicitly says not to combine it with `sandbox_mode` or `sandbox_workspace_write`. It documents explicit approval/reviewer settings and the per-run feature/app controls used below. The [app-server contract](https://learn.chatgpt.com/docs/app-server) documents effective config reads, MCP status inventory and standalone sandboxed `command/exec` without a thread/turn. These facts support the tested composition; they do not assert that a named command profile restricts app traffic or parent tools.

An owned reader used native `codex [per-run overrides] app-server --listen stdio://`, cwd this Ruach worktree. It sent only `initialize`, `initialized`, `config/read`, `permissionProfile/list`, `mcpServerStatus/list` and, in separate filesystem checks, `command/exec`. It never sent a `thread/*`, `turn/*`, session/history enumeration, OAuth, tool-call or configuration-write request. Each reader had a 20-second owned-process-group deadline inside a 120-second helper bound, closed stdin, and exited 0 after EOF. No existing daemon was queried or started.

The first ordinary restricted reader failed initializing SQLite runtime under the real native home. Original filtered error/exit evidence remains under `R/restricted-no-runtime/`, where `R=/tmp/c1-member-prep-01.idf0Wd`. A supported scoped host-runtime retry succeeded. HOME/CODEX_HOME/account binding were not redirected; only task TMPDIR was set. No authentication settings/credentials were copied. The successful readers initialized native ordinary runtime/log state, which this assignment expressly permits. Raw global instructions and credentials were filtered before output/files: only selected configuration fields, instruction hashes/lengths, tool names/status and redacted argv were retained. MCP tool schemas/descriptions/tokens were not retained.

| Reader case | Effective approval/reviewer | Effective named profile | Legacy sandbox field | Other observations |
| --- | --- | --- | --- | --- |
| Baseline | null / null in on-disk effective fields | null | null | Model `gpt-6.1-sol`, effort `high`. Null is not a claim about runtime defaults. |
| Named profile + explicit review | `on-request` / `auto_review` | `c1_prep`, selectable/allowed | null | Same model/effort; composed canonical-role developer text present. |
| Same + actual `--approve-for-me` | `on-request` / `auto_review` | `c1_prep` | `workspace-write` | Both fields survive native config/read. |
| Same + explicit workspace field | `on-request` / `auto_review` | `c1_prep` | `workspace-write` | Reproduces the legacy field added by the flag. |

Exact safe evidence: baseline.json (`/tmp/c1-member-prep-01.idf0Wd/baseline.json`), named-auto.json (`/tmp/c1-member-prep-01.idf0Wd/named-auto.json`), approve-flag.json (`/tmp/c1-member-prep-01.idf0Wd/approve-flag.json`), workspace-field.json (`/tmp/c1-member-prep-01.idf0Wd/workspace-field.json`). They contain real argv/cwd/PIDs/exits and the exact read-method ledger. reader.ts (`/tmp/c1-member-prep-01.idf0Wd/reader.ts`) is disposable investigation code, not a provider or launcher implementation.

The named profile has the proven exact question read, own-output write, canonical Scout/technical reads, minimal system runtime, sole exact Codex-executable read and network disabled. No broad HOME, native state/cache or peer-report access was added. Existing developer text was composed in memory with the actual Scout file and declared technical-source path using the source adapter's preservation pattern. Baseline developer text was absent in this observed config; composed text is 1,846 bytes, SHA-256 `ede3cfba772c3633c42b232b5daf59e8aac91a076054b247465746c6ef18a293`, identical across the tested overrides. This proves configuration composition, not the final model request or complete native customization expansion. No model/effort/provider fallback was selected.

## Filesystem effects, not just labels

An initial standalone sandbox comparison omitted `-P` while retaining `--include-managed-config`; native argument validation rejected all three cases because that flag requires an explicit profile. Original commands/errors remain in `R/fs/` and `filesystem.required-P.ts`. They were not relabelled as filesystem tests.

Corrected explicit-profile sandbox cases in `R/fs-explicit/` exited 0. With named default alone, actual `--approve-for-me`, or the explicit workspace field, each read the authored question and canonical Scout and failed the existing harmless peer-marker read with ENOENT. Exact-profile selection is therefore effective in these native commands despite the extra legacy field; this does not prove TUI/exec default selection by itself.

To test default resolution rather than explicit `-P`, separate owned app-server readers used documented `command/exec` with **both `permissionProfile` and `sandboxPolicy` omitted**. The generated schema says those fields otherwise default to the user's configured policy. Native command exits were 0, stderr empty, and the existing peer marker stayed hidden in both cases:

| Server configuration | Question / role | Existing peer marker | Native result |
| --- | --- | --- | --- |
| `default_permissions=c1_prep`, explicit on-request/auto_review | readable | ENOENT | `command/exec.exitCode=0` |
| Same + actual `--approve-for-me` | readable | ENOENT | `command/exec.exitCode=0`; legacy field also reads workspace-write |

Original command results/params: named-default-command.json (`/tmp/c1-member-prep-01.idf0Wd/named-default-command.json`), approve-flag-command.json (`/tmp/c1-member-prep-01.idf0Wd/approve-flag-command.json`), reader.commands.ts (`/tmp/c1-member-prep-01.idf0Wd/reader.commands.ts`). This establishes real server default-profile command behavior without a thread or model. It does not establish a completed TUI/exec member turn, reviewer invocation or whole-member isolation. Given the official prohibition on mixed legacy/profile fields, prefer explicit on-request/auto_review **without** the workspace-setting flag for a new restrictive-profile option rather than treating the observed mixed behavior as a general compatibility contract.

## Actual access routes and controlled restriction candidate

The owned `mcpServerStatus/list` call used `detail="toolsAndAuthOnly"`, no thread ID, and returned a complete page (`nextCursor=null`). It exposed runtime-injected **`codex_apps`, 195 tool names, auth status `bearerToken`**. No token value was read out. Examples of answer-relevant route names are `chatgpt_space.read_page`, `chatgpt_space.read_page_transcript`, `codex_document_control.list_document_sessions`, and repository search/fetch tools. Only metadata was inspected; no tool was called and no actual peer/document/session data was enumerated. This is why the earlier configured-MCP list of `[]` was insufficient.

For the explicitly authorized controlled altered-native proposal, an additional per-run reader added:

```toml
features.shell_tool=false
features.apps=false
features.multi_agent=false
features.code_mode.enabled=false
web_search="disabled"
apps._default.enabled=false
```

No global customization was changed. The effective config showed these values, retained `gpt-6.1-sol`/`high`, on-request/auto_review, `c1_prep`, and the same canonical-role developer hash. The actual MCP status page became **zero servers, no next cursor**. restricted-tools-candidate.json (`/tmp/c1-member-prep-01.idf0Wd/restricted-tools-candidate.json`) and reader.extra.ts (`/tmp/c1-member-prep-01.idf0Wd/reader.extra.ts`) retain exact safe fields/argv/methods/exits.

This is a genuine per-run app-service reduction, **not** proof of a tool-free member. Inherited `features.multi_agent_v2.enabled=true`, hooks/remote-plugin/tool-suggest configuration and possible core tools still exist in effective metadata. Basic multi-agent=false is not evidence that every collaboration route is absent. The inspected schema's `ToolsV2` exposes web-search settings, not a universal deny-all switch. `ThreadStartParams.dynamicTools` is not a complete built-in-tool replacement, and setting an empty dynamic list would not prove the model sees no tools. No guessed `tools=[]`/`tool_choice` setting or undocumented RPC was used.

Neither inspected local schemas nor official no-thread interfaces supplied an authoritative **final initial tool manifest / finalized native request**. `debug prompt-input --help` describes a prompt-input list rather than a tools manifest; it was not treated as proof or used to create a session. Therefore no actual request/tool-surface evidence establishes full emptiness, and no tool-free positive/negative or contamination claim is made. The previous native filesystem controls still protect their tested command paths; they do not constrain a native parent, app/MCP backend, history service, arbitrary input already containing peer answers, or an unobserved built-in tool.

## Minimal composition and next decision

There is enough evidence to specify a **narrow per-run composition option**, but not to launch an independent two-member case today. Ownership should remain in the existing consumer policy / Codex preparation boundary:

1. Resolve the user-authorized Codex model/effort and canonical advisory role through the existing policy; preserve original developer instructions, skill/customization settings and account roots. Select a declared restrictive member profile with its exact runtime grant. Emit explicit `approval_policy="on-request"`, `approvals_reviewer="auto_review"` and `default_permissions=PROFILE`, leaving legacy sandbox mode unset. No global config or alternate account/provider.
2. Verify effective config/profile allowance and run the existing native child controls through the actual composed path, including own write/read, existing peer/alternate markers, exact-grant and hardlink controls. Do not rely solely on the configuration table or the server-reader exit.
3. Before any independent-member claim, obtain authoritative final enabled-tool and expanded-input evidence. For a controlled inline case, freeze both members' complete input packets **before either real answer exists**, inline the canonical role and declared technical inputs, prove an empty final tool surface, and repeat existing-marker/contamination controls using that actual surface evidence. Input omission or a model's self-report is insufficient.

The **precise remaining capability** is a supported native pre-inference export/attestation of the finalized tool list and expanded inputs, or a separately reviewed whole-member boundary that covers the remaining enabled parent/service/history routes. The current no-thread reader can prove effective settings and MCP inventory, not that full request boundary. A separately authorized instrumented native member/request inspection could address this if a supported capture point exists; this assignment does not invent one, implement a provider, or authorize inference. Root can report this capability hold rather than launch on an unspecified equivalence claim.

Current portable preparation rejects config/profile pass-through; its auto-review mapping emits `--approve-for-me`. A small assigned consumer/adapter option would need to select the named profile with explicit review settings instead, preserve model/effort/developer/skill context, reject conflicting legacy sandbox options, and fail if requirements override the selection. Acceptance is the effective-field comparison and real marker controls above plus a complete tool/input-surface gate; it is not a general profile API or permission to bypass a rejected flag. No adapter or LR-01 path was changed or retried.

Offline `just agent-routing resolve scout` was attempted once and exited 2 (`dependencies_missing`, skill YAML dependency absent); no install/fallback/launch followed. Static catalogs show a defined `gpt-6.1-sol-high` Codex route, while the source-development Scout preference is Claude. The caller's C1 Codex-worker authority must be represented in its consumer selection/preparation policy; do not silently use the source preference or manufacture an undeclared fallback. This is not LR-01 evidence. Existing user authority need not be replaced with a new product-design question.

Copyable next bounded member-assignment requirements, **after** the capability gate is met:

> Use the authorized Codex route/model/effort and canonical advisory role; preserve the existing account and customizations. Provide two frozen, hashed, answer-free inline packets containing the question, role and declared technical evidence. Apply only the reviewed per-run named profile and tool/service restrictions. Before inference, record actual effective approval/profile and complete final tool/input evidence; require the tested positive/existing-negative and contamination controls to pass. Hold on any unknown answer-access route or changed required context. Keep each first-round answer only in its inaccessible own store, collect sealed answers outside both member views, and expose a joint collection only for a separately authorized later round. Record actual returned native identities; do not fabricate a Herdr/thread identity or claim normal portable support for this altered evaluation.

## Verification and retention

Exact safe commands/cwd/native exits/RPC ledgers are in the linked JSON files; helper sources and original rejected/restricted outputs remain under R. Original control evidence, runtime grants and product builds/state were not changed. Owned reader exit 0 and EOF cleanup are recorded; only their own process groups were signalled. No persistent daemon, thread/turn or unrelated suite was used. Raw credential/global-instruction text was not logged or copied.

Owned repository writes are only this report and the unchanged assignment. Assignment SHA-256: `fb7f070c835636af62cb03ddd641957e956c79ab600930ad0549a200906fafc5`, rechecked unchanged. Executed report checks, cwd this worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-member-prep.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, candidate base resolved, no diagnostics.
- `git diff --cached --check -- docs/assignments/c1-c5/C1-MEMBER-PREP-01.md docs/reports/c1-c5/council-member-prep.md`: exit 0; staged scope is exactly the unchanged assignment and this report.
- Read-only Bun file-link check: 14 Markdown links, no missing local targets, exit 0.

The report's creating SHA is returned externally, never predicted here.
