import { ApplicationError } from '@/protocols';

export function BadRequestError(message: string): ApplicationError {
  return {
    name: 'BadRequestError',
    message,
  };
}
