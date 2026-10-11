---
task: roadmap-reliability-plan
status: complete
role: architect
outcome: "Detailed R1/R2 plans completed and own-plan round-3 corrections recorded. Ready for exact revised-pair review; implementation, live runs and combined agreement remain future work."
inspected_revision: d75039aa7b82b262e2f28af08630258fb7f77180
correction_inspected_revision: d4ffa4b5eca92b54dfecfc8f48a10243fd8db66b
correction_plan_sha256: 37a72430abe975baf3710e91932a554f4b226f82dfd741edae8722ebb9d3086a
correction_report: docs/reports/roadmap-planning/batch1-round3-reliability.md
artifacts:
  - docs/design/next-release-reliability-plan.md
  - docs/reports/roadmap-planning/reliability.md
  - docs/reports/roadmap-planning/assignment-reliability.md
  - docs/reports/roadmap-planning/batch1-round3-reliability.md
  - docs/reports/roadmap-planning/assignment-batch1-round3-reliability.md
verification:
  - "Frozen roadmap SHA-256 matched assignment: 7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957; all three frozen current inputs read."
  - "just check: exit 1; resource/link checks passed, typecheck failed on absent worktree-local yaml/ajv packages and associated typing errors. No dependency installation or check weakening performed."
  - "just release-check: exit 0; release metadata v0.3.0 verified."
  - "bun run test: exit 1; 81 pass, 9 fail. Typecheck and eight dependency-dependent routing/README tests failed with missing skill dependencies."
  - "skills/ruach-harness-eval: bun test, exit 0; 71 pass, 0 fail."
  - "skills/ruach-changelog: bun test, exit 1; 34 pass, 1 fail. Concurrent append test produced EPERM during child stdin writes. One focused rerun reproduced it, exit 1; 0 pass, 1 fail, 34 filtered. Cause remains unclassified."
  - "Temporary Bun 1.4.2 preload probe: exit 0 after correcting probe cleanup; mock.module interposed a named node:fs mkdirSync import. Full proposed installer race regression was not implemented or run."
  - "Canonical source handoff validator with --repo pointing at this worktree: exit 0, ok true; inspected revision resolved. bun scripts/check.ts on plan/report: exit 0; relative Markdown file targets passed. git diff --check: exit 0."
review:
  - "Both actual round-2 Architect reports reviewed the initial pair with agreement changes; accepted own-plan corrections are recorded in the round-3 report. Exact revised-pair round-4 review is pending."
discoveries:
  - "R1 hosted failure cause remains unverified: web reads were inaccessible and public curl failed DNS. Local missing dependencies and changelog EPERM do not establish the hosted cause."
  - "R2 source confirms pre-lock target planning, linked receipt parsing after identity validation, late base-subdirectory validation and a Herdr-owned replacement-ref boundary. Existing replacement-ref launch regression covers standalone creation."
  - "Installer and linked recovery fixes can run independently; shared operations/inventory/changelog/evidence docs belong to one serialized integration assignment. R3 owns its record/specimens and receives package/revision/authority/resource metadata."
  - "R1-D is the first executable future assignment. Paid smoke/eval sessions, real consumer scope, external writes, D1/D2 and optional linked replacement-ref refusal require separate authority."
blockers: []
remaining_gaps:
  - "Hosted logs and resulting green run are pending; R1 is not closed by this plan or local checks."
  - "Full worktree-local gate is unverified without nested dependencies; changelog stdin EPERM requires bounded diagnosis in a suitable environment. Herdr/handoff suites and audits were not run here."
  - "Native smoke/consumer task execution and actual Herdr-server replacement-ref probe are future work with assigned permissions/resources."
  - "Exact revised-pair agreement is pending. Owner sequential-batch authority permits these same two sessions up to five total rounds or recorded arbitration and supersedes the original one-correction-round limit."
---

# Reliability planning handoff

The original verification entries above remain historical checks of the inspected source/initial planning artifacts; no unrelated suites were rerun for round 3. The [correction assignment](assignment-batch1-round3-reliability.md) authorizes the current own-plan edits, and [round-3 handoff](batch1-round3-reliability.md) records both actual peer arguments, dispositions, current plan digest and correction validation. The plan now names the accepted R3-B-before-R-IN changelog gate, actual tested resource revision, Coordinator-personal native task-resource release and evidenced answer-access isolation or non-blind smoke classification. No peer correction or exact-pair agreement is presumed.

The [plan](../../design/next-release-reliability-plan.md) separates verified source/local observations, hypotheses, proposed corrections and owner decisions. It supplies a copyable Scout diagnostic packet, two disjoint Implementer fix packages, a read-only Herdr boundary investigation, independent review/integration boundaries and future native/consumer smoke assignments. Each package identifies owned source/tests/support/docs, prerequisites, revisions to resolve, fresh branch names, acceptance, commands, resources and durable report location.

Installer design moves authoritative target validation and operation planning under the existing staging lock while retaining pinned source reads, inode-guarded rollback and manifest-last verification. Linked launch design preserves partial receipt IDs before verification without treating them as trusted identity, and preflights a requested cwd as an ordinary tree in the pinned base. Herdr replacement-ref behavior remains a separately investigated/documented boundary; no content-hashing redesign, Git-config trust change or automatic route fallback is proposed.

R1 diagnosis precedes any CI correction. Current local setup failures and a reproducible changelog stdin symptom are recorded as leads, with hosted cause pending. Green hosted evidence, observed native discovery/behavior and an actual consumer report remain required. Assisted briefs and explicit skill-path fallbacks cannot count as unassisted evaluation. Packaging/export decisions remain open.

Readiness: planning assignment complete; R1-D can be assigned first without product decisions. R2 offline fixes are ready for future implementation authorization. Paid runs, real consumer scope and publication are not authorized by this assignment. There are no blockers to delivering these planning artifacts; implementation/evidence gaps above are not fabricated outcomes.

The original artifact commit included the [unchanged initial assignment](assignment-reliability.md), plan and this report; its assignment SHA-256 remains `c4297524ad41585f0166d1d5cafaf027ea805c271ce770c00e2525638e9ef395`. Round 3 owns only the updated plan/this handoff, its new correction report and its unchanged assignment; earlier reports/assignments and peer artifacts are protected. Creating commit SHA is returned outside the reports. No code/test implementation, additional worker, paid session, global installation, source-checkout modification, push, merge, tag or repository/workspace cleanup was performed.

## Final validation

`bun <ruach>/skills/ruach-handoff/scripts/validate.ts docs/reports/roadmap-planning/reliability.md --repo <ruach>/.worktrees/sol-roadmap-reliability` exited 0 with `ok: true` and resolved the inspected revision. `bun scripts/check.ts` exited 0 for the plan/report file links. `git diff --check` exited 0. These validate structure, references and whitespace; they do not establish independent review, hosted CI, implemented fixes or live native outcomes.
