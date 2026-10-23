task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-INSPECT2
status: complete
reviewed_revision: a5e3cec1c1b81b289c6700e3763af1642441865c
evidence_revision: 3fe6867d2fd76baacefb582680230956c4bb1668
outcome: "No blockers. Independent re-review of repaired assets a5e3cec1 reproduces both INSPECT1 fixes: tools/verify-baselines.ts is now fail-closed (r3 protected removal/change/addition and boundary-name FAIL; pristine and legitimate outputs PASS; enoch full-scope plus append-only TASK_LOGS negatives FAIL), and implementer subjects discover zero workflow skills with explicit read deny and a skill default-deny allowlist while coordinators keep only ruach-workflow-feature plus required technical skills. The enriched runner selects the exact config, skill directory, private env and Go Flash, preserves the config for nested CLI calls, and every recipe path/owned target resolves. First-turn runtime enforcement remains unobserved."
artifacts:
  - docs/reports/next-release/opencode-evaluation-review/preparation-review2.md
  - docs/reports/next-release/opencode-evaluation-review/checks2.txt
  - docs/reports/next-release/opencode-preparation.md (correction handoff, reviewed)
verification:
  - "Bounded helper bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/inspect2.ts: RESULT PASS, 101/101 checks (verbatim copy of the corrected tools/verify-baselines.ts; enriched runner used with the exact subject config/cwd)."
  - "B1 r3 fail-closed (verbatim tool copy): pristine PASS; legitimate outputs (record.md edited, drafts/ added, intents.jsonl added) PASS; protected removal FAIL; protected change FAIL; protected addition FAIL; boundary name record.md.evil FAIL."
  - "B1 enoch (synthetic scratch git repo): legitimate mutable PASS; out-of-scope add docs/OTHER.md FAIL; TASK_LOGS non-append (prepend) FAIL; mutable boundary docs/TASK_LOGS.md.evil FAIL; protected test change FAIL."
  - "B1 real fixtures: corrected tool --smoke --enoch --r3 against the pristine real trees PASS (exit 0)."
  - "B2 native skill discovery via enriched runner (config-only, no model): oc-smoke and oc-enoch discover zero ruach-workflow-* skills and keep handoff+testing; all three coordinators discover exactly ruach-workflow-feature (not -knowledge) and keep handoff+herdr."
  - "B2 resolved agent permissions (debug agent): every subject has read deny for **/skills/ruach-workflow-*/** and **/ruach-workflow-*/**, skill * deny with an allowlist (handoff+testing, or handoff+herdr+feature), task and external_directory * deny; model resolves opencode-go/deepseek-v4.1-flash."
  - "Suppression control: OPENCODE_DISABLE_EXTERNAL_SKILLS=true drops the consumer .agents/skills workflows while configured handoff/testing survive; false re-exposes workflow-feature and workflow-knowledge."
  - "Runner: committed runners/opencode mode 755 and byte-identical to the scratch /tmp/.../opencode/launch/runners/opencode; refuses to run without an explicit existing OPENCODE_RUN_CONFIG; debug paths show private HOME/XDG under /tmp/ruach-implementation-20261011/opencode."
  - "Nested config preservation: the historical wrapper with OPENCODE_RUN_CONFIG set resolves Go Flash; without it, it silently falls back to the historical default opencode/deepseek-v4-flash (the runner exports OPENCODE_RUN_CONFIG/OPENCODE_CONFIG so nested calls keep the subject config)."
  - "opencode run --help confirms the recipe's --dir option; package recipes, check.ts, rubric, validator and expected/prior-case inputs resolve; no config allows protected/evaluator/expected/evals paths; 15 prepared-asset digests match."
  - "Not run: any subject launch or model call, Go entitlement, runtime allow/deny enforcement, native relative-vs-absolute edit matching at run time, workflow-body reads."
discoveries:
  - "One runner default (external-skill suppression on) is safe for both roles: it removes auto-discovered project .agents/skills but preserves config skills.paths and OPENCODE_CONFIG_DIR skills, so coordinators still get the feature workflow (O1 resolved without a per-role exception)."
  - "A bare opencode child that loses OPENCODE_RUN_CONFIG silently selects the historical preparer/Zen default; the enriched runner exports OPENCODE_RUN_CONFIG and OPENCODE_CONFIG so nested diagnostics/children keep the selected subject config."
  - "The enoch cwd has no docs/exercise directory; the subject must create docs/exercise/report.md and the bash allowlist contains no mkdir, so report creation depends on the native write tool creating parent directories."
  - "opencode models opencode-go still lists all 31 models; the Go Flash-only route relies on pinned model/small_model/agent plus enabled_providers and the explicit --model, with no fallback (accepted equivalent per O5)."
  - "The corrected grader tool now checks full smoke/enoch git scope and append-only TASK_LOGS.md in addition to digests, and fails closed on missing setup."
blockers: []

# R-OPENCODE-INSPECT2 — independent re-review of repaired preparation a5e3cec1

## Scope and verdict

Re-reviewed repaired assets `a5e3cec1c1b81b289c6700e3763af1642441865c` and the
correction handoff `3fe6867d2fd76baacefb582680230956c4bb1668` (both in the
read-only preparation worktree), against the live fixtures under
`/tmp/ruach-implementation-20261011`. INSPECT1
(`3e2ac27c8969bb6333315f9004dce0862de5da81`,
`docs/reports/next-release/opencode-preparation-review.md`) is retained
unchanged. No subject was launched, no model was called, and no workflow body,
credential or raw provider config was read or printed.

Both reported blockers are fixed and independently reproduced. No blocking
findings. Status: `complete`.

## B1 — fail-closed grader tool (reproduced)

Ran a verbatim copy of `tools/verify-baselines.ts` (sha-equal to the committed
file) over independent scratch layouts and the real fixtures:

- r3: `pristine` **PASS**; legitimate outputs (`record.md` edited, `drafts/`
  added, `intents.jsonl` added) **PASS**; protected **removal**, protected
  **change**, protected **addition**, and the boundary name `record.md.evil`
  each **FAIL** (exit 1).
- enoch (scratch git repo): legitimate mutable change **PASS**; out-of-scope
  add `docs/OTHER.md` **FAIL**; `TASK_LOGS.md` non-append (prepend) **FAIL**;
  mutable boundary `docs/TASK_LOGS.md.evil` **FAIL**; protected test change
  **FAIL**.
- Real fixtures: `--smoke --enoch --r3` **PASS** (exit 0).

This closes INSPECT1's pass-on-removal defect and adds the previously missing
full git scope (`git diff <base>..HEAD` + `git status --porcelain`) and
append-only `TASK_LOGS.md` checks.

## B2 — worker workflow denial and skill selection (reproduced)

For all five subjects, `debug skill` and `debug agent` through the enriched
runner with the exact config and cwd (config-only; no model):

- Implementers (oc-smoke, oc-enoch): **0** `ruach-workflow-*` skills
  discovered; `ruach-handoff` + `ruach-testing` present.
- Coordinators (oc-resume, oc-ambiguity, oc-authorization): exactly
  `ruach-workflow-feature` (no `ruach-workflow-knowledge`); `ruach-handoff` +
  `ruach-herdr` present.
- Every resolved agent permission contains a `read` deny for
  `**/skills/ruach-workflow-*/**` and `**/ruach-workflow-*/**`, a `skill` `*`
  deny with an allowlist, and `task`/`external_directory` `*` deny; the model
  resolves to `opencode-go/deepseek-v4.1-flash`.
- Suppression control: with `OPENCODE_DISABLE_EXTERNAL_SKILLS=true` the smoke
  project `.agents/skills` workflows are gone and configured skills survive;
  with `false` `ruach-workflow-feature` and `ruach-workflow-knowledge`
  reappear. The coordinator's configured feature workflow survives suppression,
  so the single runner default is safe for both roles.

## Runner, recipes, and targets

- `runners/opencode` is mode 755 and byte-identical to the scratch copy; it
  exits 2 without an explicit existing `OPENCODE_RUN_CONFIG`, uses `env -i`
  with private `HOME`/`XDG_*` under the task root (confirmed via `debug
  paths`), fixes the local Git identity, and exposes `OPENCODE_RUN_CONFIG`/
  `OPENCODE_CONFIG` to children.
- Nested-config check: the historical wrapper with `OPENCODE_RUN_CONFIG` set
  resolves Go Flash; without it, it silently selects the historical default
  `opencode/deepseek-v4-flash`. The enriched runner exports the variables, so
  nested calls keep the selected config.
- `opencode run --help` confirms `--dir`; all fixed recipe targets
  (`check.ts`, `rubric.md`, `validate.ts`, packet evidence/evaluator, enoch
  `node_modules`, committed runner/tool) resolve; `/tmp` paths extracted from
  both packets resolve.
- Config coherence: every `external_directory` allow root and every
  absolute/relative owned edit target resolves; no config allows
  `protected`/`evaluator`/`expected`/`evals` paths; implementer configs exclude
  the r3/expected/evals trees. All 15 `prepared_assets_sha256` entries match.

## Optional findings (non-blocking)

- **O1 — enoch report directory.** The enoch cwd has no `docs/exercise/`
  directory and the bash allowlist has no `mkdir`; `docs/exercise/report.md` is
  a required output, so creation depends on the native write tool creating
  parent directories. Worth confirming on the first oc-enoch turn (the enoch
  rule checker treats a missing report as a failure).
- **O2 — smoke acceptance binary.** `live/smoke/codex-snapshot/evidence/config.json`
  hardcodes `/home/metatron/.local/bin/bun`. The preparation states it exists;
  I did not re-stat it (outside this review's read scope). It matters only when
  the canonical `check.ts` runs the fixture checks.
- **O3 — first-turn evidence.** Runtime allow/deny enforcement and native
  relative-vs-absolute edit-path matching are still unobserved; the resolved
  permission lists are consistent and the recipes are correct, but a subject
  turn is the first enforcement observation.
- **O4 — historical fallback exists by design.** Any bare opencode child that
  loses `OPENCODE_RUN_CONFIG` falls back to the old preparer default. The
  runner prevents this for its children; keep nested diagnostics going through
  the runner.

## Checks run

```
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/inspect2.ts
```

Raw output is recorded in
`docs/reports/next-release/opencode-evaluation-review/checks2.txt`.
