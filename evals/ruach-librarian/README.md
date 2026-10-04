# Librarian behavioral evaluation packet

Developer evaluation material for [ruach-librarian](../../skills/ruach-librarian/SKILL.md). It lives outside `skills/`, so snapshot and skill installations exclude these cases and rubrics. A native plugin fetched as a complete Git repository can retain developer files on disk; these packets are not registered plugin components or subject inputs. The corpora are synthetic. Prepare a fresh isolated copy of a case's corpus for each subject, and never run upkeep on a real consumer mailbox. The Implementer prepares fixtures but does not run or grade the subject.

## Subject boundary

Give the subject only `skills/ruach-librarian/SKILL.md`, the chosen `cases/<case>/task.md` and an isolated copy of that case's `cases/<case>/corpus/`. Supply no intended answer, prior outcome or suspected failure. Withhold `expected/`, this README, implementation handoffs, other cases and other evaluator outputs. Whitelist the input paths in the evaluator's harness when possible, and use a fresh subject session per case.

After the blind worker returns its report and edited corpus, a separate grading assignment may read the rubrics. Preserve original inputs and subject outputs separately. Judge the observable preserved knowledge, authority and evidence, not exact generated phrasing.

## Cases

Basic coverage, graded with [expected/rubric.md](expected/rubric.md):

| Case | Tests |
| --- | --- |
| `01-authority` | A newer proposal does not displace an accepted decision. |
| `02-revisions` | A check at an earlier revision does not verify a later one; the protected status file is left to its owner. |
| `03-conflicts` | Incompatible observations under the same conditions stay an unresolved finding. |
| `04-evidence` | Unique failure evidence survives consolidation when removal is permitted. |

Strengthened coverage, graded with [expected/strengthened-rubric.md](expected/strengthened-rubric.md):

| Case | Tests |
| --- | --- |
| `05-redundant-source` | A genuinely redundant report is removed under explicit, reversible authority, without a confirmation request. Its three inbound links are repaired, and an overlapping report with unique evidence is retained. |
| `06-implicit-status` | Acceptance must be inferred from an owner decision record, and the tested revision and scope from raw CI logs, not from the sources' own wording. A positive control checks that accepted, checked work is not under-claimed. |

## Known limits

- The corpora are small and synthetic. A pass shows that the skill avoids these specific errors, not that it is robust on large real mailboxes.
- The basic cases carry explicit cues: sources state their own status ("No tests run", "We did not explain the discrepancy"), and their shared `GUIDANCE.md` itself forbids web research, new checks and disposition. In `04-evidence`, `summary.md` adds a claim that `details.md` lacks, so retaining both is a valid outcome and the removal path goes untested there. Case 05 covers removal.
- Each recorded result is a single run with no variance estimate. Record the evaluator's model and route with every result.
- Structural, link and frontmatter checks do not show that Librarian decisions are sound.
