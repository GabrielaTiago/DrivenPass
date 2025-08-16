import { Router } from 'express';

import { createCredential, deleteCredentials, getUserCredentials, getCredentialById, updateCredential } from '../controllers/credentialsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const credentialRouter = Router();

credentialRouter.post('/credentials', validateSchema(schemas.credential), validateToken, createCredential);
credentialRouter.get('/credentials/all', validateToken, getUserCredentials);
credentialRouter.get('/credentials/:id', validateToken, getCredentialById);
credentialRouter.delete('/credentials/:id', validateToken, deleteCredentials);
credentialRouter.put('/credentials/:id', validateToken, updateCredential);

export { credentialRouter };
