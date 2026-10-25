task: C-IN-02
status: complete
outcome: "Refreshed the untagged 0.7.0 root documentation and safe evidence with Coordinator-closed bounded MQ feedback and preserved C2 correction/review holds; no source, native acceptance or delivery change."
source_baseline: 7ea42d943698bc23cafa472cf648ec20ab94c7e2
candidate_revision: 15f043d39f7baacac39c4d94a83c46e463a71f7e
tested_revision: 15f043d39f7baacac39c4d94a83c46e463a71f7e
protected_source_revision: 4c5defcd13691f9b6754fd0c9bc3fde311e45061
prior_integration_revision: 843941ecbead2442bbb487031f5faddd06d8da89
mq_implementation_evidence_revision: 49e611d4c2dc40910c9a0f5118e43d6881774c7d
mq_source_review_revision: fe8eae24e1d784ec49d9eeaacd756a178f3caf98
mq_tester_evidence_revision: 30deb550359d09ecd3381bfb581e688b8ae40491
c2_rejection_revision: 823be77f4e35e73107470d276c0fad2f0f6a4797
artifacts:
  - docs/reports/c1-c5/integration-refresh.md
  - docs/assignments/c1-c5/C-IN-02.md
  - docs/reports/c1-c5/integration-refresh-imports.json
  - docs/reports/c1-c5/music-fix-artifacts/mq-f01.patch
  - docs/reports/c1-c5/music-fix-review.md
  - docs/reports/c1-c5/music-retest.md
  - docs/roadmap.md
  - /tmp/ruach-c-in-02-9I5mOWxl
verification:
  - "Exact candidate just check and bun run release-check: exit 0; static/link/type checks and unchanged prepared 0.7.0 metadata pass."
  - "Exact candidate bun run test with authorized sockets: exit 0, 110 pass/0 fail in 20.91 seconds."
  - "Four newly imported handoffs validate with --repo; 41 artifact checksums, all 59 new snapshots and prior 102 snapshots match."
  - "Protected source/metadata diff against 4c5defc: exit 0; exact 65-file candidate scope verified; unsafe ancestry absent. Known native-locator/UUID/credential-pattern audits have zero findings."
  - "Final handoff validator --repo: exit 0, nine existing revision references resolve; final resource, assignment integrity and owned diff checks pass."
review: not-run
discoveries:
  - "MQ source review and actual original Tester packet are separate evidence. Coordinator combines them to close only the bounded disposable music correction; final union review still must audit the actual Tester packet."
  - "No packaged/runtime/source bytes changed in this root refresh; reuse the identified prior Herdr/install evidence without claiming a new install or native run."
blockers:
  - "REVIEW-C2-AR01-FIX-01 remains active on exact 4c5defc; Coordinator must consume a passing result before any actual Gemini worker/advisory. Actual native role/budget/identity/permission/linked ambient skill/brief/activation/useful advisory gates remain open."
  - "C1 complete member action/input execution binding or whole-member boundary remains capability-held; real manual/automatic/project/resume demonstrations stay unperformed."
  - "Final union Reviewer must audit actual 30deb55 evidence and the exact refreshed union. Hosted CI, full install-route/behavior/native parity, audio/listening/device and delayed-expiry ambiguity, release acceptance and separate delivery remain open."

# C1–C5 evidence refresh

Bounded root refresh is complete at existing candidate/tested revision `15f043d39f7baacac39c4d94a83c46e463a71f7e`, committed before required checks. The unchanged assignment and this validated handoff are a later evidence-only commit; its creating SHA is returned externally. This task performs no new source implementation, acceptance or delivery. Pending review/native outcomes were not polled or awaited.

## Scope and exact-file provenance

Five current root documents changed: `README.md`, `CHANGELOG.md`, `docs/roadmap.md`, `docs/operations.md` and `docs/native-parity.md`. They replace outdated MQ-pending statements, expose the requested relative patch and actual Tester/source-review packets, and retain C2 rejection/correction/current-review gates. Existing plan-index navigation already points to the canonical roadmap and needed no edit. The untagged 0.7.0 metadata and published 0.6.1 remote examples remain unchanged; no new CI/installer/evaluation framework or policy was introduced.

[integration-refresh-imports.json](integration-refresh-imports.json) records 59 new exact final-file imports from the four assigned revisions, with path, full source revision, byte count and SHA-256. Its base reference retains the original [102-entry manifest](integration-imports.json) and its hash; neither that manifest nor any prior import was rewritten. New evidence consists of MQ patch/source/build/verification/report/assignment at `49e611d`, actual original Tester packet at `30deb55`, exact source review at `fe8eae2`, and initial C2 rejection/report/safe packet at `823be77`. Existing corrected C2 source/report/safe packet at `4c5defc`/`7ea42d9` remain unchanged and linked from the current status.

Imports used exact `git show REV:FILE` snapshots only, without foreign ancestry, merges or cherry-picks. All required relative artifact links resolve. Historical report conclusions, raw-evidence references and observed-time source/native paths remain intact even where the owning worker's checkout was subsequently released. The old MQ Reviewer's pending Tester gate is preserved as truthful for its original inputs; it was not rewritten to claim inspection of a later packet.

The requested [relative MQ patch](music-fix-artifacts/mq-f01.patch) is SHA-256 `3f209b4eab7b1520c8302783aba02705fe1bf7ed6ffd20ce3b519d985a63c2fc`, with only the three declared `src/client/src/performance/` paths. It remains a report artifact, without a second editable product tree. Ruach candidate `7b53c336f435a0c740e7ab61f71d4ce801562c69` records the patch; product identity is canonical source `6f17044de0b46cedef51eb71c9816ce11b6a589a` plus that patch, corrected client tree `4e5163f31bff96b3f3dc47767a5c898d82bba000bfed17dd23321156a4175265` and unchanged server tree `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0`. It is not an upstream product delivery commit.

Known native identity/compact/encoded/database/transcript/shutdown-log locator checks used the existing safe-hygiene private mapping in memory without printing values. UUID/credential-pattern scans, JSON parsing and 41 imported artifact checksums pass; all 59 new and 102 previous files match their recorded hashes. The original unsafe C2 report ancestry/diff was not read/imported; graph checking confirms it is not an ancestor of the candidate. No private DB/profile, account/global instruction, raw reasoning, native ID or hidden game state was copied. Raw C/P/T/review material remains private under its original `/tmp` allocations.

The candidate diff is exactly 65 files: five root docs, one new provenance manifest and 59 snapshots. All `agents/**`, `skills/**`, `config/**`, `scripts/**`, `tests/**`, dependencies/locks, routing/permissions, CI, metadata and notices match protected `4c5defc`. C-IN-01, C2 correction and earlier failure/authority evidence remain immutable. No main, retained consumer/product, global settings/discovery, native trust/account/model/worker/runtime or cleanup action occurred.

## Current disposition and next gates

The [roadmap](../../roadmap.md#c1c5--deliberate-find-fix-exercise) remains the single concern/status list. This refresh consumes the assignment's completed evidence and Coordinator disposition:

- **MQ-F01:** the bounded disposable music correction is **closed by Coordinator disposition**, with zero failed MQ cycles. [Source review `fe8eae2`](music-fix-review.md) independently checked 44 state tests and 20 baseline/candidate original-pair cases, with no material findings. [Original Tester `30deb55`](music-retest.md) independently exercised the actual offered stop-time fixture on the corrected build: byte-identical original request, one Generate/save, automatic admission/reopen/export, 56 checks in three scenarios, all 16 served assets and preserved originals. Source review did not receive or inspect that later Tester packet; the final union Reviewer must audit it. Retained Ramec/provisioned baseline are unchanged. The requested patch/evidence outcome does not establish upstream delivery, listening/musical quality, all-fixture or backend acceptance. The owner released music Implementer/Tester workspaces/worktrees/private bootstrap directories; commits/branches and raw evidence remain. This refresh performed no cleanup.
- **Pralice and original driver:** real bounded play/hunt remains findings-only coverage with no confirmed defect or fabricated fix loop. The original 302.865-second driver/120-second cap breach and exit 1 remain recorded under Coordinator disposition, never retroactive compliance. Later independent drivers passed within their explicit allocations. Listening/device and delayed-expiry ambiguity remain held.
- **C2:** initial handed-off `f17e923` failed review `823be77` for P1 C2-AR-01: 1.4.7 preflight followed by short four-argument shell selection of a distinct 1.4.6 recorder. [Correction `4c5defc` / handoff `7ea42d9`](c2-executable-fix.md) always reuses the existing pinned Agy bootstrap; 36 focused, 110 root, 285 Herdr, prepared release and original startup-control checks pass. REVIEW-C2-AR01-FIX-01 remains active on immutable `4c5defc`. There is still one completed failed C2 cycle/default two, one remaining; a further required source/live failure of this handed-off correction stops normal looping for escalation. No actual Gemini worker/advisory before the Coordinator consumes a passing new review. Full native role under aggregate budget, authoritative identity/permission, linked ambient/declared skill precedence, literal brief, technical activation and useful advisory remain pending. No global workflow absence or Agy watcher/continuation claim.
- **C1/C3/instructions:** C1's complete member action/input execution binding or verified whole-member boundary remains held by `228b306`; audited child controls do not prove council independence or universal impossibility. No repeat probe or planning phase without a concrete supported delta; manual/automatic/project/resume behavior stays unperformed. Bounded Codex/Bash long transport `f6d9c2c`/`31b4522` remains accepted with its original failure/failed first attempt preserved; no other harness parity or MQ/C2 counter reset follows. Instruction source `90230d1`/review `e3d93d6` and Coordinator compatibility observations remain unchanged; static cases are not behavioral proof.

Next owner work is to consume actual C2 review/live outcomes, refresh only their current statuses if needed, then commission independent review of the exact final combined revision including the actual `30deb55` packet. Hosted CI, full install-route/behavior/native parity and release acceptance remain separate open gates. No invented hosted green, charges or consensus/musical quality claim accompanies this refresh. Delivery/publication/install still require a separate authorized assignment.

## Exact verification and reuse

Evidence root: `/tmp/ruach-c-in-02-9I5mOWxl`. Commands below ran after candidate creation from `/opt/dev/ruach-worktrees/c15-instructions`; full logs and explicit exit files precede displayed tails. Existing pinned dependencies were reused.

| Command | Result | Evidence |
| --- | --- | --- |
| `timeout 300s just check` | 0, resource/link/notices and TypeScript pass | `check.log`, `.exit` |
| `timeout 300s bun run test` with authorized sockets | 0, 110 pass/0 fail, 20.91 seconds | `root-test.log`, `.exit` |
| `timeout 300s bun run release-check` | 0, unchanged prepared 0.7.0 metadata | `release-check.log`, `.exit` |
| `timeout 120s bun /tmp/ruach-c-in-02-9I5mOWxl/verify-refresh.ts` | 0, four imported canonical handoffs, 41 checksums, 59 new/102 old exact snapshots, protected diff, scope/ancestry/privacy checks | `verify-refresh.log`, `.exit`, `verification.json`, `imported-report-validation.json` |
| `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/integration-refresh.md --repo /opt/dev/ruach-worktrees/c15-instructions` | 0, nine existing revisions resolve, no diagnostics | `handoff-validate.log`, `.exit` |
| `bun scripts/check.ts` | 0, final report and all imported relative links included | `final-resource.log`, `.exit` |
| `sha256sum -c /tmp/ruach-c-in-02-9I5mOWxl/assignment.sha256`; `git diff --check 7ea42d943698bc23cafa472cf648ec20ab94c7e2 HEAD` | 0 each | Original assignment receipt and owned final/staged checks |

Reused, not rerun: exact `4c5defc` full Herdr 285-test evidence and its focused/original controls; C-IN-01's 28 handoff tests, 19 report validations and 124-managed-file/7-role/15-skill foreign-cwd snapshot/relocation evidence at `843941ec`. The earlier snapshot identifies its original revision and proves packaging/discovery/relocation at that scope, not a newly installed copy of this candidate. This root refresh changes no packaged/runtime/source bytes relative to protected `4c5defc`, so it introduces no new install concern. No new committed-candidate snapshot installation, broad Herdr/product suite, product build/browser/play/listening, native/model call, worker monitoring or hosted CI was run here. Required root tests retain their ordinary isolated installer fixtures. Imported product-test/runtime passes are attributed historical evidence, not reruns. Private `SHA256SUMS` retains full-log and helper/receipt digests.

Initial staging was denied by shared-gitdir read-only `index.lock` protection; assignment-authorized scoped access succeeded. Git then rejected explicitly selected `.log` artifacts under generic ignore rules. Only those named safe snapshot paths were force-staged, preserving exact bytes; no ignore/global policy or lock was changed/deleted. Original outputs remain `candidate-commit-default.log` and `candidate-commit-ignored-logs.log`. Required verification checks had no initial failures. Preserve this branch/worktree/session, raw allocations and private evidence; no resource cleanup, main merge, tag, push, global/retained-consumer installation or delivery occurred.
