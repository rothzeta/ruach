task: RELEASE-0.3.1-DELIVERY
status: needs-decision
outcome: "0.3.1 delivery candidate prepared locally on /opt/dev/ruach main: the reviewed release 363da220 was fast-forwarded onto main, a metadata-only successor added the independent review evidence, and the annotated v0.3.1 and native ruach--v0.3.1 tags were created on that same source release commit. Publication (pushing main and both tags) is NOT performed and awaits the independent focused review of the import repair. No success claim."
candidate_revision: 363da220d06017101a5c85d876ae75da15171d73
tested_revision: 4cca79b9c628f80d4d20b897ac65dac7bcc85190
reviewed_revision: 363da220d06017101a5c85d876ae75da15171d73
tagged_revision: 363da220d06017101a5c85d876ae75da15171d73
destination_before: d75039aa7b82b262e2f28af08630258fb7f77180
artifacts:
  - docs/reports/releases/0.3.1/delivery.md
  - docs/reports/releases/0.3.1/publication-fix.md
  - docs/assignments/release-0.3.1/delivery.md
  - "annotated tag v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73 (local, unpushed)"
  - "native tag ruach--v0.3.1 -> 363da220d06017101a5c85d876ae75da15171d73 (local, unpushed)"
  - "metadata successors 668028ac103e9e830bb8fa24cfa03803ba8ac85d (review evidence) and c2e6d4cf9a623ac56d7a7d039e8b61044d60acc7 (review.md link repair)"
  - "origin git@github.com:rothzeta/ruach.git refs/heads/main"
verification:
  - "Preconditions: main HEAD equalled the named baseline d75039aa...; origin git@github.com:rothzeta/ruach.git; ls-remote main d75039aa...; v0.3.1 and ruach--v0.3.1 absent locally and remotely; no staged changes; reviewed 363da220 is a descendant of the baseline."
  - "Preservation: the 21 tracked dirty owned paths and 149 untracked candidate-collision files were copied to /tmp/ruach-release-wave2-20261011/retained/prepromotion/ with prepromotion-manifest.json and .sha256 digests before clearing only those paths; 195 protected untracked paths (council worktrees, the next-release/r3/release-wave2/roadmap-implementation records, and the delivery/review/review2 assignments) were left in place."
  - "Promotion: git merge --ff-only 363da220 updated d75039a..363da220 with no conflict and no force; the working tree equals 363da220 for every payload path (381/381 blobs identical)."
  - "Tags: annotated v0.3.1 and native ruach--v0.3.1 both resolve to 363da220 via ^{commit}; both names were rechecked absent immediately before creation and neither was moved or overwritten. The native tag was created once after that absence check; the CLI -f (per its help: 'Skip the dirty-working-tree and tag-already-exists checks') only bypassed the uncommitted-untracked-tree check and moved no existing tag."
  - "Metadata successor 668028a: adds the cf7c77e review report + review-evidence and the 201e3d2 review2 report, plus the unchanged review/review2 assignments, byte-identical from those commits."
  - "Review import repair: importing the reviewer's review.md exposed two broken inline-code relative links; metadata-only commit c2e6d4c corrected only those two references to the repository root. Changed-vs-receipt set is exactly review.md; zero product/source change versus 363da220."
  - "Checks on the repaired candidate: just check exit 0; just release-check exit 0 ('Release v0.3.1: package, plugin, marketplace, agents and changelog verified'); git diff --check d75039a..c2e6d4c exit 0; every payload path equals the reviewed 363da220 blob."
  - "Reused, not rerun: full root/skill/packet suites from the source-identical tested 4cca79b9 (root 100, herdr 162, handoff 28, harness-eval 71, changelog 35; packet suites 14 and 10), documented in the preparation and review reports."
  - "Publication: NOT performed. No push has run; remote main and both tags remain at their baseline/absent values. Push is pending the independent focused review of the import repair."
discoveries:
  - "The 0.3.0 release shipped only v0.3.0 with no native tag; this release adds ruach--v0.3.1 in the established 'ruach X.Y.Z' message convention."
  - "No hosted CI, native/model behavior, blind boundary or real consumer task was observed; the reviewed real-behavior limits are unchanged. The task-local OpenCode evidence remains smoke accepted, synthetic non-blind Enoch accepted-then-discarded, authorization accepted, resume failed under runtime denial and ambiguity unverified."
blockers:
  - "Independent focused review of the import repair is required before push; publication is not performed."

# Ruach 0.3.1 delivery (prepared, unpublished)

The reviewed release `363da220d06017101a5c85d876ae75da15171d73` was fast-forwarded onto main, every original byte was preserved outside the repository, the independent review evidence was added as a metadata-only successor `668028ac…`, and the import links were repaired in `c2e6d4c…`. Both release tags point at the same source release commit. Publication (push of main and both tags) has **not** been performed and awaits the independent focused review. The exact planned push and the final remote confirmation will be recorded once authorized.
