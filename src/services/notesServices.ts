import { noteData } from "../types/noteType";
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

import * as notesRepository from "../repositories/notesRepository"; 

export async function createNote(note: noteData) {
    const { userId, title, text } = note;
    const moreThanOneTitle = await notesRepository.findMoreThanOneTitle(userId, title);

    if (moreThanOneTitle) {
        throw throwErrorMessage("conflict", "You already have a credential with this title");
    }

    await notesRepository.createNote({ userId, title, text });
}

export async function getUserNotes(userId: number) {
    return await notesRepository.getUserNotes(userId);
}

export async function getNoteById(userId: number, noteId: number) {
    const specificNote = await notesRepository.getNoteById(userId, noteId);

    if (!specificNote) {
        throw throwErrorMessage("not_found", "It seems that this note doesn't exist yet");
    }

    if (specificNote.userId !== userId) {
        throw throwErrorMessage("forbidden", "You don't have the permition to see this note");
    }

    return specificNote;
}

export async function deleteNote(userId: number, noteId: number) {
}