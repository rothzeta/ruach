task: RELEASE-0.3.1-PUBLICATION-REVIEW
status: complete
outcome: "Focused independent review of the 0.3.1 publication metadata import/repair at final reviewed_revision 15b7ef7 (my checkout stayed at 4c16ed7 per amendment v2). Verified: the metadata delta versus reviewed release 363da220 is 10 added docs files with zero product/source/test/plan bytes changed; the two-link repair is exactly 2 lines of docs/reports/releases/0.3.1/review.md and the imported review.md equals the cf7c77eb original bytes; full-range diff --check is clean; just release-check passes; the reused full-suite evidence and the not-yet-published receipt are accurate. The tracked content of 15b7ef7 passes the scripts/check.ts link rule (0 broken of 457 relative targets); just check executed in /opt/dev/ruach exits 1 only because check.ts walks the deliberately-stale untracked review worktree, so that failure is evidence about 4c16ed7, not the candidate. One low documentation note: the repaired review.md no longer quotes the plan's literal link path. No blocking findings; publication remains not performed."
verdict: no-blocking-findings
candidate_revision: 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a
checkout_revision: 4c16ed776a852661bd661ff40bd6ea792eaaecd1
source_revision: 363da220d06017101a5c85d876ae75da15171d73
baseline_revision: d75039aa7b82b262e2f28af08630258fb7f77180
destination_before: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/review-evidence/publication-review.md
  - docs/reports/releases/0.3.1/review-evidence/publication-review-checks.txt
  - docs/assignments/release-0.3.1/publication-review.md
  - docs/assignments/release-0.3.1/publication-review-v2.md
  - "reviewed metadata successors 668028a, a21e582, c2e6d4c, 4c16ed7, 15b7ef7"
  - "annotated tag v0.3.1 and native ruach--v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73 (local, unpushed)"
verification:
  - "Identity: /opt/dev/ruach HEAD and main = 15b7ef7; own worktree HEAD = 4c16ed7; annotated v0.3.1 and native ruach--v0.3.1 both resolve to 363da220 (local only)."
  - "Metadata delta: git diff --name-status 363da220..15b7ef7 = 10 added files, all under docs/ (release-0.3.1 assignments delivery/review/review2/publication-fix; reports review.md, delivery.md, publication-fix.md and review-evidence/{verification.txt,publication-scan.txt,review2.md}); 0 modified; 0 product/source/test/plan paths."
  - "Two-link repair: git show --numstat c2e6d4c = docs/reports/releases/0.3.1/review.md 2 insertions / 2 deletions only; git diff --quiet 668028a:review.md cf7c77eb:review.md = identical (import was faithful before the repair); review.md unchanged 4c16ed7..15b7ef7."
  - "Link targets: review.md carries exactly 2 four-level and 0 two-level CHANGELOG targets, pointing at the existing repo-root CHANGELOG.md; bounded helper over the 277 tracked 15b7ef7 Markdown files checked 457 relative targets -> 0 broken."
  - "git diff --check: d75039aa..15b7ef7, 363da220..15b7ef7 and 4c16ed7..15b7ef7 each exit 0 with no diagnostics."
  - "just release-check on read-only /opt/dev/ruach @15b7ef7: exit 0, 'Release v0.3.1: package, plugin, marketplace, agents and changelog verified'."
  - "just check on read-only /opt/dev/ruach @15b7ef7: exit 1; the single diagnostic is 'Broken target in .worktrees/release-0.3.1-publication-review/docs/reports/releases/0.3.1/publication-fix.md: path'. That path is the stale 4c16ed7 review checkout (tracked publication-fix.md line 26 holds the literal '[text](path)'); scripts/check.ts:33-44 walks .worktrees (only node_modules/.git/__pycache__ are ignored) and parses inline-code links. The same run in my own worktree @4c16ed7 exits 1 with 'Broken target in docs/reports/releases/0.3.1/publication-fix.md: path'. No tracked 15b7ef7 diagnostic was emitted."
  - "Reused, not rerun: full root/skill/packet suites from the source-identical tested 4cca79b9 (root 100, herdr 162, handoff 28, harness-eval 71, changelog 35; packet suites 14 and 10), as recorded by the preparation/review/delivery reports; zero source-byte change versus 363da220 keeps that evidence valid."
  - "Receipt accuracy: docs/reports/releases/0.3.1/delivery.md status=needs-decision; its outcome and Publication line state publication is NOT performed and claim no success; publication-fix.md records the repair, the retained cf7c77eb bytes and the pending push."
  - "Not verified: remote main and tags were not contacted (no network command was authorized); the remote baseline d75039a and absence of remote tags are taken from the assignment, not independently measured."
review: not-run
discoveries:
  - "N1 (workspace gate; evidence about 4c16ed7, not the candidate): just check at /opt/dev/ruach @15b7ef7 exits 1 solely because check.ts scans the untracked .worktrees tree, and the stale review worktree's 4c16ed7 publication-fix.md contains the literal [text](path). Refreshing or removing that worktree, or evaluating the gate in a .worktrees-free checkout, leaves only tracked 15b7ef7 content, which passes (0 of 457 broken). Published bytes are unaffected."
  - "N2 (low, non-blocking): the c2e6d4c repair changed review.md's quoted plan link from ../../CHANGELOG.md - the plan's literal path at docs/design/next-coordination-plan.md:27 - to ../../../../CHANGELOG.md, the report-relative path. check now passes, but the F3 text no longer quotes the plan verbatim; a reader cross-checking the plan sees a different path. The underlying anchor finding is resolved independently by FIX1's restored '## Unreleased' heading."
  - "No product behavior, version metadata, tag target, source contract or publication state changed by any reviewed successor; both tags remain local on 363da220."
blockers: []

# Ruach 0.3.1 publication review (focused, final candidate)

Reviewer: canonical Reviewer. Independently reviewed the final metadata-only publication candidate `15b7ef71aaf1b52f1d76b0687949a1aadf760b4a` (my checkout remained at `4c16ed7` per amendment v2; the `4c16ed7..15b7ef7` delta was read through shared Git objects). I made no source, doc, config or metadata edits, ran no native subject, accessed no credentials, and did not push, tag, merge or write main. All checks were read-only and driven from the own disposable Bun helper.

## Verdict

No blocking findings against `15b7ef7`. The metadata import and the two-link repair are exactly as described, zero product/source/test/plan bytes changed versus the reviewed release `363da220`, the required range hygiene and `just release-check` pass, the corrected receipt no longer claims a successful publication, and the reused full-suite evidence remains valid for the source-identical tested `4cca79b9`. Two non-blocking notes are recorded below.

## Findings (severity; location; problem; why it matters; evidence; direction)

### N1 — note — publication-gate workspace contamination (`/opt/dev/ruach @15b7ef7`)

- **Problem:** `just check` executed against read-only main `15b7ef7` exits `1` with a single diagnostic: `Broken target in .worktrees/release-0.3.1-publication-review/docs/reports/releases/0.3.1/publication-fix.md: path`. The flagged file is not a tracked path of `15b7ef7`; it is the deliberately-stale review worktree still pinned at `4c16ed7`, whose tracked `publication-fix.md` contains the literal pseudo-link `[text](path)`.
- **Why it matters:** the publication gate expects `just check` green. As the repository currently sits, that command is red, even though the final candidate's tracked bytes are clean. This is evidence about `4c16ed7`, not about `15b7ef7`.
- **Evidence:** `scripts/check.ts:33-44` walks the whole repository (only `node_modules`, `.git`, `__pycache__` are ignored) and matches `[text](target)` including inline code; the untracked `.worktrees` tree is therefore scanned. A bounded helper replicating that rule over the 277 **tracked** `15b7ef7` Markdown files found `0` broken of `457` targets. The same failure is reproduced inside my own `4c16ed7` worktree as `Broken target in docs/reports/releases/0.3.1/publication-fix.md: path`.
- **Direction:** Coordinator/harness cleanup - refresh or remove the stale review worktree, or evaluate the push gate in a `.worktrees`-free checkout - then re-run `just check`. No release-content change is required.

### N2 — low (non-blocking) — `docs/reports/releases/0.3.1/review.md:30,58`

- **Problem:** the `c2e6d4c` repair rewrote the report's quoted plan link from `../../CHANGELOG.md` to `../../../../CHANGELOG.md`. The former is the plan's literal target at `docs/design/next-coordination-plan.md:27`; the latter is only correct relative to the report's own directory.
- **Why it matters:** `check.ts` now passes, but the F3 prose ("the published plan links ...") no longer quotes the plan verbatim, so a reader verifying F3 against the plan sees a different path.
- **Evidence:** `docs/design/next-coordination-plan.md:27` = `[Unreleased](../../CHANGELOG.md#unreleased)`; `docs/reports/releases/0.3.1/review.md:30,58` = `../../../../CHANGELOG.md#unreleased`; `git show --numstat c2e6d4c` = `2/2` in that one file.
- **Direction:** optional - mark the path as report-relative, reference the plan path, or drop the fragment. The underlying stale-anchor finding is already resolved by FIX1's restored empty `## Unreleased` heading, so this is cosmetic.

## Confirmed scope

- **Metadata-only delta:** `363da220..15b7ef7` is 10 added files under `docs/` and no modifications; no scripts, skills, agents, tests, evals, `.github`, `docs/design`, version manifests or other product/source/plan byte changed (all 381 payload paths remain blob-identical to `363da220`).
- **Repair fidelity:** the imported `review.md` at `668028a` is byte-identical to the original `cf7c77eb`; `c2e6d4c` changes only two lines in that file; both repaired targets resolve from the report location and `0` tracked relative targets are broken at `15b7ef7`.
- **Receipt truthfulness:** `delivery.md` is `needs-decision`, states publication is NOT performed, and contains no success claim; both tags remain local on `363da220`.
- **Evidence reuse:** the full root/skill/packet suites are explicitly reused from the source-identical tested `4cca79b9`; no new full suite or evaluation subject was warranted or run.

## Not verified / limits

Remote `main` and both tags were not contacted (no network command authorized), so the remote baseline `d75039a` and remote tag absence rest on the assignment. `just check` is currently red only because of the stale worktree described in N1; the candidate's tracked content passes the same link rule. Hosted CI, native/model behavior and any real consumer task were not observed.

## Validation

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/review-evidence/publication-review.md --repo /opt/dev/ruach/.worktrees/release-0.3.1-publication-review` and `git diff --check` were run before commit; raw helper output is in `review-evidence/publication-review-checks.txt`.
