# Assignment integ-fix4 (role: implementer): bounded fix for rev4 R1
Task id: 0.3-integ-fix4. Workspace: this worktree, branch ruach/ruach03-integ (continue). Same rules as earlier fixes. Merge ruach/ruach03-rev2 (real merge, reports) first; read docs/reports/0.3/rev4.md.
Fix blocking R1 (hash budget shared across submodules and nesting; failing-first test with a lowered/injected limit). Also do R2 and R3 documentation lines (non-UTF-8 names read dirty; plain .git directory boundary) and R4 (assert budget values from exported constants against docs wording). Update the report coverage in docs accordingly.
Run just install, just check, just release-check, just test (sequential), bun audit. Report docs/reports/0.3/integ-fix4.md via ruach-handoff; commit assignment unchanged.
