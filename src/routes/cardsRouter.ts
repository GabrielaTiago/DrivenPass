import { Router } from 'express';

import { createCard, deleteCard, getCardById, getUserCards } from '../controllers/cardsController';
import { validateSchemas } from '../middlewares/validateSchemasMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';

const cardsRouter = Router();

cardsRouter.post('/cards', validateSchemas('card'), validatetoken, createCard);
cardsRouter.get('/cards/all', validatetoken, getUserCards);
cardsRouter.get('/cards/:id', validatetoken, getCardById);
cardsRouter.delete('/cards/:id/delete', validatetoken, deleteCard);

export { cardsRouter };
