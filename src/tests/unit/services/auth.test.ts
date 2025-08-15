import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as authRepository from '../../../repositories/authRepository';
import * as authService from '../../../services/authServices';
import * as passwordUtils from '../../../utils/passwordEncryption';
import * as tokenUtils from '../../../utils/token';
import { userFactory } from '../../factory/userFactory';

vi.mock('../../../repositories/authRepository');
vi.mock('../../../utils/passwordEncryption');
vi.mock('../../../utils/token');
vi.mock('../../../middlewares/errorHandlerMiddleware');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with success', async () => {
      const { email, password } = userFactory.createSignUpData();
      const hashedPassword = 'hashedPassword123$';

      vi.spyOn(authRepository, 'findUserEmail').mockResolvedValue(null);
      vi.spyOn(passwordUtils, 'encryptsPassword').mockReturnValue(hashedPassword);
      vi.spyOn(authRepository, 'createUser').mockResolvedValue(undefined);

      await authService.createUser(email, password);

      expect(authRepository.findUserEmail).toHaveBeenCalledWith(email);
      expect(passwordUtils.encryptsPassword).toHaveBeenCalledWith(password);
      expect(authRepository.createUser).toHaveBeenCalledWith(email, hashedPassword);
    });

    it('should throw a conflict error if the email is already in use', async () => {
      const { email, password } = userFactory.createSignUpData();
      const existingUser = userFactory.createDbUser(email, password);

      vi.spyOn(authRepository, 'findUserEmail').mockResolvedValue(existingUser);

      await expect(authService.createUser(email, password)).rejects.toThrow('This email is already in use. Please choose a new email for registration');

      expect(authRepository.findUserEmail).toHaveBeenCalledWith(email);
      expect(passwordUtils.encryptsPassword).not.toHaveBeenCalled();
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const { email, password } = userFactory.createSignUpData();
      const userFromDb = userFactory.createDbUser(email, password);
      const fakeToken = 'fake.jwt.token';

      vi.spyOn(authRepository, 'findUserEmail').mockResolvedValue(userFromDb);
      vi.spyOn(passwordUtils, 'comparePassword').mockReturnValue(true);
      vi.spyOn(tokenUtils, 'generateToken').mockReturnValue(fakeToken);

      const token = await authService.login(email, password);

      expect(token).toBe(fakeToken);
      expect(authRepository.findUserEmail).toHaveBeenCalledWith(email);
      expect(passwordUtils.comparePassword).toHaveBeenCalledWith(password, userFromDb.password);
      expect(tokenUtils.generateToken).toHaveBeenCalledWith(userFromDb.id);
    });

    it('should throw an unauthorized error if the email (user) is not found    ', async () => {
      const { email, password } = userFactory.createSignUpData();

      vi.spyOn(authRepository, 'findUserEmail').mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Incorrect email and/or password');

      expect(authRepository.findUserEmail).toHaveBeenCalledWith(email);
      expect(passwordUtils.comparePassword).not.toHaveBeenCalled();
      expect(tokenUtils.generateToken).not.toHaveBeenCalled();
    });

    it('should throw an unauthorized error if the password is incorrect', async () => {
      const { email, password } = userFactory.createSignUpData();
      const userFromDb = userFactory.createDbUser(email, 'differentHashedPassword');

      vi.spyOn(authRepository, 'findUserEmail').mockResolvedValue(userFromDb);
      vi.spyOn(passwordUtils, 'comparePassword').mockReturnValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Incorrect email and/or password');

      expect(authRepository.findUserEmail).toHaveBeenCalledWith(email);
      expect(passwordUtils.comparePassword).toHaveBeenCalledWith(password, userFromDb.password);
      expect(tokenUtils.generateToken).not.toHaveBeenCalled();
    });
  });
});
