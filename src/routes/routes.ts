import { Router } from "express";
import { authRouter } from "./authRoutes";
import { cardsRouter } from "./cardsRouter";
import { credentialRouter } from "./credentialRoutes";
import { noteRouter } from "./noteRouter";

const router = Router();

router.use(authRouter);
router.use(credentialRouter);
router.use(noteRouter);
router.use(cardsRouter);

export { router };