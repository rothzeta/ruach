import { existsSync, readFileSync } from 'node:fs';

// Model the actual shell input boundary, not a direct native spawn. --noediting
// leaves ICANON enabled, where a long physical line can be discarded by the PTY.
export class BashTerminal {
  private output = '';
  private observedFile?: string;
  private proc: Bun.Subprocess;

  constructor(cwd: string, env: Record<string, string | undefined>, rcfile?: string) {
    this.proc = Bun.spawn([
      '/bin/bash', '--noprofile', ...(rcfile ? ['--rcfile', rcfile] : ['--norc']), '--noediting', '-i',
    ], {
      cwd,
      env: { ...env, PS1: 'RUACH_TERMINAL_READY> ', PS2: 'RUACH_CONTINUATION> ' },
      terminal: {
        data: (_terminal, bytes) => { this.output += Buffer.from(bytes).toString('utf8'); },
      },
    });
  }

  async waitFor(marker: string) {
    const deadline = Date.now() + 3000;
    while (!this.output.includes(marker) && Date.now() < deadline) await Bun.sleep(10);
    if (!this.output.includes(marker)) throw new Error('Expected terminal output was not observed');
  }

  async run(command: string) {
    await this.waitFor('RUACH_TERMINAL_READY> ');
    if (!(this.proc.terminal!.localFlags & 2)) throw new Error('PTY prerequisite: ICANON is disabled');
    this.proc.terminal!.write(command + '\n');
  }

  async start(command: string[], observedFile: string) {
    this.observedFile = observedFile;
    // This is fixture shell serialization only. The byte oracle is the native
    // process's recorded arguments, compared with independently authored inputs.
    const line = command.map((arg) => "'" + arg.replaceAll("'", "'\\''") + "'").join(' ');
    await this.run(line);
    const deadline = Date.now() + 3000;
    while (!existsSync(observedFile) && Date.now() < deadline) {
      await Bun.sleep(10);
    }
    return {
      observed: existsSync(observedFile),
      canonical: true,
      submittedBytes: Buffer.byteLength(line),
      continuation: this.output.includes('RUACH_CONTINUATION> '),
    };
  }

  processInfo(pane: string) {
    const native = this.observedFile && existsSync(this.observedFile)
      ? JSON.parse(readFileSync(this.observedFile, 'utf8').trim().split('\n').at(-1)!)
      : undefined;
    const group = Bun.spawnSync(['/bin/ps', '-o', 'tpgid=', '-p', String(this.proc.pid)]);
    return {
      pane_id: pane,
      shell_pid: this.proc.pid,
      foreground_process_group_id: Number(group.stdout.toString().trim()),
      foreground_processes: native ? [{ pid: native.pid, name: 'fixture-native' }] : [],
    };
  }

  async close() {
    const info = this.processInfo('fixture');
    for (const process of info.foreground_processes) {
      // Only the native child recorded by this fixture, never an arbitrary group.
      try { globalThis.process.kill(process.pid, 'SIGKILL'); } catch {}
    }
    this.proc.kill('SIGKILL');
    await this.proc.exited;
    this.proc.terminal?.close();
  }
}

export async function terminalStart(
  command: string[],
  cwd: string,
  env: Record<string, string | undefined>,
  observedFile: string,
  rcfile?: string,
  prelude?: { command: string; marker: string },
) {
  const terminal = new BashTerminal(cwd, env, rcfile);
  try {
    if (prelude) {
      await terminal.run(prelude.command);
      await terminal.waitFor(prelude.marker);
    }
    return await terminal.start(command, observedFile);
  } finally {
    await terminal.close();
  }
}
