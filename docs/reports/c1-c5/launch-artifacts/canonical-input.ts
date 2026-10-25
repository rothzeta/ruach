import { createHash } from 'node:crypto';

// Harmless reproduction of the physical input boundary, without a native agent.
// This deliberately leaves the terminal's canonical line limit unchanged.
const input = Buffer.from('a'.repeat(6000) + '\n');
let received = Buffer.alloc(0);
let complete!: () => void;
const line = new Promise<void>((resolve) => { complete = resolve; });
const child = Bun.spawn(['/bin/cat'], {
  terminal: {
    data(_terminal, bytes) {
      received = Buffer.concat([received, Buffer.from(bytes)]);
      if (received.includes(10)) complete();
    },
  },
});
let timer: ReturnType<typeof setTimeout> | undefined;
try {
  if (!(child.terminal!.localFlags & 2)) throw new Error('ICANON is required');
  child.terminal!.localFlags &= ~8; // Disable echo, so only cat's actual read is observed.
  child.terminal!.write(input);
  await Promise.race([
    line,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Canonical input read timed out')), 3000);
    }),
  ]);
  const actual = received.subarray(0, received.indexOf(10)).filter((byte) => byte !== 13);
  console.log(JSON.stringify({
    platform: process.platform,
    canonical: true,
    inputBytesBeforeNewline: input.length - 1,
    receivedBytesBeforeNewline: actual.length,
    inputSHA256: createHash('sha256').update(input.subarray(0, -1)).digest('hex'),
    receivedSHA256: createHash('sha256').update(actual).digest('hex'),
  }));
} finally {
  clearTimeout(timer);
  child.kill('SIGKILL');
  await child.exited;
  child.terminal?.close();
}
