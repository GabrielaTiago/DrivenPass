import { Router } from "express";
import { signIn, signUp } from "../controllers/authRoutes";
import { validateSchemas } from "../middlewares/validateSchemasMiddleware";

const authRouter = Router();

authRouter.get("/", signIn);
authRouter.post("/sign-up", validateSchemas('authSchemas'), signUp);

export { authRouter };