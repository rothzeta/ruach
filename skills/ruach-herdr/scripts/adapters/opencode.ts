import { basename, dirname, join } from 'node:path';
import { mkdir, symlink, writeFile } from 'node:fs/promises';
import { parse, type ParseError } from 'jsonc-parser';
import { fail, type Plan, type Selection } from '../contracts';
import { help } from '../process';
import { opencodeRead } from '../native-opencode';
import { scan } from '../skills';

function inlineConfig(): Record<string, any> {
  if (!process.env.OPENCODE_CONFIG_CONTENT) return {};
  const errors: ParseError[] = [];
  const value = parse(process.env.OPENCODE_CONFIG_CONTENT, errors, {
    allowTrailingComma: true,
  });
  if (
    errors.length ||
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  )
    fail(
      2,
      'invalid_settings',
      'Invalid OpenCode inline JSON/JSONC configuration',
      'OPENCODE_CONFIG_CONTENT',
    );
  for (const field of ['instructions', 'skills'])
    if (
      value[field] !== undefined &&
      (!Array.isArray(value[field]) ||
        value[field].some((x: unknown) => typeof x !== 'string'))
    )
      fail(2, 'invalid_settings', 'Invalid OpenCode inline path list', field);
  if (
    value.agents !== undefined &&
    (!value.agents ||
      typeof value.agents !== 'object' ||
      Array.isArray(value.agents))
  )
    fail(2, 'invalid_settings', 'Invalid OpenCode inline agents', 'agents');
  return value;
}
function allowed(rules: any[], id: string) {
  const match = (value: string, pattern: string) =>
    new RegExp(
      '^' +
        pattern
          .split('*')
          .map((x) =>
            x
              .split('?')
              .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              .join('.'),
          )
          .join('.*') +
        '$',
      's',
    ).test(value);
  return (
    rules.findLast(
      (r) =>
        typeof r.action === 'string' &&
        typeof r.resource === 'string' &&
        match('skill', r.action) &&
        match(id, r.resource),
    )?.effect ?? 'ask'
  );
}
export async function prepare(s: Selection, _pass: string[]): Promise<Plan> {
  const { exe, version } = await help('opencode', s.cwd, ['--standalone']);
  const [major, minor, patch] = version.split('.').map(Number);
  if (major !== 2 || minor < 1 || (minor === 1 && patch < 4))
    fail(
      3,
      'unsupported_cli',
      'OpenCode requires the verified v2.1.4-or-newer v2 config and standalone interfaces',
      'opencode',
    );
  if (!/^[^/#\s]+\/[^#\s]+(?:#[^#\s]+)?$/.test(s.model))
    fail(
      2,
      'invalid_model',
      'OpenCode model must use provider/model[#variant]',
      'model',
    );
  const [ref, embeddedVariant] = s.model.split('#'),
    slash = ref.indexOf('/');
  if (
    embeddedVariant &&
    s.effort &&
    s.effort !== 'auto' &&
    embeddedVariant !== s.effort
  )
    fail(
      2,
      'conflicting_effort',
      'Model variant and effort disagree',
      'effort',
    );
  const variant = s.effort && s.effort !== 'auto' ? s.effort : embeddedVariant;
  const selection = {
    providerID: ref.slice(0, slash),
    model: ref.slice(slash + 1),
    ...(variant ? { variant } : {}),
  };
  const original = inlineConfig();
  const canonical = await scan(
    join(s.resources ?? join(s.repo, '.agents'), 'skills'),
    undefined,
    true,
  );
  if (new Set(canonical.map((x) => x.name)).size !== canonical.length)
    fail(
      2,
      'duplicate_skill',
      'Canonical skill names must be unique',
      'skills',
    );
  const native = await opencodeRead(exe, s.cwd);
  const model = native.models.find(
    (m) => m.providerID === selection.providerID && m.id === selection.model,
  );
  if (!model || model.enabled !== true)
    fail(
      3,
      'model_unavailable',
      'Requested OpenCode model is not enabled in the native catalog',
      'model',
    );
  if (
    variant &&
    (!Array.isArray(model.variants) ||
      !model.variants.some((v: any) => v.id === variant))
  )
    fail(
      2,
      'unsupported_effort',
      'Requested variant is not offered by this OpenCode model',
      'effort',
    );
  const configured = native.config.findLast(
    (e) => e.type === 'document' && e.info?.default_agent !== undefined,
  )?.info?.default_agent;
  const id = configured ?? 'build';
  const agent = native.agents.find((a) => a.id === id);
  if (
    !agent ||
    agent.hidden ||
    agent.mode === 'subagent' ||
    !Array.isArray(agent.permissions)
  )
    fail(
      3,
      'opencode_config_unavailable',
      'Cannot verify the native default primary agent',
      'default_agent',
    );
  if (
    native.skills.some(
      (x) =>
        typeof x.id !== 'string' ||
        typeof x.name !== 'string' ||
        typeof x.path !== 'string',
    )
  )
    fail(
      3,
      'opencode_config_unavailable',
      'Invalid native OpenCode skill catalog',
      'skills',
    );
  const workflows = native.skills.filter(
    (x) =>
      x.name.startsWith('ruach-workflow-') ||
      x.id.startsWith('ruach-workflow-'),
  );
  const hidden =
    s.role === 'coordinator'
      ? []
      : [
          ...new Set([
            ...workflows.map((x) => x.name),
            ...canonical.filter((x) => x.workflow).map((x) => x.name),
          ]),
        ].sort();
  const denied =
    s.role === 'coordinator'
      ? []
      : [
          ...new Set([
            'ruach-workflow-*',
            ...workflows.map((x) => x.id),
            ...canonical
              .filter((x) => x.workflow)
              .flatMap((x) => [x.name, basename(x.source)]),
          ]),
        ];
  const rules = denied.map((resource) => ({
    action: 'skill',
    resource,
    effect: 'deny',
  }));
  const visible = canonical.filter(
    (x) => s.role === 'coordinator' || !x.workflow,
  );
  const config = (skills: string, context?: string) => ({
    ...original,
    model: selection,
    default_agent: id,
    instructions: [
      ...(original.instructions ?? []),
      s.roleFile,
      ...(context ? [context] : []),
    ],
    skills: [...(original.skills ?? []), skills],
    agents: {
      ...original.agents,
      [id]: {
        ...original.agents?.[id],
        model: selection,
        ...(rules.length
          ? {
              permissions: [
                ...(original.agents?.[id]?.permissions ?? []),
                ...rules,
              ],
            }
          : {}),
      },
    },
  });
  const nativeEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key, value]) =>
        value !== undefined &&
        (key.startsWith('OPENCODE_') ||
          /^XDG_(CONFIG|DATA|CACHE|STATE)_HOME$/.test(key)),
    ),
  ) as Record<string, string>;
  const probeEnvironment = {
    ...nativeEnvironment,
    OPENCODE_CONFIG_CONTENT: JSON.stringify(
      config(join(s.resources ?? join(s.repo, '.agents'), 'skills')),
    ),
  };
  const verified = await opencodeRead(exe, s.cwd, probeEnvironment);
  const effective = verified.agents.find((a) => a.id === id);
  if (
    !effective ||
    effective.model?.providerID !== selection.providerID ||
    effective.model?.id !== selection.model ||
    effective.model?.variant !== variant ||
    effective.system !== agent.system ||
    !Array.isArray(effective.permissions) ||
    denied.some(
      (resource) => allowed(effective.permissions, resource) !== 'deny',
    ) ||
    !verified.config.some((e) => e.info?.instructions?.includes(s.roleFile))
  )
    fail(
      3,
      'opencode_config_conflict',
      'Native settings prevent the requested role, model or workflow restrictions',
      'opencode',
    );
  nativeEnvironment.OPENCODE_CONFIG_CONTENT = JSON.stringify(
    config('<private-temp>/skills', '<private-temp>/context.md'),
  );
  return {
    argv: ['--standalone'],
    redactedArgv: ['--standalone'],
    environment: nativeEnvironment,
    coverage: 'live-capable',
    version,
    hiddenWorkflows: hidden,
    operations: [
      'short-lived standalone OpenCode config/model/agent/skill readers may initialize native runtime state',
      'private canonical skill links and additive role instructions; existing native settings preserved',
      'OpenCode worker uses its own standalone server; shared service is unchanged',
    ],
    materialize: async (temp) => {
      const root = join(temp, 'skills');
      await mkdir(root, { mode: 0o700 });
      for (const skill of visible)
        await symlink(skill.path, join(root, skill.name), 'dir');
      const context = join(temp, 'context.md');
      await writeFile(
        context,
        `Canonical role source: ${JSON.stringify(s.roleFile)}. Resolve role-relative references from ${JSON.stringify(dirname(s.roleFile))}. Canonical skills directory: ${JSON.stringify(join(s.resources ?? join(s.repo, '.agents'), 'skills'))}. Only the Coordinator loads workflow bodies; workers follow their role and assignment.\n`,
        { mode: 0o600, flag: 'wx' },
      );
      nativeEnvironment.OPENCODE_CONFIG_CONTENT = JSON.stringify(
        config(root, context),
      );
      return ['--standalone'];
    },
  };
}
