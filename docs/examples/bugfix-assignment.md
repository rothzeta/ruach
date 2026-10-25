# Known-defect assignment

Fill the [assignment specimen](assignment-specimen.md) fields and use [ruach-debugging](../../skills/ruach-debugging/SKILL.md) as technical guidance. This brief does not authorize delivery or prescribe an Architect for a small fix.

```text
Role: Implementer. Task/work/version: <IDs>. Coordinator: <ID>.
Outcome: correct <known observable defect> within <bounded component>.
Authority: <exact owner/contract decisions and limits>.
Baseline/workspace/unused branch: <existing full SHA, path, branch>.
Report provenance: <actual issue/source>; expected behavior: <independent contract>.
Original failure: <command or input sequence, cwd, build/artifact identity,
  versions/environment/permissions, input/state, expected/actual, raw evidence>.
Dependencies: <accepted findings/design if needed, otherwise none>.
Owned source/tests/support/docs: <explicit paths>. Protected: <everything else>.
Use ruach-debugging: bounded original reproduction, discriminating cause evidence,
  narrow authorized correction, independent public regression and valid neighbor,
  then repeat original failure on identified corrected build.
Checks: <exact commands/cwd/bounds/log paths>; tests may change only <scope>.
Capture actual unfixed failure/candidate success where feasible; state limitations.
Use canonical verification dispositions; unknown/environment failures keep their label.
Resources/permissions: <allocated temp/state/tools; specific escalation requests>.
Scope changes or expectation conflicts: preserve evidence and report concrete amendment.
Correction budget: <canonical completed correction-cycle definition, consumer override
  if any, stable blocking outcome and prior failed completed attempts>.
Handoff: <report path>; existing baseline/candidate/tested revisions, cause or unknown,
  changes, commands/exits, regression and original-retest evidence, gaps.
Validate via <installed handoff validator --repo command>; <commit rule>.
Return source/report creating SHAs externally. Independent review follows separately.
No self-acceptance, merge, push, publication or resource teardown.
```

If runtime retest is required, the Coordinator sends Tester a separate brief using the [runtime QA assignment](runtime-qa-assignment.md), carrying the exact original state/steps and corrected artifact. A green regression cannot replace the original experience. Review names the actual combined candidate; delivery names its independently reviewed revision and unchanged target under separate authority.
