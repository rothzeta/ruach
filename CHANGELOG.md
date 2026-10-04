# Changelog

Repository releases use Semantic Versioning and annotated `vMAJOR.MINOR.PATCH` Git tags. Release tags are immutable.

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
