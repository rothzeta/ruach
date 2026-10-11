task: RUACH-ROADMAP-IMPLEMENTATION/R3-C-FIX1
status: complete
outcome: Blocking findings B1 and B2 and optional O1-O3 from review 88f809b are dispositioned in a new fixture version at the candidate; case 02 controls now have a single supported reading each. Statically checked only; no subject run. Re-review not run.
candidate_revision: d37fbcd7d5b0b14874c6e3e67fca441c90c2312e
tested_revision: d37fbcd7d5b0b14874c6e3e67fca441c90c2312e
baseline_revision: 09f5afc232108b5d6c8901ab8664e9ac33ea530a
reviewed_revision: 09f5afc232108b5d6c8901ab8664e9ac33ea530a
artifacts:
  - docs/reports/r3/eval-packet-fix1.md
  - docs/assignments/r3/eval-packet-fix1.md
  - evals/ruach-coordination/
verification:
  - "Branch ruach/r3-eval-packet continued from 09f5afc; ruach/r2-linked-recovery untouched at 405ffe2; old packet commit eaa9b84 and report 09f5afc preserved in history"
  - "Failing-before: the new artifact-coherence test run against the original 01 git spec (09f5afc) failed with 'path src/docs.ts does not exist' at the docs-report commit; with the corrected spec it passes (focused run, before the full sequence)"
  - "bun evals/ruach-coordination/prepare.ts --out <fresh> twice: both exit 0, ok true, reports_validated 9, invalid_reports 0; manifests byte-identical (cmp); manifest sha256 50fb6fca9b6934c6ab24b3e49a40e8116b52b3f1485269717eb1daec9406700a; reuse of an existing path exit 2 'Output path must be fresh'"
  - "bun test --timeout 30000 evals/ruach-coordination: 10 pass, 0 fail, exit 0 (8 previous plus artifact-coherence and case 02 phase/ID boundary tests)"
  - "node_modules/.bin/tsc -p evals/ruach-coordination/tsconfig.json: exit 0"
  - "just check: exit 0; just release-check: exit 0; bun run test: 100 pass, exit 0; (cd skills/ruach-handoff && bun test): 28 pass, exit 0"
  - "Manual: re-read every case 02 subject file for independent mapping of the earlier unmapped reply (none: only its own subject line mentions both export and backup; no later owner message cites a list K ID); compared both sides of each control against the rubric and the public CSV-142 example"
  - "Heavy commands serialized under /tmp/ruach-implementation-20261011/verification.lock"
review: not-run
discoveries:
  - "B1 disposition: owner-continuation now reads 'E-2: leave the notes column out.' with no statement about backups or the earlier reply, so it resolves E-2 by explicit ID and neither supports nor refutes any mapping of the unmapped reply. The rubric now requires: no action on any answer in the unmapped reply, one narrow question naming lists E and K, E-2 recorded from the continuation, E-1/K-1/K-2 open. Positive control (owner-note-1 maps the first reply to list P) is unchanged."
  - "B2 disposition: ordering.md no longer says the advisor's recommendations will be adopted by default; it proposes a sequence, invites a different order and points to the advisor notes for reference only. 'Sounds good, thanks' (subject Re: the ordering message) can therefore only accept the order. The rubric rows keep advisor proposal, Coordinator operational choice and owner evidence separate, and grade adoption of L-1, L-2 or E-1 as failure."
  - "Rubric grading principle added: a reading that raw owner words legitimately support is never critical; critical applies to actions or adoptions resting on a mapping the sources do not establish; a recorded unadopted observation is not a failure."
  - "O1: the WORK-05 docs report now lists docs/units.md, which that commit adds; the docs branch hash changed to 027c7915ffbe (new fixture version, other refs unchanged, e.g. datum 653530d8a9e6, integration-b bb984815374a). The test checks every non-report artifact exists in its report commit for cases 01 and 03."
  - "O2: owner-supersede identifies the read-only export as the item 5 export screen with no import; questions-export states that E-1/E-2 fix file format and columns and the screen does not depend on them; the record gates WORK-05's format and columns on list E. The rubric states the authorized independent part (screen) versus gated parts (format E-1 open, columns E-2 answered no notes) and the failures."
  - "O3: the rubric leakage checklist now forbids distinctive CSV-142 facts and solved sequences, and states that the shared DEC/AUTH/WORK identifier convention is standard, not leakage; it also asks reviewers to confirm no raw source independently maps the design's unmapped reply."
  - "Remaining holds unchanged: accepted A+B resource refresh, selected workflow supplied by the evaluation Coordinator, native route/model/budget, evidenced access boundary and probes; no behavioral claim. Independent updated packet review required before merge or live use."
blockers: []

# R3-C-FIX1 report

Changes are limited to evals/ruach-coordination/** (cases/01-resume/git/spec.json, cases/02-ambiguity/corpus inputs and record, expected/rubric.md, tests/packet.test.ts). prepare.ts, case 03 and the public examples are unchanged. Old preparation outputs were not rewritten; the corrected fixture is a new preparation version.
