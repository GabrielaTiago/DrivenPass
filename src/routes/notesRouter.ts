import { Router } from 'express';

import { createNote, deleteNote, getNoteById, getUserNotes, updateNote } from '../controllers/notesController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const noteRouter = Router();

noteRouter.post('/notes', validateSchema(schemas.note), validateToken, createNote);
noteRouter.get('/notes/all', validateToken, getUserNotes);
noteRouter.get('/notes/:id', validateToken, getNoteById);
noteRouter.put('/notes/:id', validateSchema(schemas.note), validateToken, updateNote);
noteRouter.delete('/notes/:id', validateToken, deleteNote);

export { noteRouter };
