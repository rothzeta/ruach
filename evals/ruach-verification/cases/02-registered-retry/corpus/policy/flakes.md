# Consumer registered-flake policy (probehub)

These entries are consumer-owned. A disposition may run only what an entry permits.

## FLAKE-001
- test: `tests/parse.test.ts` > "rejects a truncated record"
- symptom: `AssertionError: expected false to be true` at the truncated-record boundary
- conditions: pinned Bun 1.4.2, the worker sandbox, and the candidate revision unchanged since the failing run
- prior evidence: one occurrence on 2026-10-10 with the same stack and the same candidate
- owner: probehub tooling maintainer
- permitted disposition: **one** same-state retry only. If it fails again, or its symptom or environment differs, preserve both runs and return for diagnosis. A pass does not erase the first failure.

## FLAKE-002
- test: `tests/parse.test.ts` > "round-trips a full record"
- symptom: any failure
- conditions: none recorded
- owner: probehub tooling maintainer
- permitted disposition: **no rerun**. A failure is a defect until fixed; retrying is forbidden even if it would probably pass.

## General
- A code change creates a new candidate that needs its own verification; it is not a retry of an unchanged candidate.
- A run in the primary/main environment that recurs after a bounded disposition is a defect investigation, not a renewed exemption.
