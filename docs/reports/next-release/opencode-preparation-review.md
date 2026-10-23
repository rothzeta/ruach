task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-INSPECT1
status: needs-decision
reviewed_revision: 0fdc42bd4b3afb693c9a669eaf244264c2da62f0
outcome: "Independent INSPECT1 of preparation 0fdc42bd: five subject configs/briefs, packets and baselines are internally coherent and structurally sound (Go Flash pinned at model/small_model/agent, default-deny verified, corpus/output paths and protected digests consistent, wrapper env-stripping confirmed). Two items need a root decision before launch/grading: a grading-soundness bug in the r3 baseline checker that passes on unexpected removals, and the already-reported implementer workflow-body exposure whose only mitigation is an unverified env flag the wrapper strips."
artifacts:
  - docs/reports/next-release/opencode-preparation-review.md
  - docs/reports/next-release/opencode-evaluation-review/checks.txt
verification:
  - "Structural/permission/baseline probe bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/verify-prep.ts: RESULT PASS, 0 failing checks (all 5 configs default-deny and model-pinned; cwds exist; prepared_assets_sha256 self-consistent; smoke/enoch protected digests match; r3 subject==protected pristine; no rubric/expected leak; referenced targets exist)."
  - "opencode --version: exit 0, 1.19.0; opencode models opencode-go via bare wrapper: exit 1 Provider not found, matching prep-evidence that the wrapper carries no task config."
  - "Read /tmp/ruach-implementation-20261011/opencode/bin/opencode: exec env -i with a fixed list that forwards only proxy/cert vars; confirms OPENCODE_DISABLE_EXTERNAL_SKILLS and Git identity cannot pass through the wrapper."
  - "git rev-parse in smoke consumer: HEAD 868159c737895b4c0a4d58c628379b9cd9877857 on branch main, status --porcelain empty (matches packet base and clean precondition)."
  - "git rev-parse in enoch clone: HEAD ea33fc70456bf45bdd51e6eedcb83cf5cdf89347 on branch ruach-exercise/url-encoding-seed, status --porcelain empty (matches seed baseline)."
  - "Demonstrated grading bug by running a verbatim copy of tools/verify-baselines.ts over a synthetic r3 layout with one protected file removed: it printed 'note c1 removed: inputs/b.txt (UNEXPECTED)' then RESULT PASS."
  - "opencode debug agent ruach-implementer: resolved the wrapper runtime agent, whose permission list includes an explicit read deny '**/skills/ruach-workflow-*/**' that the subject implementer configs omit."
  - "Not run: any subject launch, effective subject-config agent/skill resolution (my sandbox cannot set OPENCODE_CONFIG for opencode debug agent), Go entitlement, runtime permission enforcement, workflow-body reads."
discoveries:
  - "The r3 baseline checker is not fail-closed on removals; a subject that deletes evidence could be reported PASS. Exact failing lines and a reproduction are in the report."
  - "The subject implementer configs rely solely on OPENCODE_DISABLE_EXTERNAL_SKILLS to hide the consumer .agents/skills workflow bodies; they omit the explicit read/skill deny that the preparation runtime config itself uses."
  - "The single common launch recipe applies OPENCODE_DISABLE_EXTERNAL_SKILLS to all five subjects even though only oc-smoke needs it; if that flag also suppresses config-declared skills.paths it would strip the coordinators' feature workflow and the implementers' handoff/testing."
  - "reviewer-grading-packet mixes absolute live/source paths with a repo-relative tools/verify-baselines.ts path that exists only in the preparation worktree, so the recipe's working directory is not stated."
  - "The reused smoke evidence/config.json hardcodes /home/metatron/.local/bin/bun in all three checks; a missing binary would surface as missing_executable (setup exit 2) rather than a subject failure."
blockers:
  - "Root decision / grading fix required: make the r3 branch of tools/verify-baselines.ts fail on removals outside allowed_edits (currently it only prints a note and still returns PASS)."
  - "Root-scoped correction required before oc-smoke: deny implementer workflow read/skill at the native layer and/or set-and-verify the suppression flag per subject with opencode debug skill. No worker workflow exception; do not edit the preparation assets from this review."

# R-OPENCODE-INSPECT1 — independent review of preparation 0fdc42bd

## Scope and verdict

Reviewed exact preparation `0fdc42bd4b3afb693c9a669eaf244264c2da62f0`
(read-only at `/opt/dev/ruach/.worktrees/opencode-preparation`), comprising the
five `configs/oc-*.json`, five `briefs/oc-*.md`, `root-launch-packet.md`,
`reviewer-grading-packet.md`, `prep-evidence.md`, `baselines.json` and
`tools/verify-baselines.ts`, against the live fixtures under
`/tmp/ruach-implementation-20261011`. No subject was launched, no credential or
raw provider config was read, and no source/fixture was modified.

The preparation is coherent and its central mechanics check out. It has one new
grading-soundness defect and one already-reported launch precondition that needs
the root's scoped correction. Status: `needs-decision`.

## Blocking findings

### B1 — `tools/verify-baselines.ts` r3 branch does not fail on unexpected removals

- Location: `docs/reports/next-release/opencode-preparation/tools/verify-baselines.ts`,
  the `r3` loop (`if (!set.has(rel)) { ... if (!allowed(rel)) unexpected++; continue; }`)
  and the final `if (unexpected === 0) ok(...)`.
- Problem: a file present in `protected/<case>/corpus` but absent from
  `subject/<case>/corpus` and outside `allowed_edits` increments `unexpected`
  but never calls `fail()`, so `failures` stays 0 and the script prints
  `RESULT: PASS`.
- Why it matters: `reviewer-grading-packet.md` states the tool "exits non-zero on
  any unexpected difference" and is the r3 scope guard. A subject that deletes
  protected evidence (inputs/observations/retained/record/repo files) would be
  graded PASS, so a real scope violation could be reported as clean.
- Evidence: running a byte-identical copy of the tool against a synthetic layout
  with `inputs/b.txt` deleted from the subject tree produced:

  ```text
  r3:
    note c1 removed: inputs/b.txt (UNEXPECTED)

  RESULT: PASS (baseline expectations met)
  ```

  (Reproduction kept in `/tmp/ruach-implementation-20261011/opencode/results/reviewer/probe/`.)
- Suggested direction: in the removal branch, when `!allowed(rel)` call
  `fail(`${c} removed outside allowed set: ${rel}`)` (or otherwise increment
  `failures`) instead of only counting `unexpected`. Re-run against the pristine
  fixtures to keep `RESULT: PASS`.

### B2 — implementer workflow-body access is not denied at the native layer

- Location: `configs/oc-smoke.json` (lines 15–49: `read: allow`, `skill: allow`,
  no workflow deny) and the mitigation in `root-launch-packet.md` (lines 31–59,
  98–110) plus `prep-evidence.md` (50–56).
- Problem: acceptance requires implementers to have native workflow read/skill
  access denied. The only control is `OPENCODE_DISABLE_EXTERNAL_SKILLS`, which
  (a) the wrapper cannot carry and (b) was never verified for opencode 1.19.0.
  The configs contain no explicit workflow deny.
- Why it matters: the smoke consumer's project `.agents/skills` is auto-discovered
  and contains `ruach-workflow-feature` and `ruach-workflow-knowledge` bodies, so
  an Implementer can read/invoke workflow bodies unless discovery is suppressed
  *and* the effective skill list is confirmed.
- Evidence:
  - Listing `live/smoke/codex-snapshot/consumer/.agents/skills` shows
    `ruach-workflow-feature`, `ruach-workflow-knowledge` (and seven more).
  - `opencode/bin/opencode` is `exec env -i ...` forwarding only proxy/cert vars,
    so the flag cannot reach the child through the wrapper.
  - `opencode debug agent ruach-implementer` (the preparation runtime config)
    resolves a `read` deny for `**/skills/ruach-workflow-*/**`; the subject
    implementer configs omit exactly that rule.
- Suggested direction (root-scoped, no worker workflow exception): apply a
  task-local enriched wrapper/direct-CLI that sets the flag **and** verify with
  `opencode debug skill` per subject that only the intended skills appear; and/or
  add explicit belted config denies for the implementer configs — `read` pattern
  `**/skills/ruach-workflow-*/**` → `deny` and `skill` → `deny`
  (or per-workflow patterns). The preparation runtime config already demonstrates
  the working pattern. This review does not edit the assets.

## Optional findings

- O1 — common recipe flag breadth (`root-launch-packet.md` lines 43–58): the one
  env block sets `OPENCODE_DISABLE_EXTERNAL_SKILLS=true` for all five subjects.
  Only oc-smoke needs it; if the flag also suppresses config-declared
  `skills.paths`, coordinators lose `ruach-workflow-feature`/`ruach-herdr` and
  implementers lose `ruach-handoff`/`ruach-testing`. Narrow it to oc-smoke or
  verify per subject.
- O2 — recipe working directory (`reviewer-grading-packet.md` lines 10–13, 50, 89):
  absolute `live/source/...` paths are mixed with the repo-relative
  `docs/reports/next-release/opencode-preparation/tools/verify-baselines.ts`,
  which exists only in the preparation worktree (verified: present in prep,
  absent in accepted `live/source`). State "run from the preparation worktree" or
  use an absolute path.
- O3 — relative-only edit patterns: edit keys are relative (`src/**`,
  `src/Enoch.Ui/src/api.ts`, `record.md`, `drafts/**`) while `external_directory`
  uses absolute roots. `prep-evidence.md` verified rule resolution, not runtime
  path matching; confirm on the first turn that the native edit tool's path form
  matches the relative patterns (otherwise subject writes may all be denied).
- O4 — smoke acceptance hardcodes `/home/metatron/.local/bin/bun` in
  `live/smoke/codex-snapshot/evidence/config.json`; if that binary is unavailable
  to the grading user, all three checks are `missing_executable` (setup exit 2)
  rather than a subject outcome. Not verifiable from this session (home reads
  denied).
- O5 — documented deviation from `-v3`: the requested static
  `opencode-go` model whitelist is not enforceable (catalog still lists 31
  models); the preparation substituted pinning at
  `model`/`small_model`/agent/`--model`. INSPECT1 acceptance permits "provider
  restriction or proven equivalent"; confirm this substitution is the accepted
  equivalent.

## Positive confirmations

- All five configs: `model` = `small_model` = agent model =
  `opencode-go/deepseek-v4.1-flash`; `enabled_providers: ["opencode-go"]`; no
  provider block; `*: deny` with `edit`/`bash`/`external_directory` `*: deny`;
  `task`/`question`/`webfetch`/`websearch`/`doom_loop` deny; no `--auto`; the
  four built-in agents disabled.
- Worker vs coordinator skill split is correct in config: implementer
  `skills.paths` has no workflow; coordinator `skills.paths` has the feature
  workflow only (no knowledge workflow).
- Corpus/work-directory coherence: 01-resume (`record.md`, `GUIDANCE.md`,
  `app/workers.ts` recording stub, `repo/`, inputs/observations/retained),
  02-ambiguity (no repo), 03-authorization (`repo/`) all match their briefs; the
  `app/workers.ts` stub only appends to `intents.jsonl` and starts nothing.
- Subjects cannot see grader material: no `rubric`/`expected`/`spec.json` under
  any subject tree; `evaluator/manifest.json` and
  `evals/ruach-coordination/expected/rubric.md` are outside the allowed
  `external_directory` roots; r3 `protected` == `subject` byte-for-byte (no edits
  yet).
- Baselines: `prepared_assets_sha256`, smoke protected/pre-edit, enoch
  protected/seed, and all three r3 corpora match the live fixtures.
- Fixture git states match the packets: smoke consumer `main` @ `868159c7…`,
  clean; enoch clone `ruach-exercise/url-encoding-seed` @ `ea33fc70…`, clean.
- The wrapper's env-stripping claim is accurate (read `bin/opencode`).

## Unverified / limits

- Effective subject-config agent and skill resolution was not independently
  reproduced: my sandbox cannot set `OPENCODE_CONFIG`/`OPENCODE_RUN_CONFIG`, so
  `opencode debug agent`/`debug skill` resolve only the wrapper runtime config.
  Subject-config resolution is taken from `prep-evidence.md`.
- Go Flash entitlement, actual allow/deny enforcement, native relative/absolute
  path matching, and the suppression flag remain first-turn evidence, as the
  preparation states.
- No subject was launched; preparation does not prove subject/model-use outcomes,
  and original Claude/Codex compatibility stays pending.

## Verification commands actually run

```sh
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/verify-prep.ts        # RESULT: PASS
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/probe/verify-baselines.ts --r3
opencode --version                                                                    # 1.19.0
opencode models opencode-go                                                           # exit 1, Provider not found
opencode debug agent ruach-implementer
git rev-parse HEAD            # smoke consumer: 868159c7…; enoch clone: ea33fc70…
git rev-parse --abbrev-ref HEAD   # smoke: main; enoch: ruach-exercise/url-encoding-seed
git status --porcelain        # both clean
```

Raw output is recorded in `docs/reports/next-release/opencode-evaluation-review/checks.txt`.
