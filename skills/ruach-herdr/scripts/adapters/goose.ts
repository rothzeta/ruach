import { join, dirname } from 'node:path';
import { contents, fail, type Plan, type Selection } from '../contracts';
import { help, run } from '../process';
import { scan } from '../skills';

export function validateEffort(effort?:string) {
  if(effort&&effort!=='auto')fail(2,'unsupported_effort','Goose supports only native default effort (omit effort or use auto)','effort');
}
export async function prepare(s:Selection,_pass:string[]):Promise<Plan> {
  const {exe,version}=await help('goose',s.cwd,['session']);
  const [major,minor]=version.split('.').map(Number);
  if(major!==1||minor<56)fail(3,'unsupported_cli','Goose requires the verified v1.56+ session interface','goose');
  const h=await run([exe,'session','--help'],s.cwd);
  if(h.exit!==0||h.timedOut||['--system','--provider','--model'].some(flag=>!h.stdout.includes(flag)))fail(3,'unsupported_cli','Installed Goose session help does not verify required native flags','goose');
  validateEffort(s.effort);
  if(!/^[^/\s]+\/[^\s]+$/.test(s.model))fail(2,'invalid_model','Goose model must use provider/model','model');
  const slash=s.model.indexOf('/'),provider=s.model.slice(0,slash),model=s.model.slice(slash+1);
  const canonical=await scan(join(s.resources??join(s.repo,'.agents'),'skills'),undefined,true);
  if(new Set(canonical.map(x=>x.name)).size!==canonical.length)fail(2,'duplicate_skill','Canonical skill names must be unique','skills');
  const visible=canonical.filter(x=>s.role==='coordinator'||!x.workflow);
  const context=`${await contents(s.roleFile)}\n\nCanonical role source: ${JSON.stringify(s.roleFile)}. Resolve role-relative references from ${JSON.stringify(dirname(s.roleFile))}. Only the Coordinator loads workflow bodies; workers follow their role and assignment.\nCanonical skills (read the matching SKILL.md on demand):\n${visible.map(x=>`- ${x.name}: ${JSON.stringify(join(x.path,'SKILL.md'))}`).join('\n')}`;
  const base=['session','--provider',provider,'--model',model,'--system'];
  const environment=Object.fromEntries(['GOOSE_PATH_ROOT','GOOSE_MODE','XDG_CONFIG_HOME','XDG_DATA_HOME','XDG_STATE_HOME','XDG_CACHE_HOME'].filter(key=>process.env[key]!==undefined).map(key=>[key,process.env[key]!])) as Record<string,string>;
  return {argv:[...base,context],redactedArgv:[...base,'<canonical-role-and-skill-index>'],environment,coverage:'live-capable',version,hiddenWorkflows:[],operations:['Goose help/version probes may initialize native logs','additive session system instructions with canonical role and on-demand skill paths; native settings, extensions and instructions remain active','worker workflow bodies are never injected; ambient workflow catalog visibility is unchanged','system instructions are visible in native process arguments; Herdr must advertise the goose kind']};
}
