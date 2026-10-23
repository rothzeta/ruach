# R-OPENCODE-PREP public evidence

Prepared assets for the five restricted OpenCode subject turns
(PREP-FIX1 corrected). Nothing here launched a model, read credentials, or
changed the accepted source. `Root` owns the actual launch, monitoring and
cleanup; `Reviewer` grades independently.

Contents:

- `configs/oc-{smoke,resume,ambiguity,authorization,enoch}.json` — restricted
  primary-agent configs: Go Flash pinned, default-deny with exact owned targets,
  explicit workflow `read`/`skill` denial for workers, relative **and** absolute
  owned edit paths.
- `briefs/oc-{smoke,resume,ambiguity,authorization,enoch}.md` — the exact single
  initial task prompt for each subject.
- `runners/opencode` — executable enriched task-local runner (clean env, explicit
  config required, external-skill suppression, fixed local Git identity). A
  byte-identical scratch copy lives under
  `/tmp/ruach-implementation-20261011/opencode/launch/runners/opencode`.
- `root-launch-packet.md` — separated launch recipes: runner, env, cwd, argv,
  provenance, cleanup.
- `reviewer-grading-packet.md` — separated independent checker inputs, expected
  baselines and grading commands.
- `tools/verify-baselines.ts` + `baselines.json` — fail-closed grader-side
  baseline/scope tool (full smoke/enoch git scope, append-only `TASK_LOGS.md`,
  r3 full-corpus comparison with boundary-safe allowlists).
- `prep-evidence.md` — bounded native probes actually run (redacted), with exact
  results, the PREP-FIX1 corrections and the limits that remain unverified.

Assignments `opencode-preparation.md` and `-v2/-v3/-v4/-fix1.md` are immutable;
this directory records preparation only.
