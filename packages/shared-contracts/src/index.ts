import * as getProtoPathFn from './functions/get-proto-path';
export * as Contracts from './ports';
export const Fn = {
  ...getProtoPathFn,
};
export type { IJwtKeyProvider } from './ports/interfaces/jwt-key-provider.interface';
