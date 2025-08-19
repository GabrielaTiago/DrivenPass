import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { database } from '../../config/postgres';
import { app } from '../../index';
import { encryptPassword } from '../../utils/passwordEncryption';
import { userFactory } from '../factories/userFactory';
import { wifiFactory } from '../factories/wifiFactory';

const agent = supertest(app);

describe('Wifi Integration Tests', () => {
  describe('POST /wifi', () => {
    it('should return 201 and create a wifi for an authenticated user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const wifiData = wifiFactory.createWifiData();

      const response = await agent.post('/wifi').set('Authorization', `Bearer ${token}`).send(wifiData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Wifi created successfully');

      const wifiInDb = await database.wifi.findFirst({ where: { userId: user.id } });
      expect(wifiInDb).not.toBeNull();
      expect(wifiInDb?.wifiName).toBe(wifiData.wifiName);
      expect(wifiInDb?.userId).toBe(user.id);
    });

    it('should return 401 if no token is sent', async () => {
      const wifiData = wifiFactory.createWifiData();

      const response = await agent.post('/wifi').send(wifiData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token } = await userFactory.createUserAndToken();
      const invalidData = { ...wifiFactory.createWifiData(), title: '' };

      const response = await agent.post('/wifi').set('Authorization', `Bearer ${token}`).send(invalidData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Title can not be empty');
    });
  });

  describe('GET /wifi/all', () => {
    it('should return 200 and the user wifi', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();

      const plaintextPassword1 = 'Plaintext-Password-123!';
      const plaintextPassword2 = 'Another-Secret-456!';
      const plaintextPassword3 = 'Other-User-Password-789!';

      const wifi1 = await wifiFactory.createWifi({ password: encryptPassword(plaintextPassword1) }, user.id);
      const wifi2 = await wifiFactory.createWifi({ password: encryptPassword(plaintextPassword2) }, user.id);
      const wifi3 = await wifiFactory.createWifi({ password: encryptPassword(plaintextPassword3) }, anotherUser.id);

      const response = await agent.get('/wifi/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body).not.toContain(wifi3);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: wifi1.id, userId: user.id, title: wifi1.title, password: plaintextPassword1 }),
          expect.objectContaining({ id: wifi2.id, userId: user.id, title: wifi2.title, password: plaintextPassword2 }),
        ])
      );
    });

    it('should return an empty array if the user has no wifi', async () => {
      const { token } = await userFactory.createUserAndToken();

      const response = await agent.get('/wifi/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/wifi/all');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });
  });

  describe('GET /wifi/:id', () => {
    it('should return 200 and the user wifi', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const plaintextPassword = 'Plaintext-Password-123!';
      const wifi = await wifiFactory.createWifi({ password: encryptPassword(plaintextPassword) }, user.id);

      const response = await agent.get(`/wifi/${wifi.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.id).toBe(wifi.id);
      expect(response.body.userId).toBe(user.id);
      expect(response.body.title).toBe(wifi.title);
      expect(response.body.password).toBe(plaintextPassword);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/wifi/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the wifi does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const wifiId = 999;
      const response = await agent.get(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Wifi doesn't exist");
    });

    it('should return 403 if the wifi does not belong to the user', async () => {
      const { token } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();
      const wifiId = 1;
      await wifiFactory.createWifi({}, anotherUser.id);

      const response = await agent.get(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });
  });

  describe('PUT /wifi/:id', () => {
    it('should return 200 and update the wifi successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const wifiData = wifiFactory.createWifiData({ title: 'New Title' });
      const plaintextPassword = 'Plaintext-Password-123!';
      const encryptedPassword = encryptPassword(plaintextPassword);
      const wifi = await wifiFactory.createWifi({ password: encryptedPassword, title: 'Old Title' }, user.id);

      const response = await agent.put(`/wifi/${wifi.id}`).set('Authorization', `Bearer ${token}`).send(wifiData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Wifi updated successfully');

      const wifiInDb = await database.wifi.findUnique({ where: { id: wifi.id } });
      expect(wifiInDb).not.toBeNull();
      expect(wifiInDb?.title).toBe(wifiData.title);
      expect(wifiInDb?.userId).toBe(user.id);
    });

    it('should return 401 if no token is sent', async () => {
      const wifiData = wifiFactory.createWifiData();

      const response = await agent.put('/wifi/1').send(wifiData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the wifi does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const wifiId = 999;
      const wifiData = wifiFactory.createWifiData();

      const response = await agent.put(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`).send(wifiData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Wifi doesn't exist");
    });

    it('should return 403 if the wifi does not belong to the user', async () => {
      const { token } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();
      const wifiId = 1;
      const wifiData = wifiFactory.createWifiData();
      await wifiFactory.createWifi({}, anotherUser.id);

      const response = await agent.put(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`).send(wifiData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token } = await userFactory.createUserAndToken();
      const invalidData = { ...wifiFactory.createWifiData(), title: '' };

      const response = await agent.put('/wifi/1').set('Authorization', `Bearer ${token}`).send(invalidData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Title can not be empty');
    });
  });

  describe('DELETE /wifi/:id', () => {
    it('should return 200 and delete the wifi successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const wifi = await wifiFactory.createWifi({}, user.id);

      const response = await agent.delete(`/wifi/${wifi.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Wifi deleted successfully');

      const wifiInDb = await database.wifi.findUnique({ where: { id: wifi.id } });
      expect(wifiInDb).toBeNull();
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.delete('/wifi/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the wifi does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const wifiId = 999;

      const response = await agent.delete(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Wifi doesn't exist");
    });

    it('should return 403 if the wifi does not belong to the user', async () => {
      const { token } = await userFactory.createUserAndToken();
      const { user: anotherUser } = await userFactory.createUserAndToken();
      const wifiId = 1;
      await wifiFactory.createWifi({}, anotherUser.id);

      const response = await agent.delete(`/wifi/${wifiId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });
  });
});
