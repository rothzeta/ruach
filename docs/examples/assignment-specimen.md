# Assignment specimen

The input-side counterpart to the [handoff](../../skills/ruach-handoff/SKILL.md). A Coordinator writes a self-contained initial assignment at the consumer's assignment location, inside the worker's workspace. Keep it short; link context rather than copying it. Paths and IDs are illustrative.

```markdown
# Assignment impl-1 (role: implementer)
Task id: PROJ-142-impl. Workspace: this worktree, branch task/proj-142-impl, based on main@<revision>.

Outcome: CSV export quotes names containing commas, quotes or newlines.
Context: ticket PROJ-142; the export lives under src/export/; ordinary project guidance applies.

Scope: src/export/** and its tests. Report, do not edit, anything else.
Document ownership: do not edit docs/decisions/; propose corrections in the report.

Acceptance:
- A name such as `Doe, Jane` round-trips through export and a standard CSV reader.
- Existing export behavior for names without special characters is unchanged.

Verification: add a failing regression test first, then run `npm test`. Do not modify existing tests; report a conflict between a test and the stated outcome instead.
Restrictions: no network, no dependency changes. Keep disposable files outside the repository.

Scope changes: if the task seems to need work outside scope, stop and send a justification in the report; the Coordinator approves or declines.

Handoff: write docs/reports/PROJ-142/impl-1.md with the ruach-handoff leading block, run its validator with --repo, and commit this assignment unchanged with the report.
```

## Before sending an assignment

Check by hand, against the task record. No tool is needed or implied; a Reviewer checks packages and outputs.

1. Role, stable task and work ID, outcome and applicable consumer authority. Workers follow their role and this assignment, never Coordinator workflows.
2. If there are dependencies, name predecessor IDs and why: satisfied ones, those gating start, those gating only integration. Name conflicting owners by unit or path; workers do not negotiate overlap.
3. Correct repository and workspace. For a new worktree, resolve the base to an existing commit and check the branch unused (exact ref and existing worktrees) just before launch. A later base change is an amendment or new assignment.
4. Owned paths, including affected tests, fixtures and docs; protected paths named. State test restrictions explicitly.
5. Acceptance is observable. Verification gives exact commands, working directory, bounds, evidence files, permitted test changes and flake handling from consumer guidance. Escalation requests name the recipe and affected paths or sockets; do not promise approval.
6. Required resource allocations (port, profile, save, database) and any route override with its authority; omit irrelevant allocations. No global default is implied.
7. Report path, unchanged-assignment commit rule, retained diffs and branches, scope-change reporting, independent review and the delivery boundary. Review briefs name the exact revision and carry no prefilled result.

Do not edit a submitted assignment invisibly: keep the original, issue a versioned amendment, deliver it to the existing worker through the authorized mechanism and record whether it was received. Say whether affected work continues within unchanged scope, stops in part, or is revised after observing the worker. Never instruct a worker to report `complete` before its result is known.

## Short follow-ups

Apply the Coordinator's [short follow-up contract](../../agents/coordinator.md#short-follow-ups). Record only the changed instruction and reference the accessible original brief, unless consumer policy requires a new file.

For example, after independent review and authorized merge delivery:

> CSV-142/deliver-1 continues impl-1. Review REV-1 accepted <exact SHA>; the owner authorized merge to main in DEC-2. Deliver that SHA only if main still equals <prepared target SHA>; otherwise stop and report. No push. Return the delivery handoff at docs/reports/PROJ-142/delivery.md under the existing commit rule.

## Conditional fields

When a correction budget applies, state the blocking outcome, the feature workflow's completed correction-cycle definition, completed unsuccessful attempts and remaining budget. Preserve its exclusions for initial implementation iterations and supported remediation, and its continuity across renamed assignments and correction regressions; do not count test failures. Include the applicable consumer override, if any, in the self-contained assignment.

Add binding decision IDs and exact words, expected input revisions, retained-diff paths, and amendment versions only when they apply.

## Multi-unit example

For the interrupted `CSV-142` task in the [task record specimen](task-record.md#filled-interrupted-task-specimen), the resumed Coordinator sends WORK-03 v2. The consumer-specific `npm test` is as in the first example; other consumers use their own command.

```markdown
# Assignment CSV-142/help-v2 (role: implementer)
Task/work: CSV-142 / WORK-03. Assignment version 2; supersedes help-v1 for help placement only. Consumer guidance: GUIDANCE.md (commit record, assignments and reports at phase boundaries; no push).
Workspace: new worktree /work/csv-wt/help-v2, new branch task/csv-142-help-v2 (checked unused at launch), base fixture/r0 resolved to an existing commit before launch.
Binding decisions: DEC-001 "Fix CSV quoting and the export screen..." (task scope; no push); DEC-003 "Instead of the inline example, put that same help example in the help file. Keep the quoting fix." DEC-004 is unresolved (REPLY-001): include neither the second example nor the UTF-8 note.
Dependencies: satisfied: WORK-03 v1 execution observed ended; its branch task/csv-142-help and retained/CSV-142/help.diff are preserved. Nothing blocks start. WORK-04 integration waits for this report and WORK-02.

Outcome: the export help example appears in docs/export-help.md.
Scope: docs/export-help.md only. Read, never edit, retained/CSV-142/help.diff and the old branch; reuse its example text, not its inline code. Do not edit src/, tests/ or the quoting code.
Protected: everything else, including WORK-01/02 paths, the old branch and worktree, and the task record.

Acceptance: docs/export-help.md contains the example; this branch changes no file under src/ or tests/.
Verification: from the worktree root run `npm test` (bound 300 s); no test changes are needed. Report a conflict instead of editing tests.
Route and resources: default route; no port, profile or save needed.
Scope changes: stop and send a justification in the report; the Coordinator decides.
Handoff: write reports/CSV-142/help.md with the ruach-handoff leading block, run its validator with --repo, and commit this assignment unchanged with the report. Independent review happens on WORK-04's combined revision.
```
