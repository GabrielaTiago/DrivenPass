import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as credentialRepository from '../repositories/credentialsRepository';
import { CredentialData } from '../types/credentialType';
import { encryptPassword, decryptPassword } from '../utils/passwordEncryption';

async function createCredential(credential: CredentialData, userId: number) {
  const credentialWithSameTitle = await credentialRepository.findCredentialTitleByUser(userId, credential.title);
  if (credentialWithSameTitle) throw throwErrorMessage('conflict', 'Credential with this title already exists');
  const encryptedPassword = encryptPassword(credential.password);
  await credentialRepository.createCredential({ ...credential, password: encryptedPassword }, userId);
}

async function getUserCredentials(userId: number) {
  const userCredentials = await credentialRepository.getUserCredentials(userId);
  if (!userCredentials) throw throwErrorMessage('not_found', 'No credentials were found');
  const decryptedCredentials = userCredentials.map((credential) => {
    return { ...credential, password: decryptPassword(credential.password) };
  });
  return decryptedCredentials;
}

async function getCredentialById(userId: number, credentialId: number) {
  const credential = await credentialRepository.getCredentialById(credentialId);
  if (!credential) throw throwErrorMessage('not_found', "Credential doesn't exist");
  if (credential.userId !== userId) throw throwErrorMessage('forbidden', 'You do not have permission to see this credential');
  const decryptedCredential = { ...credential, password: decryptPassword(credential.password) };
  return decryptedCredential;
}

async function deleteCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.getCredentialById(credentialId);
  if (!credential) throw throwErrorMessage('not_found', "Credential doesn't exist");
  if (credential.userId !== userId) throw throwErrorMessage('forbidden', 'You do not have permission to delete this credential');
  await credentialRepository.deleteCredential(credential.id);
}

export { createCredential, getUserCredentials, getCredentialById, deleteCredential };
