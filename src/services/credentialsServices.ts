import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as credentialRepository from '../repositories/credentialsRepository';
import { CredentialData } from '../types/credentialType';
import { encryptPassword, decryptsPassword } from '../utils/passwordEncryption';

async function createCredential(credential: CredentialData, userId: number) {
  const credentialWithSameTitle = await credentialRepository.findCredentialTitleByUser(userId, credential.title);
  if (credentialWithSameTitle) throw throwErrorMessage('conflict', 'Credential with this title already exists');

  const encryptedPassword = encryptPassword(credential.password);

  await credentialRepository.createCredential({ ...credential, password: encryptedPassword }, userId);
}

async function getUserCredentials(userId: number) {
  const allUserCredentials = await credentialRepository.getUserCredentials(userId);

  if (!allUserCredentials) {
    throw throwErrorMessage('not_found', 'No credentials were found');
  }

  const decryptedCredentials = allUserCredentials.map((credential) => {
    return {
      ...credential,
      password: decryptsPassword(credential.password),
    };
  });

  return decryptedCredentials;
}

async function getCredendtialById(userId: number, credentialId: number) {
  const specificCredential = await credentialRepository.getCredentialById(credentialId);

  if (!specificCredential) {
    throw throwErrorMessage('not_found', "It seems that this credential doesn't exist yet");
  }

  if (specificCredential.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to see this credential");
  }

  const decryptedPassword = decryptsPassword(specificCredential.password);
  const decryptedCredential = { ...specificCredential, password: decryptedPassword };

  return decryptedCredential;
}

async function deleteCredential(userId: number, credentialId: number) {
  const credentialForDelection = await credentialRepository.getCredentialById(credentialId);

  if (!credentialForDelection) {
    throw throwErrorMessage('not_found', "This credential doesn't exist");
  }

  if (credentialForDelection.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to delete this credential");
  }

  await credentialRepository.deleteCredential(credentialForDelection.id);
}

export { createCredential, getUserCredentials, getCredendtialById, deleteCredential };
