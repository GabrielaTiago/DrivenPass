import { Card } from '@prisma/client';
import { beforeEach, describe, it, expect, vi } from 'vitest';

import * as errorHandlerMiddleware from '../../../middlewares/errorHandlerMiddleware';
import * as cardsRepository from '../../../repositories/cardsRepository';
import * as cardsService from '../../../services/cardsServices';
import * as passwordUtils from '../../../utils/passwordEncryption';
import { cardFactory } from '../../factories/cardFactory';

vi.mock('../../../repositories/cardsRepository');
vi.mock('../../../utils/passwordEncryption');
vi.mock('../../../middlewares/errorHandlerMiddleware');

describe('Card Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCard', () => {
    it('should create a new card successfully', async () => {
      const userId = 1;
      const cardData = cardFactory.createCardData();
      const encryptedPassword = 'encrypted_password';
      const encryptedCvv = 'encrypted_cvv';

      vi.spyOn(passwordUtils, 'encryptPassword').mockReturnValueOnce(encryptedPassword).mockReturnValueOnce(encryptedCvv);
      vi.spyOn(cardsRepository, 'createCard').mockResolvedValue(undefined);

      await cardsService.createCard(cardData, userId);

      expect(cardsRepository.findCardByNicknameAndUser).toHaveBeenCalledWith(userId, cardData.nickname);
      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(cardData.password);
      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(cardData.cvv);
      expect(cardsRepository.createCard).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: cardData.nickname,
          printedName: cardData.printedName,
          number: cardData.number,
          cvv: encryptedCvv,
          expirationDate: cardData.expirationDate,
          password: encryptedPassword,
          type: cardData.type,
          virtual: cardData.virtual,
        }),
        userId
      );
    });

    // it('should throw a conflict error if the card nickname already exists for the user', async () => {
    //   const userId = 1;
    //   const cardData = cardFactory.createCardData({ nickname: 'existing_nickname' });
    //   const existingCard = cardFactory.createMockCard(cardData, userId);
    //   const conflictError = { type: 'conflict', message: 'Card with this nickname already exists' };

    //   vi.spyOn(cardsRepository, 'findCardByNicknameAndUser').mockResolvedValue(existingCard);
    //   vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
    //     throw conflictError;
    //   });

    //   await expect(cardsService.createCard(cardData, userId)).rejects.toEqual(conflictError);
    //   expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
    //   expect(cardsRepository.createCard).not.toHaveBeenCalled();
    // });
  });

  describe('getUserCards', () => {
    it('should return all user cards', async () => {
      const userId = 1;
      const cards = [cardFactory.createMockCard({ id: 1 }, userId), cardFactory.createMockCard({ id: 2 }, userId)];
      const decryptedPassword = 'decrypted_password';
      const decryptedCvv = 'decrypted_cvv';

      vi.spyOn(cardsRepository, 'getUserCards').mockResolvedValue(cards);
      vi.spyOn(passwordUtils, 'decryptPassword')
        .mockReturnValueOnce(decryptedPassword)
        .mockReturnValueOnce(decryptedCvv)
        .mockReturnValueOnce(decryptedPassword)
        .mockReturnValueOnce(decryptedCvv);

      const result = await cardsService.getUserCards(userId);

      expect(cardsRepository.getUserCards).toHaveBeenCalledWith(userId);
      expect(result).toEqual([
        { ...cards[0], password: decryptedPassword, cvv: decryptedCvv },
        { ...cards[1], password: decryptedPassword, cvv: decryptedCvv },
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result.every((card) => card.userId === userId)).toBe(true);
      expect(passwordUtils.decryptPassword).toHaveBeenCalledTimes(4); // 2 pass × 2 cvv
    });

    it('should return an empty array if the user has no cards', async () => {
      const userId = 1;
      const cards: Card[] = [];

      vi.spyOn(cardsRepository, 'getUserCards').mockResolvedValue(cards);

      const result = await cardsService.getUserCards(userId);

      expect(cardsRepository.getUserCards).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('getCardById', () => {
    it('should return a card by id', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId }, userId);
      const decryptedPassword = 'decrypted_password';
      const decryptedCvv = 'decrypted_cvv';

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(passwordUtils, 'decryptPassword').mockReturnValueOnce(decryptedPassword).mockReturnValueOnce(decryptedCvv);

      const result = await cardsService.getCardById(userId, cardId);

      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(result).toEqual({ ...card, password: decryptedPassword, cvv: decryptedCvv });
      expect(passwordUtils.decryptPassword).toHaveBeenCalledTimes(2);
      expect(result.id).toBe(cardId);
      expect(result.userId).toBe(userId);
    });

    it('should throw a not found error if the card does not exist', async () => {
      const userId = 1;
      const cardId = 1;
      const notFoundError = { type: 'not_found', message: "Card doesn't exist" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(cardsService.getCardById(userId, cardId)).rejects.toEqual(notFoundError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the card does not belong to the user', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId, userId: 2 }, userId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to perform this action" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(cardsService.getCardById(userId, cardId)).rejects.toEqual(forbiddenError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(passwordUtils.decryptPassword).not.toHaveBeenCalled();
    });
  });

  describe('deleteCard', () => {
    it('should delete a card successfully', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId }, userId);

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(cardsRepository, 'deleteCard').mockResolvedValue(undefined);

      await cardsService.deleteCard(userId, cardId);

      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(cardsRepository.deleteCard).toHaveBeenCalledWith(cardId);
    });

    it('should throw a not found error if the card does not exist', async () => {
      const userId = 1;
      const cardId = 1;
      const notFoundError = { type: 'not_found', message: "Card doesn't exist" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(cardsService.deleteCard(userId, cardId)).rejects.toEqual(notFoundError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(cardsRepository.deleteCard).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the card does not belong to the user', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId, userId: 2 }, userId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to perform this action" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(cardsService.deleteCard(userId, cardId)).rejects.toEqual(forbiddenError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(cardsRepository.deleteCard).not.toHaveBeenCalled();
    });
  });

  describe('updateCard', () => {
    it('should update a card successfully', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId }, userId);
      const encryptedPassword = 'encrypted_password';
      const encryptedCvv = 'encrypted_cvv';

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(cardsRepository, 'updateCard').mockResolvedValue(undefined);
      vi.spyOn(passwordUtils, 'encryptPassword').mockReturnValueOnce(encryptedPassword).mockReturnValueOnce(encryptedCvv);

      await cardsService.updateCard(userId, cardId, card);

      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(cardsRepository.updateCard).toHaveBeenCalledWith(cardId, {
        ...card,
        password: encryptedPassword,
        cvv: encryptedCvv,
      });
      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(card.password);
      expect(passwordUtils.encryptPassword).toHaveBeenCalledWith(card.cvv);
    });

    it('should throw a not found error if the card does not exist', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId }, userId);
      const notFoundError = { type: 'not_found', message: "Card doesn't exist" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(cardsService.updateCard(userId, cardId, card)).rejects.toEqual(notFoundError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
      expect(cardsRepository.updateCard).not.toHaveBeenCalled();
    });

    it('should throw a forbidden error if the card does not belong to the user', async () => {
      const userId = 1;
      const cardId = 1;
      const card = cardFactory.createMockCard({ id: cardId, userId: 2 }, userId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to perform this action" };

      vi.spyOn(cardsRepository, 'getCardById').mockResolvedValue(card);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(cardsService.updateCard(userId, cardId, card)).rejects.toEqual(forbiddenError);
      expect(cardsRepository.getCardById).toHaveBeenCalledWith(cardId);
      expect(passwordUtils.encryptPassword).not.toHaveBeenCalled();
      expect(cardsRepository.updateCard).not.toHaveBeenCalled();
    });
  });

  describe('checkCardNickname', () => {
    it('should check if a card nickname already exists for the user', async () => {
      const userId = 1;
      const nickname = 'non_existing_nickname';

      await expect(cardsService.checkCardNickname(userId, nickname)).resolves.toBeUndefined();
      expect(cardsRepository.findCardByNicknameAndUser).toHaveBeenCalledWith(userId, nickname);
    });

    it('should throw a conflict error if the card nickname already exists for the user', async () => {
      const userId = 1;
      const nickname = 'existing_nickname';
      const card = cardFactory.createMockCard({ nickname }, userId);
      const conflictError = { type: 'conflict', message: 'Card with this nickname already exists' };

      vi.spyOn(cardsRepository, 'findCardByNicknameAndUser').mockResolvedValue(card);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw conflictError;
      });

      await expect(cardsService.checkCardNickname(userId, nickname)).rejects.toEqual(conflictError);
      expect(cardsRepository.findCardByNicknameAndUser).toHaveBeenCalledWith(userId, nickname);
    });
  });
});
