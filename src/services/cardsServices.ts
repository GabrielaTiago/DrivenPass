import { Card } from '@prisma/client';

import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as cardsRepository from '../repositories/cardsRepository';
import { CardData } from '../types/cardType';
import { encryptPassword, decryptPassword } from '../utils/passwordEncryption';

export async function createCard(data: CardData, userId: number) {
  await checkCardNickname(userId, data.nickname);
  const encryptedPassword = encryptPassword(data.password);
  const encryptedCvv = encryptPassword(data.cvv);
  await cardsRepository.createCard({ ...data, password: encryptedPassword, cvv: encryptedCvv }, userId);
}

export async function getUserCards(userId: number) {
  const cards = await cardsRepository.getUserCards(userId);
  return cards.map(decryptCard);
}

export async function getCardById(userId: number, cardId: number) {
  const card = await validateCardAccess(userId, cardId);
  return decryptCard(card);
}

export async function deleteCard(userId: number, cardId: number) {
  await validateCardAccess(userId, cardId);
  await cardsRepository.deleteCard(cardId);
}

export async function updateCard(userId: number, cardId: number, data: CardData) {
  await validateCardAccess(userId, cardId);
  await cardsRepository.updateCard(cardId, {
    ...data,
    password: encryptPassword(data.password),
    cvv: encryptPassword(data.cvv),
  });
}

export async function checkCardNickname(userId: number, nickname: string) {
  const card = await cardsRepository.findCardByNicknameAndUser(userId, nickname);
  if (card) throw throwErrorMessage('conflict', 'Card with this nickname already exists');
}

export function decryptCard(card: Card) {
  return {
    ...card,
    password: decryptPassword(card.password),
    cvv: decryptPassword(card.cvv),
  };
}

export async function validateCardAccess(userId: number, cardId: number) {
  const card = await cardsRepository.getCardById(cardId);
  if (!card) throw throwErrorMessage('not_found', "Card doesn't exist");
  if (card.userId !== userId) throw throwErrorMessage('forbidden', "You don't have permission to perform this action");
  return card;
}
