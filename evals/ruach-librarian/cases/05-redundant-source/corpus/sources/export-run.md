# CSV export run

Worker: impl-2. Date: 2026-09-10. Revision: slate-r5.

Command: `python3 -m pytest tests/export -q`. Result: exit 0, 48 passed in 3.1s.

Manual run: `slate export --format csv --out out.csv` on `fixtures/orders-small.json` (120 orders) wrote a header row and 120 data rows, UTF-8 with a byte-order mark.

Open: orders with `created_at` before 1970-01-01 export an empty `created_at` cell. Reproduced with `fixtures/orders-legacy.json` (3 of 40 rows empty). Cause not investigated.
