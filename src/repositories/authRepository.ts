import { database } from "../config/postegres";

async function findUserEmail(userEmail: string) {
   const email = await database.user.findUnique({
        where: {
            email: userEmail
        }
    });
    return email;
}

async function createUser(userEmail: string, userPassword: string) {
    await database.user.create({
        data: {
            email: userEmail,
            password: userPassword
        }
    });
}

export { createUser, findUserEmail };