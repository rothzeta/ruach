# Ruach

Portable agent roles and self-contained skills for bounded engineering and knowledge maintenance. Consumer projects supply their own decisions, knowledge structure and routing policy.

- `agents/`: Coordinator, Architect, Scout, Implementer, Reviewer and Librarian contracts.
- `skills/`: testing, simplification, structured handoffs, Herdr launch preparation, explicit harness evaluation, Librarian upkeep and Coordinator-only feature/knowledge workflows.
- `docs/adr/`: Ruach source and consumer ownership decisions.
- `scripts/`: explicit pinned snapshot installation and resource checks.
- `tests/`: installation contract checks. Skill-specific suites and realistic Librarian fixtures live with their skills.

Only Coordinators load workflow bodies. Workers use a role plus a self-contained assignment with scope, document ownership, acceptance, verification and handoff instructions. See [authoring guidance](CONTRIBUTING.md), [ownership ADR](docs/adr/0001-source-and-consumer-ownership.md), [provenance](PROVENANCE.md) and [MIT license](LICENSE).

## Install a pinned project snapshot

Requires Python 3 and Git. From a local Ruach checkout, use an existing commit:

```sh
python3 scripts/install.py install --source . --revision COMMIT_SHA --target /path/to/project/.agents
python3 /path/to/project/.agents/ruach-install.py check --target /path/to/project/.agents
python3 /path/to/project/.agents/ruach-install.py check --target /path/to/project/.agents --source /path/to/ruach
```

Installation reads committed objects, never uncommitted source files; records upstream origin, full SHA and hashes in `ruach.json`; and includes the installer, provenance and license. Existing managed drift or conflicting files require explicit `--replace`. Unrelated consumer configuration and extra local skills/roles stay with the consumer. `check` needs no source checkout for local integrity; adding `--source` verifies the snapshot against its recorded upstream tree. An install/update uses an explicit source/revision; no fetch, push, global links or persistent harness settings are changed.

Roles and skills install together as `agents/` and `skills/`, preserving cross-resource links. Skill-local scripts remain usable from independently copied skill folders after their local dependency install. Consumers can expose skills through their harness discovery mechanism; global discovery is installation, not a new canonical source.

## Verify

```sh
python3 scripts/check.py
python3 -m unittest discover -s tests -v
# In each of skills/ruach-handoff, skills/ruach-herdr, skills/ruach-harness-eval:
bun install --frozen-lockfile
bun test
```

Bun is required for executable skill suites. Herdr tests require local socket binding. Claude/Codex preparation is supported subject to runtime gates; Pi, OpenCode, DSH, OMP and Agy deliberately fail before mutation for unsupported/unverified capabilities. See [Herdr prerequisites and limits](skills/ruach-herdr/SKILL.md). Fake CLI tests and static checks do not establish model/account availability, live prompt discovery or behavioral quality. Librarian [fixtures](skills/ruach-librarian/evals/README.md) are prepared for a separate blind evaluator.
