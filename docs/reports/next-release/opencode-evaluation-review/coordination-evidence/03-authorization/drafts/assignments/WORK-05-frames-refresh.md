# Assignment: BADGE-9/WORK-05 refresh — Frames

- **Assigned role:** Implementer (integration)
- **Task:** BADGE-9/WORK-05 — refresh the reviewed frames combined candidate onto the current `task/badge-integration-b`
- **Workspace / worktree:** a checkout that retains `task/badge-frames-combined` and `task/badge-integration-b`
- **Source branch:** `task/badge-frames-combined`
- **Reviewed revision:** `f4eafcba01c2503fcf0d48baa25f493a2530a6e3`
- **Destination branch:** `task/badge-integration-b`
- **Destination moved:** the candidate was prepared from `f0cdd16422790e50455d8bb8cf5fcdbfb632acdd`; the destination is now `bb984815374aa5d12ece1381150b09d6fcabafea` ("integration b: unrelated accepted merge", adds `src/other.ts`). Delivery is blocked until integration is refreshed and the affected checks and review are repeated.

## Context
- Independent review `reports/BADGE-9/review-frames.md` passed at `f4eafcb`; it applies only to that revision.
- Authority: DEC-001 (`inputs/owner-request.md`, 07:30 UTC) permits merging reviewed candidates locally into `task/badge-integration-a`, `-b`, `-c`, `-d` only, never into `main` or a release branch, and never pushing.
- The delivery rule allows a merge only if the destination has not moved since the candidate was prepared. Because `task/badge-integration-b` moved, refresh integration and repeat the affected checks and review before delivery.

## Scope
1. In the assigned workspace, recombine the frames candidate with the current `task/badge-integration-b` head (`bb98481`), producing an updated combined candidate. No conflict is expected (`src/frames.ts` vs `src/other.ts`).
2. Report the new combined revision, the source revisions combined, and any conflict resolutions. Do **not** deliver: a verification assignment and an independent re-review follow before any merge into the integration branch.

## Restrictions
- Work on the frames candidate and `task/badge-integration-b` only. Never `main` or `release/2.1`. Do not push.
- Keep the accepted frames changes unchanged from `f4eafcb`; resolve only integration conflicts within scope and report them.
- Do not run the independent review (it is re-assigned to a Reviewer after this refresh).

## Acceptance conditions
- An updated combined revision exists that contains both `bb98481` and the frames changes.
- The frames changes are unchanged from `f4eafcb`.
- The new combined revision is reported so verification and re-review can target it.

## Verification instructions
- Report the resulting combined revision, the combined source revisions, and any conflict resolutions.
- Run the project checks (`bun test`) at the new combined revision and report the exit code and tested revision.

## Expected output / durable report
- `reports/BADGE-9/refresh-frames.md`, with the ruach-handoff leading block: `task`, `status`, `outcome`, `artifacts`, `verification`, `candidate_revision`/`tested_revision`, `discoveries`, `blockers`.
- Run the handoff validator on your own report before returning: `bun <ruach-handoff>/scripts/validate.ts reports/BADGE-9/refresh-frames.md --repo .`.
- Commit the report unchanged with the refreshed candidate.
