# RR070-01 dependency audit correction

The original [release review](review.md) rejects candidate `e96367b` and its
recording successor `0d686a4` for the mandatory handoff dependency audit failure.
Those commits, rejection and original audit failures remain intact. This attempt
changes only the handoff lock's transitive `fast-uri` entry from **3.1.8 to 3.1.9**;
Ajv stays 8.20.0 and permits `^3.0.1`. All other resolutions, manifests, release
metadata and product/instruction source remain unchanged at prepared 0.7.0.

The original audit reproduced four advisories (two moderate, two low). The
supported `bun update fast-uri --lockfile-only --cache-dir PRIVATE_CACHE` operation
in a disposable copy selected 3.1.9 within the existing range. Only its generated
lock was copied back; Bun's incidental formatting of the disposable manifest was
not imported. [Bun's update reference](https://bun.com/docs/pm/cli/update) documents
targeted transitive updates. The generated integrity agrees with the
[primary npm registry metadata](https://registry.npmjs.org/fast-uri/3.1.9):

```text
sha512-hS/0Wt3Ya043oKXs0sIxrMpKQITXhMLIrVAKKXi4gozGC9v7YRWVnXIZzjNPTO02M9BdxLCWqK1yRXgNziVyJQ==
```

Actual `bun install --frozen-lockfile --cache-dir PRIVATE_CACHE --backend copyfile`
succeeded in this worktree's ordinary, owned handoff `node_modules`, with integrity
verification enabled. Ajv resolves fast-uri 3.1.9 from that owned directory; the
frozen operation leaves the corrected lock byte-exact. No package installation
runs through shared links. Existing root/Herdr dependencies are reused read-only.
Actual network-enabled CI `bun audit` commands pass at root (26 packages), handoff
(6) and Herdr (3), each exit 0 with no reported vulnerabilities. The result is
current audit evidence, not an exploit demonstration or proof of the historical
hosted audit's cause. Initial DNS failures and successful supported network runs
remain separate complete raw receipts in new private scratch.

[Dependency evidence](audit-fix-artifacts/dependency-resolution.json) records the
exact old/new resolutions, integrity, lock digests, actual frozen/audit output and
owned runtime resolution. [Import provenance](audit-fix-artifacts/import-manifest.json)
covers 12 exact safe final report/artifact snapshots from rejected review
`cede9c95ddd9240e17395e043f17b9b889e0804d`, copied without its branch ancestry.
The rejection is historical evidence; no original report or prep evidence is edited.

The canonical handoff `docs/reports/c1-c5/audit-fix-070.md` identifies the committed
candidate/tested revision, affected release-union results, new exact committed
snapshot/foreign-cwd relocation checks, full raw scratch locator, protected-source
and main/global preservation, and independent re-review still required. No source
tests need changing for this lock resolution. Passing local audits does not claim
hosted candidate CI, native/council/parity/listening/quality acceptance or delivery.
No merge, tags, push, global installation, account/native setting or retained
consumer mutation occurs. RR070-01 attempt 1 begins with zero failed completed
correction cycles; ordinary diagnostics and supported environment remediation do
not consume a cycle. Independent re-review determines closure.
