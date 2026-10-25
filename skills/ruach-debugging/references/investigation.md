# Evidence that changes a diagnosis

Use this reference when several causes fit, reproduction is inconsistent or the original experience cannot be repeated.

Start from the earliest supported public mismatch. Trace the actual input/state through relevant boundaries; record observations separately from explanations. Prefer a probe whose possible outcomes distinguish the plausible causes. For example, compare the serialized value before storage with the value after reload: a missing value before storage and a correct stored value with wrong display point to different boundaries. Merely collecting another large log may not distinguish them.

Keep a compact evidence chain: observation → plausible causes → discriminating input/check → actual result → supported mechanism or remaining uncertainty. Include contrary evidence. A source path suggests a possible failure but does not prove that the reported runtime took it. Successful reproduction establishes the mismatch, not necessarily its cause.

Preserve the original failure before changing state. Use assigned isolated copies for destructive or stateful probes. Check actual revision/build and relevant environment before interpreting differences; unsupported environments, missing tools, permission denials and product failures need different dispositions. Do not repair the environment outside authority, retry forbidden commands or relabel an unknown failure.

Choose a regression from the promised behavior rather than the selected patch. Include a neighboring valid case that a tempting broad fix would break. If feasible, run the same regression against baseline and candidate; otherwise retain the exact limitation. Keep original input/state and outputs so another worker can independently reproduce or challenge the result.

When evidence conflicts with the declared expectation, report the conflicting sources and the owner question. When no justified in-scope next step exists, preserve partial work and escalate through the assignment. Repeated investigation without discriminating progress is not permission for speculative edits.
