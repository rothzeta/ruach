import { dirname, join, resolve } from 'node:path';
import { realpath } from 'node:fs/promises';
import { contents, fail, object, type Plan, type Selection } from '../contracts';
import { help } from '../process';
import { codexRead } from '../native-codex';
import { scan } from '../skills';
export const autoReview=['--approve-for-me'];
export function toml(v:any):string {
  if(typeof v==='string')return JSON.stringify(v);
  if(typeof v==='boolean' || typeof v==='number' && Number.isFinite(v))return String(v);
  if(Array.isArray(v))return `[${v.map(toml).join(',')}]`;
  if(v && typeof v==='object')return `{${Object.entries(v).map(([k,x])=>`${JSON.stringify(k)}=${toml(x)}`).join(',')}}`;
  return fail(3,'codex_config_unavailable','Unsupported effective skill configuration value','skills.config');
}
export function validateEffort(effort?:string) {
  if(effort && !['none','minimal','low','medium','high','xhigh','max'].includes(effort)) fail(2,'unsupported_effort','Effort is not a verified Codex value','effort');
}
export async function prepare(s:Selection,pass:string[]):Promise<Plan> {
  const {exe,version}=await help('codex',s.cwd,['--model','--config','--cd',...(s.permissions==='auto-review'?autoReview:[])]);
  validateEffort(s.effort);
  const native=await codexRead(exe,s.cwd);
  const config=object(native.config,'codex effective config');
  const developer=config.developer_instructions;
  if(developer!==null && developer!==undefined && typeof developer!=='string')fail(3,'codex_config_unavailable','Invalid effective developer instructions','developer_instructions');
  const entries=config.skills?.config ?? [];
  if(!Array.isArray(entries) || entries.some((e:any)=>!e || typeof e.path!=='string' || typeof e.enabled!=='boolean'))fail(3,'codex_config_unavailable','Invalid effective skill overrides','skills.config');
  if(!Array.isArray(native.skills) || native.skills.length!==1 || native.skills[0].cwd!==s.cwd || native.skills[0].errors?.length || !Array.isArray(native.skills[0].skills))fail(3,'codex_catalog_unavailable','Cannot establish the effective skill catalog','skills/list');
  const catalog=native.skills[0].skills;
  const canonical=await scan(join(s.resources??join(s.repo,'.agents'),'skills'),undefined,true);
  const workflows=catalog.filter((x:any)=>typeof x.name==='string'&&x.name.startsWith('ruach-workflow-'));
  if(workflows.some((x:any)=>typeof x.path!=='string')) fail(3,'codex_catalog_unavailable','Workflow catalog lacks native paths','skills/list');
  for(const entry of entries) {
    if(entry.path.includes('\0'))fail(3,'codex_config_unavailable','Invalid skill path','skills.config');
  }
  const merged=entries.map((e:any)=>({...e}));
  if(s.role!=='coordinator') {
    const paths=new Set<string>();
    for(const w of [...workflows,...canonical.filter(x=>x.workflow).map(x=>({path:join(x.source,'SKILL.md')}))]) {
      // Both representations occur in installed native catalogs/configs. Preserve aliases too.
      const file=w.path.endsWith('/SKILL.md') ? w.path : join(w.path,'SKILL.md');
      for(const p of [file,dirname(file),await realpath(file).catch(()=>file),await realpath(dirname(file)).catch(()=>dirname(file))])paths.add(p);
    }
    for(const entry of merged) {
      const p=resolve(s.cwd,entry.path);const canonicalPath=await realpath(p).catch(()=>p);
      if(paths.has(p)||paths.has(canonicalPath))entry.enabled=false;
    }
    for(const path of paths) {
      const existing=merged.find((e:any)=>e.path===path);
      if(existing)existing.enabled=false;else merged.push({path,enabled:false});
    }
  }
  const sourceContext=s.resources ? `Canonical role source: ${JSON.stringify(s.roleFile)}. Canonical skills directory: ${JSON.stringify(join(s.resources,'skills'))}. Resolve role-relative skill references from the role source directory. Only the Coordinator loads workflow bodies; workers follow their role and assignment.` : undefined;
  const combined=[developer,await contents(s.roleFile),sourceContext].filter(x=>x!==null&&x!==undefined&&x!=='').join('\n\n');
  const argv=['--model',s.model,'--cd',s.cwd,'-c',`developer_instructions=${toml(combined)}`];
  const redactedArgv=['--model',s.model,'--cd',s.cwd,'-c','developer_instructions=<redacted>'];
  if(s.permissions==='auto-review'){argv.push(...autoReview);redactedArgv.push(...autoReview);}
  if(s.effort){argv.push('-c',`model_reasoning_effort=${toml(s.effort)}`);redactedArgv.push('-c',`model_reasoning_effort=${toml(s.effort)}`);}
  argv.push('-c',`skills.config=${toml(merged)}`,...pass);
  redactedArgv.push('-c','skills.config=<preserved + workflow overrides>',...pass);
  return {argv,redactedArgv,coverage:'live-capable',version,hiddenWorkflows:s.role==='coordinator'?[]:[...new Set([...workflows.map((x:any)=>x.name),...canonical.filter(x=>x.workflow).map(x=>x.name)])],operations:native.reader==='stdio'?['short-lived Codex config/catalog reader may initialize native runtime state']:[],configReader:native.reader};
}
