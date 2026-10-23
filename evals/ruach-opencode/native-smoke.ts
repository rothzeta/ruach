// Optional native transport check. All model requests go to a local fixture.
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { prepare } from '../../skills/ruach-herdr/scripts/adapters/opencode';
import { opencodeRead } from '../../skills/ruach-herdr/scripts/native-opencode';

const repo=resolve(import.meta.dir,'../..');
const exe=Bun.which('opencode');
if(!exe)throw Error('OpenCode 2.1.4+ must be installed for this native smoke');
const temp=await mkdtemp(join(tmpdir(),'ruach-opencode-smoke-'));
const keys=[...new Set(['HOME','XDG_CONFIG_HOME','XDG_DATA_HOME','XDG_CACHE_HOME','XDG_STATE_HOME',...Object.keys(process.env).filter(k=>k.startsWith('OPENCODE_'))])];
const saved=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const requests:{url:string;body:any}[]=[];
const server=Bun.serve({hostname:'127.0.0.1',port:0,async fetch(request){
  requests.push({url:request.url,body:await request.json()});
  const chunk=(delta:unknown,finish_reason:string|null)=>({id:'chatcmpl-ruach',object:'chat.completion.chunk',created:1,model:'smoke',choices:[{index:0,delta,finish_reason}]});
  const content=chunk({role:'assistant',content:'RUACH_NATIVE_OK'},null);
  const end={...chunk({},'stop'),usage:{prompt_tokens:1,completion_tokens:1,total_tokens:2}};
  return new Response(`data: ${JSON.stringify(content)}\n\ndata: ${JSON.stringify(end)}\n\ndata: [DONE]\n\n`,{headers:{'content-type':'text/event-stream'}});
}});
try {
  for(const key of Object.keys(process.env))if(key.startsWith('OPENCODE_'))delete process.env[key];
  for(const key of ['HOME','XDG_CONFIG_HOME','XDG_DATA_HOME','XDG_CACHE_HOME','XDG_STATE_HOME']) {
    const path=join(temp,key);await mkdir(path,{mode:0o700});process.env[key]=path;
  }
  process.env.OPENCODE_CONFIG_DIR=process.env.XDG_CONFIG_HOME;
  process.env.OPENCODE_DISABLE_MODELS_FETCH='1';
  const ambient=join(temp,'ambient.md');await writeFile(ambient,'NATIVE_AMBIENT_SENTINEL\n');
  process.env.OPENCODE_CONFIG_CONTENT=JSON.stringify({
    providers:{'ruach-fixture':{name:'Local Ruach fixture',package:'@ai-sdk/openai-compatible',settings:{baseURL:`http://127.0.0.1:${server.port}/v1`,apiKey:'local-fixture'},models:{smoke:{name:'Smoke',limit:{context:32000,output:1000},capabilities:{tools:true}}}}},
    policies:[{effect:'deny',action:'provider.use',resource:'*'},{effect:'allow',action:'provider.use',resource:'ruach-fixture'}],
    instructions:[ambient],warming:false,share:'disabled',update:'disable',
  });
  const results=[];
  for(const role of ['implementer','coordinator']) {
    const roleFile=join(repo,'agents',role+'.md');
    const plan=await prepare({name:'native-smoke',role,roleFile,roleHash:'smoke',repo,cwd:repo,resources:repo,kind:'opencode',model:'ruach-fixture/smoke',permissions:'inherit',provenance:'isolated native mock-provider smoke'},[]);
    const material=join(temp,role);await mkdir(material,{mode:0o700});await plan.materialize!(material);
    const snapshot=await opencodeRead(exe,repo,plan.environment);
    const agent=snapshot.agents.find(a=>a.id==='build')!;
    if(!snapshot.skills.some(s=>s.id==='ruach-testing'))throw Error('Canonical technical skill unavailable');
    const workflow=agent.permissions.findLast((r:any)=>r.action==='skill'&&(r.resource==='ruach-workflow-feature'||r.resource==='ruach-workflow-*'))?.effect;
    if((workflow==='deny')!==(role!=='coordinator'))throw Error('Incorrect workflow permission');
    const before=requests.length;
    const proc=Bun.spawn([exe,'run','--standalone','--model','ruach-fixture/smoke','--format','json','Return the smoke marker.'],{cwd:repo,env:{...process.env,...plan.environment},stdout:'pipe',stderr:'pipe',detached:true});
    const kill=()=>{try{process.kill(-proc.pid,'SIGKILL');}catch{try{proc.kill('SIGKILL');}catch{}}};
    const timeout=setTimeout(kill,30000);
    let stdout:string,exit:number;
    try {[stdout,,exit]=await Promise.all([new Response(proc.stdout).text(),new Response(proc.stderr).text(),proc.exited]);}
    finally {clearTimeout(timeout);kill();}
    if(exit!==0||!stdout.includes('RUACH_NATIVE_OK'))throw Error('Native local-provider run did not complete');
    const actual=requests.slice(before);
    const system=actual.flatMap(r=>r.body.messages??[]).filter(m=>m.role==='system').flatMap(m=>typeof m.content==='string'?[m.content]:m.content.map((p:any)=>p.text??'')).join('\n');
    const roleBody=(await Bun.file(roleFile).text()).replace(/^---\n[\s\S]*?\n---\n/,'').trim();
    if(!system.includes('NATIVE_AMBIENT_SENTINEL')||!system.includes(roleBody))throw Error('Native request lost ambient or canonical role instructions');
    if(actual.some(r=>new URL(r.url).hostname!=='127.0.0.1'))throw Error('Unexpected model endpoint');
    results.push({role,version:plan.version,requests:actual.length,ambient_preserved:true,canonical_role_delivered:true,technical_skill_discovered:true,workflow_denied:workflow==='deny',completion:true});
  }
  console.log(JSON.stringify({ok:true,paid_requests:0,results}));
} finally {
  server.stop(true);
  for(const key of Object.keys(process.env))if(key.startsWith('OPENCODE_'))delete process.env[key];
  for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}
  await rm(temp,{recursive:true,force:true});
}
