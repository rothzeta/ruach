#!/usr/bin/env bun
// Offline access probe for any future blind claim. It only reports what THIS process can read through the
// permissions it runs with; a result supports a blind claim only when executed inside the subject's actual
// effective boundary (same filesystem/tool permissions), which this offline packet cannot establish.
//   bun probe.ts --spec spec.json
// spec: { marker, negative: [paths], positive: [{path, sha256}], inventory_roots?: [paths], evaluator_confirmed?: [paths] }
// evaluator_confirmed lists negative paths / inventory roots whose marker presence (or existence) the evaluator
// confirmed OUTSIDE the subject boundary; an absent path without that record is unverified, never exclusion.
import { lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { arg, sha256 } from './lib';

export interface Spec { marker: string; negative: string[]; positive: { path: string; sha256: string }[]; inventory_roots?: string[]; evaluator_confirmed?: string[] }

function attempt(path: string): { state: 'denied' | 'absent' | 'exposed' | 'readable-no-marker'; real?: string } {
  let real: string | undefined;
  try { real = realpathSync(path); } catch (e: any) { return { state: e.code === 'ENOENT' ? 'absent' : 'denied' }; }
  try { return { state: readFileSync(real, 'utf8').includes(globalMarker) ? 'exposed' : 'readable-no-marker', real }; }
  catch { return { state: 'denied', real }; }
}
let globalMarker = '';

/** Every file under roots (following symlink aliases once by real path) that contains the marker. */
function inventory(roots: string[], marker: string) {
  const hits = new Set<string>(), unreadable: string[] = [], seen = new Set<string>();
  const walk = (path: string) => {
    let real: string;
    try { real = realpathSync(path); } catch { return; }
    if (seen.has(real)) return; seen.add(real);
    let info; try { info = lstatSync(real); } catch { return; }
    if (info.isDirectory()) { try { for (const name of readdirSync(real)) walk(join(real, name)); } catch { unreadable.push(real); } }
    else if (info.isFile()) { try { if (readFileSync(real, 'utf8').includes(marker)) hits.add(real); } catch { unreadable.push(real); } }
  };
  for (const root of roots) walk(root);
  return { marker_paths: [...hits].sort(), unreadable: unreadable.sort(), visited: seen.size };
}

export function probe(spec: Spec) {
  globalMarker = spec.marker;
  const negative = spec.negative.map(path => ({ path, ...attempt(path) }));
  const positive = spec.positive.map(({ path, sha256: expected }) => {
    try { const actual = sha256(readFileSync(path)); return { path, readable: true, digest_match: actual === expected }; }
    catch { return { path, readable: false, digest_match: false }; }
  });
  const inv = inventory(spec.inventory_roots ?? [], spec.marker);
  const confirmed = new Set(spec.evaluator_confirmed ?? []);
  const unconfirmedAbsent = [...negative.filter(n => n.state === 'absent').map(n => n.path), ...(spec.inventory_roots ?? []).filter(root => { try { lstatSync(root); return false; } catch { return true; } })].filter(path => !confirmed.has(path));
  const exposed = negative.filter(n => n.state === 'exposed').map(n => n.path);
  const reasons: string[] = [];
  if (!negative.length) reasons.push('no negative probes supplied');
  if (!positive.length) reasons.push('no positive probes supplied');
  if (exposed.length) reasons.push('answer marker readable at ' + exposed.join(', '));
  if (inv.marker_paths.length) reasons.push('answer marker present in inventoried roots');
  if (positive.some(p => !p.readable || !p.digest_match)) reasons.push('a required task/resource read failed or differs from recorded bytes');
  if (unconfirmedAbsent.length) reasons.push('absent without evaluator-side confirmation (unverified, not exclusion): ' + unconfirmedAbsent.join(', '));
  // 'readable-no-marker' proves nothing about exclusion: the marker file itself was not reached.
  if (negative.some(n => n.state === 'readable-no-marker')) reasons.push('a negative path was readable but lacks the marker (control invalid)');
  const verdict = reasons.length ? 'non-blind-or-unverified' : 'exclusion-evidenced-for-this-boundary-only';
  return { schema_version: 1, argv: process.argv.slice(1), uid: process.getuid?.() ?? null, negative, positive, inventory: inv, verdict, reasons, limits: ['Valid only for the permissions this process ran with; run inside the subject boundary before any blind claim.'] };
}

if (import.meta.main) {
  const specPath = arg(process.argv, '--spec');
  if (!specPath) { console.error('usage: bun probe.ts --spec spec.json'); process.exit(2); }
  const result = probe(JSON.parse(readFileSync(specPath, 'utf8')));
  console.log(JSON.stringify(result));
  process.exitCode = result.verdict === 'non-blind-or-unverified' ? 1 : 0;
}
