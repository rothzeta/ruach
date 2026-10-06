---
task: 0.3-rev2
role: reviewer
status: complete
outcome: "Re-review of d31b98d. The blocking findings rev-sec B1 (fsmonitor) and B2 (Codex stdio deadline) and rev-docs 1 and 2 (workflow and example delivery wording) are closed, and their regression tests fail without the fixes. All gates pass. One new blocking finding of the same class as B1: a repository-local clean filter (`.git/info/attributes` plus `filter.<x>.clean`) still forges a clean harness-eval scope check (RU-02); reproduced end to end. Two optional findings."
reviewed_revision: d31b98d0a5518ff69d550a8d4e636a7b13313143
tested_revision: d31b98d0a5518ff69d550a8d4e636a7b13313143
baseline: bdab5e8
artifacts:
  - docs/reports/0.3/rev2.md
  - docs/assignments/0.3/rev2.md
verification:
  - "Worktree HEAD 0fa7292; git diff d31b98d..HEAD --stat shows only docs/reports/0.3/integ-fix1.md"
  - "just install: exit 0; just check: exit 0; just release-check: exit 0 (v0.2.1)"
  - "just test (one invocation, sequential recipes): root 89/0, handoff 28/0, herdr 148/0 (450 s, --timeout 30000), harness-eval 68/0; TEST=0. Load average 14-57, partly from my own probes running at the same time"
  - "B1 probe (rev-sec recipe: fsmonitor hook printing tok\\0, priming status, tracked edit): plain git status empty; fixed dirty() reports ' M f'; bdab5e8 common.ts dirty() returns []"
  - "B2 probe (fake codex: daemon fails, app-server forks same-group sleep 25, exits after 1 s): fixed codexRead 10014 ms, descendant reaped; bdab5e8 native-codex.ts 25031 ms. Variants: silent reader 10014 ms; setsid descendant 10007 ms (bounded, not reaped, being outside the owned group)"
  - "Fail-without-fix, OS-temp copy of d31b98d with bdab5e8 sources: harness-eval 'core.fsmonitor cannot hide changes' FAILS (exit 0); herdr worker 'descendant holding the Codex reader stdout' FAILS (26180 ms > 15000); herdr spaces 'replacement ref' FAILS (forged content checked out)"
  - "Docs-consistency with bdab5e8 workflow/examples/README/coordinator.md in the temp copy: the delivery and escalation tests FAIL (3 fail, 6 pass; the third failure is the native-parity README link, expected)"
  - "New probe: clean filter via .git/info/attributes in a temp copy of the d31b98d harness-eval suite: scope-check exit 0, ok true, dirty [] while the protected file contains TAMPER"
  - "Static: grep for Merger/merge in agents, skills, docs/examples, README; docs/native-parity.md read in full"
  - "Not run: GitHub CI, live Herdr linked launch, real Codex reader, paid smoke checks"
review:
  - "Blocking 1 (new, RU-02 class), optional 2; see report body"
discoveries:
  - "The clean-filter bypass already existed at feaca8b; neither the fixes nor the prior review introduced or covered it"
  - "Probe temp copies and fixtures live only in the session scratch directory; the worktree files were not modified apart from this report"
blockers:
  - "Blocking finding N1 (clean filter forges harness-eval clean) needs an Implementer fix, or a Coordinator/user decision to accept it as a known limitation"
---

# Re-review 0.3-rev2

Reviewed revision: `d31b98d`. The worktree HEAD is `0fa7292`, which adds only the integ-fix1 report. Scope: `git diff bdab5e8..d31b98d`, covering the fix commits and the impl-f merge.

## Prior blocking findings

| Finding | Verdict | Evidence |
|---|---|---|
| rev-sec B1, `core.fsmonitor` | Closed | `skills/ruach-harness-eval/scripts/common.ts:88` passes `-c core.fsmonitor=false -c core.untrackedCache=false` to every private probe. All harness-eval Git calls go through `git()`. The original probe is now detected, the old code still passes it, and the test fails on the old code. |
| rev-sec B2, Codex stdio deadline | Closed | `skills/ruach-herdr/scripts/native-codex.ts:44-79`: the reader is detached, the deadline kills its group, every read races the deadline, and cleanup is bounded (about 1.5 s plus 0.5 s). Probe: 10.0 s now against 25.0 s on the old code; the descendant is reaped. The test fails on the old code. |
| rev-docs 1, workflow step 2 | Closed | `skills/ruach-workflow-feature/SKILL.md:32` covers integration only and defers delivery to step 8. Step 8 (`:91-98`) has no Merger role, requires review plus user authorization, names the exact reviewed revision, requires that the destination has not moved, and requires `delivered_revision`. This agrees with `agents/coordinator.md:61` and `agents/implementer.md:23,46`. |
| rev-docs 2, examples | Closed | `docs/examples/consumer-example.md:34-38` and `docs/examples/direct-compact-full.md:11,25` describe a separate gated delivery Implementer. The escalation override location ("assignment or consumer guidance") reads the same in README, the Coordinator role and the workflow. |

Optional fixes, checked for regressions:
- **O2:** `--no-replace-objects` on every launcher Git call in `spaces.ts`. The test fails without it.
- **O4:** `bun test --timeout 30000` in the justfile, and the operations docs and README match it.
- **O5:** the dependency test asserts the expected packages, and every regression-cases row names a test file that exists.
- **rev-docs 3-6:** the consistency tests are meaningful (they fail on the old wording), and the sort example now uses a numeric comparator.

## Blocking

### N1. RU-02 bypass of the same class remains: a clean filter forges clean
- **Location:** `skills/ruach-harness-eval/scripts/common.ts:116-127` (`dirty()`); the probe flags are at `:88`.
- **Problem:** `dirty()` relies on `git status`. When a tracked file's size is unchanged but its stat data differs, Git re-hashes the file through the configured clean filter. A candidate checkout can add `protected filter=x` to `.git/info/attributes` (untracked and invisible to status) and set `filter.x.clean = printf 'stable\n'`. Status then reports the tampered file as unmodified.
- **Why it matters:** This is the same impact and the same cost (one config line plus one attributes line) as B1, which was rated blocking. Scope-check `clean` and `dirty_before`/`dirty_after` can be forged, so RU-02 as intended is still open.
- **Evidence:** In an OS-temp copy of the d31b98d harness-eval suite, with the `fixture()` and `scope()` helpers, the probe test set the attributes and filter config, waited 1.1 s and wrote `TAMPER\n` over `stable\n`. scope-check returned exit 0, `ok: true` and `dirty: []`. A standalone repo gave the same result with `dirty()`. When the tampered size differed, status did detect the change, so the bypass needs an equal-size edit.
- **Direction:** Do not trust filter or attribute configuration in the private probes. Options:
  - Fail closed (as for index flags) when `git config --get-regexp '^filter\.'` returns anything, or when `$GIT_DIR/info/attributes` or `core.attributesFile` is non-empty.
  - Compare `git hash-object --no-filters` of each tracked worktree file against the index blob for paths with filter attributes.

  Add a failing-first test next to the fsmonitor test. A review of other content-transforming config (for example `core.autocrlf`/eol conversion with equal-size edits) is worth the same pass.

## Optional

### P1. Same-config exposure in the informational `ready` dirty flag
- **Location:** `scripts/install.ts:282`.
- **Problem:** The `ready` dirty flag is susceptible to N1 in the same way. The fix report states it is informational, not a trust boundary. Note it only if the N1 fix is shared.

### P2. native-parity attribution of a real-config touch is presumptive
- **Location:** `docs/native-parity.md`, the paragraph beginning "One caution".
- **Problem:** The real `~/.claude/plugins/known_marketplaces.json` timestamp changed during the experiments. The doc attributes this to "presumably this session's own background refresh". No evidence separates that from the experiment commands.
- **Evidence:** The doc and the impl-f report say the experiments' own entries stayed in the temporary config directory and the `ruach` entry is unchanged. No other global-config edit is described.
- **Direction:** Keep it, but word it as unattributed. Otherwise native-parity.md marks verified, documented and unverified items carefully, labels the paid checks PENDING, and leaves packaging and Codex export as needs-decision. I found no factual overreach. The snapshot checklist's `--version <v>` matches the installer usage, and the offline run used the documented legacy `--revision`.

## Checked without findings

- The B2 setsid variant: the descendant is outside the owned group and is not reaped, but the call is still bounded by the deadline. This matches the A4 rule (signal owned groups only).
- `send()` is not raced against the deadline. The messages are a few hundred bytes, well under the pipe buffer, so I did not judge this material.
- No version bump. No writes to global config or discovery links were found in the diff.

**Unverified:** GitHub CI, a real Codex app-server, linked-mode Herdr behavior, and the paid smoke checks.
