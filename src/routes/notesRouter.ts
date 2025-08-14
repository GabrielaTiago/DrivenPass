import { Router } from 'express';

import { createNote, deleteNote, getNoteById, getUserNotes } from '../controllers/notesController';
import { validateSchemas } from '../middlewares/validateSchemasMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';

const noteRouter = Router();

noteRouter.post('/notes', validateSchemas('note'), validatetoken, createNote);
noteRouter.get('/notes/all', validatetoken, getUserNotes);
noteRouter.get('/notes/:id', validatetoken, getNoteById);
noteRouter.delete('/notes/:id/delete', validatetoken, deleteNote);

export { noteRouter };
