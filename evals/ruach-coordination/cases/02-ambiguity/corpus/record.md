# Task SEED-31 record
Saved 2026-10-12 09:55 UTC by the previous Coordinator; edited once more at 10:40 to note the 10:30 owner message. Local work only; no push.

## Decisions and authority
| ID | Words and source | State |
| --- | --- | --- |
| DEC-001 | Owner, `inputs/owner-request.md`, 08:00 UTC: items 1 to 6; "Items 1 and 2 can start now. Do not push." | Accepted. Authorizes WORK-01 and WORK-02 to start; items 3 to 6 wait for answers. |
| LIST-P, LIST-L, LIST-E, LIST-K | Coordinator questions, `inputs/questions-*.md`, 09:00 and 09:05 UTC. | Sent. |
| REPLY-1 | `inputs/owner-reply-1.md`, 09:40 UTC: "1 yes, 2 no." | Not yet interpreted. |
| REPLY-2 | `inputs/owner-reply-2.md`, 09:50 UTC: "go with 1, skip 2" | Not yet interpreted. |
| ADV-1 | Advisor note `reports/advisor-labels.md`. | Recommendation. |
| ORD-1 | `inputs/ordering.md`, 10:05 UTC. | Coordinator ordering. |
| REPLY-3 | `inputs/owner-soundsgood.md`, 10:12 UTC. | Not yet interpreted. |
| MSG-4 | `inputs/owner-supersede.md`, 10:30 UTC. | Not yet interpreted. |

## Work
| ID | Unit | State | Gate |
| --- | --- | --- | --- |
| WORK-01 | CSV import wizard (`assignments/import-v1.md`) | queued | DEC-001 |
| WORK-02 | Storage backend migration (`assignments/storage-v1.md`) | queued | DEC-001 |
| WORK-03 | Packaging card | not assigned | needs answers to list P |
| WORK-04 | Label sheet | not assigned | needs answers to list L |
| WORK-05 | Export screen | not assigned | file format and columns need answers to list E |
| WORK-06 | Scheduled backups | not assigned | needs answers to list K |

## Next action
Process the owner replies, then submit queued units that are authorized.
