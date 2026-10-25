import { readFileSync } from 'node:fs';

// Private argv.json is written only after canonical preparation. Replace this
// bootstrap in the same terminal/process group; no intermediary owns readiness.
try {
  const data = JSON.parse(readFileSync(process.argv[2], 'utf8')) as {
    executable: string;
    argv: string[];
    path: string | null;
  };
  const env = { ...process.env };
  if (data.path === null) delete env.PATH;
  else env.PATH = data.path;
  process.execve!(data.executable, data.argv, env);
} catch {
  console.error('Native bootstrap could not execute the prepared process; inspect the existing launch space.');
  process.exitCode = 1;
}
