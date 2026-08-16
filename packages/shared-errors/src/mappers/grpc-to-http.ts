import { GRPC_CODES, type GrpcCode } from '../grpc/codes.js';
import { HTTP_CODES, type HttpCode } from '../http/codes.js';
import { GrpcError, type PlainGrpcError } from '../classes/grpc-class.js';
import { type PlainHttpError } from '../classes/http-class.js';

export const GRPC_TO_HTTP_MAP: Record<GrpcCode, HttpCode> = {
  [GRPC_CODES.OK]: HTTP_CODES.OK,
  [GRPC_CODES.CANCELLED]: HTTP_CODES.REQUEST_TIMEOUT,
  [GRPC_CODES.UNKNOWN]: HTTP_CODES.INTERNAL_SERVER_ERROR,
  [GRPC_CODES.INVALID_ARGUMENT]: HTTP_CODES.BAD_REQUEST,
  [GRPC_CODES.DEADLINE_EXCEEDED]: HTTP_CODES.GATEWAY_TIMEOUT,
  [GRPC_CODES.NOT_FOUND]: HTTP_CODES.NOT_FOUND,
  [GRPC_CODES.ALREADY_EXISTS]: HTTP_CODES.CONFLICT,
  [GRPC_CODES.PERMISSION_DENIED]: HTTP_CODES.FORBIDDEN,
  [GRPC_CODES.RESOURCE_EXHAUSTED]: HTTP_CODES.TOO_MANY_REQUESTS,
  [GRPC_CODES.FAILED_PRECONDITION]: HTTP_CODES.PRECONDITION_FAILED,
  [GRPC_CODES.ABORTED]: HTTP_CODES.CONFLICT,
  [GRPC_CODES.OUT_OF_RANGE]: HTTP_CODES.BAD_REQUEST,
  [GRPC_CODES.UNIMPLEMENTED]: HTTP_CODES.NOT_IMPLEMENTED,
  [GRPC_CODES.INTERNAL]: HTTP_CODES.INTERNAL_SERVER_ERROR,
  [GRPC_CODES.UNAVAILABLE]: HTTP_CODES.SERVICE_UNAVAILABLE,
  [GRPC_CODES.DATA_LOSS]: HTTP_CODES.INTERNAL_SERVER_ERROR,
  [GRPC_CODES.UNAUTHENTICATED]: HTTP_CODES.UNAUTHORIZED,
} as const;

export function grpcCodeToHttpCode(code: GrpcCode): HttpCode {
  return GRPC_TO_HTTP_MAP[code] ?? HTTP_CODES.INTERNAL_SERVER_ERROR;
}

export function grpcErrorToHttpError(error: GrpcError | PlainGrpcError): PlainHttpError {
  const obj: PlainGrpcError = error.__type === 'class' ? error.toGrpcError() : error;
  return {
    __type: 'plain',
    status: grpcCodeToHttpCode(obj.code),
    message: obj.message,
    details: obj.details,
  };
}
