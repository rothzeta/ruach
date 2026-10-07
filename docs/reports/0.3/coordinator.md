---
task: ruach-0.3-coordinator
status: needs-decision
role: coordinator
outcome: "Ruach 0.3 Tracks A-E implemented as scoped (E documentation-only), independently reviewed, delivered to ruach/ruach-03-coordinator as a fast-forward. No merge to main, tag, publish or version bump; release left for user approval."
candidate_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
reviewed_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
tested_revision: c6594f57b36863424dc8c7073763e8292fad2ff2
delivered_revision: dd766f34dfe3b8699c40444acd12ffafd411cfb7
artifacts:
  - docs/reports/0.3/
  - docs/design/0.3-install-and-readiness.md
  - docs/design/0.3-clean-check.md
  - docs/native-parity.md
  - CHANGELOG.md
verification:
  - "At c6594f5 (worker and independent reviewer runs, sequential): just check, just release-check, just test (root 90, handoff 28, herdr 148, harness-eval 101; 0 fail), bun audit clean for locked packages"
  - "At the destination dd766f3 (delivery worker): just check and just release-check pass; full suites not rerun, content equals c6594f5 plus reports"
  - "Not run: GitHub CI, live linked-worktree launch, real Codex reader, paid smoke tests"
review:
  - "Opus reviews rev-sec, rev2, rev3, rev4, rev5 and Sonnet-low rev-docs; all blocking findings closed; rev5 reports none outstanding (optional notes in docs/reports/0.3/rev5.md)"
discoveries:
  - "Escalation rule applied: two fix/review cycles each exposed a new RU-02 forged-clean variant, so the Coordinator stopped and assigned an Architect (docs/design/0.3-clean-check.md) before the implementation; route unchanged, no alternatives used"
  - "release-0.3 in /opt/dev/ruach advanced to a7daa8c during the task; the two roadmap commits were cherry-picked here, expect a trivial duplicate on merge"
  - "One auto-mode denial of the first delivery assignment; delivery proceeded after explicit user approval (go)"
blockers:
  - "needs-decision: user ratification of Coordinator-made D1-D4 (byte-exact clean comparison, harness-eval output-contract change, budgets 100000 paths and 1 GiB, accept SHA-1 collision boundary)"
  - "needs-decision: plugin-root versus per-skill packaging; Codex native role TOML export (docs/native-parity.md)"
  - "PENDING user authorization: paid clean-install smoke tests per route and claude --agent versus Herdr append comparison (Track E)"
  - "Release 0.3.0: version bump, tag, publish and merge to main await user approval; CI not yet run on GitHub"
---

# Coordinator delivery record

Workers (all Sonnet 5.5 implementers unless noted): impl-a (A1,A3,A4,A6,A8), impl-b (A2,B), impl-c (A5,C2), impl-d (C1,C3,C4,D, addendum 1, changelog), impl-e (A7 linked worktrees), impl-f (Track E docs), integ (integration, fixes 1-4, delivery); Architect (Opus): arch (install/readiness), arch2 (clean check); Reviewers (Opus unless noted): rev-sec, rev-docs (Sonnet-low), rev2-rev5. Each report is in this directory.

Known gaps: install lock taken after preflight; linked-launch failure loses workspace id; Skills CLI 1.7.0 install paths unconfirmed; CI unexercised; no live linked launch.

## Cleanup

Closed every worker session and temporary directory; removed all task worktrees; all `ruach/ruach03-*` branches retained. Retained: this checkout, `ruach/ruach-03-coordinator`.
