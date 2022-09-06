import { Router } from "express";
import { signIn, signUp } from "../controllers/authRoutes";

const authRouter = Router();

authRouter.get("/", signIn);
authRouter.post("/sign-up", signUp);

export { authRouter };