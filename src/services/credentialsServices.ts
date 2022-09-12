import { CredentialData } from "../types/credentialType";
import { cryptographsGeneralPasswords, decryptsPassword } from "../utils/passwordEncryption";
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

import * as credentialRepository from "../repositories/credentialsRepository"; 

async function createCredential(credential: CredentialData, userId: number) {
    const moreThanOneTitle = await credentialRepository.findMoreThanOneTitle(userId, credential.title);

    if (moreThanOneTitle) {
        throw throwErrorMessage("conflict", "You already have a credential with this title");
    }

    const encryptedPassword = cryptographsGeneralPasswords(credential.password);

    await credentialRepository.createCredential({ ...credential, password: encryptedPassword }, userId);
}

async function getUserCredentials(userId: number) {
    const allUserCredentials = await credentialRepository.getUserCredentials(userId);

    if (!allUserCredentials) {
        throw throwErrorMessage("not_found", "No credentials were found");
    }

    const decryptedCredentials = allUserCredentials.map((credential) => {
        return {
            ...credential,
            password: decryptsPassword(credential.password)
        }
    });

    return decryptedCredentials;
}

async function getCredendtialById(userId: number, credentialId: number) {
    const specificCredential = await credentialRepository.getCredendtialById(userId, credentialId);
    console.log(credentialId)
    console.log(specificCredential)

    if (!specificCredential) {
        throw throwErrorMessage("not_found", "It seems that this credential doesn't exist yet");
    }

    if (specificCredential.userId !== userId) {
        throw throwErrorMessage("forbidden", "You don't have the permition to see this credential");
    }

    const decryptedPassword = decryptsPassword(specificCredential.password);
    const decryptedCredential = { ...specificCredential, password: decryptedPassword }
    return decryptedCredential;
}

async function deleteCredential(userId: number, credentialId: number) {
    const credentialForDelection = await credentialRepository.getCredendtialById(userId, credentialId);

    if (!credentialForDelection) {
        throw throwErrorMessage("not_found", "This credential doesn't exist");
    }

    if (credentialForDelection.userId !== userId) {
        throw throwErrorMessage("forbidden", "You don't have the permition to delete this credential");
    }

    await credentialRepository.deleteCredential(credentialForDelection.id);
}

export { createCredential, getUserCredentials, getCredendtialById, deleteCredential };