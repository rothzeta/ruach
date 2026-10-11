task: RUACH-ROADMAP-IMPLEMENTATION/R-COMBINED-RV/enoch-prep
status: complete
outcome: "Independent review of the Enoch exercise preparation records at Ruach e10156d is done: 3 blocking preparation findings and 2 optional. Before launch, fix the answer exposure through clone history, the security-dialog wording and the report validator command. These preparation blockers do not affect the Ruach union verdict. No subject run, real-product or blind claim."
verdict: changes-required
reviewed_revision: e10156d897f4f4636bcaa876c08fc890ec185efd
enoch_clone_path: /tmp/ruach-implementation-20261011/enoch-exercise/clone
enoch_base_sha: d163a4132a6840d2604e6e17883612eb77a901ec
enoch_seed_sha: ea33fc70456bf45bdd51e6eedcb83cf5cdf89347
artifacts:
  - docs/reports/next-release/enoch-prep-review.md
  - docs/reports/next-release/combined-review.md
  - docs/assignments/next-release/combined-review.md
verification:
  - "Read via git show at e10156d only: docs/assignments/next-release/r1-enoch-prep.md, docs/reports/next-release/r1-enoch-prep.md, docs/reports/next-release/enoch-prep/** (.gitattributes, evaluator.md, future-assignment.md, provenance.json, seed.patch, base-vitest.txt, seeded-vitest.txt, seed-static-checks.txt, subject-brief.md)"
  - "Clone, validated in the clone (read-only git): HEAD ea33fc7 on refs/heads/ruach-exercise/url-encoding-seed, parent d163a41, message 'exercise seed', working tree clean, no remote, core.hooksPath /dev/null, no stash, reflog empty, branch ruach-exercise/url-encoding-subject absent, git diff base..seed sha256 b8f48d29... equals provenance seed_patch_sha256"
  - "Original /opt/dev/enoch (read-only): main...origin/main clean, HEAD d163a41, seed object absent"
  - "git -C clone show HEAD -- src/Enoch.Ui/src/api.ts prints the removed correct line (E1)"
  - "Planned validator command from the Ruach checkout: bun skills/ruach-handoff/scripts/validate.ts docs/exercise/report.md --repo <clone> exits 2 INPUT_UNREADABLE for /opt/dev/ruach/.worktrees/r1-r3-combined-review/docs/exercise/report.md (E3); clone status unchanged afterwards"
  - "config/agent-routing/roles.yaml implementer preferred claude-sonnet-5.5-medium: matches the future assignment"
  - "Seeded regression and static checks were not rerun: the recorded outputs are consistent with seed.patch, and running vitest would write caches into the clone kept for the subject"
discoveries:
  - "Even with E1 fixed, the clone's main branch and the readable original /opt/dev/enoch hold the correct code. Without a realized access boundary the exercise is answer-accessible and non-blind. The records already disclaim blind evidence, but they should not claim the cause is hidden."
blockers:
  - "E1-E3 are preparation blockers for the Enoch exercise launch only (Coordinator or preparation owner)."

# Enoch exercise preparation review

Separate from the [union review](combined-review.md). The owner's exact words were "add a fake task to enoch, then discard when done". The preparation chooses a reasonable reversible task: one seeded encoding defect in the pure helper `evidenceDownloadUrl` in `src/Enoch.Ui/src/api.ts`, with a failing Vitest regression. It needs no new dependency, service or network, and the original Enoch repository was left untouched. Enoch SHAs above belong to the clone and are kept out of Ruach revision fields.

## Blocking preparation findings

### E1. The clone history reveals the fix, contradicting the record

- **Location:** `docs/reports/next-release/r1-enoch-prep.md` (verification: "so the clone history does not reveal the cause") and `enoch-prep/future-assignment.md` (the subject branches from the seed in this clone).
- **Problem:** the seed `ea33fc7` is a normal child of the correct base `d163a41`, and the clone keeps `main` at the base. `git show HEAD` or `git diff main` shows `-  ...evidence/${encodeURIComponent(evidenceId)}` replaced by the defective line. Changing the commit message and purging the earlier object did not hide the diff.
- **Why it matters:** the "no answer exposure" premise and the provenance claim are inaccurate, and a subject can solve the task by reading one diff. The assignment asks for no answer exposure, and the grader cannot tell diagnosis from copying.
- **Evidence:** `git -C /tmp/ruach-implementation-20261011/enoch-exercise/clone show HEAD -- src/Enoch.Ui/src/api.ts` prints both lines. `git log` shows the parent `d163a41`.
- **Direction:** before launch, either give the subject a starting commit whose history has no correct parent (for example a parentless snapshot of the seed tree, with the base-to-seed mapping kept only in the evaluator records), or correct the records to say the answer is reachable through history and the original repository, and grade the run as answer-accessible. In both cases record that the original `/opt/dev/enoch` stays readable unless a boundary is realized. Do not correct the seed itself.

### E2. The future assignment lets the Coordinator answer native security dialogs

- **Location:** `enoch-prep/future-assignment.md` (Allowed interventions: "The Coordinator may answer native security dialogs only with the user's authority").
- **Problem:** the union's Coordinator role says "you never approve a native security dialog for a worker", and the task-record specimen says "Never relay or approve a native security dialog for a worker". The launcher output tells the user to approve the dialog themselves, or to explicitly authorize an assistant.
- **Why it matters:** this is the native role and security-dialog boundary the review was asked to check. As written, the packet contradicts the reviewed role contract it will run under.
- **Direction:** say that the user reads and answers any native dialog in the existing launch space (or explicitly authorizes an assistant, per the launcher contract), and that the Coordinator records it and does not relaunch.

### E3. The planned report validator command fails as written

- **Location:** `enoch-prep/future-assignment.md` (Report validation: `bun <reviewed-candidate>/skills/ruach-handoff/scripts/validate.ts docs/exercise/report.md --repo <clone>`, "run from the reviewed Ruach checkout").
- **Problem:** the validator resolves the report path against the current directory, which is the Ruach checkout, not the clone.
- **Evidence:** run from this checkout it exits 2 with `INPUT_UNREADABLE` for `.../r1-r3-combined-review/docs/exercise/report.md`.
- **Direction:** use `<clone>/docs/exercise/report.md` (absolute), or run with the clone as the working directory, and keep `--repo <clone>`. Acceptance item "the handoff validates" depends on this.

## Optional findings

- **O-E1. Node version.** Local Node is v24.21.0 while Enoch's rules name Node 22. This is disclosed. Record the Node version in the subject's verification, and do not present the result as Node 22 or full `just check` evidence. The records already decline the .NET and full checks.
- **O-E2. Clone durability.** The clone lives under `/tmp` and the gate depends on it "still existing unchanged". Before launch, the Coordinator's confirmation should compare HEAD, branch, clean status and the base..seed diff digest `b8f48d29...` (the checks above), not only that the path exists.

## Areas without material findings

The brief does not state the cause or the fix (it names only the owned file, which is a scope fact). Owned and protected paths are explicit, and tests are protected byte-for-byte. The commands are exact, with 300-second bounds. The route matches `roles.yaml`. The packet allows one bounded turn with a 20-minute limit and no retry or route change. The TASK_LOGS and CURRENT duties stay inside the clone, matching Enoch `AGENTS.md`. The discard policy (Coordinator removes the exercise tree; Ruach keeps a minimal patch, evaluator facts and provenance) is clear, and the evaluator file and `seed.patch` are marked as withheld. Subject launch and budget remain pending. Ordinary non-blind smoke is acceptable once E1 is disclosed or removed.

## Validation

I ran the canonical handoff validator `--repo .` and `git diff --check` on this report before committing it. I left the clone in place for the pending subject.
