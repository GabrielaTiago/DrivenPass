import { Request, Response } from "express";

export async function createNote(req: Request, res: Response) {
    const { userId } = res.locals;
    const { title, text } = req.body;

    res.status(201).send("Successfully created the credential!");
}

export async function  getUserNotes(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    res.status(200).send();
}

export async function getNoteById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const noteId: number = Number(req.params.id);

    res.status(200).send();
}

export async function deleteNote(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const NoteId: number = Number(req.params.id);

    res.status(200).send("Successfully deleted the credential!");
}