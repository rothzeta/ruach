task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-PREFLIGHT4
status: complete
reviewed_revision: a5e3cec1c1b81b289c6700e3763af1642441865c
outcome: "F1 corrected and independently verified. In all three corpus-v2 configs the assigned corpus absolute edit bindings are mirrored identically into both the top-level and agent.ruach-coordinator permission.edit blocks and the stale outer-case bindings are removed; effective evaluation now allows the corpus absolute AND relative assigned outputs while denying the stale outer target, other cases and protected/expected paths. cwd/inputs, Go Flash, canonical role and every other control are unchanged. No blockers."
artifacts:
  - docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight4.md
  - docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight4.txt
verification:
  - "Bounded helper bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/preflight4.ts: RESULT PASS, 48/48 checks; native debug agent queries ran from each actual corpus cwd via the reviewed enriched runner and the exact corpus-v2 config."
  - "v2 digests match the map: oc-resume 58522e171e752bd64b362e8c2908ef14a0e4eadaa463744e9ab71680b6ac2be9; oc-ambiguity f3e5101a74ad7ee7a15cb6105625887cc632019655c8fcc119127969560efe5b; oc-authorization f73ba95c2639202843744b88cbe6c1753b5896ca82256c6c652e466a801bf2aa; prompt alias digests unchanged; base a5e3cec1."
  - "v1->v2 delta is confined to agent.ruach-coordinator.permission.edit: the three stale outer targets are removed and the corpus record.md/drafts/**/intents.jsonl (or record.md/drafts/** for 02/03) are added. Source->v2 delta is confined to the top-level and agent edit bindings; skills, model, small_model, enabled_providers, bash, read, skill, task and external_directory are byte-identical to a5e3cec1."
  - "Top-level and agent absolute edit bindings are now identical; no stale outer absolute key remains in the agent edit block."
  - "Effective edit evaluation per subject: relative record.md/drafts/** = allow; corpus-absolute record.md = allow; stale outer-case record.md = deny; other-case corpus record = deny; protected corpus record = deny."
  - "cwd, declared inputs/stub/record/repo, and the prompt's corpus Working directory line are unchanged; resolved agent is ruach-coordinator on opencode-go/deepseek-v4.1-flash."
  - "Not run: any subject prompt, model call, config/source edit, workflow-body read, or Enoch regrade (clone discarded)."
discoveries:
  - "The v2 correction resolves PREFLIGHT3 F1: the corpus absolute outputs are now effective (previously superseded by the later agent-level '* deny') and the stale outer-case allow is gone, so relative and absolute bindings agree."
  - "configuration change is confined to private corpus-v2 launch data; source bytes at a5e3cec1 and the three subject prompts are untouched. v1 configs are retained as previous_config in the map."
blockers: []

# R-OPENCODE-PREFLIGHT4 — exact launch-data correction

## Scope

Read-only check of the root's F1 fix in the three private corpus-v2 configs named
by `coordination-launch-map.json`, before the three coordination prompts. No
subject launch, model call or edit; the accepted a5e3cec1 source is unchanged
and INSPECT1/2, PREFLIGHT3 and GRADE-IE1 reports are preserved.

## Verified correction

| Subject | v2 config sha256 | v1→v2 delta |
| --- | --- | --- |
| oc-resume | `58522e17…` | 3 outer removed, 3 corpus added (agent edit) |
| oc-ambiguity | `f3e5101a…` | 2 outer removed, 2 corpus added (agent edit) |
| oc-authorization | `f73ba95c…` | 2 outer removed, 2 corpus added (agent edit) |

- Top-level and agent `permission.edit` absolute bindings are now identical, and
  no stale outer-case key remains in the agent block.
- Effective edit (last-match): relative `record.md`/`drafts/**` = allow;
  corpus-absolute `record.md` = allow; stale outer-case `record.md` = deny;
  other-case record = deny; protected record = deny.
- `skills`, `model`/`small_model`, `enabled_providers`, `bash`, `read`, `skill`,
  `task` and `external_directory` are byte-identical to a5e3cec1; the prompts
  still bind `cwd = …/subject/0N/corpus` and all declared inputs exist.
- Resolved agent: `ruach-coordinator`, `opencode-go/deepseek-v4.1-flash`.

## Checks run

```
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/preflight4.ts
```

Raw output: `docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight4.txt`.
