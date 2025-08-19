import { Wifi } from '@prisma/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as errorHandlerMiddleware from '../../../middlewares/errorHandlerMiddleware';
import * as wifiRepository from '../../../repositories/wifiRepository';
import * as wifiService from '../../../services/wifiService';
import * as passwordUtils from '../../../utils/passwordEncryption';
import { wifiFactory } from '../../factories/wifiFactory';

vi.mock('../../../repositories/credentialsRepository');
vi.mock('../../../utils/passwordEncryption');
vi.mock('../../../middlewares/errorHandlerMiddleware');

describe('Wifi Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWifi', () => {
    it('should create a wifi successfully', async () => {
      const userId = 1;
      const wifiData = wifiFactory.createMockWifi({}, userId);
      const encryptedPassword = 'encrypted_password';

      vi.spyOn(passwordUtils, 'encryptPassword').mockReturnValue(encryptedPassword);
      vi.spyOn(wifiRepository, 'createWifi').mockResolvedValue(undefined);

      await wifiService.createWifi(wifiData, userId);

      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(wifiData.password);
      expect(wifiRepository.createWifi).toHaveBeenCalledWith({ ...wifiData, password: encryptedPassword }, userId);
    });
  });

  describe('getUserWifi', () => {
    it('should return the user wifi', async () => {
      const userId = 1;
      const wifi = [wifiFactory.createMockWifi({}, userId), wifiFactory.createMockWifi({}, userId)];
      const decryptedPassword = 'decrypted_password';

      vi.spyOn(wifiRepository, 'getUserWifi').mockResolvedValue(wifi);
      vi.spyOn(passwordUtils, 'decryptPassword').mockReturnValue(decryptedPassword).mockReturnValue(decryptedPassword);

      const result = await wifiService.getUserWifi(userId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(wifi.length);
      expect(result[0].password).toBe(decryptedPassword);
      expect(result[0].userId).toBe(userId);
      expect(result[1].password).toBe(decryptedPassword);
      expect(result[1].userId).toBe(userId);
      expect(passwordUtils.decryptPassword).toHaveBeenCalledTimes(wifi.length);
    });

    it('should return an empty array if the user has no wifi', async () => {
      const userId = 1;
      const wifi: Wifi[] = [];

      vi.spyOn(wifiRepository, 'getUserWifi').mockResolvedValue(wifi);

      const result = await wifiService.getUserWifi(userId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(wifi.length);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('getWifiById', () => {
    it('should return a specific wifi', async () => {
      const userId = 1;
      const wifiId = 1;
      const wifi = wifiFactory.createMockWifi({ id: wifiId }, userId);
      const decryptedPassword = 'decrypted_password';

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(wifi);
      vi.spyOn(passwordUtils, 'decryptPassword').mockReturnValue(decryptedPassword);

      const result = await wifiService.getWifiById(userId, wifiId);

      expect(result).toBeInstanceOf(Object);
      expect(result.password).toBe(decryptedPassword);
      expect(result.userId).toBe(userId);
      expect(passwordUtils.decryptPassword).toHaveBeenCalledWith(wifi.password);
    });

    it('should throw a not found error if the wifi does not exist', async () => {
      const userId = 1;
      const wifiId = 999;
      const notFoundError = { type: 'not_found', message: 'Wifi not found' };

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(wifiService.getWifiById(userId, wifiId)).rejects.toEqual(notFoundError);
      expect(wifiRepository.getWifiById).toHaveBeenCalledWith(wifiId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the wifi does not belong to the user', async () => {
      const userId = 1;
      const ownerId = 2;
      const wifiId = 1;
      const wifi = wifiFactory.createMockWifi({ id: wifiId }, ownerId);
      const forbiddenError = { type: 'forbidden', message: "You don't have permission to perform this action" };

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(wifi);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(wifiService.getWifiById(userId, wifiId)).rejects.toEqual(forbiddenError);
      expect(wifiRepository.getWifiById).toHaveBeenCalledWith(wifiId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('updateWifi', () => {
    it('should update a wifi successfully', async () => {
      const userId = 1;
      const wifiId = 10;
      const wifi = wifiFactory.createMockWifi({ id: wifiId }, userId);
      const wifiData = wifiFactory.createWifiData();
      const encryptedPassword = 'encrypted_password';

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(wifi);
      vi.spyOn(wifiRepository, 'updateWifi').mockResolvedValue(undefined);
      vi.spyOn(passwordUtils, 'encryptPassword').mockReturnValue(encryptedPassword);

      await wifiService.updateWifi(userId, wifiId, wifiData);

      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(wifiData.password);
      expect(wifiRepository.updateWifi).toHaveBeenCalledWith(wifiId, { ...wifiData, password: encryptedPassword });
      expect(wifi.id).toBe(wifiId);
      expect(wifi.userId).toBe(userId);
    });

    it('should throw a not found error if the wifi does not exist', async () => {
      const userId = 1;
      const wifiId = 999;
      const wifiData = wifiFactory.createWifiData();
      const notFoundError = { type: 'not_found', message: 'Wifi not found' };

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(wifiService.updateWifi(userId, wifiId, wifiData)).rejects.toEqual(notFoundError);
      expect(wifiRepository.getWifiById).toHaveBeenCalledWith(wifiId);
      expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the wifi does not belong to the user', async () => {
      const userId = 1;
      const ownerId = 2;
      const wifiId = 1;
      const wifi = wifiFactory.createMockWifi({ id: wifiId }, ownerId);
      const wifiData = wifiFactory.createWifiData();
      const forbiddenError = { type: 'forbidden', message: "You don't have permission to perform this action" };

      vi.spyOn(wifiRepository, 'getWifiById').mockResolvedValue(wifi);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(wifiService.updateWifi(userId, wifiId, wifiData)).rejects.toEqual(forbiddenError);
      expect(wifiRepository.getWifiById).toHaveBeenCalledWith(wifiId);
      expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
    });
  });
});
