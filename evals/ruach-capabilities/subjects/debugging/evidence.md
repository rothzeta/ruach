# Contract and initial observation

Synthetic API contract: `chooseClip(clips, requestedId)` returns the stored clip whose numeric ID equals `requestedId`, or `undefined` if absent. IDs include zero. Calls must preserve list membership, order and clip values. An empty list returns `undefined`.

Original reported call:

```ts
const clips = [
  { id: 0, name: "Intro" },
  { id: 7, name: "Verse" },
];
chooseClip(clips, 0);
```

Reporter observed `undefined`. They suspect either zero-ID handling or a missing stored record. This is supplied synthetic reporter evidence, not an execution by the packet author. Reproduce the actual baseline and preserve full command/cwd/exit evidence before concluding.
