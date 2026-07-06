import { describe, it, expect } from 'vitest';
import { curry } from './curry';

describe('curry helper', () => {
  it('should curry a 2-argument function', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);

    expect(curriedAdd(2)(3)).toBe(5);
    expect(curriedAdd(2, 3)).toBe(5);
  });

  it('should curry a 3-argument function', () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curriedSum = curry(sum);

    expect(curriedSum(1)(2)(3)).toBe(6);
    expect(curriedSum(1, 2)(3)).toBe(6);
    expect(curriedSum(1)(2, 3)).toBe(6);
    expect(curriedSum(1, 2, 3)).toBe(6);
  });

  it('should support currying functions with no arguments', () => {
    const getConst = () => 42;
    const curriedGetConst = curry(getConst);

    expect(curriedGetConst()).toBe(42);
  });
});
