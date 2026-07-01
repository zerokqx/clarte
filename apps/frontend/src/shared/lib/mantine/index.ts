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
    return shade
      ? createVar(`mantine-${name}-${shade}`)
      : createVar(`mantine-${name}`);
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
export const spacing = <T extends MantineSize>(size: T) => createVar(`mantine-spacing-${size}`);
export const radius = <T extends MantineSize>(size: T) => createVar(`mantine-radius-${size}`);
export const fontSize = <T extends MantineSize>(size: T) => createVar(`mantine-font-size-${size}`);
export const shadow = <T extends MantineSize>(size: T) => createVar(`mantine-shadow-${size}`);
