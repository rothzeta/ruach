---
name: ruach-workflow-bug-hunt
description: Coordinate bounded defect discovery in a named area and build, ending in findings or explicitly authorized bugfix and runtime retest. Coordinator only.
---

# Bounded bug hunt

Only the Coordinator uses this workflow. A known defect belongs to bugfix; identified-build runtime exercise belongs to QA. Workers receive self-contained assignments rather than workflow bodies. No new Hunt role or continuous scanner is needed.

## Bound the search

Record named area, risk hypothesis, source revision and actual build, intended contracts, exclusions, time/action budget, allowed source/runtime probes, resources and report locations. State **findings-only** or **authorized find-and-fix**, including limits. Do not silently broaden a subsystem hunt into the whole product. Destructive, security or load probes need specific isolated-target authority.

Assign Scout source investigation and Tester actual runtime exercise using [runtime-testing](../ruach-runtime-testing/SKILL.md). Missing runtime capability limits claims; it does not turn source reasoning into reproduction. Consumer allocation and preservation rules apply to profiles, save copies, ports and databases.

## Collect and confirm

Require stable finding IDs with contract/authority, exact source/build/state and input sequence, evidence/attempts, expected versus actual result, confidence, impact, alternative explanations and next bounded probe. Keep separate labels:

| Class | Supported claim |
| --- | --- |
| Source-supported | Concrete possible path/invariant at the named source revision, with unexecuted behavior explicit |
| Reproduced | Actually observed mismatch on the identified build/state with reproducible steps and raw evidence; cause may remain unknown |
| Suspected | Plausible risk lacking discriminating evidence, with alternatives and proposed check |
| Product observation | Attributed usability/preference or requirement question, without an established defect contract |

Record actual examined paths/goals/data/capabilities, probe results, budget spent and unexamined risks. **No confirmed defects** is valid with honest coverage/uncertainty. Preserve minority findings and conflicting causal explanations rather than voting them away.

Assign independent Reviewer confirmation of consequential findings before acceptance or correction: contract authority, evidence, severity, alternatives and reproduction when separately permitted. A source-only review cannot certify runtime reproduction. Keep unsupported confirmation pending with its named gap.

## Findings or correction

Findings-only ends at the report, coverage and open-item disposition. Finding a defect grants no source edits, release or delivery authority.

For authorized find-and-fix, hand accepted findings to [bugfix](../ruach-workflow-bugfix/SKILL.md) in the Coordinator context, issuing bounded Implementer assignments. Use optional investigation/design only when warranted. Preserve original failure evidence, require meaningful regression and original-failure repetition, then Tester retest on the corrected exact build. Scout and Tester do not switch roles to fix in place. Require applicable checks, independent exact-candidate review and separate authorized delivery under the [canonical gate](../ruach-handoff/references/delivery.md#delivery-gate). Apply the [canonical correction-cycle contract](../ruach-workflow-feature/SKILL.md#escalation) without resetting failed outcomes.

## Close and retain

Require validated [handoffs](../ruach-handoff/SKILL.md), record observed and handled report identities/dispositions and preserve exact evidence and uncertainty for resumption. Report findings-only success separately from uncompleted correction/retest/review/delivery. A synthetic fixture proves mechanics only; it cannot stand for a real music-software or playable-prototype demonstration.

One Coordinator owns dispatch, waiting, decisions and [resource release](../../agents/coordinator.md#completion). Preserve raw evidence, original saves and requested diffs; release sessions and allocated resources when concrete reuse ends. Close only with supported findings, actual coverage and named holds, never a fabricated defect or acceptance claim.
