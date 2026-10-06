# Changelog

Repository releases use Semantic Versioning and annotated `vMAJOR.MINOR.PATCH` Git tags. Release tags are immutable.

## 0.3.0 — Unreleased

Planned scope, per the [roadmap](docs/roadmap.md). Items marked "delivered by another worker" are not part of this documentation change and are listed only as plan.

Track A, integrity and security (delivered by other workers):

- Identity guarantees for pinned reads, index flags and worker checkouts; patched `ws` and `yaml` dependencies.
- Stricter handoff and native-discovery parsing; bounded processes and artifact reads; pinned launch executable identity.
- Recoverable snapshot installation with staged writes, rollback and an immediate integrity check, as designed in [the 0.3 design](docs/design/0.3-install-and-readiness.md).
- Hardening and per-skill LICENSE/PROVENANCE notices.

Track B, verification gate (delivered by other workers): typecheck, a CI job over all suites and audits, and added regression cases.

Track C, onboarding and installation:

- Choose-by-job README (standalone skills, direct native role, coordinated Herdr use) with what each route installs and still needs; source-development detail moved after the consumer paths.
- Lifecycle guide in the operations guide: inspect, upgrade pin to pin, prepare dependencies, resolve duplicates, remove while preserving local resources.
- Optional `compatibility` metadata on executable skills so Bun, Git and Herdr prerequisites show early; `just check` now validates it and requires Bun to be declared by executable skills.
- A readiness command (`just ready`) is planned in parallel work; this entry does not describe its behavior.

Track D, product consolidation:

- Worked consumer example, assignment specimen, direct/compact/full use guide with a proportionate-overhead rule, task record example for resuming a Coordinator, and a one-coordination-owner-per-task note.
- Wording: uncommitted diffs and retained checkouts are normal delivery outcomes; Implementers justify scope changes and the Coordinator approves; Reviewer covers assigned artifacts and the responsible worker. No role authority changed.
- Discovery metadata: the feature workflow is described as Coordinator-only, the Librarian covers queries, and `ruach-harness-eval` is described as a checker, not a benchmark runner (`model_use_verified` stays false).
- Shorter common paths: handoff validator output details moved to a reference; cleanup rules stated once in the Coordinator role.
- Before/after examples in `ruach-testing`, including replacing a fixed-seed snapshot with property assertions.

Track E, native packaging and parity checks (delivered by other workers or follow-up): clean-install smoke tests per route, Codex role discovery, Claude/Herdr composition notes and source-mode skill exposure checks.

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
