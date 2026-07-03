import { describe, it, expect } from 'vitest';
import { createVar } from './types';

describe('types helpers', () => {
  describe('createVar', () => {
    it('should format variable name to var(--name)', () => {
      expect(createVar('my-variable')).toBe('var(--my-variable)');
    });
  });
});
