task: RUACH-ROADMAP-IMPLEMENTATION/R-NATIVE-PREP2
status: needs-decision
outcome: "Node 22, the adapter checker arrangement, the plugin root-dependency evidence and static proof of environment forwarding are done; credential placement into the isolated roots and the adapter dry-run were each denied by the auto-review classifier, so both are unresolved and need your permission or direct action. Zero subject turns were launched."
baseline_revision: eb7ae9441a7b71a745401d5b1955f9596df4afe3
artifacts:
  - docs/reports/next-release/native-prep2.md
  - docs/assignments/next-release/native-prep2.md
  - docs/reports/next-release/native-prep2/manifest.redacted.json
  - docs/reports/next-release/native-prep2/plugin-root-dependencies.json
  - docs/reports/next-release/native-prep2/enoch-seed-test.log
  - docs/reports/next-release/native-prep2/enoch-seed-lint.log
  - docs/reports/next-release/native-prep2/enoch-seed-typecheck.log
  - "Task-local, uncommitted: /tmp/ruach-implementation-20261011/live/manifest.json, verify-adapter.sh, node22/, roots/, enoch-checks/"
verification:
  - "G1 attempt: install -m 600 of the existing native Claude credential file into the four isolated Claude roots (claude-plugin, claude-skills-cli, r3-claude, enoch-claude) was DENIED by the auto mode classifier (reason: Credential Leakage); nothing was copied, no Codex credential copy was attempted, no value was read or printed; I did not retry or work around it"
  - "G2 static inspection of skills/ruach-herdr/scripts/worker.ts line 120: PATH, HOME, CODEX_HOME and CLAUDE_CONFIG_DIR are forwarded via --env when set in the launcher's own environment, on workspace create, pane split and the linked-mode split; XDG variables are not forwarded; adapters.md lines 41-43 document the same; no --env option on worker.ts is needed. Contract confirmed by code, not by a run"
  - "G2 start --dry-run in the isolated child environment: the command was DENIED by the same classifier after the G1 denial and was not retried; the exact isolated argv proof is therefore not obtained"
  - "G3: official Node v22.23.3 linux-x64 tarball downloaded into live/node22, sha256 df450af89261115ef9f9e3830c3eeb2cc9213b63c720b1af623cb5dcbe2e02de checked against the SHASUMS256.txt from the same host (the detached GPG signature was not verified); node --version v22.23.3"
  - "G3 seed checks with that Node first on PATH, in the clone at ea33fc70456bf45bdd51e6eedcb83cf5cdf89347, under the verification lock: npm --prefix src/Enoch.Ui run test exit 1 (1 failed 17 passed, the expected regression in src/api.test.ts), run lint exit 0, run typecheck exit 0; clone status clean afterwards"
  - "G3 not run: Enoch just check, .NET build or tests, Docker pulls, services"
  - "G2 checker arrangement: live/verify-adapter.sh builds a separate verification packet (evidence copy plus a fresh clone at the subject branch) and runs the packet check.ts; mechanics self-tested on a base run with --allow-base (acceptance exit 1 as the failing base should, scope exit 0, check.ts exit status consistent), self-test directory removed; this is not a subject result"
  - "G4: plugin root dependency evidence recorded in plugin-root-dependencies.json; source stays at provisional 5b9d554081f4b38050fd1076f62907e64ae9ee1f"
  - "Validator and git diff --check: see Validation"
review: not-run
discoveries:
  - "The auto-review classifier blocked later commands that merely mention the isolated native config environment variables after the credential-copy denial; ordinary commands still run."
  - "Codex has a safer candidate that copies nothing: keep the real CODEX_HOME (account preserved) and give only HOME an isolated path. Its limits are untested: sessions and logs would write into the real Codex home and its config.toml applies. Claude has no equivalent because plugins and credentials share one config directory."
  - "Native-prep.md is unchanged."
blockers:
  - "G1: isolated native roots remain unauthenticated. Options for you: (a) run the interactive login once per isolated root yourself; (b) add a Bash permission rule that allows copying only the existing credential file for each named root, with 0700 and 0600 modes, then I finish in one step; (c) accept the Codex real-home variant above. I will not copy a credential without one of these."
  - "G2: adapter isolation is proven only by code. To obtain the dry-run argv I need the same permission as G1 (or you may run the launcher dry-run yourself in the isolated environment)."
  - "G4: wait for the exact accepted-candidate amendment before refreshing any resource."


# R-NATIVE-PREP2 report

I stopped at the two denials as the classifier instructed; everything else the assignment asked for is done. The old preparation report is unchanged and no product code, workflow body, native account file, setting or discovery link was touched.

## Outcomes by gate

- **G1 authentication:** not resolved, denied (above). Auth status of the isolated roots is still logged out; model availability was not tested.
- **G2 adapter:** the documented forwarding is real in the source. The adapter row must be launched with `worker.ts start` run inside an environment that sets the isolated home and config roots, with the Herdr context, socket and PATH preserved, as the assignment describes. The launcher forwards only those four variables. Isolated roots for this row: `live/roots/claude-adapter/`, recorded in the manifest. Checker: `live/verify-adapter.sh smoke/claude-adapter live`, which leaves the subject worktree and native cleanup to the root.
- **G3 Node 22:** pinned runtime and focused results above; the exercise stays focused, with full `just check` explicitly outside it.
- **G4:** the Claude 2.1.296 install created root development dependencies (typescript 7.0.2, bun-types 1.4.2, @types/bun 1.4.2, @types/node 26.6.4, undici-types 8.9.0) in the plugin cache at install time and no skill-level modules; digests are in the evidence file. The 2.1.292 observation in `docs/native-parity.md` is preserved. No packaging decision is made.

## Updated artifacts and remaining gates

Updated manifest: `live/manifest.json` (redacted copy committed). Remaining gates: G1 and the G2 dry-run, the accepted-candidate amendment, and root-owned launch, monitoring and cleanup. Cleanup paths: `live/` and `enoch-exercise/`, including `live/node22/`. Zero subject turns, native sessions or Herdr workers were launched.

## Validation

The handoff validator and `git diff --check` exited 0 on this report before its commit.
