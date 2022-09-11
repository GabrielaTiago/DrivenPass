
import bcrypt from "bcrypt";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

export function encryptsPassword(password: string) {
    const salt: number = Number(process.env.HASH_ROUNDS);
    const encryptedPassword: string = bcrypt.hashSync(password, salt);
    return encryptedPassword;
}

export function decryptsPassword(password:string, encryptedPassword: string ) {
    const decryptedPassword: boolean = bcrypt.compareSync(password, encryptedPassword);
    return decryptedPassword;
}