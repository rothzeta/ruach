# Next release: evidence and reliability plan

Status: proposed, ready for bounded diagnostic assignment; implementation and live runs are future work. Architect assignment: [assignment-reliability.md](../reports/roadmap-planning/assignment-reliability.md). Inspected source base: `d75039aa7b82b262e2f28af08630258fb7f77180`, 2026-10-11. This plan does not authorize implementation, paid sessions, publication or packaging changes.

Batch 1 correction round 3 follows [its assignment](../reports/roadmap-planning/assignment-batch1-round3-reliability.md) and both closed round-2 reports. Correction source HEAD: `d4ffa4b5eca92b54dfecfc8f48a10243fd8db66b`. Accepted dispositions are recorded in [round-3 handoff](../reports/roadmap-planning/batch1-round3-reliability.md). The owner's sequential batches with up to five agreement rounds supersede the original one-correction-round limit. These own-plan corrections await exact revised-pair review; they do not certify the peer's revised plan or start the next batch.

## Authority and inputs

The current planning inputs are [roadmap.md](../roadmap.md), [native-parity.md](../native-parity.md), and [RAMEC suggestions](0.4-suggestions-from-ramec-orchestration.md). Their frozen 2026-10-11 copies supplied by the assignment were read instead of the older worktree versions. The frozen roadmap SHA-256 matches `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`. Canonical paths above identify the documents; their old worktree text is not the planning authority. Before launching workers, the Coordinator must supply those approved document bytes or their eventual committed revision alongside the current source revision.

Binding scope is R1 and R2. R3 is a separate Architect's responsibility. Source ownership follows [ADR-0001](../adr/0001-source-and-consumer-ownership.md); reusable changes belong in canonical `agents/` and `skills/`, while generated consumer installations stay generated. Follow [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [assignment specimen](../examples/assignment-specimen.md). No workflow bodies were loaded for this assignment. No new scheduler, package manager, task database, role, route switching or broad content-hashing design is proposed.

## Evidence, hypotheses and decisions

### Verified current source and local observations

| Area | Observation and evidence | Consequence |
| --- | --- | --- |
| Hosted gate definition | [ci.yml](../../.github/workflows/ci.yml) runs on main pushes and PRs, Ubuntu 24.04, 30-minute job bound, Bun 1.4.2 and Just 1.40.0. It runs frozen installs, `just check`, release metadata, root/skill audits, then `just test`. Credentials are not persisted. | A failure in the final step requires suite/test identification; preceding steps alone cannot establish test success. |
| Local recipes | [justfile](../../justfile) runs root tests, handoff, Herdr with `--timeout 30000`, harness-eval and changelog sequentially. [package.json](../../package.json) root tests run only `./tests` with a 30-second default. [tsconfig.json](../../tsconfig.json) has `noEmit`. | Root testing alone omits skill suites. Historical five-second Herdr failures are a hypothesis, not the current default timeout. |
| Current planner toolchain | Bun 1.4.2, Just 1.40.0, Git 2.47.3. Nested dependencies are absent in this worktree; the canonical source handoff validator has installed dependencies. | Planner checks can validate docs/report; a complete local gate needs worktree-local frozen dependencies. |
| Planner checks at inspected base | `just check` resource/link portion passed; typecheck exited 1 with missing `yaml`/`ajv` and related typing errors. `just release-check` passed. `bun run test` exited 1: 81 pass, 9 fail; failures are typecheck and dependency-dependent offline routing/README cases. | These are observed setup failures, not an established hosted CI cause. No checks were weakened. |
| Dependency-free suites | `bun test` in harness-eval passed: 71 pass, 0 fail. Changelog: 34 pass, 1 fail, exit 1; `concurrent appends do not interleave lines` produced `EPERM` in child stdin writes. One focused rerun produced the same symptom, 0 pass, 1 fail, 34 filtered. [Test](../../skills/ruach-changelog/tests/changelog.test.ts) uses 12 Node child processes and large stdin payloads. | Changelog stdin transport is a concrete local diagnostic lead. Sandbox/runtime/test transport vs product behavior remains unclassified. It is not proof of the hosted cause or of corrupt output. |
| Installer | [install.ts](../../scripts/install.ts), `install()`, reads old manifest, drift, leftovers, conflicts, removals and operation kinds before exclusive `.ruach-staging` mkdir. Source reads use `--no-replace-objects` and stripped `GIT_*`. Manifest is placed last; bounded rollback guards placed files by inode. | Target-dependent planning is outside the lock; source snapshot bytes can remain outside it. |
| Linked receipt | [spaces.ts](../../skills/ruach-herdr/scripts/spaces.ts), `createLinkedWorktree()`, checks command exit then calls `verifyWorktree()` before parsing Herdr's response. [worker.ts](../../skills/ruach-herdr/scripts/worker.ts) assigns workspace/pane only after that function returns. | Identity failure leaves outer recovery IDs unset. Checkout state stays unknown and submission stays not-submitted. |
| Subdirectory | `worktreePlan()` canonicalizes cwd, pins base, checks fresh destination/branch, and maps cwd inside the new path. It does not check that the inside path is a tree in the base. `verifyWorktree()` checks cwd only after creation. | Missing/changed-type base subdirectories consume checkout resources before failure. |
| Replacement refs | Standalone `createWorktree()` uses `git --no-replace-objects worktree add`; linked creation delegates to Herdr. `verifyWorktree()` checks top-level, cwd top-level and HEAD, not tree contents. [spaces tests](../../skills/ruach-herdr/tests/spaces.test.ts) replacement-ref case invokes standalone mode; [fake CLI](../../skills/ruach-herdr/tests/fixtures/fake-cli.ts) linked mode invokes ordinary Git. | HEAD equality does not establish checked-out bytes under replacement refs. The inventory's broad launcher row needs qualification. |
| Accepted trust | [Operations limitations](../operations.md#known-limitations-in-03), [harness-eval config](../../skills/ruach-harness-eval/references/config.md#clean-check) and [simplification report](../reports/0.3/simp.md) retain Git-status checking and explicitly trust checkout Git configuration. | Preserve filter/index guards and informational readiness boundary; do not revive superseded [clean-check design](0.3-clean-check.md). |

Historical evidence: [security review](../reports/0.3/rev-sec.md) O1 described a stale-create/rollback loss scenario by source reading; 30 race pairs did not reproduce it. O3 described lost linked IDs and late cwd validation. Later [integration report](../reports/0.3/integ-fix1.md) retained those gaps in operations. Historical results are not current reproductions. [Regression inventory](../regression-cases.md) documents public-boundary cases and separates snapshot from runtime/bootstrap integrity.

### Hosted evidence is pending

The frozen roadmap reports failed [run 37986084683](https://github.com/rothzeta/ruach/actions/runs/37986084683) at `d75039a`, after install/check/release/audit succeeded, and earlier failed [run 37661762155](https://github.com/rothzeta/ruach/actions/runs/37661762155). This Architect attempted public run/jobs API reads and the earlier run page using the web tool; they were inaccessible. A public `curl` request failed DNS resolution (`curl: (6) Could not resolve host: api.github.com`). No hosted job logs were obtained. Run status, exact test, platform symptom and cause are therefore roadmap-supplied facts awaiting independent diagnostics, not verified network observations here.

Working hypotheses to discriminate: missing/bootstrap dependencies on the hosted runner; a timing/resource/platform problem in Herdr tests; changelog child stdin transport or append behavior; another reproducible test failure. The CI definition already installs skill dependencies and sets Herdr's default timeout, so local missing dependencies and historical timeouts must not be asserted as its cause. No blanket timeout increase, skip, retry-until-green, removal of concurrency coverage or action-pin change is justified by present evidence.

### Owner decisions versus investigation gaps

| Item | Kind | Required disposition |
| --- | --- | --- |
| Hosted failing test, logs, native versions/discovery, Herdr daemon Git behavior | Factual gaps | Scout collects evidence; no architecture vote needed. Report unavailable access precisely. |
| Exact current source and reconciled input revisions | Launch prerequisite | Coordinator resolves/pins them; don't merge older input text over the frozen updates. |
| Paid smoke/eval account, model/effort, number of turns, budget and security dialogs | Owner authorization | Pending; this planning session's two-Architect authority does not authorize further paid work. |
| A real consumer repository/task and allowed writes/resources | Owner scope choice | Pending; choose an actual task with testable behavior, not a fabricated completed demonstration. |
| Public PR, push, hosted rerun dispatch, release/tag or publication | Owner authorization | Local preparation is permitted in future assignments; external writes need explicit authority. Existing runs may be read without publication. |
| D1 packaging / D2 native Codex role export | Existing product decisions | Remain open; R1 produces evidence without selecting packaging or writing real user config. |
| Optional linked refusal when replacement refs exist | Compatibility decision | Boundary investigation comes first. A conservative refusal is an option; it is not silently accepted in this plan. |

Proposed design choices requiring ordinary design review, not new product scope: plan installer target state under the existing lock; preserve partial linked receipt IDs without promoting them to verified identity; reject a non-tree launch subdirectory before checkout creation. These directly implement R2. The unavoidable runtime-config trust/race limits remain explicit.

## Packages, order and ownership

All packets below are **future assignments**. Their steps and expected acceptance are not outcomes. Coordinator copies the applicable packet plus the common execution contract, resolves revision fields, writes an unchanged assignment in the worker workspace and launches only authorized work. Proposed branch names below were absent in this worktree's branch list during planning; recheck at launch and use a fresh suffix if occupied. Reports/assignments use `docs/reports/next-release/<id>.md` and `docs/assignments/next-release/<id>.md`; these paths are future destinations, not existing evidence. Consumer smoke artifacts use a separately assigned consumer location.

| ID / role | Purpose and exact owned scope | Dependencies and input revisions | Proposed branch / report |
| --- | --- | --- | --- |
| R1-D / Scout | Diagnose hosted gate. Own only its assignment/report and redacted durable log excerpts under `docs/reports/next-release/r1-d-evidence/`. Read CI, recipes and relevant source/tests. No source, config or test edits. | None; pin current source, failed run head SHA and frozen input revisions. | `ruach/r1-ci-diagnostics`; `r1-d.md` |
| R1-F / Implementer | Small diagnosed CI correction. Always owns assignment/report; possible gate files `.github/workflows/ci.yml`, `justfile`, plus **one** diagnosed file set from the fix-scope table below. No generic all-tests ownership. | R1-D identifies cause and exact file set; Coordinator approves concrete expanded packet and pins diagnosis/candidate base. | `ruach/r1-ci-fix`; `r1-f.md` |
| R2-I / Implementer | Installer revalidation. Own `scripts/install.ts`, `tests/install.test.ts`, new test-only `tests/fixtures/install-lock-preload.ts`, assignment/report. Documentation corrections are proposed in report to R-IN, not parallel edits. | None beyond local dependencies; pin current source and this design revision. | `ruach/r2-install-lock`; `r2-i.md` |
| R2-L / Implementer | Linked failure receipt and cwd preflight. Own `skills/ruach-herdr/scripts/spaces.ts`, `scripts/worker.ts` and `tests/spaces.test.ts`, `tests/fixtures/fake-cli.ts` **inside that skill**, assignment/report. No adapter, process, contract-schema or other test edits. | None; pin source/design revisions. Two subcases share files, so one worker handles both. | `ruach/r2-linked-recovery`; `r2-l.md` |
| R2-B / Scout | Establish Herdr replacement-ref boundary. Own assignment/report and redacted evidence under `docs/reports/next-release/r2-b-evidence/`; read source/tests and installed Herdr help. No code/test/config/doc correction. | Can investigate base now; include R2-L revision in final post-change checks if available. Pin inspected Ruach and Herdr versions/source revision when obtainable. | `ruach/r2-herdr-boundary`; `r2-b.md` |
| R-RV / Reviewer | Independently review each named fix and final combined candidate. Own only per-unit review assignment/report (`r1-f-review.md`, `r2-i-review.md`, `r2-l-review.md`, `combined-review.md`); read exact source/test/design scopes above. | Each supplied candidate SHA plus baseline, failing-before evidence and full report. Exact review revision must exist. | Fresh `ruach/r1-r2-review-<unit>` per review |
| R-IN / Implementer, integration assignment | Integrate named reviewed fixes locally; owns only conflict resolutions in their declared file sets, `docs/operations.md`, `docs/regression-cases.md`, `docs/native-parity.md`, `docs/roadmap.md`, `tests/docs-consistency.test.ts`, relevant Unreleased bullets in `CHANGELOG.md`, integration assignment/report. No version/manifests/role changes. | Reviewed R1-F/R2-I/R2-L SHAs (as available), R2-B report, approved current roadmap/native-parity bytes and target-before SHA. Final changelog-edit phase waits for the accepted R3-B commit, refreshes the file and preserves its R3 entry. Disjoint preparation need not wait. R1-S/R1-C evidence gates final R1 evidence update, not initial R2 integration. | `ruach/r1-r2-integration`; `r-in.md` |
| R1-S / Implementer, smoke execution assignment | Prepare then execute isolated install/native smoke. Own `evals/next-release-native-smoke/**` (TypeScript/Bun fixture, tests, briefs, checker config, access-control probe support and README), `docs/reports/next-release/r1-s.md` and sanitized evidence subdirectory including visibility manifests, its assignment. Consumer throwaway task scope specified below. No reusable resources. | Offline preparation can precede R2. Live execution waits for reviewed integrated candidate, green hosted evidence or an explicitly recorded owner waiver, and paid/launch authorization. Record the actual tested resource revision, including accepted R3 guidance when testing the combined batch. Blind claims additionally require evidenced access exclusion and offline controls below. Pin release-tag target separately. | `ruach/r1-native-smoke`; `r1-s.md` |
| R1-C / Implementer, real consumer assignment | Execute one actual consumer task; Ruach-owned output limited to assignment/report and sanitized `r1-c-evidence/`. Consumer source/tests/support/docs must be named explicitly in owner-approved packet before launch. | Owner-selected task/resources and authorization, usable installed route from R1-S; pin consumer base, Ruach installation SHA/version, checker version and exact candidate. | `ruach/r1-consumer-evidence` for Ruach report; fresh consumer branch chosen in its packet; `r1-c.md` |

R1-F diagnosed file sets (select one; additional ownership requires a new bounded packet): installer `scripts/install.ts` + `tests/install.test.ts`; routing wrapper `scripts/agent-routing.ts` + `tests/agent-routing.test.ts` + `tests/readme-routing.test.ts`; handoff `skills/ruach-handoff/scripts/validate.ts` + `tests/validate.test.ts` within that skill; Herdr `skills/ruach-herdr/scripts/process.ts` or `native-codex.ts` or the implicated adapter, plus its `tests/worker.test.ts`/`tests/spaces.test.ts` and `tests/fixtures/fake-cli.ts`; harness-eval `skills/ruach-harness-eval/scripts/common.ts`/`acceptance.ts`/`scope-check.ts` + its `tests/eval.test.ts`; changelog `skills/ruach-changelog/scripts/changelog.ts` + its `tests/changelog.test.ts`. A dependency change must name its own manifest/lock and `tests/dependencies.test.ts`; it is not inferred permission to update every dependency. All skill-relative tests in this table are under the named skill. If the diagnosed case is outside these sets, report the location and create a new explicit assignment before fixes.

R1-D, R2-I, R2-L, R2-B and R3 planning can run independently in separate worktrees. Verification suites serialize on a shared constrained machine: Herdr timing/socket tests should not compete with root typechecks or smoke sessions. R1-F serializes with whichever R2 package owns its diagnosed files; use its already accepted correction if it resolves the gate rather than duplicating fixes. R2-B is read-only and cannot conflict. R2-I and R2-L deliberately defer shared operations/inventory/changelog edits to R-IN. R1-S and R1-C own separate reports; R-IN alone updates shared evidence docs after their reports arrive.

The actual shared implementation file is `CHANGELOG.md`: R3-B writes its one R3 Unreleased bullet first; R-IN's final changelog-edit phase waits for that accepted commit, refreshes the file and preserves its R3 entry while adding R1/R2 entries. The Coordinator names that accepted SHA and phase-specific dependency in R-IN's assignment; workers do not negotiate overlap. R-IN's other disjoint preparation remains independent. `docs/roadmap.md`, `docs/native-parity.md`, `docs/operations.md`, `docs/regression-cases.md` and `tests/docs-consistency.test.ts` stay R-IN-owned; R3 owns its specimens, roles and coordination examples. If later authorized scopes introduce another overlap, the Coordinator records its explicit owner/order before edits.

Order: start R1-D; parallelize R2-I/R2-L and read-only R2-B when authorized; issue R1-F only after diagnosis; review individual fixes; R-IN combines accepted candidates and updates R2 recovery docs; review combined SHA; obtain green hosted run on that SHA through authorized PR/push; run authorized R1-S then R1-C; serialize final evidence-doc update/review. If final evidence recording changes only docs, identify the earlier code-tested SHA and later evidence commit distinctly. Green CI on an older revision must never be represented as green CI on the combined technical revision. Local acceptance is separable from publication.

### Common execution, review and delivery contract

Each future packet includes: role/task ID, binding user decisions, resolved source and context SHAs, owned files above including test support and docs, fresh workspace/branch, prerequisite reason, exact commands below, allowed resources, report/assignment paths, and commit rule. Read relevant source before edits. Add failing-before regressions at public boundaries before each defect correction; preserve existing tests/assertions unless an explicitly approved contract change requires otherwise. Report out-of-scope needs instead of editing foreign files. No global settings/discovery edits, route substitution, unrelated cleanup, merge to main, tags or push.

Permissions to put in offline implementation packets: worktree/temp writes; Git/Bun/Just; frozen local dependency installation (`just install`, no global install); socket access for Herdr tests; own process-group cleanup; local commit of only owned artifacts. Name registry network access if dependencies are not cached. If sandbox denial blocks gitdir `index.lock`, request one narrowly scoped staging/commit escalation, report its result and do not loop. Socket/test denials get a named verification escalation when authorized; otherwise report `not verified: environment` with command/exit and keep test expectations. These are permissions for future assignments, not permissions this Architect exercised beyond its assignment. Do not approve native trust dialogs on a user's behalf.

Disposable files stay in OS temp. Durable sanitized evidence states command, cwd kind, tool versions, existing revision, environment, exit/status and coverage. Workers commit unchanged assignment and report with owned changes; return creating SHA outside the report. Handoff uses [ruach-handoff](../../skills/ruach-handoff/SKILL.md) and is validated with `--repo`. Reviewer never fixes production code or certifies unrun checks. Integration records target-before/candidate/tested/reviewed revisions; a moved target needs refreshed integration/review. Delivery is a separate explicitly assigned Implementer action targeting the exact reviewed combined revision. The Coordinator personally releases task sessions/native workspaces/worktrees under retention policy and does not delegate that release. Workers may terminate bounded verification subprocesses they created and dispose of offline scratch within assigned scope; that permission does not extend to native task resources. Keep branches, partial work and useful uncommitted evidence, and inspect uncertain resources before relaunch.

## R1 diagnostic and fix packets

### R1-D: first executable handoff

Copy this packet with the common contract. It has no paid-run or product-decision dependency:

> Role: Scout. Task: R1-D. Outcome: identify the failing suite/test and supported cause, or a precise access/setup blocker, for runs 37986084683 and 37661762155. Own only `docs/assignments/next-release/r1-d.md`, `docs/reports/next-release/r1-d.md` and redacted evidence in `docs/reports/next-release/r1-d-evidence/`. Source/tests/CI/config are read-only. Base: resolve the current authorized Ruach source commit at launch; inspect `d75039aa7b82b262e2f28af08630258fb7f77180` separately as the known run base. Branch: `ruach/r1-ci-diagnostics`, checked unused immediately before creation. Inputs: this plan, frozen current roadmap inputs, CI/justfile/package manifests, historical reports and the two public runs. No workflows, extra workers, paid prompts or external writes. Read-only public GitHub access, repository-local frozen dependency install, temp probes, local sockets and Git commit of owned evidence are permitted by the future assignment. Request a narrow verification or gitdir escalation once if needed; record unavailable resources rather than weaken checks. Commit unchanged assignment and report; return creating SHA. Review is pending independently; no source fix in this task.

Steps and bound:

1. Record current source and failed-run head SHA, run attempt/job IDs, timestamps, runner/toolchain and step conclusions. Obtain run/jobs JSON and failed logs with read-only commands below; redact credentials/private host paths. Link run and failing job in report. Access failure is an explicit remaining gap.
2. Install frozen local dependencies in the assigned worktree. Run the exact CI recipe sequentially. Keep logs per command with real exit status, not a `tee` pipeline's status. If it fails, run the single implicated suite/test once in isolation after prerequisites are satisfied. Compare same named failure with hosted logs and the original base; a successful current run does not erase the failed base.
3. Bound investigation to the two runs, one full local gate and one focused reproduction per distinct observed failure. Identify missing access/runtime support separately from defects. Prepare a minimum public-boundary repro if supported; don't edit production/test source. If a runtime hypothesis needs another version, record that as a follow-up rather than changing the pinned toolchain silently.
4. Report evidence, cause confidence, smallest candidate file set, regression expectation and fix assignment proposal. If hosted logs are unavailable, report `blocked`/`needs-decision` as appropriate for the diagnostic task without asserting a cause. No need to wait for packaging or R3.

Exact commands (GitHub commands are read-only; use authorized auth if public unauthenticated access is insufficient):

```sh
git rev-parse HEAD
bun --version
just --version
git --version
gh api repos/rothzeta/ruach/actions/runs/37986084683
gh api repos/rothzeta/ruach/actions/runs/37986084683/jobs
gh run view 37986084683 --repo rothzeta/ruach --log-failed
gh api repos/rothzeta/ruach/actions/runs/37661762155
gh run view 37661762155 --repo rothzeta/ruach --log-failed
just install
just check
just release-check
bun audit
(cd skills/ruach-handoff && bun audit)
(cd skills/ruach-herdr && bun audit)
just test
bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r1-d.md --repo .
git diff --check
```

Use a separate temp checkout at the resolved failed-run SHA if launch base differs; don't reset the active worker or the main checkout. For the observed changelog lead: `(cd skills/ruach-changelog && bun test --test-name-pattern 'concurrent appends')`. Distinguish stdin write errors from the append assertions; retain 12-writer/large-payload/complete-JSON expectations. For a diagnosed Herdr test: `(cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts --test-name-pattern '<exact logged test name>')`, replacing file/name with observed evidence.

Acceptance: every hosted failure is attributed to a job/suite/test with logs or marked pending access; local prerequisites and exact failures are recorded; cause is distinguished from hypotheses; proposed fix scope is concrete; no paid session/dispatch/push/source edit occurred. This diagnostic success does **not** close R1.

### R1-F: bounded correction after diagnosis

Launch prerequisites: accepted R1-D findings, concrete file set from the table, tests/support/dependency/doc ownership written into its packet, and no conflicting active R2 editor. Re-resolve current base and diagnosis revision. If hosted cause is still unknown, only a separately authorized, locally reproduced defect can be fixed; label it local and retain hosted diagnosis pending.

Steps: reproduce the named failure with a failing-before public test (or retain the already failing required suite as baseline evidence for a gate/transport correction); identify supported cause; apply smallest correction; rerun focused test and the exact full gate above. CI observability may be improved without changing accepted behavior, but timeout/expectation changes need measured justification and review. Return red/green commands and SHAs, permission/setup gaps and unresolved hosted status. Source/test ownership comes from the selected family; R-IN owns shared documentation updates. Accept only preserved invariants and passing required checks, or explicit unresolved verification. Independent R-RV reviews the exact candidate. Request hosted execution only after local review and explicit external-write authorization; don't put a successful run URL in a future assignment.

R1 final evidence matrix:

| Required evidence | Expected report fields | Current disposition / closure |
| --- | --- | --- |
| Hosted CI | Run/job URL, head SHA, toolchain, step/test results and attempt | Pending diagnostics. Need a linked all-green run on resulting technical candidate; local tests do not replace it. |
| Clean installation | Route, source/tag/commit, installed manifest/cache, missing-package remediation and ready/check results | Dated offline evidence exists in native-parity; repeat on selected candidate in isolated environment. |
| Native behavior | Harness/version, entry command, role source/composition, observed skills, edit scope, tool/test evidence and valid handoff | Paid sessions pending authorization. Fixture argv/help evidence is insufficient. |
| Claude parity | Same starting fixture/task, model/effort/permissions, one native `--agent` run and one adapter run, independent reports | Compare instruction adherence and actual scope/handoff, not only role text transport. |
| Codex discovery | Isolated configuration roots; actual discovered skill names/paths/scope; project snapshot vs user-skill route; explicit skill-path fallback result | Pending current evidence. Skill-path fallback is assisted. No export decision implied. |
| Real consumer | Named real task/repo/build, original behavior, base/candidate, allowed paths, checks and human/reviewer acceptance | Owner must select task and authorize resources. Throwaway off-by-one alone cannot close this row. |
| Unassisted evaluation | Brief/config hashes, route/resource bytes, visibility manifest, offline access controls, checker results and interventions | Optional M1-compatible evidence; unassisted brief has no role/skill/route hints. Hinted runs are assisted. Blind answer-access classification is separate and requires evidenced exclusion; otherwise retain ordinary non-blind native smoke. |

## R2-I: installer revalidation under lock

Purpose: one cooperating installer must plan from the target state it owns, avoiding stale conflict/operation-kind decisions. Public boundaries: `bun scripts/install.ts install --source DIR --version VERSION|--revision COMMIT --target DIR [--replace]`, copied `ruach-install.ts install`, and `check`. Preserve exit 0 verified, exit 1 refusal/fully rolled-back, exit 3 incomplete rollback; manifest schema, pinned source selection, ignored dependency/cache files, extra consumer roles/skills, symlink refusal, hardlinks and version checks.

Proposed smallest change:

1. Validate options and read immutable incoming Git snapshot outside the target lock. Do not reread a movable ref during commit.
2. Retain cheap early target safety checks for useful refusal without mutation. Acquire exclusive existing `.ruach-staging` lock before authoritative target reads. After successful acquisition, reread metadata, drift, union of old/incoming roots, leftovers, conflicts, parent types, removals and all operation kinds. Build the operation list only from that state; discard any preliminary plan. Moving the target-dependent block into the lock is simpler than maintaining stale-plan comparison logic.
3. Keep cleanup ownership explicit: only this run's successfully acquired staging directory can be removed. Validation/staging failure before renames removes its staging; failure to acquire an existing staging must never remove it. Incomplete rollback retains journal/backups. Preserve metadata-last placement, inode-guarded rollback and immediate integrity check.
4. Creating a missing target root may precede the lock as today. Symlink/unsafe-parent checks must occur before trusting it, and must be repeated as needed under the lock; acquiring a lock never legitimizes an unsafe destination. An empty target root on a refused first install can be documented; managed files and other installers' staging must remain unchanged.

The lock serializes cooperating installers; it is not a defense against unrelated writers changing the filesystem during renames. Do not add a new lock service, wait/retry loop, recovery command or global lock. A second concurrent owner is refused using the existing interrupted/busy marker, and can retry only after inspecting/waiting for the active owner.

Regression design: use a test-only Bun preload fixture to interpose the CLI's staging `mkdirSync` boundary with `mock.module('node:fs')`; preserve all real filesystem operations. A temp architectural probe verified that Bun 1.4.2 `--preload` can interpose a named `mkdirSync` import. This is test transport, not a production test switch, and its complete installer race case still needs implementation/verification. Give every barrier a deadline and release/kill child in `finally`.

| Failing-before case | Controlled interleaving and required public observation |
| --- | --- |
| Stale drift/permission to overwrite | Install A; pause B just before acquiring staging. While paused, another successful install changes manifest/content, then a user edit creates drift. Release B without `--replace`. Old code can use its pre-lock clean plan and overwrite; corrected B must exit 1, preserve the new state byte-for-byte and leave no owned staging. |
| Changed manifest/removals | Pause B; A installs a revision adding a managed file in an existing skill root; release B targeting a revision that omits it. Corrected B plans removal from A's current manifest and succeeds, with `check --source` passing and no leftover file. Old code misses that obsolete file and can fail integrity. |
| Stale create/rollback loss | Pause B after old code would plan a missing path as create; A installs it; leave a regular leftover to trigger B integrity failure on old code. Corrected B refuses drift before mutation without `--replace`; assert A's file/inode/content/manifest and extra policy survive. Do not accept only final `check` as proof of no data loss. |
| Existing owner / invalid post-lock state | Another process owns staging; loser exits 1 without deleting its marker/journal. After acquisition, malformed/symlink metadata or unsafe entry refuses; owned staging is cleaned, foreign content preserved. |
| Positive replacement and rollback controls | Explicit `--replace` uses current state; existing hardlink, leftovers, failure rollback and copied installer tests stay passing. Run rollback tests as a non-root user so chmod denials remain meaningful. |

No race regression was executed by this Architect. Record failing-before baseline rather than claiming the historical stress test proved failure. Avoid tests that merely assert helper invocation or ordering; assertions are CLI exit/diagnostics, filesystem state and copied installer behavior. Preload may observe a boundary to schedule a race, but never supplies the expected product result.

Exact verification after frozen local setup, sequentially:

```sh
just install
bun test --timeout 30000 tests/install.test.ts
bun test --timeout 30000 tests/ready.test.ts tests/docs-consistency.test.ts
just check
just release-check
bun run test
bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-i.md --repo .
git diff --check
```

Permissions/resources: temp fixture repositories/targets, non-root uid, child-process barriers, Git/Bun, local dependency setup; no live Herdr/model or global installation required. Acceptance: each race demonstrates the old defect at the public CLI, then passes; unsafe entries/hardlinks/policy/manifest/rollback contracts survive; interrupted ownership is retained accurately. Review R2-I independently before R-IN. Recovery docs proposal: active lock means inspect/wait for its owner; interrupted lock means follow existing journal/backups recovery or deliberate reinstall after preserving useful changes. Never blindly delete an active staging directory or imply `--replace` overrides unsafe entry types.

## R2-L: linked receipt and requested cwd

Public boundaries: skill `worker.ts start|resolve`, `start --dry-run`, and source `just agent-routing start`. Existing output schema stays version 1. Resolve/dry-run do not create worktree/branch/workspace/pane/agent. Preserve original exit categories, canonical identity checks, retained uncertain resources, no automatic retry/fallback after mutation and approved native config preparation.

### Preserve a partial receipt before validation

Proposed design: parse bounded Herdr command output for individually usable workspace/root-pane IDs before identity or complete-response validation. A narrow receipt callback from `createLinkedWorktree()` to `worker.ts` can record these IDs immediately, while the function still returns only after all existing checks pass. Prefer this to changing global `Failure` or adding a general launch-state framework. Keep the callback limited to this creation operation. Parse on nonzero exit too when valid receipt data exists, but treat it as uncertain; a timeout/malformed response can legitimately leave IDs unknown.

The IDs are recovery hints supplied by Herdr, not proof that the response describes the requested worktree. Validate nonempty single-line strings; withhold raw stdout/stderr. Do not use an unverified receipt to split a pane, start an agent, construct executable cleanup commands or automatically focus/delete a workspace. Success still requires successful command, canonical matching checkout, expected HEAD/cwd, complete response, linked registration and valid pane/workspace. When one check fails, retain known IDs, exit 4, `worktree_state: unknown`, `submission_state: not-submitted`, phase worktree, and generic inspect-before-retry guidance. Existing success-path assignment and later split/start states remain intact.

Failing-before cases, implemented through fake Herdr and the actual worker CLI:

- Successful Herdr creation returns IDs but test fixture gives wrong HEAD/top-level/cwd: exit 4 and expected workspace ID retained, no split/start. Source currently loses both IDs when verification throws.
- Valid workspace but missing root pane, unconfirmed linked registration or mismatched response path: retain valid individual IDs without granting readiness. Existing malformed/unlinked tests must keep their failure behavior and gain receipt assertions.
- Nonzero result with parseable partial receipt: retain known IDs, unknown worktree, no retry; malformed/nonzero without IDs keeps nulls and the planned path/branch.
- Normal linked creation, standalone recovery and split/start/awaiting-input cases keep their existing semantics. No raw sensitive native output appears in JSON or stderr.

Fixture support belongs in existing `tests/fixtures/fake-cli.ts`; add narrowly named behaviors for wrong HEAD or response path and partial receipt. Tests assert structured output, recorded mutations and actual Git state, rather than callback invocation.

### Preflight a requested subdirectory as a base tree

After canonical cwd-relative-path and pinned commit resolution in `worktreePlan()`, check a nonempty inside path with `git --no-replace-objects -C <cwd> cat-file -t <resolved-sha>:<inside>`. Require exit 0, no timeout and exact type `tree`. Mere object existence is insufficient: a blob, symlink blob or submodule gitlink is not an ordinary launch directory. Root cwd is valid without this extra query. Arguments remain separate argv; use pinned SHA plus literal path, preserving spaces, Unicode and colons. Retain post-create identity verification as defense against runtime state changes.

Proposed diagnostic `worktree_cwd_unavailable`, exit 2, field cwd, says the requested launch directory is absent or not an ordinary directory in the base; no raw Git stderr. Check failure/timeouts refuse before checkout mutation. Native preparation may already have initialized approved harness runtime state; promise no checkout/branch/workspace/pane/agent mutation, not a blanket no-filesystem-write claim.

Failing-before cases in both standalone and linked modes: untracked nested directory; empty directory; directory introduced after an explicitly older `--base`; base path is a tracked blob/symlink/gitlink while current cwd is a directory. `start`, `resolve` and `--dry-run` all refuse, output not-created/not-submitted, no new branch/path or Herdr mutation. Current start can leave resources, and current resolve/dry-run can report a usable plan. Controls: tracked base directory with spaces/Unicode, root cwd and symlinked caller alias canonicalized to a tracked directory succeed; inherited `GIT_*` still cannot redirect repository selection. Do not delete user directories or claim submodules are supported by this change.

Exact verification after setup:

```sh
just install
(cd skills/ruach-herdr && bun test --timeout 30000 tests/spaces.test.ts)
(cd skills/ruach-herdr && bun test --timeout 30000 tests/worker.test.ts)
bun test --timeout 30000 tests/agent-routing.test.ts
just check
just release-check
bun run test
bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-l.md --repo .
git diff --check
```

Permissions/resources: offline fake CLIs, temp Git repositories/child processes, local Unix/TCP sockets for existing Herdr suites, local dependencies; no native model request/live daemon worktree needed. Acceptance: both subcases fail before correction and pass afterward, success/failure identity contracts remain, all required checks complete or specific environment gaps remain. Reviewer checks the exact candidate. Recovery docs proposal: preflight failure creates no checkout resources, so fix cwd/base/name; receipt failure requires inspect `herdr worktree list` for the expected path/branch and returned workspace, verify association before focusing/removing, preserve work and branches, then explicitly release only owned resources. Null receipt remains possible and must be documented.

## R2-B: Herdr replacement-ref boundary investigation

Purpose: distinguish Ruach's protected private reads and standalone checkout from a Herdr-server-owned checkout. This packet produces evidence and accurate limitations; it does not promise an unimplemented prevention mechanism or change harness-eval trust. Inputs are current spaces/worker/fake CLI, regression inventory, installed Herdr version/help and any obtainable matching public Herdr source. Use source locations/versioned references when available; no vendor claim from memory.

Steps: first reproduce with existing fake linked-create fixture in an OS-temp investigative copy, changing only temporary inputs to create a standard `refs/replace` at the base. Then, if a dedicated local Herdr session is expressly assigned, create a throwaway repository with original/replacement content, call Herdr `worktree create` without starting an agent, and compare reported HEAD and file bytes. Compare standalone Ruach behavior. Inspect supported CLI/server options to determine whether Herdr actually offers replacement-ref suppression and whether a client env flag reaches server Git; do not assume it does. Record daemon/client cwd/environment distinction. Check partial failure recovery; preserve evidence and report native resource IDs, association/state, retained work and readiness for release. The Coordinator personally releases the dedicated task sessions/workspaces/worktrees after inspection and preservation; the Scout does not perform that release. Bounded owned probe subprocess/offline scratch cleanup remains within assigned scope. No native paid session is needed for worktree-only observation, but live daemon mutation must be named in future permissions.

Exact read/probe commands, with assigned throwaway values, are:

```sh
herdr --version
herdr worktree create --help
herdr worktree list --workspace <assigned-parent-id>
git --no-replace-objects -C <throwaway-repo> rev-parse HEAD
git --no-replace-objects -C <throwaway-repo> for-each-ref --format='%(refname)' refs/replace/
herdr worktree create --workspace <assigned-parent-id> --branch <fresh-branch> --base <pinned-sha> --path <fresh-path> --label r2-boundary --no-focus
git --no-replace-objects -C <fresh-path> rev-parse HEAD
bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/r2-b.md --repo .
git diff --check
```

Use TypeScript/Bun to construct the fixture, compare exact known file bytes and retain sanitized JSON; record actual substituted argv in evidence. Permissions: read-only public source/network; offline temp probes; live dedicated parent workspace/repo creation only if explicitly assigned, with no agent launch and no worker release of native task resources. Branch `ruach/r2-herdr-boundary` owns report only. Acceptance: evidence distinguishes fake from real server behavior, versions and replacement-ref namespaces/config assumptions; unsupported mitigation and untested live behavior remain named gaps. Known/uncertain IDs are retained as inspection hints, not automatic release authority. Existing identity checks stay fail-closed.

Recommended disposition for current scope: document the linked boundary and qualify standalone-only regression coverage. If no Herdr suppression API exists, leave the limitation explicit rather than claiming a fix. Optional follow-up needs owner compatibility authorization: refuse linked creation before mutation when standard `refs/replace/` is nonempty or cannot be inspected. Such a guard is conservative (unrelated refs also block), does not cover daemon custom namespaces/config or races, and cannot provide a tree-content guarantee. Never silently switch to standalone, delete replacement refs, mutate repository config or pass ineffective env flags as a claimed fix. An authorized follow-up would own spaces/worker tests and fake CLI, serialize after R2-L, add failing-before linked rejection cases and positive standalone controls, and retain limitations for remaining races/configuration. No checkout hashing or hostile-candidate certification is required.

## R-IN and R-RV: integrated acceptance and accurate operations

R-IN resolves accepted source SHAs and target-before; combines only named changes on its own branch. Initial source scope is their union, with conflict fixes limited to it. Record unresolved review findings rather than broadening ownership. Shared docs update only resolved cases: replace concurrent-install and late-cwd notes with new behavior/recovery, explain partial receipts, keep unresolved replacement boundary, and add regression rows with exact suite/test names and public behavior. Preserve accepted clean-check/filter/index/config trust wording. Changelog entries are Unreleased; no metadata/version bump. Do not describe old inventory rows as covering linked replacement refs.

R1 evidence-doc updates use newly observed versions/names/paths, and each route gets actual results or a named gap. The current/native input revisions must be reconciled, including their dated historical facts and unresolved D1/D2. The [native-parity input](../native-parity.md#clean-install-plugin-cache-facts) contains a historical sentence saying plugin-root "triggers a root install" while its experiment bullets say no install occurs; retain the supported no-install observation and flag/correct the sentence during the assigned evidence-doc update. Do not silently decide packaging to resolve that wording. R3 record fields/locations remain under its own ownership.

The final R-IN changelog-edit phase requires the accepted R3-B commit as described above; refresh and preserve the R3 bullet. A technical candidate combining R1/R2 with R3 guidance must be explicitly assembled by an authorized integration assignment, verified with the union of affected checks and independently reviewed at that exact SHA. R-IN's present no-role-edit scope does not confer ownership of R3 contracts. R1-S identifies its actual installed resource revision/bytes; an earlier run is evidence only for that earlier resource set. If later R3 guidance changes role/assignment behavior relevant to a route's smoke claim, repeat the affected authorized smoke on the combined resource revision or leave that coverage pending. Do not relabel old evidence as a new combined-candidate result.

Exact integration verification, sequentially on the combined candidate: `just install`, `just check`, `just release-check`, `bun run test`, `just test`, `bun audit`, `(cd skills/ruach-handoff && bun audit)`, `(cd skills/ruach-herdr && bun audit)`, handoff validator for `r-in.md` with `--repo .`, `git diff --check`. Root-only tests and the whole `just test` recipe both remain named per project guidance; avoid repeated full gates once the final candidate is unchanged. R-RV independently checks red/green evidence, source scope, receipt trust distinction, lock cleanup paths, subprocess bounds, existing contracts and documentation accuracy; runs these same checks where resources permit, records exact reviewed SHA and any unverified areas. No claim of accepted review until the Reviewer actually reports it.

R2 closes only when resolved bugs have failing-before public regressions, independent reviewed corrections, passing appropriate checks and accurate recovery docs; unresolved boundary cases remain listed. R1 closes only with resulting green hosted CI plus real consumer report and route-by-route native evidence/results or explicit remaining gaps. An owner can accept a partial evidence state, but it must not be reported as every native check passed.

## R1-S: clean install and native behavior smoke

Offline preparation owns the eval packet and may run without paid authorization. The fixture is a small committed TypeScript/Bun off-by-one defect, with existing failing tests under `tests/`, fixable source under `src/`, and an allowed report at `docs/reports/smoke.md`. Scope permits only `src/**` and that report; pre-existing tests/support are read-only. This resolves the old checklist's tension between "edit only src" and writing a handoff. The candidate/report may be committed before checker execution so acceptance's clean-tree contract is satisfied. Disposable installation/model logs stay outside the candidate and Git metadata; retain sanitized selected evidence in the assigned Ruach report folder.

Prepare subject inputs separately from expected outcomes/rubric/hidden checks. The assisted native-use brief names the Implementer role and skills intentionally; it is **not unassisted** harness-eval. If an unassisted variant is authorized, its subject brief is only the consumer task/scope/check/report requirement and contains no Ruach, role, route, skill or installation hints. Keep evaluator directions out of subject files/AGENTS.md. Any later skill-path hint, intervention or explicitly routed role makes that run assisted from that point; retain the original failure and new run ID. No automatic benchmark runner is added.

### Answer-access boundary for any blind claim

Prompt assistance and answer access are separate dimensions. Every run records both `assisted|unassisted` and `blind|non-blind|unverified`. A role/skill-hinted run can still have blind answer access; a brief without hints is not blind merely because it omits rubric paths. Ordinary native-use smoke remains useful without a blind claim.

Before every run claimed blind, the future R1-S packet inventories the subject-visible source clone, complete native plugin cache, project snapshot/user-skill roots, cwd/add-dir/resource roots, accessible evaluator packet files, plans, prior reports/conclusions and other run outputs. The known plugin layout copies the whole repository, including `evals/` and `docs/`; isolated configuration homes and non-registration of those files do not prevent reading them. Store an evaluator-only visibility manifest with resolved paths, installed source/cache revision and relevant file digests, allowed task/runtime resources, excluded answer/rubric/hidden-check/plan/prior-output paths, and the assigned filesystem/tool access mechanism. Account for alternate paths and symlink aliases. Retain sanitized manifests and commands in the assigned evidence location outside the evaluated candidate.

Blind acceptance requires evidenced exclusion through the actual execution boundary, not a request that the subject avoid files. Before any paid task turn, use a TypeScript/Bun offline access probe within the same effective filesystem/tool permissions to attempt reads of known excluded fixture markers via each inventoried source/cache/prior-output root; reads must be denied or demonstrably unreachable. Pair that negative control with positive reads of the raw task and required installed role/skill/runtime files and verify their digests against the recorded installed resource bytes. Record exact probe argv, permissions/boundary, paths, results and limits. An unrelated host process's failed read or an untested theoretical allowlist is not evidence of subject exclusion. The independent packet Reviewer examines the inventory, controls and resource equivalence before a blind claim; actual run evidence must retain the realized boundary and any deviations. These probes and evaluation are future work, not outcomes of this planning round.

Preserve the actual installed route, plugin/resource bytes and native lifecycle. Do not silently trim source/cache packaging, swap the route for a copied skill view, or change global settings to obtain a blind result. A permitted access boundary may restrict answer visibility while retaining runtime bytes, but its effect on native discovery/behavior must be recorded. If equivalent route/resource access or answer exclusion cannot be established, classify the evidence as ordinary **non-blind native-use smoke**, leave blind evaluation unverified, and retain discovery, scope and task/handoff observations with their actual resource SHA. A restricted-resource experiment differing from the native route must be reported separately as such; it cannot satisfy that native-route matrix row by substitution. D1 packaging stays unresolved, and no new evaluator service is proposed.

Packet review acceptance includes protected/pristine inputs, answer-access inventory and evidenced positive/negative controls or explicit non-blind disposition. Subject-visible worked examples must not disclose the held-out task's solved disposition; compare them with raw cases for leakage. Paid authorization and usable route readiness remain separate gates. A failed exclusion check is not permission to broaden access or alter packaging.

Proposed route matrix; all live rows pending authorization:

| Route/run | Isolated installation and entry | Required observed evidence |
| --- | --- | --- |
| Claude plugin / native agent | Clean source clone at selected SHA, temporary config roots, native marketplace/plugin lifecycle; `claude --agent ruach:implementer` | Actual role behavior, discovered skills, allowed edits, test output and valid handoff; worker does not load workflow bodies. |
| Claude snapshot / adapter | Versioned `.agents` snapshot, copied-skill dependencies, ready/check; explicit Herdr Implementer launch | Same fixture/base/task/model/effort/permissions as plugin comparison; adapter role composition vs native result reported without assuming equivalence. |
| Codex snapshot | Project `.agents`, isolated Codex roots, actual `skills/list` before launch; assigned role file explicitly supplied | Discovery names/paths/scope, boundaries, tests and handoff. Direct role instruction is assisted; no native TOML export. |
| Claude Skills CLI | Pinned Skills CLI into temporary home, install executable-skill dependencies; skills invoked on same task | Skills-only route has no installed roles; role evidence comes from assignment, not named-native-agent discovery. |
| Codex Skills CLI | Temporary home/Codex roots, actual catalog discovery, same fixture/task | Record user-scope discovery; if unavailable, explicit canonical skill-path fallback gets a separate assisted run and records the failed discovery attempt. |

Commands for offline preparation (values resolved and recorded in the packet; no real global HOME is changed):

```sh
git --no-replace-objects rev-parse HEAD
bun scripts/install.ts install --source <clean-source> --revision <candidate-sha> --target <consumer>/.agents
bun <consumer>/.agents/ruach-install.ts check --target <consumer>/.agents --source <clean-source>
(cd <consumer>/.agents/skills/ruach-handoff && bun install --frozen-lockfile)
(cd <consumer>/.agents/skills/ruach-herdr && bun install --frozen-lockfile)
bun <consumer>/.agents/ruach-install.ts ready --route herdr --project <consumer> --json
bun test --timeout 30000 evals/next-release-native-smoke
```

Also exercise published/local tag `--version 0.3.0` separately and record its resolved commit; it is a historical release route, not the latest Unreleased candidate. Use a TypeScript/Bun orchestrating fixture to pass isolated `HOME`, `CODEX_HOME`, `CLAUDE_CONFIG_DIR` in each child env; never repurpose shell/system variables or point setup at real user configs. Plugin install uses `claude plugin marketplace add <clean-source> --scope user`, `claude plugin install ruach@ruach --scope user` and readiness from its returned cache path. Skills CLI uses `bun x --bun skills@1.7.0 add <clean-source>/skills --global --agent codex --agent claude-code --skill '*'` with the isolated child env. Registry/network/native install runtime writes must be explicit in execution permissions. Record discovery counts from actual candidate rather than repeating the historical eight-skill count, since changelog is integrated.

After paid authorization, execute at most one task turn per matrix row plus the separately approved fallback; security dialogs wait for user authority. Pin entry flags from installed help and explicit model/effort rather than inventing current native flags. Snapshot adapter command: `bun <consumer>/.agents/skills/ruach-herdr/scripts/worker.ts start --name <unique-name> --role implementer --cwd <consumer> --kind claude --model <authorized-model> --effort <authorized-effort> --base <consumer-base> --branch <unused-branch> --worktree <fresh-path>`. Herdr context and resources belong to the assigned isolated session. Confirm ready/awaiting-input/submission before separately sending task; do not restart a blocked agent or switch routes after failure. Native direct Codex entry uses the authorized installed CLI and supplied role/skill paths; isolate its config without exporting agent TOML.

Exact post-run verification: consumer `bun test`; installed handoff validator on `docs/reports/smoke.md` with `--repo <consumer-candidate>`; `git diff --name-only <consumer-base> <candidate>` plus current status; `bun <checker>/scripts/acceptance.ts --config <eval-config> --run <run-id> --output <new-outside-path>` and `bun <checker>/scripts/scope-check.ts --repo <consumer-candidate> --baseline <consumer-base> --candidate <candidate> --allow <scope-config> --output <new-outside-path>`. Checker is a pinned `ruach-harness-eval` copy, its configuration follows [current contract](../../skills/ruach-harness-eval/references/config.md); outputs never overwrite earlier evidence. Human comparison cites native tool evidence separately: `model_use_verified` remains false in checker JSON. Run source handoff validator on `r1-s.md` with `--repo .`, resource links check and `git diff --check` before committing report.

Acceptance: ready/check and skill dependency remediation recorded on each actual installed copy; every live row observes role/skills, task outcome, edit authority, tests and valid report or records precise failure/pending item. Record installed route/resource SHA/digests and separate prompt-assistance/answer-access classifications. Blind claims require the visibility manifest and evidenced offline positive/negative controls above; otherwise retain ordinary non-blind smoke and leave blind evaluation unverified. Hidden workflow exclusion is required for adapter workers; native plugin exposure may include workflow metadata, but loading workflow bodies by the worker fails the role boundary. Same-task Claude comparison has no unrecorded model/permission differences. Discovery fallback never counts as unassisted success. Return route evidence and uncertainty, not cost/performance claims.

Permissions/resources: offline packet and temp installs first; future live packet names paid budget/turn cap, model/effort/account, registry/native network, isolated homes/profiles, Herdr parent/panes, candidate worktrees and report paths. Any blind claim additionally names the effective subject access boundary and its offline verification permissions. No production databases/ports are needed for this fixture; explicitly reserve any required local socket. No account/global setting edits, publication or automatic approval. Review packet independently, then review observed reports; retain failed runs and native task resources until the Coordinator personally releases them. Owned bounded subprocess/offline scratch cleanup remains within the packet's scope.

## R1-C: real consumer evidence

Owner/Coordinator selects an actual task whose desired behavior and source/test/support/doc paths are known. Before launch the packet must state exact consumer repo/base, owned files including tests/fixtures/report, unchanged protected files, failing behavior/acceptance, verification commands from that repo, route/model/effort, authorization/budget and resource isolation. This is an actual scope decision; this Architect cannot invent those paths. The packet cannot be called executable until these fields are filled. Use R1-S's usable route and independently reviewed installed Ruach revision; don't broaden a demo into a new consumer feature.

Execution: reproduce initial behavior, make the authorized correction, run exact consumer checks, write/validate handoff in the consumer's chosen durable location, obtain independent review/human acceptance, and record Ruach source/version, native versions, task/candidate/report references and scope/interventions in `r1-c.md`. Verification includes consumer tests (named by its packet), installed report validator `bun <consumer-skill>/scripts/validate.ts <consumer-report> --repo <consumer>`, exact base/candidate diff/status and the two checker commands above with consumer-specific pinned config if harness-eval is part of the authorized run. Unassisted/assisted designation is established before subject launch. Permissions follow that consumer's authority; public source/report publication is separately authorized and raw private transcripts stay out of Ruach.

Acceptance: a real task report with checkable revisions, observed role/skill use, scope and outcome, verification gaps and actual reviewer/owner disposition exists. An isolated fixture or fabricated task report does not meet this row. Proposed Ruach branch/report are in the package table; consumer branch name is checked unused in its repo. Delivery/merge belongs to the explicitly assigned and authorized delivery Implementer. The consumer Coordinator personally releases task sessions/native workspaces/worktrees under retention policy; the smoke worker does not perform that release. Any explicit consumer override of that role boundary must be recorded separately, not inferred from generic task authorization. Verification subprocess/offline scratch cleanup remains bounded by the assigned scope.

## R3 interface and deferred dependencies

R1/R2 provide R3 with stable package IDs, authority vs proposals, base/candidate/tested/reviewed/report references, dependency reasons, ownership table, branch/name/resource claims, waiting authorizations, blockers and next action. The R3 task record should retain the chosen input SHA plus frozen-doc provenance, observed CI attempt, paid-run authorization scope, receipt IDs as uncertain/verified, and last handled report state. R3 chooses record location/format; this plan does not create a parallel ledger or edit its specimens/roles. Existing changelog summaries do not stand in for owner decisions.

Record the accepted `R3-B → R-IN final changelog-edit phase` edge and actual resource revisions for R1 smoke in that existing task record. R1-D/R2-I/R2-L/R2-B and R3-A can otherwise start independently when authorized; R3-B waits for accepted R3-A, with disjoint R3-C preparation governed by its own plan. These are proposed implementation dependencies, not permission to start work or later planning batches. Held-out R3 packet corrections belong to its Architect; this plan does not claim they have been applied or reviewed.

R4 may use actual permission/commit/socket failures from these packets; R5 can use startup/awaiting-input evidence and preserved uncertain resources; R6 can use separate code-tested/reviewed/evidence SHAs and later delivery receipt; R7 can classify the measured failures. Those packages are deferred, not prerequisites for R1-D/R2 offline fixes. M1 can reuse prepared fixtures/evidence definitions after R1, but paid measurement and usage claims remain unproved. C1–C5 and their packaging/adapters/workflows are outside this plan; R3's record and proven R1 runtime routes are useful later inputs, not permission to start them.

## Readiness

The first executable unit is R1-D; R2-I/R2-L are bounded designs for future authorized implementation and can proceed independently. R2-B can gather offline boundary evidence; live worktree-only inspection needs its assigned daemon resources. Hosted cause remains an investigation gap. Paid native runs, a real consumer scope, external writes and optional replacement-ref compatibility changes remain owner decisions. None blocks completion of this Architect planning assignment. No implementation, additional worker, native model request, push, merge, tag or global installation was performed.

Round-3 own-plan corrections address B1-A-001/B1-A-003 and B1-B-01; compatible shared-edit suggestions are folded into the existing interface. Exact revised-pair agreement remains pending round 4. The same two authorized sessions follow sequential batches for up to five total agreement rounds or recorded arbitration; the next batch waits for that agreement/arbitration gate.
