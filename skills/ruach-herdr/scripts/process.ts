import { fail } from './contracts';
export async function run(argv: string[], cwd: string, timeout = 10000) {
  let proc;
  try { proc=Bun.spawn(argv,{cwd,env:process.env,stdin:'ignore',stdout:'pipe',stderr:'pipe'}); }
  catch { return fail(3,'executable_unavailable','Could not execute prerequisite',argv[0]); }
  let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;proc.kill();},timeout);
  try {
    const [stdout,stderr,exit]=await Promise.all([new Response(proc.stdout).text(),new Response(proc.stderr).text(),proc.exited]);
    return {stdout,stderr,exit,timedOut};
  } finally {clearTimeout(timer);}
}
export function executable(name: string): string {
  const path=Bun.which(name);
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
