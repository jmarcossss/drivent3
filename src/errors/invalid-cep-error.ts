import { ApplicationError } from '@/protocols';

export function invalidCEPError(code = 1000): ApplicationError {
  return {
    name: 'InvalidCEPError',
    message: `Invalid CEP (Code: ${code})`,
  };
}
