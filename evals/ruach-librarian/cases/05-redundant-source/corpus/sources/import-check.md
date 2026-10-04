# CSV import check

Worker: impl-4. Date: 2026-09-12. Revision: slate-r5.

`slate import out.csv` on the file written by the [export run](export-run.md) loaded 120 orders, exit 0. A copy with the byte-order mark stripped (`tail -c +4 out.csv > plain.csv`) also loaded 120 orders.

`slate import fixtures/orders-semicolon.csv` exited 2: `expected ',' at line 1, column 9`. Semicolon-delimited files are not accepted; no issue was filed.
