import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createNotRemote,
  createRemoteTicketType,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createHotelRoom } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    // Teste 1: verifica se a resposta contém um objeto do hotel
    it('should respond with status 200 and a hotel object if ticket is valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body.id).toEqual(hotel.id);
      expect(response.body.name).toEqual(hotel.name);
      expect(response.body.image).toEqual(hotel.image);
    });

    // Teste 2: verifica se a resposta contém um objeto do hotel com quartos
    it('should respond with status 200 and a hotel object with rooms if ticket is valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body.id).toEqual(hotel.id);
      expect(response.body.name).toEqual(hotel.name);
      expect(response.body.image).toEqual(hotel.image);
      expect(response.body.Rooms[0].id).toEqual(room.id);
      expect(response.body.Rooms[0].name).toEqual(room.name);
      expect(response.body.Rooms[0].capacity).toEqual(room.capacity);
    });

    // Teste 3: verifica se a resposta é 404 quando o ingresso não é encontrado
    it('should respond with status 404 if ticket not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if ticket not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket type not includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      await createHotelRoom(hotel.id);
      const response = await server.get('/hotels/' + hotel.id).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    // Teste 4: verifica se a resposta é 404 quando o hotel não é encontrado
    it('should respond with status 404 if hotel not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels/' + faker.datatype.number()).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    // Teste 5: verifica se a resposta é 400 quando o id do hotel não é um número
    it('should respond with status 400 if hotel id is not a number', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels/' + faker.lorem.word()).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
  });
});

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    let token: string;
    let enrollment: any;

    beforeEach(async () => {
      const user = await createUser();
      token = await generateValidToken(user);
      enrollment = await createEnrollmentWithAddress(user);
    });

    it('should respond with status 404 if enrollment not found', async () => {
      const newUser = await createUser();
      const newToken = await generateValidToken(newUser);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${newToken}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if ticket not found', async () => {
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket type is remote', async () => {
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket type not includes hotel', async () => {
      const ticketType = await createNotRemote(false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket not paid', async () => {
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 404 if ticket paid and includes hotel but there are no hotels', async () => {
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and an array of hotels if ticket paid and includes hotel', async () => {
      const ticketType = await createNotRemote(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        },
      ]);
    });
  });
});
