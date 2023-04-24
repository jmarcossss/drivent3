import { notFoundError, unauthorizedError } from '@/errors';
import { CardPaymentParams, PaymentParams } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

export async function verifyTicketAndEnrollment(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTickeyById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();
}

export async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);

  return payment;
}

export async function paymentProcess(ticketId: number, userId: number, cardData: CardPaymentParams) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const ticket = await ticketsRepository.findTickeWithTypeById(ticketId);

  const paymentData: PaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentsRepository.createPayment(ticketId, paymentData);

  await ticketsRepository.ticketProcessPayment(ticketId);

  return payment;
}

export default { getPaymentByTicketId, paymentProcess };
