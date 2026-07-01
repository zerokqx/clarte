
type Var<T extends string> = `var(--${T})`;
const createVar = <T extends string>(str: T): Var<T> => `var(--${str})`;

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

export const primary = color('primary-color');

export const white = () => createVar('mantine-color-white');

export const body = () => createVar('mantine-color-body');

