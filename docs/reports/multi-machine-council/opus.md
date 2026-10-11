---
task: multi-machine-council-round-1-opus
role: architect
council_member: Opus 5.5 (high)
round: 1
status: needs-decision
outcome: "Independent design: add an explicit --machine to ruach-herdr that runs the existing launcher unchanged on the target machine over its saved Herdr SSH target and relays one machine-qualified result. Use Git for source handoff, with direct SSH Git as the default transport: the integration checkout pushes bases only into refs/ruach/incoming/* on the remote and fetches worker branches into refs/remotes/<machine>/*. Git bundles are the fallback. Central origin is an owner option. Patches, rsync and shared filesystems are rejected for source. One Coordinator and one integration checkout keep merge authority. Ready for the second council round. Implementation waits on owner decisions D1-D10."
baseline: d75039a
artifacts:
  - docs/design/multi-machine-opus.md
  - docs/reports/multi-machine-council/opus.md
  - branch ruach/council-machines-opus
verification:
  - "Repository inspection at d75039a: agents/*.md, skills/ruach-herdr (SKILL.md, references, scripts/worker.ts, spaces.ts, process.ts, contracts.ts), skills/ruach-handoff (SKILL.md, schema), config/agent-routing, scripts/agent-routing.ts, README.md, docs/roadmap.md, docs/coordination.md, docs/operations.md, docs/examples. Cited line numbers rechecked with sed/grep."
  - "Local read-only probes: herdr --version = 0.9.0; herdr status = client/server protocol 22, server running; herdr --machine oholiab agent list = 'unknown option: --machine'; herdr machine list --json = oholiab and tubal enabled, session default; herdr worktree create --help flags; installed ~/.agents/skills/herdr/SKILL.md documents --machine; local repos ruach/ramec/enoch/eden have GitHub origin."
  - "bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/multi-machine-council/opus.md --repo . : ok true, exit 0 (baseline d75039a resolved)"
  - "just check: exit 0 (resource identities, eval placement, relative Markdown targets; tsc), after just install of frozen dependencies in this worktree. A first run before the install failed typecheck only on missing node_modules (environment)."
  - "git diff --check on both artifacts: exit 0"
  - "not run: application or runtime tests, remote machine probes, live launches (the design is documentation only)"
review: not-run
discoveries:
  - "The installed Herdr skill (~/.agents/skills/herdr/SKILL.md) documents a global --machine that the installed 0.9.0 binary rejects. Detect capabilities from --help, never from documentation."
  - "Herdr API forwarding, even when available, does not forward local configuration. It cannot replace remote native preparation (Claude settings overlay, Codex config reader), so launch must run on the target machine."
  - "worker.ts already forwards PATH/HOME/CODEX_HOME/CLAUDE_CONFIG_DIR from its own process env. Running it remotely gives the correct ownership, as long as the SSH invocation does not carry the caller's values."
  - "resolve --offline returns roleHash write-free, so it can serve as a remote resource-compatibility probe without new code."
  - "The handoff schema already validates any top-level *_revision field. Receipt fields (base_revision, received_revision) need no schema change, but validate locally only after the fetch."
blockers:
  - "D1 central remote with credentials and WIP publication vs direct SSH Git (recommended direct)"
  - "D2 permission to write refs/ruach/incoming/* in remote checkouts"
  - "D3 integration machine: Coordinator local by default, or a declared remote"
  - "D4 fetch by URL and refspec vs named Git remotes"
  - "D5 machines.yaml beside the catalogs vs wrapper flags only"
  - "D6 accept HERDR_ENV=1 set by an explicit --machine SSH launch as authorization"
  - "D7 branch namespace ruach/<machine>/<worker>"
  - "D8 timing of a Herdr upgrade that provides --machine (not required)"
  - "D9 roadmap placement (other agents own docs/roadmap.md)"
  - "D10 datasets, Docker images and accounts provisioned per machine by the owner, referenced only by manifest"
---

# Multi-machine council, round 1: Opus

The full design is in [docs/design/multi-machine-opus.md](../../design/multi-machine-opus.md). This report summarizes it for the council and the Coordinator.

## Position

1. **Boundary.** `ruach-herdr start|resolve --machine <declared>`:
   - resolves the saved Herdr profile (stable profile ID, label for display);
   - resolves the route locally from the Coordinator checkout's catalogs;
   - runs the remote `worker.ts` once over the profile's SSH target, in direct mode, with `env -i` and a declared remote PATH;
   - relays its JSON result inside a machine envelope.

   Native config, accounts and launch material stay on the remote. The safety properties already in the launcher (pinned base, fresh branch, single submission, uncertain-state exit 4, awaiting-input) are reused, not duplicated. A small set of launcher changes is proposed: `--result-file` written atomically, `setsid` around the remote launch, machine envelope, and machine-qualified inspection argv. Herdr `--machine` forwarding is adopted later, for monitoring only, once `--help` shows it.
2. **Identifiers.** Every Herdr ID is paired with `machine_id`, written as `<label>/<id>`. IDs are never reused across servers. Worker names are unique per task across machines.
3. **Preflight, read-only and in order:** profile, SSH with BatchMode, remote executables, remote `herdr status`, remote `resolve --offline` role-hash equality, base commit present remotely, remote dry-run. Machines and routes never change automatically.
4. **Failure.** A transport drop after mutation gives exit 4 with `machine_state: unknown`. Recovery uses the remote result file, `agent get`, `worktree list` and `show-ref`. There is no retry. Remote sessions survive SSH loss, so reconnecting is only a re-read.
5. **Git is the right tool** for source and handoff artifacts, because every revision contract depends on commit identity.
   - Default transport is direct SSH Git: push the base into `refs/ruach/incoming/<task>/<worker>` on the remote, and fetch `refs/heads/ruach/<machine>/<worker>` into `refs/remotes/<machine>/…` without force.
   - Bundles are the fallback.
   - Origin needs owner authorization (credentials, WIP publication).
   - Patches lose identity, rsync carries dirty, ignored and secret state, and shared filesystems create cross-host Git locking hazards.
6. **What moves.** Only commits move. Dirty work becomes a commit, or a salvage commit after a crash. Ignored caches are rebuilt per machine. Datasets move only by a declared checksum manifest. Secrets never move. Test evidence is bound to `(revision, machine, toolchain)`, and the integrated candidate is verified on the integration machine.
7. **Authority.** One Coordinator. One integration checkout per task. Remotes own only their worker branches and never merge or push to origin.

## Handoff sequence (summary)

Outbound:
- deliver the base;
- run preflight;
- `start --machine` creates `ruach/<M>/<worker>`;
- write the assignment through SSH stdin, check its hash, then prompt.

Return:
- the worker commits code, the unchanged assignment and its report, and validates the report;
- an integration Implementer checks that the remote tree is clean, fetches, and verifies ancestor, ref equality, assignment blob hash and the local report validation;
- that Implementer creates the retained local branch and writes the receipt;
- integration and verification then run on the integration machine;
- the Coordinator cleans up the remote worktree, incoming ref and result file.

The receipt fields are in design §9.

## Phases

| Phase | Content |
|---|---|
| 0 | Runbook with today's tools, plus read-only verification of the assumptions on oholiab and tubal |
| 1 | Receipt and per-machine evidence conventions; an optional received-revision verifier, tested with real temporary repositories |
| 2 | `--machine` delegation, tested with a fake `ssh` that executes against a separate fake HOME, PATH and Herdr; the test list is in design §13. Plus one owner-authorized live smoke per machine |
| 3 | Monitoring through SSH, switching to Herdr `--machine` when feature-detected |
| 4 | Bundle helper, checkpoint fetches, remote linked parent; only when use shows the need |

## Assumptions to verify before Phase 2

These are not verified:
- remote Herdr and harness versions;
- whether remote→local SSH exists;
- remote GitHub credentials;
- that no shared filesystem exists;
- remote ramec HEAD and snapshot state;
- whether a noninteractive `herdr` reaches the default socket under the `env -i` allowlist;
- remote native account login.

## Scope and limits

- Only the two artifacts above were written.
- Nothing was mutated on oholiab or tubal. No branch was pushed, nothing was merged, and routing and the roadmap were not changed.
- No application or runtime tests are claimed.
- The single `herdr --machine` probe was local and read-only, and the local CLI rejected it.
