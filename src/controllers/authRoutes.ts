import { Request, Response } from "express";

import * as authInterface from "../interfaces/authInterfaces";
import * as authService from "../services/authServices";

async function signIn(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;
    
    await authService.login(email, password);
    
    res.sendStatus(200);
}

async function signUp(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;

    await authService.createUser(email, password);

    res.sendStatus(201);
}

export { signIn, signUp };