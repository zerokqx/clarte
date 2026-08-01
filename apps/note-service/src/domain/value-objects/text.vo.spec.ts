import { TextVo } from './text.vo';
import { InvalidText } from '../exceptions';

describe('TextVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при непустом тексте', () => {
      const validText = 'Some valid note text';
      const vo = TextVo.create(validText);
      expect(vo.value).toBe(validText);
    });

    it('должен выбрасывать ошибку, если передан пустой текст', () => {
      expect(() => TextVo.create('')).toThrow(InvalidText);
    });

    it('должен выбрасывать ошибку, если переданы только пробелы', () => {
      expect(() => TextVo.create('    ')).toThrow(InvalidText);
      expect(() => TextVo.create('\n\t ')).toThrow(InvalidText);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someText = 'restored text';
      const vo = TextVo.restore(someText);
      expect(vo.value).toBe(someText);
    });
  });
});
