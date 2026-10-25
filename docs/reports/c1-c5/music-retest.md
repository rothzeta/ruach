task: MQ-F01-RETEST-01
status: complete
outcome: "MQ-F01 original offered-fixture sequence passed independently on the exact corrected build: unchanged request, one save, automatic admission, saved reload/export and bounded invalid-import preservation."
candidate_revision: 7b53c336f435a0c740e7ab61f71d4ce801562c69
tested_revision: 7b53c336f435a0c740e7ab61f71d4ce801562c69
original_report_revision: b3471feeaabc06f907553c0ac3c2cc149790ee2d
reproduction_evidence_revision: 5bf48a6ec523a24dc9b35fefe3df7ba64952a909
implementation_evidence_revision: 49e611d4c2dc40910c9a0f5118e43d6881774c7d
artifacts:
  - docs/assignments/c1-c5/MQ-F01-RETEST-01.md
  - docs/reports/c1-c5/music-retest.md
  - docs/reports/c1-c5/music-retest-artifacts/public-summary.json
  - docs/reports/c1-c5/music-retest-artifacts/SHA256SUMS
  - /tmp/c15-mq-f01-retest-01-Qh63wT
verification:
  - "Original fixture retest: passed once, 56 runtime checks across three authored scenarios; no retry, workaround, response substitution or page errors."
  - "All 16 corrected dist files matched over HTTP; 16 actual browser asset responses also matched, including the new document worker."
  - "Full original request is structurally and byte-identical to the recorded failing request. Exactly one Generate changed library [1] to [2,1] and automatically admitted Performance 2."
  - "Before/final product-source, patch/build/tool, original DB/trace and prior evidence comparisons passed. Owned browser closure and server exit 0; exact known PIDs absent."
  - "Canonical handoff validation, assignment integrity, safe artifact digests and staged owned-document whitespace passed; final receipts in T/report-checks.json."
review: not-run
discoveries:
  - "The original false admission failure did not recur on this exact corrected client. The runtime result does not substitute for the separately assigned source review."
blockers: []
product:
  source_commit: 6f17044de0b46cedef51eb71c9816ce11b6a589a
  patch_sha256: 3f209b4eab7b1520c8302783aba02705fe1bf7ed6ffd20ce3b519d985a63c2fc
  corrected_client_tree_sha256: 4e5163f31bff96b3f3dc47767a5c898d82bba000bfed17dd23321156a4175265
  server_tree_sha256: ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0

**Runtime retest passed for MQ-F01 on the first assigned corrected candidate.** The actual original offered Test piece sequence admitted its saved result with the complete unchanged failed request. Independent source review is **NOT RUN here**. This report makes no source correctness, owner acceptance or delivery claim; no source/test/configuration edits, rebuild, dependency installation, external service/model or worker call occurred.

**Identity and independent setup.** `T=/tmp/c15-mq-f01-retest-01-Qh63wT` is this Tester's fresh allocation; `C=/tmp/c15-mq-f01-fix-01-airon2` is the read-only corrected product; `P=/tmp/c15-provision-01.6o1CPD` is the preserved baseline. Read the three assigned immutable report snapshots through Git. Authored a new bounded [driver source](music-retest-artifacts/probe-source.txt); did not run the Implementer's smoke script or reuse its DB/profile.

Before execution, the source files in C matched the pinned 1,067-file product archive with precisely the declared candidate file hashes, including the added test-support file. Candidate patch bytes matched the assigned SHA-256. C's manifest matched the committed implementation manifest. These are identity checks, not a source review. Actual build identities were checked against every manifest entry before and after runtime:

| Build | Files | SHA-256 tree identity |
| --- | ---: | --- |
| Corrected `C/ramec/src/client/dist` | 16 | `4e5163f31bff96b3f3dc47767a5c898d82bba000bfed17dd23321156a4175265` |
| `C/ramec/src/server/bin/Release/net10.0` | 71 | `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0` |
| Original `P/ramec/src/client/dist` and `C/baseline-client-dist` | 16 each | `7202376ca12a52cc448a480fc6b471c88530afdbfe9918b262177d58d4957ef7` |
| Original P server | 71 | `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0` |

Tree digest uses sorted regular-file `FILE_SHA256 + two spaces + relative path + LF` lines. The recorded build command is the Implementer's `just check` invoking `just build-client`; that command was inspected as provenance and was not rerun. [Before](music-retest-artifacts/provenance-before.json) and [final](music-retest-artifacts/provenance-final.json) identity records retain source/patch/build details.

All 16 dist files were fetched from the actual newly allocated server over HTTP and matched the corrected manifest. Sixteen actual browser asset-response observations also matched, including loaded `assets/document.worker-ClzLzBXW.js`, SHA-256 `27ce10d9793b26704ac697a4aa9b563ee116a4cff437d1e4d026718c3de3e83e`. See [served assets](music-retest-artifacts/served-assets.json) and [browser observations](music-retest-artifacts/public-summary.json). No cached/original asset substitution or API mock was used. Fetching every dist file establishes serving identity, not execution coverage for every module.

The exact supplied binaries reported Bun 1.4.2, .NET 10.0.110, Chromium 156.0.8078.4 and Playwright Core 1.64.0. The fresh persistent private profile was `T/profile`; measured browser viewport was 1440×1000 CSS pixels, device pixel ratio 1, visual viewport scale 1, dark scheme. DB, CLI home, browser configuration/cache, trace, downloads and temp paths were under T. Off-origin browser requests were blocked. No native dialog/account/device actions were performed.

**Original-versus-corrected behavior.** The independent expectation comes from the assigned original-failure retest contract and the pinned product's offered supported Test piece flow: an accepted Generate should admit one usable saved result, then reopen/export it. The original report and independent reproduction establish the old public mismatch rather than defining a seeded musical oracle. Prior failure: HTTP 200 saved Performance 2 while `/performances` retained a mismatch alert; unchanged Retry saved Performance 3 and repeated the error. The original baseline was preserved and was not rerun or overwritten here.

S1, fresh original-sequence retest, 2026-10-25 22:47:57–22:48:06 UTC:

1. Copy the closed verified baseline DB to `T/music.sqlite`; verify empty private profile and absent destination DB before copying. Open `/performances`. Public library is exactly `[1]`; heading is **Performances**, with no selected result or Export MIDI control. Capture [initial UI](music-retest-artifacts/initial.png) and [library](music-retest-artifacts/library-before.json).
2. Click **Change Composition → Test pieces → stop-time → Use test piece**. Click **Add two Guitars, Bass and Drums** once. Keep Steady/topShare, standard Guitar tuning, offered profiles and channels 1/2/3/10. Set seed `41`; verify trace off and Question empty. Capture the actual [before-action UI](music-retest-artifacts/before-generate.png) and [text](music-retest-artifacts/before-generate.txt).
3. Click **Generate Performance** once. The actual [request](music-retest-artifacts/generation-request.json) is structurally **and byte-identical** to my independently recorded original failed request: SHA-256 `43bf3a83474bbab36fdfa6c9cb073b9db090bd7fec203167cd71e0f46d99c01b`. It retains the original omitted optional field; no import, pre-normalization or edited input was used for S1.
4. HTTP 200 returns the [actual response](music-retest-artifacts/generation-response.json). The UI automatically opens `/performances/2` with a saved 220-note result and usable Export MIDI. No request-mismatch text or Retry generation button exists. The [admission screenshot](music-retest-artifacts/admitted.png) shows Performance 2; [saved library](music-retest-artifacts/library-after.json) is exactly `[2,1]`. Captured HTTP events establish one and only one generation request. No retry was needed.

Observation **MQ-F01-RT01**, class **reproduced corrected-build result**, one original-sequence attempt; high confidence within the identified build/input/state. This establishes that the originally failing public experience did not recur. It does not establish all-fixture behavior, a defect introduction date or exclusive source-level cause.

**S2, saved reload and export.** Click the real **Export MIDI**, reload the saved browser route, wait for Performance 2, then export again. Both downloads are 2,831 bytes with suggested filename `performance-2.mid`, SHA-256 `92dfa21532f4687d9addf9d7dd91e4ee92c6c639785d48d26e52016b9e3dcdd9`. The selected saved document is unchanged across reload, SHA-256 `35b0601d36d2c1cb06d3e9b627f4a924e8d409af7166f14350caef409e0a3c37`. [Reopened UI](music-retest-artifacts/reopened.png), [public state](music-retest-artifacts/reopened.txt) and [actual download](music-retest-artifacts/reopened.mid) are retained. Byte equality protects this selected result's persistence/export consistency; no exact seed-to-melody acceptance assertion was used.

**S3, invalid-import cancellation preservation.** This separate negative action occurred only after S1 admission and S2 export. Open Setup, choose List/Bass and an exact note. Focus Change Composition, then establish nonzero scroll and capture the baseline **before opening**: Y=187, accepted result URL/document digest, next-source card, selected Bass note address and Seat. Supply a file containing only `{` through Import; observe the parse rejection and Escape to cancel. Accepted result, selection, Seat, document, next-source card and scroll stay equal, focus returns to the opener, and a third MIDI export has the same digest. See [before](music-retest-artifacts/preservation-before.json), [rejection screenshot](music-retest-artifacts/invalid-import.png) and [after](music-retest-artifacts/preservation-after.json).

The next-generation source card was **empty after reload** (“Choose a Composition”) before this action and remained empty afterward. Thus this checks preservation of accepted saved music and current selection/state, not rejection against a separately populated usable next-source draft. Selection address was read from public collapsed Raw details; the selected Bass row/details were also observed. This invalid import was not a workaround or generation control.

**Execution and preservation.** Actual command was `bun T/retest.ts`, cwd `/opt/dev/ruach-worktrees/c15-runtime-tester`, using assignment-authorized per-command browser/socket/process access; exit **0**, with 56 runtime checks and three scenarios passed. Driver work through awaited shutdown was 9.600 seconds; each authored action was below 120 seconds, and driver/server/browser stayed below the newly allocated 600-second caps. No helper/selector failure, timeout, remediation retry or additional correction candidate was needed. Action timings are retained for reproducibility, not compared against a product latency budget.

The server was spawned with argv `P/tools/dotnet-10.0.110/dotnet C/ramec/src/server/bin/Release/net10.0/Ramec.Server.dll`, cwd `C/ramec`. Explicit additions were `DOTNET_ROOT=P/tools/dotnet-10.0.110`, `Persistence__Path=T/music.sqlite`, `Observability__SeqUrl=''`, `ASPNETCORE_ENVIRONMENT=Production`, `ASPNETCORE_URLS=http://127.0.0.1:0`, `DOTNET_CLI_HOME=T/dotnet-home`, `XDG_CONFIG_HOME=T/config`, `XDG_CACHE_HOME=T/cache`, `TMPDIR=T/tmp`. PID 864800, UID 1000, assigned endpoint `http://127.0.0.1:42053`; Chromium PID 864903 was identified among this driver's own direct children. Browser closure was awaited and server handle exited 0. Host-context `ps -p 864800,864903 -o pid,ppid,uid,comm` exited 1 with header only, confirming both absent. No foreign process was signaled. No owned live runtime requires cleanup; endpoint is stopped, not reserved.

`bun T/provenance.ts before` and `final` exited 0. Original P DB remains 421,888 bytes, SHA-256 `fb26dbdcafe4c3f6c01c8becee8287ea06fdeda0e8c84cd815c4cf4fe304ca5a`, with no original WAL/SHM/journal. Original trace remains SHA-256 `c685111631c2e3d8b9b5241bb083df40ca991e41859bbde6909aa3de0034cd0f`. P's source/build/critical tools, C's source/build/manifest and saved baseline dist stayed unchanged. Full regular-file inventories of C's 101 evidence files and prior Tester/Reviewer roots (1,941/1,999 files) matched before/final. No old DB, trace, profile or runtime endpoint was reused. The closed private DB's new digest is recorded in the public summary; its contents stay in T.

`bun T/package.ts` exited 0 after direct version, request-byte equality, preservation and shutdown-evidence checks. `T/commands.jsonl` retains exact argv/cwd/environment/timestamps/exits and full log digests for helper children. Driver source, original HTTP bodies, request/response captures, screenshots/text, server stdout/stderr, private browser trace/profile, DB and action/check records remain under T; safe copies are linked here. Original evidence is untouched. The admitted, reopened and invalid-import screenshots were visually inspected; screenshots do not substitute for the actual inputs/HTTP/downloads recorded here.

Canonical runtime-testing, contract-oracle and handoff skill hashes matched the previously activated canonical sources; those hashes are in provenance. Actual browser input/UI, HTTP/asset inspection, screenshot and download capabilities were exercised. Audio rendering, device connection, audition, playback, capture and listening remain unperformed/held; no musical judgment follows from MIDI bytes. No new Pralice run, broad hunt, all-fixture/backend suite, source negative reservation probe, response interception, retained consumer mutation or acceptance/delivery work occurred. Genuine changed-reservation negatives and source correctness remain the separately assigned Reviewer's scope.

The first corrected candidate passed this independent runtime retest. No failed completed correction cycle is reported here; this does not close the separate review/acceptance gate. The prior driver's recorded duration deviation remains historical evidence with its Coordinator disposition and is not relabeled compliant by this assignment's new allocation.

Only this unchanged assignment, report and safe linked evidence are committed. Assignment SHA-256 is `bde43ad0c9ac443396b545adae61c4b2d22a514e350dc4fcb63bfebb2468ebc8`. Required validation uses `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/music-retest.md --repo /opt/dev/ruach-worktrees/c15-runtime-tester`, safe artifact checksum verification, assignment integrity and staged owned-document `git diff --check`; final exits/receipts are retained at `T/report-checks.json`. Preserve T and all C/P/prior state; Coordinator owns retention and session/worktree cleanup. The creating commit SHA is returned externally.
