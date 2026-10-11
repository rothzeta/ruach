# Assignment specimen

The input-side counterpart to the [handoff](../../skills/ruach-handoff/SKILL.md). A Coordinator writes one self-contained assignment per worker at the consumer's assignment location, inside that worker's workspace. Keep it short; link context rather than copying it. Paths and IDs are illustrative.

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

1. Role, stable task and work ID, one pending outcome, assignment version, binding decision IDs with their exact words, and consumer authority. Workers follow their role and this assignment, never Coordinator workflows.
2. Dependencies name predecessor IDs and why: satisfied ones, those gating start, those gating only integration. Name the conflicting owner by unit or path; workers do not negotiate overlap.
3. Base ref resolved to an existing commit just before launch. Branch name checked unused (exact ref and existing worktrees). Correct repository and workspace. A later base change is a versioned amendment or new assignment.
4. Owned source, adjacent tests, support or fixtures, and docs listed; protected paths named. "No test or support edits needed" is a stated reason, not an omission.
5. Acceptance is observable. Verification gives exact commands, working directory, bounds, evidence files, permitted test changes and flake handling from consumer guidance. Escalation requests name the recipe and affected paths or sockets; do not promise approval.
6. Route and resource allocations (port, profile, save, database) recorded, or "not needed". An override cites its authority; no global default is implied.
7. Report path, unchanged-assignment commit rule, retained diffs and branches, scope-change reporting, independent review and the delivery boundary. Review briefs name the exact revision and carry no prefilled result.

Do not edit a submitted assignment invisibly: keep the original, issue a versioned amendment, deliver it to the existing worker through the authorized mechanism and record whether it was received. Say whether affected work continues within unchanged scope, stops in part, or is revised after observing the worker. Never instruct a worker to report `complete` before its result is known.

## Conditional fields

Add only when they apply: dependencies and reasons; binding decision IDs; base and branch checks; port, profile or save allocation; route override authority; expected input revisions; retained-diff path; assignment version and what it supersedes.

## Multi-unit example

For the interrupted `CSV-142` task in the [task record specimen](task-record.md#filled-interrupted-task-specimen), the resumed Coordinator sends WORK-03 v2. The consumer-specific `npm test` is as in the first example; other consumers use their own command.

```markdown
# Assignment CSV-142/help-v2 (role: implementer)
Task/work: CSV-142 / WORK-03. Assignment version 2; supersedes help-v1 for placement only. Workspace: existing worktree, branch task/csv-142-help (retained), base fixture/r0 (resolved existing commit; recheck before launch).
Binding decisions: DEC-003, "Instead of the inline example, put that same help example in the help file. Keep the quoting fix." DEC-004 is unresolved (see REPLY-001): include neither the second example nor the UTF-8 note.
Dependencies: none to start. WORK-04 integration waits for this report and WORK-02.

Outcome: the export help example appears in docs/export-help.md.
Scope: docs/export-help.md. Do not edit src/ui/, tests/ or the quoting code; do not merge the superseded inline work. Reuse the example text from retained/CSV-142/help.diff after reading it.
Protected: everything else, including WORK-01/02 paths and the task record.

Acceptance: the help file shows the example; the export screen carries no inline example.
Verification: run `npm test`; no test changes needed, and report a conflict instead of editing tests.
Route and resources: default route; no port, profile or save needed.
Scope changes: stop and send a justification in the report; the Coordinator decides.
Handoff: docs/reports/CSV-142/help.md with the ruach-handoff leading block and its validator; commit this assignment unchanged with the report. Independent review happens on WORK-04's combined revision, not here.
```

Contents every assignment states: role, task ID, workspace and base, outcome, scope and ownership, acceptance, verification and test restrictions, scope-change procedure, report path and commit rule. Add dependencies, expected revisions or review inputs only when they apply. Review assignments also name the exact revision under review.
