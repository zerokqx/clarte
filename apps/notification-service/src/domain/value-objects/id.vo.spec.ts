import { IdVo } from './id.vo';
import { IdInvalidException } from '../exceptions';

describe('IdVo', () => {
  describe('create()', () => {
    it('должен успешно создавать VO при валидном UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const vo = IdVo.create(validUuid);
      expect(vo.value).toBe(validUuid);
    });

    it('должен выбрасывать ошибку, если передан не UUID', () => {
      expect(() => IdVo.create('not-a-uuid')).toThrow(IdInvalidException);
      expect(() => IdVo.create('123e4567-e89b-12d3-a456-42661417400')).toThrow(IdInvalidException);
      expect(() => IdVo.create('')).toThrow(IdInvalidException);
    });
  });

  describe('restore()', () => {
    it('должен восстанавливать VO из строки без валидации', () => {
      const someId = 'restored-id';
      const vo = IdVo.restore(someId);
      expect(vo.value).toBe(someId);
    });
  });
});
