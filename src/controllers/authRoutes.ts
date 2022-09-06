import { Request, Response } from "express";

async function signIn(req: Request, res: Response) {
    const { email, password }: { email: string, password: string } = req.body;
    
    res.sendStatus(200);
}

async function signUp(req: Request, res: Response) {
    const { email, password }: { email: string, password: string } = req.body;

    res.sendStatus(201);
}

export { signIn, signUp };