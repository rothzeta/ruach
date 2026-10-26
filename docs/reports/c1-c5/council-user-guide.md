task: COUNCIL-USER-DOC-01
status: complete
outcome: Added a bounded owner-facing council setup guide and README navigation link.
candidate_revision: e4918b18c1651366c8d3de220276f2ac17713da7
tested_revision: e4918b18c1651366c8d3de220276f2ac17713da7
artifacts:
  - docs/council.md
  - README.md
  - docs/assignments/c1-c5/COUNCIL-USER-DOC-01.md
  - docs/reports/c1-c5/council-user-guide.md
verification:
  - "timeout 300s just check: exit 0; resource/link checks and TypeScript typecheck passed."
  - "timeout 300s bun run test (sandbox): exit 1; 106 pass, 4 fail from EPERM binding local fixture Unix sockets."
  - "timeout 300s bun run test (scoped escalation): exit 0; 110 pass, 0 fail, 1359 assertions across 11 files."
  - "timeout 300s bun run release-check: exit 0; prepared 0.7.0 metadata verified."
  - "bun /tmp/council-user-doc-01.nLbVnh/check-links.ts: exit 0; all 7 added local links resolve in the candidate Git tree."
  - "git diff --check and git diff 47cd46aaf9b808bd226f249899eab269100325f7 HEAD --check: exit 0."
  - "sha256sum docs/assignments/c1-c5/COUNCIL-USER-DOC-01.md: unchanged at 2b3f79dd6ec2089b3084f7e6c3d6298306e0982e74b921c9039999e2fe07ef44."
  - "timeout 120s bun skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/council-user-guide.md --repo /opt/dev/ruach-worktrees/c16-council-guide: exit 0; schema and candidate/tested revisions valid."
review: not-run
discoveries:
  - Native independence and full council demonstrations remain capability-held; this documentation does not change that boundary.
blockers: []
launch_temporary_directory: unknown; not supplied in the assignment or bootstrap

The guide leads with a copyable natural-language brief, distinguishes roles,
member expertise and routes, explains the three round modes and budgets, and
describes task-record ownership, closed reports, synthesis, adoption and resume.
It links the existing mechanics and current boundary decision without creating a
schema, CLI or operational workflow. README adds one short navigation sentence.
No protected source or executable changes, integration, delivery, push, global
installation, native experiment or runtime council was performed.

Checks ran from `/opt/dev/ruach-worktrees/c16-council-guide`. Full verification
output and the disposable link checker are retained outside the repository in
`/tmp/council-user-doc-01.nLbVnh/`: `just-check.log`, `bun-run-test.log`,
`bun-run-test-escalated.log`, `release-check.log`, `links.log` and
`handoff-validation.log`. The first root
test run's four socket denials were reported before one supported rerun with
scoped escalation; no tests were changed. No new tests or affected executable
skill suite applies to this prose-only assignment. Existing dependencies were
used through temporary checkout-local `node_modules` links without installation
or lock changes.

The initial sandbox staging/commit attempt could not write worktree Git metadata
under `/opt/dev/ruach/.git`; a scoped escalation created the documentation
candidate. The report/assignment commit records evidence after that tested
candidate. Its creating SHA is returned separately, not predicted here.
Independent review remains pending; mechanical validation does not establish
technical truth, acceptance or native council capability.
