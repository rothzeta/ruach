task: RELEASE-0.3.1-PUBLICATION-FIX
status: complete
outcome: "Metadata-only repair of the 0.3.1 publication import. The two quoted relative CHANGELOG references in docs/reports/releases/0.3.1/review.md now resolve from the report location, so just check passes again; the original review bytes are retained in cf7c77e. The delivery receipt was corrected to distinguish the actual local checks from the not-yet-performed publication. No product, source, test or plan change, and no push or tag change."
candidate_revision: c2e6d4cf9a623ac56d7a7d039e8b61044d60acc7
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: 363da220d06017101a5c85d876ae75da15171d73
destination_before: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/publication-fix.md
  - docs/reports/releases/0.3.1/delivery.md
  - docs/reports/releases/0.3.1/review.md
  - "original review bytes retained at cf7c77eb:docs/reports/releases/0.3.1/review.md"
  - "annotated tag v0.3.1 and native ruach--v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73 (local, unpushed)"
verification:
  - "Repair scope: exactly 2 occurrences in docs/reports/releases/0.3.1/review.md changed from '](../../CHANGELOG.md' to '](../../../../CHANGELOG.md'; the file equalled the cf7c77eb blob immediately before the change (asserted)."
  - "just check: exit 0 (it failed with two 'Broken target in docs/reports/releases/0.3.1/review.md: ../../CHANGELOG.md' errors before the repair)."
  - "just release-check: exit 0, 'Release v0.3.1: package, plugin, marketplace, agents and changelog verified'."
  - "git diff --check d75039aa7b82b262e2f28af08630258fb7f77180 c2e6d4cf9a623ac56d7a7d039e8b61044d60acc7: exit 0, no diagnostics."
  - "Exact comparison: changed-vs-delivery-receipt set is exactly docs/reports/releases/0.3.1/review.md; zero product/source change versus 363da220 (scripts, skills, agents, tests, evals, .github, docs/design, docs/reports/roadmap-planning, docs/examples, coordination/native-parity/roadmap/operations/regression docs, package.json, README.md, CHANGELOG.md, .claude-plugin); all 381 payload paths are blob-identical to 363da220."
  - "Link check: both repaired review.md targets resolve from the report location; 0 unresolved links in review.md."
  - "Reused, not rerun: full root/skill/packet suites from the source-identical tested 4cca79b9 (root 100, herdr 162, handoff 28, harness-eval 71, changelog 35; packet suites 14 and 10)."
  - "Publication: NOT performed; push of main and both tags is pending the independent focused review. Tags are local and still point at 363da220."
  - "Handoff validated with bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/publication-fix.md --repo /opt/dev/ruach (see Validation)."
review: not-run
discoveries:
  - "scripts/check.ts strips fenced code blocks but not inline code, so a quoted [text](path) inside backticks is treated as a live relative link. The two repaired references were quoted plan-link text, not live links; the repair makes them resolve without changing the surrounding prose."
  - "No product behavior, version metadata, tag target, source contract or publication state changed by this repair."
blockers:
  - "Independent focused review of this import repair is required before push; publication is not performed."

# Ruach 0.3.1 publication fix (metadata-only)

The reviewed publication candidate `363da220` is on main with two metadata successors (`668028ac…` review evidence, `c2e6d4c…` import-link repair) and both release tags on `363da220`; nothing is pushed. This handoff records the repair and the exact checks. The original reviewer bytes remain available through the `cf7c77eb` Git objects.

## Validation

Run at the candidate: `bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/publication-fix.md --repo /opt/dev/ruach` and `git diff --check` on the change; results recorded in the returned terminal handoff. The creating commit of this report is returned externally; it is not named inside the report.
