import { describe, it, expect, vi } from 'vitest';
import { useBreakpoint, useBreakpointMediaQuery } from './index';

// Mock @mantine/core and @mantine/hooks
vi.mock('@mantine/core', () => ({
  useMantineTheme: vi.fn(() => ({
    breakpoints: {
      xs: '36em',
      sm: '48em',
      md: '62em',
      lg: '75em',
      xl: '88em',
    },
  })),
}));

vi.mock('@mantine/hooks', () => ({
  useMediaQuery: vi.fn((query) => `mocked-query-result-for-${query}`),
}));

describe('hooks helpers', () => {
  describe('useBreakpoint', () => {
    it('should return correct breakpoint value from theme', () => {
      const value = useBreakpoint('md');
      expect(value).toBe('62em');
    });
  });

  describe('useBreakpointMediaQuery', () => {
    it('should call useMediaQuery with formatted query string', () => {
      const result = useBreakpointMediaQuery('max-width', 'sm');
      // breakpoint 'sm' is '48em'
      // media('max-width')('48em') => '(max-width: 48em)'
      expect(result).toBe('mocked-query-result-for-(max-width: 48em)');
    });
  });
});
