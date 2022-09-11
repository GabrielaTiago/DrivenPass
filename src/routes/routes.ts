import { Router } from "express";
import { authRouter } from "./authRoutes";
import { credentialRouter } from "./credentialRoutes";

const router = Router();

router.use(authRouter);
router.use(credentialRouter);

export { router };