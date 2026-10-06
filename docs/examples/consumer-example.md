# Worked consumer example: request to release or retention

A generic walk-through of one task in a consumer project. Names, paths and ticket IDs are illustrative. The consumer's own tracker, branch policy and routing decide the real values; Ruach supplies roles, workflows and the handoff format.

**Request.** Ticket `PROJ-142` in the consumer's tracker: "Export fails for names containing a comma." The owner asks for a fix with a regression test, independently reviewed, merged to `main` locally. Publishing is not requested.

## 1. Role and route

The owner starts a Coordinator (`claude --agent ruach:coordinator`, or a launch through [ruach-herdr](../../skills/ruach-herdr/SKILL.md)). The Coordinator reads the consumer's guidance for assignment and report locations, protected documents and retention, then chooses the smallest workflow that fits ([compact use](direct-compact-full.md)). Routing comes from the consumer's `.agents/routing.yaml`; the Coordinator never invents a fallback model.

## 2. Startup

For each worker the Coordinator resolves the route and starts it in a background worktree:

```sh
bun .agents/skills/ruach-herdr/scripts/worker.ts start \
  --name proj-142-impl --role implementer --cwd .
```

The result reports the workspace ID, worktree path, branch and base. If it reports `awaiting-input`, the owner answers the native dialog (see [first launch](../operations.md#first-launch-and-native-confirmations)); no second worker is started.

## 3. Assignment

The Coordinator writes a self-contained assignment in the worker's worktree (see the [assignment specimen](assignment-specimen.md)) and sends it separately after startup. The worker receives its role and the assignment, not the workflow.

## 4. Work and handoff

The Implementer adds a failing test, fixes the export, runs the assigned checks and writes a report starting with the structured block from [ruach-handoff](../../skills/ruach-handoff/SKILL.md). It runs the handoff validator and commits the report with the unchanged assignment. The Coordinator reads the concise fields first and does not treat completion as verification.

## 5. Review and acceptance

A Reviewer, in a separate worker, receives the exact revision, acceptance conditions and report path. It returns findings by severity. Blocking findings go back to the Implementer as a bounded fix; the Reviewer re-reviews the updated revision. Acceptance is the Coordinator's decision under the workflow, based on checks on the reviewed revision and no outstanding blocking findings.

## 6. Delivery

After the Reviewer reports no blocking findings on the combined revision and the checks pass on it, the Coordinator confirms that the owner authorized delivery to the named target. Here the request itself ("merged to `main` locally") is that authorization; silence would not be.

The Coordinator then assigns a separate delivery Implementer (there is no Merger role). The assignment names the target branch (`main`, local only) and the exact reviewed revision, and says to merge only if the destination has not moved since the candidate was prepared. If `main` moved, or the merge needs any change to the candidate, the worker stops and reports; integration is refreshed and the affected checks and review repeat. The worker returns a handoff with `delivered_revision`, the reviewed revision, the destination and the outcome. The Coordinator does not perform or validate the merge itself, comments the outcome and report links on `PROJ-142`, updates only the records the consumer assigns to it, and then cleans up as in the next section. Delivery stops at the local merge; push or publication would need its own authorization and assignment.

## 7. Release or retention

The Coordinator releases resources as soon as each is no longer needed: closes finished sessions and workspaces, and removes task worktrees whose commits are reachable from a retained branch. It keeps the branches and the durable reports under the consumer's retention policy. A checkout intentionally kept for a pending step, or an uncommitted diff the owner asked for, is a valid end state: record it with the reason. The Coordinator reports done only when every task resource is released or listed as a blocker.

For resuming a Coordinator that was interrupted in the middle of this flow, see the [task record example](task-record.md).
