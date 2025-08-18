import { Request, Response } from 'express';

import * as notesServices from '../services/notesServices';
import { NoteData } from '../types/noteType';

export async function createNote(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const note: NoteData = req.body;
  await notesServices.createNote(note, userId);
  res.status(201).send({ message: 'Note created successfully' });
}

export async function getUserNotes(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const allUserNotes = await notesServices.getUserNotes(userId);
  res.status(200).send(allUserNotes);
}

export async function getNoteById(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const noteId = Number(req.params.id);
  const specificNote = await notesServices.getNoteById(userId, noteId);
  res.status(200).send(specificNote);
}

export async function deleteNote(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const noteId = Number(req.params.id);
  await notesServices.deleteNote(userId, noteId);
  res.status(200).send({ message: 'Note deleted successfully' });
}

export async function updateNote(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const noteId = Number(req.params.id);
  const note: NoteData = req.body;
  await notesServices.updateNote(userId, noteId, note);
  res.status(200).send({ message: 'Note updated successfully' });
}
