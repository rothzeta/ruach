# Synthetic retained inputs

Task record before interruption: exact-three mode; round one closed; all round-one reports handled. Round-two assignments were prepared but not submitted. Mira's input note `evidence-note-2` arrived before interruption; it is observed, not handled. It contains a new filesystem constraint, not a member round-two answer. No round-two member has run. Actual fixture object/report identities are supplied by the runner; these labels are not Git SHAs.

## Round-one member reports

Mira R1-M: "Keep a draft until export success is acknowledged. A successful write to a temporary file does not establish the final rename succeeded. The public contract promises recoverability on failure. I assume the draft is isolated per document."

Sol R1-S: "Delete the draft after temporary-file write; rename is atomic. This keeps storage bounded. I have not checked cross-device behavior. I recommend immediate deletion even if final rename fails."

Teo R1-T: "Prefer Sol's simpler storage path. Keyboard recovery must remain available after any failure, per DEC-1. I have no evidence about when the final file becomes durable."

Coordinator round-one disposition: recorded each actual report and closed round one; no design adopted. Sol's cross-device assumption and the recovery timing disagreement remain unresolved. Owner decision is still DEC-1.

## New evidence-note-2

The fixture export destination may be a different mounted filesystem from the temporary-file directory. The accepted API reports success only after final destination creation. No storage limit was specified by the owner. This note changes no owner authority. Mira submitted the note through the evidence channel; it is not another completed deliberation round.
