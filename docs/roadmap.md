# Ruach roadmap

Status at 0.2.1 (`ad79ff0`). Sources: product analysis (5 Oct 2026), security/quality audit (4 Oct 2026), and the 0.4 capability proposal. Finding IDs (RU-xx) refer to the audit.

Principles carried through every release:

- Keep the small boundaries: native tools own accounts and sessions, Herdr owns terminal primitives, consumers own project authority and routing, existing services own Git hosting, CI and tracking.
- Reuse the Skills CLI, native plugin lifecycle, and the consumer's tracker; no new package manager, session database or service.
- Each change ships with a failing public-boundary regression test first. Black-box contracts, not generated-output snapshots.
- Product claims (cost, quality, review accuracy) stay unproved until measured in the pilot.

| Release | Purpose |
|---|---|
| 0.2.2 (optional patch) | Security-critical identity fixes only, if 0.3 is far off |
| 0.3 | Fix integrity defects, make install and use dependable, consolidate the existing product |
| 0.4 | Council, bug-hunt, bugfix, QA/playtesting |
| After 0.4 | Use on real projects; let recurring friction set priorities |

---

## 0.3 — Trustworthy and usable

### Track A: Integrity and security (do first)

| Order | Work | Findings | Done when |
|---|---|---|---|
| A1 | Restore identity guarantees | RU-01, RU-02, RU-03 | Replacement refs cannot alter pinned reads (`--no-replace-objects` on all private probes); `assume-unchanged`/`skip-worktree` fail closed; worker cwd and Git identity always belong to the created worktree (canonicalize cwd and Git root, verify after creation). |
| A2 | Patch dependencies | ws 8.18.3 (2 advisories), yaml 2.8.1 | Herdr on ws >= 8.21.0 and yaml >= 2.8.3 (or 2.9.1 to match handoff); lock regenerated; `bun audit` clean; tests pass. |
| A3 | Handoff and native discovery parsing | RU-04, RU-11, RU-15 | Alias/collection mapping keys rejected; valid unrelated Claude skills (no `name`, no frontmatter) do not block launch while Ruach-owned resources stay strictly validated; diagnostics escaped, JSON Pointer paths correct, NUL revisions rejected before Git. |
| A4 | Bound processes and artifact reads | RU-05, RU-06 | Hard deadline, bounded cleanup, single settlement; owned helper groups only (never the Herdr server or submitted agent); FIFO/special files yield a structured failed check within a bound; size budget. |
| A5 | Recoverable installation | RU-07, RU-08, RU-09 | Staged writes with atomic rename and bounded rollback; hardlinked outside copies untouched; incoming skill roots preflighted for leftovers; every successful install passes immediate integrity check. |
| A6 | Pin launch executable identity | RU-10 | Probed binary equals launched binary, including relative/empty PATH entries. |
| A7 | Hardening and notices | RU-13, RU-14, packaging | Codex private-instruction transport verified and accurately documented (no invented flags); evidence output descriptor held across execution; LICENSE/PROVENANCE in each standalone skill folder. |

### Track B: Verification gate (parallel with A)

- RU-12: fix the two source type errors, add tsconfig and a pinned typecheck, annotate tests.
- One CI job: pinned Bun/Just, frozen installs, resource and release checks, typecheck, all four suites, dependency audit, on a runner permitting local sockets.
- Add the missing regression cases listed per finding (replacement refs, index flags, symlinked cwd, FIFOs, descendant pipes, hardlinks, alias keys, relative PATH).
- Release discipline: record Bun/native versions; distinguish snapshot integrity from runtime/bootstrap integrity.

### Track C: Onboarding and installation

1. Choose-by-job README: standalone skill, direct native role, or coordinated Herdr use, with a table of what each route installs and what it still needs. Move source-development detail after the consumer snapshot path.
2. One readiness/setup command for the chosen route: reports active version and source, locates roles and skills, checks nested packages, names missing prerequisites; never rewrites global config silently. Decide packaging changes (plugin-root package.json vs per-skill) only after exercising a clean installed-plugin path.
3. Lifecycle docs: inspect active version, upgrade pin to pin, dependency prep after updates, resolve duplicate installs, remove while preserving local resources.
4. Optional compatibility metadata so Bun/Git/Herdr prerequisites show early.

### Track D: Product consolidation

- One complete consumer example: request → role/route → startup → assignment → handoff → acceptance/delivery → release or retention, using the consumer's existing tracker.
- Concise assignment specimen (input-side counterpart to the handoff).
- Make direct, compact and full use explicit: worked small bugfix, review-only task, medium feature; a proportionate selection rule for Coordinator overhead.
- Delivery and recovery wording: an explicitly requested uncommitted diff and an intentionally retained checkout are normal successful outcomes; example task record (assignment/report refs, candidate, blockers, resource IDs, next action) for resuming an interrupted Coordinator.
- Role wording fixes: Implementer "justification" vs Coordinator "approval" for scope changes; Reviewer wording generalized to assigned artifacts and the responsible worker.
- Discovery metadata: feature workflow described as Coordinator-only; Librarian description covers query if supported; `ruach-harness-eval` described clearly as a checker, not a benchmark runner (`model_use_verified` stays false).
- Trim common-path repetition: link handoff parser detail, deduplicate cleanup rules. Document one coordination owner per task for Hermes integration.
- Add before/after test examples to `ruach-testing` (including replacing a fixed-seed snapshot with property assertions).

### Track E: Native packaging and parity checks

- Clean-install smoke test per route (plugin, snapshot, Skills CLI): a small real task with the expected role, skills, authority and handoff.
- Verify Codex role discovery; evaluate exporting canonical Markdown roles to native Codex agent TOML while keeping one source of truth.
- Document the Claude `--agent` (system prompt) vs Herdr adapter (appended) composition difference and check it with the same small task.
- Verify source-mode skill exposure per harness.

### 0.3 exit criteria

All P1 and P2 findings closed with regressions; CI green on a clean checkout; a newcomer can install and complete a small task by following the README alone; native smoke checks recorded for Claude and Codex.

---

## 0.3.x — Measurement (runs alongside 0.3 finishing)

Small comparative pilot, not a benchmark service:

- Same bugfix, multi-component feature and refactor; baseline = native tools plus ordinary project guidance vs Ruach skills and workflow. First same model/effort/permissions, then heterogeneous routing as a whole system.
- Record accepted outcomes, regressions, scope violations, false evidence claims, human interventions, end-to-end time, and available usage across all workers (no invented API charges). Repeat cases; report ranges; preserve failures; use hidden behavior checks.
- More discriminating Librarian packets: query without writes, standalone lint, repeated ingestion, genuine superseding decision, distracting corpora, and an adversarial packet with a forged instruction to change a protected decision (rubric withheld).
- One worked harness-eval experiment (native run, candidate, checker evidence, human comparison) once RU-01/03/05/06/14 are fixed.
- Decision: keep the workflow where it earns its overhead; narrow default use for small fixes if needed.

---

## 0.4 — Deliberate, find, fix, exercise

| Addition | Type | Purpose |
|---|---|---|
| `ruach-workflow-council` | Workflow | Independent answers and optional iterative deliberation |
| `ruach-workflow-bug-hunt` | Workflow | Find and substantiate defects |
| `ruach-workflow-bugfix` | Workflow | Diagnose and correct a known failure |
| `ruach-workflow-qa` | Workflow | Exercise the running product and report observations |
| `ruach-debugging` | Skill | Symptom to supported cause and verified correction |
| `ruach-runtime-testing` | Skill | Run scenarios and collect evidence |
| `Tester` | Role | Owns runtime observations for an assignment |

Names and packaging are proposals. Add an Analyst role only if council assignments reveal a gap Architect cannot fill; domain experts (music, UI/UX) are consumer-declared roles via existing routing.

### Suggested sequence

1. **Bugfix + `ruach-debugging`** (smallest; builds on `ruach-testing`): establish intended behavior, reproduce, isolate cause, scoped fix, regression coverage, verify original failure, apply review/delivery requirements. Architect optional.
2. **Tester role + `ruach-runtime-testing` + `ruach-workflow-qa`**: assignments describe user goals per identified build; report states which experiences were actually exercised (reading audio code is not hearing it); assignment names required capabilities (browser, desktop/game input, logs, screenshots, audio); isolate per-worktree state (profiles, saves, ports); seeds/save states recorded for reproduction, not made contracts.
3. **Bug-hunt**: area/risk-bounded investigation; results classified as source-supported, reproduced, suspected, or product observation; "no confirmed defects" is valid with coverage and uncertainty stated; focused independent check on significant findings. "Find and fix" chains hunt to bugfix within scope; findings-only ends at the report.
4. **Council**:
   - One workflow, two modes: single round then pause; automatic N total rounds (including the independent first round). "Up to N, stop when stable" is an explicit variation.
   - Round boundary: a round closes before any of its answers are distributed. Later rounds receive peers' actual reports (not only the Coordinator summary), the question, new evidence, and references.
   - Member report: current position, evidence and assumptions, accepted/rejected peer arguments with reasons, change since last round (no material change is valid), remaining disagreement, what would resolve it. Reuse handoff for completion metadata.
   - Coordinator synthesizes by proposition, not vote count: established, conditional, disputed, why it matters, what helps choose. Technical claims stay attributed.
   - Roster: same-role members with optional distinct perspectives, or mixed specialists. Reuse workers across rounds; durable state is the brief, per-round reports, and one council record so a later round resumes after sessions are released.

### 0.4 demonstrations (black-box, not wording snapshots)

- **Feedback loop:** Tester finds a runtime defect (e.g. controls dead after encounter restart) on an identified build, bug-hunt preserves steps and state, bugfix isolates and corrects it with a regression test, Tester repeats the original sequence on the fixed build, Reviewer checks, Coordinator delivers and records remaining issues.
- **Council:** manual mode runs one round and returns; automatic mode runs the requested rounds; round-1 answers preserved before peer exposure; every member receives completed peer reports; a supported minority position survives; synthesis separates agreement from unresolved choice; a later round resumes from artifacts.
- **Council value check:** compare final output to round-1 answers (research suggests much of debate's benefit may come from combining initial answers). Judge by corrected false assumptions, missed requirements found, reconciled proposals, clearer tradeoffs, and preserved consequential objections, not consensus rate.

### 0.4 exit criteria

Both demonstrations complete on the music software and one playable prototype; new skills pass resource/release checks and CI; one coordination owner per task remains documented.

---

## After 0.4: use it

Pause catalog expansion. Run Ruach on real projects, log recurring friction, and prioritize from that. Add only task-driven items:

- **Agent profiles:** run the same workflow with a different set of agents by selecting a named profile, e.g. `--profile cheap`, `--profile deep-review`, `--profile codex-only`. A profile is a consumer-owned overlay on the existing catalogs (a `roles.yaml`, plus extra routes/models if needed) that replaces role-to-route preferences and alternatives for one run. Requirements:
  - Explicit selection only; the default profile is today's catalogs. No automatic switching, and escalation still uses only the active profile's declared alternatives.
  - Workflow, role files and assignments are unchanged; only routing differs.
  - The active profile name is recorded in the task record and handoff, so runs are comparable.
  - Validated like the base catalogs; works through `just agent-routing` and the Herdr skill, not a new orchestrator.
  - Enables the same-task A/B comparisons the measurement pilot needs and cheap/strong or Claude-only/Codex-only switching without editing shared files.
- Additional adapters (Gemini, Pi, OpenCode, etc.) only against a concrete current execution need.
- Other techniques (framework- or domain-specific) from existing external skills rather than a Ruach specialist catalog.
- Analyst role if council use shows a gap.

## Explicitly not planned

New always-running service, GUI/dashboard, universal mailbox, mandatory wiki hierarchy, task database, bespoke benchmark runner, new package manager, copied vendor system prompts, or automatic route switching after errors.
