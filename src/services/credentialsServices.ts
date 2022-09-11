import { credentialData } from "../types/credentialType";
import { encryptsPassword } from "../utils/passwordEncryption";

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

export { createCredential, getUserCredentials };