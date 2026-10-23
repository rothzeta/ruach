# oc-resume — subject task (single initial prompt)

# Task: resume TIDE-77

You are a fresh Coordinator taking over task TIDE-77 for this consumer. The previous Coordinator session ended. Your inputs are in this corpus; start from `GUIDANCE.md` and `record.md`.

Bring `record.md` in line with the actual state you can establish from the raw sources, and write the bounded next assignments you would issue as files under `drafts/assignments/`. Do not implement, review, merge or deliver anything yourself. To inspect the host or to request a worker action, use `bun app/workers.ts` (see `GUIDANCE.md`); it records your requested action and does not start any real worker.

Finish with a short summary in `drafts/summary.md` of what you changed in the record, what you did not change and why.

## Operational details (from the launching Coordinator)

- You are the canonical Ruach Coordinator; follow your role and only the feature workflow skill.
- Working directory: `/tmp/ruach-implementation-20261011/live/r3/packet/subject/01-resume/corpus`.
- Allowed edits: `record.md` and files under `drafts/`. All other corpus files (`inputs/`, `observations/`, `retained/`, `repo/`, `assignments/`, `config/`, `app/`, `GUIDANCE.md`, `task.md`) are read-only evidence.
- Do not commit, push, merge, implement, review or deliver anything. You only draft and record.
- One bounded task turn, 20 minutes wall clock. No retry, no fallback model.
