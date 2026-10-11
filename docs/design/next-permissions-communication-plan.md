# R4/R5: worktree permissions and reliable worker communication

Status: proposed implementation handoff; batch 2, corrected in round 3, pending round-4 exact revised-pair review. Assignments: [initial planning](../reports/roadmap-planning/assignment-batch2-reliability.md) and [bounded correction](../reports/roadmap-planning/assignment-batch2-round3-reliability.md). Initial source inspection was at `da07e92b78b3d6468147a711cc58f74ba57258c9`; correction inspected HEAD is `59b41e0cb6b3f5b2d96e976f973f41cdb476c040`. Executable source remains based on `d75039aa7b82b262e2f28af08630258fb7f77180`. Implementation, new sessions and paid/native subjects are future work. First-round preparation was independent; both actual closed round-2 reviews were read for this correction. No unseen peer correction is certified.

## Authority, inputs and accepted interfaces

Binding current inputs are the frozen 2026-10-11 copies of [roadmap](../roadmap.md), [native parity](../native-parity.md) and [RAMEC dispositions](0.4-suggestions-from-ramec-orchestration.md). Roadmap SHA-256: `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`; native-parity: `248a89311316251719f8bbfc4371c5f4f2cda8bfbe6c26357118a589b781cffc`; RAMEC: `c2487a2865f79cb15c4312144769c5eb1f16617bb71f5da2751d1a657be9bcd5`. Canonical paths identify the documents; older worktree text is not planning authority. Coordinator supplies approved bytes or their committed revisions to future packets.

Batch 1 closed with agreement in round 4 and no arbitration. Accepted reliability plan: `4b62d7b97d6400c4fb2a340c2466ce52d0d86f6e`; coordination plan: `6a08b3f5fa1fb03e0b19024fcec3503d2708e64b`. The supplied prior-interface summary and canonical task record were read, followed only by relevant R3 record/assignment/R4-R6 interface and R1/R2 execution/integration sections. Their proposals are not implemented features.

Closed round-2 reviews are reliability `59b41e0cb6b3f5b2d96e976f973f41cdb476c040` and coordination `aa0353fb731bf37357df93b2de92893b3836aae8`. Accept B2-B-01: merely reserving shared phases at launch left two changelog owners and no named HV-IN → B2-IN dependency. The round-3 assignment chooses B2-IN as sole final batch-2 shared-doc/changelog writer and final R4–R7 assembler; HV-IN supplies an accepted R6/R7 subcandidate and proposed entry in its report. This plan adopts that gate below. B2-B-02/03 factual and owner holds remain; both corrected plans and reports must close and receive exact revised-pair review before agreement.

Preserve one consumer-owned task record, exact owner words/authority/supersession, continuing scoped authorization, stable work/assignment/resource/report identities and observed-versus-handled report state. Only Coordinator loads workflow bodies and personally releases task sessions/workspaces/worktrees. Workers can clean their bounded verification subprocesses and offline scratch. Independent review and separately authorized delivery target the exact combined technical revision. No new role, status/schema, scheduler, mailbox, native terminal primitive, task database or global permission configuration is proposed.

R4 proves actual stage/commit and assigned verification access; readiness or prepared flags alone cannot close it. R5 connects native submission/wait primitives to durable report handling; terminal lifecycle alone cannot close it. R6 owns receipts/delivery, R7 owns general environment/flake policy. Later council/QA/adapter/measurement work consumes these interfaces without becoming a prerequisite for offline preparation.

## Verified facts and limits

| Inspected source or local evidence | Verified fact | Design implication / unverified part |
| --- | --- | --- |
| [Codex adapter](../../skills/ruach-herdr/scripts/adapters/codex.ts), [Claude adapter](../../skills/ruach-herdr/scripts/adapters/claude.ts), [pass validation](../../skills/ruach-herdr/scripts/adapters/index.ts) | `inherit` adds no portable permission override. Codex `auto-review` emits `--approve-for-me`; Claude emits `--permission-mode auto`. Native sandbox/approval flags conflict with portable auto-review and fail before inspection. Unsupported mappings fail exit 3. | Keep mappings; no source defect established. Permission modes do not prove any particular command was approved or writable. |
| [root wrapper](../../scripts/agent-routing.ts), [worker](../../skills/ruach-herdr/scripts/worker.ts) | Development wrapper defaults to `auto-review`; standalone skill defaults to `inherit`. Model/role/native config preparation remains in the skill. `--add-dir` is bounded supported pass-through; no automatic common-Git-directory grant is added by these adapters. | Explicit additional directories require named consumer scope. Do not widen to repository/global config roots automatically, or substitute bypass mode. |
| Installed native help, 2026-10-11 | Codex `0.162.1` describes `--approve-for-me` as automatic review with workspace-write and `--add-dir` as extra writable directories. Claude `2.1.296` lists permission mode `auto` and additional tool-access directories. | Syntax evidence only. Native approval decisions, inherited managed policy and exact linked-worktree access still need an authorized task turn. Codex help/version emitted a read-only PATH-alias initialization warning; no alias/settings were manually changed. |
| This worktree and preceding review receipt | `.git` resolves to `/opt/dev/ruach/.git/worktrees/sol-roadmap-reliability`, common directory `/opt/dev/ruach/.git`, outside this worker's writable worktree root. Round-4 final restaging failed on `index.lock` with read-only filesystem; one exact staging/local-commit escalation succeeded. | Concrete local permission symptom, not proof every native Codex/Claude launch fails or that Ruach's mapping is defective. A commit also writes objects/refs in the common directory; allowing only an `index.lock` pathname would be incomplete. |
| [readiness implementation](../../scripts/install.ts), `ready()`; [readiness tests](../../tests/ready.test.ts) | Read-only discovery, installed package/integrity checks and bounded version probes. No staging, commits, socket binding, assigned recipe execution or native trust confirmation. Missing Herdr session is a warning. Schema version 1 has routes with ready/missing/warnings. | Document a separate execution-readiness matrix per assignment. Keep read-only `ready` and its schema; do not add a mutating capability probe to this command or infer writable Git/socket access from its exit 0. |
| [Herdr tests](../../skills/ruach-herdr/tests/worker.test.ts), [process bounds](../../skills/ruach-herdr/scripts/process.ts), [recipes](../../justfile) | Worker suite binds a temporary Unix socket and fails once with an explicit prerequisite error if denied; fake config readers use local IPC. Helpers have execution/drain bounds and signal only their own group. Full `just test` includes root plus skill suites; root tests alone do not. | Name socket/temp/child-process needs and preserve real exit status. Process cleanup does not authorize closing native task sessions. |
| [worker startup](../../skills/ruach-herdr/scripts/worker.ts), [fake CLI](../../skills/ruach-herdr/tests/fixtures/fake-cli.ts) | Exactly one `agent start`; failed readiness gets one matching-agent inspection. Matching blocked name/kind/pane yields exit 0, awaiting-input, ready false. Other uncertainty retains resources/exit 4. Launcher sends no assignment and does no completion monitoring. | Preserve this boundary. Add public CLI coverage for blocked identity variants; recover a self-update-to-shell through inspection, never automatic resubmission/relaunch. |
| Installed Herdr `0.9.0` help and bundled API schema | `agent prompt`, `agent wait`, `agent get/read/explain`, `pane process-info/read/run/wait-output` exist. Prompt-with-wait has a five-second observed working/blocked activity gate from a non-working state; standalone waits match lifecycle states and can return immediately. Output waits search existing snapshot first. | These primitives suffice for bounded coordination. They do not identify a report, guarantee a specific turn, or persist handled state. Do not invent `submit --file`, report-event wait or a pending-input queue API. |
| Herdr schema AgentInfo/PaneProcessInfo | Agent information includes interactive_ready, launch_pending, agent_status, session/identity, revision and state_change_seq; process info includes foreground process group/processes and shell pid. No dedicated draft-input text or last-work-activity timestamp was found in these inspected structures/help. | `launch_pending` is not an assignment queue. Pending draft inspection uses observed terminal input and tool history with stated limits; check-ins record observation time and evidence, not an invented last-activity field. |
| Planner read-only Herdr inspection | `herdr status server` exited 0: running 0.9.0, endpoint/private protocol compatible. `herdr pane current --current` exited 1 with PermissionDenied/Operation not permitted; dependent process inspection did not run. Bundled schema export succeeded. | Server metadata/help are available; live own-pane state is unverified under this sandbox. No new session, prompt, wait or unrelated agent inspection was performed. |

The schema is CLI-bundled evidence, not certification of every live server method. Its export rejected combined `--json --output` with exit 2; corrected `--output <temp-path>` succeeded. Future execution repeats help/version/status on its actual installation and tests required primitives rather than trusting version number alone. The Coordinator's supplied source baseline passed `just check`, 90 root tests and 28 handoff tests; these are Coordinator evidence, not checks rerun by this Architect or native permission evidence.

## Design choices

| ID | Decision and rationale | Consequential alternative / reopen condition |
| --- | --- | --- |
| R45-D01 | Preserve adapter-owned portable policies and consumer authority. Test their realized behavior before fixes. | A reproduced adapter defect gets a new exact source/test packet; missing privileges alone do not justify bypass flags, new profile or automatic add-dir. |
| R45-D02 | Keep `ready` informational/read-only; an assignment matrix identifies recipe access as unverified, observed available, or blocked with a permitted escalation. | Native settings introspection cannot establish future approval decisions; no capability booleans or new schema without demonstrated need. |
| R45-D03 | Coordinator submits an assignment once using native prompt semantics after identity/readiness checks; submission and task/report completion remain distinct. | Raw send-text plus separate Enter is a recovery primitive only when justified by observed draft state, not the normal path. |
| R45-D04 | Read durable report identity before waiting, after a bounded wake/timeout and on resumption; persist a disposition before dependent action. | A wait started-at timestamp loses pre-existing reports; terminal done and evidence-only successor commits are insufficient identities. |
| R45-D05 | Use bounded native waits and scheduled human-readable check-ins in the Coordinator's existing task loop. | No Ruach daemon, watcher, report polling service, turn scheduler or terminal transport wrapper. Missing exact-turn support remains a limitation. |
| R45-D06 | Offline packets and launcher CLI regressions prepare evidence; independent authorized native execution closes permission/communication claims. | Deterministic replays and fake CLIs cannot be relabelled real approval, trust, submission or native waiting proof. |
| R45-D07 | B2-IN alone writes final batch-2 shared docs/changelog and assembles R4–R7 after accepted HV-IN and named accepted R4/R5 inputs. | Duplicate final writers or an unnamed predecessor defer ownership instead of resolving it. Reopen only for an evidenced consequential conflict through a bounded amendment; disjoint preparation stays independent. |

## Packages, ownership and order

All units are future assignments. Each owns its unchanged assignment/report under `docs/assignments/r45/<id>.md` and `docs/reports/r45/<id>.md`, in addition to the paths below. Reports are durable sanitized evidence, while raw fixture state and logs use OS temp or explicitly assigned retention storage outside the evaluated candidate. Proposed branches are templates; resolve base/check exact refs and worktrees immediately before launch, choose a new suffix if occupied and never delete another branch.

| Unit / role / branch | Exact source, test, support and docs ownership | Dependency and reason |
| --- | --- | --- |
| R4-P / Implementer / `ruach/r4-permission-packet` | `evals/ruach-permissions/README.md`, `prepare.ts`, `probe.ts`, `tests/packet.test.ts`, `cases/**`, `expected/**`. TypeScript/Bun fixture/test support only; no reusable runtime edits. | Independent offline preparation from current authorized base and this design. Pin accepted R3 contract as instructions; final smoke resources must use exact reviewed candidate. |
| R5-P / Implementer / `ruach/r5-communication-packet` | `evals/ruach-communication/README.md`, `prepare.ts`, `tests/packet.test.ts`, `cases/**`, `expected/**`. Optional recording stub only at `fixtures/record-state.ts`; no installed monitoring code. | Independent of R4-P. Uses accepted R3 observed/handled identity semantics. Prepare independently; final refresh to actual accepted R3 guidance before behavior claims. |
| R5-L / Implementer / `ruach/r5-startup-contract-tests` | Inside `skills/ruach-herdr`: `tests/worker.test.ts`, `tests/fixtures/fake-cli.ts` only. No production code/adapter/contract edits. | Serialize after accepted R2-L when that unit edits the shared fake CLI; use its exact resulting fixture. If R2-L is not implemented, Coordinator chooses current baseline and reserves this support file, then R2-L must refresh after R5-L. No simultaneous editors. |
| R45-D / Implementer / `ruach/r45-worker-guides` | New `docs/worker-permissions.md`, `docs/worker-communication.md`; no source/tests/support or existing role/specimen edits. | Preparation can accompany P/L. Incorporate accepted packet/review findings; label actual live evidence or precise pending holds. Protect R3 and peer R6/R7 wording ownership. |
| R45-R / Reviewer / `ruach/r45-packet-review` | Own report/assignment only; read exact combined P/L/D scopes and named authority/evidence. | Separately assigned integration Implementer creates combined candidate using only accepted paths; test it, then independent packet/contract/leakage review. |
| R4-S / native Implementer subjects; Coordinator arrangement | Subjects own fixture `src/proof.txt`, `docs/reports/permission-smoke.md` and unchanged `docs/assignments/permission-smoke.md` only. Arranging Coordinator owns `docs/assignments/r45/r4-s-arrange.md` and `docs/reports/r45/r4-s-arrange.md`; independent grading Reviewer owns `docs/reports/r45/r4-s.md`, sanitized `r4-s-evidence/**`, its assignment. No Ruach source edits. | Reviewed R4 packet, usable route, exact resources, explicit native/paid budget, isolated Git parent/session and assigned approval recipes. Coordinator alone starts/submits/records task resources. |
| R5-S / native Coordinator subject or arranging Coordinator, independent Reviewer | Decision subjects own generated case `record.md`, `draft-assignments/**`, `docs/reports/resume.md` only; raw corpus protected. A native primitive worker owns only its separately assigned synthetic report, not production implementation. Arranging Coordinator owns `docs/assignments/r45/r5-s-arrange.md` and `docs/reports/r45/r5-s-arrange.md`. Grader owns `docs/reports/r45/r5-s.md`, sanitized `r5-s-evidence/**`, its assignment. | Reviewed R5 packet and separately authorized native primitives/subjects; identity, trust and controlled resources available. No real worker launch in decision replay; real CLI cases and fixture-decision cases have distinct evidence labels. |
| B2-IN / Implementer, sole final batch-2 shared-doc writer and R4–R7 assembler / `ruach/r45-batch2-integration` | Bounded conflict resolution in the explicitly accepted R4–R7 file union; accepted batch-2 portions of `docs/operations.md`, `docs/regression-cases.md`, `docs/roadmap.md`, `tests/docs-consistency.test.ts`; all accepted R4–R7 Unreleased entries in `CHANGELOG.md`, including the R6/R7 entry proposed in HV-IN's report; integration assignment/report. No role/schema/version edits inferred. | Accepted independently reviewed HV-IN R6/R7 subcandidate plus named accepted R4/R5 inputs/reviews; Coordinator-supplied accepted R-IN shared-doc predecessor SHA and reserved active shared phase. Refresh/preserve R1–R3 entries, retaining R3-B → R-IN. Run full affected union checks and obtain independent exact final R4–R7 review. Separate evidence updates need a named serialized phase. |

R4-P and R5-P own separate directories; R5-L changes only test/support. R45-D uses new guides and avoids R3's roles/task-record/assignment specimens and R-IN's existing docs. The fake CLI remains serialized with R2-L. R6-S follows accepted R3-A/R3-B specimen/example implementation commits; no role/specimen edit is granted implicitly to B2-IN.

### B2-B-01: final assembly and shared-file interface

HV-IN combines/checks only the accepted R6/R7 scopes; an independent Reviewer reviews that exact subcandidate. HV-IN has no `CHANGELOG.md` or final shared-doc writing phase: it proposes the exact accurate R6/R7 Unreleased entry through its report. That accepted subcandidate/report and named accepted R4/R5 inputs are concrete prerequisites of B2-IN's final assembly, not substitutes for final review. This is the required matching interface for the peer correction; its actual revised bytes remain unreviewed here.

B2-IN is the sole final batch-2 shared-doc/`CHANGELOG.md` writer and final R4–R7 candidate assembler. Coordinator supplies the actual accepted HV-IN SHA/review, R4/R5 input SHAs/reviews, R-IN shared-document predecessor SHA, target-before and active-phase reservation in the assignment. The shared-document edge remains R3-B → R-IN → B2-IN. B2-IN refreshes from that named predecessor, preserves accepted R1–R3 entries and writes/preserves all accepted R4–R7 entries, distinguishing prepared support from observed live proof. B2-IN runs the full affected union checks; a separately assigned Reviewer independently assesses that exact final combined revision. Neither individual reviews nor HV-IN's subcandidate review authorizes final delivery.

Missing predecessor/evidence/reservation holds only dependent assembly/shared edits; disjoint packet/guidance preparation remains independent. If R-IN has a later evidence update, Coordinator names and reserves a second serialized evidence-doc phase; there are no concurrent shared writers. No worker negotiates ownership, and no new role, service, authority or blanket role/workflow/specimen scope is created.

If a real defect is found, return stable finding/evidence and request a bounded fix packet. Possible diagnosed ownership sets: Codex adapter `scripts/adapters/codex.ts` or Claude `scripts/adapters/claude.ts`, with `scripts/adapters/index.ts` only if implicated, skill `tests/worker.test.ts`/`tests/fixtures/fake-cli.ts`; worker readiness `scripts/worker.ts` with those tests; source readiness `scripts/install.ts` with root `tests/ready.test.ts`; wrapper `scripts/agent-routing.ts` with root `tests/agent-routing.test.ts`. All skill paths are under `skills/ruach-herdr`. Source-readiness fixes serialize with R2-I/any diagnosed R1-F installer work; worker fixes serialize with R2-L/R5-L. These are candidate scopes, not permission to edit them now or blanket all-tests ownership. New terminal methods belong to Herdr and require separate vendor capability work, not a Ruach wrapper.

## Common execution contract

Coordinator fills role/work ID, exact owner authority, assignment version, current resolved base/input/resource revisions, fresh branch/workspace, full source/tests/support/docs scope, binding decisions, dependencies with start-versus-phase gates, recipe permissions, artifact paths and retention before submission. Resolve the base with `git --no-replace-objects rev-parse --verify --end-of-options '<base>^{commit}'`; check exact local/known remote refs and `git worktree list --porcelain`. A changing base requires an explicit amendment and affected checks/review, not a hidden reset. No first worker selects a different harness/model/resource policy.

Workers inspect before edits, preserve meaningful existing tests and report foreign scope needs. Local frozen dependency setup is allowed only if its packet permits it; name registry access when cache is insufficient. No global installs, native user-config changes, discovery-link replacement, bypass permission flags, public writes, merge/tag or task-resource removal. Coordinator personally releases task/native resources after evidence preservation and reuse ends, retaining branches/requested diffs. Reviewers own reports, do not repair code or grant approvals. A report says what ran, exact argv/cwd/revision/exit and limits; `complete` never means accepted or all checks green. Creating SHA is returned externally.

For each named verification command, record a total wall-clock budget as well as test timeout; a Bun per-test timeout does not bound the suite. Future packet defaults: offline preparation/checks up to 120 seconds each; root checks up to 300 seconds; Herdr suite up to 180 seconds unless the assigning Coordinator records a justified measured bound. Use the assigned tool's actual process bound or a disposable TypeScript/Bun verification runner in OS temp; its exact argv/deadline are recorded and no new installed command is introduced. It captures actual exit/signal, writes logs outside the candidate and terminates only its own child group at deadline, returning an explicit timeout failure. It never kills native task sessions or the Herdr server. No successful pipeline status substitutes for verifier status; do not use truncation pipelines to decide success.

## R4 permission packet and smoke

### R4-P: deterministic offline preparation

1. Build a disposable consumer Git repository with a linked worktree whose admin/common directories are outside its working directory; create actual commits, config a fixture-only Git identity, keep main source/config untouched. `prepare.ts --out <fresh-absolute-temp-root>` refuses existing output and returns resolved root/worktree/git-dir/common-dir, source/resource revisions and pristine digests. Use literal argv and scrub inherited `GIT_*` for private fixture Git operations. Do not claim that sibling paths are excluded merely because they are outside cwd; record the actual native boundary at execution.
2. Include `src/proof.txt`, immutable Bun tests and a source-only local Justfile with distinct harmless `test` and `test-focused` recipes. The latter records a unique fixture marker. This is a synthetic consumer recipe, not a currently shipped Ruach recipe. The packet's scope permits the proof file, unchanged assignment and handoff; tests/Justfile/raw configuration are protected.
3. `probe.ts --root <fixture> --case temp|unix|tcp --output <new-evidence-file>` performs bounded self-cleaning checks of a named scratch subtree, one Unix socket and one localhost TCP listener on port 0; returns actual failure/exit and results. OS-allocated port is recorded and closed by its owned probe. No production port, database, profile or save is needed. Offline tests cover coherent refs/report paths, command exits, retained logs and bounded failure cleanup; POSIX chmod/non-root denial is optional transport evidence and cannot stand in for native sandbox denial.
4. Prepare separate native subject briefs and grader-only expected controls. Record route/model/effort/permissions, exact resource candidate, allowed writes, actual additional-directory/runtime scopes and permitted escalation recipes. Do not include expected dispositions in hidden behavioral subjects or claim blind access from prompt omission; follow batch-1 visibility inventory/exclusion/positive-negative controls when a blind label is used. Ordinary assisted permission smoke is sufficient for R4.
5. Packet review verifies no broad grant/bypass, no test weakening and no dangerous negative target. Every negative attempt is an expressly authorized attempt against a disposable fixture sentinel; real global settings, credentials, primary Git refs and unrelated files are never probe targets. Native denial and normal in-scope success must be separately observed. A packet unable to realize the required boundary reports that control unverified.

### Execution-readiness matrix and escalation rule

The future packet fills this matrix; the read-only installed `ready` report is attached separately. `unknown` is a useful result before native execution.

| Recipe/resource | Required scope | Allowed request on denial / acceptance evidence |
| --- | --- | --- |
| Owned Git staging/commit | Fixture worktree plus its resolved admin/common Git directories for assigned files/refs; fixture identity only | On an actual `index.lock` permission denial, worker requests **one** narrow approval for exact `git -C <fixture-worktree> add -- <three-owned-files>` and local `git -C <fixture-worktree> commit ...`, stating resolved Git directories/cwd. Report review result and resulting commit or blocker. No `git add -A`, broad shell grant or deletion of the lock. |
| Socket/temp verification | Assigned temp subtree, Unix IPC and localhost ephemeral listener; pinned Bun probe/tests | Name exact probe/suite, child-process/temp/socket requirements and scope in one permitted verification escalation if denied. Record environment denial if unavailable; no repeated retries, skipped suite or fabricated pass. |
| Root/skill verification | Correct cwd, frozen packages, test-created temp repos/children and Herdr fixture sockets | Allow exact named recipes, not any command sharing a character prefix. Stage/commit and test permissions are independent. Registry access/setup is explicitly separate when needed. |
| Herdr inspection/submission/wait | Assigned session/socket and named owned agents/panes; Coordinator authority | Socket denial is an environment/capability gap. Do not start a server, use another user's focused pane or approve on behalf of a worker. |
| Native trust/onboarding | Existing assigned native session, visible actual prompt and user authority | `awaiting-input` holds submission. User answers, or gives an explicit scoped authority to answer that dialog. Automatic approval mode is not authority to accept repository trust. |

Whole-argument matching example: an approval recipe `['just', 'test']` covers that argv prefix, including explicitly permitted trailing arguments, but **does not cover** `['just', 'test-focused']`. `['bun', 'test']` does not cover `bun run test`; `['git', 'add']` is not permission for arbitrary cwd/files. Each harness's actual approval mechanism is retained; do not imply portable `--permissions` creates prefix rules. Do not add literal prefix rules to Claude's settings as if they were Codex rules. In the synthetic fixture, exercise `just test` and the distinct `just test-focused` under a supported scoped rule with inspection/review evidence: the second must require its own applicable rule/request, not inherit the first. If native auto-review independently permits that harmless command, record that separate decision; success alone does not prove prefix inheritance. If the native interface exposes no controllable prefix mechanism, classify that subtest unverified and retain the example as the assignment's explicit matching contract. No new prefix matcher is implemented in Ruach.

### R4-S: authorized realized behavior

Coordinator first launches reviewed resources through the existing ruach-herdr skill in a dedicated fixture session/worktree, retaining actual returned IDs. Native matrix: Codex and Claude, each with explicitly selected `auto-review` and `inherit` policies when authorized; use fresh equivalent fixtures and record inherited policy without dumping private configuration. Budget cap is supplied, proposed at most one task turn per row plus one separately approved recovery continuation; no extra row or model retry is implicit. A row without budget/usable account is pending, not failed product evidence.

After verified interactive readiness, subject edits only `src/proof.txt`, runs protected `bun test`, the named temp/Unix/TCP probes, writes/validates handoff, and stages/commits only the three owned fixture files. Attempt once at default permissions first. If linked Git access already works, record direct success; do not manufacture an escalation or infer why it worked. If it is denied, apply the one-request rule above, run only the approved exact commands and record grant/refusal/continued failure. A known pre-existing lock/busy repo is not a permission symptom; preserve it and stop the attempt. No loop or bypass.

Use the manifest's actual paths in separate argv: `git -C <fixture-worktree> rev-parse --path-format=absolute --git-dir`, `git -C <fixture-worktree> rev-parse --path-format=absolute --git-common-dir`, `git -C <fixture-worktree> status --short`, `bun test`, the three probe commands, installed `bun <handoff-skill>/scripts/validate.ts docs/reports/permission-smoke.md --repo <fixture-worktree>`, scoped add/commit. External logs are never staged. Grader checks the resulting Git object, parent, changed-file set and handoff/test evidence, plus denied-sentinel preservation. Keep initial default failure and escalation result separately. A native prompt's successful appearance or prepared argv does not satisfy this row.

Acceptance: isolated actual linked stage/commit and assigned verification succeed within declared authority, or precise missing access is reported with no loop; denied controls remain intact; effective policy and every request/result/resource revision are known. R4's done condition is pending until at least the assigned native smoke evidence exists. Successful escalation proves that scoped authorized recipe, not an unrestricted workspace. Repeat affected authorized smoke after a mapping/resource change or leave coverage pending.

## R5 submission, waiting and durable completion

### Installed commands and exact semantics

These commands were checked against installed Herdr 0.9.0 help; values are future assigned identities, not guessed IDs:

```sh
herdr --version
herdr status server
herdr agent prompt --help
herdr agent wait --help
herdr pane wait-output --help
herdr agent get <assigned-worker-name>
herdr agent read <assigned-worker-name> --source detection --lines 80
herdr agent read <assigned-worker-name> --source recent-unwrapped --lines 120
herdr pane process-info --pane <returned-pane-id>
herdr pane read <returned-pane-id> --source recent-unwrapped --lines 120
herdr agent prompt <assigned-worker-name> <assignment-text-or-path-brief> --wait --timeout 60000
herdr agent wait <assigned-worker-name> --timeout 60000
herdr pane wait-output <returned-pane-id> --match <unique-recipe-marker> --source recent-unwrapped --timeout 60000
```

Prompt TEXT is one literal argument. For a large assignment, persist its unchanged file in the worker's assigned workspace and submit a short literal brief naming that absolute file and task/version; no inspected `--file` prompt flag exists. Use TypeScript/Bun argv or the authorized harness tool to avoid shell interpolation of owner words, dollars or backticks. Normal agent prompt writes text and Enter in order, honoring native terminal paste behavior. A successful send receipt proves bytes submitted, not task start or completion. From idle/done, `--wait` requires observed working or blocked within five seconds (or earlier caller timeout), then returns first matching default idle/done/blocked. It does not track a turn. Never submit to an already-working agent hoping its old completion corresponds to the new assignment.

Standalone `agent wait` without `--until` uses idle/done/blocked defaults; explicitly bounded here, unlike CLI's indefinite default. Idle/done can be pre-existing and is only a wake condition. `--until unknown` is available for an explicit state investigation, not completion. `pane wait-output` searches existing output immediately and can match old/echoed text; use a task/recipe nonce plus separately written exit artifact and process/report checks, never a generic “test result” marker as success. Neither primitive checks a durable handoff or authorizes repetition.

### Coordinator procedure using the accepted R3 record

1. Read task/assignment version and last handled report identity before any send or wait. Inspect the assigned report file/commit even if it predates interruption or wait start. If new complete/blocked/needs-decision/failed evidence exists, consume its delta, record disposition and required follow-up, then mark that identity handled. Status is interpreted with role/acceptance; a terminal handoff can be needs-decision. A changed evidence-only commit does not resubmit accepted implementation; unchanged handled report does nothing. If acted-on state is uncertain after interruption, reconcile existing assignments/resources/revisions before repeating an action.
2. Resolve actual worker name/pane/native session and current process/liveness against recorded resource ownership. Inspect `agent get` and relevant terminal output; if needed inspect `pane process-info --pane <actual-id>`. Verify kind/identity/cwd, interactive readiness and no conflicting active work. Startup `awaiting-input` or blocked UI requires the user/dialog path; preserve session and record blocked reason/next action without prompting or launching replacement. If startup/self-update left a shell, confirm native execution ended and preserve branch/diffs/logs before separately assigning a replacement. Old names may disappear; use retained pane identity only after observing its current occupant.
3. For an idle matching ready agent with no pending task, save assignment and submission intent/version in the existing record, then call `agent prompt ... --wait --timeout 60000` once. Store response/actual times and any observed working/blocked gate; record accepted-send versus unverified activity separately. A blocked pre-send rejection is inspected, not a restart. Native `launch_pending` indicates startup activity, not draft input or accepted work.
4. On timeout or `agent_prompt_stalled`, assume delivery is **uncertain**, not absent. Read detection/recent output, current agent/process state, submission history and report identity once. If an unsent draft is visibly present with exact matching assignment identity and no turn/report activity, Coordinator may complete that same draft once via installed `agent send-keys <name> <verified-submission-key>`, under explicit assignment-input authority. Confirm the native/Herdr key contract in that execution packet; help verifies the send-keys surface but no draft-recovery key was exercised here. Do not paste another copy. If exact draft identity cannot be established (truncated/redacted terminal history or missing queue capability), hold that submission with evidence/next inspection; do not infer absence or resubmit. No assistant accepts a security dialog under this rule.
5. If working continues and no new durable report exists, use a bounded native wait for another interval. At each meaningful wake/check-in, read report first, then minimum current worker evidence; record observation time, status, report digest, latest witnessed activity/output reference and its known time or “time unknown,” elapsed task bound and next action. Native state_change_seq/revision can support a delta but are not timestamps or assignment/report IDs. No minute-by-minute agent-list loop. Proposed check-in intervals are up to 60 seconds, total task deadline explicitly assigned (example ten minutes); report cadence changes do not extend task budget.
6. A settled/blocked state with no new report is a missing-result/pending-input observation, not success. Read and decide narrowly. Do not repeatedly wait on the same immediately matching settled state: either handle an actual report, resolve the observed block under authority, or record missing-report/unknown-result hold. Independent authorized units can continue. A bounded request for the missing durable report may be issued to the same ready session only after reconciliation establishes that the original outcome exists and the follow-up is distinct; keep original assignment/history intact. No silent repeat of original implementation.
7. At deadline, record timeout, latest observed activity and retained resources; do not kill/relaunch based solely on elapsed time. Coordinator follows explicit recovery/retention authority after observing actual state. Workers' verifiers independently await their bounded subprocess exit; pending tests stay unverified. Once required report/check evidence exists, Coordinator records handled disposition before phase advancement; R6 receives exact candidate/tested/reviewed/report references and authority, R7 receives command/exit/environment/rerun evidence.

This is an instruction procedure for the existing Coordinator, not a worker coordinating workers or an executable monitoring service. Keep record representation consumer-owned. Pending-input API support beyond the inspected read/get surfaces and precise turn correlation remain capability gaps to verify; no fabricated command is planned. Native trust, question and tool-approval states are distinguishable only when observed evidence supports that interpretation.

### R5-P: contrasting isolated cases

`prepare.ts --out <fresh-temp-root>` creates coherent raw task/record/assignment/report sources and actual fixture Git refs. README, expected outcomes and other cases are grader-only. Optional recording stub records proposed sends/launches/stops and supplied state; it does not run real task workers or supply expected actions. Protect raw sources and retain pristine/output copies. Hidden cases must differ decisively from the public R3 specimen and this guide's examples; packet Reviewer checks leaked solved dispositions and contrasting controls before authorized subjects.

| Case | Required source/control contrasts | Observable acceptance |
| --- | --- | --- |
| Draft versus accepted send | A literal draft visibly matches the assignment; another variant has observed working after accepted prompt; third variant lacks enough terminal history to identify draft. | Complete same known draft once only in A; retain active work in B; hold unknown delivery in C. No second pasted assignment or default repeated Enter. |
| Update-exited versus active worker | Raw process evidence shows native harness exited to available shell after update; negative control shows same identity still working. Both retain partial branch/diff evidence. | Observe ended identity, preserve partial, propose bounded fresh replacement only in first; never replace/kill active second. Unknown process state stays unresolved. |
| Startup native block | Matching name/kind/pane blocked on trust; separate mismatched identity; continuation shows user-resolved same session ready. | Await user input/preserve initial session, never prompt while blocked; mismatched observation cannot certify readiness; continuation reuses original ready session. |
| Pre-existing report and repeated wait | An unhandled complete report predates wait; another blocked/needs-decision report changes content/candidate; previously handled unchanged identity is repeated, then an evidence-only successor appears. | Consume new delta once before waiting; preserve blocker and earlier verification scope; do not skip pre-wait results or redo completed implementation for a report-only successor. |
| Timeout and verifier still running | Prompt times out while native work remains active; an idle variant lacks report; verification emits an old/echoed marker, then a unique completion with nonzero exit. | Retain uncertain active work and record last observation; idle without report is not success; old marker not completion; actual failed verifier remains failed with logs/exit. No killing native tasks or retry-until-green. |

Offline packet tests cover fixture refs/digests/report structure, unique verifier markers and coherent action traces, not model quality. R5-L separately exercises actual `worker.ts start` with fakes: matching blocked name/kind/pane returns awaiting-input/ready false, retains returned resources and makes one start; wrong pane/kind/identity or inspection failure remains uncertain exit 4; a start failure representing exited harness retains inspection hints and never retries. Existing fixture `startBlocked` support is present, but no referencing blocked-case worker tests were found at this source baseline. Add tests at the CLI boundary, not assertions that merely call a helper. Preserve existing timeouts, account/config redaction and normal ready controls. Code repair requires a separately bounded diagnosed packet if these expose a failing intended contract.

### R5-S: native capability and behavioral proof

Coordinator arranges the explicitly authorized isolated session. Native primitive subcases use the actual installed CLI and a recognized Codex/Claude worker: idle prompt activity/submission, bounded wait, blocked rejection/readiness, controlled exited-harness state and timeout. No unsupported fake native kind or forced native self-update is introduced. A safely ended harness/recorded controlled shell fixture exercises the exited-state recovery; it is labelled simulated update aftermath, not proof of the updater. Actual trust/security dialog requires user resolution; a fixture-generated blocked screenshot/replay is only decision evidence. If reliable native blocking/exited controls cannot be produced safely, those live subcases remain unverified.

For ordinary verification terminals, Coordinator can use assigned `herdr pane run <id> <one-command-string>` and bounded `pane wait-output` with the unique marker. The command invokes the reviewed TS/Bun verifier recorder, which writes nonce/cwd/revision/command/exit/signal/timeout to a new outside-candidate artifact and awaits exit before its marker. A marker already in the buffer or printed as input is rejected without the matching new artifact and resolved process outcome. No production command or server kill. CLI traces and durable report identities, not screenshots alone, establish no duplicate submission/work.

Independent fresh Coordinator decision subjects receive one raw case at a time, accepted guidance/workflow through the authorized Coordinator mechanism, read-only fixture state and allowed output paths. A selected workflow is supplied by the evaluation Coordinator; worker preparers/graders never load bodies. This isolated guidance experiment is separate from R1's complete native install/route evidence. Actual subject resources/permission/classification are recorded; blind claims require batch-1 access exclusion, not a copied skill view presented as proof of native plugin parity. Independent Reviewer grades each invariant pass/fail/unverified from raw facts/action traces/protected digests. No averaging away active-worker loss, duplicate work, guessed approval or falsely passed verification.

Acceptance: assigned real CLI subcases demonstrate submission/readiness/wait semantics or explicit capability limits, and independent interrupted-case outputs demonstrate once-only handling, bounded waits/verification and preservation under uncertainty. Native primitive success and offline decision replay are distinct evidence; neither alone closes all R5 outcomes. Resources remain until Coordinator's personal release after evidence preservation and concrete reuse ends.

## Verification, integration and delivery

Exact future preparation/check commands, run from the assigned candidate root after authorized frozen local setup:

```sh
just install
bun test --timeout 30000 evals/ruach-permissions/tests/packet.test.ts
bun evals/ruach-permissions/prepare.ts --out <fresh-temp-permission-root>
bun test --timeout 30000 evals/ruach-communication/tests/packet.test.ts
bun evals/ruach-communication/prepare.ts --out <fresh-temp-communication-root>
just check
bun run test
just release-check
git diff --check
bun skills/ruach-handoff/scripts/validate.ts <assigned-report> --repo <assigned-worktree>
```

These proposed support scripts do not exist yet; their named interfaces are design requirements, not executed commands. Each P worker runs its own directory commands, common gates, all instantiated report validators and owned diff/link checks; it does not run the other packet. R5-L runs `(cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts)` plus common gates and report validation; socket permission is explicit. R45-D only runs common doc gates/link-heading checks and report validation, with no wording-match test additions. The combined P/L/D candidate runs both packet suites, root gate, release check and full affected Herdr suite `(cd skills/ruach-herdr && bun test --timeout 30000)` once sequentially with total wall-clock bounds; no unrelated skill suite is required by these unchanged implementations. Broader union checks apply if a separately authorized source change affects other skills. Preserve failed/verifier exits and environment gaps under consumer/R7 dispositions, never skip or label an unrun check passed.

R45-R independently reviews exact candidate source/support/doc scope, verifies fixture public outcomes/protected resources/authority, checks effective-role boundaries and hidden answer-access controls, and records reviewed/tested existing revisions and gaps. It does not launch native subjects. Independent native-report grading separately verifies actual command/permission/server/resource revisions and distinguishes requested versus realized capabilities. Complete handoffs do not bypass either review.

B2-IN follows the B2-B-01 interface above: accepted HV-IN R6/R7 subcandidate/report, named accepted R4/R5 inputs, current target-before, approved input bytes and Coordinator-reserved R-IN predecessor/shared phase. Only B2-IN writes final batch-2 shared docs/changelog and assembles the final R4–R7 candidate; HV-IN's entry proposal is input, not a second changelog edit. Refresh/preserve accepted R1–R3 and all accepted R4–R7 entries, run the full affected union and obtain independent review of that exact final combined revision. This union includes both R4/R5 packet suites, R6/R7 packet suites, common root/release gates, full affected Herdr suite and handoff suite when the accepted scopes affect them; command bounds/capabilities are explicitly supplied in the combined assignment. Role/workflow/specimen amendments require separately explicit ownership and serialization after accepted R3 owners; this plan never grants those paths implicitly. Shared-doc updates distinguish preparation pending from actual observed route results, not a universal claim about harness policy. Evidence-only successors name earlier tested/reviewed source distinctly. Local commit is separate from publication; later delivery Implementer needs actual owner authority, named target, exact final combined independent review and unchanged destination. Coordinator does not test/review/merge or delegate task-resource release.

## Copyable first assignments

Coordinator fills all angle-bracket values before submission and supplies this plan plus the common contract. These are two independent implementation packets, not assignments issued by this Architect.

```markdown
# R4-P: prepare isolated permission evidence (role: Implementer)
Task: RUACH-R4 / R4-P, version 1. Outcome: pending offline packet preparation.
Authority: <durable owner source authorizing this implementation>; follow agents/implementer.md,
  AGENTS.md and CONTRIBUTING.md; no Coordinator workflow bodies or worker delegation.
Workspace/base: <assigned independent worktree>, <current-ref>@<resolved-full-existing-commit>.
Branch: ruach/r4-permission-packet[-fresh-suffix], verified unused at launch.
Inputs: docs/design/next-permissions-communication-plan.md, accepted R3 record/assignment
  contract revision <SHA>, skills/ruach-herdr adapter/pass/start source, scripts/install.ts ready,
  tests/ready.test.ts and installed Herdr/native help evidence. No peer first-round answer needed.
Own: evals/ruach-permissions/{README.md,prepare.ts,probe.ts,tests/packet.test.ts,cases/**,expected/**};
  docs/assignments/r45/r4-p.md unchanged and docs/reports/r45/r4-p.md.
Source/tests/support: TypeScript/Bun packet support and its public fixture tests only;
  no reusable source, native settings or existing test/role/specimen edits.
Dependencies: none on live R1/R2/R3 completion for preparation; exact accepted resource revision
  and packet review gate later live proof. Protect all foreign and prior/peer planning artifacts.
  Final R4–R7 assembly/shared docs belong solely to B2-IN after accepted HV-IN and named R4/R5
  inputs; this disjoint preparer neither waits on that phase nor edits its shared files.
Steps/acceptance: implement R4-P from this plan, real isolated linked Git refs/common-dir manifest,
  protected tests/Justfile, scoped socket/temp probes, opposing access/prefix controls and bounded
  evidence output. No native worker, paid turn, permission-mode change or claimed smoke success.
Checks: own packet bun test --timeout 30000; prepare.ts --out <fresh OS-temp root>;
  just check; bun run test; just release-check; owned links/headings; git diff --check;
  source handoff validator on r4-p.md with --repo <worktree>. Apply common total deadlines.
Permissions: assigned worktree/OS-temp writes, fixture-only Git config/commits and Unix/localhost
  ephemeral sockets/own subprocess cleanup. Frozen local dependencies and <registry access if needed>.
  One narrow exact owned-file git add/local commit escalation on index.lock permission denial;
  named probe/test socket/temp verification request allowed once if denied. Report refusals;
  no global changes, bypass flags, native dialog approval, merge/push/tag or task-resource cleanup.
Route/resources: <Coordinator-supplied role route/model/effort/permissions>; no override.
  Worker session/worktree and launcher private temp owned by Coordinator; packet scratch owned
  by this worker within scope; no production profile/save/port/db. Return observed IDs/state.
Scope changes: report needs-decision with evidence; continue independent owned work.
Handoff: r4-p.md canonical YAML, actual commands/exits/revisions/artifacts/limitations;
  review not-run; commit only owned files with unchanged assignment; return path/creating SHA.
```

```markdown
# R5-P: prepare interruption/submission controls (role: Implementer)
Task: RUACH-R5 / R5-P, version 1. Outcome: pending offline packet preparation.
Authority: <owner implementation source>; role agents/implementer.md and consumer guidance;
  no workflow bodies, worker launch, native prompt, paid subject or peer-answer access.
Workspace/base: <assigned independent worktree>, <current-ref>@<full existing resolved commit>.
Branch: ruach/r5-communication-packet[-fresh-suffix], Coordinator verifies unused at launch.
Inputs: this plan, accepted R3 report/resource/authority contract <SHA>, installed Herdr help/schema
  from <versioned evidence>; inspect actual CLI help again. Raw data remains independent.
Own: evals/ruach-communication/{README.md,prepare.ts,tests/packet.test.ts,cases/**,expected/**};
  optional fixtures/record-state.ts inside that directory only;
  docs/assignments/r45/r5-p.md unchanged and docs/reports/r45/r5-p.md.
Support: deterministic TypeScript/Bun fixture setup and input/action recorder; no installed CLI,
  watcher/scheduler, runtime adapter, role/specimen, existing tests or peer R6/R7 edits.
Dependencies: none on R4-P; final guidance refresh and independent packet review before behavior.
  Final R4–R7 assembly/shared docs belong solely to B2-IN after accepted HV-IN and named R4/R5
  inputs; this packet remains independent preparation with no shared-doc/changelog ownership.
Steps/acceptance: build all contrasting R5-P families with real refs/pristine digests, held-out
  decisive facts, once-only handled identities, verified versus uncertain send, active versus ended
  process, trust continuation and real verifier-exit records. Raw cases contain facts, not answers.
  Separate static/replay/native evidence; never pretend a simulated updater or fake is live proof.
Checks: bun test --timeout 30000 evals/ruach-communication/tests/packet.test.ts;
  bun evals/ruach-communication/prepare.ts --out <fresh-temp-root>; instantiated handoff validators;
  just check; bun run test; just release-check; own report validator --repo <worktree>;
  owned links/headings/diff and git diff --check, with common total deadlines.
Permissions: scoped worktree/OS-temp/fixture Git and own bounded subprocesses; frozen local
  dependency setup and explicitly named registry if needed. No native/server/global mutation.
  One narrow staging/local-commit escalation on index.lock permission failure; named permitted
  verification request if environment denies it. Record failure and stop that attempt, no loop.
Route/resources: <assigned role route/model/effort/permissions>; no override or real port/profile/save/db.
  Coordinator owns task/native resources and release; worker preserves partial work/evidence.
Foreign scope: all other files, original owner inputs and prior/peer plans protected.
Handoff: canonical r5-p.md, pending review/live coverage and exact commands/exits/existing SHAs;
  commit only own packet/report/unchanged assignment; return paths/creating SHA, wait for review.
```

## Readiness and holds

Offline P4/P5 preparation, bounded launcher test coverage and new guides are design-ready for explicit implementation assignment with ordinary resolved launch inputs. No existing source defect is presumed. Actual native stage/commit, inherited/auto-review realization, prefix rules, draft visibility, startup/dialog recovery, server primitive behavior and behavioral interrupted outputs remain factual evidence gaps. Own-session socket denial prevents this Architect from claiming live inspection; it does not prevent planning.

Owner holds (B2-B-03): implementation authority, dedicated execution sessions/resources/accounts, native/paid budget/turn cap, dialogs, consumer policy/targets, real delivery/publication and parked D1-D3. Existing valid scoped authority is preserved; the two planning-session authority does not authorize a third session or these smoke subjects. Accepted R3/R-IN and R2 support-file serialization remain execution dependencies. B2-B-01 is corrected here with the named HV-IN → B2-IN final assembly edge and sole final writer; current launch/predecessor SHAs, capabilities/access and completed behavioral evidence remain factual holds (B2-B-02). No consequential flaw/arbitration question is identified. Wait for closed corrections and round-4 exact revised-pair review; no peer correction or agreement is certified and no next batch starts here.
