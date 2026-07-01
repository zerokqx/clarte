import { MantineColor } from '@mantine/core';
import { Var, createVar } from '../types';

/**
 * Фабрика для создания хелперов цветов с поддержкой оттенков
 */
export const color = <T extends MantineColor, D extends string = ''>(name: T, defaultSuffix?: D) => {
  const prefix = name.startsWith('primary') ? 'mantine' : 'mantine-color';

  function getVar(): Var<D extends '' ? `${string}` : `${string}`>;
  function getVar<S extends number>(shade: S): Var<`${string}`>;
  function getVar(shade?: number) {
    if (shade !== undefined) {
      return createVar(`${prefix}-${name}-${shade}`);
    }
    return defaultSuffix
      ? createVar(`${prefix}-${name}-${defaultSuffix}`)
      : createVar(`${prefix}-${name}`);
  }
  return getVar;
};

// --- ЦВЕТОВЫЕ ХЕЛПЕРЫ ---
export const primary = color('primary-color', 'filled');
export const dark = color('dark');
export const gray = color('gray');

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

/**
 * Каррированный хелпер для создания полупрозрачных цветов через color-mix.
 * Принимает: цвет -> прозрачность (от 0 до 1).
 * Пример: alpha(primary(6))(0.15) ➡️ "color-mix(in srgb, var(--mantine-primary-color-6) 15%, transparent)"
 */
export function alpha<C extends string>(colorValue: C) {
  return function <A extends number>(
    opacity: A,
  ): `color-mix(in srgb, ${C} ${number}%, transparent)` {
    return `color-mix(in srgb, ${colorValue} ${opacity * 100}%, transparent)` as unknown as `color-mix(in srgb, ${C} ${number}%, transparent)`;
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
