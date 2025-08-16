import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { database } from '../../config/postgres';
import { app } from '../../index';
import { encryptPassword } from '../../utils/passwordEncryption';
import { credentialFactory } from '../factories/credentialFactory';
import { userFactory } from '../factories/userFactory';

const agent = supertest(app);

describe('Credentials Integration Tests', () => {
  describe('POST /credentials', () => {
    it('should return 201 and create a credential for an authenticated user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const credentialData = credentialFactory.createCredentialData();

      const response = await agent.post('/credentials').set('Authorization', `Bearer ${token}`).send(credentialData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Credential created successfully');

      const credentialInDb = await database.credential.findFirst({ where: { userId: user.id } });
      expect(credentialInDb).not.toBeNull();
      expect(credentialInDb?.title).toBe(credentialData.title);
    });

    it('should return 401 if no token is sent', async () => {
      const credentialData = credentialFactory.createCredentialData();

      const response = await agent.post('/credentials').send(credentialData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token } = await userFactory.createUserAndToken();
      const invalidData = { ...credentialFactory.createCredentialData(), title: '' };

      const response = await agent.post('/credentials').set('Authorization', `Bearer ${token}`).send(invalidData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Title can not be empty');
    });

    it('should return 409 if the title is already in use by the same user', async () => {
      const { token } = await userFactory.createUserAndToken();
      const credentialData = credentialFactory.createCredentialData();

      await agent.post('/credentials').set('Authorization', `Bearer ${token}`).send(credentialData);
      const response = await agent.post('/credentials').set('Authorization', `Bearer ${token}`).send(credentialData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Credential with this title already exists');
    });
  });

  describe('GET /credentials/all', () => {
    it('should return 200 and a list of credentials for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();

      const plaintextPassword1 = 'Plaintext-Password-123!';
      const plaintextPassword2 = 'Another-Secret-456!';
      const plaintextPassword3 = 'Other-User-Password-789!';

      const credential1 = await credentialFactory.createCredential({ password: encryptPassword(plaintextPassword1) }, user.id);
      const credential2 = await credentialFactory.createCredential({ password: encryptPassword(plaintextPassword2) }, user.id);
      const credential3 = await credentialFactory.createCredential({ password: encryptPassword(plaintextPassword3) }, anotherUser.id);

      const response = await agent.get('/credentials/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body).not.toContain(credential3);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: credential1.id,
            userId: user.id,
            title: credential1.title,
            url: credential1.url,
            username: credential1.username,
            password: plaintextPassword1,
          }),
          expect.objectContaining({
            id: credential2.id,
            userId: user.id,
            title: credential2.title,
            url: credential2.url,
            username: credential2.username,
            password: plaintextPassword2,
          }),
        ])
      );
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/credentials/all');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });
  });

  describe('GET /credentials/:id', () => {
    it('should return 200 and the specific credential for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const credentialData = credentialFactory.createCredentialData();
      const encryptedPassword = encryptPassword(credentialData.password);
      const credential = await credentialFactory.createCredential({ password: encryptedPassword }, user.id);

      const response = await agent.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(credential.id);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/credentials/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the credential does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const credentialId = 999;

      const response = await agent.get(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Credential doesn't exist");
    });

    it('should return 403 if the user tries to access a credential from another user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const credential = await credentialFactory.createCredential({}, owner.id);

      const response = await agent.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to see this credential');
    });
  });

  describe('PUT /credentials/:id', () => {
    it('should return 200 and update the credential successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const credential = await credentialFactory.createCredential({}, user.id);
      const credentialData = credentialFactory.createCredentialData();

      const response = await agent.put(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`).send(credentialData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Credential updated successfully');

      const credentialInDb = await database.credential.findUnique({ where: { id: credential.id } });
      expect(credentialInDb).not.toBeNull();
      expect(credentialInDb?.title).toBe(credentialData.title);
      expect(credentialInDb?.url).toBe(credentialData.url);
      expect(credentialInDb?.username).toBe(credentialData.username);
      expect(credentialInDb?.password).toBe(credentialData.password);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.put('/credentials/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the credential does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const credentialId = 999;

      const response = await agent.put(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Credential doesn't exist");
    });

    it('should return 403 if the user tries to update a credential from another user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const credential = await credentialFactory.createCredential({}, owner.id);

      const response = await agent.put(`/credentials/${credential.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to update this credential');
    });
  });

  describe('DELETE /credentials/:id', () => {
    it('should return 200 and delete the credential successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const credential = await credentialFactory.createCredential({}, user.id);

      const response = await agent.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Credential deleted successfully');

      const credentialInDb = await database.credential.findUnique({ where: { id: credential.id } });
      expect(credentialInDb).toBeNull();
    });

    it('should return 404 if the credential to be deleted does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const credentialId = 999;

      const response = await agent.delete(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Credential doesn't exist");
    });

    it('should return 403 if the user tries to delete a credential from another user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const credential = await credentialFactory.createCredential({}, owner.id);

      const response = await agent.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have permission to delete this credential');

      const credentialInDb = await database.credential.findUnique({ where: { id: credential.id } });
      expect(credentialInDb).not.toBeNull();
    });
  });
});
