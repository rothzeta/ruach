# Export digest

Coordinator digest of the [export run](export-run.md), 2026-09-11.

- slate-r5: export tests passed (`python3 -m pytest tests/export -q`, 48 passed).
- CSV output is UTF-8 with a byte-order mark and a header row.
- Orders with `created_at` before 1970 export an empty cell; still open.
