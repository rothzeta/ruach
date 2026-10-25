import { afterEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { chmod, cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { materializeBootstrap } from '../scripts/launch-transport';
import { terminalStart } from './fixtures/terminal-start';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

for (const copied of [false, true]) {
  test(`private argv crosses a real canonical PTY with an independent byte oracle${copied ? ' from copied scripts' : ''}`, async () => {
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
}));
`);
    const literal = "spaces ü 漢字 ' \" `touch SHOULD_NOT_RUN` $(touch SHOULD_NOT_RUN)";
    const expected = ['', literal, 'role=' + literal.repeat(320), 'config=' + JSON.stringify({ enabled: false, text: literal }), '--normal-flag'];
    const path = process.env.PATH;
    const helper = copied ? await (async () => {
      const directory = join(root, 'copied skill/scripts');
      await cp(join(import.meta.dir, '../scripts'), directory, { recursive: true });
      return (await import(join(directory, 'launch-transport.ts'))).materializeBootstrap as typeof materializeBootstrap;
    })() : materializeBootstrap;
    const launchPath = await helper(temporary, process.execPath, 'codex', [recorder, ...expected], path);
    const result = await terminalStart(['codex'], root, {
      ...process.env,
      PATH: launchPath,
      TRANSPORT_OBSERVED: observed,
      TRANSPORT_SENTINEL: literal,
    }, observed);
    expect(result.observed).toBe(true);
    expect(result.continuation).toBe(false);
    const actual = JSON.parse(await readFile(observed, 'utf8'));
    expect(actual.argv).toEqual(expected);
    const hash = (value: string[]) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
    expect(hash(actual.argv)).toBe(hash(expected));
    expect(actual.path).toBe(path);
    expect(actual.sentinel).toBe(literal);
    expect(actual.cwd).toBe(root);
    expect(await Bun.file(join(root, 'SHOULD_NOT_RUN')).exists()).toBe(false);
    expect((await stat(join(temporary, 'bootstrap'))).mode & 0o777).toBe(0o700);
    expect((await stat(join(temporary, 'bootstrap/argv.json'))).mode & 0o777).toBe(0o600);
    expect((await stat(join(temporary, 'bootstrap/codex'))).mode & 0o777).toBe(0o700);
  }, 10000);
}
