import { fail, Failure } from './contracts';
import { json, run } from './process';
// Prefer the existing matching daemon; never start or replace a persistent daemon.
async function daemonRead(exe: string, cwd: string) {
  const version=await run([exe,'app-server','daemon','version'],cwd);
  if(version.exit!==0 || version.timedOut) fail(3,'codex_config_unavailable','A running local Codex daemon is required for read-only effective configuration','codex');
  const info=json(version.stdout,'codex daemon version');
  if(info.status!=='running' || typeof info.socketPath!=='string' || !info.socketPath.startsWith('/') || info.appServerVersion!==info.cliVersion) fail(3,'codex_config_unavailable','Expected a running matching-version daemon and an absolute local control socket','codex');
  if(!await Bun.file(new URL('../node_modules/ws/package.json',import.meta.url)).exists())fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','ws');
  let WebSocket;
  try { ({default:WebSocket}=await import('ws')); }
  catch { return fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','ws'); }
  const ws=new WebSocket(`ws+unix://${info.socketPath}:/`);
  const pending=new Map<number,{resolve:(v:any)=>void,reject:(e:any)=>void}>();
  let id=0;
  const unavailable=()=>new Error('read unavailable');
  const rejectAll=()=>{for(const p of pending.values())p.reject(unavailable());pending.clear();};
  ws.on('error',rejectAll);ws.on('close',rejectAll);
  ws.on('message',(bytes)=>{
    let v;try{v=JSON.parse(bytes.toString());}catch{rejectAll();return;}
    if(!pending.has(v.id)) return;
    const p=pending.get(v.id)!;pending.delete(v.id);
    if(v.error) p.reject(unavailable());else p.resolve(v.result);
  });
  const rpc=(method:string,params:any)=>new Promise<any>((resolve,reject)=>{
    const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}),err=>{if(err){pending.delete(n);reject(err);}});
  });
  const timer=setTimeout(()=>{rejectAll();ws.terminate();},10000);
  try {
    await new Promise<void>((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);ws.once('close',()=>reject(unavailable()));});
    await rpc('initialize',{clientInfo:{name:'ruach-herdr',version:'0.1.0'},capabilities:{experimentalApi:true}});
    ws.send(JSON.stringify({method:'initialized'}));
    const config=await rpc('config/read',{cwd,includeLayers:false});
    const skills=await rpc('skills/list',{cwds:[cwd],forceReload:false});
    return {config:config.config,skills:skills.data,reader:'daemon' as const};
  } catch { return fail(3,'codex_config_unavailable','Could not read effective configuration and skill catalog from the existing Codex daemon','codex'); }
  finally {clearTimeout(timer);ws.terminate();}
}

// This native reader inherits the actual config environment and cwd. It can
// initialize Codex runtime state, but never writes user settings or starts a turn.
async function stdioRead(exe:string,cwd:string) {
  const proc=Bun.spawn([exe,'app-server','--listen','stdio://'],{cwd,env:process.env,stdin:'pipe',stdout:'pipe',stderr:'ignore'});
  const reader=proc.stdout.getReader(),decoder=new TextDecoder();
  let buffer='',id=0;
  const timer=setTimeout(()=>proc.kill('SIGKILL'),10000);
  async function send(value:any) {proc.stdin.write(JSON.stringify(value)+'\n');await proc.stdin.flush();}
  async function message():Promise<any> {
    while(true) {
      const newline=buffer.indexOf('\n');
      if(newline>=0){const line=buffer.slice(0,newline);buffer=buffer.slice(newline+1);if(line.trim())return JSON.parse(line);continue;}
      const chunk=await reader.read();if(chunk.done)throw Error('native reader closed');
      buffer+=decoder.decode(chunk.value,{stream:true});
      if(buffer.length>8*1024*1024)throw Error('native response exceeded limit');
    }
  }
  async function rpc(method:string,params:any) {
    const n=++id;await send({id:n,method,params});
    while(true){const response=await message();if(response.id!==n)continue;if(response.error)throw Error('native read failed');return response.result;}
  }
  try {
    await rpc('initialize',{clientInfo:{name:'ruach-herdr',version:'0.1.0'},capabilities:{experimentalApi:true}});
    await send({method:'initialized'});
    const config=await rpc('config/read',{cwd,includeLayers:false});
    const skills=await rpc('skills/list',{cwds:[cwd],forceReload:false});
    return {config:config.config,skills:skills.data,reader:'stdio' as const};
  } finally {
    clearTimeout(timer);
    // EOF permits normal shutdown; force termination if it does not exit promptly.
    const cleanup=setTimeout(()=>proc.kill('SIGKILL'),1000);
    try {try{proc.stdin.end();}catch{}await proc.exited;}
    finally {clearTimeout(cleanup);await reader.cancel().catch(()=>{});}
  }
}
export async function codexRead(exe:string,cwd:string) {
  try {return await daemonRead(exe,cwd);}
  catch(error){if(error instanceof Failure && error.code==='dependencies_missing')throw error;}
  try {return await stdioRead(exe,cwd);}
  catch {return fail(3,'codex_config_unavailable','Neither the matching local daemon nor short-lived native config/catalog reader is available','codex');}
}
