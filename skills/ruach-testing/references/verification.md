# Verification dispositions

Conditional classification and log detail extending [the testing skill](../SKILL.md). Use one disposition per required check. Nothing here adds a status, a shared flake database, a retry tool, a quarantine mechanism or a framework default. Task status stays relative to the assignment: an unresolved choice is `needs-decision`, a required check that cannot proceed can make the assignment `blocked`, and `complete` never conceals a failed mandatory gate.

## Dispositions

| Disposition | Evidence required and permissible action | Acceptance consequence |
| --- | --- | --- |
| Passed | The actual full command finished successfully at an identified state and its required assertions ran. Shortened viewer output alone is insufficient. | Establishes only that command and scope; it is not acceptance. |
| Not verified: environment | Exact command, cwd and exit or signal; the missing capability and supported evidence (socket denial, unavailable tmp/disk/dependency/tool, for example). Distinguish a test process that never started from tests that ran and were blocked. A permission-looking error alone may be a product regression; uncertain cause stays unclassified. | Hold that required verification and preserve the tests. Use only assigned remediation or one permitted escalation request through the environment/capability policy, record the result, and do not loop or claim a pass. Unrelated authorized work can continue. |
| Registered flake | A consumer-owned entry with a stable ID, test/command, precise symptom, applicable environment/source conditions, supporting prior evidence, owner/authority and a bounded rerun/disposition. The actual failure must match those conditions. | Run only the permitted retry on the same candidate and environment; keep the original and retry evidence. A passing retry does not erase the first failure or prove root cause. Acceptance depends on the consumer's explicit disposition, not the worker's label. |
| Regression / defect | A public invariant violated in supported conditions, a new mismatch not covered by a record, or a repeated primary-environment failure that needs investigation. | Preserve the failing evidence; reproduce when feasible and assign a bounded defect correction. Do not disable coverage, relax a timeout or assertion, or relabel it flaky to get green. An initially unknown cause need not be declared a proven regression. |
| Unclassified / incomplete / not run | A truncated or lost status, a timeout without discriminating evidence, a mismatched record, a missing candidate identity or no executed check. | State the gap and the next bounded investigation. Required gates stay unsatisfied; never guess a cause or status from a green viewer or an older report. |

## Consumer-owned flake entries

Flake entries live in the consumer's established guidance or record under its document owner. This skill gives the fields below and a labelled synthetic example, not a Ruach-global register. A sample policy may allow one rerun for a specific evidenced symptom and environment; that is an example, not a universal quota. A forbidden retry is forbidden even if it would probably pass. If the retry fails, differs in symptom, or exceeds the entry's limits, preserve it and return for diagnosis. Recurrence in the main or primary supported environment becomes a defect investigation rather than a renewed exemption; record the actual recurrence and conditions, not an invented history.

Fields: stable ID; test/command; precise symptom; applicable environment and source conditions; supporting prior evidence; owner and authority; bounded rerun/disposition.

Synthetic example (illustrative, not a real entry):

- ID: `FLAKE-Example`
- Command: `bun test tests/fixture.test.ts`
- Symptom: `EADDRINUSE` before any assertion
- Conditions: constrained worker sandbox without a loopback bind; the main environment has one
- Authority: consumer policy permits one rerun for this symptom in this environment
- Disposition: on an identical second failure, stop and report; do not raise limits or widen the entry

The Coordinator's existing default of two failed quality cycles, or the consumer's override, governs escalation separately from a per-command flake retry allowance. Do not create or edit a foreign flake record to make a run green.

## Complete verification before shortening its display

Prefer redirecting full output to a fresh retained evidence file, wait for the verifier to finish within the assignment's bound, capture its exit immediately, then display a subset. Record the log path, full-log digest, command, cwd, start/end, exit/signal/timeout and candidate/state. A viewer's exit is separate from the verifier's exit. Do not put `head` upstream of completion: an early closed pipe can change the verifier result through SIGPIPE. Missing status or a timeout stays incomplete even when a displayed summary looks green.

This illustrative Bash subshell preserves the verifier's result without assuming the caller's `errexit` setting; an actual packet resolves the log path and command:

```bash
(
  set +e
  bun run test >"$task_verification_log" 2>&1
  task_verification_exit=$?
  sed -n '1,120p' "$task_verification_log"
  task_view_exit=$?
  printf 'verifier_exit=%s viewer_exit=%s full_log=%s\n' \
    "$task_verification_exit" "$task_view_exit" "$task_verification_log"
  exit "$task_verification_exit"
)
```

If a full-consuming `tee` pipeline is used, copy Bash's entire `PIPESTATUS` array immediately after it, before any other command; report both the verifier's and the log-writer's statuses and return the verifier's failure. `pipefail` helps but does not by itself attribute exits or repair early truncation. A log-writer failure leaves the evidence incomplete even when the verifier passed. TypeScript/Bun packet code captures subprocess exit, signal and timeout directly and displays logs afterward; that is local test support, not a reusable runtime. Assigned bounds and owned process-group cleanup still apply. Never retry a long-running verifier in parallel because a short display returned early.

## Invariant-preserving public-contract splits

A test may be split when the split keeps every invariant it protected and names the observable boundary and permitted variations for each part. Replacing one end-to-end assertion of a shuffled exact list is valid only when order is unspecified: assert membership and multiplicity, assert the input is not mutated, and keep a separate exact seeded-order test when reproducibility is actually contractual.

```ts
// Before: one test freezes order and membership together.
expect(shuffle([1, 2, 3, 4], seed(7))).toEqual([3, 1, 4, 2]);

// After: membership/multiplicity plus nonmutation protect the contract;
// a seeded-order test remains only if reproducibility from a seed is required.
const input = [1, 2, 3, 4];
const out = shuffle(input);
expect([...out].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
expect(input).toEqual([1, 2, 3, 4]);
```

A useful integration boundary test stays when it protects cross-component behavior. Speed or fewer lines alone does not justify losing coverage. Report an actual contract conflict before edits outside the assignment, and never remove assertions merely to satisfy a failing main-environment run.
