task: RUACH-ROADMAP-IMPLEMENTATION/R1-F
status: complete
outcome: The diagnosed hosted-failing assertion at skills/ruach-herdr/tests/worker.test.ts:175 now sorts the readdir result before comparing with the exact file set; all other assertions unchanged. Local green does not establish hosted green.
candidate_revision: 922354fba3fe15948df370540634d632a4f2d903
tested_revision: 922354fba3fe15948df370540634d632a4f2d903
artifacts:
  - docs/reports/next-release/r1-f.md
  - docs/assignments/next-release/r1-f.md
  - skills/ruach-herdr/tests/worker.test.ts
verification:
  - "Red evidence: hosted runs 37986084683 and 37661762155 (r1-d report 8137e8e): Expected [package.json,scripts], Received [scripts,package.json]. Not reproducible locally (tmpfs lists package.json first); no local failing-before run was possible and none is claimed."
  - "Focused (cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts --test-name-pattern 'standalone skill without installed dependencies'): 1 pass; exit 0"
  - "just check: exit 0; just release-check: exit 0; bun audit (root, skills/ruach-handoff, skills/ruach-herdr): each exit 0, no vulnerabilities"
  - "just test: exit 0 (Herdr 162 pass, harness-eval 71 pass, changelog 35 pass, 0 fail; earlier suites passed within the recipe)"
  - "All run sequentially under /tmp/ruach-implementation-20261011/verification.lock; no installs needed"
  - "Hosted CI on this SHA: not run (no push authorized)"
review: not-run
discoveries:
  - "Lines 138 and 255 compare single-element readdir results, so they are order-independent and untouched."
  - "Base includes R2-L candidate ac675dc and report commit 3bf1942, unchanged; independent combined R2-L+R1-F review pending."
  - "Per R1-D, hosted harness-eval and changelog suites have never run hosted; a hosted run may expose further failures."
blockers: []

# R1-F report

One-line change in the single owned assertion: `expect((await readdir(copy)).sort()).toEqual(['package.json','scripts'])`. The preceding exit 2 / `dependencies_missing` / `noMutation()` checks and the exact expected set are preserved. No timeout, retry, skip, source, CI, dependency or doc edits; no new helper.
