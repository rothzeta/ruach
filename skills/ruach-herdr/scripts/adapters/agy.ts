import { fail, type Selection } from '../contracts';
import { executable } from '../process';
export async function prepare(s:Selection):Promise<never> {
  executable('agy');
  return fail(3,'unsupported_adapter','Agy additive role contribution and selective workflow exclusion cannot be verified','agy');
}
