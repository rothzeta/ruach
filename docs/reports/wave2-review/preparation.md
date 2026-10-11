task: WAVE2-PREPARATION-REVIEW
status: complete
outcome: "Independent preparation review of three disjoint units. Guidance R6-G/R7-G at c874310b passes. R4-P/R5-P at 818ed627 has a reproducible R5 packet test failure and an inaccurate verification claim. R6-P/R7-P at afcd17c passes. No combined R4-R7 acceptance is claimed."
artifacts:
  - docs/reports/wave2-review/preparation.md
  - docs/reports/wave2-review/evidence/checks.md
  - docs/reports/wave2-review/evidence/guidance-examples.json
  - docs/reports/wave2-review/evidence/packet-cli-controls.json
  - docs/reports/wave2-review/evidence/r45-communication-suite.txt
  - docs/assignments/wave2/preparation-review.md
reviewed_revision: c874310bda67d78fed50d984cd1af6f0e8cecd6b
tested_revision: d657f71e1bac28fbcd28f1cdd116a296be5b0811
r45_reviewed_revision: 818ed6274cba6405ea857beb630db3187c9c69cf
r45_tested_revision: aac679ed95606841119575769894b80f9a3b7b9a
r67_reviewed_revision: afcd17ce489ed7d5ca8afa462f91dee97944dbf6
r67_tested_revision: 6d802ec26e29d62767f3b7c45f0dae96c9b088df
verification:
  - "guidance @c874310b: just check exit 0; just release-check exit 0; bun run test exit 0 (100 pass/0 fail, 10 files, 14.55s); handoff suite exit 0 (28 pass/0 fail, 13.45s); canonical validate guidance.md --repo ok true"
  - "guidance delivery.md examples via bounded helper: 3/3 blocks exit 0 against real temp Git refs; negative control (fixture/absent candidate_revision) exit 1 REVISION_MISSING"
  - "r45 @818ed627: just check exit 0; just release-check exit 0; permissions suite exit 0 (7 pass/0 fail); permissions+communication tsc exit 0; canonical validate preparation.md --repo ok true (candidate/tested aac679ed)"
  - "r45 @818ed627: bun test --timeout 30000 evals/ruach-communication exit 1 (9 pass/1 fail), reproduced isolated on a second run"
  - "r67 @afcd17c: just check exit 0; just release-check exit 0; handoff-delivery suite exit 0 (8 pass/0 fail); verification suite exit 0 (11 pass/0 fail); both packet tsc exit 0; canonical validate packets.md --repo ok true (candidate/tested 6d802ec, source_baseline cf52c78)"
  - "CLI controls (helper, OS temp): all four prepare CLIs fresh exit 0 and refuse an existing output exit 2; R4 temp/unix/tcp probes exit 0, tcp bound 127.0.0.1:0 (ephemeral 42659), timedOut false"
  - "bun install --frozen-lockfile in repo root, skills/ruach-handoff, skills/ruach-herdr, skills/ruach-harness-eval and canonical /opt/dev/ruach/skills/ruach-handoff; no global install or tracked-file change"
review: not-run
discoveries:
  - "Blocking for R4-P/R5-P: the R5 communication packet does not pass its own committed public boundary test at the reviewed revision. corpus/verifier/run-2.json declares full_log 'verifier/run-2.log' and tests/packet.test.ts:182 requires that file to exist, but no run-2.log is committed or ignored anywhere in the packet."
  - "docs/reports/r45/preparation.md claims 'bun test --timeout 30000 evals/ruach-communication: 10 pass, 0 fail, 299 expect() calls' at aac679ed; the observed result is 9 pass/1 fail at both aac679ed and the reviewed successor 818ed627, so the report's verification claim is not reproducible."
  - "Guidance wording: the report states 'No native subject, paid turn, benchmark or behavioral proof ran'. A paid engineering implementation turn did run; the accurate claim is that no paid/benchmarked evaluation SUBJECT ran. The current sentence conflates the two."
  - "R6-P/R7-P and R4-P pass their suites and CLI controls; their fixture tests assert Git objects, modes, protected digests and process exits rather than report prose, and the subject trees withhold grader material."
  - "All three handoff reports resolve their revisions mechanically and reuse no forbidden ancestry; the r67 report correctly holds the final refresh to accepted R6-G/R6-S/R7-G as an open gate."
blockers:
  - "R4-P/R5-P cannot be accepted as prepared until the missing committed R5 verifier log (or an equivalent consistent fix) is added within evals/ruach-communication/** and both packet suites pass; docs/reports/r45/preparation.md must then record the actual result."
  - "Remaining explicit holds, not performed here: R4-S/R5-S native behavior, packet final refresh to accepted R6-G/R6-S/R7-G, HV-IN/B2-IN shared-doc assembly, and all blind/native/Claude/Codex/hosted approval evidence."
  - "No combined R4-R7 integration or whole-batch acceptance is reviewed or claimed; this is per-unit preparation evidence only."

# WAVE2-PREPARATION-REVIEW

Independent review of three disjoint preparation units. This document is the
review; it is not self-acceptance and has not itself been consumed. Scope is the
exact pinned revisions above; no combined R4-R7 union was checked.

## Unit verdicts

| Unit | Reviewed revision | Product/tested | Verdict |
| --- | --- | --- | --- |
| R6-G/R7-G guidance | `c874310bda67d78fed50d984cd1af6f0e8cecd6b` | `d657f71e1bac28fbcd28f1cdd116a296be5b0811` | Pass, with one report-wording finding |
| R4-P/R5-P packets | `818ed6274cba6405ea857beb630db3187c9c69cf` | `aac679ed95606841119575769894b80f9a3b7b9a` | Request changes: blocking R5 test failure |
| R6-P/R7-P packets | `afcd17ce489ed7d5ca8afa462f91dee97944dbf6` | `6d802ec26e29d62767f3b7c45f0dae96c9b088df` | Pass within its assigned scope |

The 818ed627 and afcd17c successors touch only reports and unchanged
assignments, so the packet content is the same as their tested revisions.

## Guidance (R6-G/R7-G)

The new `skills/ruach-handoff/references/delivery.md` and
`skills/ruach-testing/references/verification.md`, the one-line links from the
existing skills, and the Reviewer role additions are within the owned paths and
add no status, schema field, validator, parser, CLI or runtime change. The
relative links from `agents/reviewer.md`, `skills/ruach-simplification/SKILL.md`
and both skills resolve under `just check`.

I independently instantiated the three shipped YAML examples against real
temporary Git objects (`fixture/before`, `fixture/reviewed`, `fixture/target`,
`fixture/report`) and validated each with the canonical validator: all three exit
0. A negative control with a promised-but-absent `candidate_revision` fails exit 1
with `REVISION_MISSING`, matching the report. The report itself resolves
`tested_revision` d657f71 and the handoff suite (28 pass) and root suite (100
pass) are green. No material source finding.

Finding G1 (low, report accuracy). The guidance report's discovery "No native
subject, paid turn, benchmark or behavioral proof ran" is ambiguous: this
implementation was itself a paid engineering turn. The assignment requires
distinguishing a paid engineering worker from the absence of a paid evaluation
subject. Direction: reword to state that a paid engineering implementation turn
ran but no paid/benchmarked evaluation subject or behavioral proof ran.

## R4-P/R5-P packets

The R4 permission packet is sound: it builds a real linked worktree whose
admin/common Git directories resolve outside the working directory, protects
`tests/`, `Justfile`, `package.json` and `.gitignore` at mode 0444 with pristine
copies, realizes distinct `just test`/`just test-focused` markers, and its
temp/unix/tcp probes are bounded, self-cleaning and confined to an owned scratch
subtree and `127.0.0.1:0`. Its suite passes 7/0 and I reproduced the probes
independently. The recording stub performs no real worker action.

Finding R1 (blocking, R5 communication packet). Location:
`evals/ruach-communication/tests/packet.test.ts:182`, with
`evals/ruach-communication/cases/05-timeout-verifier/corpus/verifier/run-2.json:11`.
Problem: the `05-timeout-verifier` case's completion artifact declares
`full_log: "verifier/run-2.log"`, and the test requires
`existsSync(join(corpus, artifact.full_log))` to be true and the log to contain
the requested marker, but no `run-2.log` is committed. Why it matters: the
packet's own public boundary test cannot pass, so the packet is not internally
consistent and the R5 fixture cannot validate its own retained-log claim.
Evidence: `bun test --timeout 30000 evals/ruach-communication` gives 9 pass/1
fail both concurrently and isolated; `git ls-files
evals/ruach-communication/cases/05-timeout-verifier` lists only
`GUIDANCE.md`, `inputs/owner-request.md`, `observations/idle-no-report.json`,
`observations/prompt-timeout.json`, `verifier/marker-run.json`,
`verifier/run-2.json`, `task.md`; the file is neither present nor ignored. See
`evidence/r45-communication-suite.txt`. Direction: commit the referenced retained
log (for example a rendered `corpus/verifier/run-2.log` retaining the marker) or
make the artifact and assertion consistent within `evals/ruach-communication/**`,
then re-run both packet suites; do not weaken the assertion.

Finding R2 (major, report provenance). Location:
`docs/reports/r45/preparation.md` verification entries. Problem: the report
asserts `evals/ruach-communication: 10 pass, 0 fail, 299 expect() calls` at
aac679ed, but the actual result is 9 pass/1 fail with 288 expect() calls at both
aac679ed and 818ed627. Why it matters: the exact precommit-versus-committed
provenance claim is not reproducible, which undermines the handoff's evidence
basis. Evidence: the two reproduced runs and `git diff --stat aac679e..818ed62`
(report and assignment only). Direction: fix the packet (R1) and record the
actual suite result and revision rather than the asserted pass.

No scope, schema, runtime, launcher or role expansion was found; edits stay in
`evals/ruach-permissions/**`, `evals/ruach-communication/**`, the report and the
unchanged assignments.

## R6-P/R7-P packets

Both packets build genuine, deterministic isolated Git histories (fixed identity
and date, scrubbed `GIT_*`) and separate `subject/` from `protected/` copies.
Their tests assert observable Git objects, refs, porcelain status, protected
digests/modes and subprocess exits, and they include positive and negative
controls: the R6 evidence-identity case distinguishes a tested revision, a
report-only successor, a behavior-changed candidate that still claims the older
tested revision, and a tree-object revision that fails validation (exactly one
expected-invalid report); target-authority covers unmoved, moved and unauthorized
targets and forwards only the authorized fast-forward; R7 transport support
proves verifier exit 23 survives beyond a 120-line display while the viewer exits
0, a log-writer failure stays incomplete, and a genuine full pass is not
underclaimed. Suites pass 8/0 and 11/0 and both tsc runs are clean. The subject
trees withhold rubric/grader material. I found no material source, schema,
parser, CLI, validator, runtime, launcher, role or scope finding within this
unit, and its final-refresh gate is correctly recorded rather than crossed.

## Scope, method and limits

Read-only inspection covered the exact changed source/docs/tests and the original
immutable assignments in each view; the two non-guidance views were not modified.
Dependency setup used only frozen local installs. No native subject, paid
evaluation subject, benchmark, server, production port, credential read, SSH or
network publication ran, and no task resource was cleaned or released. Root
`bun run test` was run once on the guidance view (it executes `./tests`, not the
evals or skill suites) and not re-run on the other views. Captured R5 failures
were reproduced rather than retried until green.

## Remaining holds

Per-unit preparation only: this is not combined R4-R7 integration or acceptance.
R4-S/R5-S native behavior, the packet final refresh to accepted R6-G/R6-S/R7-G,
HV-IN/B2-IN shared-doc assembly and all blind/native/Claude/Codex/hosted approval
evidence remain explicit holds and were not performed. No original Claude/Codex
compatibility, hosted, blind, native approval, tool or sandbox success is
established.
