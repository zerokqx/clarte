import { describe, it, expect } from 'vitest';
import { media } from './index';

describe('media helper', () => {
  it('should format media query correctly', () => {
    const result = media('max-width')('48em');
    expect(result).toBe('(max-width: 48em)');
  });
});
