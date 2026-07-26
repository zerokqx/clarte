import { isString } from 'radash';
import { Join } from 'type-fest';

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
