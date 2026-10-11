---
task: roadmap-batch1-round2-coordination
role: architect
worker: sol-roadmap-coordination
batch: 1
round: 2
status: complete
agreement: changes
outcome: "R1–R3 designs are compatible, but the exact unchanged pair needs one correctable R1-S blind-input boundary clarification before agreement. No substantive architectural disagreement remains."
inspected_revision: fc31e91f859f62320d7535321c935ebedd921411
reliability_plan_revision: a77d5cb3b1f2dd540c10db4942cd7bf5cd668b76
coordination_plan_revision: fc31e91f859f62320d7535321c935ebedd921411
reviewed_plan_digests:
  reliability: ccb146fbcc1f1bc07930a4a37aa666dbd0801227c67b082800b13aaf7360fe94
  coordination: 2a343fad1fa6fa0f14d29ce57a37a16b3b0d1dfbfa8f44d46dfe8879358f85d9
artifacts:
  - docs/reports/roadmap-planning/batch1-round2-coordination.md
  - docs/reports/roadmap-planning/assignment-batch1-round2-coordination.md
verification:
  - "Both frozen actual plans and both frozen handoffs read; sha256sum matched both assigned plan digests."
  - "Read-only current planning task record inspected; sequential batches and up-to-five-round owner steering preserved."
  - "Relevant source inspected for installer lock, linked receipt/cwd, worker options, CI definition, readiness and harness-eval commands; no implementation or live vendor probe performed."
  - "Canonical source handoff validator with --repo: exit 0; all three existing revision references resolved."
  - "Owned report/assignment Markdown file-target and trailing-space/newline checks: passed. Report-only staged git diff --check: exit 0. Full staged diff check: exit 2 for the supplied assignment's extra blank line at EOF; assignment preserved unchanged as required."
  - "Assignment unchanged SHA256: 8cefa23f6f03ae91601d285058bce1fbc160ba9f93e91a3c38a062057e39cf30."
  - "Not run: unrelated suites, native/paid subjects, hosted CI, implementation validation or delivery."
review:
  - "Architect peer review completed for the exact frozen round-1 pair; agreement changes because of B1-B-01. This does not certify feature completion or evaluation results."
discoveries:
  - "R1/R2 and R3 are compatible in scope, retained-work/authorization semantics and revision evidence; only CHANGELOG.md is an explicit shared implementation document in their current owned scopes."
  - "The known whole-repository native plugin cache can expose developer eval material even when subject briefs omit it; R3 addresses this explicitly, R1-S needs the same fail-closed classification boundary."
  - "The newer owner steering supersedes historical one-correction-round language; no reauthorization of the same two planning sessions is needed."
blockers:
  - "B1-B-01 must-fix: specify access exclusion or non-blind classification before claiming blind R1-S evidence. Other named investigation/owner holds are future execution gates, not Architect disagreement."
---

# Batch 1 combined Architect review, round 2

**Agreement: changes.** The pair is architecturally compatible and ready for bounded first diagnostic/specimen assignments once separately authorized. One small correction prevents agreement on the exact unchanged complete pair: B1-B-01, the R1-S blind-input boundary. Neither plan was edited in this round. No opposing architectural position requires owner arbitration now.

## Exact artifacts and scope

Reviewed the supplied frozen `reliability-plan.md`, `reliability-handoff.md`, `coordination-plan.md` and `coordination-handoff.md` under `/tmp/ruach-roadmap-planning-20261011/batch1/round1/`. The plan digests above matched. Durable source identities are `a77d5cb3:docs/design/next-release-reliability-plan.md` and `fc31e91f:docs/design/next-coordination-plan.md`; line references below refer to these exact frozen bytes. Read the current source task record at `/opt/dev/ruach/docs/reports/roadmap-planning/task-record.md` without changing it. Frozen roadmap/native-parity/RAMEC inputs retain authority; the older worktree roadmap is not substituted.

This is plan peer review under the [round-2 assignment](assignment-batch1-round2-coordination.md), following the canonical Architect role and ruach-handoff protocol. It is not source implementation review, hosted-run verification, evaluation grading or delivery approval. Owner PLAN-D2 supersedes one-correction-round statements in historical plans/reports: the same two authorized sessions remain available for sequential batches and up to five agreement rounds. Batch 2 waits for both actual agreement reports or recorded arbitration; I do not start it or exchange an unfinished report with the peer.

## Findings

### B1-B-01 — must-fix: make R1-S's blind boundary account for the native plugin cache

Location: reliability plan R1-S, lines 261, 267, 273–289, and its packet ownership at line 63. Compare coordination plan lines 226 and 324–326.

R1-S correctly separates subject briefs from expected outcomes/rubrics and rejects hinted runs as unassisted. It also installs the native plugin from a clean source clone at the selected SHA, while putting the developer packet under `evals/next-release-native-smoke/**`. The frozen native-parity input, “Clean-install plugin cache facts,” line 34, explicitly records that the cache copies the whole repository, including `evals/` and `docs/`. The existing [Librarian packet](../../../evals/ruach-librarian/README.md) likewise distinguishes non-registration from files being present on disk. Isolation of HOME/config roots does not by itself withhold those cached files.

The missing element is a concrete prelaunch access/disposition condition. Omitting a rubric from the prompt does not establish that a subject able to inspect the full plugin cache cannot read it. The inference is an exposure risk from the documented installation layout; no subject was run and no actual rubric read is alleged. R3 already requires an allowlisted/copy-isolated view instead of relying only on a “do not read” instruction. The combined package should not use a weaker meaning of blind input for R1.

Required correction: add a short R1-S rule that inventories/checks the subject-visible source clone, plugin cache, evaluator files and prior reports before every run claimed blind. Keep raw task inputs and installed tested resource bytes visible; withhold rubric/hidden-check/expected-answer files, this plan, prior conclusions and other run outputs through the assigned execution boundary. Record the resulting visibility manifest and an offline negative-control access check. If the selected route cannot establish that separation, leave blind evaluation evidence unverified and label the run as ordinary non-blind native-use smoke; retain its discovery/outcome evidence without claiming blind quality. Assisted/unassisted prompt classification and blind/non-blind answer access are separate dimensions. Do not silently alter the installed package to conceal files, settle D1, add a new evaluator service or drop the native install route.

Impact: only future blind R1-S evidence is gated; R1-D, R2 offline fixes, R3-A and packet preparation remain usable. Resolving evidence for the next planning round is revised R1-S text defining this guard/classification and its independent packet-review acceptance. Actual runtime access evidence is required later, not fabricated now. This is a correctable plan gap, not a factual-access hold or incompatible architecture.

### B1-B-02 — optional suggestion: name the actual shared-file serialization edge

Location: reliability lines 62, 68, 249 and coordination lines 181, 199.

R-IN and R3-B both own Unreleased additions to `CHANGELOG.md`. Reliability already requires shared-file editors to take turns at a pinned common base, so there is no authorization to edit it concurrently. Its explicit R3 examples name `docs/roadmap.md` and `tests/docs-consistency.test.ts`, which current R3 packages do not own. When forming implementation assignments, naming `R-IN ↔ R3-B: CHANGELOG.md` and giving the later editor the accepted earlier commit would make that existing rule easier to execute. Roadmap/native-parity/operations/inventory/docs-consistency remain R-IN-owned; specimens/roles/coordination examples remain R3-owned. This clarification is useful but does not independently prevent agreement.

### B1-B-03 — optional suggestion: vary the raw R3 test story from the published worked example

Location: coordination lines 94–142 and 230–238.

The subject receives candidate specimens, including the worked CSV interrupted-task example; case 01 uses that same story. General guidance/examples are legitimate subject inputs, but independent packet preparation should vary names, event order, refs, resource allocations and report changes, preserving the tested invariants. That helps distinguish acting on the supplied raw facts from reproducing the example's next steps. Keep variations and expected dispositions in evaluator-only material; no new measurement service or additional authorized run is implied. This is evaluation strength, not a failure of the specified give/withhold boundary.

## Accepted and rejected arguments

- **Accept reliability's diagnostic-first argument** (lines 20–34, 82–126): local missing dependencies and the changelog stdin EPERM lead do not establish the hosted cause. CI installs dependencies and uses the larger Herdr timeout already. A bounded read-only R1-D packet precedes any exact R1-F scope; no speculative timeout/skip/retry change is justified. The source task record's green installed-source checks and the planners' fresh-worktree setup failures are different environments, not contradictory facts.
- **Accept lock revalidation** (reliability 140–178): immutable source snapshot stays outside the lock, authoritative target planning goes under the existing lock, and failed acquisition cannot remove another installer's staging. Public CLI state/exit/rollback assertions, rather than helper-order checks, preserve the current trust/rollback contracts. Full regression implementation remains pending, correctly distinguished from the small preload feasibility probe.
- **Accept uncertain receipt and base-tree preflight** (reliability 180–221): keep valid individual IDs as inspection hints before complete identity verification, never use them as trusted launch/cleanup authority, and reject a non-tree requested cwd before creating checkout resources. Inspected `skills/ruach-herdr/scripts/spaces.ts:68` verifies before parsing today; `worktreePlan()` lacks the proposed tree query. Its existing spaces suite exercises the actual worker CLI, so the owned `spaces.test.ts` can cover new public cases without automatically broadening ownership to `worker.test.ts`.
- **Accept the Git boundary** (reliability 223–245): standalone replacement suppression is not proof of Herdr daemon checkout bytes. Keep fail-closed identity, accepted Git-configuration trust and an explicit investigated limitation; no content-hashing redesign, config mutation or automatic standalone fallback. Optional replacement-ref refusal remains an owner compatibility choice.
- **Accept the R3 interface and minimal mechanism** (reliability 303–307; coordination 37–74, 144–155): package IDs, revisions, paid-run authority, uncertain/verified resources and handled reports fit one consumer-owned record. Manual completeness checks suffice; no parallel ledger/tool/schema change is warranted. Permission descriptions are future assignment scope, not proof of sandbox grants or authority to answer native dialogs.
- **Accept interrupted continuation and delivery** (coordination 94–142, 195–207; reliability 78): preserve the active stale worker and ended partial work, supersede only affected scope, keep ambiguous replies unresolved while independent authorized work advances, and do not repeat handled work. Both plans require independently reviewed exact combined revisions, refreshed destination observations, separate delivery Implementer assignments and Coordinator cleanup. Changed targets do not erase still-valid broader owner authorization.
- **Reject prompt separation as sufficient blind isolation** if that is the intended reading of reliability line 261: the recorded cache layout makes that incomplete; B1-B-01 supplies the missing access/classification condition. No peer round-2 argument or outcome was available to accept/reject; these positions address the actual round-1 plans only.

## Interface, executable packets and holds

R1-D is a complete first diagnostic template with common contract: Scout, read-only source, exact public-run/local commands, bound, owned logs/assignment/report, fresh branch and resolved base, socket/temp/local-dependency permissions, narrow escalation, pending independent review. R3-A is a complete first specimen template with source/tests/support/docs ownership, explicit no-runtime/no-test-edit boundary, unchanged assignment/report paths, base/unused-branch/route filling and no paid/native subjects. Filling real resolved SHAs and launch authority is required, not evidence of an incomplete product design. R3-A's no-network rule means missing uncached dependencies become a reported setup hold rather than implicit network permission.

R2-I and R2-L are disjoint except for possible later diagnosed R1-F families, whose conflicting editor must serialize. Shared recovery/evidence docs stay with R-IN. R3-A precedes settled R3-B guidance; R3-C may prepare disjoint fixtures in parallel with B and refresh against accepted source. Final combined checks/review are assigned to Implementer/Reviewer, never performed by Coordinator. Each plan keeps evidence-only recording successors separate from code-tested/reviewed revisions. A combined R1–R3 delivery candidate must retain the union of required checks and exact-review gates; neither separate handoff certifies that candidate in advance.

Inspected source supports the listed installer/ready, worker and harness-eval flags (`--project`, direct kind/model/effort, acceptance `--run`, scope `--allow`, external new output path). This review did not execute native CLI probes or prove future commands succeed. Public CI/API access, real Herdr daemon behavior, and actual permissions remain their named investigations; no vendor capability is inferred from memory. Selected Coordinator workflow compatibility inspection remains assigned to the Coordinator before R3-B acceptance; no workflow body was opened here.

Future factual holds: hosted job logs/cause and green resulting CI; native discovery/composition evidence; actual linked replacement-ref boundary; blind subjects and R3 behavior results; worktree-local dependency setup where absent. Future owner decisions: implementation authority, paid/launch budget, actual consumer scope/resources, external writes/delivery target, D1/D2 and optional compatibility refusal. These are accepted named gates, not agreement blockers by themselves. The newer sequential planning instruction authorizes later batches in the same two sessions after agreement/arbitration; it does not authorize feature work or extra paid evaluators.

## Readiness and next-round boundary

Only B1-B-01 is necessary for agreement on the exact pair. There is no consequential incompatible design position and no owner arbitration request now. If the peer disputes that requirement and the position remains unresolved at the allowed round limit, the precise arbitration question is: **May R1-S claim blind evaluation when the native subject can read cached developer rubrics/expected answers, or must that run remain non-blind unless access exclusion is evidenced?** Preserve both positions/evidence and gate the dependent evidence claim; other batch planning can move on under the owner's arbitration rule.

Next action belongs to the Coordinator: close both round-2 reports, distribute the actual reports, and assign a bounded correction/review against the resulting frozen plan bytes. This worker waits for that assignment or an authorized next-batch assignment. No plan edits, implementation, extra workers, native subjects, global writes, push/merge/tag or cleanup were performed.

## Report verification

Used the canonical ruach-handoff skill. The source validator invocation is `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/roadmap-planning/batch1-round2-coordination.md --repo /opt/dev/ruach/.worktrees/sol-roadmap-coordination`. Owned links/whitespace and staged diff are checked separately. The full staged whitespace check flags the supplied assignment's extra blank line at EOF; its digest is unchanged, and the binding unchanged-assignment requirement takes precedence over removing that line. The report-only staged check passes. Existing creating revisions are recorded above; this report's creating commit is returned after commit and never predicted inside the report. Unrelated suites were intentionally not rerun, as assigned.
