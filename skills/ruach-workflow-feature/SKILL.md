---
name: ruach-workflow-feature
description: Coordinate a bounded feature through optional investigation and design, implementation, integration, verification, independent review, merging, and prompt Coordinator cleanup of task resources. Use as the generic feature workflow when no more specific workflow is assigned.
---

# Feature workflow

This is the generic feature workflow. Use a more specific workflow when one is assigned; keep this procedure sufficient for ordinary feature delivery.

Only the Coordinator loads and executes this workflow. Translate it into self-contained specialist assignments; workers receive their role, context and bounded instructions without workflow bodies. Require [ruach-handoff](../ruach-handoff/SKILL.md) for every worker result, including integration and merging. Specify the consumer's durable assignment/report locations, protected-document owners, commit requirements and evidence-retention rules. Workers keep disposable material outside the repository. Each responsible worker runs the handoff validator before returning; this is separate from technical verification and acceptance. Use the consumer's authorized launch and communication mechanisms; for Herdr see [ruach-herdr](../ruach-herdr/SKILL.md).

## 1. Understand

Establish:

- desired outcome;
- scope;
- relevant constraints;
- acceptance conditions;
- integration and destination branches or workspaces, delivery expectations, and any restrictions on committing or merging.

Resolve delivery details from the assignment, established project conventions, and session context. Ask for a missing destination or decision only when it prevents the next action.

Scout and Architect are optional. Assign investigation to a Scout when missing information prevents a bounded assignment. Assign design and planning artifacts to an Architect when architectural judgment is needed. Architect never performs implementation work.

Do not repeat existing specification or design work when it is already adequate.

## 2. Plan

Use existing plans and concise specialist handoffs to identify bounded implementation tasks, dependencies, and ownership. Assign required technical design or plan writing to an Architect.

Choose an Implementer to own integration and merging; the same worker may implement the feature. Specify the changes to combine, destination, and required checks.

Track task-created sessions and harness workspaces, and task-created or task-assigned temporary worktrees, including any temporary Coordinator or delivery checkout, and identify a retained checkout from which worktree removal can run. Note which pending step, if any, still needs each worker and worktree so they can be released as described in Clean up.

Run independent tasks concurrently when useful, with explicit file ownership and isolated workspaces or worktrees where needed to prevent conflicting edits.

## 3. Implement

Assign implementation tasks to Implementers.

Each worker must receive:

- task identifier and assigned role;
- assigned scope and file ownership;
- workspace or worktree, source branch, and expected revision handoff where applicable;
- relevant context;
- acceptance conditions;
- verification instructions and restrictions, including any exception to default test ownership;
- expected handoff and durable report path.

Record discoveries that affect other work. Release each worker once its durable handoff is committed and no further assignment will go to it.

## 4. Adapt

If implementation reveals that the current plan is wrong or incomplete:

- stop the affected work;
- assign required technical design or plan updates to an Architect and revise assignments from its concise handoff;
- propagate the discovery to affected workers.

Escalate changes to the requested product scope.

## 5. Integrate

After dependent workers report their assigned checks and changes ready, assign the integration Implementer to combine the specified changes in dependency order on the integration branch or workspace. When all work already shares one workspace, assign the worker to confirm the complete feature and identify its combined revision.

The worker resolves merge conflicts within the assigned scope, reports discoveries that affect behavior or design, and returns the source revisions, combined revision, conflict resolutions, and blockers. Route design changes through the adaptation step. Coordinator does not inspect diffs, resolve conflicts, or integrate changes itself.

## 6. Verify

Assign the project's relevant checks and acceptance verification on the combined feature to the integration Implementer or another verification worker. Collect the exact tested revision, commands, results, and acceptance evidence. Individual worker checks do not establish that the combined feature works. Coordinator does not run checks or validate artifacts itself.

A worker saying that the task is complete is not verification.

## 7. Review

After required checks on the combined revision succeed, assign an independent Reviewer to that revision. If the task explicitly excludes review, record that exception in the completion report.

1. Give the Reviewer the exact change and revision, acceptance conditions, verification instructions, and report path using the Coordinator's review-assignment guidance.
2. Collect the review summary, blocking and optional findings, verification results, and durable report reference. Missing findings do not establish that verification passed.
3. Return blocking findings to the responsible Implementer as bounded fixes. Require relevant verification results and the updated revision in the handoff. Route fixes through the integration and combined-verification steps before re-review.
4. Assign re-review of blocking fixes and materially changed behavior, contracts, or tests on the updated revision. Repeat while resolvable blocking findings remain; report a blocker when resolution needs a decision or exceeds the assignment.
5. Advance only when the Reviewer reports no outstanding blocking findings and the required checks have reported successful results for the reviewed revision. Optional improvements do not block completion unless required by the acceptance conditions. Then release the Reviewer and any worker or worktree that no pending step needs.

## 8. Merge

Once required verification and review are satisfied, assign the integration Implementer to merge the accepted combined revision into the agreed destination using project conventions and the assignment's permissions.

Have the worker confirm the destination has not advanced since the candidate was prepared. If it has advanced, or merging requires conflict resolution or other changes to the candidate, refresh integration and repeat relevant verification and review before delivery.

Require a merge handoff identifying the reviewed candidate, destination branch, final revision, and merge outcome. The worker confirms the delivered result contains the accepted changes and reports its relation to the verified candidate. Reuse verification evidence when the delivered content is unchanged; rerun relevant checks and re-review material changes. Coordinator does not perform the merge or validate its result. Remote push, publication, and deployment require an explicit assignment. After the merge handoff is committed, release the integration Implementer and every worktree that recording delivery does not need.

## 9. Record delivery

Preserve the delivery summary and required durable reports in commits reachable from retained branches before removing the worktrees that hold them. Record:

- implemented work;
- integration and merge outcome, destination, and final revision;
- verification actually performed and the tested revision;
- review findings and disposition;
- important discoveries or decisions;
- remaining issues;
- durable report and canonical artifact references.

After acceptance and delivery, the Coordinator updates the records assigned by consumer policy from worker handoffs, linking durable reports rather than duplicating them. It also records the sessions and harness workspaces, and worktrees it closed or removed, any retained resources with the reasons, and any cleanup blockers.

## 10. Clean up

The Coordinator performs cleanup itself, as soon as each resource's reuse ends, rather than deferring it to the end of the workflow. Decide reuse deliberately: keep a worker or worktree only while a concrete pending step, such as a review fix loop, integration, or merge, needs it. The natural release points are after each committed handoff, after review acceptance, and after merge.

- **Workers.** Once a worker's durable handoff is committed and no further assignment, such as a fix or re-review, will go to it, close its task session and remove the private temporary directory its launch result reported (`temporary_directory`), if non-null. A worker never closes its own session; the launching parent closes a temporary Coordinator's session after its final report.
- **Worktrees.** Once a task-owned temporary worktree's work is committed and reachable from a retained branch, and no further assignment will use it, close any session still using it and remove it with `herdr worktree remove --workspace <id>` when registered with Herdr (a linked launch) or `git worktree remove` otherwise, running from a retained checkout outside the path. Keep the branch.
- **Harness workspaces.** Close a task-created workspace or tab once it holds no more needed sessions.

Preserve the original caller session, the main checkout, the retained destination checkout, branches containing delivered changes or evidence, unrelated worktrees, and unrelated sessions. Preserve useful working evidence in durable reports first; disposable working files and installed dependencies may then be discarded. Respect consumer retention and disposition permissions; delivery and resource cleanup do not authorize removal of durable evidence. Do not discard uncommitted work or unpreserved evidence to satisfy cleanup. If removal is unsafe or fails, keep the resource and report a cleanup blocker.

No worker cleanup handoff is required. The Coordinator's delivery record lists what it closed and removed and any exceptions; report any resource released after that record is committed, such as the checkout holding it, in the completion response. The workflow completes once all task resources are released or reported as blockers; a successful merge alone does not complete the workflow.
