export type Var<T extends string> = `var(--${T})`;

export function createVar<T extends string>(str: T): Var<T> {
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

export type LengthVal<V extends CSSLength> = V extends number ? (V extends 0 ? '0' : `${V}px`) : V;
