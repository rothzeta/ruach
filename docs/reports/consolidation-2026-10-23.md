# Ruach consolidation and machine installation

Requested: install the latest Ruach on the control machine, Oholiab and Tubal; consolidate side branches before resuming development; report OpenCode harness status.

The existing primary branch name is `main`. The latest published release verified directly from origin is 0.3.1; published tags are preserved. Consolidation is development work on main and does not create or retag a release.

## Source and history

The completed multi-machine council, R6/R7 preparation guidance and independent review, R4/R5 packets, and R6/R7 packets were merged with their source changes. Missing historical assignments and release-review evidence were imported; one publication-review report has an explicit import note for spacing its quoted Markdown pseudo-links, with the original bytes retained in history. Older R1–R3 and planning branch content already shipped or was superseded by the published release and reconciled roadmap; their histories are joined while preserving the newer primary-branch source. All original branch tips and a full pre-consolidation Git bundle were saved under `/tmp/ruach-consolidation-20261023` before edits. The primary history retains the original commits after side-branch removal.

The communication fixture now retains its synthetic verifier output as `run-2.txt`, avoiding the repository-wide `*.log` ignore rule. Its JSON points to that file and the existing regression assertion stays intact. The original preparation report's unreproducible 10-pass claim and the guidance report's engineering/evaluation wording are corrected. Historical independent review remains evidence for its exact earlier revisions, not acceptance of this consolidation.

## OpenCode

The reusable `ruach-herdr` OpenCode adapter returns exit 3 / `unsupported_adapter`: additive prompt composition, configuration merge and provider effort mapping remain unverified. Prior task-local OpenCode Go / DeepSeek Flash runs are separate evidence: smoke, synthetic Enoch and authorization accepted; resume and ambiguity failed under runtime write denial. This consolidation enables no new adapter and runs no model subjects.

## Verification and installation

Verification completed against consolidated source at 473c06d886a5167ae6bfc5f35af2b4c899100531; subsequent roadmap, changelog and receipt edits are documentation only.

| Check | Observed result |
| --- | --- |
| Local just check / just release-check | Pass, including root typecheck |
| Local just test | Root 100, handoff 28, Herdr 162, harness-eval 71, changelog 35; all pass (396 total) |
| Six affected packet suites | Permissions 7, communication 10, delivery 8, verification 11, native-smoke 14, coordination 10; all pass (60 total) |
| Four new packet typechecks | Pass |
| Oholiab and Tubal | Each: frozen source installs, just check, just release-check, 100 root tests; all pass |
| Skill/native readiness | Ready on all three machines; source/global-copy inventory warnings reflect the two intentional install locations |
| Released Codex skills | All nine installed from v0.3.1 on every machine; all 75 tracked skill files byte-identical to tagged 363da220d06017101a5c85d876ae75da15171d73; frozen executable dependencies installed |
| Claude native plugin | Enabled user-scoped ruach@ruach 0.3.1 on all three machines, loading each existing /opt/dev/ruach source registration |
| Local cleanup | All 46 side branches removed after ancestry verification; all seven clean side worktrees removed; main is the only local branch and checkout |

The remote Claude marketplace source is declared as the local source path, so an attempted switch to the GitHub tag was refused by Claude. The successful update preserves that existing source registration and changes no unrelated harness settings. Codex receives pinned released copies; Claude continues loading the maintained source checkout. Start a new native session to load the updated skills/plugin.

Local full-suite and packet logs, initial branch inventory, audit and backup bundles are under /tmp/ruach-consolidation-20261023. Each remote keeps its own pre-update bundle, installation output, root test result and readiness JSON in the same task directory. Published release tags are unchanged. No new model/evaluation turn was run.

Remaining wave-2 guides, specimens, startup-contract tests and native behavioral proof stay open; merging preparation does not complete those tasks. Independent review of the correction and complete future wave remains open.

## Distribution

Final main publication, remote side-branch removal and documentation synchronization are pending the final delivery check.
