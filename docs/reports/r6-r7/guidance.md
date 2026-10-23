task: WAVE2-r67-guidance
status: complete
outcome: "Added handoff delivery/receipt reference and verification disposition guidance; examples validated against real temp Git objects with the existing validator."
artifacts:
  - skills/ruach-handoff/SKILL.md
  - skills/ruach-handoff/references/delivery.md
  - skills/ruach-testing/SKILL.md
  - skills/ruach-testing/references/verification.md
  - skills/ruach-simplification/SKILL.md
  - agents/reviewer.md
  - docs/reports/r6-r7/guidance.md
  - docs/assignments/wave2/r67-guidance.md
tested_revision: d657f71e1bac28fbcd28f1cdd116a296be5b0811
verification:
  - "just check: exit 0 (link/identity check and tsc)"
  - "just release-check: exit 0 (v0.3.1 metadata verified)"
  - "bun run test: exit 0, 100 pass / 0 fail across 10 files"
  - "cd skills/ruach-handoff && bun test: exit 0, 28 pass / 0 fail"
  - "task-temp verify-examples.ts: exit 0, 3 shipped YAML examples validated with the canonical validator against real temp Git objects, plus a missing-ref negative control (exit 1, REVISION_MISSING)"
  - "task-temp verify-portable.ts: exit 0, copied handoff skill and its relative references validated from a foreign cwd"
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/r6-r7/guidance.md --repo /opt/dev/ruach/.worktrees/r67-guidance: exit 0, tested_revision resolved"
  - "git diff --check: exit 0 (no whitespace errors)"
review: not-run
discoveries:
  - "A paid engineering implementation turn produced this guidance. No native evaluation subject, benchmark or behavioral proof ran; independent review was not performed at this handoff, so no acceptance is claimed."
  - "No schema, validator, CLI, parser, runtime, launcher, routing, changelog, roadmap or root-test file was changed; the neutral starting template and existing public-boundary tests are intact."
  - "Prior R3 report-handling/resource fields and consumer authority are referenced, not redefined."
  - "The delivery examples use synthetic fixture refs; a real report must use resolved existing object IDs, and the shipped examples were checked in a fixture repository that actually creates those refs."
  - "Frozen local installs were needed for typecheck (skills/ruach-herdr, skills/ruach-harness-eval) and to run the named canonical validator (/opt/dev/ruach/skills/ruach-handoff); the canonical validator initially stalled while Bun resolved missing skill-local dependencies and exited 0 after those installs. No tracked file or global config changed."
  - "One handoff-suite run overlapped with the root suite and the copied-skill test exceeded its 5000 ms default; the sequential run passed 28/28. Recorded as a contention artifact, not a product failure."
blockers: []

# R6-G / R7-G guidance handoff

## Summary of changes

R6-G and R7-G only. Added the accepted handoff/delivery reference and the
verification disposition guidance, linked from the existing skills and the
Reviewer role. No schema, validator, parser, CLI, test, runtime, launcher,
routing, version, changelog or shared-doc edit.

- `skills/ruach-handoff/references/delivery.md` (new): revision and
  evidence-role scopes (source baseline/destination-before, candidate, tested,
  reviewed, evidence-only successor, delivered), scope-aware successor rules, a
  structurally valid `needs-decision` options example, receipt content, local
  versus cached versus unqueried remote state, the serialized delivery gate,
  requested-diff/retained-checkout outcomes, and two worked fixture examples.
- `skills/ruach-handoff/SKILL.md`: one link to the new reference; template,
  schema reference and field rules unchanged.
- `skills/ruach-testing/references/verification.md` (new): passed /
  not-verified-environment / registered-flake / regression / unclassified
  dispositions, consumer-owned flake fields and a bounded-retry example, main
  recurrence, exit/full-log preservation with a `PIPESTATUS` note, and an
  invariant-preserving public-contract split.
- `skills/ruach-testing/SKILL.md`: concise evidence-classification principle and
  reference link; principles and examples retained.
- `skills/ruach-simplification/SKILL.md`: one boundary line tying test/doc
  shrinkage to preserved invariants.
- `agents/reviewer.md`: evidence-classification responsibility and a
  disposition-reporting line in the output.

## Verification

Run from the task worktree on the content committed as
`d657f71e1bac28fbcd28f1cdd116a296be5b0811`:

- `just check` -> exit 0.
- `just release-check` -> exit 0.
- `bun run test` -> exit 0, 100 pass / 0 fail.
- `cd skills/ruach-handoff && bun test` -> exit 0, 28 pass / 0 fail.
- Disposable task-temp `verify-examples.ts` -> exit 0. It extracts the three
  shipped YAML blocks from `references/delivery.md`, builds real temporary Git
  objects (branches `fixture/before`, `fixture/reviewed`, `fixture/target`,
  `fixture/report`), and validates each example with the canonical handoff
  validator (`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts`). The `needs-decision` example
  needs no repository; the delivery receipt resolves six refs; the evidence-only
  successor resolves three. Negative control: a promised `fixture/absent` ref
  fails exit 1 with `REVISION_MISSING`.
- Disposable task-temp `verify-portable.ts` -> exit 0. Copies the whole handoff
  skill to a foreign directory, resolves all relative Markdown targets of the
  copied `SKILL.md` (including `references/delivery.md`), and runs the copied
  validator from an unrelated cwd against a report in a temp repo.
- `git diff --check` -> exit 0.

Frozen local installs used for setup: `bun install --frozen-lockfile` in the
repo root, `skills/ruach-handoff`, `skills/ruach-herdr` and
`skills/ruach-harness-eval`, plus the canonical `/opt/dev/ruach/skills/ruach-handoff`
needed to run the named validator. No registry access beyond the pinned frozen
lockfiles was needed and no global or tracked-file change was made.

Not run: no native subject, packet/model run, graded evaluation, Herdr suite
(not required for R6/R7-only instruction work), or final R4–R7 union checks.

## Scope and boundaries

Owned paths only: the changed source/doc paths listed above, the new report, and
the unchanged committed assignment `docs/assignments/wave2/r67-guidance.md`. No
other path was edited. The report was written against tested revision
`d657f71`; its own creating SHA is returned externally and is not predicted
here.

## Remaining holds

- Independent review of this revision is pending; this report does not
  self-accept.
- Final batch-2 shared-doc/`CHANGELOG.md` assembly remains solely B2-IN's after
  accepted HV-IN and named R4/R5 inputs; this independent preparation neither
  waited on nor claims that phase.
- No behavioral/native proof ran; future resource-refresh gates and native
  subject limits remain named in the plans.
