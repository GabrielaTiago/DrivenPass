import { Router } from "express";

const authRouter = Router();

authRouter.get("/");
authRouter.post("/sign-up");

export { authRouter };