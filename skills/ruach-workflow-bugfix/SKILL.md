---
name: ruach-workflow-bugfix
description: Coordinate correction of a known or reported defect through reproduction, scoped correction, verification, independent review and authorized delivery. Coordinator only.
---

# Known-defect correction

Only the Coordinator uses this workflow. Give workers self-contained role assignments and the relevant technical skill; do not send workflow bodies. For open-ended discovery use bug-hunt; for runtime exercise use QA.

## Intake and proportionate assignments

Record the defect report/provenance, intended behavior and authority, baseline source and actual build, original failing experience/evidence, scope and protected paths, allowed probes/resources, required checks, report locations and requested outcome. Resolve expectation conflicts with the responsible owner. Keep environment, unknown-cause and product failures distinct.

For a small defect with clear authority and reproduction, assign Implementer directly, followed by independent Reviewer. Use Scout when cause needs investigation, optional Architect when evidence exposes a consequential design/interface decision, and Tester when actual runtime experience requires it. Do not require a council or Architect for every red test.

## Reproduce, diagnose, correct

Translate the phases of [ruach-debugging](../ruach-debugging/SKILL.md) into bounded assignments: intended contract and original reproduction; discriminating causal evidence; narrow authorized correction; independent regression oracle; repeat original failure. Keep that skill as the technical authority instead of copying its procedure. Assign investigation separately only when useful; one Implementer can perform the complete bounded technical task.

Require concrete scope amendments before unowned edits. Record late owner changes with their exact source, affected assignments and whether work continues or pauses; preserve unaffected authority and previous evidence. Track original report IDs and each candidate rather than treating native resume as acceptance.

## Verify, review and deliver

Collect actual existing candidate/tested revisions, commands/cwd/exits, regression evidence and the original failing-experience retest. Apply [verification dispositions](../ruach-testing/references/verification.md); a green regression with a failing or missing original retest does not close the defect. Assign integration and combined verification if several changes need a union. Runtime retest uses Tester on the corrected identified build when required.

Assign independent Reviewer to the exact combined candidate and evidence after required checks pass. Route blocking findings to the responsible Implementer with a bounded correction, affected checks and updated exact-candidate review. Use the canonical [correction-cycle definition and escalation contract](../ruach-workflow-feature/SKILL.md#escalation), preserving its count across renamed assignments and correction regressions; do not create a diagnostic-command quota.

Apply the existing [delivery gate and revision contract](../ruach-handoff/references/delivery.md#delivery-gate). Delivery is a separate Implementer assignment only with valid authority for the named target and independently reviewed exact revision. A moved target or material candidate change returns to integration/checks/review. A retained branch or requested diff is a valid scoped outcome. Push/publication needs its own authority.

## Record and close

Require validated [handoffs](../ruach-handoff/SKILL.md). Keep source, candidate, tested, reviewed and delivered revisions separate; do not infer later results from a report-only commit. Record observed and handled report identities and dispositions before dependent actions, including reports present before resumption. Retain original evidence, causal uncertainty, owner decisions and open items in the existing task record.

The Coordinator owns dispatch, waiting, decisions and [resource cleanup](../../agents/coordinator.md#completion); it does not perform technical verification, review or merge. Release sessions when reuse ends and preserve requested diffs and retained artifacts. Close only the authorized outcome, naming unresolved checks, original-retest gaps, review or delivery holds.
