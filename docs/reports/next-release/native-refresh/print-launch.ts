#!/usr/bin/env bun
// Operator helper: print (never run) the launch recipe for one subject from manifest.json. No task is started.
//   bun print-launch.ts --list | <subject-id>
import { readFileSync } from 'node:fs';
const m = JSON.parse(readFileSync('/tmp/ruach-implementation-20261011/live/manifest.json', 'utf8'));
const all: any[] = [...m.rows, ...m.r3, m.enoch];
const id = process.argv[2];
if (!id || id === '--list') { for (const r of all) console.log(`${r.id}\t${r.herdr_name}\t${r.model}/${r.effort}\tauth=${r.auth_logged_in}`); process.exit(0); }
const r = all.find(x => x.id === id);
if (!r) { console.error('unknown subject'); process.exit(2); }
const env = Object.entries(r.isolated_env ?? {}).map(([k, v]) => `${k}=${v}`).join(' ');
const prompt = r.brief ?? r.task;
console.log(JSON.stringify({ id: r.id, herdr_name: r.herdr_name, cwd: r.cwd, env_prefix: `env ${env}`, argv: r.argv, first_prompt_file: prompt, preflight: r.preflight ?? null, checker: r.checker ?? r.check ?? null, wall_bound_minutes: 20, task_turns: 1, note: 'Claude/Codex roots must report logged in = true before launch; dialogs are answered by the user only. Rows launched through herdr agent start use the herdr pane environment, not this prefix, except the adapter row whose worker.ts forwards HOME and the config homes.' }, null, 1));
