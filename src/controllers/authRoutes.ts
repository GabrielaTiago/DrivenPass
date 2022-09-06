import { Request, Response } from "express";
import * as authInterface from "../interfaces/authInterfaces";

async function signIn(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;
    
    res.sendStatus(200);
}

async function signUp(req: Request, res: Response) {
    const { email, password } : authInterface.IAuthBodyData = req.body;

    res.sendStatus(201);
}

export { signIn, signUp };