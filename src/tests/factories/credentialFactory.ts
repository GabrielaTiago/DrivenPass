import { faker } from '@faker-js/faker';
import { Credential } from '@prisma/client';

import { database } from '../../config/postgres';
import { CredentialData } from '../../types/credentialType';

export const credentialFactory = {
  createCredentialData(): CredentialData {
    return {
      title: faker.lorem.word(),
      url: faker.internet.url(),
      username: faker.internet.username(),
      password: faker.internet.password(),
    };
  },

  createMockCredential(override: Partial<Credential> = {}, userId?: number) {
    const credentialData = this.createCredentialData();
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      userId: userId || faker.number.int(),
      createdAt: faker.date.recent(),
      ...credentialData,
      ...override,
    };
  },

  async createCredential(override: Partial<Credential> = {}, userId?: number) {
    return await database.credential.create({
      data: {
        title: faker.lorem.word(),
        url: faker.internet.url(),
        username: faker.internet.username(),
        password: faker.internet.password(),
        userId: userId || faker.number.int({ min: 1, max: 10000 }),
        ...override,
      },
    });
  },
};
