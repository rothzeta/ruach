# C1 native member boundary decision

Assignment: [C1-BOUNDARY-DESIGN-01](../../assignments/c1-c5/C1-BOUNDARY-DESIGN-01.md), v1. Design baseline: `f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f`. Scope is the reviewed Codex 0.164.0/account/environment, not a claim about every Codex installation.

## Decision and disposition

**Keep the real independent round held. No complete supported boundary is established by the available evidence. Do not implement a launcher permission option or dispatch another configuration/marker probe as the next step.** The exact missing capability is a supported way to establish the complete effective action surface and expanded inputs of the intended member before inference, with evidence that the inspected composition is the composition actually used. Alternatively, a demonstrated whole-member boundary must exclude the actual remaining routes listed below while retaining model connectivity and the account/customizations.

The smallest conditional candidate is a controlled inline, tool-free case: two fully expanded, answer-free packets frozen before either answer exists, with an authoritative empty final tool/action surface. This reduces the required live boundary without weakening first-round independence. It is **not ready to implement or execute**: the final action-surface evidence and its binding to execution are missing. The whole-process alternative has more unresolved runtime/connectivity obligations and is not a supported fallback established here.

The Coordinator can record this bounded capability hold now. No new owner decision about the existing independence requirement is needed. Reopen only on a concrete supported native capability or demonstrated boundary delta. A route/account change, native modification, credential redirection/copy, security approval, or altered required context would require separate authority; this design grants none. It does not ask the owner to accept prompt-only independence or a non-independent demonstration as C1 proof.

## Evidence and actual routes

The [member-preparation report](../../reports/c1-c5/council-member-prep.md) at `34287d924ea31c3226b4cb7fcb76e61c02774768` and [independent review](../../reports/c1-c5/council-boundary-review.md) at `6961aeb937f1dd4072a7e6745ffa187b5b56de64` are the accepted evidence chain. Those paths exist in the cited shared Git revisions; they are not copied into this branch. Historical failures retain their original dispositions. Existing native controls were not rerun.

| Actual route or input in this case | Established evidence | Remaining obligation |
| --- | --- | --- |
| Sandboxed command filesystem: question, canonical resources, own outputs, peer files, alternate roots and hardlinks | Four native control receipts, 41 authored checks, independently reviewed. Strict own access succeeds; existing excluded markers fail; broader exact-file/hardlink controls expose contamination. | Preserve this scope. It does not cover native parent reads or already expanded context. |
| Native parent/process and local daemon/state/history | Preparation reads effective config/catalog outside the command child; native runtime state is needed. Existing matching-daemon and owned stdio readers are distinct preparation paths. | No evidence confines parent filesystem, process/socket access or history to the child's view. A whole-member option must cover them, not just add a child profile. |
| Runtime apps and network-backed tools | Actual complete MCP status exposes `codex_apps`, 195 tools, including page/transcript/document-session and repository retrieval routes, despite configured MCP being empty. Reviewed per-run restrictions reduce actual MCP inventory to zero. | Inventory reduction covers MCP status only. Command-child network denial is not parent/backend network denial. Keep required model/account connectivity explicit. |
| Collaboration/native core actions | Restricted metadata retains `multi_agent_v2.enabled=true`; the local protocol includes collaboration operations. Complete final core/tool exposure was not observed. | Establish actual effective absence for the tool-free case, or exclude answer access through the enabled operations. A basic multi-agent flag is insufficient. Protocol existence alone does not prove a tool is exposed to this member. |
| Hooks, remote-plugin/tool-suggest metadata and incremental tool exposure | These remain distinct preparation questions in the reviewed restricted candidate. | Establish whether they add actions or inputs in the selected case; no assertion that all are active. An initial empty list without a complete effective-action contract is insufficient if later additions remain possible. |
| Native-expanded instructions/context/history, role, technical material and caller input | Configured developer composition/hash was preserved in readers. No actual fully expanded member request was frozen. | Establish complete answer-free inputs, including native-added material, before either answer. Do not inherit this Architect's investigation transcript as a member packet. |

These are the current case's evidenced routes and unresolved expansions, not an abstract demand to rule out every conceivable tool. Do not enumerate private sessions, credentials or raw global instructions to fill this table.

## What the supported interfaces establish

Read-only local help and the retained generated 0.164.0 schemas were inspected. Only `codex debug --help` and `codex debug prompt-input --help` were invoked; no debug export, server, thread or member was started. Both help invocations exited 0 with a read-only PATH-alias warning. The following distinctions determine the decision:

- `config/read`, `permissionProfile/list` and `mcpServerStatus/list` establish the reviewed fields/profile/MCP inventory. They are not a final built-in/request action manifest. Repeating the existing reader cannot supply that missing object.
- The official [CLI reference](https://learn.chatgpt.com/docs/cli/reference#codex-debug-prompt-input) describes `debug prompt-input` as rendering model-visible input JSON. Local help agrees. This is a useful documented input-inspection candidate, but supplies no documented complete tool list or guarantee binding a separate inspection to the later member execution. Its output was not requested here because raw instruction/session enumeration is outside scope.
- The [app-server documentation](https://learn.chatgpt.com/docs/app-server) distinguishes thread creation, turn generation, configuration and MCP inventory. It documents dynamic tools separately. The retained `ThreadStartParams` schema's `dynamicTools` describes that additional tool input; it does not replace the complete built-in tool surface. `experimentalRawEvents` is an internal response-event option, not an established pre-inference request gate.
- The retained `ThreadStartResponse` schema reports instruction-source paths and effective fields, not complete expanded bytes/actions. Its `disabledPluginIds` description explicitly says it does not yet filter capabilities. Do not promote that metadata to exclusion evidence.
- The retained `AttestationGenerateParams/Response` schema and official app-server initialization contract describe an opaque client attestation token. This is not an attestation of finalized member tools or inputs. No attestation request was made.

The official config-reference fetch failed; no new claim relies on it. Reviewed configuration observations retain their cited evidence. No inspected help/schema/documentation supplies the missing complete interface. That is the bounded finding; absence in these sources is not proof that no such capability can exist.

## Why an outer OS wrapper is not selected

Moving the native parent under an OS boundary would potentially cover more local reads than the existing child profile. The current evidence does not demonstrate its minimum exact grants, native runtime/customization preservation, daemon/process exclusion or network-backed answer-route separation. Network disabled for the entire native parent would also remove required model connectivity; allowing parent network without distinguishing the answer-bearing services leaves the gap open. Exact executable visibility solved an earlier child setup problem, not these obligations.

No small verified existing wrapper covering those obligations has been supplied. Designing a new proxy, alternate credential home, copied account state or generic isolation framework would add unsupported mechanisms and exceed this bounded decision. The inline candidate is smaller if the native request evidence becomes available; until then neither candidate earns an independence claim.

## Conditional acceptance for the inline candidate

These are future gates, not completed checks or permission to run them.

1. **Supported composition and identity.** Use the authorized Codex `gpt-6.1-sol`/`high` route, actual account and canonical advisory role. Preserve original developer instructions, skill/customization settings and required technical material. Record actual native identity privately and source digests publicly; reject identity/role/policy mismatch or fallback. Use explicit `on-request`/`auto_review` and an allowed named permission profile, without adding legacy workspace mode. Effective reader fields alone do not prove member adoption or reviewer invocation.
2. **Both packets before answers.** Freeze both complete native-expanded packets containing the question/version, member assignment, role and all required technical evidence before either real answer exists. Record ordered bytes/digests, composition/config/native version, source provenance and freeze order privately as needed. A caller-text hash or loaded-file-path list alone is insufficient. Any late expansion or composition change invalidates the gate. Required context that cannot be frozen/preserved blocks the case rather than being silently omitted.
3. **Complete action evidence.** Require a supported pre-inference native observation proving the effective action set is empty, including core/collaboration, services, dynamic/incremental additions and native tool-host routes in this composition. Document how the inspected packets/actions are the ones used, or how immutable inputs/config and a supported native contract establish equivalence. Do not invent a digest-consumption API, wire interception, `tools=[]` option or capture hook. Model self-report and post-inference traces cannot substitute for this gate.
4. **Failure-sensitive controls.** The original failure is peer access through an unexcluded route despite nominal file/output separation. Retain actual existing harmless peer markers and independent positive literals. Prove required role/question/technical bytes are present in the frozen input and the peer markers are absent; verify source markers exist independently. For a truly empty action surface, access exclusion follows from the complete surface evidence, not a requested model read. Deliberately contaminate a separately authored packet with a known existing marker and require the pre-inference check to reject it. A separately declared nonempty tool surface must also be rejected. These controls must apply to the actual supported exporter/gate, not a synthetic manifest generated by the checker itself. No contaminated packet proceeds to inference. The old filesystem controls remain child-only evidence and are not relabelled tool-free tests.
5. **First round and close.** Only after independent acceptance and concrete execution authority, run each member from its frozen packet with no inherited peer history and retain the actual answer privately outside both member views. With no tools, the trusted collector persists and validates the returned report bytes on the member's behalf; it must retain attribution and cannot invent an answer. Do not insert streaming output or a completed peer response into the other member. Close only after all required actual durable reports and Coordinator dispositions exist; record missing/blocked members explicitly. Inference itself is not authorized by this design.
6. **Later rounds and resume.** After closure, build a new frozen pair from the actual closed report IDs/versions and any declared new evidence. Freeze both before either new answer. Current-round answers stay inaccessible until closure. Preserve attributed objections and accepted/rejected reasons; votes are not a quality measure. Manual pauses after one round; automatic N includes the first. Persist completed/remaining counts and handled report identities outside members. Resume with new sessions from retained artifacts after release, without replaying round one or treating a retry as a new round. Real music/prototype cases remain separate required demonstrations.

## Existing seams, ownership and sequencing

No source change is justified now. Source inspection identifies only these conditional seams:

- Consumer routing/policy supplies the exact authorized Codex model, role, question/evidence and controlled-case restrictions; retained consumers remain unchanged. No global default change.
- `skills/ruach-herdr/scripts/adapters/codex.ts` currently composes developer/role/skills and maps automatic review to `--approve-for-me`. A later narrowly assigned named-profile option would need explicit review flags, conflict rejection and preservation of native context; generic raw config pass-through is not the solution.
- `skills/ruach-herdr/scripts/adapters/index.ts`, `scripts/contracts.ts`, `scripts/native-codex.ts` and adjacent tests are the corresponding policy/preparation boundaries if later justified. Existing config/catalog readers cannot certify final request isolation. No new provider abstraction is proposed.
- The accepted launch transport at `31b45220eaaa45d1407a8ed32d4604a51fbf2c70` is settled and does not need redesign. The active C2 adapter/common-launcher owner retains these files. Any later overlapping C1 implementation must be assigned serially by the Coordinator after its accepted base; workers do not negotiate ownership.
- The existing council member specimen and rounds reference already carry closure/resumption semantics. No workflow-body, specimen or eval change is required to report this capability hold. A future controlled evaluation must keep its altered-native label; it does not establish ordinary portable support.

Dependencies: complete capability evidence precedes implementation/probes; independently accepted composition precedes real member inference; actual closed reports precede exchange. Source, tests and support remain read-only in this design. No port, profile, database, server or model budget is allocated.

## First bounded specialist assignment, only on a capability delta

No further local probe is justified from the current interfaces. The precise external question is: **What supported Codex 0.164.0 interface, for this unchanged account/configuration, exposes the complete finalized effective tools/actions and expanded inputs before inference, and establishes that those inspected values govern the intended member?** A supported whole-member boundary demonstration covering the listed routes is an alternative supplied fact. If neither is supplied, retain the hold without another investigation loop.

The following documentation-only brief is copyable once the Coordinator has a concrete new capability contract. It is not a dispatch request or an implementation/probe authorization. The Coordinator fills the accepted base/workspace after resolving it; `f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f` is this design's existing source baseline, not a prediction of a future combined base.

```text
# C1-NATIVE-CAPABILITY-DELTA-01 (role: scout), task ruach-c1-c5, v1
Workspace/branch/base: <Coordinator-assigned isolated workspace, unused branch,
resolved accepted source SHA including this design>. Route: authorized Codex
gpt-6.1-sol/high/auto-review with canonical Scout; native identity privately bound.
Authority: DEC-001 "do c1-c5 use ruach skills an agents as needed, codex only";
DEC-002 Ruach/global skills/plugin only, retained consumers unchanged, /tmp allowed.
Outcome: determine whether <supplied exact native capability contract/version>
closes the action/input gap in council-boundary-decision.md. Start is gated on
that concrete supplied delta; do not repeat config/MCP/marker setup investigation.
Dependencies: this design and reviewed evidence 34287d9 / 6961aeb. No source owner
overlap: documentation-only. C2 native preparation/common-launcher remains protected.
Own: unchanged assignment and docs/reports/c1-c5/council-capability-delta.md only.
Read: supplied contract, safe existing receipts/schemas, relevant official docs and
bounded native help only. Protect all source/tests/config/other reports/product state.
Acceptance: cite an exact supported pre-inference interface, its complete action
and expanded-input scope, and its binding to the intended execution, or identify
the exact residual gap and stop. Preserve model/account/customizations/role/review.
Existing helper: /tmp/c1-member-prep-01.idf0Wd/reader.ts and reader.extra.ts;
recorded argv is codex [reviewed per-run overrides] app-server --listen stdio://,
with initialize/config/read/permissionProfile/list/mcpServerStatus/list only.
Those helpers do not export final actions/inputs; do not rerun them as that proof.
No experiment argv is established today. If the supplied contract truly requires
one no-model experiment, return its exact documented argv/RPC, existing helper
fit, read/write/runtime/network scope, bounds and required resource to Coordinator;
do not execute it or create a probe framework in this assignment.
Restrictions: no inference/thread/member/worker launch, credential or raw global
instruction/session enumeration, account/HOME redirection/copy, native modification,
global settings, security approval/bypass, dependency install or delivery.
Verification: bounded read-only source/contract checks; no product tests or native
runtime probes. From assigned cwd run the canonical ruach-handoff validator on
the report with --repo <assigned workspace> (120 s), owned-doc git diff --check,
and assignment digest comparison. Report exact exits and residual uncertainties.
Scope changes: retain work and report the concrete gap; Coordinator decides.
Handoff: concise ruach-handoff leading YAML, review not-run, commit only unchanged
assignment/report, return creating SHA externally. No prefilled capability pass.
```

If a capability delta is accepted, a later single cohesive implementation/probe assignment can own only the necessary consumer/native preparation seam and its behavior tests/evidence, serialized behind C2. Its exact argv, resource grants and acceptance must derive from that accepted contract. Supplying those today would present an unverified interface as implementation-ready.
