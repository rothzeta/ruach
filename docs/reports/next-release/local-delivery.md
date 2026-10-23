task: RUACH-ROADMAP-IMPLEMENTATION/R-LOCAL-DELIVERY
status: complete
outcome: "The reviewed owned bytes of 94cdfa1 (source and tested ac187d4) are in the /opt/dev/ruach main working tree as an uncommitted, unstaged diff: 177 files, every blob equal to the reviewed revision. Main HEAD is unchanged. No main commit, staging, merge, push or tag; no delivered_revision exists for uncommitted content."
baseline_revision: d75039aa7b82b262e2f28af08630258fb7f77180
candidate_revision: ac187d465337c33e0e35549ae245501ae10906ad
tested_revision: ac187d465337c33e0e35549ae245501ae10906ad
reviewed_revision: 94cdfa1a68e214a07d27fc5d413863dcbe3e7459
artifacts:
  - docs/reports/next-release/local-delivery.md
  - docs/assignments/next-release/local-delivery.md
  - docs/reports/next-release/local-delivery-files.txt
  - docs/assignments/next-release/combined-review2.md
  - docs/reports/next-release/combined-review2.md
verification:
  - "destination_before: /opt/dev/ruach branch main, HEAD d75039aa7b82b262e2f28af08630258fb7f77180, unstaged; protected owner hashes before and after: docs/roadmap.md 7e81217f..., docs/native-parity.md 248a8931... (both equal the frozen originals before the write), docs/design/0.4-suggestions-from-ramec-orchestration.md c2487a28... (equal before and after; not delivered)"
  - "Delivery set = git diff --name-status d75039a..94cdfa1: 177 paths (157 added, 20 modified). Written from the exact revision blobs (git show 94cdfa1:path), mode 755 preserved where the blob is executable; none were deletions or renames; docs/design, the root task record, .git, node_modules, .agents, .codex, settings and worktrees were not touched"
  - "Pre-write checks: the modified tracked paths scripts/install.ts, tests/install.test.ts, agents, CHANGELOG, ci.yml and the rest equal d75039a in main; only docs/roadmap.md and docs/native-parity.md differed from the base, and they equaled the frozen owner originals whose content the reviewed blobs incorporate. 50 added report or assignment exports already present, 49 of them in main were byte-identical to the reviewed blobs; docs/reports/next-release/enoch-prep/future-assignment.md differed and was replaced by its reviewed successor"
  - "Post-write: git hash-object of every delivered path equals git rev-parse 94cdfa1:path (177 of 177, 0 mismatches); main HEAD d75039a; nothing staged"
  - "Protected state: sha256 of all 84 other modified or untracked files in main outside the delivery set (planning plans, design exports, Coordinator task record, other exports) identical before and after; the git status path set differs only by delivered paths; git worktree list and the .worktrees directory list unchanged"
  - "Checks in /opt/dev/ruach under flock -w 1800 /tmp/ruach-implementation-20261011/verification.lock, timeout 300 s (600 s for bun run test): just check exit 0; bun run test exit 0, 100 pass 0 fail; just release-check exit 0; tsc -p for both packet tsconfigs exit 0; bun test --timeout 30000 evals/next-release-native-smoke exit 0, 14 pass; evals/ruach-coordination exit 0, 10 pass"
  - "Reused, not repeated: just test, bun audit in the three directories, coordination prepare, restricted-PATH and fetch simulations, handoff and herdr suites (combined-fix1.md at ac187d4 and independent review combined-review2.md 0a1ca49); the delivery changes no source after ac187d4"
  - "Review receipt and its assignment imported unchanged from 0a1ca49 into this branch as evidence only"
discoveries:
  - "Main node_modules and skill dependencies already existed, so no install ran. Hosted CI, native, blind and consumer results are still unobserved; Node 22 preparation remains the other worker's"
  - "The file list local-delivery-files.txt gives status, reviewed blob id and path per delivered file"
blockers: []

# R-LOCAL-DELIVERY report

Destination main working tree has uncommitted changes only. Exports to root after commit: this report, the file list, the unchanged assignment and the review receipt copies, written to the matching docs/ paths in the main working tree without altering other files.

## Validation

`bun skills/ruach-handoff/scripts/validate.ts docs/reports/next-release/local-delivery.md --repo .`: exit 0, ok true, 0 diagnostics. `git diff --check` on the staged change: exit 0.
