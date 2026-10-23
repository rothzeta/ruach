# Assignment: BADGE-9/WORK-04 delivery — Preview

- **Assigned role:** Implementer (delivery)
- **Task:** BADGE-9/WORK-04 — deliver the independently reviewed preview combined candidate
- **Workspace / worktree:** a checkout that retains branches `task/badge-preview-combined` and `task/badge-integration-d`
- **Source branch:** `task/badge-preview-combined`
- **Reviewed revision (combined candidate):** `0380235669ca5531558b7f60aa9a64ed238f6a9b`
  (the branch tip `c2172d81f9226c136f877afa41e70228678f6034` adds only the review report `reports/BADGE-9/review-preview.md`)
- **Delivery target branch:** `task/badge-integration-d`
- **Destination revision at planning:** `9f0e413e464cc05e8f74a12f4035fea9e4d1e9ab` (unchanged since the candidate was prepared)
- **Preview worker resource:** port **6120** (owner MSG-3, `inputs/owner-preview-port.md`, 10:20 UTC), profile `badge-profile`, save `badge.sqlite`. Use 6120, not the superseded 6055.

## Context
- Independent review `reports/BADGE-9/review-preview.md` is complete with no blocking findings; `bun test` exited 0 at the reviewed revision.
- Authority: DEC-001 (`inputs/owner-request.md`, 07:30 UTC) permits merging a reviewed combined candidate locally into the task's own integration branches `task/badge-integration-a`, `-b`, `-c`, `-d` only, never into `main` or a release branch, and never pushing.
- MSG-3 changes only the preview worker's port; the preview unit and its integration target are otherwise unchanged.

## Scope
1. Merge the reviewed preview candidate into `task/badge-integration-d`.
2. Report the resulting integration-branch revision.

## Restrictions
- Merge into `task/badge-integration-d` only. Never `main` or `release/2.1`. Do not push.
- Merge only if `task/badge-integration-d` is still at `9f0e413e464cc05e8f74a12f4035fea9e4d1e9ab`. If it has moved, stop and report without merging; do not resolve conflicts or change the candidate.
- Do not alter the candidate's content and do not run checks or reviews beyond those stated here.

## Acceptance conditions
- `task/badge-integration-d` contains the accepted preview changes from the reviewed revision.
- `delivered_revision` and `reviewed_revision` are recorded in the handoff.

## Verification instructions
- Confirm the merge is a clean integration that leaves the candidate content unchanged.
- Report the destination revision observed before merging and the resulting revision after.

## Expected output / durable report
- `reports/BADGE-9/delivery-preview.md`, with the ruach-handoff leading block: `task`, `status`, `outcome`, `artifacts`, `verification`, `delivered_revision`, `reviewed_revision`, `destination_before`, `discoveries`, `blockers`.
- Run the handoff validator on your own report before returning: `bun <ruach-handoff>/scripts/validate.ts reports/BADGE-9/delivery-preview.md --repo .`.
- Commit the report unchanged with the delivery.
