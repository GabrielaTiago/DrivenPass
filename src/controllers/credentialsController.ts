import { Request, Response } from "express";

import * as credentialsServices from "../services/credentialsServices";

async function createCredential(req: Request, res: Response) {
    const { userId } = res.locals;
    const { title, url, username, password } = req.body;

    await credentialsServices.createCredential({ userId, title, url, username, password });
    
    res.status(201).send("Successfully created the credential");
}

async function  getAllCredentials(req: Request, res: Response) {
    res.status(200).send();
}

async function getCredentialById(req: Request, res: Response) {
    const credentialId: number = Number(req.params.id);
    res.status(200).send();
}

async function deleteCredentials(req: Request, res: Response) {
    const credentialId: number = Number(req.params.id);
    res.status(200).send();
}

export { createCredential,deleteCredentials, getAllCredentials, getCredentialById};