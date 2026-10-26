task: RR070-01-FIX-01
status: complete
outcome: "RR070-01 attempt 1 passes assigned verification with a compatible one-entry handoff lock correction; exact candidate awaits independent re-review. No delivery performed."
candidate_revision: 1050c6f3cfccd424306997b81714f5b13c2c3463
tested_revision: 1050c6f3cfccd424306997b81714f5b13c2c3463
source_baseline: 0d686a454eb5b21001e65eac2b7eeed614290d3f
rejected_review_revision: cede9c95ddd9240e17395e043f17b9b889e0804d
destination_before: 2b693cd72bf39c29575841a88d9c7ae719a29715
artifacts:
  - docs/assignments/c1-c5/RR070-01-FIX-01.md
  - docs/reports/c1-c5/audit-fix-070.md
  - docs/reports/releases/0.7.0/audit-fix.md
  - docs/reports/releases/0.7.0/audit-fix-artifacts/dependency-resolution.json
  - docs/reports/releases/0.7.0/audit-fix-artifacts/import-manifest.json
  - docs/reports/releases/0.7.0/audit-fix-artifacts/verification.json
  - docs/reports/releases/0.7.0/review.md
  - /tmp/ruach-070-audit-fix-rhfwkb
verification:
  - "Original handoff audit reproduced: exit 1, fast-uri 3.1.8, four advisories. Corrected actual root/handoff/Herdr audits each exit 0, no vulnerabilities reported."
  - "Actual isolated frozen install passes, exit 0; Ajv resolves owned fast-uri 3.1.9, registry integrity agrees, corrected lock unchanged."
  - "Exact candidate just check and bun run release-check pass; full just test passes all 529 tests after supported socket remediation. Original DNS/socket failures retained."
  - "New exact committed snapshot install and three checks pass, including foreign cwd and relocation: 124 managed bytes/modes, seven roles, fifteen skills, five sentinels and corrected handoff lock verified."
  - "12 safe review imports match immutable hashes; only one existing lock entry changed, guide/manifests/prior evidence unchanged, main/global state and discovery links preserved; owned scope/privacy and handoff validation pass."
review: not-run
discoveries:
  - "Targeted Bun update selected compatible fast-uri 3.1.9; incidental formatting of disposable package.json was not imported. All other package resolutions and manifests remain byte-exact."
  - "Current passing audit does not establish the cause of historical hosted CI failure 40134877122; its empty historical log remains unproved."
blockers: []

Candidate/tested revision is **1050c6f3cfccd424306997b81714f5b13c2c3463**, on
`ruach/c17-release-prep`, following exact prior recording `0d686a45`. The original
`e96367b` candidate/history and rejected [review](../releases/0.7.0/review.md)
are preserved. The assignment and this verification handoff are recorded in a
later evidence-only commit, whose creating SHA is returned separately. Independent
re-review, rather than this worker or mechanical validation, determines closure.

The only modified existing file is `skills/ruach-handoff/bun.lock`: Ajv 8.20.0's
`^3.0.1` fast-uri resolution changes **3.1.8 → 3.1.9**, including its generated
registry integrity. All other lock entries, manifests, roles, skills, scripts,
config, tests, evals, release metadata, README/CHANGELOG, prior reports and guide
remain unchanged. The [correction report](../releases/0.7.0/audit-fix.md) and
[dependency evidence](../releases/0.7.0/audit-fix-artifacts/dependency-resolution.json)
retain exact old/new integrity, registry metadata and actual audit/frozen results.
Twelve original safe final review files were copied byte-for-byte from `cede9c95`
using [immutable provenance](../releases/0.7.0/audit-fix-artifacts/import-manifest.json),
without merging/cherry-picking its ancestry. The rejection/failure is not rewritten.

The actual raw scratch locator is **`/tmp/ruach-070-audit-fix-rhfwkb`**. Full
`*.stdout`/`*.stderr`, matching exit/time/argv/cwd `*.json` receipts, helpers,
private cache, baseline/corrected resolution inputs and relocated consumer are
there. `state-before-private.json` holds bounded main/global preservation hashes;
no credentials, global instructions, native IDs or raw native context were read.
The [safe verification evidence](../releases/0.7.0/audit-fix-artifacts/verification.json)
records commands and full-log digests; `$R` denotes this exact scratch directory.
Old `/tmp/ruach-070-prep-hZamlN` and `/tmp/ruach-070-review-GUUfBO` are untouched.

| Actual command / bound | Observed result |
| --- | --- |
| `bun audit`, original handoff lock / 120s | Default DNS failure retained; supported network run exit **1**, four advisories on 3.1.8 (two moderate, two low). Failed gate reproduced, not an exploit demonstration. |
| `bun update fast-uri --lockfile-only --cache-dir $R/cache`, disposable manifest/lock copy / 300s | Default DNS failure retained; supported network run exit **0**, generated only the fast-uri lock-entry change. Its incidental disposable manifest reformat was excluded. No new dependency, override or widened range. |
| `bun install --frozen-lockfile --cache-dir $R/cache --backend copyfile`, worktree handoff / 300s | Default tarball DNS failures retained; same recipe with supported network exits **0**, six packages installed. Ordinary owned node_modules, private cache, integrity verification enabled, lock unchanged. Ajv resolves 3.1.9 from this install. No install through shared links. |
| CI `bun audit` at root, handoff, Herdr / 120s each | Initial default DNS failures retained. One supported network run per recipe exits **0**: 26/6/3 packages checked respectively, no vulnerabilities reported. Source bytes equal the subsequently committed candidate. |
| `just check`; `bun run release-check` / 300s each | Exit **0** each on exact committed candidate; resources/local links/typecheck and prepared 0.7.0 metadata. |
| `just test` / 900s, default sandbox | Exit **1**, root 106 pass/four fixture Unix-socket EPERM failures; later skill stages not reached. **Not verified: environment**; full original log retained. |
| Same `just test` / 900s, supported scoped sockets | Exit **0** in 237.415s: root 110, handoff 28, Herdr 285, harness-eval 71, changelog 35; **529 passed / zero failed**. Covers affected handoff and root/full release union without duplicate equivalent reruns. No tests/source/skips changed. |
| `bun $R/snapshot.ts` / 120s; four subprocesses / 120s each | Exit **0**. Existing installer with `--revision 1050c6f3cfccd424306997b81714f5b13c2c3463`, installed source check and relocated checks with/without source pass from foreign cwd. Independent Git bytes/modes match all 124 managed files, seven roles/fifteen skills; five custom sentinels survive. Corrected 3.1.9 lock is present byte-exact. Untagged manifest omits release version as expected. New helper copy/scratch, original packaging evidence untouched. |
| `bun $R/source-audit.ts` / 120s | Exit **0**: exact 16-path candidate scope, 12 immutable imports, single existing-file/lock-entry delta, guide/manifests/old evidence preservation, graph exclusions and limited privacy scan. Main/global hash receipts and nine discovery links unchanged. |
| Canonical validator / 120s | `bun skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/audit-fix-070.md --repo /opt/dev/ruach-worktrees/c17-release-prep`, exit **0**; structure/revision resolution only. Final resource/link and `git diff --check`/owned staging checks pass. |

Bun is 1.4.2. Registry metadata for 3.1.9 agrees with the generated lock integrity;
actual frozen installation and the passing network audit establish current
remediation evidence beyond a version-number inference. Root/Herdr dependency
links are read-only and removed before handoff. The ignored ordinary owned handoff
install remains available for concrete re-review; no shared/global dependency was
updated. Main stays `2b693cd72bf39c29575841a88d9c7ae719a29715` with only its
unchanged declared dirty routing file (SHA-256
`9000bb915bb361d4a7e1e6eb66c7f9b896c3420b61f79b52429688df8f2b671b`). Main's
handoff lock and installed old dependency, global skill/plugin/marketplace metadata
and discovery links retain their before hashes/targets. No main clear/stage/stash/
reset/merge, tag, push, global installation or retained-consumer mutation occurred.

RR070-01 attempt 1 began with **zero completed failed correction cycles**, default
limit two; assigned verification now passes and independent re-review remains
pending. Ordinary diagnostics and supported network/socket remediation consume
no failed cycle; unrelated C2/transport/MQ histories are unchanged. The prior
[guarded delivery plan](../releases/0.7.0/preparation.md) applies only under a
separate assignment naming the newly reviewed exact revision and corrected lock.
Hosted candidate CI remains unobserved; historical hosted failure cause unproved.
Existing C1 boundary/council, C2 effective native/advisory, full parity, listening,
expiry/device, musical-quality and quality/cost limits remain. No new model/native/
council/product/browser probe or delivery occurs. Coordinator owns later cleanup
once concrete re-review reuse ends; launcher temporary directory is not supplied.

The initial scratch report renderer failed on template quoting before writing its
report; the first handoff validator therefore exited 2 with INPUT_UNREADABLE.
The corrected scratch renderer and final validator succeed. This documentation
diagnostic affected no source, audit, test or packaging result; failed validator
streams and the original renderer remain in raw scratch.
