---
task: roadmap-batch3-round2-reliability
role: architect
status: complete
batch: 3
round: 2
agreement: changes
outcome: "Exact frozen C1–C5 pair reviewed; two consequential plan corrections and one assignment identity correction required. Matching C-IN ownership and principal feature interfaces accepted."
inspected_revision: 283c03c91323f175c1f9c785742dbb5ec94326b1
reviewed_reliability_plan_revision: 283c03c91323f175c1f9c785742dbb5ec94326b1
reviewed_coordination_plan_revision: e15e280a052736c88bb909a2d4e954afe3e72c15
reliability_plan_sha256: 6d986d93816ac6a76f5390529ad98862a5416eec4bc1bf17fc4055ad12b866ce
coordination_plan_sha256: 67a9e33a64c6218324aeb2030312c4cd8911b5ba7bbad93d1bd31f6451b5e294
assignment_coordination_plan_sha256: f9144b85cc4417ca58456aa52b3ef4337f4fc513ec6d53effa0ab262fd1b4e1a
reliability_handoff_sha256: 890120e67b115cbd415627e81ba59474f268a2c4adc810b2fc78ce0412d53cce
coordination_handoff_sha256: 9364acc55505e426be0e5c42a5971dbf9b35c2fb23143633ddd74cf56fa8ad3f
assignment_sha256: 9022cf180dfb1a3b29b6377ad960a2eb697862dc0f4d4a79e0cc7758ccc05a9f
artifacts:
  - docs/reports/roadmap-planning/batch3-round2-reliability.md
  - docs/reports/roadmap-planning/assignment-batch3-round2-reliability.md
necessary_corrections:
  - B3-A-01
  - B3-A-02
  - B3-A-03
arbitration_questions: []
verification:
  - "Read all four exact closed frozen files. Four git show calls exited 0; every frozen SHA-256 equals its creating-commit blob. Peer plan and handoff agree on 67a9e33a…, which differs from the assignment's f9144b85…."
  - "Inspected only relevant root TS/test/CI and installer readiness source plus canonical roles/frozen C1–C5 requirements. No workflow bodies, native subjects, feature implementation or unrelated suites."
  - "Source handoff validator --repo passed, exit 0/ok true; all three revision fields resolved. Owned links passed: two documents/two links. Final bytes are revalidated before commit."
  - "git diff --check passed; both new-file whitespace checks clean (diff exit 1 means different files). Assignment digest unchanged; status contains only two owned paths. Default staging failed exit 128 on linked index.lock (read-only filesystem); one narrow exact two-file staging/check/local-commit escalation is required. Staged scope and whitespace gate that action; actual result/creating SHA returned externally."
review:
  - "Actual combined-plan review completed with changes; neither peer verdict nor corrected-pair acceptance is inferred."
discoveries:
  - "Peer explicitly closes the root-excluded eval typecheck/CI gap; own C2/C3 packet ownership/checks must adopt it."
  - "C-IN sole shared writer/predecessor/refresh/full-union independent-review gate matches. Disjoint preparation remains independent."
blockers:
  - "B3-A-02 and B3-A-03 require owned plan corrections; B3-A-01 requires Coordinator reconciliation of the review identity."
readiness: "Corrections required before unchanged-pair agreement; named native/behavior/owner holds remain execution gates. Wait for both round-2 reports; no batch 4."
---

**Agreement: changes.** Reviewed the exact frozen [C2/C3 plan](../../design/next-adapter-bugfix-plan.md) and C1/C4/C5 plan (canonical docs/design/next-council-qa-hunt-plan.md), plus both actual handoffs. The metadata identifies reviewed bytes, including the assignment discrepancy. No plan was edited.

**B3-A-01 — necessary identity correction, Coordinator-owned.** The assignment names coordination digest f9144b85…, but the frozen plan, e15e280a… Git blob and handoff all identify 67a9e33a…. All four supplied files match their commits; this is not a peer handoff digest error. Reconcile the next review assignment/manifest to the actual intended pair, preserving this assignment unchanged. Otherwise agreement could be attributed to different bytes. This report's substantive verdict covers the actual supplied, commit-matching pair.

**B3-A-02 — necessary correction in my plan.** Accept the peer's “Verified source constraints” and “Exact future verification” argument: root tsconfig includes scripts/tests/skill support, and root tests/CI omit top-level evals. My “Bounded packages” C2-P/C3-P scopes exclude local tsconfig files; “Base, checks…” lacks eval typechecks and explicit shared CI ownership. Bun tests therefore cannot establish typechecked/hosted coverage. Add packet-local tsconfig ownership and exact pinned-compiler commands for ruach-debugging, ruach-bugfix and conditional ruach-agy; include them in feature/final-union checks. Match the peer's bounded C-IN-only .github/workflows/ci.yml recipe integration for accepted packet tests/typechecks. Keep actual hosted results pending until authorized submission and evidence. No root compiler redesign or extra runner is needed.

**B3-A-03 — necessary matching workflow-review boundary.** Reject the peer's “Bounded packages” C145-R row and “Copyable independent Reviewer” rationale that assigned new-workflow source review permits body inspection because it does not activate orchestration. Canonical worker instructions and the planning assignment reserve workflow-body inspection/loading to Coordinator. My “C3: Separate responsibilities” and Reviewer brief explicitly restrict workers to metadata/packaging. These are incompatible dispatch scopes. Align the peer brief/table with Coordinator body compatibility observations, independent technical-source/metadata checks and independent grading of actual isolated Coordinator behavior. Preserve self-contained Implementer authoring and separate Reviewer acceptance; Coordinator compatibility is not technical self-approval. If an exception is considered necessary, substantively propose explicit authority before using it.

Accept the actual peer arguments in “C1 council contract”: manual one-and-pause, exact N including first, explicit up-to-N, closed actual reports before exchange, reasoned peer dispositions/minorities and durable resumption meet frozen C1 and R3/R5. “C4 Tester…” correctly distinguishes actual build from source SHA, playback/listening from code/recording, script time from frame evidence, required capability/budget gaps and original-state retest. “C5 hunt…” separates supported/reproduced/suspected/product findings, significant independent checking, findings-only authority and authorized C3 correction. Two real project demonstrations remain actual evidence requirements.

The optional council → debugging → QA/hunt interface matches: intended contract, supported cause, narrow correction, meaningful regression and original failure repeat precede exact-build retest/review/delivery. C2 remains additive/non-Coordinator, need/capability-gated and inherit-only; logging/help/fakes prove no native turn. C-IN's matching predecessor/refresh/union gates, local notices versus root metadata, committed installation/foreign-cwd links, scoped branches/assignments and positive/negative blind-access controls are accepted.

**B3-A-04/05 — factual/owner holds, not corrections:** actual implemented predecessors, functioning native/additive proof, Coordinator compatibility, runtime/audio/access capabilities, real defect/project runs, hosted CI, exact resource/build/check/review evidence; and implementation/project/native/paid/dialog/budget/delivery authority, including prior D1–D3. Installed role discovery already supplements the readiness list (install.ts roleNames); blanket installer edits are not required without a demonstrated gap. No arbitration or stylistic expansion is requested. Disjoint source/packet preparation can continue once assigned; shared mutation and dependent acceptance retain their gates.

Only this report and the [unchanged assignment](assignment-batch3-round2-reliability.md) are owned. Final validation/commit results are recorded in metadata and returned externally. Wait for both reports to close and actual correction direction; no next batch.
