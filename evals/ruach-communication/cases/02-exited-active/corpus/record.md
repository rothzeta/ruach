# Task RELAY-14 record
Saved 2026-10-12 08:20 UTC by the previous Coordinator, before the host update finished. Local work only. Record location: this file.

## Decisions and authority
| ID | Exact words and source | State |
| --- | --- | --- |
| DEC-001 | Owner, `inputs/owner-request.md`, 2026-10-12 08:10 UTC: "Only an identity that has actually ended may get a bounded fresh replacement. Never replace or kill a worker that is still working." | Accepted. |

## Work
| ID | Unit | State at 08:20 | Branch, assignment | Notes |
| --- | --- | --- | --- | --- |
| WORK-01 | Queue export | running | `task/relay-14-export`, `assignments/export-v1.md` | Session `relay-export`, pane `w5:p1`. Partial commit plus an uncommitted diff. |
| WORK-02 | Queue import | running | `task/relay-14-import`, `assignments/import-v1.md` | Session `relay-import`, pane `w5:p2`. Partial commit plus an uncommitted diff. |
| WORK-03 | Field normaliser | running | `task/relay-14-normalize`, `assignments/normalize-v1.md` | Session `relay-normalize`, pane `w5:p3`. |

## Handled reports
| Work | Report | Identity handled | Handled at | Disposition |
| --- | --- | --- | --- | --- |
| none | | | | No report has been consumed yet. |

## Next action
Confirm each worker's real process state after the host update before issuing any replacement.
