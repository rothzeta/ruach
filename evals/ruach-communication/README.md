# Communication behavioral evaluation packet (R5-P)

Developer evaluation material for the R5 submission, waiting and durable-completion guidance. It lives outside `skills/`, so installed skills exclude it. A native plugin fetched as a complete Git repository can retain these files on disk; they are not registered plugin components and are not subject inputs. All data is synthetic. This packet is **prepared and statically checked only**: no model subject, native CLI or Herdr session has been run or graded, and no static check here is behavioral evidence.

## Layout

| Path | Role |
| --- | --- |
| `cases/NN-*/task.md` and `cases/NN-*/corpus/` | Raw subject material (`*.tmpl` files carry commit, blob and digest tokens that `prepare.ts` renders) |
| `cases/NN-*/git/` | Evaluator-side history specification for the case's genuine Git repository (02 and 04) |
| `expected/rubric.md` | Grader-only expected dispositions, contrasts, critical failures and limits |
| `prepare.ts` | Deterministic offline builder |
| `fixtures/record-state.ts` | Optional recording stub copied into each subject corpus as `app/record-state.ts` |
| `tsconfig.json`, `tests/` | Packet-local typecheck and fixture-realization tests |

## Preparation

```sh
bun evals/ruach-communication/prepare.ts --out <fresh-temp-dir>
```

Requires Bun and Git; no network, model, Herdr or global configuration. The output directory must not exist. It writes `subject/<case>/` (task and corpus, including a real Git repository for cases 02 and 04 built with a fixed identity and dates), `protected/<case>/corpus/` (a byte-identical pristine copy) and `evaluator/manifest.json` (refs, per-file digests and modes, and the existing handoff validator's individual result for every committed report). Raw evidence under `inputs/`, `observations/`, `retained/` and `verifier/` is mode 0444.

```sh
bun test --timeout 30000 evals/ruach-communication
node_modules/.bin/tsc -p evals/ruach-communication/tsconfig.json
```

The second command is run from the repository root after `just install`. Neither is covered by root `just check` or the root test script.

## Subject boundary

Give a fresh native Coordinator subject only: the candidate Coordinator role/workflow resources and handoff skill, **one** `subject/<case>/task.md` with its `corpus/`, and the workflow the evaluation Coordinator selects, supplied separately by that Coordinator (the corpus contains no workflow). Withhold this README, `expected/`, `prepare.ts`, `tests/`, `cases/*/git/`, the other cases, the plan and prior results. Whitelist a resource root containing only the required candidate resources; do not point a subject at the source tree.

## Cases

| Case | Family |
| --- | --- |
| `01-draft-send` | Draft versus accepted send: finish a known matching draft once, retain active work, hold an unidentified draft |
| `02-exited-active` | Update aftermath: an ended harness may get a bounded replacement; an active identity must not be replaced or killed; an unknown state stays unresolved |
| `03-startup-block` | Startup native block: await the user for a matching blocked identity, never certify readiness from a mismatch, reuse the same user-resolved session |
| `04-report-identity` | Pre-existing/revised/handled/evidence-only report identities: consume the new delta once and do not redo a report-only successor |
| `05-timeout-verifier` | Timeout and verifier: retain uncertain active work, treat idle-without-report as not success, reject an old/echoed marker and keep a failed exit failed |

`app/record-state.ts` is a consumer-owned recording stub: it prints raw host facts and appends requested actions to `intents.jsonl`. It tests the subject's instruction decisions against supplied state, not live Herdr correctness; it never starts, stops or prompts a real worker.

## Holds before any live use

The packet is not authority to run a subject. A future R5-S evaluation needs, supplied then and not here: the exact reviewed candidate resource revision, a named native route/model/effort/permissions and budget, an actual installed resource root, a usable native CLI/Herdr session for the primitive subcases, and the realized filesystem/tool boundary with inventory and positive and negative access probes. A theoretical allowlist or an instruction not to read files is not blind evidence. Independent packet review must compare every subject-visible file with the public worked example and both sides of each contrast in the rubric before launch. Native primitive success and offline decision replay are distinct evidence; neither alone closes R5, and if the required boundary cannot be realized, that control is reported unverified rather than passed.
