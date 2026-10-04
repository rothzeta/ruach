#!/usr/bin/env bun
// Ruach's development launcher delegates all native preparation to its source skill.
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';

const source = resolve(import.meta.dir, '..');
const usage = `Usage: just agent-routing resolve ROLE [--name NAME] [--route ID] [--root DIR]
       just agent-routing start ROLE [NAME] [--route ID] [--root DIR] [--dry-run]
       just coordinator [NAME] [--dry-run]
Optional --permissions inherit|auto-review defaults to auto-review.
Resolve selects offline. Start requires an existing Herdr caller pane.
Resources and launcher come from this checkout; --root selects routing policy and cwd.`;
try {
  const [command, ...args] = process.argv.slice(2);
  if (command === '--help' || args.includes('--help')) { console.log(usage); process.exit(0); }
  if (!['resolve', 'start'].includes(command)) throw new Error(usage);
  const { values, positionals } = parseArgs({ args, allowPositionals: true, strict: true, options: {
    root: { type: 'string' }, route: { type: 'string' }, permissions: { type: 'string', default: 'auto-review' },
    ...(command === 'resolve' ? { name: { type: 'string' as const } } : { 'dry-run': { type: 'boolean' as const } }),
  } });
  const [role, explicitName] = positionals;
  if (!role || !/^[a-z][a-z0-9_-]*$/.test(role) || positionals.length > (command === 'start' ? 2 : 1)) throw new Error(usage);
  if (!['inherit', 'auto-review'].includes(values.permissions!)) throw new Error('Expected --permissions inherit|auto-review');
  const root = resolve(values.root ?? source), name = explicitName ?? values.name ?? `ruach-${role}`;
  const argv = [join(source, 'skills/ruach-herdr/scripts/worker.ts'), command,
    '--role', role, '--name', name, '--repo', root, '--cwd', root,
    '--resources', source, '--catalogs', join(root, 'config/agent-routing'), '--permissions', values.permissions!];
  if (command === 'resolve') argv.push('--offline');
  if (values['dry-run']) argv.push('--dry-run');
  if (values.route !== undefined) argv.push('--route', values.route);
  const result = spawnSync(process.execPath, argv, { cwd: root, stdio: 'inherit' });
  if (result.error) throw new Error('Unable to invoke the source launcher');
  process.exitCode = result.status ?? 4;
} catch (error) {
  console.error('Routing failed: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 2;
}
