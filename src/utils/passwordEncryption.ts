
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export function encryptsPassword(password: string) {
    const salt: number = Number(process.env.HASH_ROUNDS);
    const encryptedPassword: string = bcrypt.hashSync(password, salt);
    return encryptedPassword;
}

export function comparePassword(password:string, encryptedPassword: string ) {
    const compareHash: boolean = bcrypt.compareSync(password, encryptedPassword);
    return compareHash;
}