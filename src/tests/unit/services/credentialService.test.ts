import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as errorHandlerMiddleware from '../../../middlewares/errorHandlerMiddleware';
import * as credentialRepository from '../../../repositories/credentialsRepository';
import * as credentialService from '../../../services/credentialsServices';
import * as passwordUtils from '../../../utils/passwordEncryption';
import { credentialFactory } from '../../factories/credentialFactory';

vi.mock('../../../repositories/credentialsRepository');
vi.mock('../../../utils/passwordEncryption');
vi.mock('../../../middlewares/errorHandlerMiddleware');

describe('Credential Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCredential', () => {
    it('should create a new credential successfully', async () => {
      const userId = 1;
      const credentialData = credentialFactory.createCredentialData();
      const encryptedPassword = 'encrypted_password';

      vi.spyOn(credentialRepository, 'findCredentialTitleByUser').mockResolvedValue(null);
      vi.spyOn(passwordUtils, 'encryptPassword').mockReturnValue(encryptedPassword);
      vi.spyOn(credentialRepository, 'createCredential').mockResolvedValue(undefined);

      await credentialService.createCredential(credentialData, userId);

      expect(credentialRepository.findCredentialTitleByUser).toHaveBeenCalledWith(userId, credentialData.title);
      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(credentialData.password);
      expect(credentialRepository.createCredential).toHaveBeenCalledWith({ ...credentialData, password: encryptedPassword }, userId);
    });

    it('should throw a conflict error if the credential title already exists for the user', async () => {
      const userId = 1;
      const credentialData = credentialFactory.createCredentialData();
      const existingCredential = credentialFactory.createMockCredential(credentialData);
      const conflictError = { type: 'conflict', message: 'Credential with this title already exists' };

      vi.spyOn(credentialRepository, 'findCredentialTitleByUser').mockResolvedValue(existingCredential);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw conflictError;
      });

      await expect(credentialService.createCredential(credentialData, userId)).rejects.toEqual(conflictError);
      expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
      expect(credentialRepository.createCredential).not.toHaveBeenCalled();
    });
  });

  describe('getUserCredentials', () => {
    it('should return the user credentials with decrypted passwords', async () => {
      const userId = 1;
      const credentials = [credentialFactory.createMockCredential({}, userId), credentialFactory.createMockCredential({}, userId)];
      const credentialsListLength = 2;
      const decryptedPassword = 'decrypted_password';

      vi.spyOn(credentialRepository, 'getUserCredentials').mockResolvedValue(credentials);
      vi.spyOn(passwordUtils, 'decryptPassword').mockReturnValue(decryptedPassword);

      const result = await credentialService.getUserCredentials(userId);

      expect(result.length).toBe(credentialsListLength);
      expect(result[0].password).toBe(decryptedPassword);
      expect(result[0].userId).toBe(userId);
      expect(result[1].password).toBe(decryptedPassword);
      expect(result[1].userId).toBe(userId);
      expect(passwordUtils.decryptPassword).toHaveBeenCalledTimes(credentialsListLength);
    });

    it('should throw a not found error if no credentials are found', async () => {
      const userId = 1;
      const notFoundError = { type: 'not_found', message: 'No credentials were found' };

      vi.spyOn(credentialRepository, 'getUserCredentials').mockResolvedValue([]);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(credentialService.getUserCredentials(userId)).rejects.toEqual(notFoundError);
      expect(credentialRepository.getUserCredentials).toHaveBeenCalledWith(userId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('getCredentialById', () => {
    it('should return a specific credential with decrypted password', async () => {
      const userId = 1;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({ id: credentialId }, userId);
      const decryptedPassword = 'decrypted_password';

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(passwordUtils, 'decryptPassword').mockReturnValue(decryptedPassword);

      const result = await credentialService.getCredentialById(userId, credentialId);

      expect(result.id).toBe(credentialId);
      expect(result.userId).toBe(userId);
      expect(result.password).toBe(decryptedPassword);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(passwordUtils.decryptPassword).toHaveBeenCalledWith(credential.password);
    });

    it('should throw a not found error if the credential does not exist', async () => {
      const userId = 1;
      const credentialId = 999;
      const notFoundError = { type: 'not_found', message: "Credential doesn't exist" };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(credentialService.getCredentialById(userId, credentialId)).rejects.toEqual(notFoundError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the credential belongs to another user', async () => {
      const userId = 1;
      const ownerId = 2;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({}, ownerId);
      const forbiddenError = { type: 'forbidden', message: 'You do not have permission to see this credential' };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(credentialService.getCredentialById(userId, credentialId)).rejects.toEqual(forbiddenError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('deleteCredential', () => {
    it('should delete a credential successfully', async () => {
      const userId = 1;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({ id: credentialId }, userId);

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(credentialRepository, 'deleteCredential').mockResolvedValue(undefined);

      await credentialService.deleteCredential(userId, credentialId);

      expect(credential.id).toBe(credentialId);
      expect(credential.userId).toBe(userId);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credentialRepository.deleteCredential).toHaveBeenCalledWith(credentialId);
    });

    it('should throw a not found error if the credential to be deleted does not exist', async () => {
      const userId = 1;
      const credentialId = 999;
      const notFoundError = { type: 'not_found', message: "Credential doesn't exist" };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(credentialService.deleteCredential(userId, credentialId)).rejects.toEqual(notFoundError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credentialRepository.deleteCredential).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the user tries to delete a credential from another user', async () => {
      const userId = 1;
      const ownerId = 2;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({ id: credentialId }, ownerId);
      const forbiddenError = { type: 'forbidden', message: 'You do not have permission to delete this credential' };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(credentialService.deleteCredential(userId, credentialId)).rejects.toEqual(forbiddenError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credential.id).toBe(credentialId);
      expect(credential.userId).toBe(ownerId);
      expect(credentialRepository.deleteCredential).not.toHaveBeenCalled();
    });
  });

  describe('updateCredential', () => {
    it('should update a credential successfully', async () => {
      const userId = 1;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({ id: credentialId }, userId);
      const credentialData = credentialFactory.createCredentialData();

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(credentialRepository, 'updateCredential').mockResolvedValue(undefined);

      await credentialService.updateCredential(userId, credentialId, credentialData);

      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credentialRepository.updateCredential).toHaveBeenCalledWith(credentialId, credentialData);
      expect(credential.id).toBe(credentialId);
      expect(credential.userId).toBe(userId);
    });

    it('should throw a not found error if the credential to be updated does not exist', async () => {
      const userId = 1;
      const credentialId = 999;
      const credentialData = credentialFactory.createCredentialData();
      const notFoundError = { type: 'not_found', message: "Credential doesn't exist" };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(credentialService.updateCredential(userId, credentialId, credentialData)).rejects.toEqual(notFoundError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credentialRepository.updateCredential).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the user tries to update a credential from another user', async () => {
      const userId = 1;
      const ownerId = 2;
      const credentialId = 10;
      const credential = credentialFactory.createMockCredential({ id: credentialId }, ownerId);
      const credentialData = credentialFactory.createCredentialData();
      const forbiddenError = { type: 'forbidden', message: 'You do not have permission to update this credential' };

      vi.spyOn(credentialRepository, 'getCredentialById').mockResolvedValue(credential);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(credentialService.updateCredential(userId, credentialId, credentialData)).rejects.toEqual(forbiddenError);
      expect(credentialRepository.getCredentialById).toHaveBeenCalledWith(credentialId);
      expect(credentialRepository.updateCredential).not.toHaveBeenCalled();
    });
  });
});
