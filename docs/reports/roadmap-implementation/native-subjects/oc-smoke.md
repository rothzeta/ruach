task: oc-smoke
status: complete
outcome: Fixed inclusiveRange so the loop includes the end endpoint; all 4 repository tests pass with no changes to tests or package.json.
tested_revision: e47359bc846993a175272ed37b40aa100fbddf8b
artifacts:
  - src/range.ts
  - docs/reports/smoke.md
verification:
  - "bun test: 4 pass, 0 fail, 6 expect() calls across tests/range.test.ts (run at tested_revision e47359b)"
  - "git diff at tested_revision: only src/range.ts changed, one line (value < end -> value <= end)"
discoveries: []
blockers: []

# oc-smoke implementation handoff

## Summary

`inclusiveRange` documented that it returns whole numbers from `start` through
`end`, both included, but its loop condition used `value < end`, dropping the
final endpoint. The fix changes the condition to `value <= end`. `rangeSize`
delegates to `inclusiveRange`, so it is corrected transitively.

## Change

- `src/range.ts`: loop bound changed from `value < end` to `value <= end`.

No other files were modified. Existing tests in `tests/**` and `package.json`
were left untouched, per scope.

## Verification

Before the change, `bun test` reproduced the failure (3 fail / 1 pass) with
`inclusiveRange(1, 3)` returning `[1, 2]` and `rangeSize(0, 9)` returning `9`.
After the change, `bun test` reports 4 pass / 0 fail, 6 expect() calls.

## Notes

`tested_revision` is the implementation commit. This report is recorded in a
following evidence commit whose SHA is returned in the terminal handoff.
