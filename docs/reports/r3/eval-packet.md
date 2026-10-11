task: RUACH-ROADMAP-IMPLEMENTATION/R3-C
status: complete
outcome: Offline coordination behavioral packet prepared at evals/ruach-coordination (three held-out synthetic cases with genuine Git histories, evaluator-only rubric, deterministic prepare.ts, packet-local tests and typecheck). Statically checked only; no model subject was run or graded and no behavioral completion is claimed. Review not run.
candidate_revision: eaa9b8410c0d25dcebcdd5bbd67fcce4d3b39424
tested_revision: eaa9b8410c0d25dcebcdd5bbd67fcce4d3b39424
baseline_revision: 123ade32ad05b980cb3efa14abff08b2503193e5
preserved_branch_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
artifacts:
  - docs/reports/r3/eval-packet.md
  - docs/assignments/r3/eval-packet.md
  - evals/ruach-coordination/README.md
  - evals/ruach-coordination/prepare.ts
  - evals/ruach-coordination/cases/
  - evals/ruach-coordination/expected/rubric.md
  - evals/ruach-coordination/tests/packet.test.ts
  - evals/ruach-coordination/tsconfig.json
verification:
  - "Branch: git switch -c ruach/r3-eval-packet 123ade32ad05b980cb3efa14abff08b2503193e5 (tree clean except the Coordinator-owned untracked assignment); ruach/r2-linked-recovery still resolves to 405ffe2bc33b0f2587bc1790099b05e4e306bfb8 and was not modified"
  - "bun evals/ruach-coordination/prepare.ts --out <fresh scratch dir>: exit 0, {ok:true, cases: 01-resume 02-ambiguity 03-authorization, reports_validated: 9, invalid_reports: 0}; evaluator/manifest.json sha256 4f60ece922b8d0958e39593604cacb28c2a7817eff8b4ebdc7ad2d8563445890 (identical across two runs, asserted in tests)"
  - "Each of the 9 committed handoff reports validated individually by skills/ruach-handoff validate.ts --repo <fixture repo> at its own commit (inside prepare.ts); the hand-written advisor report in case 02 validated separately in the packet test"
  - "bun test --timeout 30000 evals/ruach-coordination: 8 pass, 0 fail, exit 0 (fresh-path refusal, reproducibility, report validation, subject-tree exclusion, protected 0444 modes and byte equality, case 01 and 03 source-fact realization, stub behavior, case 02 ID disjointness)"
  - "node_modules/.bin/tsc -p evals/ruach-coordination/tsconfig.json: exit 0 (pinned TypeScript 7.0.2)"
  - "just check: exit 0; just release-check: exit 0; bun run test: 100 pass, 0 fail, exit 0; (cd skills/ruach-handoff && bun test): 28 pass, exit 0"
  - "Manual raw coherence and leakage read of every subject-visible file in a prepared tree: timestamps, identities and Git facts agree; no rubric wording, disposition or CSV-142 fact present (also asserted by a test scan)"
  - "All heavy commands serialized under /tmp/ruach-implementation-20261011/verification.lock"
review: not-run
discoveries:
  - "Realized fixture refs (deterministic, fixed identity and dates): case 01 task/tide-77-feed f861e8a602f7 (partial), -chart 7c168fbc888d, -datum 653530d8a9e6 (revised report), -docs cc54858a72ef, -units e04274d0b93d; retained feed.diff sha256 2a7722af7601b5dcdf8b5e5c357551a448d2c3ce39d90662f4aa4aee80f61d39. Case 03 targets: integration-a 19bd40f60613 (unmoved at review), integration-b bb984815374a (moved after review), release/2.1 4d23043c9c02, main 3da973fb2d41. Full per-file digests and modes are in the generated manifest, not committed."
  - "Packet stored under evals/ruach-coordination only; cases 01 and 03 keep their Git history specification in cases/*/git (evaluator side) and prepare.ts renders commit, blob and digest tokens. The recording stub exists in case 01 only, as specified."
  - "Corpus was prepared against accepted R3-A. Subjects need the later A+B resource refresh, the selected workflow supplied by the evaluation Coordinator, and an evidenced access boundary; the README lists these holds. No workflow body was read or copied."
  - "Independent packet review should check, per the rubric's leakage section, every subject-visible file against the public CSV-142 specimen and both sides of each contrast. The rubric states which copied next-action sequences fail which control."
blockers: []

# R3-C report

Scope kept to evals/ruach-coordination/** plus this report and the unchanged assignment. No installed resource, root code, config, CI, test or foreign doc was edited. Not covered: any native subject, blind access probe, A+B refresh, hosted CI, packet review.
