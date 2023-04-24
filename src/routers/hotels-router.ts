import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotel } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:id', getHotel);

export { hotelsRouter };
