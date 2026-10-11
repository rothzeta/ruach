# Enoch preparation correction 1

Version 1, from the independent review `../enoch-prep-review.md` (findings E1–E3, committed at 0a469dc3) at the preparation revision e10156d. This note supersedes only the statements named here. `../r1-enoch-prep.md`, `provenance.json`, `seed.patch`, the vitest and static-check logs and `evaluator.md` are historical evidence and unchanged. The seeded clone is untouched.

## E1. Answer access (corrected premise)

`../r1-enoch-prep.md` says the seed commit message was neutralized and the earlier object purged "so the clone history does not reveal the cause". That does not hold. The seed `ea33fc7` is a normal child of the correct base `d163a41`, the clone keeps `main` at the base, and `git show HEAD` or `git diff main` prints the removed correct line. The original `/opt/dev/enoch` is also readable and holds the correct code. The historical report is superseded on this point only.

Disposition (Coordinator choice): classify the seed history and the readable original repository as answer-accessible. The exercise is ordinary non-blind consumer smoke. No claim that the cause is hidden or that diagnosis is held-out; the grader cannot tell diagnosis from copying and must not claim otherwise. No history rewrite or source change. The subject brief stays free of hints, and the subject receives neither the evaluator file nor `seed.patch`.

## E2. Native security dialogs

The future assignment now says that the user reads and answers any native dialog directly, and that the Coordinator records the status and never answers, relays or relaunches around it. This matches the Coordinator role contract.

## E3. Report validator command

The validator resolves the report path against the current directory. The future assignment now uses the absolute `<clone>/docs/exercise/report.md` with `--repo <clone>`, or the clone as the working directory. Verification of the concrete invocation is in the combined-fix1 report.

## Unchanged

Optional O-E1 (local Node v24.21.0 against Enoch's Node 22 rule; record the Node version, claim neither Node 22 nor full `just check`) and O-E2 (before launch compare clone HEAD, branch, clean status and the base..seed diff digest `b8f48d29...` with `provenance.json`, not only that the path exists) remain notes for the launching Coordinator. Subject launch and budget stay pending.
