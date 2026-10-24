import { join, dirname } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fail, type Plan, type Selection } from '../contracts';
import { help, run } from '../process';
import { scan } from '../skills';

export function validateEffort(effort?:string) {
  if(effort&&!['off','minimal','low','medium','high','xhigh','max','auto'].includes(effort))fail(2,'unsupported_effort','Effort is not a verified Pi thinking level','effort');
}
export async function prepare(s:Selection,_pass:string[]):Promise<Plan> {
  const {exe,version}=await help('pi',s.cwd,['--provider','--model','--thinking','--extension','--skill','--offline','--list-models']);
  const [major,minor]=version.split('.').map(Number);
  if(major!==1||minor<4)fail(3,'unsupported_cli','Pi requires the verified v1.4+ extension and resource interfaces','pi');
  validateEffort(s.effort);
  if(!/^[^/\s:]+\/[^\s]+$/.test(s.model))fail(2,'invalid_model','Pi model must use an exact provider/model ID','model');
  const slash=s.model.indexOf('/'),provider=s.model.slice(0,slash),model=s.model.slice(slash+1);
  // Pi also accepts fuzzy patterns. Require an exact catalog row so a typo
  // cannot silently select another model. Inspection sends no model turn.
  const catalog=await run([exe,'--offline','--list-models'],s.cwd);
  if(catalog.exit!==0||catalog.timedOut||!catalog.stdout.split('\n').some(row=>{const columns=row.trim().split(/\s+/);return columns[0]===provider&&columns[1]===model;}))fail(3,'model_unavailable','Exact Pi provider/model is absent from the available native catalog','model');
  const canonical=await scan(join(s.resources??join(s.repo,'.agents'),'skills'),undefined,true);
  if(new Set(canonical.map(x=>x.name)).size!==canonical.length)fail(2,'duplicate_skill','Canonical skill names must be unique','skills');
  const visible=canonical.filter(x=>s.role==='coordinator'||!x.workflow);
  const base=['--provider',provider,'--model',model,...(s.effort&&s.effort!=='auto'?['--thinking',s.effort]:[])];
  const argv=(extension:string)=>[...base,'--extension',extension,...visible.flatMap(x=>['--skill',x.path])];
  const environment=Object.fromEntries(['PI_CODING_AGENT_DIR','PI_CODING_AGENT_SESSION_DIR','PI_OFFLINE'].filter(key=>process.env[key]!==undefined).map(key=>[key,process.env[key]!])) as Record<string,string>;
  return {argv:argv('<private-temp>/role.ts'),redactedArgv:argv('<private-temp>/role.ts'),environment,coverage:'live-capable',version,hiddenWorkflows:[],operations:['native offline model catalog read may initialize Pi runtime state','private additive role extension; native APPEND_SYSTEM.md, context, extensions and skill settings remain active','canonical skills added individually; worker workflow bodies are never injected; ambient workflow catalog visibility is unchanged'],materialize:async(temp)=>{
    const extension=join(temp,'role.ts');
    // --append-system-prompt replaces discovered APPEND_SYSTEM.md. Extend the
    // composed native prompt instead, preserving its trust and discovery rules.
    const context=`\n\nCanonical role source: ${JSON.stringify(s.roleFile)}. Resolve role-relative references from ${JSON.stringify(dirname(s.roleFile))}. Only the Coordinator loads workflow bodies; workers follow their role and assignment.`;
    await writeFile(extension,`import { readFileSync } from 'node:fs';\nexport default function(pi) {\n  const role = readFileSync(${JSON.stringify(s.roleFile)}, 'utf8');\n  pi.on('before_agent_start', async (event) => ({ systemPrompt: event.systemPrompt + '\\n\\n' + role + ${JSON.stringify(context)} }));\n}\n`,{mode:0o600,flag:'wx'});
    return argv(extension);
  }};
}
