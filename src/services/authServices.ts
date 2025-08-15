import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as authRepository from '../repositories/authRepository';
import { comparePassword, encryptsPassword } from '../utils/passwordEncryption';
import { generateToken } from '../utils/token';

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

export { createUser, login };
