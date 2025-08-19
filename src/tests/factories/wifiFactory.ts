import { faker } from '@faker-js/faker';
import { Wifi } from '@prisma/client';

import { database } from '../../config/postgres';
import { WifiData } from '../../types/wifiTypes';

export const wifiFactory = {
  createWifiData(override: Partial<WifiData> = {}): WifiData {
    return {
      title: faker.lorem.word(),
      password: faker.internet.password(),
      wifiName: faker.internet.domainWord(),
      ...override,
    };
  },

  createMockWifi(override: Partial<Wifi> = {}, userId?: number) {
    const wifiData = this.createWifiData();
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      userId: userId || faker.number.int(),
      createdAt: faker.date.recent(),
      ...wifiData,
      ...override,
    };
  },

  async createWifi(override: Partial<Wifi> = {}, userId?: number) {
    return await database.wifi.create({
      data: {
        userId: userId || faker.number.int({ min: 1, max: 10000 }),
        ...this.createWifiData(),
        ...override,
      },
    });
  },
};
