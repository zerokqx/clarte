// Базовые константы макета для конвертации
const BASE_WIDTH = 1440;
const BASE_HEIGHT = 900;
const BASE_FONT_SIZE = 16;

/**
 * Конвертирует пиксели в rem на основе базового шрифта (16px)
 * Пример: rem(16) ➡️ "1rem"
 */
export const rem = (px: number): `${number}rem` => {
  return `${px / BASE_FONT_SIZE}rem`;
};

/**
 * Конвертирует пиксели в em на основе базового шрифта (16px)
 * Пример: em(16) ➡️ "1em"
 */
export const em = (px: number): `${number}em` => {
  return `${px / BASE_FONT_SIZE}em`;
};

/**
 * Конвертирует пиксели макета в vw (viewport width) относительно базовой ширины (1440px)
 * Пример: vw(144) ➡️ "10vw"
 */
export const vw = (px: number, baseWidth = BASE_WIDTH): `${number}vw` => {
  return `${(px / baseWidth) * 100}vw`;
};

/**
 * Конвертирует пиксели макета в vh (viewport height) относительно базовой высоты (900px)
 * Пример: vh(90) ➡️ "10vh"
 */
export const vh = (px: number, baseHeight = BASE_HEIGHT): `${number}vh` => {
  return `${(px / baseHeight) * 100}vh`;
};

/**
 * Конвертирует число в строковое представление px
 * Пример: px(15) ➡️ "15px", px(0) ➡️ "0"
 */
export const px = (value: number): '0' | `${number}px` => {
  return value === 0 ? '0' : `${value}px`;
};
