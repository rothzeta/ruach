---
task: 0.3-rev3
role: reviewer
status: complete
outcome: "N1 is closed at 3093323. Clean filters from .gitattributes, .git/info/attributes, core.attributesFile and attribute macros all fail closed with content_filter_state, the new tests fail without the fix, ordinary and eol-only checkouts are unaffected, and all gates pass. One new blocking finding of the same forgery class without filters: repository config core.trustctime=false or core.checkStat=minimal, plus an equal-size edit with the mtime restored, makes scope-check report clean (reproduced end to end). One optional finding."
reviewed_revision: 3093323411b125e419785f0dedeb43d46d32ceea
tested_revision: 3093323411b125e419785f0dedeb43d46d32ceea
baseline: 0fa72926c17fbe3a593538a5c8c7e782a384ae81
artifacts:
  - docs/reports/0.3/rev3.md
  - docs/assignments/0.3/rev3.md
verification:
  - "ruach/ruach03-integ head 7cad2f7 differs from 3093323 only by docs/reports/0.3/integ-fix2.md (git diff --stat)"
  - "Gates at 3093323 in a detached temporary worktree (removed afterwards), sequential: just install 0, just check 0, just release-check 0 (v0.2.1), just test 0: root 90/0, handoff 28/0, herdr 148/0 (400 s), harness-eval 71/0; load average 25-75"
  - "N1 original probe (rev2 repo with info/attributes filter and an equal-size XXXX edit): dirty() throws content_filter_state; the same with core.attributesFile: content_filter_state"
  - "Fail-without-fix: with common.ts from 0fa7292 in an OS-temp copy of 3093323, both 'a clean filter from info-attributes/tracked-gitattributes cannot forge' tests FAIL and the control 'repositories without filter attributes are unaffected' PASSES; with the fix 3/3 pass"
  - "Variant probes through scope-check in an OS-temp copy of the 3093323 suite: [attr] macro expanding to filter, content_filter_state; smudge-only filter, content_filter_state (fails closed even with a clean tree); LFS-like tracked filter=lfs, content_filter_state (documented limitation); '-filter' (unset), content_filter_state; textconv diff driver on a tampered file, dirty (status ignores diff drivers); working-tree-encoding=UTF-16 on a tampered file, dirty; ident with injected '*/evil();/*' of equal size, dirty (Git keeps a foreign non-hex ident instead of collapsing it); core.autocrlf=true with '* text' on a clean tree, ok (control)"
  - "Stat-cache probes: equal-size edit TAMPER over stable, mtime restored with touch -r (ns-exact), index mtime advanced past the racy window: core.trustctime=false gives exit 0, ok true, dirty []; core.checkStat=minimal gives exit 0, ok true, dirty []; default config gives dirty (ctime differs)"
  - "Not run: GitHub CI; hand-crafted index stat entries (reasoned only, see N2)"
review:
  - "Blocking 1 (new, N2), optional 1; see report body"
discoveries:
  - "N2 already existed before N1's fix; it is independent of attributes"
  - "Probe copies, test files and the temporary worktree lived only in the session scratch directory; branch files were not modified apart from this report"
blockers:
  - "Blocking finding N2 (stat-cache config forges clean) needs an Implementer fix, or a Coordinator/user decision to accept it as a documented limitation"
---

# Re-review 0.3-rev3 (N1)

Reviewed revision: `3093323`. Diff: `0fa7292..3093323`, consisting of the N1 fix `52fea1c`, the root suite timeout and wording changes. The branch head `7cad2f7` adds only the integ-fix2 report.

## N1: closed

`skills/ruach-harness-eval/scripts/common.ts:123-125` runs `check-attr filter` over every tracked path and fails closed unless the value is `unspecified`. `check-attr` resolves attributes the same way `status` does. That covers `.gitattributes` (tracked or edited in the worktree), `info/attributes`, `core.attributesFile` and macros, and every source was probed. The new tests fail without the fix. The eol control test and my autocrlf control still read as clean.

Variants named in the assignment:
- **Smudge-only or LFS-like filters and `-filter`:** these fail closed even on an untouched tree. That is strict but safe, and the LFS case is documented in `docs/operations.md` Known limitations.
- **textconv and diff drivers:** they do not take part in `status` hashing. A tampered file under a textconv that prints the original content still shows as modified.
- **Other conversions** (`ident`, `working-tree-encoding`, `eol`): each was probed with an equal-size tamper and detected. `ident` only collapses 40-hex ids, so the injection is limited to hex digits inside the marker, which is not material.

Other changes:
- **Root `--timeout 30000`:** consistent with the Herdr suite and tested by docs-consistency. No regression.
- **P2 wording:** the attribution is now neutral.

## Blocking

### N2. Stat-cache config forges clean without any filter (RU-02 class)
- **Location:** `skills/ruach-harness-eval/scripts/common.ts:88` (`git()` overrides only fsmonitor and untrackedCache) and `:126` (`status`).
- **Problem:** `status` trusts index stat data and re-hashes only when stat differs. The candidate repository's config can weaken the stat comparison:
  - `core.trustctime=false` ignores ctime;
  - `core.checkStat=minimal` compares only mtime seconds and size.

  An equal-size in-place edit followed by `touch -r <saved copy>` then matches the index entry, so the file is never hashed.
- **Why it matters:** this has the same impact and the same cost as B1 and N1, which were both rated blocking: a protected file holds tampered content while scope-check reports `ok: true` and `dirty: []`.
- **Evidence:** I ran the probes through scope-check in an OS-temp copy of the 3093323 suite, with the fixture's `protected` file (7 bytes, `TAMPER\n` over `stable\n`), the mtime restored to the nanosecond and the index mtime moved past the racy window.

  | Config | scope-check result |
  |---|---|
  | `core.trustctime=false` | exit 0, ok true |
  | `core.checkStat=minimal` | exit 0, ok true |
  | default config | dirty (ctime differs) |

- **Direction:**
  - The minimal fix is to add `-c core.trustctime=true -c core.checkStat=default` to the private probe flags, with failing-first tests for both keys.
  - A residual remains even with that: a candidate that hand-writes `.git/index` stat entries to match a tampered file. I did not probe it; it is reasoned from how Git uses the stat cache.
  - Closing the residual needs a content comparison that does not trust stat. For example, refresh a private copy of the index (`GIT_INDEX_FILE` set explicitly to a temp copy, `update-index --really-refresh`) and run `status` against it, or compare `git ls-files -s` with `git hash-object --stdin-paths`.
  - Either way, record which variant 0.3 accepts as a known limitation.

## Optional

### O1. `-filter` (explicitly unset) also fails closed
- **Location:** `common.ts:125`.
- **Problem:** the check rejects `unset` as well as `set` and specific values. `-filter` disables filtering, so it cannot forge a clean result.
- **Direction:** accepting `unset` would avoid rejecting repositories that use `-filter` overrides (for example LFS exclusions). It is harmless as written; take it only if false rejections matter.

**Unverified:** GitHub CI, and the hand-crafted index variant (reasoning only).
