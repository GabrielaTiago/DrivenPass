import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { beforeAll, afterAll, beforeEach } from 'vitest';

dotenv.config({ path: '.env.test' });

export const prisma = new PrismaClient();

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users, credentials, notes, cards, wifis RESTART IDENTITY CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
