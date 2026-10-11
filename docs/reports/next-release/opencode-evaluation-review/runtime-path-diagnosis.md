task: RUACH-ROADMAP-IMPLEMENTATION/R-OPENCODE-RUNTIME-PATH
status: complete
reviewed_revision: a5e3cec1c1b81b289c6700e3763af1642441865c
outcome: "Root cause identified from the installed OpenCode 1.19 binary: edit/write ask the permission service with path.relative(worktree, absoluteTargetPath), and rules are matched with findLast against that worktree-relative string. For the coordination subjects the cwd (…/subject/0N/corpus) is not a git repository, so it resolves to the global project and worktree becomes '/' , making the request 'tmp/ruach-implementation-20261011/…/corpus/record.md'. The corpus-v2 config provides only bare relative ('record.md', 'drafts/**') and absolute ('/tmp/…') patterns, neither of which matches that string, so the agent-level '*' deny wins and both absolute and relative subject attempts are denied. Smoke/Enoch succeeded because their cwd was a git worktree root (worktree == cwd). The root's unspent oc-authorization corpus-v3 candidate (sha256 1b13702f3bb19cf10891a7382ee569d7dc30510a15e8bcf1046d45d81055b5bf) adds the no-leading-slash corpus record.md/drafts/** keys to both edit blocks; applying the real matcher to the worktree-relative request yields corpus/record.md and corpus/drafts/** = allow, outer/other-case/protected = deny, with role/model/controls unchanged. This candidate is qualified as the minimal binding correction."
artifacts:
  - docs/reports/next-release/opencode-evaluation-review/runtime-path-diagnosis.md
  - docs/reports/next-release/opencode-evaluation-review/runtime-path-diagnosis.txt
verification:
  - "Read-only binary inspection of /tmp/ruach-implementation-20261011/opencode/cli/node_modules/opencode-linux-x64/bin/opencode (the symlinked .bin/opencode target) via a bounded Bun helper; no model/subject/probe run and no credential/raw-config/workflow read."
  - "Edit tool (@byte 96857187): n.ask({permission:'edit', patterns:[qo.relative(y.worktree,u)], always:['*'], metadata:{filepath:u,...}}) where u = isAbsolute(filePath)?filePath:join(y.directory,filePath). Write tool (@96896513) is identical with Ko.relative(y.worktree,u)."
  - "Matcher (@99144658): evaluate = (permission, pattern, ...rulesets) => rulesets.flat().findLast(z => g.match(permission, z.permission) && g.match(pattern, z.pattern)) ?? {action:'ask'}; ask() returns DeniedError when the selected rule action is deny. So the LAST matching rule wins and the matched value is the relative request pattern."
  - "Project.fromDirectory (@97050729): worktree = (K.id === ID.make('global') && !K.vcs) ? '/' : K.directory; sandbox = K.vcs ? K.directory : worktree. A non-git directory is the global project, so worktree = '/'."
  - "git rev-parse --show-toplevel in .../subject/01-resume/corpus and .../live/r3/packet: 'fatal: not a git repository (or any parent up to mount point /)'. Smoke consumer (git root at HEAD 868159c7) and Enoch clone (git root, branch ruach-exercise/url-encoding-subject) were repositories, so worktree == cwd there."
  - "Accepted working configs use worktree-relative forms for targets outside the worktree: preparer-v4/reviewer-v1 edit allow '../../../../../tmp/ruach-implementation-20261011/opencode/results/**' and '../../../tmp/…' alongside absolute forms, matching relative(worktree, target) for their git-worktree cwd."
  - "Read-only qualification of the root's unspent oc-authorization corpus-v3 candidate (bun preflight5.ts, 13/13 checks): config digest 1b13702f3bb19cf10891a7382ee569d7dc30510a15e8bcf1046d45d81055b5bf matches the map; v2->v3 delta is exactly the 4 no-leading-slash corpus record.md/drafts/** keys (top-level + agent edit); both edit blocks identical; skills/read/skill/bash/external/model unchanged; resolved agent ruach-coordinator on opencode-go/deepseek-v4.1-flash; real-matcher evaluation of the relative('/', target) request gives corpus/record.md = allow, corpus/drafts/** = allow, outer-case record.md = deny, other-case corpus record = deny, protected corpus record = deny."
  - "Not run: any subject/agent/model, security dialog, private config/source/fixture edit, --r3 grading (subjects active), or native log/data read."
discoveries:
  - "Static PREFLIGHT3/PREFLIGHT4 modeled only bare-relative and absolute request paths and assumed the cwd was the worktree base. Both assumptions are wrong for a non-git cwd: OpenCode normalizes to path.relative(worktree,target) before matching, and a non-git cwd maps to the global project with worktree '/'. The PREFLIGHT4 conclusion 'corpus absolute target effective = allow' is therefore invalid at run time; only the worktree-relative string is ever matched."
  - "The F1 'mirror absolute bindings' fix cannot work by construction: an absolute pattern can never match the worktree-relative request string. The bare relative 'record.md'/'drafts/**' patterns only work if worktree == the corpus cwd, which is false here."
  - "Concrete minimal correction (private corpus configs, root-owned): add the worktree-relative literal outputs to both the top-level and agent.ruach-coordinator edit blocks, e.g. for 01-resume 'tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume/corpus/record.md', '.../corpus/drafts/**', '.../corpus/intents.jsonl' (and the analogous record.md/drafts/** for 02/03). A leading-'**' glob variant (e.g. '**/01-resume/corpus/drafts/**') would also work if deep-wildcard matching is confirmed, but the literal relative form is the proven pattern used by the accepted preparer/reviewer configs."
  - "The same defect applies to the held oc-authorization row and to any future non-git cwd; the fix should be applied before its single turn."
  - "Qualified candidate: the unspent oc-authorization corpus-v3 config (1b13702f…) adds, in both edit blocks, the worktree-relative forms 'tmp/ruach-implementation-20261011/live/r3/packet/subject/03-authorization/corpus/record.md' and '…/corpus/drafts/**', so the real findLast matcher allows the assigned corpus outputs and denies outer/other-case/protected. Same minimal addition is required for the two consumed rows if they were ever re-evaluated (they will not be retried), and before any future non-git cwd launch."
  - "Qualification limits: diagnosis is static plus one read-only git probe; I did not reproduce a live denial (no subject/model allowed), the worktree value is inferred from the Project.fromDirectory code path rather than observed in a session, and native logs/data are outside the reviewer read scope."
blockers: []

# R-OPENCODE-RUNTIME-PATH — native edit-permission path diagnosis

## Symptom

oc-resume and oc-ambiguity each reported Write and Edit denied for the assigned
`corpus/record.md` and `corpus/drafts/summary.md`, for both absolute and relative
attempts. PREFLIGHT4 (v2 configs) passed statically. The already-consumed turns
are not retryable; oc-authorization is held 0/1.

## Root cause (from the installed binary)

1. **The tools match a worktree-relative path, not the path the model typed.**
   `edit` and `write` both call:

   ```
   n.ask({ permission: "edit",
           patterns: [ path.relative(y.worktree, u) ],   // u = absolute target
           always: ["*"], metadata: { filepath: u, diff } })
   ```

2. **The matcher uses the last matching rule over that string:**

   ```
   evaluate = (permission, pattern, ...rulesets) =>
     rulesets.flat().findLast(z => g.match(permission, z.permission)
                                && g.match(pattern, z.pattern))
     ?? { action: "ask", pattern: "*" };
   ```

   Under the pattern list a rule `deny` returns `DeniedError`.

3. **A non-git cwd has worktree `/`.** `Project.fromDirectory` sets
   `worktree = (project is global && no vcs) ? "/" : directory`. The corpus cwd
   is not a git repository (`git rev-parse --show-toplevel` fails in
   `.../subject/0N/corpus` and in the whole packet), so it resolves to the global
   project and `worktree = "/"`.

Therefore, for target `/tmp/…/subject/01-resume/corpus/record.md`, the request
pattern is `tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume/corpus/record.md`.
The corpus-v2 config offers only:

- bare relative `record.md`, `drafts/**` (match only if worktree == corpus), and
- absolute `/tmp/…/corpus/record.md` (can never equal the relative request).

Neither matches, so the final matching rule is the agent-level `*: deny`, and both
"absolute" and "relative" model attempts are denied identically (the tool always
normalises before matching).

## Why smoke/Enoch and preparer/reviewer worked

- **Smoke / Enoch:** cwd was a git repository root, so `worktree == cwd` and the
  request was the repo-relative path (`src/range.ts`,
  `src/Enoch.Ui/src/api.ts`) exactly matching the config's relative patterns.
- **Preparer / reviewer:** cwd was a git worktree root; targets outside it were
  granted with explicit relative-traversal patterns
  (`../../../../../tmp/…/opencode/results/**`), i.e. the worktree-relative
  representation — consistent with this mechanism.

## Minimal correction

Add the exact worktree-relative literal output patterns (no leading slash) to
**both** the top-level and `agent.ruach-coordinator` `permission.edit` blocks of
each corpus config:

- 01-resume: `tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume/corpus/record.md`, `…/corpus/drafts/**`, `…/corpus/intents.jsonl`
- 02-ambiguity: `…/subject/02-ambiguity/corpus/record.md`, `…/corpus/drafts/**`
- 03-authorization: `…/subject/03-authorization/corpus/record.md`, `…/corpus/drafts/**`

Equivalently a deep-wildcard form (`**/01-resume/corpus/drafts/**`) if `g.match`
deep-wildcard semantics are confirmed. Verify on the held oc-authorization turn
(e.g. a safe scratch write under an allowed path, or the `evaluated` native log)
rather than assuming.

## oc-authorization corpus-v3 candidate (read-only qualification)

Root prepared only the unspent `oc-authorization` row as
`oc-authorization-corpus-v3.json` (sha256 `1b13702f…`). v2 → v3 adds, in **both**
`permission.edit` and `agent.ruach-coordinator.permission.edit`, the worktree-relative
(no leading slash) forms:

```
tmp/ruach-implementation-20261011/live/r3/packet/subject/03-authorization/corpus/record.md
tmp/ruach-implementation-20261011/live/r3/packet/subject/03-authorization/corpus/drafts/**
```

No other control, prompt or source changed (skills/read/skill/bash/external/model
byte-identical to v2; resolved agent `ruach-coordinator` on
`opencode-go/deepseek-v4.1-flash`). Applying the real matcher
(`findLast` with `g.match(request, rule.pattern)` where
`request = path.relative(worktree, target)` and `worktree = "/"`):

| target | request | effective |
| --- | --- | --- |
| corpus/record.md | `tmp/…/03-authorization/corpus/record.md` | **allow** |
| corpus/drafts/summary.md | `tmp/…/03-authorization/corpus/drafts/summary.md` | **allow** |
| outer-case record.md | `tmp/…/03-authorization/record.md` | deny |
| other-case corpus record.md | `tmp/…/02-ambiguity/corpus/record.md` | deny |
| protected corpus record.md | `tmp/…/packet/protected/01-resume/corpus/record.md` | deny |

The candidate therefore matches the assigned corpus outputs and keeps the
retained `record.md`/`drafts/**` bare patterns as no-ops (worktree is `/`).
Qualified for the held third turn; the first two consumed turns are not retried.

## Static-preflight qualification limits

PREFLIGHT3/PREFLIGHT4 modelled request paths as bare-relative or absolute and
assumed the cwd was the matching base; they did not model worktree-relative
normalisation or the non-git → global → `/` project mapping. Their
"corpus-absolute = allow" result is a modelling artefact and must not be relied
on. This diagnosis is static (plus one read-only `git rev-parse`); no live denial
was reproduced and the worktree value is inferred from the code path.

## Checks run

```
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/scan4.ts   # edit/write ask + matcher
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/scan7.ts   # evaluate()/findLast
bun /tmp/ruach-implementation-20261011/opencode/results/reviewer/scan8.ts   # Project.fromDirectory worktree
git rev-parse --show-toplevel   # corpus / packet: not a git repository
```

Code excerpts: `docs/reports/next-release/opencode-evaluation-review/runtime-path-diagnosis.txt`.
