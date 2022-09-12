import { Request, Response } from "express";

export async function createCard(req: Request, res: Response) {
    const { userId } = res.locals;
    const cardData = req.body;

    res.status(201).send("Successfully created the card!");
}

export async function  getUserCards(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    res.status(200).send();
}

export async function getCardById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const cardId: number = Number(req.params.id);

    res.status(200).send();
}

export async function deleteCredentials(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const cardId: number = Number(req.params.id);

    res.status(200).send("Successfully delete the card!");
}
