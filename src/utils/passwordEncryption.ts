import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

const { CRYPTR_SECRET_KEY } = process.env;
const cryptr = new Cryptr(CRYPTR_SECRET_KEY as string);

export function encryptsPassword(password: string) {
  const salt: number = Number(process.env.HASH_ROUNDS);
  const encryptedPassword: string = bcrypt.hashSync(password, salt);
  return encryptedPassword;
}

export function comparePassword(password: string, encryptedPassword: string) {
  const compareHash: boolean = bcrypt.compareSync(password, encryptedPassword);
  return compareHash;
}

export function encryptPassword(password: string) {
  const crypts = cryptr.encrypt(password);
  return crypts;
}

export function decryptPassword(password: string) {
  const decrypts = cryptr.decrypt(password);
  return decrypts;
}
