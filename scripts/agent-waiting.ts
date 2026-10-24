#!/usr/bin/env bun
// Ruach's consumer entry point shares the canonical watcher and its operational journal.
// Run under the operator's supervisor in the existing Herdr/native environment.
import { main } from '../skills/ruach-herdr/scripts/waiting';

export { main };

if (import.meta.main) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`Ruach waiting failed: ${error.message}`);
    process.exitCode = 1;
  });
}
