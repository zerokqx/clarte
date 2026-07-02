export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
export function curry<A, B, C, D, R>(
  fn: (a: A, b: B, c: C, d: D) => R,
): (a: A) => (b: B) => (c: C) => (d: D) => R;

export function curry(fn: (...args: any[]) => any) {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (this: any, ...nextArgs: any[]) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}
