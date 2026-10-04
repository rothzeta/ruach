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
