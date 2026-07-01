import {
  MantineBreakpoint,
  MantineColor,
  MantineFontSize,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
} from '@mantine/core';

type Var<T extends string> = `var(--${T})`;
const createVar = <T extends string>(str: T): Var<T> => `var(--${str})`;

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
  function getVar<S extends number>(shade?: S) {
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

export const white = () => createVar('mantine-color-white');
export const body = () => createVar('mantine-color-body');
export const text = () => createVar('mantine-color-text');
export const dimmed = () => createVar('mantine-color-dimmed');
export const error = () => createVar('mantine-color-error');
export const placeholder = () => createVar('mantine-color-placeholder');
export const defaultBg = () => createVar('mantine-color-default'); // Фоновый цвет по умолчанию (карточки, инпуты)

// --- ХЕЛПЕРЫ РАЗМЕРОВ И ГРАФИКИ ---
export const spacing = <T extends MantineSpacing>(size: T) => createVar(`mantine-spacing-${size}`);
export const radius = <T extends MantineRadius>(size: T) => createVar(`mantine-radius-${size}`);
export const fontSize = <T extends MantineFontSize>(size: T) =>
  createVar(`mantine-font-size-${size}`);
export const shadow = <T extends MantineShadow>(size: T) => createVar(`mantine-shadow-${size}`);
export const breakpoint = <T extends MantineBreakpoint>(size: T) =>
  createVar(`mantine-breakpoint-${size}`);

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
export const gradient =
  <F extends MantineColor | (string & {})>(fromColor: F) =>
  <D extends GradientDirection>(direction: D) =>
  <T extends MantineColor | (string & {})>(toColor: T): `linear-gradient(${D}, ${F}, ${T})` =>
    `linear-gradient(${direction}, ${fromColor}, ${toColor})`;

/**
 * Каррированный хелпер для создания CSS-функции light-dark(lightValue, darkValue).
 * Принимает: светлое значение -> темное значение.
 * Пример: lightDark('black')('white') ➡️ "light-dark(black, white)"
 */
export const lightDark =
  <L extends MantineColor | (string & {})>(lightColor: L) =>
  <D extends MantineColor | (string & {})>(darkColor: D): `light-dark(${L}, ${D})` =>
    `light-dark(${lightColor}, ${darkColor})`;

type LengthVal<V extends CSSLength> = V extends number ? (V extends 0 ? '0' : `${V}px`) : V;

/**
 * Каррированный хелпер для создания кастомных CSS box-shadow.
 * Принимает: offset-x -> offset-y -> blur-radius (и опционально spread) -> color.
 * Пример: boxShadow(0)(10)(20)('rgba(0,0,0,0.15)') ➡️ "0 10px 20px rgba(0,0,0,0.15)"
 */
export const boxShadow =
  <X extends CSSLength>(x: X) =>
  <Y extends CSSLength>(y: Y) =>
  <B extends CSSLength>(blur: B) =>
  <C extends MantineColor | (string & {})>(
    color: C,
  ): `${LengthVal<X>} ${LengthVal<Y>} ${LengthVal<B>} ${C}` => {
    const format = (val: CSSLength) => {
      if (val === 0) return '0';
      return typeof val === 'number' ? `${val}px` : val;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${format(x)} ${format(y)} ${format(blur)} ${color}` as any;
  };

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
export const border =
  <W extends CSSLength>(width: W) =>
  <S extends BorderStyle>(style: S) =>
  <C extends MantineColor | (string & {})>(colorValue: C): `${LengthVal<W>} ${S} ${C}` => {
    const format = (val: CSSLength) => {
      if (val === 0) return '0';
      return typeof val === 'number' ? `${val}px` : val;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${format(width)} ${style} ${colorValue}` as any;
  };

/**
 * Каррированный хелпер для создания полупрозрачных цветов через color-mix.
 * Принимает: цвет -> прозрачность (от 0 до 1).
 * Пример: alpha(primary(6))(0.15) ➡️ "color-mix(in srgb, var(--mantine-primary-color-6) 15%, transparent)"
 */
export const alpha =
  <C extends string>(colorValue: C) =>
  <A extends number>(opacity: A): `color-mix(in srgb, ${C} ${number}%, transparent)` => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `color-mix(in srgb, ${colorValue} ${opacity * 100}%, transparent)` as any;
  };

interface ThemeGradientArgs<
  D extends GradientDirection,
  FL extends string,
  TL extends string,
  FD extends string,
  TD extends string
> {
  dir: D;
  light: [FL, TL];
  dark: [FD, TD];
}

/**
 * Упрощенный адаптивный хелпер для создания градиентов под светлую и темную темы.
 * Генерирует: linear-gradient(dir, light-dark(lightFrom, darkFrom), light-dark(lightTo, darkTo))
 */
export const themeGradient = <
  D extends GradientDirection,
  FL extends string,
  TL extends string,
  FD extends string,
  TD extends string
>({
  dir,
  light,
  dark,
}: ThemeGradientArgs<D, FL, TL, FD, TD>) => {
  const fromColor = lightDark(light[0])(dark[0]);
  const toColor = lightDark(light[1])(dark[1]);
  return gradient(fromColor)(dir)(toColor);
};

