import { describe, it, expect } from 'vitest';
import {
  color,
  primary,
  dark,
  gray,
  white,
  body,
  text,
  dimmed,
  error,
  placeholder,
  defaultBg,
  gradient,
  lightDark,
  alpha,
  themeGradient,
  curriedThemeGradient,
} from './index';

describe('colors helpers', () => {
  describe('color factory', () => {
    it('should create variable for primary color prefix correctly', () => {
      const customPrimary = color('primary-color', 'filled');
      expect(customPrimary()).toBe('var(--mantine-primary-color-filled)');
      expect(customPrimary(6)).toBe('var(--mantine-primary-color-6)');
    });

    it('should create variable for general colors correctly', () => {
      const customRed = color('red');
      expect(customRed()).toBe('var(--mantine-color-red)');
      expect(customRed(5)).toBe('var(--mantine-color-red-5)');
    });
  });

  describe('predefined colors', () => {
    it('should return correct variables', () => {
      expect(primary()).toBe('var(--mantine-primary-color-filled)');
      expect(primary(5)).toBe('var(--mantine-primary-color-5)');
      expect(dark()).toBe('var(--mantine-color-dark)');
      expect(dark(3)).toBe('var(--mantine-color-dark-3)');
      expect(gray()).toBe('var(--mantine-color-gray)');
      expect(white()).toBe('var(--mantine-color-white)');
      expect(body()).toBe('var(--mantine-color-body)');
      expect(text()).toBe('var(--mantine-color-text)');
      expect(dimmed()).toBe('var(--mantine-color-dimmed)');
      expect(error()).toBe('var(--mantine-color-error)');
      expect(placeholder()).toBe('var(--mantine-color-placeholder)');
      expect(defaultBg()).toBe('var(--mantine-color-default)');
    });
  });

  describe('gradient', () => {
    it('should format linear-gradient correctly', () => {
      const result = gradient('red')('to right')('blue');
      expect(result).toBe('linear-gradient(to right, red, blue)');
    });
  });

  describe('lightDark', () => {
    it('should format light-dark function correctly', () => {
      const result = lightDark('black')('white');
      expect(result).toBe('light-dark(black, white)');
    });
  });

  describe('alpha', () => {
    it('should format color-mix correctly', () => {
      const result = alpha('red')(0.15);
      expect(result).toBe('color-mix(in srgb, red 15%, transparent)');
    });
  });

  describe('themeGradient', () => {
    it('should format responsive gradient correctly', () => {
      const result = themeGradient({
        dir: 'to bottom',
        light: ['white', 'gray'],
        dark: ['black', 'darkgray'],
      });
      expect(result).toBe(
        'linear-gradient(to bottom, light-dark(white, black), light-dark(gray, darkgray))',
      );
    });
  });

  describe('curriedThemeGradient', () => {
    it('should format curried responsive gradient correctly', () => {
      const result = curriedThemeGradient('to bottom')(['white', 'gray'])(['black', 'darkgray']);
      expect(result).toBe(
        'linear-gradient(to bottom, light-dark(white, black), light-dark(gray, darkgray))',
      );
    });
  });
});
