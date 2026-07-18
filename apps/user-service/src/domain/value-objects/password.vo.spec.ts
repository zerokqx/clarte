import { UserPassword } from './password.vo';
import { IncorrectPasswordFormatError } from '@/domain/exceptions/incorrect-password-format';

describe('UserPassword', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном пароле (hash)', () => {
      const validHash = '$argon2id$v=19$m=65536,t=3,p=4$somehash';
      const vo = UserPassword.create(validHash);
      expect(vo.value).toBe(validHash);
    });

    it('должен выбрасывать ошибку, если передан пустой пароль', () => {
      expect(() => UserPassword.create('')).toThrow(IncorrectPasswordFormatError);
      expect(() => UserPassword.create('   ')).toThrow(IncorrectPasswordFormatError);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const somePassword = 'restored-password-hash';
      const vo = UserPassword.restore(somePassword);
      expect(vo.value).toBe(somePassword);
    });
  });
});
