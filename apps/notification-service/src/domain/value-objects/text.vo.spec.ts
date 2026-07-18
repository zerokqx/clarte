import { TextVo } from './text.vo';

describe('TextVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном тексте', () => {
      const validText = 'Hello World';
      const vo = TextVo.create(validText);
      expect(vo.value).toBe(validText);
    });

    it('должен выбрасывать ошибку, если передан пустой текст', () => {
      expect(() => TextVo.create('')).toThrow('Notification text cannot be empty');
      expect(() => TextVo.create('   ')).toThrow('Notification text cannot be empty');
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
