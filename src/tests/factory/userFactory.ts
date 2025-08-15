import { faker } from '@faker-js/faker';

function generatePassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const special = '$*&@#';
  const numbers = '0123456789';

  let password = '';
  password += faker.helpers.arrayElement(lowercase.split(''));
  password += faker.helpers.arrayElement(uppercase.split(''));
  password += faker.helpers.arrayElement(special.split(''));
  password += faker.helpers.arrayElement(numbers.split(''));

  // Fill remaining 6 characters with random chars
  const allChars = (lowercase + uppercase + special + numbers).split('');
  for (let i = 0; i < 6; i++) {
    password += faker.helpers.arrayElement(allChars);
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

export const userFactory = {
  createSignUpData() {
    return {
      email: faker.internet.email(),
      password: generatePassword(),
    };
  },

  createDbUser(email?: string, password?: string) {
    return {
      id: faker.number.int(),
      email: email || faker.internet.email(),
      password: password || faker.internet.password(),
    };
  },
};
