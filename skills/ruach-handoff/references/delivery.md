# Delivery, revisions and receipts

This reference extends [the handoff protocol](../SKILL.md) with worked detail for revision scope, decisions and delivery receipts. The [schema](../handoff.schema.json), validator and CLI are unchanged; nothing here adds a status, a required field or an automatic approval. A receipt is a manual checklist, not schema keys.

## Revision and evidence roles

Name only revisions that already exist. Keep these roles distinct in the leading block and in prose:

| Evidence role | Meaning and accompanying evidence |
| --- | --- |
| Source baseline / destination before | The resolved starting source and the named target at candidate preparation, with exact repository/ref and observation time. Refresh the destination immediately before integration or delivery. |
| Candidate | The exact combined content proposed for acceptance, distinct from each individually accepted unit; record the units and any bounded integration changes. |
| Tested | The commit whose identified checks actually ran, with command, cwd, exit/result, tool/environment, full evidence and scope. A working-tree check instead names the baseline, the retained diff/manifest digest and the observed state; it does not invent a committed candidate. |
| Reviewed | The exact combined revision and report scope independently reviewed, the findings/disposition and the unverified portions. Individual-unit review is not combined review. |
| Evidence-only successor | A later existing commit containing assigned reports, logs or docs only. Record the predecessor, changed paths and the scope comparison. It does not inherit an executed check or change the historical tested revision. |
| Delivered | The actual named-target result after the authorized action, with the exact reviewed input, destination-before/after and Git outcome. A report-only successor need not equal it. Omit the field when delivery did not happen. |

For a technical candidate `T` checked and reviewed at `T` with a later report successor `E`, keep `tested_revision` and `reviewed_revision` at `T` and return the creating `E` separately in the terminal handoff; never predict `E` or cite it inside its own report. If the owner wants `E` delivered, independent review must explicitly cover `E` and its report-only delta before delivery names `E`; tests may stay attributed to `T` with their declared scope and explicit unrun checks on `E`. Any change to executable code, fixtures or behavior-relevant instructions is a new candidate requiring affected verification and independent review: "docs only" is not blanket behavioral equivalence.

## Worked decision options

An unresolved choice is `needs-decision`; options are metadata and prose, not new statuses and not implied permission. This example is structurally valid without fake revisions:

```yaml
task: delivery-target-choice
status: needs-decision
outcome: "Local preparation complete; requested new destination lacks authority."
artifacts: [reports/delivery-target-choice.md]
verification: not-run
discoveries: []
blockers:
  - "Existing authorization names task/export-fix; no source authorizes main."
decision:
  question: "Which destination should the next bounded assignment name?"
  options:
    - "Use the still-authorized task/export-fix target after its checks/review gates."
    - "Authorize main explicitly; refresh integration and review against that target."
  independent_work: "Retain prepared evidence and continue separately authorized units."
```

State the source, options, consequence and independent work for an unresolved choice; an option is never silently adopted. Never re-request still-valid scoped authority merely because a session resumed. A destination that moved is an integration, check and review hold, not revocation of the owner's existing delivery request; a genuinely new target or action needs its applicable decision.

## Receipt content

A delivery receipt is a small manual checklist, not required schema keys. It includes:

- exact task, work, assignment and authorization IDs and their source;
- destination repository and ref, and the limits of the authorization (local merge, push, tag and publication separately);
- baseline, candidate, tested, reviewed and delivered references, or explicit gaps;
- commands, exits and evidence, with anything not run stated as not run;
- blocking and nonblocking open items;
- target-before and target-after;
- remote observations (see below);
- tag/push action and actual results;
- retained branches, diffs and reports;
- worker-owned subprocess or scratch residue;
- links to Coordinator-owned retained or released task-resource records.

The delivery worker reports observations and handoff readiness. It never claims Coordinator cleanup it did not observe; the Coordinator alone updates or releases its task resources from actual evidence.

## Local and remote state

Distinguish three remote states:

- **Observed live ref** — only with assigned read-network permission: `git ls-remote --refs <remote> refs/heads/<branch>`; record the time and result, or that access was unavailable. Redact credential-bearing URLs.
- **Cached ref** — `git --no-replace-objects for-each-ref --format='%(objectname)' refs/remotes/<remote>/<branch>`; this reads local cache and is not a live network read.
- **Not queried** — state it plainly.

Local-only delivery records push, tag and publication as not performed and leaves remote state unknown or cached without implying synchronization. No automatic fetch, push or tag follows a local merge. A future external-delivery assignment must name its authority, remote/ref, observed expected destination, permitted operation and failure handling; a partial local success followed by remote failure is partial, not rollback or retry authority.

## Delivery gate

Serialized multi-unit delivery uses existing assignments, not a scheduler or lock service:

1. The Coordinator records the ordered unit IDs, reasons, accepted inputs, the current destination and one active target-mutating integration/delivery assignment. Workers do not coordinate a queue among themselves, and branch deletion is not a predecessor gate.
2. An assigned integration Implementer observes the current target immediately before preparation, compares it with its recorded base, preserves owned and foreign partials, and combines only accepted units in declared files on a fresh branch. A changed base needs a versioned amendment or refreshed integration, affected checks and independent combined review.
3. After acceptance and applicable authorization, a separate delivery Implementer receives the exact combined reviewed revision and the target/ref prepared as the destination. It resolves both, observes the actual target immediately before mutation, verifies the assigned checkout belongs to the named repository and target branch with HEAD matching that destination, and verifies the required review/check evidence and the bounded allowed dirty-path policy. If the destination differs, the checkout identity is wrong, or content changes are needed, stop without modifying the target and report current state; do not improvise a merge/rebase or transfer old acceptance.
4. Prefer a prepared descendant candidate and `git merge --ff-only <reviewed>` in the explicitly assigned target checkout, then verify ancestry and that the resulting target equals the reviewed revision. There is no conflict resolution during delivery; if fast-forward is impossible, return to integration to prepare and review the actual combined result, not an unreviewed merge commit. Preserve unrelated permitted diffs; if Git or affected paths make mutation unsafe, stop and report rather than clean them.
5. Record the exact action and exit, the target-after and any residue even on failure; avoid assuming failure means no mutation. The Coordinator consumes the receipt and assigns the next unit against the actual new target with refreshed review gates.

An observation followed by a Git mutation is not an atomic transaction across unrelated writers or remotes. If concurrent target mutation cannot be excluded, hold delivery and require a consumer-supported guarded operation rather than claim this manual gate guarantees race safety. Never use branch deletion, force push, a blanket clean tree or worker native-resource release as a queue shortcut.

## Working-tree, diff and retention outcomes

A requested uncommitted diff can be a valid outcome. Record the baseline, the actual diff or artifact location and digest, check state, protected paths and the retention reason; never commit the diff or invent a candidate for it. A Reviewer may inspect that exact artifact under an artifact-review assignment; later application or integration creates a new candidate with its own checks and review before delivery.

An intentionally retained checkout is likewise successful when it is authorized, identified and assigned a reuse or retention reason. Dirty or untracked foreign paths are not a universal failure and are never swept into a commit or deleted to satisfy a generic clean-tree rule.

## Worked delivery receipt

Synthetic fixture: create these refs in an isolated repository before relying on them. A real report uses resolved full object IDs and never copies fixture names. The candidate, tested and reviewed roles are the same commit here because the target changed only by fast-forward; the report successor is a separate evidence-only commit.

```yaml
task: fixture-delivery
status: complete
outcome: "The reviewed combined revision fast-forwarded the local target; delivery was local only."
artifacts: [reports/fixture-delivery.md]
verification:
  - "git merge --ff-only fixture/reviewed: exit 0"
  - "git rev-parse fixture/target^{commit}: matches fixture/reviewed"
source_baseline: fixture/before
candidate_revision: fixture/reviewed
tested_revision: fixture/reviewed
reviewed_revision: fixture/reviewed
delivered_revision: fixture/target
destination_before: fixture/before
discoveries: []
blockers:
  - "Push, tag and publication: not requested and not performed; remote state not queried."
```

The receipt for this action states the local merge and its exit, the reviewed input and the delivered target, that push/tag/publication were not requested or performed, that remote state was not queried, and any retained branches, diff or scratch residue. It links rather than copies the Coordinator's task-resource record.

A later commit that adds only this report is an evidence-only successor: it records the receipt without changing the tested or delivered revisions.

```yaml
task: fixture-delivery
status: complete
outcome: "Committed the delivery receipt; implementation and checks unchanged."
artifacts: [reports/fixture-delivery.md]
verification: not-run
tested_revision: fixture/reviewed
reviewed_revision: fixture/reviewed
evidence_revision: fixture/report
discoveries: []
blockers: []
```
