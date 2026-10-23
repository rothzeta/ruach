#!/usr/bin/env bun
// OPERATOR-RUN helper: sign in to the seven task-private native roots, one after another, as the owner.
// It only spawns the installed `claude auth login` / `codex login` interactively in each isolated root and then asks the
// matching status command for one redacted boolean. It never reads, copies or prints credential files, never touches
// the real account roots, never starts a model task, and never answers a trust or permission dialog for you.
//   bun owner-login.ts --list                 print every root and the exact commands, run nothing
//   bun owner-login.ts --status               redacted logged-in true/false per root, no login
//   bun owner-login.ts                        interactive login for each root that is not yet logged in
//   bun owner-login.ts --only claude-plugin   one root (names below); repeat --only for several
//   Codex only: --device-auth                 use the device-code flow instead of the browser flow
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync } from 'node:fs';

const L = '/tmp/ruach-implementation-20261011/live';
type Root = { name: string; kind: 'claude' | 'codex'; rows: string; dir: string };
const ROOTS: Root[] = [
  { name: 'claude-plugin', kind: 'claude', rows: 'R1-S Claude plugin native agent', dir: `${L}/roots/claude-plugin` },
  { name: 'claude-adapter', kind: 'claude', rows: 'R1-S Claude snapshot adapter', dir: `${L}/roots/claude-adapter` },
  { name: 'claude-skills-cli', kind: 'claude', rows: 'R1-S Claude Skills CLI', dir: `${L}/roots/claude-skills-cli` },
  { name: 'r3-claude', kind: 'claude', rows: 'R3 cases 01, 02, 03 (shared root)', dir: `${L}/roots/r3-claude` },
  { name: 'enoch-claude', kind: 'claude', rows: 'Enoch exercise', dir: `${L}/roots/enoch-claude` },
  { name: 'codex-snapshot', kind: 'codex', rows: 'R1-S Codex snapshot', dir: `${L}/roots/codex-snapshot` },
  { name: 'codex-skills-cli', kind: 'codex', rows: 'R1-S Codex Skills CLI', dir: `${L}/roots/codex-skills-cli` },
];
const KEEP = ['PATH', 'TERM', 'LANG', 'LC_ALL', 'DISPLAY', 'WAYLAND_DISPLAY', 'BROWSER', 'XAUTHORITY', 'DBUS_SESSION_BUS_ADDRESS', 'XDG_RUNTIME_DIR'];
function childEnv(r: Root): Record<string, string> {
  const env: Record<string, string> = {};
  for (const k of KEEP) if (process.env[k] !== undefined) env[k] = process.env[k]!;
  env.HOME = `${r.dir}/home`; env.XDG_CONFIG_HOME = `${r.dir}/xdg`; env.XDG_CACHE_HOME = `${r.dir}/xdg/cache`;
  if (r.kind === 'claude') env.CLAUDE_CONFIG_DIR = `${r.dir}/claude`; else env.CODEX_HOME = `${r.dir}/codex`;
  return env;
}
const loginArgv = (r: Root, device: boolean) => r.kind === 'claude' ? ['claude', 'auth', 'login', '--claudeai'] : ['codex', 'login', ...(device ? ['--device-auth'] : [])];
const statusArgv = (r: Root) => r.kind === 'claude' ? ['claude', 'auth', 'status', '--json'] : ['codex', 'login', 'status'];
function ensure(r: Root) {
  // Private task-local directories only; nothing outside the root is created.
  const dirs = r.kind === 'claude' ? ['home', 'claude', 'xdg'] : ['home', 'codex', 'xdg'];
  mkdirSync(r.dir, { recursive: true, mode: 0o700 }); chmodSync(r.dir, 0o700);
  for (const d of dirs) { mkdirSync(`${r.dir}/${d}`, { recursive: true, mode: 0o700 }); chmodSync(`${r.dir}/${d}`, 0o700); }
}
/** One redacted boolean. The raw status output is parsed here and discarded, never printed or stored. */
function loggedIn(r: Root): boolean | null {
  const res = spawnSync(statusArgv(r)[0], statusArgv(r).slice(1), { env: childEnv(r), encoding: 'utf8', timeout: 30000 });
  const out = `${res.stdout ?? ''}`;
  if (r.kind === 'claude') { try { return JSON.parse(out).loggedIn === true; } catch { return null; } }
  if (/not logged in/i.test(out + (res.stderr ?? ''))) return false;
  return res.status === 0 && /logged in/i.test(out) ? true : null;
}
const args = process.argv.slice(2);
const only = args.flatMap((a, i) => a === '--only' ? [args[i + 1]] : []);
const device = args.includes('--device-auth');
const roots = only.length ? ROOTS.filter(r => only.includes(r.name)) : ROOTS;
if (only.length && roots.length !== new Set(only).size) { console.error('Unknown root name. Valid: ' + ROOTS.map(r => r.name).join(', ')); process.exit(2); }
if (args.includes('--list')) {
  for (const r of roots) console.log(`${r.name} (${r.rows})\n  env: ${Object.entries(childEnv(r)).filter(([k]) => /HOME|CONFIG|XDG_/.test(k)).map(([k, v]) => `${k}=${v}`).join(' ')}\n  login: ${loginArgv(r, device).join(' ')}\n  status: ${statusArgv(r).join(' ')} (only the logged-in true/false is reported)`);
  process.exit(0);
}
let pending = 0;
for (const r of roots) {
  ensure(r);
  let state = loggedIn(r);
  if (!args.includes('--status') && state !== true) {
    console.log(`\n=== ${r.name}: ${r.rows} ===\nSign in with the account you want this root to use. ${r.kind === 'claude' ? 'Claude' : 'Codex'} prints its own instructions.`);
    const [cmd, ...rest] = loginArgv(r, device);
    spawnSync(cmd, rest, { env: childEnv(r), stdio: 'inherit' });
    state = loggedIn(r);
  }
  console.log(`${r.name}: logged in = ${state === null ? 'unknown' : state}`);
  if (state !== true) pending++;
}
console.log(pending ? `\n${pending} root(s) still not logged in.` : '\nAll selected roots report logged in = true. No model task was started.');
process.exit(pending ? 1 : 0);
