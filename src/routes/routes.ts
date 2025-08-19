import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { authRouter } from './authRouter';
import { cardsRouter } from './cardsRouter';
import { credentialRouter } from './credentialsRouter';
import { noteRouter } from './notesRouter';
import { wifiRouter } from './wifisRouter';
import swaggerSpec from '../config/swagger';

const router = Router();

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use(authRouter);
router.use(credentialRouter);
router.use(noteRouter);
router.use(cardsRouter);
router.use(wifiRouter);

export { router };
