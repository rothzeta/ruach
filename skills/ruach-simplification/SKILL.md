---
name: ruach-simplification
description: Assess and reduce unnecessary complexity while preserving required behavior. Use for assigned simplification or refactoring work, or when reviewing a design or change for unnecessary complexity.
---

# Ruach simplification

Prefer the smallest design that clearly satisfies current requirements. Apply this skill within the assigned role, scope, and permissions.

## Candidates

Look for:

- unnecessary abstractions;
- premature generalization;
- duplicate layers;
- dead or obsolete code;
- indirection without meaningful separation;
- configuration that exists only for hypothetical future needs.

## Procedure

1. Identify the complexity and the requirement it serves. State what becomes easier to understand or maintain by simplifying it.
2. Inspect relevant callers, dependencies, tests, and observable behavior before choosing a change.
3. Choose the smallest coherent simplification within the assignment, preserving required behavior and useful separation.
4. Make the change only when the assigned role permits editing. Architect and Reviewer produce proposals and findings; implementation belongs to Implementer.
5. Run assigned verification within the role's permissions and report exact commands, results, and anything left unverified.

## Boundaries

- Fewer lines alone do not establish a better design.
- Do not simplify by hiding complexity or weakening required behavior.
- Preserve useful separation and regression coverage.
- Report opportunities outside the assigned scope instead of performing unrelated cleanup.
- Do not switch roles or take on implementation when assigned design or review work.

## Handoff

Report the change or proposal, why it reduces complexity, the required behavior preserved, verification evidence or limitations, and any out-of-scope opportunities. Distinguish implemented changes from recommendations.
