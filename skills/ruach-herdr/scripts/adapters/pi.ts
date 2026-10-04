import { fail, type Selection } from '../contracts';
import { executable } from '../process';
export async function prepare(s:Selection):Promise<never> {
  executable('pi');
  return fail(3,'unsupported_adapter','Pi effective skill discovery and additive prompt preservation require installed-version verification','pi');
}
