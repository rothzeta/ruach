// Test executable: record the public argv/cwd and simulate native read boundaries.
import { basename, join } from 'node:path';
import { appendFileSync, readFileSync, existsSync } from 'node:fs';
const exe=basename(process.argv[1]),args=process.argv.slice(2);
const root=process.env.FIXTURE_ROOT!;
appendFileSync(join(root,'calls.jsonl'),JSON.stringify({exe,args,cwd:process.cwd()})+'\n');
const data=JSON.parse(readFileSync(join(root,'behavior.json'),'utf8'));
function out(v:any){console.log(JSON.stringify(v));}
if(exe==='herdr') {
  if(args.join(' ')==='agent start --help')console.log(`--kind --pane [possible values: ${data.kinds??'claude, codex, pi, opencode, omp, agy'}]`);
  else if(args.join(' ')==='pane split --help')console.log('--current --direction --cwd --no-focus --env');
  else if(args.join(' ')==='pane layout --current') {
    if(data.unreachable)process.exit(1);
    out({result:{layout:{panes:[{pane_id:data.pane??'w1:p1',rect:{width:data.width??130}}]}}});
  } else if(args.join(' ')==='agent list')out({result:{agents:data.agents??[]}});
  else if(args.slice(0,2).join(' ')==='pane split') {
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'split',args,cwd:process.cwd()})+'\n');
    if(data.splitFailure)process.exit(1);
    out({result:{pane:{pane_id:'w1:p2'}}});
  } else if(args.slice(0,2).join(' ')==='agent start') {
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'start',args,cwd:process.cwd()})+'\n');
    if(data.startTimeout)await new Promise(r=>setTimeout(r,40000));
    if(data.startFailure){console.error(data.leak??'timeout');process.exit(1);}
    const native=args.slice(args.indexOf('--')+1);
    const settings=native.indexOf('--settings');
    if(settings>=0) {
      const path=native[settings+1];
      appendFileSync(join(root,'observed.jsonl'),JSON.stringify({settings:JSON.parse(readFileSync(path,'utf8')),settingsPath:path})+'\n');
    }
    // Execute only fake harnesses, which record actual native arguments.
    const proc=Bun.spawnSync([join(root,'bin',args[args.indexOf('--kind')+1]),...native],{cwd:process.cwd(),env:process.env});
    if(proc.exitCode!==0)process.exit(1);
    out({result:{agent:{name:args[2],pane_id:'w1:p2'}}});
  } else process.exit(2);
} else if(args.includes('--help')) {
  console.log('--model --config --cd --effort --settings --add-dir --no-alt-screen --sandbox --ask-for-approval --verbose'+(data.noAutoReview?'':' --permission-mode --approve-for-me'));
} else if(args.includes('--version'))console.log(exe==='claude'?'2.1.289':exe==='codex'?'0.160.0':'1.0.0');
else if(args.join(' ')==='app-server daemon version') {
  if(data.daemonMissing)process.exit(1);
  out({status:'running',socketPath:join(root,'native.sock'),cliVersion:'0.160.0',appServerVersion:data.daemonMismatch?'0.159.0':'0.160.0'});
} else if(exe==='codex'&&args.join(' ')==='app-server --listen stdio://') {
  appendFileSync(join(root,'stdio-processes.jsonl'),JSON.stringify({pid:process.pid,cwd:process.cwd(),configHome:process.env.CODEX_HOME})+'\n');
  if(data.stdioUnavailable){console.error('private native failure');process.exit(1);}
  const {createInterface}=await import('node:readline');
  for await(const line of createInterface({input:process.stdin})) {
    const request=JSON.parse(line);appendFileSync(join(root,'stdio-requests.jsonl'),JSON.stringify(request)+'\n');
    if(!('id'in request)||data.stdioNoReply)continue;
    if(data.stdioMalformed){console.log('invalid private output');continue;}
    let result:any={};
    if(request.method==='config/read') {
      const globalPath=join(process.env.CODEX_HOME??join(root,'home','.codex'),'config.toml');
      const projectPath=join(process.cwd(),'.codex','config.toml');
      const defaults={developer_instructions:'existing developer secret $() `literal`',skills:{config:[{path:join(process.cwd(),'unrelated'),enabled:false},{path:join(process.cwd(),'.agents','skills','workflow','SKILL.md'),enabled:true}]}};
      const user=existsSync(globalPath)?Bun.TOML.parse(readFileSync(globalPath,'utf8')):defaults;
      const project=existsSync(projectPath)?Bun.TOML.parse(readFileSync(projectPath,'utf8')):{};
      result={config:{...user,...project}};
    }
    if(request.method==='skills/list')result={data:data.badCatalog?[]:[{cwd:request.params.cwds[0],errors:[],skills:[{name:'ruach-workflow-feature',path:join(process.cwd(),'.agents','skills','workflow','SKILL.md'),enabled:true},{name:'ruach-workflow-external',path:join(root,'home','external','SKILL.md'),enabled:true}]}]};
    // Notifications exercise JSONL filtering; they must never become a model turn.
    out({method:'native/notice',params:{}});out({id:request.id,result});
  }
  appendFileSync(join(root,'stdio-closed.jsonl'),JSON.stringify({pid:process.pid})+'\n');
  if(data.stdioStayAlive)await new Promise(r=>setTimeout(r,40000));
} else {
  if(exe==='claude'&&data.managedRoot)appendFileSync(join(root,'customizations.jsonl'),JSON.stringify({managedSourcesPresent:['managed-settings.json','managed-settings.d/policy.json','.claude/skills/workflow/SKILL.md'].every(p=>existsSync(join(data.managedRoot,p)))})+'\n');
  appendFileSync(join(root,'native-launches.jsonl'),JSON.stringify({exe,args,cwd:process.cwd()})+'\n');
}
