import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { database } from '../../config/postgres';
import { app } from '../../index';
import { noteFactory } from '../factories/noteFactory';
import { userFactory } from '../factories/userFactory';

const agent = supertest(app);

describe('Notes Integration Tests', () => {
  describe('POST /notes', () => {
    it('should return 201 and create a note for an authenticated user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const noteData = noteFactory.createNoteData();

      const response = await agent.post('/notes').set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Note created successfully');

      const noteInDb = await database.note.findFirst({ where: { userId: user.id } });
      expect(noteInDb).not.toBeNull();
      expect(noteInDb?.title).toBe(noteData.title);
    });

    it('should return 401 if no token is sent', async () => {
      const noteData = noteFactory.createNoteData();

      const response = await agent.post('/notes').send(noteData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token } = await userFactory.createUserAndToken();
      const noteData = { ...noteFactory.createNoteData(), text: '' };

      const response = await agent.post('/notes').set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Text can not be empty');
    });

    it('should return 409 if the note title already exists', async () => {
      const { token } = await userFactory.createUserAndToken();
      const noteData = noteFactory.createNoteData();

      await agent.post('/notes').set('Authorization', `Bearer ${token}`).send(noteData);
      const response = await agent.post('/notes').set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Note with this title already exists');
    });
  });

  describe('GET /notes/all', () => {
    it('should return 200 and a list of notes for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();

      const noteData1 = await noteFactory.createNote({}, user.id);
      const noteData2 = await noteFactory.createNote({}, user.id);
      const noteData3 = await noteFactory.createNote({}, anotherUser.id);

      const response = await agent.get('/notes/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body).not.toContain(noteData3);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: noteData1.id, userId: user.id, title: noteData1.title, text: noteData1.text }),
          expect.objectContaining({ id: noteData2.id, userId: user.id, title: noteData2.title, text: noteData2.text }),
        ])
      );
    });

    it('should return an empty array if the user has no notes', async () => {
      const { token } = await userFactory.createUserAndToken();

      const response = await agent.get('/notes/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/notes/all');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });
  });

  describe('GET /notes/:id', () => {
    it('should return 200 and a note for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, user.id);

      const response = await agent.get(`/notes/${note.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(note.id);
      expect(response.body.userId).toBe(user.id);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get(`/notes/1`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the note does not exist', async () => {
      const noteId = 999;
      const { token } = await userFactory.createUserAndToken();

      const response = await agent.get(`/notes/${noteId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Note doesn't exist");
    });

    it('should return 403 if the note does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, owner.id);

      const response = await agent.get(`/notes/${note.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have the permission to see this note");
    });
  });

  describe('PUT /notes/:id', () => {
    it('should return 200 and update a note for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({ title: 'Old Title' }, user.id);
      const noteData = noteFactory.createNoteData({ title: 'New Title' });

      const response = await agent.put(`/notes/${note.id}`).set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Note updated successfully');

      const noteInDb = await database.note.findUnique({ where: { id: note.id } });
      expect(noteInDb).not.toBeNull();
      expect(noteInDb?.title).toBe('New Title');
    });

    it('should return 401 if no token is sent', async () => {
      const noteData = noteFactory.createNoteData();

      const response = await agent.put(`/notes/1`).send(noteData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the note does not exist', async () => {
      const noteId = 999;
      const { token } = await userFactory.createUserAndToken();
      const noteData = noteFactory.createNoteData();

      const response = await agent.put(`/notes/${noteId}`).set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Note doesn't exist");
    });

    it('should return 403 if the note does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, owner.id);
      const noteData = noteFactory.createNoteData();

      const response = await agent.put(`/notes/${note.id}`).set('Authorization', `Bearer ${attackerToken}`).send(noteData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have the permission to update this note");
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, user.id);
      const noteData = { ...noteFactory.createNoteData(), text: '' };

      const response = await agent.put(`/notes/${note.id}`).set('Authorization', `Bearer ${token}`).send(noteData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Text can not be empty');
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should return 200 and delete a note for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, user.id);

      const response = await agent.delete(`/notes/${note.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Note deleted successfully');

      const noteInDb = await database.note.findUnique({ where: { id: note.id } });
      expect(noteInDb).toBeNull();
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.delete(`/notes/1`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the note does not exist', async () => {
      const noteId = 999;
      const { token } = await userFactory.createUserAndToken();

      const response = await agent.delete(`/notes/${noteId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Note doesn't exist");
    });

    it('should return 403 if the note does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const note = await noteFactory.createNote({}, owner.id);

      const response = await agent.delete(`/notes/${note.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have the permission to delete this note");
    });
  });
});
