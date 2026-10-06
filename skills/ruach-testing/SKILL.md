---
name: ruach-testing
description: Design, implement, and review contract-based behavior tests and regression coverage. Use when writing tests, reviewing assertions, or verifying a behavior change or bug fix.
---

# Ruach testing

Protect required behavior through observable boundaries. Apply this skill within the assigned role, scope, and permissions.

## Principles

- Every assertion must protect an identifiable contract invariant.
- Prefer public inputs, outputs, errors, and state transitions over private fields, helper calls, or internal call sequences.
- Choose the smallest public boundary that exposes the requirement; black-box testing does not require every test to be end-to-end.
- Valid implementation changes and permitted outcome variations should still pass; violations of the protected requirement should fail.
- Assert exact values, ordering, formatting, or snapshots only when the contract requires them for controlled inputs. Determinism alone does not make current output contractual.
- Test configurable behavior with explicit inputs; do not freeze provisional defaults or fixture coincidences.
- For nondeterministic behavior, test guaranteed properties. Require identical results only when reproducibility is contractual.
- Preserve useful regression coverage. Change obsolete or incidental assertions only when the assignment permits it, without weakening real invariants.

## Test design

1. Identify the declared requirement and distinguish it from assumptions or current implementation behavior.
2. Inspect relevant existing tests and select the smallest observable boundary that exposes the requirement.
3. Choose representative inputs, including relevant boundaries, invalid inputs, and failure cases.
4. Assert required properties and outcomes with enough precision to detect incorrect behavior.
5. Check that permitted variations remain valid and meaningful contract violations are detectable.

## Examples

| Declared contract | Assertion | Permitted variation |
| --- | --- | --- |
| Return each requested identifier exactly once, in any order | Compare membership and multiplicity; missing, duplicate, or extra identifiers fail | Reordering the same identifiers passes |
| Multiply an input by an explicitly configured factor | Supply input `4` and factor `3`; assert result `12` | Changing the default factor or internal implementation passes when the supplied factor is respected |

## Regression coverage

- For a reported failure, reproduce it before the fix when feasible; record whether reproduction was actually executed.
- Retain a focused reproducer when adding or changing tests is authorized. Existing coverage may already be sufficient.
- Verify the corrected behavior and affected existing behavior within the assigned scope. Select relevant regression checks based on the change's impact.
- When assigned only to make existing tests pass, preserve those tests and implement the declared behavior.
- Investigate unexpected failures. Neither a test nor the current implementation automatically defines the contract; report conflicts before making changes outside the assignment.

## Verification and handoff

- Run the assigned checks and record exact commands and results.
- Identify failures, limitations, and checks not run; never report unexecuted checks as passing.
- Include relevant evidence and test or artifact references in the required handoff.

Use the project's established test runner and conventions. Add framework-specific guidance only for concrete needs, keeping shared testing principles here.

## Before and after

**Fixed-seed snapshot to property assertions.** A shuffle helper is documented to return every input exactly once in an unspecified order. A test seeds the random generator and compares against a stored list. That freezes one implementation's output; any valid change fails it.

```ts
// Before: asserts a coincidence of seed and algorithm
expect(shuffle([1, 2, 3, 4], seed(7))).toEqual([3, 1, 4, 2]);

// After: asserts the contract
const input = [1, 2, 3, 4];
const out = shuffle(input);
expect([...out].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]); // same members, once each
expect(input).toEqual([1, 2, 3, 4]);           // input not mutated
```

Keep a fixed-seed exact-output test only if reproducibility from a seed is itself the contract.

**Private call to public outcome.** Before: `expect(cache.evict).toHaveBeenCalledWith('a')` after adding a third item to a two-item cache. After: add three items, then assert that the oldest key is absent and the two newest are present. The first fails on a correct refactor; the second fails only when eviction is wrong.

**Incidental to configured input.** Before: assert the default timeout is `30`. After: supply `timeout: 5` and assert the operation gives up after 5; the default can change.
