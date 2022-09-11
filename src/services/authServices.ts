import * as authRepository from "../repositories/authRepository";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";
import { comparePassword, encryptsPassword } from "../utils/passwordEncryption";

dotenv.config();

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
    const userData = await authRepository.findUserEmail(email);
    const validEmail = userData?.email;
    const validPassword = userData?.password as string;
    
    if(!validEmail || !comparePassword(password, validPassword)){
        throw throwErrorMessage("unauthorized", "Incorrect email and/or password");
    }

    const token = jwt.sign(
        { id: userData.id },
        process.env.JWT_SECRET as string, 
        { expiresIn: "4h" }
    );
    
    return token;
}

export { createUser, login };