task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-PREFLIGHT3
status: complete
reviewed_revision: a5e3cec1c1b81b289c6700e3763af1642441865c
outcome: "Coordination launch mapping qualified with no launch blocker: the three still-unspent cases launch from their actual corpus/ cwds with per-subject corpus-v1 configs whose only change from a5e3cec1 is the top-level absolute edit targets, the exact revised prompts/digests match, every real input/stub/record/repo path exists, the assigned corpus outputs are allowed by the effective last-match rule, and expected/other-case/protected/evals resources stay forbidden with no new model/role/skill scope. One non-blocking config-hygiene finding: the agent-level absolute edit targets still point at the pre-corpus outer case folder and take last-match precedence, so the corrected top-level absolute corpus entries are inert while an outer-case absolute allow remains effective; the prompts use relative record.md/drafts/** and work correctly."
artifacts:
  - docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight.md
  - docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight.txt
verification:
  - "Bounded helper bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/preflight3.ts: RESULT PASS, 45/45 checks; native debug agent queries ran from each actual corpus cwd via the reviewed enriched runner with the exact corpus-v1 config."
  - "Config digests match coordination-launch-map.json: oc-resume 7c002304dec901c5c3795410a921ed9065114fbbb6aad9e504fa025a785d4ffe; oc-ambiguity f21adcb4667a22fc43e0655bc06347e542131e8f5e25b34e5a86e4568c0aace8; oc-authorization d5b733b241c0f2205bcdef37f48fb0a449a6433e9a4d9db4c1d9532f2af497b4."
  - "Reviewer_brief alias digests equal the map prompt_sha256: resume 1ed12d6742c529129b2b48aa928ea26b3993be3bdda2eb3d16d6fb5ccf7cd56f; ambiguity 61dc69260bf9e1eb7dd7d48f2206f221d59b2159a2d51dfadd5eb2bbe51e330d; authorization eada38e7725b1dc6a1f4a0767baa740432412705f775b6fe344d1a6bf943a53b."
  - "Each prompt's Working directory line equals the map cwd (.../subject/0N/corpus); every declared input/stub/record/repo path exists under that cwd (resume: GUIDANCE/record/inputs/observations/retained/app/workers.ts/repo/config; ambiguity: GUIDANCE/record/inputs/assignments/reports; authorization: GUIDANCE/record/inputs/observations/targets.json/repo)."
  - "Config delta vs a5e3cec1 is confined to permission.edit absolute keys (resume 6, ambiguity 4, authorization 4); skills, agents, bash, read, skill, task and external_directory are unchanged."
  - "external_directory allows only the subject's own case folder plus shared resources/skills; no protected/evaluator/expected/evals or other-case allow; the other case's corpus record is not editable (deny)."
  - "Resolved agent via the enriched runner: model opencode-go/deepseek-v4.1-flash; read workflow deny, skill default deny, task deny, external_directory default deny; effective relative edits record.md=allow and drafts/**=allow."
  - "Not run: any subject prompt, model call, source/config/fixture edit, or workflow-body read."
discoveries:
  - "Non-blocking config hygiene (F1): in all three corpus-v1 configs the corrected absolute edit targets live only in the top-level permission block, while the agent.ruach-coordinator permission block still lists the pre-corpus outer case paths. Because opencode uses the last matching rule, effective evaluation gives corpus-absolute record.md=deny (superseded by the later agent-level '* deny') and outer-abs record.md=allow, with relative record.md/drafts/**=allow. The assigned deliverables are reachable via the relative paths the prompts specify, so this does not block launch; the exact fix is to mirror the corpus absolute targets in the agent-level permission.edit (or drop the outer ones) so both levels agree."
  - "The revised prompts (resume/ambiguity/authorization) are corpus-cwd scoped; the prior assignment text pointed at the outer case folder. Source config bytes at a5e3cec1 are unchanged; the corrected bindings exist only in the private per-subject corpus-v1 configs and the map."
  - "The map's reviewer_brief aliases (under /tmp/ruach-implementation-20261011/opencode/results/coordinator-inputs/) are byte-identical to the canonical prompt digests; the aliases are intentionally outside Git."
blockers: []

# R-OPENCODE-PREFLIGHT3 — coordination launch mapping qualification

## Scope

Independent check of the root-owned native corpus launch mapping for the three
still-unspent coordination cases (oc-resume, oc-ambiguity, oc-authorization)
before any prompt, per `opencode-evaluation-review-v3.md`. Read-only; no case
launch, model call, or source/config/fixture edit.

## Qualified mapping

| Subject | cwd | config (sha256) | prompt sha256 |
| --- | --- | --- | --- |
| oc-resume | `.../subject/01-resume/corpus` | `oc-resume-corpus-v1.json` `7c002304…` | `1ed12d67…` |
| oc-ambiguity | `.../subject/02-ambiguity/corpus` | `oc-ambiguity-corpus-v1.json` `f21adcb4…` | `61dc6926…` |
| oc-authorization | `.../subject/03-authorization/corpus` | `oc-authorization-corpus-v1.json` `d5b733b2…` | `eada38e7…` |

- Base assets commit `a5e3cec1c1b81b289c6700e3763af1642441865c`; source config
  bytes unchanged.
- Config delta vs a5e3cec1 is confined to `permission.edit` absolute targets.
- Every real input/stub/record/repo path exists from the selected corpus cwd.
- Assigned outputs (`record.md`, `drafts/**`, and `intents.jsonl` for 01) are
  allowed by the effective last-match rule; expected/other-case/protected/evals
  resources are forbidden; no new tool/model/role/skill scope.
- Prompts bind the corpus cwd and match the map digests via the readable aliases.

## Finding F1 (non-blocking for these three prompts)

The corrected absolute edit targets sit only in the top-level permission block;
the `agent.ruach-coordinator` permission block still carries the pre-corpus
outer case paths. Under last-match evaluation that yields:

```
effective edit: rel record.md=allow  drafts/**=allow
                corpus-abs record.md=deny   outer-abs record.md=allow
```

So the top-level corpus-absolute entries are inert and an outer-case absolute
allow is effective. Because the prompts direct the subject to edit relative
`record.md` and `drafts/**` from cwd `corpus`, the task is unaffected and this
does not block launch. Recommended exact correction before grading, if desired:
mirror the corpus absolute targets into the agent-level `permission.edit`
(or remove the outer ones) so both blocks agree.

## Checks run

```
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/preflight3.ts
```

Raw output: `docs/reports/next-release/opencode-evaluation-review/coordination-launch-preflight.txt`.
