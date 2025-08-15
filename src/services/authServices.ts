import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as authRepository from '../repositories/authRepository';
import { comparePassword, encryptsPassword } from '../utils/passwordEncryption';

dotenv.config();

async function createUser(email: string, password: string) {
  const user = await authRepository.findUserEmail(email);
  if (user) throw throwErrorMessage('conflict', 'This email is already in use. Please choose a new email for registration');
  const encryptedPassword = encryptsPassword(password);
  await authRepository.createUser(email, encryptedPassword);
}

async function login(email: string, password: string) {
  const user = await authRepository.findUserEmail(email);
  const savedEmail = user?.email;
  const savedPassword = user?.password as string;
  if (!savedEmail || !comparePassword(password, savedPassword)) throw throwErrorMessage('unauthorized', 'Incorrect email and/or password');
  return generateToken(user.id);
}

function generateToken(userId: number) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '4h' });
  return token;
}

export { createUser, login };
