import { join, resolve } from 'node:path';
import { readFile, mkdir, symlink, writeFile } from 'node:fs/promises';
import { fail, type Plan, type Selection } from '../contracts';
import { help } from '../process';
import { ancestors, claudeHome, localSkills, scan, nestedClaudeRoots } from '../skills';
async function settings(path:string) {
  const body=await readFile(path,'utf8').catch((e)=>{if(e.code==='ENOENT')return null;return fail(2,'unreadable_settings','Cannot read Claude settings',path);});
  if(body===null)return {};
  try {const v=JSON.parse(body);if(!v||typeof v!=='object'||Array.isArray(v))throw Error();return v;}
  catch{return fail(2,'invalid_settings','Invalid Claude settings JSON',path);}
}
export const autoReview=['--permission-mode','auto'];
export function validateEffort(effort?:string) {
  if(effort && !['low','medium','high','xhigh','max'].includes(effort))fail(2,'unsupported_effort','Effort is not a verified Claude value','effort');
}
export async function prepare(s:Selection,pass:string[]):Promise<Plan> {
  const {version}=await help('claude',s.cwd,['--model','--effort','--settings','--add-dir',...(s.permissions==='auto-review'?['--permission-mode']:[])]);
  // Installed help omits the documented hidden append-file flag; verified version gate.
  const [major,minor,patch]=version.split('.').map(Number);
  if(major!==2 || minor!==1 || patch<260)fail(3,'unsupported_cli','Claude requires verified append-file and skillOverrides support','claude');
  validateEffort(s.effort);
  const extraDirectories:string[]=[];
  for(let i=0;i<pass.length;i++) {
    if(pass[i]==='--add-dir')extraDirectories.push(resolve(s.cwd,pass[++i]));
    else if(pass[i].startsWith('--add-dir='))extraDirectories.push(resolve(s.cwd,pass[i].slice('--add-dir='.length)));
  }
  const scanLocal=(root:string)=>scan(root,join(claudeHome(s.cwd),'skills','synced'));
  const nested=await nestedClaudeRoots(s.repo);
  const all=[...await localSkills(s.repo,s.cwd),...(await Promise.all(nested.map(scanLocal))).flat(),...(await Promise.all(extraDirectories.flatMap(p=>[join(p,'.claude','skills'),join(p,'.agents','skills')]).map(scanLocal))).flat()];
  const canonical=await scan(join(s.repo,'.agents','skills'));
  if(new Set(canonical.map(x=>x.name)).size!==canonical.length)fail(2,'duplicate_skill','Canonical skill names must be unique','skills');
  const discovered=new Set(all.filter(x=>x.workflow).map(x=>x.name));
  const settingsPaths=[join(claudeHome(s.cwd),'settings.json'),...ancestors(s.cwd).reverse().flatMap(p=>[join(p,'.claude','settings.json'),join(p,'.claude','settings.local.json')])];
  for(const path of settingsPaths) {
    const v=await settings(path);
    for(const name of Object.keys(v.skillOverrides??{}))if(name.startsWith('ruach-workflow-'))discovered.add(name);
  }
  const hidden=s.role==='coordinator'?[]:[...discovered].sort();
  const visible=canonical.filter(x=>s.role==='coordinator'||!x.workflow);
  const base=['--model',s.model,'--append-system-prompt-file',s.roleFile];
  if(s.permissions==='auto-review')base.push(...autoReview);
  if(s.effort)base.push('--effort',s.effort);
  const argv=[...base,'--settings','<private-temp>/settings.json','--add-dir','<private-temp>',...pass];
  return {argv,redactedArgv:argv,coverage:'live-capable',version,hiddenWorkflows:hidden,operations:['private settings.json with workflow visibility overlay','canonical skill symlinks in private .claude/skills'],materialize:async(temp)=>{
    const dir=join(temp,'.claude','skills');await mkdir(dir,{recursive:true,mode:0o700});
    for(const skill of visible)await symlink(skill.path,join(dir,skill.name),'dir');
    await writeFile(join(temp,'settings.json'),JSON.stringify({skillOverrides:Object.fromEntries(hidden.map(n=>[n,'off']))}),{mode:0o600,flag:'wx'});
    return [...base,'--settings',join(temp,'settings.json'),'--add-dir',temp,...pass];
  }};
}
