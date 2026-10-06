import { afterEach, beforeEach, expect, test } from 'bun:test';
import { symlink, realpath, chmod, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { delimiter, isAbsolute, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const worker=resolve(import.meta.dir,'../scripts/worker.ts');
const fake=resolve(import.meta.dir,'fixtures/fake-cli.ts');
const git=Bun.which('git')!;
let cwdOverride:string|undefined,root:string,repo:string,home:string,bin:string,temp:string,target:string,behavior:any;
function command(args:string[]) {
  const result=Bun.spawnSync([git,'-C',repo,...args],{stdout:'pipe',stderr:'pipe'});
  if(result.exitCode!==0)throw new Error(result.stderr.toString());
  return result.stdout.toString().trim();
}
async function records(name:string) {
  const body=await readFile(join(root,name),'utf8').catch(()=> '');
  return body.trim()?body.trim().split('\n').map(line=>JSON.parse(line)):[];
}
async function launch(extra:string[]=[],env:Record<string,string>={},kind='claude') {
  await writeFile(join(root,'behavior.json'),JSON.stringify(behavior));
  const p=Bun.spawn([process.execPath,worker,'start','--name','designer','--role','architect','--cwd',cwdOverride??repo,'--repo',repo,
    '--kind',kind,'--model','test-model','--temp-dir',temp,...extra],{
    cwd:root,env:{...process.env,HOME:home,CLAUDE_CONFIG_DIR:join(home,'.claude'),CODEX_HOME:join(home,'.codex'),
      PATH:bin,HERDR_ENV:'1',HERDR_PANE_ID:'',FIXTURE_ROOT:root,...env},stdout:'pipe',stderr:'pipe'});
  const [stdout,stderr,exit]=await Promise.all([new Response(p.stdout).text(),new Response(p.stderr).text(),p.exited]);
  return {exit,stdout,stderr,data:JSON.parse(stdout)};
}
beforeEach(async()=>{
  root=await mkdtemp(join(tmpdir(),'ruach-background spaces-'));
  repo=join(root,'source');home=join(root,'home');bin=join(root,'bin');temp=join(root,'temporary');
  target=join(root,'source-worktrees','designer');
  for(const path of [repo,home,bin,temp,join(repo,'.agents/agents')])await mkdir(path,{recursive:true});
  await writeFile(join(repo,'.agents/agents/architect.md'),'Canonical architect instructions.');
  await writeFile(join(repo,'tracked.txt'),'Committed source\n');
  command(['init','--quiet']);
  command(['add','.']);
  command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Fixture']);
  for(const exe of ['herdr','claude','codex']) {
    await writeFile(join(bin,exe),`#!${process.execPath}\nimport ${JSON.stringify(fake)};\n`);
    await chmod(join(bin,exe),0o700);
  }
  await writeFile(join(bin,'git'),`#!${process.execPath}
import { spawnSync } from 'node:child_process';
import { appendFileSync,readFileSync } from 'node:fs';
const args=process.argv.slice(2),root=process.env.FIXTURE_ROOT;
appendFileSync(root+'/git-calls.jsonl',JSON.stringify(args)+'\\n');
const behavior=JSON.parse(readFileSync(root+'/behavior.json','utf8'));
if(behavior.worktreeFailure&&args.includes('add')&&args.includes('worktree'))process.exit(1);
const result=spawnSync(${JSON.stringify(git)},args,{stdio:'inherit'});
if(behavior.descendant&&args.includes('--show-toplevel')&&!args.includes('--quiet')){
  // A helper descendant keeps inherited output pipes open after the probe finishes.
  const child=Bun.spawn([process.execPath,'-e','setTimeout(()=>{},20000)'],{stdio:['ignore','inherit','inherit']});
  appendFileSync(root+'/descendants.pid',child.pid+'\\n');child.unref();
}
process.exit(result.status??1);
`);
  await chmod(join(bin,'git'),0o700);
  behavior={daemonMissing:true};cwdOverride=undefined;
});
afterEach(async()=>{await rm(root,{recursive:true,force:true});});

test('default launch creates a real isolated worktree and background workspace without caller pane or split',async()=>{
  const base=command(['rev-parse','HEAD']);
  await writeFile(join(repo,'tracked.txt'),'Uncommitted source\n');
  const r=await launch();expect(r.exit,r.stderr).toBe(0);
  expect(r.data.placement).toBe('worktree');expect(r.data.workspace).toBe('w2');expect(r.data.pane).toBe('w2:p1');
  expect(r.data.worktree).toEqual({path:target,cwd:target,branch:'ruach/designer',base});
  expect(r.data.selection.cwd).toBe(target);expect(r.data.worktree_state).toBe('created');
  expect(await readFile(join(target,'tracked.txt'),'utf8')).toBe('Committed source\n');
  expect(command(['rev-parse','refs/heads/ruach/designer'])).toBe(base);
  const mutations=await records('mutations.jsonl');expect(mutations.map(x=>x.action)).toEqual(['workspace','start']);
  expect(mutations[0].args).toContain('--no-focus');expect(mutations[0].args).not.toContain('--focus');
  for(const value of [`PATH=${bin}`,`HOME=${home}`,`CODEX_HOME=${join(home,'.codex')}`,`CLAUDE_CONFIG_DIR=${join(home,'.claude')}`])expect(mutations[0].args).toContain(value);
  expect((await records('native-launches.jsonl'))[0].cwd).toBe(target);
  expect((await records('calls.jsonl')).some(x=>x.args.includes('layout')||x.args.includes('split'))).toBe(false);
  expect(r.data.inspection.focus).toEqual(['herdr','workspace','focus','w2']);
});
test('dry-run reports the pinned base and destination without creating resources',async()=>{
  const r=await launch(['--dry-run']);expect(r.exit,r.stderr).toBe(0);expect(r.data.worktree.path).toBe(target);
  expect(r.data.worktree_state).toBe('not-created');expect(await records('mutations.jsonl')).toEqual([]);
  expect(await readdir(temp)).toEqual([]);expect(command(['worktree','list','--porcelain'])).not.toContain(target);
});
test('custom checkout path, branch and base are honored without shell interpolation',async()=>{
  const first=command(['rev-parse','HEAD']);await writeFile(join(repo,'tracked.txt'),'Second commit\n');
  command(['add','.']);command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Second']);
  const path=join(root,'custom $() `literal` ü');
  const r=await launch(['--worktree',path,'--branch','design/custom','--base',first]);expect(r.exit,r.stderr).toBe(0);
  expect(r.data.worktree.path).toBe(path);expect(r.data.worktree.branch).toBe('design/custom');
  expect(await readFile(join(path,'tracked.txt'),'utf8')).toBe('Committed source\n');
});
test('Codex reads effective configuration in the actual worktree and uses its cwd',async()=>{
  await mkdir(join(repo,'.codex'));await writeFile(join(repo,'.codex/config.toml'),'developer_instructions = "Committed worker settings"\n');
  command(['add','.']);command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Settings']);
  await writeFile(join(repo,'.codex/config.toml'),'developer_instructions = "Uncommitted caller settings"\n');
  const r=await launch([],{},'codex');expect(r.exit,r.stderr).toBe(0);
  expect(r.data.selection.cwd).toBe(target);
  const native=(await records('native-launches.jsonl'))[0];
  const developer=Bun.TOML.parse(native.args.find((x:string)=>x.startsWith('developer_instructions='))).developer_instructions;
  expect(developer).toContain('Committed worker settings');expect(developer).not.toContain('Uncommitted caller settings');
  expect(native.args[native.args.indexOf('--cd')+1]).toBe(target);
});
test('existing branch and destination fail preflight without launch mutations',async()=>{
  command(['branch','ruach/designer']);let r=await launch();expect(r.exit).toBe(2);expect(r.data.diagnostics[0].code).toBe('branch_unavailable');
  command(['branch','-D','ruach/designer']);await mkdir(target,{recursive:true});
  r=await launch();expect(r.exit).toBe(2);expect(r.data.diagnostics[0].code).toBe('worktree_exists');
  expect(await records('mutations.jsonl')).toEqual([]);expect(await readdir(temp)).toEqual([]);
});
test('missing Herdr session fails before creating a worktree',async()=>{
  const r=await launch([],{HERDR_ENV:'0'});expect(r.exit).toBe(3);expect(await records('mutations.jsonl')).toEqual([]);
  expect(command(['worktree','list','--porcelain'])).not.toContain(target);
});
test('failed worktree creation reports its uncertain path and branch without starting or retrying',async()=>{
  behavior.worktreeFailure=true;const r=await launch();expect(r.exit).toBe(4);expect(r.data.worktree_state).toBe('unknown');
  expect(r.data.worktree.path).toBe(target);expect(r.data.worktree.branch).toBe('ruach/designer');
  expect((await records('git-calls.jsonl')).filter(args=>args.includes('worktree')&&args.includes('add'))).toHaveLength(1);
  expect(await records('mutations.jsonl')).toEqual([]);expect(await readdir(temp)).toEqual([]);
});
test('workspace failure retains the worktree and private launch material for recovery without submitting an agent',async()=>{
  behavior.workspaceFailure=true;const r=await launch();expect(r.exit).toBe(4);
  expect(r.data.worktree_state).toBe('created');expect(r.data.submission_state).toBe('unknown');
  expect((await records('mutations.jsonl')).map(x=>x.action)).toEqual(['workspace']);
  expect(r.data.temporary_directory).toBeTruthy();expect(await readFile(join(target,'tracked.txt'),'utf8')).toBe('Committed source\n');
});
test('agent startup failure reports workspace and worktree identities and never retries',async()=>{
  behavior.startFailure=true;const r=await launch();expect(r.exit).toBe(4);expect(r.data.workspace).toBe('w2');
  expect(r.data.pane).toBe('w2:p1');expect(r.data.worktree_state).toBe('created');
  expect((await records('mutations.jsonl')).map(x=>x.action)).toEqual(['workspace','start']);
});
test('native preparation failure in the new checkout preserves the worktree without creating a workspace',async()=>{
  await mkdir(join(repo,'.codex'));await writeFile(join(repo,'.codex/config.toml'),'invalid TOML = [\n');
  command(['add','.']);command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Invalid target settings']);
  await writeFile(join(repo,'.codex/config.toml'),'developer_instructions = "Valid source settings"\n');
  const r=await launch([],{},'codex');expect(r.exit).toBe(4);expect(r.data.phase).toBe('prepare');
  expect(r.data.worktree_state).toBe('created');expect(r.data.submission_state).toBe('not-submitted');
  expect(await records('mutations.jsonl')).toEqual([]);expect(await readdir(temp)).toEqual([]);
  expect(await readFile(join(target,'.codex/config.toml'),'utf8')).toBe('invalid TOML = [\n');
});
test('malformed workspace result retains its known identity and does not submit an agent',async()=>{
  behavior.workspaceMalformed=true;const r=await launch();expect(r.exit).toBe(4);
  expect(r.data.workspace).toBe('w2');expect(r.data.pane).toBeNull();expect(r.data.worktree_state).toBe('created');
  expect((await records('mutations.jsonl')).map(x=>x.action)).toEqual(['workspace']);
});
test('startup success must confirm the selected agent in the returned workspace pane',async()=>{
  behavior.startWrongPane=true;const r=await launch();expect(r.exit).toBe(4);expect(r.data.submission_state).toBe('unknown');
  expect((await records('mutations.jsonl')).filter(x=>x.action==='start')).toHaveLength(1);
});
test('native startup dialog reports awaiting input in the existing workspace without failure or retry',async()=>{
  behavior.startBlocked=true;const r=await launch();expect(r.exit,r.stderr).toBe(0);
  expect(r.data.action).toBe('awaiting-input');expect(r.data.submission_state).toBe('awaiting-input');
  expect(r.data.ready).toBe(false);expect(r.data.awaiting_user_input).toBe(true);expect(r.data.launchable).toBe(false);
  expect(r.data.workspace).toBe('w2');expect(r.data.pane).toBe('w2:p1');expect(r.data.temporary_directory).toBeTruthy();
  expect(r.stderr).toContain('herdr workspace focus w2');
  expect((await records('mutations.jsonl')).map(x=>x.action)).toEqual(['workspace','start']);
  expect((await records('calls.jsonl')).some(x=>x.args.includes('send-keys')||x.args.includes('prompt'))).toBe(false);
});
test('blocked state from another pane cannot turn a startup error into successful submission',async()=>{
  behavior.startBlocked=true;behavior.inspectPane='different-pane';const r=await launch();expect(r.exit).toBe(4);
  expect(r.data.submission_state).toBe('unknown');expect(r.data.diagnostics[0].code).toBe('start_uncertain');
});
test('invalid placement combinations and branch/base options fail without launch mutations',async()=>{
  for(const args of [['--placement','unknown'],['--placement','pane','--worktree',target],['--branch','@{-1}'],['--base','missing-ref']]) {
    expect((await launch(args)).exit).toBe(2);
  }
  expect(await records('mutations.jsonl')).toEqual([]);
});
test('a symlinked cwd resolves to the matching location inside the created worktree',async()=>{
  const real=await realpath(root);
  await mkdir(join(repo,'pkg'));await writeFile(join(repo,'pkg/file.txt'),'package\n');
  command(['add','.']);command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Package']);
  for(const [link,inside] of [['alias-root',''],['alias-pkg','pkg']]) {
    await symlink(join(repo,inside),join(root,link));cwdOverride=join(root,link);
    const r=await launch();
    expect(r.exit,r.stderr).toBe(0);
    const expected=join(real,'source-worktrees','designer',inside);
    expect(await realpath(r.data.worktree.cwd)).toBe(expected);expect(await realpath(r.data.selection.cwd)).toBe(expected);
    expect(await realpath((await records('native-launches.jsonl')).at(-1).cwd)).toBe(expected);
    await rm(join(real,'source-worktrees'),{recursive:true,force:true});command(['worktree','prune']);command(['branch','-D','ruach/designer']);
  }
});
test('inherited Git environment cannot move the worktree into another repository',async()=>{
  const other=join(root,'other');await mkdir(other);
  Bun.spawnSync([git,'-C',other,'init','--quiet']);
  const r=await launch([],{GIT_DIR:join(other,'.git'),GIT_WORK_TREE:other});
  expect(r.exit,r.stderr).toBe(0);
  expect(await realpath(r.data.worktree.cwd)).toBe(await realpath(target));
  expect(command(['worktree','list','--porcelain'])).toContain(target);
  expect(await readFile(join(target,'tracked.txt'),'utf8')).toBe('Committed source\n');
});
test('a helper descendant holding probe pipes cannot stall launch and is reaped from the helper group',async()=>{
  behavior.descendant=true;const started=Date.now();
  const r=await launch(['--dry-run']);
  expect(Date.now()-started).toBeLessThan(12000);expect(r.exit,r.stderr).toBe(0);
  const pids=(await readFile(join(root,'descendants.pid'),'utf8')).trim().split('\n').map(Number);
  await Bun.sleep(300);
  for(const pid of pids)expect(()=>process.kill(pid,0)).toThrow();
},20000);
test('a FIFO in place of a canonical role file fails promptly as unreadable',async()=>{
  const role=join(repo,'.agents/agents/architect.md');await rm(role);
  expect(Bun.spawnSync(['mkfifo',role]).exitCode).toBe(0);
  const started=Date.now();const r=await launch(['--dry-run']);
  expect(Date.now()-started).toBeLessThan(8000);expect(r.exit).toBe(2);expect(r.data.diagnostics[0].code).toBe('unreadable_file');
},20000);
for(const style of ['relative','empty'])test(`the probed native executable is the one the pane resolves with ${style} PATH entries`,async()=>{
  // Decoys sit where a relative or empty PATH entry resolves: the worker's cwd and, after the
  // worktree is created, the worktree itself (committed below).
  const marker=join(root,'decoy-ran');
  const decoy=`#!${process.execPath}\nawait import('node:fs').then(m=>m.appendFileSync(${JSON.stringify(marker)},'x'));\nawait import(${JSON.stringify(fake)});\n`;
  const dirName='rel-bin';await mkdir(join(root,dirName),{recursive:true});
  for(const dir of [join(root,dirName),root,repo]){await writeFile(join(dir,'claude'),decoy);await chmod(join(dir,'claude'),0o700);}
  command(['add','-f','claude']);command(['-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','--quiet','-m','Decoy']);
  const PATH=style==='relative'?[dirName,bin].join(delimiter):[bin,'',join(root,'elsewhere')].join(delimiter);
  const r=await launch([],{PATH});expect(r.exit,r.stderr).toBe(0);
  const workspace=(await records('mutations.jsonl'))[0].args;
  const paneEntries=workspace.find((x:string)=>x.startsWith('PATH=')).slice(5).split(delimiter);
  for(const entry of paneEntries){expect(entry).not.toBe('');expect(isAbsolute(entry)).toBe(true);}
  // First pane PATH match for claude must be the executable that was probed.
  const first=paneEntries.find((dir:string)=>Bun.spawnSync(['test','-x',join(dir,'claude')]).exitCode===0)!;
  const probedDecoy=await Bun.file(marker).exists();
  expect(probedDecoy).toBe(first!==bin);
});
