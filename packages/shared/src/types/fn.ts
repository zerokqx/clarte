/* eslint-disable @typescript-eslint/no-explicit-any */
export type Fn<A extends any[] = [], R = any> = (...args: A) => R;

export type NonNullReturn<F extends Fn<any[], any>> = NonNullable<ReturnType<F>>;
