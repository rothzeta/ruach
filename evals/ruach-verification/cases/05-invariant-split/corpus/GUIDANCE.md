# Consumer guidance (probehub)

- The task record is `record.md`. `inputs/`, `observations/`, `policy/`, `logs/` and the history in `repo/` are read-only evidence.
- Allowed edits: `record.md` and files under `drafts/`. Do not edit the test or implementation.
- Split a test only where the contract is split: replace order-unspecified exact-list assertions with membership/multiplicity/nonmutation checks, and keep a separate exact-order test where order is contractual.
- Preserve useful integration-boundary coverage; do not remove assertions to satisfy a failure.
