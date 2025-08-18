import bcrypt from 'bcrypt';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { encryptsPassword, comparePassword, encryptPassword, decryptPassword } from '../../../utils/passwordEncryption';

const { mockEncrypt, mockDecrypt } = vi.hoisted(() => ({
  mockEncrypt: vi.fn(),
  mockDecrypt: vi.fn(),
}));

vi.mock('cryptr', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        encrypt: mockEncrypt,
        decrypt: mockDecrypt,
      };
    }),
  };
});
vi.mock('bcrypt');

describe('Password Encryption Utils', () => {
  const password = 'mySecretPassword123';
  const hashedPassword = 'a_hashed_password_string';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('encryptsPassword', () => {
    it('should call bcrypt.hashSync and return the encrypted password', () => {
      vi.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const result = encryptsPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, expect.any(Number));
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true if the passwords match', () => {
      vi.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = comparePassword(password, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if the passwords do not match', () => {
      vi.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const result = comparePassword(password, 'wrong_hashed_password');

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, 'wrong_hashed_password');
      expect(result).toBe(false);
    });
  });

  describe('encryptPassword', () => {
    it('should call cryptr.encrypt and return the encrypted string', () => {
      const encryptedString = 'a_cryptr_encrypted_string';

      mockEncrypt.mockReturnValue(encryptedString);

      const result = encryptPassword(password);

      expect(mockEncrypt).toHaveBeenCalledWith(password);
      expect(result).toBe(encryptedString);
    });
  });

  describe('decryptPassword', () => {
    it('should call cryptr.decrypt and return the decrypted string', () => {
      const encryptedString = 'a_cryptr_encrypted_string';

      mockDecrypt.mockReturnValue(password);

      const result = decryptPassword(encryptedString);

      expect(mockDecrypt).toHaveBeenCalledWith(encryptedString);
      expect(result).toBe(password);
    });
  });
});
