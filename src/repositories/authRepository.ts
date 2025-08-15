import { database } from '../config/postgres';

async function findUserEmail(email: string) {
  const user = await database.user.findUnique({
    where: { email },
  });
  return user;
}

async function createUser(email: string, password: string) {
  await database.user.create({
    data: { email, password },
  });
}

export { createUser, findUserEmail };
