task: WAVE2 R6-P/R7-P offline evaluation packets (recovery v2)
status: complete
outcome: "Two isolated offline packet directories prepare deterministically and are exercised by their own public boundary tests; no model subject was run and no source merge or publication occurred."
candidate_revision: 6d802ec26e29d62767f3b7c45f0dae96c9b088df
tested_revision: 6d802ec26e29d62767f3b7c45f0dae96c9b088df
source_baseline: cf52c78151b5ac80413bb1ef8fae1a5bf1ff812e
artifacts:
  - "evals/ruach-handoff-delivery/ (R6-P: prepare.ts, cases/01-04, expected/rubric.md, README.md, tests/prepare.test.ts, tsconfig.json)"
  - "evals/ruach-verification/ (R7-P: prepare.ts, cases/01-05, support/, expected/rubric.md, README.md, tests/prepare.test.ts, tsconfig.json)"
  - docs/reports/r6-r7/packets.md
verification:
  - "bun test --timeout 30000 evals/ruach-handoff-delivery: exit 0, 8 pass, 239 expect, 6.2s"
  - "bun test --timeout 30000 evals/ruach-verification: exit 0, 11 pass, 314 expect, 0.9s"
  - "bun x tsc -p evals/ruach-handoff-delivery/tsconfig.json: exit 0, no diagnostics"
  - "bun x tsc -p evals/ruach-verification/tsconfig.json: exit 0, no diagnostics"
  - "prepare CLI boundary controls (worker scratch runner): both packets refuse an existing output path and are reproducible across fresh roots; R6 validates 13 committed reports with 1 expected-invalid, R7 validates 1"
  - "just check: exit 0 (resource identities, eval placement and relative Markdown targets; tsc -p tsconfig.json clean)"
  - "just release-check: exit 0 (Release v0.3.1 metadata and changelog verified)"
  - "bun run test: exit 0, 100 pass across 10 files, 14.5s"
  - "(cd skills/ruach-handoff && bun test): exit 0, 28 pass, 13.5s"
  - "generated handoff reports validated in their own fixture repositories by skills/ruach-handoff/scripts/validate.ts via prepare.ts"
discoveries:
  - "The predecessor's partial evals/ruach-handoff-delivery/prepare.ts was preserved and completed: the declared post.checkout field is now implemented, and the frozen GIT_* scrub plus fixed identity/date keep hashes reproducible."
  - "No packet edits any source skill, schema, validator, role, root test, roadmap, changelog, operations, regression inventory or shared specimen; both packets live under top-level evals/ and are excluded from installed skills."
  - "The R6-G/R7-G guidance revision c874310bda67d78fed50d984cd1af6f0e8cecd6b (tested d657f71) on retained branch ruach/wave2-r67-guidance was not read as accepted: source guidance is still under independent review."
blockers:
  - "Open gate (not a failure of this task): both packets require a final refresh to the independently accepted R6-G/R6-S and R7-G guidance/specimens before packet acceptance or any subject execution; preparation of the disjoint raw fixtures did not wait for that gate."

# R6-P/R7-P offline evaluation packets (recovery v2)

## Summary

This recovers the interrupted `r67-packets` assignment in the same worktree and branch
(`ruach/wave2-r67-packets`) from published base `cf52c78151b5ac80413bb1ef8fae1a5bf1ff812e`.
The predecessor's only surviving artifact, `evals/ruach-handoff-delivery/prepare.ts`, was
inspected and completed within scope; nothing useful was reset or deleted. Two disjoint offline
packets now exist, each with a deterministic builder, synthetic raw cases, a grader-only rubric
and public boundary tests. No model subject was run or graded, and no source, shared-doc,
roadmap, changelog, operations or regression file was changed.

## What was delivered

- `evals/ruach-handoff-delivery/` (R6-P, delivery). Cases `01-evidence-identity`,
  `02-target-authority`, `03-queue-partials`, `04-receipt-remote`. Real isolated Git histories
  are built with fixed identity and dates; a report-only successor, a behavior-changed candidate
  and a tree-object revision field are among the committed reports validated individually by the
  existing handoff validator.
- `evals/ruach-verification/` (R7-P, verification). Cases `01-environment-defect-unknown`,
  `02-registered-retry`, `03-main-recurrence`, `04-exit-truncation`, `05-invariant-split`.
  Consumer policy files, raw logs and register extracts are read-only; `support/verifier.ts` and
  `support/transport.ts` are packet-local test support for the exit/log transport controls.
- `prepare.ts` (both packets) writes `subject/<case>/` (task plus corpus, with a genuine Git
  repository where the case has one), a byte-identical `protected/<case>/corpus/` copy for later
  comparison, and `evaluator/manifest.json` with refs, per-file digests/modes and each committed
  report's validator result. Raw owner evidence, policy, logs, observations and retained
  artifacts are mode 0444.
- `expected/rubric.md` (both packets) is grader-only: it names each required disposition, its
  critical failure, the comparison with the public examples and the answer-leakage review.

## Delivery contrasts (R6)

| Case | Contrast realized |
| --- | --- |
| 01-evidence-identity | Tested `export-impl`, an evidence-only successor that changes only a report path, a behavior change in `src/export.ts` whose refreshed report still claims the older tested revision, and a report whose `candidate_revision` is a tree object (validator-invalid). |
| 02-target-authority | One unmoved target the grant covers (fixture fast-forward reaches exactly the reviewed candidate), one moved target after review, and one unmoved target the grant does not name. |
| 03-queue-partials | Two unit-only reviews, then a continuation's combined review; a requested dirty diff, two untracked files and a retained checkout all preserved; a second candidate whose path collides with an untracked file. |
| 04-receipt-remote | Local delivery at the reviewed revision, a stale cached `refs/remotes/...` ref, a from-scratch failed authorized publication, and an owner-authorized single live read that was not performed at capture time. |

## Verification contrasts (R7)

| Case | Contrast realized |
| --- | --- |
| 01-environment-defect-unknown | Socket denial before any assertion, the same permission-looking surface produced by candidate code after assertions under supported permissions, and a truncated log whose cause is unestablished. |
| 02-registered-retry | A permitted same-state retry that passes, a no-rerun entry, a mismatched symptom, a changed candidate, and a permitted retry that fails again. |
| 03-main-recurrence | A worker-sandbox exemption that is matched exactly, versus repeated failures in the primary supported environment. |
| 04-exit-truncation | Verifier exit 23 beyond a 120-line prefix with the full log retained, a verifier pass with a failed log writer, and a genuine complete pass. |
| 05-invariant-split | An order-unspecified exact-list assertion versus an explicit reproducible seeded-order contract, with raw missing/duplicate member failures and a private implementation change that preserves public behavior. |

## Verification evidence

All commands ran in the assigned worktree at the candidate revision above. Packet suites and
packet typechecks passed; the preparation boundary controls confirmed fresh-output handling,
refusal to overwrite and reproducibility for both packets. `just check`, `just release-check`,
root `bun run test` (100 pass) and the handoff suite (28 pass) all exited 0. The existing
canonical validator ran against every generated committed report inside its fixture repository.

No test asserts report prose or helper calls; the assertions cover observable files, Git
objects/refs/status, protected digests/modes and subprocess exits. The transport control uses a
synthetic verifier that prints 130 lines and exits 23, so a naive `verifier | head` pipeline
exposes a viewer exit of 0 while the verifier's real status is nonzero; a log path that cannot be
opened fails before any result is attributed; and the exit-0 case remains a full pass.

## Gate, scope and holds

- Open gate: the packets are disjoint preparation only and must be refreshed to the independently
  accepted R6-G/R6-S and R7-G guidance/specimens before packet acceptance or execution. The
  guidance revision on the retained guidance branch is independently reviewed, not yet accepted,
  and was not treated as authority here.
- No source merge, no publication, no push, no tag, no main mutation, no native model subject, no
  worker launch and no task-resource cleanup were performed.
- Original synthetic/hosted/native proof limits stay named: this is fixture-mechanics evidence,
  not behavioral proof and not blind-access evidence. A future execution needs the exact accepted
  resource set, an actual access boundary with positive and negative probes, and a named
  route/model/effort/permissions/budget supplied by the evaluation Coordinator.
- The unchanged assignments `docs/assignments/wave2/r67-packets.md` and
  `docs/assignments/wave2/r67-recovery.md` are committed with this report, not before it.

## Commit topology

The product candidate commit (packets and preparation tests only) is `candidate_revision` and
`tested_revision` above. This report and the two unchanged assignments form a separate
report-creating commit whose SHA is returned externally; it is deliberately absent from this
report so no revision is guessed or circular.
