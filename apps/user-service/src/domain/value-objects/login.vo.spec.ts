import { UserLogin } from './login.vo';
import { IncorrectLoginFormatError } from '@/domain/exceptions/incrrect-login-format';

describe('UserLogin', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном логине', () => {
      const validLogin = 'user123';
      const vo = UserLogin.create(validLogin);
      expect(vo.value).toBe(validLogin);
    });

    it('должен выбрасывать ошибку, если передан пустой логин', () => {
      expect(() => UserLogin.create('')).toThrow(IncorrectLoginFormatError);
      expect(() => UserLogin.create('   ')).toThrow(IncorrectLoginFormatError);
    });

    it('должен выбрасывать ошибку, если длина логина больше 30 символов', () => {
      const longLogin = 'a'.repeat(31);
      expect(() => UserLogin.create(longLogin)).toThrow(IncorrectLoginFormatError);
    });

    it('должен успешно создавать VO при длине логина ровно 30 символов', () => {
      const exactly30 = 'a'.repeat(30);
      const vo = UserLogin.create(exactly30);
      expect(vo.value).toBe(exactly30);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки', () => {
      const someLogin = 'restored-login';
      const vo = UserLogin.restore(someLogin);
      expect(vo.value).toBe(someLogin);
    });
  });
});
