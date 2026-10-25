# Synthetic source and reporter history

Accepted contract: checkpoint numbers, including zero, persist unchanged through save/reload. Only a missing checkpoint uses default 1. The runtime input is a copied save `{ "checkpoint": 0 }`. Original save is protected; the runner allocates a disposable copy.

Named source excerpt (runner supplies actual revision):

```ts
export function serialize(checkpoint: number | undefined): string {
  return JSON.stringify({ checkpoint: checkpoint || 1 });
}
```

Reporter A: "After loading the zero checkpoint and saving, I reloaded at checkpoint 1." They supplied no build ID, save digest, command or capture. Reporter B: "Maybe the loader clamps checkpoints." No loader source or observation is supplied. Reporter C: "I dislike the default checkpoint name." No naming requirement is supplied. These are raw synthetic reports; independent actual reproduction has not occurred.
