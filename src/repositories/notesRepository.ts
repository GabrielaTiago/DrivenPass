import { database } from '../config/postgres';
import { NoteData } from '../types/noteType';

export async function findNoteTitleByUser(userId: number, title: string) {
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

export async function getNoteById(id: number) {
  const specificNote = await database.note.findFirst({
    where: { id },
  });
  return specificNote;
}

export async function deleteNote(id: number) {
  await database.note.delete({
    where: { id },
  });
}

export async function updateNote(id: number, note: NoteData) {
  await database.note.update({
    where: { id },
    data: note,
  });
}
