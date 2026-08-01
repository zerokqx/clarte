import { DescriptionVo } from './description.vo';
import { LengthDescriptionInvalidException } from '../exceptions';

describe('DescriptionVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при длине текста от 10 до 1000 символов', () => {
      const validDesc = 'Valid description text';
      const vo = DescriptionVo.create(validDesc);
      expect(vo.value).toBe(validDesc);
    });

    it('должен выбрасывать ошибку, если длина текста меньше 10 символов', () => {
      expect(() => DescriptionVo.create('Short')).toThrow(LengthDescriptionInvalidException);
    });

    it('должен выбрасывать ошибку, если длина текста больше 1000 символов', () => {
      const longDesc = 'a'.repeat(1001);
      expect(() => DescriptionVo.create(longDesc)).toThrow(LengthDescriptionInvalidException);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someText = 'restored description';
      const vo = DescriptionVo.restore(someText);
      expect(vo.value).toBe(someText);
    });
  });
});
