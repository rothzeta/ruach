# prep-evidence — bounded native observations (redacted)

All commands ran in the task-local scratch through the clean task wrapper or the
enriched runner with an explicit `OPENCODE_RUN_CONFIG`. No task prompt was sent;
no credential, raw provider config, auth/status or workflow body was read, and no
subject was launched.

## Permission behavior of preparation turn 1 (historical)

- Owned scratch write: `write /tmp/ruach-implementation-20261011/opencode/launch/write-probe.txt` → **allowed**.
- Scratch `configs/` write → **denied** (`edit` allowed only under `launch/**` and `results/**` in scratch). Configs were placed under this committed evidence directory instead.
- Readback of `live/manifest.json`, `live/enoch-preflight.sh` and the runtime configs was denied to session 1; those files were not read.

## Go provider / catalog (historical)

| Command (via wrapper) | Result |
| --- | --- |
| `opencode --version` | exit 0, `1.19.0` |
| `opencode models opencode-go` (runtime config) | exit 0, lists `opencode-go/deepseek-v4.1-flash` |
| `opencode models opencode-go` (bare PATH binary) | exit 1, `Provider not found: opencode-go` (no task config) |
| `opencode models` with no provider block and `enabled_providers:["opencode-go"]` | exit 0, 31 `opencode-go/*` models — the provider resolves from the credential store / built-in catalog without a provider block or embedded key |
| `provider.opencode-go.models` restricted to one model | exit 0, catalog still lists all 31 — **a static model whitelist is not enforceable**; selection is pinned at `model`/`small_model`/agent plus `--model`, no fallback |

## Subject configs — turn 1 (historical)

The turn-1 configs exposed the smoke consumer's `.agents/skills` workflow bodies
and had no explicit workflow deny; this is the B2 finding INSPECT1 raised and
PREP-FIX1 corrects. It is preserved here as the observation that motivated the
fix.

## PREP-FIX1 correction checks (new)

Corrected tested assets: five `configs/oc-*.json`, `tools/verify-baselines.ts`,
`runners/opencode` (scratch and public copies identical, mode 755). All checks
below ran config-only through the enriched runner
`launch/runners/opencode` with the exact subject config and cwd; no model call.

### B1 — grader tool fail-closed (fixture self-test)

`bun launch/fixture-tests.ts` builds synthetic r3 and enoch layouts/repos and
asserts:
`r3 pristine` PASS; `r3 legitimate outputs` (record.md edited, `drafts/` added,
`intents.jsonl` added) PASS; `r3 protected removal` FAIL exit 1; `r3 protected
change` FAIL; `r3 protected addition` FAIL; `r3 boundary name` (`record.md.evil`)
FAIL; `enoch legitimate` PASS; `enoch protected test change` FAIL; `enoch
out-of-scope add` (`docs/OTHER.md`) FAIL; `enoch mutable boundary name`
(`docs/TASK_LOGS.md.evil`) FAIL; `enoch TASK_LOGS non-append` FAIL. Against the
real pristine fixtures: `real r3`, `real smoke`, `real enoch` all PASS.
Result: **ALL FIXTURE CHECKS PASS**. The tool now fails closed on every protected
removal/addition/modification outside allowed paths, uses boundary-safe matching,
and checks the full smoke/enoch git scope plus append-only `TASK_LOGS.md`.

### B2 — worker workflow read/skill denial and skill selection

`bun launch/fix-native-verify.ts` (all 13-15 checks per subject pass) shows, for
each subject at its real cwd:

| Subject | workflow skills discovered | intended technical skills present |
| --- | --- | --- |
| oc-smoke | 0 (`OPENCODE_DISABLE_EXTERNAL_SKILLS=true`) | handoff, testing |
| oc-resume / oc-ambiguity / oc-authorization | 1 (`ruach-workflow-feature` only) | handoff, herdr |
| oc-enoch | 0 | handoff, testing |

Resolved agent permission contains: `read` `*` allow plus
`**/skills/ruach-workflow-*/**` and `**/ruach-workflow-*/**` deny (coordinators
additionally re-allow `**/ruach-workflow-feature/**` last); `skill` `*` deny
with an allowlist (`handoff`/`testing`, or `handoff`/`herdr`/feature for
coordinators); `edit` `*` deny with both relative and absolute owned targets;
`task` deny; `external_directory` `*` deny. `bun launch/fix-verify.ts` also
confirms `OPENCODE_DISABLE_EXTERNAL_SKILLS` suppresses the project
`.agents/skills` while config `skills.paths` survive (feature workflow still
discovered with the flag on), so one runner default works for every subject
(O1 resolved without a per-role exception).

### Enriched runner

`launch/runners/opencode` (public copy `runners/opencode`) refuses to run without
an explicit existing `OPENCODE_RUN_CONFIG`, sets `OPENCODE_CONFIG` from it, uses
`env -i` (scrubs nested auth/harness vars, forwards only proxy/cert vars), sets a
fixed local Git identity, and defaults the external-skill suppression on. Root
`bin`/`config`/auth store were not changed.

### O2 / O4

All launch and grading recipes now use absolute paths and stated cwds
(`root-launch-packet.md`, `reviewer-grading-packet.md`). The reused smoke packet's
`evidence/config.json` hardcodes `/home/metatron/.local/bin/bun`, which was
verified to exist, so no external checker configuration is required; the recipe
uses the distinct OpenCode-only tag `opencode1`. The installed current Bun is
`/home/metatron/.bun/bin/bun` (`1.4.2`); both resolve.

### O5

A literal catalog whitelist is not enforceable in OpenCode 1.19.0. The route is
bound by pinned `model`/`small_model`/agent model, `enabled_providers:
["opencode-go"]` and the explicit `--model`, with no alternate agent/model
selection. Accepted as the equivalent; no further provider investigation.

## Limits

- No subject ran; Go Flash entitlement, actual allow/deny enforcement and native
  relative/absolute edit-path matching at run time remain first-turn evidence.
- Opaque native skill catalogs were parsed in code and only filtered names were
  captured; no workflow body was printed or interpreted.
- All native help/catalog output is summarized, not reproduced, and contains no
  credential or provider secret.
