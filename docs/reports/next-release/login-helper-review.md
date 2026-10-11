task: RUACH-ROADMAP-IMPLEMENTATION/R-LOGIN-HELPER-RV
status: complete
outcome: "The owner-run login helper at b1a12a1a meets the stated boundary (fixed seven roots, isolated child env, interactive auth and status only, redacted booleans, no dialog answering, no model task) and its operator copy is byte-identical. No blocking findings; 6 optional, of which O1 (codex credential store) and O2 (manual commands inherit auth env) are recommended before the owner relies on it. No login, credential read or model task was performed."
verdict: no-blocking-findings
reviewed_revision: b1a12a1a86a000b692d2960aa1b4f843c62fd0fd
helper_sha256: 867b624606e32d1077a1afecb7346579d653abe0c7cdde35dfe29c3877a2b03f
operator_copy: /tmp/ruach-implementation-20261011/live/owner-login.ts
artifacts:
  - docs/reports/next-release/login-helper-review.md
  - docs/assignments/next-release/login-helper-review.md
verification:
  - "Read via git show at b1a12a1a only: docs/reports/next-release/native-owner-login.md and native-owner-login/** (owner-login.ts, adapter-dry-run.json listed; the helper and instructions inspected)"
  - "Byte identity: sha256 of git show b1a12a1a:docs/reports/next-release/native-owner-login/owner-login.ts and of /tmp/ruach-implementation-20261011/live/owner-login.ts are both 867b6246...a2b03f (5345 bytes)"
  - "Installed help, run with env -i and an empty scratch HOME, CODEX_HOME, CLAUDE_CONFIG_DIR and XDG_CONFIG_HOME (no real or task roots): codex-cli 0.162.1, codex login options -c, --with-api-key, --with-access-token, --device-auth, subcommand status; Claude Code 2.1.296, claude auth login --claudeai (default), --console, --email, --sso; claude auth status --json (default) or --text. These match the receipt"
  - "Static string search of the installed codex binary (no config or credential files read): it contains the cli_auth_credentials_store setting and a keyring mode; the default is not shown by local help (O1). The task codex roots contain no config.toml (only non-credential entry names were listed, with auth- and credential-named entries filtered out)"
  - "--list run from a scratch copy of the reviewed blob in scratch cwd: exit 0, printed root, env, login and status lines only. --only bogus, a trailing --only with no value, and --only nope --status: exit 2 with the valid-name list. A sorted depth-3 snapshot of paths, modes and mtimes under live/roots was identical before and after (an earlier unsorted comparison differed only by bfs traversal order; nothing under roots was newer than 08:56)"
  - "Root directories currently 0775; the helper's ensure() tightens each root and subdirectory to 0700 before status or login"
  - "Names only (no values) of auth-related variables in this reviewer session: CLAUDE_CODE_* session variables present; no ANTHROPIC_*, OPENAI_*, CODEX_* or proxy variables"
  - "Not run: any login, claude auth status or codex login status against a task or real root, helper typecheck (no new type concern; the receipt records tsc exit 0), full suites, workflow search"
discoveries:
  - "Login output goes straight to the owner's terminal (stdio inherit). That is the CLI's own prompt, possibly showing an account identity or URL, not helper output. Only the status result is redacted by the helper."
blockers: []

# Owner login helper review

Reviewer: canonical Reviewer, same session and branch. Scope is limited to `owner-login.ts` (sha256 `867b6246…a2b03f`) and `native-owner-login.md` at `b1a12a1a`. The owner chose "I'll authenticate the isolated roots myself."

## Boundary check

| Requirement | Result | Where |
| --- | --- | --- |
| Seven fixed task-private roots | Met | `ROOTS` is a hard-coded list under `/tmp/ruach-implementation-20261011/live/roots/`. `--only` accepts only these names and exits 2 otherwise, before any mutation. |
| Real HOME, config and settings preserved | Met | The child env is built from an allowlist (PATH, terminal, locale, display, browser, D-Bus, XDG_RUNTIME_DIR). HOME, XDG_CONFIG_HOME, XDG_CACHE_HOME and CLAUDE_CONFIG_DIR or CODEX_HOME point into the root. Inherited `ANTHROPIC_*`, `OPENAI_*` and `CLAUDE_CODE_*` variables are dropped. |
| Only installed interactive auth and status | Met | argv is limited to `claude auth login --claudeai`, `claude auth status --json`, `codex login [--device-auth]` and `codex login status`. Status runs with a 30 s timeout and piped output. There is no shell, and no API-key or token flag. |
| Never reads, copies or prints credentials | Met | The helper never opens a file. Status stdout and stderr are parsed into one boolean and discarded. |
| Never answers dialogs, never starts a model task or worker | Met | Login uses `stdio: 'inherit'`, so the owner completes the CLI's own flow. There is no `-p`, prompt, agent or Herdr call. |
| Redacted booleans only | Met | Output is `logged in = true`, `false` or `unknown`. Exit is 1 while any selected root is not logged in. |
| `--list` mutation-free | Met | It exits before `ensure()`, which I confirmed with the sorted snapshot. |

## Blocking findings

None.

## Optional findings (O1 and O2 recommended before use)

### O1. Codex credential storage is not pinned to the isolated root

- **Location:** `owner-login.ts:25` (KEEP includes `DBUS_SESSION_BUS_ADDRESS` and `XDG_RUNTIME_DIR`) and `owner-login.ts:33-34` (codex argv).
- **Problem:** codex-cli 0.162.1 has a `cli_auth_credentials_store` setting with a keyring mode, and local help does not show its default. Because the session bus is passed through, a keyring store would write to the owner's real Secret Service, outside the task root.
- **Why it matters:** that would break the "preserve real config, task-private roots" boundary, and cleanup would miss it.
- **Direction:** add `-c cli_auth_credentials_store="file"` to both `codex login` and `codex login status` (or put it in each root's `config.toml`), so storage is provably under `CODEX_HOME`. Alternatively, record that the default is `file` from an authoritative source.

### O2. The manual alternatives inherit the whole shell environment

- **Location:** `native-owner-login.md`, "The seven roots and manual alternatives" (`env HOME=... CLAUDE_CONFIG_DIR=... claude auth login`).
- **Problem:** unlike the helper, these commands keep any `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, `OPENAI_API_KEY` or `CLAUDE_CODE_*` variable set in the owner's shell. Status can then report logged in from an environment credential rather than the root, and in a Claude or Herdr pane the `CLAUDE_CODE_*` session variables leak in.
- **Direction:** prefer the helper. Otherwise prefix manual commands with `env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u CLAUDE_CODE_OAUTH_TOKEN -u OPENAI_API_KEY ...`, or say to run them from a plain terminal without those variables.

### O3. Unknown arguments are silently ignored

- **Location:** `owner-login.ts:49-54`.
- **Problem:** a misspelled `--lsit` or `--stauts` falls through to the interactive login loop instead of the requested read-only mode.
- **Direction:** reject anything other than `--list`, `--status`, `--device-auth` and `--only <name>` with exit 2.

### O4. Login failures are reported only as `false` or `unknown`

- **Location:** `owner-login.ts:65` (spawn result discarded) and `owner-login.ts:43-47`.
- **Problem:** a missing `claude` or `codex` on PATH (ENOENT), a non-zero login exit or a status timeout all become `unknown` or `false` with no reason. Proxy and CA variables (`HTTPS_PROXY`, `NO_PROXY`, `SSL_CERT_FILE`, `NODE_EXTRA_CA_CERTS`) are not kept, so a proxied network fails without explanation.
- **Direction:** print a redacted reason, such as "claude not found on PATH", "login exited 1" or "status timed out". Optionally keep the proxy and CA variables, which carry no credentials.

### O5. The child processes run in the caller's working directory

- **Location:** both `spawnSync` calls at `owner-login.ts:43` and `owner-login.ts:65` (no `cwd`).
- **Problem:** project-level CLI configuration in whatever directory the owner runs from could be consulted. The isolated, untrusted config roots make that unlikely to take effect, but it is avoidable.
- **Direction:** set `cwd: \`${r.dir}/home\`` for both calls.

### O6. `--status` is not strictly read-only

- **Location:** `owner-login.ts:60`.
- **Problem:** `--status` runs `ensure()`, which creates missing directories and changes modes to 0700. It performs no login, as documented, but it is not mutation-free.
- **Direction:** skip `ensure()` under `--status`, or note this in the instructions. The effect is harmless and task-private.

## Validation

I ran the canonical `skills/ruach-handoff/scripts/validate.ts <report> --repo .` and `git diff --check` on this report before committing it. I removed the scratch help home and blob copy afterwards. I touched no native roots or live resources.
