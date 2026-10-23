task: RUACH-ROADMAP-IMPLEMENTATION/R-RV-LFS/R1-F
status: complete
outcome: "No material findings for R1-F. Only the diagnosed raw readdir assertion at skills/ruach-herdr/tests/worker.test.ts:175 now sorts before comparing with the unchanged exact expected set; the preceding exit-2, dependencies_missing and noMutation checks are untouched. The hosted red evidence supports the change; hosted green is not established."
reviewed_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
candidate_revision: 922354fba3fe15948df370540634d632a4f2d903
tested_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
baseline: 3bf194218d55b5a26056497e23f45eb345030368
artifacts:
  - docs/reports/next-release/r1-f-review.md
  - docs/assignments/next-release/r2-l-r1-f-smoke-review.md
verification:
  - "Shared gate reused from r2-l-review.md: same clone, same unchanged revision 405ffe2, same single lock hold. just test exit 0, including ruach-herdr 162 pass 0 fail (the corrected test passes locally). just check, just release-check and bun run test (90 pass) exit 0. bun audit in root, ruach-handoff and ruach-herdr exit 0"
  - "git diff 3bf1942 922354f: one line in skills/ruach-herdr/tests/worker.test.ts (line 175); no source, timeout, retry, skip, CI, dependency or doc change"
  - "Manual: the other readdir assertions in worker.test.ts (lines 35, 138 and 255) compare empty or single-element lists, so they are order-independent"
  - "Red evidence checked against the canonical /opt/dev/ruach/docs/reports/next-release/r1-d.md and commit 8137e8e (an ancestor of c170d27). Hosted runs 37986084683 and 37661762155 both fail only this test with Expected [package.json, scripts], Received [scripts, package.json]. No local red is claimed by the author or here"
review:
  - "R1-F: no blocking or optional findings"
discoveries:
  - "Hosted green on any R1-F-containing revision is not established. Per R1-D, hosted just test stopped at this Herdr failure, so harness-eval and changelog have never run hosted; a hosted run may expose further failures. Those suites pass locally here (71 and 35)."
  - "No workflow SKILL body was opened or searched during this review."
blockers: []

# R1-F review (part of R-RV-LFS)

Scope: `3bf1942..922354f`, plus the R1-F assignment and report at `eb8f0bb`.

The change replaces `expect(await readdir(copy)).toEqual(['package.json','scripts'])` with `expect((await readdir(copy)).sort()).toEqual(['package.json','scripts'])`.

- The exact expected set is kept.
- The `await p.exited` → 2 check, the `diagnostics[0].code === 'dependencies_missing'` check and `noMutation()` are unchanged.
- No test helper mirrors the sort.

This matches the R1-D diagnosis and the plan's R1-F packet: the smallest correction, no timeout or expectation changes, and hosted status left unresolved.

## Findings

None material.

## Limitations

- The local pass cannot reproduce the hosted directory order, and the author doesn't claim that it does.
- Hosted CI remains pending under external-write authorization.
- This unit review is not combined-candidate acceptance.
