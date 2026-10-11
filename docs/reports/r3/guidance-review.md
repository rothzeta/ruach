task: RUACH-ROADMAP-IMPLEMENTATION/R3-B-RV
status: complete
outcome: "No blocking findings for R3-B. The Coordinator and Architect guidance, coordination and example docs, the single R3 Unreleased bullet and the narrow P1/P2 task-record amendment meet the R3-B contract and preserve accepted R3-A invariants and role boundaries. Three optional wording findings."
reviewed_revision: 3d512e7866f5472ce5c3a92043f8de6e04fb38f7
candidate_revision: b0effa2766be681e757380636128391e94a4f847
tested_revision: 3d512e7866f5472ce5c3a92043f8de6e04fb38f7
baseline: 123ade32ad05b980cb3efa14abff08b2503193e5
artifacts:
  - docs/reports/r3/guidance-review.md
  - docs/assignments/r3/guidance-review.md
verification:
  - "Fixture: git clone --shared --no-checkout /opt/dev/ruach /tmp/r3b-review-HKW2/c; git checkout --detach 3d512e7866f5472ce5c3a92043f8de6e04fb38f7 (HEAD verified); cwd = clone root; uid 1000, Bun 1.4.2; heavy checks under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock"
  - "Frozen plan next-coordination-plan.md SHA-256 13e0ca350c59567a845b2aa4486636e3cb199be938dd40bdbda990ac4937e9ed (matches the R3 assignments)"
  - "just install: exit 0"
  - "just check: exit 0 (relative link targets included)"
  - "just release-check: exit 0 (v0.3.0; package, plugin, marketplace, agents and changelog verified)"
  - "bun run test: exit 0, 100 pass 0 fail (root suite; excludes skill suites)"
  - "skills/ruach-handoff bun test: exit 0, 28 pass 0 fail (supporting existing-contract suite)"
  - "git diff --check 123ade3 3d512e7: exit 0. Changed paths are exactly the seven owned guidance paths plus the R3-B assignment and report. The task-record hunks are only the two added event rows and the port/profile/save cleanup row"
  - "Manual: new and changed links (task record, assignment specimen, changelog hook SKILL.md) resolve; the only heading change is the added Coordinator section '## Durable record and resumption'; authority trace below"
review:
  - "Optional O1: the Coordinator role links the assignment specimen but does not state the pre-send check duty"
  - "Optional O2: 'A changed target' in the consumer-example delivery text may be read as including a moved main"
  - "Optional O3: the CHANGELOG bullet attributes the decision-write and compaction duties to both roles"
discoveries:
  - "Workflow-body compatibility rests solely on the Coordinator-supplied observation (both canonical feature and knowledge bodies preserve independent worker technical checks, review, delivery and cleanup, and valid scoped authority, with no required contradiction). I did not open or search any workflow body in this review and cannot independently certify it. No source-contract mismatch was found that would need body inspection."
  - "Shared-file gate: R3-B is the sole R3 Unreleased writer (one bullet, placed above the existing changelog-hook entry). R-IN's final CHANGELOG edit must wait for the independently accepted exact B commit, refresh the file, preserve the R3 bullet and then add the R1/R2 entries. This review supplies the independent technical review only; acceptance is the Coordinator's disposition."
blockers: []

# R3-B-RV independent guidance review

Scope: `123ade3..3d512e7`, where `b0effa2` holds the guidance and `3d512e7` adds the assignment and report.

Inputs:
- the frozen `next-coordination-plan.md` R3-B packet, task-record and assignment contracts, common rules and interfaces;
- the accepted R3-A specimens at `123ade3`;
- `AGENTS.md`, `CONTRIBUTING.md` and the ownership ADR as project guidance.

The installer and the moving smoke packet are outside this review's scope. Static review only; no behavioral claim. No file was edited. The disposable clone was removed after this report was written.

## Authority trace: confirmed

- **Decision and phase writes before dependent action.** `agents/coordinator.md:46` requires the exact owner words and source in the record before acting, and phase/work/resource writes before dependent actions. Writing is kept separate from committing, under consumer policy.
- **Compaction and resume.** `:47` requires re-reading the record and the raw decision, authorization and ambiguity sources, not only a summary.
- **State reconciliation and liveness.** `:48`: age, silence or an ownership change does not show a worker ended. Running sessions, partial work and requested diffs are kept.
- **Report identity.** `:49` requires observed and handled identity, with each report consumed once and no relaunch on evidence-only commits.
- **Proposals versus choices.** `:50` keeps proposals, owner choices and operational choices apart. A recommendation or a merge is not adoption, and supersession does not revoke unrelated authority.
- **Authorization.** `:51` reuses still-valid authorization without re-asking. It re-asks only when authority is missing, ambiguous, revoked, expired or relevantly changed, and keeps ambiguous replies while independent work continues. Harness permissions are not owner authorization, and native security dialogs are never approved for a worker, so the user keeps that authority.
- **Singular owner.** `:44` says the record is the Coordinator's alone. `docs/coordination.md` keeps one owner, and the changelog hook is only a breadcrumb.
- **Boundaries unchanged.**
  - The Coordinator Boundaries (`:72`) still forbid implementing, testing, validating, reviewing, integrating or merging, and the cleanup duty is unchanged.
  - The Architect still "Never perform[s] implementation work" and limits file changes to design and planning artifacts.
  - The new Architect bullet requires bounded packages with disjoint source/tests/support/docs ownership, dependency and serial-step reasons, base/branch/resource needs and a copyable first assignment. It leaves scheduling and routes to the Coordinator and says "do not coordinate workers".
  - No automatic routes, substitution or global policy are added.
- **Scaling.** `direct-compact-full.md` gives direct work no record, compact work a small record and full work the fuller sections, and adds no bookkeeping elsewhere. The table itself is unchanged.
- **Consumer example.** Delivery authorization now has to be recorded and still valid for the action and target. It survives interruption and is reused, and silence is not authorization. The existing moved-`main` refresh paragraph and the cleanup section (branches and diffs retained, Coordinator releases) are unchanged.
- **P1/P2 amendment.**
  - The port/profile/save row now names the Coordinator. It uses the session row's condition (report handled, commits reachable, needed reproduction captured) and keeps the identity-confirmed stop with no kill by port number.
  - The event table adds 09:05 REPLY-001 (unresolved, adopt neither) and 09:17 `csv-screen` still working (keep WORK-02 running).
  - Both facts match existing record rows, and no other specimen text changed, so the R3-A invariants are preserved.
- **Packaging.** No role or skill packaging, version, routing or manifest changes. `release-check` still verifies the agents.

## Optional findings

**O1: the pre-send check duty is not stated in the role.**
- **Location:** `agents/coordinator.md:44`.
- **Problem:** The role says the assignment specimen "lists what each assignment carries". It does not say that the Coordinator checks each outgoing assignment against the specimen's "Before sending an assignment" checklist (plan R3-D02). `consumer-example.md` §3 mentions the checklist, but the role is the binding source.
- **Direction:** Add a short clause to the role, for example: "check each outgoing assignment against its pre-send checklist".

**O2: "a changed target" could be read as including a moved `main`.**
- **Location:** `docs/examples/consumer-example.md` §6.
- **Problem:** "A changed target or a revocation needs a new owner answer." The accepted A contract says a moved destination needs refreshed integration, checks and review but does not erase valid local-delivery authorization. The next paragraph handles a moved `main` that way, but a resuming reader could ask the owner again unnecessarily.
- **Direction:** Write "a different target branch". Optionally add that a moved `main` only needs refreshed integration, checks and review.

**O3: the CHANGELOG bullet merges the two roles' duties.**
- **Location:** `CHANGELOG.md` Unreleased R3 bullet.
- **Problem:** "The Coordinator and Architect roles require decision and phase writes … and disjoint work packages" attributes the write, compaction and reconciliation duties to both roles. Only the Coordinator has them; the Architect has the packages.
- **Direction:** Split it, for example: "the Coordinator role requires …; the Architect role proposes disjoint work packages."

## Limitations

- No behavioral, native or model evaluation.
- Workflow-body compatibility is not independently certified (see discoveries).
- R-IN integration, the final combined candidate and hosted CI are not assessed here.
