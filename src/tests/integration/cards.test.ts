import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { database } from '../../config/postgres';
import { app } from '../../index';
import { encryptPassword } from '../../utils/passwordEncryption';
import { cardFactory } from '../factories/cardFactory';
import { userFactory } from '../factories/userFactory';

const agent = supertest(app);

describe('Cards Integration Tests', () => {
  describe('POST /cards', () => {
    it('should return 201 and create a card for an authenticated user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData();

      const response = await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Card created successfully');

      const cardInDb = await database.card.findFirst({ where: { userId: user.id } });
      expect(cardInDb).not.toBeNull();
      expect(cardInDb?.nickname).toBe(cardData.nickname);
      expect(cardInDb?.userId).toBe(user.id);
    });

    it('should return 401 if no token is sent', async () => {
      const cardData = cardFactory.createCardData();

      const response = await agent.post('/cards').send(cardData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 422 if the request body is invalid', async () => {
      const { token } = await userFactory.createUserAndToken();
      const cardData = { ...cardFactory.createCardData(), nickname: '' };

      const response = await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Nickname can not be empty');
    });

    it('should return 409 if the nickname is already in use by the same user', async () => {
      const { token } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData();

      await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData);
      const response = await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Card with this nickname already exists');
    });
  });

  describe('GET /cards/all', () => {
    it('should return 200 and a list of cards for the user', async () => {
      const { token } = await userFactory.createUserAndToken();

      const cardData1 = cardFactory.createCardData();
      const cardData2 = cardFactory.createCardData();

      await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData1);
      await agent.post('/cards').set('Authorization', `Bearer ${token}`).send(cardData2);

      const { token: anotherUserToken } = await userFactory.createUserAndToken();
      const cardData3 = cardFactory.createCardData();
      await agent.post('/cards').set('Authorization', `Bearer ${anotherUserToken}`).send(cardData3);

      const response = await agent.get('/cards/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body).not.toContain(cardData3);
    });

    it('should return 200 and a empty array if the user does not have any cards', async () => {
      const { token } = await userFactory.createUserAndToken();

      const response = await agent.get('/cards/all').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/cards/all');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });
  });

  describe('GET /cards/:id', () => {
    it('should return 200 and the specific card for the user', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData();
      const encryptedPassword = encryptPassword(cardData.password);
      const encryptedCvv = encryptPassword(cardData.cvv);
      const card = await cardFactory.createCard({ ...cardData, password: encryptedPassword, cvv: encryptedCvv }, user.id);

      const response = await agent.get(`/cards/${card.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.id).toBe(card.id);
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.get('/cards/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the card does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const cardId = 999;

      const response = await agent.get(`/cards/${cardId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Card doesn't exist");
    });

    it('should return 403 if the card does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const card = await cardFactory.createCard({}, owner.id);

      const response = await agent.get(`/cards/${card.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });
  });

  describe('PUT /cards/:id', () => {
    it('should return 200 and update the card successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData({ nickname: 'New Nickname' });
      const card = await cardFactory.createCard(
        { ...cardData, password: encryptPassword(cardData.password), cvv: encryptPassword(cardData.cvv), nickname: 'Old Nickname' },
        user.id
      );

      const response = await agent.put(`/cards/${card.id}`).set('Authorization', `Bearer ${token}`).send(cardData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Card updated successfully');

      const cardInDb = await database.card.findUnique({ where: { id: card.id } });
      expect(cardInDb?.nickname).toBe(cardData.nickname);
      expect(cardInDb?.userId).toBe(user.id);
    });

    it('should return 401 if no token is sent', async () => {
      const cardData = cardFactory.createCardData();
      const response = await agent.put('/cards/1').send(cardData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the card does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const cardId = 999;
      const cardData = cardFactory.createCardData();

      const response = await agent.put(`/cards/${cardId}`).set('Authorization', `Bearer ${token}`).send(cardData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Card doesn't exist");
    });

    it('should return 403 if the card does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const card = await cardFactory.createCard({}, owner.id);
      const cardData = cardFactory.createCardData();

      const response = await agent.put(`/cards/${card.id}`).set('Authorization', `Bearer ${attackerToken}`).send(cardData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });

    it('should return 422 if the request body is invalid', async () => {
      const { user, token } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData();
      const card = await cardFactory.createCard({ ...cardData }, user.id);

      const response = await agent
        .put(`/cards/${card.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...cardData, nickname: '' });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Nickname can not be empty');
    });
  });

  describe('DELETE /cards/:id', () => {
    it('should return 200 and delete the card successfully', async () => {
      const { token, user } = await userFactory.createUserAndToken();
      const cardData = cardFactory.createCardData();
      const card = await cardFactory.createCard({ ...cardData }, user.id);

      const response = await agent.delete(`/cards/${card.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Card deleted successfully');

      const cardInDb = await database.card.findUnique({ where: { id: card.id } });
      expect(cardInDb).toBeNull();
    });

    it('should return 401 if no token is sent', async () => {
      const response = await agent.delete('/cards/1');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token JWT not sent');
    });

    it('should return 404 if the card does not exist', async () => {
      const { token } = await userFactory.createUserAndToken();
      const cardId = 999;

      const response = await agent.delete(`/cards/${cardId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Card doesn't exist");
    });

    it('should return 403 if the card does not belong to the user', async () => {
      const { token: attackerToken } = await userFactory.createUserAndToken();
      const { user: owner } = await userFactory.createUserAndToken();
      const card = await cardFactory.createCard({}, owner.id);

      const response = await agent.delete(`/cards/${card.id}`).set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("You don't have permission to perform this action");
    });
  });
});
