import { Request, Response } from 'express';

import * as notesServices from '../services/notesServices';
import { NoteData } from '../types/noteType';


export async function createNote(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const note: NoteData = req.body;

  await notesServices.createNote(note, userId);

  res.status(201).send('Successfully created the note!');
}

export async function getUserNotes(req: Request, res: Response) {
  const userId = Number(res.locals.userId);

  const allUserNotes = await notesServices.getUserNotes(userId);

  res.status(200).send(allUserNotes);
}

export async function getNoteById(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const noteId: number = Number(req.params.id);

  const specificNote = await notesServices.getNoteById(userId, noteId);

  res.status(200).send(specificNote);
}

export async function deleteNote(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const noteId: number = Number(req.params.id);

  await notesServices.deleteNote(userId, noteId);

  res.status(200).send('Successfully deleted the note!');
}
