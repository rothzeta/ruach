// Exercise install/check through CLI and Git objects, including installed resources.
import { afterEach, beforeEach, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, '../scripts/install.ts');
let base: string, source: string, target: string, sha: string;
function write(path: string, body: string | Buffer) { mkdirSync(join(path, '..'), { recursive: true }); writeFileSync(path, body); }
function git(...args: string[]) {
  const result = spawnSync('git', ['-C', source, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  return result.stdout.trim();
}
function commit() { git('add', '-A'); git('commit', '-qm', 'Fixture'); return git('rev-parse', 'HEAD'); }
function cli(args: string[], success = true, executable = script) {
  const result = spawnSync(process.execPath, [executable, ...args, '--target', target], { cwd: base, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(success ? 0 : 1);
  return result;
}
function install(revision = sha, extra: string[] = [], success = true) { return cli(['install', '--source', source, '--revision', revision, ...extra], success); }
function check(success = true, upstream = false) { return cli(['check', ...(upstream ? ['--source', source] : [])], success); }
function metadata() { return JSON.parse(readFileSync(join(target, 'ruach.json'), 'utf8')); }
beforeEach(() => {
  base = mkdtempSync(join(tmpdir(), 'ruach-install-test-'));
  source = join(base, 'source with spaces'); target = join(base, 'consumer with spaces/.agents');
  write(join(source, 'agents/implementer.md'), 'Shared role\n');
  write(join(source, 'skills/ruach-example/SKILL.md'), 'Shared skill\n');
  write(join(source, 'skills/ruach-example/tool.ts'), 'console.log("shared");\n');
  chmodSync(join(source, 'skills/ruach-example/tool.ts'), 0o755);
  write(join(source, 'evals/ruach-example/expected/rubric.md'), 'Evaluator-only rubric\n');
  for (const name of ['LICENSE', 'PROVENANCE.md']) write(join(source, name), name + '\n');
  write(join(source, 'package.json'), JSON.stringify({ name: 'ruach', version: '0.1.0' }));
  mkdirSync(join(source, 'scripts')); copyFileSync(script, join(source, 'scripts/install.ts'));
  git('init', '-q'); sha = commit();
  write(join(target, 'roles.yaml'), 'consumer preference\n');
});
afterEach(() => rmSync(base, { recursive: true, force: true }));

test('committed snapshot runs without source and preserves policy', () => {
  write(join(source, 'agents/implementer.md'), 'uncommitted change\n'); install();
  expect(readFileSync(join(target, 'agents/implementer.md'), 'utf8')).toBe('Shared role\n');
  expect(readFileSync(join(target, 'roles.yaml'), 'utf8')).toBe('consumer preference\n');
  expect(metadata().revision).toBe(sha);
  expect(metadata().origin).toBe('https://github.com/rothzeta/ruach.git');
  expect(statSync(join(target, 'skills/ruach-example/tool.ts')).mode & 0o111).not.toBe(0);
  rmSync(source, { recursive: true });
  cli(['check'], true, join(target, 'ruach-install.ts'));
});
test('development evals are not installed', () => {
  install();
  const installed = readdirSync(target, { recursive: true }).map(String);
  expect(installed.length).toBeGreaterThan(0);
  expect(installed.filter(name => name.includes('evals') || name.includes('rubric'))).toEqual([]);
  expect(Object.keys(metadata().files).filter(name => name.includes('evals') || name.includes('rubric'))).toEqual([]);
  check(true, true);
});
test('drift requires explicit replace before update', () => {
  install(); write(join(target, 'agents/implementer.md'), 'local edit\n');
  check(false); install(sha, [], false);
  expect(readFileSync(join(target, 'agents/implementer.md'), 'utf8')).toBe('local edit\n');
  install(sha, ['--replace']); check(true, true);
});
test('added skill files are drift but extra consumer skills and dependencies are allowed', () => {
  install();
  write(join(target, 'skills/local-example/SKILL.md'), 'Consumer skill');
  write(join(target, 'skills/ruach-example/node_modules/installed'), 'Runtime dependency');
  check(); write(join(target, 'skills/ruach-example/added.md'), 'unrecorded'); check(false);
  install(sha, ['--replace']); check();
  expect(existsSync(join(target, 'skills/local-example/SKILL.md'))).toBe(true);
  expect(existsSync(join(target, 'skills/ruach-example/node_modules/installed'))).toBe(true);
});
test('update prunes only previously managed files', () => {
  install(); unlinkSync(join(source, 'skills/ruach-example/tool.ts'));
  write(join(source, 'agents/implementer.md'), 'Updated shared role\n');
  install(commit());
  expect(existsSync(join(target, 'skills/ruach-example/tool.ts'))).toBe(false);
  expect(readFileSync(join(target, 'roles.yaml'), 'utf8')).toBe('consumer preference\n');
  check(true, true);
});
test('unmanaged conflict fails before any write', () => {
  write(join(target, 'agents/implementer.md'), 'consumer role'); install(sha, [], false);
  expect(existsSync(join(target, 'ruach.json'))).toBe(false);
  expect(existsSync(join(target, 'skills'))).toBe(false);
  install(sha, ['--replace']); check();
});
test('symlink destination and source are rejected', () => {
  const external = join(base, 'external'); mkdirSync(external);
  symlinkSync(external, join(target, 'skills'), 'dir'); install(sha, ['--replace'], false);
  expect(readdirSync(external)).toEqual([]); unlinkSync(join(target, 'skills'));
  symlinkSync('../../../external', join(source, 'skills/ruach-example/alias'));
  install(commit(), [], false);
  expect(existsSync(join(target, 'agents'))).toBe(false);
});
test('metadata symlink is rejected before writes', () => {
  const outside = join(base, 'outside'); symlinkSync(outside, join(target, 'ruach.json'));
  install(sha, ['--replace'], false);
  expect(existsSync(join(target, 'agents'))).toBe(false); expect(existsSync(outside)).toBe(false);
});
test('missing file and executable mode drift are detected', () => {
  install(); const tool = join(target, 'skills/ruach-example/tool.ts');
  chmodSync(tool, 0o644); check(false); install(sha, ['--replace']); unlinkSync(tool); check(false);
});
test('upstream check detects locally rewritten manifest', () => {
  install(); const changed = join(target, 'agents/implementer.md'); write(changed, 'altered\n');
  const data = metadata(); data.files['agents/implementer.md'].sha256 = createHash('sha256').update(readFileSync(changed)).digest('hex');
  write(join(target, 'ruach.json'), JSON.stringify(data));
  check(); check(false, true);
});
test('invalid revision and unsafe metadata do not mutate', () => {
  install('not-a-commit', [], false); expect(existsSync(join(target, 'agents'))).toBe(false);
  install(); const data = metadata(); data.files['../../outside'] = { sha256: '0'.repeat(64), mode: 420 };
  write(join(target, 'ruach.json'), JSON.stringify(data));
  check(false); install(sha, ['--replace'], false); expect(existsSync(join(base, 'outside'))).toBe(false);
});
test('binary blobs and unusual filenames survive pinned installation', () => {
  const name = 'skills/ruach-example/binary\tasset.bin', body = Buffer.from([0, 255, 10, 128, 13, 0]);
  write(join(source, name), body); sha = commit(); install();
  expect(readFileSync(join(target, name))).toEqual(body); check(true, true);
});
test('update removes the previous installer while preserving consumer policy', () => {
  install(); const data = metadata(), previous = Buffer.from('previous standalone installer\n');
  unlinkSync(join(target, 'ruach-install.ts')); delete data.files['ruach-install.ts'];
  write(join(target, 'ruach-install.py'), previous);
  data.files['ruach-install.py'] = { sha256: createHash('sha256').update(previous).digest('hex'), mode: 0o644 };
  write(join(target, 'ruach.json'), JSON.stringify(data));
  check(); install(); check(true, true);
  expect(existsSync(join(target, 'ruach-install.py'))).toBe(false);
  expect(existsSync(join(target, 'ruach-install.ts'))).toBe(true);
  expect(readFileSync(join(target, 'roles.yaml'), 'utf8')).toBe('consumer preference\n');
});
test('Git environment cannot redirect the explicit source', () => {
  const result = spawnSync(process.execPath, [script, 'install', '--source', source, '--revision', sha, '--target', target], {
    cwd: base, encoding: 'utf8', env: { ...process.env, GIT_DIR: join(base, 'missing.git'), GIT_WORK_TREE: base },
  });
  expect(result.status, result.stderr).toBe(0); check(true, true);
});
test('replacement refs cannot alter the pinned snapshot', () => {
  write(join(source, 'agents/implementer.md'), 'Forged role\n'); const forged = commit();
  git('replace', sha, forged);
  install();
  expect(readFileSync(join(target, 'agents/implementer.md'), 'utf8')).toBe('Shared role\n');
  expect(metadata().revision).toBe(sha);
});
test('unknown and incomplete CLI options fail without mutation', () => {
  cli(['install', '--source', source], false); cli(['check', '--replace'], false);
  expect(existsSync(join(target, 'ruach.json'))).toBe(false);
});
test('installing an annotated release records its version and immutable commit', () => {
  git('tag', '-a', 'v0.1.0', '-m', 'Release 0.1.0', sha);
  write(join(source, 'package.json'), JSON.stringify({ name: 'ruach', version: '0.2.0' }));
  const result = cli(['install', '--source', source, '--version', '0.1.0']);
  expect(result.stdout).toContain('from v0.1.0');
  expect(metadata().version).toBe('0.1.0'); expect(metadata().revision).toBe(sha);
  check(true, true);
  rmSync(source, { recursive: true });
  expect(cli(['check'], true, join(target, 'ruach-install.ts')).stdout).toContain('v0.1.0');
});
test('release selection requires a tag with matching committed package metadata', () => {
  git('branch', 'v0.1.0', sha);
  cli(['install', '--source', source, '--version', '0.1.0'], false);
  git('tag', '-a', 'v0.2.0', '-m', 'Mismatched release', sha);
  cli(['install', '--source', source, '--version', '0.2.0'], false);
  expect(existsSync(join(target, 'ruach.json'))).toBe(false);
  expect(existsSync(join(target, 'agents'))).toBe(false);
});
test('ambiguous and invalid version options are rejected before writes', () => {
  cli(['install', '--source', source, '--version', '0.1.0', '--revision', sha], false);
  for (const version of ['v0.1.0', '01.1.0', '../outside', '0.1', '']) cli(['install', '--source', source, '--version', version], false);
  expect(existsSync(join(target, 'ruach.json'))).toBe(false);
});
test('upstream check detects a locally rewritten release version', () => {
  git('tag', '-a', 'v0.1.0', '-m', 'Release 0.1.0', sha);
  cli(['install', '--source', source, '--version', '0.1.0']);
  const data = metadata(); data.version = '0.2.0'; write(join(target, 'ruach.json'), JSON.stringify(data));
  check(); check(false, true);
  data.version = '../outside'; write(join(target, 'ruach.json'), JSON.stringify(data)); check(false);
});
