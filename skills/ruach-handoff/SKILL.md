---
name: ruach-handoff
description: Produce or consume the canonical structured handoff between engineering workers and coordinators. Use when returning delegated work or receiving a worker's result.
---

# Ruach handoff

Use this protocol when returning delegated work. Put the named fields at the start of the durable report; reference detailed evidence below or in separate artifacts. Return a concise handoff including the report reference.

## Mechanical validation

Requires Bun; Git on PATH is needed when checking revisions or using `--repo`.
Install within this skill directory: `bun install --frozen-lockfile` (the committed
`bun.lock` is required). A copied skill directory works independently after that
install; no repository runtime packages or global installation are needed.

```sh
bun <skill>/scripts/validate.ts reports/task/implementer.md
bun <skill>/scripts/validate.ts reports/task/implementer.md --repo <repository>
bun <skill>/scripts/validate.ts --help
```

The validator reads the leading YAML block and uses [handoff.schema.json](handoff.schema.json)
for its entire structural contract. It does not execute checks, validate artifact
existence, certify report truth, or establish review/acceptance. A valid `complete`
report with `verification: not-run` is mechanically valid; the assignment and
responsible reviewer determine whether its claims and evidence are sufficient.

Output is one JSON object on stdout with `schema_version: 1`, `ok`, `diagnostics`,
and resolved revision records; concise diagnostics also go to stderr. Each
diagnostic has a stable `code` and JSON-pointer `path`; YAML errors include line
and column. Report contents and supplied revision values are not echoed.
Exit 0 means structural validation and supplied revision resolution succeeded;
exit 1 means invalid report or missing revision; exit 2 means usage, unreadable
input, missing dependencies/schema, or unavailable repository/Git. `--help` exits 0;
unknown or duplicate options fail with `USAGE`. CLI paths are relative to invocation cwd.
Revision resolution runs only after the entire leading block passes parsing and
schema validation. Fix structural errors and rerun to reveal any missing revisions.

Stable codes: `HEADER_INVALID`, `YAML_INVALID`, `YAML_DUPLICATE`, `FIELD_REQUIRED`,
`FIELD_TYPE`, `FIELD_ENUM`, `FIELD_INVALID`, `REVISION_MISSING`, `USAGE`,
`INPUT_UNREADABLE`, `DEPENDENCY_UNAVAILABLE`, `SCHEMA_UNAVAILABLE`,
`REPO_UNAVAILABLE`, `GIT_UNAVAILABLE`.

## Format and neutral starting point

Use bare YAML at byte one, followed by a blank line before Markdown prose. The
bare block ends at its first blank line, so keep it concise and without internal
blank lines. Alternatively enclose the leading YAML in `---` lines. A UTF-8 BOM
and CRLF are accepted. Markdown headings and fenced blocks are not leading YAML.
Duplicate keys, malformed YAML, unknown tags, and invalid field types fail.

```yaml
task: assigned-task
status: needs-decision
outcome: Awaiting task result
artifacts: []
verification: not-run
review: not-run
discoveries: []
blockers: []
```

Replace the neutral values with actual results before handing off. `review` is
optional and is never prefilled as successful. Additional role/assignment metadata
is permitted. New narrative list entries should be quoted when they contain
`: ` so YAML keeps them as strings. For compatibility, narrative entries in
`verification`, `review`, `discoveries`, and `blockers` may also be single-key
mappings with a nonempty string key and value (e.g. `- Build: exit 0`). `artifacts`
contains strings only. Task/outcome and all narrative/artifact strings must contain
non-whitespace text; empty lists remain valid.

The leading structured block is the contract boundary. Older reports without it may be historical evidence rather than current handoffs; do not rewrite a consumer's historical corpus merely to make it validate. Record validation scope and results in the assigned report.

## Required fields

- `task`: task identifier
- `status`: `complete`, `blocked`, `needs-decision`, or `failed`
- `outcome`: concise result
- `artifacts`: relevant files, reports, branches, commits, or other durable references, including the handoff report
- `verification`: checks actually performed and their results, or `not-run`
- `discoveries`: information affecting other work
- `blockers`: unresolved blockers or decisions required

Use an empty list for fields with no entries. Include the additional evidence required by the role and assignment.

Where relevant also report:

- `candidate_revision`
- `tested_revision`
- `reviewed_revision`
- `delivered_revision`

Only report revisions that already exist and can be resolved. The responsible worker confirms revision references; distinguish the revision checked from later commits that only record evidence.

All top-level fields ending in `_revision` or `_baseline`, also `revision`,
`baseline`, and `destination_before`, are nonempty Git commit references and are
checked. Record revisions in those fields rather than burying them in prose or
artifact strings. Symbolic refs and commit-resolving tags are accepted. Resolution
uses explicit `--repo` or Git discovery from the report's real directory, including
its own worktree; it never uses the caller's cwd or Git environment overrides.
Without revisions or `--repo`, a report need not live in Git. An unavailable
repository is a setup failure; an absent commit in an available repository is an
invalid reference. No ancestry or equality between revision roles is imposed.

Keep `tested_revision`, `reviewed_revision`, and `delivered_revision` distinct.
Use `evidence_revision` for an already existing evidence-only successor when useful.
Write a report against existing tested/implementation revisions, then commit it;
return its creating commit SHA in the terminal handoff. Never predict or require
that creating SHA inside the report. A later recording/delivery commit may
legitimately differ from the tested revision without proving new checks.

## Rules

- Keep the handoff concise.
- Reference detailed evidence rather than reproducing it.
- Do not report verification that was not actually performed.
- Do not infer review or acceptance from implementation completion.
- Do not prefill successful outcomes for another worker.
- Do not require an artifact to contain the identifier of the commit that creates that artifact.
- Write the durable handoff before reporting `complete`.

## Consumption

When receiving a handoff:

- use it for coordination rather than reconstructing state from the worker transcript;
- request correction from the responsible worker if required fields are missing or inconsistent;
- do not independently perform the worker's technical validation merely to repair an incomplete handoff.
