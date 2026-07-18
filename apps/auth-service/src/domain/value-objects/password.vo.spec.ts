import { PasswordVo } from './password.vo';
import { PasswordInvalidError } from '@/domain/exceptions';

describe('PasswordVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при пароле от 8 символов', () => {
      const validPassword = 'strong_password';
      const vo = PasswordVo.create(validPassword);

      expect(vo.value).toBe(validPassword);
    });

    it('должен выбрасывать ошибку, если пароль пустой', () => {
      expect(() => PasswordVo.create('')).toThrow(PasswordInvalidError);
    });

    it('должен выбрасывать ошибку, если пароль короче 8 символов', () => {
      expect(() => PasswordVo.create('1234567')).toThrow(PasswordInvalidError);
    });
  });
});
