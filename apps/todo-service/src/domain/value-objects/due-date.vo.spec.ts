import { DueDateVo } from './due-date.vo';
import { DateException } from '../exceptions';

describe('DueDateVo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create()', () => {
    it('должен успешно создавать VO при валидной дате (сегодня)', () => {
      const today = new Date('2024-01-01T23:59:59Z');
      const vo = DueDateVo.create(today);
      expect(vo.value).toEqual(today);
    });

    it('должен успешно создавать VO при валидной дате (будущее)', () => {
      const future = new Date('2024-01-02T12:00:00Z');
      const vo = DueDateVo.create(future);
      expect(vo.value).toEqual(future);
    });

    it('должен выбрасывать ошибку, если дата невалидна', () => {
      const invalidDate = new Date('invalid-date');
      expect(() => DueDateVo.create(invalidDate)).toThrow(DateException);
      expect(() => DueDateVo.create(invalidDate)).toThrow('Предоставлена невалидная дата.');
    });

    it('должен выбрасывать ошибку, если дата в прошлом', () => {
      const pastDate = new Date('2023-12-31T12:00:00Z');
      expect(() => DueDateVo.create(pastDate)).toThrow(DateException);
      expect(() => DueDateVo.create(pastDate)).toThrow('Дата выполнения не может быть в прошлом.');
    });

    it('должен выбрасывать ошибку, если дата слишком далеко в будущем (> 50 лет)', () => {
      const farFutureDate = new Date('2075-01-01T12:00:00Z');
      expect(() => DueDateVo.create(farFutureDate)).toThrow(DateException);
      expect(() => DueDateVo.create(farFutureDate)).toThrow('Дата выполнения находится слишком далеко в будущем.');
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из даты без валидации', () => {
      const someDate = new Date('2020-01-01T12:00:00Z');
      const vo = DueDateVo.restore(someDate);
      expect(vo.value).toEqual(someDate);
    });
  });
});
