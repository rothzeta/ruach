---
name: ruach-workflow-knowledge
description: Coordinate assigned knowledge upkeep with a Librarian, bounded source batches, proportionate verification and review, evidence preservation, delivery and resource cleanup. Coordinator-only; use for knowledge maintenance rather than feature implementation.
---

# Knowledge workflow

Only the Coordinator loads and executes this workflow. Workers receive self-contained assignments, never this workflow. The Librarian uses [ruach-librarian](../ruach-librarian/SKILL.md) for maintenance technique; use [ruach-handoff](../ruach-handoff/SKILL.md) for results.

1. Establish the requested outcome and a bounded source batch. Name the maintained pages/indexes, document owners, protected documents, source revisions, retention rules and permitted source dispositions. Read existing concise handoffs before expanding the batch; split work where ownership or source volume demands it.
2. Assign a Librarian the exact scope, source packet, editable paths, verification, report location and delivery expectations. State whether sources may be moved, consolidated, archived or deleted, and what evidence must stay accessible. Default to retaining raw evidence. Existing authorization covers reversible edits within scope; do not add a confirmation gate for routine maintenance.
3. Collect source dispositions, canonical destinations, changed navigation, unresolved contradictions, revision-specific checks and proposed owner updates. Structural checks do not establish factual correctness. Assign fresh technical checks to a qualified worker when current behavior cannot be established from the sources; do not promote synthesis into verification.
4. Use proportionate review. For a simple index correction, link checks and a focused diff/ownership check may suffice. Assign an independent Reviewer for substantive consolidation, evidence disposition or changes to authority. Supply the exact candidate and raw sources; ask for unsupported claims, lost evidence, changed decision status and reference integrity. Return blocking findings for bounded fixes and relevant re-verification/re-review.
5. Deliver accepted edits through the authorized commit/integration mechanism. Route corrections to protected records to their owner with proposed text and supporting sources. Record what was accepted and what remains unresolved; do not accept architecture proposals through documentation upkeep.
6. Preserve source evidence, assignments and handoffs according to consumer policy. Release task sessions, private launch material and temporary worktrees once no pending step needs them and durable work is reachable. Preserve caller sessions, retained checkouts and unrelated resources; report unsafe cleanup as a blocker.

The Coordinator collects checks and review evidence; workers perform technical verification and delivery. A small maintenance batch does not require Scout/Architect phases, feature machinery or a new knowledge schema.
