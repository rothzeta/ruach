task: RUACH-ROADMAP-IMPLEMENTATION/R3-A-RV2
status: complete
outcome: "No blocking findings. Prior blocking B1-B3 and optional O1-O3 are resolved in the corrected R3-A specimens at the reviewed revision; original R3-A acceptance and the small PROJ-142/npm test examples are preserved. Two optional clarity findings remain."
reviewed_revision: 123ade32ad05b980cb3efa14abff08b2503193e5
candidate_revision: ed7d4dca369068481bf615f57afb9700e8c87e6a
tested_revision: 123ade32ad05b980cb3efa14abff08b2503193e5
baseline: 725041b2d54ce131c3d20679ca564fdde2b8ddb6
artifacts:
  - docs/reports/r3/specimens-review2.md
  - docs/assignments/r3/specimens-review2.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r3a2-review-Dqh4/c; git checkout --detach 123ade32ad05b980cb3efa14abff08b2503193e5 (HEAD verified); uid 1000, Bun 1.4.2; heavy checks ran with cwd = that clone root under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock"
  - "just install: exit 0"
  - "just check: exit 0"
  - "just release-check: exit 0 (v0.3.0 verified)"
  - "bun run test: exit 0, 100 pass 0 fail across 10 files (root suite; excludes skill suites)"
  - "skills/ruach-handoff: bun install --frozen-lockfile && bun test: exit 0, 28 pass 0 fail"
  - "git diff --check 877fc68 123ade3: exit 0; changed paths are only docs/examples/task-record.md, docs/examples/assignment-specimen.md, docs/assignments/r3/specimens-fix1.md and docs/reports/r3/specimens-fix1.md"
  - "git diff -U0 725041b 123ade3 -- docs/examples: hunks start at assignment-specimen.md:51 and task-record.md:81, so the PROJ-142 record, escalation entry, impl-1 assignment and its npm test permissions are byte-identical"
  - "Manual: anchors #authority-and-decisions, #before-sending-an-assignment and #filled-interrupted-task-specimen still match headings; relative targets exist (just check); resume trace steps 1-6 traced against the decision, work, handled-report, progress, event and resource sections"
review:
  - "B1 (prior): fixed"
  - "B2 (prior): fixed"
  - "B3 (prior): fixed"
  - "O1-O3 (prior): resolved"
  - "Optional P1: port/profile/save row names no cleanup owner, and its release trigger is looser than the WORK-02 session row"
  - "Optional P2: phase-event table omits the 09:05 REPLY-001 record and 09:17 WORK-02 observation events"
discoveries:
  - "No workflow SKILL body was opened or searched during this review; compatibility with workflow bodies remains Coordinator-owned."
  - "Installer changes in the intervening history (ac55d44/877fc68) were reviewed separately (b0d63bf) and are not assessed or approved here."
blockers: []

# R3-A-RV2 re-review of the corrected specimens

Scope: the R3-A delta `877fc68..123ade3`. `ed7d4dc` changes the two specimen docs; `123ade3` adds the fix assignment and report. Inputs: the frozen `next-coordination-plan.md` R3-A packet, the task-record and assignment contracts and the filled specimen, plus my previous review `ebe14e7` and the author's dispositions in `docs/reports/r3/specimens-fix1.md`. The review is static and covers the source contract only; no behavioral outcome is claimed. The synthetic fixture refs are illustrative and were not resolved. No document was edited. The disposable clone `/tmp/r3a2-review-Dqh4` was removed after this report was written.

## Prior findings

- **B1, fixed.** `task-record.md:113-121` adds a resource table. The WORK-01 branch, the WORK-02 session/workspace/worktree/branch/task temp, the port/profile/save, the WORK-03 v1 worktree/branch/diff/worker, and the reserved v2 and WORK-04 branches each have an owner, state and observation, and a cleanup condition. Reuse is stated. The port row forbids killing by port number or process tree, requires confirming the identity of the recorded process, and retains captured reproduction until the report is handled. See P1 for one residual gap.
- **B2, fixed.** `task-record.md:104` gives the current phase, gates met and pending, ordered next units and the blocker with its owner and scope. The event table at `:106-112` shows DEC-001 and DEC-003 written before the dependent assignment or stop, which is plan R3-D03. Resume step 5 records the intended v2 launch before sending it.
- **B3, fixed.** The v2 assignment (`assignment-specimen.md:51-54`) and the WORK-03 row use a new branch `task/csv-142-help-v2` and a new worktree. Both are checked unused, on `fixture/r0` resolved at launch. The old branch, worktree and `help.diff` are read-only, retained evidence. Acceptance ("changes no file under src/ or tests/") is now reachable within scope. WORK-04 (`:96`) integrates only the accepted WORK-01, WORK-02 and v2 commits and explicitly excludes the superseded branch and diff.
- **O1, resolved.** The resume trace re-reads the raw DEC-001/003, AUTH-002 and REPLY-001 sources (step 1). It confirms that `csv-help` ended and checks the branch and diff against the manifest digest before v2 (step 2).
- **O2, resolved.** v2 cites `GUIDANCE.md` and the exact words of DEC-001 and DEC-003. It gives the working directory and a 300 s bound, uses the record's `reports/CSV-142/...` path, and lists its satisfied predecessor.
- **O3, resolved.** DEC-002 records the WORK-03 pause.

## Original acceptance rechecked

- Owner words, sources, dates and stable IDs are present. Proposals, owner choices and operational choices are separate rows. Supersession runs both ways, and REPLY-001 is unresolved, with a narrow question and independent units continuing.
- AUTH-001 is reused only after scope validation. It is unconsumed and unrevoked.
- Ownership is singular, the newer observation keeps WORK-02 running, and handled reports are not repeated.
- Queued dependencies carry reasons, and the base is resolved at launch. The AUTH-002 route override is scoped to WORK-02.
- No tool, role, schema or consumer policy is added. Roles and workflows are linked rather than copied.
- The small example and its `npm test` permissions are unchanged.

## Optional findings

**P1: the port/profile/save row names no cleanup owner, and its release trigger is looser than the session row's.**
- **Location:** `task-record.md:118`.
- **Problem:** Every other row names the Coordinator as cleanup owner. This row says only "Release when WORK-02 ends", followed by how to stop the process. The WORK-02 session row instead waits until "its report is handled and its commits are reachable". The profile and save may hold reproduction evidence.
- **Why it matters:** A resuming reader could release the allocation, or let the worker do so, before the report is handled. The table's header promises a cleanup owner.
- **Direction:** Name the Coordinator, acting under consumer policy, and align the trigger with the session row: release after the report is handled and needed reproduction is captured.

**P2: the event history omits two events the plan specimen recorded.**
- **Location:** `task-record.md:106-112`.
- **Problem:** The 09:05 "REPLY-001 saved unresolved" and 09:17 "WORK-02 liveness observed" events are not in the table. Both facts do appear elsewhere in the record (the REPLY-001 row, the WORK-02 row and the resource rows).
- **Why it matters:** Only for completeness of the illustration that writes come before actions. No resume decision depends on it.
- **Direction:** Optionally add both rows.

Cosmetic: there is a double blank line before `### Resume trace` (`task-record.md:122-123`). `git diff --check` passes.

## Limitations

- Static review only. No behavioral or model evaluation, native launch or hosted CI result is established.
- A positive R3-A outcome here gates R3-B and R3-C only. It is not full R3 behavioral acceptance, and it does not approve the installer or anything global.
