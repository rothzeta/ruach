task: RELEASE-REVIEW-070-01
status: complete
outcome: "Independent review complete. Release prose, source reuse, provenance and guarded delivery plan pass; release readiness is blocked by the actual handoff dependency audit. No fixes or delivery performed."
candidate_revision: e96367b5e482808a22fbac817ed1162e8cc712ec
reviewed_revision: e96367b5e482808a22fbac817ed1162e8cc712ec
tested_revision: 0d686a454eb5b21001e65eac2b7eeed614290d3f
evidence_revision: 0d686a454eb5b21001e65eac2b7eeed614290d3f
source_baseline: 8f7b665fca3eaf3dc61249f88fcda91cabd1629a
destination_before: 2b693cd72bf39c29575841a88d9c7ae719a29715
artifacts:
  - docs/assignments/c1-c5/RELEASE-REVIEW-070-01.md
  - docs/reports/releases/0.7.0/review.md
  - docs/reports/releases/0.7.0/review-artifacts/source-evidence.json
  - docs/reports/releases/0.7.0/review-artifacts/commands.json
  - docs/reports/releases/0.7.0/review-artifacts/audit-handoff-network.stdout
verification:
  - "Passed: just check and bun run release-check, exit 0 each."
  - "Initial bun run test: environment-blocked, exit 1, 106 pass/four fixture Unix-socket EPERM failures. One assignment-authorized same-recipe socket rerun passes, exit 0, 110 pass/zero fail."
  - "Actual bounded CI bun audit: root and Herdr pass, exit 0; handoff fails, exit 1, fast-uri 3.1.8 with two moderate and two low advisories. Initial network-denied attempts retained."
  - "Passed: exact source/report-only scope, 28 new imports/26 checksums, 166 prior imports and chains, guide/protected-source equality, unsafe graph exclusion, privacy patterns and original preparation receipts/digests."
  - "Passed as recorded and independently audited: preparation full 529-test recipe and four exact candidate installer/check receipts; 124 retained managed file bytes/modes, seven roles, fifteen skills, five sentinels and relocation. Not rerun here."
  - "Passed: immutable revision diff --check, final just check and canonical handoff validator, exit 0 each. Owned-scope evidence is recorded in commands.json."
review:
  - "One material blocking finding RR070-01. No other material source or plan findings."
discoveries:
  - "Baseline hosted main run 40134877122 failed Dependency audit. Its handoff lock is byte-identical to candidate, but the historical log remains empty; today's advisory results do not prove the historical cause."
  - "Existing shared skills and plugin match 0.6.1 bytes; stale shared lock reference v0.4 is not installed-content evidence. Nine existing Claude discovery links and duplicate shared/plugin exposure remain preserved."
blockers:
  - "RR070-01: required handoff dependency audit fails. Route a bounded dependency correction and review the resulting exact candidate before merge/push/install."

Reviewed `8f7b665f..e96367b5` and the exact recording successor `0d686a45`.
The candidate has 35 changed paths: five release-facing documents, preparation
and import manifest, and 28 safe final review snapshots. The successor adds only
the preparation assignment, handoff and verification summary. Executable checks
ran in this worktree at `0d686a45`, whose product source equals the candidate.
The report-creating commit is returned separately. **Do not deliver this candidate
while RR070-01 remains unresolved.**

**Blocking finding RR070-01 — required dependency audit fails.** Location:
[`skills/ruach-handoff/bun.lock`](../../../../skills/ruach-handoff/bun.lock), line 18,
dependency `ajv@8.20.0 > fast-uri@3.1.8`; CI executes this skill's `bun audit`
at [`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml).
The actual network-enabled audit exited **1**, with the following results:

| Advisory | Severity | Reported affected range |
| --- | --- | --- |
| [GHSA-w74x-v6f9-j3xg](https://github.com/advisories/GHSA-w74x-v6f9-j3xg), URI scheme spoofing through percent decoding | Moderate | `>=3.0.0 <3.1.9` |
| [GHSA-xhq7-xmqj-769h](https://github.com/advisories/GHSA-xhq7-xmqj-769h), improper relative-reference path equivalence | Low | `>=3.0.0 <3.1.9` |
| [GHSA-wjr9-j795-jxcr](https://github.com/advisories/GHSA-wjr9-j795-jxcr), host confusion through host canonicalization | Moderate | `>=3.1.3 <3.1.9` |
| [GHSA-333x-w4r6-6crp](https://github.com/advisories/GHSA-333x-w4r6-6crp), suffix-reference scheme injection | Low | `>=3.0.0 <3.1.9` |

Evidence is the complete [audit output](review-artifacts/audit-handoff-network.stdout)
and matching exit/time/hash receipt in [commands.json](review-artifacts/commands.json).
This locked runtime dependency ships inside the executable handoff skill;
the validator imports Ajv and compiles its schema. The audit establishes a failed
mandatory release gate and reported vulnerable resolution, not a demonstrated
exploit of this validator. It is inherited from main, not a regression introduced
by the prose delta. Existing dependency-floor tests cover ws/yaml and their pass
does not protect against this newly reported fast-uri resolution.

Suggested direction: separately assign the smallest compatible handoff lock
correction outside these reported ranges (the audit identifies 3.1.9 as the
boundary; Ajv permits `^3.0.1`). Verify the selected resolution with a frozen
install, actual CI audits and affected handoff/root checks, then review the new
exact release candidate. Do not assume a version number alone proves remediation.
No dependency, lock, test or product file was changed in this review.

No other material findings. The combined review `fb347bb` and guide review
`8f7b665f` can be reused: all protected roles, skills, scripts, config, tests,
evals, locks, package/plugin metadata, Just recipes and CI equal reviewed
`4c5defc`; the council guide equals `e4918b18`, and its review is unchanged.
All 28 new snapshots match their immutable `fb347bb` blobs, sizes and SHA-256s;
all 26 supplied checksums pass. All 102 + 59 + 5 prior imports and manifest
chains also match. The known unsafe original Scout commit and retained Scout tip
are not ancestors of the reviewed recording revision. Only graph reachability
and allocated safe final files were read; unsafe historical bodies were not read
or imported. Limited UUID/credential-pattern scans found no exposure in the new
candidate or recording files. They are supplementary checks, not a universal
privacy certification. [Source evidence](review-artifacts/source-evidence.json)
records the comparisons and unchanged assignment digest.

Current README, changelog, roadmap, operations and parity prose accurately close
the combined/guide source gates and owner cleanup, without rewriting historical
observed-time pending gates. C1 remains held at `228b306` for actual complete
member action/input binding or a verified whole-member boundary; no universal
impossibility or renewed unsupported probe loop is asserted. The safe final
`8db5238` preflight report/boolean evidence supports only the stated actual
executable, receipt, argv, environment and prepared-role/link boundary. Owner
cleanup/session closure and zero new Gemini turns are supplied authoritative
assignment context, not a new native observation by this Reviewer. Old trust is
superseded, neither pending nor approved. Aggregate context, identity, effective
skills/permissions/advisory behavior and Agy watcher/continuation remain unproved.
C3's bounded Codex/Bash closure and historical failure remain; MQ closes only the
disposable original Tester/source-review/combined-audit loop with zero failed
cycles. Retained-product delivery, listening/general musical quality and a
prototype defect are not invented. There is no broad all-C1–C5 acceptance.

Package, plugin, marketplace and changelog coherently identify prepared 0.7.0;
there is no extra bump. Published installation examples stay 0.6.1 under the
recorded preparation practice. Remote publication, candidate hosted CI and global
installation are unobserved. No new GitHub Release is required by that practice.

All 32 preparation command receipts match their raw argv/cwd/timestamps/exits and
full stdout/stderr digests after expanding the documented `$R` scratch alias.
The successful `just test` receipt is exit 0, 240.489 seconds; its full log records
110 root, 28 handoff, 285 Herdr, 71 harness-eval and 35 changelog tests, each with
zero failures. Initial root/full socket EPERM failures remain retained separately.
Assertion counts are observations, not contracts. The fixture/native recorder
tests do not demonstrate actual model, council, advisory or native acceptance.
No changed executable boundary warrants repeating the full union suite here.

The original four installer/check receipts use the exact candidate and foreign
cwd, before and after relocation. Their full logs/digests agree. Independent
comparison of the retained relocated consumer against Git blobs confirms all
124 managed bytes/modes, manifest revision/hash, seven roles/fifteen skills and
five consumer customization sentinels. The installer audit derives expected
bytes/modes from the committed source, rather than trusting only the installed
manifest. The untagged manifest correctly omits release version. No new installer
execution or retained consumer mutation occurred.

| Required check, cwd this worktree unless stated | Disposition and evidence |
| --- | --- |
| `just check`, 300s | **Passed**, exit 0; complete resource/link/TypeScript output retained. |
| `bun run release-check`, 300s | **Passed**, exit 0; 0.7.0 metadata coherence. |
| Initial `bun run test`, 300s | **Not verified: environment**, exit 1; 106 pass/four Unix-socket `listen` EPERM failures at fixture setup `tests/agent-waiting.test.ts:142`, before the behavioral transition. |
| Same `bun run test`, 300s, one scoped socket escalation | **Passed**, exit 0, 110 pass/zero fail, 19.223s receipt duration. No test edits/skips or registered-flake authority applied. |
| CI `bun audit`, root; handoff; Herdr, 120s each | Default attempts: **not verified: environment**, exit 1 each, npm DNS failure. Assigned network escalation: root **passed**, exit 0, 26 packages; handoff **defect / failed gate**, exit 1, RR070-01; Herdr **passed**, exit 0, three packages. Full audit output is retained; no fix/install command ran. |
| `gh run view 40134877122 --repo rothzeta/ruach --job 120994159585 --log-failed`, 120s | Initial environment network failure, exit 1; scoped native read exits 0 with both streams empty. **Historical cause unclassified/unverified**. Audited original nonempty run-detail receipt identifies baseline SHA `2b693cd7` and failing Dependency audit; today's result is candidate evidence only. |
| Source/provenance/receipt/snapshot/install-state read/hash audit, 120s | **Passed**, exit 0; source-evidence artifact. Two initial disposable helper failures came from comparing the documented `$R` alias literally in argv/cwd; preserved original logs, corrected alias expansion, no product defect or flake relabeling. |
| `git diff --check 8f7b665f 0d686a45`, 120s | **Passed**, exit 0. |
| Preparation `just test` / exact candidate installer and checks | **Passed as recorded and independently audited**, not newly executed; full logs and statuses verified as described above. |
| `bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.7.0/review.md --repo /opt/dev/ruach-worktrees/c17-release-review`, 120s | **Passed**, exit 0. Final owned-scope result recorded in commands.json; final state returned separately. Validation proves structure/revision resolution only. |
| Actual native/model/council/product/browser, hosted candidate CI, merge/tag/push/global install | **Not run / unobserved**; no new capability or delivery acceptance. |

The [guarded delivery plan](preparation.md) is concrete and suitable after a
separately reviewed audit correction; it grants no exception to RR070-01:

1. Exclude concurrent writers; recheck local main **and** remote main against
   `2b693cd72bf39c29575841a88d9c7ae719a29715`, and both local/remote tag names
   `v0.7.0` and `ruach--v0.7.0` unused. Stop on movement or unknown dirty content.
   Raw preparation remote receipts support that observed baseline, not a promise
   that it remains current at delivery.
2. Main's sole dirty path remains `config/agent-routing/roles.yaml`. Saved bytes
   hash `9000bb915bb361d4a7e1e6eb66c7f9b896c3420b61f79b52429688df8f2b671b`;
   saved patch hash `9fbe68920abcbcb881223ec62f8e92c231459c3efc53c15fb553805aed8a5926`.
   Independent comparison confirms the six Codex alternatives and unchanged
   preferences are represented in candidate alongside Tester/Gemini. Back up and
   verify before clearing only that represented path immediately before guarded
   `git merge --ff-only REVIEWED_SHA`; restore the exact backup if failure occurs
   before movement. After movement verify the new policy; never copy the older
   file over Tester/Gemini. No broad stash/reset/clean is needed or authorized.
3. After required checks on the newly accepted exact revision, create both
   planned annotated tags without replacement, using the recorded native plugin
   lifecycle after useful help/behavior verification. Verify both tag object
   types and peeled targets equal that accepted source revision. Recheck remote
   baseline, then atomic push of main and both explicit tags, without force.
   Read resulting remote refs and actual hosted CI; do not infer success.
4. Existing global shared copies are nine skills/84 managed files matching
   0.6.1; plugin is user-scope 0.6.1 at the baseline SHA with 92 matching files.
   Private metadata receipts/digests and live allocated metadata agree. Stale
   shared lock ref v0.4 does not supersede byte evidence. Preserve all nine
   existing Claude discovery links, shared/plugin duplicate exposure, other
   skills/settings/accounts and retained consumers. Back up/recheck inventories.
5. Use the existing project Skills CLI recipe with the selected existing
   Codex/Pi/Goose scope, then existing user-scope plugin update lifecycle; preserve
   marketplace registration and Claude links. Verify actual metadata, exact
   managed hashes, fifteen skills/seven roles, discovery targets and unrelated
   settings preservation. Empty exit-0 plugin output is not proof. Perform
   frozen per-copy dependency setup/checks for handoff, Herdr and harness-eval
   as applicable in both shared and plugin copies; the corrected handoff lock
   must be the one installed. A fresh native session is subsequent operator use,
   not a review probe.

All checks used Bun 1.4.2 and Just 1.40.0 with existing checkout-local dependency
links; no package installation occurred. Full new command logs/receipts and
disposable helpers remain at `/tmp/ruach-070-review-GUUfBO`; original preparation
scratch is supplied through the private locator, not imported. Safe command
receipts and audit streams are durable alongside this report. Temporary local
dependency links are removed before handoff. Only unchanged assignment, report
and owned safe evidence are committed. No source fixes, main mutation, new native
input, tag, push, installation or cleanup of retained evidence was performed.

Initial staged whitespace check flagged blank EOF lines in the three verbatim
network-denied audit stdout banners. Those banner-only public copies were omitted;
their complete raw streams and receipt hashes remain in private scratch. No raw
log was rewritten. The final staged check covers the remaining exact evidence.
