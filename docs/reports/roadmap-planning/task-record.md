# Roadmap planning task record

Owner request: two Sol Architects create detailed plans that can be handed off from `docs/roadmap.md`.

## Binding decisions

| ID | Date | Owner words | Authority and scope | Supersession |
| --- | --- | --- | --- | --- |
| PLAN-D1 | 2026-10-11 | “have two sol architect plan the next features from the docs/roadmap. create detailed plans that can be handoffed.” | Authorizes two Sol Architect planning sessions and durable planning artifacts. | Current |
| PLAN-D2 | 2026-10-11 | “R1-R3, first when they are done(up to 5 rounds to agree, or puts the disagrements in an arbitration file and move on) next batch, etc.” | Complete batches sequentially; exchange actual plans/reports for at most five rounds; record unresolved architect disagreements for arbitration and proceed. | Refines PLAN-D1 scope and review sequence |

Planning does not authorize feature implementation, future paid smoke/eval sessions, publication, global harness changes, or resolution of parked owner decisions. The two requested Architect sessions are authorized. The explicit model choice is `gpt-6.1-sol`, high effort; repository routing catalogs remain unchanged.

## Input baseline

Committed source base: `d75039aa7b82b262e2f28af08630258fb7f77180`.
Current roadmap includes uncommitted owner edits reconciled 2026-10-11. Its frozen planning-input SHA256 is `7e81217ff6fc2a79626394f2a13901086ca94ab4b7be3aced4fdc93440bb0957`.
Owner edits in `docs/roadmap.md`, `docs/native-parity.md`, and `docs/design/0.4-suggestions-from-ramec-orchestration.md` must be preserved. Frozen inputs live in temporary scratch; output plans cite canonical document paths.

## Batch queue

| Batch | Packages | State | Owners and dependency |
| --- | --- | --- | --- |
| 1 | R1–R3 | Closed with agreement in round 4; exported to canonical checkout | Plans at `4b62d7b9` / `6a08b3f5`; receipts `da07e92b` / `19160cd6`. No arbitration. |
| 2 | R4–R7 | Closed with agreement in round 4; exported to canonical checkout | Plans `0588d563` / `36716b46`; receipts `50f867a3` / `b8684190`. No arbitration. |
| 3 | C1–C5 | Closed with agreement in round 4; exported | Plans `dc8a4a41` / `2de675bc`; conditional C2 and C1 → C3 → C4 → C5 preserved. |
| 4 | M1 | Closed with agreement in round 4; exported | Plans `19ad6483` / `c4473dde`; execution retains R1 evidence dependency. |

Parked proposals remain parked. D1–D3 remain owner decisions; plans may identify their evidence requirements without settling them.

## Review protocol

Independent plan preparation is round 1. Round 2 exchanges both actual plans. Each Architect checks the combined batch for source accuracy, scope, compatible contracts, ownership, dependencies, acceptance criteria, verification/authority boundaries, and implementation readiness. Reports identify agreements, proposed corrections, and precise disagreement IDs with evidence. A revised plan and actual peer reports form the inputs to each later round.

Stop when both Architects explicitly agree the combined plans are ready, with any shared factual/owner holds recorded. Agreement does not resolve owner decisions or certify implementation behavior. At round 5, preserve unresolved points, both positions, evidence, impact, and the question for arbitration; do not silently choose a position or keep looping. Next-batch planning can proceed around the unresolved points, while dependent implementation stays gated.

## Report history (later closures supersede earlier phases)

| Unit | Branch | Assignment | Plan and handoff | Handled state |
| --- | --- | --- | --- | --- |
| PLAN-B1-A | `ruach/sol-roadmap-reliability` | `assignment-reliability.md` | `../../design/next-release-reliability-plan.md`, `reliability.md` | Round-1 handoff handled at `a77d5cb3`; planning complete, peer review pending |
| PLAN-B1-B | `ruach/sol-roadmap-coordination` | `assignment-coordination.md` | `../../design/next-coordination-plan.md`, `coordination.md` | Round-1 handoff handled at `fc31e91f`; planning complete, peer review pending |
| PLAN-B1-R2-A | `ruach/sol-roadmap-reliability` | `assignment-batch1-round2-reliability.md` | `batch1-round2-reliability.md` | Handled at `d4ffa4b5`; changes requested; actual report distributed |
| PLAN-B1-R2-B | `ruach/sol-roadmap-coordination` | `assignment-batch1-round2-coordination.md` | `batch1-round2-coordination.md` | Handled at `911aef75`; changes requested; actual report distributed |
| PLAN-B1-R3-A | `ruach/sol-roadmap-reliability` | `assignment-batch1-round3-reliability.md` | `batch1-round3-reliability.md` | Handled at `4b62d7b9`; corrections accepted/applied; exact pair review pending |
| PLAN-B1-R3-B | `ruach/sol-roadmap-coordination` | `assignment-batch1-round3-coordination.md` | `batch1-round3-coordination.md` | Handled at `6a08b3f5`; corrections accepted/applied; exact pair review pending |
| PLAN-B1-R4-A | `ruach/sol-roadmap-reliability` | `assignment-batch1-round4-reliability.md` | `batch1-round4-reliability.md` | Handled at `da07e92b`; agree on exact revised pair |
| PLAN-B1-R4-B | `ruach/sol-roadmap-coordination` | `assignment-batch1-round4-coordination.md` | `batch1-round4-coordination.md` | Handled at `19160cd6`; agree on exact revised pair |
| PLAN-B2-A | `ruach/sol-roadmap-reliability` | `assignment-batch2-reliability.md` | `../../design/next-permissions-communication-plan.md`, `batch2-reliability.md` | Handled at `cc84be00`; ready for actual combined peer review |
| PLAN-B2-B | `ruach/sol-roadmap-coordination` | `assignment-batch2-coordination.md` | `../../design/next-handoff-verification-plan.md`, `batch2-coordination.md` | Handled at `621cf1a2`; ready for actual combined peer review |
| PLAN-B2-R2-A | `ruach/sol-roadmap-reliability` | `assignment-batch2-round2-reliability.md` | `batch2-round2-reliability.md` | Handled at `59b41e0c`; agree under reservations, actual report exchanged |
| PLAN-B2-R2-B | `ruach/sol-roadmap-coordination` | `assignment-batch2-round2-coordination.md` | `batch2-round2-coordination.md` | Handled at `aa0353fb`; B2-B-01 changes, actual report exchanged |
| PLAN-B2-R3-A | `ruach/sol-roadmap-reliability` | `assignment-batch2-round3-reliability.md` | `batch2-round3-reliability.md` | Handled at `0588d563`; explicit gate accepted/applied |
| PLAN-B2-R3-B | `ruach/sol-roadmap-coordination` | `assignment-batch2-round3-coordination.md` | `batch2-round3-coordination.md` | Handled at `36716b46`; explicit gate accepted/applied |
| PLAN-B2-R4-A | `ruach/sol-roadmap-reliability` | `assignment-batch2-round4-reliability.md` | `batch2-round4-reliability.md` | Handled at `50f867a3`; exact pair agree |
| PLAN-B2-R4-B | `ruach/sol-roadmap-coordination` | `assignment-batch2-round4-coordination.md` | `batch2-round4-coordination.md` | Handled at `b8684190`; exact pair agree |
| PLAN-B3-A | `ruach/sol-roadmap-reliability` | `assignment-batch3-reliability.md` | `../../design/next-adapter-bugfix-plan.md`, `batch3-reliability.md` | Independent planning prepared; report unhandled |
| PLAN-B3-B | `ruach/sol-roadmap-coordination` | `assignment-batch3-coordination.md` | `../../design/next-council-qa-hunt-plan.md`, `batch3-coordination.md` | Independent planning prepared; report unhandled |

The two owned worker sessions/worktrees have been released after all batches closed. Retained branches preserve every committed assignment/plan/report. No unrelated sessions or worktrees were changed. The historical table records each phase as it was handled; final closure events below supersede earlier pending-review states.

Verification so far: source `just check` passed; source `bun run test` passed 90 tests; `skills/ruach-handoff` suite passed 28 tests. These establish baseline/tool checks, not approval of unfinished plans.

Round-1 handoffs consumed: both workers report complete planning artifacts, source handoff validation and link checks passed. Their fresh worktrees lack nested dependencies (81/90 root tests passed there); the Coordinator's installed source baseline passed all 90. These are distinct environments. R1 hosted/native/consumer evidence remains future work. R3 behavioral evaluation remains future work.

Round 2 handled: both agreement values are `changes`. Reliability review requires B1-A-001 changelog serialization, B1-A-002 held-out R3 facts, B1-A-003 Coordinator cleanup; Coordination review requires B1-B-01 plugin-cache blind-access boundary. Both report compatible architecture and no present arbitration question. Actual closed peer reports were exchanged for round 3; severity differences must be answered rather than counted as votes.

Round 3 handled: both correction reports are complete with agreement `changes` pending exact-pair review. All four necessary arguments were accepted; revised plan digests are reliability `37a72430abe975baf3710e91932a554f4b226f82dfd741edae8722ebb9d3086a`, coordination `13e0ca350c59567a845b2aa4486636e3cb199be938dd40bdbda990ac4937e9ed`. Actual corrected plans, handoffs and reports were frozen together for round 4. No arbitration question remains from correction dispositions.

Round 4 handled: both reports explicitly agree on identical plan digests/revisions; all four corrections are resolved. No remaining plan correction or arbitration question. Plans and all batch-1 assignments/handoffs/reports were exported to the canonical checkout without changing the owner's three input documents. Retained branches preserve creating revisions. Agreement concerns planning readiness, not feature/evidence completion.

Batch 2 independent handoffs handled: both complete, mechanical/links/whitespace checks pass. R4/R5 retains unverified live socket/permission and native communication evidence; R6/R7 proposes existing-contract examples and failure guidance without schema change. Actual closed plans/handoffs are frozen together for round 2; shared-doc ownership is a review question, not presumed agreement.

Batch 2 round 2 handled at `59b41e0c` (agree under execution reservation) and `aa0353fb` (changes: B2-B-01). Bounded scheduling choice supplied to both authors: HV-IN combines accepted R6/R7 subcandidate and proposes its changelog entry; B2-IN exclusively owns final batch-2 shared docs/changelog and the full-union candidate after accepted HV-IN/R4/R5 inputs and prior shared-doc predecessor. Refresh/preserve prior entries and retain exact union checks/review. Disjoint preparation stays independent. Authors must accept/reject with reasons.

Batch 2 round 3 handled: both accept/apply B2-B-01 and the shared single-writer/subcandidate rule, with no arbitration question. Revised plans are reliability `0588d563` / SHA256 `9476eb2d9b770cef722f185976de85d0ced6fa0901a4c14538fff791e1576998`, coordination `36716b46` / `d76836f6822ba8a00dac8b561e2edd3ecf4b56dea925fb6c3c314512e30bd876`. Actual plans/handoffs/correction reports frozen for round 4.

Batch 2 round 4 handled: both agree on the exact corrected digests/revisions; no consequential regression or arbitration question. All batch-2 artifacts exported without changing owner inputs. Native/permission/behavioral/publication holds remain future execution gates.

Common batch-3 planning ownership: feature units own their specific source/skills/roles/evals and propose shared root entries. Existing-role integration Implementer C-IN alone owns justified root metadata/catalog and shared-doc edits after accepted prior shared-doc and named feature inputs. Refresh/preserve prior entries, full union checks and independent review; no new role/service or release authorization. Both assignments receive the same rule and may substantively challenge it.

Batch 3 independent handoffs handled at `283c03c9` and `e15e280a`: both complete, clean and validated. Actual plans/handoffs frozen for combined review; C2 native help/version crash is an execution hold, not a Ruach diagnosis. Round-2 report identities remain unhandled. Batch 4 waits for agreement/arbitration.

Batch 3 round 2 handled at `9cd5a7ec` / `a124d3f6`, both changes. B3-A-02/B3-B-02 require explicit eval typechecks and C-IN CI ownership; B3-A-03/B3-B-01 require matching Coordinator-only workflow-body boundaries; B3-B-03 separates assistance from answer access. B3-A-01/B3-B-04 identify a root assignment error: actual coordination plan/Git blob/handoff is SHA256 `67a9e33a64c6218324aeb2030312c4cd8911b5ba7bbad93d1bd31f6451b5e294`, not the earlier draft digest written in round 2. Frozen inputs remain correct; historical assignment stays unchanged. Correct identity supplied in round 3. No present arbitration question; both actual closed reviews distributed for narrow corrections.

Batch 3 round 3 handled at `dc8a4a41` / `2de675bc`: every required argument accepted/applied or retained as peer-owned exact-review check, no arbitration. Corrected plan digests `e964514692697c011569d49bb92d0a9fa800958020f125bdcfde14912b01eb12` / `2c7742304bfe34cde4b26716f064e1b4421b9352fbba89ce3a1a67686bf61ac2`. Plans/handoffs/corrections frozen together for round 4. Both clean, committed, validated. Exact-pair report identities unhandled.

Batch 3 round 4 handled at `44238ee564b03fa2603058ecb1640899e8f6cf0e` / `7d963731694224d69aafe8ce7fd3160dccf3b34d`: both agree on exact corrected pair, all necessary findings resolved, no arbitration. All plans/assignments/reports exported without modifying owner inputs. Batch 4 independent round 1 assigned next: reliability comparative pilot/harness-eval, coordination usage definitions/script and Librarian packets. Common M-IN sole shared-root owner after accepted predecessors/definition inputs; minimal usage contract before pilot execution; no new runtime/catalog, no paid subjects or implementation.

Canonical verification after batch 3 import: `just check` passed (identities/eval placement/relative links and pinned typecheck); all 24 actual handoff/review/correction reports validated with explicit canonical `--repo`; root `bun run test` passed 90 tests, 0 failures. Original input hashes remain unchanged. No implemented-feature/native/hosted/behavioral claim follows from these checks.

Batch 4 independent handoffs handled at `ea9971a21de4d72a252137ac59dd6e7b06dc56d4` / `9576f9999e4afae411a6dba1a496b94ac93abc11`: both clean, committed and mechanically validated. Exact frozen plan digests `e41b494d959124402745aa2a4e659010eecdbb4d01276c58d2efb93e14834df8` / `1726a85b1102d371980df4c85b345d6dd79d074548fc02f6f63c8ff97cc776a0`. Read-only source inspection found no supplied analyzer/original audit cohort in inspected locations, without claiming global absence. Actual closed pair sent for round2 combined review; report identities unhandled.

Batch 4 round2 handled at `07f5b608` / `0ea7f9b0`, both changes. B4-A-01/B4-B-01 align coordination's restrictive M-IN CI row to accepted comparative/Librarian packet recipes; B4-A-02 replaces executable-based polling exclusions with evidenced pending-target/context classification and opposing controls. Shared test ownership stays explicitly bounded/amendment-based. Both actual reports exchanged for round3 correction/disposition; no current substantive arbitration position. Reliability need not cosmetically change an already compatible plan.

Batch 4 round3 handled at `19ad64837a728cac70fb50a213957368e02381c8` / `c4473dde753df22cf121525b7a531cf142eb6084`: all arguments accepted/applied, no arbitration. Exact corrected digests `5f4cd47dc71be4b82dc522f73a8440f0eb6e423798a20ff9eb35974b6f997447` / `c360cfc2a921d96e52528fce49617c55a8f6dabd1544125ee8ca052af358329e`; actual plans/handoffs/correction reports frozen together for round4. Both clean/committed/validated; exact-pair report identities remain unhandled.

Batch 4 round4 handled at `52eb223b8225687a8c55e6d4142e442c8a922c79` / `faab313697909252e69ad6a3c59e67e715b04769`: both agree on exact revised M1 pair; all required findings resolved, no arbitration. Final plans/assignments/handoffs/corrections/reviews exported to canonical checkout. All four planning batches closed in round4. Eight detailed plans cover 13 active packages; no implementation, native subject, paid pilot, route mutation, publication or owner decision was performed.

Final task state: complete. All 32 handoff/review/correction reports handled and validated with canonical --repo; all four exact pairs agree. Eight plans plus their 32 unchanged assignments and 32 reports are present in the canonical checkout, with this record and the index (74 files). `just check` and tracked `git diff --check` passed; root `bun run test` passed 90/90; handoff suite passed 28/28 earlier. New-artifact whitespace inspection found only the already recorded two historical batch-1 round-2 assignments' extra blank EOF; they remain unchanged as supplied evidence. No trailing whitespace or missing final newline was found.

Owned resources released: Herdr workspaces (two) (each one idle worker pane) closed successfully, then both clean sol-roadmap worktrees removed without force. Branches `ruach/sol-roadmap-reliability` at `52eb223b8225687a8c55e6d4142e442c8a922c79` and `ruach/sol-roadmap-coordination` at `faab313697909252e69ad6a3c59e67e715b04769` retained. Unrelated council worktrees/workspaces and their parent directory remain untouched. No launcher temporary directory existed. Task-owned `<planning-scratch>` is intentionally retained for frozen input/review provenance; no private native transcripts were copied into it by this planning task.

Final original-input SHA256 values match the binding frozen baseline. Main remains at the original source HEAD; only the owner's three original tracked edits and the new planning artifacts are present (plus unrelated worktree directory contents). No owner change was staged, committed, reset or overwritten. Worker-owned artifacts are committed on retained branches; canonical index/task record and exported copies are filesystem deliverables. No push/tag/publication or implementation was performed. Next work is selection and dispatch of a bounded unit from the accepted plans, with actual bases/resources/authority filled as specified.
