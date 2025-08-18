import bcrypt from 'bcrypt';
import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { database } from '../../config/postgres';
import { app } from '../../index';
import { userFactory } from '../factories/userFactory';

const passwordErrorMessage = 'Password must contain at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character';

const agent = supertest(app);

describe('Auth Integration Tests', () => {
  describe('POST /sign-up', () => {
    it('should return 201 and create a user for valid data', async () => {
      const userData = userFactory.createSignUpData();

      const response = await agent.post('/sign-up').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');

      const userInDb = await database.user.findUnique({ where: { email: userData.email } });
      expect(userInDb).not.toBeNull();
    });

    it('should return 422 for an invalid password', async () => {
      const { email } = userFactory.createSignUpData();
      const userData = { email, password: 'weakpassword123' };

      const response = await agent.post('/sign-up').send(userData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe(passwordErrorMessage);
    });

    it('should return 422 for an invalid email', async () => {
      const { password } = userFactory.createSignUpData();
      const userData = { email: 'invalid-email', password };

      const response = await agent.post('/sign-up').send(userData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Email must be a valid email address');
    });

    it('should return 409 if the email is already in use', async () => {
      const userData = userFactory.createSignUpData();

      await agent.post('/sign-up').send(userData);

      const response = await agent.post('/sign-up').send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('This email is already in use. Please choose a new email for registration');
    });
  });

  describe('POST /sign-in', () => {
    it('should return 200 and a token for valid credentials', async () => {
      const userData = userFactory.createSignUpData();

      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      await database.user.create({
        data: { email: userData.email, password: hashedPassword },
      });

      const response = await agent.post('/sign-in').send(userData);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toBe('Authentication Success');
    });

    it('should return 422 for an invalid email', async () => {
      const { password } = userFactory.createSignUpData();
      const userData = { email: 'invalid-email', password };

      const response = await agent.post('/sign-in').send(userData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Email must be a valid email address');
    });

    it('should return 422 for an invalid password', async () => {
      const { email } = userFactory.createSignUpData();
      const userData = { email, password: 'weakpassword123' };

      const response = await agent.post('/sign-in').send(userData);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe(passwordErrorMessage);
    });

    it('should return 401 for an unregistered email', async () => {
      const userData = userFactory.createSignUpData();

      const response = await agent.post('/sign-in').send(userData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect email and/or password');
    });

    it('should return 401 for an incorrect password', async () => {
      const userData = userFactory.createSignUpData();

      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      await database.user.create({
        data: { email: userData.email, password: hashedPassword },
      });

      const response = await agent.post('/sign-in').send({
        email: userData.email,
        password: 'WrongPassword123$',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect email and/or password');
    });
  });
});
