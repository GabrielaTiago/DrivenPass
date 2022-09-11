import { credentialData } from "../types/credentialType";
import { cryptographsGeneralPasswords, decryptsPassword } from "../utils/passwordEncryption";
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

import * as credentialRepository from "../repositories/credentialsRepository"; 

async function createCredential(credential: credentialData) {
    const { userId, title, url, username, password } = credential;
    const moreThanOneTitle = await credentialRepository.findMoreThanOneTitle(userId, title);

    if (moreThanOneTitle) {
        throw throwErrorMessage("conflict", "You already have a credential with this title");
    }

    const encryptedPassword = cryptographsGeneralPasswords(password);
    await credentialRepository.createCredential({ userId, title, url, username, password: encryptedPassword });
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

export { createCredential, getUserCredentials, getCredendtialById };