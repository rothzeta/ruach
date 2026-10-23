task: RUACH-ROADMAP-IMPLEMENTATION/R-NATIVE-REFRESH
status: complete
outcome: "All nine subjects' isolated mechanisms and assets are refreshed to the accepted candidate 94cdfa1a and listed in a launch-ready manifest with unique Herdr names; per-root authentication is still false for all seven roots, so every row is pending the owner's sign-in. No credential operation, login, model task, worker or subject launch occurred."
baseline_revision: b1a12a1a86a000b692d2960aa1b4f843c62fd0fd
candidate_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
artifacts:
  - docs/reports/next-release/native-refresh.md
  - docs/assignments/next-release/native-refresh.md
  - docs/reports/next-release/native-refresh/manifest.redacted.json
  - docs/reports/next-release/native-refresh/grading-packet.json
  - docs/reports/next-release/native-refresh/adapter-dry-run-94cdfa1.json
  - docs/reports/next-release/native-refresh/enoch.assignment.md
  - docs/reports/next-release/native-refresh/print-launch.ts
  - docs/reports/next-release/native-refresh/enoch-preflight.sh
  - docs/reports/next-release/native-refresh/verify-adapter.sh
  - "Task-local, uncommitted: /tmp/ruach-implementation-20261011/live/manifest.json (full, unredacted role text only in launch argv), source, roots, smoke, r3, enoch, node22"
verification:
  - "Source: live/source fetched from the canonical repository by SHA (git fetch of /opt/dev/ruach, no remote added) and checked out detached at 94cdfa1a68e214a07d27fc5d413863dcbe3e7459, status clean; agents/, skills/, scripts/, config/, plugin and hook files are byte-identical to the earlier provisional 5b9d554 (the 5b9d554..94cdfa1 changes are CI, docs, the smoke packet and Enoch notes)"
  - "Claude plugin root: claude plugin marketplace update ruach exit 0, claude plugin update ruach@ruach reported up_to_date at 0.3.0 and left gitCommitSha at 5b9d554 (a same-version no-op, so not trusted); claude plugin uninstall then install in that task-owned root, both exit 0; installed gitCommitSha is now 94cdfa1a...; every tracked agents/, skills/, plugin, hooks and config file in the cache hash-matches the source (no mismatch); frozen skill dependencies re-checked exit 0; the config root and any authentication file were not touched"
  - "Snapshot rows (claude-adapter, codex-snapshot): scripts/install.ts install --revision 94cdfa1a... exit 0, 84 files, check exit 0, frozen deps unchanged, ready --route herdr: skill, native and herdr routes all ready, active revision 94cdfa1a; consumer git status clean"
  - "Skills CLI rows: bun x --bun skills@1.7.0 add <source>/skills --global ... --yes into the Claude and Codex roots exit 0 each; skills trees hash-match the source; frozen deps unchanged"
  - "Skill tree digest 9385a3a1... is identical across the source, plugin cache, both Skills CLI roots, both snapshot consumers and the Enoch resources; R3 resource copy (46 files, no rubric, expected, plan or generator) digest 1d135a14..."
  - "Smoke consumers: working trees clean, HEAD^{tree} 30731a66... in all five, commit SHAs differ per consumer (c2bf4115, 931223ad, 868159c7, 2adc5922, 40b4a0f0) because commit dates differ; no solution applied"
  - "Enoch: enoch-preflight.sh (read-only) all ok: HEAD ea33fc70456bf45bdd51e6eedcb83cf5cdf89347 on ruach-exercise/url-encoding-seed, clean, base..seed diff digest b8f48d29..., subject branch unused, hooks disabled, Node v22.23.3; protected test digests recorded; candidate resources reinstalled outside the clone, check exit 0"
  - "Adapter dry-run at the accepted candidate, inside the isolated adapter environment: worker.ts start --dry-run exit 0, ok, launchable, worktree_state not-created, hidden_workflows ruach-workflow-feature and ruach-workflow-knowledge, roleHash 233b5d88..."
  - "Authentication, redacted booleans only: claude-plugin false, claude-adapter false, claude-skills-cli false, r3-claude false, enoch-claude false, codex-snapshot false (Not logged in), codex-skills-cli false (Not logged in); owner-login.ts was not run"
  - "Unique names checked against herdr agent list: smoke-claude-plugin, smoke-claude-adapter, smoke-codex-snapshot, smoke-claude-skills, smoke-codex-skills, r3-resume, r3-ambiguity, r3-authorization, enoch-exercise are all unused"
  - "Heavy installs ran under /tmp/ruach-implementation-20261011/verification.lock, bounds 300 s; handoff validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "For a same-version Claude plugin, claude plugin update is a no-op and does not refresh the cache; an uninstall and install in the task-owned root is what refreshes it, which matters for any docs about updating a plugin."
  - "The adapter row worker.ts start runs in the standalone mode because the launching Herdr workspace belongs to another repository."
blockers:
  - "Owner action pending: sign in to all seven roots with bun /tmp/ruach-implementation-20261011/live/owner-login.ts (see native-owner-login.md). Until a root reports logged in = true, its rows stay pending; paid availability is first-turn evidence."


# R-NATIVE-REFRESH report

Nothing was removed or reset outside the task-owned plugin installation; no config root, authentication file, original consumer, global inventory, setting or discovery link was touched. The earlier receipts are unchanged.

## Launch-ready manifest

`live/manifest.json` (redacted copy `manifest.redacted.json`) holds, for each of the nine subjects: unique Herdr name, isolated environment roots (Enoch also carries Node v22.23.3 first on PATH), cwd, exact argv, first-prompt or task file with digest, consumer or clone base and tree, model and effort (Claude Sonnet 5.5 medium, Codex gpt-6.1-sol high), `auto-review` permissions, one task turn, no retry, a 20-minute wall bound, auth boolean and cleanup paths. `bun live/print-launch.ts --list|<id>` prints a recipe and starts nothing. Dialogs are answered by the user only.

| Subject | Herdr name | Entry and checker |
| --- | --- | --- |
| Claude plugin | smoke-claude-plugin | `claude --agent ruach:implementer ...`; `check.ts --packet live/smoke/claude-plugin --tag live` |
| Snapshot adapter | smoke-claude-adapter | candidate `worker.ts start ...` run in the isolated adapter environment (forwards HOME and the config homes); `verify-adapter.sh smoke/claude-adapter live` keeps the subject worktree separate |
| Codex snapshot | smoke-codex-snapshot | `codex --cd ... -c developer_instructions=<role>`; `check.ts` for that packet |
| Claude Skills CLI | smoke-claude-skills | `claude ...` with the role in the brief; `check.ts` |
| Codex Skills CLI | smoke-codex-skills | `codex ...` with the role in the brief; `check.ts` |
| R3 cases | r3-resume, r3-ambiguity, r3-authorization | `claude --agents r3-agents.json --agent coordinator --add-dir live/r3/resources`; the root selects the feature workflow |
| Enoch | enoch-exercise | `claude --agents enoch-agents.json --agent implementer --add-dir <resources>`; `enoch.assignment.md` is the brief plus operational details |

`grading-packet.json` lists, per subject, the observation command (`herdr agent read <name> --source recent-unwrapped`), checker, report path and provenance (source, role and resource digests, bases). Classification: ordinary non-blind smoke with blind unverified; all R1-S rows assisted. For Enoch the seed history and the readable original repository are answer-accessible (correction 1), and the evaluator file and seed patch stay out of the brief.

## Remaining gates

Per-root sign-in (owner), root-owned launch, monitoring and cleanup of `live/` and `enoch-exercise/` (including `live/node22/`), and no further resource change unless a new accepted-candidate amendment arrives. Zero subject turns launched.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
