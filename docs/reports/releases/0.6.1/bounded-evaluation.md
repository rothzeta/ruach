task: five-bounded-improvements-guidance-evaluation
status: complete
outcome: Independent decisions in 17 bounded scenarios follow the revised context, correction-cycle and test-oracle guidance without material contradiction
artifacts:
  - /tmp/ruach-bounded-evaluation-Nz6DpD/report.md
verification:
  - "Performed: independent scenario decisions from revised role and skill instructions; no production or runtime verification"
  - "Passed: bun skills/ruach-handoff/scripts/validate.ts /tmp/ruach-bounded-evaluation-Nz6DpD/report.md; exit 0, structural handoff validation only"
review: not-run
discoveries:
  - "No material contradiction found in the evaluated guidance; runtime, permission adapters and consumer integration were outside this evaluation"
blockers: []

# Scope and method

An independent evaluating agent read the revised Coordinator, Architect, Implementer and Reviewer roles, the feature workflow's intake/escalation sections, knowledge workflow intake, testing guidance and verification reference, simplification guidance and assignment specimen. The cases below are synthetic prompts answered under those instructions. They are decisions actually made by this evaluator, not an instrumented live Coordinator run, application test results or proof of all models' adherence. No application bodies, runtime implementation, worker transcripts or diffs were inspected. No worker was launched, workflow executed or technical check run.

# Coordinator decisions

| Case input | Evaluator decision |
| --- | --- |
| C1. Intake: “Fix CSV export escaping; preserve the UI.” Available context names the owner's request, preferred roles/routes, current task record and `src/export/`; no source investigation exists. | Read applicable consumer policy/workflow and concise handoffs if available. Delegate the missing export-path and acceptance investigation to a Scout, with the authority, question, candidate scope, ownership, verification restrictions and report location. Do not open `src/export/` or tests to prepare that assignment. Request the specific missing fact if the Scout report is insufficient. No Architect phase is required solely because intake lacks a technical picture. |
| C2. Ordinary lifecycle wake: a new `impl-1` handoff reports a candidate revision and checks; policy/workflow are unchanged and present in conversation. | Read the current task record and the new handoff. Reconcile the event's assignment/native identity, prior handled disposition and intended next action before scheduling verification/review. Do not reload historical reports, unchanged workflow/policy or application bodies. A wake is continuation, not intake. |
| C3. Actual compaction: the summary says “push approved,” but current delivery requires the owner's exact authorization and its source is missing from context. | Re-read the task record and its raw authorization source. Reuse the authorization if it supports the current target/action. If the source cannot be recovered and authority remains unresolved, hold that dependent action and request the specific missing authority; continue unrelated authorized work. Do not rely on the summary alone or reopen unrelated history. |
| C4. Cleanup: a worker claims completion, but its temporary worktree may contain uncommitted evidence and its session liveness is unknown. | Inspect identity, session/resource liveness, revision reachability and dirty-worktree metadata. Keep the resource until work/evidence is preserved and no pending step needs it. These checks are permitted Coordinator duties; running a build, test, formatter or diff review is still assigned technical work. |

# Correction-cycle decisions

For these cases, the consumer has not overridden the default limit of two failed completed corrections.

| Case input | Evaluator decision |
| --- | --- |
| Q1. Initial implementation writes an expected failing regression test, then encounters two additional failing test runs while making justified in-scope progress. | Zero failed correction cycles consumed. Continue implementation/diagnosis; preserve and report failures and do not claim verification passed. The count is not three, and a failing test alone does not require an Architect. |
| Q2. Blocking outcome `OUT-7` has correction A handed off, required verification still failing; correction B is later handed off and subsequent independent review finds it still blocking. | Record two unsuccessful completed attempts against `OUT-7`; remaining default budget is zero. Preserve partial work/evidence and escalate rather than assign an ordinary third correction. Route an unresolved Implementer blocker to the declared Architect before an authorized stronger-route retry. |
| Q3. After Q2, a proposal renames the assignment and worker; the second correction also introduced a regression preventing the same outcome's closure. | Keep the same unresolved `OUT-7` history, including its correction regression. Renaming does not restore budget. The next assignment must not describe the limit as two test failures or silently reset it. |
| Q4. Before any completed correction, the worker needs an owner choice or lacks a supported capability required to proceed. | Report the blocker immediately, preserve evidence/partial work and identify the decision/capability needed. Do not require two failed attempts before escalation or broaden permissions to manufacture progress. |

# Focused review decisions

| Case input | Evaluator decision |
| --- | --- |
| R1. A scroll-preservation test opens a dialog, then captures `baseline = scrollY`; after dismissal it compares against that baseline. | Finding: opening may already have reset the scroll, so this assertion cannot detect opening-time loss. Focus the opener, establish and verify nonzero scroll, capture the baseline before opening, then compare after both opening and dismissal. |
| R2. A scroll test asserts only `scrollY >= 0` after opening/dismissal. | Finding: resetting to zero passes, so the preservation requirement is unprotected. Use a nonzero established precondition and equality to the pre-action baseline. |
| R3. A public `startEngine()` test replaces the engine with a stub returning an already-muted bus, then verifies silence on “first playback.” | Finding: the double removes engine initialization and mute setup, so it proves the constructed bus's behaviour only. Exercise actual initialization, mute and first playback through the smallest public boundary exposing that path. Preserve useful doubles that do not remove that behaviour. |
| R4. A music generator promises repeatability for identical inputs/seed; the test hard-codes one composition for seed 7, with no compatibility promise. | Finding: the expected list freezes incidental seed-to-output mapping. Compare independent fresh runs with identical inputs and seed, plus independently derived musical invariants. Fixed seeds remain valid for reproducibility and case generation. |
| R5. A versioned save-file contract explicitly promises that seed 7 with given inputs recreates the same composition across supported releases; an exact fixture protects that mapping. | No finding merely because the fixture is exact or seeded. The documented compatibility mapping makes that exact expectation contractual. Verify the fixture against the documented contract rather than replacing it with weaker repeatability coverage. |
| R6. A handwritten 90-line component is rewritten as one dense line containing substantial state logic, template and styling; the project has ordinary multiline conventions. | Concrete maintainability finding: the newly compressed handwritten code obscures state transitions and structure. Restore configured formatting/ordinary multiline structure within the assigned change; line-count reduction is not simplification. |
| R7. A generated distribution asset is intentionally minified into one line by the build. | No readability finding based solely on its minification. Generated/intentionally minified artifacts are exempt; do not demand hand formatting or unit tests for formatting. |
| R8. A handwritten module uses readable multiline structure consistent with the project, but the reviewer personally prefers another brace style. | No blocking finding based on personal preference. Respect configured/project conventions. |
| R9. A scheduler promises beat spacing but leaves startup lead unspecified; a test freezes first-beat absolute time to 100 ms. | Finding: the test constrains an incidental origin. Observe the public scheduling origin and assert required relative intervals. Preserve any absolute timing that the contract actually specifies. |

# Assessment and limits

All 17 decisions are consistent with the revised guidance. The context/resumption wording permits authority recovery after actual loss while keeping ordinary wakes bounded. Metadata checks are explicitly available for cleanup. The canonical correction definition distinguishes completed handed-off attempts from command failures and preserves outcome identity. Readability and seeded-output exceptions avoid rejecting generated output or documented compatibility fixtures.

No material contradiction was found in this bounded reading and decision evaluation. No runtime, permission resolution, native continuation, installation, build, formatting check or automated technical test was performed. The report does not establish that an external consumer's waiting path is fixed.
