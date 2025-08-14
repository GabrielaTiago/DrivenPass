import { Router } from 'express';

import { createCredential, deleteCredentials, getUserCredentials, getCredentialById } from '../controllers/credentialsController';
import { validateSchemas } from '../middlewares/validateSchemasMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';

const credentialRouter = Router();

credentialRouter.post('/credentials', validateSchemas('credential'), validatetoken, createCredential);
credentialRouter.get('/credentials/all', validatetoken, getUserCredentials);
credentialRouter.get('/credentials/:id', validatetoken, getCredentialById);
credentialRouter.delete('/credentials/:id/delete', validatetoken, deleteCredentials);

export { credentialRouter };
