import { join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { contents, fail, identifier } from './contracts';
import { run } from './process';

export interface Bootstrap {
  command: string;
  marker: string;
  receipt: string;
  nonce: string;
  payloadHash: string;
}

const quote = (path: string) => "'" + path.replaceAll("'", "'\\''") + "'";

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
  const setup = join(temporaryRoot, 'ruach-herdr-XXXXXXXX', 'bootstrap', 'setup.sh');
  if (Buffer.byteLength('. ' + quote(setup)) > 3000) {
    fail(2, 'invalid_transport_directory', 'Private setup path is too long for safe terminal submission', 'temp-dir');
  }
}

export async function verifyBootstrapCapabilities(herdr: string, cwd: string) {
  for (const [command, required] of [
    ['run', ['<PANE_ID>', '<COMMAND>']],
    ['wait-output', ['--match', '--timeout']],
    ['process-info', ['--pane']],
  ] as const) {
    const result = await run([herdr, 'pane', command, '--help'], cwd);
    if (result.exit !== 0 || result.timedOut || required.some(flag => !result.stdout.includes(flag))) {
      fail(3, 'unsupported_herdr_transport', 'Required post-initialization launch primitives are unavailable', 'herdr');
    }
  }
}

export async function materializeBootstrap(
  temporary: string,
  executable: string,
  kind: string,
  argv: string[],
  nativePath: string | undefined,
  nativeEnvironment: Record<string, string> = {},
): Promise<Bootstrap> {
  identifier(kind, 'kind');
  const directory = join(temporary, 'bootstrap');
  await mkdir(directory, { mode: 0o700 });
  const payload = join(directory, 'argv.json');
  const nonce = randomUUID();
  const data = JSON.stringify({
    executable,
    argv: [kind, ...argv],
    path: nativePath ?? null,
    environment: nativeEnvironment,
    nonce,
  });
  await writeFile(payload, data, {
    mode: 0o600,
    flag: 'wx',
  });
  // Only filesystem paths enter this tiny shell script. Native/user text stays
  // JSON data and is passed to execve without shell parsing or evaluation.
  const helper = fileURLToPath(new URL('./native-launch.ts', import.meta.url));
  const script = `#!/bin/sh\nexec ${[process.execPath, helper, payload].map(quote).join(' ')}\n`;
  const executableScript = join(directory, kind);
  await writeFile(executableScript, script, { mode: 0o700, flag: 'wx' });
  const marker = `ruach-bootstrap-${nonce}`;
  const setup = join(directory, 'setup.sh');
  // Sourced only after shell initialization. The quoted canonical command used
  // by Herdr resolves this function ahead of PATH; native data never enters it.
  await writeFile(setup, `${kind}() {\n  ${quote(executableScript)}\n}\nprintf '\\n%s\\n' ${quote(marker)}\n`, {
    mode: 0o600,
    flag: 'wx',
  });
  return {
    command: '. ' + quote(setup),
    marker,
    receipt: join(directory, 'executed.json'),
    nonce,
    payloadHash: createHash('sha256').update(data).digest('hex'),
  };
}

export async function bindBootstrap(herdr: string, pane: string, cwd: string, bootstrap: Bootstrap) {
  const setup = await run([herdr, 'pane', 'run', pane, bootstrap.command], cwd);
  if (setup.exit !== 0 || setup.timedOut) {
    fail(4, 'bootstrap_uncertain', 'Private shell binding submission is uncertain; inspect the existing pane', 'transport');
  }
  // Marker is in the private sourced file, never in echoed command text.
  const confirmed = await run([herdr, 'pane', 'wait-output', pane, '--match', bootstrap.marker, '--timeout', '5000'], cwd);
  let response: any;
  try { response = JSON.parse(confirmed.stdout); } catch {}
  if (confirmed.exit !== 0 || confirmed.timedOut || response?.error || response?.result?.pane_id !== pane ||
      !response.result.matched_line?.includes(bootstrap.marker)) {
    fail(4, 'bootstrap_uncertain', 'Private shell binding was not confirmed; no native startup submitted', 'transport');
  }
}

export async function confirmBootstrap(herdr: string, pane: string, cwd: string, bootstrap: Bootstrap) {
  let receipt: any;
  try { receipt = JSON.parse(await contents(bootstrap.receipt)); } catch {}
  if (receipt?.nonce !== bootstrap.nonce || receipt?.payloadHash !== bootstrap.payloadHash ||
      !Number.isSafeInteger(receipt?.pid) || receipt.pid <= 0) {
    fail(4, 'bootstrap_unconfirmed', 'Prepared native payload execution is unconfirmed; inspect the existing launch', 'transport');
  }
  const observed = await run([herdr, 'pane', 'process-info', '--pane', pane], cwd);
  let info: any;
  try { info = JSON.parse(observed.stdout).result?.process_info; } catch {}
  if (observed.exit !== 0 || observed.timedOut || info?.pane_id !== pane ||
      info.foreground_process_group_id !== receipt.pid ||
      !info.foreground_processes?.some((process: any) => process.pid === receipt.pid)) {
    fail(4, 'bootstrap_unconfirmed', 'Prepared process does not match the pane foreground group; inspect the existing launch', 'transport');
  }
}
