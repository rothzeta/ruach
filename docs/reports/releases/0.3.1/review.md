task: RELEASE-0.3.1-REVIEW
status: complete
outcome: "Independent review of the exact 0.3.1 candidate dac18d3f (tested/source 4cca79b9, baseline d75039a): the reviewed R1-R3 product source and tests are byte-identical to 94cdfa1a; publication scope, sanitization and the sanctioned docs/operations.md link repair are correct; required checks pass. No blocking findings; four low/nit documentation findings (payload-count wording, a byte-identity count off by one, one stale CHANGELOG anchor, and two trailing blank lines). No hosted, native, blind or behavioral result is claimed."
verdict: no-blocking-findings
candidate_revision: dac18d3fc2de67ecd2ab92d445040b2aed768e9b
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: dac18d3fc2de67ecd2ab92d445040b2aed768e9b
reviewed_source_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
baseline_revision: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/review.md
  - docs/reports/releases/0.3.1/review-evidence/verification.txt
  - docs/reports/releases/0.3.1/review-evidence/publication-scan.txt
  - docs/assignments/release-0.3.1/review.md
verification:
  - "Identity: HEAD dac18d3fc2de67ecd2ab92d445040b2aed768e9b; working tree clean except the untracked unchanged assignment docs/assignments/release-0.3.1/review.md; the d75039a->4cca79b diff is the release content and 4cca79b->dac18d3 adds only preparation.md and its assignment"
  - "Manifest: publication-manifest.txt header count 173 and 173 unique payload paths parsed; all 173 present at tested 4cca79b; every working-tree blob equals the candidate blob (0 mismatches); the baseline->tested diff is exactly the 173 payload paths plus publication-manifest.txt itself"
  - "Source correspondence: scripts/install.ts, tests/install.test.ts, tests/fixtures/install-lock-preload.ts, all skills/ruach-herdr scripts+tests, agents/*.md, docs/coordination.md, docs/examples/*, docs/regression-cases.md, docs/roadmap.md, docs/native-parity.md and .github/workflows/ci.yml are byte-identical to reviewed 94cdfa1a; 91 payload files are byte-identical to 94cdfa1a; within delivery-inter-payload only CHANGELOG.md (0.3.1 entry) and docs/operations.md differ"
  - "Publication-only deviations: docs/operations.md R2-B link retargeted from the excluded reports/next-release/r2-b.md to the public reports/releases/0.3.1/r2-b-boundary.md; package.json, .claude-plugin/plugin.json, marketplace.json, README.md and CHANGELOG.md advanced 0.3.0->0.3.1 with consistent examples; no skill-local version changed"
  - "Acceptance evidence: docs/design/0.4-suggestions-from-ramec-orchestration.md sha256 12-hex equals the owner working-tree copy (c2487a28...); docs/roadmap.md and docs/native-parity.md equal the owner working tree; 7 of 8 next-*-plan.md differ from the owner originals only by absolute-path/placeholder sanitization (no semantic edits) and next-release-reliability-plan.md, next-roadmap-plans.md and the RAMEC doc are identical"
  - "Publication scan (masked; values never echoed): 0 AWS keys, private-key blocks, GitHub/OpenAI/Slack real tokens, JWTs, SSH keys or UUIDs; the single 'sk-' literal is the synthetic redaction fixture at skills/ruach-herdr/tests/spaces.test.ts:322; all emails are *@example.test or @example.invalid; 0 /home, /Users, /opt, /tmp/ruach absolute paths; 0 session ids; .agents/.codex/node_modules matches are product names or prose"
  - "Links: 131 payload Markdown files checked; every relative file target resolves; one broken heading anchor found (F3)"
  - "Checks, cwd own worktree after bun install --frozen-lockfile in root and skills/ruach-handoff, ruach-herdr, ruach-harness-eval, ruach-changelog: just check exit 0; just release-check exit 0 ('Release v0.3.1'); bun run test exit 0 (100 pass, 0 fail, 10 files); skills/ruach-herdr bun test --timeout 30000 exit 0 (162 pass, 0 fail, 116.15s, local Unix socket); bun test --timeout 30000 evals/next-release-native-smoke exit 0 (14 pass); evals/ruach-coordination exit 0 (10 pass); bun x tsc -p for both packet tsconfigs exit 0"
  - "Reused, not repeated with scope reason: skills/ruach-handoff, skills/ruach-harness-eval and skills/ruach-changelog are absent from the payload and byte-unchanged since the accepted 0a1ca49 review (worker numbers 28/71/35)"
  - "git diff --check d75039a..dac18d3: two 'new blank line at EOF' findings (F4); working-tree git diff --check clean; bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/preparation.md --repo .: ok true, candidate/tested resolve to 4cca79b"
review: not-run
discoveries:
  - "F1 (low): preparation.md says '174 payload files' while the manifest header and its enumerated sections total 173; 174 is the baseline->tested changed-file count (173 payload + the manifest itself)."
  - "F2 (low): preparation.md's integrity line says '92 delivered files byte-identical to 94cdfa1a'; the diff supports 91 byte-identical, with docs/operations.md the one deviation and CHANGELOG.md differing by the release entry. The '92' appears to be the count of delivered files drawn from the reviewed revision, not the byte-identical count."
  - "F3 (low): docs/design/next-coordination-plan.md:27 links [Unreleased](../../CHANGELOG.md#unreleased), but the same candidate renamed the CHANGELOG 'Unreleased' heading to '## 0.3.1 — 2026-10-11', so the anchor no longer resolves; just check/release-check verify only file targets."
  - "F4 (nit): docs/reports/roadmap-planning/assignment-batch1-round2-coordination.md and -reliability.md carry a trailing blank line at EOF; the preparation report's 'git diff --check HEAD' checked only the empty uncommitted delta, not the candidate range."
  - "Real-behavior limits (unchanged from the candidate): only the historical task-local smoke, synthetic non-blind Enoch and authorization work were accepted; Enoch was accepted then discarded; resume failed on persisted-preservation/stale-record under runtime denial; ambiguity is unverified; no real-product, hosted-green, Claude/Codex or native-OpenCode-adapter result is claimed. No tag, merge or push was performed."
blockers: []

# Ruach 0.3.1 independent review

Reviewer: canonical Reviewer. Reviewed the exact candidate `dac18d3fc2de67ecd2ab92d445040b2aed768e9b` (tested/source `4cca79b9c628f80d4d20b897ac65dac7bcc85190`, baseline `d75039aa7b82b262e2f28af08630258fb7f77180`) against reviewed R1-R3 source `94cdfa1a68e214a07d27fc5d413863dcbe3e7459`. I made no source, doc or config edits, ran no native subject, read no workflow bodies, accessed no credentials, and did not tag, merge, push or write main.

## Verdict

No blocking findings. The reviewed product source and tests are byte-for-byte the accepted R1-R3 bytes; the publication set, its sanitization, and the single sanctioned `docs/operations.md` link repair are correct; all required checks pass. Four low/nit documentation findings are recorded; none affects behavior, security, source correspondence or acceptance.

## Findings (severity; location; problem; why it matters; evidence; direction)

### F1 — low — `docs/reports/releases/0.3.1/preparation.md:39`
- **Problem:** the report says the manifest holds "174 payload files", but the manifest header (`publication-manifest.txt:9`) and its enumerated sections total **173**.
- **Why it matters:** a consumer reading the report and the manifest gets two different payload counts for the same published set.
- **Evidence:** the manifest parses to 173 unique paths summing across its sections (5+19+72+10+65+1+1); `git diff --name-only d75039a..4cca79b` is 174 files = 173 payload + `publication-manifest.txt` itself.
- **Direction:** say 173 payload files (174 changed files including the manifest), or drop the count.

### F2 — low — `docs/reports/releases/0.3.1/preparation.md:24`
- **Problem:** the integrity line says "92 delivered files byte-identical to the reviewed revision 94cdfa1a, 0 mismatches". Independent blob comparison finds **91** byte-identical.
- **Why it matters:** the count overstates byte identity by one and is internally inconsistent with the same sentence's acknowledgement that `docs/operations.md` differs.
- **Evidence:** of the 93 paths shared by the R1-R3 delivery set and the payload, 91 blobs equal `94cdfa1a`; the other two are `docs/operations.md` (the sanctioned R2-B link repair, `b14caea`→`dbd09a4`) and `CHANGELOG.md` (the 0.3.1 entry). The "92" matches the count of delivered files drawn from the reviewed revision, not the identical count.
- **Direction:** state 91 byte-identical, then the operations.md deviation and the CHANGELOG release bump.

### F3 — low — `docs/design/next-coordination-plan.md:27`
- **Problem:** the published plan links `[Unreleased](../../CHANGELOG.md#unreleased)`, but this candidate renamed the CHANGELOG heading from `## Unreleased` to `## 0.3.1 — 2026-10-11`; the `#unreleased` anchor no longer resolves.
- **Why it matters:** a published accepted plan carries a broken cross-reference introduced by this release; the repo checks verify only that the file target exists, not anchors.
- **Evidence:** `CHANGELOG.md` has no `## Unreleased` heading after the 0.3.1 entry; an anchor check over all 131 payload Markdown files reports exactly this one unresolved anchor.
- **Direction:** retarget the link to the 0.3.1 heading or drop the fragment.

### F4 — nit — `docs/reports/roadmap-planning/assignment-batch1-round2-{coordination,reliability}.md`
- **Problem:** both published receipts end with a blank line at EOF; `git diff --check d75039a..dac18d3` reports "new blank line at EOF" for each.
- **Why it matters:** a small whitespace diagnostic in published files; the preparation report's "git diff --check HEAD" only inspected the empty uncommitted delta, so it did not cover this.
- **Evidence:** `git diff --check d75039aa7b82b262e2f28af08630258fb7f77180 dac18d3fc2de67ecd2ab92d445040b2aed768e9b` emits the two diagnostics; each file is 18 lines with line 18 empty.
- **Direction:** trim the trailing blank line; run `git diff --check` over the release range.

## Scope coverage

- **No unintended source/contract/test changes:** every product source and test blob (installer, `tests/`, all `skills/ruach-herdr` scripts and tests, roles, coordination docs, examples, `ci.yml`) is byte-identical to the reviewed `94cdfa1a`; the baseline->tested diff adds only manifest-listed files plus `publication-manifest.txt`.
- **No skipped affected verification:** I independently ran `just check`, `just release-check`, `bun run test`, the herdr suite and both packet suites/typechecks (all green). The unchanged skills (handoff/harness/changelog) are not in the payload; their earlier accepted-suite evidence is reused with that scope reason.
- **Publication exclusions are intentional and truthful:** the 84 excluded delivery paths are the private `next-release`/`r3` reports and assignments, `enoch-prep`, `native-prep` and `r2-b-evidence`; the public `r2-b-boundary.md` preserves the reviewed conclusion and attribution without raw transcripts, and `operations.md` links to it.
- **Sanitization:** the accepted plans and receipts differ from the owner originals only by absolute-path/placeholder substitution (`<ruach>`, `<planning-scratch>`, `<local-bin>`); plan semantics are unchanged. The owner RAMEC bytes are preserved unchanged (sha256 `c2487a28…`).

## Not verified / limits

Hosted CI, native/model behavior, blind boundaries, any real consumer task, Node 22 preparation and the R3 held-out evaluation were not observed. The accepted task-local evidence is only the historical smoke, synthetic non-blind Enoch (accepted then discarded) and authorization work; resume failed on persisted preservation/stale-record under runtime denial and ambiguity is unverified; no real-product, hosted-green, Claude/Codex or native-OpenCode-adapter result is claimed. No release tag, merge or push exists.

## Validation

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/review.md --repo .` and `git diff --check` on this change were run before commit; see `review-evidence/`.
