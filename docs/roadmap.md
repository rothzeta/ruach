# Ruach roadmap

Backlog reconciled **2026-10-25** for the untagged **0.7.0 preparation**, preserving the published **0.6.1** baseline and earlier [RAMEC proposal](design/0.4-suggestions-from-ramec-orchestration.md) dispositions. This is the single planning list; proposals and historical reports supply evidence, not additional queues. IDs identify outcomes, not automatic execution authority.

Current state: six C1–C5 skills, Tester, specimens/static cases, the accepted Codex/Bash long-argv correction and bounded Agy preparation are combined in source. The [instruction review](reports/c1-c5/instruction-review.md), [transport review](reports/c1-c5/launch-review-02.md), [C2 handoff](reports/c1-c5/c2-adapter.md), [council boundary decision](design/c1-c5/council-boundary-decision.md) and [runtime finding review](reports/c1-c5/runtime-finding-review.md) establish different, bounded outcomes below. C2 exact-source review and actual advisory validation, MQ-F01 correction/retest/review, C1 independent execution, final refreshed union review, hosted CI and delivery remain open. No 0.7.0 tag/publication/install or complete feedback-loop acceptance is claimed. Earlier OpenCode smoke/Enoch/authorization acceptance and resume/ambiguity failures remain dated evidence; original install-route/native parity and real-consumer criteria are not closed by local checks.

## Priorities and sequencing

| Order | Packages | Outcome |
| --- | --- | --- |
| Current preparation | C1–C5 | Preserve immutable source review; finish separately assigned native advisory and product correction evidence, then refresh and independently review the exact union |
| Existing guidance/evidence | R4–R7 | Preserve 0.6.1 source improvements and the dated preparation docket; remaining behavioral/combined gates need their own evidence |
| Evidence follow-ups | R1, R3; R2 live boundary | Record hosted green and missing behavioral/consumer evidence; preserve the documented replacement-ref limitation |
| Capability execution | C1, C3–C5 | Council boundary held; Codex/Bash transport accepted; runtime findings retained, product feedback loop pending |
| Conditional companion | C2 | Exact Agy source under review; actual linked Scout advisory/identity/brief/skill validation pending |
| Measurement | M1 | Establish whether the workflow earns its overhead; prepare cases early, run after R1 |
| Decisions / later | D1–D3 and parked proposals | Resolve packaging choices separately; expand from demonstrated need |

R1–R3's source changes are released; their remaining evidence gaps stay separate from wave-2 preparation. R4/R5 use R3's resource record; R6/R7 can proceed independently with coordinated edits to shared files. Council uses R3's decision/assignment record and R5's waiting guidance. Runtime QA uses the bugfix path; hunt follows once findings can be reproduced and corrected. Every 0.3.x improvement need not ship before any 0.4 work starts.

## Dated preparation docket — R4–R7

Independent preparation review at `40a591b5e1cfccfd9005ef1eb8622496397aa147` is retained in main history, report `docs/reports/wave2-review/preparation.md`. Its results supersede the operational record's earlier “review active” state. All three preparation units are now merged into main under the owner's consolidation request. Historical review applies to the pinned revisions below; it is not independent acceptance of the later combined revision.

| Unit | Reviewed revision | Review result / next action |
| --- | --- | --- |
| R6-G/R7-G handoff and verification guidance | `c874310b` | Passed preparation review; report now distinguishes the paid engineering turn from unrun evaluation subjects. Merged into main. |
| R4-P/R5-P permissions and communication packets | `818ed627` | Original review found 9 pass / 1 fail. Consolidation adds the tracked synthetic verifier artifact, corrects the claim and preserves the assertion. R4 now passes 7 tests and R5 passes 10; merged into main. Independent correction review remains open. |
| R6-P/R7-P delivery and verification packets | `afcd17ce` | Pass within preparation scope: 8 delivery and 11 verification tests pass. Final refresh to accepted guidance/specimens remains pending. |

Next steps, from the accepted [permissions/communication](design/next-permissions-communication-plan.md) and [handoff/verification](design/next-handoff-verification-plan.md) plans:

1. Independently review the R5 artifact/report and guidance wording corrections now on main.
2. Finish R45-D worker permission/communication guides, R5-L launcher startup contract tests and R6-S assignment/delivery specimens, respecting their source dependencies and ownership.
3. Refresh R6/R7 packets against accepted guidance/specimens; assemble and independently review the R6/R7 subcandidate (HV-IN).
4. Assemble R4–R7 through B2-IN, the sole final shared-doc/changelog writer; run the full affected union checks, independently review the exact combined revision, then perform separately assigned delivery under valid target authority.

R4/R5 native behavioral smoke and other live evidence remain separate gates. The earlier five-subject budget is exhausted; wave-2 engineering preparation does not authorize additional evaluation subjects. The [accepted plan index](design/next-roadmap-plans.md) records the four planning batches. C1–C5 now have the bounded source/execution statuses below; M1 remains queued. This dated docket is not new review or completion evidence for unrelated packages.

## Active backlog

### R1 — Close release and native-use evidence gaps

**Next action:** inspect CI on the published revision and record a linked green run, or diagnose any remaining failure. The previously observed [run 37986084683](https://github.com/rothzeta/ruach/actions/runs/37986084683), at `d75039a`, passed installation, resource/type checks, release metadata and audit, then failed “Test root tools and all executable skills.” Earlier [run 37661762155](https://github.com/rothzeta/ruach/actions/runs/37661762155) also failed. Those historical failures were diagnosed; no resulting hosted green run is recorded in the retained evidence.

Then complete the [native smoke checklist](native-parity.md#clean-install-smoke-checklist) and one real consumer task. Preserve role/skill discovery, scope, handoff and tool-version evidence; compare Claude native `--agent` and adapter composition on the same task. Include isolated-home Codex discovery and explicit skill-path fallback. Keep paid runs pending their required authorization. Harness-eval's unassisted brief must not hint at routes/skills; label hinted runs assisted.

**Status (2026-10-11):** the order-dependent `readdir` assertion at `skills/ruach-herdr/tests/worker.test.ts` was corrected with local checks and independent review, then shipped in 0.3.1. The prepared smoke packet was exercised through the restricted OpenCode Go / DeepSeek Flash runner: smoke and the temporary synthetic Enoch task were independently accepted. Enoch's task checkout and solution were discarded as requested; minimum grading provenance was preserved. This evidence does not establish the original Claude/Codex install-route matrix or a real consumer task. Five evaluations consumed one subject turn each, with no retries: smoke/Enoch/authorization accepted, resume failed critical record/preservation invariants under write denial, ambiguity failed/unverified under write denial. Final independent grades are retained at `091ef1eb` and `268954f5`; original compatibility, hosted green and real-consumer criteria remain open.

**Done when:** a linked green GitHub run and consumer-task report exist, with results or explicit remaining gaps for every install route. Local tests alone do not close live-use evidence. Sources: former Tracks B/E, 0.3 exit notes, 0.3.x discovery/harness-eval.

### R2 — Fix documented install and linked-launch recovery gaps

**Next action:** retain accurate [operations limitations](operations.md#known-limitations-in-03) and recovery guidance; verify the installed-live replacement-ref boundary when assigned. The source/recovery work shipped in 0.3.1:

- Installer state is revalidated under the staging lock so concurrent plans cannot act on stale state.
- Linked-worktree identity failures report valid Herdr workspace/pane recovery hints.
- Requested subdirectories are preflighted against the base commit before creating a checkout.
- The replacement-ref boundary of Herdr-owned `git worktree add` is established and documented; linked creation remains unprotected, with fail-closed identity checks retained.

**Status (2026-10-11):** source/recovery work is complete and published in 0.3.1 with failing-before regressions and independent unit review; see [operations](operations.md#known-limitations-in-03) and the [regression inventory](regression-cases.md). The replacement-ref boundary is established but not fixed: public Herdr v0.9.0 source and a fake probe show linked creation is unprotected, live behavior is unverified, and the limitation stays documented. No hosted or live claim.

**Done when:** resolved cases have failing-before public-boundary regressions and accurate recovery instructions; unresolved cases remain listed. Keep the accepted harness-eval Git-configuration trust boundary; do not restore the superseded content-hashing design. Sources: shipped 0.3 limitations, A1/A7 follow-ups.

### R3 — One durable coordination record and complete assignments

Consolidate decision, milestone/work and resource ledgers, assignment lint, decomposition and session-route notes into the existing [task record](examples/task-record.md) and [assignment specimen](examples/assignment-specimen.md). Extend Coordinator/Architect guidance before creating bookkeeping skills.

The record retains owner decision words, date, stable IDs, authority and supersession; separates proposals from Coordinator choices; lists running/queued units, dependency reasons, assignment/report paths, branches, workers, resources, blockers and next actions. Update it at decisions/phase changes and read it after compaction. Ambiguous replies remain unresolved until mapped; never reconstruct missing rulings from memory. Consumers choose durable locations and commit policy.

Assignments name the role, binding decisions, current base, unused branch, owned source/tests/support/docs, verification permissions and report path. Architect emits disjoint packages and dependencies; Coordinator explains serial steps. Workers follow their role rather than inherited orchestrator instructions. Record route overrides and ownership of ports/profiles/saves; consumers allocate them. Check stale resources before relaunch while preserving active workers and partial work.

**Status (2026-10-11):** the task-record and assignment specimens, Coordinator/Architect guidance and offline packet (`evals/ruach-coordination`) were independently reviewed and shipped in 0.3.1. Three actual restricted OpenCode coordination subjects were independently graded at `268954f5`: authorization accepted; resume failed critical stale-record and preservation requirements under runtime write denial; ambiguity failed/unverified with no persisted outputs. R3's resume/ambiguity behavioral proof remains unmet. The approved five-subject budget is exhausted, with no retry or original Claude/Codex compatibility result inferred.

**Next action:** preserve the failed-case evidence and runtime diagnosis; any further behavioral evaluation needs a separately authorized, concretely prepared execution packet.

**Done when:** an interrupted multi-unit task resumes without losing decisions or repeating handled work, and assignments avoid predictable ownership questions. Preserve still-valid user authorization. Sources: Track F5/F6; 0.3.x decomposition/ledgers/route overrides; RAMEC §§3.2/3.3/3.7/4, F1–F3/F8/F12.

### R4 — Sandbox permissions and readiness for worktree tasks

Prove permission mapping lets authorized workers stage/commit in linked worktrees and run allowed verification recipes, including sockets/temp paths. Request required escalation once on a gitdir `index.lock` permission failure and report the result. Assignments name allowed requests; readiness identifies recipes needing execution outside the sandbox. Document whole-argument prefix matching (`just test` does not cover `just test-focused`).

**Status / next action (2026-10-23):** R4-P's offline fixture passed independent preparation review and seven tests; temp/Unix/TCP probes passed in the review environment. The shared R4-P/R5-P preparation is merged into main with the R5 artifact correction. Finish the permission guide (R45-D); native staging/commit and allowed verification proof (R4-S) remains unrun. Offline probes do not establish native sandbox permissions.

**Done when:** an isolated launch smoke proves staging/commit and permitted verification; missing permissions produce actionable diagnostics without loops. No global settings writes or approvals on workers' behalf. Sources: Track F1; RAMEC F6/§3.5.

### R5 — Reliable assignment submission and completion waits

Use native Herdr primitives for submission, startup readiness, pending-input inspection and blocking waits. Verify submission and detect a self-update leaving a shell. Wait for an unhandled terminal/decision report using last handled state, including reports written before the wait starts; retain that state in R3. Run verification to completion with a bound; report last worker activity at check-ins. Avoid tight status loops and repeated approval relays.

**Status / next action (2026-10-23):** R5-P is merged into main. The timeout-verifier JSON now references tracked synthetic `verifier/run-2.txt`; the existing assertion is preserved, the inaccurate historical claim is corrected, and R4/R5 suites pass 7/10 tests. Independently review the correction, then finish R5-L startup contract tests and R45-D communication guidance. Native behavioral cases (R5-S) remain unrun.

**Done when:** isolated cases cover unsubmitted input, exited harness, pre-existing completion and timeout without duplicate work. Check existing Herdr capabilities before proposing commands: launch preparation stays in `ruach-herdr`, terminal primitives in Herdr; no Ruach scheduler. Sources: 0.3.x waiting guidance; RAMEC F4/F5/F7, §§3.5–3.6.

### R6 — Evidence-backed handoff and delivery receipts

Verify revision objects; distinguish candidate/tested/reviewed/delivered revisions; never cite a report's own not-yet-created commit. Final receipts state verification or “not run,” open items, remote state and residue. `needs-decision` **already exists**; add options/examples instead of a new status.

Refresh the base before integration and reverify changed code. Delivery still targets the exact reviewed combined revision and checks the destination has not moved. Record authorization, tag/push state and retained/released resources. Extend existing assignments for a serialized multi-unit merge queue when needed; keep cleanup with Coordinator and branches under retention policy. No new Merger role, automatic push, blanket clean-tree requirement or disposal of requested diffs.

**Status / next action (2026-10-23):** R6-G guidance and R6-P offline preparation passed independent review and are merged into main; the delivery packet's eight tests pass. The guidance wording is corrected. Finish R6-S specimens and refresh the packet against accepted guidance/specimens before complete HV-IN/B2-IN acceptance. Native/behavioral delivery proof and independent final batch acceptance remain open.

**Done when:** receipts are checkable against Git and a moved target stops delivery; uncommitted-diff and retained-checkout outcomes remain valid. Justify/test any schema change separately. Sources: Track F3/F4; RAMEC §3.4 and steward proposal, reconciled with current role contracts.

### R7 — Verification failures and proportionate test guidance

Consolidate environment classification, known-flake disposition and wording in `ruach-testing`, `ruach-simplification` and Reviewer guidance. Socket/tmp/disk failures are “not verified: environment”; record command/exit code and preserve verifier status in truncation pipelines. Consumer flake records name symptom, environment and allowed rerun; repeated main-environment failures become defects. Preserve invariants and justify splits through public contracts.

**Status / next action (2026-10-23):** R7-G guidance and R7-P offline preparation passed independent review and are merged into main; the verification packet's eleven tests pass. Refresh the packet against accepted inputs, then include it in complete HV-IN/B2-IN verification and independent review. Offline transport/fixture results do not establish native behavioral proof.

**Done when:** isolated packets distinguish environment blocks, registered flakes and regressions without weakening tests or claiming unrun checks. Public-contract and before/after examples already shipped; extend missing guidance only. Sources: Track F2; 0.3.x wording; RAMEC F9/§3.9.

## C1–C5 — Deliberate, find, fix, exercise

Source unit `90230d1` adds six skills and Tester with three specimens and static evaluation cases; independent review `e3d93d6` found the bounded instruction unit compatible with existing Coordinator protocols. Static cases are not behavioral proof. Keep one coordination owner per task; domain expertise and routing remain consumer-owned. The 0.7.0 metadata is preparation only.

### C1 — Council workflow and read-only assignment specimen

`ruach-workflow-council` and a [member brief](examples/council-member-assignment.md) exist: owner decisions, question, inputs, output-only scope, roster, evidence and round mode. Coordinator synthesizes reports; members receive assignments.

Manual mode runs one independent round then pauses. Automatic mode runs N total rounds including the first; “up to N, stop when stable” is explicit. Close each round before distributing answers; keep first-round peers' answers inaccessible. Later rounds receive actual peer reports, question and new evidence. Members state positions, assumptions, accepted/rejected arguments with reasons, changes, disagreement and resolving evidence. Synthesize by proposition/attribution rather than votes; preserve supported minority objections. Retain round artifacts and support later resumption after releasing sessions. APPROVE/CHANGES is an optional specimen, not a universal three-round rule.

**Done when:** manual/automatic runs obey independence/counts, preserve consequential objections and resume from artifacts. Compare final output with round one for corrected assumptions and missed requirements, not consensus rate. Sources: original 0.4 council; 0.3.x advisor/council templates; RAMEC §§3.1/4.

**Status / next action:** independently audited child-filesystem/configuration controls exist, but design `228b306` holds real manual/automatic, real-project and resume demonstrations. A complete actual member action/input surface bound to execution, or a verified whole-member boundary preserving required native connectivity/account/context, is missing. This is not universal impossibility or a council pass. Reopen only for a concrete supported capability delta; do not repeat marker/configuration probes without one. See the [boundary review](reports/c1-c5/council-boundary-review.md) and [decision](design/c1-c5/council-boundary-decision.md).

### C2 — Gemini worker/advisor adapter

Thin non-Coordinator Agy preparation exists at exact source `f17e923`, using the independently reviewed 1.4.7 additive canonical-rule/technical-skill interface. The only added development route is Scout's explicit `gemini-3.8-flash-medium` alternative, portable effort `auto`, inherited permissions; preferences and Codex alternatives are unchanged. Source checks passed 27 focused, 110 root and 268 Herdr tests. No separate native effort flag, Coordinator adapter, global workflow absence or same-session watcher/continuation support is claimed. Trust, account, routing and permissions remain native/consumer-owned; no global writes or automatic substitution.

**Status / next action:** REVIEW-C2-ADAPTER-01 is active on immutable `f17e923`. Actual linked native Scout identity/role/permission, aggregate rule budget, ambient visibility, literal brief reading, technical-skill activation and useful advisory output remain pending. Preparation and the prior diagnostic composition turn are not native advisory acceptance. See the [implementation handoff](reports/c1-c5/c2-adapter.md), [safe composition](reports/c1-c5/c2-composition.md), [independent composition review](reports/c1-c5/c2-composition-review.md) and [adapter limits](../skills/ruach-herdr/references/agy.md).

**Done when:** capability checks and an authorized advisory task establish launch, authority, discovery and handoff. Coordinator stays on a supported harness. Sources: original 0.4 Gemini; RAMEC F11; [adapter evidence](../skills/ruach-herdr/references/adapters.md).

### C3 — Known-bug correction

`ruach-debugging` and `ruach-workflow-bugfix` implement intended behavior → reproduce → supported cause → scoped correction → regression coverage → repeat failure → required review/delivery. Architect is optional.

**Status:** LAUNCH-LONG-ARGV's original 4095-byte truncation and failed correction `2c114e8` / LR-01 review `4f86897` remain recorded. Attempt 2 `f6d9c2c` passed independent source and actual source-wrapper native Tester review `31b4522`, closing the observed Codex/Bash transport defect only. One historical failed completed correction cycle is preserved; no other harness/shell parity or combined release/delivery follows. See [correction evidence](reports/c1-c5/launch-fix-02.md) and [acceptance scope](reports/c1-c5/launch-review-02.md). MQ-F01's separate product correction is active under C5 and remains unaccepted.

**Done when:** a small real defect completes the sequence with evidence and proportionate overhead. Source: original 0.4 bugfix/debugging.

### C4 — Runtime QA and Tester

Tester, `ruach-runtime-testing` and `ruach-workflow-qa` exist. Assign goals, identified build and required capabilities (browser/desktop input, logs, screenshots, audio). State actual exercised experiences: reading audio code is not hearing it. Consumers isolate profiles/saves/ports/databases; record seeds/save states for reproduction without making them contracts.

UI/measurement specimens use real-size data, named viewports, existing palette and recorded fields. Distinguish script/component timing from browser layout/paint; carry unmet budgets into named follow-ups with measured inputs. Reuse this package for UI budgets, design-to-build and measurement specimens before adding skills/workflows.

**Done when:** observations reproduce on an identified build and the original failure can be retested after C3. Sources: original 0.4 QA; RAMEC F10/§§3.8/4–5.

**Status:** actual Tester QA on pinned music/prototype builds exercised browser/CLI input, saved state, MIDI export/structure and public-state measurements. MQ-F01 is independently confirmed P2. The original browser driver took 302.865 seconds, breached its 120-second cap and exited 1; Coordinator disposition preserves that deviation and evidence, never a retroactive pass. Independent reproduction drivers fit their newly explicit bounds. Audio/listening/device evidence and delayed-expiry expectation ambiguity remain held. [Original QA/hunt](reports/c1-c5/runtime-qa-hunt.md) and [independent finding review](reports/c1-c5/runtime-finding-review.md) retain the exact limits.

### C5 — Bounded bug-hunt and feedback-loop demonstration

`ruach-workflow-bug-hunt` bounds area/risk and classifies source-supported, reproduced, suspected and product observations. “No confirmed defects” is valid with coverage/uncertainty. Independently check significant findings. Findings-only ends at the report; authorized “find and fix” chains to C3.

**Status / next action:** the bounded Pralice hunt found no confirmed defects within its public-state coverage; no bug is fabricated for the prototype. Music finding MQ-F01 is independently confirmed by `5bf48a6`. MQ-F01-FIX-01 is active in a new disposable copy, preserving retained consumers and the provisioned baseline. Regression evidence, corrected build, original Tester retest and independent patch review remain pending. No complete successful feedback loop or product delivery is claimed. C1 demonstrations, hosted CI and the full install-route/behavior matrix remain separate gates.

**Done when:** the feedback loop runs on music software and a playable prototype: Tester observes on a named build, hunt preserves steps/state, bugfix corrects with regression evidence, Tester repeats, Reviewer checks, Coordinator records delivery/open items. Council also completes its demonstration on those projects; new resources pass checks/CI. Sources: original hunt and 0.4 exit demonstrations.

## M1 — Comparative pilot and trustworthy usage measurement

Small pilot, no benchmark service: same bugfix, multi-component feature and refactor with native tools/project guidance vs Ruach. Hold model/effort/permissions constant first, then compare heterogeneous routes as a system. Record accepted outcomes, regressions, scope violations, false evidence, interventions, end-to-end time and available usage across workers; repeat cases, report ranges, preserve failures and use hidden checks. Never invent API charges. One worked harness-eval run includes native execution, candidate, checker evidence and human comparison within its trust boundary.

Version the TypeScript/Bun session-usage script with reviewed definitions: deduplicate Claude `message.id`; count waiting calls and separate repeat polls from other checks; classify approval triggers; select sessions by start time; report cached/uncached input separately; add Gemini when available. Earlier totals overstated polling about 3× and Claude usage about 1.8×; remeasure before claiming savings.

Strengthen Librarian packets for query without writes, standalone lint, repeated ingestion, superseding decisions, distracting corpora and forged instructions to alter protected decisions; withhold rubrics. Record route overrides through R3.

**Done when:** evidence supports retaining/narrowing/dropping overhead, with reproducible definitions and failure evidence. Sources: original 0.3.x measurement; RAMEC §6.8. Cost/quality/review claims stay unproved until measured.

## Decisions and parked proposals

| ID / proposal | Disposition and reopening condition |
| --- | --- |
| D1 — Plugin-root vs per-skill packaging | `needs-decision`; use [install evidence](native-parity.md#clean-install-plugin-cache-facts), readiness remediation and R1 results before changing packaging. No new package manager. |
| D2 — Native Codex role export | `needs-decision`; [options/risks](native-parity.md#native-codex-agent-export-evaluation). Adapter is the implemented route; any export is generated from canonical Markdown, checked for staleness, with no incidental consumer-config writes. |
| D3 — User-level/docs conventions | Opt-in consumer template pointing to canonical ADRs; project authority wins. Probe existing conventions in onboarding and triage mailbox knowledge with provenance. No mandatory hierarchy/global writes. |
| Agent profiles | After recurring need: explicit consumer-owned overlays on catalogs (`cheap`, `deep-review`, harness-specific), validated through existing routing and recorded in task/handoff. No automatic switching; M1 can start with declared catalogs. |
| STE writing | Park RAMEC §3.10 until repeated documentation tasks establish demand; consider Librarian mode or external skill first. |
| Separate decision/ledger/merge-queue/UI-budget skills; design/measurement workflows | Absorbed into R3/R6/C4. Extract only if completed tasks demonstrate a missing reusable boundary. |
| Analyst/designer/domain roles | Consumer-declared first; add Analyst only if council reveals a gap Architect cannot fill. |
| Other adapters/specialist techniques | Concrete execution need only; reuse external domain/framework skills. Gemini remains C2. |

After 0.4, pause catalog expansion and prioritize recurring friction recorded on real projects.

## Completed baseline — 0.3 and 0.3.1

Historical track/finding IDs remain for evidence references. Details are in the [0.3 changelog](../CHANGELOG.md#030--2026-10-07), [release report](reports/0.3/ship.md), [0.3.1 changelog](../CHANGELOG.md#031--2026-10-11), [publication receipt](reports/releases/0.3.1/publication.md) and [regression inventory](regression-cases.md). Implementation completion does not close R1's live-use gaps.

### Track A: Integrity and security

| Item | Delivered outcome |
| --- | --- |
| A1 | Pinned reads, canonical worker identity, hidden index/filter checks; accepted Git-configuration trust boundary retained. |
| A2 | Patched Herdr ws/yaml and frozen locks. |
| A3 | Strict handoff parsing, escaped diagnostics, NUL revision checks, tolerant unrelated skill discovery. |
| A4 | Bounded processes/cleanup/artifact reads, including descendant pipes/special files. |
| A5 | Staged/atomic snapshot installation, rollback, hardlink protection, leftovers/integrity checks; concurrency in R2. |
| A6 | Probed/launch executable identity, including relative/empty PATH. |
| A7 | Herdr-linked worktrees for launches and registered cleanup; recovery gaps in R2. |
| A8 | Hardening and notices: evidence descriptor, instruction-transport limits, per-skill LICENSE/PROVENANCE. |

### Track B: Verification gate

Typecheck, pinned toolchain, CI definition, audit and regression inventory shipped. Green hosted CI evidence remains R1.

### Track C: Onboarding and installation

Choose-by-job README, read-only `just ready`, lifecycle instructions and compatibility metadata shipped. Packaging remains D1.

### Track D: Product consolidation

Consumer/assignment/task specimens, direct/compact/full use, scope/review wording, discovery metadata, cleanup rules and testing examples shipped. Gated delivery Implementer assignments and declared-route escalation shipped; R3/R6 extend these contracts.

### Track E: Native packaging and parity checks

Offline evidence and export evaluation shipped in [native-parity.md](native-parity.md). Restricted OpenCode smoke evidence is recorded under R1; original Claude/Codex route checks remain open. Export remains D2.

### Published in 0.3.1

R1's directory-order test correction, R2's installer/linked-launch recovery fixes and R3's durable coordination guidance shipped with offline smoke/coordination packets and accepted roadmap plans; their evidence limits remain in the package statuses above.

`ruach-changelog` also shipped in 0.3.1. It logs finished turns and supported compaction summaries to consumer JSONL, with project registration and an opt-in plugin hook. [Implementation/review evidence](reports/0.4/changelog-review.md) exists. This is implemented, not future work, and does not replace the decision/work record.

## Boundaries and source reconciliation

Native tools own accounts/sessions, Herdr owns terminal primitives, consumers own authority/routing/runtime resources, existing services own hosting/CI/tracking. Reuse native plugin lifecycle and Skills CLI. No always-running service, GUI/dashboard, universal mailbox, task database, bespoke benchmark runner, copied vendor prompts or automatic route switching. Preserve contracts and appropriate public-boundary regressions; consequential instruction changes need isolated behavioral evidence.

The [pre-cleanup roadmap](https://github.com/rothzeta/ruach/blob/d75039aa7b82b262e2f28af08630258fb7f77180/docs/roadmap.md) preserves original scope/provenance: product analysis (5 Oct), audit (4 Oct), session review (7 Oct) and capability proposal. Former F1–F6 map to R4/R7/R6/R6/R3/R3. Former 0.3.x items map to R1/R3/R5/R7/C1/M1; no second follow-up list is maintained. The [RAMEC disposition map](design/0.4-suggestions-from-ramec-orchestration.md#backlog-disposition-2026-10-11) locates every suggestion.
