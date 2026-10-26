// Test executable: record the public argv/cwd and simulate native read boundaries.
import { basename, join } from 'node:path';
import { appendFileSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse as parseJSONC } from 'jsonc-parser';
import { terminalRequest } from './terminal-client';
const exe=basename(process.argv[1]),args=process.argv.slice(2);
const root=process.env.FIXTURE_ROOT!;
appendFileSync(join(root,'calls.jsonl'),JSON.stringify({exe,args,cwd:process.cwd()})+'\n');
const data=JSON.parse(readFileSync(join(root,'behavior.json'),'utf8'));
function out(v:any){console.log(JSON.stringify(v));}
if(exe==='herdr') {
  if(args.join(' ')==='agent start --help')console.log(`--kind --pane [possible values: ${data.kinds??'claude, codex, pi, opencode, omp, agy'}]`);
  else if (args.join(' ') === 'pane run --help') console.log(data.noBootstrapPrimitive || data.noBootstrapPrimitiveSecondCwd && process.cwd() !== data.repo ? '' : '<PANE_ID> <COMMAND>');
  else if (args.join(' ') === 'pane wait-output --help') console.log(data.noBootstrapWaitOutput ? '' : '--match --timeout');
  else if (args.join(' ') === 'pane process-info --help') console.log(data.noBootstrapProcessInfo ? '' : '--pane');
  else if (args.slice(0, 2).join(' ') === 'pane run') {
    appendFileSync(join(root, 'mutations.jsonl'), JSON.stringify({ action: 'bootstrap', args }) + '\n');
    if (data.bootstrapSetupFailure) process.exit(1);
    await fixtureTerminal({ operation: 'run', command: args[3] });
    out({ result: { pane_id: args[2] } });
  }
  else if (args.slice(0, 2).join(' ') === 'pane wait-output') {
    if (data.bootstrapWaitFailure) process.exit(1);
    await fixtureTerminal({ operation: 'wait', marker: args[args.indexOf('--match') + 1] });
    out({ result: { pane_id: args[2], matched_line: args[args.indexOf('--match') + 1] } });
  }
  else if (args.slice(0, 2).join(' ') === 'pane process-info') {
    const pane = args[args.indexOf('--pane') + 1];
    const info = await fixtureTerminal({ operation: 'process-info', pane });
    if (data.wrongForeground) info.foreground_process_group_id += 1;
    out({ result: { process_info: info } });
  }
  else if(args.join(' ')==='pane split --help')console.log('--current --direction --cwd --no-focus --env');
  else if(args.join(' ')==='worktree create --help')console.log(data.noLinked?'--cwd':'--workspace --cwd --branch --base --path --label --focus --no-focus');
  else if(args.slice(0,2).join(' ')==='worktree list') {
    if(data.parentUnknown)process.exit(1);
    out({result:{source:{repo_key:data.parentRepoKey??join(data.repo,'.git'),source_workspace_id:data.linkedLaunching&&args[3]===data.linkedLaunching?data.sourceWorkspace:args[3]},worktrees:data.linkedLaunching&&args[3]===data.linkedLaunching?[{open_workspace_id:args[3],is_linked_worktree:true}]:[]}});
  } else if(args.slice(0,2).join(' ')==='worktree create') {
    const at=(flag:string)=>args[args.indexOf(flag)+1];
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'worktree',args,cwd:process.cwd()})+'\n');
    if(data.linkedFailure)process.exit(1);
    if(data.linkedLaunching&&at('--workspace')===data.linkedLaunching){console.log(JSON.stringify({error:{code:'linked_worktree_source',message:'New and open worktree actions start from the repo parent workspace.'}}));process.exit(1);}
    const base=data.linkedWrongHead??at('--base');
    if(data.linkedPartial)Bun.spawnSync([data.git,'-C',data.repo,'branch',at('--branch'),base]);
    else if(Bun.spawnSync([data.git,'-C',data.repo,'worktree','add','-b',at('--branch'),'--',at('--path'),base]).exitCode!==0)process.exit(1);
    if(data.linkedPartial)process.exit(1);
    const ids=data.linkedIds??{workspace:'w9',pane:'w9:p1'};
    const response={result:{workspace:{workspace_id:ids.workspace},...(data.linkedMalformed?{}:{root_pane:{pane_id:ids.pane}}),worktree:{branch:at('--branch'),path:data.linkedWrongPath?at('--path')+'-elsewhere':at('--path'),is_linked_worktree:data.linkedUnlinked?false:true}}};
    // A receipt reported with a failing status, plus private output the worker must withhold.
    if(data.linkedNonzero){console.error(data.leak??'private native stderr');out({...response,private:data.leak});process.exit(1);}
    out(response);
  }
  else if(args.join(' ')==='workspace create --help')console.log('--cwd --label --no-focus --env');
  else if(args.join(' ')==='pane layout --current') {
    if(data.unreachable)process.exit(1);
    out({result:{layout:{panes:[{pane_id:data.pane??'w1:p1',rect:{width:data.width??130}}]}}});
  } else if(args.join(' ')==='agent list')out({result:{agents:data.agents??[]}});
  else if (args.slice(0, 2).join(' ') === 'agent get' && data.startBlocked) {
    out({
      result: {
        agent: {
          name: args[2],
          pane_id: data.inspectPane ?? 'w2:p1',
          agent: data.inspectKind ?? 'claude',
          agent_status: 'blocked',
          launch_pending: true,
          agent_session: data.nativeSession,
        },
      },
    });
  }
  else if(args.slice(0,2).join(' ')==='workspace create') {
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'workspace',args,cwd:process.cwd()})+'\n');
    if(data.workspaceFailure)process.exit(1);
    const env=Object.fromEntries(args.flatMap((value,i)=>value==='--env'?[args[i+1].split(/=(.*)/s).slice(0,2)]:[]));
    appendFileSync(join(root,'pane-environment.jsonl'),JSON.stringify(env)+'\n');
    out({result:{workspace:{workspace_id:'w2'},...(data.workspaceMalformed?{}:{root_pane:{pane_id:'w2:p1'}})}});
  }
  else if(args.slice(0,2).join(' ')==='pane split') {
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'split',args,cwd:process.cwd()})+'\n');
    if(data.splitFailure)process.exit(1);
    const env=Object.fromEntries(args.flatMap((value,i)=>value==='--env'?[args[i+1].split(/=(.*)/s).slice(0,2)]:[]));
    appendFileSync(join(root,'pane-environment.jsonl'),JSON.stringify(env)+'\n');
    out({result:{pane:{pane_id:args[2]&&!args[2].startsWith('--')?args[2].split(':')[0]+':p2':'w1:p2'}}});
  } else if(args.slice(0,2).join(' ')==='agent start') {
    appendFileSync(join(root,'mutations.jsonl'),JSON.stringify({action:'start',args,cwd:process.cwd()})+'\n');
    if(data.startTimeout)await new Promise(r=>setTimeout(r,40000));
    if(data.startFailure){console.error(data.leak??'timeout');process.exit(1);}
    const native=args.slice(args.indexOf('--')+1);
    // Execute only fake harnesses, which record actual native arguments.
    const envFile=join(root,'pane-environment.jsonl');
    const paneEnv=existsSync(envFile)?JSON.parse(readFileSync(envFile,'utf8').trim().split('\n').at(-1)!):{};
    const launchEnv={...process.env,...paneEnv};
    if (data.bypassBinding && existsSync(join(root, 'terminal-host.json'))) {
      await fixtureTerminal({ operation: 'run', command: 'unset -f ' + args[args.indexOf('--kind') + 1] });
    }
    if(data.terminalStart || existsSync(join(root, 'terminal-host.json'))) {
      const result = await fixtureTerminal({
        operation: 'start',
        argv: [args[args.indexOf('--kind') + 1], ...native],
        observedFile: join(root, 'native-launches.jsonl'),
      });
      appendFileSync(join(root,'terminal-start.jsonl'),JSON.stringify(result)+'\n');
      if(!result.observed)process.exit(1);
    } else {
      const nativeExe=Bun.which(args[args.indexOf('--kind')+1],{PATH:launchEnv.PATH});
      if(!nativeExe)process.exit(1);
      const proc=Bun.spawnSync([nativeExe,...native],{cwd:process.cwd(),env:launchEnv});
      if(proc.exitCode!==0)process.exit(1);
    }
    if (data.removeReceipt || data.forgeReceipt) {
      const setup = readFileSync(join(root, 'mutations.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line)).find(item => item.action === 'bootstrap');
      const directory = setup.args[3].slice(3, -1).replaceAll("'\\''", "'").replace(/setup\.sh$/, '');
      if (data.removeReceipt) (await import('node:fs')).unlinkSync(join(directory, 'executed.json'));
      else writeFileSync(join(directory, 'executed.json'), JSON.stringify({ nonce: 'foreign', payloadHash: 'foreign', pid: 1 }));
    }
    if(data.startBlocked){console.error(JSON.stringify({error:{code:'agent_not_ready',message:'Native input required'}}));process.exit(1);}
    out({
      result: {
        agent: {
          name: data.startWrongName ? 'foreign-worker' : args[2],
          agent: data.startWrongKind ? 'claude' : args[args.indexOf('--kind') + 1],
          pane_id: data.startWrongPane ? 'wrong-pane' : args[args.indexOf('--pane') + 1],
          agent_session: data.nativeSession,
        },
      },
    });
  } else process.exit(2);
} else if(args.includes('--help')) {
  if (exe === 'agy') {
    console.error(data.agyMissingFlag ? '--model' : '--model --add-dir');
    process.exit(0);
  }
  if(exe==='pi'){console.log(data.piMissingFlag?'--model':'--provider --model --thinking --extension --skill --offline --list-models');process.exit(0);}
  if(exe==='goose'){console.log(args[0]==='session'?(data.gooseMissingFlag?'--model':'--system --provider --model'):'session');process.exit(0);}
  console.log('--model --config --cd --effort --settings --add-dir --no-alt-screen --sandbox --ask-for-approval --verbose'+(data.noAutoReview?'':' --permission-mode --approve-for-me')+(exe==='opencode'&&!data.opencodeNoStandalone?' --standalone':''));
} else if(args.includes('--version'))console.log(exe==='claude'?'2.1.289':exe==='codex'?'0.160.0':exe==='pi'?(data.piVersion??'1.4.0'):exe==='goose'?(data.gooseVersion??'1.56.0'):exe==='opencode'?(data.opencodeVersion??'2.1.4'):exe==='agy'?(data.agyVersion??'1.4.7'):'1.0.0');
else if (exe === 'agy' && args.join(' ') === 'models') {
  if (data.agyCatalogFailure) { console.error(data.leak ?? 'native catalog unavailable'); process.exit(1); }
  if (data.agySecondCwdConflict && process.cwd() !== data.repo) {
    const directory = join(process.cwd(), '.agents/skills/conflict');
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'SKILL.md'), '---\nname: ruach-technical\ndescription: Different native skill\n---\n');
  }
  console.log((data.agyModels ?? ['gemini-3.8-flash-medium']).map((id: string) => id + '\tAvailable model').join('\n'));
}
else if(exe==='pi'&&args.includes('--list-models')) {
  console.log('provider model context max-out thinking images');
  if(!data.piMissingModel)console.log('native test-model 200K 16K yes yes');
}
else if(exe==='opencode'&&args[0]==='serve') {
  appendFileSync(join(root,'opencode-readers.jsonl'),JSON.stringify({pid:process.pid,cwd:process.cwd()})+'\n');
  if(data.opencodeNoReady){setInterval(()=>{},1000);await new Promise(()=>{});}
  const inline=parseJSONC(process.env.OPENCODE_CONFIG_CONTENT??'{}');
  const base={instructions:['existing-instructions.md'],agents:{build:{system:'Existing native OpenCode system '+(data.leak??''),permissions:[{action:'*',resource:'*',effect:'allow'},{action:'skill',resource:'technical',effect:'deny'},{action:'edit',resource:'*',effect:'ask'}]}}};
  let active=false;
  const server=Bun.serve({hostname:'127.0.0.1',port:0,fetch(request){
    if(request.headers.get('authorization')!==`Basic ${Buffer.from(`opencode:${process.env.OPENCODE_PASSWORD}`).toString('base64')}`)return new Response('unauthorized',{status:401});
    const url=new URL(request.url),resource=url.pathname.split('/').at(-1)!;
    appendFileSync(join(root,'opencode-requests.jsonl'),JSON.stringify({pid:process.pid,method:request.method,resource,cwd:url.searchParams.get('location[directory]')})+'\n');
    if(data.opencodeMalformed)return new Response('private invalid output '+(data.leak??''));
    const location={directory:data.opencodeWrongLocation?'wrong cwd':process.cwd()};
    const model=inline.agents?.build?.model??inline.model;
    const agent={id:'build',name:'Build',mode:'primary',hidden:false,system:base.agents.build.system,permissions:[...base.agents.build.permissions,...inline.permissions??[],...inline.agents?.build?.permissions??[]],...(model?{model:typeof model==='string'?{providerID:model.split('/')[0],id:model.slice(model.indexOf('/')+1)}:{providerID:model.providerID,id:model.model,...(model.variant?{variant:model.variant}:{})}}:{})};
    if(data.opencodeManagedModel&&model)agent.model={providerID:'managed',id:'other'};
    if(resource==='model'){active=true;return Response.json({location,data:[{providerID:'native',id:'test-model',enabled:!data.opencodeDisabledModel,variants:(data.opencodeVariants??['low','high']).map((id:string)=>({id}))}]});}
    if(resource==='config')return Response.json([{type:'document',path:join(root,'native-config.json'),info:base},...(process.env.OPENCODE_CONFIG_CONTENT?[{type:'document',info:inline}]:[])]);
    if(resource==='agent')return Response.json({location,data:active?[agent]:[]});
    if(resource==='skill')return Response.json({location,data:active?[{id:'workflow',name:'ruach-workflow-feature',path:join(process.cwd(),'.agents/skills/workflow/SKILL.md')},{id:'private-alias',name:'ruach-workflow-user',path:join(root,'home/.claude/skills/alias/SKILL.md')},{id:'technical',name:'ruach-technical',path:join(process.cwd(),'.agents/skills/technical/SKILL.md')}]:[]});
    return new Response('unexpected request',{status:404});
  }});
  console.log(JSON.stringify({url:`http://127.0.0.1:${server.port}`}));
  process.stdin.resume();process.stdin.on('end',()=>{server.stop(true);process.exit(0);});
  await new Promise(()=>{});
}
else if(args.join(' ')==='app-server daemon version') {
  if(data.daemonMissing)process.exit(1);
  out({status:'running',socketPath:join(root,'native.sock'),cliVersion:'0.160.0',appServerVersion:data.daemonMismatch?'0.159.0':'0.160.0'});
} else if(exe==='codex'&&args.join(' ')==='app-server --listen stdio://') {
  appendFileSync(join(root,'stdio-processes.jsonl'),JSON.stringify({pid:process.pid,cwd:process.cwd(),configHome:process.env.CODEX_HOME})+'\n');
  if(data.stdioUnavailable){console.error('private native failure');process.exit(1);}
  if(data.stdioDescendant){
    // The reader exits but a same-group descendant keeps the inherited stdout open.
    const child=Bun.spawn([process.execPath,'-e','setTimeout(()=>{},25000)'],{stdio:['ignore','inherit','inherit']});
    appendFileSync(join(root,'stdio-descendants.pid'),child.pid+'\n');child.unref();process.exit(1);
  }
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
  const settings = args.indexOf('--settings');
  if (settings >= 0) {
    const path = args[settings + 1];
    appendFileSync(join(root, 'observed.jsonl'), JSON.stringify({ settings: JSON.parse(readFileSync(path, 'utf8')), settingsPath: path }) + '\n');
  }
  if(exe==='pi') {
    const extension=args[args.indexOf('--extension')+1];
    const hooks=new Map<string,Function>();
    (await import(extension)).default({on:(name:string,handler:Function)=>hooks.set(name,handler)});
    const prompt=await hooks.get('before_agent_start')!({systemPrompt:'Native system, APPEND_SYSTEM.md and ambient context.'});
    appendFileSync(join(root,'pi-prompts.jsonl'),JSON.stringify(prompt)+'\n');
  }
  if(exe==='claude'&&data.managedRoot)appendFileSync(join(root,'customizations.jsonl'),JSON.stringify({managedSourcesPresent:['managed-settings.json','managed-settings.d/policy.json','.claude/skills/workflow/SKILL.md'].every(p=>existsSync(join(data.managedRoot,p)))})+'\n');
  appendFileSync(join(root, 'native-launches.jsonl'), JSON.stringify({
    exe,
    executable: process.argv[1],
    decoyUsed: process.env.DECOY_USED,
    args,
    cwd: process.cwd(),
    path: process.env.PATH,
    pid: process.pid,
    startupSentinel: process.env.STARTUP_SENTINEL,
    ...(exe === 'agy' ? { version: data.agyVersion ?? '1.4.7' } : {}),
    configHomes: {
      home: process.env.HOME,
      codex: process.env.CODEX_HOME,
      claude: process.env.CLAUDE_CONFIG_DIR,
    },
    ...(exe === 'opencode' ? {
      config: JSON.parse(process.env.OPENCODE_CONFIG_CONTENT ?? '{}'),
      configDir: process.env.OPENCODE_CONFIG_DIR,
    } : {}),
  }) + '\n');
  if (process.env.FIXTURE_NATIVE_HOLD === '1') await new Promise(() => { setInterval(() => {}, 1000); });
}

async function fixtureTerminal(operation: Record<string, unknown>) {
  const envFile = join(root, 'pane-environment.jsonl');
  const paneEnv = existsSync(envFile) ? JSON.parse(readFileSync(envFile, 'utf8').trim().split('\n').at(-1)!) : {};
  const rcfile = data.startupPathPrepend ? join(root, 'isolated.bashrc') : undefined;
  if (rcfile && !existsSync(rcfile)) {
    writeFileSync(rcfile, `export PATH=${JSON.stringify(data.startupBin ?? join(root, 'bin'))}:"$PATH"\nexport STARTUP_SENTINEL=customization-retained\nPS1='RUACH_TERMINAL_READY> '\n`);
  }
  return await terminalRequest(root, { cwd: process.cwd(), env: { ...process.env, ...paneEnv }, rcfile, ...operation });
}
