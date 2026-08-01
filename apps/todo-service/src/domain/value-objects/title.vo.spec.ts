import { TitleVo } from './title.vo';
import { LengthTitleInvalidException } from '../exceptions';

describe('TitleVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при длине текста от 10 до 50 символов', () => {
      const validTitle = 'Valid title text';
      const vo = TitleVo.create(validTitle);
      expect(vo.value).toBe(validTitle);
    });

    it('должен выбрасывать ошибку, если длина текста меньше 10 символов', () => {
      expect(() => TitleVo.create('Short')).toThrow(LengthTitleInvalidException);
    });

    it('должен выбрасывать ошибку, если длина текста больше 50 символов', () => {
      const longTitle = 'a'.repeat(51);
      expect(() => TitleVo.create(longTitle)).toThrow(LengthTitleInvalidException);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someText = 'restored title';
      const vo = TitleVo.restore(someText);
      expect(vo.value).toBe(someText);
    });
  });
});
