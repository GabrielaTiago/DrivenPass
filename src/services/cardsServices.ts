import { CardData } from "../types/cardType";
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

import * as cardsRepository from "../repositories/cardsRepository"; 
import { cryptographsGeneralPasswords } from "../utils/passwordEncryption";

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
}

export async function getCardById(userId: number, cardId: number) {
}

export async function deleteCard(userId: number, cardId: number) {
}