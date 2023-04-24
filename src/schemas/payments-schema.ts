import Joi, { Schema } from 'joi';

export type PaymentParams = {
  ticketId: number;
  cardData: { issuer: string; number: number; name: string; expirationDate: Date; cvv: number };
};

const paymentSchema: Schema = Joi.object<PaymentParams>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.number().required(),
  }).required(),
});

class PaymentValidator {
  static validate(params: PaymentParams): PaymentParams {
    const { error, value } = paymentSchema.validate(params, { abortEarly: false });

    if (error) {
      throw error;
    }

    return value;
  }
}

export default PaymentValidator;
