task: C2-ADAPTER-01
status: complete
outcome: "Bounded non-Coordinator Agy preparation and Scout advisory route implemented and locally verified. Independent review and actual native advisory validation remain separate."
source_baseline: 75f10abc2af9c4b043b393d7352ce74ba6eb4016
source_revision: d95cee581167b7a65e74a02d056d2d07331112e9
candidate_revision: f17e9233ddf00830aa11032bebd9d8df2ff1b0f3
tested_revision: f17e9233ddf00830aa11032bebd9d8df2ff1b0f3
composition_evidence_revision: dbbd831a1566cba3c148fe60bf3ed44d7493ed66
composition_review_revision: 868aeab91d3b9f07bdc876c413d3c894ae14d839
accepted_launch_review_revision: 31b45220eaaa45d1407a8ed32d4604a51fbf2c70
artifacts:
  - docs/reports/c1-c5/c2-adapter.md
  - docs/assignments/c1-c5/C2-ADAPTER-01.md
  - skills/ruach-herdr/references/agy.md
  - /tmp/ruach-c2-adapter-vVoPhXvW
verification:
  - "Final just check: exit 0; resource identities, links and TypeScript pass."
  - "Final focused Agy suite: exit 0, 27 pass/0 fail."
  - "Final release-check: exit 0, existing v0.6.1 metadata verified."
  - "Final bun run test with authorized sockets: exit 0, 110 pass/0 fail."
  - "Final full affected Herdr suite with authorized sockets/PTY: exit 0, 268 pass/0 fail in 193.93 seconds."
  - "Protected source comparison, assignment integrity and git diff --check: exit 0."
  - "Canonical handoff validator --repo: exit 0, seven revision references resolved; resource check including this report: exit 0."
review: not-run
discoveries:
  - "Native medium effort is encoded in the exact model slug; portable route effort auto emits no separate effort flag. Ruach development policy explicitly supplies agy=inherit."
  - "Per-file expanded rule size and known filesystem skill conflicts can be gated; aggregate native rule inlining and declared/plugin discovery need actual session validation."
blockers: []

# C2 adapter handoff

`d95cee5` creates the implementation; `f17e923` corrects only a Markdown example caught by the resource checker. The latter is the final candidate. This report and the unchanged assignment are a subsequent evidence-only commit; its creating SHA is returned externally. This is the initial C2 adapter outcome, not another correction or reset of LAUNCH-LONG-ARGV. No source acceptance, delivery or live Agy acceptance is claimed.

## Behavior and boundaries

The existing Plan adapter now prepares exactly Agy 1.4.7 non-Coordinator workers. Before launch-space mutation it checks canonical role validity/size, supported include paths, installed help/version, exact current model catalog membership and known skill-name conflicts. The private root adds an always-on rule referring to the canonical role source and explicit source/reference context, plus symlinks to canonical technical skills. Canonical role bodies are neither copied nor truncated. Literal native argv is only model and added-root selection; role initialization remains separate from later assignment submission. Existing materialization, redaction, actual-checkout preparation, cleanup/retention and full-argv transport are reused.

Coordinator, unsupported effort, unknown pass-through and auto-review stay rejected. Native permissions are inherited; no native bypass, trust answer, replacement system prompt, headless provider runner or continuation adapter is added. The adapter reads supported help/version/catalog interfaces, never native private metadata/databases. No native settings, account roots, executable, consumer instructions or canonical resources are rewritten.

Only the exact `gemini-3.8-flash-medium` model/route and Scout alternative were added. The schema requires route effort, so `auto` represents omission of a separate native effort flag; native medium is already in the model slug. `scripts/agent-routing.ts` owns this consumer's explicit `agy: inherit` policy. Resolve/dry-run/start tests verify consistent policy forwarding. Existing preferred routes, Codex alternatives, Tester selection and other harness permissions are preserved; no fallback is introduced. Offline source resolution remains explicitly unverified/non-launchable and prints the policy source.

## Changed files and observable tests

- Production: `skills/ruach-herdr/scripts/adapters/agy.ts`; `scripts/agent-routing.ts`; `config/agent-routing/{models,routing,roles}.yaml`.
- Contracts/docs: `skills/ruach-herdr/SKILL.md`, `references/adapters.md`, new `references/agy.md`.
- Tests: new `skills/ruach-herdr/tests/agy.test.ts`, scoped fake-native support in `tests/fixtures/fake-cli.ts`, removal of Agy from two obsolete generic unsupported-adapter loops in `tests/worker.test.ts`, and `tests/agent-routing.test.ts`.

Twenty-seven public-worker tests cover actual generated rule/source include, technical-only links, preserved native discovery/config sentinels, private modes, exact arguments/policies, literal spaces/Unicode/quotes/backticks/dollar paths, source integrity, capability/model/role/size/conflict gates, absent native executable, resolve/dry-run/start agreement, real linked-checkout second-cwd inspection, no launch after late failure, redaction and uncertain/blocked retention. Assertions use authored expected inputs and public artifacts rather than the adapter's serializer or derived expected data. No formatting tests or weakened expected behavior were introduced.

Accepted transport helpers and their focused regression tests compare byte-for-byte unchanged to `f6d9c2c`; new skill bodies, roles and existing task evidence are unchanged. The source comparison also confirms the routing diff only adds the named model/route/Scout alternative and policy entry. No root README/roadmap/changelog/version/CI, product examples, global installation or delivery edits occurred. Root's unsubmitted `C-IN-01.md` remains untracked and uncommitted.

## Verification receipts

Evidence directory: `/tmp/ruach-c2-adapter-vVoPhXvW`. Worktree cwd means `/opt/dev/ruach-worktrees/c15-instructions`; skill cwd is its `skills/ruach-herdr`. Existing pinned dependencies were reused. Final logs and separate `.exit` receipts refer to the existing `f17e923` candidate; earlier logs remain distinct.

| Command | Cwd / result | Evidence |
| --- | --- | --- |
| `timeout 300s just check` | Worktree / exit 0 | `check-final.log`, `.exit` |
| `timeout 300s bun run test` | Worktree, authorized sockets / exit 0, 110 pass/0 fail | `root-final.log`, `.exit` |
| `timeout 300s bun run release-check` | Worktree / exit 0, metadata unchanged | `release-final.log`, `.exit` |
| `timeout 300s bun test --timeout 30000 tests/agy.test.ts` | Skill / exit 0, 27 pass/0 fail | `agy-final.log`, `.exit` |
| `timeout 600s bun test --timeout 30000` | Skill, authorized sockets/PTY / exit 0, 268 pass/0 fail, 193.93 seconds | `herdr-final.log`, `.exit` |
| `git diff --check 75f10abc2af9c4b043b393d7352ce74ba6eb4016 HEAD` | Worktree / exit 0 | `diff-check.log`, `.exit` |
| `sha256sum -c /tmp/ruach-c2-adapter-vVoPhXvW/assignment.sha256` | Worktree / exit 0, assignment unchanged | Saved original SHA-256 receipt |
| `bun scripts/agent-routing.ts resolve scout --route gemini-3.8-flash-medium` | Worktree / exit 0, exact slug, auto/inherit, offline/non-launchable | `route-final.json`; policy source on stderr |

Initial `check-initial.log` passed before the new documentation. At `d95cee5`, `check.log` failed (exit 1): an illustrative inline native-include placeholder was parsed as a broken Markdown target. `f17e923` replaces that example with prose; no runtime code changed. Prior focused checks passed (25 Agy tests before two additional gates, 19 routing tests). Earlier postcommit logs show 110 repository tests, 27 focused tests and 268 full Herdr tests passed with zero failures. Their outer orchestration receipt was lost during context compaction; final runs explicitly capture exit files against the final candidate. No failed behavioral result is reclassified or hidden.

Actual no-model inspection was limited to `agy --help`, `agy --version` and `sha256sum /home/metatron/.local/bin/agy`; version is 1.4.7 and executable digest is `40349135371a8ed1f1af1e9f8b741de99174ae9fce6380b96c2d1f543480af7a`, matching accepted evidence. Help uses stderr, handled locally without changing other adapters. No real catalog refresh was needed for the unchanged binary/environment; safe accepted catalog evidence was reused, while production preparation performs current catalog preflight. No actual worker/model turn, native trust interaction, private database access or global configuration write occurred.

Only corrected safe composition/hygiene snapshots and their independent review were read via immutable `git show`. Unsafe original report ancestry/diffs were not read or imported. Private native IDs/global instruction contents are not copied into this report or commits. Earlier LAUNCH attempt/review/failure and subsequent accepted correction remain at their original revisions; this task does not reopen or reinterpret that history.

`bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/c2-adapter.md --repo /opt/dev/ruach-worktrees/c15-instructions` exited 0 with `ok: true`, seven resolved revision references and no diagnostics (`handoff-validate.log`, `.exit`). `bun scripts/check.ts` including the report exited 0 (`report-resource.log`, `.exit`). Mechanical validation does not establish independent review or native acceptance.

## Capability limits and next validation

The adapter fails rather than truncating above the documented 24,000-byte expanded per-rule cap, and rejects unverified nested includes/source syntax. This does not establish full inline role delivery under the separate native 20,000-token aggregate always-on budget. Declared skill manifests, plugins, account/custom discovery, later filesystem changes and native precedence beyond checked roots remain unverified. Same-name different filesystem sources are held; identical canonical realpaths are retained. No unsupported effective-catalog API or tokenizer is invented.

Only supplied canonical technical links exclude workflow skills. `hidden_workflows` remains empty: ambient native/global workflow absence is not claimed. Canonical role context prohibits workers from loading workflow bodies while consumer rules, native system sections and built-ins remain active. The accepted native composition proof showed the complete Scout body and an on-demand technical catalog entry, but its mistaken diagnostic turn did not prove controlled brief reading, skill activation or useful advisory work. Local/fake preparation coverage does not close those gaps.

After independent exact-candidate source review, separately authorize one bounded real linked Herdr Scout advisory with the exact Gemini route and inherited policy. Verify actual native role/permission and authoritative identity, preserved consumer/built-in context, full role inlining under real budgets and intended canonical skill source; then controlled literal brief-path reading, on-demand technical skill activation and a useful independently graded advisory artifact. Do not infer identity or native acceptance from prepared files, process titles or ready markers. No Agy watcher/continuation support is claimed; reuse canonical waiting within its proved capabilities.

Root/navigation/CI/release integration belongs to the integration owner. Retain this worktree, branch, session and private evidence; no task-resource cleanup, registration, merge, push, tag or delivery was performed. Disposable test-owned resources are handled by their existing fixture cleanup only.
