task: RUACH-ROADMAP-IMPLEMENTATION/R-LOGIN-HELPER-RV2
status: complete
outcome: "Login helper v2 at db7a78b (sha256 b41dd032...) is ready for the owner to run. All six RV1 recommendations are applied, the operator copy and live manifest match the committed source, and both Codex subject argv pin file credential storage. No blocking findings; 2 optional record notes. No login, credential read, native auth status, model task or worker launch was performed."
verdict: ready-for-owner
baseline_revision: f383bfb0a7c5f23ec758450309bca86d0fb60c87
reviewed_revision: db7a78b1fed004c3e2de092dee08c2a293698b48
helper_sha256: b41dd032f704cc51fb450090bceb27feb8c3b1532234196475a154b1849e8e50
operator_copy: /tmp/ruach-implementation-20261011/live/owner-login.ts
artifacts:
  - docs/reports/next-release/login-helper-review2.md
  - docs/assignments/next-release/login-helper-review2.md
verification:
  - "Resolved db7a78b to db7a78b1fed004c3e2de092dee08c2a293698b48 (parent b8b85ee, native-refresh). Read via git show: native-login-hardening.md, native-login-hardening/owner-login.ts, native-login-hardening/manifest.redacted.json and the hardening amendment"
  - "Byte identity: sha256 of the committed helper blob and of /tmp/ruach-implementation-20261011/live/owner-login.ts are both b41dd032...e8e50, as expected; no mismatch"
  - "Manifest: jq -S diff of native-refresh/manifest.redacted.json (b8b85ee) against native-login-hardening/manifest.redacted.json (db7a78b) shows only the added login_helper record (v2, path, sha256) and -c cli_auth_credentials_store=\"file\" appended to the codex-snapshot and codex-skills-cli argv; model gpt-6.1-sol, effort high, --approve-for-me, --no-alt-screen, cwd and the redacted developer_instructions are unchanged, and Claude rows are untouched. The live manifest.json Codex argv (role text masked by jq) equals the redacted argv, and its login_helper.sha256 is b41dd032"
  - "Installed help with env -i and an empty scratch HOME and CODEX_HOME (no task or real root): codex login status lists -c/--config; codex top-level help lists -c, --cd, --approve-for-me and --no-alt-screen"
  - "Independent fake-CLI probes in session scratch: the committed helper copied with only the root-base constant changed (2 diff lines), fake claude and codex logging argv, cwd and env NAMES only, caller env carrying fake ANTHROPIC_API_KEY, OPENAI_API_KEY, CLAUDE_CODE_OAUTH_TOKEN, CLAUDE_CODE_SESSION_ID, CODEX_API_KEY, a credentialed HTTPS_PROXY and SSL_CERT_FILE"
  - "Probe 1 --lsit: exit 2 with the allowed list, 0 CLI calls, tree unchanged. Probe 2 --list --status: exit 2 (exclusive)"
  - "Probe 3 --list --only codex-snapshot --device-auth: exit 0; printed cwd <root>/home, HOME, XDG and CODEX_HOME only, login 'codex login -c cli_auth_credentials_store=\"file\" --device-auth', status with the same -c; 0 SECRET strings, 0 calls, nothing created"
  - "Probe 4 --status with roots missing: exit 1, 'unknown (root directories missing (nothing created in this mode))', 0 calls, base tree unchanged"
  - "Probe 5 --status with existing roots at 0775: 2 status calls (claude auth status --json; codex login status -c cli_auth_credentials_store=\"file\"), cwd <root>/home, logged in = false; tree paths and modes unchanged (no helper mkdir or chmod)"
  - "Probe 6 login mode --only claude-plugin --only codex-snapshot: only the two selected roots touched, tightened to 0700; claude auth login --claudeai and codex login -c cli_auth_credentials_store=\"file\" ran with cwd <root>/home and CLAUDE_CONFIG_DIR or CODEX_HOME = the fixed root; afterwards logged in = true, exit 0. The child env names across all calls were CLAUDE_CONFIG_DIR, CODEX_HOME, HOME, HTTPS_PROXY, PATH, SSL_CERT_FILE, TERM, XDG_CACHE_HOME, XDG_CONFIG_HOME (plus shell-set PWD, SHLVL, _), with no token, API-key or CLAUDE_CODE_* variables. The fake status JSON email and token never appeared in helper output; the only SECRET string in the terminal was the fake login's own inherited prompt line"
  - "Probe 7 claude absent from PATH: logged in = unknown (claude not found on PATH), exit 1"
  - "Not run: any real login, real claude auth status or codex login status, credential file read, model task, worker, full suites, workflow search"
discoveries:
  - "Native CLI login output reaches the owner's terminal directly (stdio inherit), so the CLI's own prompt may show identity or URLs. The helper's own lines are limited to banners, a redacted boolean or reason, and the login exit code."
  - "The helper keeps DBUS_SESSION_BUS_ADDRESS and XDG_RUNTIME_DIR (for browser hand-off). With Codex pinned to file storage and Claude on Linux using CLAUDE_CONFIG_DIR, I found no remaining keyring path in the helper's argv. Native client internals were not inspected."
blockers: []

# Owner login helper v2 review

Reviewer: canonical Reviewer, same session and branch. Bounded inspection of the corrected helper and the launch fields it changes, under owner decisions DEC-I006 ("I'll authenticate the isolated roots myself") and DEC-I005 ("Approve 9 capped runs"). This inspection launches nothing. Accepted product source `94cdfa1a` was not reviewed or edited.

## RV1 recommendations

| RV1 | Status | Evidence |
| --- | --- | --- |
| O1 Codex credential store | **Resolved** | `STORE = cli_auth_credentials_store="file"` is on `codex login` and `codex login status` (`owner-login.ts:40-42`), and on both Codex subject argv in the redacted and live manifests. Installed help accepts `-c` on `login status`. |
| O2 manual commands inherit auth env | **Resolved** | Manual per-root commands are retired; the helper is the single source. Its allowlist drops token, API-key and nested-harness variables (probe 6). |
| O3 unknown arguments | **Resolved** | A strict parser exits 2 before any mutation or call. `--only` values are checked against the fixed names, and `--list` with `--status` is refused (probes 1 to 3). |
| O4 failure reasons | **Resolved** | Redacted reasons for ENOENT, timeout, unparseable output, a non-zero status and the login exit code (probe 7). Proxy and certificate variables are forwarded, and their values are never printed (`--list` filters to HOME and config variables only). |
| O5 working directory | **Resolved** | `cwd: <root>/home` for both status and login (probes 5 and 6). |
| O6 status mutation | **Resolved, with caveat** | `--list` and `--status` call no helper `mkdir` or `chmod`, and missing roots report `unknown` with a reason (probes 3 to 5). As the author discloses, the native client itself may write runtime state into an existing root when status runs. |

Other boundaries hold. The seven fixed roots are hard-coded. The helper never opens a credential file, prints only booleans or reasons from status, uses `stdio: 'inherit'` for login so the owner answers every prompt and dialog, and calls no model, agent or Herdr.

## Blocking findings

None.

## Optional findings

### N1. A fake-probe artifact is listed but not committed

- **Location:** the `native-login-hardening.md` artifacts list (`docs/reports/next-release/native-login-hardening/fake-probe-calls.log`).
- **Evidence:** `git ls-tree db7a78b` under `native-login-hardening/` holds only `manifest.redacted.json` and `owner-login.ts`.
- **Why it matters:** the record names evidence that does not exist. My independent probes above cover the same behavior, so readiness is unaffected.
- **Direction:** commit the log, or drop it from the artifacts list in a later report. Do not rewrite this commit.

### N2. "Creates nothing" covers only the task roots

- **Location:** the helper header and successor instructions (`--list`/`--status`: "creates nothing").
- **Evidence:** in probes run under a scratch caller HOME, the Bun runtime created its own transpiler cache at `$HOME/.bun/install/cache`. That is normal Bun behavior, not helper code, and holds no credentials.
- **Direction:** optionally say "creates nothing under the task roots".

## Validation

I ran the canonical `skills/ruach-handoff/scripts/validate.ts <report> --repo .` and `git diff --check` on this report before committing it. I removed the probe and help scratch afterwards. No task auth root, live resource or real configuration was touched.
