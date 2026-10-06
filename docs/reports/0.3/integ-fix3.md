---
task: 0.3-integ-fix3
status: complete
outcome: Implemented docs/design/0.3-clean-check.md in harness-eval: cleanliness is now decided from committed objects and raw worktree bytes, closing the whole RU-02 class (stat cache, config, attributes, exclude files, self-ignoring .gitignore, rewritten index). All design probes are public-boundary tests; all checks pass. D1-D4 were Coordinator-made decisions and are pending user ratification.
role: implementer
candidate_revision: 09fe3fca6c8dec2b33eafadd8ad02fb06491ea32
tested_revision: 09fe3fca6c8dec2b33eafadd8ad02fb06491ea32
baseline: 7cad2f7cf6ae355d9e8ba26492ce6aec9ffd7466
artifacts:
  - docs/reports/0.3/integ-fix3.md
  - docs/assignments/0.3/integ-fix3.md
  - docs/design/0.3-clean-check.md
  - skills/ruach-harness-eval/scripts/common.ts
  - skills/ruach-harness-eval/tests/eval.test.ts
  - skills/ruach-harness-eval/references/config.md
  - "branch ruach/ruach03-integ; commits: tests-first (red) then implementation 09fe3fca; merge of ruach/ruach03-arch2"
verification:
  - "just install: exit 0; just check (incl. tsc): exit 0; just release-check: exit 0 (v0.2.1, no bump)"
  - "just test, sequential, at 09fe3fc: root 90 pass, handoff 28, herdr 148, harness-eval 99; 0 fail"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff"
  - "Failing before the implementation (old dirty(), new tests committed first), 18 tests: 1 trustctime, 2 checkStat, 3 rewritten index, 5 acceptance forgery, 8 filemode, 9 symlinks, 10 untouched assume-unchanged/skip-worktree (setup error exit 2), 13 core.attributesFile and 14 attr macro (exit 2 content_filter_state instead of a dirty record), 15 smudge-only, 16 LFS-like pointer (exit 2 instead of dirty_worktree exit 1), 17 unset filter, 22 info/exclude, 23 core.excludesFile, 24 self-ignoring sub/.gitignore, 25 edited root .gitignore with require_clean false, 28 submodule trustctime, 33 entry budget. Forgery tests assert as precondition that plain git status is clean"
  - "Passing before and after (controls): 4, 18 textconv, 19 working-tree-encoding, 20 ident, 21 eol/autocrlf, 26 ignored, 29 submodule removed/empty, 30 FIFO, 31 directory and parent symlink, 34 17 MiB file streaming, plus the existing tests and the existing filter and fsmonitor tests"
  - "Existing assume-unchanged/skip-worktree test updated per the design: it now asserts dirty_before names the tampered file and dirty_candidate is reported, instead of requiring checks not to run"
  - "Not tested: the 1 GiB hash budget at its boundary (would need a committed file over 1 GiB); SHA-256 repositories; case-insensitive filesystems; non-UTF-8 path names"
review: not-run
discoveries:
  - "Design test 20 (ident): plain git status already reports the foreign $Id$ as modified, so the test pins raw-byte semantics rather than a forgery; the design's K label held."
  - "Contract effect: a candidate checkout with hidden index flags or filters no longer stops acceptance before checks run; checks run, dirty_before is recorded and acceptance fails with dirty_candidate."
  - "The 100k-file budget test takes a few seconds and creates 100,001 empty files in the OS temp directory."
  - "ready's informational dirty flag in scripts/install.ts is unchanged and documented as not a trust boundary."
blockers:
  - "Ratification pending: D1 byte-exact comparison (converted working copies such as CRLF, expanded $Id$ and Git LFS read as dirty), D2 output-contract changes (retired hidden_index_state and content_filter_state, no R/C records, new clean_check_budget), D3 budgets CLEAN_ENTRY_LIMIT 100000 and CLEAN_HASH_LIMIT 1 GiB, D4 accepting candidate-authored SHA-1 collisions as a documented trust boundary. All four were Coordinator decisions, not user decisions."
---

# Integration fix 3 report

Implemented exactly per docs/design/0.3-clean-check.md: HEAD manifest from `ls-tree`, index manifest from `ls-files -s`, per-path raw observation with streaming SHA-1/SHA-256 and a size shortcut, trusted-`.gitignore`-only untracked listing with a no-exclude fallback, recursive submodule checks (depth 4), and the two budgets. `git()` lost its stdin parameter (only the retired check-attr step used it) and gained `-c core.ignorecase=false`.

Docs: harness-eval `references/config.md` (contract change and Clean check section), docs/operations.md known limitations (filter statement replaced by the trust boundary), docs/regression-cases.md, CHANGELOG 0.3.0 (contract change paragraph), docs-consistency test.

Validation scope: the handoff validator was run with `--repo` (result in the terminal handoff); it checks structure and revision resolution only.
