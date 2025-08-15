import { Router } from 'express';

import { createCard, deleteCard, getCardById, getUserCards } from '../controllers/cardsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchema(schemas.card), validatetoken, createCard);
cardsRouter.get('/cards/all', validatetoken, getUserCards);
cardsRouter.get('/cards/:id', validatetoken, getCardById);
cardsRouter.delete('/cards/:id/delete', validatetoken, deleteCard);

export { cardsRouter };
