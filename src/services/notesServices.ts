import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as notesRepository from '../repositories/notesRepository';
import { NoteData } from '../types/noteType';

export async function createNote(data: NoteData, userId: number) {
  const note = await notesRepository.findNoteTitleByUser(userId, data.title);
  if (note) throw throwErrorMessage('conflict', 'Note with this title already exists');
  await notesRepository.createNote(data, userId);
}

export async function getUserNotes(userId: number) {
  const notes = await notesRepository.getUserNotes(userId);
  return notes;
}

export async function getNoteById(userId: number, noteId: number) {
  const note = await notesRepository.getNoteById(noteId);
  if (!note) throw throwErrorMessage('not_found', "Note doesn't exist");
  if (note.userId !== userId) throw throwErrorMessage('forbidden', "You don't have the permission to see this note");
  return note;
}

export async function deleteNote(userId: number, noteId: number) {
  const note = await notesRepository.getNoteById(noteId);
  if (!note) throw throwErrorMessage('not_found', "Note doesn't exist");
  if (note.userId !== userId) throw throwErrorMessage('forbidden', "You don't have the permission to delete this note");
  await notesRepository.deleteNote(noteId);
}

export async function updateNote(userId: number, noteId: number, data: NoteData) {
  const note = await notesRepository.getNoteById(noteId);
  if (!note) throw throwErrorMessage('not_found', "Note doesn't exist");
  if (note.userId !== userId) throw throwErrorMessage('forbidden', "You don't have the permission to update this note");
  await notesRepository.updateNote(noteId, data);
}

