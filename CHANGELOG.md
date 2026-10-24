# Changelog

Repository releases use Semantic Versioning and annotated `vMAJOR.MINOR.PATCH` Git tags. Release tags are immutable.

## Unreleased

## 0.6.0 — 2026-10-24

- Coordinator and both workflows park in `awaiting-workers`, with no wait timer, native idle waits, model polling or still-waiting messages. Parking retains the session and pending resources; only explicit completion stops monitoring.
- Added a separate Bun external watcher beside the unchanged Herdr launcher: durable lifecycle events and delivery identities, lifecycle waits plus periodic reconciliation, busy/blocked retention, batching, bounded retries, singleton locking, heartbeat checks and restart recovery. The Coordinator remains the sole task-record writer.
- Codex continuation uses its existing native submission queue without terminal prompting, steering, thread creation/resumption, route changes or restarts. Submission, correlated native turn start and durable task-record handling remain distinct. Other Coordinator harnesses fail explicitly; their launch support is unchanged.
- Focused controlled-time tests and an isolated role evaluation cover quiet waiting and duplicate-safe resumption. Native smoke evidence and integration limits are in `docs/reports/releases/0.6.0/external-waiting.md`.

## 0.5.1 — 2026-10-24

- Architect plans the smallest complete increment, preserving every requested outcome while excluding speculative scope. A single cohesive assignment is explicitly valid; splitting requires useful boundaries and concurrency that justify the coordination cost.
- Architect and Implementer prefer clear, direct code, immutable data, pure transformations and explicit state transitions, with necessary mutation kept local and visible. Abstractions serve current requirements rather than line-count reduction.
- Shared testing guidance requires independent contract-derived expectations and tests that exercise their claimed behavior. Public entry points do not make private-helper assertions black-box, and mocks must not bypass the behavior under test.
- Fixed seeds support reproducible failures; ordinary repeatability compares fresh runs, while exact seeded snapshots require a documented seed-to-output compatibility contract. Examples distinguish these promises and explain why membership properties alone do not establish randomization.
- Reviewer links directly to the testing skill and inspects independent expectations, failure sensitivity, tautologies, copied implementation logic, bypassing mocks and unprotected requirements.
- Verification scope: resource/link checks, typechecking and automated repository/skill suites validate packaging and regressions, not agent adherence to the revised instructions. No new agent-behavior evaluation accompanies this patch.

## 0.5.0 — 2026-10-24

- Enabled Pi v1.4+ within major 1: exact native provider/model catalog checks, native thinking levels, additive canonical role instructions through a private extension, and canonical skills loaded on demand. Existing `APPEND_SYSTEM.md`, project context, extensions and native skill discovery remain active.
- Added Goose v1.56+ within major 1: explicit provider/model selection and additive `session --system` instructions containing the canonical role and an on-demand skill index. Effort uses the native default (`auto` in routed profiles). The installed Herdr does not advertise `goose`, so live preparation and startup remain gated before mutation until upstream Herdr supports the kind.
- Added optional Pi/Goose executable detection to readiness, configuration-root forwarding, routing and failure coverage, and documented inherited permissions and ambient workflow visibility limits. Neither adapter maps auto-review or accepts native pass-through flags.

## 0.4.0 — 2026-10-23

- OpenCode 2.1.4+ (v2) launch preparation: private standalone servers inspect native config, models, agents and skills without restarting the shared service. Worker startup preserves native prompts and settings, adds canonical role instructions and technical skills, and denies known workflow names/aliases for non-Coordinators. Models use provider/model IDs; explicit effort must match an offered native variant. Native permissions are inherited; auto-review remains unsupported because OpenCode auto mode performs unconditional approval.
- Preparation verifies the composed native role/model/workflow settings before worktree or launch-space mutation, preserves inline JSONC and selected OpenCode/XDG configuration roots, and terminates owned readers after inspection.

- Consolidated R6/R7 handoff and verification guidance, four offline wave-2 preparation packets, and the multi-machine preparation/council reports onto main. Remaining wave-2 guides, specimens and native/combined acceptance stay open.
- Repaired the communication packet's missing synthetic verifier artifact without weakening its regression assertion; corrected historical verification and engineering/evaluation wording. OpenCode launch support remains gated.

## 0.3.1 — 2026-10-11

Scope follows the [roadmap](docs/roadmap.md); the preparation and evidence summary is in the release preparation report `docs/reports/releases/0.3.1/preparation.md`.

- R1 (local only): the hosted-failing order assertion in the Herdr worker test now sorts the directory listing; no hosted green run, native route result or real consumer-task report exists yet.
- R2 installer: `install` plans from the target state it reads under the `.ruach-staging` lock (drift, roots, conflicts, removals and operation kinds), refuses a symlinked target or ancestor before creating or locking anything, and removes only its own staging; recovery guidance is in [operations](docs/operations.md#snapshot-installation-failures-and-recovery).
- R2 linked launches: a linked-worktree failure keeps the workspace and root pane IDs Herdr returned as recovery hints when valid (they may be null), and a requested `--cwd` that is not an ordinary tree in the base is refused with exit 2 before any checkout. Linked creation by Herdr remains unprotected against replacement refs; that boundary is documented, not fixed, and live Herdr behavior is unverified.
- R3 coordination guidance: the task-record and assignment specimens gain decision, authorization, supersession, report-handling and resource contracts, manual pre-send checks and a filled interrupted multi-unit example. The Coordinator role requires the record duties (decision and phase writes before dependent action, re-reading after compaction, state reconciliation, assignment checks); the Architect role requires disjoint work packages with dependency reasons. No new tool, role or schema.
- Developer evidence packets: `evals/next-release-native-smoke` (offline install/native smoke whose control requires the install, check and frozen dependency steps plus a consistent actual readiness result) and `evals/ruach-coordination` (resume, ambiguity and authorization cases with a separate rubric). `.github/workflows/ci.yml` runs both packets' pinned typecheck and tests after the existing suites. These are prepared offline developer fixtures, not native or behavioral results.
- Accepted roadmap plans: the eight agreed implementation plans for R1–R7, C1–C5 and M1 and the RAMEC disposition map are added under `docs/design/` (index: [next-roadmap-plans.md](docs/design/next-roadmap-plans.md)) with their public planning receipts under `docs/reports/roadmap-planning/`. They are specifications for future assignments, not completed implementation or execution authority.
- `ruach-changelog` skill: opt-in hook script that appends each finished turn (and Claude compaction summaries) from Claude Code, Codex and agy to a consumer-declared JSONL file, plus a command that writes project-level Codex and agy registrations. The Ruach plugin now ships `hooks/hooks.json` (async `Stop`/`PostCompact`), a no-op for projects without `.ruach/changelog.json`.

## 0.3.0 — 2026-10-07

Scope follows the [roadmap](docs/roadmap.md); evidence is in `docs/reports/0.3/`.

Track A, integrity and security:

- A1: identity guarantees for pinned reads (replacement refs ignored) and verified worker checkouts that ignore inherited `GIT_*` variables. The harness-eval clean check stays `git status --porcelain` with fsmonitor and the untracked cache disabled and replacement refs ignored, and now fails closed (exit 2) with `hidden_index_state` for `assume-unchanged`/`skip-worktree` entries and `content_filter_state` for tracked files with a Git `filter` attribute. No output shape changes; these two setup errors are the only new outcomes ([config reference](skills/ruach-harness-eval/references/config.md#clean-check)).
- A2: patched `ws` and `yaml` dependencies in Herdr.
- A3: strict handoff keys, escaped diagnostics and revision checks; native skill discovery tolerates unrelated skills.
- A4: bounded processes and artifact reads (descendant pipes, FIFOs, oversized files).
- A5: recoverable snapshot installation with staged writes, rename-only commits (outside hardlinks untouched), rollback, leftover checks and an immediate integrity check; interrupted installs fail `check` until recovered manually ([failures and recovery](docs/operations.md#snapshot-installation-failures-and-recovery)).
- A6: pinned launch executable identity (relative and empty `PATH` entries resolved once).
- A7: launches from a Herdr workspace of the same repository create linked worktrees (when the launching workspace is itself a linked worktree, the repository's parent workspace is used); clean them up with `herdr worktree remove --workspace <id>` (otherwise `git worktree remove`). Standalone launches are unchanged.
- A8: hardening and notices: the evidence output descriptor is held across checks, the Codex instruction transport exposure is documented, and each skill folder ships `LICENSE` and `PROVENANCE.md` verified by `just check`.

Harness-eval boundary: the evaluator trusts the checkout's Git configuration and is not a defense against a hostile candidate; adversarial certification is not a product promise.

Known gaps and outstanding at this release: the GitHub CI job has not yet run on GitHub; no real consumer-task run has been recorded; paid per-route smoke tests are pending user authorization; plugin packaging and Codex agent TOML export decisions are open.

Track B, verification gate: typecheck wired into `just check`, a CI job over all suites and audits, toolchain notes, and a regression-case inventory.

Track C, onboarding and installation:

- Choose-by-job README (standalone skills, direct native role, coordinated Herdr use) with what each route installs and still needs; source-development detail moved after the consumer paths.
- Lifecycle guide in the operations guide: inspect, upgrade pin to pin, prepare dependencies, resolve duplicates, remove while preserving local resources.
- Optional `compatibility` metadata on executable skills so Bun, Git and Herdr prerequisites show early; `just check` validates it and requires Bun to be declared by executable skills.
- `just ready` (`ready` subcommand of the installer): read-only readiness check per route (`skill`, `native`, `herdr`) that reports dependencies, duplicates and prerequisites, prints remediation instead of running it, and never writes.

Track E, native packaging and parity (documentation only, no code): [native-parity.md](docs/native-parity.md) records offline-verified Codex role and skill discovery, per-harness skill exposure, plugin-cache and snapshot installation facts, the Claude `--agent` versus Herdr append difference, a Codex agent TOML export evaluation and a clean-install smoke checklist. Paid smoke checks per route are pending user authorization; plugin packaging and Codex export remain needs-decision.

Track D, product consolidation:

- Worked consumer example, assignment specimen, direct/compact/full use guide with a proportionate-overhead rule, task record example for resuming a Coordinator, and a one-coordination-owner-per-task note.
- Wording: uncommitted diffs and retained checkouts are normal delivery outcomes; Implementers justify scope changes and the Coordinator approves; Reviewer covers assigned artifacts and the responsible worker. No role authority changed.
- Discovery metadata: the feature workflow is described as Coordinator-only, the Librarian covers queries, and `ruach-harness-eval` is described as a checker, not a benchmark runner (`model_use_verified` stays false).
- Delivery is a separate Implementer assignment (no Merger role), created only after independent review passes on the combined revision and the user's authorization of the named target is confirmed; the worker merges the exact reviewed revision only if the destination has not moved and reports `delivered_revision`.
- Escalation rule in the feature workflow: after a declared number of failed fix/review cycles (default 2), the Coordinator preserves evidence, routes unresolved blockers to the Architect if declared, then uses a declared `alternatives` route only with authorization or reports to the user. Launch failures still never switch routes.
- "Choose your models" README section for `models.yaml`, `routing.yaml` and `roles.yaml`, with a Claude and Codex example that a test keeps valid.
- Shorter common paths: handoff validator output details moved to a reference; cleanup rules stated once in the Coordinator role.
- Before/after examples in `ruach-testing`, including replacing a fixed-seed snapshot with property assertions.

## 0.2.1 — 2026-10-04

- Fixed local Claude marketplace registration to pass an absolute checkout path instead of the unsupported bare `.` source.
- Added `install-plugins` as an alias and an optional plugin-name argument, defaulting to `ruach`.
- Added tests that execute the actual Just recipes from a foreign cwd, including failure handling and literal argument forwarding.
- Native folder-trust/onboarding dialogs now report a verified waiting-for-input state and workspace inspection commands instead of a generic uncertain-startup failure. No prompt is answered automatically.
- Added an operations guide covering installation, consumer launches, native confirmation and recovery.

## 0.2.0 — 2026-10-04

- Worker launches now create isolated Git worktrees and background Herdr workspaces by default, preserving caller focus and layout.
- Added `just architect`, custom worktree path/branch/base options and explicit `--placement pane` compatibility.
- Native configuration is read in the worker checkout before startup; results include checkout, branch, workspace and inspection details.
- Post-mutation failures preserve resources and report recovery state without automatic retry or cleanup.

## 0.1.0 — 2026-10-04

- Initial versioned distribution of six reusable roles and eight Agent Skills.
- Claude Code plugin and marketplace packaging for native skill and agent discovery.
- Standard Skills CLI installation for cross-agent global or project discovery.
- TypeScript/Bun snapshot installer, integrity checker and contract tests; no Python runtime dependency.
- Installation by release version with the resolved commit and file hashes retained for integrity checks.
- Source-development Coordinator and role launches through Just and the Herdr skill.
- Consumer-owned routing and source/consumer ownership boundaries, with separate Librarian evaluation packets.
