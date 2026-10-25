task: MQ-F01-FIX-01
status: complete
outcome: "Prepared the bounded disposable correction, verified red/green admission behavior and real corrected-build smoke; independent source review and original-sequence Tester retest remain pending."
baseline_revision: f6d9c2c5b35d437dbf0183bd37968ede3bee7b7f
candidate_revision: 7b53c336f435a0c740e7ab61f71d4ce801562c69
tested_revision: 7b53c336f435a0c740e7ab61f71d4ce801562c69
artifacts:
  - docs/assignments/c1-c5/MQ-F01-FIX-01.md
  - docs/reports/c1-c5/music-fix.md
  - docs/reports/c1-c5/music-fix-artifacts/mq-f01.patch
  - docs/reports/c1-c5/music-fix-artifacts/source-manifest.json
  - docs/reports/c1-c5/music-fix-artifacts/build-manifest.json
  - docs/reports/c1-c5/music-fix-artifacts/verification.json
  - docs/reports/c1-c5/music-fix-artifacts/SHA256SUMS
  - /tmp/c15-mq-f01-fix-01-airon2
verification:
  - "Baseline public admission probe rejects the actual captured pair; changing only request reservation to null or only response reservation to omitted admits it. Genuine reservation difference remains rejected."
  - "Pre-fix just test-client-focused src/performance/state.test.ts: expected red, 2 failed / 42 passed. Corrected just check: exit 0, frontend type/lint/format/build and 815 tests across 49 files, including all 44 state tests."
  - "Real corrected-build original-fixture smoke: exit 0, unchanged complete request, HTTP 200, one save, automatic /performances/2 admission, saved reopen and MIDI download. All 16 served assets match corrected manifest."
  - "Ruach just check, bun run test (108 passed), and bun run release-check passed after pinned dependency/socket remediation. Initial failures retained."
  - "Original source/build/DB/trace and critical tool hashes preserved; exact candidate patch/per-file hashes verified. Canonical handoff validator, owned whitespace, checksum/privacy and unchanged-assignment checks passed."
review: not-run
discoveries:
  - "The omitted/null vocalReservation mismatch is isolated at the public admission boundary using the complete original captured pair. No response bypass, import workaround, backend or saved-data change is needed."
  - "Corrected assets are a new 16-file build; the copied 71-file server is byte-identical to the original baseline."
blockers: []
product:
  source_commit: 6f17044de0b46cedef51eb71c9816ce11b6a589a
  patch_sha256: 3f209b4eab7b1520c8302783aba02705fe1bf7ed6ffd20ce3b519d985a63c2fc
  corrected_client_tree_sha256: 4e5163f31bff96b3f3dc47767a5c898d82bba000bfed17dd23321156a4175265
  unchanged_server_tree_sha256: ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0

The candidate is ready for the separately assigned exact-source review and independent original-sequence retest. This is an Implementer handoff, with no acceptance or delivery claim. Only the requested assignment, patch, manifests, report and safe evidence are committed in Ruach. No retained consumer, original shared baseline, launcher/catalog/adapter source, global settings or discovery links were changed.

The allocation is **C=/tmp/c15-mq-f01-fix-01-airon2**, product **C/ramec**. **P=/tmp/c15-provision-01.6o1CPD** remains read-only. Full command receipts/logs, captured input/output, original Git blob list, baseline source Git tree, scripts, browser trace/profile, copied DB and runtime evidence remain under C. Exported command/log paths substitute `$C`, `$P`, `$RUACH` and `$BUN`; `$RUACH` means this worktree and `$BUN` means its existing Bun executable. [Verification receipts](music-fix-artifacts/verification.json) give exact argv, cwd, explicit environment, start/end, duration, exits/signals and raw-log hashes. [Checksums](music-fix-artifacts/SHA256SUMS) identify the sanitized exported files.

The contract comes from the offered supported Test piece flow, the pinned working agreement and score-first support: Generate must admit its accepted saved Performance. It does not promise exact generated notes, a seed-to-melody mapping, or latency. The authoritative finding inputs were read from immutable reports/artifacts at `b3471feeaabc06f907553c0ac3c2cc149790ee2d` and `5bf48a6ec523a24dc9b35fefe3df7ba64952a909`. No worker transcript or private task record was read.

Cause confidence is high for this mismatch. The offered stop-time fixture omits its Section's optional `vocalReservation`; the server's Section model defaults it to null. Client `sameComposition` normalized other server-written defaults but omitted this one, and `sameData` rejects unequal member sets. On unchanged source, public `validateGeneration` rejects the complete original captured request/response. Aligning only this field in either direction admits that same pair; introducing an actual reservation still rejects it. [Cause probes](music-fix-artifacts/cause-probes.json) retain all results. These are boundary-level single-field controls, with no runtime response interception or exclusive backend-branch instrumentation. The corrected real browser flow then admits the unchanged complete request.

The [ordinary relative-path patch](music-fix-artifacts/mq-f01.patch) changes three product files:

- `src/client/src/performance/state.ts`: add `vocalReservation: section.vocalReservation ?? null` beside existing optional Section defaults. Non-null values still participate in full comparison.
- Adjacent `state.test.ts`: exercise the real offered stop-time Composition through store selection and admission; explicitly compare omitted/null reservation in both directions; reject a newly supplied reservation and changed sung spans/lower/upper range. Existing Composition, provenance, seed, lineup, interval and other negative controls remain intact.
- Adjacent `state-generation.test-support.json`: only the independent observed response's `performance.composition`, formatted with the configured Prettier. No generated notes or private state were copied into a golden oracle.

The store regression uses existing unrelated Performance support and an API test double, while retaining the actual fixture and real admission guard. The full captured-response probe and real server/browser smoke separately cover the actual complete generation response. Expectations come from supported admission and optional-field semantics, rather than a copied normalization algorithm. No abstraction, schema, backend, dependency version, fixture, API or persisted-data contract changed.

Before edits, the archive SHA-256 was `1c42adc97769db6636468cce40e208507d0b0848f21c41fd441fa39113eb406f`; every one of 1,067 copied regular files matched the pinned source Git blobs. A local disposable Git baseline was made solely for the project's change-selection checker; its tree `91daf580664322620eb9dddf0a0bfaf827c3657e` exactly matches the canonical source tree. Its local commit `c6f0f9915739e0609916e9de0f85f259d5f875dd` is not a Ruach candidate. Initial detailed provenance JSON collided with its command receipt filename; the successful stdout summary, original blob list, verified archive/local baseline tree and complete final per-file provenance remain retained. [Preservation evidence](music-fix-artifacts/preservation.json) records final original identity and unchanged assignment SHA-256 `ca4247971eed263c6ea150412e889d2726ef106de28d6ba3e68c11bc2a3af40f`.

The patch/source manifest was committed first as the existing candidate/tested Ruach revision above. All final product checks ran on the exact matching applied copy; per-file source hashes and exact diff digest were checked afterward, and `git apply --reverse --check` passed. [Source identity](music-fix-artifacts/source-manifest.json) separates canonical product commit plus patch from the Ruach evidence commit. The later report commit records evidence only.

| Check; cwd unless stated is C/ramec | Actual result |
| --- | --- |
| `bun C/probe.ts baseline`; cwd C | Exit 0; original pair rejected, both one-field representation controls admitted, real reservation difference rejected. |
| `just test-client-focused src/performance/state.test.ts` on original implementation plus authored tests | Expected exit 1: 2 red regressions, 42 passes. [Full red stdout](music-fix-artifacts/red-state-authorized.stdout.log). |
| `just check` on exact candidate | Exit 0, 254.05 s total. Type check, ESLint, Prettier, supported `just build-client`, related tests: **815 passed / 49 files**, including **44 state tests** and existing worker/store/admission/Composition/provenance negatives. [Full output](music-fix-artifacts/product-check.stdout.log). |
| `bun C/probe.ts candidate`; cwd C | Exit 0; original and both equivalent controls admit; real reservation difference remains rejected. |
| `bun C/smoke.ts`; cwd C | Exit 0, 11.85 s; real fixture sequence, 16 served asset hashes, original request equality, one persisted/admitted result, saved reopen/export. |
| Ruach `just check`, `bun run test`, `bun run release-check`; cwd this worktree | Exit 0 each; root suite **108 passed**. No skill source changed, so no affected skill suite was selected; canonical handoff validation was run. |
| Final provenance, candidate diff/per-file matching, patch reverse applicability | Passed; originals preserved and exactly the three owned product files differ. |

Supported environment remediation: restricted client dependency installation first failed DNS; frozen-lockfile installation with assigned network capability succeeded in C. The initial restricted red command stopped during esbuild startup before assertions; the authorized identical command built successfully and produced the expected two failing tests. Ruach initially lacked its local compiler/skill dependencies and denied test sockets. Its documented `just install` installed only pinned ignored verification dependencies in this checkout, using C's cache; checks and socket-authorized root tests then passed. No lockfile/source/global cache changes were made. All initial exits/logs remain in C and are identified in verification receipts.

The corrected client was built by the pinned `just check` invoking **`just build-client`**, which runs `vue-tsc --noEmit -p tsconfig.build.json && vite build`. It contains **16 files**, tree SHA-256 `4e5163f31bff96b3f3dc47767a5c898d82bba000bfed17dd23321156a4175265`. The pre-fix C build was preserved separately as C/baseline-client-dist and matches original client SHA-256 `7202376ca12a52cc448a480fc6b471c88530afdbfe9918b262177d58d4957ef7`. C's copied server is **71 files**, unchanged tree SHA-256 `ac30c3742c233a9a68ed9199e326e49426800f39cef4710561a822c1440a5eb0`; it was not rebuilt. [Build manifest](music-fix-artifacts/build-manifest.json) includes complete per-file lists. Tree digests use byte-sorted `FILE_SHA256 + two spaces + relative path + LF`.

Actual serving used that copied server DLL, cwd C/ramec, Production, loopback port 0, and C-owned DB/profile/config/cache/temp paths. P's exact existing .NET binary was executed read-only. The unchanged server's `Program` selects C/ramec/src/client/dist from its content root and serves its shell at /performances. Every corrected dist file was fetched over HTTP and matched the manifest; the new document worker is `assets/document.worker-ClzLzBXW.js`, SHA-256 `27ce10d9793b26704ac697a4aa9b563ee116a4cff437d1e4d026718c3de3e83e`. Original assets cannot satisfy these identities. [Tool versions](music-fix-artifacts/versions.json): Bun 1.4.2, .NET 10.0.110, Just 1.40.0, Chromium 156.0.8078.4 and pinned resolved client tools.

The implementation smoke used fresh copied baseline DB and persistent private Chromium profile: /performances → Change Composition → Test pieces → stop-time → Use test piece → Add two Guitars, Bass and Drums → seed 41, trace off, Question empty → Generate. The complete [actual request](music-fix-artifacts/smoke-request.json) equals the independent original failed request, including channels 1/2/3/10, standard profiles/tuning, Steady and topShare. HTTP 200 saved Performance 2 and opened /performances/2 without the mismatch or Retry generation control. The public library grew [1] → [2,1] after exactly one Generate. Saved /performances/2 reopened and real Export MIDI downloaded 2,831 bytes, SHA-256 `92dfa21532f4687d9addf9d7dd91e4ee92c6c639785d48d26e52016b9e3dcdd9`. See [runtime receipt](music-fix-artifacts/runtime-smoke.json), [before UI](music-fix-artifacts/before.png), [reopened UI](music-fix-artifacts/reopened.png) and [download](music-fix-artifacts/reopened.mid). Two runtime screenshots were visually inspected; the admission screenshot in C captures opening in progress, while the exported reopened screenshot shows the loaded timeline. MIDI identity is evidence of the observed download, not an asserted seed-to-music contract.

For the independent Tester, preserve C and use a fresh, separately owned RETEST_STATE directory. Verify the patch/source/build hashes above first. The serving command is:

```sh
C=/tmp/c15-mq-f01-fix-01-airon2
P=/tmp/c15-provision-01.6o1CPD
# RETEST_STATE must name the Tester's new owned state directory.
mkdir -p "$RETEST_STATE/tmp"
cp "$P/state/ramec.sqlite" "$RETEST_STATE/music.sqlite"
cd "$C/ramec"
timeout --signal=TERM 550s env \
  DOTNET_ROOT="$P/tools/dotnet-10.0.110" \
  DOTNET_CLI_HOME="$RETEST_STATE/dotnet-home" \
  XDG_CONFIG_HOME="$RETEST_STATE/xdg-config" \
  XDG_CACHE_HOME="$RETEST_STATE/xdg-cache" \
  TMPDIR="$RETEST_STATE/tmp" \
  Persistence__Path="$RETEST_STATE/music.sqlite" \
  Observability__SeqUrl='' ASPNETCORE_ENVIRONMENT=Production \
  ASPNETCORE_URLS=http://127.0.0.1:0 \
  "$P/tools/dotnet-10.0.110/dotnet" \
  "$C/ramec/src/server/bin/Release/net10.0/Ramec.Server.dll"
```

Read the newly assigned loopback endpoint from that process's output; use a fresh private browser profile and repeat the original offered-fixture sequence above. Require automatic admission of the saved result, one new library entry and usable reopen/export. If the original false failure returns, retain the unchanged Retry request and result as in the original sequence. Do not use import as the corrected-build proof. C/smoke.ts is retained for inspection of this Implementer's run, not offered as independent Tester authorship; it must not be rerun over its existing state.

Original source, builds, DB and trace hashes were rechecked after all application execution. The original DB remains `fb26dbdcafe4c3f6c01c8becee8287ea06fdeda0e8c84cd815c4cf4fe304ca5a`; the original trace remains `c685111631c2e3d8b9b5241bb083df40ca991e41859bbde6909aa3de0034cd0f`. Q and R were not modified. Browser closure was awaited; the owned server exited 0 and exact-PID host inspection returned only its header, confirming absence. No owned live runtime needs cleanup. All raw evidence and disposable allocations remain retained; no session/worktree teardown occurred.

Independent exact-source review and original-sequence Tester retest are **not run by this worker**. No audio/device playback, listening, musical-quality, all-fixture, full backend/Slow-suite, other-platform or broad feedback-loop acceptance is claimed. There is no retained delivery, push, tag, consumer/global install, trust/account/route change or external model/game-AI call. The first corrected candidate has no completed unsuccessful correction cycle; independent failure would consume the assignment's existing budget.
