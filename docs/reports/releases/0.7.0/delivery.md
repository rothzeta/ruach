task: RELEASE-DELIVER-070-01
status: blocked
outcome: "Exact reviewed e376 fast-forwarded, annotated tags atomically pushed, and existing shared skills/plugin updated and verified. Hosted CI failed on historical temporary-evidence links; further changes stopped for Coordinator routing."
source_candidate_revision: 1050c6f3cfccd424306997b81714f5b13c2c3463
tested_revision: e37645b11ea012f98b213f6eddc38b513cb9248c
reviewed_revision: e37645b11ea012f98b213f6eddc38b513cb9248c
review_evidence_revision: 6ef7002e2b55df7cabd4a5946cf9eac6ee9b73e1
delivered_revision: e37645b11ea012f98b213f6eddc38b513cb9248c
destination_before: 2b693cd72bf39c29575841a88d9c7ae719a29715
artifacts:
  - docs/assignments/c1-c5/RELEASE-DELIVER-070-01.md
  - docs/reports/releases/0.7.0/delivery.md
  - docs/reports/releases/0.7.0/delivery-artifacts/evidence.json
  - /tmp/ruach-070-delivery-qePGAj
verification:
  - "Guarded main fast-forward passes from exact 2b693cd to reviewed e376; only the represented routing edit was cleared after verified backup. Main remains exact and clean; six original alternatives/preferences, Tester/Gemini and guide preserved."
  - "Main frozen setup, just check and release-check pass. Both new annotated tags target exact e376; atomic push exits 0 and actual remote main/tag objects/peeled targets agree, including final recheck."
  - "Supported Skills CLI and Claude plugin updates exit 0; actual fifteen shared skills and user plugin 0.7.0/source e376 verified independently of stdout."
  - "All 114 shared and 127 plugin managed byte/Git-mode records pass; full Unix modes equal delivered source. Frozen executable-skill copies pass; main/shared/plugin Ajv each resolve owned fast-uri 3.1.9."
  - "Nine existing Claude link identities/targets, all inventoried old discovery entries, unrelated settings/skills/plugin entries and marketplace registration preserved. Codex universal and Pi/Goose layouts each expose fifteen skills; plugin has seven roles/fifteen skills."
  - "Actual hosted run 40314249964 is completed failure at Resource, link and type checks: 82 missing temporary-evidence link targets across seven historical reports. Query/log retrieval exits 0, not a passing CI result."
  - "Corrected-source canonical handoff validator, owned receipt scope/privacy and staged diff checks pass; mechanical validation is not delivery acceptance."
discoveries:
  - "Hosted resource-check failure is machine portability of historical absolute temporary-evidence links. Local checks passed because those paths exist here; no hosted audit/test success is inferred."
  - "Sandboxed native plugin help returned empty output; scoped documented Claude executable produced real help/lifecycle behavior and verified resulting installation."
  - "Initial 0644-only installed-mode helper was overly strict: ordinary files are 0664 in delivered source and old/new supported copies, all normalized Git 100644. Read-only verification corrected the oracle; no chmod/cache workaround."
blockers:
  - "Hosted CI for exact published e376 failed. Coordinator must route the protected source/link-portability correction separately; this delivery assignment forbids source edits or rewriting main/tags."

Delivered source is **e37645b11ea012f98b213f6eddc38b513cb9248c**, exactly the
reviewed/tested revision accepted by independent review `6ef7002e`. Its corrected
product candidate is `1050c6f`; later correction recording `e376` was the authorized
delivery target. This receipt and unchanged assignment are committed only on
`ruach/c17-release-prep`, in a later recording commit whose SHA is returned
separately. Main and both release tags remain exact **e376**. Delivery acceptance
is **blocked by the observed hosted CI failure**, despite completed source
publication and global installation. No source correction, force/replacement,
workflow rerun, GitHub Release or extra publication occurred.

Full raw logs, argv/cwd/start/end/exit receipts, original routing bytes/patch,
metadata/inventory backups, private installation paths and helpers are retained at
**`/tmp/ruach-070-delivery-qePGAj`**. Public [safe evidence](delivery-artifacts/evidence.json)
records necessary identities, counts, preservation and full-log digests; `$R`,
`$SHARED`, `$PLUGIN` and `$USER_ROOT` in command receipts are private path aliases.
No private metadata files, credentials, global instruction text, native identity
or session context are copied into public evidence. Existing evidence and launcher
material are retained; Coordinator owns resource cleanup after final delivery audit.

Immediately before mutation, local and remote main both matched
`2b693cd72bf39c29575841a88d9c7ae719a29715`, both local/remote tag names were unused,
worker HEAD was exact e376 with only the unchanged delivery brief untracked, and
unsafe original Scout/retained tip ancestry was absent. The serialized main
procedure held an exclusive operator lock and rechecked guards around each step;
no other main writer was authorized in this assignment. This is not a claim of
an atomic transaction against arbitrary external writers.

Main's sole dirty routing file and exact patch were backed up and verified:
file SHA-256 `9000bb915bb361d4a7e1e6eb66c7f9b896c3420b61f79b52429688df8f2b671b`,
patch SHA-256 `9fbe68920abcbcb881223ec62f8e92c231459c3efc53c15fb553805aed8a5926`.
The candidate contains all six original explicit Codex alternatives and unchanged
preferences, plus reviewed Tester/Gemini. Only that represented path was restored
from old HEAD immediately before `git merge --ff-only e37645b11ea012f98b213f6eddc38b513cb9248c`.
The fast-forward succeeded, so the older file was not reapplied over the new
policy. No broad stash/reset/clean, unrelated discard, fallback or conflict
resolution occurred. Original backups remain available; main source is clean.

| Published ref | Object / peeled source |
| --- | --- |
| `origin/main` | `e37645b11ea012f98b213f6eddc38b513cb9248c` |
| Annotated `v0.7.0` | Tag object `7abf5ecd846807214595b155050cb9c49204c370`; target e376 |
| Annotated `ruach--v0.7.0` | Tag object `a9c9467162864c390aa4f174f00bde7770101088`; target e376 |

Both tag object types are `tag`; both complete peeled targets are the delivered
revision above. Native `claude plugin tag .` used documented help and created the
plugin annotation without force or push. A fresh expected-main/unused-remote-tag
guard preceded `git push --atomic origin main refs/tags/v0.7.0 refs/tags/ruach--v0.7.0`.
Exit 0 and actual remote refs/peeled targets were verified immediately afterward
and in the final read-only recheck. No worker/reviewer branch or unsafe ancestry
was pushed.

| Actual operation / bound | Result |
| --- | --- |
| Main frozen setup / 300s each | Root, handoff, Herdr and dependency-free harness-eval frozen commands exit 0, using private cache/copyfile backend in ordinary owned directories. Corrected handoff resolves 3.1.9; source unchanged. |
| Main `just check`; `bun run release-check` / 300s each | Exit 0 each on delivered e376. Prior full 529 and exact-source independent review are reused; no redundant full union run. |
| `bun x --bun skills@1.7.0 add ./skills --global --agent codex --agent pi --agent goose --skill '*' --yes` / 300s | Exit 0 from delivered source; actual shared inventory is fifteen Ruach skills with 114 exact managed files. |
| `claude plugin update ruach@ruach --scope user` / 300s | Exit 0 with real lifecycle output. Actual user registry/cache metadata says 0.7.0 and source e376; native plugin list confirms enabled 0.7.0 and folder version 0.7.0. Existing local marketplace registration unchanged. |
| Frozen handoff/Herdr/harness-eval in shared and plugin copies / 300s each | All six commands exit 0. Direct dependency pins match; each handoff's Ajv resolves owned 3.1.9, as does main. No installation through shared symlinks, lock/manifest change or stale dependency fallback. |
| Installed read/hash audits / 120s | 241 managed records match exact Git bytes/modes and literal delivered-worktree permissions; root notices, package/plugin/marketplace metadata, hooks, role/skill inventory and native launch helper included. Fifteen shared skills; plugin seven roles/fifteen skills. |
| Installed list/readiness / 120s each | Skills CLI list, native plugin JSON list and source `ready --route skill` exit 0. Normal Codex universal/Pi/Goose discovery targets and plugin inventory verified; no new native model session or activation claim. |
| Exact-run `gh run list` and `gh run view` / 120s each | Metadata and failed-log retrieval exit 0; run is completed **failure**, not green. No watch was needed because it was already complete. |
| `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.7.0/delivery.md --repo /opt/dev/ruach-worktrees/c17-release-prep` / 120s | Exit 0; corrected-source schema/revision validation only. Owned staged diff/scope/privacy checks pass. |

Version evidence: Bun **1.4.2**, Skills CLI **1.7.0**, Claude Code **2.1.310**.
The shared installation has no independent bundle-version field; its release
identity is established by exact byte comparison against e376's 0.7.0 tree.
All nine pre-existing Claude skill symlink targets **and inode/device identities**
survive; all inventoried old discovery entries are preserved. Pi and Goose each
have fifteen targets resolving to the shared copies; Codex's universal root has
fifteen skill directories, and Claude's plugin has all fifteen. Existing shared/
plugin duplicate exposure is retained. Two known unrelated settings files and
unrelated shared skill contents/modes, non-Ruach Skills CLI/plugin entries and
marketplace registrations remain unchanged. Retained consumers were not touched.

The initial installed comparison exited 1 because it required literal 0644 for
Git's normalized 100644 entries. Read-only diagnosis found 239 ordinary 0664
records, matching both the delivered worktree and previous supported installation;
all 241 byte/Git-mode/source-permission comparisons pass under the correct Git
mode interpretation. The original failure/log is retained; no permission, cache,
registry or discovery workaround was applied. One mistyped private CI metadata
command exited 127; the subsequent actual native gh receipts establish the result.
These diagnostic errors do not replace a failed product gate or authorize retries.

Hosted [CI run 40314249964](https://github.com/rothzeta/ruach/actions/runs/40314249964)
is for exact **e376**, event main push, completed **failure**. Job `verify` failed
at **Resource, link and type checks** with 82 `Broken target` messages across:
`c2-capability.md`, `c2-native-interface.md`, `council-isolation.md`,
`council-member-prep.md`, `council-native-controls.md`,
`council-native-preflight.md` and `demo-readiness.md`, all under
`docs/reports/c1-c5/`. These historical Markdown links point at machine-local
temporary evidence absent on the hosted runner. Complete failed logs remain in
private scratch; only safe counts/report paths are published here. Later hosted
audit/test stages were not reached; passing local checks do not prove hosted
success. This observed cause belongs to this new run, not historical baseline
run 40134877122 whose cause remains unverified.

Further source/delivery changes stopped as assigned. Coordinator should route
this CI portability failure separately under protected-source ownership, retaining
immutable release refs and existing backups. No native dialog or new paid model,
council/advisory/browser/product experiment, listening/quality/cost claim or broader
C1–C5/native parity acceptance was added. No extra owner reconfirmation is needed
for already authorized completed actions; the remaining failure needs a scoped
engineering assignment and independent review, not an improvised delivery fix.
