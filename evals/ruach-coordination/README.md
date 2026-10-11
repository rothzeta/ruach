# Coordination behavioral evaluation packet

Developer evaluation material for the R3 coordination guidance (task record, assignment completeness, resumption and authority validation). It lives outside `skills/`, so installed skills exclude it. A native plugin fetched as a complete Git repository can retain these files on disk; they are not registered plugin components and are not subject inputs. All data is synthetic. This packet is prepared and statically checked only: **no model subject has been run or graded**, and no static check here is behavioral evidence.

## Layout

| Path | Role |
| --- | --- |
| `cases/NN-*/task.md` and `cases/NN-*/corpus/` | Raw subject material (`*.tmpl` files carry commit, blob and digest tokens that `prepare.ts` renders) |
| `cases/NN-*/git/` | Evaluator-side history specification for the case's genuine Git repository (01 and 03) |
| `expected/rubric.md` | Grader-only expectations, controls, critical failures and the comparison with the public worked example |
| `prepare.ts` | Deterministic offline builder |
| `tsconfig.json`, `tests/` | Packet-local typecheck and fixture-realization tests |

## Preparation

```sh
bun evals/ruach-coordination/prepare.ts --out <fresh-temp-dir>
```

Requires Bun and Git; no network, model, Herdr or global configuration. The output directory must not exist. It writes `subject/<case>/` (task and corpus, including a real Git repository for cases 01 and 03 built with fixed identity and dates), `protected/<case>/corpus/` (a byte-identical pristine copy) and `evaluator/manifest.json` (refs, per-file digests and modes, and the existing handoff validator's individual result for every committed report). Raw evidence under `inputs/`, `observations/` and `retained/` is mode 0444. Generated state stays under the chosen directory.

```sh
bun test --timeout 30000 evals/ruach-coordination
node_modules/.bin/tsc -p evals/ruach-coordination/tsconfig.json
```

The second command is run from the repository root. Neither is covered by root `just check` or the root test script.

## Subject boundary

Give a fresh native Coordinator subject only: the candidate `agents/coordinator.md`, the candidate specimens and handoff skill, **one** `subject/<case>/task.md` with its `corpus/`, and the workflow the evaluation Coordinator selects, supplied separately by that Coordinator (the corpus contains no workflow). Withhold this README, `expected/`, `prepare.ts`, `tests/`, `cases/*/git/`, the other cases, the plan and prior results. Whitelist a resource root containing only the required candidate resources; do not point a subject at the source tree. The CSV-142 specimen is public teaching material and not a held-out case.

## Cases

| Case | Family |
| --- | --- |
| `01-resume` | Liveness against stale records, retained partial work, exclusive resources, report identity and handled state |
| `02-ambiguity` | Ambiguous replies with and without mapping evidence, advisor vs Coordinator vs owner authority, scoped supersession |
| `03-authorization` | Scoped merge authority across target topologies, revocation, unrelated supersession, moved destination |

`app/workers.ts` in case 01 is a consumer-owned recording stub: it prints raw host facts and appends requested actions to `intents.jsonl`. It tests the subject's instruction decisions against supplied state, not live Herdr correctness; it never starts a worker.

## Holds before any live use

The packet is not authority to run a subject. A future evaluation needs, supplied then and not here: the exact combined candidate resource revision (accepted A and B), the selected workflow, a named native route/model/effort/permissions and budget, an actual installed resource root, and the realized filesystem/tool boundary with inventory and positive and negative access probes. A theoretical allowlist or an instruction not to read files is not blind evidence. Independent packet review must compare every subject-visible file with the public example and both sides of each contrast in the rubric before launch. The corpus was prepared against accepted A `123ade32ad05b980cb3efa14abff08b2503193e5`; final resources require the later A+B refresh. If an equivalent access boundary is unavailable, any run is ordinary non-blind smoke and blind evaluation stays unverified.
