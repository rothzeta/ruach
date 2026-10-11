# Consumer guidance (probehub)

- The task record is `record.md`. `inputs/`, `observations/`, `policy/`, `logs/` and the history in `repo/` are read-only evidence.
- Allowed edits: `record.md` and files under `drafts/`.
- A retry is permitted only when `policy/flakes.md` says so for the exact test, symptom, environment and candidate revision. A forbidden retry is forbidden even if it would probably pass.
- Preserve the original failure and any permitted retry together; do not erase the first failure with a later pass.
