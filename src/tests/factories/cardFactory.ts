import { faker } from '@faker-js/faker';
import { Card } from '@prisma/client';

import { database } from '../../config/postgres';
import { CardData } from '../../types/cardType';

export const cardFactory = {
  createCardData(override: Partial<CardData> = {}): CardData {
    return {
      nickname: faker.lorem.word().slice(0, 20),
      printedName: faker.person.firstName().toUpperCase().replace(/[^A-Z\s]/g, ' '),
      number: faker.finance.creditCardNumber('visa').replace(/-/g, '').slice(0, 16).padEnd(16, '0'),
      cvv: faker.finance.creditCardCVV().slice(0, 3),
      expirationDate: `${faker.date.future().getMonth() + 1}`.padStart(2, '0') + '/' + faker.date.future().getFullYear().toString().slice(-2),
      password: faker.number.int({ min: 1000, max: 9999 }).toString(),
      type: faker.helpers.arrayElement(['credit', 'debit', 'both']),
      virtual: faker.datatype.boolean(),
      ...override,
    };
  },

  createMockCard(override: Partial<Card> = {}, userId?: number) {
    const cardData = this.createCardData();
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      userId: userId || faker.number.int(),
      createdAt: faker.date.recent(),
      ...cardData,
      ...override,
    };
  },

  async createCard(override: Partial<Card> = {}, userId?: number) {
    return await database.card.create({
      data: {
        userId: userId || faker.number.int({ min: 1, max: 10000 }),
        ...this.createCardData(),
        ...override,
      },
    });
  },
};
