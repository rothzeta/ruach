---
task: 0.3-rev-docs
role: reviewer
status: complete
outcome: Two blocking documentation contradictions found (stale integration-Implementer-merges wording versus the separate-delivery rule); otherwise docs, metadata and claims match the code. All three gates passed.
artifacts:
  - docs/reports/0.3/rev-docs.md
  - docs/assignments/0.3/rev-docs.md
reviewed_revision: feaca8b74a8d5313fbeedbe943c385523637db20
tested_revision: feaca8b74a8d5313fbeedbe943c385523637db20
baseline: 639e24b
verification:
  - "just check (resource checks + tsc): exit 0"
  - "just release-check: exit 0 (Release v0.2.1 verified)"
  - "bun run test (root suite): exit 0, 84 pass, 0 fail"
  - "just ready --route native: exit 0; README/operations spellings and flags (--route, --json, --project, --skills) match scripts/install.ts usage"
  - "Not run: per-skill suites (handoff, herdr, harness-eval), bun audit, CI, live Herdr launch, installed-snapshot ready."
review: not-run
discoveries:
  - "Branch HEAD was bdab5e8, not feaca8b. It differs only by docs/reports/0.3/integ.md (git diff --stat). I reviewed and ran checks on feaca8b (detached), then returned to the branch to commit this report."
  - "just install (frozen) was run first so check and the test suites had dependencies."
blockers: []
---

# Review: documentation, metadata and wording (0.3)

Reviewed revision: feaca8b (not branch HEAD bdab5e8; see discoveries). Diff scope: 639e24b..feaca8b.

## Blocking

1. **Feature workflow still makes the integration Implementer own merging.**
   - Location: `skills/ruach-workflow-feature/SKILL.md:32`. Also lines 3, 10 and 20, which still pair "merging" with integration.
   - Problem: line 32 says "Choose an Implementer to own integration and merging; the same worker may implement the feature." Step 8 (about line 94) says delivery is a separate Implementer assignment created only after independent review and confirmed user authorization.
   - Why it matters: a Coordinator following step 2 can assign the merge up front, before review and authorization. That breaks the user requirement and contradicts the same file.
   - Suggested direction: step 2 should plan integration only and note that delivery is assigned later under step 8. Use "delivery" instead of "merging" in line 10 (and in the description if wanted).

2. **Worked examples show the old merge flow.**
   - Location: `docs/examples/consumer-example.md:36` ("The integration Implementer merges the accepted revision…") and `docs/examples/direct-compact-full.md:11,25` ("review, merge and cleanup", "and a merge").
   - Problem: the example has no separate delivery assignment, no confirmation of user authorization, no exact reviewed revision, no destination-has-not-moved condition, and no `delivered_revision`. The integration worker does the merge.
   - Why it matters: Track D asks for a complete request-to-delivery example. Newcomers copy it, and it teaches the flow the user rejected.
   - Suggested direction: rewrite consumer-example section 6 as a delivery Implementer assignment gated on review plus authorization (the request says "merged to main locally", which can serve as the authorization), returning `delivered_revision`. Say "delivery" in direct-compact-full.

## Optional

3. **Docs-consistency tests are weak.** `tests/docs-consistency.test.ts` mostly checks that strings are present or absent. Nothing covers the escalation rule, the absence of a Merger role, the delivery gating, or the example flow, so findings 1–2 passed all 84 tests. Suggest asserting there is no "Merger" and no "integration … and merging" in the workflow, and that `delivered_revision` and the delivery rule appear in the Implementer role, the workflow and the example. `tests/readme-routing.test.ts` is meaningful: it extracts the README YAML and resolves routes offline, including the rejection of an undeclared route.
4. **Escalation override mechanism is unspecified.** The default of 2 and "consumer may override" appear in `agents/coordinator.md`, the workflow and the README, but none says where a consumer sets the number (assignment, guidance or catalog). Name one place, for example consumer guidance or the assignment.
5. **README harness list narrower than the schema.** README "Choose your models" says `harness` is `claude` or `codex`. `skills/ruach-herdr/references/routing.md` says any registered harness; gated ones stay declarable and fail at preparation with exit 3. Say "claude or codex (others are declared but unsupported)".
6. **Minor.** The `ruach-testing` shuffle example uses `[...out].sort()`. The default sort is lexicographic, which is fine for 1–4 but misleading in general. `agents/coordinator.md:77` still lists "merge" as a pending step; this is acceptable as delivery.

## Checked and fine

- No Merger role anywhere: the only "Merger" hits are the assignment files and the changelog statement "no Merger role".
- Escalation in the workflow, Coordinator role and README is consistent: default 2, consumer-overridable, launch failure distinguished from work-quality failure, Architect before a stronger-model retry, declared alternatives only with authorization, no invented routes, recorded in the task record (task-record.md has an escalation entry).
- Implementer "justification" and Coordinator "approval" are consistent across `agents/implementer.md`, the specimen and the changelog.
- "Choose your models" matches `routing.md`: default `.agents/` catalogs, `--catalogs DIR`, `--route` explicit-only alternatives, direct `--kind/--model/--effort`. `worker.ts` usage confirms the flags.
- `just ready` and `ready --route skill|native|herdr [--json] [--project] [--skills]` exist and behave as documented. Other recipes named in the README exist in the justfile. `just check` passed, so relative links resolve.
- Compatibility frontmatter on executable skills is parseable; `just check` and the handoff and eval suites tolerate it. Reviewer, Librarian, feature-workflow and `ruach-harness-eval` descriptions match the roadmap.
