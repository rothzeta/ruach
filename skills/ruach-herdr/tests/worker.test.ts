import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, readFile, cp, rm, readdir, chmod, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { WebSocketServer } from 'ws';
import { createServer, type Server } from 'node:http';
// Fail once at module setup, before per-test fixtures, when the sandbox denies IPC.
const socketProbeRoot=await mkdtemp(join(tmpdir(),'ruach-herdr-socket-'));
try {
  const probe=createServer();
  await new Promise<void>((resolve,reject)=>{
    probe.once('error',reject);
    probe.listen(join(socketProbeRoot,'probe.sock'),()=>probe.close(error=>error?reject(error):resolve()));
  });
} catch(error) {
  const code=(error as NodeJS.ErrnoException).code??'unknown';
  throw new Error(`Test prerequisite failed: local Unix-domain socket binding is required (${code}). Run bun test in a sandbox that permits local sockets; no tests were skipped.`);
} finally {await rm(socketProbeRoot,{recursive:true,force:true});}
const worker=resolve(import.meta.dir,'../scripts/worker.ts');
const fixture=join(import.meta.dir,'fixtures');
let root:string,repo:string,home:string,temporary:string,bin:string,server:Server,wss:WebSocketServer;
let behavior:any,rpcCalls:any[];
const secret='existing developer secret $() `literal`';
const roleText='Canonical implementer instructions. Preserve all normal harness instructions.';
async function save(){await writeFile(join(root,'behavior.json'),JSON.stringify(behavior));}
async function lines(file:string){const body=await readFile(join(root,file),'utf8').catch(()=> '');return body.trim()?body.trim().split('\n').map(x=>JSON.parse(x)):[];}
async function skill(dir:string,name:string){await mkdir(dir,{recursive:true});await writeFile(join(dir,'SKILL.md'),`---\nname: ${name}\ndescription: Test skill.\n---\nTest body\n`);}
async function launch(command='start',extra:string[]=[],env:Record<string,string>={}) {
  await save();
  const placement=extra.includes('--placement')?[]:['--placement','pane'];
  const proc=Bun.spawn([process.execPath,worker,command,'--name','example-worker','--role','implementer','--cwd',repo,'--repo',repo,...placement,...extra],{cwd:root,env:{...process.env,HOME:home,CODEX_HOME:join(home,'.codex'),CLAUDE_CONFIG_DIR:join(home,'.claude'),PATH:bin,HERDR_ENV:'1',HERDR_PANE_ID:'w1:p1',FIXTURE_ROOT:root,...env},stdout:'pipe',stderr:'pipe'});
  const [stdout,stderr,exit]=await Promise.all([new Response(proc.stdout).text(),new Response(proc.stderr).text(),proc.exited]);
  return {exit,stdout,stderr,result:JSON.parse(stdout)};
}
async function noMutation() {expect(await lines('mutations.jsonl')).toEqual([]);expect(await readdir(temporary)).toEqual([]);expect(await lines('native-launches.jsonl')).toEqual([]);}
const explicit=['--kind','codex','--model','test-model','--effort','high'];
beforeEach(async()=>{
  root=await mkdtemp(join(tmpdir(),'ruach-herdr-test-'));
  repo=join(root,'checkout with spaces');home=join(root,'home');temporary=join(root,'temporary');bin=join(root,'bin');
  for(const p of [repo,home,temporary,bin,join(repo,'.agents','agents')])await mkdir(p,{recursive:true});
  await writeFile(join(repo,'.agents','agents','implementer.md'),roleText);
  await writeFile(join(repo,'.agents','agents','coordinator.md'),'Canonical coordinator instructions.');
  for(const role of ['architect','scout','reviewer'])await writeFile(join(repo,'.agents','agents',role+'.md'),'Canonical '+role+' instructions.');
  await cp(join(fixture,'routing'),join(repo,'.agents'),{recursive:true});
  await skill(join(repo,'.agents','skills','technical'),'ruach-technical');
  await skill(join(repo,'.agents','skills','workflow'),'ruach-workflow-feature');
  await skill(join(home,'.claude','skills','alias'),'ruach-workflow-user');
  await mkdir(join(home,'.claude'),{recursive:true});
  await writeFile(join(home,'.claude','settings.json'),JSON.stringify({permissions:{allow:['Read']},skillOverrides:{'ruach-technical':'off','ruach-workflow-feature':'on'}}));
  await writeFile(join(home,'.codex-sentinel'),'unchanged configuration');
  for(const exe of ['herdr','codex','claude','agy','omp']) {
    await writeFile(join(bin,exe),`#!${process.execPath}\nimport '${join(fixture,'fake-cli.ts')}';\n`);
    // imported file's argv[1] is the wrapper, making executable names visible.
    await chmod(join(bin,exe),0o700);
  }
  behavior={};rpcCalls=[];
  server=createServer();wss=new WebSocketServer({server});
  wss.on('connection',ws=>ws.on('message',bytes=>{
    const request=JSON.parse(bytes.toString());rpcCalls.push(request);
    if(!('id'in request))return;
    if(behavior.daemonRpcError){ws.send(JSON.stringify({id:request.id,error:{code:-1,message:secret}}));return;}
    let result:any={};
    if(request.method==='config/read')result={config:{developer_instructions:secret,skills:{config:[{path:join(repo,'unrelated'),enabled:false},{path:join(repo,'.agents','skills','workflow','SKILL.md'),enabled:true}]}}};
    if(request.method==='skills/list')result={data:[{cwd:request.params.cwds[0],errors:[],skills:[{name:'ruach-workflow-feature',path:join(repo,'.agents','skills','workflow','SKILL.md'),enabled:true},{name:'ruach-workflow-external',path:join(home,'external','SKILL.md'),enabled:true}]}]};
    if(behavior.badCatalog&&request.method==='skills/list')result={data:[]};
    ws.send(JSON.stringify({id:request.id,result}));
  }));
  await new Promise<void>(r=>server.listen(join(root,'native.sock'),r));
});
afterEach(async()=>{for(const client of wss.clients)client.terminate();await new Promise<void>(r=>wss.close(()=>r()));await new Promise<void>(r=>server.close(()=>r()));await rm(root,{recursive:true,force:true});});
test('explicit resolve and dry-run preserve config, hide all discovered workflows, and write no launch material',async()=>{
  for(const command of ['resolve','start']) {
    const r=await launch(command,[...explicit,'--temp-dir',temporary,...(command==='start'?['--dry-run']:[])]);
    expect(r.exit).toBe(0);expect(r.result.selection.model).toBe('test-model');expect(r.result.selection.cwd).toBe(repo);
    expect(r.result.hidden_workflows).toContain('ruach-workflow-external');expect(r.stdout+r.stderr).not.toContain(secret);
    await noMutation();
  }
  expect(rpcCalls.filter(x=>x.method==='config/read').every(x=>x.params.cwd===repo)).toBe(true);
  expect(await readFile(join(home,'.codex-sentinel'),'utf8')).toBe('unchanged configuration');
});
for(const kind of ['claude','codex'])for(const role of ['coordinator','implementer'])test(`${kind} ${role} uses explicit source roles, skills and catalogs`,async()=>{
  const sourceResources=join(root,'source resources'),catalogs=join(root,'source catalogs');
  await mkdir(join(sourceResources,'agents'),{recursive:true});
  await writeFile(join(sourceResources,'agents',`${role}.md`),'Source-only '+role+' instructions.');
  await skill(join(sourceResources,'skills','technical'),'ruach-source-technical');
  await skill(join(sourceResources,'skills','workflow'),'ruach-workflow-source');
  await cp(join(fixture,'routing'),catalogs,{recursive:true});
  const resourceArgs=['--resources',sourceResources,'--catalogs',catalogs];
  const offline=await asRole(role,'resolve',[...resourceArgs,'--offline']);
  expect(offline.exit).toBe(0);expect(offline.result.selection.roleFile).toBe(join(sourceResources,'agents',`${role}.md`));
  expect(offline.result.selection.resources).toBe(sourceResources);expect(offline.result.launchable).toBe(false);
  const r=await asRole(role,'start',[...resourceArgs,'--kind',kind,'--model','test-model','--effort','high']);
  expect(r.exit).toBe(0);expect(r.result.hidden_workflows.includes('ruach-workflow-source')).toBe(role!=='coordinator');
  const native=(await lines('native-launches.jsonl'))[0];
  if(kind==='claude') {
    expect(native.args).toContain(join(sourceResources,'agents',`${role}.md`));
    const generated=r.result.temporary_directory;
    expect(await stat(join(generated,'.claude/skills/ruach-source-technical'))).toBeDefined();
    expect(await stat(join(generated,'.claude/skills/ruach-workflow-source')).then(()=>true,()=>false)).toBe(role==='coordinator');
  } else {
    const developer=(Bun.TOML.parse as (text: string) => any)(native.args.find((arg:string)=>arg.startsWith('developer_instructions='))).developer_instructions;
    expect(developer).toContain('Source-only '+role+' instructions.');expect(developer).toContain(JSON.stringify(join(sourceResources,'skills')));
    const entries=(Bun.TOML.parse as (text: string) => any)(native.args.find((arg:string)=>arg.startsWith('skills.config='))).skills.config;
    if(role!=='coordinator')expect(entries.find((entry:any)=>entry.path===join(sourceResources,'skills','workflow','SKILL.md')).enabled).toBe(false);
  }
});
test('explicit Codex start composes developer text and existing skills, passes exact native args and starts once without focus',async()=>{
  const pass=['--add-dir',join(root,'directory with spaces $() `text`'),'--no-alt-screen'];
  const r=await launch('start',[...explicit,'--temp-dir',temporary,'--',...pass]);
  expect(r.exit).toBe(0);expect(r.result.submission_state).toBe('started');
  const mutations=await lines('mutations.jsonl');expect(mutations.map(x=>x.action)).toEqual(['split','start']);
  expect(mutations[0].args).toContain('--current');expect(mutations[0].args).toContain('--no-focus');expect(mutations[0].args).not.toContain('--focus');expect(mutations[0].args[mutations[0].args.indexOf('--cwd')+1]).toBe(repo);
  const native=(await lines('native-launches.jsonl'))[0];expect(native.cwd).toBe(repo);expect(native.args.slice(-pass.length)).toEqual(pass);
  const dev=native.args.find((a:string)=>a.startsWith('developer_instructions='));const parsed=(Bun.TOML.parse as (text: string) => any)(dev);
  expect(parsed.developer_instructions).toBe(secret+'\n\n'+roleText);
  const skills=(Bun.TOML.parse as (text: string) => any)(native.args.find((a:string)=>a.startsWith('skills.config='))).skills as any;
  expect(skills.config.find((e:any)=>e.path===join(repo,'unrelated')).enabled).toBe(false);
  expect(skills.config.filter((e:any)=>e.path.includes('workflow')).every((e:any)=>!e.enabled)).toBe(true);
  expect(r.stdout+r.stderr).not.toContain(secret);expect(r.stdout).not.toContain(pass[1]);
});
test('duplicate launcher options are rejected before any mutation',async()=>{
  const r=await launch('start',['--role','coordinator','--temp-dir',temporary]);
  expect(r.exit).toBe(2);await noMutation();
});
async function asRole(role:string,command='start',extra:string[]=[]) {
  await save();
  const p=Bun.spawn([process.execPath,worker,command,'--name','routed-worker','--role',role,'--cwd',repo,'--repo',repo,'--placement','pane','--temp-dir',temporary,...extra],{cwd:root,env:{...process.env,HOME:home,CODEX_HOME:join(home,'.codex'),CLAUDE_CONFIG_DIR:join(home,'.claude'),PATH:bin,FIXTURE_ROOT:root,HERDR_ENV:'1',HERDR_PANE_ID:'w1:p1'},stdout:'pipe',stderr:'pipe'});
  const [stdout,stderr,exit]=await Promise.all([new Response(p.stdout).text(),new Response(p.stderr).text(),p.exited]);return {exit,stdout,stderr,result:JSON.parse(stdout)};
}
test('routed start and route override launch the data-selected native profile',async()=>{
  const lead=await asRole('coordinator');expect(lead.exit).toBe(0);expect(lead.result.selection.kind).toBe('claude');expect(lead.result.selection.route).toBe('lead.v1');expect(lead.result.hidden_workflows).toEqual([]);
  const temp=lead.result.temporary_directory;expect((await stat(join(temp,'.claude','skills','ruach-workflow-feature'))).isDirectory()).toBe(true);
  const technical=await readFile(join(home,'.claude','settings.json'),'utf8');expect(JSON.parse(technical).permissions.allow).toEqual(['Read']);expect(JSON.parse(technical).skillOverrides['ruach-technical']).toBe('off');
  const overridden=await asRole('implementer','resolve',['--route','lead.v1']);expect(overridden.exit).toBe(0);expect(overridden.result.selection.kind).toBe('claude');expect(overridden.result.hidden_workflows).toContain('ruach-workflow-feature');
});
test('Claude worker adds canonical role and overlays only workflow settings; technical skills and user config remain',async()=>{
  const r=await launch('start',['--kind','claude','--model','test-claude','--effort','high','--temp-dir',temporary]);expect(r.exit).toBe(0);
  const temp=r.result.temporary_directory;expect(await readdir(join(temp,'.claude','skills'))).toEqual(['ruach-technical']);
  const observation=(await lines('observed.jsonl'))[0];expect(observation.settings.skillOverrides['ruach-workflow-feature']).toBe('off');expect(observation.settings.skillOverrides['ruach-workflow-user']).toBe('off');expect(observation.settings.skillOverrides['ruach-technical']).toBeUndefined();
  const native=(await lines('native-launches.jsonl'))[0];expect(native.args[native.args.indexOf('--append-system-prompt-file')+1]).toBe(join(repo,'.agents','agents','implementer.md'));
  expect(JSON.parse(await readFile(join(home,'.claude','settings.json'),'utf8')).skillOverrides['ruach-workflow-feature']).toBe('on');
});
for(const [name,file,content] of [
  ['duplicate key','models.yaml','models:\n  same: {harness: codex, native_model: a}\n  same: {harness: claude, native_model: b}\n'],
  ['missing model','routing.yaml','routes:\n  lead: {model: missing, effort: high}\n'],
  ['invalid effort type','routing.yaml','routes:\n  lead: {model: coordination.v1, effort: false}\n'],
  ['missing route','roles.yaml','roles:\n  implementer: {preferred: missing}\n'],
  ['unknown keys','roles.yaml','roles:\n  implementer: {preferred: build.v1, surprise: yes}\n'],
  ['invalid YAML','models.yaml','models: [\n'],
] as const) test(`invalid routing ${name} fails before any mutation`,async()=>{await writeFile(join(repo,'.agents',file),content);const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});
for(const kind of ['pi','opencode','dsh','agy','omp'])test(`${kind} absent or unverified adapter fails accurately without mutation`,async()=>{const r=await launch('start',['--kind',kind,'--model','test-model','--temp-dir',temporary]);expect(r.exit).toBe(3);await noMutation();});
test('unsupported Herdr kind fails even when the harness executable exists',async()=>{await cp(join(bin,'codex'),join(bin,'dsh'));const r=await launch('start',['--kind','dsh','--model','test-model','--temp-dir',temporary]);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('unsupported_herdr_kind');await noMutation();});
for(const env of [{HERDR_ENV:'0'},{HERDR_PANE_ID:''}] as Record<string,string>[])test('absent caller context fails without mutation',async()=>{const r=await launch('start',[...explicit,'--temp-dir',temporary],env);expect(r.exit).toBe(3);await noMutation();});
test('unreachable Herdr and both unavailable Codex readers fail before launch mutation',async()=>{behavior.unreachable=true;let r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(3);await noMutation();behavior.unreachable=false;behavior.daemonMissing=true;behavior.stdioUnavailable=true;r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(3);await noMutation();});
test('missing Herdr executable fails without mutation',async()=>{await rm(join(bin,'herdr'));let r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(3);await noMutation();});
test('invalid native catalog never replaces user configuration',async()=>{behavior.badCatalog=true;const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(3);await noMutation();});
test('narrow caller pane splits down and startup failure reports uncertain state without retry or leaked native output',async()=>{behavior.width=80;behavior.startFailure=true;behavior.leak=secret;const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(4);expect(r.result.submission_state).toBe('unknown');expect(r.result.pane).toBe('w1:p2');const mutations=await lines('mutations.jsonl');expect(mutations.filter(x=>x.action==='start')).toHaveLength(1);expect(mutations[0].args[mutations[0].args.indexOf('--direction')+1]).toBe('down');expect(r.stdout+r.stderr).not.toContain(secret);});
test('split failure never submits an agent and retains private config for uncertain state',async()=>{behavior.splitFailure=true;const r=await launch('start',['--kind','claude','--model','test-claude','--temp-dir',temporary]);expect(r.exit).toBe(4);expect((await lines('mutations.jsonl')).map(x=>x.action)).toEqual(['split']);expect(r.result.temporary_directory).toBeTruthy();});
for(const args of [['--model','replacement'],['-c','developer_instructions=secret'],['--resume'],['--api-key','secret'],['initial prompt'],['--print']])test('conflicting native argv cannot bypass role/config/session contracts',async()=>{const r=await launch('start',[...explicit,'--temp-dir',temporary,'--',...args]);expect(r.exit).toBe(2);await noMutation();});
test('duplicate live names fail without splitting',async()=>{behavior.agents=[{name:'example-worker'}];const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});
test('routed implementer uses its assigned Codex route',async()=>{const r=await asRole('implementer','resolve');expect(r.exit).toBe(0);expect(r.result.selection.kind).toBe('codex');expect(r.result.selection.route).toBe('build.v1');await noMutation();});
test('Codex coordinator preserves existing workflow and unrelated skill entries',async()=>{const r=await asRole('coordinator','start',explicit);expect(r.exit).toBe(0);expect(r.result.hidden_workflows).toEqual([]);const native=(await lines('native-launches.jsonl'))[0];const skills=(Bun.TOML.parse as (text: string) => any)(native.args.find((a:string)=>a.startsWith('skills.config='))).skills as any;expect(skills.config.find((e:any)=>e.path.endsWith('workflow/SKILL.md')).enabled).toBe(true);expect(skills.config.find((e:any)=>e.path.endsWith('unrelated')).enabled).toBe(false);});
test('Claude dry-run does not create settings or skill links',async()=>{const r=await launch('start',['--kind','claude','--model','test-model','--temp-dir',temporary,'--dry-run']);expect(r.exit).toBe(0);await noMutation();});
test('Claude additional directory workflow is hidden and native argv preserves whitespace and Unicode',async()=>{const extra=join(root,'external space ü $()');await skill(join(extra,'.claude','skills','alias'),'ruach-workflow-added');const pass=['--add-dir',extra,'--verbose'];const r=await launch('start',['--kind','claude','--model','test-model','--temp-dir',temporary,'--',...pass]);expect(r.exit).toBe(0);expect(r.result.hidden_workflows).toContain('ruach-workflow-added');expect((await lines('native-launches.jsonl'))[0].args.slice(-pass.length)).toEqual(pass);});
test('entire routing graph is validated even when selected route is valid',async()=>{const file=join(repo,'.agents','routing.yaml');await writeFile(file,(await readFile(file,'utf8'))+'  broken.v1: {model: missing, effort: high}\n');const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('missing_model');await noMutation();});
test('missing selected role file fails before mutation',async()=>{await rm(join(repo,'.agents','agents','implementer.md'));const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});
test('a routed profile requires a nonempty string effort',async()=>{for(const effort of ['', ', effort: null', ', effort: 1']){await writeFile(join(repo,'.agents','routing.yaml'),`routes:\n  build.v1: {model: implementation.v1${effort}}\n`);const r=await launch('resolve',['--offline']);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('invalid_string');await noMutation();}});
test('direct selection excludes route and routed effort cannot be overridden',async()=>{for(const extra of [[...explicit,'--route','lead.v1'],['--effort','high']]){const r=await launch('start',[...extra,'--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();}});
test('missing Codex executable fails before mutation',async()=>{await rm(join(bin,'codex'));const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].field).toBe('codex');await noMutation();});
test('offline resolution reads routing without harness/Herdr prerequisites and never authorizes launch',async()=>{await rm(join(bin,'herdr'));await rm(join(bin,'codex'));const r=await launch('resolve',['--offline','--temp-dir',temporary],{HERDR_ENV:'0',HERDR_PANE_ID:''});expect(r.exit).toBe(0);expect(r.result.selection.kind).toBe('codex');expect(r.result.launchable).toBe(false);expect(r.result.argv).toEqual([]);expect(rpcCalls).toEqual([]);await noMutation();});
test('start refuses offline bypass',async()=>{const r=await launch('start',[...explicit,'--offline','--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});
test('YAML aliases fail before mutation',async()=>{await writeFile(join(repo,'.agents','models.yaml'),'models:\n  implementation.v1: &x {harness: codex, native_model: test-model}\n  coordination.v1: *x\n');const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});
test('startup wall-clock timeout is uncertain and never resubmits',async()=>{behavior.startTimeout=true;const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(4);expect(r.result.submission_state).toBe('unknown');expect(r.result.diagnostics[0].code).toBe('start_uncertain');expect((await lines('mutations.jsonl')).filter(x=>x.action==='start')).toHaveLength(1);expect(await lines('native-launches.jsonl')).toEqual([]);},45000);
test('Claude hides existing nested project workflows before later native file discovery',async()=>{await skill(join(repo,'package','.claude','skills','nested'),'ruach-workflow-nested');const r=await launch('start',['--kind','claude','--model','test-model','--temp-dir',temporary]);expect(r.exit).toBe(0);expect(r.result.hidden_workflows).toContain('ruach-workflow-nested');expect((await lines('observed.jsonl'))[0].settings.skillOverrides['ruach-workflow-nested']).toBe('off');});
test('standalone skill without installed dependencies fails clearly without implicit installation',async()=>{const copy=join(root,'uninstalled skill');await mkdir(copy);await cp(resolve(import.meta.dir,'../scripts'),join(copy,'scripts'),{recursive:true});await cp(resolve(import.meta.dir,'../package.json'),join(copy,'package.json'));const p=Bun.spawn([process.execPath,join(copy,'scripts','worker.ts'),'resolve','--offline','--name','portable-worker','--role','implementer','--cwd',repo,'--repo',repo],{cwd:copy,env:{...process.env,HOME:home,PATH:bin},stdout:'pipe',stderr:'pipe'});const stdout=await new Response(p.stdout).text();expect(await p.exited).toBe(2);expect(JSON.parse(stdout).diagnostics[0].code).toBe('dependencies_missing');expect(await readdir(copy)).toEqual(['package.json','scripts']);await noMutation();});
test('split preserves caller executable and harness configuration roots as exact env argv values',async()=>{const r=await launch('start',[...explicit,'--temp-dir',temporary]);expect(r.exit).toBe(0);const args=(await lines('mutations.jsonl'))[0].args;for(const value of [`PATH=${bin}`,`HOME=${home}`,`CODEX_HOME=${join(home,'.codex')}`,`CLAUDE_CONFIG_DIR=${join(home,'.claude')}`]){const index=args.indexOf(value);expect(index).toBeGreaterThan(0);expect(args[index-1]).toBe('--env');}});

for(const role of ['architect','scout','reviewer'])test(`routed ${role} uses its declared preference`,async()=>{const r=await asRole(role,'resolve',['--offline']);expect(r.exit).toBe(0);expect(r.result.selection.route).toBe(role==='architect'?'lead.v1':'build.v1');expect(r.result.selection.effort).toBe('high');await noMutation();});
test('declared route outside role alternatives is rejected before mutation',async()=>{const r=await asRole('implementer','start',['--route','unassigned.v1']);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('disallowed_route');await noMutation();});
for(const [name,edit,code] of [
  ['missing selected role',(s:string)=>s.replace(/  implementer:[\s\S]*?(?=  reviewer:)/,''),'missing_role'],
  ['missing alternative',(s:string)=>s.replace('[lead.v1]','[missing.v1]'),'missing_route'],
  ['nonlist alternatives',(s:string)=>s.replace('[lead.v1]','lead.v1'),'invalid_routes'],
  ['unknown field',(s:string)=>s.replace('preferred: lead.v1','preferred: lead.v1\n    surprise: true'),'unknown_key'],
  ['missing preference',(s:string)=>s.replace('preferred: lead.v1','alternatives: []'),'invalid_string'],
] as const)test(`invalid role catalog ${name} fails before mutation`,async()=>{const file=join(repo,'.agents','roles.yaml');await writeFile(file,edit(await readFile(file,'utf8')));const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe(code);await noMutation();});
for(const value of ['unknown-harness','codexx'])test('unknown routed harness fails clearly',async()=>{const file=join(repo,'.agents','models.yaml');await writeFile(file,(await readFile(file,'utf8')).replace('harness: codex',`harness: ${value}`));const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('invalid_kind');await noMutation();});
test('empty catalogs fail before mutation',async()=>{await writeFile(join(repo,'.agents','models.yaml'),'models: {}\n');const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);await noMutation();});

for(const [name,data,code] of [
  ['nonstring key','models:\n  1: {harness: codex, native_model: test-model}\n','invalid_yaml'],
  ['missing native model','models:\n  implementation.v1: {harness: codex}\n','invalid_string'],
  ['unknown model field','models:\n  implementation.v1: {harness: codex, native_model: test-model, efforts: [high]}\n','unknown_key'],
] as const)test(`invalid model catalog ${name} fails before mutation`,async()=>{await writeFile(join(repo,'.agents','models.yaml'),data);const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe(code);await noMutation();});

async function portableRouting() {
  await cp(join(fixture,'portable-routing'),join(repo,'.agents'),{recursive:true});
  await writeFile(join(repo,'.agents','agents','builder.md'),'Portable builder role.');
}
test('portable role names and non-high adapter efforts resolve and prepare without writes',async()=>{
  await portableRouting();
  for(const [command,extra,kind,effort] of [['resolve',[],'codex','medium'],['start',['--dry-run'],'codex','medium'],['resolve',['--route','review.low'],'claude','low']] as const) {
    const r=await asRole('builder',command,[...extra]);expect(r.exit).toBe(0);expect(r.result.selection.role).toBe('builder');expect(r.result.selection.kind).toBe(kind);expect(r.result.selection.effort).toBe(effort);
    if(kind==='codex')expect(r.result.argv).toContain('model_reasoning_effort="medium"');else expect(r.result.argv.slice(r.result.argv.indexOf('--effort'),r.result.argv.indexOf('--effort')+2)).toEqual(['--effort','low']);
    await noMutation();
  }
});
test('only the selected declared role needs a canonical source file',async()=>{
  await portableRouting();const r=await asRole('builder','resolve',['--offline']);expect(r.exit).toBe(0);expect(r.result.selection.role).toBe('builder');await noMutation();
});
test('coordinator routing comes from preference data, including Codex',async()=>{
  const file=join(repo,'.agents','roles.yaml');await writeFile(file,(await readFile(file,'utf8')).replace('preferred: lead.v1','preferred: build.v1'));
  const r=await asRole('coordinator','resolve');expect(r.exit).toBe(0);expect(r.result.selection.kind).toBe('codex');expect(r.result.hidden_workflows).toEqual([]);await noMutation();
});
for(const [route,effort] of [['work.medium','off'],['review.low','none']] as const)test('selected adapter rejects unsupported routed effort before mutation',async()=>{
  await portableRouting();const file=join(repo,'.agents','routing.yaml');await writeFile(file,(await readFile(file,'utf8')).replace(route==='work.medium'?'effort: medium':'effort: low',`effort: ${effort}`));
  const r=await asRole('builder','start',['--route',route]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('unsupported_effort');await noMutation();
});
for(const kind of ['pi','opencode','dsh','omp','agy'])test(`known gated routed ${kind} reports unavailable capability before mutation`,async()=>{
  const file=join(repo,'.agents','models.yaml');await writeFile(file,(await readFile(file,'utf8')).replace('harness: codex',`harness: ${kind}`));
  await cp(join(bin,'codex'),join(bin,kind));const r=await launch('start',['--temp-dir',temporary]);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe(kind==='dsh'?'unsupported_herdr_kind':'unsupported_adapter');await noMutation();
});
for(const [command,extra] of [['resolve',[]],['start',['--dry-run']]] as const)test(`${command} preparation requires live Herdr context`,async()=>{
  const r=await launch(command,[...explicit,...extra],{HERDR_ENV:'0',HERDR_PANE_ID:''});expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('missing_herdr_context');await noMutation();
});

for(const cache of ['empty','technical','native-format'])test(`Claude ${cache} synced cache permits preferred worker preparation without writes`,async()=>{
  const synced=join(home,'.claude','skills','synced');await mkdir(synced,{recursive:true});
  if(cache==='technical')await skill(join(synced,'download'),'ruach-technical-synced');
  if(cache==='native-format'){await mkdir(join(synced,'download'));await writeFile(join(synced,'download','SKILL.md'),'Native cache content outside local skill validation.');}
  const before=await readFile(join(home,'.claude','settings.json'));
  for(const [command,extra] of [['resolve',[]],['start',['--dry-run']]] as const){
    const r=await asRole('architect',command,[...extra,'--','--add-dir',home]);expect(r.exit).toBe(0);expect(r.result.selection.route).toBe('lead.v1');expect(r.result.selection.kind).toBe('claude');
    expect(r.result.launchable).toBe(true);expect(r.result.submission_state).toBe('not-submitted');await noMutation();
  }
  expect(await readFile(join(home,'.claude','settings.json'))).toEqual(before);
});
test('preferred Claude architect preserves synced/plugin/managed/legacy sources and supplies no workflow bodies',async()=>{
  const workflowBody='PRIVATE WORKFLOW BODY $() `not worker instructions`';
  const synced=join(home,'.claude','skills','synced','download','SKILL.md');
  const plugin=join(root,'plugin','skills','workflow','SKILL.md');
  const managed=join(root,'managed');behavior.managedRoot=managed;
  const sources=[synced,plugin,join(managed,'managed-settings.json'),join(managed,'managed-settings.d','policy.json'),join(managed,'.claude','skills','workflow','SKILL.md'),join(repo,'.claude','commands','ruach-workflow-old.md')];
  for(const file of sources){await mkdir(resolve(file,'..'),{recursive:true});await writeFile(file,file.endsWith('.json')?JSON.stringify({customization:workflowBody}):`---\nname: ruach-workflow-custom\ndescription: Workflow fixture.\n---\n${workflowBody}`);}
  const user=join(home,'.claude','settings.json');await writeFile(user,JSON.stringify({permissions:{allow:['Read']},skillOverrides:{'ruach-technical':'off','ruach-workflow-feature':'on'},enabledPlugins:{'example@market':true,'uninspectable@market':true}}));
  const registry=join(home,'.claude','plugins','installed_plugins.json');await mkdir(resolve(registry,'..'),{recursive:true});await writeFile(registry,JSON.stringify({plugins:{'example@market':[{installPath:join(root,'plugin')}]}}));
  const known=join(repo,'.agents','skills','workflow','SKILL.md');await writeFile(known,`---\nname: ruach-workflow-feature\ndescription: Known workflow.\n---\n${workflowBody}`);
  const files=[...sources,user,registry,known];const before=await Promise.all(files.map(f=>readFile(f)));
  for(const [command,extra] of [['resolve',[]],['start',['--dry-run']]] as const){const r=await asRole('architect',command,[...extra]);expect(r.exit).toBe(0);expect(r.result.hidden_workflows).toContain('ruach-workflow-feature');expect(r.stdout+r.stderr).not.toContain(workflowBody);await noMutation();}
  const r=await asRole('architect');expect(r.exit).toBe(0);expect(r.result.selection.route).toBe('lead.v1');
  const native=(await lines('native-launches.jsonl'))[0];expect(native.args[native.args.indexOf('--append-system-prompt-file')+1]).toBe(join(repo,'.agents','agents','architect.md'));expect(native.args.join(' ')).not.toContain(workflowBody);
  for(const flag of ['--bare','--safe-mode','--disable-slash-commands','--setting-sources'])expect(native.args).not.toContain(flag);
  const observed=(await lines('observed.jsonl'))[0];expect(observed.settings).toEqual({skillOverrides:{'ruach-workflow-feature':'off','ruach-workflow-user':'off'}});
  expect((await lines('customizations.jsonl'))[0].managedSourcesPresent).toBe(true);
  const temp=r.result.temporary_directory;expect(await readdir(join(temp,'.claude','skills'))).toEqual(['ruach-technical']);
  for await(const file of new Bun.Glob('**/*').scan({cwd:temp,dot:true,onlyFiles:true,followSymlinks:true}))expect(await readFile(join(temp,file),'utf8')).not.toContain(workflowBody);
  expect(await Promise.all(files.map(f=>readFile(f)))).toEqual(before);
  const lead=await asRole('coordinator');expect(lead.exit).toBe(0);expect(lead.result.hidden_workflows).toEqual([]);expect((await stat(join(lead.result.temporary_directory,'.claude','skills','ruach-workflow-feature'))).isDirectory()).toBe(true);
  expect(await Promise.all(files.map(f=>readFile(f)))).toEqual(before);
});
test('Claude linked-worktree fallback does not block canonical worker instructions',async()=>{
  await writeFile(join(bin,'git'),`#!${process.execPath}\nconsole.log('../main/.git');\n`);await chmod(join(bin,'git'),0o700);
  const r=await asRole('architect','resolve');expect(r.exit).toBe(0);expect(r.result.argv).toContain(join(repo,'.agents','agents','architect.md'));await noMutation();
});

async function readersStopped() {
  const readers=await lines('stdio-processes.jsonl');expect(readers.length).toBeGreaterThan(0);
  for(const reader of readers){let code;try{process.kill(reader.pid,0);}catch(error){code=(error as NodeJS.ErrnoException).code;}expect(code).toBe('ESRCH');}
}
test('matching existing Codex daemon is preferred over stdio',async()=>{
  const r=await launch('resolve',explicit);expect(r.exit).toBe(0);expect(r.result.config_reader).toBe('daemon');expect(await lines('stdio-processes.jsonl')).toEqual([]);await noMutation();
});
test('no-daemon Codex resolve, dry-run and start preserve layered native config and terminate their readers',async()=>{
  behavior.daemonMissing=true;const configHome=join(home,'.codex');await mkdir(configHome);await mkdir(join(repo,'.codex'));
  const layered='project layered developer secret $() `literal`';
  const user=join(configHome,'config.toml'),project=join(repo,'.codex','config.toml');
  await writeFile(user,`developer_instructions = "global developer"\n[skills]\nconfig = [{path = ${JSON.stringify(join(repo,'unrelated'))}, enabled = false}, {path = ${JSON.stringify(join(repo,'.agents','skills','workflow','SKILL.md'))}, enabled = true}]\n`);
  await writeFile(project,`developer_instructions = ${JSON.stringify(layered)}\n`);
  const protectedFiles=[user,project,join(configHome,'AGENTS.md'),join(configHome,'profile.config.toml'),join(configHome,'auth.json'),join(repo,'.agents','skills','technical','SKILL.md')];
  for(const file of protectedFiles.slice(2,5))await writeFile(file,'untouched user fixture');
  const before=await Promise.all(protectedFiles.map(f=>readFile(f)));
  for(const [command,extra] of [['resolve',[]],['start',['--dry-run']]] as const){
    const r=await launch(command,[...explicit,...extra]);expect(r.exit).toBe(0);expect(r.result.config_reader).toBe('stdio');expect(r.result.hidden_workflows).toContain('ruach-workflow-feature');expect(r.stdout+r.stderr).not.toContain(layered);await noMutation();await readersStopped();
  }
  const r=await launch('start',[...explicit,'--permissions','auto-review']);expect(r.exit).toBe(0);expect(r.result.config_reader).toBe('stdio');
  const native=(await lines('native-launches.jsonl'))[0];expect((Bun.TOML.parse as (text: string) => any)(native.args.find((a:string)=>a.startsWith('developer_instructions='))).developer_instructions).toBe(layered+'\n\n'+roleText);
  const skills=((Bun.TOML.parse as (text: string) => any)(native.args.find((a:string)=>a.startsWith('skills.config='))).skills as any).config;
  expect(skills.find((e:any)=>e.path===join(repo,'unrelated')).enabled).toBe(false);expect(skills.filter((e:any)=>e.path.includes('workflow')).every((e:any)=>!e.enabled)).toBe(true);
  expect(native.args).toContain('--approve-for-me');expect(await Promise.all(protectedFiles.map(f=>readFile(f)))).toEqual(before);await readersStopped();
  const requests=await lines('stdio-requests.jsonl');expect(requests.every(r=>['initialize','initialized','config/read','skills/list'].includes(r.method))).toBe(true);
  expect(requests.filter(r=>r.method==='config/read').every(r=>r.params.cwd===repo&&r.params.includeLayers===false)).toBe(true);
  expect(requests.filter(r=>r.method==='skills/list').every(r=>r.params.cwds.length===1&&r.params.cwds[0]===repo&&r.params.forceReload===false)).toBe(true);
  expect((await lines('stdio-closed.jsonl')).length).toBe(3);
});
for(const cause of ['daemonMismatch','daemonRpcError'])test(`Codex ${cause} falls back to short-lived native inspection`,async()=>{
  behavior[cause]=true;const r=await launch('resolve',explicit);expect(r.exit).toBe(0);expect(r.result.config_reader).toBe('stdio');expect(r.stdout+r.stderr).not.toContain(secret);await readersStopped();await noMutation();
});
test('Codex reader is forcibly terminated when it lingers after stdin EOF',async()=>{
  behavior.daemonMissing=true;behavior.stdioStayAlive=true;const r=await launch('resolve',explicit);expect(r.exit).toBe(0);await readersStopped();await noMutation();
});
test('unavailable daemon and malformed stdio protocol fail without leaking output or leaving a reader',async()=>{
  behavior.daemonMissing=true;behavior.stdioMalformed=true;const r=await launch('resolve',explicit);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('codex_config_unavailable');expect(r.stdout+r.stderr).not.toContain('invalid private output');await readersStopped();await noMutation();
});
for(const kind of ['claude','codex'])test(`${kind} default and explicit inherit policy add no native permission override`,async()=>{
  for(const extra of [[],['--permissions','inherit']]){const r=await launch('resolve',['--kind',kind,'--model','test-model',...extra]);expect(r.exit).toBe(0);expect(r.result.permissions).toBe('inherit');expect(r.result.selection.permissions).toBe('inherit');expect(r.result.argv).not.toContain('--approve-for-me');expect(r.result.argv).not.toContain('--permission-mode');await noMutation();}
});
for(const kind of ['claude','codex'])test(`${kind} auto-review policy is adapter-owned in preparation and startup`,async()=>{
  const extra=['--kind',kind,'--model','test-model','--permissions','auto-review'];
  for(const [command,flags] of [['resolve',[]],['start',['--dry-run']]] as const){const r=await launch(command,[...extra,...flags]);expect(r.exit).toBe(0);expect(r.result.permissions).toBe('auto-review');if(kind==='codex')expect(r.result.argv).toContain('--approve-for-me');else expect(r.result.argv.slice(r.result.argv.indexOf('--permission-mode'),r.result.argv.indexOf('--permission-mode')+2)).toEqual(['--permission-mode','auto']);await noMutation();}
  const r=await launch('start',extra);expect(r.exit).toBe(0);const args=(await lines('native-launches.jsonl'))[0].args;
  if(kind==='codex')expect(args.filter((a:string)=>a==='--approve-for-me')).toHaveLength(1);else expect(args.slice(args.indexOf('--permission-mode'),args.indexOf('--permission-mode')+2)).toEqual(['--permission-mode','auto']);
  for(const flag of ['--dangerously-bypass-approvals-and-sandbox','--dangerously-skip-permissions','bypassPermissions','--full-auto'])expect(args).not.toContain(flag);
});
for(const kind of ['pi','opencode','dsh','omp','agy'])test(`${kind} without verified auto-review mapping fails before mutation`,async()=>{
  behavior.kinds='claude, codex, pi, opencode, dsh, omp, agy';await cp(join(bin,'codex'),join(bin,kind));const r=await launch('start',['--kind',kind,'--model','test-model','--permissions','auto-review']);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('unsupported_permissions');await noMutation();
});
for(const [kind,args] of [['claude',['--permission-mode','auto']],['claude',['--permission-mode=bypassPermissions']],['codex',['--ask-for-approval','never']],['codex',['-a','on-request']],['codex',['--sandbox=workspace-write']],['codex',['-s','danger-full-access']],['codex',['--approve-for-me']]] as const)test(`${kind} conflicting native permission argv is rejected before config inspection`,async()=>{
  behavior.daemonMissing=true;const r=await launch('start',['--kind',kind,'--model','test-model','--permissions','auto-review','--',...args]);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('conflicting_native_argument');expect(rpcCalls).toEqual([]);expect(await lines('stdio-processes.jsonl')).toEqual([]);await noMutation();
});
for(const kind of ['claude','codex'])test(`${kind} auto-review requires installed help support`,async()=>{
  behavior.noAutoReview=true;const r=await launch('start',['--kind',kind,'--model','test-model','--permissions','auto-review']);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('unsupported_cli');expect(rpcCalls).toEqual([]);await noMutation();
});
test('invalid and duplicate portable permission policies fail before mutation',async()=>{
  for(const args of [['--permissions','bypass'],['--permissions','auto-review','--permissions','inherit']]){const r=await launch('start',[...explicit,...args]);expect(r.exit).toBe(2);await noMutation();}
});
test('offline auto-review selection is write-free and never starts config inspection',async()=>{
  behavior.daemonMissing=true;const r=await launch('resolve',[...explicit,'--offline','--permissions','auto-review']);expect(r.exit).toBe(0);expect(r.result.permissions).toBe('auto-review');expect(r.result.launchable).toBe(false);expect(await lines('stdio-processes.jsonl')).toEqual([]);expect(rpcCalls).toEqual([]);await noMutation();
});

test('Codex no-daemon coordinator retains enabled workflows and unrelated skill configuration',async()=>{
  behavior.daemonMissing=true;const r=await asRole('coordinator','start',[...explicit,'--permissions','auto-review']);expect(r.exit).toBe(0);expect(r.result.hidden_workflows).toEqual([]);expect(r.result.config_reader).toBe('stdio');
  const native=(await lines('native-launches.jsonl'))[0];const skills=((Bun.TOML.parse as (text: string) => any)(native.args.find((a:string)=>a.startsWith('skills.config='))).skills as any).config;
  expect(skills.find((e:any)=>e.path.endsWith('workflow/SKILL.md')).enabled).toBe(true);expect(skills.find((e:any)=>e.path.endsWith('unrelated')).enabled).toBe(false);await readersStopped();
});
test('Codex unresponsive stdio reader hits its deadline and leaves no child or launch mutation',async()=>{
  behavior.daemonMissing=true;behavior.stdioNoReply=true;const r=await launch('resolve',explicit);expect(r.exit).toBe(3);expect(r.result.diagnostics[0].code).toBe('codex_config_unavailable');await readersStopped();await noMutation();
},20000);
for(const style of ['no-frontmatter','no-name','nested-unrelated'])test(`valid unrelated Claude skill (${style}) does not block launch preparation`,async()=>{
  const dir=join(repo,'.claude','skills','third-party');await mkdir(dir,{recursive:true});
  if(style==='no-frontmatter')await writeFile(join(dir,'SKILL.md'),'# Third party\nPlain instructions without frontmatter.\n');
  else await writeFile(join(dir,'SKILL.md'),'---\ndescription: Name comes from the directory.\n---\nBody\n');
  if(style==='nested-unrelated'){await mkdir(join(repo,'pkg','.claude','skills','local'),{recursive:true});await writeFile(join(repo,'pkg','.claude','skills','local','SKILL.md'),'No frontmatter either.\n');}
  for(const [command,extra] of [['resolve',[]],['start',['--dry-run']]] as const){
    const r=await asRole('architect',command,[...extra]);expect(r.exit,r.stderr).toBe(0);expect(r.result.launchable).toBe(true);
  }
  await noMutation();
});
for(const defect of ['no-frontmatter','no-name','bad-name'])test(`Ruach-owned skill with ${defect} stays strictly validated`,async()=>{
  const dir=join(repo,'.agents','skills','owned');await mkdir(dir,{recursive:true});
  await writeFile(join(dir,'SKILL.md'),defect==='no-frontmatter'?'# Owned\n':defect==='no-name'?'---\ndescription: x\n---\nBody\n':'---\nname: Not Valid\n---\nBody\n');
  const r=await asRole('architect','start',['--dry-run']);expect(r.exit).toBe(2);expect(r.result.diagnostics[0].code).toBe('invalid_skill');await noMutation();
});
