# 0.7.0 release preparation

This is an untagged source release candidate under RELEASE-PREP-070-01. Package,
plugin and marketplace already agree at 0.7.0; no second version bump is needed.
Published and installed baseline remains 0.6.1. No merge, tag, push, global update
or GitHub Release publication occurs in preparation. The exact committed candidate,
verification results and recording commit are identified in the
handoff `docs/reports/c1-c5/release-prep-070.md`.

Source `171a478d3fb2a93e4b68760f132232f56786f5d5` passed
[combined review](../../c1-c5/combined-source-review.md) at `fb347bb`: 110 root
tests, 124 exact managed snapshot files, seven roles, fifteen skills, foreign-cwd
installation/relocation, 166 safe imports and an audit of actual original Tester
`30deb55`. The nonblocking historical driver-readability finding remains intact;
future handwritten probes should use ordinary multiline code. The owner-facing
[council guide](../../../council.md) at `e4918b1` passed independent review
`8f7b665`, with no findings, 110 root tests and seven checked links. This preparation
changes release prose and imports 28 exact safe final review files using
[immutable provenance](import-manifest.json); it imports no foreign ancestry.

C1 source/specimens/static cases exist; actual complete member action/input
execution binding or a verified whole-member boundary remains missing at `228b306`.
Manual/automatic/project/resume demonstrations remain held. C2 corrected source
`4c5defc` passed `23d05b8` with historical focused/root/Herdr evidence. Actual linked
launch preflight `8db5238` passed executable/receipt/args/environment/prepared-role
and technical-link checks, without proving effective aggregate context, identity,
skill precedence, permissions or advisory behavior. That blocked session was closed
at owner cleanup with zero new Gemini turns. Its old trust question is superseded,
neither pending nor approved. No new native experiment or Agy Coordinator
watcher/continuation support is claimed.

C3 closes the bounded Codex/Bash transport defect at `f6d9c2c`/`31b4522`, retaining
one historical failed correction. MQ-F01 closes the disposable music loop with
zero failed cycles using source review `fe8eae2` and original Tester `30deb55`,
subsequently audited by `fb347bb`. Retained Ramec is untouched; upstream delivery,
listening/musical quality, all fixtures/backends, expiry/device acceptance and
quality/cost measurement remain outside that result. Prototype findings-only
coverage found no confirmed defect; there is no fabricated prototype fix.

Delivery preflight observes local and remote main at
`2b693cd72bf39c29575841a88d9c7ae719a29715`; remote `v0.7.0` and
`ruach--v0.7.0` are unused. Main has only the declared Coordinator-owned routing
edit: six original roles add explicit Codex alternatives with preferences unchanged.
Those edits are represented in candidate policy, alongside reviewed Tester/Gemini
entries. Private backup copies and file/patch digests support a later exact-state
comparison; preparation leaves main's dirty file intact. The unsafe original Scout
commit `0533df706c20555ee3900127d5dd82f57b633a2d` and retained Scout branch tip are
not ancestors of the candidate. Only safe final files are imported.

Read-only hosted CI lookup reports the current main run
[40134877122](https://github.com/rothzeta/ruach/actions/runs/40134877122) completed
with failure. This is baseline evidence, not a candidate result; hosted candidate
CI remains unobserved. Local checks do not stand in for hosted success.

Installation metadata confirms user-scope `ruach@ruach` 0.6.1, cached plugin
metadata/source SHA equal to main, with the existing Ruach marketplace pointing
to the source checkout. Shared global Skills CLI copies contain nine Ruach skills;
all managed bytes match 0.6.1, despite stale CLI lock references to `v0.4.0`.
Existing shared discovery and Claude skill links must be preserved. Exact private
paths, metadata, backup inventories and complete command logs remain in private
scratch; public evidence records necessary scope, versions and digests only.

The separate delivery assignment should name one independently reviewed exact
revision and serialize these operations:

1. Recheck destination main SHA, remote main, unused local/remote tags, and main's
   sole dirty routing file against the recorded byte/patch digests. Stop on target
   movement or unknown edits. Back up that exact file and patch outside the repo,
   verify their hashes, then restore only this already-represented file from HEAD
   immediately before a guarded `git merge --ff-only REVIEWED_SHA`. Do not stash,
   reset or clean unrelated work. If merge fails before movement, restore the exact
   backed-up file; after success, verify all six alternatives and preferences,
   Tester/Gemini entries and expected main SHA. Never reapply the older file over
   the merged policy. Recheck immediately before mutation; exclude concurrent writers.
2. On that exact reviewed main revision run release checks, then
   `git tag -a v0.7.0 REVIEWED_SHA -m 'Ruach 0.7.0'` and the established
   `claude plugin tag .` for `ruach--v0.7.0`. Inspect native tag command help first;
   if unavailable, stop rather than invent success. Verify both peeled tag targets
   equal the reviewed release revision; never overwrite a tag. Publish with
   `git push --atomic origin main refs/tags/v0.7.0 refs/tags/ruach--v0.7.0` after
   rechecking remote baseline. Observe the exact remote refs and hosted CI result.
   Repository practice requires Git push/tags, not an additional GitHub Release.
3. From the delivered source checkout use the existing Skills CLI recipe with
   selected scope: `bun x --bun skills@1.7.0 add ./skills --global --agent codex
   --agent pi --agent goose --skill '*' --yes`. The shared universal directory
   already serves other linked harnesses; preserve their links and unrelated skills.
   Claude already has both shared skill links and the plugin: preserve the existing
   links rather than adding a new Claude Skills CLI target. Inventory and compare
   link targets before/after, and report the existing duplicate exposure.
4. Preserve the existing local Ruach marketplace and use
   `claude plugin update ruach@ruach --scope user`; do not add/replace marketplaces
   or unrelated settings. Confirm plugin list and exact cached manifest/source.
   Run `bun install --frozen-lockfile` in the shared and plugin-cache copies of
   `ruach-handoff`, `ruach-herdr` and `ruach-harness-eval` as needed.
   Inspect with `bun x --bun skills@1.7.0 list --global`, `claude plugin list`,
   and source `ready` against the exact resulting roots. Check fifteen skills,
   seven plugin roles, installed bytes and preserved discovery/settings metadata.
   A new native session is needed to load updated instructions; do not open one here.
5. Record exact delivered revision, remote refs, CI and installation results,
   exceptions and preserved dirty-policy outcome. Coordinator cleans newly
   authorized release resources only after concrete reuse ends. Do not touch
   retained consumers, their snapshots, accounts, native dialogs or global instructions.

CLI `claude plugin list`, marketplace list and plugin help returned exit 0 with no
output in this preparation environment. Direct bounded documented metadata reads
confirmed installation. Delivery must obtain useful lifecycle command output or
verify actual metadata changes; an empty exit-0 response cannot establish update
or tagging success. Exact command failures, supported environment remediation,
frozen dependency readiness and snapshot checks are recorded in the handoff.
