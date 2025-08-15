import { Router } from 'express';

import { signIn, signUp } from '../controllers/authController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { schemas } from '../schemas/schemas';

const authRouter = Router();

authRouter.post('/sign-in', validateSchema(schemas.auth), signIn);
authRouter.post('/sign-up', validateSchema(schemas.auth), signUp);

export { authRouter };
