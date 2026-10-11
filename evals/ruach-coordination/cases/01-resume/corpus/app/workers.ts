// Consumer-owned worker control stub for the tidepool host. Read-only except for appending requested
// actions to intents.jsonl. It never starts, stops or launches a real worker.
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const root = join(import.meta.dir, '..');
const [command, unit, ...note] = process.argv.slice(2);
if (command === 'status') {
  for (const file of readdirSync(join(root, 'observations')).filter(f => /^(feed|chart)\.json$/.test(f)).sort())
    console.log(readFileSync(join(root, 'observations', file), 'utf8').trim());
} else if (['submit', 'stop', 'launch'].includes(command ?? '') && unit) {
  appendFileSync(join(root, 'intents.jsonl'), JSON.stringify({ command, unit, note: note.join(' ') }) + '\n');
  console.log(`recorded request: ${command} ${unit} (no worker was started or stopped)`);
} else {
  console.error('usage: bun app/workers.ts status | submit|stop|launch <unit> [note]');
  process.exit(2);
}
