# Changelog

Repository releases use Semantic Versioning and annotated `vMAJOR.MINOR.PATCH` Git tags. Release tags are immutable.

## 0.3.0 — Unreleased

Scope follows the [roadmap](docs/roadmap.md); evidence is in `docs/reports/0.3/`.

Track A, integrity and security:

- A1: identity guarantees for pinned reads (replacement refs ignored), hidden index flags (`assume-unchanged`, `skip-worktree`), `core.fsmonitor` and tracked files with a Git filter attribute rejected or neutralized by acceptance checks, and verified worker checkouts that ignore inherited `GIT_*` variables.
- A2: patched `ws` and `yaml` dependencies in Herdr.
- A3: strict handoff keys, escaped diagnostics and revision checks; native skill discovery tolerates unrelated skills.
- A4: bounded processes and artifact reads (descendant pipes, FIFOs, oversized files).
- A5: recoverable snapshot installation with staged writes, rename-only commits (outside hardlinks untouched), rollback, leftover checks and an immediate integrity check; interrupted installs fail `check` until recovered manually ([failures and recovery](docs/operations.md#snapshot-installation-failures-and-recovery)).
- A6: pinned launch executable identity (relative and empty `PATH` entries resolved once).
- A7: launches from a Herdr workspace of the same repository create linked worktrees; clean them up with `herdr worktree remove --workspace <id>` (otherwise `git worktree remove`). Standalone launches are unchanged.
- A8: hardening and notices: the evidence output descriptor is held across checks, the Codex instruction transport exposure is documented, and each skill folder ships `LICENSE` and `PROVENANCE.md` verified by `just check`.

Track B, verification gate: typecheck wired into `just check`, a CI job over all suites and audits, toolchain notes, and a regression-case inventory.

Track C, onboarding and installation:

- Choose-by-job README (standalone skills, direct native role, coordinated Herdr use) with what each route installs and still needs; source-development detail moved after the consumer paths.
- Lifecycle guide in the operations guide: inspect, upgrade pin to pin, prepare dependencies, resolve duplicates, remove while preserving local resources.
- Optional `compatibility` metadata on executable skills so Bun, Git and Herdr prerequisites show early; `just check` validates it and requires Bun to be declared by executable skills.
- `just ready` (`ready` subcommand of the installer): read-only readiness check per route (`skill`, `native`, `herdr`) that reports dependencies, duplicates and prerequisites, prints remediation instead of running it, and never writes.

Track E, native packaging and parity: [native-parity.md](docs/native-parity.md) records offline-verified Codex role and skill discovery, per-harness skill exposure, plugin-cache and snapshot installation facts, the Claude `--agent` versus Herdr append difference, a Codex agent TOML export evaluation and a clean-install smoke checklist. Paid smoke checks per route are pending user authorization; plugin packaging and Codex export remain needs-decision.

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
