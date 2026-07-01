import {
  MantineBreakpoint,
  MantineFontSize,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
} from '@mantine/core';

type Var<T extends string> = `var(--${T})`;
const createVar = <T extends string>(str: T): Var<T> => `var(--${str})`;

// Типовые размеры Mantine
export type MantineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Фабрика для создания хелперов цветов с поддержкой оттенков
 */
export const color = <T extends string>(name: T) => {
  function getVar(): Var<`mantine-${T}`>;
  function getVar<S extends number>(shade: S): Var<`mantine-${T}-${S}`>;
  function getVar<S extends number>(shade?: S) {
    return shade ? createVar(`mantine-${name}-${shade}`) : createVar(`mantine-${name}`);
  }
  return getVar;
};

// --- ЦВЕТОВЫЕ ХЕЛПЕРЫ ---
export const primary = color('primary-color');
export const dark = color('dark');
export const gray = color('gray');

export const white = () => createVar('mantine-color-white');
export const body = () => createVar('mantine-color-body');
export const text = () => createVar('mantine-color-text');
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
  <F extends string>(fromColor: F) =>
  <D extends GradientDirection>(direction: D) =>
  <T extends string>(toColor: T): `linear-gradient(${D}, ${F}, ${T})` =>
    `linear-gradient(${direction}, ${fromColor}, ${toColor})`;

/**
 * Каррированный хелпер для создания CSS-функции light-dark(lightValue, darkValue).
 * Принимает: светлое значение -> темное значение.
 * Пример: lightDark('black')('white') ➡️ "light-dark(black, white)"
 */
export const lightDark =
  <L extends string>(lightColor: L) =>
  <D extends string>(darkColor: D): `light-dark(${L}, ${D})` =>
    `light-dark(${lightColor}, ${darkColor})`;


