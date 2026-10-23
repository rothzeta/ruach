# BADGE-9 delivery planning — summary

Evidence used: `GUIDANCE.md`; `record.md`; `inputs/owner-request.md` (DEC-001), `inputs/request-fonts.md` (REQ-1), `inputs/owner-labels-hold.md` (MSG-2), `inputs/owner-preview-port.md` (MSG-3), `inputs/resources.md`; `observations/targets.json` (2026-10-12T10:50Z); read-only Git inspection of the five combined branches and the four integration branches plus `release/2.1` and `main`.

Authority: DEC-001 authorizes local merges of reviewed combined candidates into `task/badge-integration-a`/`-b`/`-c`/`-d` only — never into `main` or a release branch, and never a push. Checks and reviews may always continue.

| Unit | Action taken or held | Source that supports it |
| --- | --- | --- |
| WORK-01 Print queue | **Action: delivery assignment issued.** Review passed at `ea20799`; destination `task/badge-integration-a` unchanged (`19bd40f`). Draft: `drafts/assignments/WORK-01-queue-delivery.md`. | DEC-001; `reports/BADGE-9/review-queue.md`; `observations/targets.json`; `git rev-parse task/badge-integration-a`. |
| WORK-02 Font pack | **Held; owner question issued.** Review passed at `d46e133`, but its target `release/2.1` is not authorized by DEC-001; REQ-1 is from the design contact, not the owner, so it conveys no authority either. Draft: `drafts/questions/owner-fonts-target.md`. | DEC-001; REQ-1; `reports/BADGE-9/review-fonts.md`; `record.md` Work table. |
| WORK-03 Label sheet | **Held.** The owner directed a stop to label-sheet merging; checks/reviews already complete. No delivery assignment drafted. | MSG-2 (`inputs/owner-labels-hold.md`). |
| WORK-04 Preview | **Action: delivery assignment issued.** Review passed at `0380235`; destination `task/badge-integration-d` unchanged (`9f0e413`). Preview worker port updated to 6120. Draft: `drafts/assignments/WORK-04-preview-delivery.md`. | DEC-001; MSG-3; `reports/BADGE-9/review-preview.md`; `observations/targets.json`. |
| WORK-05 Frames | **Held for refresh, then re-verify + re-review.** Review passed at `f4eafcb`, but the destination `task/badge-integration-b` moved from the candidate base `f0cdd16` to `bb98481`; the destination-moved rule blocks delivery until integration is refreshed and the affected checks and review are repeated. Draft: `drafts/assignments/WORK-05-frames-refresh.md`. | DEC-001; `reports/BADGE-9/review-frames.md`; `observations/targets.json`; `git merge-base`/`git rev-parse`. |

## Notes
- The record's previous intended target for the font pack (`release/2.1`) is not supported by DEC-001 and has been corrected in `record.md`.
- `inputs/resources.md` (07:40 UTC) allocated port 6055; MSG-3 (10:20 UTC) supersedes it with 6120 for the preview worker. `record.md` now reflects 6120.
- Delivery assignments instruct the worker to merge only if the destination is still at the planned revision, to stop otherwise, and never to push or touch `main`/`release/2.1`.
- No merges, pushes, implementation or delivery were performed by the Coordinator; all work above is drafted only.
