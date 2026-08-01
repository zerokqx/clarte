import { Notification } from './notification.model';

describe('Notification Domain Entity', () => {
  const defaultCreateDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    title: 'New Notification',
    text: 'You have a new message',
  };

  const defaultRestoreDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Restored Notification',
    text: 'Restored message',
    isRead: true,
    createdAt: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create()', () => {
    it('должен успешно создавать уведомление с валидными данными', () => {
      const notification = Notification.create(defaultCreateDto);

      expect(notification.id).toBe(defaultCreateDto.id);
      expect(notification.userId).toBe(defaultCreateDto.userId);
      expect(notification.title).toBe(defaultCreateDto.title);
      expect(notification.text).toBe(defaultCreateDto.text);
      expect(notification.isRead).toBe(false);
      expect(notification.createdAt).toEqual(new Date('2024-01-01T12:00:00Z'));
    });

    it('должен выбрасывать ошибку при невалидном title', () => {
      expect(() => {
        Notification.create({ ...defaultCreateDto, title: '' });
      }).toThrow('Title cannot be empty');
    });
  });

  describe('restore()', () => {
    it('должен корректно восстанавливать уведомление из сырых данных', () => {
      const notification = Notification.restore(defaultRestoreDto);

      expect(notification.id).toBe(defaultRestoreDto.id);
      expect(notification.userId).toBe(defaultRestoreDto.userId);
      expect(notification.title).toBe(defaultRestoreDto.title);
      expect(notification.text).toBe(defaultRestoreDto.text);
      expect(notification.isRead).toBe(defaultRestoreDto.isRead);
      expect(notification.createdAt).toEqual(defaultRestoreDto.createdAt);
    });
  });

  describe('behavior methods', () => {
    let notification: Notification;

    beforeEach(() => {
      notification = Notification.restore({ ...defaultRestoreDto, isRead: false });
    });

    it('markAsRead() должен помечать уведомление прочитанным', () => {
      expect(notification.isRead).toBe(false);
      notification.markAsRead();
      expect(notification.isRead).toBe(true);
    });
  });

  describe('toPlain()', () => {
    it('должен возвращать плоский объект свойств уведомления', () => {
      const notification = Notification.restore(defaultRestoreDto);
      const plain = notification.toPlain();

      expect(plain).toEqual({
        id: defaultRestoreDto.id,
        userId: defaultRestoreDto.userId,
        title: defaultRestoreDto.title,
        text: defaultRestoreDto.text,
        isRead: defaultRestoreDto.isRead,
        createdAt: defaultRestoreDto.createdAt.toISOString(),
      });
    });
  });
});
