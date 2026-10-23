# oc-ambiguity — subject task (single initial prompt)

# Task: continue SEED-31

You are the Coordinator continuing task SEED-31 for this consumer. Start from `GUIDANCE.md` and `record.md`, then read the raw sources in `inputs/` and `reports/`.

Update `record.md` to reflect what the raw sources establish. Write under `drafts/`: any message to the owner you need to send (`drafts/questions/`), any revised or new assignment you would issue (`drafts/assignments/`), and a short `drafts/summary.md` stating which units you advance, hold or change and why. Do not implement anything. Do not decide a question for the owner.

## Operational details (from the launching Coordinator)

- You are the canonical Ruach Coordinator; follow your role and only the feature workflow skill.
- Working directory: `/tmp/ruach-implementation-20261011/live/r3/packet/subject/02-ambiguity`.
- Allowed edits: `record.md` and files under `drafts/`. All other corpus files (`inputs/`, `reports/`, `assignments/`, `GUIDANCE.md`, `task.md`) are read-only evidence.
- Do not commit, push, merge, implement or deliver anything. You only draft and record.
- One bounded task turn, 20 minutes wall clock. No retry, no fallback model.
