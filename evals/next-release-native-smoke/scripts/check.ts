#!/usr/bin/env bun
// Run the pinned harness-eval checker against a prepared packet. Outputs go outside the candidate and are never overwritten.
//   bun check.ts --packet DIR [--harness DIR] [--tag NAME]
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { arg, childEnv, run, sourceRoot } from './lib';

export async function check(packetDir: string, harness = join(sourceRoot, 'skills', 'ruach-harness-eval'), tag = 'check') {
  packetDir = resolve(packetDir);
  const evidence = join(packetDir, 'evidence'), consumer = join(packetDir, 'consumer');
  const config = JSON.parse(await Bun.file(join(evidence, 'config.json')).text());
  const manifest = JSON.parse(await Bun.file(join(evidence, 'manifest.json')).text());
  const runId = config.runs[0].id as string;
  const acceptanceOut = join(packetDir, 'results', `${runId}-${tag}-acceptance.json`);
  const scopeOut = join(packetDir, 'results', `${runId}-${tag}-scope.json`);
  for (const path of [acceptanceOut, scopeOut]) if (existsSync(path)) throw new Error('Result path exists; choose a new tag');
  const bun = process.execPath, env = childEnv();
  const acceptance = await run([bun, join(harness, 'scripts', 'acceptance.ts'), '--config', join(evidence, 'config.json'), '--run', runId, '--output', acceptanceOut], harness, env, 300000);
  const scope = await run([bun, join(harness, 'scripts', 'scope-check.ts'), '--repo', consumer, '--baseline', manifest.base, '--candidate', manifest.candidate, '--allow', join(evidence, 'scope.json'), '--output', scopeOut], harness, env, 120000);
  const parse = (r: { stdout: string }) => { try { return JSON.parse(r.stdout); } catch { return null; } };
  return {
    run: runId, base: manifest.base, candidate: manifest.candidate,
    acceptance: { exit: acceptance.exit, output: acceptanceOut, result: parse(acceptance) },
    scope: { exit: scope.exit, output: scopeOut, result: parse(scope) },
  };
}

if (import.meta.main) {
  const dir = arg(process.argv, '--packet');
  if (!dir) { console.error('usage: bun check.ts --packet DIR [--harness DIR] [--tag NAME]'); process.exit(2); }
  try {
    const r = await check(dir, arg(process.argv, '--harness'), arg(process.argv, '--tag'));
    console.log(JSON.stringify({ run: r.run, acceptance_exit: r.acceptance.exit, scope_exit: r.scope.exit, acceptance_output: r.acceptance.output, scope_output: r.scope.output }));
    process.exitCode = r.acceptance.exit === 0 && r.scope.exit === 0 ? 0 : 1;
  } catch (error: any) { console.error(error.message); process.exit(2); }
}
