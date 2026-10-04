import { resolve, join } from 'node:path';
import { mkdtemp, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { contents, directory, fail, Failure, identifier, kinds, efforts, string, type Selection, type Permissions } from './contracts';
import { executable, json, run } from './process';
import { routed } from './routing';
import { prepare } from './adapters';
const usage='bun scripts/worker.ts resolve|start --name NAME --role ROLE --cwd DIR [--repo DIR] [--route ID | --kind KIND --model MODEL [--effort LEVEL]] [--dry-run | --offline] [--temp-dir DIR] [--permissions inherit|auto-review] [-- NATIVE_FLAGS]';
function options(args:string[]) {
  if(args.includes('--help')||args.includes('-h')) {console.log(JSON.stringify({schema_version:1,ok:true,usage}));process.exit(0);}
  const command=args.shift();
  if(!['resolve','start'].includes(command??''))fail(2,'usage','Expected resolve or start','command');
  const values:Record<string,string>={};let dry=false,offline=false,pass:string[]=[];
  const keys=['name','role','cwd','repo','route','kind','model','effort','temp-dir','permissions'];
  for(let i=0;i<args.length;i++) {
    const token=args[i];
    if(token==='--'){pass=args.slice(i+1);break;}
    if(token==='--offline'){if(offline||command!=='resolve')fail(2,'usage','--offline is allowed once for resolve','offline');offline=true;continue;}
    if(token==='--dry-run'){if(dry||command!=='start')fail(2,'usage','--dry-run is allowed once for start','dry-run');dry=true;continue;}
    const key=token.slice(2);
    if(!token.startsWith('--') || !keys.includes(key) || Object.hasOwn(values,key))fail(2,'usage','Unknown or duplicate launcher option','argv');
    if(++i>=args.length||args[i].startsWith('--'))fail(2,'usage','Launcher option requires a value',key);
    values[key]=string(args[i],key);
  }
  for(const key of ['name','role','cwd'])if(!values[key])fail(2,'usage','Missing required launcher option',key);
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(values.name))fail(2,'invalid_name','Herdr name must match [a-z][a-z0-9_-]{0,31}','name');
  identifier(values.role,'role');if(values.route)string(values.route,'route');
  const direct=values.kind!==undefined || values.model!==undefined;
  if(direct && (!values.kind||!values.model||values.route))fail(2,'invalid_selection','Direct selection requires kind and model and excludes route','selection');
  if(!direct&&values.effort)fail(2,'invalid_selection','Routed effort comes only from YAML','effort');
  if(direct&&!kinds.includes(values.kind as any))fail(2,'invalid_kind','Unknown harness kind','kind');
  if(values.effort&&!efforts.includes(values.effort as any))fail(2,'invalid_effort','Unknown effort value','effort');
  if(values.permissions && !['inherit','auto-review'].includes(values.permissions))fail(2,'invalid_permissions','Expected inherit or auto-review','permissions');
  return {command,values,dry,offline,pass,direct};
}
function sha(s:string) {return createHash('sha256').update(s).digest('hex');}
let state:'not-submitted'|'started'|'unknown'='not-submitted';
let phase='preflight',temp:string|undefined,pane:string|undefined,selected:Selection|undefined;
try {
  const o=options(process.argv.slice(2)),v=o.values;
  if(!await Bun.file(new URL('../node_modules/yaml/package.json',import.meta.url)).exists())fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml');
  try{await import('yaml');}catch{fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml');}
  const cwd=resolve(v.cwd);await directory(cwd,'cwd');
  let gitRoot:string|undefined;
  if(Bun.which('git')){const g=await run(['git','-C',cwd,'rev-parse','--show-toplevel'],cwd);if(g.exit===0)gitRoot=g.stdout.trim();}
  const repo=v.repo ? resolve(v.repo) : gitRoot;
  if(!repo)fail(2,'repository_required','Cannot infer repository; supply --repo','repo');
  await directory(repo,'repo');
  const roleFile=join(repo,'.agents','agents',`${v.role}.md`);
  const roleBody=await contents(roleFile);
  if(!roleBody.trim())fail(2,'invalid_role','Canonical role file is empty','role');
  const selection=o.direct ? {kind:v.kind as Selection['kind'],model:v.model,effort:v.effort,provenance:'explicit CLI'} : await routed(repo,v.role,v.route);
  selected={name:v.name,role:v.role,roleFile,roleHash:sha(roleBody),repo,cwd,...selection,permissions:(v.permissions??'inherit') as Permissions};
  const tempRoot=resolve(v['temp-dir']??tmpdir());await directory(tempRoot,'temp-dir');
  if(o.offline) {
    const {validatePass}=await import('./adapters');validatePass(selected,o.pass);
    console.log(JSON.stringify({schema_version:1,ok:true,action:'resolved-offline',selection:selected,permissions:selected.permissions,git_root:gitRoot??null,launchable:false,coverage:'fixture/failure-only',argv:[],temporary_operations:[],submission_state:state,diagnostics:[{code:'offline_unverified',message:'Native config, adapter capability, executable availability and Herdr context have not been verified.',field:'offline'}]}));
    process.exit(0);
  }
  // No launch material or pane mutations occur before every prerequisite passes.
  // Codex native inspection may initialize its runtime state under authorization.
  const herdr=executable('herdr');executable(selected.kind);
  const h=await run([herdr,'agent','start','--help'],cwd);
  const available=h.stdout.match(/\[possible values:([^\]]+)\]/)?.[1].split(',').map(x=>x.trim());
  if(h.exit!==0||h.timedOut||!available?.includes(selected.kind))fail(3,'unsupported_herdr_kind','Installed Herdr does not support the selected kind','kind');
  const splitHelp=await run([herdr,'pane','split','--help'],cwd);
  if(splitHelp.exit!==0||splitHelp.timedOut||['--current','--direction','--cwd','--no-focus','--env'].some(f=>!splitHelp.stdout.includes(f)))fail(3,'unsupported_herdr','Herdr split capabilities are unavailable','herdr');
  if(process.env.HERDR_ENV!=='1'||!process.env.HERDR_PANE_ID)fail(3,'missing_herdr_context','A caller Herdr pane with HERDR_ENV=1 is required','HERDR_PANE_ID');
  const layoutResult=await run([herdr,'pane','layout','--current'],cwd);
  if(layoutResult.exit!==0||layoutResult.timedOut)fail(3,'unreachable_herdr','Cannot read caller pane layout','herdr');
  const layout=json(layoutResult.stdout,'pane layout').result?.layout;
  const current=layout?.panes?.find((p:any)=>p.pane_id===process.env.HERDR_PANE_ID);
  if(!current||typeof current.rect?.width!=='number')fail(3,'missing_herdr_context','Caller pane is absent from current layout','HERDR_PANE_ID');
  const namesResult=await run([herdr,'agent','list'],cwd);
  if(namesResult.exit!==0||namesResult.timedOut)fail(3,'unreachable_herdr','Cannot verify unique live agent name','herdr');
  const agents=json(namesResult.stdout,'agent list').result?.agents;
  if(!Array.isArray(agents))fail(3,'invalid_probe','Agent list shape is unavailable','herdr');
  if(agents.some((a:any)=>a.name===v.name))fail(2,'duplicate_name','Agent name is already in use','name');
  const plan=await prepare(selected,o.pass);
  const direction=current.rect.width>=120?'right':'down';
  const output={schema_version:1,ok:true,selection:selected,permissions:selected.permissions,git_root:gitRoot??null,launchable:true,coverage:plan.coverage,cli_version:plan.version,config_reader:plan.configReader??null,argv:plan.redactedArgv,hidden_workflows:plan.hiddenWorkflows,temporary_operations:plan.operations,direction,diagnostics:[],limits:['No paid session, native prompt/skill acceptance, account entitlement or model availability is established by preflight.']};
  if(o.command==='resolve'||o.dry){console.log(JSON.stringify({...output,action:o.command==='resolve'?'resolved':'dry-run',submission_state:state}));}
  else {
    let argv=plan.argv;
    if(plan.materialize) {
      phase='prepare';temp=await mkdtemp(join(tempRoot,'ruach-herdr-'));await chmod(temp,0o700);
      argv=await plan.materialize(temp);
    }
    if(sha(await contents(roleFile))!==selected.roleHash)fail(2,'role_changed','Canonical role changed during preparation','role');
    phase='split';state='unknown';
    const paneEnvironment=['PATH','HOME','CODEX_HOME','CLAUDE_CONFIG_DIR'].filter(key=>process.env[key]!==undefined).flatMap(key=>['--env',`${key}=${process.env[key]}`]);
    const split=await run([herdr,'pane','split','--current','--direction',direction,'--cwd',cwd,'--no-focus',...paneEnvironment],cwd);
    if(split.exit!==0||split.timedOut)fail(4,'split_uncertain','Pane split failed or timed out; inspect state before any new invocation','herdr');
    try{pane=JSON.parse(split.stdout).result?.pane?.pane_id;}catch{}
    if(typeof pane!=='string'||!pane)fail(4,'split_uncertain','Split response lacks a pane ID; inspect state','herdr');
    // Exactly one submission. Any start error is uncertain and never retried.
    phase='start';
    const start=await run([herdr,'agent','start',v.name,'--kind',selected.kind,'--pane',pane,'--',...argv],cwd,35000);
    if(start.exit!==0||start.timedOut)fail(4,'start_uncertain','Agent startup failed or timed out; inspect the pane before any new invocation','herdr');
    let started;try{started=JSON.parse(start.stdout);}catch{}
    if(!started?.result||started.error)fail(4,'start_uncertain','Agent startup response is invalid; inspect the pane','herdr');
    state='started';
    console.log(JSON.stringify({...output,action:'started',pane,submission_state:state,temporary_directory:temp??null,cleanup:temp?'Caller removes this private directory only after the session ends.':null}));
  }
} catch(e) {
  const error=e instanceof Failure ? e : new Failure(state==='unknown'?4:phase==='prepare'?4:2,'operation_failed','Operation failed; raw native output is withheld');
  if(temp && state==='not-submitted')await rm(temp,{recursive:true,force:true}).catch(()=>{});
  const diagnostic={code:error.code,message:error.message,field:error.field??null};
  console.error(`${error.code}: ${error.message}`);
  console.log(JSON.stringify({schema_version:1,ok:false,launchable:false,diagnostics:[diagnostic],phase,name:selected?.name??null,pane:pane??null,submission_state:state,temporary_directory:state==='unknown'?temp??null:null,cleanup:state==='unknown'?'Inspect the uncertain pane/session before removing private material or launching again.':null}));
  process.exitCode=state==='unknown'?4:error.exit;
}
