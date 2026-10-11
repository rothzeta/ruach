# prep-evidence — bounded native observations (redacted)

All commands ran in the task-local scratch through
`/tmp/ruach-implementation-20261011/opencode/bin/opencode` (installed OpenCode
`1.19.0`) with `OPENCODE_RUN_CONFIG` pointing at the runtime config, except where
noted. No task prompt was sent; no credential, raw provider config, auth/status
or workflow body was read, and no subject was launched.

## Permission behavior of this preparation turn

- Owned scratch write: `write /tmp/ruach-implementation-20261011/opencode/launch/write-probe.txt` → **allowed**.
- Scratch `configs/` write → **denied** (`edit` allowed only under `launch/**` and `results/**` in scratch). Configs were placed under this committed evidence directory instead.
- Readback of `live/manifest.json`, `live/enoch-preflight.sh` and the runtime
  configs was denied to this session; those files were not read.

## Go provider / catalog

| Command (via wrapper) | Result |
| --- | --- |
| `opencode --version` | exit 0, `1.19.0` |
| `opencode models opencode-go` (runtime config) | exit 0, lists `opencode-go/deepseek-v4.1-flash` |
| `opencode models opencode-go` (bare PATH binary) | exit 1, `Provider not found: opencode-go` (no task config) |
| `opencode models` with a config that has **no** provider block and `enabled_providers:["opencode-go"]` | exit 0, 31 `opencode-go/*` models — the provider resolves from the credential store / built-in catalog without a provider block or embedded key |
| `provider.opencode-go.models` restricted to one model | exit 0, catalog still lists all 31 — **a static model whitelist is not enforceable**; the whitelist is the pinned `model`/`small_model`/agent model plus `--model`, with no fallback |

## Subject configs (config-only, no task prompt)

For each prepared config the wrapper loaded it and resolved skills, the role
agent and the Go catalog, all exit 0:

| Subject | skills exposed | role agent |
| --- | --- | --- |
| oc-smoke | `customize-opencode`, the consumer `.agents/skills/*` (incl. `ruach-workflow-feature`, `ruach-workflow-knowledge`), plus configured `ruach-handoff`, `ruach-testing` | `ruach-implementer` |
| oc-resume / oc-ambiguity / oc-authorization | `customize-opencode`, `ruach-handoff`, `ruach-testing`, `ruach-herdr`, `ruach-workflow-feature` | `ruach-coordinator` |
| oc-enoch | `customize-opencode`, `ruach-handoff`, `ruach-testing` | `ruach-implementer` |

`ruach-testing`/`ruach-handoff` also come from
`OPENCODE_CONFIG_DIR=$TASK/native-skills/preparer`; the coordinator set adds the
whitelisted `live/r3/resources/skills` copy and **only** the feature workflow.

Resolved permission for each agent (from `opencode debug agent <name>`)
contains the prepared default-deny block last: `* deny`, `edit * deny` then the
exact edit targets, `bash * deny` then the exact commands, `task/question/webfetch/
websearch/doom_loop deny`, and `external_directory * deny` then the exact roots.
opencode evaluates the **last** matching rule, and the prepared block is the last
matching rule for those keys, so the exact allows win and everything else stays
denied. Base defaults still add narrow safe allows (e.g.
`opencode/data/.../tool-output/*`, `*.env.example`), noted but not modified.

## Discovered exposure (needs root action)

The smoke consumer's project `.agents/skills` is auto-discovered, exposing
`ruach-workflow-feature` and `ruach-workflow-knowledge` **bodies** to an
Implementer. `OPENCODE_DISABLE_EXTERNAL_SKILLS` is the documented mitigation but
is not forwarded by the wrapper, so it could not be verified here; see
`root-launch-packet.md`. The other four cwds have no project `.agents`.

## Grading tool

`tools/verify-baselines.ts` was run against the pristine fixtures:
`RESULT: PASS` for smoke protected digests, all enoch protected digests
(`api.ts` still at seed) and all three r3 corpora (no unexpected changes).

## Limits

- No subject ran; Go Flash entitlement, actual permission enforcement at run
  time and the skills-suppression flag are first-turn evidence.
- All native help/catalog output is summarized, not reproduced, and contains no
  credential or provider secret.
