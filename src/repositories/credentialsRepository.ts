import { database } from "../config/postegres";
import { credentialData } from "../types/credentialType";

async function findMoreThanOneTitle(userId: number, title: string) {
    const resultTitle = await database.credential.findUnique({
        where: {
            userId_title: { userId, title }
        }
    });
    return resultTitle;
}

async function createCredential(credential: credentialData) {
    const { userId, title, url, username, password } = credential;

    await database.credential.create({
        data: { userId, title, url, username, password }
    });
}

export { createCredential, findMoreThanOneTitle };