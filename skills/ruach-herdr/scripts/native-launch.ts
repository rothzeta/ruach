import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

// Private argv.json is written only after canonical preparation. Replace this
// bootstrap in the same terminal/process group; no intermediary owns readiness.
let receipt: string | undefined;
let receiptWritten = false;
try {
  const payload = readFileSync(process.argv[2], 'utf8');
  const data = JSON.parse(payload) as {
    executable: string;
    argv: string[];
    path: string | null;
    environment: Record<string, string>;
    nonce: string;
  };
  const env = { ...process.env, ...data.environment };
  if (data.path === null) delete env.PATH;
  else env.PATH = data.path;
  receipt = join(dirname(process.argv[2]), 'executed.json');
  writeFileSync(receipt, JSON.stringify({
    nonce: data.nonce,
    payloadHash: createHash('sha256').update(payload).digest('hex'),
    pid: process.pid,
  }), { mode: 0o600, flag: 'wx' });
  receiptWritten = true;
  process.execve!(data.executable, data.argv, env);
} catch {
  if (receiptWritten && receipt) {
    try { unlinkSync(receipt); } catch {}
  }
  console.error('Native bootstrap could not execute the prepared process; inspect the existing launch space.');
  process.exitCode = 1;
}
