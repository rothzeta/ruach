task: RUACH-ROADMAP-IMPLEMENTATION/R-NATIVE-OWNER-LOGIN
status: needs-decision
outcome: "Operator instructions and a user-run login helper for the seven isolated roots are ready; every root is still logged out, and the sign-in is the owner's action. I performed no credential operation, login, subject or worker, and the pending adapter dry-run succeeded read-only."
baseline_revision: c324da22511c55d5ecf0f6041a897f071b0f3082
artifacts:
  - docs/reports/next-release/native-owner-login.md
  - docs/assignments/next-release/native-owner-login.md
  - docs/reports/next-release/native-owner-login/owner-login.ts
  - docs/reports/next-release/native-owner-login/adapter-dry-run.json
  - "Operator copy (run this one): /tmp/ruach-implementation-20261011/live/owner-login.ts"
verification:
  - "claude --version 2.1.296 and codex --version codex-cli 0.162.1; installed help read: claude auth login accepts --claudeai (default), --console, --email, --sso; claude auth status accepts --json and --text; codex login has no subcommand besides status, accepts --device-auth, --with-api-key and --with-access-token; codex login status exists"
  - "Read-only status, recorded as true or false only: claude-plugin, claude-adapter, claude-skills-cli, r3-claude and enoch-claude all report loggedIn false; codex-snapshot and codex-skills-cli report Not logged in. No identity or token was read or recorded"
  - "Helper typecheck: node_modules/.bin/tsc --ignoreConfig --noEmit --strict --types bun --module preserve --moduleResolution bundler --target esnext --lib esnext --skipLibCheck --allowImportingTsExtensions on the committed copy: exit 0; bun build to /dev/null: exit 0. The helper was NOT executed by me"
  - "Pending adapter dry-run, accepted by the classifier this time: worker.ts start --dry-run run inside the isolated adapter environment (child HOME, CLAUDE_CONFIG_DIR, XDG_CONFIG_HOME; PATH and the Herdr context preserved): exit 0, launchable true, worktree_state not-created (nothing created), worktree_mode standalone because the launching workspace belongs to another repository, kind claude, cli_version 2.1.296, argv has the claude-sonnet-5-5 model, the canonical implementer role file from the consumer .agents, --permission-mode auto, --effort medium and private settings and add-dir placeholders, hidden_workflows ruach-workflow-feature and ruach-workflow-knowledge, config_reader null; output saved as adapter-dry-run.json"
  - "Validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "The seven roots are the five Claude roots and two Codex roots listed below. roots/claude-adapter did not exist before this task because the earlier command that would have created it was denied; I created its empty private directories (0700) and nothing else."
  - "Resource refresh is unchanged: the source stays provisional at 5b9d554081f4b38050fd1076f62907e64ae9ee1f. The disjoint portability fix and live subject inputs were not touched."
blockers:
  - "Owner action: sign in to all seven roots (commands below). Until each root reports logged in true, its rows are exact setup failures."
  - "Accepted-union amendment for resource refresh is still pending."


# Owner login instructions for the isolated native roots

Nothing here uses, copies or prints a credential file. You sign in yourself; the commands only point the installed CLIs at the task-private roots under `/tmp/ruach-implementation-20261011/live/roots/`, leaving your real account roots and settings untouched. Use the account you want each subject to run under.

## The one command

```sh
bun /tmp/ruach-implementation-20261011/live/owner-login.ts
```

It walks the seven roots in order. For each root that is not yet logged in it runs that root's login command with the terminal attached, so you complete the CLI's own prompt or browser step, then asks the matching status command and prints only `logged in = true` or `false`. It never answers a trust or permission dialog and starts no model task. Companion forms:

```sh
bun .../owner-login.ts --list                      # print every root and exact command, run nothing
bun .../owner-login.ts --status                    # redacted true/false only, no login
bun .../owner-login.ts --only claude-plugin        # one root; repeat --only for several
bun .../owner-login.ts --device-auth               # Codex roots use the device-code flow (useful without a local browser)
```

## The seven roots and manual alternatives

Each manual command sets only the child environment shown; `PATH`, your terminal and browser variables stay as they are. `R=/tmp/ruach-implementation-20261011/live/roots`.

| Root | Used by | Login (run as one line) | Redacted status |
| --- | --- | --- | --- |
| `claude-plugin` | R1-S Claude plugin native agent | `env HOME=$R/claude-plugin/home CLAUDE_CONFIG_DIR=$R/claude-plugin/claude XDG_CONFIG_HOME=$R/claude-plugin/xdg claude auth login --claudeai` | same env, then `claude auth status --json \| python3 -c 'import json,sys;print(json.load(sys.stdin).get("loggedIn"))'` |
| `claude-adapter` | R1-S snapshot adapter | same with `claude-adapter` | same |
| `claude-skills-cli` | R1-S Claude Skills CLI | same with `claude-skills-cli` | same |
| `r3-claude` | R3 cases 01, 02, 03 (shared) | same with `r3-claude` | same |
| `enoch-claude` | Enoch exercise | same with `enoch-claude` | same |
| `codex-snapshot` | R1-S Codex snapshot | `env HOME=$R/codex-snapshot/home CODEX_HOME=$R/codex-snapshot/codex XDG_CONFIG_HOME=$R/codex-snapshot/xdg codex login` (add `--device-auth` if there is no local browser) | same env, then `codex login status` (prints "Logged in ..." or "Not logged in", nothing else) |
| `codex-skills-cli` | R1-S Codex Skills CLI | same with `codex-skills-cli` | same |

## What persists, and what to expect

Login stores its result inside the root named in the table: Claude in that root's `claude/` directory and Codex in its `codex/` directory, which is the same layout your real accounts use (the real files sit directly under the real config homes). The roots are separate, so each needs its own sign-in, and the shared `r3-claude` root covers all three R3 cases. Signing in does not change the real roots, global settings, or the discovery links. The status commands above confirm persistence; if one reports false after a login, run that root's command again and report the CLI's message. Codex prints a harmless warning that it will not create helper aliases under `/tmp`. Subscription login is the Claude default; use `--console` only if you intend API billing. A successful login says nothing about model availability, which is only learned at the first subject turn.

## Unresolved

Only your sign-ins and the accepted-union amendment. Zero subject turns, native sessions, workers or credential operations by me.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
