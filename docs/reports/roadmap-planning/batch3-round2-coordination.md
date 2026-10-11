---
task: roadmap-batch3-round2-coordination
role: architect
worker: sol-roadmap-coordination
status: complete
batch: 3
round: 2
agreement: changes
outcome: "Actual named-commit C1–C5 pair has compatible capability/shared-owner interfaces but needs three bounded plan corrections: Reviewer workflow-body scope, peer eval typechecks/CI gates, and separate assistance/answer-access classifications."
inspected_revision: e15e280a052736c88bb909a2d4e954afe3e72c15
reviewed_reliability_revision: 283c03c91323f175c1f9c785742dbb5ec94326b1
reviewed_coordination_revision: e15e280a052736c88bb909a2d4e954afe3e72c15
reliability_plan_sha256: 6d986d93816ac6a76f5390529ad98862a5416eec4bc1bf17fc4055ad12b866ce
coordination_plan_sha256: 67a9e33a64c6218324aeb2030312c4cd8911b5ba7bbad93d1bd31f6451b5e294
assignment_coordination_plan_sha256: f9144b85cc4417ca58456aa52b3ef4337f4fc513ec6d53effa0ab262fd1b4e1a
closed_handoff_digests:
  reliability: 890120e67b115cbd415627e81ba59474f268a2c4adc810b2fc78ce0412d53cce
  coordination: 9364acc55505e426be0e5c42a5971dbf9b35c2fb23143633ddd74cf56fa8ad3f
assignment_sha256: c832216077b0a6ade140b3a2c6a60d0693c98e7386c3965d68718c0792b9c9fe
artifacts:
  - docs/reports/roadmap-planning/batch3-round2-coordination.md
  - docs/reports/roadmap-planning/assignment-batch3-round2-coordination.md
verification:
  - "Read all four frozen closed round-1 files; each matches its named creating-commit Git blob. Actual plan digests and handoff digests recorded above. Assignment's coordination digest differs; named commit/frozen bytes/closed handoff agree on the actual digest."
  - "Rechecked frozen roadmap/native-parity/RAMEC digests, relevant accepted authority/access interfaces and necessary adapter/readiness/test/typecheck/CI source. No workflow bodies, unrelated suites, subjects or feature implementation run/read."
  - "Canonical source handoff validator --repo passed, resolving all three revision fields; all six relative Markdown links resolve. Assignment SHA256 is unchanged. Staged whitespace check passed; staged scope is exactly the owned review and unchanged assignment, with no tracked plan changes."
review:
  - "Actual peer B3-I-01/02/03/05 accepted; B3-I-04 accepted with own correction required. Mandatory readiness-registry edit rejected as unsupported by full source; conditional bounded ownership retained if a real defect is demonstrated."
discoveries:
  - "ready() augments its fixed role names with active source/snapshot role names; Tester need not trigger a speculative installer edit."
blockers:
  - "Exact combined-plan handoff agreement requires B3-B-01/02/03 corrections and subsequent exact revised-pair review."
findings:
  - id: B3-B-01
    category: necessary-plan-correction
    owner: coordination
    disposition: accept-peer-workflow-boundary-align-own-review-packets
  - id: B3-B-02
    category: necessary-plan-correction
    owner: reliability
    disposition: add-exact-packet-typecheck-ownership-and-C-IN-CI-inputs
  - id: B3-B-03
    category: necessary-plan-correction
    owner: reliability
    disposition: preserve-separate-assistance-and-answer-access-axes
  - id: B3-B-04
    category: factual-input-receipt-correction
    owner: coordinator
    disposition: record-actual-digest-from-matching-frozen-and-commit-bytes
arbitration_questions: []
readiness: bounded-corrections-then-exact-revised-pair-review
next_action: "Return creating SHA/agreement/findings; wait for both round-2 reports to close and Coordinator correction assignment. No plan edits or batch 4."
---

**Agreement: changes** on the actual unchanged named-commit pair: `next-adapter-bugfix-plan.md` and [C1/C4/C5 plan](../../design/next-council-qa-hunt-plan.md), with exact revisions/digests above. Both handoffs were read; no unseen peer round-2 verdict is inferred.

**B3-B-04 — input receipt, not a design disagreement.** The [assignment](assignment-batch3-round2-coordination.md) lists C1/C4/C5 digest `f9144b85…`; frozen bytes, commit `e15e280…` and its closed handoff all identify `67a9e33…`. The reviewed pair is unambiguous from these matching artifacts. Coordinator should correct the digest in subsequent input receipts; this assignment remains unchanged. No agreement would cover the unverified earlier digest.

**B3-B-01 — necessary own correction.** Peer §C3/Separate responsibilities and B3-I-04 reserve existing/candidate workflow bodies to Coordinator; Reviewer checks technical source, workflow metadata/packaging, supplied compatibility observations and independently grades actual behavior. Accept this reason: [AGENTS.md](../../../AGENTS.md) permits only Coordinator to load workflow bodies. Own §Bounded packages/C145-R and §Copyable independent Reviewer instead allow new workflows to be read as authored source. Saying source inspection does not execute orchestration fails to preserve the narrower access boundary. Remove that exception consistently from own package/brief/general wording; use Coordinator compatibility evidence plus independent actual-output/trace grading, without giving Coordinator technical acceptance authority. Otherwise the first workflow review dispatch contradicts the canonical worker boundary.

**B3-B-02 — necessary peer correction.** Peer C2-P/C3-P ownership and §Base/checks table prescribe Bun tests/preparation but no eval typecheck scope/command. [Root tsconfig](../../../tsconfig.json) excludes `evals/`; Bun test transpilation does not close that gap. Own §Exact future verification provides packet-local tsconfigs and C-IN's bounded [CI](../../../.github/workflows/ci.yml) addition. Add owned typecheck configuration and exact pinned compiler commands for implemented `evals/ruach-agy`, `evals/ruach-debugging` and `evals/ruach-bugfix`, supplying their tests/typechecks to C-IN's final local/hosted union. C2 remains conditional. This closes unchecked new support code without widening the root compiler scope, adding dependencies or claiming CI ran.

**B3-B-03 — necessary peer correction.** Peer §Realistic behavioral packet/visibility says failed isolation should be labelled “assisted”; its evaluator brief says “blind/assisted status.” Accepted R1-S §Answer-access boundary records two axes: prompt assistance and answer visibility. Failed exclusion establishes non-blind or unverified access, not whether the brief supplied hints. Keep assistance independently observed and name both axes in peer protocol/grading; retain positive/negative controls, native-resource equivalence and actual failures. Otherwise contaminated or unknown answer access receives an ambiguous evaluation label.

**Actual arguments accepted/rejected.** Accept peer B3-I-01/05: C-IN alone assembles/writes shared roots after named accepted R3-B → R-IN → B2-IN lineage and feature inputs; refresh/preserve, full union and independent exact final review match own C-I-003. Local notices, committed install links and final delivery remain separately scoped. Accept B3-I-02: council decisions are optional C3 inputs, not a council per small fix; capability progression remains C1 → C3 → C4 → C5. C3's supported reproduction/cause/public regression/original retest feeds Tester's exact-build/state evidence and authorized hunt correction. Accept B3-I-03: additive non-Coordinator, inherit-only C2 awaits actual need/capability; fake success, hooks/headless docs and the peer-observed SIGILL prove no native launch.

Reject a mandatory Tester readiness-list patch under peer §C-IN: [install.ts](../../../scripts/install.ts) at lines 323–325 augments ROLES with active source/snapshot role names. Own committed-snapshot/discovery checks can verify Tester without speculative source edits. Keep peer's conditional bounded amendment/ownership rule if actual discovery fails; catalog policy still requires its assigned choice.

C1 counts/closed exchanges/actual reasons/minorities/resume, Tester audio versus source and script versus layout/paint measures, unmet-budget follow-ups, no-defect/findings-only outcomes and both real-project feedback demonstrations otherwise align. Native tools/access, build/data/projects, original retests, grading/CI and owner implementation/budget/dialog/delivery/D1–D3 remain execution holds, not extra agreement gates. Independent authorized preparation remains possible; no arbitration question is presently necessary. Wait for both reports and bounded correction direction; no plans edited or next batch started.
