import { describe, it, expect } from 'vitest';
import { spacing, radius, fontSize, shadow, breakpoint, boxShadow, border } from './index';

describe('sizes helpers', () => {
  describe('theme sizes variables', () => {
    it('should format sizes variables correctly', () => {
      expect(spacing('md')).toBe('var(--mantine-spacing-md)');
      expect(radius('sm')).toBe('var(--mantine-radius-sm)');
      expect(fontSize('xl')).toBe('var(--mantine-font-size-xl)');
      expect(shadow('xs')).toBe('var(--mantine-shadow-xs)');
      expect(breakpoint('lg')).toBe('var(--mantine-breakpoint-lg)');
    });
  });

  describe('boxShadow', () => {
    it('should format box-shadow string correctly', () => {
      const result1 = boxShadow(0)(10)(20)('rgba(0,0,0,0.15)');
      expect(result1).toBe('0 10px 20px rgba(0,0,0,0.15)');

      const result2 = boxShadow('2rem')('10px')('5px')('black');
      expect(result2).toBe('2rem 10px 5px black');
    });
  });

  describe('border', () => {
    it('should format border string correctly', () => {
      const result1 = border(1)('solid')('gray');
      expect(result1).toBe('1px solid gray');

      const result2 = border('2rem')('dashed')('red');
      expect(result2).toBe('2rem dashed red');
    });
  });
});
