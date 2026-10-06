import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

function atLeast(version: string, floor: string): boolean {
  const a = version.split(".").map(Number);
  const b = floor.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

// Minimum patched versions for published advisories (A2).
const floors: Record<string, string> = { ws: "8.21.0", yaml: "2.8.3" };

// Packages each skill must lock; a missing entry fails rather than skipping.
const expected: Record<string, string[]> = { "ruach-herdr": ["ws", "yaml"], "ruach-handoff": ["yaml"] };

for (const skill of Object.keys(expected)) {
  test(`${skill} lockfile resolves patched dependency versions`, () => {
    const lock = readFileSync(join(root, "skills", skill, "bun.lock"), "utf8");
    for (const [name, floor] of Object.entries(floors).filter(([name]) => expected[skill].includes(name))) {
      const match = lock.match(new RegExp(`"${name}": \\["${name}@(\\d+\\.\\d+\\.\\d+)"`));
      expect(match, `${name} must appear in ${skill}/bun.lock`).not.toBeNull();
      expect(atLeast(match![1], floor)).toBe(true);
    }
  });
}
