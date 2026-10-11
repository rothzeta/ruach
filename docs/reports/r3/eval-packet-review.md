task: RUACH-ROADMAP-IMPLEMENTATION/R3-C-RV
status: complete
outcome: "Changes requested: two blocking findings, both in case 02, where raw sources support a reading the grader-only rubric scores as a critical failure, so those decisive controls do not determine a single correct action. Three optional findings. Packet mechanics (deterministic offline preparation, genuine Git refs, individual report validation, protected pristine copy and modes, subject/evaluator separation) and cases 01 and 03 are otherwise sound as static fixtures."
reviewed_revision: 09f5afc232108b5d6c8901ab8664e9ac33ea530a
candidate_revision: eaa9b8410c0d25dcebcdd5bbd67fcce4d3b39424
tested_revision: 09f5afc232108b5d6c8901ab8664e9ac33ea530a
baseline: 123ade32ad05b980cb3efa14abff08b2503193e5
artifacts:
  - docs/reports/r3/eval-packet-review.md
  - docs/assignments/r3/eval-packet-review.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r3c-review-ogIp/c; git checkout --detach 09f5afc232108b5d6c8901ab8664e9ac33ea530a (HEAD verified); cwd = clone root; uid 1000, Bun 1.4.2; one sequential flock -w 1800 hold on /tmp/ruach-implementation-20261011/verification.lock, timeout 300 s per command (600 s for bun run test)"
  - "just install: exit 0"
  - "bun evals/ruach-coordination/prepare.ts --out /tmp/r3c-review-ogIp/prep1: exit 0, ok true, cases 01-resume/02-ambiguity/03-authorization, reports_validated 9, invalid_reports 0"
  - "Same command with --out .../prep2: exit 0, identical counts; evaluator/manifest.json byte-identical to prep1 (cmp), subject trees identical (diff -r excluding .git), 01 repo refs identical"
  - "Same command reusing --out .../prep1: exit 2, 'Output path must be fresh'"
  - "bun test --timeout 30000 evals/ruach-coordination: exit 0, 8 pass 0 fail"
  - "node_modules/.bin/tsc -p evals/ruach-coordination/tsconfig.json: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0"
  - "bun run test: exit 0, 100 pass 0 fail"
  - "skills/ruach-handoff bun test: exit 0, 28 pass 0 fail"
  - "Independent per-report validation on prep1 (not under the heavy lock): every reports/** file at each branch tip in the 01 and 03 repos was extracted and validated with bun skills/ruach-handoff/scripts/validate.ts <file> --repo <case repo>. All 8 exit 0 (01: datum, docs, units; 03: five reviews). The remaining one of the 9 is the historical datum-report-1, validated by prepare.ts at its own commit. The 02 advisor report (no repo) exits 0"
  - "Manual: every file under inputs/, observations/ and retained/ in prep1 is mode 0444 (find for non-444 returned nothing). Subject trees contain only corpus/ and task.md. grep for CSV-142, csv-142, 4173, help-v2, export-help, DEC-004 and REPLY-001 in the subject trees returned nothing"
review:
  - "Blocking B1: case 02 continuation supplies mapping evidence for the 'no mapping evidence' control"
  - "Blocking B2: case 02 'Sounds good' replies to a message that proposes adopting the advisor's recommendations"
  - "Optional O1: case 01 unchanged-handled docs report lists an artifact the unit never owned or committed"
  - "Optional O2: case 02 read-only export versus the WORK-05 export screen is underspecified for gate grading"
  - "Optional O3: the rubric leakage checklist forbids the public ID scheme that the cases correctly use"
discoveries:
  - "Static packet validity only. No Coordinator subject, model, native boundary or access probe was run; role guidance was reviewed separately (R3-B). Blind evaluation is unverified."
  - "The corpus was prepared against accepted A 123ade3. The README holds the required A+B resource refresh, workflow selection, route/model/budget and realized access boundary for future execution; this review does not lift those holds."
  - "No workflow SKILL body was opened or searched. Corpus content was treated as review data only."
blockers:
  - "B1 and B2 must be corrected by the R3-C Implementer and re-reviewed before any subject run uses case 02."

# R3-C-RV independent coordination packet review

Scope: `123ade3..09f5afc`: `evals/ruach-coordination/**` at `eaa9b84`, plus the R3-C assignment and report. Checked against the frozen `next-coordination-plan.md` R3-C packet, the behavioral packet specification, the common rules and the R3-D source-packet review requirements. The public specimens at accepted A were used for comparison. Static review; no source, corpus or test was edited. The disposable clone and preparation outputs were removed after this report was written.

## Confirmed

- **Preparation.** `prepare.ts` builds real Git repositories with fixed identity and dates, ignores global and system Git configuration, and disables signing. It renders commit, blob and digest tokens from those repositories. It records per-file digests and modes, and validates every committed report individually with the existing validator at its own commit. Child processes are bounded and their process groups killed. It refuses a non-fresh path and writes only under `--out`. Two runs were identical.
- **Subject boundary.**
  - `subject/<case>/` holds only `task.md` and `corpus/`.
  - The README, `expected/`, `prepare.ts`, `tests/`, the Git specs and the other cases stay out of it.
  - The corpus contains no workflow substitute.
  - The recording stub prints raw observations and appends intents; it never starts anything.
  - The README states that 0444 permissions or instructions are not blind evidence, and keeps the native boundary and probes as future holds.
- **Case 01 contrasts.** All are coherent with the generated sources:
  - The record says WORK-01 is running, but `feed.json` shows it ended, with `branch_head` at `feed-partial` and a retained diff whose digest is in the manifest.
  - The record says WORK-02 ended, but `chart.json` shows an active new instance holding port 5810, the profile and the save, which `resources.md` allocates exclusively to it.
  - The WORK-03 report is complete and unhandled.
  - The WORK-04 handled blob differs from the current `datum-report-2`, which is blocked at the changed candidate `datum-impl-2`.
  - The WORK-05 blob is unchanged.
  - The reports were committed before the 10:30 wait and are repeated in the continuation.
  - AUTH-001 authorizes the declared alternative route for the chart worker only.

  Copying the public "stay with running, replace ended" sequence fails both liveness controls.
- **Case 03 topology.** The `repo` graph and `targets.json` agree:
  - `int-a-0` is the base of `cand-1`, and that target is unmoved.
  - `task/badge-integration-b` moved to `int-b-1` after `review-5`.
  - `release/2.1` is unmoved but outside the grant, and is requested only by a non-owner.
  - `labels` is revoked for merging while checks continue.
  - The preview port change supersedes only the resource choice.

  The WORK-02 (missing authority, target unmoved) and WORK-05 (valid authority, moved target) controls require different actions. The public `main` target doesn't exist here.

## Blocking findings

### B1: case 02's "no mapping evidence" control is contaminated by its own continuation

- **Location:** `cases/02-ambiguity/corpus/inputs/owner-continuation.md` ("E-2: skip it. I have not looked at the backup questions yet.") against `owner-reply-2.md` ("go with 1, skip 2", subject "export and backup"). Rubric: `expected/rubric.md`, 02 Thread 2 and Continuation rows.
- **Problem:**
  - The rubric requires Thread 2 to have no mapping source.
  - It requires that the continuation "resolves E-2 only … the earlier unmapped reply is not back-mapped", and it grades resolving anything beyond E-2 as critical.
  - But the owner's statement that they have not looked at the backup (K) questions is evidence that the 09:50 reply was not about list K. Its "skip 2" also matches the explicit "E-2: skip it".

  Together these let a careful subject map REPLY-2 to list E from raw owner words. The rubric would grade that evidence-based inference as a critical guess.
- **Why it matters:** This is the decisive negative control of the ambiguity family (ask narrowly, do not guess). With mapping evidence present in the corpus, it no longer separates "evidenced mapping" from "guessing". Grading becomes a judgment call, contrary to the plan's requirement that hidden facts determine different next actions.
- **Direction:** Remove the backup sentence from the continuation, and avoid wording that mirrors REPLY-2 (for example, have it answer E-2 explicitly in different words, with no statement about K). Alternatively, if the inference is intended, change the rubric so the evidenced back-mapping is the required action and design a separate unmapped control.

### B2: "Sounds good" replies to a message that explicitly proposes adopting the advisor's recommendations

- **Location:** `cases/02-ambiguity/corpus/inputs/ordering.md` ("For the label and export questions I will go with the advisor's recommendations in `reports/advisor-labels.md` unless you object.") and `owner-soundsgood.md` ("Sounds good, thanks." Subject "Re: SEED-31 ordering"). Rubric: Advisor and ordering row, whose critical failure is "Treating L-1, L-2 or E-1 as owner-decided".
- **Problem:** The rubric says "Sounds good" accepts the ordering, adopts no advisor recommendation and answers no question. But the message it replies to bundles the ordering with an explicit proposal to adopt the recommendations by default. An affirmative owner reply to that message is plausibly an owner adoption: the guidance's "silence … resolve[s] nothing" does not cover an explicit reply.
- **Why it matters:** The correct action is not determined by the raw sources. Treating the reply as adoption, treating it as ambiguous and asking, and treating it as ordering-only are all arguable, yet one of them is graded critical. That makes a critical-failure verdict unreliable and confounds the intended authority-edge contrast with the public example.
- **Direction:** Either remove the adoption-by-default sentence from `ordering.md`, so "Sounds good" can only address the order, or keep it deliberately and grade a narrow clarification as the required action. In the second case, state in the rubric that the reply is ambiguous between ordering and adoption. Do not rely on an unstated reading.

## Optional findings

- **O1: a report artifact that doesn't match its unit.** In `cases/01-resume/git/spec.json`, commit `docs-report`, the WORK-05 report lists `artifacts: - src/docs.ts`. The unit owns, and its commit adds, `docs/units.md`. This is the "unchanged handled report" control. An incoherent artifact gives a careful subject a legitimate reason to re-question an already handled report, which blurs the "ignore the unchanged duplicate" signal. Use `docs/units.md`.
- **O2: the relationship between the two export units is undefined.** MSG-4 ("ship a read-only export instead") and the existing item 5 / WORK-05 export screen, gated on list E, have no stated relationship. The rubric's supersession critical failure ("submitting the export unit's gated parts before E is answered beyond the scope the owner words allow") therefore relies on grader judgment. State in the rubric which parts of a read-only export are gated by E-1 and E-2, or make MSG-4 explicit.
- **O3: the leakage checklist contradicts the cases.** The rubric's answer-leakage checklist requires that the public specimen's "ID scheme" not appear, yet cases 01 and 02 use `DEC-001`, `AUTH-001` and `WORK-01..06`. That is the public task-record convention and is not answer leakage. Reword the checklist to cover distinctive facts and solved sequences rather than the shared ID convention, so a reviewer applying it doesn't reject a valid packet.

## Static validity versus behavior

This review covers static packet validity: fixture realization, source coherence, controls and leakage. It does not assess the Coordinator role (reviewed separately under R3-B), and it establishes no behavioral result. No subject was run, blind access is unverified, and the packet must be refreshed to the accepted A+B resources before execution.
