# root-launch-packet — OpenCode subjects (root-owned)

For the root launcher only (PREP-FIX1). Nothing here launches a subject. All
five subjects use model **`opencode-go/deepseek-v4.1-flash`** only; no fallback,
no subagents, one turn each, 20-minute wall cap.

## Enriched runner

Use the task-local enriched runner, committed at
`docs/reports/next-release/opencode-preparation/runners/opencode` (mode 755);
a byte-identical scratch copy lives at
`/tmp/ruach-implementation-20261011/opencode/launch/runners/opencode`. It:

- builds the clean task-private environment (`HOME/XDG_*` under
  `/tmp/ruach-implementation-20261011/opencode`, one existing auth store,
  pinned Node22 + CLI 1.19.0);
- **requires** an explicit existing `OPENCODE_RUN_CONFIG` and sets
  `OPENCODE_CONFIG` from it, so a bare child can never fall back to the older
  Zen/V4 runtime configuration;
- sets `OPENCODE_DISABLE_EXTERNAL_SKILLS=true` (and
  `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=true`) by default, suppressing the smoke
  consumer's auto-discovered `.agents/skills` workflow bodies;
- sets a fixed local Git identity via `GIT_AUTHOR_*`/`GIT_COMMITTER_*`
  (override with `OPENCODE_GIT_NAME`/`OPENCODE_GIT_EMAIL` if desired);
- uses `env -i` to scrub nested auth/harness variables and forwards only safe
  proxy/cert variables (values never printed).

`OPENCODE_CONFIG/OPENCODE_CONFIG_DIR` are inherited/preserved when nested
diagnostics re-invoke the runner, so diagnostics never silently use the old
config. No root `bin`/`config`/auth store was changed.

## Invocation

```sh
EV=/opt/dev/ruach/.worktrees/opencode-preparation/docs/reports/next-release/opencode-preparation
export OPENCODE_RUN_CONFIG="$EV/configs/<config>.json"
export OPENCODE_RUN_CONFIG_DIR=/tmp/ruach-implementation-20261011/opencode/native-skills/preparer
"$EV/runners/opencode" run \
  --model opencode-go/deepseek-v4.1-flash \
  --agent <agent> \
  --dir <cwd> \
  "$(cat "$EV/briefs/<brief>.md")"
```

No `--auto`. The configs are default-deny with exact allows; `--auto` would
auto-approve `ask` rules. Do not add other providers or models.

## Subject rows

| Subject | Role agent | cwd (`--dir`) | config | brief | external-skill suppression |
| --- | --- | --- | --- | --- | --- |
| oc-smoke | `ruach-implementer` | `/tmp/ruach-implementation-20261011/live/smoke/codex-snapshot/consumer` | `configs/oc-smoke.json` | `briefs/oc-smoke.md` | `true` (required) |
| oc-resume | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume` | `configs/oc-resume.json` | `briefs/oc-resume.md` | `true` |
| oc-ambiguity | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/02-ambiguity` | `configs/oc-ambiguity.json` | `briefs/oc-ambiguity.md` | `true` |
| oc-authorization | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/03-authorization` | `configs/oc-authorization.json` | `briefs/oc-authorization.md` | `true` |
| oc-enoch | `ruach-implementer` | `/tmp/ruach-implementation-20261011/enoch-exercise/clone` | `configs/oc-enoch.json` | `briefs/oc-enoch.md` | `true` |

The runner defaults suppression on for every subject; the coordinator configs'
`skills.paths` (handoff, herdr, feature workflow) were verified to survive the
flag, so no per-role exception is needed. A coordinator recipe may set
`OPENCODE_DISABLE_EXTERNAL_SKILLS=false` only if a future change requires it.

Launch one subject at a time. Confirm the reused names are still unused
immediately before each start. Five subject turns remain unspent.

## Worker workflow denial (B2)

Independently of discovery, every implementer config now explicitly denies
workflow `read` (`**/skills/ruach-workflow-*/**`, `**/ruach-workflow-*/**` →
`deny`) and restricts `skill` to an allowlist (`handoff`, `testing`; default
`*` deny). Coordinator configs deny all workflows and then re-allow only
`ruach-workflow-feature`, with `skill` allowlisted to handoff/herdr/feature.
This is a belt over the suppression flag. Exact enforcement at run time remains
first-turn evidence.

## Provenance and model route

- Source revision: accepted `94cdfa1a68e214a07d27fc5d413863dcbe3e7459`; subject
  resources from the detached clone `/tmp/ruach-implementation-20261011/live/source`.
- Roles injected by prompt `{file:.../agents/{implementer,coordinator}.md}`.
- Provider `opencode-go` resolves from the credential store; no key or raw
  provider config is in any prepared file.
- Go Flash-only route is bound by the pinned `model`/`small_model`/agent model
  plus the explicit `--model`. A literal catalog whitelist is not enforceable in
  OpenCode 1.19.0 (catalog still lists all models); pinning with provider
  restriction and no alternate selection is the accepted equivalent (O5).
  Every model/utility call stays on Go Flash; no other model is exposed.

## Cleanup (after grading; root owns)

- oc-smoke: keep the subject commit on branch `main` until graded, then reset
  the consumer to base `868159c737895b4c0a4d58c628379b9cd9877857` and remove
  `docs/reports/smoke.md`.
- oc-resume/ambiguity/authorization: subject edits are `record.md`, `drafts/**`
  and (01) `intents.jsonl`; nothing is committed. The whole
  `/tmp/ruach-implementation-20261011/live/r3/packet` is Coordinator-owned and
  disposable after grading.
- oc-enoch: the subject creates branch `ruach-exercise/url-encoding-subject` and
  commits. After grading, delete that branch and reset to seed
  `ea33fc70456bf45bdd51e6eedcb83cf5cdf89347`, or discard
  `/tmp/ruach-implementation-20261011/enoch-exercise/`.
- Read-only for the root: credential store, `live/roots/**`, and
  `opencode/{cli,configs,data,bin}` except as the runner already uses them.
