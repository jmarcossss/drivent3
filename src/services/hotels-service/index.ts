import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotels-repository';

async function getFilteredHotels(filter?: (hotel: any) => boolean): Promise<any[]> {
  const hotels = await hotelRepository.findAllHotels();

  if (!filter) {
    return hotels;
  }

  return hotels.filter(filter);
}

function throwIfEmpty(hotels: any[]) {
  if (hotels.length === 0) {
    throw notFoundError();
  }
}

export async function findAllHotels() {
  const hotels = await getFilteredHotels();
  throwIfEmpty(hotels);
  return hotels;
}

export async function findHotelById(id: number) {
  const filteredHotels = await getFilteredHotels((h) => h.id === id);
  throwIfEmpty(filteredHotels);
  return filteredHotels[0];
}

const hotelService = {
  findAllHotels,
  findHotelById,
};

export default hotelService;
