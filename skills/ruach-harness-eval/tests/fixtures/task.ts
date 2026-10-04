import { dirname } from 'node:path';
if (process.argv.length !== 2) {
  process.stderr.write('usage: task\n');
  process.exit(7);
}
process.stdout.write(`${dirname(import.meta.path)}\n`);
