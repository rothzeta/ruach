---
name: ruach-debugging
description: Investigate a known or reported defect and, when assigned, correct its supported cause with regression and original-failure evidence. Not open-ended defect discovery.
---

# Debugging

Apply within the assigned role and scope. Scout investigates and reports; only an authorized Implementer changes source/tests. This technical skill does not coordinate workers, change routes, grant permissions or authorize delivery. An Architect is optional when a consequential design decision needs one, not a prerequisite for every red test.

## Establish the failure

Identify intended observable behavior and its authority: an owner decision, accepted requirement or public contract. Separate an expectation conflict or feature request from a defect. Request a missing owner decision through the Coordinator while continuing useful independent investigation.

Preserve the original command or input sequence, cwd, source revision and actual artifact/build, versions, configuration/state, permissions, expected versus actual result, exit/signal and full raw evidence. Reproduce on the assigned baseline with bounded diagnostics. Record unavailable reproduction honestly. A wrong build, denied socket or unknown environment failure retains that label; it is not automatically a product defect.

## Establish cause and correct

Use [investigation evidence](references/investigation.md) when choosing discriminating probes or weighing conflicting evidence. List plausible explanations supported by observations, then choose a small check that can refute the leading one. Explain the mechanism and supporting evidence before prescribing a correction. If cause remains unknown, report hypotheses and the next bounded check rather than a fabricated diagnosis.

Correct the narrow supported cause in assigned files, preserving neighboring public behavior. Report a concrete amendment if required files, behavior or authority fall outside scope. Do not redesign adjacent systems, weaken tests or change permissions to obtain green output.

## Verify and hand off

Use [ruach-testing](../ruach-testing/SKILL.md) for an independent contract oracle at a meaningful public boundary. Establish failure on the actual unfixed version and success on the candidate where feasible; retain valid neighboring controls. If red/green evidence cannot be obtained, state exactly why and provide the alternative evidence for independent review. A test that copies the implementation or only checks a mocked-away failure is inadequate.

Repeat the **original failing experience** on the corrected candidate with comparable input, build and environment, in addition to the regression and assigned affected checks. A green unit test does not replace that retest. Changed conditions require an explicit comparison gap.

Classify required checks using [verification dispositions](../ruach-testing/references/verification.md). Return the [canonical handoff](../ruach-handoff/SKILL.md): contract authority, reproduction, cause or uncertainty, scope, correction, regression/red-green evidence, original retest, exact existing candidate/tested revisions, commands/cwd/exits and gaps. Do not prefill independent review or delivery. Required independent review and separately authorized delivery remain distinct gates; a failed review returns a bounded correction and updated exact candidate. Follow the assignment's canonical correction-cycle budget, not a quota of diagnostic commands.
