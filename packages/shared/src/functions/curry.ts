/* eslint-disable @typescript-eslint/no-explicit-any */
export type Curry<Args extends unknown[], Return> = Args extends []
  ? () => Return
  : <PartialArgs extends unknown[]>(
      ...args: PartialArgs
    ) => PartialArgs extends []
      ? Curry<Args, Return>
      : Args extends [...PartialArgs, ...infer Remaining]
        ? Remaining extends []
          ? Return
          : Curry<Remaining, Return>
        : Return;

export function curry<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): Curry<Args, Return> {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args as any);
    }
    return function (this: any, ...nextArgs: any[]) {
      return curried.apply(this, args.concat(nextArgs));
    };
  } as unknown as Curry<Args, Return>;
}
