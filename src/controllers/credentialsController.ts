import { Request, Response } from 'express';

import * as credentialsServices from '../services/credentialsServices';
import { CredentialData } from '../types/credentialType';

async function createCredential(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const credential: CredentialData = req.body;
  await credentialsServices.createCredential(credential, userId);
  res.status(201).send({ message: 'Credential created successfully' });
}

async function getUserCredentials(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const userCredentials = await credentialsServices.getUserCredentials(userId);
  res.status(200).send(userCredentials);
}

async function getCredentialById(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const credentialId: number = Number(req.params.id);
  const credential = await credentialsServices.getCredentialById(userId, credentialId);
  res.status(200).send(credential);
}

async function deleteCredentials(req: Request, res: Response) {
  const userId: number = Number(res.locals.userId);
  const credentialId: number = Number(req.params.id);
  await credentialsServices.deleteCredential(userId, credentialId);
  res.status(200).send({ message: 'Credential deleted successfully' });
}

async function updateCredential(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const credentialId = Number(req.params.id);
  const credentialData: CredentialData = req.body;
  await credentialsServices.updateCredential(userId, credentialId, credentialData);
  res.status(200).send({ message: 'Credential updated successfully' });
}

export { createCredential, deleteCredentials, getUserCredentials, getCredentialById, updateCredential };
