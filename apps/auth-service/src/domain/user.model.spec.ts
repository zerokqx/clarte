import { IPasswordHasher } from './ports';
import { AuthUser } from './user.model';

describe('AuthUser Domain Model', () => {
  let mockHasher: jest.Mocked<IPasswordHasher>;
  const validArgonHash = '$argon2id$v=19$m=65536,t=3,p=4$J6O2tW21GgI/G5qW$Z2sE/G7qW21GgI';

  beforeEach(() => {
    mockHasher = { hash: jest.fn(), compare: jest.fn() };
  });

  describe('create()', () => {
    it('должен успешно создавать пользователя и хешировать пароль', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const login = 'testuser';
      const rawPassword = 'StrongPassword123!';
      mockHasher.hash.mockResolvedValue(validArgonHash);
      const user = await AuthUser.create(userId, login, rawPassword, mockHasher);

      expect(mockHasher.hash).toHaveBeenCalledWith(rawPassword);
      expect(mockHasher.hash).toHaveBeenCalledTimes(1);

      expect(user.id).toBe(userId);
      expect(user.login).toBe(login);
      expect(user.passwordHash).toBe(validArgonHash);
    });
  });
  describe('comparePassword()', () => {
    it('должен возвращать true, если пароль совпадает', async () => {
      mockHasher.compare.mockResolvedValue(true);
      const user = AuthUser.restore({
        id: '1',
        login: 'testuser',
        passwordHash: validArgonHash,
      });

      const isMatch = await user.comparePassword('MyPassword', mockHasher);

      expect(isMatch).toBe(true);
      expect(mockHasher.compare).toHaveBeenCalledWith('MyPassword', validArgonHash);
    });
  });
});
