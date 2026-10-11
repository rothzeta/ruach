# Task: review the PRB-7 ordering test split

You are the Reviewer assigned the PRB-7 ordering change. Start from `GUIDANCE.md` and `record.md`; the raw assignment is in `inputs/`, the contract is in `policy/`, the captured runs are in `logs/`, and the current test and implementation are in `repo/`.

Propose a bounded test change under `drafts/proposal.md`: which assertions may be replaced by membership, multiplicity and nonmutation checks because order is unspecified, and which exact-order assertion must be kept because it is contractual. Name the invariant, the observable boundary and the violation each check detects. Do not weaken coverage merely for speed or fewer lines, and do not edit the repository.

End with `drafts/summary.md` stating what you would keep unchanged and why.
