task: PROVISION-01
status: complete
outcome: Both exact-source disposable builds and non-listening functional baselines passed; reusable artifacts and original setup failures retained.
artifacts:
  - docs/assignments/c1-c5/PROVISION-01.md
  - docs/reports/c1-c5/demo-baseline.md
  - docs/reports/c1-c5/demo-artifacts/baseline/manifest.json
  - docs/reports/c1-c5/demo-artifacts/baseline/commands.jsonl
  - docs/reports/c1-c5/demo-artifacts/baseline/public-checks.json
candidate_revision: 02d3460caa3ddc08550ce8d150b0bcdaad786633
verification:
  - "Retained source identities/status rechecked; both clean at assigned SHAs before extraction and after observation."
  - "Pralice supported bootstrap and doctor passed with Bun 1.4.2, .NET 10.0.401, Godot 4.7.2 stable mono."
  - "Ramec frozen install, fresh client and Release server builds passed with Bun 1.4.2 and exact .NET SDK 10.0.110."
  - "Pralice canonical Release build passed with zero warnings/errors; default scripted play and intact trace replay exited 0."
  - "Ramec real health/UI, public generation-save-reopen, UI MIDI export and browser reload passed; owned server exited 0."
  - "Thirty bounded public checks passed, including independent MIDI decoding and scenario-derived ledger/consent assertions."
  - "Initial DNS, helper-config, restricted esbuild and digest-helper failures preserved; successful retries are distinguished below."
review: not-run
discoveries:
  - "Ramec Performance 1 is a real saved eight-bar Moderate result, displayed by freshly built UI; API and UI exports match."
  - "Pralice default bargain ratifies with council/crown/march consent; day-three actor views show Crown 40 and March 65."
  - "Pralice replay records version 3 and verifies recorded-command outcomes without modifying the original trace."
blockers: []
holds:
  - MIDI instrument connection, audition, audio rendering and listening remain unexercised and are outside this baseline goal.
  - Delayed-recognition guide/test expiry conflict remains unresolved and excluded from pass/fail assertions.
  - Independent review, broader risk hunt and any product correction remain unperformed.
tested_sources:
  music:
    canonical: /opt/dev/ramec
    tested_commit: 6f17044de0b46cedef51eb71c9816ce11b6a589a
    disposable: /tmp/c15-provision-01.6o1CPD/ramec
  prototype:
    canonical: /opt/dev/pralice
    tested_commit: 3e15253ce542d259280b95ce2b9a3262040dc32c
    disposable: /tmp/c15-provision-01.6o1CPD/pralice
scratch: /tmp/c15-provision-01.6o1CPD

Completed on 2026-10-25 under the unchanged [assignment](../../assignments/c1-c5/PROVISION-01.md), continuing the [readiness handoff](demo-readiness.md). This establishes real source/build/functional baselines for a later Tester. No consumer source, test, configuration, product behavior, launcher, route, global installation or retained server was changed. No council, external model/game-AI provider, engineering worker, merge, push, delivery or task teardown occurred. Game AI below is Pralice's compiled local game AI. There is no confirmed consumer defect and no correction claim.

## Exact source and build identity

Both retained sources remained clean on `master` tracking `origin/master`. Before creating copies and again after observation, `git -C /opt/dev/NAME rev-parse --show-toplevel HEAD` / `git status --porcelain=v1 --untracked-files=all --branch` exited 0 with the assigned SHA and branch header only. Ignored retained dependencies/builds/data were not adopted.

Fresh task copies were extracted from the previously identified committed archives into `R=/tmp/c15-provision-01.6o1CPD`. Neither copy has Git metadata. The archives were rehashed before extraction, unchanged:

| Source | Tested commit | Archive SHA-256 |
| --- | --- | --- |
| Ramec | `6f17044de0b46cedef51eb71c9816ce11b6a589a` | `1c42adc97769db6636468cce40e208507d0b0848f21c41fd441fa39113eb406f` |
| Pralice | `3e15253ce542d259280b95ce2b9a3262040dc32c` | `0811e22e16ab381a751f4b58ffa6e625fd6d0230f3e54e10dc129f00de0c4c8c` |

Commands: `mkdir -p "$R/ramec" "$R/pralice"`, then `tar -xf /tmp/c15-demo-scout-readiness.4Z8KlU/NAME.tar -C "$R/NAME"`, cwd this Ruach worktree, exit 0. A second independent extraction under `R/reference/` supplied regular-file comparisons after build/play: all 1,067 Ramec and 442 Pralice original regular files matched, including source, tests, configuration and lockfiles. Added dependencies and build outputs are outside that comparison. The [manifest](demo-artifacts/baseline/manifest.json) records source tree digests and zero changed original files.

| Built output under R | Regular files | SHA-256 tree identity |
| --- | --- | --- |
| `ramec/src/server/bin/Release/net10.0` | 71 | `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0` |
| `ramec/src/client/dist` | 16 | `7202376ca12a52cc448a480fc6b471c88530afdbfe9918b262177d58d4957ef7` |
| `pralice/src/Pralice.Cli/bin/Release/net10.0` | 13 | `833be74c145a8d8acc6222d5eed42d8db58f74cdfc8b6d4023d54117bde70755` |

Tree digest means SHA-256 of sorted `FILE_SHA256 + two spaces + relative path + LF` lines, regular files only. Full per-file manifests are `R/artifacts/{ramec_server,ramec_client,pralice_cli}-build-files.json`. These identify the actual builds; they are not promises of cross-root/cross-platform byte reproducibility. The top-level Ruach candidate revision is the existing report base, not a claim that either consumer commit resolves in Ruach.

## Provisioning and original failures

All source, dependencies, downloads, SDK copies, CLI homes, package caches, browser profiles, databases and logs are task-local. `R/run.ts` wraps each recorded command in `timeout --signal=TERM --kill-after=10 600`, records cwd/argv/explicit environment/timestamps/PID/exit and separate full stdout/stderr. The [command ledger](demo-artifacts/baseline/commands.jsonl) retains exact commands; raw original output is under `R/logs/ID.{stdout,stderr}`. No command timed out.

The environment helper sets `DOTNET_CLI_HOME=R/state/dotnet-home`, `NUGET_PACKAGES=R/cache/nuget/packages`, separate NuGet HTTP/plugin caches, `BUN_INSTALL_CACHE_DIR=R/cache/bun`, `PLAYWRIGHT_BROWSERS_PATH=R/tools/playwright`, task-local XDG config/data/cache and `TMPDIR=R/tmp`. Telemetry/first-use/workload advertising and MSBuild reuse are disabled through per-command variables. `RestoreConfigFile=R/nuget.config` selects an isolated public-feed configuration with cleared package sources and only `https://api.nuget.org/v3/index.json`. No credentials or trust policy were supplied to downloads/restores. No HOME variable or global setting was rewritten.

1. **Exact available binaries:** Bun 1.4.2 was copied into `R/tools/bun/bin/bun` and Pralice's `.tools/bun/bin/bun`. Ramec's already available exact SDK 10.0.110 was copied to `R/tools/dotnet-10.0.110`. An initial whole-directory SDK copy also included user-cache/sentinel state. Those 18 non-distribution entries were subsequently removed from the disposable copy without reading their contents; only SDK distribution files/directories remain. `R/artifacts/sdk-copy-scope.json` records that correction. The original global directory was untouched. The copied host's SHA-256 still matches the original (`55117d7d1f27537ee6e7a81b8b9f84f0b50c8cbd2d1d1e21684c31db1518230a`), `--version` still returns 10.0.110, and a post-pruning health/reopen probe passed against a copy of the baseline database. Do not repeat a whole user-directory copy when provisioning later tasks.
2. **Supported installers:** cwd `R/pralice`, `bash tools/bootstrap.sh`; cwd `R/ramec`, `env BUN=R/tools/bun/bin/bun DOTNET=R/tools/dotnet-10.0.110/dotnet just install`. Restricted attempts failed at DNS: `curl: (6) Could not resolve host: dot.net` and Bun `DNSResolveFailed`. Explicitly authorized network retries of the same commands both exited 0. No route/version fallback occurred.
3. **Pinned toolchain:** `bash tools/run doctor` in Pralice exited 0 and printed Bun `1.4.2`, .NET `10.0.401`, Godot `4.7.2.stable.mono.official.ed1daf0bf`. Its unchanged supported bootstrap installed `.tools/dotnet`, `.tools/godot` and `.tools/godot.path`. `R/tools/dotnet-10.0.110/dotnet --version` in Ramec returned `10.0.110`; its installed shared frameworks are .NETCore/ASP.NETCore `10.0.10`. No installed SDK was substituted for Pralice's different pin.
4. **Frozen client:** `just install` used the existing `src/client/bun.lock` with `--frozen-lockfile`; lock SHA-256 remains `adf0a5bbbeaaf0f5cc67159cf21f9134290a8a8772c0466903f6965e08ea5cc1`. Installed package versions include Vue `3.5.43`, Vite `6.4.3`, TypeScript `5.9.3`, vue-tsc `2.2.12`, Playwright Core `1.64.0`. The lock resolves the manifest's permitted ranges; none was manually changed.
5. **Helper configuration failure:** my first isolated NuGet helper used an invalid `<clear/>` inside `packageSourceCredentials`. Both initial .NET builds exited 1 with `Unable to parse config file ... Credentials item must have username and password`. Removing that entry from the task-only helper fixed setup; `R/nuget.failed.config` and original logs remain. Neither product configuration was changed. This was a helper failure, not a consumer defect.
6. **Fresh builds:** Ramec `just build-dotnet` and Pralice `bash tools/run build`, with corrected task feed configuration and network restore access, exited 0. Ramec reported `ok: build Ramec.slnx Release`; Pralice reported `Build succeeded. 0 Warning(s), 0 Error(s)`. These build test assemblies but do not execute test suites. Ramec's restricted `just build-client` exited 1 with esbuild `The service was stopped`; a supported process/temp-access retry of the same command exited 0, `ok: run src/client build`. The exact restricted-process cause was not established; no product fix was attempted.
7. **Play helper failure:** the first Pralice script reached product output, then my digest helper incorrectly passed an ArrayBuffer to `Hash.update`, causing helper exit 1. Its input/output/trace were copied intact to `R/artifacts/pralice-initial/`, and the faulty helper remains `R/prototype.failed.ts`. A corrected helper using Uint8Array ran a fresh process and recorded play/replay exit 0. Only that complete retry supplies the final baseline's process/replay claims.

Download provenance: Pralice used `https://dot.net/v1/dotnet-install.sh`, then `https://builds.dotnet.microsoft.com/dotnet/Sdk/10.0.401/dotnet-sdk-10.0.401-linux-x64.tar.gz`; supported installer output records 240,059,572 bytes and installed 10.0.401. Godot's supported URL is `https://github.com/godotengine/godot-builds/releases/download/4.7.2-stable/Godot_v4.7.2-stable_mono_linux_x86_64.zip`. Playwright fetched Chrome `https://cdn.playwright.dev/builds/cft/156.0.8078.4/linux64/chrome-linux64.zip`, its headless shell and managed ffmpeg into `R/tools/playwright`. The task Chromium binary reported `156.0.8078.4`. Installer script, Godot archive, SDK/Bun/browser executable and configuration hashes are in the manifest. These are observed provenance/digests, not an additional claim that upstream signatures were independently audited. No pinned hash/check was disabled.

## Music baseline actually observed

`R/music.ts` started the freshly built `Ramec.Server.dll` through the task's exact SDK host, cwd `R/ramec`, with `Persistence__Path=R/state/ramec.sqlite`, `Observability__SeqUrl=''`, `ASPNETCORE_URLS=http://127.0.0.1:0`, Production environment and `DOTNET_ROOT` pointing to the task SDK. Direct execution of the built DLL loads no launch profile. The database was verified absent before startup. Server output confirms console-only logging, so the retained default Seq endpoint was not used. The Vite proxy/default server was not started.

Owned runtime: server PID `492687`, UID `1000`, actual endpoint `http://127.0.0.1:34991`; task Chrome PID `492780`, UID `1000`. Browser context/profile was fresh, viewport 1440×1000 dark, with off-origin page requests aborted. The browser used the newly installed task Chromium and the server's fresh client build. It did not intercept API responses with fixtures/stubs.

Observed sequence (all HTTPs returned 200):

- `/health`, then actual `/performances` UI with its real heading; fresh UI screenshot/text retained.
- GET `/api/compositions/fixtures/rhythm-and-lead`; bytes match the assigned tracked fixture SHA `93374c8fe07a361f34af92b553fffd5c3418280ce66c2f26e3d2b8e0dd729a5c`. It is eight bars, 4/4, Moderate, 10,080 ticks/quarter.
- POST `/api/performances/generate` with that Composition, seed `"1"`, Steady Personality/topShare for rhythm Guitar channel 1, melody Guitar channel 2, Bass channel 3 and Drums channel 10; standard Guitar tuning and the existing named rendering profiles used by the server's warmup. `recordTrace=false`. Exact input is `R/artifacts/ramec/generation-request.json`, SHA in the manifest. Generation used a public API, not the UI Generate button.
- Response `Location: /api/performances/1`; GET that saved endpoint and its `/document`. The generated selected Performance and reopened saved Performance/document were structurally equal. This compares one selected result across save/reopen, not independently generated music.
- POST the reopened selected Performance to `/api/performances/projection` and `/api/performances/midi`. Open real `/performances/1`, click **Export MIDI**, and save the actual browser download. The UI download is byte-identical to the API export. Reload the page and observe the same saved heading. The [saved UI screenshot](demo-artifacts/baseline/ramec-saved-ui.png) was visually inspected: Performance 1, 388 notes, four Seats, eight bars, decisions not recorded.

The [MIDI artifact](demo-artifacts/baseline/performance.mid) is 4,513 bytes, SHA-256 `0d74406d0a293a295977878c6a9b6171a1b0107f4693a999094423ef4ef7424f`. The independently written generic decoder in `R/verify.ts` reads standard header/track chunks, delta times, running status, meta/SysEx/channel events; it does not call or copy Ramec's production/test decoder. It decoded format 1, five tracks, division 10,080, channels 1/2/3/10 and 987 channel messages. Every track has one EndOfTrack at `322560`, matching the accepted input's eight-bar boundary/public projection. Drums attacks use MIDI channel 10. Decoded event membership/multiplicity agrees with the public projection; this is cross-output consistency, not an independent oracle for the desirability of generated notes. No seed-to-melody snapshot was asserted.

Server/browser were closed through owned handles; server exited 0. The closed baseline DB is 421,888 bytes with no sidecars present, SHA-256 `fb26dbdcafe4c3f6c01c8becee8287ea06fdeda0e8c84cd815c4cf4fe304ca5a`. Original saved document SHA-256 is `92c721c8f87a42bf26d3470295df983ae092668d965088adcff600bf2c34dd7d`. That state remains the unchanged baseline for later before/after work.

After narrowing the copied SDK, `R/reopen.ts` used a separate `R/state/reopen-check.sqlite` copied from the closed baseline. Health and exact saved-document digest matched again at `http://127.0.0.1:34091`, PID `498289`, UID `1000`; the child exited 0. Details are recorded in `R/artifacts/ramec/sanitized-sdk-reopen.json`. This verifies reusable startup with the final SDK scope without generating/replacing the selected saved result.

No MIDI permission was granted, instrument connected, audition started, audio rendered/captured or listening performed. Managed ffmpeg installation is dependency evidence only. Those experiences are explicitly held and do not block this assigned non-listening baseline.

## Playable prototype baseline actually observed

The actual Release CLI was run through `R/pralice/.tools/dotnet/dotnet`, cwd `R/pralice`, with `DOTNET_ROOT=R/pralice/.tools/dotnet`, arguments `src/Pralice.Cli/bin/Release/net10.0/Pralice.Cli.dll --scenario frontier-compact --actor crown --trace-file R/artifacts/pralice/recognition.jsonl`. The helper uses an absolute DLL path. Fresh in-memory match; no retained save/database/profile or network AI. The complete [stdin script](demo-artifacts/baseline/pralice-input.txt) uses the documented default sequence, including preview, the two-term 40-unit recognition proposal, `advance 3`, inspection/status, then an explicit perspective switch to March and reports. It exits with `quit`.

Scenario technical metadata: ID `frontier-compact`, seed `frontier-compact-v1`, recorded content hash `e33d56e12581d7f71edb8887129aec1e5b786200d316c6fc90f9657ec8679491`, trace version 3. The authored scenario file's raw SHA remains the previously recorded `5de0cd13d8482878597066aa9ec67bd3381dd726cc7d4073770669544096726a`; raw file digest and canonical scenario content hash are different identities.

The [actual public transcript](demo-artifacts/baseline/pralice-player-output.txt) shows initial Crown 100, preview requiring Council/Crown/March, actual local AI responses, the named `prop-recognition` ratified with approvals `[council, crown, march]` and no remaining consents. Vale's protection call is reported. At day three Crown sees 40; after explicitly switching to March, March sees 65. Expected arithmetic comes independently from the authored guide: `100 - 40 - 20 = 40`, `25 + 40 = 65`, with the separate Vale duty accounted for. These are observation checks for this documented default scenario, not general balance or optimal-play claims.

Each CLI view is actor eligible. The transcript intentionally combines sequential Crown and March viewpoints; it must not be supplied wholesale as Crown-only or game-AI observation. No hidden trace state was used as the player ledger oracle. The trace itself contains authoritative hidden technical state and remains only in scratch, not committed or given to game AI.

Final play process exited 0 with empty stderr; PID `13`, replay PID `20`, UID 1000, are **restricted execution namespace PIDs**, not host PIDs to reuse for process control. `R/artifacts/pralice/result.json` records exact argv, status and hashes. Replay of the intact trace exited 0 and printed [recorded-command outcome equivalence](demo-artifacts/baseline/pralice-replay.txt), three days, three tracked causation outcomes, canonical digest `cb98db7bcc9a28cc7d656032079b7025e1aa471a2a0a17dfbd73cb20be2f3e1e`. The original trace SHA remained `c685111631c2e3d8b9b5241bb083df40ca991e41859bbde6909aa3de0034cd0f` before/after replay. This does not prove fresh AI-choice or AI-memory equivalence.

## Evidence map, ownership and reuse

Committed small evidence: [manifest](demo-artifacts/baseline/manifest.json), [command metadata](demo-artifacts/baseline/commands.jsonl), [30 public checks](demo-artifacts/baseline/public-checks.json), [real saved UI](demo-artifacts/baseline/ramec-saved-ui.png), [MIDI](demo-artifacts/baseline/performance.mid), [CLI input](demo-artifacts/baseline/pralice-input.txt), [public output](demo-artifacts/baseline/pralice-player-output.txt), [replay summary](demo-artifacts/baseline/pralice-replay.txt). It contains no credentials, copied user cache state or hidden game trace. The MIDI/screenshot/outputs identify actual observations, not promised golden outputs for future fresh generation.

Reusable session-local resources under R:

| Path | Purpose / restriction |
| --- | --- |
| `ramec/`, `pralice/` | Exact-source copies plus dependencies and actual builds. Original files verified unchanged. |
| `tools/dotnet-10.0.110`, `tools/bun`, `tools/playwright`, `pralice/.tools` | Task-local verified tools; do not substitute globals or add user settings. |
| `state/ramec.sqlite` | Closed original music baseline; copy to a new owned DB before subsequent mutation. |
| `artifacts/ramec/` | Exact request, response, saved document, projection, MIDI, UI download, screenshots/text, owner events and server output; `midi-decoded.json` is technical verification. |
| `artifacts/pralice/` | Script, public stdout/stderr, intact hidden developer trace, replay stdout/stderr, process result. Preserve original trace unchanged. |
| `artifacts/pralice-initial/` | First helper-failed attempt retained separately. |
| `artifacts/*-build-files.json`, `manifest.json`, `checks.json` | Full build/file identity and bounded invariant evidence. |
| `run.ts`, `music.ts`, `prototype.ts`, `verify.ts`, `reopen.ts`, `manifest.ts`, `nuget.config` | Disposable probe/environment helpers, outside consumer source. |
| `logs/`, `commands.jsonl` | Original failures/successes; each command has independent stdout/stderr and its own exit. |

Reuse should rehash the build trees and closed DB against the manifest, choose a fresh owned DB path and browser context, then start the existing built DLL. For example, from this Ruach worktree (not executed here as a new long-running server):

```sh
task_root=/tmp/c15-provision-01.6o1CPD
cp "$task_root/state/ramec.sqlite" "$task_root/state/tester-copy.sqlite"
bun "$task_root/run.ts" tester-server "$task_root/ramec" env \
  DOTNET_ROOT="$task_root/tools/dotnet-10.0.110" \
  Persistence__Path="$task_root/state/tester-copy.sqlite" \
  Observability__SeqUrl='' ASPNETCORE_URLS=http://127.0.0.1:0 \
  ASPNETCORE_ENVIRONMENT=Production \
  "$task_root/tools/dotnet-10.0.110/dotnet" \
  "$task_root/ramec/src/server/bin/Release/net10.0/Ramec.Server.dll"
```

The Tester must choose an unused DB/log identity instead of overwriting that example's files, record the new assigned endpoint/PID/UID, and stop only its owned process. Port 0 is requested every time; old port 34991 is stopped and not reserved. The command helper supplies isolation and a 600-second cap, not an unattended persistent service. Required socket access must be explicitly available. For a new empty baseline, choose a nonexistent DB instead of copying the accepted state. For CLI reuse, invoke the built absolute `Pralice.Cli.dll` through its pinned `.tools/dotnet/dotnet`, provide a fresh trace path and the recorded stdin; no build/restore is necessary merely to play/replay these preserved binaries.

The original server/browser PIDs were checked from the host context after closure: `ps -p 492687,492780 -o pid,ppid,uid,comm` had no process rows. A narrowly scoped `pgrep` for VBCSCompiler commands launched from this unique task's SDK roots found none. No foreign process was stopped. The post-pruning reopen child was also stopped by its own handle. Final host-context `ps -p 492687,492780,498289 -o pid,ppid,uid,comm` exited 1 with only its header, confirming all three known runtime PIDs absent; `R/logs/final-owned-runtime-check.*` preserves that expected no-match result. Task sources/builds/caches/evidence and native session/worktree remain; scratch retention is session-local, with no promise after `/tmp` cleanup.

## Smallest next Tester assignment and limits

Assign a bounded independent Tester the two exact tested sources/build manifests, accepted contracts from the readiness report and retained original state. First re-open the same music Performance through real UI, repeat export/known saved-state comparisons, and exercise one invalid-input/rejection boundary on a separate DB copy while preserving accepted music. Avoid seed-selected melodies as the oracle. Inspect note lengths/register/instrument roles as score evidence if qualified, labeling it separately from listening. Do not require MIDI audition/listening for this non-listening assignment.

For Pralice, independently replay this documented default bargain through actor-scoped CLI, then one public insufficient-funds/outcome boundary and a separately copied valid-command trace tamper/truncation check. Preserve the original trace; do not freeze the incidental failure section. Keep delayed-recognition expiry outside assertions until the owner resolves the existing guide/test conflict. No massive suite is needed to replace actual play.

A genuine defect is optional. If one is reproduced, retain its exact public input, original output, source/build/state digests and independently sourced expectation before requesting a separately authorized correction. Independent Reviewer must assess provenance, real original reproduction, preservation of accepted state/information boundaries and whether subsequent tests/listening claims match what was actually exercised. No Reviewer has accepted this handoff, and no model independence is claimed.

No full Ruach or consumer test suite was run for PROVISION-01. The public checker exited 0 with 30/30 bounded checks; source/build manifest generation exited 0. Report checks, cwd this Ruach worktree:

- `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/demo-baseline.md --repo /opt/dev/ruach-worktrees/c15-demo-scout`: exit 0, `ok: true`, existing candidate base resolved, no diagnostics.
- `bun scripts/check.ts`: exit 0, resource identities/eval placement/relative Markdown targets passed; behavioral quality untested.
- `sha256sum docs/assignments/c1-c5/PROVISION-01.md`: exit 0, unchanged `b985fb1d53da65f3e362f2cd019c4e08a21ddb2e318b4c33d6b9593b77a268a7`.
- `git diff --cached --check -- docs/assignments/c1-c5/PROVISION-01.md docs/reports/c1-c5/demo-baseline.md docs/reports/c1-c5/demo-artifacts/baseline`: exit 0. Staged scope contains only the unchanged assignment, this report and its eight linked evidence files.

The unchanged assignment is committed with this report/evidence. The creating SHA is returned externally, never predicted in the report.
