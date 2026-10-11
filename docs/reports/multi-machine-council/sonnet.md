task: multi-machine-council-sonnet-round-1
role: architect
status: needs-decision
outcome: "Independent design for Herdr-controlled multi-machine development, written without peers' answers. Recommends running the unchanged single-host launcher on the target machine through a thin wrapper, structured machine-scoped IDs, Git over SSH through the control machine as the source-commit transport (bundles as fallback, central remote as publication only), single-writer machine branch namespaces, and observe-not-relaunch recovery. Ten owner decisions remain."
baseline_revision: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/design/multi-machine-sonnet.md
  - docs/reports/multi-machine-council/sonnet.md
verification:
  - "bun run check (identities, eval placement, relative Markdown links): exit 0, run before the final commit"
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/multi-machine-council/sonnet.md --repo . : exit 0 (structure and baseline_revision resolve); the validator does not certify the report is true"
  - "git diff --check over both new files (intent-to-add) : exit 0"
  - "read-only local probes: herdr --version, herdr status, herdr machine list [--json], herdr --skill, herdr --machine oholiab agent list (rejected: unknown option --machine)"
  - "not run: any application or runtime test, any SSH or remote command, ruach-herdr or root test suites (no code changed), live Herdr launch"
discoveries:
  - "The launcher is a single-host process. Roles, skills and catalogs come from the source checkout's .agents, not the new worktree, so a stale remote mirror launches stale roles unless the role hash is compared (the dry-run already reports it)."
  - "Local Herdr 0.9.0 (protocol 22) rejects --machine. The user-installed Herdr skill documents it, while the binary's own --skill text does not. Documentation is ahead of the binary."
  - "herdr machine list --json exposes id, label, SSH target, session, enabled. That is enough to resolve a machine without a second connection file."
  - "Existing launcher fallbacks already fit remote use: no launching workspace gives standalone worktree mode; exit 4 and awaiting-input contracts extend to a lost SSH result."
  - "ruach-handoff permits extra keys, and checks only top-level *_revision and *_baseline fields with Git, so machine receipts need no schema change if the report is validated where its commits exist."
blockers:
  - "Owner decisions D1-D10 in docs/design/multi-machine-sonnet.md section 8, chiefly: scope and roadmap placement (D1), control machine as single integration authority with no hosted-Git credentials on remotes (D2), machine-qualified branch names (D3), setting HERDR_ENV on remote commands (D4), mirror policy for remote main checkouts (D5)."
  - "Unverified assumptions A1, A4, A5, A6 (remote socket reachability over non-interactive SSH, ID reuse after restart, behavior of a dropped SSH session, remote .agents snapshot state) should be checked read-only before any launch implementation."
design_scope: round 1, independent; no peer reports read

# Sonnet 5.5 council report, round 1

Full design: [docs/design/multi-machine-sonnet.md](../../design/multi-machine-sonnet.md). It separates verified repository facts, session observations, the assignment's given facts, assumptions, proposals and owner decisions.

## Position

1. **Boundary.** Do not thread a transport through `ruach-herdr`. Run the unchanged launcher on the selected machine over its saved SSH target (`scripts/machine.ts` wrapper with `list`, `preflight`, `start`, `observe`). The launcher touches the filesystem, Git, native config and Herdr in many places; a hidden transport in `run()` would not cover its direct file reads, and `--machine` is not available locally.
2. **IDs.** Store `{machine: <Herdr profile ID>, id: <native id>}` pairs; never join strings or compare native IDs across machines. Validate by the name, kind and pane triple the launcher already uses.
3. **Preflight and ownership.** A read-only, allowlisted remote preflight returns checks and an environment fingerprint. The machine's owner keeps Herdr servers, native logins and config, toolchains and Docker. Ruach writes only an authorized worktree, branch, workspace, agent, private temp material and incoming refs; never credentials, global settings or server lifecycle.
4. **Launch failures.** SSH failure before dispatch is exit 3 with no change. Loss after dispatch is exit 4 `result_lost`; recover with a read-only `observe` by deterministic keys. Never relaunch blindly. Capability mismatch fails closed; the wrapper must not rely on `--machine`.
5. **Worktrees and branches.** Per-machine worktrees, a remote main checkout treated as a mirror, always `--base <full-sha>`, branches `ruach/<machine>/<name>`, single-writer refs, and control-side tracking refs under `refs/machines/<machine>/`.
6. **Git assessment.** Git is the best tool for committed source because the handoff system relies on commit identity. Use a hub-and-spoke topology: the control machine fetches over SSH and pushes pinned SHAs to `refs/ruach/in/…` on the receiver. Bundles are the verified fallback and archival receipt. A central remote is publication after owner approval, not transport. Patches lose identity; rsync and shared filesystems are unsafe for source or `.git`.
7. **Not Git.** Dirty work becomes an explicit WIP commit or is rejected. Ignored assets, caches and datasets are provisioned per machine through consumer recipes or a hash-verified manifest. Secrets are never transferred. Test evidence binds to revision, machine and environment fingerprint.
8. **Authority.** One integration authority (the control machine) and one coordination owner per task. Remotes produce candidates; they do not merge or publish.

## Handoff sequence and receipt

Seal on the producer, fetch to the control machine, verify the exact SHA, review and integrate on the control machine, write the assignment as a commit, push the pinned base to the receiver, launch with `--base`, and return the same way. Receipt fields are `machine` (profile ID, label, session), `environment_fingerprint`, `tree_state`, `base_revision`, `candidate_revision`, `tested_revision`, transfer method and refs, verification steps, bundle SHA-256, `launch_id` with deterministic keys and scoped refs, `ignored_assets` and `secrets_transferred`. Details are in design sections 4.9 and 4.10.

## Phases

0. Owner decisions and a manual runbook. 1. Read-only machine layer (`list`, `preflight`). 2. Remote `start` and `observe`. 3. Git handoff recipes and receipt wording. 4. Task-driven extensions (`herdr --machine` probe, linked worktrees, publication, mirror fast-forward).

## What this report does not establish

No remote machine was contacted and nothing was mutated. No application or runtime tests were run. The proposed tests are listed in design section 5 and do not exist yet. Coverage of remote Herdr versions, remote `.agents` state and native account access is unverified.
