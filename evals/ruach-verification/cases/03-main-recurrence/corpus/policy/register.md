# Consumer register extract (probehub)

## FLAKE-004
- test: `tests/cache.test.ts` > "deduplicates concurrent lookups"
- symptom: `AssertionError: expected 1 call to fan-out, received 2`
- conditions: **worker sandbox only** (no outbound network, constrained scheduler). Not the primary supported environment.
- prior evidence: one worker-only occurrence on 2026-10-12
- owner: probehub tooling maintainer
- permitted disposition: one same-state retry **inside the worker sandbox only**. It does not extend to the primary environment.

## Recurrence rule
- A failure that recurs in the primary supported environment is a defect investigation, not a renewed flake exemption. Record the actual recurrence and its conditions.
- Do not increase a default timeout or suppress a test to make a recurring failure pass.
