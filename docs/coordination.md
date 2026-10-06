# One coordination owner per task

Each task has exactly one Coordinator at a time. That Coordinator owns assignments, worker state, advancement decisions, delivery records and cleanup for the task. Workers do not start or coordinate other workers, and they do not select workflows.

This matters when an outer orchestrator such as Hermes launches or supervises Ruach sessions:

- Hermes may start the Coordinator, supply the request and receive its final report. While a Ruach Coordinator owns a task, Hermes does not also assign work to that task's workers or advance its phases.
- To change direction, message the owning Coordinator. To replace it, first confirm its execution has ended and its workspace is free, then name the new owner in the [task record](examples/task-record.md) so exactly one remains.
- Cleanup authority follows ownership: the owning Coordinator releases the task's sessions, workspaces and worktrees. An outer orchestrator releases only what it created for itself, such as the Coordinator's own session.
- Parallel tasks may each have their own Coordinator. They share no worker or worktree unless a consumer assignment says so.

Ruach does not provide a scheduler or mailbox for this. The owner is recorded in the task record and in the assignments the Coordinator writes.
