# Developing Ruach

This checkout is the canonical source of reusable roles in `agents/` and skills in `skills/`. Edit shared resources here; consumer `.agents` snapshots are generated installations. Do not create a second editable copy of these resources in this repo. See [source ownership](docs/adr/0001-source-and-consumer-ownership.md) and [authoring guidance](CONTRIBUTING.md).

When explicitly assigned a role, follow its definition in `agents/<role>.md`. Only the Coordinator loads workflow bodies from `skills/ruach-workflow-*`; workers receive a role and a self-contained assignment.

Ruach's own development launch policy is in `config/agent-routing/`. Use `just agent-routing resolve ROLE` for offline selection and `just agent-routing start ROLE NAME` from a Herdr caller pane to launch. `just coordinator` launches the preferred Coordinator as `ruach-coordinator`. These commands delegate to the source [ruach-herdr skill](skills/ruach-herdr/SKILL.md); native preparation, permission mappings and pane operations stay there. Routes are explicit and never change automatically after errors. Assignments and prompts are sent separately after startup.

Keep executable code and tests in TypeScript/Bun. Run `just check`, `bun run test`, and affected skill suites. Herdr tests require local socket access. Preserve upstream attribution, existing contracts and user authority; do not write global harness settings or replace discovery links as a side effect of development or launch.
