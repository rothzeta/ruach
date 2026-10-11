task: RUACH-ROADMAP-IMPLEMENTATION/R-NATIVE-LOGIN-HARDENING
status: complete
outcome: "Login helper version 2 applies the reviewer's recommendations (Codex account storage pinned to the root, strict arguments, root cwd, mutation-free list and status, redacted failure reasons) and the Codex subject argv in the manifest matches. Fake-CLI probes demonstrate the behavior; no login, credential read, model task or subject occurred, and all seven roots still report logged out."
baseline_revision: b8b85ee8f65c8593972166b7e9d5b8e9e90fd3fd
candidate_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
helper_sha256: b41dd032f704cc51fb450090bceb27feb8c3b1532234196475a154b1849e8e50
operator_copy: /tmp/ruach-implementation-20261011/live/owner-login.ts
artifacts:
  - docs/reports/next-release/native-login-hardening.md
  - docs/assignments/next-release/native-login-hardening.md
  - docs/reports/next-release/native-login-hardening/owner-login.ts
  - docs/reports/next-release/native-login-hardening/manifest.redacted.json
  - docs/reports/next-release/native-login-hardening/fake-probe-calls.log
  - "Task-local: /tmp/ruach-implementation-20261011/live/owner-login.ts (byte-identical to the committed copy), live/manifest.json, live/build-manifest.ts"
verification:
  - "Helper sha256 b41dd032... for both the operator copy and the committed copy (cmp: identical); tsc --ignoreConfig --strict (bun types) on the committed copy exit 0; bun build exit 0"
  - "Fake-CLI probes, scratch directory outside the real roots, using a scratch copy of the helper that differs only in the root-base constant line, with fake claude and codex that log argv, cwd and environment variable NAMES (never values) and print a fake identity and token: (1) a misspelled flag --lsit exits 2 with the allowed list, zero CLI calls, zero directories created; (2) --list prints cwd, env, login and status per root, zero CLI calls, nothing created; (3) --status with missing roots reports logged in = unknown with an explicit reason, zero CLI calls, nothing created; (4) --only nope and --only with no value exit 2 before any action; (5) login mode for one Claude and one Codex root created only the selected roots with mode 0700, ran each CLI with cwd = <root>/home and CLAUDE_CONFIG_DIR or CODEX_HOME = the fixed root, passed codex login -c cli_auth_credentials_store=\"file\" and codex login status -c cli_auth_credentials_store=\"file\", and the child environment held neither the caller's ANTHROPIC_API_KEY, OPENAI_API_KEY, CLAUDE_CODE_OAUTH_TOKEN nor CLAUDE_CODE_SESSION_ID (only names were logged) while the caller's HTTPS_PROXY was kept; (6) the helper's printed output contained none of the fake email, token, API keys or proxy credentials. These probes check helper behavior only and are not native-readiness evidence"
  - "Real flag acceptance: the installed codex 0.162.1 accepted codex login status -c cli_auth_credentials_store=\"file\" in each task Codex root (exit with Not logged in, no option error), and codex login --help lists -c, --config; no login was run and no credential file was read"
  - "Real auth status, redacted booleans after the amendment: claude-plugin, claude-adapter, claude-skills-cli, r3-claude, enoch-claude all false; codex-snapshot and codex-skills-cli false. The owner has not logged in yet"
  - "Manifest: Codex subject argv for smoke-codex-snapshot and smoke-codex-skills now carry -c cli_auth_credentials_store=\"file\" (model gpt-6.1-sol, effort high, --approve-for-me unchanged); Claude rows, source 94cdfa1a and the nine Herdr names unchanged; no repository or packet suites were repeated for task-private helper changes"
  - "Validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "Native clients still write their own runtime state (for example SQLite files, caches and logs) inside the selected root when status or login runs; the helper's list and status modes create no directories themselves, but a status call by a client can create client files in an existing root."
  - "While finishing this, I overwrote live/manifest.json by re-running build-manifest.ts and restored the launch fields from the committed native-refresh redacted manifest, then recomputed the redacted auth booleans; the restored file lists the same nine subjects and fields, and the Claude argv, digests and bases are unchanged."
blockers:
  - "Owner action: sign in with the helper (below). Independent reinspection of this helper is the next step before the owner relies on it."


# Operator instructions (successor)

Use only the helper; the manual per-root commands from the earlier receipt are retired so there is one source of truth (they inherited the shell's token and nested-harness variables). The earlier receipt and its review are unchanged.

```sh
bun /tmp/ruach-implementation-20261011/live/owner-login.ts --list      # nothing runs or is created
bun /tmp/ruach-implementation-20261011/live/owner-login.ts --status    # redacted true/false, creates nothing
bun /tmp/ruach-implementation-20261011/live/owner-login.ts              # sign in, root by root
bun /tmp/ruach-implementation-20261011/live/owner-login.ts --only codex-snapshot --device-auth
```

Roots: `claude-plugin`, `claude-adapter`, `claude-skills-cli`, `r3-claude` (R3 cases), `enoch-claude`, `codex-snapshot`, `codex-skills-cli`. Run it from a plain terminal. Unknown flags or root names are rejected before anything happens. Login goes through the CLI's own prompt in the terminal; the helper then prints only `logged in = true`, `false` or `unknown (reason)`. Claude stores its sign-in under that root's `claude/` directory; Codex is pinned to file storage under that root's `codex/` directory, never the system keyring. Proxy and certificate variables are passed on unprinted; tokens, API keys and nested-harness variables are never passed. Native clients may also write their own cache and log files in the root.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
