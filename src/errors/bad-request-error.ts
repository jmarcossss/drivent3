import { ApplicationError } from '@/protocols';

export function BadRequestError(message: string, code = 400): ApplicationError {
  return {
    name: 'BadRequestError',
    message: `${message} (Code: ${code})`,
  };
}
