import { Router } from 'express';

import { authRouter } from './authRouter';
import { cardsRouter } from './cardsRouter';
import { credentialRouter } from './credentialsRouter';
import { noteRouter } from './notesRouter';
import { wifiRouter } from './wifisRouter';

const router = Router();

router.use(authRouter);
router.use(credentialRouter);
router.use(noteRouter);
router.use(cardsRouter);
router.use(wifiRouter);

export { router };
