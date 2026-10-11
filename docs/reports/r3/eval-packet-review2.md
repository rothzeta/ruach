task: RUACH-ROADMAP-IMPLEMENTATION/R3-C-RV2
status: complete
outcome: "No blocking findings. B1 and B2 are fixed: case 02's negative reply stays unmapped, and 'Sounds good' can only accept a sequence-only ordering. O1-O3 are resolved, with artifact refs verified to exist and the shared ID convention no longer treated as leakage. One optional note on the export-screen grading. Static packet validity only."
reviewed_revision: 25aadf1ddc52f811d270389eb47fc7e9fe61eba9
candidate_revision: d37fbcd7d5b0b14874c6e3e67fca441c90c2312e
tested_revision: 25aadf1ddc52f811d270389eb47fc7e9fe61eba9
baseline: 09f5afc232108b5d6c8901ab8664e9ac33ea530a
artifacts:
  - docs/reports/r3/eval-packet-review2.md
  - docs/assignments/r3/eval-packet-review2.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r3c2-review-OwhX/c; git checkout --detach 25aadf1ddc52f811d270389eb47fc7e9fe61eba9 (HEAD verified; the author checkout was not used); cwd = clone root; uid 1000, Bun 1.4.2; one sequential flock -w 1800 hold on /tmp/ruach-implementation-20261011/verification.lock, timeout 300 s per command (600 s for bun run test)"
  - "History: 09f5afc (and eaa9b84) are ancestors of 25aadf1. git diff --stat 09f5afc 25aadf1 touches only evals/ruach-coordination/{cases/01-resume/git/spec.json, cases/02-ambiguity/corpus/{record.md, inputs/ordering.md, owner-continuation.md, owner-supersede.md, questions-export.md}, expected/rubric.md, tests/packet.test.ts} plus the R3-C-FIX1 assignment and report; prepare.ts and case 03 are unchanged"
  - "just install: exit 0"
  - "bun evals/ruach-coordination/prepare.ts --out /tmp/r3c2-review-OwhX/prep1: exit 0, ok true, reports_validated 9, invalid_reports 0"
  - "Same command with --out .../prep2: exit 0, same counts. Manifests byte-identical (cmp), sha256 50fb6fca9b6934c6ab24b3e49a40e8116b52b3f1485269717eb1daec9406700a, matching the fix report. Subject trees identical (diff -r excluding .git)"
  - "Same command reusing --out .../prep1: exit 2, 'Output path must be fresh'"
  - "bun test --timeout 30000 evals/ruach-coordination: exit 0, 10 pass 0 fail"
  - "node_modules/.bin/tsc -p evals/ruach-coordination/tsconfig.json: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "skills/ruach-handoff bun test: exit 0, 28 pass 0 fail"
  - "Independent on prep1, outside the heavy lock: each of the 9 manifest reports (units-report, datum-report-1, datum-report-2, docs-report, review-1..5) was extracted at its own commit and validated with bun skills/ruach-handoff/scripts/validate.ts <file> --repo <case repo>, all exit 0. Every artifact each report lists exists at that commit (git cat-file -e); missing 0"
  - "Whitespace: git diff --check 09f5afc 25aadf1 exit 0 (owned diff clean). Checked separately: the historical assignment docs/assignments/r3/eval-packet-fix1.md and this review's assignment both end in a single newline"
review:
  - "B1: fixed"
  - "B2: fixed"
  - "O1: resolved"
  - "O2: resolved"
  - "O3: resolved"
  - "Optional N1: the rubric could state explicitly that holding the export screen is acceptable"
discoveries:
  - "The corrected fixture is a new preparation version. The docs branch hash changes because the docs report changed, and earlier preparation outputs were not rewritten. The original packet commit eaa9b84 and report 09f5afc stay in history."
  - "This is static packet validity only. No Coordinator subject, model, native boundary or access probe was run, and blind access is unverified. The README holds remain: refresh to accepted A+B resources, a workflow selected by the evaluation Coordinator, native route/model/budget, and an evidenced access boundary."
  - "No workflow SKILL body was opened or searched. Corpus content was treated as review data only."
blockers: []

# R3-C-RV2 correction re-review

Scope: `09f5afc..25aadf1`, where `d37fbcd` holds the corrections and `25aadf1` adds the fix assignment and report. Reviewed against my original findings (`88f809b`, `eval-packet-review.md`) and the unchanged acceptance and resource boundaries in the original R3-C-RV assignment. I read every rendered case-02 owner message, subject line and continuation in `prep1`. No file was edited. The clone and preparation outputs were removed after this report was written.

## Finding dispositions

**B1: fixed.**
- `owner-reply-2` ("go with 1, skip 2", subject "Re: SEED-31 export and backup") is still the only message that could answer list E or list K.
- The continuation now reads "E-2: leave the notes column out." under subject "SEED-31 export". It answers E-2 by explicit ID, in different words, and says nothing about list K or the earlier reply.
- No later owner message cites a K ID; `grep` for `K-<n>` over the owner messages and the ordering returns nothing.
- The continuation is consistent with either mapping of the earlier reply: an owner might re-answer E-2 because that reply was not about E. E-2 is now explicitly answered, and "go with 1" is not a well-formed answer to either either/or question E-1 or K-1. So no actionable mapping can be inferred.
- The rubric now requires one narrow question about the earlier reply, E-2 recorded from the continuation, and E-1, K-1 and K-2 left open.
- A new grading principle makes only actions or adoptions on unestablished mappings critical, and allows a clearly unadopted tentative note. The control is therefore clean without penalizing a supported reading.
- The positive control (`owner-note-1` mapping the first reply to list P) is unchanged.

**B2: fixed.**
- `ordering.md` now proposes only a sequence. It invites a different order and points to the advisor notes "for your reference".
- "Sounds good, thanks" has subject "Re: SEED-31 ordering", the ordering message's own subject, so it can only accept the order.
- The rubric keeps the advisor proposal, the Coordinator's operational choice and owner evidence as separate rows, and grades recording L-1, L-2 or E-1 as decided as a failure. The packet test checks the subject link and that the ordering cites no question IDs.

**O1: resolved.** The docs report now lists `docs/units.md`, which its commit adds. A new test, plus my independent check above, confirms that every listed artifact exists at its report commit in cases 01 and 03.

**O2: resolved.** The raw sources now cohere:
- The supersession message identifies the read-only export as "the export screen from item 5, with no import in it".
- `questions-export.md` states that E-1 and E-2 fix the file format and columns, and that the screen itself does not depend on them.
- The record gates WORK-05's format and columns on list E.
- The rubric separates the independently assignable screen from the gated parts: the E-1 format is open, and E-2 is answered as no notes column. It grades fixing a format or including the notes column as a failure, and keeps WORK-02 independent.

**O3: resolved.** The leakage checklist now forbids distinctive CSV-142 facts and solved sequences. It names the shared `DEC-`/`AUTH-`/`WORK-` convention as standard, not leakage, and adds a check that no raw source maps the deliberately unmapped reply.

I rechecked all other R3-C acceptance items from the original review and they are unchanged: deterministic preparation, genuine refs, protected 0444 evidence, the subject/evaluator separation, the case 01 and 03 contrasts, and no expected answers in subject paths.

## Optional finding

**N1: the rubric could say explicitly that holding the export screen is acceptable.**
- **Location:** `expected/rubric.md`, 02 Supersession row.
- **Problem:** The screen-independence sentence is authored by the Coordinator (`questions-export.md`), while the owner's original request said items 3 to 6 need answers first. The owner's supersession supports assigning the screen now, and the rubric correctly says it "may" be assigned and does not list holding it as a failure.
- **Direction:** Optionally add that holding the screen pending E-1 is also an acceptable, non-failing action, so a grader doesn't mark cautious behavior down.

## Limitations

- Static packet validity only, separate from the Coordinator role review (R3-B) and from any behavioral result.
- No subject run. Blind access is unverified.
- Installer and Herdr suites were not repeated, since there is no new concern touching them.
