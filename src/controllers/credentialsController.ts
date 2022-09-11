import { Request, Response } from "express";

import * as credentialsServices from "../services/credentialsServices";

async function createCredential(req: Request, res: Response) {
    const { userId } = res.locals;
    const { title, url, username, password } = req.body;

    await credentialsServices.createCredential({ userId, title, url, username, password });

    res.status(201).send("Successfully created the credential");
}

async function  getUserCredentials(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    const userCredentials = await credentialsServices.getUserCredentials(userId);
    
    res.status(200).send(userCredentials);
}

async function getCredentialById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const credentialId: number = Number(req.params.id);

    const specificCredential = await credentialsServices.getCredendtialById(userId, credentialId);

    res.status(200).send(specificCredential);
}

async function deleteCredentials(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const credentialId: number = Number(req.params.id);

    await credentialsServices.deleteCredential(userId, credentialId);
    res.sendStatus(200);
}

export { createCredential,deleteCredentials, getUserCredentials, getCredentialById};