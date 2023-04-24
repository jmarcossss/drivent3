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

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    await validadeRequest(req);
    const hotels = await hotelService.findAllHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'PaymentRequiredError') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotel(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.id);
  if (isNaN(hotelId)) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    await validadeRequest(req);
    const hotel = await hotelService.findHotelById(hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'PaymentRequiredError') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
