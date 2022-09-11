import { credentialData } from "../types/credentialType";
import { comparePassword, encryptsPassword } from "../utils/passwordEncryption";

import * as credentialRepository from "../repositories/credentialsRepository"; 
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

async function createCredential(credential: credentialData) {
    const { userId, title, url, username, password } = credential;
    const moreThanOneTitle = await credentialRepository.findMoreThanOneTitle(userId, title);

    if (moreThanOneTitle) {
        throw throwErrorMessage("conflict", "You already have a credential with this title");
    }

    const encryptedPassword = encryptsPassword(password);
    await credentialRepository.createCredential({ userId, title, url, username, password: encryptedPassword });
}

async function getUserCredentials(userId: number) {
    return await credentialRepository.getUserCredentials(userId);
}

async function getCredendtialById(userId: number, credentialId: number) {
    const specificCredential = await credentialRepository.getCredendtialById(userId, credentialId);

    if (!specificCredential) {
        throw throwErrorMessage("not_found", "It seems that this credential doesn't exist yet");
    }

    if (specificCredential.userId !== userId) {
        throw throwErrorMessage("forbidden", "You don't have the permition to see this credential");
    }

    return specificCredential;
}

export { createCredential, getUserCredentials, getCredendtialById };