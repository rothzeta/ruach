# Independent checks — WAVE2 preparation review

All commands run from the named retained review worktree. Dependency setup was
`bun install --frozen-lockfile` in the repo root and in skills/ruach-handoff,
skills/ruach-herdr, skills/ruach-harness-eval (frozen lockfiles, no global config),
plus the canonical /opt/dev/ruach/skills/ruach-handoff for the validator.

| Check | View | Result |
| --- | --- | --- |
| just check | guidance @c874310b | exit 0 (resource identities, eval placement, relative Markdown targets, tsc clean) |
| just release-check | guidance | exit 0 (Release v0.3.1 metadata verified) |
| bun run test | guidance | exit 0, 100 pass / 0 fail, 10 files, 14.55s |
| bun test (skills/ruach-handoff) | guidance | exit 0, 28 pass / 0 fail, 13.45s |
| canonical validate guidance.md --repo | guidance | ok true (tested_revision d657f71 resolves) |
| guidance delivery.md examples (helper) | guidance | 3/3 exit 0; negative control exit 1 REVISION_MISSING |
| just check | r45 @818ed627 | exit 0 |
| just release-check | r45 | exit 0 |
| bun test --timeout 30000 evals/ruach-permissions | r45 | exit 0, 7 pass / 0 fail |
| bun test --timeout 30000 evals/ruach-communication | r45 | exit 1, 9 pass / 1 fail (reproduced twice) |
| bun x tsc -p evals/ruach-permissions/tsconfig.json | r45 | exit 0 |
| bun x tsc -p evals/ruach-communication/tsconfig.json | r45 | exit 0 |
| canonical validate r45/preparation.md --repo | r45 | ok true (candidate/tested aac679ed) |
| just check | r67 @afcd17c | exit 0 |
| just release-check | r67 | exit 0 |
| bun test --timeout 30000 evals/ruach-handoff-delivery | r67 | exit 0, 8 pass / 0 fail |
| bun test --timeout 30000 evals/ruach-verification | r67 | exit 0, 11 pass / 0 fail |
| bun x tsc -p evals/ruach-handoff-delivery/tsconfig.json | r67 | exit 0 |
| bun x tsc -p evals/ruach-verification/tsconfig.json | r67 | exit 0 |
| canonical validate r6-r7/packets.md --repo | r67 | ok true (candidate/tested 6d802ec, source_baseline cf52c78) |
| CLI controls: fresh prepare / reuse-refused, permissions temp/unix/tcp probes | r45+r67 | fresh exit 0, reuse exit 2, probes exit 0 (tcp ephemeral 127.0.0.1:0) |

Not run / limits: root bun run test was run once on the guidance view only; it
executes ./tests and does not include the evals/ or skill suites, so it was not
re-run on r45/r67. No native subject, paid evaluation subject, benchmark, server,
production port, blind access or task-resource release was performed. The r45/R5
failures were reproduced, not retried until green.
