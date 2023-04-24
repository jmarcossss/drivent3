import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: { id },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findAllHotels,
  findHotelById,
};

export default hotelRepository;
