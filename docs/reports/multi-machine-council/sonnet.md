task: multi-machine-council-sonnet-round-2
role: architect
council_round: 2
status: needs-decision
outcome: "Round 2 revision (corrected: absence of a launch record never authorizes a new attempt) after reading the Sol and Opus designs and the latest setup evidence. Same boundary as round 1 (run the unchanged launcher on the target machine), now invoked through a fixed stdin-request helper with a per-launch exclusive record and result file, local route resolution with direct remote selection, push-then-fetch Git handoff with immutable receipt refs, and a three-way split of local transfer, hosted feature publication and polled-branch delivery. Smallest reliable deliverable defined. Five owner decisions remain."
baseline_revision: d75039aa7b82b262e2f28af08630258fb7f77180
round1_revision: 511c329c111c618e087dce72a0fc8af02ebf08d5
round2_revision: 37160b4b3b4208cfcf4e673b72d0204fa472fbe7
peer_round1_inputs: "Sol design e4f2dc2, Opus design c79d665 (read only, absolute paths under the sibling worktrees)"
artifacts:
  - docs/design/multi-machine-sonnet.md
  - docs/reports/multi-machine-council/sonnet.md
verification:
  - "Disposable local repositories (Git 2.47.3, file:// transport, scratchpad outside the repository): push of a SHA into refs/ruach/incoming/* of a non-bare remote left its working tree and HEAD unchanged; create-only update-ref refused to move an existing receipt ref; branch advance after a report kept the receipt SHA as an ancestor; a refspec without + rejected a rewritten branch with non-fast-forward (exit 1) and ignored branches outside the machine prefix; fetch by SHA recovered a rewritten candidate only while a remote pin ref existed and the remote lost it after the pin was removed and gc ran; bundle create/verify/fetch worked and bundle verify failed with exit 1 on missing prerequisites"
  - "bun run check at the final tree: exit 0 (resource identities, eval placement, relative Markdown links)"
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/multi-machine-council/sonnet.md --repo . : exit 0, baseline_revision and round1_revision resolved (structure only; it does not certify the report is true)"
  - "git diff --cached --check on both staged artifacts: exit 0"
  - "not run: any SSH, ssh:// or scp-form Git transfer, any remote command or live launch, any application or runtime test, the ruach-herdr or root test suites (no code changed). The Git examples are hand-run evidence, not tests"
review: not-run
discoveries:
  - "Peers agree with round 1 on launcher-on-target, scoped IDs, Git for source, one integration authority, no blind retry. Real differences: remote command shape, route resolution, lost-response mechanism, outbound transfer, assignment delivery, branch spelling, dirty-work handling and the HERDR_ENV gate. The design records each with a resolution."
  - "A fixed target-side helper that reads one JSON request on stdin removes the shell-quoting boundary instead of testing around it, and needs no worker.ts change: it creates an exclusive per-launch record, then spawns the launcher detached with stdout to a result file."
  - "Correction accepted after the final check: a launch record proves the launcher may have been spawned, but its absence proves nothing alone, because a single negative observation can race an in-flight SSH dispatch that has not yet claimed its record. Absence never authorizes a new request or attempt. The helper's atomic exclusive claim is the only arbiter; the same immutable launch ID plus digest may be replayed only through it; observe never resubmits; unknown is preserved until bounded evidence shows no in-flight producer, and an abandon tombstone then closes the race."
  - "A branch name cannot protect a receipt. The receipt SHA must be pinned on the remote (refs/ruach/receipts/*) and then on the control machine with a create-only ref (refs/ruach/received/*). Without a pin, a rewrite plus remote gc loses the candidate."
  - "WIP commits transfer freely; only publication to polled or deployment branches and delivery to protected targets need authorization. Round 1 over-merged these."
  - "Herdr API forwarding can carry list, get, read, wait, prompt and workspace calls, but never reaches target files, so native preparation and worktree verification must run on the target."
  - "The HERDR_ENV=1 gate was never real authorization. Authorization is the standing permission, an enabled profile and a passing remote herdr status."
blockers:
  - "Owner decision 1: authorize v1 (docs and recipes, then the machine layer with no worker.ts change) and its roadmap placement."
  - "Owner decision 2: publication policy (which remote and namespace may receive feature refs, from which machine; which branches are polled or deploying)."
  - "Owner decision 3: first project (recommend ramec), integration machine, and which acceptance environments must run where."
  - "Owner decision 4: remote snapshot and mirror maintenance (detect-and-refuse versus fast-forward clean remote checkouts)."
  - "Owner decision 5: non-Git assets and secrets (which datasets or images may be copied by hash manifest, from where; secrets only provisioned by the owner)."
  - "Unverified before implementation: push into refs/ruach/incoming/* over SSH, fetch by SHA through a real server and the pin refs (the Coordinator separately verified direct SSH fetch of d75039a from each remote into a temporary bare repository, not my evidence), ssh option effects, remote socket reachability under an explicit environment allowlist, dropped-session behavior, and remote .agents snapshot state per repository."
design_scope: round 2; independent round-1 reasoning preserved in the design from section 1 onward

# Sonnet 5.5 council report, round 2

Full design: [docs/design/multi-machine-sonnet.md](../../design/multi-machine-sonnet.md). Start at "Round 2 outcome"; the round-1 design follows it, with **[R2]** markers where a point changed.

## Agreement

All three designs run the existing launcher on the target machine, keep native preparation and worktree administration on the owning host, use machine-scoped identifiers, use Git for committed source with independent clones, treat bundles as a fallback or seeding path and reject patches, rsync and shared filesystems as source transports, keep dirty work, assets, datasets and secrets off the commit path, keep one coordination owner and one integration authority, reconcile a lost response by inspection, bind test evidence to revision and machine, start with standalone remote workspaces, and defer `herdr --machine` to a feature-detected, monitoring-oriented role.

## Disagreements and my resolution

| Topic | Resolution |
| --- | --- |
| Remote command shape | Adopted Sol's stdin request to a fixed helper in the same skill; explicit environment object; no shell interpolation. Opus's `env -i` goal is met without `env -i` |
| Route resolution | Adopted Opus: resolve locally, launch remote in direct mode, compare the remote `resolve --offline` role hash |
| Lost response | Smaller than Sol's per-phase journal and Opus's launcher change: one exclusive per-launch record plus a result file, with `observe` over live state. Per-phase journal deferred |
| Outbound transfer | Push into `refs/ruach/incoming/*` by default, bundle as fallback. Same authority class as the bundle seeding already done |
| Inbound transfer | Direct SSH fetch by the control machine, no `+`, create-only receipt ref, remote pin ref |
| Branch names | Keep `ruach/<machine>/<worker>`; attempts are new worker names |
| Assignment | Commit as base by default; helper put-file as the alternative |
| Dirty and WIP | Narrowed my round-1 restriction: WIP commits transfer freely; dirty results travel as marked diffs plus manifest |
| `HERDR_ENV` | Agree with Sol it is not authorization; document it; flag later |
| Linked remote worktrees | Later |

## Smallest deliverable

v1 is (1) verified Git handoff recipes and receipt rules in operations documentation, no code; (2) a `ruach-herdr` machine layer with `preflight`, `start` and `observe`, a stdin-request helper, an exclusive launch record, a result file, local route resolution, the machine envelope, role-hash comparison, absolute Bun and declared `PATH`, and no change to `worker.ts`; (3) offline tests plus one authorized live smoke per machine. Later: per-phase journal, linked remote worktrees, `--machine` monitoring, a verify-received script, bundle and mirror automation, publication tooling, cross-repository tuples.

## Retrieval, pinning and uncertain launches

The control machine retrieves a returned commit by SSH fetch, so the remote needs no credentials for the control machine. The receipt SHA is authoritative: the worker pins it as `refs/ruach/receipts/<task>/<seq>` on the remote, the control machine fetches the branch, verifies tip, ancestry and base, falls back to fetch-by-SHA if the branch was rewritten, and creates `refs/ruach/received/<task>/<seq>` create-only. Only then may the remote pin be removed. The design lists the exact commands and what was observed in disposable repositories.

An uncertain launch is preserved. The helper's atomic exclusive claim is the only arbiter. A record shows a launch may exist; its absence alone does not show that none will, because a single observation can race an in-flight SSH dispatch (corrected after the final check). Absence never authorizes a new request or attempt: the state stays `unclaimed-unknown`, `observe` never resubmits, and the same immutable launch ID and digest may be replayed only through the claim, where competing or delayed requests converge. After bounded evidence that no producer is in flight (dispatch process gone, a bound exceeding SSH timeouts has elapsed, a second observation still empty), an `abandon` tombstone makes any delayed request refuse, and only then does a new attempt (new worker name, launch ID and branch) become possible. Every other state is inspected, adopted or reported.

## Local transfer, publication and delivery

Three different operations: local transfer between owned machines (no per-transfer approval, WIP included), publication of a feature ref to a hosted remote that nothing polls (a standing policy naming remote and namespace), and updating a polled, deploying or protected branch (explicit delivery authorization from the integration checkout only).

## What this report does not establish

No remote machine was contacted and nothing was mutated. No SSH Git transfer was exercised, no live launch was run, and no application or runtime test was run. My Git evidence is local `file://` only. The Coordinator separately verified direct SSH fetch of `d75039a` from each remote into a temporary bare repository (not my evidence). Push over SSH, fetch-by-SHA through a real server and the pin refs need one authorized live rehearsal.
