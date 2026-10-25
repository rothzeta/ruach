import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export async function terminalRequest(root: string, data: Record<string, unknown>): Promise<any> {
  const info = join(root, 'terminal-host.json');
  if (!existsSync(info)) {
    const child = Bun.spawn([process.execPath, join(import.meta.dir, 'terminal-host.ts'), root], {
      stdin: 'ignore', stdout: 'ignore', stderr: 'ignore', detached: true,
    });
    child.unref();
    const deadline = Date.now() + 3000;
    while (!existsSync(info) && Date.now() < deadline) await Bun.sleep(10);
    if (!existsSync(info)) {
      child.kill('SIGKILL');
      throw new Error('Fixture terminal daemon did not start');
    }
  }
  const response = await fetch('http://localhost/terminal', {
    unix: join(root, 'terminal.sock'),
    method: 'POST',
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Fixture terminal operation failed');
  return await response.json();
}

export async function closeTerminal(root: string) {
  const info = join(root, 'terminal-host.json');
  if (!existsSync(info)) return;
  try {
    await terminalRequest(root, { operation: 'close' });
  } catch {
    const { pid } = JSON.parse(readFileSync(info, 'utf8'));
    try { process.kill(pid, 'SIGKILL'); } catch {}
  }
}
