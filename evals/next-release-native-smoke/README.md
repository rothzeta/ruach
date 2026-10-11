# Native-use smoke packet (offline preparation)

Developer evaluation material for the next-release native smoke (R1-S). It lives outside `skills/`, so installed skills exclude it. A native plugin that copies the whole repository can still leave these files on disk, so they are **not** hidden from a subject by isolated homes or by instruction. Nothing here runs a model, a native CLI, a marketplace or Skills CLI install, or Herdr.

## Layout and subject boundary

| Path | Visible to a subject |
| --- | --- |
| `fixture/consumer/` (a TypeScript/Bun off-by-one library with failing tests) | yes, copied into a fresh Git repository |
| `briefs/assisted.md` (names the Implementer role and skills) | yes, as the task text; the run is **assisted** |
| `briefs/unassisted.md` (task, scope, check, report only; no Ruach, role, route, skill or install hints) | yes, if an unassisted run is authorized |
| `evaluator/` (rubric, solved disposition, answer marker), `scripts/`, `tests/`, `matrix.json`, this README | no |

Scope for a candidate: `src/**` and `docs/reports/smoke.md`. Existing tests, `package.json` and `AGENTS.md` are read-only. The subject `AGENTS.md` and briefs contain no solved answer. Prompt assistance and answer access are recorded separately: `assisted|unassisted` and `blind|non-blind|unverified`.

## Commands

```sh
# Fresh consumer repo, base commit, evaluator config OUTSIDE the candidate (control = corrected candidate).
bun evals/next-release-native-smoke/scripts/prepare.ts --out <fresh-dir> [--control]
# Pinned skills/ruach-harness-eval acceptance + scope check; results in <fresh-dir>/results, never overwritten.
bun evals/next-release-native-smoke/scripts/check.ts --packet <fresh-dir> [--tag NAME]
# Offline snapshot install control in a temp clone with isolated HOME/CODEX_HOME/CLAUDE_CONFIG_DIR.
bun evals/next-release-native-smoke/scripts/offline-install.ts --source <repo> --work <fresh-dir> --revision <sha>
bun evals/next-release-native-smoke/scripts/offline-install.ts --source <repo> --work <fresh-dir> --version 0.3.0
# Access probe (see below)
bun evals/next-release-native-smoke/scripts/probe.ts --spec <spec.json>
bun test --timeout 30000 evals/next-release-native-smoke
```

`prepare.ts` writes `config.json` (harness-eval acceptance: visible tests with a zero-pass guard, hidden cases, handoff validator), `scope.json`, `manifest.json` (base and candidate SHAs, subject file digests) and the assignment copy under `<dir>/evidence`, away from the candidate in `<dir>/consumer`. Child processes are bounded and their process groups killed on return. The checker is a pinned copy of `skills/ruach-harness-eval` at the source revision recorded by the future run; `model_use_verified` stays false.

## Blind claims

A blind claim needs an evaluator-only visibility manifest and probe results obtained **inside the subject's actual effective boundary**: full inventory of the source clone, complete plugin cache, project and user skill roots, cwd/add-dir roots, alias/symlink paths, plans, prior reports and other run outputs; positive reads of the raw task and installed role/skill bytes (digests match the recorded bytes); negative reads of paths holding `RUACH_SMOKE_ANSWER_MARKER_7f3a1c` that are denied or unreachable. `scripts/probe.ts` supplies the schema and controls but run offline it proves nothing about a subject. If the equivalent route boundary is unavailable, the run is ordinary **non-blind smoke** and blind evaluation is unverified. Do not trim plugin cache, swap source views, change global settings or decide packaging (D1) to obtain a blind result.

## Route matrix

[matrix.json](matrix.json) lists the five rows (Claude plugin native agent, Claude snapshot adapter, Codex snapshot, Claude Skills CLI, Codex Skills CLI) and the separately named fallback. Live execution is a separate assignment after a reviewed combined source SHA, hosted green or an explicit waiver, a named budget and the readiness evidence listed in `supplied_at_execution`.
