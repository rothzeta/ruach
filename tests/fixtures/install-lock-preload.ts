// Test-only Bun preload: pause the installer at the filesystem boundary where it takes the staging lock.
// It only schedules a race; all filesystem behavior stays real and no product result is supplied.
import { mock } from 'bun:test';
import * as live from 'node:fs';
import { basename, join } from 'node:path';

// mock.module rewrites the live namespace, so keep the real functions before replacing it.
const real = { ...live };
const directory = process.env.RUACH_INSTALL_BARRIER_DIR, deadline = Number(process.env.RUACH_INSTALL_BARRIER_MS ?? 20000);
function pause() {
  real.writeFileSync(join(directory!, 'reached'), '');
  const end = Date.now() + deadline;
  while (!real.existsSync(join(directory!, 'release'))) {
    if (Date.now() > end) throw new Error('Install barrier deadline exceeded');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
  }
}
let paused = false;
mock.module('node:fs', () => ({
  ...real,
  default: real,
  mkdirSync(path: any, options?: any) {
    if (directory && !paused && options === undefined && typeof path === 'string' && basename(path) === '.ruach-staging') { paused = true; pause(); }
    return real.mkdirSync(path, options);
  },
}));
