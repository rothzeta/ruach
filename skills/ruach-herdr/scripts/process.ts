import { basename, delimiter, resolve } from 'node:path';
import { fail } from './contracts';
// Git repository selection must come from the explicit -C path, never inherited GIT_* variables.
// PATH with every entry absolute: empty and relative entries are resolved once against the
// launcher's cwd. The probes, the helpers and the launched pane then agree on which executable
// a name means, instead of re-resolving relative entries from different working directories.
export function pinnedPath(): string|undefined {
  const path=process.env.PATH;
  if(path===undefined) return undefined;
  return path.split(delimiter).map(entry=>resolve(process.cwd(),entry===''?'.':entry)).join(delimiter);
}
export function environment(argv: string[]=[]) {
  const pinned=pinnedPath();
  const base={...process.env,...(pinned===undefined?{}:{PATH:pinned})};
  if(basename(argv[0]??'')!=='git') return base;
  return Object.fromEntries(Object.entries(base).filter(([name])=>!name.toUpperCase().startsWith('GIT_')));
}
// Grace for output pipes to close after a helper exits or is killed. Descendants can hold
// them indefinitely, so no call waits past this bound.
const DRAIN_MS=500;
const pause=(ms:number)=>new Promise<void>(resolve=>{setTimeout(resolve,ms).unref();});
// Helpers run in their own process group, which is the only group ever signalled. The Herdr
// server and any agent it launches are never in it.
export async function run(argv: string[], cwd: string, timeout = 10000) {
  let proc;
  try { proc=Bun.spawn(argv,{cwd,env:environment(argv),stdin:'ignore',stdout:'pipe',stderr:'pipe',detached:true}); }
  catch { return fail(3,'executable_unavailable','Could not execute prerequisite',argv[0]); }
  const kill=()=>{try{process.kill(-proc.pid,'SIGKILL');}catch{try{proc.kill('SIGKILL');}catch{}}};
  let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;kill();},timeout);
  const readers:ReadableStreamDefaultReader<Uint8Array>[]=[];
  const collect=async(stream:ReadableStream<Uint8Array>)=>{
    const reader=stream.getReader();readers.push(reader);
    const chunks:Uint8Array[]=[];
    try{for(;;){const {done,value}=await reader.read();if(done)break;chunks.push(value);}}catch{}
    return Buffer.concat(chunks).toString('utf8');
  };
  const stdout=collect(proc.stdout),stderr=collect(proc.stderr);
  try {
    const exited=await Promise.race([proc.exited,pause(timeout+DRAIN_MS*2).then(()=>null)]);
    const drained=await Promise.race([Promise.all([stdout,stderr]).then(()=>true),pause(DRAIN_MS).then(()=>false)]);
    if(!drained) {
      // Pipes still open: a descendant of our own group is holding them. Reap it, then stop waiting.
      kill();
      await Promise.race([Promise.all([stdout,stderr]),pause(DRAIN_MS)]);
    }
    for(const reader of readers)reader.cancel().catch(()=>{});
    const text=await Promise.all([Promise.race([stdout,pause(50).then(()=>'')]),Promise.race([stderr,pause(50).then(()=>'')])]);
    return {stdout:text[0],stderr:text[1],exit:exited??proc.exitCode??-1,timedOut:timedOut||exited===null};
  } finally {clearTimeout(timer);}
}
export function executable(name: string): string {
  const path=Bun.which(name,{PATH:pinnedPath()??'',cwd:process.cwd()});
  if(!path) fail(3,'missing_cli','Required executable is absent from PATH',name);
  return path;
}
export async function help(name: string, cwd: string, flags: string[]) {
  const exe=executable(name);
  const h=await run([exe,'--help'],cwd);
  if(h.exit!==0 || h.timedOut || flags.some(f=>!h.stdout.includes(f))) fail(3,'unsupported_cli','Installed help does not verify required native flags',name);
  const v=await run([exe,'--version'],cwd);
  if(v.exit!==0 || v.timedOut) fail(3,'unsupported_cli','Cannot establish installed CLI version',name);
  // Never forward raw help, stderr, or configuration values into diagnostics.
  const version=v.stdout.trim().match(/(?:\d+\.){1,3}\d+/)?.[0];
  if(!version) fail(3,'unsupported_cli','CLI version is not recognized',name);
  return {exe,version};
}
export function json(text: string, field: string): any {
  try{return JSON.parse(text);}catch{return fail(3,'invalid_probe','Prerequisite did not return valid JSON',field);}
}
