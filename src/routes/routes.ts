import { Router } from "express";
import { authRouter } from "./authRoutes";
import { credentialRouter } from "./credentialRoutes";
import { noteRouter } from "./noteRouter";

const router = Router();

router.use(authRouter);
router.use(credentialRouter);
router.use(noteRouter);

export { router };