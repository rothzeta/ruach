#!/usr/bin/env bun
// OPERATOR-RUN helper (version 2): sign in to the seven task-private native roots, one after another, as the owner.
// It spawns only the installed `claude auth login` / `codex login` interactively in each isolated root, then asks the
// matching status command and reports one redacted boolean. It never reads, copies or prints credential files, never
// touches the real account roots, never starts a model task, and never answers a trust or permission dialog for you.
//   bun owner-login.ts --list                 print every root and the exact commands; run nothing, create nothing
//   bun owner-login.ts --status               redacted logged-in true/false per root; creates nothing
//   bun owner-login.ts                        interactive login for each root that is not yet logged in
//   bun owner-login.ts --only claude-plugin   one root (names below); repeat --only for several
//   bun owner-login.ts --device-auth          Codex roots use the device-code flow instead of the browser flow
// Anything else is rejected with exit 2 before any directory is created or any CLI is started.
// Codex account storage is pinned to the root with `-c cli_auth_credentials_store="file"` on login and status, so
// credentials land in that root's CODEX_HOME and not in an inherited system keyring.
// The native clients themselves may write their own runtime state (cache, logs, config) inside the same root.
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync } from 'node:fs';

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
// Only these inherited variables reach a child. Token, API-key and nested-harness variables are never in this list.
// Proxy and certificate variables are transport settings; their values are never printed.
const KEEP = ['PATH', 'TERM', 'LANG', 'LC_ALL', 'DISPLAY', 'WAYLAND_DISPLAY', 'BROWSER', 'XAUTHORITY', 'DBUS_SESSION_BUS_ADDRESS', 'XDG_RUNTIME_DIR',
  'HTTPS_PROXY', 'HTTP_PROXY', 'ALL_PROXY', 'NO_PROXY', 'https_proxy', 'http_proxy', 'all_proxy', 'no_proxy', 'SSL_CERT_FILE', 'SSL_CERT_DIR', 'NODE_EXTRA_CA_CERTS'];
function childEnv(r: Root): Record<string, string> {
  const env: Record<string, string> = {};
  for (const k of KEEP) if (process.env[k] !== undefined) env[k] = process.env[k]!;
  env.HOME = `${r.dir}/home`; env.XDG_CONFIG_HOME = `${r.dir}/xdg`; env.XDG_CACHE_HOME = `${r.dir}/xdg/cache`;
  if (r.kind === 'claude') env.CLAUDE_CONFIG_DIR = `${r.dir}/claude`; else env.CODEX_HOME = `${r.dir}/codex`;
  return env;
}
const STORE = 'cli_auth_credentials_store="file"';
const loginArgv = (r: Root, device: boolean) => r.kind === 'claude' ? ['claude', 'auth', 'login', '--claudeai'] : ['codex', 'login', '-c', STORE, ...(device ? ['--device-auth'] : [])];
const statusArgv = (r: Root) => r.kind === 'claude' ? ['claude', 'auth', 'status', '--json'] : ['codex', 'login', 'status', '-c', STORE];
const subdirs = (r: Root) => r.kind === 'claude' ? ['home', 'claude', 'xdg'] : ['home', 'codex', 'xdg'];
function ensure(r: Root) {
  // Login mode only: private task-local directories, nothing outside the root.
  mkdirSync(r.dir, { recursive: true, mode: 0o700 }); chmodSync(r.dir, 0o700);
  for (const d of subdirs(r)) { mkdirSync(`${r.dir}/${d}`, { recursive: true, mode: 0o700 }); chmodSync(`${r.dir}/${d}`, 0o700); }
}
const complete = (r: Root) => subdirs(r).every(d => existsSync(`${r.dir}/${d}`));
/** One redacted boolean (or a short redacted reason). Raw status output is parsed here and discarded, never printed. */
function loggedIn(r: Root): { value: boolean | null; reason?: string } {
  if (!complete(r)) return { value: null, reason: 'root directories missing (nothing created in this mode)' };
  const argv = statusArgv(r);
  const res = spawnSync(argv[0], argv.slice(1), { env: childEnv(r), cwd: `${r.dir}/home`, encoding: 'utf8', timeout: 30000 });
  if (res.error) return { value: null, reason: (res.error as NodeJS.ErrnoException).code === 'ENOENT' ? `${argv[0]} not found on PATH` : (res.error as NodeJS.ErrnoException).code === 'ETIMEDOUT' ? 'status timed out' : 'status could not run' };
  const out = `${res.stdout ?? ''}`;
  if (r.kind === 'claude') { try { return { value: JSON.parse(out).loggedIn === true }; } catch { return { value: null, reason: `status exited ${res.status} without parseable output` }; } }
  if (/not logged in/i.test(out + (res.stderr ?? ''))) return { value: false };
  return res.status === 0 && /logged in/i.test(out) ? { value: true } : { value: null, reason: `status exited ${res.status}` };
}
// Strict argument parsing, before anything runs.
const args = process.argv.slice(2), only: string[] = [], names = ROOTS.map(r => r.name);
let list = false, statusOnly = false, device = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--list') list = true;
  else if (a === '--status') statusOnly = true;
  else if (a === '--device-auth') device = true;
  else if (a === '--only') { const v = args[++i]; if (!v || !names.includes(v)) { console.error('--only needs one of: ' + names.join(', ')); process.exit(2); } only.push(v); }
  else { console.error(`Unrecognized argument. Allowed: --list, --status, --device-auth, --only <name>. Valid names: ${names.join(', ')}`); process.exit(2); }
}
if (list && statusOnly) { console.error('--list and --status are exclusive'); process.exit(2); }
const roots = only.length ? ROOTS.filter(r => only.includes(r.name)) : ROOTS;
if (list) {
  for (const r of roots) console.log(`${r.name} (${r.rows})\n  cwd: ${r.dir}/home\n  env: ${Object.entries(childEnv(r)).filter(([k]) => /^(HOME|CLAUDE_CONFIG_DIR|CODEX_HOME|XDG_CONFIG_HOME|XDG_CACHE_HOME)$/.test(k)).map(([k, v]) => `${k}=${v}`).join(' ')}\n  login: ${loginArgv(r, device).join(' ')}\n  status: ${statusArgv(r).join(' ')} (only a logged-in true/false is reported)`);
  process.exit(0);
}
let pending = 0;
for (const r of roots) {
  let s = loggedIn(r);
  if (!statusOnly && s.value !== true) {
    ensure(r);
    console.log(`\n=== ${r.name}: ${r.rows} ===\nSign in with the account you want this root to use. ${r.kind === 'claude' ? 'Claude' : 'Codex'} prints its own instructions.`);
    const [cmd, ...rest] = loginArgv(r, device);
    const res = spawnSync(cmd, rest, { env: childEnv(r), cwd: `${r.dir}/home`, stdio: 'inherit' });
    if (res.error) console.log(`login could not start: ${(res.error as NodeJS.ErrnoException).code === 'ENOENT' ? cmd + ' not found on PATH' : 'spawn error'}`);
    else if (res.status !== 0) console.log(`login exited ${res.status}`);
    s = loggedIn(r);
  }
  console.log(`${r.name}: logged in = ${s.value === null ? 'unknown' : s.value}${s.reason ? ` (${s.reason})` : ''}`);
  if (s.value !== true) pending++;
}
console.log(pending ? `\n${pending} root(s) not confirmed logged in.` : '\nAll selected roots report logged in = true. No model task was started.');
process.exit(pending ? 1 : 0);
