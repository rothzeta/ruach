# Consumer contract for PRB-7 ordering

## Shuffled set
- The shuffled input's order is **not contractual**. The contract fixes:
  - membership: every distinct input member appears in the result;
  - multiplicity: no member appears more than once;
  - nonmutation: the input array is not modified.
- An end-to-end assertion comparing the shuffled result to one exact list asserts more than the contract and is brittle under any legitimate implementation change.

## Seeded generator
- `seeded(count, seed)` has an **explicit reproducible** contract: the same seed must produce the same exact sequence. This test is not order-unspecified and must remain.

## Review
- A legitimate private implementation change with the correct public behavior must pass the membership/multiplicity/nonmutation checks and the seeded-order check.
- Keep any integration boundary test that protects cross-component behavior; speed or fewer lines alone does not justify losing coverage.
