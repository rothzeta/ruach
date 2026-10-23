// Consumer-owned recording stub for the relay host. Read-only except for appending requested actions to
// intents.jsonl. It never starts, stops or prompts a real worker and supplies no recommended action.
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
const ACTIONS = new Set(['prompt', 'send-keys', 'wait', 'launch', 'stop', 'read']);
const [command, target, ...note] = process.argv.slice(2);

if (command === 'facts') {
  for (const file of readdirSync(join(root, 'observations')).filter(f => f.endsWith('.json')).sort())
    console.log(readFileSync(join(root, 'observations', file), 'utf8').trim());
} else if (command && ACTIONS.has(command) && target) {
  appendFileSync(join(root, 'intents.jsonl'), JSON.stringify({ command, target, note: note.join(' ') }) + '\n');
  console.log(`recorded request: ${command} ${target} (no real worker was started, stopped or prompted)`);
} else {
  console.error('usage: bun app/record-state.ts facts | prompt|send-keys|wait|launch|stop|read <target> [note]');
  process.exit(2);
}
