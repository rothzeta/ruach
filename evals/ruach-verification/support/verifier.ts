#!/usr/bin/env bun
// Deterministic offline verifier stand-in for the R7 transport controls.
//   bun evals/ruach-verification/support/verifier.ts --lines 130 --exit 23
// Prints numbered lines to stdout, then exits with the requested code. Writes nothing to
// disk and opens no network. It models a long-running verifier whose complete output must be
// retained before any prefix is displayed, and whose exit must never be replaced by a viewer's.
function arg(name: string, fallback: number): number {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] !== undefined ? Number(process.argv[i + 1]) : fallback;
}
const lines = arg('--lines', 130);
const code = arg('--exit', 0);
for (let i = 1; i <= lines; i++) console.log(`verifier line ${i} of ${lines}`);
process.exit(code);
