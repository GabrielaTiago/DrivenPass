import { database } from '../config/postgres';
import { CardData } from '../types/cardType';

export async function findCardByNicknameAndUser(userId: number, nickname: string) {
  const card = await database.card.findUnique({
    where: {
      userId_nickname: { userId, nickname },
    },
  });
  return card;
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

export async function getCardById(id: number) {
  const card = await database.card.findFirst({
    where: { id },
  });
  return card;
}

export async function deleteCard(id: number) {
  await database.card.delete({
    where: { id },
  });
}

export async function updateCard(id: number, data: CardData) {
  await database.card.update({
    where: { id },
    data,
  });
}
