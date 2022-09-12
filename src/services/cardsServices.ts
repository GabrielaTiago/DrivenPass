import { CardData } from "../types/cardType";
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";
import { cryptographsGeneralPasswords, decryptsPassword } from "../utils/passwordEncryption";

import * as cardsRepository from "../repositories/cardsRepository"; 

export async function createCard(card: CardData, userId: number) {
    const moreThanOneNickname = await cardsRepository.findMoreThanOneNickname(userId, card.nickname);

    if (moreThanOneNickname) {
        throw throwErrorMessage("conflict", "You already have a card with this nickname");
    }

    const encryptedPassword = cryptographsGeneralPasswords(card.password);
    const encryptedCvv = cryptographsGeneralPasswords(card.cvv);

    await cardsRepository.createCard({ ...card, password: encryptedPassword, cvv: encryptedCvv }, userId);
}

export async function getUserCards(userId: number) {
    const allUserCards = await cardsRepository.getUserCards(userId);

    if (!allUserCards) {
        throw throwErrorMessage("not_found", "No cards were found");
    }

    const decryptedCards = allUserCards.map((card) => {
        return {
            ...card,
            password: decryptsPassword(card.password)
        }
    });

    return decryptedCards;
}

export async function getCardById(userId: number, cardId: number) {
    const specificCard = await cardsRepository.getCardById(userId, cardId);

    if (!specificCard) {
        throw throwErrorMessage("not_found", "It seems that this card doesn't exist yet");
    }

    if (specificCard.userId !== userId) {
        throw throwErrorMessage("forbidden", "You don't have the permition to see this card");
    }

    const decryptedPassword = decryptsPassword(specificCard.password);
    const decryptedCvv = decryptsPassword(specificCard.cvv);
    
    const decryptedCard = { ...specificCard, password: decryptedPassword, cvv: decryptedCvv };

    return decryptedCard;
}

export async function deleteCard(userId: number, cardId: number) {
}