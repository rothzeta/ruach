task: RUACH-ROADMAP-IMPLEMENTATION/R-COMBINED-RV2
status: complete
outcome: "Exact correction re-review of 94cdfa1a (source ac187d4) against my findings at 0a469dc3: B1, O1, O3 and Enoch E1-E3 are resolved, and O2 is intentionally left by Coordinator choice. No blocking findings remain; 2 new optional notes. No hosted, native, blind or Enoch-success claim."
verdict: no-blocking-findings
prior_review_commit: 0a469dc3b05c4c3fb4262d72dbbd251deb0a99c4
baseline_revision: 5b9d554081f4b38050fd1076f62907e64ae9ee1f
candidate_revision: ac187d465337c33e0e35549ae245501ae10906ad
tested_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
reviewed_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
enoch_clone_path: /tmp/ruach-implementation-20261011/enoch-exercise/clone
enoch_seed_sha: ea33fc70456bf45bdd51e6eedcb83cf5cdf89347
artifacts:
  - docs/reports/next-release/combined-review2.md
  - docs/assignments/next-release/combined-review2.md
verification:
  - "Fresh clone (git clone --no-hardlinks of this worktree's repository, detached at 94cdfa1a) in session scratch; cwd = that clone; bun 1.4.2, just 1.40.0; heavy steps under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock, timeout 300 s (600 s for bun run test)"
  - "just install, just check, just release-check: exit 0 each; bun run test: exit 0, 100 pass 0 fail"
  - "node_modules/.bin/tsc -p for both packet tsconfigs: exit 0 each"
  - "Smoke packet: host PATH 14 pass 0 fail; bare PATH (bun and just symlinks, /usr/bin:/bin, HERDR_* unset, no herdr, claude or codex) 14 pass 0 fail. Coordination packet: 10 pass on both PATHs"
  - "Old-failure reproduction in the same clone with offline-install.ts and smoke.test.ts from 5b9d554: bare PATH exit 1, 12 pass 1 fail; host PATH 13 pass. Files restored, clone clean"
  - "bun evals/ruach-coordination/prepare.ts --out <fresh>: exit 0. Report counts per case [4,0,5]; each of the 9 committed reports extracted and validated with --repo <case repo>: exit 0, ok true"
  - "Smoke CLI on a bare PATH: check.ts before a subject commit exit 2 (equals base); after the subject commit exit 0, candidate_revision = tested_revision = subject HEAD, checks passed x3; tampered protected test: scope exit 1, protected_changes [tests/range.test.ts]"
  - "offline-install.ts CLI: bare PATH exit 0, ok true, ready exit 1, native_readiness herdr not ready with missing ['herdr not found or not working'] and prerequisites herdr, claude and codex found false; host PATH exit 0, ok true, ready exit 0"
  - "Negative probes of the ok rule using a scratch source commit with a patched ready in scripts/install.ts (production untouched): non-JSON output with exit 0, a lying exit 0 while herdr is not ready, exit 2, and packages reported missing each gave CLI exit 1 and ok false"
  - "CI simulation from a file:// origin of 94cdfa1a (not hosted evidence), running the step text extracted from ci.yml on a bare PATH: depth-1 push branch, depth-1 detached fork-style merge ref and full clone each fetch exit 0 with no fatal line; shallow=false and v0.3.0 resolved to 91ea9b2; then just install, smoke tsc (node added to PATH only for tsc), bare smoke 14/14 and bare coordination 10/10. A depth-1 control without the step: 13 pass 1 fail (historical 0.3.0)"
  - "E3: validate.ts <abs path>/docs/exercise/report.md --repo <clone> on a temporary report outside the clone: exit 0, ok true, revision resolved in the clone; the old relative form: exit 2. Clone at ea33fc7 on ruach-exercise/url-encoding-seed, clean, base..seed digest b8f48d29...; /opt/dev/enoch at d163a41, main...origin/main, clean"
  - "Identity: the e10156d Enoch records, except future-assignment.md, and the eb7ae94 native-prep records are blob-identical at 94cdfa1a; the three 0a469dc3 review files are blob-identical. No change from 5b9d554 under scripts, skills, agents, config, tests, docs/design, docs/roadmap.md, justfile, package.json or bun.lock, so earlier skill-suite evidence and the Implementer's ac187d4 full gate are reused and just test and the audits were not rerun"
  - "Owner inputs: /opt/dev/ruach roadmap, native-parity and RAMEC still hash 7e81217f, 248a8931, c2487a28; the union roadmap equals frozen plus status paragraphs (0 frozen lines removed); native-parity differs from frozen by the reviewed sentence (line 40) and the one added paragraph"
  - "git diff --check in the exact clone: 5b9d554..ac187d4 and ac187d4..94cdfa1a clean (seed.patch is exempt through its committed .gitattributes from e10156d); d75039a..94cdfa1a shows only the known historical r2-i.md and r2-l.md EOF and the r2-b herdr-version-help.txt lines"
  - "Canonical handoff validator --repo . and git diff --check on this report: see Validation"
discoveries:
  - "Hosted CI is still unobserved. The bare-PATH simulation suggests the new steps should pass on a hosted runner that has node, but that is not evidence of a hosted run."
blockers: []

# R1–R3 combined correction re-review

Reviewer: canonical Reviewer, session `r1-r3-combined-review`, using a fresh clone at the exact revision rather than the author checkout. The reviewed scope is `5b9d554..94cdfa1a`. Source and docs changed only in `ac187d4`; `89a619d` and `94cdfa1a` add the fix assignment and report, including the report-only Validation correction. I made no source edits, read no workflow bodies, ran no native subject, accessed no credentials, and did not merge, push or tag.

## Dispositions

| Finding | Disposition | Basis |
| --- | --- | --- |
| B1 (smoke step depends on host natives) | **Resolved** | The control's `ok` now requires install, check and both frozen dependency steps at exit 0, plus a consistent actual `ready` result: valid JSON, exit 0 exactly when `routes.herdr.ready` (else 1), not timed out, integrity ok, skill route ready, all packages ready. `native_readiness` records the real state, with no skip, fake readiness or wider timeout. The old failure reproduces, and the corrected packet passes on both a bare and a host PATH. The negative probes show that malformed, lying, unsupported and package-failure results still fail. The `path` option only sets the child PATH inside the eval script; there is no production change. |
| O1 (placeholder route labels) | **Resolved (documentation)** | The README states that the run id, kind and `none-no-model-subject` are offline placeholders, that native runs record their actual route and model separately, and that `model_use_verified` stays false. |
| O2 (non-descending refusal untested) | **Left by Coordinator choice** | Acceptable. The source is unchanged and I verified the behavior independently earlier. |
| O3 (fetch fallback noise) | **Resolved** | The step checks `--is-shallow-repository`, then runs `--unshallow --tags` or `--tags`. Failure stays visible. All three simulated checkout shapes pass with no `fatal:` line. |
| E1 (answer exposure) | **Resolved** | `future-assignment.md` and `correction-1.md` classify the seed history and the readable original as answer-accessible, ordinary non-blind smoke, and explicitly supersede the historical "does not reveal the cause" premise. The historical report, provenance, patch and logs are byte-identical, and the brief is unchanged with no grader facts. The original Enoch and the seed are untouched. |
| E2 (dialogs) | **Resolved** | The user reads and answers dialogs directly (or explicitly authorizes an assistant per the launcher contract). The Coordinator records the dialog and its status and never answers, relays or relaunches around it. This matches the Coordinator role. |
| E3 (validator path) | **Resolved** | The absolute `<clone>/docs/exercise/report.md --repo <clone>` form works (exit 0). The clone-as-cwd alternative is consistent with path resolution against the current directory. |

## Blocking findings

None.

## Optional findings

### N1. The negative branches of the new `ok` rule have no regression test

- **Location:** `evals/next-release-native-smoke/scripts/offline-install.ts` (`readyConsistent`) and `tests/smoke.test.ts`.
- **Evidence:** the committed tests cover the host-ready and bare not-ready positive cases. My scratch probes (non-JSON with exit 0, a lying exit 0, exit 2, packages missing) all give `ok: false`, but nothing in the packet guards that.
- **Direction:** optionally add one case that drives a malformed or lying `ready` through a scratch source commit, the same way my probe did, when the packet is next changed.

### N2. One native-parity clause goes slightly beyond what the receipt records

- **Location:** `docs/native-parity.md`, the 2.1.296 paragraph ("the readiness check still needed `bun install --frozen-lockfile`").
- **Evidence:** `native-prep.md` at eb7ae94 records the frozen installs (exit 0) followed by `ready --route native` exit 0. It does not record a failing `ready` before those installs. The clause follows from "no skill-level `node_modules/`" plus the earlier verified mechanism, but it is an inference.
- **Direction:** optionally rephrase as "skill dependencies were installed with `bun install --frozen-lockfile` before readiness was checked". The paragraph otherwise matches the receipt, keeps the 2.1.292 observation, and decides neither D1 nor D2.

## Not verified

Hosted CI and runner images, native or model behavior, blind boundaries, Node 22, and any Enoch subject run were not checked. The CI simulation is a local `file://` approximation. `just test` and the audits were not rerun, because the skills, runtime and role sources are byte-unchanged from the previously verified `5b9d554`.

## Validation

I ran the canonical `skills/ruach-handoff/scripts/validate.ts <report> --repo .` and `git diff --check` on this report before committing it. I removed the verification scratch (clone, simulations, prepared packets, probe sources) under the session scratch directory after recording the results above. I left the Enoch clone and the live setup resources untouched.
