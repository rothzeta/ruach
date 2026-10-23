import { randomBytes } from 'node:crypto';
import { fail } from './contracts';
import { environment } from './process';

export interface OpenCodeSnapshot {
  config: {type:string; path?:string; info?:Record<string,any>}[];
  agents: Record<string,any>[];
  models: Record<string,any>[];
  skills: Record<string,any>[];
}

// The shared v2 service owns its startup environment. Use an owned, short-lived
// server to inspect caller settings without touching anyone else's sessions.
export async function opencodeRead(exe:string,cwd:string,overlay:Record<string,string>={}):Promise<OpenCodeSnapshot> {
  const password=randomBytes(32).toString('base64url');
  let proc:ReturnType<typeof Bun.spawn>;
  try {proc=Bun.spawn([exe,'serve','--stdio','--port','0'],{cwd,env:{...environment(),...overlay,OPENCODE_PASSWORD:password},stdin:'pipe',stdout:'pipe',stderr:'ignore',detached:true});}
  catch {return fail(3,'opencode_config_unavailable','Cannot start the private OpenCode configuration reader','opencode');}
  const kill=()=>{try{process.kill(-proc.pid,'SIGKILL');}catch{try{proc.kill('SIGKILL');}catch{}}};
  const controller=new AbortController();
  const timer=setTimeout(()=>{controller.abort();kill();},15000);
  const stream=proc.stdout;
  if(!stream||typeof stream==='number') {kill();clearTimeout(timer);return fail(3,'opencode_config_unavailable','OpenCode reader has no output stream','opencode');}
  const reader=stream.getReader();
  const pause=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
  try {
    const inspect=async()=>{
      let first='';
      for(;;) {
        const {done,value}=await reader.read();
        if(done)throw Error('reader ended');
        first+=new TextDecoder().decode(value);
        if(first.length>65536)throw Error('oversized readiness');
        if(first.includes('\n'))break;
      }
      const ready=JSON.parse(first.slice(0,first.indexOf('\n')));
      const url=new URL(ready.url);
      if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||!url.port||url.username||url.password)throw Error('invalid endpoint');
      void (async()=>{try{while(!(await reader.read()).done){}}catch{}})();
      const get=async(resource:string)=>{
        const target=new URL(`/api/${resource}`,url);
        target.searchParams.set('location[directory]',cwd);
        const response=await fetch(target,{headers:{authorization:`Basic ${Buffer.from(`opencode:${password}`).toString('base64')}`},signal:controller.signal,redirect:'error'});
        if(!response.ok)throw Error('native read failed');
        const body=await response.text();if(body.length>16*1024*1024)throw Error('oversized catalog');
        const value=JSON.parse(body);
        if(resource==='config') {if(!Array.isArray(value)||value.some(e=>!e||!['document','directory'].includes(e.type)||e.type==='document'&&(!e.info||typeof e.info!=='object'||Array.isArray(e.info))))throw Error('invalid config');return value;}
        if(value.location?.directory!==cwd||!Array.isArray(value.data)||value.data.some((e:unknown)=>!e||typeof e!=='object'||Array.isArray(e)))throw Error('invalid catalog');
        return value.data;
      };
      // model.list awaits plugin activation in v2.1.4. Earlier catalog reads can
      // return empty agents/skills even when the configuration is valid.
      const models=await get('model');
      const [config,agents,skills]=await Promise.all([get('config'),get('agent'),get('skill')]);
      return {config,agents,models,skills};
    };
    return await Promise.race([inspect(),new Promise<never>((_,reject)=>controller.signal.addEventListener('abort',()=>reject(Error('reader timeout')),{once:true}))]);
  } catch {return fail(3,'opencode_config_unavailable','Cannot verify native OpenCode config and catalogs; private output withheld','opencode');}
  finally {
    clearTimeout(timer);controller.abort();
    if(proc.stdin&&typeof proc.stdin!=='number')try{proc.stdin.end();}catch{}
    await Promise.race([proc.exited,pause(500)]);
    kill();void reader.cancel().catch(()=>{});
    await Promise.race([proc.exited,pause(500)]);
  }
}
