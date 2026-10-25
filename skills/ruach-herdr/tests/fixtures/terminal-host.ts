// A fixture daemon holds one real Bash/PTY across separate fake Herdr CLI calls.
// It models terminal transport only; all native programs are harmless recorders.
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { BashTerminal } from './terminal-start';

const root = process.argv[2];
let terminal: BashTerminal | undefined;
const server = Bun.serve({
  unix: join(root, 'terminal.sock'),
  async fetch(request) {
    const data = await request.json() as {
      operation: string;
      cwd: string;
      env: Record<string, string>;
      rcfile?: string;
      command: string;
      marker: string;
      argv: string[];
      observedFile: string;
      pane: string;
    };
    try {
      if (data.operation === 'close') {
        await terminal?.close();
        terminal = undefined;
        setTimeout(() => { server.stop(true); process.exit(0); }, 20);
        return Response.json({ ok: true });
      }
      terminal ??= new BashTerminal(data.cwd, { ...data.env, FIXTURE_NATIVE_HOLD: '1' }, data.rcfile);
      if (data.operation === 'run') await terminal.run(data.command);
      else if (data.operation === 'wait') await terminal.waitFor(data.marker);
      else if (data.operation === 'start') return Response.json(await terminal.start(data.argv, data.observedFile));
      else if (data.operation === 'process-info') return Response.json(terminal.processInfo(data.pane));
      return Response.json({ ok: true });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  },
});
writeFileSync(join(root, 'terminal-host.json'), JSON.stringify({ pid: process.pid }), { mode: 0o600 });
