# Direct, compact and full use

Coordinator overhead should match the task. Choose the lightest level that still gives the checks the task needs. Illustrative scenarios below.

## Proportionate rule

| Level | Use when | What you run |
| --- | --- | --- |
| Direct | The change is small, local and low-risk, and you will read the diff yourself | One native role (for example `claude --agent ruach:implementer`) with the skills you want. No Coordinator, no Herdr. |
| Compact | One bounded change needs independent verification or review but no design phase | A Coordinator, one Implementer and one Reviewer. Skip Scout and Architect. One assignment each; handoffs required. |
| Full | The work spans components, needs design decisions, or has parallel tasks and an integration step | The whole feature workflow: optional Scout and Architect, several Implementers with file ownership, integration, combined verification, review, merge and cleanup. |

Move up a level when a trigger appears: unclear scope, more than one owner of the same files, a design question, or a result you cannot judge alone. Move down when roles would only repeat the same check. Extra workers add launch, reading and cleanup cost; they are not free assurance.

## Worked small bugfix (direct, or compact if review is required)

A date helper returns the wrong week at year boundaries. The owner runs the Implementer directly in the checkout with [ruach-testing](../../skills/ruach-testing/SKILL.md): reproduce with a failing test at the helper's public boundary, fix, run the project's tests. The handoff records the failing-then-passing evidence. If the project requires independent review, switch to compact: the Coordinator assigns one Reviewer to the exact revision; no Scout or Architect.

## Review-only task

The owner has a colleague's branch and wants an independent opinion. A Coordinator is optional. A Reviewer gets the exact revision, the acceptance conditions and a report path, and returns findings ordered by severity with evidence. The Reviewer changes nothing; fixes go to the responsible worker or author. A review report is a handoff like any other, with `reviewed_revision` set.

## Medium feature (full)

"Add saved filters to the report page" touches the API, the UI and the stored settings. The Coordinator briefly assigns an Architect for a bounded plan, then Implementers with disjoint file ownership (API, UI), an integration Implementer to combine and verify the combined revision, an independent Reviewer on that revision, and a merge. Resources are released after each committed handoff. See the [consumer example](consumer-example.md) for the lifecycle of one task through those steps.
