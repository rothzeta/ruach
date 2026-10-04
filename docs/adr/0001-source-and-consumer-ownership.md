# ADR-0001: Source and consumer ownership

Status: accepted for this extraction by the supplied implementation assignment, 2026-10-04.

## Decision

Ruach owns reusable role contracts, skills, Coordinator workflows, shared handoff schemas/validators, supported harness adapters, their tests/evaluations and authoring/install guidance. Workflows are skills under `skills/ruach-workflow-*` only. Consumer projects own product decisions, knowledge schemas, accepted ADRs, model/route catalogs and preferences, root launch policy, plans and durable task evidence.

Roles and workflows read consumer guidance and self-contained assignments. They keep role separation, bounded authority, verification, independent review, evidence preservation and cleanup obligations; they do not prescribe a consumer's mailbox paths, protected records or model restrictions.

Source ownership and installation scope are separate. Ruach Git commits are canonical shared source. A committed consumer snapshot is a generated, pinned installation. Global skill discovery (including symlinks) is deployment, not source ownership; it must not become a second editable source tree. Consumers explicitly sync to a commit and record origin, revision and file hashes. A fresh consumer clone runs its installed resources without a sibling checkout; refreshing or comparing against upstream takes an explicit source checkout.

## Consequences

Shared changes are authored and verified in Ruach, then adopted by consumers. Consumer-specific constraints stay in consumer guidance/configuration. Installation drift is detected locally by hashes and, when a source checkout is supplied, against the recorded Git tree. Installation never migrates global links or changes harness account settings. Ruach architectural ADRs document its own decisions; consumer ADRs remain with their projects.
