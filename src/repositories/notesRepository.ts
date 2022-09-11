import { database } from "../config/postegres";
import { noteData } from "../types/noteType";

export async function findMoreThanOneTitle(userId: number, title: string) {
    const resultTitle = await database.note.findUnique({
        where: {
            userId_title: { userId, title }
        }
    });
    return resultTitle;
}

export async function createNote(note: noteData) {
    const { userId, title, text } = note;

    await database.note.create({
        data: { userId, title, text }
    });
}

export async function getUserNotes(userId: number) {
}

export async function getNoteById(userId: number, noteId: number) {

}

export async function deleteNote(noteId: number) {
}