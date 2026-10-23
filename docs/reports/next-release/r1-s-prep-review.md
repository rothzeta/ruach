task: RUACH-ROADMAP-IMPLEMENTATION/R-RV-LFS/R1-S-PREP
status: complete
outcome: "Changes requested: one blocking finding. The packet's documented live-run check path evaluates the prepared base instead of the subject's commit (acceptance setup failure, vacuous scope pass). Three optional findings. Fixture, answer-access disposition (ordinary non-blind by default, blind unverified), offline controls, install controls, matrix and packet typecheck are otherwise confirmed."
reviewed_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
candidate_revision: f363628fbedfb495d5baae9114c6241c0105f07e
tested_revision: 405ffe2bc33b0f2587bc1790099b05e4e306bfb8
baseline: eb8f0bb1df0788da6e849c42617af3aa28db7e4d
artifacts:
  - docs/reports/next-release/r1-s-prep-review.md
  - docs/assignments/next-release/r2-l-r1-f-smoke-review.md
verification:
  - "Shared gate reused from r2-l-review.md: same clone, same unchanged revision 405ffe2, same single lock hold. node_modules/.bin/tsc -p evals/next-release-native-smoke/tsconfig.json exit 0; bun test --timeout 30000 evals/next-release-native-smoke exit 0, 8 pass 0 fail; just check, just release-check, bun run test (90) and just test all exit 0"
  - "Disposable live-flow repro, under the lock: an OS-temp script imported the packet's prepare.ts/check.ts/lib.ts from the clone. It prepared a non-control packet, committed the evaluator fix plus a report on the checked-out branch as the brief instructs ('commit your work'), then ran check(). Checked-out branch main; manifest candidate = base 2fd7dac…; subject commit 6cb9629…; acceptance exit 2 candidate_mismatch; scope exit 0, ok true, zero changed paths"
  - "Manual: the subject-visible fixture and briefs have no marker or solved disposition. The evidence directory is sanitized (no host paths, <scratch>/<home> placeholders). The install reports record source_revision 5ab142b and historical 91ea9b2 with final_candidate_evidence false"
  - "git diff --check over the unit range is clean; the only range-wide whitespace report is the historical r2-l.md EOF blank line disclosed in r2-l-review.md"
review:
  - "Blocking B1: live-run check path is not wired to the subject's commit"
  - "Optional O1: probe treats an absent negative path as exclusion evidence"
  - "Optional O2: README 'Visible to a subject' column states intent, not actual exposure"
  - "Optional O3: fixture Git commands inherit the host user's Git configuration"
discoveries:
  - "The live repro shows the base and control evidence are sound but say nothing about the live path. The base run's 'scope ok' is vacuous (base..base)."
  - "No workflow SKILL body was opened or searched during this review."
blockers:
  - "B1 must be corrected and re-reviewed before the packet is used for any live row."

# R1-S-PREP and R1-S-PREP-TYPES review (part of R-RV-LFS)

Scope: `eb8f0bb..405ffe2`: the packet `evals/next-release-native-smoke/**`, the `r1-s-prep-evidence/**`, and the R1-S-PREP and R1-S-PREP-TYPES assignments and reports. Checked against the frozen reliability plan R1-S section, the answer-access boundary and the common contract. The harness-eval technical contract `skills/ruach-harness-eval/references/config.md` was read only for checker semantics.

## Confirmed

- **Fixture and scope.**
  - The committed off-by-one fixture has four visible tests; three fail at base.
  - Tests are stored as `*.fixture` and restored by `prepare.ts`, so the packet suite doesn't discover them.
  - Scope allows `src/` and `docs/reports/smoke.md`, protects `tests/`, `AGENTS.md` and `package.json`, and requires a clean tree.
  - Config, scope and manifest are written under `<out>/evidence`, outside the candidate.
  - Fresh-path refusal and the no-overwrite tag rule are tested.
- **Briefs and answer access.**
  - The assisted brief names the role and skills. The unassisted brief has no Ruach, role, skill, route or install hints, and a test enforces this.
  - The rubric, solved source and marker are under `evaluator/`.
  - The README and report state that the plugin layout exposes the whole repository, including `evals/` and the evidence's hidden-check program. The default is therefore ordinary non-blind smoke with blind unverified; no blind claim is made, and isolated homes are not presented as exclusion.
  - The exposed control program is retained with that label.
- **Bounded children.** `lib.ts` `run` uses argv without a shell, its own process group, a timeout, a bounded drain and a group kill on return. `GIT_*` variables are stripped from child environments.
- **Install controls.** `offline-install.ts` clones into temp, checks out the explicit resolved revision and passes isolated `HOME`, `CODEX_HOME` and `CLAUDE_CONFIG_DIR` through env objects. It records the host Bun cache, keeps the historical 0.3.0 route separate, and marks every report `final_candidate_evidence: false`.
- **Matrix.** Five rows plus a separately named fallback. Same model, effort and permissions for the plugin and adapter rows. The `supplied_at_execution` list covers source SHA, model/effort, permissions, readiness, account, budget and the access boundary. Status is pending authorization, and there is no plugin/role packaging decision.
- **Typecheck.** The packet-local `tsconfig.json` extends root and includes scripts, tests, fixture `src` and evaluator `src`; `tsc` exits 0. The README states that root checks don't cover the packet and that the check is static only.

## Blocking finding

### B1: the live-run check path evaluates the base, not the subject's commit

- **Location:** `scripts/prepare.ts`, where a non-control run does `git branch candidate` and leaves HEAD on `main`, records `manifest.candidate = base` and sets config `candidate: 'refs/heads/candidate'`. Also `scripts/check.ts`, which passes `manifest.candidate` to scope-check. The README "Commands", the `matrix.json` common checks and `briefs/*.md` ("commit your work") give no instruction about the candidate branch.
- **Problem:** A subject following the brief commits on the checked-out `main`, so `refs/heads/candidate` stays at base.
  - harness-eval acceptance requires HEAD to equal the configured candidate ref (`references/config.md`: "HEAD must equal the resolved candidate at setup"). It therefore fails setup with exit 2 `candidate_mismatch` and runs no checks.
  - scope-check compares `base..manifest.candidate`, which is `base..base`. It returns exit 0, `ok: true` and zero changed paths, so the subject's edits are never assessed.

  The packet's own protected-test negative control works only because the test commits on `candidate` and then hand-edits `manifest.json` (`tests/smoke.test.ts`, "the unfixed base fails acceptance…").
- **Why it matters:** The R1-S-PREP assignment requires a packet that defines the exact checker use, with actual fixture refs and the clean-tree contract, for future live rows. As shipped, the documented live flow produces no acceptance result and a misleading scope pass. A careless operator could record that as scope evidence.
- **Evidence:** the disposable repro above. Acceptance exit 2 `candidate_mismatch`; scope exit 0, ok, `[]` changes, against subject commit `6cb9629` versus manifest candidate equal to base `2fd7dac`.
- **Direction (author's choice):**
  - Either make the subject's working ref the evaluated ref (for example, check out `candidate` in the prepared consumer), or have `check.ts` resolve the candidate commit at check time from the configured ref or the subject HEAD and record it.
  - Refuse a live check whose candidate equals base, unless it is the explicit base run.
  - Add a packet test that drives the documented flow (commit on the checked-out branch, then `check.ts`) with no manifest hand-edit.

## Optional findings

**O1: `probe.ts` treats an absent negative path as exclusion evidence.**
- **Location:** `scripts/probe.ts`, in `attempt` and the `reasons` logic.
- **Problem:** `attempt` returns `absent` on ENOENT, and only `exposed` or `readable-no-marker` add a reason. A mistyped or stale negative path therefore yields `exclusion-evidenced-for-this-boundary-only`. Likewise, nonexistent `inventory_roots` are skipped silently.
- **Why it matters:** The plan requires probing known marker locations, with reads denied or demonstrably unreachable. ENOENT is only "demonstrably unreachable" if the evaluator confirms, outside the boundary, that the path holds the marker.
- **Direction:** Require a recorded evaluator-side confirmation per negative path (or per inventory root), or classify `absent` as unverified unless it is paired with that confirmation. Do this before any blind claim relies on `probe.ts`. No blind claim is made today, so this is not blocking.

**O2: the README's "Visible to a subject" column states intent, not actual exposure.**
- **Location:** `README.md`, layout table.
- **Problem:** The column marks `evaluator/` etc. as "no", while the paragraph above it says plugin installs expose them.
- **Direction:** Rename it to "Provided to the subject", or add "(intended; not enforced)" so it can't be read as an exclusion claim.

**O3: fixture Git commands inherit the host user's Git configuration.**
- **Location:** `scripts/lib.ts` `git`/`childEnv` (HOME inherited, `GIT_CONFIG_*` stripped).
- **Problem:** Fixture commits inherit the host user's `~/.gitconfig`: signing, hooks paths and similar settings.
- **Why it matters:** Only for hermeticity on a differently configured host.
- **Direction:** Optionally pass `-c commit.gpgsign=false -c core.hooksPath=/dev/null`, or an isolated HOME, for fixture Git calls.

## Limitations

- No model subject, native CLI, plugin or marketplace, Skills CLI, Codex discovery or live Herdr operation was run.
- Readiness and offline controls are not native behavior or model-use proof.
- The offline install test was exercised only through the packet suite; the author's committed evidence was inspected, not regenerated.
- This unit review is not combined-candidate acceptance.
