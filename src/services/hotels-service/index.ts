import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotels-repository';

export async function findAllHotels() {
  const hotels = await hotelRepository.findAllHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

export async function findHotelById(id: number) {
  const hotel = await hotelRepository.findHotelById(id);
  if (!hotel) throw notFoundError();
  return hotel;
}

const hotelService = {
  findAllHotels,
  findHotelById,
};

export default hotelService;
