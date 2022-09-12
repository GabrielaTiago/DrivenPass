import { Request, Response } from "express";
import { CardData } from "../types/cardType";

import * as cardsServices from "../services/cardsServices";

export async function createCard(req: Request, res: Response) {
    const userId = Number(res.locals.userId);
    const card: CardData = req.body;

    await cardsServices.createCard(card, userId);

    res.status(201).send("Successfully created the card!");
}

export async function  getUserCards(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    const allUserCards = await cardsServices.getUserCards(userId);

    res.status(200).send(allUserCards);
}

export async function getCardById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const cardId: number = Number(req.params.id);

    const specificCard = await cardsServices.getCardById(userId, cardId);

    res.status(200).send(specificCard);
}

export async function deleteCard(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const cardId: number = Number(req.params.id);

    await cardsServices.deleteCard(userId, cardId);
    
    res.status(200).send("Successfully delete the card!");
}
