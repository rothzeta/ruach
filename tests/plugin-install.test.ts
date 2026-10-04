import { afterEach, beforeEach, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
