import { database } from '../config/postgres';
import { CredentialData } from '../types/credentialType';

async function findMoreThanOneTitle(userId: number, title: string) {
  const resultTitle = await database.credential.findUnique({
    where: {
      userId_title: { userId, title },
    },
  });
  return resultTitle;
}

async function createCredential(credential: CredentialData, userId: number) {
  await database.credential.create({
    data: { ...credential, userId },
  });
}

async function getUserCredentials(userId: number) {
  const resultCredentials = await database.credential.findMany({
    where: { userId },
  });
  return resultCredentials;
}

async function getCredendtialById(credentialId: number) {
  const credential = await database.credential.findFirst({
    where: { id: credentialId },
  });
  return credential;
}

async function deleteCredential(credentialId: number) {
  const credentialForDeletion = await database.credential.delete({
    where: { id: credentialId },
  });
  return credentialForDeletion;
}

export { createCredential, deleteCredential, findMoreThanOneTitle, getUserCredentials, getCredendtialById };
