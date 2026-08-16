import { LabelVo } from './label.vo';
import { InvalidLabel } from '../exceptions';

describe('LabelVo', () => {
  it('should successfully create LabelVo with valid string', () => {
    const vo = LabelVo.create('My Note');
    expect(vo.value).toBe('My Note');
  });

  it('should trim string on create', () => {
    const vo = LabelVo.create('   My Folder   ');
    expect(vo.value).toBe('My Folder');
  });

  it('should throw InvalidLabel when string is empty or whitespace', () => {
    expect(() => LabelVo.create('')).toThrow(InvalidLabel);
    expect(() => LabelVo.create('   ')).toThrow(InvalidLabel);
  });

  it('should restore LabelVo', () => {
    const vo = LabelVo.restore('Restored Label');
    expect(vo.value).toBe('Restored Label');
  });
});
