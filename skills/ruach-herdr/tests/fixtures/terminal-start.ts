import { existsSync } from 'node:fs';

// Model the actual shell input boundary, not a direct native spawn. --noediting
// leaves ICANON enabled, where a long physical line can be discarded by the PTY.
export async function terminalStart(
  command: string[],
  cwd: string,
  env: Record<string, string | undefined>,
  observedFile: string,
) {
  let output = '';
  let ready!: () => void;
  const prompt = new Promise<void>((resolve) => { ready = resolve; });
  const proc = Bun.spawn(['/bin/bash', '--noprofile', '--norc', '--noediting', '-i'], {
    cwd,
    env: { ...env, PS1: 'RUACH_TERMINAL_READY> ', PS2: 'RUACH_CONTINUATION> ' },
    terminal: {
      data(_terminal, bytes) {
        output += Buffer.from(bytes).toString('utf8');
        if (output.includes('RUACH_TERMINAL_READY> ')) ready();
      },
    },
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      prompt,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('PTY shell did not become ready')), 3000);
      }),
    ]);
    clearTimeout(timer);
    if (!(proc.terminal!.localFlags & 2)) throw new Error('PTY prerequisite: ICANON is disabled');
    // This is fixture shell serialization only. The byte oracle is the native
    // process's recorded arguments, compared with independently authored inputs.
    const line = command.map((arg) => "'" + arg.replaceAll("'", "'\\''") + "'").join(' ');
    proc.terminal!.write(line + '\n');
    const deadline = Date.now() + 3000;
    while (!existsSync(observedFile) && Date.now() < deadline) {
      await Bun.sleep(10);
    }
    return {
      observed: existsSync(observedFile),
      canonical: true,
      submittedBytes: Buffer.byteLength(line),
      continuation: output.includes('RUACH_CONTINUATION> '),
    };
  } finally {
    clearTimeout(timer);
    proc.kill('SIGKILL');
    await proc.exited;
    proc.terminal?.close();
  }
}
