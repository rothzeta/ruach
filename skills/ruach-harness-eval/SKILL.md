---
name: ruach-harness-eval
description: Check one supplied harness/model evaluation run with repeatable acceptance and scope checks over supplied candidates and versioned fixtures. A checker, not a benchmark runner, launcher or proof of model use (model_use_verified stays false). Explicit evaluation only; do not load for daily coordination, worker launch, or routine implementation.
compatibility: Requires Bun and Git on PATH. Run `bun install --frozen-lockfile` in the skill directory first.
---

# Harness evaluation

Evaluate one supplied run at a time. Read [references/config.md](references/config.md) for the versioned configuration and result contracts. Keep assignment, checks, fixture sources, and declared route metadata explicit; model declarations are not proof of native model use.

Requires Bun and Git on PATH. This skill has no package dependencies. From the copied skill directory, run `bun install --frozen-lockfile`, then `bun test` to verify its CLI contracts.

```sh
bun scripts/acceptance.ts --config evaluation.json --run trial-a --output /outside/checkout/trial-a.json
bun scripts/scope-check.ts --repo /candidate --baseline BASE --candidate CANDIDATE --allow scope.json --output /outside/checkout/scope-a.json
```

Both scripts support `--help`. Normal invocations emit one `schema_version: 1` JSON result, including on failure. Exit 0 means all configured constraints passed; 1 means check/constraint failure; 2 means invalid input, unavailable prerequisites, or evidence-write failure. Diagnostics go to stderr without command output.

Use a fresh output path per invocation: existing files are never overwritten. Output files must be outside the evaluated checkout and its Git metadata. Preserve failed and corrected evidence independently. Acceptance checks execute the supplied argv without a shell, and may write wherever those commands permit; inspect the configuration before execution. The evaluator never launches workers or selects a model.

Scope probes set `GIT_OPTIONAL_LOCKS=0` and never change the worktree or index. Acceptance never checks out, resets, or stashes a candidate; supplied checks can change it, and those changes cause failure. Results distinguish specified candidate commits, observed HEAD, dirtiness, and unverified route declarations. This skill does not operate a coordinator runtime, watchers, scheduling, or benchmarks.
