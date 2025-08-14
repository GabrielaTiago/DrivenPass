import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as notesRepository from '../repositories/notesRepository';
import { NoteData } from '../types/noteType';

export async function createNote(note: NoteData, userId: number) {
  const moreThanOneTitle = await notesRepository.findMoreThanOneTitle(userId, note.title);

  if (moreThanOneTitle) {
    throw throwErrorMessage('conflict', 'You already have a credential with this title');
  }

  await notesRepository.createNote(note, userId);
}

export async function getUserNotes(userId: number) {
  return await notesRepository.getUserNotes(userId);
}

export async function getNoteById(userId: number, noteId: number) {
  const specificNote = await notesRepository.getNoteById(noteId);

  if (!specificNote) {
    throw throwErrorMessage('not_found', "It seems that this note doesn't exist yet");
  }

  if (specificNote.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to see this note");
  }

  return specificNote;
}

export async function deleteNote(userId: number, noteId: number) {
  const noteForDeletion = await notesRepository.getNoteById(noteId);

  if (!noteForDeletion) {
    throw throwErrorMessage('not_found', "It seems that this note doesn't exists");
  }

  if (noteForDeletion.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to delete this note");
  }

  await notesRepository.deleteNote(noteId);
}
