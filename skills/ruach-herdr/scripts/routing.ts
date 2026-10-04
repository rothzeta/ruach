// Portable catalog structure; preferences live in data, capabilities in adapters.
import { join } from 'node:path';
import { contents, exactKeys, fail, object, string, type Kind } from './contracts';
import { validateKind, validateEffort } from './adapters';
async function yaml(path: string, root: string) {
  let parseDocument, visit, isScalar;
  try { ({parseDocument,visit,isScalar}=await import('yaml')); }
  catch { return fail(2,'dependencies_missing','Run bun install --frozen-lockfile in the skill directory','yaml'); }
  const doc=parseDocument(await contents(path),{uniqueKeys:true});
  if(doc.errors.length || doc.warnings.length) fail(2,'invalid_yaml','Invalid YAML or duplicate key',path);
  visit(doc,{Pair(_key,pair){if(!isScalar(pair.key) || typeof pair.key.value!=='string') fail(2,'invalid_yaml','YAML mapping keys must be strings',path);}});
  let data;
  try{data=object(doc.toJS({maxAliasCount:0}),path);}catch(e){if(e instanceof Error && e.name==='Failure') throw e;return fail(2,'invalid_yaml','YAML aliases are unsupported',path);}
  exactKeys(data,[root],path);
  const mapping=object(data[root],`${path}:${root}`);
  if(!Object.keys(mapping).length) fail(2,'invalid_mapping','Expected a nonempty catalog',path);
  for(const key of Object.keys(mapping)) string(key,`${path}:${root}`);
  return mapping;
}
export async function routed(repo: string, role: string, requested?: string) {
  const models=await yaml(join(repo,'.agents','models.yaml'),'models');
  const routes=await yaml(join(repo,'.agents','routing.yaml'),'routes');
  const roles=await yaml(join(repo,'.agents','roles.yaml'),'roles');
  for(const [id,v] of Object.entries(models)) {
    const f=`models.yaml:models.${id}`, m=object(v,f);
    exactKeys(m,['harness','native_model'],f);
    validateKind(m.harness,`${f}.harness`);
    string(m.native_model,`${f}.native_model`);
  }
  for(const [id,v] of Object.entries(routes)) {
    const f=`routing.yaml:routes.${id}`, r=object(v,f);
    exactKeys(r,['model','effort'],f);string(r.model,`${f}.model`);
    if(!Object.hasOwn(models,r.model)) fail(2,'missing_model','Route references a missing model',f);
    string(r.effort,`${f}.effort`);
  }
  for(const [id,v] of Object.entries(roles)) {
    const f=`roles.yaml:roles.${id}`, r=object(v,f);
    exactKeys(r,['preferred','alternatives'],f);string(r.preferred,`${f}.preferred`);
    const alternatives=Object.hasOwn(r,'alternatives') ? r.alternatives : [];
    if(!Array.isArray(alternatives)) fail(2,'invalid_routes','Role alternatives must be a list',`${f}.alternatives`);
    for(const reference of [r.preferred,...alternatives]) {
      string(reference,`${f}.route`);
      if(!Object.hasOwn(routes,reference)) fail(2,'missing_route','Role references a missing route',f);
    }
  }
  if(!Object.hasOwn(roles,role)) fail(2,'missing_role','Role is absent from roles.yaml','role');
  const route=requested ?? roles[role].preferred;
  if(![roles[role].preferred,...(roles[role].alternatives ?? [])].includes(route)) fail(2,'disallowed_route','Requested route is outside role preferences and alternatives','route');
  const r=routes[route],m=models[r.model];
  await contents(join(repo,'.agents','agents',`${role}.md`));
  validateEffort(m.harness as Kind,r.effort);
  return {route,kind:m.harness as Kind,model:m.native_model as string,effort:r.effort as string,provenance:'repository .agents YAML'};
}
