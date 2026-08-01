import { Note } from './note.model';
import { InvalidText } from './exceptions';

describe('Note Domain Entity', () => {
  const defaultCreateDto = {
    id: 'note-123',
    text: 'Valid note text',
    authorId: 'user-456',
  };

  const defaultRestoreDto = {
    id: 'note-123',
    text: 'Restored text',
    tags: ['test', 'jest'],
    bytes: null,
    authorId: 'user-456',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  describe('create()', () => {
    it('должен успешно создавать заметку с валидными данными', () => {
      const note = Note.create(defaultCreateDto);

      expect(note.id).toBe(defaultCreateDto.id);
      expect(note.text).toBe(defaultCreateDto.text);
      expect(note.authorId).toBe(defaultCreateDto.authorId);
      expect(note.tags).toEqual([]);
      expect(note.bytes).toBeNull();
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.updatedAt).toBeInstanceOf(Date);
    });

    it('должен выбрасывать ошибку InvalidText, если передана пустая строка текста', () => {
      expect(() => {
        Note.create({ ...defaultCreateDto, text: '' });
      }).toThrow(InvalidText);
    });
  });

  describe('restore()', () => {
    it('должен корректно восстанавливать заметку из сырых данных', () => {
      const note = Note.restore(defaultRestoreDto);

      expect(note.id).toBe(defaultRestoreDto.id);
      expect(note.text).toBe(defaultRestoreDto.text);
      expect(note.tags).toEqual(defaultRestoreDto.tags);
      expect(note.bytes).toBe(defaultRestoreDto.bytes);
      expect(note.authorId).toBe(defaultRestoreDto.authorId);
      expect(note.createdAt).toBe(defaultRestoreDto.createdAt);
      expect(note.updatedAt).toBe(defaultRestoreDto.updatedAt);
    });
  });

  describe('behavior methods', () => {
    let note: Note;

    beforeEach(() => {
      note = Note.restore({ ...defaultRestoreDto });
    });

    it('changeText() должен обновлять текст и updatedAt', () => {
      const oldUpdatedAt = note.updatedAt;
      const newText = 'Updated text!';

      // Немного ждем, чтобы Date изменился (если тесты выполняются мгновенно)
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

      note.changeText(newText);

      expect(note.text).toBe(newText);
      expect(note.updatedAt).not.toEqual(oldUpdatedAt);
      expect(note.updatedAt.toISOString()).toBe('2025-01-01T00:00:00.000Z');

      jest.useRealTimers();
    });

    it('changeText() должен выбрасывать ошибку, если новый текст не валиден', () => {
      expect(() => note.changeText('   ')).toThrow(InvalidText);
    });

    it('changeTags() должен обновлять теги и updatedAt', () => {
      const oldUpdatedAt = note.updatedAt;
      const newTags = ['new-tag'];

      note.changeTags(newTags);

      expect(note.tags).toEqual(newTags);
      expect(note.updatedAt).not.toEqual(oldUpdatedAt);
    });

    it('changeBytes() должен обновлять байты и updatedAt', () => {
      const oldUpdatedAt = note.updatedAt;
      const newBytes = new Uint8Array([1, 2, 3]);

      note.changeBytes(newBytes);

      expect(note.bytes).toEqual(newBytes);
      expect(note.updatedAt).not.toEqual(oldUpdatedAt);
    });
  });

  describe('toPlain()', () => {
    it('должен возвращать плоский объект свойств заметки', () => {
      const note = Note.restore(defaultRestoreDto);
      const plain = note.toPlain();

      expect(plain).toEqual({
        id: defaultRestoreDto.id,
        text: defaultRestoreDto.text,
        tags: defaultRestoreDto.tags,
        bytes: defaultRestoreDto.bytes,
        authorId: defaultRestoreDto.authorId,
        createdAt: defaultRestoreDto.createdAt,
        updatedAt: defaultRestoreDto.updatedAt,
      });
    });
  });
});
