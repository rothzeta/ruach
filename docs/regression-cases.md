# 0.3 regression-case inventory

Maps each regression case named in the roadmap (Track B) to its finding, owner and test. Tests exercise public boundaries (CLI exit codes, structured results, resulting filesystem or Git state), not generated text. Finding IDs RU-xx come from an external audit not reproduced in this repository; where a mapping below is inferred from the roadmap's "Done when" text it is marked *(inferred)*.

Status: `[ ]` not yet implemented, `[x]` implemented. Owner `impl-a` = A1/A3/A4/A6 work, `A5` = later recoverable-installation work.

| Case | Finding / item | Boundary to test | Owner | Status |
| --- | --- | --- | --- | --- |
| Replacement refs (`refs/replace`) cannot alter pinned reads | RU-01 *(inferred)* / A1 | Launch/read against a repo with a replace ref; pinned content unchanged | impl-a | [ ] |
| Index flags `assume-unchanged` / `skip-worktree` fail closed | RU-02 *(inferred)* / A1 | Launch against a dirty file hidden by each flag; structured failure, no mutation | impl-a | [ ] |
| Symlinked cwd: worker cwd and Git identity belong to the created worktree | RU-03 *(inferred)* / A1 | Start with a symlinked `--cwd`; reported cwd and Git root are canonical and match the new worktree | impl-a | [ ] |
| Alias/collection mapping keys in handoff YAML rejected | RU-04 / A3 | Validator exits 1 with a stable code | impl-a | [ ] |
| FIFO/special-file artifact yields a bounded structured failed check | RU-05 / A4 | Harness check on a FIFO path returns failure within the deadline | impl-a | [ ] |
| Descendant pipes: process helpers cannot hold output open past the deadline or kill unowned groups | RU-06 / A4 | Child that forks a pipe-holding descendant; single settlement within bound | impl-a | [ ] |
| Hardlinked outside copies untouched by install/upgrade | RU-07/08/09 / A5 | Install over a tree containing a hardlink to an outside file; outside content unchanged | A5 (later) | [ ] |
| Install leftovers in incoming skill roots preflighted; rollback bounded; immediate integrity check | RU-07/08/09 / A5 | Failed/partial install leaves previous state recoverable | A5 (later) | [ ] |
| Relative or empty `PATH` entries: probed binary equals launched binary | RU-10 / A6 | PATH with `.`/empty entry and cwd-planted executable | impl-a | [ ] |
| NUL in revision rejected before Git is invoked | RU-15 / A3 | Validator `--repo` run with NUL revision exits 1 | impl-a | [ ] |
| Type errors fail the gate | RU-12 / B | `tests/typecheck.test.ts` | impl-b | [x] |
| Patched dependency floors (ws, yaml) | A2 | `tests/dependencies.test.ts` | impl-b | [x] |

Every listed case belongs to an item owned by impl-a or to the later A5 work, so impl-b implements only the two cases marked done. A5 cases are listed only.
