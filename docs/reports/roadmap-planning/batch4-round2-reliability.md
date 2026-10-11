---
task: roadmap-batch4-round2-reliability
role: architect
status: complete
batch: 4
round: 2
agreement: changes
outcome: "Exact M1 pair is compatible in design but needs matching CI scope and target-based polling classification before unchanged-pair agreement."
inspected_revision: ea9971a21de4d72a252137ac59dd6e7b06dc56d4
reviewed_reliability_revision: ea9971a21de4d72a252137ac59dd6e7b06dc56d4
reviewed_coordination_revision: 9576f9999e4afae411a6dba1a496b94ac93abc11
reliability_plan_sha256: e41b494d959124402745aa2a4e659010eecdbb4d01276c58d2efb93e14834df8
coordination_plan_sha256: 1726a85b1102d371980df4c85b345d6dd79d074548fc02f6f63c8ff97cc776a0
reliability_handoff_sha256: b4e3e966263262679eff7ba85fbb517f8c49001f4ac4b7af3798a8dec7375ed5
coordination_handoff_sha256: fd68aaa1b3124e892b71a4eaa23a1d8905511ed2df70e63b83e3b45fab8e6c53
assignment_sha256: fec24f6ce1a9bbd9bbc6768aa50894c0b7a5877e4c7d9c8a0da41fc41544fd7d
artifacts:
  - docs/reports/roadmap-planning/batch4-round2-reliability.md
  - docs/reports/roadmap-planning/assignment-batch4-round2-reliability.md
verification:
  - "Read all four exact frozen round-1 inputs; both plan hashes match assignment and all four files equal their named Git blobs. Revisited applicable frozen M1/prior interfaces and source compiler/CI/checker/Librarian/changelog contracts; no subjects, private logs, workflow bodies or suites executed."
  - "Source handoff validator --repo passed exit 0/ok true, resolving three revision fields; two-document/two-link check, git diff --check and explicit two-new-file whitespace checks passed. Assignment hash unchanged; only two owned new paths present. Final bytes revalidated before commit."
  - "Default staging failed exit 128 on linked index.lock (read-only filesystem); narrow two-file staging/check/local-commit escalation required. Staged scope/byte/assignment-hash/whitespace checks gate commit; actual creating SHA returned externally."
review:
  - "Actual combined-plan review complete with two necessary corrections B4-A-01/02, accepted interfaces and named factual/owner holds. No agreement on the unchanged pair or implementation acceptance."
discoveries:
  - "Both plans preserve M-IN sole shared writer, but peer's explicit CI scope excludes required pilot recipes."
  - "Peer's blanket exclusion of Git/search/approval checks conflicts with its otherwise target-based polling episode definition."
blockers:
  - "B4-A-01/02 require actual author dispositions and corrected-pair review before agreement."
readiness: "Disjoint offline preparation remains design-ready after pair closure; execution retains factual/owner gates. Wait for both reviews to close and actual distribution."
---

Verdict: changes. Reviewed exactly the two revisions/digests above, including their closed handoffs; all four frozen files equal their creating Git blobs. The [assignment](assignment-batch4-round2-reliability.md) governs this review. Architecture and scope are compatible; two bounded corrections prevent agreement on the unchanged pair. No substantive arbitration position is presently required.

**B4-A-01 — necessary correction: align M-IN's explicit CI scope.** The [pilot plan](../../design/next-comparative-pilot-plan.md), “Future units”/“Verification,” assigns M-IN accepted packet test/typecheck recipes. The peer plan, “Bounded future packages,” permits .github/workflows/ci.yml edits “only accepted new Librarian packet test/typecheck recipes,” while its verification prose also promises accepted peer checks. This excludes the pilot packet's required CI recipes. Root tsconfig includes scripts/tests/skill code, not top-level evals; existing CI cannot supply that coverage automatically. Amend the peer M-IN row and matching verification wording to include both accepted comparative-pilot and Librarian packet tests/local pinned typechecks. Root analyzer tests/typecheck already have root coverage; no duplicate CI job is needed. Match justified shared-test scope or explicitly reserve its bounded amendment. Retain M-IN alone, accepted C-IN predecessor/named definition inputs, refresh/preserve and exact full-union review. Impact: omitted hosted pilot coverage or an out-of-scope integration edit. M-P/M-U0/M-L0 preparation remains independent.

**B4-A-02 — necessary correction: classify polls by evidenced pending target, not executable name.** Peer “Minimal design,” “Waiting and polls,” correctly requires tool/argv/target evidence, then categorically excludes git status/log, searches and approval checks. A repeated git log inspection solely awaiting a named worker's new report commit can be a poll; an identical command inspecting a candidate for review is ordinary verification. Blanket exclusion can undercount polling after correcting historical overcounts. Replace that exclusion with ordinary verification/search checks being non-polls unless actual context proves an unchanged pending-work/report/approval observation. Require contrasting synthetic controls for the same tool in both uses; unresolved intent stays unclassified. Preserve initial/repeat episodes, state-change endings, blocking waits/wakes, approval-request deduplication and no inferred time savings. Correction belongs to peer definitions, fixtures and Reviewer brief, without widening analyzer scope. Impact: misleading overhead counts despite sound arithmetic.

**Accepted peer propositions.** M-I-01/02 provide compatible run/attempt/revision joins and disjoint outputs: pilot owns outcomes/native/evaluation evidence; measurement owns canonical sanitized usage/report plus private receipts. Pilot evaluator can independently rerun the producer in its allocated scratch, referencing rather than overwriting measurement output. M-I-03's independently reviewed definitions, actual native format support, analyzer and predecessor discovery are necessary before execution; an unavailable historical script does not justify invented formats or a duplicate analyzer. M-I-04 correctly separates assistance from answer access and leaves checker model_use_verified false. M-I-05's sole-writer lineage/full-union gate is accepted subject to B4-A-01.

The primary comparison holds actual model/effort/effective grants constant across all workers; heterogeneous routes remain separate whole-system comparisons. Two paired repetitions per family, counterbalanced order, frozen cases/rubrics, retained failed/corrected attempts, censored timeouts, descriptive ranges and actual interventions meet the bounded-pilot requirement. Native receipts, exact original/candidate state, checker evidence under trusted Git/runtime assumptions and an actual human comparison are distinct. Verification worktrees do not erase original dirty failures; checker joins cannot certify truth or native model identity.

Peer start-window/resume/membership, Claude ID/final-record deduplication, Codex cumulative/reset controls, cache-category non-overlap, approval outcomes and missing-worker/null coverage are substantively sound. Private manifests, exclusive bounded outputs and aliases avoid committing transcripts. Historical 3×/1.8× findings require original-cohort remeasurement, not correction factors, API charges or fabricated savings.

Extended Librarian cases preserve 01–06 and discriminate query/lint write bounds, staged repeated ingestion, authentic scoped supersession, distractors and forged authority while completing legitimate work. Protected bytes/modes/full diffs, actual stage outputs, independent grading and effective resource/access controls support acceptance. Local TS support/typechecks and bounded preparation are explicit; no premature skill repair is authorized.

**B4-A-03 — factual holds; B4-A-04 — owner holds.** Native format/cohort availability, R1/resource/access proof, implemented predecessors, actual subjects/checks/human grading and hosted evidence remain unproved. Project/cases, repeat/overhead bands, budget/grants/privacy/retention and delivery/submission remain owner-controlled. These holds do not create Architect disagreement. Copyable assignments, fresh bases, exact review/separate delivery and Coordinator resource ownership remain valid. D1–D3 and parked/catalog proposals stay unresolved. No optional redesign is requested. Commit this report and unchanged assignment only; wait for both actual reviews and subsequent direction.
