import { faker } from '@faker-js/faker';
import { Credential } from '@prisma/client';

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

  createDbCredential(override: Partial<Credential> = {}, userId?: number) {
    const credentialData = this.createCredentialData();
    return {
      id: faker.number.int(),
      userId: userId || faker.number.int(),
      createdAt: faker.date.recent(),
      ...credentialData,
      ...override,
    };
  },
};
