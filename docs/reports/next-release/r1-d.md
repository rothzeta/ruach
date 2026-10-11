task: RUACH-ROADMAP-IMPLEMENTATION/R1-D
status: complete
outcome: Both hosted runs failed on one test, skills/ruach-herdr/tests/worker.test.ts:175, which asserts an unsorted readdir() order and is filesystem-dependent; fix is a one-test change. Local gate at d75039a passed, so the failure is runner-specific.
artifacts:
  - docs/reports/next-release/r1-d.md
  - docs/reports/next-release/r1-d-evidence/
  - docs/assignments/next-release/r1-d.md
verification:
  - "Hosted: run/jobs JSON and full job logs for both runs read via gh api (read-only), exit 0"
  - "Local gate at d75039a all exit 0: install, check, release-check, three audits, just test (90+28+149+71+35 pass, 0 fail)"
  - "Focused Herdr test once, exit 0 (1 pass); handoff validator and git diff --check run after writing, results in terminal handoff"
review: not-run
discoveries:
  - "Cause (log-supported): in both runs the only failing test is 'standalone skill without installed dependencies fails clearly without implicit installation' (skills/ruach-herdr/tests/worker.test.ts:175, Test root tools and all executable skills step, just test line 49). Received readdir order ['scripts','package.json'] vs expected ['package.json','scripts']."
  - "Same test text and same failure at both heads f8655039 and d75039a; herdr tests were unchanged between them, so run 37661762155 (first CI run, 0.3-ship) and 37986084683 share one defect."
  - "Hypothesis (not log-proven): readdir() order is filesystem-defined; hosted ext4 returned hash order, local tmpfs /tmp passes. Probe on tmpfs showed newest-first listing; this agrees but did not reproduce the hosted order."
  - "Earlier hypotheses not supported: dependencies (install step passed), Herdr timeout (30s timeout in CI; test took 33 ms), changelog EPERM (changelog suite never ran in hosted gate: just test stops at herdr failure, so changelog is untested hosted)."
  - "Hosted just test aborts at the first failing recipe line, so harness-eval and changelog suites did not run hosted in either run; they may hide further failures."
blockers: []
candidate_revision: d75039aa7b82b262e2f28af08630258fb7f77180
tested_revision: d75039aa7b82b262e2f28af08630258fb7f77180
evidence_revision: f8655039b38ad6dfa161e3271359cef72bc17c89

# R1-D: CI diagnostics

## 1. Hosted runs (read-only gh API; full logs via `gh api .../jobs/<id>/logs`)

`gh run view --log-failed` returned empty output with exit 0 for both runs; the job-logs API endpoint worked. Excerpts: [r1-d-evidence/](r1-d-evidence/).

| | Run 37986084683 | Run 37661762155 |
| --- | --- | --- |
| Link | [run](https://github.com/rothzeta/ruach/actions/runs/37986084683), [job 114008313095](https://github.com/rothzeta/ruach/actions/runs/37986084683/job/114008313095) | [run](https://github.com/rothzeta/ruach/actions/runs/37661762155), [job 112930785710](https://github.com/rothzeta/ruach/actions/runs/37661762155/job/112930785710) |
| Head SHA / event | d75039aa7b82b262e2f28af08630258fb7f77180, push to main | f8655039b38ad6dfa161e3271359cef72bc17c89 ("Handoff report for 0.3-ship"), push to main |
| Attempt / run number | 1 / 2 | 1 / 1 |
| Job created / started / completed | 2026-10-09T20:18:24Z / 20:18:26Z / 20:20:13Z | 2026-10-07T17:47:15Z / 17:47:19Z / 17:49:06Z |
| Runner | ubuntu-24.04 image 20261004.327.1, runner 2.337.0 | ubuntu-24.04 image 20260927.320.1 |
| Toolchain | Bun 1.4.2 (744846f84), just 1.40.0, git 2.55.0 | same |
| Steps | Set up, checkout, setup-bun, setup-just, Record toolchain, Install, Resource/link/type checks, Release metadata, Dependency audit: success. **Test root tools and all executable skills: failure** (20:18:33Z-20:20:11Z). Post setup-bun skipped; checkout post and Complete job: success. | identical conclusions (test step 17:47:26Z-17:49:03Z) |

Test step in both runs: root 90 pass; handoff 28 pass; Herdr `tests/worker.test.ts` 148 pass / 1 fail (149 tests); `error: Recipe test failed on line 49 with exit code 1`. The single failure:

```
(fail) standalone skill without installed dependencies fails clearly without implicit installation [32.73ms / 34.97ms]
  expect(await readdir(copy)).toEqual(['package.json','scripts'])   // worker.test.ts:175
  Expected ["package.json","scripts"]  Received ["scripts","package.json"]
```

## 2. Cause and confidence

- **Verified by log:** failing job `verify`, step "Test root tools and all executable skills", recipe `just test` line 49 (Herdr suite), the test above, same assertion diff in both runs. All earlier steps (install, check, release-check, audit) passed hosted.
- **Verified by source:** `skills/ruach-herdr/tests/worker.test.ts:175` creates `scripts` then `package.json` in a fresh dir and compares the raw `readdir()` result with a fixed order. `readdir` order is unspecified. The test text at f8655039 is identical (same `toEqual(['package.json','scripts'])`); `git log f8655039..d75039a -- skills/ruach-herdr` is empty.
- **Hypothesis (not reproduced):** hosted runner filesystem (ext4 hashed directory order) returns `scripts` first, while this machine's tmpfs temp dir (newest-first listing; the test root comes from `os.tmpdir()`) happens to return `package.json` first. A probe on tmpfs `/tmp` and ext4 `/` here both listed `package.json scripts`, so the hosted order was not reproduced locally. Confidence the defect is the order-sensitive assertion: high (log diff shows pure ordering swap; product assertions before it, exit 2 and `dependencies_missing`, passed). Why hosted ordering differs: unverified.
- **Not supported by evidence:** missing dependencies, Herdr timing/timeouts, changelog stdin EPERM, platform socket failure.
- **Gap:** `just test` stops at the first failing recipe line, so harness-eval and changelog suites never ran hosted in either run. Their hosted state is unknown; fixing the Herdr test may expose further hosted failures (changelog's concurrent-append test was flagged locally by the planner under a sandbox, see plan).

## 3. Local gate (worktree at d75039a, uid 1000, real exits in [local-gate-exits.txt](r1-d-evidence/local-gate-exits.txt); versions in [local-versions.txt](r1-d-evidence/local-versions.txt))

Verification lock `/tmp/ruach-implementation-20261011/verification.lock` taken via flock for the whole gate. Bun 1.4.2, just 1.40.0, git 2.47.3 (hosted: 2.55.0), Linux 6.12.111 x86_64.

| Command | Exit |
| --- | --- |
| `just install` | 0 |
| `just check` | 0 |
| `just release-check` | 0 |
| `bun audit`; `(cd skills/ruach-handoff && bun audit)`; `(cd skills/ruach-herdr && bun audit)` | 0; 0; 0 |
| `just test` | 0: root 90 pass, handoff 28, Herdr 149, harness-eval 71, changelog 35; 0 fail |
| Focused: `(cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts --test-name-pattern 'standalone skill without installed dependencies')` | 0: 1 pass, 117 filtered |

A local pass does not invalidate the hosted failures. It shows the failure is runner-specific, not dependency/setup. Only one focused reproduction was needed (one distinct failure). Changelog local test passed (35/35), contrary to the planner's sandboxed run; no changelog failure is observed here.

## 4. Proposed fix packet (not applied)

- Smallest file set: `skills/ruach-herdr/tests/worker.test.ts` (line 175 only) plus R1-F assignment/report. No source, CI, justfile or timeout changes.
- Change: compare order-insensitively, e.g. `expect((await readdir(copy)).sort()).toEqual(['package.json','scripts'])`. Keep the preceding exit-2 / `dependencies_missing` / `noMutation()` assertions. Check line 255 `readdir(join(temp,...` and line 138 for the same unsorted pattern and sort if they assert a fixed list (not diagnosed; only line 175 failed hosted).
- Regression expectation: test passes irrespective of directory order (a fault-injected unsorted-order variant, e.g. a helper that reverses the readdir result, would fail before the fix and pass after). Run `just test` locally, then obtain a hosted green run on the resulting SHA, expecting harness-eval and changelog to run for the first time hosted and recording any new failure.
- Do not: raise timeouts, skip tests, retry-until-green, or pin an older runner.

## 5. Constraints and surprises

`gh run view --log-failed` empty-success; use jobs logs API. Hosted git 2.55.0 vs local 2.47.3 and image drift between the two runs (20260927 vs 20261004) did not change the failure. Frozen plan SHA256 verified: 37a72430abe975baf3710e91932a554f4b226f82dfd741edae8722ebb9d3086a. Review: not run. No source/CI edits, push, merge or paid runs.
