task: RELEASE-0.3.1-PUBLISH
status: complete
outcome: "Ruach 0.3.1 is published. The reviewed release 363da220d06017101a5c85d876ae75da15171d73 (source/tagged, tested 4cca79b9c628f80d4d20b897ac65dac7bcc85190) was fast-forwarded onto /opt/dev/ruach main and advanced to 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a with metadata-only successors; the annotated v0.3.1 and native ruach--v0.3.1 tags point at 363da220. git push --atomic origin refs/heads/main refs/tags/v0.3.1 refs/tags/ruach--v0.3.1 exited 0 against git@github.com:rothzeta/ruach.git. No product, source or test change beyond the tagged release."
candidate_revision: 363da220d06017101a5c85d876ae75da15171d73
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a
tagged_revision: 363da220d06017101a5c85d876ae75da15171d73
delivered_revision: 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a
destination_before: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/publication.md
  - docs/assignments/release-0.3.1/publish.md
  - docs/assignments/release-0.3.1/publication-review.md
  - docs/assignments/release-0.3.1/publication-review-v2.md
  - "annotated tag v0.3.1 (object 19bb04fc4ef8f5481a731d723b6ee071a1b0c841) -> 363da220d06017101a5c85d876ae75da15171d73"
  - "native tag ruach--v0.3.1 (object 6c40b3c84de96f5e935d4c105fc5de039ae13d70) -> 363da220d06017101a5c85d876ae75da15171d73"
  - "origin git@github.com:rothzeta/ruach.git refs/heads/main"
  - "independent final review ea3dcc0dad95b6ea8f0bb6d498e33a59ed94df09 (report and assignment retained on branch ruach/release-0.3.1-publication-review; not copied here)"
verification:
  - "Preconditions: main HEAD 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a; origin git@github.com:rothzeta/ruach.git; remote main d75039aa7b82b262e2f28af08630258fb7f77180; both local tags annotated on 363da220; remote tags absent."
  - "After the stale reviewer worktree under .worktrees was removed: just check exit 0 (bun scripts/check.ts and tsc -p tsconfig.json); just release-check exit 0, 'Release v0.3.1: package, plugin, marketplace, agents and changelog verified'; git diff --check d75039aa7b82b262e2f28af08630258fb7f77180 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a exit 0."
  - "Source correspondence: zero product/source change versus 363da220 (scripts, skills, agents, tests, evals, .github, docs/design, docs/reports/roadmap-planning, docs/examples, coordination/native-parity/roadmap/operations/regression docs, package.json, README.md, CHANGELOG.md, .claude-plugin); all 381 payload paths are blob-identical to 363da220."
  - "Publication: git push --atomic origin refs/heads/main refs/tags/v0.3.1 refs/tags/ruach--v0.3.1 exit 0."
  - "Remote receipt (ls-remote): refs/heads/main = 15b7ef71aaf1b52f1d76b0687949a1aadf760b4a; refs/tags/v0.3.1 = 19bb04fc4ef8f5481a731d723b6ee071a1b0c841 peeling to 363da220d06017101a5c85d876ae75da15171d73; refs/tags/ruach--v0.3.1 = 6c40b3c84de96f5e935d4c105fc5de039ae13d70 peeling to 363da220d06017101a5c85d876ae75da15171d73."
  - "Reused, not rerun: full root/skill/packet suites from the source-identical tested 4cca79b9 (root 100, herdr 162, handoff 28, harness-eval 71, changelog 35; packet suites 14 and 10), documented in the preparation and review reports."
  - "Protected scope: 170 original files archived under /tmp/ruach-release-wave2-20261011/retained/prepromotion/ (manifest + sha256); council worktrees, and the next-release/r3/release-wave2/roadmap-implementation records remain untouched."
  - "Handoff validated with bun skills/ruach-handoff/scripts/validate.ts docs/reports/releases/0.3.1/publication.md --repo /opt/dev/ruach (see Validation)."
review: not-run
discoveries:
  - "The independent final review's only just-check failure was the stale reviewer worktree under recursive .worktrees; after its removal by the Coordinator, the actual just check on main passed."
  - "Historical delivery.md (needs-decision) and publication-fix.md remain accurate at their earlier pending stage; this final receipt supersedes them."
  - "No hosted CI, native/model behavior, blind boundary or real consumer task was observed; the reviewed real-behavior limits are unchanged."
blockers: []

# Ruach 0.3.1 publication

Ruach 0.3.1 is published to main and to the two annotated release tags on `git@github.com:rothzeta/ruach.git`. The release product is the reviewed `363da220`; main carries metadata-only successors and the first-pushed receipt revision is `15b7ef7`. The atomic push exited 0 and the remote refs above are the actual observed values. The creating commit of this receipt is a later metadata-only successor on main and is returned externally rather than named here.
