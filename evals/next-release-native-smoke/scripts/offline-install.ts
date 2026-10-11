#!/usr/bin/env bun
// Offline installation control from an explicit existing source revision, in a temp clone, with isolated
// child HOME/CODEX_HOME/CLAUDE_CONFIG_DIR passed as env objects. No real config roots are touched, no
// native CLI, marketplace or Skills CLI is run.
//   bun offline-install.ts --source REPO --work FRESH_DIR (--revision REV | --version X.Y.Z) [--bun-cache DIR] [--label NAME]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { arg, childEnv, git, run, type RunResult } from './lib';

export async function offlineInstall(opts: { source: string; work: string; revision?: string; version?: string; bunCache?: string; label?: string; path?: string }) {
  const work = resolve(opts.work);
  if (existsSync(work)) throw new Error('Work path must be fresh');
  if (!!opts.revision === !!opts.version) throw new Error('Supply exactly one of revision or version');
  mkdirSync(work, { recursive: true });
  const home = join(work, 'home'), codex = join(work, 'codex'), claude = join(work, 'claude'), clone = join(work, 'source'), consumer = join(work, 'consumer'), target = join(consumer, '.agents');
  for (const dir of [home, codex, claude, consumer]) mkdirSync(dir, { recursive: true });
  const resolved = await git(resolve(opts.source), ['rev-parse', '--verify', '--end-of-options', `${opts.revision ?? 'v' + opts.version}^{commit}`]);
  const clonedOk = await run(['git', 'clone', '--quiet', '--no-hardlinks', '--', resolve(opts.source), clone], work, childEnv(), 120000);
  if (clonedOk.exit !== 0) throw new Error('Clone failed');
  await git(clone, ['checkout', '--quiet', '--detach', resolved]);
  const bunCache = opts.bunCache ?? process.env.BUN_INSTALL_CACHE_DIR ?? join(process.env.HOME ?? '', '.bun', 'install', 'cache');
  const env = childEnv({ HOME: home, CODEX_HOME: codex, CLAUDE_CONFIG_DIR: claude, BUN_INSTALL_CACHE_DIR: bunCache, ...(opts.path === undefined ? {} : { PATH: opts.path }) });
  const bun = process.execPath;
  const steps: { name: string; result: RunResult }[] = [];
  const step = async (name: string, argv: string[], cwd: string) => { const result = await run(argv, cwd, env, 240000); steps.push({ name, result: { ...result, stdout: name === 'ready' ? result.stdout : result.stdout.slice(0, 4000), stderr: result.stderr.slice(0, 2000) } }); return result; };
  const installer = join(clone, 'scripts', 'install.ts');
  const selector = opts.version ? ['--version', opts.version] : ['--revision', resolved];
  await step('install', [bun, installer, 'install', '--source', clone, ...selector, '--target', target], clone);
  const installed = join(target, 'ruach-install.ts');
  await step('check', [bun, installed, 'check', '--target', target, '--source', clone], consumer);
  for (const skill of ['ruach-handoff', 'ruach-herdr']) await step(`frozen-deps:${skill}`, [bun, 'install', '--frozen-lockfile'], join(target, 'skills', skill));
  await step('ready', [bun, installed, 'ready', '--route', 'herdr', '--project', consumer, '--json'], consumer);
  // The control verifies snapshot, resources and frozen skill dependencies, not host-native availability. `ready` is
  // run with --route herdr and reported as it is: exit 0 only when routes.herdr.ready is true, exit 1 with that route
  // listing what is missing. Anything else (other exit, unparsable output, a lying exit, bad integrity or packages)
  // fails the control.
  const readyStep = steps.find(s => s.name === 'ready')!.result;
  let readiness: { route_herdr_ready: boolean; missing: unknown; prerequisites: { name: string; found: boolean }[] } | undefined;
  let readyConsistent = false;
  try {
    const parsed = JSON.parse(readyStep.stdout);
    const herdr = parsed.routes?.herdr;
    readiness = { route_herdr_ready: herdr?.ready === true, missing: herdr?.missing, prerequisites: (parsed.prerequisites ?? []).map((p: any) => ({ name: p.name, found: p.found === true })) };
    readyConsistent = typeof herdr?.ready === 'boolean' && readyStep.exit === (herdr.ready ? 0 : 1) && !readyStep.timedOut
      && parsed.active?.integrity === 'ok' && parsed.routes?.skill?.ready === true
      && Array.isArray(parsed.packages) && parsed.packages.length > 0 && parsed.packages.every((p: any) => p.state === 'ready');
  } catch {}
  const report = {
    schema_version: 1, label: opts.label ?? (opts.version ? `historical-${opts.version}` : 'revision'), source_revision: resolved,
    historical_release: !!opts.version, final_candidate_evidence: false,
    isolated_env: { HOME: home, CODEX_HOME: codex, CLAUDE_CONFIG_DIR: claude, BUN_INSTALL_CACHE_DIR: bunCache },
    native_readiness: readiness ?? null,
    steps: steps.map(s => ({ name: s.name, argv: s.result.argv, exit: s.result.exit, timed_out: s.result.timedOut })),
    outputs: Object.fromEntries(steps.map(s => [s.name, { stdout: s.result.stdout, stderr: s.result.stderr }])),
    ok: steps.every(s => s.name === 'ready' || s.result.exit === 0) && readyConsistent,
    limits: ['Offline snapshot installation only; native availability is reported in native_readiness, not required: no Claude plugin, Skills CLI, Codex discovery, Herdr or model operation was performed.', 'Not final combined-candidate evidence; live rows must supply their own source SHA.'],
  };
  writeFileSync(join(work, 'install-report.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (import.meta.main) {
  const a = process.argv, source = arg(a, '--source'), work = arg(a, '--work');
  if (!source || !work) { console.error('usage: bun offline-install.ts --source REPO --work FRESH_DIR (--revision REV | --version X.Y.Z) [--bun-cache DIR] [--label NAME]'); process.exit(2); }
  try { const r = await offlineInstall({ source, work, revision: arg(a, '--revision'), version: arg(a, '--version'), bunCache: arg(a, '--bun-cache'), label: arg(a, '--label') }); console.log(JSON.stringify({ ok: r.ok, source_revision: r.source_revision, steps: r.steps.map(s => [s.name, s.exit]) })); process.exitCode = r.ok ? 0 : 1; }
  catch (error: any) { console.error(error.message); process.exit(2); }
}
