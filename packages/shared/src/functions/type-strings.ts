import { isString } from 'radash';
import { Join, If } from 'type-fest';
import { AndOtherString, NotNullString } from '../types';
import { ToBool } from '../types/bool';

type HostValues = 'localhost' | (string & {});
export type Url<
  Host extends HostValues,
  Port extends number | string,
  Protocol extends string = 'http',
> = `${Protocol}://${Host}:${Port}`;

export const url =
  <Protocol extends string>(protocol: Protocol) =>
  <Host extends HostValues, Port extends number | string>(
    host: Host,
    port: Port,
  ): Url<Host, Port, Protocol> =>
    `${protocol}://${host}:${(isString(port) ? parseInt(port, 10) : port) as Port}`;

export const http = url('http');
export const grpc = url('grpc');
export const ws = url('ws');
export const https = url('https');

const suffix =
  <S extends string, A extends string[]>(suffix: S) =>
  (...args: A) =>
    `${args.join('.')}.${suffix}` as `${Join<A, '.'>}.${S}`;

export const exchange = suffix('exchange');
export const queue = suffix('queue');

export const proto = <T extends string>(name: T): `${T}.proto` => `${name}.proto`;

type Repeat<
  T extends string,
  N extends number,
  Acc extends unknown[] = [],
> = Acc['length'] extends N ? '' : `${T}${Repeat<T, N, [...Acc, unknown]>}`;

export const p = <N extends number>(num: N): Repeat<'../', N> => {
  return '../'.repeat(Math.max(0, num)) as Repeat<'../', N>;
};

export const hostPort = <H extends HostValues, P extends number | string>(host: H, port: P) =>
  `${host}:${port}` as `${H}:${P}`;

export const sslKey = <T extends 'private' | 'public'>(type: T) => `${type}.key` as `${T}.key`;

export type EnvSuffix = AndOtherString<'local' | 'dev' | 'prod'>;

export type EnvString<Suffix extends EnvSuffix> = If<
  ToBool<NotNullString<Suffix>>,
  `.env.${Suffix}`,
  '.env'
>;

export const env = <S extends EnvSuffix>(suffix?: S): EnvString<S> =>
  `.env${suffix ? `.${suffix}` : ''}` as EnvString<S>;
