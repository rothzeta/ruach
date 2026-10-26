task: CI-PORTABILITY-070-FIX-01
status: complete
outcome: "Prepared portable editorial views for all 82 observed machine-local evidence hyperlinks, preserving originals and facts with explicit provenance. Assigned checks pass; no immutability-contract blocker found. Independent review and separate main-only delivery remain pending."
candidate_revision: c77727b4562de46803f469f9501ea753cd67ec9c
tested_revision: c77727b4562de46803f469f9501ea753cd67ec9c
source_baseline: 22b450388c0f12a0a7766a25f4337e4a474a8a4b
published_revision: e37645b11ea012f98b213f6eddc38b513cb9248c
destination_before: e37645b11ea012f98b213f6eddc38b513cb9248c
artifacts:
  - docs/assignments/c1-c5/CI-PORTABILITY-070-FIX-01.md
  - docs/reports/c1-c5/ci-portability-fix-070.md
  - docs/reports/releases/0.7.0/ci-portability.md
  - docs/reports/releases/0.7.0/ci-portability-artifacts/provenance.json
  - docs/reports/releases/0.7.0/ci-portability-artifacts/verification.json
  - /tmp/ruach-070-ci-portability-m63q75
  - /tmp/ruach-070-ci-portability-m63q75/portable-source
verification:
  - "Allocated actual CI failure inventory matches exactly 82 report/target edges: 74 temporary evidence paths and eight external consumer-source citations across the assigned seven reports."
  - "Original Git/import blobs, labels, target strings and all factual bytes recover exactly after reversing only declared markup and seven editorial notices. All 41 other original links unchanged; original import manifests unchanged; original/curated hashes verified."
  - "Exact committed candidate: just check, bun run release-check and root bun run test pass, exit 0; root 110/0. Direct assignment-supported socket access used without repeating the known failing sandbox recipe."
  - "Unchanged public checker passes against a relocated exact-candidate Git archive; active link inventory has zero machine-local targets. No former targets hidden/deleted, dummy files, checker policy or coverage changes."
  - "All managed roles/skills/runtime/checker/tests/dependencies/metadata/version and guide remain equal to e376. Main and immutable local/remote tag objects/targets unchanged; 242 installed/metadata hashes and 39 discovery identities preserved."
  - "Canonical handoff validator and final owned scope/privacy/local-link/staged diff checks pass. Mechanical validity is not independent review or hosted acceptance."
review: not-run
discoveries:
  - "The prior broad temporary-link description is refined by actual log comparison: eight failures are absolute /opt/dev/ramec or /opt/dev/pralice evidence citations, not /tmp paths. No retained consumer was inspected or modified."
  - "Existing import hashes describe original as-imported snapshots. Current seven curated views intentionally differ and carry explicit sidecar hashes; published tags and original recovery revisions retain exact historical blobs."
  - "No standing forever-equal working-tree report contract was found in inspected ownership/checker/tests/import guidance; explicit authorized curation preserves immutable originals without weakening a check."
blockers: []
temporary_worktrees: []

Exact candidate/tested revision is **c77727b4562de46803f469f9501ea753cd67ec9c** on
`ruach/c17-release-prep`, based on `22b4503` including the prior delivery receipt.
This unchanged assignment, handoff and verification JSON are recorded in a later
support-only commit, whose creating SHA is returned separately. No main merge,
push, tag, global install, version, native/model or retained-consumer change occurs.

The nine-file candidate changes only machine-local hyperlink markup in the seven
assigned historical reports, adds seven separate editorial notices, and adds the
[portability explanation](../releases/0.7.0/ci-portability.md) plus
[original/curated provenance](../releases/0.7.0/ci-portability-artifacts/provenance.json).
The existing public checker is unchanged. Normal repository/relative/HTTP(S)
links remain active; all 82 machine-local labels and target strings remain literal
readable evidence locations. They are not presented as downloadable repository
artifacts. No factual statement, outcome, build/source identity, raw digest or
leading handoff metadata is revised.

Original evidence is preserved in published **e376** and its original imported
source revisions. Each sidecar entry records exact original blob/revision/hash/
size, as-imported record and recovery command, curated hash/size, and every markup
replacement. The seven current views intentionally no longer equal their old
import hashes. Existing manifests and historical integration/review reports stay
unchanged as records of their observed snapshots; no re-import/current-byte-equality
claim is fabricated. The source ownership ADR protects immutable releases and
pinned installations; inspected checker/tests/import guidance does not impose
permanent equality on later editorial views. The explicit assignment amendment
permits these views with original snapshots preserved. **No genuine immutability
contract blocker was found.**

Actual raw scratch is **`/tmp/ruach-070-ci-portability-m63q75`**: full command streams,
argv/cwd/start/end/exit receipts, original CI edge inventory, helpers and private
preservation hashes remain there. The exact-candidate archive extraction is
**`/tmp/ruach-070-ci-portability-m63q75/portable-source`**, with its archive alongside.
No new Git worktree or detached checkout was created. The existing assigned
worker worktree is reused. These are the only new temporary resources; Coordinator
owns cleanup after review reuse. All prior delivery/prep/review raw evidence is
untouched. [Safe verification](../releases/0.7.0/ci-portability-artifacts/verification.json)
records results and full-log digests; `$R` aliases this exact scratch directory.

| Actual verification / bound | Result and limit |
| --- | --- |
| `bun $R/inventory.ts` / 120s | Final exit 0: immutable original reports/labels/targets and actual hosted failed log match all 82 edges, with original imported hashes verified. Initial diagnostic exited 1 because it assumed only /tmp edges; full failed receipt retained, then exact evidence identified the eight external source citations. |
| `bun $R/audit.ts` / 120s | Exit 0 before/after commit. Independently reads original Git blobs/import records and verifies exact labels/targets/counts; reversing only the declared markup/notices restores complete original bytes. Original normal-link inventory remains 41; all original/curated hashes match; old manifests and protected source are unchanged. |
| `just check` / 300s, exact candidate | Exit 0: resource identities/notices/local links and TypeScript. |
| `bun run release-check` / 300s, exact candidate | Exit 0: unchanged coherent 0.7.0 metadata. |
| `bun run test` / 300s, exact candidate | Exit 0, **110 pass / zero fail**, 1,291 observed assertions, 19.44s runner output. Existing correct root/Herdr dependencies reused read-only; handoff has the existing owned corrected install. No source/test edits, skips, dependency install or known-failing default rerun. |
| `git archive --format=tar --output=$R/candidate.tar c77727b4562de46803f469f9501ea753cd67ec9c`; extract / 120s each | Exit 0 each; isolated exact committed resource copy, not a new worktree. |
| `bun $R/portable-source/scripts/check.ts`, cwd $R / 120s | Exit 0 using the unchanged real checker and its full repository-link coverage. Whole-tree active-link inventory has **zero absolute machine-local targets**. This same-host archive check does not pretend former paths are absent: none were hidden/deleted; lack of dependency is additionally established by zero active edges and unchanged checker. No synthetic dummy targets or ignore rules. |
| Main/tag/global preservation reads and `git ls-remote` / 120s | Exit 0; main clean at e376, identical remote before/after, exact immutable tag objects/peeled targets, 242 bounded managed/metadata/settings hashes and all 39 known discovery identities unchanged. No global writes. |
| `bun skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/ci-portability-fix-070.md --repo /opt/dev/ruach-worktrees/c17-release-prep` / 120s | Exit 0; canonical structure and immutable revisions resolve. Final local links, owned staged scope, privacy patterns and diff whitespace checks pass. |

Public checker SHA-256 remains
`83ddff675e139b34f66434314fb8ba7d93d569f28de9066461396950b28acc4b`.
All `agents`, `skills`, scripts/checker, tests, CI, evals, config, dependencies/
locks, package/plugin/marketplace metadata, Just recipes, notices and source guide
remain byte-identical to e376. Existing import manifests and other reports outside
the authorized seven/new correction artifacts are unchanged from the task base.
The completed global 0.7.0 installation therefore needs no refresh for this docs
follow-up; the bounded before/after hashes and discovery identities agree.

Main/remote and both immutable release targets remain
**e37645b11ea012f98b213f6eddc38b513cb9248c**. Annotated `v0.7.0` object is
`7abf5ecd846807214595b155050cb9c49204c370`; `ruach--v0.7.0` object is
`a9c9467162864c390aa4f174f00bde7770101088`. Neither tag nor published original
report blob was rewritten. No current hosted green result is claimed:
[40314249964](https://github.com/rothzeta/ruach/actions/runs/40314249964) remains the
actual failing original run. Corrected hosted execution requires independent
review and a separately authorized **main-only documentation** follow-up; no
version bump/tag/global refresh is included here.

CI-PORTABILITY-070 attempt 1 began with **zero completed failed correction cycles**,
remaining default two. Assigned verification now passes; independent review is
pending. The inventory refinement is an ordinary diagnostic iteration, not a
handed-off failed correction or a budget reset. RR070-01 and other historical
outcomes/budgets remain unchanged. Existing C1/C2/native/listening/quality/cost
limits remain exactly those in the retained evidence. No full529/audit/installer
or capability repetition was warranted by markup-only changes.
