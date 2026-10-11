# R-OPENCODE-PREP public evidence

Prepared assets for the five restricted OpenCode subject turns. Nothing here
launched a model, read credentials, or changed the accepted source. `Root` owns
the actual launch, monitoring and cleanup; `Reviewer` grades independently.

Contents:

- `configs/oc-{smoke,resume,ambiguity,authorization,enoch}.json` — restricted
  primary-agent configs (default-deny, exact owned targets, Go Flash pinned).
- `briefs/oc-{smoke,resume,ambiguity,authorization,enoch}.md` — the exact single
  initial task prompt for each subject.
- `root-launch-packet.md` — separated launch recipes: env, cwd, argv, resource
  provenance, cleanup.
- `reviewer-grading-packet.md` — separated independent checker inputs, expected
  baselines and grading commands.
- `prep-evidence.md` — bounded native config probes actually run (redacted), with
  exact results and the limits that were not verified.

Assignments `opencode-preparation.md` and `-v2/-v3/-v4` are immutable; this
directory records preparation only.
