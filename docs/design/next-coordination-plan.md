# R3: durable coordination and complete assignments

Status: proposed, implementation-ready planning; no implementation or behavioral evaluation performed. Architect assignment: [roadmap-coordination-plan](../reports/roadmap-planning/assignment-coordination.md). Inspected source base: `d75039aa7b82b262e2f28af08630258fb7f77180` on `ruach/sol-roadmap-coordination`, 2026-10-11.

Batch 1 correction round 3: updated under the [correction assignment](../reports/roadmap-planning/assignment-batch1-round3-coordination.md), inspecting `911aef754e7875f9e8a0463e9098ddf496216794`. Both closed round-2 reports were read. Accepted B1-A-001/B1-A-002 correct this plan; B1-A-003/B1-B-01 are accepted reliability-author corrections whose revised artifact remains pending. This revision is ready for exact revised-pair review, not a claim of agreement with an unseen peer revision. The owner's sequential batches and up-to-five-total-rounds-or-arbitration instruction supersedes historical one-correction-round limits; no later batch starts before agreement or recorded arbitration.

## Authority, inputs and outcome

The assignment authorizes investigation, this plan and its handoff, with a local commit. It does not authorize the future packages, paid evaluations, publication or packaging changes. A Coordinator must assign those packages separately. This is R3 from the current [roadmap](../roadmap.md#r3--one-durable-coordination-record-and-complete-assignments); references to roadmap sections mean the frozen 2026-10-11 inputs, not the older text at this worktree's base.

Read frozen copies of `docs/roadmap.md`, `docs/native-parity.md` and `docs/design/0.4-suggestions-from-ramec-orchestration.md` under `/tmp/ruach-roadmap-planning-20261011/`. Verified roadmap SHA256: `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`. The frozen native-parity document keeps D1/D2 and paid smoke evidence open; the RAMEC document's disposition table makes its earlier bookkeeping/merge-role proposals historical, rather than authority to create them. Canonical repository paths are cited throughout; temporary copies are evidence inputs, not editable source.

R3 succeeds when a resumed Coordinator can identify binding decisions, continue running work, consume each report once, preserve partial work and valid authorization, and issue complete bounded assignments without reconstructing state from memory. Extend the existing specimens and Coordinator/Architect guidance. No task database, new role, executable assignment lint, bookkeeping skill, scheduler or handoff schema change is needed.

## Verified constraints and precise gaps

| Inspected source | Supported behavior to preserve | R3 gap and planned change |
| --- | --- | --- |
| [task record](../examples/task-record.md), opening example and resume paragraph | Consumer chooses tracker/task folder; phase updates; assignments/reports/revisions/resources; check actual workers before replacement; preserve partial work. | Single flat snapshot lacks decision history, queued dependency reasons, resource owners and handled-report identity. Add linked sections in this one record. Replace “It does not assume an earlier approval still applies” with evidence-based scope validation that preserves still-valid authorization. |
| [assignment specimen](../examples/assignment-specimen.md), sample and closing checklist | Self-contained role/outcome/scope/test permissions/report/commit rule; protected docs; worker justifies scope change. | Broad source glob omits explicit support/docs ownership, binding decision IDs, dependency reasons, unused branch checks and route/resource allocation. Add a short manual pre-submission checklist plus conditional fields. |
| [Coordinator](../../agents/coordinator.md), Delegation, Launch recovery, Context, Advancement and Completion | Writes assignments into worker workspace; receives validated handoffs; no implementation/review/delivery by Coordinator; single owner; cleanup preserves reachable commits and requested diffs. | Durable state is mentioned only at completion; no decision/update/resumption protocol. Add concise record obligations at decisions, assignment/start/report/phase/queue/resource changes and compaction. Validate approvals from source rather than solicit them again by default. |
| [Architect](../../agents/architect.md), Responsibilities and Output | Inspect first; simplest design; decisions/assumptions/questions; design-only file boundaries. | Require bounded disjoint implementation packages with dependency reasons, source/tests/support/docs ownership, base resolution, resource needs and copyable first assignment. Architect proposes; Coordinator chooses scheduling within its authority. |
| [coordination owner contract](../coordination.md) | Exactly one Coordinator; outer launcher neither advances phases nor assigns task workers; confirm ended execution before replacement; consumers may explicitly share resources. | Link the richer record; do not turn it into a second authority or add a new owner. |
| [handoff skill](../../skills/ruach-handoff/SKILL.md), [schema](../../skills/ruach-handoff/handoff.schema.json), [validator](../../skills/ruach-handoff/scripts/validate.ts) | Four existing handoff statuses include `needs-decision`; optional extra metadata; all top-level revision/baseline fields resolve real commits with replacement refs ignored. Structure validation does not certify checks, truth or review. | Task/work states and decision histories stay in the consumer record. Link report evidence and preserve revision distinctions without modifying schema or conflating report `complete` with task acceptance. |
| [consumer example](../examples/consumer-example.md), delivery and cleanup | Original request can authorize local merge; independent combined review and unchanged destination still gate delivery; retained branches/diffs are valid. | Resume instructions must preserve this authorization, not add a universal approval gate. Package B adds a short record reference and ensures example wording agrees. |
| [authoring](../../CONTRIBUTING.md) and [ownership ADR](../adr/0001-source-and-consumer-ownership.md) | Shared resources edited here; consumers own decisions/catalogs/task evidence; realistic isolated eval inputs; rubrics withheld. | Add developer eval packet under `evals/`, outside installed skills; no consumer path/retention mandate. |
| [changelog skill](../../skills/ruach-changelog/SKILL.md), [integrated review](../reports/0.4/changelog-review.md), [Unreleased](../../CHANGELOG.md#unreleased) | Opt-in JSONL logs finished turns and supported compaction summaries; hook never commits; Codex compaction has no summary text; paraphrase is not owner wording. | Explicitly distinguish authoritative task record from discovery breadcrumbs. No hook edits, automatic decision extraction or changelog registration. |

Also inspected `agents/implementer.md`, `agents/reviewer.md`, `docs/assignments/0.3/impl-d.md`, `docs/examples/direct-compact-full.md`, root checks and the Librarian evaluation packet. Existing launch callers in `scripts/agent-routing.ts` and `skills/ruach-herdr/scripts/worker.ts` prepare/start workers separately from assignment submission and preserve uncertain resources. R3 records their actual outputs; it does not extend launch or wait primitives.

No Coordinator workflow `SKILL.md` body was opened. Before Package B is accepted, the assigning Coordinator must inspect the selected workflows for conflicting approval/resumption/ownership wording and return exact locations. Any needed workflow-body change is a separately owned follow-up, serialized with Package B; workers must not load or edit those bodies to discover the problem themselves.

## Design decisions for R3

These IDs identify choices proposed in this design, not consumer product rulings. The planning assignment settles scope constraints; implementation still requires a new assignment.

| ID | Design choice and rationale | Consequential alternative / reopening condition |
| --- | --- | --- |
| R3-D01 | Extend one task record and its assignment counterpart. Sections may link evidence; no duplicated authoritative ledger. Markdown/tracker representation remains consumer-owned. | Separate ledgers create reconciliation work; extract only after completed consumer tasks demonstrate a boundary this record cannot meet. |
| R3-D02 | Manual completeness checks suffice. Coordinator checks every outgoing assignment against the specimen; Reviewer checks packages and behavioral outputs. | Executable lint is deferred until repeated omissions establish a useful stable input schema; roadmap “lint” wording is not tool authorization. |
| R3-D03 | Persist a meaningful decision and its exact owner words before acting on it, and phase/work/resource changes before dependent actions. Consumer decides when to commit. | Mandatory immediate Git commits conflict with tracker records and requested uncommitted evidence. Durable write and commit are distinct. |
| R3-D04 | Validate continued authorization by evidence, action, target, scope, conditions and supersession; interruption alone never invalidates it. | Ask again only when authority is missing, genuinely ambiguous, revoked, expired or changed in a relevant way. This corrects the old resume sentence without weakening delivery gates. |
| R3-D05 | Separate proposals, owner choices and Coordinator operational choices; retain history with stable IDs and explicit supersession edges. | Collapsing all into “approved” loses attribution and authority. Coordinator may make scheduling choices within delegated scope; that does not confer product authority. |
| R3-D06 | Observe resource identity/liveness before recovery; age is evidence, not permission to kill/relaunch. Preserve active sessions and partial work. | A stale timestamp alone can belong to an active worker. Actual recovery capabilities remain R2/R5, not new R3 commands. |
| R3-D07 | A report has an observed identity and a handled identity/disposition. Consume a newly revised report once, even if written before a wait begins. | Wall-clock wait start and `complete` alone cannot identify already handled outcomes. Native R5 waits later use these fields. |

## Task-record contract

This is a specimen contract, not a JSON schema. Fields can be tables or tracker sections. “None,” “not assigned,” and “unknown; next observation …” are explicit values; blanks must not conceal missing authority. The Coordinator owns the record; workers write their assigned artifacts and handoffs, then the Coordinator records dispositions from evidence. Another document stays protected unless its owner grants edits.

### Identity, authority and decisions

- Task ID, outcome, selected workflow/mode and source reference; consumer guidance, record location, retention/commit policy, allowed record editor, single Coordinator owner and ownership-transfer evidence. A compact task may link one assignment rather than repeat every field; it still retains necessary state.
- Immutable decision IDs, such as `DEC-001`, never recycled on supersession; separate work IDs such as `WORK-01`. Alternatives use qualified identifiers (`DEC-004/A`), not several unrelated lists numbered “1.” Retain original references if IDs are renamed.
- For each consequential owner statement: exact words, date (time/zone if known), speaker/authority, durable source reference, question or decision IDs answered, recorded interpretation, status (`proposed`, `unresolved`, `accepted`, `rejected`, `superseded`) and scope/conditions. Do not invent an unavailable timestamp or quotation. Link bulky raw inputs, retaining exact deciding words in the record when allowed by consumer policy.
- Label worker/advisor recommendations as proposals with author/evidence; record Coordinator operational choices with delegated authority and reason. An owner can adopt either through a separate linked decision. A worker's recommendation, a summary or a merged branch is not adoption.
- Supersession records point both ways, state effective date and affected scope, and identify which assignments need revision. Superseding one choice does not silently revoke unrelated authorization. Keep rejected and superseded evidence under consumer retention policy.
- Ambiguous reply: preserve words/source/date, all plausible target IDs, and a narrow clarification question. Do not assign acceptance to any plausible target until mapped unambiguously by evidence or a new owner answer. Continue independent authorized units. Silence, elapsed time and a suggested answer do not resolve it.
- Missing recalled ruling: state the bounded locations searched and result; do not recreate it from memory. Ask for the missing ruling only if dependent action requires it.

An authorization entry links its decision ID and exact request to permitted action, scope, target, limits/conditions, validity/expiry if specified, revocation/supersession and resulting assignments. Use statuses such as active, conditional, unresolved, revoked, consumed-for-action. Repeated actions need their own scope check; “consumed” is evidence that an action occurred, not permission for another. On resume, re-read the source and compare the proposed action with these limits. An unchanged still-valid authorization is reused without another approval request. A moved delivery destination requires refreshed integration/checks/review; it does not automatically erase a broader owner's valid local-delivery authorization. Never relay or approve a native security dialog on a worker's behalf.

### Work, evidence and resources

| Record section | Required content and update trigger |
| --- | --- |
| Work units | Stable ID, bounded outcome, role, phase/state (queued/running/blocked/partial/complete plus separate acceptance), owned source/tests/support/docs, binding decisions, predecessor IDs and why each blocks start/integration/delivery, assigned base ref and resolved commit, branch/worktree and worker identity, assignment/report paths and assignment version. Update before submission and when actual state changes. |
| Progress and next action | Selected workflow phase, satisfied/pending gates, running units, ordered queued units, blockers with owner/evidence and specific next action, independent work while blocked. A completed implementation unit need not be accepted/integrated/delivered. |
| Revisions | Exact existing candidate/tested/reviewed/delivered commits, commands/scope/results and corresponding reports; unknown/unrun is explicit. Keep report-creating commit separate. Revalidate objects before reuse; resolving a commit alone does not prove it contains accepted work or passed checks. |
| Reports and handling | Report path; observed content identity (committed blob/commit or content digest when uncommitted), status and relevant revision; last handled identity/time/disposition/follow-up assignment. Only mark handled after durable disposition. Revised content is reconsidered for its delta; do not relaunch completed work because a later evidence-only report commit exists. |
| Routes | Requested role and effective harness/model/effort/permissions, declared route/catalog reference; explicit override authority, original/effective routes, reason, evidence and applicable work IDs. Record launch failures without inventing substitution. Do not duplicate secrets/native settings. |
| Resource ownership | Task/work owner, actual session/workspace/worktree identity and path, task-owned temporary directory where supplied; consumer allocations for port/profile/save/db or “not needed.” State active/reserved/retained/released/unknown, last observed activity/state with evidence, reuse reason, cleanup owner and condition. Never infer identity solely from a directory name or idle timeout. |
| Partial work | Ended versus still running, branch and reachable commits, requested uncommitted diff path and checksum/status, reports/logs, scope completed and pending, reason retained, next owner. Recovery must preserve these before replacement. Do not commit a consumer's requested diff without authority. |
| Phase events | Dated event, actor/authority, affected IDs, evidence and next action for decision/assignment/launch/blocker/report/review/integration/delivery/resource transfer or release. A concise history plus current snapshot suffices; no transcript dump. |

Handle interrupted writes by observing raw sources/reports and Git/native state, then recording a corrective event; do not claim atomic cross-system transactions. If a report was acted upon but its disposition was not persisted, investigate resulting assignment/revision/resource evidence before repeating the action. If still uncertain, hold that action and report the uncertainty rather than silently mark it done.

### Assignment completeness and revisions

Extend the existing sample, preserving its source/test boundary and `npm test` as a consumer-specific example. Do not mandate Ruach's Bun commands in consumer assignments. Include a second multi-unit example referring to the filled record below.

Before sending an assignment, the Coordinator manually checks:

1. Role definition, stable task/work ID, one pending outcome, current assignment version, binding decision IDs/words and relevant consumer authority are explicit. Workers follow their role and self-contained assignment, never inherited Coordinator workflow instructions.
2. Dependencies identify actual predecessor IDs and reasons; show which are already satisfied and which gate start versus later integration. Refer to conflicting owners by unit/path; do not make workers negotiate undocumented overlap.
3. Base symbolic ref is resolved immediately before launch to an existing commit. Branch name is unused (check exact ref and existing worktrees), repository/workspace are correct, and actual launch outputs are recorded. A later base change requires a versioned amendment or new assignment and appropriate renewed checks, not an invisible correction.
4. Enumerate owned source, adjacent tests, support/fixtures/hosts and docs; name protected/foreign paths and the scope-change procedure. “No tests/support edits needed” is a reasoned value, not omission. List mechanical sites only when the outcome actually needs them.
5. Acceptance describes observable behavior; verification names exact commands, cwd, bounds, evidence files, permitted test changes and environment/flake dispositions from consumer guidance. Allowed escalation requests name recipes and affected paths/sockets/temp access. Do not promise automatic approval or use blanket “no escalation” when a permitted commit needs gitdir access.
6. Consumer-supplied route/resource allocations are recorded or explicitly not needed; overrides carry authority. No default global profile/save/port is implied.
7. Report location, unchanged-assignment commit rule, retained diffs/branches/evidence, scope-change reporting, independent review and delivery boundary are explicit. Review briefs name the exact combined revision, task context and evidence, without prefilled passing results.

Do not edit an already submitted assignment invisibly. Keep the original/versioned amendment durable; deliver an amendment to the existing worker through the authorized mechanism and record whether it was received/applied. Supersession includes affected units and an action: continue within unchanged scope, stop only the affected portion, or revise after observing worker state. An assignment must not make the worker report `complete` before its actual result is known.

## Filled interrupted-task specimen

This example is synthetic consumer data, not a Ruach product decision or a real run. All words, dates, resource identities and evidence below belong to a throwaway CSV-export application. `fixture/r0`, `fixture/export-r1` and `fixture/export-partial` are fixture commit refs to be created in an isolated eval repository; they must actually resolve before a subject receives it. They are not claims about this checkout. Paths are illustrative consumer choices. No real session IDs, accounts, user data or production transcripts are included.

### Snapshot saved at 2026-10-11 09:20 UTC

Task `CSV-142`: correct CSV quoting and update its export screen/help. Workflow: consumer's compact feature process, independent combined review then local merge. Record: `docs/tasks/CSV-142.md`. Consumer policy `GUIDANCE.md`: keep this record and raw owner statements; commit record/assignments/reports at phase boundaries; retain branches and partial diffs until task acceptance; no push. Protected product decisions stay with the owner. Coordinator `coord-csv-old` ended at 09:18; assigning owner named replacement `coord-csv-resume` at 09:19 in `inputs/owner-transfer.md`; worker executions have not been terminated by that transfer.

| Decision | Exact words and authority/source/date | Interpretation, state and affected work |
| --- | --- | --- |
| DEC-001 | Owner, `inputs/owner-request.md`, 2026-10-10 16:00 UTC: “Fix CSV quoting and the export screen. After independent review passes, merge it into main locally. Do not push. Keep the partial work if a session ends.” | Accepted task scope and conditional local-delivery authorization AUTH-001; WORK-01/02/03/04/05/06. No expiry stated. |
| DEC-002 | Owner, `inputs/owner-help-1.md`, 2026-10-10 16:10 UTC: “Put the help example inline on the export screen.” | Superseded only for help placement by DEC-003. WORK-03 paused when changed; quoting and delivery authority unchanged. |
| DEC-003 | Owner, `inputs/owner-help-2.md`, 2026-10-11 08:45 UTC: “Instead of the inline example, put that same help example in the help file. Keep the quoting fix.” | Accepted; supersedes DEC-002 placement. WORK-03 assignment v2 pending; no change to DEC-001 local merge limits. |
| DEC-004 | Owner question from `inputs/questions-help.md`, 08:50 UTC: “1: Include a second example? 2: Include the UTF-8 note?” Worker proposes both in `reports/CSV-142/help-proposal.md`. | Proposed alternatives DEC-004/A (raw item 1) and /B (raw item 2); no owner choice. |
| DEC-005 | Owner question from `inputs/questions-review.md`, 08:51 UTC: “1: Review the screen first? 2: Review the quoting first?” Coordinator recommends quoting-first in that source. | Coordinator proposal; DEC-005/A (raw item 1) and /B (raw item 2) unresolved. Scheduling defaults do not imply either was accepted. |
| REPLY-001 | Owner, `inputs/owner-ambiguous.md`, 09:05 UTC: “1 ok, 2 ok.” | Unresolved mapping to DEC-004 or DEC-005; neither adopted. Clarification outstanding: “Does ‘1 ok, 2 ok’ answer the help choices DEC-004/A and /B, or the review choices DEC-005/A and /B?” |
| OPS-001 | Coordinator, `inputs/route-choice.md`, 2026-10-10 16:20 UTC: “Run screen work beside quoting; combine both before independent review.” | Operational choice under DEC-001 delegated task coordination; not owner product policy. Integration depends on both paths. |
| AUTH-002 | Owner, `inputs/route-override.md`, 2026-10-10 16:25 UTC: “Use the declared Sol alternative for the screen worker for this task.” | Active WORK-02 route override only. Catalog `config/routes.yaml` declares preferred Claude route and Codex `gpt-6.1-sol`, high effort alternative; effective permissions auto-review. No global route change or future retry authority. |

AUTH-001 permits WORK-06 local merge into `main` after independent combined review; valid within DEC-001 scope, not yet used. Latest source has no revocation. Destination currently `fixture/r0`; refreshed target observation and exact reviewed candidate still required. No tags, pushes or publication. REPLY-001 does not expand scope or invalidate AUTH-001.

| Work ID / state | Assignment/report, owned outcome and evidence | Dependencies / next action |
| --- | --- | --- |
| WORK-01 complete; accepted for integration only | `assignments/CSV-142/quoting-v1.md`; `reports/CSV-142/quoting.md`, `complete` at `fixture/export-r1`. Owns `src/export/csv.ts`, `tests/export/csv.test.ts`; no support/docs needed. Standard CSV reader round-trip tests passed at that ref; no combined review/delivery claimed. Branch `task/csv-142-quoting`; worker `csv-quote` ended and checkout released after reachable commit preserved. | No rerun of handled quoting assignment. WORK-04 must include this commit and reverify combined changes. |
| WORK-02 running; not complete | `assignments/CSV-142/screen-v1.md`; no handoff yet. Owns `src/ui/export.ts`, `tests/ui/export.test.ts`, `tests/support/export-host.ts`. Base `fixture/r0`, branch `task/csv-142-screen`, worker `csv-screen`. Last record update 08:30 looks stale; native observation at 09:17 in `observations/screen.txt` shows same harness working on tests. AUTH-002 override active. | Remains active; use existing session, preserve checkout; wait for unhandled report. Neither time since update nor Coordinator transfer licenses replacement. |
| WORK-03 partial; worker ended | `assignments/CSV-142/help-v1.md`; `reports/CSV-142/help-partial.md`, `blocked`. Original ownership `src/ui/export-help.ts` and `tests/ui/export-help.test.ts`; own inline work became superseded. Base `fixture/r0`; branch `task/csv-142-help` at `fixture/export-partial`. Saved uncommitted diff `retained/CSV-142/help.diff`, digest in `retained/CSV-142/manifest.md`; old worktree retained, execution ended per `observations/help.txt`. | Preserve superseded partial content as evidence. Author v2 for `docs/export-help.md` only, reuse the example content after inspection, do not merge obsolete inline code. Existing branch is used; replacement branch must be new. |
| WORK-04 queued integration | Future `assignments/CSV-142/integration-v1.md`, report `reports/CSV-142/integration.md`; branch reserved `task/csv-142-combined`. Own only bounded combination/conflict edits to WORK-01/02 paths and `docs/export-help.md`, plus integration report/assignment. No base resolved yet; resolve current accepted integration base at launch. | WORK-01/02 and amended WORK-03 complete with evidence: same deliverable must contain quoting, screen and current help placement. Do not integrate superseded help branch blindly. |
| WORK-05 queued independent review | Future `assignments/CSV-142/review-v1.md`; `reports/CSV-142/review.md`; Reviewer owns report only, exact WORK-04 combined revision assigned later. | WORK-04 tested combined commit required; review cannot certify disconnected unit revisions. |
| WORK-06 queued conditional delivery | Future `assignments/CSV-142/delivery-v1.md`; `reports/CSV-142/delivery.md`; separate Implementer, exact reviewed commit and observed target named later. | WORK-05 passes combined revision, target check and AUTH-001 scope validity. Coordinator does not merge. |

Handled reports: WORK-01 report identity `fixture/export-r1:reports/CSV-142/quoting.md` handled 08:20, disposition “include in WORK-04; release ended quote worker, retain branch.” WORK-03 partial-report content digest from `retained/CSV-142/manifest.md` handled 09:10, disposition “retain partial; author v2 after observing ended execution.” No WORK-02 report has been handled. A report written before the next wait starts still counts if its identity has not been handled.

| Resource | Owner/allocation and actual state | Retention/release condition |
| --- | --- | --- |
| Screen harness/workspace/worktree | WORK-02 `csv-screen`, workspace `fixture-w-screen`, worktree `/tmp/csv-fixture/worktrees/screen`; active, observed 09:17. Launch-private temporary directory `/tmp/csv-fixture/launch-screen`. | Coordinator releases only after preserved handoff and no next assignment needs it. |
| Preview port/profile/save | Consumer allocated port `4317`, profile `/tmp/csv-fixture/profiles/screen`, save `/tmp/csv-fixture/saves/export-demo.json` to WORK-02 only; active. Synthetic demo data, snapshot manifest at `retained/CSV-142/screen-state.md`. | No other unit uses these; capture needed reproduction data before Coordinator releases task-owned instances under consumer policy. No whole-process kill by port guess. |
| Help worktree | WORK-03 `/tmp/csv-fixture/worktrees/help`; retained with ended worker, committed partial and saved diff. | Retained pending v2 reuse/review; no discard on supersession. Branch remains reachable. |
| Quote branch | WORK-01 `task/csv-142-quoting`; retained, session/worktree released. | Consumer chooses branch retention; release of a session does not erase evidence. |
| Integration resources | WORK-04 branch name reserved only; no launched session/workspace/port/profile/save. | Check name remains unused at launch; screen allocations are unavailable to other workers. |

Phase history: 08:20 WORK-01 handoff handled; 08:45 DEC-003 saved before stopping only inline-help work; 09:05 REPLY-001 saved unresolved; 09:10 WORK-03 partial handled and retained; 09:17 WORK-02 liveness observed; 09:19 Coordinator transfer; 09:20 record saved. Current phase: implementation, not review/delivery. Blockers: WORK-02 handoff pending; WORK-03 amended work pending; DEC-004/005 mapping needed only for optional examples/review-choice adoption. Next actions: clarify REPLY-001, observe active screen worker, issue bounded help amendment/replacement after preserving partial, then assign integration when required inputs are ready.

### Concrete resume sequence

1. Read this record and consumer guidance, confirm owner transfer, inspect raw DEC-001/003/AUTH-002 and REPLY-001 sources. Read only relevant handoffs/manifest. Reuse still-valid AUTH-001; do not seek blanket approval again. Preserve unresolved reply and optional choices.
2. Reconcile actual native worker/workspace/worktree and Git refs using the consumer's declared read-only inspection mechanism. Record observations. `csv-screen` remains working: do not terminate or create a second screen worker. Confirm `csv-help` ended and partial branch/diff remain before assigning replacement.
3. Confirm WORK-01 report identity was handled and partial WORK-03 disposition exists. Do not resubmit quoting or reinterpret partial as complete. If a revised report arrives, compare its identity and delta before new action.
4. Send the narrow mapping question for REPLY-001 while advancing independent DEC-003 help work. Do not add optional examples from the ambiguous reply. Prepare help-v2 assignment, quote DEC-003, retain old v1 and partial artifact, choose an unused replacement branch such as `task/csv-142-help-v2` after checking exact refs/worktrees, resolve the base, and allow only `docs/export-help.md` plus assigned report/assignment edits. Inspect and reuse authorized example content without obsolete inline implementation.
5. Use the consumer's existing submit/wait mechanism for running WORK-02 and record last handled identity. R5 will later refine native waiting; this plan does not invent commands. Handle its report whether it predates the wait or follows it; retain needed profile/save reproduction evidence.
6. When mandatory units complete, assign a separate integration Implementer on a refreshed base; include exact inputs and reject superseded inline-help edits. Assign Reviewer to the resulting tested combined commit. Findings go to the responsible worker with bounded ownership; completed unrelated units stay handled.
7. After required independent review passes, validate AUTH-001 scope and refreshed destination. Issue separate delivery assignment for that exact reviewed commit; a moved target stops that attempt and refreshes integration/checks/review. Record delivery evidence and Coordinator-owned resource release/retention. No push, branch deletion or evidence disposal follows implicitly.

## Interfaces and deferred scope

| Package | R3 provides now | Other package owns / compatibility requirement |
| --- | --- | --- |
| R4 | Assignment fields for permission recipes, gitdir/socket/tmp access, escalation result and task-owned resources. | Prove adapter mapping and readiness with real isolated stage/commit/sockets. R3 must not claim permission fields grant native approval or fix launch recovery. |
| R5 | Work/worker identities, report observed/handled identity, assignment version/submission evidence, last activity and next action. | Verify native Herdr submit/readiness/wait capabilities; deduplicate unhandled report events, including pre-wait reports. No scheduler/mailbox added. A blocked report can be handled without resolving its blocker. |
| R6 | Decision authorization, source revisions, dependencies, retained/released resource state and report links. | Exact combined-review/destination gates, delivery receipts and any merge queue. Keep candidate/tested/reviewed/delivered separate; no new status/schema required by R3. |
| C1 | Stable proposition/decision IDs, attributed proposals/choices, owner words, scoped output ownership, roster route overrides, phase/round work IDs and retained artifacts. | Council workflow defines independent-round access, manual/automatic count and synthesis. A member's proposal remains a proposal; round completion is not owner adoption. Record round dependency/access reasons; R3 does not implement a council or choose experts. |

R1/R2 have no prerequisite relationship to the specimen/role/eval preparation: R3 can proceed independently. Coordinate shared docs/reports through explicit ownership; do not modify R1/R2 code or their release/native evidence. Successful isolated behavioral execution may require R1's established usable route, but fixture preparation and static review do not. R4/R5/R6/C1 can reference these fields without a shared schema migration.

The actual shared implementation document is `CHANGELOG.md`, owned for different Unreleased entries by R3-B and reliability R-IN. Matching serialization rule (B1-A-001): R3-B writes its one R3 bullet first. R-IN's final changelog-edit phase waits for the independently accepted R3-B commit, refreshes that file to include the accepted entry, and preserves it while adding R1/R2 entries. The assigning Coordinator names the full accepted commit, file ownership and this phase-specific dependency in R-IN's assignment/amendment; it is not left to workers to negotiate. Disjoint R-IN preparation and R1/R2/R3 units may continue independently. Before combined review, the integration Implementer verifies both accepted entries survive at the final candidate. `docs/roadmap.md`, `docs/native-parity.md`, `docs/operations.md`, `docs/regression-cases.md` and `tests/docs-consistency.test.ts` remain R-IN-owned; R3 has no ownership of them.

R1 native-smoke assignments identify the actual installed/tested resource commit, including role/specimen versions. If a newer candidate includes R3 guidance, observations from an older resource revision remain attributed to their original SHA; they do not prove behavior of the changed guidance. Any required re-observation is a separately authorized smoke/evaluation run. R3 changes neither the R1 evidence ledger nor its execution authority.

R7, C2–C5, M1 and D1–D3 remain deferred. R3 carries consumer resource allocations and evidence references without implementing runtime QA, adapters, flake policy, benchmarking, packaging or profiles. Keep integrated `ruach-changelog` unchanged and unreleased; no version/tag/release changes.

## Bounded implementation packages

These are future assignments with pending outcomes, not completed work. Durable package assignments/reports use `docs/assignments/r3/` and `docs/reports/r3/` as this repository's proposed task locations; a Coordinator may select different consumer paths explicitly. The plan remains owned by this Architect for corrections, not by Implementers.

### Common base, workspace and permission rules

Before each launch the Coordinator resolves the chosen base to a full existing commit using `git --no-replace-objects rev-parse --verify --end-of-options '<base>^{commit}'`, records it in the assignment, and checks the exact new local branch with `git show-ref --verify refs/heads/<branch>` plus `git worktree list --porcelain`. Check known remote refs and worker/resource reservations as relevant to consumer policy. Absence must be established, never assume a proposed name remains unused. All proposed names below were absent from local branch enumeration at inspected base; check again at execution. No network fetch is implied. If a name is used, select and record a fresh suffixed name, not delete/reuse it silently.

R3-A starts from the Coordinator's selected current source base (planning base was `d75039a`); R3-B starts after accepted A; R3-C can prepare fixtures alongside B on accepted A with a final refresh against accepted B; R3-D/E review/evaluate the exact combined candidate. Source updates since planning require diff inspection, not a blind reset to the inspected base. Assign independent linked worktrees through the authorized consumer launcher; routes are resolved separately. No new route override is proposed.

Allow local pinned `bun install --frozen-lockfile` only in the root and existing executable skill directories if needed. No global installs/settings writes, new dependencies or weakened checks. All workers may request one narrowly scoped escalation on gitdir `index.lock` staging failure for owned-path staging/local commit; record the request and outcome, never loop. Named verification may require sandbox socket/tmp permission; if blocked, report exact command/exit and environment limitation. Workers do not approve native dialogs for each other. Paid/model evaluation requires separate explicit authority.

Common technical checks on changed source: `just check`, `bun run test`, `just release-check`. Each report: `bun skills/ruach-handoff/scripts/validate.ts <report> --repo <worktree>` after local frozen skill setup, plus `git diff --check` and owned-path diff inspection. `just check` checks relative file targets but does not establish behavior or headings. Check changed Markdown headings/relative targets manually. No new wording-match tests for prose. Handoff schema/validator are unchanged; run `bun test` in `skills/ruach-handoff` for the combined candidate as supporting existing-contract verification. Root `bun run test` excludes skill suites; do not call it “all tests.” No Herdr suite is required for R3-only prose/fixtures because adapter/launcher source does not change; affected executable skill suites become required if a separately authorized amendment changes those skills.

### R3-A — extend existing specimens (Implementer)

Branch proposal `ruach/r3-specimens`. Owned docs: `docs/examples/task-record.md`, `docs/examples/assignment-specimen.md`. Owned source/tests/support: no runtime source or automated tests; support is the embedded synthetic specimen only. Also own unchanged `docs/assignments/r3/specimens.md` and `docs/reports/r3/specimens.md`; no other files.

Steps: inspect current specimens/consumer authority; add the field contract, compact/manual checklist and filled interrupted example; replace blanket resume-approval wording with scope validation; retain simple/direct task proportion and existing CSV test permissions. Use links rather than paste role/workflow bodies. Explicitly label synthetic evidence and never put invented commit hashes into a real structured handoff. Verify source references, all acceptance topics and resume trace. Commit owned docs/assignment/report only.

Acceptance: decisions distinguish words/source/choice/proposal/ambiguity/supersession; valid authorization survives interruption; running/queued/partial/handled states and dependency reasons are actionable; source/tests/support/docs/base/branch/route/resource/report permissions explicit; no new tool/role/schema/consumer policy. Realistic synthetic example covers all specimen requirements. Checks: common checks and manual trace of resume steps against record/evidence (not a behavioral pass). Report `docs/reports/r3/specimens.md`. Independent review must examine the creating revision before B treats A as settled.

### R3-B — role and surrounding guidance (Implementer)

Branch `ruach/r3-guidance`, base accepted A. Owned source contracts: `agents/coordinator.md`, `agents/architect.md`; owned docs: `docs/coordination.md`, `docs/examples/consumer-example.md`, `docs/examples/direct-compact-full.md`, a single accurate R3 Unreleased bullet in `CHANGELOG.md`. No tests/support/runtime source edits. Own unchanged `docs/assignments/r3/guidance.md` and `docs/reports/r3/guidance.md`.

Steps: use concise specimen links; require decision/phase writes and compaction re-read; add actual-state reconciliation/handled-report obligations and permission/authorization distinctions; require Architect packages with disjoint ownership and reasons for serial steps; align example links/authorization wording while preserving direct/compact/full choice and cleanup. Write the one R3 Unreleased bullet before R-IN's final changelog-edit phase; hand off its commit for independent acceptance, after which the Coordinator supplies that accepted SHA to R-IN to refresh/preserve the entry. Do not edit R-IN-owned docs/tests. Obtain assigning Coordinator's workflow-only compatibility inspection. If it identifies a contradiction, report locations and bounded follow-up rather than edit unassigned workflow bodies. No edits to Implementer/Reviewer/handoff/hook/routing policy.

Acceptance: canonical role authority unchanged; Architect never implements or coordinates workers; Coordinator never validates/reviews/merges; owner remains singular; unchanged authorization is reused; protected decisions and requested diffs survive; record update duties precede dependent action. A and B must be serialized because B cites A's settled contract and source guidance must have one wording owner. The accepted R3 changelog commit and R-IN's named wait/refresh/preservation gate are explicit; the gate applies to that final file-edit phase, not all R1/R2 work. Common checks; independent review of role/consumer/workflow consistency supplied by Coordinator. Report `docs/reports/r3/guidance.md`.

### R3-C — prepare isolated behavioral packet (Implementer)

Branch `ruach/r3-eval-packet`, base accepted A; can run alongside B with disjoint ownership. Owned support/docs: `evals/ruach-coordination/README.md`, `evals/ruach-coordination/cases/**`, `evals/ruach-coordination/expected/**`; owned test-support code only if necessary: `evals/ruach-coordination/prepare.ts`, TypeScript/Bun, deterministic offline fixture setup. No installed resource/root checker/test edits. Own unchanged `docs/assignments/r3/eval-packet.md`, `docs/reports/r3/eval-packet.md`.

Steps: create independent held-out raw cases and evaluator-only rubrics below; keep the useful public worked specimen but do not derive a subject task's solved disposition from it. Vary decisive liveness, handled identity, supersession scope and authorization/target topology, including controls with different correct actions; renaming alone is insufficient. Preserve source/subject boundaries; if fixture generator needed, create real local Git refs and coherent reports/diffs, validate those reports with existing validator, isolate all generated state in OS temp, and document exact preparation command. Do not add a database/mock scheduler/new CLI. Verify pristine sources/refs/digests and input access with deterministic preparation checks; refresh subjects to exact accepted A+B candidate. Do not run or grade a model subject.

Acceptance: packet can be instantiated offline; expected answers never in subject paths/prompts; liveness/partial/supersession/report identity are source facts; route override and resource ownership come from synthetic consumer authority. Positive and negative controls require different dispositions, so copying the public resume sequence fails at least one control in each case family. Packet review compares every subject-visible worked example and raw case for answer leakage; the evaluator-only comparison identifies decisive source differences and their observable consequences before paid execution. Common checks plus actual `bun evals/ruach-coordination/prepare.ts --out <fresh-temp-dir>` if implemented; record exact realized invocation/output and validate generated reports individually. No claimed command success before implementation. Report `docs/reports/r3/eval-packet.md`.

### R3-D — independent candidate review and integration boundary (Reviewer; separate Implementer when needed)

Branch `ruach/r3-review`, base exact combined A+B+C candidate prepared and verified by a separately assigned integration Implementer. Reviewer owns only unchanged `docs/assignments/r3/review.md` and `docs/reports/r3/review.md`. Review source contracts, specimen completeness, raw fixture coherence, blind boundary and common-check evidence; repeat common checks and handoff suite on candidate. Compare subject-accessible solved examples with each hidden raw case/control for answer leakage; require evidence that decisive differences change the correct next action, not only names. Reject copied worked-case dispositions before paid execution. Trace changed authorization/ownership rules against owner constraints; distinguish static review from behavioral evidence. No code/doc fixes by Reviewer. Report findings with locations/evidence and `reviewed_revision`; no fabricated acceptance.

If integration is needed, separate branch `ruach/r3-integration`; Implementer may combine only accepted A/B/C files and assigned integration artifacts, resolve bounded conflicts and rerun common checks/handoff suite. No changes to this plan or R1/R2; broad conflict returns to Architect. Report `docs/reports/r3/integration.md`. Coordinator serializes combined candidate creation, review/fixes and any delivery assignment. Changed candidate needs affected checks/review repeated; report-only successors identify tested/reviewed revision separately.

### R3-E — independent behavioral evaluation (separately authorized Coordinator and Reviewer assignments)

Branch `ruach/r3-evaluation`; expected/rubric access belongs only to the grading Reviewer, not blind subjects. An authorized evaluation Coordinator arranges native fresh Coordinator subjects from exact candidate resource revision, following its own selected workflow; the evaluator is not a worker secretly coordinating other workers. Grading Reviewer owns unchanged `docs/assignments/r3/evaluation.md` and `docs/reports/r3/evaluation.md`, with permitted synthetic run evidence under consumer-selected retained evaluation location. Subject outputs remain in isolated fixture folders; no production task resources or writes to source guidance.

Dependency: accepted packet, exact A+B combined source and separately authorized route/budget/session policy. Readiness/offline setup is not paid-session authority. Reviewer evaluates actual outputs after blind runs; records subject resource revision/model/effort/permissions, command/tool observations, outputs, deviations and run limitations. A failed or incomplete case stays failed/unverified. No subject was run for this plan. Review/delivery must not present R3's behavioral done condition as established until this evidence exists. If corrections are needed, assign narrow A/B/C owner fixes, refresh candidate and independently rerun affected cases.

No push/merge/tag/publish by A–E. A later separate delivery Implementer can deliver only after combined independent review, sufficient behavioral evidence and valid authorization to a named target; exact reviewed revision and destination-not-moved gate remain. Coordinator personally releases native task sessions/workspaces/worktrees under consumer retention rules; bounded verification subprocess/offline scratch cleanup remains permitted within a worker's scope. Uncertain resource IDs remain inspection hints, never automatic cleanup targets. Planning worktree/session remains available for the owner's sequential batches with up to five agreement rounds or recorded arbitration; no cleanup is authorized here.

## Behavioral packet specification

Follow the give/withhold separation in [Librarian packet](../../evals/ruach-librarian/README.md). Proposed layout:

```text
evals/ruach-coordination/
  README.md                    # evaluator setup/access boundary; withhold
  prepare.ts                   # optional offline fixture builder; withhold
  cases/01-resume/task.md
  cases/01-resume/corpus/{GUIDANCE.md,record.md,inputs/,assignments/,reports/,observations/,retained/,app/}
  cases/02-ambiguity/task.md
  cases/02-ambiguity/corpus/{GUIDANCE.md,record.md,inputs/,reports/}
  cases/03-authorization/task.md
  cases/03-authorization/corpus/{GUIDANCE.md,record.md,inputs/,reports/,observations/}
  expected/rubric.md            # grader-only expectations and failure evidence
```

Give each fresh native subject only candidate `agents/coordinator.md`, linked candidate specimens/handoff skill, its one task, isolated corpus and the subject's explicitly selected workflow through the authorized Coordinator mechanism. A native Coordinator legitimately loads that workflow; an Implementer/Reviewer preparing/grading the packet must not. The evaluation Coordinator supplies workflows separately; fixture subject guidance contains no substitute workflow. Provide required source skills at a whitelisted resource root, not the entire source tree containing rubrics. Withhold this plan, README, expected directory, preparation implementation, other cases and prior worker conclusions. A full plugin fetch may retain developer files on disk: use an isolated allowlist/copy to make withheld artifacts inaccessible rather than merely tell the subject not to read them.

Each corpus contains raw owner messages with two plausible numbered question lists, immutable prior assignments, genuine committed fixture revisions/handoffs, original partial diff/manifest and timestamped observation records. Use a consumer-owned script or callable recording stub to supply actual read-only fixture state and record submit/stop/launch attempts without launching real task workers; document that this tests instruction decisions against supplied state, not live Herdr correctness. Script inputs describe identities/state, not “expected action.” Native submission/liveness/race behavior remains R5/R2. Protected raw files remain byte-identical; preserve original copy and subject output separately. The subject may update record and draft assignments/reports within the case's allowed paths. No product implementation or local merge is needed to measure R3 behavior.

The CSV-142 specimen remains public instruction material, not a held-out test corpus. R3-C must prepare independent synthetic consumer histories and decision graphs for the cases below; it cannot reuse that specimen's raw inputs, solved sequence or identical distinctive combination of facts. A different task name alone does not satisfy this boundary. Put the example-to-case comparison and expected controls in `expected/rubric.md` or another grader-only file, never in the subject task/observations/record. The public specimen may teach general invariants; the hidden facts must determine different next actions. The variants below define required evidence contrasts, not facts to prefill as successful runs or actual consumer product decisions.

| Case / raw trigger | Observable subject task | Hidden rubric / decisive failure |
| --- | --- | --- |
| 01-resume | Independent task history: unit A is recorded as running, but later native evidence confirms ended execution and retained partial work; unit B is recorded as ended, but current matching identity shows active work and exclusive resource ownership. A completed report is present but unhandled. A previously handled report has a new content identity and changed candidate with an unresolved verification blocker. Produce reconciled record and bounded next assignments without implementation/delivery. | Positive ended-execution control: replacement of A may be assigned only after preservation/identity checks, rather than simply waiting as in the public active-worker example. Negative active-execution control: do not replace B. Handle the previously unhandled complete report, reconsider the amended blocker once and do not treat old checks as validating its changed candidate. Preserve other already accepted/handled work. |
| 02-ambiguity | Independent decision graph: owner response omits IDs and two lists exist. Variant A has a separate raw owner source unambiguously naming which list the response answers; variant B has no mapping evidence. A later decision supersedes scope of a different queued unit entirely while leaving another independent unit authorized. A continuation provides an explicit ID-mapped answer for B. | Positive mapping control: A records the evidenced choice without redundant clarification. Negative mapping control: B asks narrowly and does not guess. Supersession cancels/revises only the affected queued assignment rather than merely changing help placement; retain history and advance the independent authorized unit. The continuation changes only the actually answered IDs. |
| 03-authorization | Independent authority/target topology: original owner request permits local merge only into a named task branch, not main. Variant A has unchanged scope/target and matching combined checks/review. B changes the requested target without owner authority while the old target remains unmoved. C explicitly revokes merge but leaves verification permitted; D supersedes an unrelated resource choice with the original scoped merge authority intact. Subject drafts next assignment/record without merging. | A reuses valid authorization for the named task branch, never copying the specimen's main target. B holds the new-target action for authorization even though Git has not moved; it does not broaden the existing grant. C honors revocation and continues permitted verification. D preserves unrelated valid authority. No push, self-merge or inference of checks at an untested later revision. |

Case 01 supplies its new/changed report identities before a resumed wait begins, then supplies the same identity again in continuation. Include a parallel unchanged already-handled report control: the subject must handle new evidence once and ignore the unchanged duplicate, not skip every completed report or relaunch all completed units. Preserve original partial commit/diff digests. Case 02 stores advisor proposals, Coordinator ordering and owner evidence separately; their authority edges must differ from the public help-choice sequence. Resource manifests allocate port/profile/save to the actually active unit B; its stale record does not grant them to replacement A. Route source authorizes one declared override only; invented substitution/global catalog edits fail. Maintain an additional moved-destination control in case 03: it requires integration/check/review refresh under valid scope, whereas variant B's unapproved new target requires missing authority to be resolved. These different reasons/actions must be visible in subject output without exposing rubrics in its inputs.

Grading reports cite raw input and output locations, actual action/assignment traces, preserved digests and revised record fields. Grade each invariant pass/fail/unverified with reasons; critical errors (lost authority/partial work, duplicate/replacement of active work, guessed approval, unauthorized delivery) cannot be averaged away. Accept different prose/layout. Do not grade exact wording or inferred consensus. Separate static packet validity, role review and behavioral result. Record single-run limitations; repeated runs and comparison with prior resource revision are useful only within separately granted evaluation budget. No green static check substitutes for a blind subject run.

Before execution, independent packet review lists the accessible public examples, protected raw sources, and hidden expected files; verifies no expected case disposition is supplied as a solved example; and checks both sides of every decisive control. A copied CSV-142 next-action sequence must fail these held-out controls. An inaccessible rubric alone cannot cure a subject-visible solved case. Reject/revise a leaking packet before launching subjects; do not claim this planning revision already establishes that check or a behavioral pass.

## Copyable first Implementer assignment

The assigning Coordinator must fill the resolved base, checked unused branch and policy paths before submission. These are required fields, not permission for the worker to select a different base/route. The outcome remains pending.

```markdown
# Assignment R3-A (role: Implementer)
Task/work: RUACH-R3 / R3-A. Assignment version: 1. Outcome: pending specimen extension.
Role: agents/implementer.md; follow AGENTS.md and CONTRIBUTING.md. Do not load Coordinator workflows.
Workspace: assigned independent worktree of this repository.
Base: <Coordinator-selected-ref>@<resolved-full-existing-commit>.
Branch: ruach/r3-specimens (Coordinator must verify unused immediately before launch).
Binding authority: owner authorized R3-A implementation in <durable-source>; this plan alone does not authorize it.
Inputs: docs/design/next-coordination-plan.md, docs/examples/task-record.md,
  docs/examples/assignment-specimen.md, agents/coordinator.md, agents/architect.md,
  docs/adr/0001-source-and-consumer-ownership.md, skills/ruach-handoff/SKILL.md.
Dependencies: none on R1/R2; B waits for accepted A to reference its settled specimen contract.
Own: docs/examples/task-record.md, docs/examples/assignment-specimen.md,
  docs/assignments/r3/specimens.md (this assignment unchanged), docs/reports/r3/specimens.md.
Tests/support: no runtime/test edits; embedded synthetic support specimen only.
Foreign/protected: all other paths, including this plan, roles, workflow bodies, R1/R2 work and consumer decisions.
Acceptance: implement R3-A and the task-record/assignment contract in the plan; include a coherent synthetic
  interrupted multi-unit record, supersession, ambiguous owner response, active/complete/partial work,
  durable scoped authorization, route override and owned port/profile/save. Resume without repeating handled
  work; manual completeness checks suffice; no new tools/roles/schema. Preserve simple consumer examples.
Steps: inspect current specimens and nearby contracts, update bounded prose/examples, manually trace resume,
  verify links and exact diff, write truthful structured handoff, commit only owned paths.
Checks from repository root: just check; bun run test; just release-check; git diff --check.
  Verify changed links/headings and specimen consistency manually. No blind behavioral evaluation is assigned.
Setup/permissions: local frozen installs in root/existing executable skills allowed if needed; no global writes,
  network/paid sessions/new dependencies. Request narrowly scoped escalation once on gitdir index.lock
  failure for owned-path git add/local commit; permitted checks may request socket/tmp access when required.
  Record denial/environment limits; do not retry indefinitely or weaken checks.
Route/resources: Coordinator supplies <resolved route/catalog>; no override authorized here.
  Worker worktree/session and launcher temp directory task-owned; no port/profile/save required by R3-A.
Scope change: report justification/needs-decision; continue independent owned work; Coordinator decides.
Handoff: docs/reports/r3/specimens.md; leading ruach-handoff YAML; actual commands/exit codes,
  inspected/tested existing revision, changed artifacts, findings/limitations, review not-run.
  Run bun skills/ruach-handoff/scripts/validate.ts docs/reports/r3/specimens.md --repo <this-worktree>.
  Commit assignment unchanged with report and owned docs; do not predict report-creating SHA inside itself.
Review/delivery: independent exact-revision review required; no merge/push/tag/publish/cleanup.
  Retain workspace for the declared review correction round; Coordinator owns later cleanup.
Return report path and creating commit SHA; do not prefill completion or acceptance.
```

## Copyable independent review and evaluation assignments

```markdown
# Assignment R3-D (role: Reviewer)
Task: RUACH-R3-review. Outcome: pending independent review; no approval presumed.
Workspace/base: independent worktree at <exact-existing-combined-candidate-SHA>, branch ruach/r3-review
  after Coordinator checks unused name; role agents/reviewer.md, no workflow bodies.
Binding inputs: owner R3 authorization, docs/design/next-coordination-plan.md and assignment acceptance;
  candidate A/B/C handoffs, consumer authority, Coordinator-supplied workflow compatibility findings.
Review only exact candidate scope: specimens, Coordinator/Architect guidance, listed surrounding docs and
  eval packet. Do not accept disconnected unit review as combined acceptance or static checks as behavior.
Own only docs/assignments/r3/review.md unchanged and docs/reports/r3/review.md; no source/test/support edits.
Dependencies: combined candidate and integration-check evidence; missing workflow-only compatibility
  findings are a bounded inspection gap for Coordinator, not worker authority to load those workflows.
Acceptance: check all R3 invariants, manual checklist sufficiency, authorization preservation and role
  boundaries; inspect filled specimen/raw fixture coherence and give/withhold access, including resource
  and report identity controls. Compare subject-visible solved examples to every held-out raw case; require
  decisive liveness/handled-state/supersession/authority differences and positive/negative controls with
  different correct actions, not renamed copies. Reject answer leakage before paid execution. Check the
  accepted R3-B changelog SHA and named R-IN final-edit wait/refresh/preservation gate.
  Return severity/location/problem/evidence/suggested direction, or explicitly
  no material findings. Behavioral results remain pending unless actual independent run evidence is supplied.
Checks: just check; bun run test; just release-check; (cd skills/ruach-handoff && bun test);
  git diff --check; validate own report with --repo; inspect changed link/headings and raw fixtures.
Permissions: local frozen dependencies/OS-temp investigation and named checks allowed; no paid/native
  subject launch, global settings, production edits or merges. One narrowly scoped gitdir staging/commit
  escalation for owned artifacts if needed; report environment failures accurately.
Route/resources: Coordinator-supplied Reviewer route; no override or port/profile/save needed.
Handoff: reviewed_revision and tested_revision name actual candidate/check revision; review status based
  on findings, never inferred from worker complete. Commit owned assignment/report only, return SHA.
Delivery/cleanup: separate authorized Implementer after review/evaluation gates; Coordinator cleans.
```

Evaluation is deliberately a separate blind execution/grading arrangement, not hidden extra work in the source review:

```markdown
# Assignment R3-E execution arrangement (role: Coordinator; future explicit authorization required)
Task: RUACH-R3-blind-runs. Outcome: pending isolated Coordinator subject outputs.
Authority/budget: <owner's explicit native/paid-session authorization and run limit>; if absent, prepare
  offline inputs only and report blocked execution. Follow your canonical role and selected workflow.
Base/resource revision: <exact-existing-accepted-A+B+C-candidate-SHA>; record resolved route/model/effort/
  permissions for each subject; no automatic substitutions. Workspace/branch: Coordinator-owned evaluation
  worktree, ruach/r3-evaluation after unused-name check. Own only assigned evaluation record/arrangements
  and reports under docs/reports/r3/evaluation-runs/ plus retained synthetic outputs at <consumer location>.
Scope: fresh independent Coordinator subject session per case/variant. Give candidate role/resources,
  selected workflow and one isolated raw task/corpus; withhold plan, README, expected/, other outputs and
  implementation conclusions. Validate input allowlist before launch. Preserve pristine corpus separately.
Subjects own case-allowed record/assignment/report outputs only; recording stub observes work-state/tool
  choices, no production worker launch/merge/push/cleanup. Explicitly allocate fixture worktrees/resources.
Dependencies: accepted packet, separately authorized usable native route, raw refs/reports instantiated.
  Packet acceptance includes independent example-to-case leakage review and decisive contrasting controls;
  copies of the public CSV-142 solved scenario do not qualify as held-out evidence.
Acceptance: raw outputs and action traces preserved, route/runtime evidence retained, no supplied answers
  or grading hints. Pass/fail not assigned to you: return output references for independent grading.
Permissions/checks: offline fixture preparation and validator/check commands from packet allowed;
  authorized subject launches only within declared budget; no global writes or permissions answered for
  workers. Report blocked dialogs via launcher contract, preserving existing sessions. Cleanup task sessions
  only after evidence retained and no continuation needs them; retain branches under consumer policy.
Handoff: truthful ruach-handoff at docs/reports/r3/evaluation-runs/coordinator.md; commit only assigned
  source-side assignment/record/report, never private or raw production transcripts; return creating SHA.
```

```markdown
# Assignment R3-E grading (role: Reviewer; separate from subjects)
Task: RUACH-R3-evaluation. Outcome: pending evidence-based behavioral findings.
Workspace/base: independent worktree at <exact-existing-candidate-SHA>; branch ruach/r3-evaluation-grade
  after unused-name check. Role agents/reviewer.md; no workflow body loading or subject coordination.
Inputs: evals/ruach-coordination/README.md and expected/rubric.md, pristine raw cases, actual outputs/action
  traces from authorized blind execution, candidate source revision and route evidence. No prior verdict.
Own only unchanged docs/assignments/r3/evaluation.md and docs/reports/r3/evaluation.md. No fixture/source
  edits; evidence copies in OS temp. Retained subject outputs stay at explicitly supplied consumer location.
Acceptance: independently compare each observable invariant with raw sources and actual outputs; cite
  locations/actions/digests. Grade pass/fail/unverified, preserve critical failures and limits; assess resumed
  handling twice, ambiguity continuation, active stale worker, partial retention, supersession and valid,
  changed-target and revoked authorization. Check opposite liveness/handled/mapping controls and distinguish
  moved authorized destination from unapproved new target. Do not count copied public-case dispositions
  as held-out interpretation; inspect prior packet leakage-review evidence. Static checks never become
  a behavioral pass.
Dependencies: complete blind outputs; missing case/route evidence is unverified, not fabricated success.
Checks: inspect pristine/output diff, protected-file digests and Git ref/report consistency; run existing
  handoff validator with --repo for own report. Record exact realized checks; no new subjects/paid sessions.
Permissions: read-only evidence inspection and owned-artifact local commit; one narrow gitdir escalation
  if needed; no global settings, source changes, merge/tag/push. No port/profile/save allocation needed.
Handoff: source candidate as reviewed_revision, actual evidence references and route metadata, findings,
  blockers and limitations. Commit assignment/report only, return path/SHA. Fixes belong to A/B/C owners;
  changed guidance or inputs require independent affected reruns before behavioral acceptance.
```

## Readiness, investigation gaps and owner decisions

Ready for a new bounded assignment: A, followed by B and C preparation as described. Exact worker routes, base commits, unused names and artifact/retention policies must be filled by the assigning Coordinator; those are ordinary launch inputs, not new Ruach product decisions. No architecture blocker requires a new skill or tooling choice.

Factual gaps: selected workflow bodies were intentionally not inspected; Coordinator must check compatibility before B acceptance and separately own any required edits. No native behavioral subject or live consumer resume was run; packet preparation and future evaluation remain distinct. R1 hosted CI/native discovery evidence and R2 recovery limitations are inherited/open, not closed by this design or local checks.

Owner decisions: authorizing implementation packages and native/paid evaluation scope; choosing any consumer-specific overrides/resource allocations; authorizing eventual delivery target. No packaging/global settings/catalog change is proposed. Deferred features remain deferred. If a repeated manual-assignment failure later justifies executable lint, request a separate design/authority decision with concrete evidence.

Current planning verification and environment limitations are recorded in [structured handoff](../reports/roadmap-planning/coordination.md); actual round-3 correction dispositions and revised digest are in the [correction handoff](../reports/roadmap-planning/batch1-round3-coordination.md). Creating commit is returned after commit, never predicted inside a report. Exact revised-pair agreement remains pending round 4. This Architect remains available for the authorized sequential batches and up-to-five-round agreement/arbitration process; no next batch starts here.
