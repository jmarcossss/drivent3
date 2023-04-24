import { Response } from 'express';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { paymentRequiredError } from '@/errors/payment-required-error';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotels-service';
import paymentsService from '@/services/payments-service';
import ticketService from '@/services/tickets-service';

async function validadeRequest(req: AuthenticatedRequest) {
  const userId = req.userId;
  const ticket = await ticketService.getTicketByUserId(userId);
  if (ticket.status !== TicketStatus.PAID) throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}

interface CustomError extends Error {
  name: string;
  message: string;
}

function handleErrors(error: CustomError, res: Response) {
  const errorMapping: Record<string, number> = {
    PaymentRequiredError: httpStatus.PAYMENT_REQUIRED,
    NotFoundError: httpStatus.NOT_FOUND,
  };

  const status = errorMapping[error.name] || httpStatus.BAD_REQUEST;
  return res.status(status).send(error.message);
}

export function getHotels(req: AuthenticatedRequest, res: Response) {
  validadeRequest(req)
    .then(() => hotelService.findAllHotels())
    .then((hotels) => res.status(httpStatus.OK).send(hotels))
    .catch((error) => handleErrors(error, res));
}

export function getHotel(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.id);
  if (isNaN(hotelId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  validadeRequest(req)
    .then(() => hotelService.findHotelById(hotelId))
    .then((hotel) => res.status(httpStatus.OK).send(hotel))
    .catch((error) => handleErrors(error, res));
}
