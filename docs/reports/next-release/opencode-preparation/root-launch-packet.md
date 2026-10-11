# root-launch-packet — OpenCode subjects (root-owned)

For the root launcher only. Nothing here was executed by preparation. All five
subjects use model **`opencode-go/deepseek-v4.1-flash`** only; no fallback, no
subagents, one turn each, 20-minute wall cap.

## Common environment (from the existing clean wrapper)

`/tmp/ruach-implementation-20261011/opencode/bin/opencode` builds this fixed
environment (verbatim fields, values not secret). The wrapper only forwards
`HTTPS_PROXY HTTP_PROXY ALL_PROXY NO_PROXY https_proxy http_proxy all_proxy
no_proxy SSL_CERT_FILE SSL_CERT_DIR NODE_EXTRA_CA_CERTS` from its own
environment.

```
PATH=$TASK/bin:$TASK/cli/node_modules/.bin:/tmp/ruach-implementation-20261011/live/node22/node-v22.23.3-linux-x64/bin:/home/metatron/.bun/bin:/usr/local/bin:/usr/bin:/bin
HOME=$TASK/home
XDG_CONFIG_HOME=$TASK/config
XDG_DATA_HOME=$TASK/data
XDG_CACHE_HOME=$TASK/cache
XDG_STATE_HOME=$TASK/state
OPENCODE_CONFIG=<subject config from this directory>
OPENCODE_CONFIG_DIR=$TASK/native-skills/preparer
OPENCODE_DISABLE_AUTOUPDATE=true
OPENCODE_DISABLE_CLAUDE_CODE=true
OPENCODE_DISABLE_LSP_DOWNLOAD=true
TERM=xterm-256color
```
with `TASK=/tmp/ruach-implementation-20261011/opencode`.

**Wrapper limitation found during preparation.** The wrapper does not forward
arbitrary variables, so `OPENCODE_DISABLE_EXTERNAL_SKILLS=true` (and
`GIT_AUTHOR_*`/`GIT_COMMITTER_*`) cannot be passed through it. Launch the
installed CLI directly with the same environment plus the additions below, or
use an equivalent root-owned enriched wrapper. This is a launch-mechanics
change only; no product code changes.

## Recommended invocation (direct CLI, clean env)

```sh
TASK=/tmp/ruach-implementation-20261011/opencode
EV=/opt/dev/ruach/.worktrees/opencode-preparation/docs/reports/next-release/opencode-preparation
env -i \
  PATH="$TASK/bin:$TASK/cli/node_modules/.bin:/tmp/ruach-implementation-20261011/live/node22/node-v22.23.3-linux-x64/bin:/home/metatron/.bun/bin:/usr/local/bin:/usr/bin:/bin" \
  HOME="$TASK/home" XDG_CONFIG_HOME="$TASK/config" XDG_DATA_HOME="$TASK/data" \
  XDG_CACHE_HOME="$TASK/cache" XDG_STATE_HOME="$TASK/state" \
  OPENCODE_CONFIG="$EV/configs/<config>.json" OPENCODE_CONFIG_DIR="$TASK/native-skills/preparer" \
  OPENCODE_DISABLE_AUTOUPDATE=true OPENCODE_DISABLE_CLAUDE_CODE=true \
  OPENCODE_DISABLE_LSP_DOWNLOAD=true \
  OPENCODE_DISABLE_EXTERNAL_SKILLS=true OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=true \
  GIT_AUTHOR_NAME='OpenCode Subject' GIT_AUTHOR_EMAIL='subject@example.invalid' \
  GIT_COMMITTER_NAME='OpenCode Subject' GIT_COMMITTER_EMAIL='subject@example.invalid' \
  TERM=xterm-256color \
  timeout 1200 "$TASK/cli/node_modules/.bin/opencode" run \
    --model opencode-go/deepseek-v4.1-flash \
    --agent <agent> \
    --dir <cwd> \
    "$(cat "$EV/briefs/<brief>.md")"
```

Forward any of the wrapper's proxy/cert variables from the launching shell if
present. Do not add `--auto`; the configs are already default-deny with exact
allows, and `--auto` would auto-approve `ask` rules.

## Subject rows

| Subject | Role agent | cwd (`--dir`) | config | brief | wall cap |
| --- | --- | --- | --- | --- | --- |
| oc-smoke | `ruach-implementer` | `/tmp/ruach-implementation-20261011/live/smoke/codex-snapshot/consumer` | `configs/oc-smoke.json` | `briefs/oc-smoke.md` | 20 min |
| oc-resume | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume` | `configs/oc-resume.json` | `briefs/oc-resume.md` | 20 min |
| oc-ambiguity | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/02-ambiguity` | `configs/oc-ambiguity.json` | `briefs/oc-ambiguity.md` | 20 min |
| oc-authorization | `ruach-coordinator` | `/tmp/ruach-implementation-20261011/live/r3/packet/subject/03-authorization` | `configs/oc-authorization.json` | `briefs/oc-authorization.md` | 20 min |
| oc-enoch | `ruach-implementer` | `/tmp/ruach-implementation-20261011/enoch-exercise/clone` | `configs/oc-enoch.json` | `briefs/oc-enoch.md` | 20 min |

Launch one subject at a time. Confirm the reused names `oc-smoke, oc-resume,
oc-ambiguity, oc-authorization, oc-enoch` are still unused immediately before
each start. Five subject turns are reserved; zero had been spent when this was
prepared.

## Provenance

- Source revision: accepted `94cdfa1a68e214a07d27fc5d413863dcbe3e7459`; the
  subject resource copy is the detached clone at
  `/tmp/ruach-implementation-20261011/live/source`.
- Roles injected by prompt `{file:.../live/source/agents/implementer.md}` and
  `.../coordinator.md`. Role digests (from the accepted `.agents/ruach.json`):
  implementer `233b5d88d29f5cb90cfbe1c2ea72f3a75e0bf8126900bf5fa8831d261474db59`,
  coordinator `00ce2c8ab6c96ad5fd38b0550a9464470b2e583eb833692ed26586e424e6d31d`.
- Skills: implementer gets `ruach-handoff` + `ruach-testing` from the source
  tree; coordinator gets the whitelisted copy at
  `live/r3/resources/skills/{ruach-handoff,ruach-herdr,ruach-workflow-feature}`
  (feature workflow only). Workflow bodies were not read.
- Provider: `opencode-go` resolves from the credential store; no key or raw
  provider config is in any prepared file.
- Native catalog observed: `opencode-go/deepseek-v4.1-flash` present; version
  `1.19.0`.

## Known exposure the root must resolve before oc-smoke

The smoke consumer contains a project `.agents/skills` directory. opencode
auto-discovers it, so an unadjusted launch exposes `ruach-workflow-feature` and
`ruach-workflow-knowledge` **bodies** to an Implementer, contrary to the
"worker technical skills without workflow-body access" rule. Setting
`OPENCODE_DISABLE_EXTERNAL_SKILLS=true` (and
`OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=true`) is the intended mitigation but could
not be verified through the wrapper (see `prep-evidence.md`). Before the first
subject: run `opencode debug skill` with the smoke config and confirm only
`ruach-handoff` and `ruach-testing` appear; if not, resolve before launch or
record the accepted exception. The other four cwds have no project `.agents`
and exposed only the configured skills in preparation.

## Cleanup (after grading; root owns)

- oc-smoke: the subject commits on branch `main` in the consumer; keep the commit
  until `check.ts` has graded it, then reset the consumer to base
  `868159c737895b4c0a4d58c628379b9cd9877857` and remove `docs/reports/smoke.md`.
- oc-resume/ambiguity/authorization: subject edits are `record.md`, `drafts/**`
  and (01) `intents.jsonl`; nothing is committed. The whole
  `/tmp/ruach-implementation-20261011/live/r3/packet` is Coordinator-owned and
  disposable after grading.
- oc-enoch: the subject creates branch `ruach-exercise/url-encoding-subject` and
  commits. After grading, delete that branch and reset to seed
  `ea33fc70456bf45bdd51e6eedcb83cf5cdf89347`, or discard
  `/tmp/ruach-implementation-20261011/enoch-exercise/`.
- Read-only for the root: credential store, `/tmp/ruach-implementation-20261011/live/roots/**`,
  `opencode/{cli,configs,data,bin}` except as the existing wrapper already uses them.
