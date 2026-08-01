import { TitleVo } from './title.vo';

describe('TitleVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном заголовке', () => {
      const validTitle = 'Notification Title';
      const vo = TitleVo.create(validTitle);
      expect(vo.value).toBe(validTitle);
    });

    it('должен выбрасывать ошибку, если заголовок пустой', () => {
      expect(() => TitleVo.create('')).toThrow('Title cannot be empty');
      expect(() => TitleVo.create('   ')).toThrow('Title cannot be empty');
    });

    it('должен выбрасывать ошибку, если заголовок длиннее 255 символов', () => {
      const longTitle = 'a'.repeat(256);
      expect(() => TitleVo.create(longTitle)).toThrow('Title cannot be longer than 255 characters');
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someTitle = 'restored title';
      const vo = TitleVo.restore(someTitle);
      expect(vo.value).toBe(someTitle);
    });
  });
});
