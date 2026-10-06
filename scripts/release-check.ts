#!/usr/bin/env bun
// Check release metadata before committing and creating immutable release tags.
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const json = (name: string) => JSON.parse(readFileSync(join(root, name), 'utf8'));
try {
  const version = json('package.json').version;
  if (typeof version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) throw new Error('Root version must be MAJOR.MINOR.PATCH');
  const plugin = json('.claude-plugin/plugin.json'), marketplace = json('.claude-plugin/marketplace.json');
  if (plugin.name !== 'ruach' || plugin.version !== version || marketplace.name !== 'ruach' || marketplace.metadata?.version !== version || marketplace.plugins?.length !== 1 || marketplace.plugins[0].name !== 'ruach' || marketplace.plugins[0].source !== './') throw new Error('Plugin and marketplace release metadata must match the root package');
  if (!readFileSync(join(root, 'CHANGELOG.md'), 'utf8').includes(`\n## ${version} — `)) throw new Error('Missing changelog entry for the release');
  for (const file of readdirSync(join(root, 'agents'))) {
    if (!file.endsWith('.md')) throw new Error('Unexpected role resource');
    const body = readFileSync(join(root, 'agents', file), 'utf8');
    const header = /^---\n([\s\S]*?)\n---\n/.exec(body)?.[1];
    if (!header || /^name: (.+)$/m.exec(header)?.[1] !== file.slice(0, -3) || !/^description: .+$/m.test(header)) throw new Error(`Invalid native agent frontmatter: ${file}`);
  }
  if (existsSync(join(root, 'skills'))) {
    const missing: string[] = [];
    for (const name of readdirSync(join(root, 'skills')).sort()) {
      if (!lstatSync(join(root, 'skills', name)).isDirectory()) continue;
      for (const notice of ['LICENSE', 'PROVENANCE.md']) {
        const copy = join(root, 'skills', name, notice);
        if (!existsSync(copy) || readFileSync(copy, 'utf8') !== readFileSync(join(root, notice), 'utf8')) missing.push(`skills/${name}/${notice}`);
      }
    }
    if (missing.length) throw new Error(`Standalone skill notices missing or differing from the root: ${missing.join(', ')}`);
  }
  console.log(`Release v${version}: package, plugin, marketplace, agents and changelog verified`);
} catch (error) {
  console.error('Release check failed: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
}
