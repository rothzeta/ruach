task: SCOUT-C2-NATIVE
status: complete
outcome: "Account-backed catalog confirms exact Gemini routes; additive role/skill composition remains unproven because native inspection reached a workspace-trust dialog and was stopped without approval or inference."
artifacts:
  - docs/reports/c1-c5/c2-native-interface.md
  - docs/assignments/c1-c5/SCOUT-C2-NATIVE.md
evidence_baseline: 5a447799e1f9222bb1a270ec77c8d16e83d0d559
source_revision: 2b693cd72bf39c29575841a88d9c7ae719a29715
verification:
  - "One authorized escalated agy models retry: exit 0; six exact Gemini slugs returned from the account-backed native catalog."
  - "Native /context print inspection: exit 2, explicitly unavailable, zero turns and zero tokens."
  - "Native interactive inspection: reached workspace-trust dialog; no selection confirmed or prompt submitted; cancelled with two ctrl+c inputs, exit 0."
  - "Two persistent settings file hashes match before catalog and after all native probes."
  - "Canonical ruach-handoff validation and owned-document whitespace checks passed."
review: not-run
discoveries:
  - "gemini-3.8-flash-medium is offered by this account and selected by the native UI; inference entitlement/response remains untested."
  - "The installed CLI explicitly disallows /context in print mode; disabling slash handling would send it to inference, so that workaround was not used."
  - "A private --add-dir rule/skill overlay is a documented research candidate, not an established native composition mechanism."
blockers:
  - "Native project trust blocks inspection of initialized composition at /tmp/c15-c2-native-probes/project; the assignment prohibits answering this dialog."
  - "Baseline-plus-role composition, canonical technical-skill discovery and added-directory scope still need actual native evidence after owner disposition of that specific trust boundary."

> Editorial portability view: machine-local evidence locations are literal paths. [Original snapshots and curation provenance](../releases/0.7.0/ci-portability.md) remain available; historical findings are unchanged.

# C2 native interface follow-up — 2026-10-25

The catalog limitation in the [prior report](c2-capability.md) is resolved for this binary/account. The additive composition limitation is narrowed to a concrete native trust boundary: the interactive inspector stops before establishing the session's context. This is not evidence that agy lacks additive role support. It is also not sufficient evidence to implement or mark a production adapter live-capable.

This follows the [unchanged SCOUT-C2-NATIVE assignment](../../assignments/c1-c5/SCOUT-C2-NATIVE.md), SHA-256 `7a62f06134ad641d64a398f1060b80a43a0d99410b6401222639f11b1a53f93e`. The previous report remains unchanged. Only this report and the assignment are committed. No failed Architect pane access, source-launch retry, adapter edit, route edit, Herdr worker, inference, install, push or cleanup occurred. Raw receipts and private material remain in /tmp/c15-c2-native-probes (`/tmp/c15-c2-native-probes`).

## Verified native route

The binary is unchanged: `/home/metatron/.local/bin/agy`, version **1.4.6**, SHA-256 `128780f5776959ba6a991bde1f0a8b699eee37a59ed30deb9926147fedfa56c4`. Version identity was established in the prior probes and confirmed by binary-hash comparison before this investigation. Worktree HEAD before investigation was `5a447799e1f9222bb1a270ec77c8d16e83d0d559`; the underlying launcher source remains at the recorded source revision.

Exactly one model-catalog retry used the assignment's supported per-command escalation for runtime log/crash writes, local sockets, language-server initialization and ordinary account-backed requests. It started at `2026-10-25T19:05:41.028Z`, with structured argv and a 60-second process bound:

```json
{
  "argv": ["/home/metatron/.local/bin/agy", "models"],
  "cwd": "/opt/dev/ruach-worktrees/c15-c2-scout",
  "exit": 0,
  "timedOut": false
}
```

stderr was `Fetching available models...`. Native stdout offered these exact Gemini routes:

| Native slug | Native display name |
| --- | --- |
| `gemini-4-argon-medium` | Gemini 4 Argon (Medium) |
| `gemini-4-argon-high` | Gemini 4 Argon (High) |
| `gemini-4-argon-low` | Gemini 4 Argon (Low) |
| `gemini-3.8-flash-high` | Gemini 3.8 Flash (High) |
| `gemini-3.8-flash-medium` | Gemini 3.8 Flash (Medium) |
| `gemini-3.8-flash-low` | Gemini 3.8 Flash (Low) |

The catalog also listed seven non-Gemini routes; none was selected. Full output and before/after settings hashes are in models.json (`/tmp/c15-c2-native-probes/models.json`). This is actual native account-backed catalog evidence, superseding documentation examples. It does not establish a successful inference, quota, or every model/effort combination.

For both subsequent native probes the exact route stayed **`gemini-3.8-flash-medium`**, with no separate `--effort` flag. The interactive footer showed `Gemini 3.8 Flash · medium`. There was no provider/CLI/model fallback after an error. This is the concrete route to retain for a later bounded composition or reviewed-adapter advisory run, subject to a fresh catalog check if environment/account/binary changes. No development model catalog or role allowlist was changed.

## Composition investigation and precise boundary

Official [rules documentation](https://www.agy.dev/docs/rules/) describes cumulative native rule composition and include expansion. That supports investigating an additional workspace rule rather than replacing native instructions with a role prompt. It does **not** prove how this installed version scopes rules from `--add-dir`. Official [custom-agent documentation](https://www.agy.dev/docs/subagents?tab=cli) supports primary-agent selection from discovered Markdown agents, but leaves preservation of the existing primary system/customization composition insufficiently established for this adapter's contract.

Private probe material was prepared under `/tmp`, with no native-discovery or configuration files changed in a retained repository or global home:

| Private path | Purpose |
| --- | --- |
| `/tmp/c15-c2-native-probes/project/AGENTS.md` | Positive consumer baseline marker `NATIVE_BASELINE_C2_20261025`, plus explicit no-subagent/no-edit/no-external-service diagnostic constraints |
| `/tmp/c15-c2-native-probes/private role ü/.agents/rules/ruach-scout.md` | `trigger: always_on`; documented file include of `/opt/dev/ruach/agents/scout.md`; canonical role/skill source context; marker `ROLE_OVERLAY_C2_20261025`; no workflow-body injection |
| `/tmp/c15-c2-native-probes/private role ü/.agents/skills/ruach-handoff` | Symlink to the canonical technical skill `/opt/dev/ruach/skills/ruach-handoff` |
| `/tmp/c15-c2-native-probes/private role ü/.agents/agents/scout.md` | Symlink to the canonical Scout role for possible non-model discovery inspection; no `--agent` selection was performed |

Canonical Scout SHA-256 remains `750eb21d2dc8e11bd7008207fba8d88d5744b789f7d646d939b50c1657db4376`. The rule uses a source include, not an edited copy of the canonical role and not later task text. The source context explicitly resolves relative references at the canonical role location and directs workers not to load workflow bodies. Only the named technical skill was linked. These are **prepared material facts**, not claims that native discovery accepted them. Preparation script: prepare.ts (`/tmp/c15-c2-native-probes/prepare.ts`).

The first inspection attempted the native `/context` report without a model request:

```json
{
  "argv": ["/home/metatron/.local/bin/agy", "--model", "gemini-3.8-flash-medium", "--print", "/context", "--output-format", "json", "--print-timeout", "45s"],
  "cwd": "/tmp/c15-c2-native-probes/project",
  "exit": 2,
  "timedOut": false
}
```

Exact decisive response:

```text
/context is not available in print mode (it opens the interactive context breakdown); pass --disable-slash-commands to send /context to the model as literal text
```

The returned envelope had empty conversation ID, `status: ERROR`, `num_turns: 0`, duration 0, and every usage counter 0. Full receipt: context-baseline.json (`/tmp/c15-c2-native-probes/context-baseline.json`). The external process bound was 60 seconds; no timeout occurred. I did not disable slash handling or reinterpret a context-inspection command as a model task.

The official [/context documentation](https://www.agy.dev/docs/cli/commands/context/) identifies an interactive inspector with separate system/customization token categories and tracked system/skill file paths. A direct native PTY was therefore opened for that necessary non-model interface, using the same selected route and the private overlay:

```json
{
  "argv": ["/home/metatron/.local/bin/agy", "--model", "gemini-3.8-flash-medium", "--add-dir", "/tmp/c15-c2-native-probes/private role ü"],
  "cwd": "/tmp/c15-c2-native-probes/project"
}
```

It initially displayed an automatic sign-in spinner, then reached this exact native boundary:

```text
Accessing workspace:
/tmp/c15-c2-native-probes/project
Do you trust the contents of this project?
Antigravity CLI requires permission to read, edit, and execute files here.
> Yes, I trust this folder
  No, exit

Gemini 3.8 Flash · medium
```

The highlighted default is **not an approval**. No Enter, selection, slash command, or model prompt was sent. On observing the dialog I stopped this action as the assignment requires. One Ctrl+C produced `press ctrl+c again to exit`; a second Ctrl+C exited the owned process with code 0. This was process cancellation, not an answer to the security dialog. No Herdr worker or unbounded background service was requested. This inspection ended promptly at the dialog; no inference ran and the ten-minute inference allowance was not consumed. Safe PTY excerpts and termination receipt: interactive-receipt.json (`/tmp/c15-c2-native-probes/interactive-receipt.json`).

Consequently, the intended positive test could not be evaluated: neither baseline rule preservation nor initialized role include/skill visibility was observed in native `/context` or an actual initialized prompt. No model self-report is presented as proof. The blocked interface does not establish that `--add-dir` discovers the overlay, that custom-agent selection replaces or appends native system text, or that any ambient workflows are hidden.

## Other interface leads and constraints

A read-only installed-binary string inspection found generated native symbols including `CustomAgentConfig.GetSystemPromptSections`, `GetSystemPromptConfig`, `GetExcludeDefaultComponents`, and `GetAllCustomAgentConfigs`. The narrow symbol output is retained in symbols.txt (`/tmp/c15-c2-native-probes/symbols.txt`). Symbols alone do not define an accessible supported CLI API, payload schema, default semantics or endpoint authority; no guessed native RPC, vendor API modification or internal server attachment was attempted.

The official [hook contract](https://www.agy.dev/docs/hooks/) documents pre-invocation system-message injection and native transcript metadata. It is another potential additive mechanism, but this investigation did not register hooks or prove private per-launch hook discovery. Its project/global/plugin configuration surfaces cannot be treated as permission to modify a consumer's hooks or persistent native settings. The native rules/skills overlay is likewise an investigation candidate, not an implemented adapter API.

These limits are specific:

- Account-backed model enumeration is now proven with permitted runtime initialization. Native help/version and kind-support facts remain as recorded previously; they were not broadly re-probed.
- Native `/context` inspection in print mode is explicitly unsupported in 1.4.6. Interactive inspection is available in documentation but blocked here by this exact temporary project's trust decision.
- Additive primary-session role transport, role include expansion, technical-skill discovery from an added directory, preservation of native project/personal/plugin context, and actual linked-checkout behavior remain unverified. This report supplies no universal claim that they are impossible.
- No selective workflow deny was exercised. A future accepted visibility limit may acknowledge ambient descriptions while ensuring the launcher does not inject workflow bodies and the initialized worker does not load them. Prepared worker-only links alone prove neither native exclusion nor behavioral compliance.
- Inherit remains the only proposed permission mapping. No mode, bypass, trust, account, credential, purchase, discovery or persistent-setting change was requested. No extra financial-approval gate was imposed for catalog or composition inspection.

## Verification, next step and implementation readiness

The two inspected persistent files, `~/.gemini/antigravity-cli/settings.json` and `~/.gemini/config/config.json`, have matching hashes before the catalog retry and after the native probes. This includes the existing trust-bearing settings file. final-state.json (`/tmp/c15-c2-native-probes/final-state.json`) records those comparisons. The check is limited to those files; native runtime log/cache/state writes were authorized and are not claimed absent. No explicit authentication/account/credential operation was invoked; the CLI's automatic spinner is reported rather than interpreted as a manual account change.

No automatic approval review rejected an action. All escalations above were granted; the stopping condition was the native trust dialog and the assignment's explicit prohibition on answering it. No inference, token charge, actual model response or usable-inference entitlement is claimed. The zero-usage context-error envelope is the only model-usage receipt produced. The permitted one-inference budget remains unused; it is not permission for an adapter smoke or retry.

Smallest next step for the Coordinator: obtain an owner disposition of **this exact temporary workspace trust dialog**, or supply a consumer-approved diagnostic workspace with the required existing trust and permission to place private probe material. Do not silently select another directory to evade the observed prompt. After that boundary is resolved, resume the native inspector on the same exact offered Gemini route, first checking that native system/customization sections, the positive baseline marker, canonical role include and technical skill coexist. If runtime telemetry cannot expose initialized role contents, use the still-unconsumed single diagnostic inference only with independent native loading/composition evidence; model self-report alone is insufficient. A literal brief path and bounded diagnostic prompt must be submitted separately from role initialization.

Until those checks establish a supported additive interface, **no production C2 adapter implementation is justified by this investigation**. A later scoped assignment may implement the existing Plan contract once a concrete interface is proven, retain an explicit visibility limitation where supported, and separately review actual advisory validation. No modification to launcher source, routing, permission defaults or global configuration is recommended merely to get past this trust decision.

Checks performed: the exact native probes and settings/hash comparisons above; `bun /opt/dev/ruach/skills/ruach-handoff/scripts/validate.ts docs/reports/c1-c5/c2-native-interface.md --repo /opt/dev/ruach-worktrees/c15-c2-scout` (exit 0); owned-document `git diff --check` (exit 0). No unrelated suites or prior failure tests were repeated; no source/test code changed. Mechanical handoff validation is not native composition acceptance or independent review.
