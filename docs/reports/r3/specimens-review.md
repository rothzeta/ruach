task: RUACH-ROADMAP-IMPLEMENTATION/R3-A-RV
status: complete
outcome: "Changes requested: three blocking findings in the filled specimen and multi-unit assignment (resource ownership/cleanup omitted; progress/phase state omitted; WORK-03 v2 reuses the superseded partial branch, contradicting its own scope and acceptance) and three optional findings. Decision/authority/supersession/ambiguity contracts, preserved small example and npm test permissions, links/anchors and all required checks are otherwise confirmed."
reviewed_revision: 725041b2d54ce131c3d20679ca564fdde2b8ddb6
candidate_revision: 95f1712fbcda4cb676c5cba86e9fe30cdd032eaa
tested_revision: 725041b2d54ce131c3d20679ca564fdde2b8ddb6
baseline: 033b10c748da004e1675c893756979a22c0f6336
artifacts:
  - docs/reports/r3/specimens-review.md
  - docs/assignments/r3/specimens-review.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r3a-review-IpqD/candidate; git checkout --detach 725041b2d54ce131c3d20679ca564fdde2b8ddb6 (HEAD verified); all commands below ran with cwd = that clone root"
  - "Frozen plan /tmp/ruach-implementation-20261011/inputs/next-coordination-plan.md SHA-256 13e0ca350c59567a845b2aa4486636e3cb199be938dd40bdbda990ac4937e9ed matches the R3-A assignment"
  - "just install: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0 (v0.3.0 verified)"
  - "bun run test: exit 0, 98 pass 0 fail across 10 files (root suite; excludes skill suites)"
  - "skills/ruach-handoff: bun install --frozen-lockfile && bun test: exit 0, 28 pass 0 fail"
  - "git diff --check 033b10c 725041b: exit 0; changed paths limited to the four R3-A-owned files"
  - "Manual: changed anchors (#authority-and-decisions, #before-sending-an-assignment, #filled-interrupted-task-specimen) match headings; relative link targets exist; resume trace and multi-unit assignment compared line by line with the record and the frozen plan R3-A field contract/specimen"
review:
  - "Blocking B1: filled specimen omits resource ownership, state, observation and cleanup owner/condition"
  - "Blocking B2: filled specimen omits progress/phase events, current phase and blocker list"
  - "Blocking B3: WORK-03 v2 reuses the superseded partial branch/worktree, contradicting its base, scope, acceptance and the branch-unused check"
  - "Optional O1: resume trace omits re-reading raw decision sources and confirming the ended help worker/retained partial before v2"
  - "Optional O2: v2 example does not meet several items of its own checklist"
  - "Optional O3: small context losses versus the frozen specimen (WORK-03 paused on DEC-002 change; WORK-04 not integrating superseded help branch)"
discoveries:
  - "R3-A commits 95f1712/725041b sit on branch ruach/r2-install-lock on top of the R2-I commits whose review (4042b8f) requested changes; integration must take the R3-A delta separately from the unaccepted installer work."
  - "agents/coordinator.md and docs/coordination.md were not changed and remain consistent with the new resume wording; alignment of role prose is R3-B scope."
blockers:
  - "B1-B3 must be corrected by the R3-A Implementer and re-reviewed before R3-B treats the R3-A contract as settled."

# R3-A-RV independent specimen review

Scope: exact diff `033b10c..725041b`. `95f1712` changes `docs/examples/task-record.md` and `docs/examples/assignment-specimen.md`; `725041b` only adds `docs/assignments/r3/specimens.md` and `docs/reports/r3/specimens.md`. The review is static, of the source contract only; it claims no behavioral outcome. Inputs: the frozen plan R3-A packet, the task-record contract, the assignment completeness checks and the filled specimen, plus the R3-A assignment and report and the adjacent `agents/coordinator.md`, `docs/coordination.md` and `skills/ruach-workflow-feature/SKILL.md` for consistency. No source, test or specimen file was edited. The disposable clone in `/tmp/r3a-review-IpqD` was removed after this report was written.

## Confirmed

- Owner words, sources, dates and stable IDs (`DEC-001`..`005`, `REPLY-001`, `OPS-001`, `AUTH-001/002`) are present. Proposals (DEC-004 worker, DEC-005 Coordinator), owner choices and operational choices (OPS-001) are distinct rows.
- Supersession runs both ways: DEC-002 says "superseded by DEC-003", and DEC-003 says "supersedes DEC-002", naming WORK-03 v2. It is scoped to placement only.
- REPLY-001 stays unresolved across both plausible targets, with one narrow question. It neither widens nor revokes AUTH-001.
- The resume wording "does not assume an earlier approval still applies" is replaced by scope validation (`task-record.md:22`, `:47`). AUTH-001 is reused only after the refreshed target, the combined review and a revocation check.
- WORK-02 stays running because of the newer 09:17 observation. The handled list covers WORK-01 and the WORK-03 partial. The pre-wait report rule is stated. Queued units carry dependency reasons, and WORK-04's base is explicitly unresolved until launch.
- The AUTH-002 route override is scoped to WORK-02 and grants no retry or global authority.
- The original PROJ-142 record and the impl-1 assignment, including its `npm test` permissions, are unchanged. No tool, schema, role or consumer policy is added, and roles/workflows are linked, not copied. Fixture refs are labelled synthetic and appear in no handoff field.

## Blocking findings

### B1: the filled specimen has no resource ownership or cleanup owner

- **Location:** `docs/examples/task-record.md:91-100` (no resource section). The only allocation is inside the WORK-02 row at `:94`.
- **Problem:** The frozen specimen has a Resource table: each workspace, worktree path, launch temp directory, port, profile, save and branch, with its active/retained/released state, last observation, cleanup owner and release condition. The candidate dropped it. What remains is "port 4173, profile `csv-fixture-profile`, save `csv-sample.db`, all reserved to this worker". There is no workspace ID, no worktree path for WORK-02 or WORK-03, no launch temp directory, no per-resource state, and no cleanup owner or condition anywhere in the filled record. The plan's guard "No whole-process kill by port guess" and the reproduction-capture condition are also gone.
- **Why it matters:** Both the R3-A assignment ("paths/base/branch/routes/resources/ports/profiles/saves and cleanup owner") and this review assignment ("resource allocations/cleanup owner") require it. The specimen also fails its own manual check at `:68`: "every resource has an owner, observation and cleanup condition". A resumed Coordinator cannot tell from this record which instances it may release, or when.
- **Direction:** Restore a resources table, covering at least the screen workspace/worktree/temp dir, the port/profile/save, the retained help worktree, the quote branch and the reserved integration branch, each with owner, state, observation and cleanup owner/condition. Compact wording is fine.

### B2: the filled specimen has no progress or phase-event state

- **Location:** `docs/examples/task-record.md:74-100`.
- **Problem:** The candidate's own contract table has "Progress and next action" (phase, gates, blockers with owner and evidence) and "Phase events" rows (`:56`, `:63`). The frozen specimen fills them: the phase history from 08:20 to 09:20, "Current phase: implementation, not review/delivery", the blocker list and the ordered next actions. The candidate omits all of it. There is therefore no evidence in the example that DEC-003 was persisted before inline-help work stopped (plan R3-D03, "persist before acting"), and no stated current phase or blocker list.
- **Why it matters:** R3-A acceptance requires the "realistic synthetic example covers all specimen requirements". The resume trace can't confirm phase or gates from the record. Later packages (R5/R6) reference these fields.
- **Direction:** Add a short phase-event history and a current progress line (phase, blockers with owner, next actions).

### B3: the WORK-03 v2 example reuses the superseded partial branch, contradicting its own scope

- **Location:** `docs/examples/assignment-specimen.md:51` ("existing worktree, branch task/csv-142-help (retained), base fixture/r0"); `docs/examples/task-record.md:95` ("Reuse the existing branch"); WORK-04 at `:96`.
- **Problem:** The record puts `task/csv-142-help` at `fixture/export-partial`, which contains the superseded inline `src/ui/export-help.ts` work, and its worktree holds the uncommitted partial diff. The v2 assignment:
  - claims base `fixture/r0`, which is not that branch's tip;
  - forbids edits under `src/ui/` and merging the inline work;
  - requires "the export screen carries no inline example".

  On the reused branch, that acceptance is unreachable without editing the forbidden `src/ui/`. Otherwise the obsolete inline code flows into WORK-04, whose row no longer says not to integrate the superseded help branch blindly.

  The frozen resume sequence chooses an unused replacement branch, such as `task/csv-142-help-v2`, after checking refs and worktrees. The candidate's checklist item 3 ("Branch name checked unused") and the record's own "any replacement branch must be new and unused" also conflict with reusing a retained, dirty worktree.
- **Why it matters:** This is the public copyable example Coordinators are told to imitate. As written, it directs work onto superseded content and gives an internally impossible acceptance.
- **Direction:** Use a new, checked-unused branch and worktree from the resolved base for v2. Keep `task/csv-142-help`, its worktree and `help.diff` retained as evidence. Restore WORK-04's guard against integrating the superseded branch.

## Optional findings

- **O1, resume trace** (`task-record.md:104-109`). Unlike the frozen sequence and the contract at `:47`, the trace does not re-read the raw DEC-001/003, AUTH-002 or REPLY-001 sources. It also does not confirm that `csv-help` ended and that the partial branch and diff remain before v2 is assigned. Add both steps.
- **O2, v2 against its own checklist** (`assignment-specimen.md:50-64`).
  - The consumer authority (`GUIDANCE.md`) and the task-scope decision DEC-001 are not cited.
  - Verification lacks a working directory and bounds.
  - The report path `docs/reports/CSV-142/help.md` differs from the record's `reports/CSV-142/...` convention.
  - "Dependencies: none to start" omits the satisfied predecessor: the observed ended WORK-03 v1 and the retained partial.
- **O3, minor context loss.** DEC-002 no longer records that WORK-03 was paused when placement changed.

## Limitations

- Static review only. No behavioral or model evaluation, native launch or hosted CI result is established.
- The fixture refs are illustrative and were not resolved.
- The root `bun run test` does not include skill suites; only the handoff skill suite was additionally run.
