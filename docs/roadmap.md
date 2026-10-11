# Ruach roadmap

Backlog reconciled **2026-10-11** against the 0.3.0 release, current source and the [RAMEC orchestration proposals](design/0.4-suggestions-from-ramec-orchestration.md). This is the single planning list; proposals and historical reports supply evidence, not additional queues. IDs identify outcome packages to split into bounded assignments when work starts.

Current state: **0.3.0 released locally**, with `ruach-changelog` integrated under **Unreleased**. Most original 0.3 work is complete. Release confidence still needs green hosted CI and consumer/native smoke evidence. New capabilities remain proposals until assigned; backlog organization does not authorize implementation, paid sessions or publication.

## Priorities and sequencing

| Order | Packages | Outcome |
| --- | --- | --- |
| Next | R1, R2, R3 | Close evidence gaps, fix documented reliability gaps, preserve decisions and running work |
| Follow-up, suitable for 0.3.x | R4–R7 | Improve permissions, communication, handoffs and verification within existing resources |
| 0.4 capability sequence | C1 → C3 → C4 → C5 | Council, known-bug correction, runtime QA, then defect discovery |
| Conditional 0.4 companion | C2 | Gemini advisors when needed; council can use supported harnesses first |
| Measurement | M1 | Establish whether the workflow earns its overhead; prepare cases early, run after R1 |
| Decisions / later | D1–D3 and parked proposals | Resolve packaging choices separately; expand from demonstrated need |

R1/R2/R3 can proceed independently. R4/R5 use R3's resource record; R6/R7 can proceed independently with coordinated edits to shared files. Council uses R3's decision/assignment record and R5's waiting guidance. Runtime QA uses the bugfix path; hunt follows once findings can be reproduced and corrected. Every 0.3.x improvement need not ship before any 0.4 work starts.

## Active backlog

### R1 — Close release and native-use evidence gaps

**Next action:** investigate the failing CI test step and record a green run on the resulting revision. Latest observed [run 37986084683](https://github.com/rothzeta/ruach/actions/runs/37986084683), at `d75039a`, passed installation, resource/type checks, release metadata and audit, then failed “Test root tools and all executable skills.” Earlier [run 37661762155](https://github.com/rothzeta/ruach/actions/runs/37661762155) also failed. The old “CI has not run” note is superseded.

Then complete the [native smoke checklist](native-parity.md#clean-install-smoke-checklist) and one real consumer task. Preserve role/skill discovery, scope, handoff and tool-version evidence; compare Claude native `--agent` and adapter composition on the same task. Include isolated-home Codex discovery and explicit skill-path fallback. Keep paid runs pending their required authorization. Harness-eval's unassisted brief must not hint at routes/skills; label hinted runs assisted.

**Local status (2026-10-11):** the hosted failure was diagnosed as an order-dependent `readdir` assertion at `skills/ruach-herdr/tests/worker.test.ts` and corrected locally (R1-F, exact local gate and unit review). The failing run URLs above are unchanged history; there is no resulting hosted green run, no native route result and no real consumer-task report yet. An offline smoke packet (independently re-reviewed, local only) exists for later authorized rows; every route gap below stays open. The owner chose to add a fake task to Enoch and discard it afterwards: that is a temporary synthetic consumer exercise and does not close the real consumer-task criterion below.

**Done when:** a linked green GitHub run and consumer-task report exist, with results or explicit remaining gaps for every install route. Local tests alone do not close live-use evidence. Sources: former Tracks B/E, 0.3 exit notes, 0.3.x discovery/harness-eval.

### R2 — Fix documented install and linked-launch recovery gaps

**Next action:** reproduce the open cases in [operations limitations](operations.md#known-limitations-in-03), then split into bounded fixes:

- Revalidate installer state under the staging lock so concurrent plans cannot act on stale state.
- Report the Herdr workspace when identity verification fails after linked-worktree creation.
- Preflight a requested subdirectory against the base commit before creating a checkout.
- Establish the replacement-ref boundary of Herdr-owned `git worktree add`; retain fail-closed identity checks and document remaining limitations.

**Local status (2026-10-11):** installer revalidation under the staging lock (with the symlinked-target preflight) and the linked-launch receipt and `--cwd` preflight are fixed locally with failing-before regressions and independent unit review; see [operations](operations.md#known-limitations-in-03) and the [regression inventory](regression-cases.md). The replacement-ref boundary is established but not fixed: public Herdr v0.9.0 source and a fake probe show linked creation is unprotected, live behavior is unverified, and the limitation stays documented. No hosted or live claim.

**Done when:** resolved cases have failing-before public-boundary regressions and accurate recovery instructions; unresolved cases remain listed. Keep the accepted harness-eval Git-configuration trust boundary; do not restore the superseded content-hashing design. Sources: shipped 0.3 limitations, A1/A7 follow-ups.

### R3 — One durable coordination record and complete assignments

Consolidate decision, milestone/work and resource ledgers, assignment lint, decomposition and session-route notes into the existing [task record](examples/task-record.md) and [assignment specimen](examples/assignment-specimen.md). Extend Coordinator/Architect guidance before creating bookkeeping skills.

The record retains owner decision words, date, stable IDs, authority and supersession; separates proposals from Coordinator choices; lists running/queued units, dependency reasons, assignment/report paths, branches, workers, resources, blockers and next actions. Update it at decisions/phase changes and read it after compaction. Ambiguous replies remain unresolved until mapped; never reconstruct missing rulings from memory. Consumers choose durable locations and commit policy.

Assignments name the role, binding decisions, current base, unused branch, owned source/tests/support/docs, verification permissions and report path. Architect emits disjoint packages and dependencies; Coordinator explains serial steps. Workers follow their role rather than inherited orchestrator instructions. Record route overrides and ownership of ports/profiles/saves; consumers allocate them. Check stale resources before relaunch while preserving active workers and partial work.

**Local status (2026-10-11):** the task-record and assignment specimens and the Coordinator/Architect guidance are updated and independently reviewed statically. Static review and the prepared, independently reviewed offline packet (`evals/ruach-coordination`) are not behavioral evidence: the held-out behavioral evaluation (R3-E) stays pending its native budget, access and source gates.

**Done when:** an interrupted multi-unit task resumes without losing decisions or repeating handled work, and assignments avoid predictable ownership questions. Preserve still-valid user authorization. Sources: Track F5/F6; 0.3.x decomposition/ledgers/route overrides; RAMEC §§3.2/3.3/3.7/4, F1–F3/F8/F12.

### R4 — Sandbox permissions and readiness for worktree tasks

Prove permission mapping lets authorized workers stage/commit in linked worktrees and run allowed verification recipes, including sockets/temp paths. Request required escalation once on a gitdir `index.lock` permission failure and report the result. Assignments name allowed requests; readiness identifies recipes needing execution outside the sandbox. Document whole-argument prefix matching (`just test` does not cover `just test-focused`).

**Done when:** an isolated launch smoke proves staging/commit and permitted verification; missing permissions produce actionable diagnostics without loops. No global settings writes or approvals on workers' behalf. Sources: Track F1; RAMEC F6/§3.5.

### R5 — Reliable assignment submission and completion waits

Use native Herdr primitives for submission, startup readiness, pending-input inspection and blocking waits. Verify submission and detect a self-update leaving a shell. Wait for an unhandled terminal/decision report using last handled state, including reports written before the wait starts; retain that state in R3. Run verification to completion with a bound; report last worker activity at check-ins. Avoid tight status loops and repeated approval relays.

**Done when:** isolated cases cover unsubmitted input, exited harness, pre-existing completion and timeout without duplicate work. Check existing Herdr capabilities before proposing commands: launch preparation stays in `ruach-herdr`, terminal primitives in Herdr; no Ruach scheduler. Sources: 0.3.x waiting guidance; RAMEC F4/F5/F7, §§3.5–3.6.

### R6 — Evidence-backed handoff and delivery receipts

Verify revision objects; distinguish candidate/tested/reviewed/delivered revisions; never cite a report's own not-yet-created commit. Final receipts state verification or “not run,” open items, remote state and residue. `needs-decision` **already exists**; add options/examples instead of a new status.

Refresh the base before integration and reverify changed code. Delivery still targets the exact reviewed combined revision and checks the destination has not moved. Record authorization, tag/push state and retained/released resources. Extend existing assignments for a serialized multi-unit merge queue when needed; keep cleanup with Coordinator and branches under retention policy. No new Merger role, automatic push, blanket clean-tree requirement or disposal of requested diffs.

**Done when:** receipts are checkable against Git and a moved target stops delivery; uncommitted-diff and retained-checkout outcomes remain valid. Justify/test any schema change separately. Sources: Track F3/F4; RAMEC §3.4 and steward proposal, reconciled with current role contracts.

### R7 — Verification failures and proportionate test guidance

Consolidate environment classification, known-flake disposition and wording in `ruach-testing`, `ruach-simplification` and Reviewer guidance. Socket/tmp/disk failures are “not verified: environment”; record command/exit code and preserve verifier status in truncation pipelines. Consumer flake records name symptom, environment and allowed rerun; repeated main-environment failures become defects. Preserve invariants and justify splits through public contracts.

**Done when:** isolated packets distinguish environment blocks, registered flakes and regressions without weakening tests or claiming unrun checks. Public-contract and before/after examples already shipped; extend missing guidance only. Sources: Track F2; 0.3.x wording; RAMEC F9/§3.9.

## 0.4 — Deliberate, find, fix, exercise

Names/packaging remain proposals. Keep one coordination owner per task; consumers declare domain experts through existing routing. Council chair can be an Architect assignment and steward a delivery Implementer assignment, without new reusable roles.

### C1 — Council workflow and read-only assignment specimen

Add `ruach-workflow-council` and a copyable advisor/member brief: owner decisions, question, inputs, output-only edit scope, roster, evidence and round mode. Assign evidence collection when needed; Coordinator synthesizes reports.

Manual mode runs one independent round then pauses. Automatic mode runs N total rounds including the first; “up to N, stop when stable” is explicit. Close each round before distributing answers; keep first-round peers' answers inaccessible. Later rounds receive actual peer reports, question and new evidence. Members state positions, assumptions, accepted/rejected arguments with reasons, changes, disagreement and resolving evidence. Synthesize by proposition/attribution rather than votes; preserve supported minority objections. Retain round artifacts and support later resumption after releasing sessions. APPROVE/CHANGES is an optional specimen, not a universal three-round rule.

**Done when:** manual/automatic runs obey independence/counts, preserve consequential objections and resume from artifacts. Compare final output with round one for corrected assumptions and missed requirements, not consensus rate. Sources: original 0.4 council; 0.3.x advisor/council templates; RAMEC §§3.1/4.

### C2 — Gemini worker/advisor adapter

Add a thin `agy` adapter for non-Coordinator roles when needed. Snapshots fit `.agents/skills`, but the current adapter deliberately returns `unsupported_adapter`; changelog-hook support does not establish launch support. Verify additive role delivery, workflow exclusion, headless flags and approval behavior before emitting argv. Launch linked worktrees, deliver role/assignment separately, pass large prompts by file path. Trust/allowlists and routing stay consumer-owned; no global writes or automatic substitution.

**Done when:** capability checks and an authorized advisory task establish launch, authority, discovery and handoff. Coordinator stays on a supported harness. Sources: original 0.4 Gemini; RAMEC F11; [adapter evidence](../skills/ruach-herdr/references/adapters.md).

### C3 — Known-bug correction

Add `ruach-debugging` and `ruach-workflow-bugfix`: intended behavior → reproduce → supported cause → scoped correction → regression coverage → repeat failure → required review/delivery. Architect is optional.

**Done when:** a small real defect completes the sequence with evidence and proportionate overhead. Source: original 0.4 bugfix/debugging.

### C4 — Runtime QA and Tester

Add Tester, `ruach-runtime-testing` and `ruach-workflow-qa`. Assign goals, identified build and required capabilities (browser/desktop input, logs, screenshots, audio). State actual exercised experiences: reading audio code is not hearing it. Consumers isolate profiles/saves/ports/databases; record seeds/save states for reproduction without making them contracts.

UI/measurement specimens use real-size data, named viewports, existing palette and recorded fields. Distinguish script/component timing from browser layout/paint; carry unmet budgets into named follow-ups with measured inputs. Reuse this package for UI budgets, design-to-build and measurement specimens before adding skills/workflows.

**Done when:** observations reproduce on an identified build and the original failure can be retested after C3. Sources: original 0.4 QA; RAMEC F10/§§3.8/4–5.

### C5 — Bounded bug-hunt and feedback-loop demonstration

Add `ruach-workflow-bug-hunt`: bound area/risk; classify source-supported, reproduced, suspected and product observations. “No confirmed defects” is valid with coverage/uncertainty. Independently check significant findings. Findings-only ends at the report; authorized “find and fix” chains to C3.

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

## Completed baseline — 0.3 and integrated follow-ups

Historical track/finding IDs remain for evidence references. Details are in the [0.3 changelog](../CHANGELOG.md#030--2026-10-07), [release report](reports/0.3/ship.md) and [regression inventory](regression-cases.md). Implementation completion does not close R1's live-use gaps.

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

Offline evidence and export evaluation shipped in [native-parity.md](native-parity.md). Paid/native checks remain R1; export remains D2.

### Integrated after 0.3, unreleased

`ruach-changelog` logs finished turns and supported compaction summaries to consumer JSONL, with project registration and an opt-in plugin hook. [Implementation/review evidence](reports/0.4/changelog-review.md) exists. This is implemented, not future work, and does not replace the decision/work record.

## Boundaries and source reconciliation

Native tools own accounts/sessions, Herdr owns terminal primitives, consumers own authority/routing/runtime resources, existing services own hosting/CI/tracking. Reuse native plugin lifecycle and Skills CLI. No always-running service, GUI/dashboard, universal mailbox, task database, bespoke benchmark runner, copied vendor prompts or automatic route switching. Preserve contracts and appropriate public-boundary regressions; consequential instruction changes need isolated behavioral evidence.

The [pre-cleanup roadmap](https://github.com/rothzeta/ruach/blob/d75039aa7b82b262e2f28af08630258fb7f77180/docs/roadmap.md) preserves original scope/provenance: product analysis (5 Oct), audit (4 Oct), session review (7 Oct) and capability proposal. Former F1–F6 map to R4/R7/R6/R6/R3/R3. Former 0.3.x items map to R1/R3/R5/R7/C1/M1; no second follow-up list is maintained. The [RAMEC disposition map](design/0.4-suggestions-from-ramec-orchestration.md#backlog-disposition-2026-10-11) locates every suggestion.
