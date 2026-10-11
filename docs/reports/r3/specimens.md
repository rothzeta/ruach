task: RUACH-ROADMAP-IMPLEMENTATION/R3-A
status: complete
outcome: Task-record and assignment specimens extended with the decision, authority, supersession and report-handling contracts, manual completeness checks, a synthetic interrupted multi-unit record with resume trace, and a multi-unit assignment example; original small examples preserved.
candidate_revision: 95f1712fbcda4cb676c5cba86e9fe30cdd032eaa
tested_revision: 95f1712fbcda4cb676c5cba86e9fe30cdd032eaa
baseline: 033b10c748da004e1675c893756979a22c0f6336
artifacts:
  - docs/examples/task-record.md
  - docs/examples/assignment-specimen.md
  - docs/assignments/r3/specimens.md
  - docs/reports/r3/specimens.md
verification:
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 98 pass 0 fail"
  - "manual: changed anchors (#authority-and-decisions, #before-sending-an-assignment, #filled-interrupted-task-specimen) match headings; relative links point at existing files; resume trace checked against the record rows (see Manual checks)"
  - "bun skills/ruach-handoff/scripts/validate.ts docs/reports/r3/specimens.md --repo . and git diff --check: results in Validation"
review: not-run
discoveries:
  - "The synthetic fixture refs (fixture/r0, fixture/export-r1, fixture/export-partial) are labeled as unresolved illustrations and appear in no handoff field."
  - "agents/coordinator.md and docs/coordination.md link the task record but were not edited; any wording alignment belongs to R3-B."
blockers: []

# R3-A report

Commands ran sequentially under `flock` on `/tmp/ruach-implementation-20261011/verification.lock`, from the repository root on branch `ruach/r2-install-lock` (reused workspace), Bun 1.4.2, uid 1000. Installer files and the R2-I report were not touched. No behavioral evaluation was run; review is not run.

## Changes

- `docs/examples/task-record.md`: kept the small PROJ-142 record and escalation entry; replaced "does not assume an earlier approval still applies" with scope validation of recorded authorization; added the fuller-record contract (identity, stable IDs, exact words/source/date, proposals vs owner vs operational choices, supersession both ways, ambiguous replies, missing rulings, authorization states), the work/evidence/resource table, a manual completeness check, and the filled synthetic CSV-142 interrupted record (running, queued, partial and handled states, dependency reasons, route override, port/profile/save, cleanup owners) with a resume trace.
- `docs/examples/assignment-specimen.md`: kept the original assignment and its npm test permission; added "Before sending an assignment" (seven manual checks), amendment rules, conditional fields and a WORK-03 v2 multi-unit example linked to the record.
- Roles and workflows are linked, not copied. No new tool, role, schema or consumer policy.

## Manual checks

- Headings and anchors verified by grep; link targets (`../../agents/*.md`, `../coordination.md`, `../../skills/*`) exist.
- Trace: handled WORK-01 and WORK-03 partial are not repeated; WORK-02 is kept running on the newer 09:17 observation; REPLY-001 maps to neither DEC-004 nor DEC-005 and independent units continue; AUTH-001 is unconsumed, unrevoked and independent of the reply; WORK-03 v2 binds DEC-003 and excludes unresolved DEC-004 content.

## Gaps and proposals

Not behaviorally evaluated; independent review of this exact revision is pending. Coordinator/Architect role wording and the changelog Unreleased entry are R3-B, not edited here.

## Validation

The handoff validator exited 0 (ok, revisions resolved) and `git diff --check` exited 0 on this report before its commit.
