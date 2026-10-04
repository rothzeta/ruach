import { fail, type Selection } from '../contracts';
import { executable } from '../process';
export async function prepare(s:Selection):Promise<never> {
  executable('omp');
  return fail(3,'unsupported_adapter','OMP exact model selection and read-only effective config discovery are unverified; config CLI may write storage','omp');
}
