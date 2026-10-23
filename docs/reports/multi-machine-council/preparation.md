# Development-machine preparation

Prepared Oholiab and Tubal on 2026-10-11 for the applications represented by the canonical checkouts under `/opt/dev`. Both are Debian 13 x86_64. All ten resulting source trees were clean after the recorded checks. Worktrees, scratch folders and build outputs from the control machine were not treated as independent applications.

## Source snapshots

Created bundles from each checkout's committed branch and verified the received HEAD. The existing clean RAMEC checkouts fast-forwarded from their older revision. Eden, Jachin and Boaz remain separate repositories. Ruach's uncommitted local documentation was excluded from its source snapshot.

| Repository relative to `/opt/dev` | Branch | Exact source revision on both machines |
| --- | --- | --- |
| ruach | main | `d75039aa7b82b262e2f28af08630258fb7f77180` |
| ramec | master | `9f708a3eeb3f6620d16beef11701768e9d1f8df8` |
| enoch | main | `d163a4132a6840d2604e6e17883612eb77a901ec` |
| pralice | master | `3e15253ce542d259280b95ce2b9a3262040dc32c` |
| dirtest | master | `d4600ed37aa3a3c8bfab417dd9408b3d337fa8db` |
| tehom-brainlab | master | `c82ec3c71a499760fc2bf7c40c9b162a6856d03b` |
| ramec-brainlab | feat/drum-experiments-and-fact-extraction | `22a5b17b108a7f56eb792535c1b7a7f13bc901f1` |
| eden | master | `02fc9de87b360acc80664e9e7eb17e9d892195c4` |
| eden/jachin | master | `946ddd68d41932070b7a374819ea2c7c72de3a6e` |
| eden/boaz | master | `8afb539f76efef55c1b69a09867834a1570cfa47` |

These are pinned preparation snapshots. Subsequent changes on the control machine do not automatically update them.

## Tooling and access

- Bun 1.4.2 and Node 22.23.3/npm 10.9.9 are available through user-local tools. Node's archive matched its upstream SHA-256 list. The existing Bun 1.4.3 installation remains available.
- .NET SDKs 8.0.425, 10.0.110 and 10.0.401 are installed. Repository `global.json` files select the appropriate SDK.
- Pralice's own bootstrap installed its pinned Bun, .NET and Godot 4.7.2 Mono under its ignored local tool directory. A font-library warning led to repository-local Debian library/font extraction and a generated Godot wrapper; headless version and startup checks then passed without the warning. No system package installation was used.
- Git, Just 1.40.0, Python 3.13.5, Docker 29.9.0 and Docker daemon access were verified. Boaz's Python tooling uses its local virtual environment and declared Ansible collections.
- The user-local `dev-env` wrapper loads the prepared PATH and .NET environment. It also sets `BUN_BIN` to 1.4.2 so Just recipes that prefer the older user install do not override the selected toolchain. Initial Ruach Just checks used preserved Bun 1.4.3; checks were repeated successfully after this selection was pinned. Explicit Bun test commands used 1.4.2.
- Existing Codex 0.162.1 and Claude Code 2.1.296 installations reported logged-in native accounts. Git author identity is already configured. Account identifiers and credentials were not copied or recorded here.
- Both running Herdr servers are 0.9.3, protocol 22. Created background `ruach-development` workspaces with the prepared toolchain PATH and verified command execution inside their panes.
- The default local Herdr client is 0.9.0 and rejects `--machine`. A temporary copy of the existing remote 0.9.3 client successfully forwarded workspace list/create and pane run/read through the saved machine profiles. Existing servers and the default local client were preserved.

From an SSH shell, run a project task with `dev-env`, or source the prepared environment before using Just. Inside the new Herdr workspaces, the user-local tools are on PATH. Pralice continues to use its repository tasks and pinned local toolchain.

## Verification on each machine

All commands listed as passed exited 0 on **both** machines.

| Project | Verification | Result and scope |
| --- | --- | --- |
| Ruach | `just install`, `just check`, `bun run test`, `bun run release-check`; Herdr, handoff, harness-eval and changelog skill suites | 90 root + 149 Herdr + 28 handoff + 71 harness-eval + 35 changelog tests passed; type/resource/release checks passed |
| RAMEC | `just install`, `just build-dotnet`, `just typecheck-client`, client production build, `just test-client`, `just test` | Backend/client builds and routine .NET tests passed; 809 client tests passed |
| Enoch | `just install`, `just check` | Formatting, backend/frontend builds, lint, .NET/frontend tests and operations unit tests passed |
| Dirtest | Frozen Bun install, `typecheck:web`, `build:web` | Nuxt types and production build passed |
| Pralice | Repository bootstrap, `bash tools/run check`; generated Godot wrapper headless checks | 971 tests passed; pinned tool checks passed; engine starts headlessly |
| Tehom Brainlab | `just doctor`; POC 001 install/typecheck/test/build; routing suite after skill dependency install | 581 POC tests and 14 routing tests passed |
| RAMEC Brainlab | `just check` after exact model-bundle provisioning | 717 tests ran; 24 expected skips were explicitly classified; check gate passed |
| Boaz | Local environment/dependency/collection install; `just check` | Ansible syntax/lint passed with two existing handler warnings |
| Eden and Jachin | `git diff --check` | Clean source snapshots; no deployment or infrastructure convergence |

RAMEC and Tehom production bundles emitted size warnings while exiting successfully. These were not changed during machine preparation.

## Resolved setup failures

Tehom's routing suite initially failed because the generated `ruach-herdr` skill lacked installed packages. Frozen dependency installation in its executable snapshot skills resolved that failure; no generated skill source was edited.

RAMEC Brainlab's initial check failed on two ignored historical bundles referenced by its committed release-selection registry. Transferred the exact directories `a84f79848ef0f5f9525eb8c5e263bc6a81cd6c859cbb95334566c748de3a24bb` and `7501b506767b1492a2453f539f4353653ac25f933bbdbf6ca2cdde5293bf6aea`: 14 files, 1,582,133 bytes. Each receiver verified every file's size and SHA-256 and refused a differing existing file. A separate asset receipt records the manifest. This copied historical model evidence, not the corpus datasets or a newly accepted runtime model.

The original failed logs and later passing logs are retained separately. No tests were disabled to make preparation pass.

## Launch and handoff readiness

On each target, the source `ruach-herdr` launcher prepared Codex/Sol-high and Claude/Opus-high dry-runs with the expected role hash, source base, auto-review permissions and target-local native configuration. All four dry-runs exited 0, `launchable: true`, `submission_state: not-submitted`. These checks did not create remote workers or prove a paid model turn. Codex's short-lived native reader may initialize its runtime files, as the existing adapter contract describes.

The controller then fetched `refs/heads/main` from each real remote Ruach repository over its existing SSH target into separate refs in an isolated temporary bare repository. Both resolved to the exact pinned `d75039aa7b82b262e2f28af08630258fb7f77180`. This verifies a returning source transfer without remote-to-controller credentials. It does not exercise a worker feature branch, a dropped launch, immutable return pins or integration review.

## Coverage limits and retained state

RAMEC slow, measurement, browser and timing suites were not run. Tehom browser rendering was not exercised. Pralice has no `game/project.godot`, so its project/gameplay check is explicitly skipped; headless engine startup does not prove desktop play. Brainlab's expected skips include optional datasets and Docker integration assets. Full corpus datasets were not transferred. Jachin deployment configuration and Boaz OpenTofu/deployment execution were not tested.

No application deployment, infrastructure convergence, origin publication, credential distribution or live remote paid model turn was performed. Git push authentication to hosted origins was not provisioned; ordinary committed source can move through the verified controller-initiated SSH/bundle paths.

The prepared repositories, ignored dependencies/tools, two hashed model bundles, user-local environment, private receipts/logs and development workspaces are retained. Host/package download configuration, private profile identifiers and full raw outputs remain outside the committed council artifacts. No global harness settings or discovery links were rewritten. The local preparation helper scripts are TypeScript/Bun in temporary storage, not a proposed reusable Ruach implementation.
