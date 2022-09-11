import { Request, Response } from "express";

import * as authInterface from "../interfaces/authInterfaces";
import * as authService from "../services/authServices";

async function signIn(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;
    
    const token = await authService.login(email, password);

    res.status(200).send({token: token, message: "Authentication Success"});
}

async function signUp(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;

    await authService.createUser(email, password);

    res.status(201).send("Successfully created user");
}

export { signIn, signUp };