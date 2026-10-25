# Measurements and design comparisons

Use when a task assigns a performance budget, realistic workload or design-to-build check.

Identify the contractual metric and budget source before measuring. Name hardware/platform, browser/runtime/build, viewport dimensions and device scale/zoom, dataset size/counts/provenance, configuration, exact interaction, metric/unit, instrument, repeats and observed range. Distinguish cold and warm state and preserve before/after conditions. Use actual declared workloads or a clearly labelled realistic synthetic equivalent; a tiny fixture is not real-size performance evidence.

Instrument the boundary the goal describes. A script/component timer measures that work; it does not measure browser layout, paint, frame pacing or end-to-end input response. An internal audio scheduler timestamp does not measure speaker latency. Name missing tools and leave the unsupported metric unverified. Do not turn one sample into a distribution or an incidental startup lead into a fixed requirement.

For design comparisons, cite owner-approved designs, recorded fields and existing palette/tokens. List missing/unrecorded fields instead of inventing data in a mockup. Desktop/phone viewport cases and budgets come from the assignment; there is no universal frame time, layout, palette or dataset size.

Report a budget miss with the workload, raw trace, repeats/range and next owner/action. Do not relax a threshold, replace a workload or weaken an assertion to pass. Record uncertainty and measurement overhead. Re-measure only affected metrics when build/state/instrument changes invalidate their evidence, or explicitly retain the gap.
