import { Card } from '@prisma/client';

export type CardData = Omit<Card, 'id' | 'userId' | 'createdAt'>;

export type CardType = 'credit' | 'debit' | 'both';
