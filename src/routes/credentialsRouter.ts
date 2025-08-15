import { Router } from 'express';

import { createCredential, deleteCredentials, getUserCredentials, getCredentialById } from '../controllers/credentialsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const credentialRouter = Router();

credentialRouter.post('/credentials', validateSchema(schemas.credential), validatetoken, createCredential);
credentialRouter.get('/credentials/all', validatetoken, getUserCredentials);
credentialRouter.get('/credentials/:id', validatetoken, getCredentialById);
credentialRouter.delete('/credentials/:id/delete', validatetoken, deleteCredentials);

export { credentialRouter };
