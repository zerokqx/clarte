import { Fn, NonNullReturn } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nullThrow = <F extends Fn<any[], any>>(fn: F, msg?: string) => {
  return (...args: Parameters<F>): NonNullReturn<F> => {
    const res = fn(...args);
    if (res == null || res === undefined) throw new Error(msg ?? 'Result is null or undefined');
    return res as NonNullReturn<F>;
  };
};
