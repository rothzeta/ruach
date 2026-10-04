import { fail, type Selection } from '../contracts';
import { executable } from '../process';
export async function prepare(s:Selection):Promise<never> {
  executable('opencode');
  return fail(3,'unsupported_adapter','OpenCode additive prompt composition, config merge and provider effort mapping are unverified','opencode');
}
