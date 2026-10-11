# Verification-disposition behavioral evaluation packet (R7-P)

Developer evaluation material for the R7 verification guidance (environment versus defect versus unknown, registered retries and main recurrence, full-exit/log transport, and invariant-preserving test splits). It lives outside `skills/`, so installed skills exclude it. A native plugin fetched as a complete Git repository can retain these files on disk; they are not registered plugin components and are not subject inputs. All data is synthetic. This packet is prepared and statically checked only: **no model subject has been run or graded**, and no static check here is behavioral evidence.

## Layout

| Path | Role |
| --- | --- |
| `cases/NN-*/task.md` and `cases/NN-*/corpus/` | Raw subject material (`*.tmpl` files carry commit, blob and digest tokens that `prepare.ts` renders) |
| `cases/NN-*/git/spec.json` | Evaluator-side history specification for the case's genuine Git repository |
| `support/verifier.ts` | Deterministic offline verifier stand-in (prints lines, then exits the requested code) |
| `support/transport.ts` | Correct full-log capture and the naive pipeline the packet tests against; packet-local test support only |
| `expected/rubric.md` | Grader-only expectations, controls, critical failures and the comparison with the public examples |
| `prepare.ts` | Deterministic offline builder |
| `tsconfig.json`, `tests/` | Packet-local typecheck and fixture-realization tests |

## Preparation

```sh
bun evals/ruach-verification/prepare.ts --out <fresh-temp-dir>
```

Requires Bun and Git; no network, model, Herdr or global configuration. The output directory must not exist. It writes `subject/<case>/` (task and corpus, including a real Git repository where the case has one), `protected/<case>/corpus/` (a byte-identical pristine copy) and `evaluator/manifest.json` (refs, per-file digests and modes, and the existing handoff validator's individual result for every committed report). Raw owner evidence under `inputs/`, `observations/`, `retained/`, `policy/` and `logs/` is mode 0444.

```sh
bun test --timeout 30000 evals/ruach-verification
node_modules/.bin/tsc -p evals/ruach-verification/tsconfig.json
```

The second command is run from the repository root. Neither is covered by root `just check` or the root test script.

## Subject boundary

Give a fresh native Reviewer subject only the accepted candidate guidance (R7-G, plus the R6-G receiver guidance once refreshed into this packet), supplied **one** `subject/<case>/task.md` with its `corpus/`, and any workflow the evaluation Coordinator selects, supplied separately by that Coordinator. Withhold this README, `expected/`, `prepare.ts`, `tests/`, `support/`, `cases/*/git/`, the other cases, the plan and prior results. Whitelist a resource root containing only the required candidate resources; do not point a subject at the source tree.

Every case is inspection and disposition drafting. `support/` models transport mechanics for the evaluator's checks; a subject receives the raw `logs/` captures, not the support scripts, and performs no real verification run of its own.

## Cases

| Case | Family |
| --- | --- |
| `01-environment-defect-unknown` | Capability denial before assertions versus candidate behavior under supported permissions versus an unestablished cause |
| `02-registered-retry` | A permitted same-state retry versus a forbidden entry, a mismatched symptom, a changed candidate and a second failure |
| `03-main-recurrence` | A recurrence in the primary supported environment versus an isolated matching worker-sandbox event |
| `04-exit-truncation` | Verifier exit 23 beyond a 120-line prefix, a log-writer failure and a genuine full pass |
| `05-invariant-split` | An unspecified-order membership/multiplicity/nonmutation contract versus an explicit seeded-order contract |

The raw failures, exits, log truncations, register entries and policy files are supplied facts, not expected dispositions. `support/verifier.ts` is a synthetic stand-in; it tests evidence transport, not an actual environment cause or product fix.

## Holds before any live use

The packet is not authority to run a subject. A future evaluation needs, supplied then and not here: the exact combined candidate resource revision (accepted R7-G and R6-G as refreshed into this packet), the selected workflow, a named native route/model/effort/permissions and budget, an actual installed resource root, and the realized filesystem/tool boundary with inventory and positive and negative access probes. A theoretical allowlist or an instruction not to read files is not blind evidence. Independent packet review must compare every subject-visible file with the public examples and both sides of each contrast in the rubric before launch. The corpus was prepared while the R7-G guidance revision was still independently reviewed, not yet accepted: the packet requires a final refresh to the accepted guidance before acceptance or execution, and that gate is recorded in the R7-P report. If an equivalent access boundary is unavailable, any run is ordinary non-blind smoke and blind evaluation stays unverified.
