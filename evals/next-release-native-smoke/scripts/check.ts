#!/usr/bin/env bun
// Run the pinned harness-eval checker against a prepared packet. Outputs go outside the candidate and are never overwritten.
//   bun check.ts --packet DIR [--harness DIR] [--tag NAME] [--allow-base]
// The candidate is the commit on the branch checked out in <DIR>/consumer; it is pinned into the checker configuration.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { arg, childEnv, fixtureGit, run, sourceRoot } from './lib';

export interface CheckOptions { /** The explicit base run: a candidate equal to the base is allowed. */ allowBase?: boolean }

/** The evaluated candidate: the commit on the branch currently checked out in the consumer, never a guessed ref. */
async function resolveCandidate(consumer: string, base: string, allowBase: boolean) {
  let ref: string;
  try { ref = await fixtureGit(consumer, ['symbolic-ref', '--quiet', 'HEAD']); }
  catch { throw new Error('The consumer must have a checked-out branch (detached HEAD is not evaluated)'); }
  const sha = await fixtureGit(consumer, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`]);
  try { await fixtureGit(consumer, ['merge-base', '--is-ancestor', base, sha]); }
  catch { throw new Error('The checked-out branch does not descend from the prepared base'); }
  if (sha === base && !allowBase) throw new Error('The candidate equals the base: commit the subject work on the checked-out branch, or pass --allow-base for an explicit base run');
  return { ref, sha };
}

export async function check(packetDir: string, harness = join(sourceRoot, 'skills', 'ruach-harness-eval'), tag = 'check', options: CheckOptions = {}) {
  packetDir = resolve(packetDir);
  const evidence = join(packetDir, 'evidence'), consumer = join(packetDir, 'consumer');
  const config = JSON.parse(await Bun.file(join(evidence, 'config.json')).text());
  const manifest = JSON.parse(await Bun.file(join(evidence, 'manifest.json')).text());
  const runId = config.runs[0].id as string;
  const acceptanceOut = join(packetDir, 'results', `${runId}-${tag}-acceptance.json`);
  const scopeOut = join(packetDir, 'results', `${runId}-${tag}-scope.json`);
  const pinnedConfig = join(evidence, `config-${runId}-${tag}.json`);
  for (const path of [acceptanceOut, scopeOut, pinnedConfig]) if (existsSync(path)) throw new Error('Result path exists; choose a new tag');
  const candidate = await resolveCandidate(consumer, manifest.base, !!options.allowBase);
  // Pin the evaluated commit into a per-check copy of the configuration; the prepared config stays unchanged.
  config.runs[0].candidate = candidate.sha;
  await Bun.write(pinnedConfig, JSON.stringify(config, null, 2) + '\n');
  const bun = process.execPath, env = childEnv();
  const acceptance = await run([bun, join(harness, 'scripts', 'acceptance.ts'), '--config', pinnedConfig, '--run', runId, '--output', acceptanceOut], harness, env, 300000);
  const scope = await run([bun, join(harness, 'scripts', 'scope-check.ts'), '--repo', consumer, '--baseline', manifest.base, '--candidate', candidate.sha, '--allow', join(evidence, 'scope.json'), '--output', scopeOut], harness, env, 120000);
  const parse = (r: { stdout: string }) => { try { return JSON.parse(r.stdout); } catch { return null; } };
  return {
    run: runId, base: manifest.base, candidate: candidate.sha, candidate_ref: candidate.ref, prepared_candidate: manifest.candidate, pinned_config: pinnedConfig,
    acceptance: { exit: acceptance.exit, output: acceptanceOut, result: parse(acceptance) },
    scope: { exit: scope.exit, output: scopeOut, result: parse(scope) },
  };
}

if (import.meta.main) {
  const dir = arg(process.argv, '--packet');
  if (!dir) { console.error('usage: bun check.ts --packet DIR [--harness DIR] [--tag NAME] [--allow-base]'); process.exit(2); }
  try {
    const r = await check(dir, arg(process.argv, '--harness'), arg(process.argv, '--tag'), { allowBase: process.argv.includes('--allow-base') });
    console.log(JSON.stringify({ run: r.run, base: r.base, candidate: r.candidate, candidate_ref: r.candidate_ref, acceptance_exit: r.acceptance.exit, scope_exit: r.scope.exit, acceptance_output: r.acceptance.output, scope_output: r.scope.output }));
    process.exitCode = r.acceptance.exit === 0 && r.scope.exit === 0 ? 0 : 1;
  } catch (error: any) { console.error(error.message); process.exit(2); }
}
