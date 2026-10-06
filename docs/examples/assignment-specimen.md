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

Contents every assignment states: role, task ID, workspace and base, outcome, scope and ownership, acceptance, verification and test restrictions, scope-change procedure, report path and commit rule. Add dependencies, expected revisions or review inputs only when they apply. Review assignments also name the exact revision under review.
