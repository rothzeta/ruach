task: DEMO-SCOUT
status: complete
outcome: Selected committed Ramec music and Pralice CLI sources; browser capability proved, product runtime and listening remain held.
artifacts:
  - docs/assignments/c1-c5/DEMO-SCOUT.md
  - docs/reports/c1-c5/demo-readiness.md
candidate_revision: 2b693cd72bf39c29575841a88d9c7ae719a29715
verification:
  - "Source inventory and 53 committed-file reads: exit 0; both selected original checkouts clean."
  - "Committed archives and fixture SHA-256 manifests: exit 0; no consumer source changes."
  - "Browser capability probe: sandbox exit 1 (listen EPERM); one authorized socket retry exit 0."
  - "Pralice disposable doctor: exit 1, repository-local .NET SDK missing; gameplay not run."
  - "Ruach just check: exit 127, resource/link check passed but tsc missing."
  - "Ruach bun run test: exit 1, 87 pass and 21 fail; missing dependencies and socket restrictions recorded."
review: not-run
discoveries:
  - "Ramec audition sends Web MIDI; browser synthesis/capture capability does not supply a connected MIDI instrument or listening evidence."
  - "Pralice is a real CLI political prototype; its Godot host and production saves are outside the implemented slice."
  - "Pralice delayed-recognition guide conflicts with an existing expiry test; resolve expected behavior before classifying a runtime outcome."
blockers:
  - "Later gameplay requires Pralice's pinned disposable toolchain; installing or substituting tooling was outside this assignment."
  - "Music listening requires an authorized MIDI output/instrument and audio capture/listener; none was established."
  - "Ordinary sandbox cannot bind sockets; the successful browser probe used the single assignment-authorized escalation."
sources:
  music:
    path: /opt/dev/ramec
    commit: 6f17044de0b46cedef51eb71c9816ce11b6a589a
    state: clean master tracking origin/master
    scope: Eight-bar RhythmAndLead generation, saved Performance and MIDI export
  prototype:
    path: /opt/dev/pralice
    commit: 3e15253ce542d259280b95ce2b9a3262040dc32c
    state: clean master tracking origin/master
    scope: Frontier Compact CLI negotiation and recorded-command replay
scratch: /tmp/c15-demo-scout-readiness.4Z8KlU
next_assignments:
  - Tester provisioned isolated sources and public runtime hunt
  - Implementer only after a genuine original failure and correction authority
  - Independent Reviewer including product authority and evidence limits

> Editorial portability view: machine-local evidence locations are literal paths. [Original snapshots and curation provenance](../releases/0.7.0/ci-portability.md) remain available; historical findings are unchanged.

Readiness investigation on 2026-10-25. Completion here means the bounded Scout investigation is complete. Neither consumer has been built, played, auditioned or listened to in this investigation. No consumer runtime defect is confirmed. No correction, council, model subworker, worker launch, delivery, merge, push or task-resource teardown occurred.

## Source selection and authority

All five candidates were inspected through root AGENTS/README and available package metadata. `git rev-parse --show-toplevel HEAD` and `git status --porcelain=v1 --untracked-files=all --branch` exited 0 in each canonical path. Porcelain returned only the branch header, with no tracked or untracked changes. This excludes ignored build artifacts, dependencies and local data from the meaning of “clean”; none of those are silently part of the selected revision.

| Canonical path | Committed SHA | Branch | Decision |
| --- | --- | --- | --- |
| `/opt/dev/enoch` | `ea3432e6cd188f3d4c7d45332969dc3ecbf17889` | main → origin/main | Agent-work publication service; neither requested product type. |
| `/opt/dev/eden` | `ed2afdd5639c8f64a589aae090f0516aa64f1123` | master → origin/master | Estate coordination; no suitable application. |
| `/opt/dev/boaz` | `d21c386ca690ebe1e14310c16b99e2e988c365a5` | master → origin/master | Infrastructure convergence; no suitable application. |
| `/opt/dev/ramec` | `6f17044de0b46cedef51eb71c9816ce11b6a589a` | master → origin/master | Selected music software. |
| `/opt/dev/pralice` | `3e15253ce542d259280b95ce2b9a3262040dc32c` | master → origin/master | Selected playable CLI prototype. |

No deeper application/test investigation was performed on the rejected candidates. No estate/service credentials, production state, personal sessions or retained servers were inspected.

Ramec authority is AGENTS.md (`/opt/dev/ramec/AGENTS.md`), accepted direction in CONCEPT.md (`/opt/dev/ramec/docs/CONCEPT.md`), and the first Writing procedure in PLAYER-ARCHITECTURE.md (`/opt/dev/ramec/docs/PLAYER-ARCHITECTURE.md`). It is an offline, score-first band generator with MIDI as its primary exported product. The bounded target is its supported eight-bar `RhythmAndLead` Composition for two standard-tuned Guitars, Bass and Drums. `FixtureCatalog.Fixtures` identifies `rhythm-and-lead` and `rhythm-and-lead-fast`; begin with Moderate. Do not choose a long historical benchmark or arbitrary fixture merely because it appears in the catalogue: catalogue availability does not prove Writing support.

Ramec's contract requires real controls/state, visible capability failures, preservation of saved contracts and no fallback. Generated music is not a golden fixture, and independently generated sessions are explicitly not the oracle. Its ADR 0005 (`/opt/dev/ramec/docs/adr/0005-review-gates.md`) makes musical review and the owner's rulings material to later musical changes. A council recommendation cannot authorize architecture, a save-format break or a reset. This investigation needs none of those changes.

Pralice authority is AGENTS.md (`/opt/dev/pralice/AGENTS.md`), the whole-game reference (`/opt/dev/pralice/docs/architecture/game-architecture.md`), ADR 0002 (`/opt/dev/pralice/docs/architecture/0002-first-playable-slice.md`) and the Frontier Compact guide (`/opt/dev/pralice/docs/scenarios/frontier-compact.md`). The bounded target is a human Crown negotiating the documented 40-unit recognition bargain with actual local game AI, then observing domestic consent and a later protection payment. This is playable political interaction, not merely an assembly smoke test. Its CLI is the implemented human adapter; a graphical game would require a different readiness outcome. No Godot project, production save format, database or multiplayer is implemented by this slice. Human/AI action and information parity, actor-scoped observations and centrally approved architecture remain requirements. Design history and imported council advice are not substitute authority.

## Build and runtime dependencies

| Product | Stack and supported commands | Current capability and limits |
| --- | --- | --- |
| Ramec | C#/.NET 10 ASP.NET, SQLite, Vue 3/TypeScript, Vite 6, Bun 1.4.2, Vitest/xUnit, Playwright Core 1.64.0. `global.json` pins SDK 10.0.110 with roll-forward disabled. Use `just --list`, `just install`, `just build-client`, `just build-dotnet`, `just server`, `just client`; `just test-project Ramec.Band.Tests <filter>`, `just test-project Ramec.Server.Tests <filter>`, `just test-client`; implementers use `just check`. | Installed Bun is 1.4.2; `bin/run-dotnet --version` is 10.0.110. Retained `node_modules` and `dist` exist, but their build/source provenance was not established and they were not copied or served as the selected product. Node is absent from PATH. No clean-copy dependency restore or build was attempted, so successful client/server startup remains unproved. |
| Pralice | .NET 10 Core/Scenarios/Runtime/AI/CLI; MSTest; Bun task runner. `tools/toolchain.env` pins .NET 10.0.401, Bun 1.4.2, Godot 4.7.2 stable. Supported `bash tools/run doctor`, `build`, `test`, `check`, `run -- --scenario frontier-compact --actor crown --trace-file <path>` and `run -- --replay <path>`. | Retained `.tools` absent. Disposable `timeout 300 bun tools/tasks.ts doctor` exits 1: `Repository-local .NET SDK is missing. Run the repository bootstrap first.` Only installed SDK 10.0.110 was listed. No 10.0.401 provisioning or global/native substitute was attempted. |

Ramec's `just install` installs client dependencies and Chromium; Pralice's `tools/run` can automatically invoke bootstrap when its local Bun is missing. These are supported setup commands, **not actions authorized or executed here**. The doctor was invoked directly with the matching installed Bun specifically to avoid automatic bootstrap/install. Later assignments must explicitly supply an isolated pinned toolchain and dependency-cache policy before using the canonical wrapper. Godot's version check in Pralice doctor is a tooling gate, not evidence of a graphical game.

Ramec source entry points: `Program` requires `Persistence:Path`, initializes `PersistenceStore` and maps `/health`, Composition, Performance and saved-document endpoints. `PerformanceEndpoints.MapPerformanceEndpoints` exposes generation, projection and MIDI POSTs; `SavedEndpoints.MapSavedEndpoints` exposes saved JSON and candidate MIDI/projection. SQLite is initialized at the configured full path. `ObservabilityOptions.HasSeq` treats nonempty `SeqUrl` as enabled: shipped configuration points to `http://localhost:5341`. `vite.config.ts` proxies `/api` to `http://localhost:5000`. **Neither default may be used for this task:** they could reach retained services. See isolation below.

Pralice source entry points: `Program.Main`, `CliHost.Run`, `FrontierCompactScenario.LoadByName`, `MatchTraceRecorder` and `TraceReplayRunner.RunReplayFromFile`. CLI input can be scripted through stdin and stdout/stderr retained without a browser/server. Trace files are developer diagnostics with authoritative hidden state; they are not actor observations or production saves.

## Exercised environment capabilities

The browser probe was a small disposable environment page, not either consumer. Its source is browser.ts (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.ts`). First execution failed before creating a listener with `EPERM: operation not permitted, listen`; original result (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.initial.json`) and stdout/stderr remain intact. One explicit sandbox escalation, allowed by this assignment for socket limitations, reran the same probe. It exited 0. There was no model/native/provider fallback or security-dialog answer.

| Boundary | Observed evidence | Meaning for later work |
| --- | --- | --- |
| Chromium + Playwright | Existing executable `$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome --version`: Google Chrome for Testing 156.0.8078.4. Playwright package 1.64.0 loaded with Bun. Browser reported the same version. | Browser is available; version and path were verified rather than inferred from the cache directory. No dedicated browser/computer-control connector was exposed; local Playwright is usable. |
| Loopback ownership | Probe requested `hostname: 127.0.0.1, port: 0`; assigned `http://127.0.0.1:34799/`, PID 467505, UID 1000; child Chrome PID 467520, same UID. Navigation returned 200. | Permission-sensitive; later processes need their own socket authorization. The old endpoint is stopped and must not be reused. |
| Input/logs | `pressSequentially('scout-42')` produced the matching public output and console events; a role-selected button click started recording. No page error was observed. | Keyboard, pointer click, page console and page-error collection work. No product controls have been exercised. |
| Screenshot | browser-capability.png (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser-capability.png`), visually inspected; SHA-256 `39f1a3c5ed08eef1d5af0252cd65fecc7b237c22b901bc51d2876ee38b95b035`. | Screenshot acquisition and inspection work; this image contains only the synthetic capability page. |
| Web MIDI | Secure localhost context; `navigator.requestMIDIAccess` exists, permission queried as `prompt`. | Permission was not granted or answered; outputs were not enumerated. A connected MIDI output is unestablished, not conclusively absent. |
| Audio capture | Browser AudioContext ran at 44,100 Hz; a synthetic oscillator routed only into `MediaStreamDestination` yielded 3,194 bytes through `MediaRecorder`, `audio/webm;codecs=opus`. | In-page synthetic stream recording works. Audio bytes were measured, not retained as a listening artifact. This is neither Ramec audio nor physical output capture. |
| Physical output/listening | Browser `enumerateDevices()` returned `[]`; `/dev/snd` absent; no DISPLAY or WAYLAND_DISPLAY reported. `ffmpeg`, `ffprobe`, `pactl`, `parec`, `pw-record`, `aplay`, `arecord`, `fluidsynth`, `timidity`, Xvfb were not found on PATH. No local listening tool exposed. | Physical audio, DAW/synth output, system loopback capture and listening remain held. Empty prepermission enumeration alone does not prove that no hardware could ever be attached. |

`useMidiOutputs.requestMidi` requests Web MIDI, filters connected outputs and reports missing devices without substitution. `createAuditionController` sends timed messages to a supplied MIDI output; no synth/audio-renderer was found in that inspected audition path. Thus a successful generic Web Audio recorder cannot make the music demonstration audible. A later musical review must receive the actual generated score/MIDI and, for a listening claim, actual rendered audio plus someone/tool capable of hearing it.

Probe cleanup used `browser.close()` and `server.stop(true)` on owned handles only. A subsequent `ps -p 467505,467520 -o pid,ppid,uid,comm` returned no process rows (exit 1); no retained process was stopped. Archives, reports, task worktree and scratch evidence remain.

## Disposable sources, state and provenance

Scratch evidence root `S=/tmp/c15-demo-scout-readiness.4Z8KlU` already contains `ramec/` and `pralice/`, extracted solely from the exact selected commits using `git archive`. There is no `.git`, ignored state, dependency tree or retained build output in those archives. `git archive --format=tar --output=$S/NAME.tar SHA`, then `tar -xf NAME.tar -C NAME` exited 0. Archive SHA-256 values:

| Archive | SHA-256 |
| --- | --- |
| `ramec.tar` | `1c42adc97769db6636468cce40e208507d0b0848f21c41fd441fa39113eb406f` |
| `pralice.tar` | `0811e22e16ab381a751f4b58ffa6e625fd6d0230f3e54e10dc129f00de0c4c8c` |

Initial tracked inputs, measured from those extracted archives with `sha256sum` (exit 0):

| Product-relative path | SHA-256 |
| --- | --- |
| Ramec `src/client/bun.lock` | `adf0a5bbbeaaf0f5cc67159cf21f9134290a8a8772c0466903f6965e08ea5cc1` |
| Ramec `src/client/src/fixtures/composition/songs/rhythm-and-lead.json` | `93374c8fe07a361f34af92b553fffd5c3418280ce66c2f26e3d2b8e0dd729a5c` |
| Ramec `src/client/src/fixtures/composition/songs/rhythm-and-lead-fast.json` | `ce4e951b8d603b8c0618373d105796b743f70f16607eee895f775df6d54dfce8` |
| Pralice `tools/toolchain.env` | `d47c66e1c7262c08e80ac852f1198748b1caaabbba785d603fe432e3acdeb375` |
| Pralice `src/Pralice.Scenarios/Data/frontier-compact.json` | `5de0cd13d8482878597066aa9ec67bd3381dd726cc7d4073770669544096726a` |
| Pralice `src/Pralice.Scenarios/Data/frontier-compact-delayed-reports.json` | `4a3f535f91121ad9f1f38991ead74eb8dec9e02635ce6c8a251a343f1d85370f` |
| Pralice `src/Pralice.Scenarios/Data/frontier-compact-low-liquidity.json` | `e11003263e181c53a7aab9388ca66ca216ebdfb5155564eecb5582ebf0aac580` |

Later Tester/Implementer should create fresh unique `/tmp/c15-demo-<task>-<random>/{source,state,artifacts,profile,cache}` roots. For patch work use `git clone --no-hardlinks --no-checkout /opt/dev/NAME <root>/source`, then detached checkout of the recorded SHA, subject to that later assignment. Keep origin local/read-only in practice; do not push. Recheck original status and SHA first; report later changes rather than silently copying a dirty tree or advancing the baseline. Archive inputs above remain an independent reference.

Ramec state must begin with a nonexistent `<root>/state/ramec.sqlite`, explicitly set by `Persistence__Path`; document that initial empty provenance, then hash the closed SQLite file and any retained sidecars after reproduction. Do not read/copy/delete a retained database. Disable the external Seq sink with `Observability__SeqUrl=''` and keep diagnostics in owned stdout/files. Set `ASPNETCORE_URLS=http://127.0.0.1:0` and use the `just server` recipe's `--no-launch-profile` behavior, reporting actual bound endpoint/PID/UID. Prefer same-origin freshly built UI served by ASP.NET. The default `just client` proxy is unsuitable: if Vite is needed, its proxy target must be supplied through an explicitly authorized disposable configuration; do not silently edit it or target port 5000. Never use plain `localhost:0` for Kestrel dynamic binding; specify loopback IP.

Use fresh browser contexts/profiles with no storage state, prohibit off-origin requests, and record viewport/version/input script plus exported source Performance, projection, MIDI and hashes. No remembered MIDI device may be silently replaced. Runtime processes may bind only owned loopback port 0; record every actual endpoint and owner and close only owned handles/PIDs. The normal sandbox socket failure remains relevant despite the successful escalated capability probe.

Pralice starts a fresh in-memory scenario per CLI process. Record scenario JSON hash, embedded seed/content hash, actor, command script and full outputs. Keep trace and replay files under owned `artifacts/`, with digests before and after replay; trace is not a save. Never give hidden trace state to a player/game AI as eligible evidence. Put .NET CLI home, NuGet/Bun caches and any temp outputs under the new root; toolchain provisioning must preserve pinned versions and be separately authorized. No database/profile/saves need copying for this slice.

## Small runtime hunt and independent public oracles

These are recommendations for later execution; none is reported as passed. Restrict the first hunt to one Moderate eight-bar music example and one fresh default game scenario, adding the identified boundary cases only after those work. Preserve original failures verbatim; no bug needs to be found to make the demonstration valid.

| Risk and public exercise | Product requirement / independent oracle | Useful existing coverage to consult, not substitute for execution |
| --- | --- | --- |
| Ramec: generate supported fixture, save/reopen Performance, export MIDI and projection from that same selected result. | CONCEPT's exact 10,080 ticks per quarter and saved selected music preservation. Decode exported MIDI independently of production rendering; compare saved note channel/key/onset/release/velocity and saved tempo with decoded output under documented articulation semantics. Drums channel 10 encodes nibble 9; all tracks end at declared playable boundary. Determine expectations from a controlled known-input saved result and the contract, not a newly generated melody snapshot. No golden seed winner or cross-generation equality. | `StandardMidiFileTests.DefaultDrumChannelIsSavedAsTenAndExportedWithNibbleNine`, `HeaderAndSeatTrackHaveKnownMidiBytesAndAllTracksEndAtPlayableUntil`; `MidiProjectionTests.AllReleasesPrecedeAttacksAndSavedOrderBreaksEqualTickTies`; `WrittenExecutionTests.RecallUsesSelectedWrittenSourcesAndCarriesClaimsThroughCommitAndReopen`. |
| Ramec: invalid import/unsupported Performance, then re-open the previously accepted saved result. | Rejection is explicit and leaves accepted data unchanged. Original accepted document hash/public retrieval supplies the before/after oracle; an old engine format must not silently migrate. Do not corrupt the original DB or manufacture a planted source bug. | `PerformanceEndpointTests.RenderingRejectsUnknownPerformanceFormats`; `WrittenExecutionTests.AProcedureWithoutItsRelationshipCannotChangeAcceptedMusic`. The latter is a domain boundary, not proof of UI rejection. |
| Ramec: seek/stop and device loss, only after a real output is available. | Recorded MIDI receiver timestamps relative to playback origin and observed releases establish ordering/cleanup; permission/missing-device states remain visible. A fake output can test a narrow contract but cannot prove audible playback. Independently inspect note lengths, register, repetition and instrument idiom under ADR 0005. Listening remains held until real audio is heard. | `audition.test.ts` cases for equal-tick ordering, queue cleanup, missing devices and disconnect; many use controlled clocks/test outputs. `spaBrowser()` intercepts API routes: its screenshots/tests alone are not a real-server generation demonstration. |
| Pralice: default Crown script from Frontier Compact guide: `status`, `cases`, `commitments`, recognition preview, `propose prop-recognition case-westbank march transfer:crown:march:40 recognize:march:westbank-claim`, `advance 3`, inspect proposal, inspect reports, switch to March, `status`, quit. | The authored scenario/guide supplies initial balances, required Crown/March/Council consent, recognition and the independent ledger arithmetic: Crown 100 − 40 bargain − 20 Vale duty = 40; March 25 + 40 = 65, after appropriate delivery. Observe actual consent/ratification and both transfers; do not infer human comprehensibility or enjoyment from balances alone. | `CliHumanAiBargainTests.CliHumanCrownBargainsWithAiActorsAndAchievesRatification`. |
| Pralice: delayed information and insufficient funds, in separate fresh sessions. | Actor cannot use undisclosed recognition/revision before delivery, cannot see exact foreign treasury/outcomes, and cannot enact an underfunded package. Queued is not resolved. Use public preview/errors and next-boundary actor outcomes with unchanged accepted state on rejection. Expected delayed recognition **final status is held**, pending conflict resolution below. | `CliRevisionBindingTests.MissingKnownEvidenceProducesSpecificUnavailablePrerequisiteWithoutSubmittingCommand`; `CliSubmissionOutcomeTests.HumanSeesOwnTypedFailureAtNextBoundaryWithoutForeignTreasuryOrOutcomes`. |
| Pralice: retain a fresh trace and replay it; then replay a separately copied, legally changed transfer trace and a truncated copy. | CLI promises recorded-command outcome equivalence: intact recording must reproduce authoritative outcomes/checkpoints. A meaningful altered command or incomplete recording must not be accepted as the same completed execution. Preserve original trace and compare digests; do not freeze a particular divergence section or assume replay reruns AI decisions. | `TraceReplayTests.ValidV3RecordingReplaysSuccessfullyWithMatchingCheckpointsAndOutcomes`, `AmountTamperPreservingCommandValidityIsDetectedAtFirstAffectedCheckpoint`, `TruncatedTraceMissingCompletionFooterThrowsTraceValidationException`; `CliGateTests`. |

The actual playable interaction should also include a brief player account: what bargain was chosen, why consent was needed, what was understood about the later duty, and where feedback was confusing. That is product observation, separate from a rules defect or graphical-usability claim.

## Findings classification and correction gate

**Observed environment limitations:** socket `EPERM` on the original browser attempt; missing Pralice local SDK; no proven MIDI output/listening; Ruach dependency/socket check failures below. These are not consumer bugs and are not a manufactured correction loop.

**Verified source-supported concern:** the Frontier Compact guide's delayed-reports row promises ratification after publication at day two and advancement to day eleven. At the same selected SHA, `CliHumanAiBargainTests.DelayedScenarioRecognitionPreviewWaitsForEvidenceAndDefaultMenuExpiresBeforeDomesticConsent` expects Expired at expiry day six, with March but no Council approval, no recognition and Crown 80 from only the separate duty. `CliHost.PrintHelp` describes default observed-day + 4; proposal parsing uses `observation.ObservationDay + 4`. The current test is evidence of conflicting expectations, not an independent authority that overrides the guide. Request a product/maintainer decision on default expiry versus delayed consent; then reproduce against that agreed contract. No code/test change is authorized by this finding.

**Another source documentation discrepancy:** the guide's trace section says v2; `MatchTraceRecorder` requires/emits v3 and `TraceReplayRunner` explicitly rejects legacy input. Later evidence must name the actual recorded version. Do not relabel this discrepancy as a replay runtime failure.

**Known limitations, not new reproduced defects:** the guide records incomplete case reconstruction for some non-initiator/late-invitee reports and an unresolved initiator-decline policy. The prototype's lack of Godot, production saves, balance validation and cross-platform evidence is explicit. Musical quality concerns require actual selected notes and qualified review, not extrapolation from source or historical review complaints.

**Observed/reproduced consumer runtime defects:** none. **Suspected/product observations:** no fresh gameplay/listening session occurred; understandable consequences and instrumental plausibility remain unanswered. **Not exercised:** either consumer's builds/tests/runtime, real backend/UI integration, MIDI permission/output scheduling, audio rendering/listening, full musical review, graphical gameplay, production persistence, multiplayer and non-Linux platforms.

A later Implementer must receive a genuine original public failure, exact committed source/build, authority for expected behavior, input/state/seed/digests, original output and environment. On an authorized disposable correction, retest **that same failure** against the corrected copy with the same starting state and then the small adjacent invariant set. The delayed-guide conflict is a candidate for clarification/reproduction, not a preassigned failing behavior. There is presently no original consumer failure to declare corrected. Do not patch tooling restrictions or create a synthetic bug to fill this gap.

Recommend later Ruach-owned durable evidence under `docs/reports/c1-c5/demo-<tester|implementer|reviewer>.md` and, when explicitly assigned, `docs/reports/c1-c5/demo-artifacts/<case>/` for sanitized command scripts, before/after patch, original reproduction, source/build hashes, logs and media references. Never write these into retained consumers as a side effect. Raw developer traces containing hidden state, dependency trees, caches and large private media stay in task scratch until the Coordinator assigns safe durable retention. These future paths are recommendations, not newly owned writes.

Independent Reviewer must assess: agreed authority and conflict resolution; whether the original failure is genuine and reproduced; whether unchanged public repro passes after correction; preservation of rules/information/saved-data contracts; patch scope and state isolation; independently derived assertions rather than copied production answers; honest source/build provenance; and the difference between structural validation, tests, actual play and listening. A change to what the Band writes also needs the project's musical architectural/review gates; neither a passing MIDI parser nor council agreement substitutes for musical review.

## Council questions and first-round access

Do not run a council as part of this handoff. Useful actual questions:

1. **Ramec:** Does this exact eight-bar selected Performance, with its exported MIDI and eventual real rendered audio, give distinct and idiomatic rhythm/lead Guitar, Bass and Drums parts while preserving selected music through execution? Ask a guitarist/arranger, bassist/drummer and independent MIDI/timing reviewer for separate first-round evidence and disagreements. Present the selected notes and accepted owner contract; do not ask them to endorse a proposed fix or a preferred seeded melody.
2. **Pralice:** Can a Crown player understand the recognition bargain, Council consent and Vale obligation using only Crown's eligible CLI evidence? For delayed reports, is default expiry intentionally allowed to preclude consent, or does the guide specify a supported successful bargain requiring a different expiry? Ask a player/usability reviewer, game-rules/information-boundary reviewer and simulation/replay reviewer independently. Their advice must distinguish a recommended design change from a defect under accepted rules.

First-round access facts now: selected source/contract files and fixture hashes are available; no actual generated music, product screenshot, audio/listening, CLI play transcript or current successful build exists in this investigation. The capability screenshot is not product evidence. A council member restricted to the supplied packet cannot claim filesystem, browser, MIDI device or hearing access it lacks. Provide minimal contract/source excerpts and later genuine artifacts with limitations labeled. Keep authoritative hidden game traces with the technical reviewer; player/game-AI perspectives receive actor-eligible views only. Withhold other members' answers and any intended verdict in round one; use later comparison to reconcile concrete disagreements. Do not launch council/model workers or choose a provider route here.

## Verification ledger and evidence lifetime

Commands were run from the named canonical repository, this Ruach worktree, or `S` as stated. Read-only `cat`/`sed`/`rg` discovery established candidate summaries and relevant selected members. For material source claims, sources.json (`/tmp/c15-demo-scout-readiness.4Z8KlU/sources.json`) records exact `git show SHA:path` argv/cwd/exit and file digests for 53 source/authority/test files; all exited 0. These committed-file snapshots avoid treating moving working files as the reviewed source. inventory.json (`/tmp/c15-demo-scout-readiness.4Z8KlU/inventory.json`) records exact identity/status/version/device probes; prepare.json (`/tmp/c15-demo-scout-readiness.4Z8KlU/prepare.json`) records archives, extraction, doctor and digest commands and original outputs.

Browser command, cwd this Ruach worktree: `timeout 60 bun /tmp/c15-demo-scout-readiness.4Z8KlU/browser.ts`; initial exit 1, escalated retry exit 0. Separate initial stdout (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.stdout`), initial stderr (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.stderr`), retry stdout (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.retry.stdout`), retry stderr (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.retry.stderr`) and structured retry result (`/tmp/c15-demo-scout-readiness.4Z8KlU/browser.json`) preserve evidence. The retry's only HTTP server was owned loopback port 0; browser used a fresh temporary profile and off-origin page requests were aborted.

Ruach checks, cwd this worktree, candidate base `2b693cd72bf39c29575841a88d9c7ae719a29715`, before report creation:

- `timeout 300 just check`: exit 127. Resource identity/eval placement/relative Markdown targets passed; `tsc` was not installed in this worktree. stdout (`/tmp/c15-demo-scout-readiness.4Z8KlU/ruach-check.stdout`), stderr (`/tmp/c15-demo-scout-readiness.4Z8KlU/ruach-check.stderr`).
- `timeout 60 bun run test`: completed in 14.79 seconds, exit 1, 87 pass / 21 fail across 108 tests. Typecheck exit 127; routing reports `Run bun install --frozen-lockfile in the skill directory`; waiting fixtures cannot `listen` on scratch Unix sockets (`EPERM`). These are unresolved check failures with setup evidence, not a demonstrated report regression. No installs, repairs or second escalation were attempted. stdout (`/tmp/c15-demo-scout-readiness.4Z8KlU/ruach-test.stdout`), stderr (`/tmp/c15-demo-scout-readiness.4Z8KlU/ruach-test.stderr`).
- No affected executable-skill suite: roles/skills/implementation/tests/configuration were unchanged. No consumer test suite, build or long performance suite was run.

Report-specific verification, cwd this worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/demo-readiness.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, candidate base resolved, no diagnostics.
- `bun scripts/check.ts` after report creation: exit 0, resource identities/eval placement/relative Markdown targets passed; behavioral quality untested.
- Final selected-consumer `git rev-parse HEAD` and `git status --porcelain=v1 --untracked-files=all --branch`: exit 0, unchanged selected SHAs and clean originals.
- Assignment `sha256sum`: exit 0, unchanged `f51040253c46c670c79c13d8b56cfb7cf3064a5f0000d07668315c3e3bb832bd`.
- `git diff --cached --check -- docs/assignments/c1-c5/DEMO-SCOUT.md docs/reports/c1-c5/demo-readiness.md`: exit 0; staged scope contains exactly the unchanged assignment and this report.

This report uses the actual preexisting Ruach base; it does not predict its own creating commit or imply the consumers' SHAs resolve in Ruach.

Scratch links are session-local evidence, not durable repository artifacts; the decisive facts, original failure text, source locations, exact input hashes and limitations are retained in this committed report. No availability after `/tmp` cleanup is promised. No task cleanup was performed.
