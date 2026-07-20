import { isString } from 'radash';

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
