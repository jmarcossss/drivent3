import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

class HotelRepository {
  static async findAllHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
  }

  static async findHotelById(id: number): Promise<Hotel & { Rooms: Room[] }> {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        Rooms: true,
      },
    });
  }
}

export default HotelRepository;
