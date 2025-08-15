import { Router } from 'express';

import { createCard, deleteCard, getCardById, getUserCards } from '../controllers/cardsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchema(schemas.card), validateToken, createCard);
cardsRouter.get('/cards/all', validateToken, getUserCards);
cardsRouter.get('/cards/:id', validateToken, getCardById);
cardsRouter.delete('/cards/:id/delete', validateToken, deleteCard);

export { cardsRouter };
