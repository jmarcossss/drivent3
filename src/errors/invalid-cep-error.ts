import { ApplicationError } from '@/protocols';

export function invalidCEPError(): ApplicationError {
  return {
    name: 'InvalidCEPError',
    message: 'Invalid CEP',
  };
}
