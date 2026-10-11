task: RUACH-ROADMAP-IMPLEMENTATION/R1-ENOCH-PREP
status: complete
outcome: A concrete disposable Enoch exercise is prepared and demonstrated failing, in a task-owned clone; the original Enoch repository was only read. The subject packet, future executable assignment and evaluator-only facts are committed under docs/reports/next-release/enoch-prep/. No subject was run, no correction was implemented, and nothing was installed or linked in Enoch. Review not run.
baseline_revision: 25aadf1ddc52f811d270389eb47fc7e9fe61eba9
enoch_base_sha: d163a4132a6840d2604e6e17883612eb77a901ec
enoch_seed_sha: ea33fc70456bf45bdd51e6eedcb83cf5cdf89347
artifacts:
  - docs/reports/next-release/r1-enoch-prep.md
  - docs/assignments/next-release/r1-enoch-prep.md
  - docs/reports/next-release/enoch-prep/subject-brief.md
  - docs/reports/next-release/enoch-prep/future-assignment.md
  - docs/reports/next-release/enoch-prep/evaluator.md
  - docs/reports/next-release/enoch-prep/provenance.json
  - docs/reports/next-release/enoch-prep/seed.patch
  - docs/reports/next-release/enoch-prep/base-vitest.txt
  - docs/reports/next-release/enoch-prep/seeded-vitest.txt
  - docs/reports/next-release/enoch-prep/seed-static-checks.txt
  - "Disposable clone (not committed): /tmp/ruach-implementation-20261011/enoch-exercise/clone on branch ruach-exercise/url-encoding-seed"
verification:
  - "Original /opt/dev/enoch read only: git status --short --branch shows main...origin/main, HEAD d163a41, branches main, renovate/configure, security/source-map-js, no stash; identical before and after (checked again after seeding)"
  - "git clone --quiet --no-hardlinks --template= /opt/dev/enoch <scratch>/clone; core.hooksPath /dev/null; origin removed; branch ruach-exercise/url-encoding-seed checked unused; node_modules copied from the original's ignored directory (no install, no network)"
  - "Enoch commits validated in the clone: git cat-file -t returns commit for both SHAs; base is the parent of the seed; the seed object does not exist in the original repository"
  - "Base (npm --prefix src/Enoch.Ui test, under verification.lock): exit 0, 2 files, 17 tests passed"
  - "Seed (same command, run twice, final at ea33fc7): exit 1, 1 failed and 17 passed; failing test 'download URLs > encodes run and publication IDs in artifact and evidence links alike'; received /api/v1/runs/run%20%2F%3F%23/evidence/item /?#"
  - "At the seed: prettier --check on the two changed files exit 0; npm run lint exit 0; npm run typecheck (vue-tsc) exit 0; clone working tree clean"
  - "Seed commit message neutralized to 'exercise seed' and the earlier descriptive object purged (reflog expire, gc --prune=now) so the clone history does not reveal the cause; seed diff equals seed.patch (sha256 b8f48d29...)"
  - "Not run: just check, .NET build/tests, Docker tooling, operations tests, any native model, Herdr or Ruach installation"
review: not-run
discoveries:
  - "Chosen task: UI download-link helpers in src/Enoch.Ui/src/api.ts (pure, deterministic, Vitest). Seeded defect: evidenceDownloadUrl no longer encodes its evidence ID; existing App tests pass because they compare the link with the function's own output, so a new regression test in api.test.ts is the failing signal. The reversible artificial task is not a feature."
  - "Environment: local Node v24.21.0, while Enoch's development rules name Node 22 (Docker mode available); the three npm commands passed regardless. just check needs .NET and was not required or claimed."
  - "Exercise duties inside the clone only: append a TASK_LOGS entry with actual results (Enoch AGENTS.md); CURRENT.md only if facts change; report path docs/exercise/report.md is a new path in the disposable clone and need not follow Enoch's vault layout."
  - "The subject brief names api.ts as the only editable source file, so file location is disclosed by scope; the cause and fix are not. The evaluator file and seed.patch are withheld material; this Ruach report folder must not be inside any subject-visible tree."
  - "Pending gates before execution (not satisfied here): independently reviewed Ruach union and resource revision, native model-turn authorization with model, effort and budget, authorized Herdr or launcher context, realized access boundary (otherwise non-blind smoke), and Coordinator confirmation the clone is unchanged. Route per Ruach roles.yaml is implementer preferred claude-sonnet-5.5-medium with auto-review."
  - "The C packet at 25aadf1 was not touched. The original packet and Enoch branches are preserved. The Coordinator discards the scratch tree after evidence is recorded."
blockers: []

# R1-ENOCH-PREP report

Concrete packet: the subject brief, the executable assignment with owned and protected paths, commands, timeouts, interventions and acceptance, and the evaluator-only facts are in the enoch-prep folder. Scope kept to the assignment, this report and that folder. Native usability and any real-product criterion are not claimed.
