---
name: ruach-workflow-qa
description: Coordinate identified-build runtime exercise or original-failure retesting, with findings-only or explicitly authorized correction and delivery. Coordinator only.
---

# Runtime QA

Only the Coordinator uses this workflow. Source-only checks remain ordinary testing/review. Workers receive self-contained assignments, never workflow bodies.

## Scope and readiness

Record goals and their authority, required/optional experiences, exact source revision and actual artifact/build, configuration, allowed actions, tools/capabilities, time/action budget and outcome: findings-only or authorized correction/retest. Use [ruach-runtime-testing](../ruach-runtime-testing/SKILL.md) as the technical authority in Tester assignments.

Have the consumer allocate isolated profiles, save copies, ports, databases and endpoints with owner, original state, allowed writes, retention and release rules. Do not infer browser, desktop, capture or listening capability from role discovery. Collect Tester's observed capability/build gaps; a required unavailable experience stays held. Delegate build preparation to Implementer if needed; Tester does not edit source/tests/config.

## Exercise and disposition

Assign Tester the actual build, independent expected behavior, raw evidence locations, workloads/viewports/budget sources and bounded actions. Collect reproducible observations and exact coverage, separating runtime results, source inference, playback/capture/listening, suspected cause and product questions. Assign a domain expert only when the task needs attributed product judgment; do not invent it.

Record disposition and handled report identity before dependent actions. A findings-only task can finish with findings, honest coverage and unresolved goals; it does not claim required experiences passed. Clarify expectation conflicts with the owner. Independently confirm consequential findings before acceptance or correction, using Reviewer and separately authorized reproduction when needed.

## Authorized correction and retest

If correction is authorized, select [bugfix](../ruach-workflow-bugfix/SKILL.md) in your own Coordinator context and issue bounded worker assignments with the accepted defect contract, original input/state/build/evidence and scope. Discovery grants no extra correction or delivery authority.

After Implementer returns correction/regression and exact candidate/build evidence, assign Tester the original failing sequence on the corrected build under comparable conditions. Preserve original raw state and before/after evidence. A stale build, changed workload, missing capability or failing original retest holds the affected goal even when a unit regression is green.

Require applicable combined checks and independent exact-candidate review; [verification dispositions](../ruach-testing/references/verification.md), [canonical correction escalation](../ruach-workflow-feature/SKILL.md#escalation) and [delivery gate](../ruach-handoff/references/delivery.md#delivery-gate) remain authoritative. Delivery is a separate authorized Implementer assignment, not a Tester action or implicit consequence of QA.

## Close

Collect validated [handoffs](../ruach-handoff/SKILL.md) with source and actual build, evidence, coverage, required-experience dispositions, measurements, retest, review/delivery revisions or named gaps. Retain owner decisions and observed/handled report identities in the existing task record for resumption. One Coordinator owns dispatch, waiting, advancement and [cleanup](../../agents/coordinator.md#completion). Release resources when reuse ends, preserving originals, evidence and requested retained outcomes. QA reports do not establish unperformed acceptance or real-product demonstrations from synthetic fixtures.
