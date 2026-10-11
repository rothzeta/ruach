# Handoff-delivery behavioral evaluation packet (R6-P)

Developer evaluation material for the R6 delivery guidance (revision/evidence identity, target and authority, serialized queues and partials, receipts and remote state). It lives outside `skills/`, so installed skills exclude it. A native plugin fetched as a complete Git repository can retain these files on disk; they are not registered plugin components and are not subject inputs. All data is synthetic. This packet is prepared and statically checked only: **no model subject has been run or graded**, and no static check here is behavioral evidence.

## Layout

| Path | Role |
| --- | --- |
| `cases/NN-*/task.md` and `cases/NN-*/corpus/` | Raw subject material (`*.tmpl` files carry commit, blob and digest tokens that `prepare.ts` renders) |
| `cases/NN-*/git/spec.json` | Evaluator-side history specification for the case's genuine Git repository |
| `expected/rubric.md` | Grader-only expectations, controls, critical failures and the comparison with the public examples |
| `prepare.ts` | Deterministic offline builder |
| `tsconfig.json`, `tests/` | Packet-local typecheck and fixture-realization tests |

## Preparation

```sh
bun evals/ruach-handoff-delivery/prepare.ts --out <fresh-temp-dir>
```

Requires Bun and Git; no network, model, Herdr or global configuration. The output directory must not exist. It writes `subject/<case>/` (task and corpus, including a real Git repository), `protected/<case>/corpus/` (a byte-identical pristine copy) and `evaluator/manifest.json` (refs, per-file digests and modes, and the existing handoff validator's individual result for every committed report). Raw owner evidence under `inputs/`, `observations/`, `retained/` and `publications/` is mode 0444.

```sh
bun test --timeout 30000 evals/ruach-handoff-delivery
node_modules/.bin/tsc -p evals/ruach-handoff-delivery/tsconfig.json
```

The second command is run from the repository root. Neither is covered by root `just check` or the root test script.

## Subject boundary

Give a fresh native Implementer subject only the accepted candidate guidance (R6-G and R6-S, plus the R7-G verification reference once refreshed into this packet), the handoff skill, **one** `subject/<case>/task.md` with its `corpus/`, and any workflow the evaluation Coordinator selects, supplied separately by that Coordinator. Withhold this README, `expected/`, `prepare.ts`, `tests/`, `cases/*/git/`, the other cases, the plan and prior results. Whitelist a resource root containing only the required candidate resources; do not point a subject at the source tree.

Only case `02-target-authority` grants one local fixture fast-forward; every other case is inspection, receipt or bounded-assignment drafting. A subject performs no push, tag or publication in any case.

## Cases

| Case | Family |
| --- | --- |
| `01-evidence-identity` | Tested versus evidence-only versus behavior-changed candidates; missing/noncommit revision fields |
| `02-target-authority` | Reviewed combined candidate against an unmoved target, a moved target and a target the grant does not name |
| `03-queue-partials` | Individual reviews versus a combined review; requested diff, untracked file, retained checkout and a colliding path |
| `04-receipt-remote` | Local delivery result versus cached, live or failed remote state, and a retained failed publication |

`repo/` in each case is a real isolated history built with fixed identity and dates; `observations/`, `retained/` and `publications/` hold raw command output and owner evidence, not expected actions.

## Holds before any live use

The packet is not authority to run a subject. A future evaluation needs, supplied then and not here: the exact combined candidate resource revision (accepted R6-G/R6-S and R7-G as refreshed into this packet), the selected workflow, a named native route/model/effort/permissions and budget, an actual installed resource root, and the realized filesystem/tool boundary with inventory and positive and negative access probes. A theoretical allowlist or an instruction not to read files is not blind evidence. Independent packet review must compare every subject-visible file with the public examples and both sides of each contrast in the rubric before launch. The corpus was prepared while the R6-G/R6-S guidance revision was still independently reviewed, not yet accepted: the packet requires a final refresh to the accepted guidance before acceptance or execution, and that gate is recorded in the R6-P report. If an equivalent access boundary is unavailable, any run is ordinary non-blind smoke and blind evaluation stays unverified.
