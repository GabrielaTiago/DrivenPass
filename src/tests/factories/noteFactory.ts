import { faker } from '@faker-js/faker';
import { Note } from '@prisma/client';

import { database } from '../../config/postgres';
import { NoteData } from '../../types/noteType';

export const noteFactory = {
  createNoteData(override: Partial<NoteData> = {}): NoteData {
    return {
      title: faker.lorem.words(3),
      text: faker.lorem.paragraph().slice(0, 1000),
      ...override,
    };
  },

  createMockNote(override: Partial<Note> = {}, userId?: number) {
    const noteData = this.createNoteData();
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      userId: userId || faker.number.int(),
      createdAt: faker.date.recent(),
      ...noteData,
      ...override,
    };
  },

  async createNote(override: Partial<Note> = {}, userId?: number) {
    return await database.note.create({
      data: {
        userId: userId || faker.number.int({ min: 1, max: 10000 }),
        ...this.createNoteData(),
        ...override,
      },
    });
  },
};
