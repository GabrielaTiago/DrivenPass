import { database } from '../config/postgres';
import { CredentialData } from '../types/credentialType';

async function findCredentialTitleByUser(userId: number, title: string) {
  const credential = await database.credential.findUnique({
    where: { userId_title: { userId, title } },
  });
  return credential;
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

async function getCredentialById(credentialId: number) {
  const credential = await database.credential.findFirst({
    where: { id: credentialId },
  });
  return credential;
}

async function deleteCredential(credentialId: number) {
  await database.credential.delete({
    where: { id: credentialId },
  });
}

async function updateCredential(credentialId: number, credential: CredentialData) {
  await database.credential.update({
    where: { id: credentialId },
    data: credential,
  });
}

export { createCredential, deleteCredential, findCredentialTitleByUser, getUserCredentials, getCredentialById, updateCredential };
