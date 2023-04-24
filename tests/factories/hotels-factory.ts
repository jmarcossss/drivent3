import faker from '@faker-js/faker';
import { prisma } from '@/config';

async function generateHotelData() {
  return { image: faker.image.imageUrl(), name: faker.name.findName() };
}

export async function createHotel() {
  const hotelData = await generateHotelData();
  return prisma.hotel.create({ data: hotelData });
}

async function generateHotelRoomData(hotelId: number) {
  return { hotelId, name: faker.name.findName(), capacity: faker.datatype.number() };
}

export async function createHotelRoom(hotelId: number) {
  const roomData = await generateHotelRoomData(hotelId);
  return prisma.room.create({ data: roomData });
}
