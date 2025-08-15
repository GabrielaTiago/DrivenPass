import { Router } from 'express';

import { createNote, deleteNote, getNoteById, getUserNotes } from '../controllers/notesController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const noteRouter = Router();

noteRouter.post('/notes', validateSchema(schemas.note), validateToken, createNote);
noteRouter.get('/notes/all', validateToken, getUserNotes);
noteRouter.get('/notes/:id', validateToken, getNoteById);
noteRouter.delete('/notes/:id/delete', validateToken, deleteNote);

export { noteRouter };
