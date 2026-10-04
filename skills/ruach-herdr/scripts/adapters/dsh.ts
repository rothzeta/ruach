import { fail, type Selection } from '../contracts';
import { executable } from '../process';
export async function prepare(s:Selection):Promise<never> {
  executable('dsh');
  return fail(3,'unsupported_adapter','DSH native role and skill configuration are unverified; Herdr must also explicitly support its kind','dsh');
}
