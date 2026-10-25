task: ROUTE-TESTER-01
status: complete
outcome: "Committed the authorized development Codex alternatives and Tester preference; offline resolution and affected checks pass, without changing native launch/behavior holds."
source_baseline: 0d9b2f06d87ac5ee81a5917b9d0f7a035f89640d
candidate_revision: 8c6ab62a777c9b229be7fcb1001e69ae9a84eb9a
tested_revision: 8c6ab62a777c9b229be7fcb1001e69ae9a84eb9a
artifacts:
  - config/agent-routing/roles.yaml
  - docs/reports/c1-c5/tester-routing.md
  - docs/assignments/c1-c5/ROUTE-TESTER-01.md
  - /tmp/ruach-tester-routing-q7m0keoN
verification:
  - "Existing source wrapper: 17 offline resolutions from /tmp, exit 0 each; accepted Tester bytes/hash match, all existing preferences/alternatives and explicit Codex alternatives resolve."
  - "just check: exit 0, resource/link/notice checks and TypeScript check passed."
  - "Affected root routing tests: exit 0, 18 pass/0 fail."
  - "bun run release-check: exit 0; existing 0.6.1 metadata preserved."
  - "git diff --check and SHA-256 checks for unchanged assignment and read-only main catalog: exit 0."
  - "Canonical handoff validator --repo and final resource check: exit 0; all revision references resolved with no diagnostics."
review: not-run
discoveries:
  - "Tester uses the existing gpt-6.1-sol-high model/route and wrapper-owned auto-review policy; no model, permission or routing framework change is needed."
blockers: []

# Tester development routing

Only `config/agent-routing/roles.yaml` changes in the source candidate. The six existing preferred routes and all prior alternatives retain their values/order. Each existing role receives the Coordinator-owned explicit `gpt-6.1-sol-high` alternative read from the authorized main metadata. Tester prefers that same route. Models, effort routes and wrapper permission policy are unchanged; no permissions enter the catalogs. This is Ruach development policy, not a consumer default.

The main file `/opt/dev/ruach/config/agent-routing/roles.yaml` was read only and its SHA-256 remained unchanged at verification. Its pending edit stays available for later safe delivery. Protected transport/helpers/tests, instruction bodies and other source are unchanged. The untracked `C-IN-01.md` draft was not read, adopted or committed. No other assignment/evidence file was changed. This report and unchanged assignment are an evidence-only successor; their creating SHA is returned externally.

## Offline result and verification

From foreign cwd `/tmp`, the exact source command was:

```sh
bun /opt/dev/ruach-worktrees/c15-instructions/scripts/agent-routing.ts resolve tester
```

Exit 0 selected canonical `agents/tester.md` in this source checkout, route `gpt-6.1-sol-high`, kind `codex`, model `gpt-6.1-sol`, effort `high`, permissions `auto-review`. Its role bytes match accepted instruction candidate `90230d165f41b90969037fdf7cf93e1a85d69396`, SHA-256 `63c3de0422165cbd792d8db7b1bd34f4aeb83364d1952fe924dee361b792ff7f`. Output is `resolved-offline`, `launchable: false`, empty argv/temporary operations, `submission_state: not-submitted` and diagnostic `offline_unverified`. Stderr attributes permission policy to the existing source wrapper. No native executable, config, entitlement, launch-space readiness or runtime capability is established.

The existing wrapper/resolver validates the entire catalog graph. Seventeen invocations covered Tester, each existing preferred route, all four previous alternatives and all six explicit Codex alternatives. The temporary driver invokes existing resolution and checks its public JSON; it does not parse catalogs or replace the resolver. Exact argv/cwds/exits and full outputs are in `offline-resolution.json` and per-call stdout/stderr files under `/tmp/ruach-tester-routing-q7m0keoN`.

| Command | Cwd / result | Retained log |
| --- | --- | --- |
| `timeout 300s bun /tmp/ruach-tester-routing-q7m0keoN/resolve.ts` | `/tmp` / 0, 17 wrapper resolutions and accepted Tester hash comparison | `offline-resolution.log`, `offline-resolution.json` |
| `timeout 300s just check` | Worktree / 0 | `check.log` |
| `timeout 300s bun test --timeout 30000 tests/agent-routing.test.ts tests/readme-routing.test.ts` | Worktree / 0, 18 pass/0 fail | `routing-tests.log` |
| `timeout 300s bun run release-check` | Worktree / 0 | `release-check.log` |
| `git diff --check` | Worktree / 0 | `diff-check.log` |
| `sha256sum -c /tmp/ruach-tester-routing-q7m0keoN/main-roles.sha256 /tmp/ruach-tester-routing-q7m0keoN/assignment.sha256` | Worktree / 0, both unchanged | `preservation-check.log`; retained digest files |

Worktree cwd is `/opt/dev/ruach-worktrees/c15-instructions`. Frozen dependencies were already present. No tests were added or altered for this small reversible catalog change. Default local commit hit shared-gitdir `index.lock` read-only protection; the explicitly authorized scoped Git escalation committed only the catalog. No test/environment failure was hidden or converted to a pass.

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/tester-routing.md --repo /opt/dev/ruach-worktrees/c15-instructions` exited 0 with `ok: true`, all three revisions resolved and no diagnostics (`handoff-validate.log`). Final `bun scripts/check.ts` including the report exited 0 (`final-resource-check.log`). This mechanical validation does not establish independent acceptance or native capabilities.

## Preserved holds and scope

Instruction-source acceptance at `e3d93d6` is attributed to this assignment's authority; it does not establish native Tester behavior. LAUNCH source `2c114e8` remains under its separate independent live/code review and fresh-worker native-identity hold. This routing change neither accepts it nor changes its exact prior evidence. Tester role/transport readiness, actual runtime/browser/desktop/audio capabilities and behavioral demonstrations remain unverified. C-IN integration and delivery remain separate future assignments.

No native/paid launch, security-dialog answer, root-main write, merge/delivery, tag/push/global install or task-resource cleanup occurred. Current native identity and Codex high/auto-review route were not changed. Retain this worktree/branch/session and the named temporary evidence directory for Coordinator disposition; existing task resources remain untouched.
