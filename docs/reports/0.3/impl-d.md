---
task: 0.3-impl-d
status: complete
outcome: Track C1/C3/C4 and all Track D documentation, metadata and wording delivered, with the 0.3.0 changelog entry; no needs-decision items.
candidate_revision: 8ddd5c5fc77fea71fd6bb9cfc079ab56cc5216ff
tested_revision: 8ddd5c5fc77fea71fd6bb9cfc079ab56cc5216ff
artifacts:
  - docs/reports/0.3/impl-d.md
  - "branch ruach/ruach03-impl-d"
  - README.md
  - docs/operations.md
  - docs/examples/
  - docs/coordination.md
  - scripts/check.ts
  - tests/check.test.ts
  - skills/ruach-handoff/references/validator.md
verification:
  - "just check: pass"
  - "just release-check: pass (v0.2.1, no version bump)"
  - "just test: pass (root 52, handoff 24, herdr 126, harness-eval 59; 0 fail); herdr tests ran with local sockets"
  - "Addendum 1: just check and just release-check pass; root bun run test 53 pass 0 fail (new readme-routing test). Skill suites not rerun since no skill code changed after the full pass"
  - "New check tests (compatibility metadata, Bun declaration) failed against the old scripts/check.ts and pass with the change"
discoveries:
  - "Skills CLI list/remove/update and claude plugin list/update/uninstall exist (verified via --help); the lifecycle doc cites only those"
  - "No snapshot uninstall subcommand exists in 0.2.x; docs describe manual removal from the manifest file list"
  - "Compatibility frontmatter is accepted by the herdr skill-parsing tests, so native parsing is unaffected as far as tests show; live Claude and Codex parsing not run"
  - "Lifecycle text is a separate section appended to docs/operations.md; expect a trivial merge with impl-c. README points at the planned just ready without describing it"
blockers: []
---

# Report impl-d

## Addendum 1 (delivery ownership, escalation, models docs)

Folded in after the first handoff: feature workflow step 8 is now "Deliver" (separate Implementer assignment gated on review and confirmed user authorization, exact revision, destination-not-moved rule, `delivered_revision`); an Escalation section (default 2 cycles, Architect before stronger model, declared alternatives only with authorization, recorded in the task record); Coordinator and Implementer wording aligned; "Choose your models" README section checked against `skills/ruach-herdr/references/routing.md` and the real `resolve --offline` behavior; new `tests/readme-routing.test.ts` keeps its example valid and alternatives explicit-only. `delivered_revision` already exists in the handoff schema and tests, so no schema or validator change was needed. Final checks for this addendum are in the terminal handoff.

Commits: C4 check and metadata; C1/C3 README and lifecycle; D consolidation; D changelog.

- C4: `scripts/check.ts` validates optional single-line `compatibility` (1-500 chars) and requires executable skills (those with package.json) to mention Bun. Added to handoff, herdr and harness-eval.
- C1/C3: README restructured with a choose-by-job table; consumer snapshot path precedes source-development detail. Lifecycle section in docs/operations.md.
- D: docs/examples/{consumer-example,assignment-specimen,direct-compact-full,task-record}.md and docs/coordination.md; role wording (implementer justification vs Coordinator approval, reviewer artifacts/responsible worker); discovery descriptions; handoff validator detail moved to a reference; cleanup rules deduplicated into the Coordinator role with the feature workflow linking to them; ruach-testing before/after examples.
- Delivery wording about uncommitted diffs and retained checkouts added to the Coordinator role and feature workflow step 8; this clarifies wording and adds no authority.
- CHANGELOG has a 0.3.0 — Unreleased entry. Versions are not bumped.

Not done: no live Claude/Codex discovery run for the new frontmatter; wording edits are not behavior-evaluated. The new consumer-facing docs were not exercised by a newcomer.

Validator: run on this report with --repo (see terminal handoff).
