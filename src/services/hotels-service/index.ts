import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotels-repository';

export async function findAllHotels() {
  try {
    const hotels = await hotelRepository.findAllHotels();
    return hotels.length === 0 ? Promise.reject(notFoundError()) : hotels;
  } catch (error) {
    throw notFoundError();
  }
}

export async function findHotelById(id: number) {
  try {
    const hotel = await hotelRepository.findHotelById(id);
    return hotel ? hotel : Promise.reject(notFoundError());
  } catch (error) {
    throw notFoundError();
  }
}

const hotelService = {
  findAllHotels,
  findHotelById,
};

export default hotelService;
