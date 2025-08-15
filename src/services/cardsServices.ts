import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as cardsRepository from '../repositories/cardsRepository';
import { CardData } from '../types/cardType';
import { encryptPassword, decryptPassword } from '../utils/passwordEncryption';

export async function createCard(card: CardData, userId: number) {
  const moreThanOneNickname = await cardsRepository.findMoreThanOneNickname(userId, card.nickname);

  if (moreThanOneNickname) {
    throw throwErrorMessage('conflict', 'You already have a card with this nickname');
  }

  const encryptedPassword = encryptPassword(card.password);
  const encryptedCvv = encryptPassword(card.cvv);

  await cardsRepository.createCard({ ...card, password: encryptedPassword, cvv: encryptedCvv }, userId);
}

export async function getUserCards(userId: number) {
  const allUserCards = await cardsRepository.getUserCards(userId);

  if (!allUserCards) {
    throw throwErrorMessage('not_found', 'No cards were found');
  }

  const decryptedCards = allUserCards.map((card) => {
    return {
      ...card,
      password: decryptPassword(card.password),
      cvv: decryptPassword(card.cvv),
    };
  });

  return decryptedCards;
}

export async function getCardById(userId: number, cardId: number) {
  const specificCard = await cardsRepository.getCardById(cardId);

  if (!specificCard) {
    throw throwErrorMessage('not_found', "It seems that this card doesn't exist yet");
  }

  if (specificCard.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to see this card");
  }

  const decryptedPassword = decryptPassword(specificCard.password);
  const decryptedCvv = decryptPassword(specificCard.cvv);

  const decryptedCard = { ...specificCard, password: decryptedPassword, cvv: decryptedCvv };

  return decryptedCard;
}

export async function deleteCard(userId: number, cardId: number) {
  const cardForDelection = await cardsRepository.getCardById(cardId);

  if (!cardForDelection) {
    throw throwErrorMessage('not_found', "This card doesn't exist");
  }

  if (cardForDelection.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to delete this card");
  }

  await cardsRepository.deleteCard(cardForDelection.id);
}
