import { describe, it, expect } from 'vitest';
import { prefixForEnv } from './prefix-for-env';

describe('prefixForEnv helper', () => {
  it('should prefix values correctly', () => {
    const prefixer = prefixForEnv('TEST_');
    expect(prefixer('value')).toBe('TEST_value');
  });

  it('should uppercase values if upperCase option is set to true', () => {
    const prefixer = prefixForEnv('test_', { upperCase: true });
    expect(prefixer('value')).toBe('TEST_VALUE');
  });
});
