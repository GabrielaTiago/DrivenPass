import { database } from '../config/postegres';
import { NoteData } from '../types/noteType';

export async function findMoreThanOneTitle(userId: number, title: string) {
  const resultTitle = await database.note.findUnique({
    where: {
      userId_title: { userId, title },
    },
  });
  return resultTitle;
}

export async function createNote(note: NoteData, userId: number) {
  await database.note.create({
    data: { ...note, userId },
  });
}

export async function getUserNotes(userId: number) {
  const resultNotes = await database.note.findMany({
    where: { userId },
  });
  return resultNotes;
}

export async function getNoteById(noteId: number) {
  const specificNote = await database.note.findFirst({
    where: { id: noteId },
  });
  return specificNote;
}

export async function deleteNote(noteId: number) {
  const noteForDeletion = await database.note.delete({
    where: { id: noteId },
  });
  return noteForDeletion;
}
