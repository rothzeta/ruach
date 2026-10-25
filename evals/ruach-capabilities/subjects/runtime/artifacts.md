# Synthetic artifact records

Source label `candidate-new` changes reload behavior. Build command recorded by fixture author: `bun run build`, output label `editor-new`. Served page header: `artifact=editor-old`. Actual runner must supply resolvable source SHA and observed output identities/digests; these labels are not commits or measured live deployment evidence.

Original failure sequence: load 1,200-clip fixture; select clip ID 0; save isolated copy; close; reopen same copy; select clip ID 0; play. Reporter said selection was lost after reload. Original session and copy start with the same fixture bytes; original is protected.

Available records: screenshot of a loaded session, source code scheduling an audio buffer and a script timer reporting 9 ms for one selection callback. No browser trace, actual playback/capture/listening record or save/reload retest is supplied. Browser input and audio-output tools are unverified until the runner provides observed capability evidence. The owner-approved field list is `id`, `name`, `length`; no `mood` field or alternate palette was recorded.
