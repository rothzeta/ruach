# Consumer capability and disposition policy (probehub)

Applies to the PRB-7 candidate and its transport suite.

1. The transport suite needs one Unix socket under the assigned temp root and one localhost listener on an ephemeral port. The assignment names these.
2. If the run cannot create that socket or temp path at all, and no assertion has executed, the capability is denied: record **not verified: environment** with the exact command, exit, and the missing capability. Hold the check. Do not weaken the suite or fabricate a pass.
3. A permission-looking error that appears **after** assertions have executed, under normally supported permissions, is candidate behavior until the cause is established, not an environment gap.
4. A permission-looking error whose cause cannot be established from the captured evidence is **unclassified**. Do not resolve it by assumption, by deleting the check, or by a rerun the assignment does not permit.
5. At most one named escalation request may be made for a genuinely denied capability. It is a request to the owner, not a self-approval, and not a retry of the test.
