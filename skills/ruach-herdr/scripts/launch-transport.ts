import { delimiter, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fail } from './contracts';

// Leave room below the observed 4095-byte canonical-input boundary, including
// shell quoting. This chooses a transport, not a limit on valid native argv.
export function needsBootstrap(kind: string, argv: string[]): boolean {
  const quotedBytes = argv.reduce((size, arg) => {
    return size + Buffer.byteLength(arg) + (arg.match(/'/g)?.length ?? 0) * 4 + 3;
  }, Buffer.byteLength(kind));
  return quotedBytes > 3000;
}

export function verifyBootstrapRuntime(kind: string, argv: string[], temporaryRoot: string) {
  if (!needsBootstrap(kind, argv)) return;
  if (typeof process.execve !== 'function') {
    fail(3, 'unsupported_runtime', 'Large native argv requires Bun process.execve support', 'Bun');
  }
  if (temporaryRoot.includes(delimiter)) {
    fail(2, 'invalid_transport_directory', 'Large native argv requires a temporary directory without the PATH delimiter', 'temp-dir');
  }
}

export async function materializeBootstrap(
  temporary: string,
  executable: string,
  kind: string,
  argv: string[],
  nativePath: string | undefined,
): Promise<string> {
  const directory = join(temporary, 'bootstrap');
  await mkdir(directory, { mode: 0o700 });
  const payload = join(directory, 'argv.json');
  await writeFile(payload, JSON.stringify({ executable, argv: [kind, ...argv], path: nativePath ?? null }), {
    mode: 0o600,
    flag: 'wx',
  });
  // Only filesystem paths enter this tiny shell script. Native/user text stays
  // JSON data and is passed to execve without shell parsing or evaluation.
  const quote = (path: string) => "'" + path.replaceAll("'", "'\\''") + "'";
  const helper = fileURLToPath(new URL('./native-launch.ts', import.meta.url));
  const script = `#!/bin/sh\nexec ${[process.execPath, helper, payload].map(quote).join(' ')}\n`;
  await writeFile(join(directory, kind), script, { mode: 0o700, flag: 'wx' });
  return nativePath === undefined ? directory : directory + delimiter + nativePath;
}
