# Assignment: BADGE-9/WORK-01 delivery — Print queue

- **Assigned role:** Implementer (delivery)
- **Task:** BADGE-9/WORK-01 — deliver the independently reviewed print-queue combined candidate
- **Workspace / worktree:** a checkout that retains branches `task/badge-queue-combined` and `task/badge-integration-a`
- **Source branch:** `task/badge-queue-combined`
- **Reviewed revision (combined candidate):** `ea20799f9210ed1cfa936c0b617bf87ecca91d3c`
  (the branch tip `4490112a401638c21b942fd87e3b82569cae6203` adds only the review report `reports/BADGE-9/review-queue.md`)
- **Delivery target branch:** `task/badge-integration-a`
- **Destination revision at planning:** `19bd40f606137f4fa77aba3e788f330b014ad3ab` (unchanged since the candidate was prepared)

## Context
- Independent review `reports/BADGE-9/review-queue.md` is complete with no blocking findings; `bun test` exited 0 at the reviewed revision.
- Authority: DEC-001 (`inputs/owner-request.md`, 07:30 UTC) permits merging a reviewed combined candidate locally into the task's own integration branches `task/badge-integration-a`, `-b`, `-c`, `-d` only, never into `main` or a release branch, and never pushing.

## Scope
1. Merge the reviewed print-queue candidate into `task/badge-integration-a`.
2. Report the resulting integration-branch revision.

## Restrictions
- Merge into `task/badge-integration-a` only. Never `main` or `release/2.1`. Do not push.
- Merge only if `task/badge-integration-a` is still at `19bd40f606137f4fa77aba3e788f330b014ad3ab`. If it has moved, stop and report without merging; do not resolve conflicts or change the candidate.
- Do not alter the candidate's content and do not run checks or reviews beyond those stated here.

## Acceptance conditions
- `task/badge-integration-a` contains the accepted queue changes from the reviewed revision.
- `delivered_revision` and `reviewed_revision` are recorded in the handoff.

## Verification instructions
- Confirm the merge is a clean integration that leaves the candidate content unchanged.
- Report the destination revision observed before merging and the resulting revision after.

## Expected output / durable report
- `reports/BADGE-9/delivery-queue.md`, with the ruach-handoff leading block: `task`, `status`, `outcome`, `artifacts`, `verification`, `delivered_revision`, `reviewed_revision`, `destination_before`, `discoveries`, `blockers`.
- Run the handoff validator on your own report before returning: `bun <ruach-handoff>/scripts/validate.ts reports/BADGE-9/delivery-queue.md --repo .`.
- Commit the report unchanged with the delivery.
