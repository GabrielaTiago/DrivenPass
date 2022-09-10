import * as authRepository from "../repositories/authRepository";

import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";
import { encryptsPassword } from "../utils/passwordEncryption";

async function createUser(email: string, password: string) {
    const emailExists = await authRepository.findUserEmail(email);

    if (emailExists) {
        //throw { type: "Conflict", error_message: "This email is already in use. Please choose a new email for registration"}
        throw throwErrorMessage("conflict", "This email is already in use. Please choose a new email for registration");
    }
    const encryptedPassword = encryptsPassword(password);

    await authRepository.createUser(email, encryptedPassword);
}

async function login(email: string, password: string) {

}

export { createUser, login };