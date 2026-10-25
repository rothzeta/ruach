---
name: ruach-runtime-testing
description: Exercise an identified runtime build, reproduce observations and measure declared workloads using actual browser, desktop or audio capabilities. Source checks alone do not establish runtime experience.
---

# Runtime testing

Use within the assigned role, goals, permissions and resources. Tester observes and reports; this skill grants no source edits, fixes, coordination or delivery authority. Use [ruach-testing](../ruach-testing/SKILL.md) for independent contract oracles and [verification dispositions](../ruach-testing/references/verification.md) for check outcomes.

## Identify the experience

Record full source revision and actual build/artifact identity: build command/version, output path or deployed asset identity/digest and relevant dependency/configuration versions. A source SHA alone cannot identify stale deployed assets. Record actual runtime environment and declared goals, with required versus optional experiences and their expected behavior/authority. Treat unclear product expectations as owner questions.

Before execution, use [capability and evidence guidance](references/capabilities.md). Confirm allocated isolated profiles, save copies, ports, databases and endpoints, initial state/digests, permitted actions and preservation/retention rules. Consumers allocate these resources; do not substitute default profiles, live saves, production data or foreign processes. Explicit disposable fixture state is the only permitted state-edit exception to the assigned role's boundaries. Resource release remains with its assigned owner; terminate only your own bounded probes when permitted.

## Exercise and reproduce

Run the assigned input sequence on the named build. Capture original failure state and raw evidence before changing conditions. For each observation record:

- stable ID, goal/invariant and authority, expected versus actual behavior;
- source/build, environment, tools/configuration, dataset size/digest and seed/save/profile state;
- viewport CSS width/height, device scale and zoom when relevant;
- exact input sequence/timing, capture time, logs/screenshots/video/audio paths and attempts/results;
- confidence, impact, observation class, alternative explanations and next bounded probe;
- actual coverage, capability gaps and unexamined goals.

Distinguish an observed mismatch from a supported cause, a source inference, a replay and a product preference. Seeds help reproduce conditions; incidental generated output, ordering or startup time is not a compatibility contract.

When retesting, identify the corrected build and repeat the original failure sequence/state under comparable conditions. Link before/after evidence and regression results supplied by Implementer; green regressions alone are not runtime retest. A changed environment or missing original state leaves a comparison gap.

## Measure and report

Use [measurement guidance](references/measurements.md) when budgets, real-size data or design-to-build comparisons apply. Report actual instruments, units, workloads and limits; invent no universal UI budget or palette.

Return the [canonical handoff](../ruach-handoff/SKILL.md) with exact source/build and evidence, exercised coverage, measurements, original-retest results, findings and holds. Missing required browser, desktop or listening experience remains held; static evidence cannot become fabricated acceptance. A findings-only assignment can end with a useful report and named gaps without certifying unperformed goals.
