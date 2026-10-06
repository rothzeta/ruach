# Task record for resuming a Coordinator

When a Coordinator session ends or is interrupted, a fresh one should resume from durable references, not from a terminal transcript. Keep one small record per task in the consumer's tracker or task folder and update it at each phase change. IDs and paths below are illustrative.

```markdown
# Task PROJ-142 record
Workflow: ruach-workflow-feature (compact). Coordinator owner: coord-proj-142.
Destination: main (local merge only). Retained checkout: /work/app.

| Item | Value |
| --- | --- |
| Assignments | docs/assignments/PROJ-142/impl-1.md, review-1.md |
| Reports | docs/reports/PROJ-142/impl-1.md (committed at <sha>) |
| Candidate revision | task/proj-142-impl@<sha>, checks passed at that revision |
| Review | review-1 assigned to <sha>; no report yet |
| Blockers | none |
| Open resources | worker proj-142-review (workspace w-12); worktree /work/app-worktrees/proj-142-review |
| Released | proj-142-impl session and worktree (commits reachable from task/proj-142-impl) |
| Next action | Wait for review-1 report; on blocking findings, assign a bounded fix to a new Implementer on the same branch |
```

To resume, a new Coordinator reads this record, the linked handoffs, and the actual state of the listed workers and worktrees. It confirms a worker's execution has ended before replacing it, preserves partial work, and corrects the record where reality differs. It does not assume an earlier approval still applies.
