task: RELEASE-PREP-070-01
status: complete
outcome: "Truthful untagged 0.7.0 candidate prepared; assigned checks and exact snapshot verification pass after supported socket remediation. Read-only delivery/install preflight and guarded plan recorded; no delivery performed."
candidate_revision: e96367b5e482808a22fbac817ed1162e8cc712ec
tested_revision: e96367b5e482808a22fbac817ed1162e8cc712ec
source_baseline: 8f7b665fca3eaf3dc61249f88fcda91cabd1629a
destination_before: 2b693cd72bf39c29575841a88d9c7ae719a29715
artifacts:
  - docs/assignments/c1-c5/RELEASE-PREP-070-01.md
  - docs/reports/c1-c5/release-prep-070.md
  - docs/reports/releases/0.7.0/preparation.md
  - docs/reports/releases/0.7.0/import-manifest.json
  - docs/reports/releases/0.7.0/verification-summary.json
  - docs/reports/c1-c5/combined-source-review.md
verification:
  - "just check and bun run release-check pass, exit 0; exact committed candidate checked."
  - "bun run test passes 110/0 after supported socket remediation; just test passes all 529 tests across root/handoff/Herdr/harness-eval/changelog. Original default EPERM failures retained separately."
  - "Existing installer and three checks pass on exact candidate from foreign cwd, before/after relocation; 124 managed bytes/modes, seven roles, fifteen skills and five consumer sentinels verified."
  - "28 exact safe review imports and 26 checksums pass; protected source equals reviewed 4c5defc, guide/review unchanged, unsafe Scout ancestry absent, scope/privacy and dependency-version audits pass."
  - "Read-only local/remote main and unused-tag preflight pass; installed 0.6.1 plugin/shared skills confirmed by metadata and exact source bytes."
  - "Final handoff validator and resource/link/scope/assignment checks pass; mechanical validation is not independent review."
review: not-run
discoveries:
  - "Latest main hosted CI failed at Dependency audit; underlying cause unavailable from empty log response. No hosted candidate result or green publication claim."
  - "Shared Skills CLI lock refs still say v0.4.0, but all 84 managed files across nine Ruach skills match 0.6.1; plugin version/source and 92 managed files also match 0.6.1."
  - "Native plugin list/marketplace/help commands exit 0 with no output here; bounded documented metadata confirms installation, not lifecycle mutation success."
  - "Main has only the declared dirty routing file; six original Codex alternatives are represented in candidate policy. Existing discovery links, consumers and global settings remain untouched."
blockers: []

Prepared on branch `ruach/c17-release-prep` from exact base `8f7b665` under the
unchanged [assignment](../../assignments/c1-c5/RELEASE-PREP-070-01.md). The
candidate and tested revision are **e96367b5e482808a22fbac817ed1162e8cc712ec**.
This report, assignment and verification summary are a later evidence-only
recording; its creating SHA is returned separately, never predicted here.
No independent release review, merge, tags, push, global installation or new
native/member/product/browser experiment occurred.

The candidate updates README, CHANGELOG, roadmap, operations and native-parity
prose; adds the [preparation/delivery plan](../releases/0.7.0/preparation.md) and
[import manifest](../releases/0.7.0/import-manifest.json); and imports exactly 28
accepted final combined-review files from `fb347bb74a9e93e0a54eff6309d2d93c74302631`.
Every imported byte and all 26 supplied checksums match immutable source. No
foreign ancestry was merged or cherry-picked. Council guide and planning index
need no change; the guide and its review remain byte-exact. Package/plugin/
marketplace already agree at 0.7.0; protected source, tests, configuration, evals,
locks and metadata remain equal to reviewed `4c5defc`. Remote install examples
stay on published 0.6.1 in accordance with repository release practice.

Commands ran from the assigned worktree unless stated. Full stdout/stderr,
verifier exit and time-bound receipts remain outside the repository in private
scratch, whose locator is returned to the Coordinator. The safe
[verification summary](../releases/0.7.0/verification-summary.json) records command
argv, timestamps, exit codes, log digests and necessary installation evidence.
`$R` in those receipts denotes that private scratch directory. Logs are retained
in full, including failed attempts; no pipeline hides verifier status.

| Actual command / bound | Result and scope |
| --- | --- |
| `just check` / 300s | Exit 0; resource identities, notices, local Markdown targets and TypeScript. Also passed before candidate commit and on final report additions. |
| `bun run test` / 300s, default sandbox | Exit 1, 106 pass / 4 fail; all four failures are Unix socket `listen` EPERM. **Not verified: environment**; full original log retained. |
| `bun run release-check` / 300s | Exit 0; coherent prepared 0.7.0 package/plugin/marketplace/agents/changelog. |
| `just test` / 900s, default sandbox | Exit 1 at its root recipe, 106 pass / 4 socket EPERM failures; skill stages did not run. Original log retained. |
| Same `bun run test` / 300s, supported scoped socket access | Exit 0, 110 pass / 0 fail, 1,309 assertions. No test/source/fixture edits or skips. |
| Same `just test` / 900s, supported scoped socket access | Exit 0 in 240.489s: root 110, handoff 28, Herdr 285, harness-eval 71, changelog 35; **529 pass / 0 fail**. Full-run root assertion count 1,306 is an observation, not an exact-output contract. Herdr's fixture PTY/native recorders are not actual model/council/advisory evidence. |
| `bun $R/snapshot.ts` / 120s; four subprocesses each bounded 120s | Exit 0. Existing `bun scripts/install.ts install --source WORKTREE --revision e96367b5e482808a22fbac817ed1162e8cc712ec --target TARGET`, installed `check --target TARGET --source WORKTREE`, and relocated installed checks with and without source all pass from foreign cwd. Independent Git blob hashes/modes match all 124 files; seven roles/fifteen skills, omitted dev resources and five customization sentinels verified. Untagged manifest correctly omits release-version field. |
| `bun $R/audit.ts` / 120s | Final exit 0; 35 candidate paths owned, 28 exact imports, 26 checksums, guide/review unchanged, protected diff zero, generic UUID/credential-pattern findings zero and unsafe original Scout/retained tip ancestry absent. No unsafe history/diff or private native content read. |
| `bun scripts/install.ts ready --route skill --json --project $R/empty` / 120s | Exit 0; locked handoff/Herdr dependencies ready. Root and skill direct installed versions match unchanged manifests/locks. Checkout-local links reused existing source dependencies; **no new frozen install or dependency audit ran**. Harness-eval has no package dependencies or lockfile. |
| `git ls-remote origin refs/heads/main refs/tags/v0.7.0 'refs/tags/v0.7.0^{}' refs/tags/ruach--v0.7.0 'refs/tags/ruach--v0.7.0^{}'` / 120s | Default exit 128 (SSH config permissions); supported scoped network run exit 0: main equals `2b693cd72bf39c29575841a88d9c7ae719a29715`, both planned tags absent. Local tags also absent; main is an ancestor of candidate. |
| `gh run list --repo rothzeta/ruach --limit 5 --json databaseId,headSha,status,conclusion,name,url` / 120s | Default exit 1 (network); scoped network run exit 0. Most recent main run `40134877122` completed failure. |
| `gh run view 40134877122 --repo rothzeta/ruach --json headSha,status,conclusion,jobs,url` / 120s | Exit 0; failing step is Dependency audit. `--log-failed` returned exit 0 with no output, so the cause is unverified. This is baseline CI, not a candidate result. |
| `bun x --bun skills@1.7.0 list --global`; `claude plugin list --json`; `claude plugin marketplace list --json`; text plugin list/help / 120s each | All exit 0; Skills CLI lists installed scope. Native plugin metadata commands produce no output here, so bounded known metadata files and managed-byte comparison establish the actual installation facts instead. |
| `bun $R/preflight.ts` / 120s | Final exit 0; sole main edit and preservation, represented six-role policy, global scope/version/content and unsafe-original ancestry verified. |
| `git diff --check`; canonical handoff validator / 120s | Exit 0. Validator command: `bun skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/release-prep-070.md --repo /opt/dev/ruach-worktrees/c17-release-prep`. Scope and unchanged-assignment checks pass before recording commit. |

Two private read/hash helper assumptions were corrected without product changes:
the initial ancestry assertion mistakenly named the safe initial adapter source
instead of the documented unsafe original Scout commit; the initial guide audit
used the wrong review filename. Their original exit-1 logs remain alongside the
corrected exit-0 runs. These are diagnostic helper errors, not source failures,
registered flakes or engineering correction cycles. Initial staging/commit access
also required the assignment-supported linked-Git-metadata escalation; only owned
files on this worker branch were staged/committed. No main state was cleared.

Destination is still local main and origin/main
**2b693cd72bf39c29575841a88d9c7ae719a29715** at preflight. Main's only dirty path is
`config/agent-routing/roles.yaml`, with file SHA-256
`9000bb915bb361d4a7e1e6eb66c7f9b896c3420b61f79b52429688df8f2b671b` and exact
patch SHA-256 `9fbe68920abcbcb881223ec62f8e92c231459c3efc53c15fb553805aed8a5926`.
Private byte/patch copies are retained; preferences are unchanged and candidate
policy contains all six authorized Codex alternatives plus reviewed Tester/Gemini
entries. No clear, stage, stash, reset, commit or merge of main occurred.

Installation scope is existing shared global Skills CLI directories (nine Ruach
skills, 84 managed files matching 0.6.1), with nine existing Claude discovery
links, and user-scope `ruach@ruach` plugin 0.6.1 (92 managed files matching main).
The Ruach marketplace points to the existing local source checkout. Exact private
paths/metadata remain outside the public report. Metadata and link inventories
must be rechecked and backed up before delivery; existing Claude shared/plugin
duplicate exposure is retained, not silently reconfigured. The detailed plan
uses the supported Skills CLI add recipe, existing Claude plugin update lifecycle,
per-copy frozen installs and post-update byte/discovery checks. It preserves
unrelated skills, marketplace entries, native settings and retained consumers.

The separate reviewed delivery assignment must name the exact reviewed revision,
recheck both destination SHAs and unused tags, exclude concurrent writers, back
up/verify only the represented dirty routing edit, clear only that edit immediately
before a guarded fast-forward, and restore it if merge fails before movement.
Never copy the older policy over the merged Tester/Gemini entries. Tag the same
reviewed revision as annotated `v0.7.0` and conventional `ruach--v0.7.0`, inspect
both targets, then atomically push main and those tags; no new GitHub Release
publication is required by established practice. Refresh global skills with
`bun x --bun skills@1.7.0 add ./skills --global --agent codex --agent pi --agent goose --skill '*' --yes`
from delivered source and update the existing plugin with
`claude plugin update ruach@ruach --scope user`. Obtain useful lifecycle output
and verify actual resulting metadata; empty exit-0 is not proof. Full guarded
commands and recovery conditions are in the preparation plan.

Remaining delivery/review risks are explicit: independent final review is pending;
main's latest hosted CI audit failed with unverified cause; hosted candidate CI,
remote publication and actual install results are unobserved. Dependencies are
protected by this assignment, so any required audit remediation needs a separate
amendment/assignment rather than an in-scope lock change. C1 actual member-boundary/
council demonstrations stay held at `228b306`; C2 linked metadata preflight passed
but the blocked session was closed during owner cleanup with zero new Gemini
turns, and old trust is superseded, neither pending nor approved. Native identity,
aggregate context, skill/permission/advisory acceptance, full parity, listening,
expiry/device, musical quality and quality/cost evidence remain open. These limits
are not replaced by static tests or the newly green local union suite.

No preparation blocker remains. Source release under accepted limits still needs
the Coordinator's independent review and separate delivery assignment. All prior
task workspaces/worktrees are removed per assignment context; only newly authorized
release resources are current. Temporary dependency links created here are removed
before handoff; private logs and disposable relocated snapshot remain for concrete
review reuse, then Coordinator cleanup. The launcher's `temporary_directory` was
not supplied or inspected; the Coordinator holds its launcher receipt. No native
identity or private global instruction was accessed or published.
