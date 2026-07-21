import { CqrsRepoType, CrqsRepository } from '@/types';
import { Inject } from '@nestjs/common';

/**
 * @deprecated
 * */
export const mkRepoInject = (w: symbol | string, r: symbol | string) => (type: 'w' | 'r') =>
  Inject(type === 'w' ? w : r);

export type TypedInject<T> = (
  target: object,
  propertyKey: string | symbol | undefined,
  parameterIndex?: number,
) => void & { readonly __injectedType?: T };

export const mkRepoInjectV2 =
  <Repo extends CrqsRepository>(w: symbol | string, r: symbol | string) =>
  <Type extends CqrsRepoType>(type: Type): TypedInject<Repo[Type]> =>
    Inject(type === CqrsRepoType.w ? w : r) as unknown as TypedInject<Repo[Type]>;
