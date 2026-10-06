---
task: 0.3-integ-fix4
status: complete
outcome: "Blocking R1 fixed (one hash budget shared across the parent and all submodules); R2 and R3 documented; R4 asserts the documented budget values from the exported constants. All checks pass."
role: implementer
candidate_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
tested_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
baseline: 1201c7950411da76132a9d2a6a14cc1cb7551bf8
artifacts:
  - docs/reports/0.3/integ-fix4.md
  - docs/assignments/0.3/integ-fix4.md
  - skills/ruach-harness-eval/scripts/common.ts
  - skills/ruach-harness-eval/tests/eval.test.ts
  - skills/ruach-harness-eval/references/config.md
  - "branch ruach/ruach03-integ; fix commit c6594f5; merge of ruach/ruach03-rev2 (rev3 and rev4 reports)"
  - "evidence by reference: docs/reports/0.3/rev4.md"
verification:
  - "just install: exit 0; just check (incl. tsc): exit 0; just release-check: exit 0 (v0.2.1, no bump)"
  - "just test, sequential, at c6594f5: root 90 pass, handoff 28, herdr 148, harness-eval 101; 0 fail"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff"
  - "R1 failing before the fix: test 'R1. the hash budget is shared across submodules' (three submodules of 600 bytes, injected limit 1500) got no clean_check_budget error; passes after. It also asserts the checkout is clean under the real limit"
  - "R4 test (budget values and wording from CLEAN_ENTRY_LIMIT and CLEAN_HASH_LIMIT against config.md and operations.md) passes; it was written together with the wording and did not exist before, so no failing run"
  - "Not tested: the real 1 GiB boundary, SHA-256 repositories, case-insensitive filesystems, GitHub CI"
review: not-run
discoveries:
  - "The R1 test imports dirty() from scripts/common.ts with an injected limit (a second optional parameter, limits.hashLimit) because the CLI has no way to lower the 1 GiB bound; it is a unit-level test of the budget, not a CLI boundary test."
  - "The format field stays per repository (each submodule reads its own object format); only the budget object is shared."
  - "Docs: the entry budget is stated as per repository listing, the hash budget as shared across submodules, non-UTF-8 names read as dirty, and untracked files inside a plain non-repository .git directory are not seen (as with git status). config.md and docs/operations.md both say so."
  - "D1-D4 from integ-fix3 remain pending user ratification."
blockers:
  - "D1-D4 (byte-exact comparison, output-contract changes, budgets, SHA-1 collision boundary) remain Coordinator-made decisions pending user ratification; not new in this task"
---

# Integration fix 4 report

R1: `cleanCheck` contexts now carry a shared `Budget` object (`hashed`, `limit`); the submodule recursion passes the same object instead of copying the parent's count, so the 1 GiB bound holds per `dirty()` call. `dirty(repo, { hashLimit })` accepts an injected limit for tests.

R2/R3: documented in `skills/ruach-harness-eval/references/config.md` (Clean check) and `docs/operations.md` known limitations. R4: the docs wording for both budgets is asserted against the exported constants.

Validation scope: the handoff validator was run with `--repo` (result in the terminal handoff); it checks structure and revision resolution only.
