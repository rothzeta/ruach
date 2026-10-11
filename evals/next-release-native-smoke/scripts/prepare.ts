#!/usr/bin/env bun
// Offline fixture preparation: a fresh consumer Git repository at a base commit, optionally a corrected
// control candidate, and an evaluator-side configuration kept OUTSIDE the candidate.
//   bun prepare.ts --out FRESH_DIR [--control] [--handoff-validator PATH]
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { arg, digests, git, listFiles, packet, sha256, sourceRoot } from './lib';

const CONTROL_REPORT = `task: smoke-range-fix
status: complete
outcome: inclusiveRange now includes its upper bound; the suite passes.
artifacts:
  - src/range.ts
  - docs/reports/smoke.md
verification:
  - "bun test: exit 0"
discoveries: []
blockers: []

# Smoke report

The loop bound excluded the end value; it now includes it. Review not run.
`;

// Hidden check: evaluator-only cases beyond the visible tests, run as one inline program.
const HIDDEN = `import {inclusiveRange as r, rangeSize as s} from './src/range.ts';
const eq=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
if(!eq(r(-2,2),[-2,-1,0,1,2])||!eq(r(7,7),[7])||!eq(r(3,1),[])||s(-2,2)!==5||s(3,1)!==0)process.exit(1);
console.log('ok');`;

export async function prepare(out: string, options: { control?: boolean; handoffValidator?: string } = {}) {
  out = resolve(out);
  if (existsSync(out)) throw new Error('Output path must be fresh');
  const consumer = join(out, 'consumer'), evidence = join(out, 'evidence');
  mkdirSync(consumer, { recursive: true }); mkdirSync(evidence); mkdirSync(join(out, 'results'));
  const fixture = join(packet, 'fixture', 'consumer');
  for (const file of listFiles(fixture)) {
    // `.fixture` keeps the intentionally failing tests out of bun test discovery for this packet.
    const target = join(consumer, file.replace(/\.fixture$/, ''));
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(fixture, file), target);
  }
  await git(consumer, ['init', '--quiet', '--initial-branch=main']);
  await git(consumer, ['add', '-A']);
  await git(consumer, ['commit', '--quiet', '-m', 'Base: failing off-by-one fixture']);
  const base = await git(consumer, ['rev-parse', 'HEAD']);
  let candidate = base;
  if (options.control) {
    await git(consumer, ['checkout', '--quiet', '-b', 'candidate']);
    copyFileSync(join(packet, 'evaluator', 'solved', 'src', 'range.ts'), join(consumer, 'src', 'range.ts'));
    writeFileSync(join(consumer, 'docs', 'reports', 'smoke.md'), CONTROL_REPORT);
    await git(consumer, ['add', '-A']);
    await git(consumer, ['commit', '--quiet', '-m', 'Control: corrected candidate']);
    candidate = await git(consumer, ['rev-parse', 'HEAD']);
  } else {
    await git(consumer, ['branch', 'candidate']);
  }
  const bun = process.execPath;
  const validator = resolve(options.handoffValidator ?? join(sourceRoot, 'skills', 'ruach-handoff', 'scripts', 'validate.ts'));
  copyFileSync(join(packet, 'briefs', 'assisted.md'), join(evidence, 'assignment.md'));
  const config = {
    schema_version: 1,
    task: 'native-smoke-range',
    assignment: 'assignment.md',
    acceptance: {
      checks: [
        { id: 'visible-tests', argv: [bun, 'test', '--timeout', '30000'], cwd: '{repo}', timeout_ms: 120000, expect: { exit: 0, stderr_not_contains: '\n 0 pass\n' } },
        { id: 'hidden-cases', argv: [bun, '-e', HIDDEN], cwd: '{repo}', timeout_ms: 60000, expect: { exit: 0, stdout: 'ok\n' } },
        { id: 'handoff-valid', argv: [bun, validator, 'docs/reports/smoke.md', '--repo', '{repo}'], cwd: '{repo}', timeout_ms: 60000, expect: { exit: 0 } },
      ],
    },
    // Declared route metadata only; model_use_verified stays false in checker output.
    runs: [{ id: options.control ? 'control' : 'base', repo: '../consumer', candidate: 'refs/heads/candidate', kind: 'control', model: 'none-no-model-subject' }],
  };
  const scope = {
    schema_version: 1,
    paths: ['docs/reports/smoke.md'],
    prefixes: ['src/'],
    protected_paths: ['tests/', 'AGENTS.md', 'package.json'],
    require_clean: true,
    task: config.task,
    run: config.runs[0].id,
  };
  // The scope task/run keys are only needed when evidence is supplied; drop them to keep the config minimal.
  delete (scope as any).task; delete (scope as any).run;
  writeFileSync(join(evidence, 'config.json'), JSON.stringify(config, null, 2) + '\n');
  writeFileSync(join(evidence, 'scope.json'), JSON.stringify(scope, null, 2) + '\n');
  const manifest = {
    schema_version: 1, base, candidate, control: !!options.control, branch_refs: { candidate: 'refs/heads/candidate' },
    subject_files: digests(fixture), brief_digests: { assisted: sha256(readFileSync(join(packet, 'briefs', 'assisted.md'))), unassisted: sha256(readFileSync(join(packet, 'briefs', 'unassisted.md'))) },
    limits: ['No model subject was run; the control candidate is the evaluator solution applied by script.'],
  };
  writeFileSync(join(evidence, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return { out, consumer, evidence, base, candidate };
}

if (import.meta.main) {
  const out = arg(process.argv, '--out');
  if (!out) { console.error('usage: bun prepare.ts --out FRESH_DIR [--control] [--handoff-validator PATH]'); process.exit(2); }
  try { console.log(JSON.stringify(await prepare(out, { control: process.argv.includes('--control'), handoffValidator: arg(process.argv, '--handoff-validator') }))); }
  catch (error: any) { console.error(error.message); process.exit(2); }
}
