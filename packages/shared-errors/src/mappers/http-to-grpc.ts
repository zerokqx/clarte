import { HTTP_CODES, type HttpCode } from '../http/codes.js';
import { GRPC_CODES, type GrpcCode } from '../grpc/codes.js';
import { HttpError, type PlainHttpError } from '../classes/http-class.js';
import { type PlainGrpcError } from '../classes/grpc-class.js';

export const HTTP_TO_GRPC_MAP: Partial<Record<HttpCode, GrpcCode>> = {
  [HTTP_CODES.OK]: GRPC_CODES.OK,
  [HTTP_CODES.CREATED]: GRPC_CODES.OK,
  [HTTP_CODES.ACCEPTED]: GRPC_CODES.OK,
  [HTTP_CODES.NO_CONTENT]: GRPC_CODES.OK,

  [HTTP_CODES.BAD_REQUEST]: GRPC_CODES.INVALID_ARGUMENT,
  [HTTP_CODES.UNAUTHORIZED]: GRPC_CODES.UNAUTHENTICATED,
  [HTTP_CODES.FORBIDDEN]: GRPC_CODES.PERMISSION_DENIED,
  [HTTP_CODES.NOT_FOUND]: GRPC_CODES.NOT_FOUND,
  [HTTP_CODES.METHOD_NOT_ALLOWED]: GRPC_CODES.UNIMPLEMENTED,
  [HTTP_CODES.REQUEST_TIMEOUT]: GRPC_CODES.DEADLINE_EXCEEDED,
  [HTTP_CODES.CONFLICT]: GRPC_CODES.ALREADY_EXISTS,
  [HTTP_CODES.PRECONDITION_FAILED]: GRPC_CODES.FAILED_PRECONDITION,
  [HTTP_CODES.PAYLOAD_TOO_LARGE]: GRPC_CODES.OUT_OF_RANGE,
  [HTTP_CODES.UNPROCESSABLE_ENTITY]: GRPC_CODES.INVALID_ARGUMENT,
  [HTTP_CODES.TOO_MANY_REQUESTS]: GRPC_CODES.RESOURCE_EXHAUSTED,

  [HTTP_CODES.INTERNAL_SERVER_ERROR]: GRPC_CODES.INTERNAL,
  [HTTP_CODES.NOT_IMPLEMENTED]: GRPC_CODES.UNIMPLEMENTED,
  [HTTP_CODES.BAD_GATEWAY]: GRPC_CODES.UNAVAILABLE,
  [HTTP_CODES.SERVICE_UNAVAILABLE]: GRPC_CODES.UNAVAILABLE,
  [HTTP_CODES.GATEWAY_TIMEOUT]: GRPC_CODES.DEADLINE_EXCEEDED,
} as const;

export function httpCodeToGrpcCode(code: HttpCode): GrpcCode {
  return HTTP_TO_GRPC_MAP[code] ?? GRPC_CODES.INTERNAL;
}

export function httpErrorToGrpcError(error: HttpError | PlainHttpError): PlainGrpcError {
  const obj: PlainHttpError = error.__type === 'class' ? error.toHttpError() : error;
  return {
    __type: 'plain',
    code: httpCodeToGrpcCode(obj.status),
    message: obj.message,
    details: obj.details,
  };
}
