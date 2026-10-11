task: RUACH-ROADMAP-IMPLEMENTATION/R-NATIVE-PREP
status: needs-decision
outcome: "Offline preparation for all nine subjects is done and enumerated in a task-local manifest, but no isolated root is authenticated, the Claude snapshot-adapter row cannot be environment-isolated through the launcher, and Node 22 is unavailable. No model task, subject launch or credential copy occurred."
baseline_revision: 5b9d554081f4b38050fd1076f62907e64ae9ee1f
artifacts:
  - docs/reports/next-release/native-prep.md
  - docs/assignments/next-release/native-prep.md
  - docs/reports/next-release/native-prep/manifest.redacted.json
  - docs/reports/next-release/native-prep/codex-discovery.json
  - "Task-local, uncommitted: /tmp/ruach-implementation-20261011/live/ (manifest.json, source, smoke, roots, launch, r3, enoch, discovery, setup scripts)"
verification:
  - "Source: git clone --no-hardlinks of the integration worktree, detached at 5b9d554081f4b38050fd1076f62907e64ae9ee1f, origin removed, hooks disabled; provisional until combined review accepts"
  - "Claude plugin row: claude plugin marketplace add <source> --scope user and claude plugin install ruach@ruach --scope user, each exit 0 with isolated HOME/CLAUDE_CONFIG_DIR/XDG; claude plugin details lists agents scout reviewer librarian implementer coordinator architect and 9 skills; skill dependencies then installed with bun install --frozen-lockfile (handoff, herdr): exit 0; ready --route native from the cache: exit 0"
  - "Skills CLI rows: bun x --bun skills@1.7.0 add <source>/skills --global --agent claude-code|codex --skill '*', isolated roots, exit 0; skills copied into the isolated roots, frozen deps installed exit 0"
  - "Snapshot rows: scripts/install.ts install --revision 5b9d554... into each consumer .agents, check exit 0 (84 files), frozen deps exit 0, ready --route herdr: all three routes ready with no missing item (claude-adapter and codex-snapshot)"
  - "Codex discovery: codex app-server over stdio in an isolated CODEX_HOME, skills/list only, no turn: 9 ruach skills listed with scope repo for the snapshot row and scope user for the Skills CLI row (codex-discovery.json)"
  - "Five packet consumers via evals/next-release-native-smoke/scripts/prepare.ts --out (exit 0 each): trees identical (HEAD^{tree} 30731a66...), base commit SHAs differ because commit dates differ; .agents/ excluded locally so the consumer stays clean"
  - "R3: evals/ruach-coordination/prepare.ts --out: exit 0, 3 cases, 9 reports validated 0 invalid (first attempt exit 1 only because the source clone lacked frozen handoff dependencies; installed and re-run)"
  - "Enoch: clone verified unchanged at seed ea33fc70456bf45bdd51e6eedcb83cf5cdf89347 on ruach-exercise/url-encoding-seed, clean; /opt/dev/enoch status unchanged (main...origin/main); candidate resources installed only under live/enoch/resources/.agents (check exit 0)"
  - "claude auth status in each isolated root: loggedIn false; codex login status in an isolated CODEX_HOME: Not logged in (real accounts untouched)"
  - "Heavy installs ran under /tmp/ruach-implementation-20261011/verification.lock with bounds of 300 s"
  - "Not run: any native model task, claude/codex interactive start, herdr worker start or dry-run, Node 22 checks, just check in Enoch"
review: not-run
discoveries:
  - "Claude 2.1.296 plugin install placed root dev dependencies (typescript, bun-types) in the plugin cache; no skill-level node_modules appeared. This differs from the 2.1.292 note that nothing is installed, so the no-root-install wording in docs/native-parity.md (including the sentence corrected during R-IN) should be rechecked by the integration owner against this version."
  - "The real Claude user settings enable ruach@ruach and the real ~/.agents/skills holds ruach-handoff, ruach-harness-eval and ruach-herdr, so any run that uses the real configuration is contaminated for distinctness between the plugin, adapter and Skills CLI rows."
  - "Codex warns that it refuses to create helper binaries under a /tmp CODEX_HOME; this affects only helper aliases."
  - "Skills-only routes (Skills CLI rows) install ruach-workflow-feature and ruach-workflow-knowledge too; the adapter hides workflows from workers, the Skills CLI rows do not. The workflow bodies were not read."
blockers:
  - "G1 authentication: isolated Claude and Codex roots hold no credentials. Authenticating them needs an owner-performed interactive login per root (CLAUDE_CONFIG_DIR / CODEX_HOME) or an explicit authorization to copy or link the real credential files. I copied nothing; each row is an exact setup failure until decided."
  - "G2 adapter isolation: skills/ruach-herdr worker.ts start has no environment option, and Herdr starts the agent in the pane's shell, so the adapter row runs with the pane's environment (the real config) unless the root controls the launching shell. The adapter also creates its own worktree, so the checker must be pointed at the subject branch after the root removes that worktree."
  - "G3 Node 22: only Node 24.21.0 is installed (fnm lists only v24); Docker exists but no image was pulled. Enoch's required Node 22 and omitted just check remain explicit limitations."
  - "G4 resource revision: source is provisional at 5b9d554...; rebuild the manifest after the combined review names the accepted revision."


# R-NATIVE-PREP report

Everything below is under `/tmp/ruach-implementation-20261011/live/` and owned by this task; the committed artifacts are this report and a redacted copy of the manifest. No model task, native subject, Herdr worker or additional agent was started, and no workflow body was read (the workflow skill directories were copied as opaque bytes). The original Enoch repository, global harness settings, existing discovery links and real credentials were not changed.

## Manifest

`live/manifest.json` (redacted copy in the repository) lists, per subject: working directory, consumer or clone base commit and tree, branch, isolated environment roots, exact argv, brief or task path with digest, install receipts and the post-run checker command. Versions: claude 2.1.296, codex-cli 0.162.1, herdr 0.9.0, Bun 1.4.2, Node 24.21.0, Git 2.47.3. Role file digests: implementer `233b5d88...`, coordinator `00ce2c8a...`.

| Subject | Distinct mechanism | Entry | Brief |
| --- | --- | --- | --- |
| R1-S plugin | `claude plugin` install into `roots/claude-plugin` | `claude --agent ruach:implementer --model claude-sonnet-5-5 --effort medium --permission-mode auto` | assisted brief |
| R1-S adapter | snapshot in `consumer/.agents`, candidate `ruach-herdr` `worker.ts start` (kind claude, same model, effort, `auto-review`) | worker.ts argv in the manifest | assisted brief |
| R1-S Codex snapshot | snapshot in `consumer/.agents`, isolated `CODEX_HOME` | `codex --cd ... --model gpt-6.1-sol -c model_reasoning_effort="high" --approve-for-me -c developer_instructions=<role>` | assisted brief plus role text |
| R1-S Claude Skills CLI | `skills@1.7.0` into an isolated config root | `claude --model claude-sonnet-5-5 --effort medium --permission-mode auto` | assisted brief plus role text (no installed role) |
| R1-S Codex Skills CLI | `skills@1.7.0` into an isolated HOME | `codex --cd ... --model gpt-6.1-sol ... --approve-for-me` | assisted brief plus role text |
| R3 x3 | whitelisted resource copy (coordinator role, task-record and assignment specimens, handoff, herdr, an opaque workflow copy) | `claude --agents r3-agents.json --agent coordinator --add-dir <resources>` with the model, effort and permission flags above | each case `task.md` |
| Enoch | clone at seed with candidate resources outside the clone | `claude --agents enoch-agents.json --agent implementer --add-dir <resources>` | subject brief only (digest `ea4c5ee6...`) |

All smoke rows are assisted; classification is ordinary non-blind smoke with blind unverified. Checker for a finished smoke row: `bun <source>/evals/next-release-native-smoke/scripts/check.ts --packet live/smoke/<row> --tag live` after the subject commits on the checked-out branch. R3 reports validate with the handoff validator; Enoch with the three `npm --prefix src/Enoch.Ui` commands in the clone.

## Setup gaps

G1 to G4 above are the blockers. G1 means no authenticated launch is possible without a user decision; G2 and G3 are limitations the root should accept or resolve before treating the adapter and Enoch results as clean. Cleanup: the `live/` tree and `enoch-exercise/` belong to the Coordinator; nothing outside them was written.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
