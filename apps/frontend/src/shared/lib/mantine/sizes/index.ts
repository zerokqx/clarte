import {
  MantineBreakpoint,
  MantineColor,
  MantineFontSize,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
} from '@mantine/core';
import { createVar, CSSLength, LengthVal } from '../types';

// --- ХЕЛПЕРЫ РАЗМЕРОВ И ГРАФИКИ ---
export function spacing<T extends MantineSpacing>(size: T) {
  return createVar(`mantine-spacing-${size}`);
}
export function radius<T extends MantineRadius>(size: T) {
  return createVar(`mantine-radius-${size}`);
}
export function fontSize<T extends MantineFontSize>(size: T) {
  return createVar(`mantine-font-size-${size}`);
}
export function shadow<T extends MantineShadow>(size: T) {
  return createVar(`mantine-shadow-${size}`);
}
export function breakpoint<T extends MantineBreakpoint>(size: T) {
  return createVar(`mantine-breakpoint-${size}`);
}

/**
 * Каррированный хелпер для создания кастомных CSS box-shadow.
 * Принимает: offset-x -> offset-y -> blur-radius (и опционально spread) -> color.
 * Пример: boxShadow(0)(10)(20)('rgba(0,0,0,0.15)') ➡️ "0 10px 20px rgba(0,0,0,0.15)"
 */
export function boxShadow<X extends CSSLength>(x: X) {
  return function <Y extends CSSLength>(y: Y) {
    return function <B extends CSSLength>(blur: B) {
      return function <C extends MantineColor | (string & {})>(
        color: C,
      ): `${LengthVal<X>} ${LengthVal<Y>} ${LengthVal<B>} ${C}` {
        function format(val: CSSLength) {
          if (val === 0) return '0';
          return typeof val === 'number' ? `${val}px` : val;
        }
        return `${format(x)} ${format(y)} ${format(blur)} ${color}` as unknown as `${LengthVal<X>} ${LengthVal<Y>} ${LengthVal<B>} ${C}`;
      };
    };
  };
}

// Стили обводки CSS
export type BorderStyle =
  | 'none'
  | 'hidden'
  | 'dotted'
  | 'dashed'
  | 'solid'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset';

/**
 * Каррированный хелпер для создания кастомных CSS border.
 * Принимает: толщина -> стиль -> цвет.
 * Пример: border(1)('solid')(gray(3)) ➡️ "1px solid var(--mantine-gray-3)"
 */
export function border<W extends CSSLength>(width: W) {
  return function <S extends BorderStyle>(style: S) {
    return function <C extends MantineColor | (string & {})>(
      colorValue: C,
    ): `${LengthVal<W>} ${S} ${C}` {
      function format(val: CSSLength) {
        if (val === 0) return '0';
        return typeof val === 'number' ? `${val}px` : val;
      }
      return `${format(width)} ${style} ${colorValue}` as unknown as `${LengthVal<W>} ${S} ${C}`;
    };
  };
}
