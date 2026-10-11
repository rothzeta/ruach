task: RELEASE-0.3.1-DELIVERY
status: complete
outcome: "Delivered the reviewed Ruach 0.3.1 release 363da220d06017101a5c85d876ae75da15171d73 to /opt/dev/ruach main by fast-forward (no force), added a metadata-only successor carrying the independent review evidence, created the annotated v0.3.1 and native ruach--v0.3.1 tags on that same source release commit, and committed this receipt plus the unchanged assignment. main and both tags are pushed to origin git@github.com:rothzeta/ruach.git. No product, source or test change beyond the reviewed revision; no tag was moved."
candidate_revision: 363da220d06017101a5c85d876ae75da15171d73
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: 363da220d06017101a5c85d876ae75da15171d73
tagged_revision: 363da220d06017101a5c85d876ae75da15171d73
delivered_revision: 668028ac103e9e830bb8fa24cfa03803ba8ac85d
destination_before: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/delivery.md
  - docs/assignments/release-0.3.1/delivery.md
  - "annotated tag v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73"
  - "native tag ruach--v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73"
  - "metadata successor 668028ac103e9e830bb8fa24cfa03803ba8ac85d (review evidence + review/review2 assignments)"
  - "origin git@github.com:rothzeta/ruach.git refs/heads/main"
verification:
  - "Preconditions: main HEAD equalled the named baseline d75039aa...; origin git@github.com:rothzeta/ruach.git; ls-remote main d75039aa...; v0.3.1 and ruach--v0.3.1 absent locally and remotely; no staged changes; reviewed 363da220 is a descendant of the baseline."
  - "Preservation: the 21 tracked dirty owned paths and 149 untracked candidate-collision files were copied to /tmp/ruach-release-wave2-20261011/retained/prepromotion/ with prepromotion-manifest.json and .sha256 digests before clearing only those paths; 195 protected untracked paths (council worktrees, the next-release/r3/release-wave2/roadmap-implementation records, and the delivery/review/review2 assignments) were left in place."
  - "Promotion: git merge --ff-only 363da220 updated d75039a..363da220 with no conflict and no force; the working tree equals 363da220 for every payload path."
  - "Tags: annotated v0.3.1 and native ruach--v0.3.1 both resolve to 363da220 via ^{commit}; both names were rechecked absent immediately before creation and neither was moved or overwritten. The native tag was created once after that absence check; the CLI -f (per its help: 'Skip the dirty-working-tree and tag-already-exists checks') only bypassed the uncommitted-untracked-tree check and moved no existing tag."
  - "Metadata successor 668028a: adds the cf7c77e review report and its review-evidence (verification.txt, publication-scan.txt) and the 201e3d2 review2 report, plus the unchanged review/review2 assignments, byte-identical from those commits; product unchanged."
  - "Checks after promotion: just check exit 0; just release-check exit 0 ('Release v0.3.1: package, plugin, marketplace, agents and changelog verified'); exact source blob comparison shows every payload path equals the reviewed 363da220 blob."
  - "Reused, not rerun: full root/skill/packet suites from the source-identical tested 4cca79b9 (root 100, herdr 162, handoff 28, harness-eval 71, changelog 35; packet suites 14 and 10), documented in the preparation and review reports."
  - "Publication: git push --atomic origin refs/heads/main refs/tags/v0.3.1 refs/tags/ruach--v0.3.1; the actual exit and the ls-remote refs (including peeled tag targets) are recorded in the returned terminal handoff."
discoveries:
  - "The 0.3.0 release shipped only v0.3.0 with no native tag; this release adds ruach--v0.3.1 in the established 'ruach X.Y.Z' message convention."
  - "No hosted CI, native/model behavior, blind boundary or real consumer task was observed; the reviewed real-behavior limits are unchanged. The task-local OpenCode evidence remains smoke accepted, synthetic non-blind Enoch accepted-then-discarded, authorization accepted, resume failed under runtime denial and ambiguity unverified."
blockers: []

# Ruach 0.3.1 delivery

Delivered the reviewed release `363da220d06017101a5c85d876ae75da15171d73` to main by fast-forward, preserved every original byte outside the repository, added the independent review evidence as a metadata-only successor `668028ac103e9e830bb8fa24cfa03803ba8ac85d`, and committed this receipt as a later successor. Both release tags point at the same source release commit; main additionally carries the metadata successors. The exact push exit and remote refs are returned in the terminal handoff.
