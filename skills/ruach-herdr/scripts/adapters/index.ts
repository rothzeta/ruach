import { fail, string, type Kind, type Selection } from '../contracts';
import { run, executable } from '../process';
import * as claude from './claude';
import * as codex from './codex';
import * as pi from './pi';
import * as opencode from './opencode';
import * as dsh from './dsh';
import * as omp from './omp';
import * as agy from './agy';
const adapters={claude,codex,pi,opencode,dsh,omp,agy};
export function validateKind(value:unknown,field:string):Kind {
  const kind=string(value,field);
  if(!Object.hasOwn(adapters,kind))fail(2,'invalid_kind','Unknown adapter kind',field);
  return kind as Kind;
}
export function validateEffort(kind:Kind,effort?:string) {
  const adapter=adapters[kind];
  if('validateEffort' in adapter)adapter.validateEffort(effort);
  // Gated adapters have no verified effort contract; preparation reports exit 3.
}
// A small documented native pass-through surface prevents prompts, resume and
// configuration flags from bypassing the preparation contract. Never shell-split.
const allowed:Record<string,Record<string,number>>={
  codex:{'--no-alt-screen':0,'--sandbox':1,'-s':1,'--ask-for-approval':1,'-a':1,'--add-dir':1},
  claude:{'--verbose':0,'--permission-mode':1,'--add-dir':1},
};
export function validatePass(s:Selection,pass:string[]) {
  const map=allowed[s.kind]??{};
  for(let i=0;i<pass.length;i++) {
    const flag=pass[i].split('=')[0];
    if(s.permissions==='auto-review' && ['--permission-mode','--sandbox','-s','--ask-for-approval','-a','--approve-for-me'].includes(flag))fail(2,'conflicting_native_argument','Native permission flags conflict with the adapter-owned auto-review policy','native argv');
    if(!Object.hasOwn(map,flag))fail(2,'conflicting_native_argument','Native argument is conflicting, unsafe or outside the documented pass-through surface','native argv');
    if(pass[i].includes('\0'))fail(2,'invalid_argument','NUL bytes are unsupported','native argv');
    if(map[flag]===0 && pass[i].includes('='))fail(2,'invalid_argument','Boolean native flag cannot have a value','native argv');
    if(map[flag]===1 && !pass[i].includes('=')) {
      if(++i>=pass.length || pass[i].startsWith('-') || pass[i].includes('\0'))fail(2,'invalid_argument','Native flag requires a value','native argv');
    }
  }
}
export function redactPass(pass:string[]) {
  const out:string[]=[];
  for(let i=0;i<pass.length;i++) {
    const p=pass[i],flag=p.split('=')[0];
    if(p.includes('='))out.push(`${flag}=<redacted>`);
    else {out.push(p);if(!['--no-alt-screen','--verbose'].includes(p)) {i++;out.push('<redacted>');}}
  }
  return out;
}
export async function prepare(s:Selection,pass:string[]) {
  validatePass(s,pass);
  if(s.permissions==='auto-review' && !('autoReview' in adapters[s.kind]))fail(3,'unsupported_permissions','Selected adapter has no verified auto-review permission mapping','permissions');
  if(pass.length) {
    const h=await run([executable(s.kind),'--help'],s.cwd);
    if(h.exit!==0||h.timedOut||pass.filter(p=>p.startsWith('-')).some(p=>!h.stdout.includes(p.split('=')[0])))fail(3,'unsupported_cli','Native pass-through flag is not verified by installed help','native argv');
  }
  const plan=await adapters[s.kind].prepare(s,pass);
  if(pass.length)plan.redactedArgv=[...plan.redactedArgv.slice(0,-pass.length),...redactPass(pass)];
  return plan;
}
