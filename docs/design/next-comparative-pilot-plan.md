# M1 comparative pilot and worked harness-eval plan

Independent batch 4, round 1; Architect sol-roadmap-reliability, 2026-10-11. Inspected checkout revision: 44238ee564b03fa2603058ecb1640899e8f6cf0e. This is a proposal for bounded future assignments. No implementation, native subject, measurement result or combined-plan agreement is reported.

## Authority and inspected inputs

The [assignment](../reports/roadmap-planning/assignment-batch4-reliability.md) and canonical task record at <ruach>/docs/reports/roadmap-planning/task-record.md authorize planning only. PLAN-D2 requires actual peer review, at most five rounds, then agreement or explicit arbitration. The first-round peer M1 assignment, plan and answers were not read. The [handoff](../reports/roadmap-planning/batch4-reliability.md) carries current validation and digest evidence.

Use the frozen current [roadmap](../roadmap.md), [native evidence](../native-parity.md) and [RAMEC disposition](0.4-suggestions-from-ramec-orchestration.md), not historical committed roadmap wording. Frozen copies under <planning-scratch> have these SHA-256 values:

| Input | SHA-256 |
| --- | --- |
| docs/roadmap.md | 7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957 |
| docs/native-parity.md | 248a89311316251719f8bbfc4371c5f4f2cda8bfbe6c26357118a589b781cffc |
| docs/design/0.4-suggestions-from-ramec-orchestration.md | c2487a2865f79cb15c4312144769c5eb1f16617bb71f5da2751d1a657be9bcd5 |

Prior-batches.md is navigation to closed proposals, not proof of implemented behavior. Relevant accepted plan pairs are batch 1 at 4b62d7b97d6400c4fb2a340c2466ce52d0d86f6e / 6a08b3f5fa1fb03e0b19024fcec3503d2708e64b, batch 2 at 0588d5639f52347a116aeb457c63f6d651cbf587 / 36716b46aeab878cc8737a9f980888c28b3be44e, and batch 3 at dc8a4a41657009bcb274be23ee6250402e7ebabe / 2de675bcc7bacfcbe6acc72732bd7a2b7daafb5d. Batch 3 exact-pair receipts are 44238ee564b03fa2603058ecb1640899e8f6cf0e / 7d963731694224d69aafe8ce7fd3160dccf3b34d. Relevant detailed interfaces were inspected in the canonical prior plans; no workflow bodies were loaded.

Carry forward these interfaces:

- R1: disjoint preparation may start early. Execution requires the reviewed integrated resource revision, required hosted evidence or explicit owner disposition, supported native route, actual consumer inputs and scoped account/budget/session authority. Local setup is not hosted cause evidence.
- R1/R3: assisted/unassisted describes prompts and hints; blind/non-blind/unverified describes answer accessibility. Effective source/cache/snapshot visibility and positive/negative access controls precede a blind claim. A failed separation control can leave useful ordinary non-blind native-use evidence.
- R3/R5: extend one consumer-owned task record with unchanged owner words, stable work/resource/route/report IDs, supersession and handled reports. Accepted send, activity and durable completion are different observations. No new task database or scheduler.
- R6/R7: preserve candidate/tested/reviewed/delivered/evidence-only revisions, full verifier status and failed evidence. Independent exact combined review and current target/authority precede separately assigned delivery. Consumer flake policies are bounded and named; no global retry or test weakening.
- C1–C5: choose proportionate direct/compact/full use. C3 needs reproduction, supported cause, scoped regression/fix and original retest. M1 fixtures do not close the real-project C1/C4/C5 demonstrations. Optional C2/Gemini proof and catalog expansion are not prerequisites.
- Shared ownership lineage is R3-B → R-IN → B2-IN → C-IN. Prior shared phases and later evidence updates remain explicitly serialized. M-IN extends this lineage for M1; it does not reopen the accepted decisions.

## Existing mechanism and limits

Use [ruach-harness-eval](../../skills/ruach-harness-eval/SKILL.md), its [configuration contract](../../skills/ruach-harness-eval/references/config.md), acceptance/scope scripts and [tests](../../skills/ruach-harness-eval/tests/eval.test.ts). They check one supplied candidate; they neither launch subjects nor establish model use. Schema version 1 rejects unknown fields. Do not add usage, permissions, assistance, billing or human grades to its configuration. Its optional evidence paths are hashed references; model_use_verified remains false even after a real native run.

Verified constraints: acceptance requires actual HEAD equal to candidate before checks and records cleanliness and revision movement; scope compares named commits but separately observes current HEAD. Output files must be new, outside the worktree and both Git directories, with existing parents. Checks use argv without shell interpretation but inherit their environment and can write; they are trusted evaluator programs, not a sandbox. Signals, timeouts and output overflow cannot satisfy a negative-exit expectation. Git overrides are scrubbed for internal probes, not for intentional check environments. Hidden index flags and tracked filter attributes fail closed. Git configuration/stat state/attributes/excludes and the selected Git, Bun and scripts remain trusted; no hostile-candidate certification.

Public tests establish useful controls for equivalent fingerprints, retained failures, candidate mismatch/movement, dirty writes, strict configuration, exclusive output, protected paths, hidden index flags and filters. They are not native execution receipts. Current [direct/compact/full guidance](../examples/direct-compact-full.md) and [assignment specimen](../examples/assignment-specimen.md) supply the consumer pattern. The [Librarian packet](../../evals/ruach-librarian/README.md) supplies the neighboring input/rubric separation pattern; its results do not grade this pilot.

## Bounded protocol

Prepare one small case from each family; freeze selection and grading before any subject returns. Prefer an owner-authorized, sanitizable real project snapshot. If unavailable, use a clearly labeled representative TypeScript/Bun fixture. A synthetic result supports that fixture only. Both arms and repetitions receive identical raw task bytes, initial project guidance, repository tree, public tests, tool versions and expected product contract. Preserve the actual Git base object and tree digest, not just a textual fixture description.

| Family | Select and expose to subject | Hidden grading and contrasting control |
| --- | --- | --- |
| Bugfix | One public-boundary defect with independently demonstrated baseline failure and intended contract; bounded source/test ownership. A date/range or parser defect is suitable, but do not reuse a public solved example verbatim. | Boundary/invalid-input regression cases plus unaffected behavior; original failure rerun. A plausible incomplete fix must fail, an independently prepared valid alternative must pass. |
| Multi-component feature | One concrete user outcome crossing two existing components, such as storage plus presentation/API; explicit allowed files and compatibility requirements. No speculative platform redesign. | Exercise the complete path, persistence/round-trip/error behavior and old contract. A change to one component alone must fail; avoid asserting a preferred implementation. |
| Refactor | One bounded internal restructuring with specified public invariants and an inspectable maintainability outcome. Baseline tests already pass. | Preserve semantics on ordinary and boundary inputs, public API and protected files. No exact patch/string matching. A no-op may pass behavior checks but must fail the separately reviewed requested restructuring outcome. |

Reject cases requiring unavailable tools, secret production state, unspecified behavior, uncontrolled network, many hours of work or permissions different between arms. Record excluded cases and reasons before results; do not replace an inconvenient failing case afterward. The packet Reviewer checks task validity, check coverage and alternative correct implementations independently.

Primary comparison: native tools plus the project's actual guidance versus native tools plus Ruach's declared roles/skills and proportionate workflow. Use one R1-proven harness and the same explicit model, effort, permission profile, runtime/build tools, machine class and starting resource conditions for every participant in both arms. Treat model defaults as insufficient evidence. Ruach may use more workers; all use the fixed primary model/effort and equivalent effective grants. The baseline retains ordinary native capabilities and valid project instructions. Record both arms' available tools and any unavoidable difference; unmatched effective permissions or routes prevent a controlled-primary claim.

Choose direct/compact/full from task risk before execution, using the same product acceptance and independent evaluator requirements for both arms. Record task-internal review as part of the treatment; external evaluation is a common separate cost. A route that adds workers solely because the case is being measured would confound the pilot. Later, separately authorized heterogeneous role/model routes can compare whole systems; declare every route and do not attribute their differences solely to Ruach guidance.

Proposed initial repeat budget: two paired repetitions per family, twelve native task attempts total, subject to owner authorization. For each family run native/Ruach then Ruach/native; freeze the family order and schedule before results. Use fresh sessions and independent fresh worktrees at the same case base each time. No previous candidate, report, rubric, reviewer hints or other-arm transcript enters a subject. A single worked pair is a smoke/example, not completion of repeated M1 coverage. Extra repetitions need a named reason and budget; stop rules are decided before results.

Classify each actual brief separately: unassisted contains no role/skill/route hint; assisted contains such hints or later intervention. Keep the unchanged raw task separate from launch instructions and record both digests. The Ruach arm may intentionally be assisted; do not conflate assistance with hiding expected answers or advertise such a pair as an unassisted discovery experiment. A corrected/hinted attempt gets a new ID and retains its earlier failed attempt.

Record answer access independently as blind, non-blind or unverified. Withhold expected rubrics, solved examples, other cases/outputs, analysis and launch advice from a blind subject. Public packets and full native plugin caches can expose developer answers: inventory canonical source, plugin/cache, parent context, add-dir, snapshots and aliases under actual effective permissions. Require a successful allowed-task/resource read with matching digest and failed harmless excluded-marker reads; the independent Reviewer inspects these controls and resource equivalence. Do not replace the native route with a cropped skill and call it equivalent. If separation cannot be demonstrated, label the run honestly and retain it only in an owner-approved non-blind stratum. Actual held-out facts and correct-action topology must differ from public solved material; cosmetic renaming is inadequate. Keep private run-specific grading inputs in the approved evaluator store, referenced by digest, never in the subject checkout.

## Measurements and peer seam

The consumer task record holds the run/task/family/repetition/arm IDs, base/source/resource/checker revisions, model/effort, tool versions, assistance and answer-access labels, subject grants and exact participant session membership. Use a small Markdown definition table and existing native outputs; no broad new schema/runtime. Both actual closed round-2 reviews accept M-I-01–05, subject to the named CI/polling corrections and exact revised-pair review. This is interface acceptance, not final pair agreement or approval of future native definitions/results.

| Accepted seam | Writer and required join/gate |
| --- | --- |
| M-I-01 | Pilot owns case/variant/attempt/run membership, base/candidate/resource/checker/raw-task and launch-brief digests, effective model/effort/grants and route authority, task/phase timestamps, outcomes/interventions and raw-evidence inventory. Measurement reads the frozen manifest; it does not rewrite pilot outcomes. |
| M-I-02 | Peer M-U0 owns definitions/fixtures; proposed M-U1 owns scripts/session-usage.ts and tests/session-usage.test.ts. M-UE alone owns canonical sanitized docs/reports/m1/usage/<run>/{usage.json,report.md} and allocated private receipts. Pilot owns docs/reports/m1/evidence/<run-id>/native/**, evaluation/** and its comparative reports. Join immutable results by explicit run/attempt ID plus definition/resource/producer revisions. M-E may independently rerun the exact reviewed producer only in allocated scratch/evaluation scope; it cannot overwrite M-UE results. |
| M-I-03 | Independently accepted definitions, actual native-format support and exact producer candidate precede pilot execution. Coordinator discovers any supplied historical analyzer/source predecessor and resolves actual file/CLI ownership before assignment; proposed new paths are not implemented evidence. Missing original cohort prevents historical remeasurement, not disjoint preparation. R1/resources/access and scoped budget/session/tool/data authority remain additional gates. |
| M-I-04 | Keep assisted/unassisted separate from blind/non-blind/unverified, with actual native-resource equivalence/access controls, route overrides through R3 and failed attempts retained. Checker model_use_verified remains false. Usage does not certify quality, authority, native model identity or billing. |
| M-I-05 | M-IN alone writes shared roots/CI after actual accepted C-IN lineage and named accepted pilot/measurement/Librarian definition/source inputs and reviews; refresh/preserve prior entries, full-union checks and exact independent review. Missing predecessor gates shared mutation only. CI scope and conditional shared tests are explicit below. |

The peer exclusively implements measurement/Librarian files. Its proposed analyzer CLI is bun scripts/session-usage.ts --manifest <private-manifest.json> --out <fresh-absolute-private-json>; instantiate it only after accepted definitions/source/format and producer review, using the Coordinator-supplied actual candidate. No duplicate analyzer, broad schema or private transcript intake is authorized here. Existing source paths and original audit cohort remain factual discovery inputs, not presumed available evidence.

Required definition inputs for that agreement:

| Value | Required semantics for pilot consumption |
| --- | --- |
| Session membership | Explicit root and all delegated worker sessions for one attempt; selected session-start interval in UTC with end excluded. Fresh sessions are preferred. Pre-window persistent sessions, late children and missing logs require explicit coverage disposition. Never count overlapping membership twice. |
| Native usage | Deduplicate Claude message.id according to the producer's reviewed definition; keep uncached input, cache reads, any separately reported cache creation and output distinct. State whether a native input total includes cached values before calculating any derived total. Unsupported/missing values are unavailable, not zero. |
| Waiting/activity | Total waiting calls, initial/repeat polls and other checks have separate definitions and source examples; sums must reconcile. Classify by evidenced pending target/context, not executable name. Contrast the same Git/search/approval tool in ordinary inspection versus repeated unchanged pending-work/report/approval observation; ambiguity remains unclassified. State change/disposition/target ends the episode. Keep blocking waits/wakes separate and actual approval triggers deduplicated. Distinguish a lifecycle wake from a handled report. Do not reuse historically overstated totals or infer time savings from call counts. |
| Approvals/interventions | Producer classifies observed approval triggers with its declared taxonomy. Pilot evaluator separately logs human clarifications, repairs, route hints and retries with timestamps/reasons; routine role messages are not human intervention. A request, permission grant and task authority remain distinct. |
| Provenance/coverage | Analyzer revision, invocation, native format/tool version, input digests, selection window, included/excluded participants and warnings. Sanitized aliases map to private sources; no personal log glob or credential dump. |

Report available usage across all workers, including Coordinator and task-internal reviewers. Missing one worker prevents an unqualified total. Keep unknown counts and partial coverage visible. Native context counters or token usage are not account charges. Do not derive dollars or savings without authorized actual billing evidence and a reviewed allocation; this pilot proposes none. Gemini support remains conditional on actual availability and reviewed producer definitions.

Measure end-to-end task time from accepted task assignment to the final required candidate/handoff and task-internal review result, including launches, reading, waits, corrections and required task verification. Keep human blocked intervals and environment/setup delays in elapsed time with categories. Timeout/abandonment records elapsed duration and unaccepted status, not a successful completion time. Record cold install/setup separately and present first-use total as setup plus task time; report warm attempts separately rather than hide first-use cost. External grader/checker and human assessment durations are recorded separately for each arm. Parallel worker durations are not added to compute wall time.

## Outcomes and decision rules

The human assessor compares actual candidates against the frozen contract, with checker evidence as supporting input. Record accepted outcome, regressions, scope/protected-file violations, unsupported verification claims/false evidence, human interventions and unresolved defects separately. A checker pass is neither human acceptance nor proof that a task was performed well. An LLM Reviewer may supply findings, but cannot stand in for a claimed actual human comparison. If the human assessor is unavailable, that completion condition stays held.

For each family/arm present denominators, successes/failures/incomplete attempts, min/median/max elapsed time for completed tasks, and observed usage ranges with coverage. Retain timeout durations as censored observations, not successful time samples. Show all original and corrected attempts. With two repeats these are descriptive ranges, not statistical significance or a population savings estimate. Environment blocks and consumer-registered flakes preserve their original verifier status and bounded retry evidence; they are not silently removed from results.

Before execution, the owner supplies acceptable time/intervention/usage overhead bands for the three families and any non-negotiable quality requirements. Retain a level of orchestration where repeated actual quality/review benefits or fewer interventions meet those bands. Narrow to direct/compact use where full orchestration adds overhead without an observed benefit, or where benefits appear only for cross-component work. Recommend dropping a path where it repeatedly misses the agreed bands without sufficient quality benefit. A protected-file/authority violation or false evidence is a correction hold, never averaged away by speed. Conflicting or incomplete evidence yields an inconclusive recommendation and a bounded next question; it does not manufacture a winner. Recommendations do not adopt an owner decision or authorize a release.

## One worked native/checker/human pair

Use the first bugfix pair to produce the worked example. One named Ruach attempt must include actual native execution and an actual candidate; its native counterpart provides the human comparison. The repeated pilot later adds the other cases/repeats. Preconditions are R1 execution readiness, reviewed packet and resources, accepted minimal usage definitions/available producer, owner-selected project/case, independent human assessor and explicit native/account/budget/permission scope. No such run occurs during planning or offline preparation.

1. Coordinator freezes raw task, allowed/protected paths, case base B, public tests and private grading inputs/controls. Record source/checker/packet/producer commits. Independently review trusted checker argv, executables, effective environment and ordinary Git configuration/attributes/excludes/stat assumptions. Use approved private temporary/consumer stores outside worktrees and Git metadata; do not expose secrets or claim adversarial certification.
2. Arrange each native attempt through the existing supported consumer mechanism. Retain actual invocation/launch receipt, installed role/skill/source digests, session IDs, model/effort observations, accepted assignment, activity/turn evidence, grants and all participant logs/digests. Native UI/log observations can corroborate the declared route; absent fields remain unverified. Neither a metadata declaration nor a checker output proves the provider's internal model identity.
3. At handoff record actual original checkout HEAD, branch, status, diff, candidate C and native report. Preserve a dirty/failed/abandoned result before any correction. Never reset/stash it to make the attempt clean. An evaluator may create a fresh detached verification worktree at C for checks, retaining original checkout evidence and identifying which checkout each observation covers; this cannot erase an original cleanliness failure.
4. Instantiate acceptance version 1 below with resolved absolute trusted executable/grader paths and actual B/C/session values. The assignment field points to the identical neutral raw task for both arms; hinted launch briefs are separate native evidence. Use the same acceptance definition/check order across arms. If optional copied fixtures contain changed candidate bytes/modes, fingerprints legitimately differ; record why rather than force equivalence. The worked example needs no copied fixtures.
5. Run acceptance and initial scope once per actual candidate. Capture structured stdout, stderr and full exit code; use different new output paths for every failure/correction. No checker mutates refs by design; inspected supplied check programs must also keep candidate state unchanged. Check-created files/caches belong to allocated external scratch. A mutation/timeout/overflow/zero meaningful tests is not a pass.
6. Independent Reviewer inspects exact C, original scope, all recorded checks/native receipts and false claims. Record reviewed_revision only after this review. A repaired candidate requires fresh affected checks and review. After a positive review, final scope may join acceptance and initial scope using schema-v1 evidence fields; negative evidence remains separately retained, never relabeled positive.
7. An actual independent human assessor records contract acceptance and pair comparison with evidence references and uncertainty. Hide arm labels from the assessor where feasible; disclose revealing diffs and actual assessor blindness separately from subject answer access. Record scoring before discussion/hints. Capture peer-producer usage with its exact accepted CLI and coverage, then assemble sanitized worked evidence. The evaluator attributes human words; it does not invent them.

Acceptance template (substitute every angle-bracket value; future prepared files, not existing execution evidence):

~~~json
{
  "schema_version": 1,
  "task": "m1-bugfix",
  "assignment": "<absolute-private-root>/raw-task.md",
  "acceptance": {
    "checks": [
      {"id": "public-and-regression", "argv": ["<absolute-bun>", "<absolute-grader>/hidden-checks.ts", "--repo", "{repo}", "--case", "bugfix", "--checks", "public"], "cwd": "{foreign_cwd}", "timeout_ms": 300000, "expect": {"exit": 0}},
      {"id": "held-out-contract", "argv": ["<absolute-bun>", "<absolute-grader>/hidden-checks.ts", "--repo", "{repo}", "--case", "bugfix", "--checks", "hidden"], "cwd": "{foreign_cwd}", "timeout_ms": 300000, "expect": {"exit": 0}}
    ]
  },
  "runs": [{"id": "bugfix-ruach-r1", "repo": "<verification-worktree>", "candidate": "<actual-C>", "kind": "<actual-native-harness>", "model": "<declared-model>", "effort": "<declared-effort>", "evidence": ["<absolute-private-root>/native-receipt.md"]}]
}
~~~

M-P prepares this small trusted grading script, not a model runner. It consumes the selected prepared private case, invokes actual public checks and hidden behavior assertions, rejects missing/zero checks, bounds subprocesses, retains their exits, returns nonzero for any failed contract, and reads candidate code without changing it. Alternative correct implementations must pass. Public versus hidden selectors do not grant subjects rubric access. Use accepted runtime versions; inspect any environment variables before executing untrusted project commands under the approved scope.

Initial scope template:

~~~json
{"schema_version":1,"paths":["<actual-owned-source-file>","<actual-owned-regression-file>"],"protected_paths":["<actual-protected-file>"],"require_clean":true,"task":"m1-bugfix","run":"bugfix-ruach-r1"}
~~~

Allowed files are expanded to actual paths before launch; prefixes only when explicitly authorized, ending in /. Canonical_files can add baseline/candidate/worktree byte equality for named protected guidance. expected_tree_paths is optional only when a complete frozen tree is meaningful. Do not constrain a detached verification worktree to the subject's branch; record/check that original branch separately. Set technical_paths only together with a real reviewed_revision. For final scope, add reviewed_revision=C, actual technical_paths, and evidence with acceptance=acceptance-01.json and scope=scope-01.json; relative evidence paths resolve from the scope configuration directory. Final positive joins require the same task/run/B/C and positive underlying records.

Exact existing checker invocations, with environment variables filled by the evaluator and directories already allocated:

~~~sh
git --no-replace-objects -C "$M1_VERIFY" rev-parse --verify HEAD
bun "$M1_SOURCE/skills/ruach-harness-eval/scripts/acceptance.ts" --config "$M1_EVIDENCE/acceptance-config.json" --run bugfix-ruach-r1 --output "$M1_EVIDENCE/acceptance-01.json"
bun "$M1_SOURCE/skills/ruach-harness-eval/scripts/scope-check.ts" --repo "$M1_VERIFY" --baseline "$M1_BASE" --candidate "$M1_CANDIDATE" --allow "$M1_EVIDENCE/scope-initial.json" --output "$M1_EVIDENCE/scope-01.json"
bun "$M1_SOURCE/skills/ruach-harness-eval/scripts/scope-check.ts" --repo "$M1_VERIFY" --baseline "$M1_BASE" --candidate "$M1_CANDIDATE" --allow "$M1_EVIDENCE/scope-reviewed.json" --output "$M1_EVIDENCE/scope-reviewed-01.json"
~~~

Run each separately and retain its own exit, including exit 1/2. The last command is conditional on actual positive review/evidence, not automatic after the first two. Compare HEAD explicitly with C: scope alone permits an observed different HEAD. Filter/hidden-index setup errors remain held or use a separately reviewed alternative method; never clear evidence flags in the original checkout to assert cleanliness.

Worked evidence inventory: raw-task and full-brief hashes; pristine base/tree and protected-file hashes; private control/check definitions plus provenance/digests; installed source/role/skill/checker/producer revisions; native receipts and participant membership; permissions/access controls; original checkout state and candidate/diff; acceptance/scope configs/results with exits; independent exact candidate review; actual human pair notes; time/usage/coverage/intervention table; all failures and corrections; limitations. Durable public evidence contains sanitized summaries and digests with owner-approved retained private references, not credentials, personal home paths or raw private transcripts. Acceptance JSON still says model_use_verified=false. Completion requires all four actual layers: native receipt, candidate, checker evidence, human comparison.

## Future units and file ownership

Coordinator resolves actual current source/base/input SHAs and checks changed contracts before each assignment. Never reset to this planning HEAD blindly. Use fresh independent branches/worktrees; inspect existing worktrees/branch names and choose an unused suffix. All below are future scopes; report/assignment paths must be filled explicitly before launch.

| Unit and role | Exact owned files | Dependencies, steps and acceptance |
| --- | --- | --- |
| M-P preparation / Implementer | New evals/ruach-comparative-pilot/README.md, protocol.md, prepare.ts, tsconfig.json, tests/prepare.test.ts; cases/bugfix/**, cases/feature/**, cases/refactor/**; expected/rubric.md, expected/hidden-checks.ts, expected/controls/**. No other source/tests/docs. Plus docs/assignments/m1/preparation.md unchanged and docs/reports/m1/preparation.md. | May prepare offline before R1/usage work. Build three bounded TS/Bun Git fixtures, neutral tasks, trusted grade controls and deterministic fresh preparation. Output pristine/subject/grader/evidence views with digests, no existing-output overwrite. Baseline bugfix fails the intended regression; baseline feature lacks outcome; baseline refactor has expected old structure. Independently valid alternatives pass; incomplete/forbidden changes fail the appropriate behavior/scope/human controls. No model execution/grades. |
| M-R packet review / Reviewer | docs/assignments/m1/packet-review.md unchanged; docs/reports/m1/packet-review.md only. | Exact M-P candidate and raw fixtures/check controls; inspect ownership, real objects, fairness, check safety, zero-check rejection, leakage and actual native access feasibility. Reproduce assigned offline controls/checks; return findings, reviewed_revision and specific readiness. No source fixes/subject launches/workflow bodies. |
| Peer measurement/Librarian / assigned existing roles | Their actual script/tests/eval files discovered and named by Coordinator before assignment; never the pilot subtree or shared roots by inference. | Supply accepted producer revision, exact invocation/output examples and minimal definitions/coverage to M-P protocol and M-X. Pilot reports proposals; any overlapping file request needs a bounded ownership amendment. No synthetic Librarian outcome reused as comparative pilot outcome. |
| M-X run arrangement / authorized consumer Coordinator, then existing native task roles | Consumer-owned task record and per-attempt assignments/outputs/source/test scopes only as named. Sanitized Ruach evidence if assigned: docs/reports/m1/evidence/<run-id>/native/**. | Accepted packet/resources and R1 gates, matched routes/grants, minimal definitions/producer, case/budget/stop rules and human availability. Coordinator arranges fresh subjects; each subject changes only assigned case files/report. Actual outputs and failures retained. Coordinator alone owns resource allocation/release; no new launch runtime. |
| M-E independent evaluator / Reviewer; actual human assessor supplies separate input | docs/assignments/m1/evaluation-<run-id>.md unchanged; docs/reports/m1/evaluation-<run-id>.md; docs/reports/m1/evidence/<run-id>/evaluation/** and explicitly allocated private grading scratch. | Actual closed native output/C, frozen rubric/checks and peer producer. Run trusted acceptance/scope on recorded exact C, inspect native versus declared claims, consume actual human notes, report coverage/failures. No product fixes, worker coordination, invented human judgment or delivery. |
| M-A synthesis / Architect | docs/assignments/m1/analysis.md unchanged; docs/reports/m1/analysis.md only. | Closed independent evaluation/human results for the declared attempt set; compare ranges/outcomes, distinguish strata, recommend retain/narrow/drop or inconclusive against owner bands. Do not adopt owner decisions. |
| M-IN shared integration / Implementer | Only named accepted unit-file union for bounded integration conflicts; sole shared README.md, docs/roadmap.md, docs/operations.md, docs/regression-cases.md, CHANGELOG.md; tests/docs-consistency.test.ts only if a demonstrated shared-doc invariant requires it and Coordinator explicitly names its bounded scope in the integration assignment/amendment. .github/workflows/ci.yml only for accepted comparative-pilot and Librarian packet tests/local pinned typechecks; analyzer remains covered by existing root recipes. No catalog/version/role/export/root-package edits proposed. Own docs/assignments/m1/integration.md unchanged and docs/reports/m1/integration.md. | Shared phase waits for accepted C-IN/prior shared-doc lineage and named accepted pilot/measurement/Librarian definition/source inputs and reviews. Refresh/preserve prior entries and peer results; one active root-doc writer. Record actual predecessor/input SHAs. Full union verification and independent exact combined review, followed only by separately authorized delivery. Later measurement-result doc updates are another serialized M-IN phase; no wait for unrelated native outcomes for disjoint packet prep. |

M-IN's common sole-root-metadata/docs/catalog ownership remains binding; this plan requests no catalog expansion or root metadata change. If implementation discovers a necessary shared script/config/metadata edit outside the listed scope, report location, reason and bounded amendment before changing it. Peer feature units do not gain root ownership. A missing predecessor holds the dependent shared phase, not unrelated offline preparation. M-P may record a proposed shared entry in its handoff but cannot edit the root roadmap/CHANGELOG itself.

## Verification, bases and resource bounds

All commands here are proposed future checks. Before assigning: resolve commits with git --no-replace-objects rev-parse --verify --end-of-options '<base>^{commit}', inspect git worktree list --porcelain and relevant base-to-current diff; then Coordinator supplies a fresh branch such as ruach/m1-packet-<suffix> and an explicit workspace. No branch replacement/deletion, force reset or inherited future authority. Cases use fixture-only Git identity and independent real repositories; record their actual SHAs.

M-P and M-R run these on the exact packet candidate from the source root:

~~~sh
just check
bun run test
just release-check
bun test --timeout 30000 evals/ruach-comparative-pilot/tests
./node_modules/.bin/tsc --project evals/ruach-comparative-pilot/tsconfig.json
bun evals/ruach-comparative-pilot/prepare.ts --out "$M1_FRESH_TEMP_ROOT"
bun <ruach>/skills/ruach-handoff/scripts/validate.ts docs/reports/m1/preparation.md --repo "$M1_SOURCE"
git diff --check
~~~

The packet tsconfig includes all local TypeScript using the pinned root compiler/config, never hides missing checks through a root-config edit. The proposed preparation CLI accepts only --out with a fresh absolute root and --help; tests exercise argv/exit/files, deterministic raw bytes/Git objects, invalid/missing paths, symlinks/overlap/overwrite refusal, protected-state preservation and meaningful positive/negative grade controls. Scrub inherited Git overrides for fixture operations; bounded test subprocesses may clean up only their own temporary resources. The trusted grader's proposed CLI is exactly the --repo/--case/--checks interface in the worked template, with invalid/empty selections failing. Keep all helpers in this packet, no undeclared repository runtime imports or dependency changes.

Validate the Reviewer/evaluator's own named handoff similarly; no worker fills another's success. M-R exercises the existing harness-eval suite from its skill directory and invokes both checker CLIs against prepared valid and invalid candidates, retaining exits/new evidence outside the candidate. Do not require native execution for packet acceptance. If nested/root pinned dependencies are absent, record setup and apply only already-authorized frozen-lockfile remediation in the appropriate directory; no global installs or changed locks. M-IN adds the accepted comparative-pilot test/typecheck commands above and accepted Librarian commands (bun test --timeout 30000 evals/ruach-librarian/tests and ./node_modules/.bin/tsc --project evals/ruach-librarian/tsconfig.json) to existing CI, preserving pinned tools/permissions/checks. Existing root tests/typecheck already cover the proposed analyzer; do not duplicate those CI steps. Full-union verification includes root checks, all affected packet/producer checks and harness-eval controls. A hosted green run or explicit owner disposition is separate recorded evidence, not inferred from local checks. Changed resource/check definitions require affected checks and fresh independent review.

Allowed offline resources: assigned source worktree and OS temporary directories, local Git/Bun/Just/pinned compiler, fixture-only objects, local owned commits, bounded own verification subprocesses. No account/native/model/API calls, production corpus, browser/audio/database/port/profile allocation or global harness settings are implied. Evaluation assignments later name the exact account/budget/route/grants, private retention locations and Coordinator-owned resource release. Native workers never coordinate peer launches. Reviewers do not fix source; broad scope/contract conflicts return with evidence for bounded reassignment.

Delivery is a separate Implementer assignment after exact combined candidate review, recorded target state and reused still-valid delivery authority. Retained branch/diff/report is a valid requested outcome. Tested/reviewed technical revisions remain distinct from later report-only commits. This planning commit performs no merge, push, release or cleanup of retained sessions.

## Copyable first preparation assignment

~~~text
Role: Implementer. Task: M1-P. Source workspace/branch: <fresh assigned worktree>,
ruach/m1-packet-<unused suffix>, based on <Coordinator-resolved current source SHA>.
Inputs: accepted M1 plan/protocol revision, current source contracts and frozen
roadmap M1 requirement. R1 native closure and peer analyzer implementation are
not prerequisites to this offline preparation. Record actual input revisions.

Outcome: one repeatable, fair, bounded TS/Bun packet for bugfix, multi-component
feature and refactor, plus worked checker recipe; no native/model subject runs.
Scope: exactly M-P paths in this plan and unchanged assigned preparation.md/report.
Create the local tsconfig/pinned typecheck and CLI/tests; no shared root edits,
catalog, skills, routing, dependencies, owner-input, peer script or workflow edits.

Steps: inspect existing acceptance/scope contracts and task specimens; select
three small contract-valid cases; build actual isolated Git bases and neutral
raw tasks. Create a fresh-output-only --out preparation CLI separating pristine,
subject, grader and evidence views. Keep public examples and actual held-out facts
distinct; expected material is grader-only input. Build trusted --repo/--case/
--checks grading controls with zero/missing checks failing. Freeze rubrics before
subject outputs; valid alternatives pass, plausible incomplete changes fail.
Document matched-route/repeat plan, all-failure retention, time definitions and
proposed minimal usage seam for peer review. Propose shared entries in report only.

Give future subjects: only unchanged raw task/project guidance, their isolated
case repo/public tests and assigned installed role/technical resources; an
authorized Coordinator alone receives its selected workflow. Withhold this plan,
packet README/protocol, expected/, private graders/controls, other cases/runs and
solved reports. Inventory native cache/source visibility; never claim blindness
from a file-copy layout. No workflow-body inspection by this worker.

Acceptance: all three cases have real bases/digests/explicit scopes; independent
contract checks distinguish valid/invalid implementations; fixture public-boundary
tests protect originals and reject unsafe/existing outputs. No runtime service,
paid execution, measurement result, human grade or current R1 completion claimed.
Verification: run the M-P commands in this plan; record full exits, setup gaps,
actual source/fixture hashes and controls, not just selected successful excerpts.
Offline resources only as stated; no network/global changes/other-session cleanup.
If outside-scope work is necessary, report exact evidence/requested ownership
amendment before dependent edits. Commit only owned files and assigned unchanged
assignment with docs/reports/m1/preparation.md; validate using source handoff
validator --repo. Return creating SHA and holds for independent packet review.
Do not integrate, deliver, launch subjects or release task-native resources.
~~~

## Copyable independent review and evaluation assignments

~~~text
Role: Reviewer. Task: M1-R. Fresh worktree: <exact packet candidate SHA>; baseline
and input/fixture revisions supplied by Coordinator. Own unchanged packet-review
assignment and docs/reports/m1/packet-review.md only. Do not fix packet/source.

Read raw tasks, fixtures, expected rubrics/controls, checker implementation/config
contract and actual Implementer checks. Review fairness, positive/negative control
validity, alternative correct solutions, scope and trusted argv/environment/Git
boundary. Inspect source/cache/snapshot answer exposure and proposed actual access
controls. Require held-out case facts/topology distinct from accessible solutions.
Read technical resources and workflow frontmatter/packaging only; request separate
Coordinator compatibility observations rather than load workflow bodies.
Run M-P verification plus the existing harness-eval suite and actual checker
controls in isolated scratch. Keep failed exits/evidence; static pass does not
establish native execution or human comparison. Reject model-use or billing claims
derived from checker JSON. Verify local compiler/CI ownership proposals and peer
usage seam's pending/accepted status. Report consequential findings or readiness
with reviewed_revision and remaining execution holds. Validate --repo and commit
only assigned report/unchanged assignment. No subjects, integration or delivery.
~~~

~~~text
Role: Reviewer/evaluator. Task: M1-E-<run>. Assigned AFTER native reports close.
Fresh workspace: <actual C>; baseline B, packet/checker/resource/producer revisions,
private grader paths, actual native evidence, human assessor input and accepted
measurement definitions supplied explicitly. Own only the M-E assignment/report
and named evaluation evidence; original task outputs/native evidence are read-only.

Independently check raw/native task digests, all participant membership, actual
original HEAD/status, route/grants/access controls and candidate identity. Keep
assistance and answer-access labels separate. Inspect trusted Git configuration
and check argv/environment assumptions. Execute the worked acceptance/scope
commands on exact C in allocated scratch; preserve all exit 1/2 and correction
records. Review exact C without fixes; positive final evidence join requires actual
positive review/underlying records. Reference M-UE's immutable canonical sanitized
usage/report by run/attempt and definition/resource/producer revisions. Independently
rerun the exact reviewed peer producer only in explicitly allocated scratch/evaluation
scope; never write M-UE paths. Record dedup/selection/coverage gaps, cached/uncached
separation and all-worker inclusion. Require reviewed target/context polling controls,
including same-tool ordinary versus repeated pending observation and unclassified
ambiguity. No guessed billing or provider/model proof.
Consume and attribute actual independent human comparison against frozen rubrics;
if absent, keep human completion held. No invented human outcome or metric.
Record accepted/regressed/scope/false-evidence/intervention/time/usage observations
separately, including failed/abandoned attempts. Validate report --repo with actual
revisions and commit only owned assigned artifacts. Return SHA/readiness/holds.
Do not coordinate subjects, fix products, settle owner bands or deliver/clean up.
~~~

## Readiness and remaining decisions

Ready for independent peer review, then bounded offline M-P assignment once the pair agrees or records arbitration. The first preparation unit is concrete; no need to wait for unrelated paid/native outcomes. Before execution, settle with the peer only the minimal usage semantics, discovered producer paths/CLI and explicit all-worker coverage. Case/project, matched harness/route, overhead bands, account/budget/grants, effective answer exclusion, exact integrated resources/R1 evidence and actual human participation remain future named inputs.

D1 evidence: record actual install/cache/resource bytes, dependency setup and overhead/exposure; do not choose packaging. D2 evidence: identify actual supported adapter/native composition used; any future export needs separately authorized generated-source/staleness checks and no incidental configuration writes. D3 evidence: record existing project conventions and opt-in guidance/knowledge provenance; project authority wins, no mandatory hierarchy/global changes. Parked profiles/domain roles/measurement workflows and new catalogs remain parked.

No measurement, API charge, quality gain, savings, hosted/native/behavior completion, implementation acceptance or final agreement is claimed. Commit only the owned plan, concise validated handoff and unchanged assignment, then wait for actual peer review.
