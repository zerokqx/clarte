import {
  MantineBreakpoint,
  MantineColor,
  MantineFontSize,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
} from '@mantine/core';

type Var<T extends string> = `var(--${T})`;
function createVar<T extends string>(str: T): Var<T> {
  return `var(--${str})`;
}

// Тип для CSS длины/размеров
export type CSSLength =
  | number
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}vh`
  | `${number}vw`
  | `${number}%`
  | '0'
  | 'auto';

/**
 * Фабрика для создания хелперов цветов с поддержкой оттенков
 */
export const color = <T extends string, D extends string = ''>(name: T, defaultSuffix?: D) => {
  function getVar(): Var<D extends '' ? `mantine-${T}` : `mantine-${T}-${D}`>;
  function getVar<S extends number>(shade: S): Var<`mantine-${T}-${S}`>;
  function getVar(shade?: number) {
    if (shade !== undefined) {
      return createVar(`mantine-${name}-${shade}`);
    }
    return defaultSuffix
      ? createVar(`mantine-${name}-${defaultSuffix}`)
      : createVar(`mantine-${name}`);
  }
  return getVar;
};

// --- ЦВЕТОВЫЕ ХЕЛПЕРЫ ---
export const primary = color('primary-color', 'filled');
export const dark = color('color-dark');
export const gray = color('color-gray');

export function white() {
  return createVar('mantine-color-white');
}
export function body() {
  return createVar('mantine-color-body');
}
export function text() {
  return createVar('mantine-color-text');
}
export function dimmed() {
  return createVar('mantine-color-dimmed');
}
export function error() {
  return createVar('mantine-color-error');
}
export function placeholder() {
  return createVar('mantine-color-placeholder');
}
export function defaultBg() {
  return createVar('mantine-color-default');
}

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

// Типы для направлений CSS градиентов
export type GradientDirection =
  | 'to top'
  | 'to bottom'
  | 'to left'
  | 'to right'
  | 'to top left'
  | 'to top right'
  | 'to bottom left'
  | 'to bottom right'
  | `${number}deg`
  | `${number}rad`
  | `${number}grad`
  | `${number}turn`;

/**
 * Каррированный хелпер для создания CSS linear-gradient
 * Принимает: цвет -> направление (to) -> цвет
 * Пример: gradient('red')('to right')('blue') ➡️ "linear-gradient(to right, red, blue)"
 */
export function gradient<F extends MantineColor | (string & {})>(fromColor: F) {
  return function <D extends GradientDirection>(direction: D) {
    return function <T extends MantineColor | (string & {})>(
      toColor: T,
    ): `linear-gradient(${D}, ${F}, ${T})` {
      return `linear-gradient(${direction}, ${fromColor}, ${toColor})`;
    };
  };
}

/**
 * Каррированный хелпер для создания CSS-функции light-dark(lightValue, darkValue).
 * Принимает: светлое значение -> темное значение.
 * Пример: lightDark('black')('white') ➡️ "light-dark(black, white)"
 */
export function lightDark<L extends MantineColor | (string & {})>(lightColor: L) {
  return function <D extends MantineColor | (string & {})>(darkColor: D): `light-dark(${L}, ${D})` {
    return `light-dark(${lightColor}, ${darkColor})`;
  };
}

type LengthVal<V extends CSSLength> = V extends number ? (V extends 0 ? '0' : `${V}px`) : V;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return `${format(x)} ${format(y)} ${format(blur)} ${color}` as any;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return `${format(width)} ${style} ${colorValue}` as any;
    };
  };
}

/**
 * Каррированный хелпер для создания полупрозрачных цветов через color-mix.
 * Принимает: цвет -> прозрачность (от 0 до 1).
 * Пример: alpha(primary(6))(0.15) ➡️ "color-mix(in srgb, var(--mantine-primary-color-6) 15%, transparent)"
 */
export function alpha<C extends string>(colorValue: C) {
  return function <A extends number>(
    opacity: A,
  ): `color-mix(in srgb, ${C} ${number}%, transparent)` {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `color-mix(in srgb, ${colorValue} ${opacity * 100}%, transparent)` as any;
  };
}

interface ThemeGradientArgs<
  D extends GradientDirection,
  FL extends string,
  TL extends string,
  FD extends string,
  TD extends string,
> {
  dir: D;
  light: [FL, TL];
  dark: [FD, TD];
}

/**
 * Упрощенный адаптивный хелпер для создания градиентов под светлую и темную темы.
 * Генерирует: linear-gradient(dir, light-dark(lightFrom, darkFrom), light-dark(lightTo, darkTo))
 */
export function themeGradient<
  D extends GradientDirection,
  FL extends string,
  TL extends string,
  FD extends string,
  TD extends string,
>({ dir, light, dark }: ThemeGradientArgs<D, FL, TL, FD, TD>) {
  const fromColor = lightDark(light[0])(dark[0]);
  const toColor = lightDark(light[1])(dark[1]);
  return gradient(fromColor)(dir)(toColor);
}

/**
 * Принимает: направление -> цвета светлой темы [from, to] -> цвета темной темы [from, to].
 * Пример: curriedThemeGradient('to bottom')([M.primary(0), M.dark(0)])([M.dark(8), M.dark(7)])
 */
export function curriedThemeGradient<D extends GradientDirection>(dir: D) {
  return function <FL extends string, TL extends string>(light: [FL, TL]) {
    return function <FD extends string, TD extends string>(dark: [FD, TD]) {
      const fromColor = lightDark(light[0])(dark[0]);
      const toColor = lightDark(light[1])(dark[1]);
      return gradient(fromColor)(dir)(toColor);
    };
  };
}
