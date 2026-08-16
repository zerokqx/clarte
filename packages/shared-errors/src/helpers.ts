import { GrpcError, PlainGrpcError } from './classes/grpc-class.js';
import { HttpError } from './classes/http-class.js';

export function clearType<T extends GrpcError | PlainGrpcError | HttpError | PlainGrpcError>(
  error: T,
): Omit<T, '__type'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __type, ...rest } = error;
  return rest;
}
