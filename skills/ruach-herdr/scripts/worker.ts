import { resolve, join } from 'node:path';
import { mkdtemp, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { contents, directory, fail, Failure, identifier, kinds, efforts, string, type Selection, type Permissions } from './contracts';
import { executable, json, run } from './process';
import { routed } from './routing';
import { prepare } from './adapters';
import { worktreePlan, createWorktree, type Worktree } from './spaces';
const usage='bun scripts/worker.ts resolve|start --name NAME --role ROLE --cwd DIR [--repo DIR] [--resources DIR] [--catalogs DIR] [--route ID | --kind KIND --model MODEL [--effort LEVEL]] [--placement worktree|pane] [--worktree DIR] [--branch NAME] [--base REF] [--dry-run | --offline] [--temp-dir DIR] [--permissions inherit|auto-review] [-- NATIVE_FLAGS]';
function options(args:string[]) {
  if(args.includes('--help')||args.includes('-h')) {console.log(JSON.stringify({schema_version:1,ok:true,usage}));process.exit(0);}
  const command=args.shift();
  if(!['resolve','start'].includes(command??''))fail(2,'usage','Expected resolve or start','command');
  const values:Record<string,string>={};let dry=false,offline=false,pass:string[]=[];
  const keys=['name','role','cwd','repo','resources','catalogs','route','kind','model','effort','temp-dir','permissions','placement','worktree','branch','base'];
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
  if(values.placement && !['worktree','pane'].includes(values.placement))fail(2,'invalid_placement','Expected worktree or pane','placement');
  if(values.placement==='pane' && ['worktree','branch','base'].some(key=>values[key]!==undefined))fail(2,'invalid_placement','Worktree options require worktree placement','placement');
  return {command,values,dry,offline,pass,direct};
}
function sha(s:string) {return createHash('sha256').update(s).digest('hex');}
let state:'not-submitted'|'started'|'unknown'|'awaiting-input'='not-submitted';
let phase='preflight',temp:string|undefined,pane:string|undefined,workspace:string|undefined,selected:Selection|undefined;
let worktree:Worktree|undefined,worktreeState:'not-created'|'created'|'unknown'='not-created';
try {
  const o=options(process.argv.slice(2)),v=o.values;
  if(!await Bun.file(new URL('../node_modules/yaml/package.json',import.meta.url)).exists())fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml');
  try{await import('yaml');}catch{fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml');}
  const cwd=resolve(v.cwd);await directory(cwd,'cwd');
  const placement=v.placement??'worktree';
  let gitRoot:string|undefined;
  if(Bun.which('git')){const g=await run(['git','-C',cwd,'rev-parse','--show-toplevel'],cwd);if(g.exit===0)gitRoot=g.stdout.trim();}
  const repo=v.repo ? resolve(v.repo) : gitRoot;
  if(!repo)fail(2,'repository_required','Cannot infer repository; supply --repo','repo');
  await directory(repo,'repo');
  const resources=resolve(v.resources??join(repo,'.agents'));
  const catalogs=resolve(v.catalogs??join(repo,'.agents'));
  await directory(resources,'resources');
  const roleFile=join(resources,'agents',`${v.role}.md`);
  const roleBody=await contents(roleFile);
  if(!roleBody.trim())fail(2,'invalid_role','Canonical role file is empty','role');
  const selection=o.direct ? {kind:v.kind as Selection['kind'],model:v.model,effort:v.effort,provenance:'explicit CLI'} : await routed(repo,v.role,v.route,catalogs,resources);
  selected={name:v.name,role:v.role,roleFile,roleHash:sha(roleBody),repo,cwd,...(v.resources?{resources}:{}),...selection,permissions:(v.permissions??'inherit') as Permissions};
  const tempRoot=resolve(v['temp-dir']??tmpdir());await directory(tempRoot,'temp-dir');
  if(o.offline) {
    const {validatePass}=await import('./adapters');validatePass(selected,o.pass);
    console.log(JSON.stringify({schema_version:1,ok:true,action:'resolved-offline',selection:selected,permissions:selected.permissions,placement,git_root:gitRoot??null,launchable:false,coverage:'fixture/failure-only',argv:[],temporary_operations:[],submission_state:state,diagnostics:[{code:'offline_unverified',message:'Native config, adapter capability, executable availability, worktree destination and Herdr context have not been verified.',field:'offline'}]}));
    process.exit(0);
  }
  // Validate source prerequisites before creating worktrees or launch spaces.
  // Codex native inspection may initialize its runtime state under authorization.
  const herdr=executable('herdr');executable(selected.kind);
  const h=await run([herdr,'agent','start','--help'],cwd);
  const available=h.stdout.match(/\[possible values:([^\]]+)\]/)?.[1].split(',').map(x=>x.trim());
  if(h.exit!==0||h.timedOut||!available?.includes(selected.kind))fail(3,'unsupported_herdr_kind','Installed Herdr does not support the selected kind','kind');
  const topologyHelp=await run([herdr,placement==='pane'?'pane':'workspace',placement==='pane'?'split':'create','--help'],cwd);
  const required=placement==='pane'?['--current','--direction','--cwd','--no-focus','--env']:['--cwd','--label','--no-focus','--env'];
  if(topologyHelp.exit!==0||topologyHelp.timedOut||required.some(f=>!topologyHelp.stdout.includes(f)))fail(3,'unsupported_herdr','Required Herdr placement capabilities are unavailable','herdr');
  if(process.env.HERDR_ENV!=='1')fail(3,'missing_herdr_context','An authorized Herdr session with HERDR_ENV=1 is required','HERDR_ENV');
  let direction:string|undefined;
  if(placement==='pane') {
    if(!process.env.HERDR_PANE_ID)fail(3,'missing_herdr_context','Pane placement requires a caller pane ID','HERDR_PANE_ID');
    const layoutResult=await run([herdr,'pane','layout','--current'],cwd);
    if(layoutResult.exit!==0||layoutResult.timedOut)fail(3,'unreachable_herdr','Cannot read caller pane layout','herdr');
    const layout=json(layoutResult.stdout,'pane layout').result?.layout;
    const current=layout?.panes?.find((p:any)=>p.pane_id===process.env.HERDR_PANE_ID);
    if(!current||typeof current.rect?.width!=='number')fail(3,'missing_herdr_context','Caller pane is absent from current layout','HERDR_PANE_ID');
    direction=current.rect.width>=120?'right':'down';
  }
  const namesResult=await run([herdr,'agent','list'],cwd);
  if(namesResult.exit!==0||namesResult.timedOut)fail(3,'unreachable_herdr','Cannot verify unique live agent name','herdr');
  const agents=json(namesResult.stdout,'agent list').result?.agents;
  if(!Array.isArray(agents))fail(3,'invalid_probe','Agent list shape is unavailable','herdr');
  if(agents.some((a:any)=>a.name===v.name))fail(2,'duplicate_name','Agent name is already in use','name');
  let plan=await prepare(selected,o.pass);
  if(placement==='worktree')worktree=await worktreePlan(cwd,v.name,v);
  const output=()=>({schema_version:1,ok:true,selection:selected!,permissions:selected!.permissions,placement,worktree:worktree??null,worktree_state:worktreeState,git_root:gitRoot??null,launchable:true,coverage:plan.coverage,cli_version:plan.version,config_reader:plan.configReader??null,argv:plan.redactedArgv,hidden_workflows:plan.hiddenWorkflows,temporary_operations:plan.operations,direction:direction??null,diagnostics:[],limits:['No paid session, native prompt/skill acceptance, account entitlement or model availability is established by preflight.',...(worktree?['A new worktree starts from the resolved commit; uncommitted source changes are not copied. Dry-run inspects native settings in the source cwd; start reads them again in the new worktree.']:[])]});
  if(o.command==='resolve'||o.dry){console.log(JSON.stringify({...output(),action:o.command==='resolve'?'resolved':'dry-run',submission_state:state}));}
  else {
    if(worktree) {
      phase='worktree';worktreeState='unknown';
      await createWorktree(cwd,worktree);worktreeState='created';
      selected={...selected,cwd:worktree.cwd,resources};
      // Re-read native configuration from the actual worker checkout, rather than
      // importing the caller checkout's project settings or relative paths.
      phase='prepare';plan=await prepare(selected,o.pass);
    }
    let argv=plan.argv;
    if(plan.materialize) {
      phase='prepare';temp=await mkdtemp(join(tempRoot,'ruach-herdr-'));await chmod(temp,0o700);
      argv=await plan.materialize(temp);
    }
    if(sha(await contents(roleFile))!==selected.roleHash)fail(2,'role_changed','Canonical role changed during preparation','role');
    phase=placement==='pane'?'split':'workspace';state='unknown';
    const paneEnvironment=['PATH','HOME','CODEX_HOME','CLAUDE_CONFIG_DIR'].filter(key=>process.env[key]!==undefined).flatMap(key=>['--env',`${key}=${process.env[key]}`]);
    const topology=placement==='pane'?[herdr,'pane','split','--current','--direction',direction!]:[herdr,'workspace','create','--label',v.name];
    const created=await run([...topology,'--cwd',selected.cwd,'--no-focus',...paneEnvironment],selected.cwd);
    const code=placement==='pane'?'split_uncertain':'workspace_uncertain';
    if(created.exit!==0||created.timedOut)fail(4,code,'Launch space creation failed or timed out; inspect state before any new invocation','herdr');
    try {
      const result=JSON.parse(created.stdout).result;
      pane=placement==='pane'?result?.pane?.pane_id:result?.root_pane?.pane_id;
      workspace=placement==='worktree'?result?.workspace?.workspace_id:undefined;
    }catch{}
    if(typeof pane!=='string'||!pane||placement==='worktree'&&(typeof workspace!=='string'||!workspace))fail(4,code,'Launch space response lacks its IDs; inspect state','herdr');
    // Exactly one submission. Inspect readiness failures without retrying.
    phase='start';
    const start=await run([herdr,'agent','start',v.name,'--kind',selected.kind,'--pane',pane,'--',...argv],selected.cwd,35000);
    const inspection={read:['herdr','agent','read',v.name,'--source','recent-unwrapped'],...(workspace?{focus:['herdr','workspace','focus',workspace]}:{})};
    const space={pane,workspace:workspace??null,inspection,temporary_directory:temp??null,cleanup:'Release the owned session and private material after reuse ends; remove the worktree only after its work is committed and reachable from a retained branch. Keep the branch.'};
    if(start.exit!==0||start.timedOut) {
      // Herdr returns agent_not_ready when a native trust/onboarding dialog is
      // visible. Verify identity and live state rather than hiding it as failure.
      const observed=await run([herdr,'agent','get',v.name],selected.cwd);
      let agent:any;try{agent=JSON.parse(observed.stdout).result?.agent;}catch{}
      if(observed.exit===0&&!observed.timedOut&&agent?.name===v.name&&agent?.pane_id===pane&&agent?.agent===selected.kind&&agent?.agent_status==='blocked') {
        state='awaiting-input';
        const next=workspace?`Open the existing workspace: herdr workspace focus ${workspace}.`:`Inspect the existing pane ${pane}.`;
        console.error(`${v.name} launched and is waiting for native input. ${next} Read the dialog and approve it yourself or explicitly authorize an assistant to answer it. Do not launch another worker to resolve this prompt.`);
        console.log(JSON.stringify({...output(),...space,action:'awaiting-input',launchable:false,ready:false,awaiting_user_input:true,submission_state:state,next_step:'Open the existing launch space, inspect the native dialog and answer it with user approval. Once ready, use the existing session for the assignment.'}));
        process.exit(0);
      }
      fail(4,'start_uncertain','Agent startup failed or timed out; inspect the pane before any new invocation','herdr');
    }
    let started;try{started=JSON.parse(start.stdout);}catch{}
    if(started?.result?.agent?.name!==v.name||started?.result?.agent?.pane_id!==pane||started.error)fail(4,'start_uncertain','Agent startup response does not confirm the expected agent and pane; inspect state','herdr');
    state='started';
    console.log(JSON.stringify({...output(),...space,action:'started',ready:true,awaiting_user_input:false,submission_state:state}));
  }
} catch(e) {
  const mutated=state==='unknown'||worktreeState!=='not-created';
  const error=e instanceof Failure ? e : new Failure(mutated?4:phase==='prepare'?4:2,'operation_failed','Operation failed; raw native output is withheld');
  if(temp && state==='not-submitted')await rm(temp,{recursive:true,force:true}).catch(()=>{});
  const diagnostic={code:error.code,message:error.message,field:error.field??null};
  console.error(`${error.code}: ${error.message}`);
  console.log(JSON.stringify({schema_version:1,ok:false,launchable:false,diagnostics:[diagnostic],phase,name:selected?.name??null,pane:pane??null,workspace:workspace??null,worktree:worktree??null,worktree_state:worktreeState,submission_state:state,temporary_directory:state==='unknown'?temp??null:null,cleanup:mutated?'Inspect the reported worktree, branch and launch space before removing resources or launching again.':null}));
  process.exitCode=mutated?4:error.exit;
}
