import { PasswordHashVo } from './password-hash.vo';
import { PasswordHashInvalidError } from '@/domain/exceptions';

describe('PasswordHashVo', () => {
  const validArgonHash = '$argon2id$v=19$m=65536,t=3,p=4$J6O2tW21GgI/G5qW$Z2sE/G7qW21GgI';

  describe('create()', () => {
    it('должен успешно создаваться с валидным хешем Argon2id', () => {
      const vo = PasswordHashVo.create(validArgonHash);
      expect(vo.value).toBe(validArgonHash);
    });

    it('должен выбрасывать ошибку при пустой строке', () => {
      expect(() => PasswordHashVo.create('')).toThrow(PasswordHashInvalidError);
      expect(() => PasswordHashVo.create('   ')).toThrow(PasswordHashInvalidError);
    });

    it('должен выбрасывать ошибку, если формат хеша не Argon2id', () => {
      expect(() => PasswordHashVo.create('just_a_plain_password')).toThrow(
        PasswordHashInvalidError,
      );
      expect(() => PasswordHashVo.create('$2b$10$somebcryptHashHere123')).toThrow(
        PasswordHashInvalidError,
      );
    });
  });
});
