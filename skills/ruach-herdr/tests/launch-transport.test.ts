import { afterEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { chmod, cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { tmpdir } from 'node:os';
import { materializeBootstrap } from '../scripts/launch-transport';
import { terminalStart } from './fixtures/terminal-start';
import { spawnSync } from 'node:child_process';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

for (const copied of [false, true]) for (const customized of [false, true]) {
  test(`private argv crosses a real canonical PTY with an independent byte oracle; copied=${copied}, startup=${customized}`, async () => {
    const root = await mkdtemp(join(tmpdir(), "ruach-transport space ü ' ` $()-"));
    roots.push(root);
    await chmod(root, 0o700);
    const temporary = join(root, 'material');
    await mkdir(temporary, { mode: 0o700 });
    const observed = join(root, 'received.json');
    const recorder = join(root, 'record.ts');
    await writeFile(recorder, `
import { writeFileSync } from 'node:fs';
writeFileSync(process.env.TRANSPORT_OBSERVED!, JSON.stringify({
  argv: process.argv.slice(2),
  path: process.env.PATH,
  sentinel: process.env.TRANSPORT_SENTINEL,
  cwd: process.cwd(),
  pid: process.pid,
  startup: process.env.STARTUP_SENTINEL,
  restored: process.env.RESTORED_CONFIG_ROOT,
}));
`);
    const literal = "spaces ü 漢字 ' \" `touch SHOULD_NOT_RUN` $(touch SHOULD_NOT_RUN)";
    const expected = ['', literal, 'role=' + literal.repeat(320), 'config=' + JSON.stringify({ enabled: false, text: literal.repeat(180) }), '--normal-flag'];
    const bin = join(root, 'native-bin');
    await mkdir(bin);
    const native = join(bin, 'codex');
    const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'";
    await writeFile(native, `#!/bin/sh\nexec ${quote(process.execPath)} ${quote(recorder)} "$@"\n`, { mode: 0o700 });
    const path = bin + delimiter + process.env.PATH;
    const rcfile = customized ? join(root, 'isolated.bashrc') : undefined;
    const startup = `export PATH=${quote(bin)}:"$PATH"\nexport STARTUP_SENTINEL=preserved\nexport RESTORED_CONFIG_ROOT=wrong-root\nPS1='RUACH_TERMINAL_READY> '\n`;
    if (rcfile) await writeFile(rcfile, startup);
    const helper = copied ? await (async () => {
      const directory = join(root, 'copied skill/scripts');
      await cp(join(import.meta.dir, '../scripts'), directory, { recursive: true });
      return (await import(join(directory, 'launch-transport.ts'))).materializeBootstrap as typeof materializeBootstrap;
    })() : materializeBootstrap;
    const bootstrap = await helper(temporary, native, 'codex', expected, path, { RESTORED_CONFIG_ROOT: 'declared-root' });
    const result = await terminalStart(['codex'], root, {
      ...process.env,
      PATH: path,
      TRANSPORT_OBSERVED: observed,
      TRANSPORT_SENTINEL: literal,
    }, observed, rcfile, bootstrap);
    expect(result.observed).toBe(true);
    expect(result.continuation).toBe(false);
    const actual = JSON.parse(await readFile(observed, 'utf8'));
    expect(actual.argv).toEqual(expected);
    const hash = (value: string[]) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
    expect(hash(actual.argv)).toBe(hash(expected));
    expect(actual.path).toBe(path);
    expect(actual.sentinel).toBe(literal);
    expect(actual.cwd).toBe(root);
    expect(actual.restored).toBe('declared-root');
    if (customized) expect(actual.startup).toBe('preserved');
    if (rcfile) expect(await readFile(rcfile, 'utf8')).toBe(startup);
    expect(await Bun.file(join(root, 'SHOULD_NOT_RUN')).exists()).toBe(false);
    expect((await stat(join(temporary, 'bootstrap'))).mode & 0o777).toBe(0o700);
    expect((await stat(join(temporary, 'bootstrap/argv.json'))).mode & 0o777).toBe(0o600);
    expect((await stat(join(temporary, 'bootstrap/codex'))).mode & 0o777).toBe(0o700);
    expect((await stat(join(temporary, 'bootstrap/setup.sh'))).mode & 0o777).toBe(0o600);
    const receipt = JSON.parse(await readFile(bootstrap.receipt, 'utf8'));
    expect(receipt.pid).toBe(actual.pid);
    expect(receipt.nonce).toBe(bootstrap.nonce);
    expect(receipt.payloadHash).toBe(bootstrap.payloadHash);
  }, 10000);
}

test('failed native exec removes its receipt and withholds literal data', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ruach-exec-failure-'));
  roots.push(root);
  const literal = 'private literal ü $() `text`';
  const bootstrap = await materializeBootstrap(root, join(root, 'missing-native'), 'codex', [literal], process.env.PATH);
  const result = spawnSync(process.execPath, [join(import.meta.dir, '../scripts/native-launch.ts'), join(root, 'bootstrap/argv.json')], { encoding: 'utf8' });
  expect(result.status).toBe(1);
  expect(await Bun.file(bootstrap.receipt).exists()).toBe(false);
  expect(result.stdout + result.stderr).not.toContain(literal);
});
