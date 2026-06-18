export type Prefix<
  T extends string,
  V extends string,
  Opt extends PrefixForEnvOption = object,
> = Opt['upperCase'] extends true ? Uppercase<`${T}${V}`> : `${T}${V}`;

export interface PrefixForEnvOption {
  upperCase?: boolean;
}

export const prefixForEnv =
  <T extends string, Opt extends PrefixForEnvOption>(
    prefix: T,
    options?: Opt,
  ) =>
  <V extends string>(value: V): Prefix<T, V, Opt> => {
    let valueWithPrefix = `${prefix}${value}`;
    if (options?.upperCase) valueWithPrefix = valueWithPrefix.toUpperCase();
    return valueWithPrefix as Prefix<T, V, Opt>;
  };
