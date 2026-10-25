task: RUNTIME-REVIEW-01
status: complete
outcome: "No confirmed product defects in the two bounded runtime exercises; rejection/preservation and trace detection passed on the identified disposable builds."
reviewed_revision: 56540a6
readiness_evidence_revision: 02d3460
skill_revision: 90230d165f41b90969037fdf7cf93e1a85d69396
artifacts:
  - docs/assignments/c1-c5/RUNTIME-REVIEW-01.md
  - docs/reports/c1-c5/runtime-review.md
  - docs/reports/c1-c5/demo-artifacts/review/public-summary.json
  - docs/reports/c1-c5/demo-artifacts/review/pralice-input.txt
  - docs/reports/c1-c5/demo-artifacts/review/pralice-player-output.txt
  - docs/reports/c1-c5/demo-artifacts/review/ramec-saved-ui.png
  - /tmp/c15-runtime-review-01-WBC0gI
verification:
  - "Frozen source/build/tool/state provenance and final preservation audit: passed; 1,067 Ramec and 442 Pralice original files plus three build trees unchanged."
  - "Ramec restricted attempt: environment-blocked before listening, helper exit 1/server exit 134; original SocketException (13) log retained. Authorized isolated socket/browser execution: exit 0, eight checks passed."
  - "Pralice public insufficient-funds and positive legal-amount preview processes: exit 0. Trace-only follow-up: exit 0, sixteen cumulative checks passed; intact replay exit 0, legal tamper/truncation each exit 1 as required."
  - "Initial helper stopped on a JSON BOM after public CLI checks; full failure retained, no product failure claimed and no gameplay rerun needed."
  - "Host-context owned-process absence, report validator, assignment integrity and owned-document whitespace: passed. Full suites, rebuilds, listening and native Tester launch not run."
review:
  - "No blocking findings or product corrections requested. Source/output consistency, runtime observation, recorded-command replay and listening claims remain distinct."
discoveries:
  - "Retained Ramec already had an untracked .claude/settings.local.json before runtime work; its content was unread and unused. Both retained HEAD/status observations were unchanged afterward."
  - "The supplied final SDK contains only the corrected distribution scope; no user cache/settings were copied for this review."
blockers: []
products:
  music:
    repository: /opt/dev/ramec
    commit: 6f17044de0b46cedef51eb71c9816ce11b6a589a
    sdk: 10.0.110
  prototype:
    repository: /opt/dev/pralice
    commit: 3e15253ce542d259280b95ce2b9a3262040dc32c
    sdk: 10.0.401

# Runtime review result

No material findings in the frozen baseline evidence within its stated scope, and no confirmed product defects in the newly assigned risk boundaries. This was actual Reviewer runtime verification using the reviewed runtime-testing technical skill; no Tester role switch, workflow execution, worker/model launch, application correction or delivery occurred. The top-level reviewed revision identifies the baseline evidence in Ruach; the separately resolved consumer commits above identify the products, not Ruach revisions.

## Provenance and preservation

Read the readiness handoff at `02d3460` and baseline handoff/evidence at `56540a6` through Git objects. The committed manifest exactly matches the supplied manifest under `P=/tmp/c15-provision-01.6o1CPD`. Fresh Git archives of the two pinned consumer commits match the recorded archive digests; all 1,509 original regular files in the disposable sources match those archives before and after execution. Actual build trees also match the frozen manifest before and after:

| Artifact under P | Files | SHA-256 tree identity |
| --- | --- | --- |
| `ramec/src/server/bin/Release/net10.0` | 71 | `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0` |
| `ramec/src/client/dist` | 16 | `7202376ca12a52cc448a480fc6b471c88530afdbfe9918b262177d58d4957ef7` |
| `pralice/src/Pralice.Cli/bin/Release/net10.0` | 13 | `833be74c145a8d8acc6222d5eed42d8db58f74cdfc8b6d4023d54117bde70755` |

Tree identity uses the manifest's sorted file-hash/path lines, not an assumed reproducible build. Critical tool/configuration/lockfile and baseline artifact hashes match. Direct version probes returned SDKs 10.0.110/10.0.401 and Chromium 156.0.8078.4; Playwright Core is the supplied 1.64.0. The exact runtime skill and both references match `90230d1`. No build, restore, new dependency, unrelated installation or global configuration change was needed.

The original closed DB remains 421,888 bytes, SHA-256 `fb26dbdcafe4c3f6c01c8becee8287ea06fdeda0e8c84cd815c4cf4fe304ca5a`; its WAL/SHM/journal were absent before and after. The original hidden developer trace remains SHA-256 `c685111631c2e3d8b9b5241bb083df40ca991e41859bbde6909aa3de0034cd0f`. Only fresh DB/trace copies were used for runtime actions. Nothing from retained user runtime state was copied. The already corrected SDK directory names match its distribution-only scope record; the earlier accidental cache/sentinel copy is historical setup evidence, not something repeated here.

The initial preflight correctly detected a difference from the old clean-checkout premise: Ramec's HEAD still matches, but `git status` already reported `?? .claude/settings.local.json`. Its contents were never read, used or changed. Pralice remained clean. Both retained HEAD/status results were identical after observation. Initial preflight failure and its logs remain under `R/initial-preflight`, where `R=/tmp/c15-runtime-review-01-WBC0gI`.

## Music: explicit rejection preserves accepted music

Required experiences were actual HTTP rejection/retrieval and a fresh browser opening the identified built UI; UI export was a focused cross-component control. No listening experience was required. Ramec's working agreement protects saved-data/wire contracts and permits exact unchanged accepted-state assertions. `PerformanceEndpointTests.RenderingRejectsUnknownPerformanceFormats` establishes the supported historical-format rejection boundary; `PerformanceEndpoints.Handle` maps unsupported document formats to 422. The historical document came unchanged from the pinned source, not an invented source defect.

`R/music.ts socket-authorized` ran `P/tools/dotnet-10.0.110/dotnet P/ramec/src/server/bin/Release/net10.0/Ramec.Server.dll`, cwd `P/ramec`. Explicit configuration was `DOTNET_ROOT=P/tools/dotnet-10.0.110`, `Persistence__Path=R/state/ramec-socket-authorized.sqlite`, `Observability__SeqUrl=''`, `ASPNETCORE_URLS=http://127.0.0.1:0`, and `ASPNETCORE_ENVIRONMENT=Production`. Direct built-DLL execution uses no launch profile. CLI home, XDG directories and temp/profile output were isolated under R. Server PID 555461, browser PID 555591, UID 1000; actual endpoint `http://127.0.0.1:37743` is now stopped, not a reservation.

Observed transition, in order:

1. Health and public GET `/api/performances/1` plus `/document` returned 200 **before** the action. The document matched the preserved selected Performance digest `92c721c8f87a42bf26d3470295df983ae092668d965088adcff600bf2c34dd7d`.
2. POST `/api/performances/midi` with the historical `ensemble16` Performance returned 422 and `format.unsupportedVersion` at `/performance/versions/engine`, with message `Expected ensemble28.` This was an explicit supported rejection, not an HTTP failure guessed from a log.
3. Retrieve the same saved endpoints again: 200, byte-identical document digest and structurally identical saved response. The precondition was not captured after rejection.
4. Fresh Chromium context opened `/performances/1` at 1440×1000 CSS pixels, scale 1/zoom 1, dark mode. Same-origin assets matched six files from the pinned client build. Off-origin page requests were blocked; none was attempted. No API response was mocked and no page error occurred.
5. The real **Export MIDI** button downloaded the same selected 4,513-byte MIDI, SHA-256 `0d74406d0a293a295977878c6a9b6171a1b0107f4693a999094423ef4ef7424f`. This compares persistence/export of one selected result, not two generated melodies. The [actual UI capture](demo-artifacts/review/ramec-saved-ui.png) was visually inspected: Performance 1, 388 notes, eight bars and four Seats.

All eight checks passed. Original and closed disposable DB digests also match. Raw request, status/headers/body, before/after documents, asset observations, full server output and screenshot are under `R/music/socket-authorized/`. No generation, MIDI permission request, device connection, audition, synthesis, audio capture or listening occurred; score/MIDI observations establish none of those experiences.

## Prototype: player-visible rejection and replay detection

The default fresh in-memory scenario ran through `P/pralice/.tools/dotnet/dotnet P/pralice/src/Pralice.Cli/bin/Release/net10.0/Pralice.Cli.dll --scenario frontier-compact --actor crown --trace-file R/prototype/insufficient-hidden.jsonl`, cwd `P/pralice`, `DOTNET_ROOT=P/pralice/.tools/dotnet`. Full [input](demo-artifacts/review/pralice-input.txt) and [public output](demo-artifacts/review/pralice-player-output.txt) are retained. All player input used Crown's CLI facade. No perspective switch, hidden trace or opponent private state supplied a player/game-AI oracle.

Independent authority: the Frontier Compact guide states default Crown treasury 100 and requires advancing before final submission feedback. ADR 0002 distinguishes queued/resolved/rejected receipts and requires nonnegative atomic immediate transfers. These contracts imply that an unratified 150-unit outgoing transfer cannot debit Crown or publish the rejected proposal; unrelated local AI actions remain permitted.

Before submitting, public `status` showed day 0/Crown 100, `outcomes` was empty and `inspect prop-insufficient` was unavailable. Submit the recognition package with a 150-unit transfer: receipt was **Queued**, with no resolved outcome yet; day 0 treasury remained 100. After `advance 1`, `outcomes` reported **Rejected (InvalidEnvelope)** with `InsufficientFundsForImmediateTransfer`. Day 1 Crown treasury was still 100 and the attempted proposal remained unavailable. Other actors' delivered offers and Vale's new duty were visible, so this is preservation of the rejected action's ledger/proposal effects, not a claim that the whole world stayed unchanged. The public precondition precedes the action and advancement.

On separate trace copies, intact replay exited 0 and verified recorded-command outcome equivalence. For the tamper, only Crown's recorded transfer amount changed 40→41 in both the canonical payload and command data. A separate fresh public preview reported 41 feasible; the amount is positive and within the observed starting funds. Replay accepted the command far enough to detect a checkpoint mismatch and exited 1. Removing only the final completion record from another copy exited 1 with an explicit truncated-trace/missing-completion error. The observed divergence section was `proposals`; no assertion required that incidental section, internal IDs, checkpoint digest value or fresh AI choices. All replay inputs and the original trace retained their before/after hashes.

Sixteen cumulative prototype checks passed, including the public observations and technical replay controls. The initial helper failed after the first six public checks because it parsed a valid BOM-prefixed JSONL file without removing its BOM. Its source/output/exit 1 remain intact. A trace-only helper handled the BOM and completed; gameplay was not rerun or relabelled as a product failure. Developer traces remain raw technical-only evidence under R and were not committed or supplied as player observation.

## Baseline evidence and oracle review

Inspected the frozen handoffs, raw helpers, saved outputs, manifest, 30 baseline check records and 22 command receipts/full log digests. Those are evidence inspection, not new execution of the baseline suite. Initial DNS failures, invalid helper NuGet configuration, esbuild stop and digest-helper failure remain separate from their successful setup/corrected-helper runs. The exact esbuild cause stays unclassified rather than a proven product regression. The final distribution-only SDK and actual build/state were verified here, and the post-pruning reopen receipt is consistent with this new execution.

The MIDI decoder parses public standard bytes independently of the product renderer. Its 10,080-PPQN assertion is contract-based; MIDI/projection event membership and EndOfTrack-versus-`projection.playableUntil` assertions are **cross-output consistency**, not an independent proof of note-rendering correctness or the entire playable boundary calculation. The decoded terminal tick happens to be consistent with the documented eight-bar input, but the checker obtains its expected boundary from projection. The baseline report labels consistency and no listening appropriately; this review does not promote it into musical-quality or exhaustive serialization acceptance. No copied renderer algorithm, golden seed-selected melody or mocked-away public path was used here.

The baseline game arithmetic derives independently from the authored 100−40−20 and 25+40 contract, observed through explicit Crown/March perspectives. Its combined transcript is not a Crown-only observation packet. Replay proves recorded-command outcomes; it does not prove fresh AI-choice/memory equivalence. Delayed-recognition expiry remains excluded without selecting a rule or classifying that known authority conflict as a new defect.

## Verification dispositions and retained evidence

`R/common.ts` retains each subprocess argv, cwd, explicit environment, PID/UID, start/end, exit/signal, input/output digests and full stdout/stderr before display in `R/commands.jsonl` and `R/logs/`. Normal probes were bounded to 300 seconds; the server also had a 600-second cap. No command timed out. Source preflight details are `R/provenance.{stdout,stderr,json}`; final audit is `R/final-preservation.json`. Safe public results are committed in [public-summary.json](demo-artifacts/review/public-summary.json).

| Command/check actually performed | Disposition |
| --- | --- |
| `timeout 300s bun R/provenance.ts`, cwd this worktree; Git/archive/file comparisons, exact tool versions | Initial exit 1 on changed cleanliness premise, retained; corrected preflight exit 0, pinned disposable provenance passed. No product/global settings were changed to satisfy it. |
| `bun R/music.ts restricted`, cwd R, through recorded runner | Not verified: environment. Helper exit 1, server exit 134; actual `SocketException (13): Permission denied` before listening. No runtime goal passed in this attempt. |
| `bun R/music.ts socket-authorized`, cwd R, through recorded runner | Passed, exit 0, eight checks; one assignment-authorized socket/process/temp escalation after the actual denial. Original failure retained; no registered-flake authority applied. |
| Public CLI rejection and legal-amount preview commands above, cwd `P/pralice` | Passed, exit 0 each. Overall first helper exit 1 is an incomplete helper result due to JSON BOM parsing, not product acceptance or a consumer defect. |
| `bun R/trace.ts`, cwd R, through recorded runner; three exact `dotnet DLL --replay R/prototype/{intact,tampered,truncated}-hidden.jsonl` child commands | Passed, helper exit 0. Child exits 0/1/1 satisfy success/detection contracts; sixteen cumulative checks passed. |
| `bun R/final-audit.ts`, cwd R, host context | Passed, exit 0: all original source/build/state preserved; SDK scope matched. `ps -p 555461,555591 -o pid,ppid,uid,comm` exited 1 with header only, the expected absence result. Owned browser closed and server exited 0 through their handles; no PID kill or foreign-resource cleanup. |
| Own handoff validator `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/runtime-review.md --repo /opt/dev/ruach-worktrees/c15-review`; staged owned-doc `git diff --check`; assignment SHA comparison | Passed, exit 0; receipts `report-validation`, `owned-diff-check`, `assignment-integrity` under `R/logs/`. Assignment digest `8c7887e98baec569a7ddc42404109563f244e42a7c51c1d6b1c59eca7709b092`. |
| Whole Ruach/consumer suites, rebuilds, native Tester launch, listening, graphical/multiplayer/balance exercises | Not run; outside this assignment. No pass or broad capability claim inferred. |

No product finding requires confirmation or correction from this bounded result. The smallest next step is Coordinator disposition of these specific non-listening/runtime findings-only goals; any broader exercise needs its own goals/capabilities and a separate assigned Tester. A real correction-loop demonstration remains unperformed because no genuine defect was established here. Any later new finding needs separate independent confirmation, an authorized Implementer correction, original-failure Tester retest and exact-candidate review. Do not manufacture a defect to fill that chain.

Retain original baselines and all isolated DB/trace copies/raw failures under R; only the small public summary, Crown transcript/input and UI capture are committed. Original processes were not reused; owned server/browser are stopped. Coordinator retains authority over native session/worktree/evidence retention. This review does not close the final combined Ruach feature, council, listening or real-product correction/delivery acceptance gates.
