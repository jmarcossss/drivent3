import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotels-repository';

async function findHotels(filter?: (hotel: any) => boolean) {
  const hotels = await hotelRepository.findAllHotels();

  if (hotels.length === 0) {
    throw notFoundError();
  }

  if (filter) {
    const filteredHotels = hotels.filter(filter);

    if (filteredHotels.length === 0) {
      throw notFoundError();
    }

    return filteredHotels;
  }

  return hotels;
}

export async function findAllHotels() {
  return findHotels();
}

export async function findHotelById(id: number) {
  const [hotel] = await findHotels((h) => h.id === id);
  return hotel;
}

const hotelService = { findAllHotels, findHotelById };

export default hotelService;
