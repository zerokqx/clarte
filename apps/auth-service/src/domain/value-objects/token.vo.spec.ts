import { TokenVo } from './token.vo';
import { TokenInvalidError } from '@/domain/exceptions';

describe('TokenVo', () => {
  const validJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  describe('create()', () => {
    it('должен успешно создавать VO при валидном JWT формате', () => {
      const vo = TokenVo.create(validJwt);
      expect(vo.value).toBe(validJwt);
    });

    it('должен выбрасывать ошибку, если токен пустой', () => {
      expect(() => TokenVo.create('')).toThrow(TokenInvalidError);
      expect(() => TokenVo.create('   ')).toThrow(TokenInvalidError);
    });

    it('должен выбрасывать ошибку, если строка не соответствует JWT', () => {
      expect(() => TokenVo.create('just_a_random_string')).toThrow(TokenInvalidError);
      expect(() => TokenVo.create('invalid format !')).toThrow(TokenInvalidError);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO без валидации', () => {
      const fakeToken = 'restored_token_without_validation';
      const vo = TokenVo.restore(fakeToken);
      expect(vo.value).toBe(fakeToken);
    });
  });
});
