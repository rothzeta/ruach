task: REVIEW-LAUNCH-01
status: complete
outcome: "Changes required: LR-01 reproduces bootstrap bypass after shell startup; the fresh native turn did not receive the canonical role or requested auto-review mode."
source_baseline: d0124e20a078fa3f0cc720679387c485a8e40f7a
reviewed_revision: 2c114e8b10768862d0dd9eafab4f982dc4fff1e9
evidence_revision: 0d9b2f0
artifacts:
  - docs/assignments/c1-c5/REVIEW-LAUNCH-01.md
  - docs/reports/c1-c5/launch-review.md
  - docs/reports/c1-c5/launch-artifacts/review/public-summary.json
  - /tmp/c15-launch-review-01-M8KtgM
  - /tmp/ruach-launch01-evidence-qPAtkMsT
verification:
  - "Exact-candidate focused transport suite: restricted exit 1 with worker setup EPERM; authorized rerun exit 0, 8 pass/0 fail. Original failure retained."
  - "Independent clean-versus-customized Bash/PTY probe: exit 0; clean shell receives all five prepared arguments, startup PATH prepend bypasses the bootstrap and receives zero."
  - "Scoped live Herdr/process and documented native metadata reads: completed without prompts, registration, resumption or inference; actual policy/role mismatch observed."
  - "Supplied evidence audit: all 28 checksums and 11 receipt/log digests matched; root/release/full Herdr checks inspected, not rerun."
  - "Own handoff validator, assignment integrity and owned-document whitespace checks: passed."
review:
  - "P1 LR-01 blocks this transport candidate and original-failure acceptance; no source fixes made."
discoveries:
  - "Exact-cwd read-only native metadata located one stored thread for the fresh worker; its ID remains private and unregistered. Herdr still supplies no native identity binding."
  - "Native argv title rewriting cannot explain the observed policy mismatch and retained bootstrap PATH; process listing alone was not used as payload proof."
blockers:
  - "LR-01: startup-shell PATH precedence can launch the native binary with all prepared arguments discarded."
  - "Fresh-worker canonical-role/permission acceptance and authoritative Herdr pane-to-native binding remain unsatisfied."

# Exact-candidate review

**Changes required.** Reviewed `2c114e8b10768862d0dd9eafab4f982dc4fff1e9` against `d0124e20a078fa3f0cc720679387c485a8e40f7a`, using an exact Git archive under `R=/tmp/c15-launch-review-01-M8KtgM/candidate` and evidence-only successor `0d9b2f0`. No later integration working tree was reviewed. The diff contains the 11 stated transport/helper/test/doc/reproducer paths; no instruction resource, catalog, route, release metadata or agy change is part of this unit.

One blocking finding, ordered by severity. No separate optional maintainability findings. Newly added handwritten production helpers and expanded worker transitions are readable and appropriately bounded; their dispatch assumption is the correctness problem.

## P1 LR-01 — Startup shell can bypass the private bootstrap and silently drop all launch arguments

**Location:** `skills/ruach-herdr/scripts/worker.ts:161` through the empty-argv submission at `:199`, `scripts/launch-transport.ts:44`, and the missing startup condition in `tests/fixtures/terminal-start.ts:14` (all relative to the reviewed skill).

**Problem and impact:** The large-argv path clears the complete prepared arguments and relies on a same-named executable at the front of the pane's inherited PATH. The interactive shell can prepend its normal user executable directories while starting. Herdr then submits only `codex`, which resolves directly to the real native binary before the private bootstrap. Startup can report ready while canonical role/configuration, permission flags and literal pass-through arguments never reach the native CLI. This violates the central LAUNCH-LONG-ARGV contract even when default model/effort happen to match the requested values. User shell customization must remain supported; removing it is not an acceptable correction.

**Live evidence:** The scoped `c15-launch-review` launcher receipt reports the intended Reviewer hash `70170a1cc1bfa0c3070e56a930c51876418dc82d9460607f662eac4e29e26c84`, gpt-6.1-sol/high, auto-review, and a retained private payload with 12 argv entries. Parsing that payload independently confirmed the exact canonical role body. Its root/directory/data/executable modes are 0700/0700/0600/0700.

Read-only process inspection of the assigned pane found actual Codex 0.164.0 and its Bash parent. The native process's PATH still contained the private bootstrap directory, behind directories prepended during shell startup; it did **not** equal the payload's pinned native PATH. The helper explicitly restores that pinned PATH before `execve`, so this is evidence that its expected execution did not occur. The relevant existing shell startup lines prepend personal executable directories, including the directory containing the normal Codex executable. They were read only; no shell file was sourced or changed.

Process argv contained only `[codex]`, which is insufficient by itself to decide whether a CLI rewrote its title. A second, independent observation settled the acceptance question: installed-schema-supported exact-cwd `thread/list` with `useStateDbOnly:true` located one stored thread created at this startup. `thread/read` without turns/resumption supplied its actual recorded path; scoped inspection of that thread's existing turn context showed `approval_policy: on-request`, `approvals_reviewer: user`, and workspace-write. It did not show the requested auto-review mode. Its recorded developer messages contained **no canonical Reviewer role**, although the prepared payload did. Model/effort were gpt-6.1-sol/high, which establishes those observed values only. No model self-report or guessed UUID was used.

**Discriminating reproduction:** `R/../startup-boundary.ts` imports the exact candidate's `materializeBootstrap`, uses a harmless recorder executable rather than Codex, and sends the same seven-byte `'codex'` command through actual Bash/PTYs. The expected five argument strings are independently authored; the recorder records actual argv and PATH. With `--norc`, all five arguments arrive and native PATH is restored. With an isolated rcfile that merely prepends the same recorder's normal bin directory, **zero arguments arrive**, PATH is not restored, and the bootstrap prefix remains. No native worker/model is launched. The precondition differs only in shell startup PATH precedence, reproducing the live observations. Safe results are in [public-summary.json](launch-artifacts/review/public-summary.json); raw probe source, terminal output and receipts remain under the scratch root.

**Coverage gap:** The candidate's real PTY fixture explicitly uses `--noprofile --norc`; it removes the relevant user-shell initialization. Thus the eight focused cases correctly demonstrate literal delivery, quoting and retention under their fixture conditions, but cannot protect this actual startup path. Passing recorder comparisons do not establish that the real pane selected the recorder/bootstrap at all. The normal/direct control likewise does not detect large-path loss after startup customization.

**Correction direction and acceptance:** Arrange deterministic execution of the prepared private bootstrap through a documented, supported terminal launch mechanism **after shell initialization**, preserving user customization and named same-pane readiness/blocked-input semantics. Do not rely solely on an inherited PATH prefix while discarding the original argv. Keep failure closed if execution identity/payload cannot be established. Add a public worker regression with ordinary startup PATH prepending (and a contrasting clean shell) that observes the complete prepared native argv/environment, role/configuration and permission flags. Retain independent literal/empty/Unicode/sentinel and normal-path controls. Then recheck the exact corrected candidate and separately commission one authorized real source-wrapper original-failure retest with actual native role/policy evidence. Do not merely change the READY/identity caption or shorten restrictions.

## Scoped native identity disposition

Live diagnosis ran approximately 20:15–20:21 UTC, within the assignment's ten-minute bound. Only the assigned fresh pane, its recorded foreground process, the declared private bootstrap, applicable shell startup lines, and exact-cwd native metadata were inspected. The private Coordinator task record/watcher journal were not read. No prompts/keys, thread start/resume/steer, registration, security answers, settings writes or worker/model launches occurred.

Herdr still reports done/interactive-ready with no native `agent_session`. The documented native metadata interface yielded one real stored thread ID at the exact task cwd; it is retained only in `R/../thread-{list,read}-private.json` (0600), never copied to this report or public evidence. This removes the need to guess an ID but does **not** establish an authoritative Herdr pane-to-thread binding or authorize registration. More significantly, the observed native turn failed the role/permission contract, so finding an ID cannot make this launch acceptable.

The public read semantics are supported by the installed 0.164.0 generated schema and [official OpenAI documentation](https://learn.chatgpt.com/docs/app-server): `thread/read` obtains stored metadata without resuming the thread. The exact-cwd filter and state-DB-only option came from the installed schema; the latter avoids list-time scan-and-repair. The existing matching daemon was used; no persistent daemon was created/replaced. Source `vscode` is what native metadata reported, not proof of a different requested route. Raw global developer text/configuration and private native IDs were not printed into public artifacts.

Smallest next step: Coordinator routes LR-01 to the source Implementer as a bounded correction of the **same original outcome**, preserving correction history. Keep this unassigned worker and its material for disposition; do not dispatch real review work, register an inferred identity, or retry/prompt it as a workaround. After a corrected candidate is independently checked, a separate authorized real launch must establish role/permission and identity acceptance. This report does not reset or independently edit the correction counter.

## Source and oracle assessment

Canonical source preparation, actual-checkout repeat, role hash check, declared route mapping and existing one-submission/blocked-input/uncertain-retention branches remain present. Private argv data is restrictive, user text remains JSON rather than shell code, and helper-relative resolution works in copied scripts. The 3000-byte selection point is explicitly a conservative transport choice below the observed 4095-byte terminal limit, not a public argument-size contract. Runtime and PATH-delimiter prerequisite checks exist; missing-`execve` behavior was inspected but not separately executed here. No additional source issue is asserted without evidence.

The supplied original-worker replay uses original blob `6abac3b4cb73cc5f35708ef0bbf1528819939476` with the **candidate** terminal fixtures, not a pristine baseline suite. Its expected exit 1/worker exit 4, 21,180 submitted bytes, continuation prompt and no native recorder support reproduction of the old failure under that recreated canonical boundary. The standalone 6000→4095 capture supports the dropping mechanism; neither proves the old released pane's historical termios. The Scout report at `5a44779` supports the real original symptom. Those facts are consistent with the handoff's explicitly held real source-wrapper retest. This review's fresh native observation demonstrates that the proposed correction still fails that broader contract.

The literal-byte expectations come from explicit controlled inputs, not the production quoting function or a copied renderer. Empty arguments, Unicode, quotes/backticks/dollar syntax and sentinel absence are meaningful checks when the helper is selected. Native/preparation doubles do not certify actual policy or account availability. The shell-startup exclusion is the concrete unprotected behavior, rather than a demand for a broad end-to-end suite or arbitrary threshold assertion.

## Verification evidence and dispositions

Raw evidence root is `/tmp/c15-launch-review-01-M8KtgM` (the parent of R above). `common.ts`, `commands.jsonl`, and `logs/` preserve exact argv/cwd, start/end, exit/signal and full output digests before display. Native raw receipts remain private there or at the explicitly assigned private receipt paths. All 11 changed source files in the archive were compared back to the exact candidate after probes. No production source/test/configuration was edited. Exact owned-path staging initially hit read-only shared-gitdir `index.lock` protection; the assignment-authorized Git escalation was used without removing a lock or changing settings.

| Check | Disposition |
| --- | --- |
| Frozen skill dependency setup: `bun install --frozen-lockfile`, cwd `R/skills/ruach-herdr` | Passed, exit 0, existing pinned packages only; `candidate-frozen-install` receipt. |
| `bun test tests/launch-transport.test.ts tests/worker.test.ts --test-name-pattern 'canonical PTY\|private argv\|large startup\|long literal\|unrepresentable bootstrap'`, same cwd | First run: two helper cases passed, worker setup blocked by socket EPERM, overall exit 1. Assignment-authorized socket rerun: exit 0, eight pass/zero fail; `focused-candidate-{default,authorized}` full logs. No registered-flake authority used; original retained. |
| `bun startup-boundary.ts final`, cwd evidence root | Probe completed exit 0; clean positive control passes and customized-shell contract violation is reproduced (LR-01). The verifier's exit 0 means discriminating evidence collected, **not** a candidate pass. Earlier probe attempts timed out looking for an inherited prompt that rcfile startup replaced; raw outputs retained, then only the disposable rcfile prompt was made explicit. These were harness failures, not proven PTY capability denials or product failures. |
| Scoped Herdr agent/process and `/proc` metadata | Initial socket EPERM/namespace absence retained. Authorized host-context reads succeeded; PATH/policy/role mismatch is a reproduced defect, not an environment-only hold. No raw payload acceptance inferred from one-element argv. |
| Installed `codex app-server generate-json-schema --experimental --out <scratch>/native-schema`; existing-daemon metadata helper | Schema generation exit 0 with retained read-only alias-initialization warning; metadata helper exit 0. Only initialize, initialized, exact-cwd state-DB-only thread/list and metadata-only thread/read were sent. Native aliases/settings were not changed to suppress that warning. |
| Supplied full evidence/digest audit | Passed: 28 SHA256SUMS entries and 11 receipt/log digests match exact-candidate attribution. Supplied `just check`, 108 root tests, release check and 230 Herdr tests have passing recorded exits/full logs; not independently rerun because the focused source checks and new discriminating reproduction suffice for this review. Their passes do not override LR-01. |
| Supplied canonical input/original-worker regression | Expected original-defect evidence, not a final pass; original environment block retained separately. No actual old worker/pane was recreated or modified. |
| Own handoff validator, staged owned-document whitespace and assignment SHA comparison | Passed, exit 0; receipts `report-validation`, `owned-diff-check`, `assignment-integrity`. Assignment SHA-256 `3c6a6da54d978110c9ec041e2e94389b2f9377cd60842a9adc288574dc137ca7`. |
| Actual corrected-worker acceptance/final union review/delivery | Failed/held for LR-01 and missing authoritative Herdr binding; no new launch, assignment or delivery performed here. |

The review task is complete, with changes required. Private launch resources, source branches, scratch evidence and the fresh worker remain retained for Coordinator disposition. The small committed summary contains no native UUID, raw developer instructions, user configuration contents or authoritative task-record data.
