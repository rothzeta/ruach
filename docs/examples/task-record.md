# Task record for resuming a Coordinator

When a Coordinator session ends or is interrupted, a fresh one should resume from durable references, not from a terminal transcript. Keep one small record per task in the consumer's tracker or task folder and update it at each phase change. IDs and paths below are illustrative. A one-assignment task needs only this small form; add the sections below when a task has several units, owner decisions or reserved resources.

```markdown
# Task PROJ-142 record
Workflow: ruach-workflow-feature (compact). Coordinator owner: coord-proj-142.
Destination: main (local merge only). Retained checkout: /work/app.

| Item | Value |
| --- | --- |
| Assignments | docs/assignments/PROJ-142/impl-1.md, review-1.md |
| Reports | docs/reports/PROJ-142/impl-1.md (committed at <sha>) |
| Candidate revision | task/proj-142-impl@<sha>, checks passed at that revision |
| Review | review-1 assigned to <sha>; no report yet |
| Blockers | none |
| Open resources | worker proj-142-review (workspace w-12); worktree /work/app-worktrees/proj-142-review |
| Released | proj-142-impl session and worktree (commits reachable from task/proj-142-impl) |
| Next action | Wait for review-1 report; on blocking findings, assign a bounded fix to a new Implementer on the same branch |
```

To resume, a new Coordinator reads this record, the linked handoffs, and the actual state of the listed workers and worktrees. It confirms a worker's execution has ended before replacing it, preserves partial work, and corrects the record where reality differs. It validates any earlier authorization against its recorded source, action, target and limits (see [authority and decisions](#authority-and-decisions)): an unchanged, still-valid one is reused without asking again, and an interruption alone never revokes it.

## Recording an escalation

When a fix/review loop stops converging (see the feature workflow's escalation rule), add an entry:

```markdown
| Escalation | Reason: review-1 and review-2 both found the export still failing for newline names. Route before: implementer preferred (claude-sonnet-5.5-medium). Route after: none yet; user asked to authorize the declared alternative. Evidence: docs/reports/PROJ-142/impl-1.md, review-1.md, review-2.md. |
```

Fill in the route after only once the user or consumer policy authorizes an alternative declared in `roles.yaml`.

## Fuller record for multi-unit tasks

This is a specimen, not a schema. Use tables or tracker sections. "None", "not assigned" and "unknown; next observation ..." are explicit values; a blank must never hide missing authority. The Coordinator owns the record. Workers write only their assigned artifacts and handoffs, and the Coordinator records the disposition from evidence. Link detail, do not paste it; role and workflow rules stay in the [Coordinator](../../agents/coordinator.md) and [Architect](../../agents/architect.md) roles and their workflows. The [changelog hook](../../skills/ruach-changelog/SKILL.md) is a discovery breadcrumb, not this record, and its summaries are not owner words.

### Authority and decisions

- **Identity.** Task ID, outcome, workflow and mode, record location, consumer retention and commit policy, the single Coordinator owner and the evidence of any ownership transfer ([coordination](../coordination.md)).
- **Stable IDs.** Decisions `DEC-001`, work `WORK-01`, never recycled. Alternatives are qualified (`DEC-004/A`), not several lists numbered "1". Keep old references if an ID is renamed.
- **Each consequential owner statement** keeps: exact words, date (time and zone if known), speaker and source, the question it answers, your interpretation, status (`proposed`, `unresolved`, `accepted`, `rejected`, `superseded`) and scope or conditions. Never invent a missing timestamp or quotation; link bulky raw input.
- **Proposals, owner choices and operational choices are different rows.** A worker or advisor recommendation is a proposal with author and evidence. A Coordinator scheduling choice records the delegated authority and reason and confers no product authority. A recommendation, summary or merged branch is not adoption; the owner adopts through a separate linked decision.
- **Supersession** is written both ways, with effective date and affected scope, and lists the assignments to revise. It does not revoke unrelated authorization. Keep rejected and superseded evidence under retention policy.
- **Ambiguous reply.** Keep the words, source, date and every plausible target ID, plus one narrow clarification question. Adopt none until evidence or a new answer maps it. Silence, elapsed time and a suggested default resolve nothing. Continue independent authorized units.
- **Missing recalled ruling.** Record where you searched and the result; do not rebuild it from memory. Ask only if a dependent action needs it.
- **Authorizations** link the decision and exact request to the permitted action, target, limits, expiry if any, and revocation. States: active, conditional, unresolved, revoked, consumed-for-action. "Consumed" shows an action happened and does not permit another. Each repeated action is scope-checked.

On resume, re-read the source and compare the proposed action with those limits. Reuse an unchanged valid authorization; ask again only when authority is missing, ambiguous, revoked, expired or relevantly changed. A moved delivery destination requires refreshed integration, checks and review, but does not erase a broader valid local-delivery authorization. Never relay or approve a native security dialog for a worker.

### Work, evidence and resources

| Section | Content; update when it changes |
| --- | --- |
| Work units | ID, one bounded outcome, role, state (queued, running, blocked, partial, complete) and acceptance kept separate; owned source, tests, support and docs; binding decision IDs; predecessors and why each gates start, integration or delivery; base ref and resolved commit; branch, worktree, worker; assignment path and version. Update before submitting and on any real state change. |
| Progress and next action | Workflow phase, gates met and pending, running and queued units in order, blockers with owner, evidence and next step, independent work while blocked. Finished implementation is not accepted, integrated or delivered. |
| Revisions | Existing candidate, tested, reviewed and delivered commits with commands, scope and results; unknown or unrun stated. The report-creating commit is separate. Revalidate before reuse. |
| Reports | Path, observed identity (committed blob or commit, or a digest when uncommitted), status; and last handled identity, time, disposition and follow-up. Mark handled only after the disposition is durable. A revised report is reconsidered for its delta; a later evidence-only commit does not relaunch finished work. |
| Routes | Requested role, effective harness, model, effort and permissions, catalog reference; any override with authority, reason, evidence and work IDs. Record launch failures; never invent a substitute. |
| Resources | Owner, session, workspace, worktree and path, task temp directory; consumer-allocated port, profile, save or database, or "not needed"; active, reserved, retained, released or unknown, with last observation, reuse reason, cleanup owner and condition. Never infer identity from a directory name or idle time. |
| Partial work | Whether the execution ended or still runs, branch, reachable commits, requested uncommitted diff path and checksum, reports and logs, scope done and pending, why kept, next owner. Preserve before replacing; do not commit a consumer-requested diff without authority. |
| Phase events | Dated event, actor and authority, affected IDs, evidence, next action. A short history plus a current snapshot, not a transcript. |

Persist a meaningful decision and its exact words before acting on it, and persist phase, work and resource changes before dependent actions. Writing the record and committing it are separate; the consumer decides when to commit. After an interrupted write, observe raw sources, reports, Git and native state and record a corrective event; do not claim a cross-system transaction. If a report was acted on but its disposition is missing, look for the resulting assignment, revision or resource before repeating the action, and hold the action if still unsure.

### Manual completeness check

Before relying on a record, confirm: every decision has words, source and status; proposals, owner choices and operational choices are separate; every supersession points both ways; every authorization has action, target, limits and state; each unit has dependencies with reasons, a next action and an owner; every report has observed and handled identity; every resource has an owner, observation and cleanup condition. Pair this with the [assignment checklist](assignment-specimen.md#before-sending-an-assignment).

## Filled interrupted-task specimen

Synthetic consumer data for a throwaway CSV-export application, not a Ruach decision or a real run. `fixture/r0`, `fixture/export-r1` and `fixture/export-partial` are fixture refs to be created in an isolated repository and must resolve before anyone relies on them; they are not claims about any checkout. Paths, ports and names are illustrative consumer choices, and no real session, account or transcript is included. Never copy such refs into a real structured handoff.

### Snapshot saved at 2026-10-11 09:20 UTC

Task `CSV-142`: correct CSV quoting and update the export screen and help. Workflow: the consumer's compact feature process, then independent combined review and local merge. Record: `docs/tasks/CSV-142.md`. Consumer `GUIDANCE.md`: keep this record and raw owner statements; commit record, assignments and reports at phase boundaries; retain branches and partial diffs until task acceptance; no push. Coordinator `coord-csv-old` ended 09:18; the owner named `coord-csv-resume` at 09:19 in `inputs/owner-transfer.md`. That transfer did not end any worker execution.

| Decision | Exact words, authority, source, date | Interpretation, state, affected work |
| --- | --- | --- |
| DEC-001 | Owner, `inputs/owner-request.md`, 2026-10-10 16:00 UTC: "Fix CSV quoting and the export screen. After independent review passes, merge it into main locally. Do not push. Keep the partial work if a session ends." | Accepted. Task scope and conditional local-delivery authorization AUTH-001 for WORK-01 to WORK-06. No expiry stated. |
| DEC-002 | Owner, `inputs/owner-help-1.md`, 2026-10-10 16:10 UTC: "Put the help example inline on the export screen." | Superseded by DEC-003 for help placement only. WORK-03 was paused when placement changed (its inline partial is now superseded history). Quoting and delivery unchanged. |
| DEC-003 | Owner, `inputs/owner-help-2.md`, 2026-10-11 08:45 UTC: "Instead of the inline example, put that same help example in the help file. Keep the quoting fix." | Accepted; supersedes DEC-002 placement. WORK-03 needs assignment v2. DEC-001 merge limits unchanged. |
| DEC-004 | Owner question, `inputs/questions-help.md`, 08:50 UTC: "1: Include a second example? 2: Include the UTF-8 note?" Worker proposes both in `reports/CSV-142/help-proposal.md`. | Proposed alternatives DEC-004/A (item 1) and /B (item 2); no owner choice yet. |
| DEC-005 | Owner question, `inputs/questions-review.md`, 08:51 UTC: "1: Review the screen first? 2: Review the quoting first?" Coordinator recommends quoting first in that file. | Coordinator proposal; DEC-005/A and /B unresolved. A scheduling default does not adopt either. |
| REPLY-001 | Owner, `inputs/owner-ambiguous.md`, 09:05 UTC: "1 ok, 2 ok." | Unresolved: could answer DEC-004 or DEC-005; neither adopted. Clarification outstanding: "Does '1 ok, 2 ok' answer the help choices DEC-004/A and /B, or the review choices DEC-005/A and /B?" |
| OPS-001 | Coordinator, `inputs/route-choice.md`, 2026-10-10 16:20 UTC: "Run screen work beside quoting; combine both before independent review." | Operational choice under DEC-001's delegated coordination; not owner product policy. Integration depends on both paths. |
| AUTH-002 | Owner, `inputs/route-override.md`, 2026-10-10 16:25 UTC: "Use the declared Sol alternative for the screen worker for this task." | Active, WORK-02 only. `config/routes.yaml` declares the preferred Claude route and Codex `gpt-6.1-sol`, high effort; effective permissions auto-review. No global route change and no authority for later retries. |

AUTH-001 permits WORK-06 to merge into `main` locally after independent combined review. It is within DEC-001, not yet used, and no source revokes it. The destination is `fixture/r0` now; the target must be observed again and the exact reviewed candidate named. No tags, pushes or publication. REPLY-001 neither widens nor invalidates AUTH-001.

| Work ID, state | Assignment, report, ownership, evidence | Dependencies, next action |
| --- | --- | --- |
| WORK-01 complete; accepted for integration only | `assignments/CSV-142/quoting-v1.md`; `reports/CSV-142/quoting.md`, `complete` at `fixture/export-r1`. Owns `src/export/csv.ts`, `tests/export/csv.test.ts`; no support or docs needed. Reader round-trip tests passed at that ref; no combined review or delivery claimed. Branch `task/csv-142-quoting`; worker `csv-quote` ended, checkout released, commit reachable. | Do not rerun. WORK-04 must include this commit and re-verify the combination. |
| WORK-02 running | `assignments/CSV-142/screen-v1.md`; no handoff yet. Owns `src/ui/export.ts`, `tests/ui/export.test.ts`, `tests/support/export-host.ts`. Base `fixture/r0`, branch `task/csv-142-screen`, worker `csv-screen`. Record updated 08:30 looks stale, but `observations/screen.txt` at 09:17 shows the same harness still working on tests. AUTH-002 applies. Consumer allocation: dev host port 4173, profile `csv-fixture-profile`, save `csv-sample.db`, all reserved to this worker. | Keep the session and checkout; wait for its unhandled report. Neither the old update time nor the Coordinator transfer permits replacement. |
| WORK-03 partial; worker ended; v2 not yet assigned | `assignments/CSV-142/help-v1.md`; `reports/CSV-142/help-partial.md`, `blocked`. v1 owned `src/ui/export-help.ts`, `tests/ui/export-help.test.ts`. Base `fixture/r0`; branch `task/csv-142-help` at `fixture/export-partial`, worktree `/work/csv-wt/help-v1` retained with uncommitted `retained/CSV-142/help.diff` (digest in `retained/CSV-142/manifest.md`). Worker `csv-help` ended per `observations/help.txt`. | Keep that branch, worktree and diff immutable as superseded evidence; never edit, reset or integrate them. Author v2 on a new branch `task/csv-142-help-v2` and new worktree, base `fixture/r0` resolved to an existing commit at launch, after re-confirming the worker ended and the diff digest. v2 owns `docs/export-help.md` only and reads the old example text from the diff. |
| WORK-04 queued integration | Future `assignments/CSV-142/integration-v1.md`, report `reports/CSV-142/integration.md`; branch `task/csv-142-combined` reserved. Owns only conflict edits in WORK-01/02 paths and `docs/export-help.md`, plus its assignment and report. Base not resolved yet; resolve at launch. | Inputs are only the accepted WORK-01 commit, the accepted WORK-02 commit and the accepted WORK-03 v2 commit (`task/csv-142-help-v2`). Never integrate `task/csv-142-help` or `help.diff`: they hold superseded inline code. The combined deliverable must show quoting, screen and the help-file placement together. |
| WORK-05 queued independent review | Future `assignments/CSV-142/review-v1.md`, report `reports/CSV-142/review.md`; Reviewer owns the report only. | Needs a tested WORK-04 combined commit; it cannot certify disconnected unit revisions. |
| WORK-06 queued conditional delivery | Future `assignments/CSV-142/delivery-v1.md`, report `reports/CSV-142/delivery.md`; separate Implementer. | WORK-05 passes on the exact combined revision, target re-observed, AUTH-001 still valid. The Coordinator does not merge. |

Handled reports: WORK-01 `fixture/export-r1:reports/CSV-142/quoting.md` handled 08:20, disposition "include in WORK-04; release ended quote worker, retain branch". WORK-03 partial report, digest in `retained/CSV-142/manifest.md`, handled 09:10, disposition "retain partial; author v2 after observing ended execution". No WORK-02 report is handled. A report written before the next wait starts still counts if its identity is not in this list.

### Progress, phase events and resources

Current phase: implementation (WORK-02 running, WORK-03 v2 to author); not yet integration, review or delivery. Gates met: DEC-001/003 recorded, WORK-01 handled. Pending: WORK-02 report, WORK-03 v2 report, REPLY-001 clarification, then WORK-04, WORK-05 and WORK-06 in that order (each needs its predecessor's evidence). Blockers: REPLY-001 (owner, answer awaited; blocks only DEC-004 and DEC-005 dependent choices, not the units above).

| Time (UTC) | Event, actor, evidence | Next action |
| --- | --- | --- |
| 10-10 16:00 | DEC-001 recorded before WORK-01 to WORK-03 assigned (Coordinator, `inputs/owner-request.md`). | Assign units. |
| 10-11 08:20 | WORK-01 report handled; worker `csv-quote` ended, checkout released. | Include in WORK-04. |
| 10-11 08:45 | DEC-003 written to this record, then WORK-03 stopped and v1 inline work marked superseded (owner, `inputs/owner-help-2.md`). | Observe ended `csv-help`, then v2. |
| 10-11 09:10 | WORK-03 partial report handled; branch and diff retained (`retained/CSV-142/manifest.md`). | Author v2 once execution is confirmed ended. |
| 10-11 09:19 | Ownership moved to `coord-csv-resume` (owner, `inputs/owner-transfer.md`); no worker affected. | Resume per the trace below. |

| Resource | Owner, state, last observation | Cleanup owner and condition |
| --- | --- | --- |
| WORK-01 branch `task/csv-142-quoting` at `fixture/export-r1` | Coordinator; retained. Worker and worktree released after the commit was confirmed reachable. | Coordinator; delete only after task acceptance per `GUIDANCE.md`. |
| WORK-02 session `csv-screen`, workspace `w-csv-screen`, worktree `/work/csv-wt/screen`, branch `task/csv-142-screen`, task temp `/tmp/csv-142-screen-launch` | WORK-02 worker; active, working on tests at 09:17 (`observations/screen.txt`). | Coordinator, only after its report is handled and its commits are reachable. Never on idle time or the owner transfer. |
| Dev host port 4173, profile `csv-fixture-profile`, save `csv-sample.db` | Consumer allocation to WORK-02; in use by that worker. | Release when WORK-02 ends. Free the port by stopping the recorded `csv-screen` host process only after confirming its identity; never kill by port number or the whole process tree. Keep a failing run's captured reproduction under `retained/CSV-142/` until the report is handled. |
| WORK-03 v1 worktree `/work/csv-wt/help-v1`, branch `task/csv-142-help`, `help.diff`, worker `csv-help` | Execution ended (09:10 observation); retained as superseded evidence. | Coordinator; remove only after task acceptance and the owner's retention allowance. |
| WORK-03 v2 branch `task/csv-142-help-v2`, worktree `/work/csv-wt/help-v2` | Reserved; not created, checked unused at launch. | Coordinator after its report is handled and the commit is reachable. |
| WORK-04 branch `task/csv-142-combined` | Reserved; not created. | Coordinator after delivery or acceptance. |


### Resume trace (manual check, not a behavioral test)

1. Read `GUIDANCE.md`, the transfer file and this record, then re-read the raw sources for DEC-001, DEC-003, AUTH-002 and REPLY-001; do not rely on the interpretations. Owner is `coord-csv-resume`.
2. Observe actual state before acting: `csv-screen` is still working (09:17 is newer than the stale 08:30 update), so WORK-02 stays running. Confirm `csv-help` has ended and that the `task/csv-142-help` branch and `help.diff` still match the manifest digest.
3. Do not repeat WORK-01 or re-handle the WORK-03 partial; both are in the handled list.
4. Send the REPLY-001 clarification. Do not treat it as DEC-004 or DEC-005; continue independent units.
5. Record the intended v2 launch in the phase events, check `task/csv-142-help-v2` and its worktree path are unused, then send the WORK-03 v2 assignment after the [assignment checklist](assignment-specimen.md#before-sending-an-assignment).
6. When WORK-02 reports, compare its identity with the handled list, record the disposition, then unblock WORK-04 (accepted WORK-01, WORK-02 and WORK-03 v2 only). Delivery reuses AUTH-001 only after a refreshed target, combined review and a check that DEC-001 is unrevoked.
