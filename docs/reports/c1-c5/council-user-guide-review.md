task: COUNCIL-USER-DOC-REVIEW-01
status: complete
outcome: No material findings; the owner-facing council guide is useful and consistent with the canonical contracts.
baseline: 47cd46aaf9b808bd226f249899eab269100325f7
candidate_revision: e4918b18c1651366c8d3de220276f2ac17713da7
reviewed_revision: e4918b18c1651366c8d3de220276f2ac17713da7
tested_revision: d628f3aa41b11e682af6fe4296309319349650a1
evidence_revision: d628f3aa41b11e682af6fe4296309319349650a1
artifacts:
  - docs/assignments/c1-c5/COUNCIL-USER-DOC-REVIEW-01.md
  - docs/reports/c1-c5/council-user-guide-review.md
verification:
  - "Passed: timeout 300s just check, exit 0; resource/link checks and TypeScript typecheck."
  - "Not verified: environment on initial timeout 300s bun run test, exit 1; 106 pass, four fixture Unix-socket EPERM failures, 946 assertions."
  - "Passed after one assignment-authorized scoped escalation: timeout 300s bun run test, exit 0; 110 pass, zero fail, 1315 assertions across 11 files. Initial evidence retained; no registered-flake authority used."
  - "Passed: bun /tmp/council-user-doc-review-01.p3qXap/check-links.ts, exit 0; seven added links in the immutable candidate resolve, no anchors, exact product file scope."
  - "Passed: immutable diff scope, unchanged product in report-only successor, git diff --check for both revision ranges, and assignment digest comparison."
  - "Passed: timeout 120s bun skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-user-guide-review.md --repo /opt/dev/ruach-worktrees/c16-council-review, exit 0; schema and all revision references valid."
review:
  - "Independent source review complete; no blocking findings or optional corrections identified."
discoveries:
  - Native independence, C1/council demonstrations and release/delivery gates remain separate and unchanged.
blockers: []

Reviewed only `47cd46aa..e4918b18`: 92 lines in `docs/council.md` and one
README navigation sentence (94 added lines including spacing). Immutable
`e4918b18..d628f3aa` adds only the original Implementer assignment and handoff;
the product and canonical inputs are unchanged. My executable checks ran at
`d628f3aa`, using existing dependencies through temporary checkout-local links,
without installation or lock changes. This review adds only its unchanged
assignment and this report; the creating commit and final clean status are
returned separately.

No material findings. The acceptance review established:

| Guide location | Evidence and conclusion |
| --- | --- |
| `docs/council.md:3`, `:7` | Copyable request identifies question, evidence/revision, named expertise, existing advisory roles, authorized route placeholders, exact total rounds, time/read budgets, advice-only scope, durable outputs and separate adoption. It helps an owner prepare a request without copying an operational protocol. |
| `docs/council.md:24` | Brief prepared-0.7 disclosure accurately retains the capability hold, rejects worktree/prompt promises as isolation proof and links the current boundary decision. That decision requires a concrete capability/boundary delta; the guide revives no trust question or unsupported next probe. |
| `docs/council.md:35`, `:46` | Role, identity/expertise and route remain distinct; shared roles/models and consumer-declared read-only roles are allowed. Explicit alternatives, separate wrapper permissions, repository-specific catalogs and no fallback match the routing reference and existing role contracts. No universal/native support is promised. |
| `docs/council.md:57` | All three modes match the council source: manual closure then pause; exact positive N including round one with no agreement stop; separately authorized up-to-N stability across two closed rounds without consequential proposition/evidence/assumption/disposition change. N=1, supported minority objections and no voting/default adoption are explicit. |
| `docs/council.md:69`, `:75`, `:84` | Brief ownership stays in existing records/assignments, roles and catalogs. Actual reports and Coordinator dispositions precede closure/exchange; open answers remain excluded. Attributed objections, evidence limits, adoption, resumption and explicit continuation/amendment authority match the rounds reference and member specimen. No new interface or implementation/delivery authority is introduced. |
| `README.md:31`, `docs/council.md:27`, `:51`, `:89` | Navigation is discoverable, Markdown is readable, and all seven added relative links resolve in the candidate Git tree, including the catalog directory. No installed-doc paths or anchors need inference. |

Canonical council workflow/rounds were inspected strictly as product source,
alongside the member specimen, routing reference, Scout/Architect contracts,
boundary decision, CONTRIBUTING and source-ownership ADR. No workflow was run.
No code or tests were added or modified, and no affected executable skill suite
applies. Existing documentation assertions check selected text/links, not owner
comprehension or actual council independence; the source comparison above
provides the prose review. The failing root fixtures bind local sockets at
`tests/agent-waiting.test.ts:142` before their behavioral actions. All four
initial failures showed `listen`/`EPERM`; the same recipe passed with socket
access. This is an environment disposition, not a registered flake or a claimed
documentation regression. Assertion totals are observations, not coverage claims.

My full outputs and start/end/exit metadata are retained in
`/tmp/council-user-doc-review-01.p3qXap/`. Cwd for every check was
`/opt/dev/ruach-worktrees/c16-council-review`. `just check` ran
2026-10-26 09:16:23 UTC; initial tests ran 09:16:23–09:16:39; the sole scoped
rerun ran 09:17:46–09:18:08. Neither recipe timed out.

| Full log | SHA-256 |
| --- | --- |
| `just-check.log` | `077997bed1f9b4967cac420dfa163139d6a49c915ad4584a436b7742cce310e5` |
| `root-test.log` | `73a11e6833ad336bf316c796d133333d9bb6c7ef1cd7ccfc3f0596321e954853` |
| `root-test-escalated.log` | `5346ef8b45c015ee88fcc930367a02065a760e499f043ea9889e11885a5fdab8` |
| `links.log` | `a16b808b5d408c078cb7adb4495d30311b93b77ac171b17466868cd3f5834ad1` |
| `handoff-validation.log` | `373fef8d8ec0c373c9e55bf9097b936111f38bd8155382141b7de66bbde5039b` |

The original handoff at `d628f3aa` records tests of `e4918b18`. Read-only audit
of `/tmp/council-user-doc-01.nLbVnh/` corroborated its successful check/release
output, seven-link result, successful handoff JSON, initial 106-pass/four-EPERM
test output and escalated 110-pass/zero-fail/1359-assertion output. Those exits
are recorded Implementer evidence, not my executions or reconstructed process
receipts. Its link checker used HEAD at execution and printed the exact candidate;
my checker instead pins both immutable revisions. Its original assignment digest
still matches `2b3f79dd6ec2089b3084f7e6c3d6298306e0982e74b921c9039999e2fe07ef44`.
My assignment remains unchanged at
`90dc3e998f987dec3f6fc731ce5244fc31b0f0a418888277df1aa17a8ed36b8b`.
`git diff 47cd46aa e4918b18 --check` and
`git diff e4918b18 d628f3aa --check` both exited 0.

Native/model/council execution, browser/product behavior, installation and
delivery were not run or certified. No historical C1–C5 acceptance is reopened.
The next concrete reuse is Coordinator consumption of this documentation review;
no correction is requested. Mechanical handoff validation does not establish
native capability or delivery authority. Coordinator retains cleanup ownership.
