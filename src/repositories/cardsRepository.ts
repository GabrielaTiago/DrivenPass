import { database } from '../config/postegres';
import { CardData } from '../types/cardType';

export async function findMoreThanOneNickname(userId: number, nickname: string) {
  const resultNickname = await database.card.findUnique({
    where: {
      userId_nickname: { userId, nickname },
    },
  });
  return resultNickname;
}

export async function createCard(card: CardData, userId: number) {
  await database.card.create({
    data: { ...card, userId },
  });
}

export async function getUserCards(userId: number) {
  const resultCards = await database.card.findMany({
    where: { userId },
  });
  return resultCards;
}

export async function getCardById(cardId: number) {
  const card = await database.card.findFirst({
    where: { id: cardId },
  });
  return card;
}

export async function deleteCard(cardId: number) {
  const cardForDeletion = await database.card.delete({
    where: { id: cardId },
  });
  return cardForDeletion;
}
