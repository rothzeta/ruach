import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { mkdir, stat, symlink, writeFile } from 'node:fs/promises';
import { contents, fail, type Plan, type Selection } from '../contracts';
import { executable, run } from '../process';
import { ancestors, scan } from '../skills';

export function validateEffort(effort?: string) {
  if (effort && effort !== 'auto') {
    fail(2, 'unsupported_effort', 'Agy effort must be omitted or auto; the exact model slug carries its native effort', 'effort');
  }
}

export async function prepare(s: Selection, _pass: string[]): Promise<Plan> {
  if (s.role === 'coordinator') {
    fail(2, 'unsupported_role', 'Agy preparation is limited to non-Coordinator roles', 'role');
  }
  if (s.permissions !== 'inherit') {
    fail(3, 'unsupported_permissions', 'Agy has no verified auto-review permission mapping', 'permissions');
  }
  validateEffort(s.effort);
  if (/[()\\\r\n]/.test(s.roleFile)) {
    fail(3, 'unsupported_role_path', 'Canonical role path cannot be represented by the verified native include syntax', 'role');
  }
  const role = await contents(s.roleFile);
  const body = role.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '').trim();
  if (!body) fail(2, 'invalid_role', 'Canonical role has no Markdown body', 'role');
  if (/@\[[^\]]*\]\(/.test(body)) {
    fail(3, 'unsupported_role_include', 'Nested native role includes require independently verified expansion limits', 'role');
  }
  const context = `Canonical role source: ${JSON.stringify(s.roleFile)}. Canonical skills directory: ${JSON.stringify(join(s.resources ?? join(s.repo, '.agents'), 'skills'))}. Resolve role-relative references from ${JSON.stringify(dirname(s.roleFile))}. Only the Coordinator loads workflow bodies; workers follow their role and assignment.`;
  const rule = `---\ntrigger: always_on\n---\n\n@[Canonical role](${s.roleFile})\n\n${context}\n`;
  // Includes expand before the documented 24,000-byte per-file cap. Counting
  // both wrapper and body is conservative; never shorten the canonical role.
  if (Buffer.byteLength(rule) + Buffer.byteLength(body) > 24000) {
    fail(2, 'role_too_large', 'Expanded canonical role rule exceeds the verified native per-file limit', 'role');
  }

  const exe = executable('agy');
  const help = await run([exe, '--help'], s.cwd);
  if (help.exit !== 0 || help.timedOut || ['--model', '--add-dir'].some(flag => !(help.stdout + help.stderr).includes(flag))) {
    fail(3, 'unsupported_cli', 'Installed Agy help does not verify interactive model/add-dir flags', 'agy');
  }
  const version = await run([exe, '--version'], s.cwd);
  if (version.exit !== 0 || version.timedOut || version.stdout.trim() !== '1.4.7') {
    fail(3, 'unsupported_cli', 'Agy requires the verified 1.4.7 additive rule/skill interface', 'agy');
  }
  const catalog = await run([exe, 'models'], s.cwd, 120000);
  if (catalog.exit !== 0 || catalog.timedOut || !catalog.stdout.split('\n').some(row => row.trim().split(/\s+/)[0] === s.model)) {
    fail(3, 'model_unavailable', 'Exact Agy model slug is absent from the available native catalog', 'model');
  }
  const canonical = await scan(join(s.resources ?? join(s.repo, '.agents'), 'skills'), undefined, true);
  if (new Set(canonical.map(skill => skill.name)).size !== canonical.length) {
    fail(2, 'duplicate_skill', 'Canonical skill names must be unique', 'skills');
  }
  const technical = canonical.filter(skill => !skill.workflow);
  const parents = ancestors(s.cwd);
  const rootIndex = (await Promise.all(parents.map(path => stat(join(path, '.git')).catch(() => null))))
    .findIndex(info => info !== null);
  const workspace = rootIndex < 0 ? [s.cwd] : parents.slice(0, rootIndex + 1);
  const roots = [
    ...workspace.flatMap(path => ['.agents', '.agent', '_agents', '_agent'].map(name => join(path, name, 'skills'))),
    join(homedir(), '.gemini', 'config', 'skills'),
    join(homedir(), '.gemini', 'antigravity-cli', 'builtin', 'skills'),
  ];
  const ambient = (await Promise.all(roots.map(root => scan(root)))).flat();
  if (technical.some(skill => ambient.some(other => other.name === skill.name && other.path !== skill.path))) {
    fail(2, 'skill_conflict', 'Canonical technical skill conflicts with a different discovered native skill', 'skills');
  }
  const argv = (temporary: string) => ['--model', s.model, '--add-dir', temporary];
  return {
    argv: argv('<private-temp>'),
    redactedArgv: argv('<private-temp>'),
    coverage: 'live-capable',
    version: '1.4.7',
    hiddenWorkflows: [],
    operations: [
      'native help/version/model-catalog inspection may initialize Agy runtime state; no inference',
      'private always-on canonical source include and technical-skill symlinks; no system replacement or initial task prompt',
      'canonical workflow links omitted; ambient workflow visibility and declared/plugin discovery remain unverified',
      'expanded role per-file size checked; native aggregate 20000-token rule budget/inlining requires actual session validation',
      'native settings, accounts, trust and customization remain active; inherit permissions only; no continuation adapter',
    ],
    materialize: async temporary => {
      const rules = join(temporary, '.agents', 'rules');
      const skills = join(temporary, '.agents', 'skills');
      await mkdir(rules, { recursive: true, mode: 0o700 });
      await mkdir(skills, { recursive: true, mode: 0o700 });
      await writeFile(join(rules, `ruach-${s.role}.md`), rule, { mode: 0o600, flag: 'wx' });
      for (const skill of technical) await symlink(skill.path, join(skills, skill.name), 'dir');
      return argv(temporary);
    },
  };
}
