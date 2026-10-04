# Portable repository routing

Routed selection consumes consumer-owned catalogs without importing consumer launch policies. Each selected repository owns three catalogs under `.agents/`:

```yaml
# .agents/models.yaml
models:
  model.id:
    harness: codex
    native_model: native-model-id
# .agents/routing.yaml
routes:
  route.id:
    model: model.id
    effort: medium
# .agents/roles.yaml
roles:
  builder:
    preferred: route.id
    alternatives: []
```

Catalogs must be nonempty mappings with exactly their named root field. Models require a registered `harness` and nonempty `native_model`. Routes require a model reference and a nonempty string `effort`; the selected adapter validates its verified effort vocabulary. Known gated adapters remain declared selections and fail preparation accurately with exit 3 when unavailable or unsupported; they are never substituted. Roles are the entries declared in `roles.yaml`, each with `preferred` and optional list `alternatives`. Only the selected role requires a readable `.agents/agents/<role>.md` source. Other role entries still undergo complete structure/reference validation. Direct mode retains its independently verified adapter capabilities and does not load the catalogs.

For source development, `--resources DIR` changes the role/skill root to `DIR/agents` and `DIR/skills`, and `--catalogs DIR` changes the catalog root. Neither changes the selected repository or cwd. Defaults remain `<repo>/.agents`. Explicit resources are reported as `selection.resources`, supplied to native adapters, and used for workflow visibility. This permits developing Ruach directly from its canonical source while keeping development routing policy separate from shared resources.

A consumer may enforce a required role set, allowed harnesses, effort profiles and Coordinator routes in its own wrapper. Those are consumer policies. This skill enforces catalog structure and adapter capabilities, with worker/Coordinator workflow visibility handled by native adapters.

Selection uses the requested role's preference unless `--route` names its preference or one of its alternatives. Other declared routes are rejected. No retries, inheritance or fallback occur. Validate the complete graph before native preparation or launch mutations, including unselected entries. Mapping/reference IDs are nonempty strings, including dotted IDs; role names retain the CLI's safe identifier rule. Reject missing/unknown fields, duplicate keys, malformed YAML, invalid values and references. The worker additionally rejects YAML aliases and multiline strings, and redacts configuration values in diagnostics. Wrappers may impose additional policy; delegated selection always enforces these portable constraints.

`--repo` wins and is anchored to invocation cwd. Otherwise Git resolves the requested cwd's worktree root. JSON records `git_root` separately. Canonical sources may accompany an external cwd, while native/Herdr commands run in the requested cwd. Relative native pass-through paths retain their meaning from that cwd. JSON has `schema_version: 1`.

## Consumer wrapper boundary

A consumer root wrapper may validate project policy and delegate once to `scripts/worker.ts` through a subprocess argv array. Keep native flags, route selection, role injection, launch-space operations and retries in this skill. Forward stdout, stderr and exit status without inventing a second worker result schema.

Use `resolve --offline` for selection without native prerequisites. Forward `--repo`, `--cwd`, `--role`, `--name` and any explicit allowed `--route`; choose permission policy in the consumer and use portable `--permissions`. Source-development wrappers may also forward `--resources` and `--catalogs`. Default placement creates a background worktree workspace; wrappers may forward `--worktree`, `--branch`, `--base` or an explicit `--placement pane`. The skill defaults to inherit. Use it directly for live resolve, dry-run, direct selection, external cwd or supported native pass-through arguments. Consumer root wrapper commands remain consumer policy; Ruach's own development wrapper uses the same delegation boundary.

Codex composes effective layered config through a matching existing daemon or short-lived native stdio reader and passes explicit cwd. The fallback may initialize Codex runtime state; user setting files remain untouched. Preparation fails when neither inspection transport works.

Workers receive canonical role instructions and the Coordinator's self-contained assignment; the launcher never supplies workflow bodies. Claude uses targeted known local workflow suppression. Unverified complete account/plugin/managed catalog visibility does not prohibit preparation. Codex suppresses known workflows through native file/folder aliases. Existing developer and technical skill configuration and Coordinator visibility settings are preserved.

The worker probes native capabilities, Herdr supported kinds and live names, forwards caller PATH/config roots to its background workspace (or explicitly requested sibling pane), and reports worktree/workspace identities, private material and uncertain submission state without retry. Canonical resources and catalogs stay at their selected source paths; the new worktree's cwd is used for native configuration and startup. See [adapter evidence](adapters.md) for prerequisites and coverage limits. Prepared argv does not establish native role/skill acceptance or account/model availability.
