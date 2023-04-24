import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

function generateTicketTypeData(isRemote: boolean, includesHotel: boolean) {
  return {
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote,
    includesHotel,
  };
}

export async function createTicketType() {
  const ticketTypeData = generateTicketTypeData(faker.datatype.boolean(), faker.datatype.boolean());
  return prisma.ticketType.create({
    data: ticketTypeData,
  });
}

export async function createRemoteTicketType() {
  const remoteTicketTypeData = generateTicketTypeData(true, false);
  return prisma.ticketType.create({
    data: remoteTicketTypeData,
  });
}

export function createNotRemote(includesHotel: boolean) {
  const notRemoteTicketTypeData = generateTicketTypeData(false, includesHotel);
  return prisma.ticketType.create({
    data: notRemoteTicketTypeData,
  });
}

async function generateTicketData(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return {
    enrollmentId,
    ticketTypeId,
    status,
  };
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  const ticketData = await generateTicketData(enrollmentId, ticketTypeId, status);
  return prisma.ticket.create({
    data: ticketData,
  });
}
