# R2-B replacement-ref boundary — public summary

This is the portable public summary of the reviewed R2-B boundary report. The internal
operational report and its raw terminal/source excerpts are not published; this summary
preserves the reviewed conclusion and the source attribution without raw transcripts.

## Conclusion (as reviewed)

- **Supported by public source and a fake-fixture probe.** Herdr's worktree creation
  runs a plain `git worktree add` with no replacement-ref suppression option. A standard
  `refs/replace` at the base can therefore change a *linked* checkout's working-tree
  bytes while Ruach's `--no-replace-objects` HEAD comparison still passes.
- **Standalone creation is protected.** Ruach's standalone `createWorktree()` issues
  `git --no-replace-objects worktree add`, so a replacement ref does not alter the
  checked-out bytes on that path.
- **The limitation is documented, not fixed.** In linked mode Herdr itself runs the
  `git worktree add`, so the launcher cannot disable replacement refs there. Ruach does
  not hash the checkout, delete refs or refuse linked placement.

## Not verified

- Live Herdr server behavior and the daemon's environment/Git configuration were not
  measured. A client environment flag is not shown to reach the server. The fake fixture
  models the unprotected command from public source; it is not Herdr.

## Where this is recorded in the product

- [Operations known limitations](../../../operations.md#known-limitations-in-03)
- [Regression-case inventory](../../../regression-cases.md)
- Changelog R2 linked-launches entry: [CHANGELOG.md](../../../../CHANGELOG.md)

Source attribution: reviewed at source commit `c170d27` (R2-B); the boundary was carried
into the R1–R3 union and this release.
