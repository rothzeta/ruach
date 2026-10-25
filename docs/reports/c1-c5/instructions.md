task: INSTR-01
status: complete
outcome: "Committed bounded C1/C3/C4/C5 instruction resources, specimens and static evaluation cases; independent review and behavioral/runtime demonstrations remain pending."
source_baseline: 2b693cd72bf39c29575841a88d9c7ae719a29715
candidate_revision: 90230d165f41b90969037fdf7cf93e1a85d69396
tested_revision: 90230d165f41b90969037fdf7cf93e1a85d69396
artifacts:
  - docs/reports/c1-c5/instructions.md
  - docs/assignments/c1-c5/INSTR-01.md
  - evals/ruach-capabilities/README.md
  - /tmp/ruach-instr01-evidence-PVrsb4qU
verification:
  - "just install: exit 0, frozen pinned dependencies prepared."
  - "just check: exit 0, resource checks and root TypeScript check passed."
  - "bun run test: initial exit 1, 104 pass/4 socket-setup EPERM failures; authorized socket-enabled rerun exit 0, 108 pass/0 fail. Both logs retained."
  - "bun run release-check: exit 0, existing v0.6.1 metadata and notices passed."
  - "skills/ruach-handoff bun test: exit 0, 28 pass/0 fail."
  - "Committed temporary snapshot install/check, foreign-cwd readiness and relocated resource checks: exit 0; Tester found in this snapshot."
  - "git diff --check and assignment SHA-256 comparison: exit 0."
  - "Canonical handoff validator --repo: exit 0, ok true, all three revisions resolved; final resource/link check exit 0."
review: not-run
discoveries:
  - "No shared-file ownership amendment needed. Dynamic snapshot discovery and readiness include Tester without installer edits."
  - "Readiness reports existing user-skill duplicates; this is packaging/discovery evidence, not isolated native or task-capability proof."
  - "Static packets need no executable preparation utility, packet dependencies, test runner or local tsconfig. Expected decisions are outside installed skills and separated from subject inputs."
blockers: []

# Implementation handoff

Bounded source authoring is complete on `ruach/c15-instructions`. The candidate above contains 37 new files, with no changes to existing protected source, roles, tests, catalogs, root docs, CI or release metadata. This report and the unchanged assignment are a later evidence-only commit; its creating SHA is returned externally. No independent acceptance, integration, delivery or publication is claimed.

## Source outcomes and files

| Scope | Result |
| --- | --- |
| `skills/ruach-workflow-council/` | Coordinator-only council; manual/exact/up-to modes; closed reports, actual access controls, attributed reasoning/minority objections, owner-adoption distinction and artifact-based resumption. Conditional access/round detail in `references/rounds.md`. |
| `skills/ruach-debugging/` | Technical reported-defect investigation/correction, independent regression and original-failure retest. Conditional discriminating-evidence guidance in `references/investigation.md`. No real defect fix claimed. |
| `skills/ruach-workflow-bugfix/` | Proportionate Coordinator assignments and exact revision/check/review/delivery gates. Reuses existing correction-cycle definition and verification dispositions; Architect optional. |
| `agents/tester.md` | Actual assigned-build exercise/evidence/reproducibility role, with no application edits, fixes, architecture, coordination, review acceptance or delivery. Explicit disposable runtime state exception only. |
| `skills/ruach-runtime-testing/` | Technical build/state/capability/observation/retest guidance. Conditional `references/capabilities.md` and `references/measurements.md` distinguish listening, capture, playback, source and measured boundaries. |
| `skills/ruach-workflow-qa/` | Findings-only or authorized correction/retest path; required missing experiences remain held; original-failure Tester retest, review and delivery remain distinct. |
| `skills/ruach-workflow-bug-hunt/` | Bounded search, four evidence classes, independent consequential confirmation, meaningful no-confirmed-defects outcome and explicit findings-only/find-and-fix boundary. |
| [Council assignment](../../examples/council-member-assignment.md), [bugfix assignment](../../examples/bugfix-assignment.md), [runtime QA assignment](../../examples/runtime-qa-assignment.md) | Copyable self-contained worker briefs with authority, ownership, builds/inputs, checks, resources and output boundaries; no results prefilled. |
| [Capability packets](../../../evals/ruach-capabilities/README.md) | Four static subject families with contrasting controls: interrupted council/modes/access; debugging/expectation conflict/environment; stale runtime build/measurement/listening; hunt classification/authority/clean area. Separate grader rubric and TypeScript source template. |

Each of the six skill directories carries root-identical `LICENSE` and `PROVENANCE.md`. There is no new executable product code, dependency, runtime, framework, scheduler, vote engine or database. Static packet inputs are intentionally copied into later isolated sessions; no preparation script or wording/formatting unit tests would establish the required behavior. No existing packet code changed, so there is no new packet suite/typecheck command. The source template is not a shipped executable or an executed demonstration.

## Verification receipt

Full logs and disposable verification support are retained outside the repository at `/tmp/ruach-instr01-evidence-PVrsb4qU`. `verification.json` records commands/cwds/exits and `SHA256SUMS` records evidence digests. Bounds below are whole-command bounds. Source content remained at the candidate throughout checks; the initial dependency setup preceded its commit.

Unless specified, cwd was `/opt/dev/ruach-worktrees/c15-instructions`.

| Exact verifier command | Cwd / exit and result | Evidence filename |
| --- | --- | --- |
| `timeout 300s just install` | Worktree / 0, frozen root and executable-skill dependencies | `install.log` |
| `timeout 300s just check` | Worktree / 0, resource/link/notice checks and `tsc -p tsconfig.json` | `check.log` |
| `timeout 300s bun run test` | Worktree / 1, 104 pass and 4 `listen` EPERM failures before assertions | `root-test.log` |
| `timeout 300s bun run test` with authorized per-command socket escalation | Worktree / 0, 108 pass, 0 fail; original failure retained, not called flaky | `root-test-sockets.log` |
| `timeout 300s bun run release-check` | Worktree / 0 | `release-check.log` |
| `timeout 120s bun test` | Worktree `skills/ruach-handoff` / 0, 28 pass, 0 fail | `handoff-test.log` |
| `timeout 120s bun scripts/install.ts install --source /opt/dev/ruach-worktrees/c15-instructions --revision 90230d165f41b90969037fdf7cf93e1a85d69396 --target /tmp/ruach-instr01-evidence-PVrsb4qU/consumer/.agents` | Worktree / 0, 116 committed files installed only into disposable local fixture | `snapshot-install.log` |
| `timeout 120s bun /tmp/ruach-instr01-evidence-PVrsb4qU/consumer/.agents/ruach-install.ts check --target /tmp/ruach-instr01-evidence-PVrsb4qU/consumer/.agents --source /opt/dev/ruach-worktrees/c15-instructions` | `/tmp` / 0, committed snapshot integrity verified | `snapshot-check.log` |
| `timeout 120s bun install --frozen-lockfile` | Each snapshot directory `skills/ruach-handoff`, `skills/ruach-herdr`, `skills/ruach-harness-eval` / 0 each | `snapshot-handoff-install.log`, `snapshot-herdr-install.log`, `snapshot-eval-install.log` |
| `timeout 120s bun /tmp/ruach-instr01-evidence-PVrsb4qU/consumer/.agents/ruach-install.ts ready --route skill --json --project /tmp/ruach-instr01-evidence-PVrsb4qU/consumer` | `/tmp` / 0, snapshot revision matches candidate, integrity ok, skill route ready, snapshot Tester present | `snapshot-ready.json`, `snapshot-ready.stderr` |
| `timeout 120s bun /tmp/ruach-instr01-evidence-PVrsb4qU/portable-check.ts` | `/tmp` / 0, all 23 new installable files match Git bytes, 12 notices match root, 33 relative links resolve in relocated skills/agents bundle without dependencies; docs/evals excluded | `portable-check.log`, `portable-check.ts` |
| `git diff --check` | Worktree / 0 | `diff-check.log` |
| `sha256sum -c /tmp/ruach-instr01-evidence-PVrsb4qU/assignment.sha256` | Worktree / 0, assignment unchanged from initial read | `assignment-check.log`, `assignment.sha256` |

The first source staging attempt hit read-only shared gitdir `index.lock`; exact owned-path staging and local source commit succeeded with the assignment-authorized escalation. No lock deletion, global setting, trust response or route fallback occurred. Required suite output was captured to full logs before showing tails. No checks were weakened or hidden.

The required command `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/instructions.md --repo /opt/dev/ruach-worktrees/c15-instructions` exited 0 with `ok: true`, no diagnostics and all three revision references resolved (`handoff-validate.log`). The final `bun scripts/check.ts` including this report also exited 0 (`final-resource-check.log`). A mechanical pass establishes structure/revision resolution, not technical or behavioral acceptance.

## Proposed shared integration edits

These are proposals for the integration Implementer, not changes made here:

- Add the six skills and Tester to root navigation/catalog documentation, with precise council/known-bug/runtime/hunt triggers and Coordinator-only workflow boundaries. Link the three assignment examples and static packets from the appropriate existing guides.
- Add a development Tester route to `config/agent-routing/` only with an explicit authorized route/model choice. Discovery already works; a speculative installer patch is unnecessary. Do not write consumer/global routes.
- Keep existing resource/release checks for these instruction-only additions. There is no executable packet command to add to CI now. If later packet preparation/evaluation code is assigned, its accepted handoff must supply its own Bun tests/local typecheck and C-IN must add those bounded commands. Hosted green evidence remains a separate assignment/owner disposition.
- Preserve the current 0.6.1 metadata and canonical notices until an authorized release integration requests a coordinated version/changelog/plugin change. Combine only accepted units, then verify/review the actual union.

## Evidence holds and next assignments

Independent Reviewer acceptance and Coordinator workflow-body compatibility observations are pending. No model subjects, peer-answer exclusion controls under actual member permissions, blind-access controls, runtime/browser/desktop/audio execution or behavioral grading ran. Static frontmatter/link/notices, readiness and synthetic source/template checks establish no such capability. Readiness includes existing user-skill duplicate warnings; it was not an isolated-home or native-launch test.

The real startup-truncation debugging exercise is separately assigned after this skill becomes available. Music-software and playable-prototype demonstrations remain unrun and require actual repositories/builds/goals/resources/capabilities and authorized assignments. No synthetic fixture is claimed as a real defect or product acceptance. C2 and launch transport are untouched. No merge, push, tag, publication or retained-consumer installation occurred.

Retained resources: this assigned worktree/branch/session, ignored dependency directories, and the named temporary evidence directory containing the disposable consumer snapshot/relocated bundle and logs. No workers or servers were launched by this assignment. Do not remove task resources here; the Coordinator owns their disposition after review/integration needs end. No implementation blocker or ownership amendment remains.
