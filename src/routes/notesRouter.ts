import { Router } from 'express';

import { createNote, deleteNote, getNoteById, getUserNotes } from '../controllers/notesController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const noteRouter = Router();

noteRouter.post('/notes', validateSchema(schemas.note), validatetoken, createNote);
noteRouter.get('/notes/all', validatetoken, getUserNotes);
noteRouter.get('/notes/:id', validatetoken, getNoteById);
noteRouter.delete('/notes/:id/delete', validatetoken, deleteNote);

export { noteRouter };
