#!/usr/bin/env bun
// Bounded offline transport probe for the R4 permission fixture.
//   bun evals/ruach-permissions/probe.ts --root <fixture> --case temp|unix|tcp --output <new-evidence-file>
// Each case self-cleans a named scratch subtree, is bounded by its own deadline and closes only the
// listeners/sockets/files it owns. A TCP probe binds 127.0.0.1:0 and records the OS-allocated port; it
// never touches a production port, database, profile or save. The evidence file must be new. Exit 0 on a
// completed probe, 1 on a bounded failure/timeout, 2 on usage error.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, connect } from 'node:net';
import type { NetConnectOpts, Server, Socket } from 'node:net';
import { dirname, join, resolve } from 'node:path';

export type ProbeCase = 'temp' | 'unix' | 'tcp';
export const PROBE_BOUND_MS = 3000;

export interface ProbeResult {
  schema_version: 1;
  case: ProbeCase;
  root: string;
  ok: boolean;
  exit: number;
  timedOut: boolean;
  scratch: string;
  details: Record<string, unknown>;
  limits: string[];
}

/** Reject a promise that has not settled within ms; the caller owns cleanup. */
function deadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((res, rej) => {
    const timer = setTimeout(() => rej(new Error(`deadline ${ms}ms exceeded`)), ms);
    promise.then(v => { clearTimeout(timer); res(v); }, e => { clearTimeout(timer); rej(e); });
  });
}

function listen(server: Server, path: string, host?: string): Promise<void> {
  return new Promise((res, rej) => {
    server.once('error', rej);
    if (host === undefined) server.listen(path, () => res());
    else server.listen(0, host, () => res());
  });
}

function close(server: Server): Promise<void> {
  return new Promise(res => {
    const done = () => res();
    try { server.close(done); } catch { done(); }
    // close() waits for open connections; the caller destroys owned sockets first.
  });
}

/** One request/response round trip; the caller owns the socket via the returned promise. */
function exchange(target: NetConnectOpts, payload: string, owned: Socket[]): Promise<string> {
  return new Promise((res, rej) => {
    const socket = connect(target);
    owned.push(socket);
    let data = '';
    socket.setEncoding('utf8');
    socket.once('connect', () => socket.write(payload));
    socket.on('data', chunk => { data += chunk; if (data.length >= payload.length) socket.end(); });
    socket.once('end', () => res(data));
    socket.once('error', rej);
  });
}

/** Run one probe case under the fixture root. The scratch subtree is removed before returning. */
export async function probe(options: { root: string; case: ProbeCase }): Promise<ProbeResult> {
  const root = resolve(options.root);
  if (!existsSync(root)) throw new Error(`fixture root does not exist: ${root}`);
  const scratch = join(root, `probe-scratch-${process.pid}`);
  rmSync(scratch, { recursive: true, force: true });
  mkdirSync(scratch, { recursive: true });
  const details: Record<string, unknown> = { scratch_created: true, scratch_files: [] as string[] };
  let server: Server | null = null;
  const sockets: Socket[] = [];
  let ok = false, timedOut = false, exit = 1;
  try {
    await deadline((async () => {
      if (options.case === 'temp') {
        const file = join(scratch, 'scratch.txt');
        writeFileSync(file, 'probe-temp-payload');
        const readback = readFileSync(file, 'utf8');
        if (readback !== 'probe-temp-payload') throw new Error('temp readback mismatch');
        details.temp_roundtrip = true;
      } else if (options.case === 'unix') {
        const sock = join(scratch, 'probe.sock');
        server = createServer(socket => { socket.end('pong'); });
        await listen(server, sock);
        const reply = await exchange({ path: sock }, 'ping', sockets);
        if (reply !== 'pong') throw new Error(`unix reply mismatch: ${JSON.stringify(reply)}`);
        details.socket_path = sock;
        details.unix_roundtrip = true;
      } else if (options.case === 'tcp') {
        server = createServer(socket => { socket.end('pong'); });
        await listen(server, 'unused', '127.0.0.1');
        const address = server.address();
        if (!address || typeof address === 'string') throw new Error('tcp listener did not allocate a port');
        details.port = address.port;
        const reply = await exchange({ host: '127.0.0.1', port: address.port }, 'ping', sockets);
        if (reply !== 'pong') throw new Error(`tcp reply mismatch: ${JSON.stringify(reply)}`);
        details.tcp_roundtrip = true;
      } else {
        throw new Error(`unknown probe case: ${String(options.case)}`);
      }
    })(), PROBE_BOUND_MS);
    ok = true; exit = 0;
  } catch (error: any) {
    timedOut = /deadline/.test(String(error?.message));
    details.error = String(error?.message ?? error);
  } finally {
    // Destroy only the sockets this probe opened, then close the listener, then unlink the socket path.
    for (const socket of sockets) { try { socket.destroy(); } catch {} }
    if (server) { try { await deadline(close(server), PROBE_BOUND_MS); } catch {} }
    try { rmSync(join(scratch, 'probe.sock'), { force: true }); } catch {}
    rmSync(scratch, { recursive: true, force: true });
    details.scratch_removed = !existsSync(scratch);
  }
  const result: ProbeResult = {
    schema_version: 1,
    case: options.case,
    root,
    ok,
    exit,
    timedOut,
    scratch,
    details,
    limits: [
      'Probe result is evidence for the permissions this process ran with; it is not native sandbox or approval proof.',
      'TCP binds 127.0.0.1 port 0 only; the OS-allocated port is closed by this probe.',
    ],
  };
  return result;
}

if (import.meta.main) {
  const argv = process.argv;
  const value = (name: string) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const rootArg = value('--root'), caseArg = value('--case') as ProbeCase | undefined, output = value('--output');
  if (!rootArg || !caseArg || !output) { console.error('usage: bun evals/ruach-permissions/probe.ts --root <fixture> --case temp|unix|tcp --output <new-evidence-file>'); process.exit(2); }
  if (!['temp', 'unix', 'tcp'].includes(caseArg)) { console.error(`unknown case: ${caseArg}`); process.exit(2); }
  if (existsSync(output)) { console.error(`output path must be new: ${output}`); process.exit(2); }
  try {
    const result = await probe({ root: rootArg, case: caseArg });
    mkdirSync(dirname(resolve(output)), { recursive: true });
    writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify({ ok: result.ok, exit: result.exit, case: result.case, port: (result.details as any).port ?? null, timedOut: result.timedOut }));
    process.exitCode = result.ok ? 0 : 1;
  } catch (error: any) { console.error(error.message); process.exit(2); }
}
