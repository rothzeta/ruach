# Authoring and maintaining Ruach

Start with a concrete request the resource should handle and nearby resources it might be confused with. Inspect existing callers and contracts before editing. Keep scope small and preserve user authority.

For a skill, use a matching `ruach-` folder/frontmatter name and a precise description that explains capability and trigger. Put only decision-changing instructions in `SKILL.md`. Move substantial conditional detail to linked references; add scripts, fixtures, manifests or assets only when they serve a real need. Keep executable resources and pinned dependencies self-contained. Do not copy consumer policy, manuals, transcripts or alternate workflow definitions into a skill.

For a role, declare responsibilities, edit/decision boundaries and output requirements. Assignments supply task context, acceptance, ownership, permissions, checks and report locations. Worker roles do not select/load orchestration workflows. Consumer-specific routing and document authority belong to consumers.

Run `python3 scripts/check.py`, `python3 -m unittest discover -s tests -v` and each affected skill's frozen install and suite. Test required observable behavior rather than incidental wording or helper calls. Keep useful coverage; change a contract and its tests together only with authority. Test installed/copied resources from a foreign cwd as well as source layout.

For consequential instruction changes, prepare realistic isolated task packets with raw sources. Keep expected outcomes/rubrics separate from subject inputs. An independent evaluator receives the skill, task and minimum raw artifacts, without intended answers or prior conclusions; review its actual output before making narrow corrections. Static/frontmatter/link checks do not prove behavior. See the Librarian [evaluation packet](skills/ruach-librarian/evals/README.md) for the exact give/withhold boundary.

Preserve upstream attribution and dependency licenses. Do not commit credentials, host configuration, private session identifiers, absolute home paths, installed dependencies or raw production transcripts. Record exact verification and unresolved limitations in the consumer's requested handoff.
