import { Request, Response } from 'express';

import * as cardsServices from '../services/cardsServices';
import { CardData } from '../types/cardType';

export async function createCard(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const card: CardData = req.body;
  await cardsServices.createCard(card, userId);
  res.status(201).send({ message: 'Card created successfully' });
}

export async function getUserCards(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const userCards = await cardsServices.getUserCards(userId);
  res.status(200).send(userCards);
}

export async function getCardById(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const cardId = Number(req.params.id);
  const card = await cardsServices.getCardById(userId, cardId);
  res.status(200).send(card);
}

export async function deleteCard(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const cardId = Number(req.params.id);
  await cardsServices.deleteCard(userId, cardId);
  res.status(200).send({ message: 'Card deleted successfully' });
}

export async function updateCard(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const cardId = Number(req.params.id);
  const cardData: CardData = req.body;
  await cardsServices.updateCard(userId, cardId, cardData);
  res.status(200).send({ message: 'Card updated successfully' });
}
