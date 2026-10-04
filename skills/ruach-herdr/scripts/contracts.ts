import { stat, readFile } from 'node:fs/promises';
export const kinds = ['claude', 'codex', 'pi', 'opencode', 'dsh', 'omp', 'agy'] as const;
export type Kind = typeof kinds[number];
export const efforts = ['off','none','minimal','low','medium','high','xhigh','max','auto'] as const;
export class Failure extends Error {
  constructor(public exit: 2 | 3 | 4, public code: string, message: string, public field?: string) { super(message); this.name='Failure'; }
}
export function fail(exit: 2 | 3 | 4, code: string, message: string, field?: string): never { throw new Failure(exit,code,message,field); }
export function object(value: unknown, field: string): Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(2,'invalid_mapping','Expected a mapping',field);
  return value as Record<string, any>;
}
export function string(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\0\r\n]/.test(value)) fail(2,'invalid_string','Expected a nonempty single-line string',field);
  return value;
}
export function identifier(value: unknown, field: string): string {
  const s=string(value,field);
  if (!/^[a-z][a-z0-9_-]*$/.test(s)) fail(2,'invalid_identifier','Expected a lowercase identifier',field);
  return s;
}
export function exactKeys(value: Record<string, any>, keys: string[], field: string) {
  if (Object.keys(value).some(k=>!keys.includes(k))) fail(2,'unknown_key','Unknown configuration key',field);
}
export async function directory(path: string, field: string) {
  if (!(await stat(path).catch(()=>null))?.isDirectory()) fail(2,'missing_directory','Directory must exist',field);
}
export async function contents(path: string): Promise<string> {
  try { return await readFile(path,'utf8'); } catch { return fail(2,'unreadable_file','Required file is unreadable',path); }
}
export type Permissions = 'inherit' | 'auto-review';
export interface Selection {
  name: string; role: string; roleFile: string; roleHash: string; repo: string; cwd: string;
  resources?: string;
  kind: Kind; model: string; permissions: Permissions; effort?: string; route?: string; provenance: string;
}
export interface Plan {
  argv: string[]; redactedArgv: string[]; coverage: 'live-capable' | 'fixture/failure-only';
  version: string; hiddenWorkflows: string[]; operations: string[];
  configReader?: 'daemon' | 'stdio';
  materialize?: (temp: string) => Promise<string[]>;
}
