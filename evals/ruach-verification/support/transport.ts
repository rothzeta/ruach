import { closeSync, openSync, readFileSync } from 'node:fs';

export interface Capture {
  /** The verifier's own exit status; -1 when it had to be killed on timeout. */
  exit: number;
  signal: string | null;
  timedOut: boolean;
  /** The complete retained log. */
  log: string;
  /** The bounded prefix a viewer may display. */
  displayed: string;
  /** The displayed prefix always exists, so the viewer status is trivially 0 and means nothing. */
  viewerExit: number;
}

// Correct pattern: redirect the verifier's full output to a retained log, await its real exit,
// capture that exit, then display a bounded prefix. The viewer status is separate and is never
// the pass criterion. A log that cannot be opened throws before the verifier is attributed a result.
export async function captureVerifier(argv: string[], logPath: string, displayLines = 120, timeoutMs = 8000): Promise<Capture> {
  const fd = openSync(logPath, 'w');
  const proc = Bun.spawn(argv, { stdout: fd, stderr: fd, stdin: 'ignore', detached: true });
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; try { process.kill(-proc.pid, 'SIGKILL'); } catch {} }, timeoutMs);
  try {
    const exit = await proc.exited;
    closeSync(fd);
    const log = readFileSync(logPath, 'utf8');
    const lines = log.split('\n');
    const displayed = lines.slice(0, displayLines).join('\n');
    return { exit: timedOut ? -1 : exit, signal: proc.signalCode ?? null, timedOut, log, displayed, viewerExit: 0 };
  } finally { clearTimeout(timer); try { process.kill(-proc.pid, 'SIGKILL'); } catch {} }
}

function shellQuote(arg: string): string {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

export interface NaiveResult {
  /** Exit status of the last pipeline stage (the viewer); 0 does not mean the verifier passed. */
  viewerExit: number;
  /** The verifier's real exit status, recovered only via PIPESTATUS immediately after the pipeline. */
  verifierExit: number;
  displayed: string;
}

// Naive pattern under test: pipe the verifier into `head`. An early closed pipe can change the
// verifier's own result, and the pipeline exit (0) belongs to the viewer, not the verifier.
export function naivePipeline(argv: string[], displayLines = 120): NaiveResult {
  const cmd = `${argv.map(shellQuote).join(' ')} | head -n ${displayLines}\n__st=("\${PIPESTATUS[@]}")\nprintf '\\n__VERIFIER_EXIT__:%s__VIEWER_EXIT__:%s\\n' "\${__st[0]}" "\${__st[1]}"`;
  const r = Bun.spawnSync(['bash', '-c', cmd], { stdout: 'pipe', stderr: 'pipe' });
  const out = r.stdout.toString();
  const m = out.match(/__VERIFIER_EXIT__:(\d+)__VIEWER_EXIT__:(\d+)/);
  const displayed = out.replace(/\n__VERIFIER_EXIT__:\d+__VIEWER_EXIT__:\d+\n?$/, '');
  return { viewerExit: m ? Number(m[2]) : r.exitCode, verifierExit: m ? Number(m[1]) : -1, displayed };
}
