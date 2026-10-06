---
task: 0.3-integ-fix2
status: complete
outcome: Blocking N1 (RU-02 clean-filter forgery) fixed by failing closed on tracked files with a Git filter attribute; P2 reworded; P1 documented; all checks pass at the tested revision.
role: implementer
candidate_revision: 3093323411b125e419785f0dedeb43d46d32ceea
tested_revision: 3093323411b125e419785f0dedeb43d46d32ceea
baseline: 0fa72926c17fbe3a593538a5c8c7e782a384ae81
artifacts:
  - docs/reports/0.3/integ-fix2.md
  - docs/assignments/0.3/integ-fix2.md
  - "branch ruach/ruach03-integ; commits N1/P2 52fea1c, root timeout 3093323; merge of ruach/ruach03-rev2"
  - "evidence by reference: docs/reports/0.3/rev2.md"
verification:
  - "just install: exit 0"
  - "just check (resource checks + tsc): exit 0"
  - "just release-check: exit 0 (Release v0.2.1, no bump)"
  - "just test at 3093323, sequential: root 90 pass, handoff 28, herdr 148, harness-eval 71; 0 fail"
  - "bun audit: no vulnerabilities in root, skills/ruach-herdr, skills/ruach-handoff"
  - "N1 failing before: harness-eval tests 'a clean filter from info-attributes cannot forge a clean checkout' and '... from tracked-gitattributes ...' failed (scope-check exit 0, ok true on an equal-size tampered file, after a 1.1 s stat delay); both pass after the fix. The control test 'repositories without filter attributes are unaffected' passes before and after"
  - "An intermediate full run at 52fea1c had 5 root tests fail at the 5 s default timeout at host load average about 100; the root suite alone passed 90/0, and the final sequential run with the root timeout raised passed"
review: not-run
discoveries:
  - "Approach: dirty() runs git check-attr -z --stdin filter over tracked paths and throws setup error content_filter_state when any value is not unspecified. This covers .gitattributes, .git/info/attributes and core.attributesFile uniformly, leaves ordinary checkouts and eol-only attributes working, and rejects checkouts that legitimately use filters such as Git LFS (documented in docs/operations.md known limitations)."
  - "Other content conversion (eol/autocrlf) was reviewed and not treated as a bypass: it does not let an equal-size edit read as the committed content. This is reasoning, not a probe."
  - "P1 (ready dirty flag) not hardened; documented as informational and not a trust boundary."
  - "P2: native-parity.md now says the known_marketplaces.json timestamp change is unattributed."
  - "The root suite now also runs with --timeout 30000 (package.json); the host load from other sessions made the 5 s default flaky for root tests too."
blockers: []
---

# Integration fix 2 report

N1 was reproduced as the failing-first tests (info/attributes and tracked .gitattributes variants) in `skills/ruach-harness-eval/tests/eval.test.ts`, then fixed in `skills/ruach-harness-eval/scripts/common.ts` (`dirty()`, with `git()` gaining optional stdin input). Behavior and its limits are in docs/operations.md under Known limitations; CHANGELOG and docs/regression-cases.md updated; docs-consistency test asserts the documentation.

Validation scope: the handoff validator was run with `--repo` (result in the terminal handoff); it checks structure and revision resolution only.
