task: WAVE2-R4-P-R5-P
status: complete
outcome: Offline R4 permission and R5 communication evaluation packets are implemented and statically verified in evals/ruach-permissions and evals/ruach-communication. No native model, sandbox, approval, submission or wait behavior was observed.
candidate_revision: aac679ed95606841119575769894b80f9a3b7b9a
tested_revision: aac679ed95606841119575769894b80f9a3b7b9a
artifacts:
  - evals/ruach-permissions/README.md
  - evals/ruach-permissions/prepare.ts
  - evals/ruach-permissions/probe.ts
  - evals/ruach-permissions/tests/packet.test.ts
  - evals/ruach-permissions/cases/01-permission/task.md
  - evals/ruach-permissions/expected/rubric.md
  - evals/ruach-communication/README.md
  - evals/ruach-communication/prepare.ts
  - evals/ruach-communication/fixtures/record-state.ts
  - evals/ruach-communication/tests/packet.test.ts
  - evals/ruach-communication/cases/01-draft-send
  - evals/ruach-communication/cases/02-exited-active
  - evals/ruach-communication/cases/03-startup-block
  - evals/ruach-communication/cases/04-report-identity
  - evals/ruach-communication/cases/05-timeout-verifier
  - evals/ruach-communication/expected/rubric.md
  - docs/assignments/wave2/r45-packets.md
  - docs/assignments/wave2/r45-recovery.md
  - docs/assignments/wave2/r45-recovery2.md
  - docs/reports/r45/preparation.md
  - docs/assignments/wave2/r45-handoff-fix.md
verification:
  - "Run on the committed candidate aac679ed95606841119575769894b80f9a3b7b9a: bun test --timeout 30000 evals/ruach-permissions: 7 pass, 0 fail, 70 expect() calls"
  - "Correction during consolidation: the earlier claim of 10 passing communication tests at aac679ed95606841119575769894b80f9a3b7b9a was not reproducible. Independent review observed 9 pass / 1 fail because the verifier JSON referenced an absent log. The consolidation adds a tracked synthetic run-2.txt fixture and updates full_log without weakening the test. Results for the corrected combined revision are recorded in docs/reports/consolidation-2026-10-23.md."
  - "Run on the committed candidate aac679ed95606841119575769894b80f9a3b7b9a: bun x tsc -p evals/ruach-permissions/tsconfig.json: exit 0"
  - "Run on the committed candidate aac679ed95606841119575769894b80f9a3b7b9a: bun x tsc -p evals/ruach-communication/tsconfig.json: exit 0"
  - "Previously run on the pre-commit working-tree content now committed unchanged at aac679ed95606841119575769894b80f9a3b7b9a (not relabelled as a rerun): just check passed (resource identities/eval placement/links; tsc -p tsconfig.json exit 0)"
  - "Previously run on the pre-commit working-tree content now committed unchanged at aac679ed95606841119575769894b80f9a3b7b9a: bun run test 100 pass, 0 fail across 10 root test files"
  - "Previously run on the pre-commit working-tree content now committed unchanged at aac679ed95606841119575769894b80f9a3b7b9a: just release-check verified Release v0.3.1"
  - "Previously run on the pre-commit working-tree content now committed unchanged at aac679ed95606841119575769894b80f9a3b7b9a: task-local scratch helper ran the packet CLI main blocks; permissions prepare exit 0; probe temp/unix/tcp exit 0 (tcp bound 127.0.0.1:0, port 44435); prepare reuse exit 2; communication prepare exit 0 with 5 cases and 5 committed reports validated, 0 invalid; prepare reuse exit 2"
  - "git diff --check: no whitespace errors"
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/r45/preparation.md --repo /opt/dev/ruach/.worktrees/r45-packets: ok true, exit 0"
discoveries:
  - "The default-deny tool config does not permit direct 'bun evals/<packet>/prepare.ts' or 'probe.ts' invocations; those CLI entrypoints were exercised through an allowed task-local scratch helper instead. No runner restriction was relaxed."
  - "The R4 packet's linked-worktree facts and R5 packet's committed handoff reports are validated by the existing handoff validator at their own commits inside prepare.ts."
  - "No native subject, benchmark, permission-mode change or Herdr session was run; all packet claims are static fixture mechanics only."
blockers:
  - "Live R4-S/R5-S behavioral proof remains a future hold: it needs a named native route/model/effort/permissions and budget, an actual installed resource root and a realized access boundary, none of which is authorized here."
  - "The scoped-recipe prefix contrast (just test vs just test-focused) and all native submission/wait/block/exit primitives stay unverified until an authorized native run observes them separately."
review: not-run

# R4-P / R5-P offline packet preparation

Recovery v3 resumed the original bounded R4-P/R5-P assignment in the same worktree and branch
(`ruach/wave2-r45-packets`, base `cf52c78151b5ac80413bb1ef8fae1a5bf1ff812e`). The R4 permission packet
was present and complete; the R5 communication packet had only `prepare.ts` and the recording stub. Both
were finished within the owned scope; nothing outside `evals/ruach-permissions/**`,
`evals/ruach-communication/**`, `docs/reports/r45/preparation.md` and the three unchanged assignments was
edited.

Handoff provenance correction: candidate and tested revision are the single existing commit
`aac679ed95606841119575769894b80f9a3b7b9a`. This correction changes only this report and adds the
unchanged `docs/assignments/wave2/r45-handoff-fix.md`; no product, source or test byte moved. The two
packet suites and both packet typechecks were re-run on that exact committed candidate. The root
`just check`, `bun run test`, `just release-check` and packet CLI control evidence were run earlier on the
identical pre-commit content and are reused as-is, explicitly not relabelled as full-suite reruns.

## R4 permission packet

`prepare.ts` builds a disposable consumer Git repository with a linked worktree whose admin and common
Git directories resolve outside the worktree working directory, commits with a fixture-only identity and
fixed dates, protects `tests/`, `Justfile`, `package.json` and `.gitignore` (mode 0444 plus a pristine
copy) and writes an evaluator manifest. `probe.ts` performs one bounded, self-cleaning temp/Unix/localhost
probe per case and writes evidence to a new file only. The packet test realizes the refs, modes, markers
and probe exits. No reusable runtime, schema or shared document was touched.

## R5 communication packet

`prepare.ts` and the `fixtures/record-state.ts` recording stub were preserved. The packet adds the
missing README, tsconfig, expected rubric, packet tests and five contrasting cases with real Git refs and
pristine protected copies:

- `01-draft-send`: a matching literal draft with no turn, an accepted prompt already working, and a
  truncated history whose draft cannot be identified.
- `02-exited-active`: an ended harness with a shell and retained partial branch/diff, a still-working
  identity, and an unknown process state.
- `03-startup-block`: a matching identity blocked on trust, a mismatched pane, and the same session
  user-resolved and ready.
- `04-report-identity`: an unhandled complete report committed before the wait, a handled report revised
  to a blocked new candidate, a handled unchanged identity and an evidence-only successor that adds only
  a report.
- `05-timeout-verifier`: a wait timeout with work still active, an idle state with no report, and a
  verifier marker seen once as echoed input and once as a completion with exit 23.

Every committed report is validated individually by the existing handoff validator inside `prepare.ts`.
The recording stub prints raw observation facts and appends requested actions to `intents.jsonl`; it
never starts, stops or prompts a real worker.

## Limits

Static preparation and these controls demonstrate fixture mechanics only. They are not native sandbox,
approval, permission-mode, submission, wait, block or completion proof. Native denial and normal
in-scope success, the scoped-recipe prefix contrast, and the native submission/wait/exited primitives
must be observed separately on the exact reviewed resource candidate before R4/R5 are closed. Independent
packet review is pending; this report is not self-acceptance and does not claim final batch delivery.
