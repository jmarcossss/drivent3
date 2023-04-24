import { ApplicationError } from '@/protocols';

export function paymentRequiredError(code = 2000): ApplicationError {
  return {
    name: 'PaymentRequiredError',
    message: `Could not find payment information (Code: ${code})`,
  };
}
