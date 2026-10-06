---
task: 0.3-impl-a
status: complete
outcome: A1, A3, A4, A6 and A7 implemented with one commit each; every regression test failed before its fix; just check, release-check and test pass at the tested revision. Two items have scope notes (see discoveries).
role: implementer
candidate_revision: ec1ae2bc485f8e8703ce0e814cc8c33e8593948b
tested_revision: ec1ae2bc485f8e8703ce0e814cc8c33e8593948b
baseline: 639e24b
artifacts:
  - "docs/reports/0.3/impl-a.md"
  - "docs/assignments/0.3/impl-a.md (unchanged; committed in 2e3060d)"
  - "branch ruach/ruach03-impl-a"
  - "A1 2e3060d, A3 2799c09, A4 e634368, A6 8e31e88, A7 ec1ae2b"
verification:
  - "just check: exit 0"
  - "just release-check: exit 0 (Release v0.2.1)"
  - "just test: root 54 pass, handoff 28 pass, herdr 138 pass, harness-eval 67 pass; 0 fail. Herdr socket tests ran (local sockets available)"
  - "Handoff validator on this report: run with --repo after writing (see terminal handoff)"
review: not-run
discoveries:
  - "RU-01: harness-eval git() now passes --no-replace-objects; the same flag was added to handoff validate.ts and scripts/install.ts pinned reads. install.ts is nominally A5 territory (one-line change, may conflict textually). validate.ts replacement-ref behavior is not observable through its output (rev-parse X^{commit} prints X even when replaced), so that change is defensive and has no failing test; install.ts and harness-eval do have failing tests."
  - "RU-02: dirty() throws setup error hidden_index_state when git ls-files -v shows assume-unchanged (lowercase) or skip-worktree (S) entries. Any checkout using these flags legitimately now fails acceptance/scope-check; this is the fail-closed reading of the roadmap."
  - "RU-03: Herdr git probes now strip inherited GIT_* variables (process.ts, only for git argv) and the launcher canonicalizes cwd/git root and verifies the created worktree top-level, HEAD and cwd (exit 4 worktree_uncertain on mismatch). Roadmap did not specify GIT_* stripping; I treated inherited GIT_DIR as an identity risk."
  - "RU-04: reading of finding: mapping keys that are aliases or collections are rejected with YAML_INVALID (/header, with line/column). Herdr routing YAML already rejected them. Non-string scalar keys such as 1: are still accepted."
  - "RU-11: non-strict scan for non-Ruach roots derives the name from the directory when frontmatter or name is absent. Genuinely malformed frontmatter or a non-string name in unrelated skills still fails with invalid_skill; Ruach-owned canonical roots (resources/.agents skills) remain strict. If unrelated malformed skills should also be tolerated that is a policy decision."
  - "RU-15: audit text unavailable, so interpretation: stderr diagnostics are control-character-escaped, JSON Pointer paths escape ~ and /, revision fields containing NUL fail schema (FIELD_INVALID, schema is the structural contract) before Git runs."
  - "RU-05/06: harness-eval checks now settle once; after exit or timeout pipes get a 1 s grace then the owned process group is killed and an orphaned_output failure is recorded. A descendant that left the group (setsid) cannot be killed and is not signalled; the check fails but that process may linger. Herdr run() uses detached own groups and only signals them. Artifact budget is 16 MiB (inputs, expected files, reports) and 4 MiB for Herdr role/catalog files."
  - "RU-10: Herdr cannot ask herdr agent start for an absolute native binary (only --kind), so identity is pinned by resolving empty/relative PATH entries once against the launcher cwd and using that PATH for probes, helpers and the pane --env PATH. Absolute-binary pinning would need a Herdr feature."
  - "RU-13: Codex role instructions travel in argv (-c developer_instructions=...), visible to local process listings. Installed codex-cli 0.160.1 --help (offline) shows -c key=value, --cd, -m, -s, -a, --add-dir, --approve-for-me, --no-alt-screen and no instruction-file/stdin option, so no private transport exists to implement; docs (adapters.md, herdr SKILL.md) now state the exposure. A file-based transport (for example the model_instructions_file config key) was not verified and is not used. Moving to one would be a needs-decision item."
  - "RU-14: finding text unavailable; implemented as holding the exclusively created evidence descriptor (O_EXCL, O_NOFOLLOW) from before checks until the final write, with an identity check and output_error exit 2 if the path was replaced. Output file now exists, empty, while checks run."
  - "A7 packaging: LICENSE and PROVENANCE.md copied unchanged into all 7 skill folders; check.ts and release-check.ts require byte equality with the root files. They are included in snapshot installs via the skills tree."
  - "Evidence not run: no paid-model smoke tests; real codex only used for --help; herdr real server not exercised (fake CLIs)."
blockers: []
---

# impl-a report (0.3)

Failing-before evidence was captured by running each new test against the pre-fix code. A1, A3, A6 and A7 tests were run before their fixes. For A4 the fix was written before the tests, so the pre-fix scripts were restored temporarily to record the failures, then the fix was reinstated.

| Item | Commit | Regression tests | Failing before |
|---|---|---|---|
| A1 RU-01 | 2e3060d | harness-eval `replacement refs cannot alter the commits that scope checks read`; `tests/install.test.ts` `replacement refs cannot alter the pinned snapshot` | scope-check reported the forged change set (clean/dirty diagnostics); install put the forged role file in the snapshot |
| A1 RU-02 | 2e3060d | harness-eval `index flag --assume-unchanged/--skip-worktree ...` | exit 0 with a tampered tracked file |
| A1 RU-03 | 2e3060d | herdr spaces `a symlinked cwd resolves ...`, `inherited Git environment cannot move the worktree ...` | exit 4 `executable_unavailable` (cwd outside worktree); exit 2 `invalid_base` under GIT_DIR |
| A3 RU-04/15 | 2799c09 | handoff `alias and collection mapping keys...`, `diagnostic paths are escaped...`, `NUL in a revision...` | 3 failures (aliases accepted, unescaped paths and forged stderr line, NUL reported as GIT_UNAVAILABLE exit 2) |
| A3 RU-11 | 2799c09 | herdr worker `valid unrelated Claude skill (3 styles)`, `Ruach-owned skill with ... stays strictly validated` | `invalid_skill` blocked launch for the three unrelated styles (strict cases passed before and after) |
| A4 RU-05/06 | e634368 | harness-eval 4 tests (descendant pipes, timeout with descendant, FIFO/oversized expected files, FIFO config inputs); handoff `FIFO or oversized report`; herdr spaces `helper descendant ...`, `FIFO in place of a canonical role file` | all hung until the test timeout (no JSON) |
| A6 RU-10 | 8e31e88 | herdr spaces `probed native executable ... relative / empty PATH entries` | pane PATH kept relative/empty entries |
| A7 RU-14 | ec1ae2b | harness-eval `evidence output is reserved before checks run...` | output absent during execution (check exit 5, run failed) |
| A7 packaging | ec1ae2b | `tests/check.test.ts` notices tests (2); `tests/release.test.ts` notices test | checks passed with missing/divergent notices |
| A7 RU-13 | ec1ae2b | none (documentation-only, accuracy verified against `codex --help`) | n/a |

Validation scope: the handoff validator was run on this report with `--repo` against the tested revision (it checks structure and that revisions resolve; it does not verify the claims above).
