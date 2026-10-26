import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const just=Bun.which('just')!;
let root:string,checkout:string,bin:string;
beforeEach(()=>{
  root=mkdtempSync(join(tmpdir(),'ruach-plugin-test-'));checkout=join(root,'checkout with spaces');bin=join(root,'bin');
  mkdirSync(checkout);mkdirSync(bin);mkdirSync(join(root,'home'));
  copyFileSync(resolve(import.meta.dir,'../justfile'),join(checkout,'justfile'));
  writeFileSync(join(bin,'claude'),`#!${process.execPath}
import { appendFileSync } from 'node:fs';
const args=process.argv.slice(2);
appendFileSync(process.env.CALLS,JSON.stringify({args,cwd:process.cwd()})+'\\n');
if(args[1]==='marketplace'&&(args[3]==='.'||process.env.FAIL_ADD==='1'))process.exit(1);
`);
  chmodSync(join(bin,'claude'),0o700);
});
afterEach(()=>rmSync(root,{recursive:true,force:true}));
function run(args:string[],env:Record<string,string>={}) {
  return spawnSync(just,['--justfile',join(checkout,'justfile'),...args],{cwd:tmpdir(),encoding:'utf8',env:{...process.env,
    HOME:join(root,'home'),PATH:bin+':'+process.env.PATH,BUN_BIN:process.execPath,CALLS:join(root,'calls.jsonl'),...env}});
}
function calls(){return readFileSync(join(root,'calls.jsonl'),'utf8').trim().split('\n').map(line=>JSON.parse(line));}

test('standalone installation selects technical skills and preserves caller arguments', () => {
  const fakeBun = join(bin, 'bun-capture');
  writeFileSync(fakeBun, `#!${process.execPath}
await Bun.write(process.env.CALLS, JSON.stringify({
  args: process.argv.slice(2),
  cwd: process.cwd(),
}));
`);
  chmodSync(fakeBun, 0o700);

  const result = run(['install-global', '--yes'], { BUN_BIN: fakeBun });
  expect(result.status, result.stderr).toBe(0);
  const invocation = JSON.parse(readFileSync(join(root, 'calls.jsonl'), 'utf8'));
  expect(invocation.cwd).toBe(checkout);
  expect(invocation.args).toEqual([
    'x', '--bun', 'skills@1.7.0', 'add', './skills',
    '--global', '--agent', 'codex', '--agent', 'claude-code',
    '--skill', 'ruach-changelog', 'ruach-debugging', 'ruach-handoff',
    'ruach-harness-eval', 'ruach-herdr', 'ruach-librarian',
    'ruach-runtime-testing', 'ruach-simplification', 'ruach-testing', '--yes',
  ]);

  // Check the selected installation as a standalone bundle, without source roles
  // or workflows accidentally making a broken dependency appear available.
  const source = resolve(import.meta.dir, '..');
  const bundle = join(root, 'standalone');
  mkdirSync(join(bundle, 'skills'), { recursive: true });
  mkdirSync(join(bundle, 'scripts'));
  copyFileSync(join(source, 'scripts/check.ts'), join(bundle, 'scripts/check.ts'));
  for (const notice of ['LICENSE', 'PROVENANCE.md']) {
    copyFileSync(join(source, notice), join(bundle, notice));
  }
  const selected = invocation.args.slice(invocation.args.indexOf('--skill') + 1, -1);
  for (const skill of selected) {
    cpSync(join(source, 'skills', skill), join(bundle, 'skills', skill), {
      recursive: true,
      filter: (path) => !path.split('/').includes('node_modules'),
    });
  }
  const checked = spawnSync(process.execPath, [join(bundle, 'scripts/check.ts')], {
    cwd: tmpdir(),
    encoding: 'utf8',
  });
  expect(checked.status, checked.stderr).toBe(0);
});
for(const args of [['install-plugin'],['install-plugins'],['install-plugin','ruach'],['install-plugins','ruach']])test(`${args.join(' ')} registers the checkout path and installs the native plugin`,()=>{
  const r=run(args);expect(r.status,r.stderr).toBe(0);
  expect(calls()).toEqual([
    {args:['plugin','marketplace','add',checkout,'--scope','user'],cwd:checkout},
    {args:['plugin','install','ruach@ruach','--scope','user'],cwd:checkout},
  ]);
});
test('marketplace registration failure prevents plugin installation',()=>{
  expect(run(['install-plugin'],{FAIL_ADD:'1'}).status).not.toBe(0);expect(calls()).toHaveLength(1);
});
test('plugin argument is passed literally without shell interpolation',()=>{
  const plugin='name $() `literal` with spaces';expect(run(['install-plugin',plugin]).status).toBe(0);
  expect(calls()[1].args[2]).toBe(plugin+'@ruach');
});
