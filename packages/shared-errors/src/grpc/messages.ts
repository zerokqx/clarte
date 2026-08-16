import { GRPC_CODES, type GrpcCode } from './codes.js';

export const GRPC_MESSAGES: Record<GrpcCode, string> = {
  [GRPC_CODES.OK]: 'OK',
  [GRPC_CODES.CANCELLED]: 'The operation was cancelled',
  [GRPC_CODES.UNKNOWN]: 'Unknown error',
  [GRPC_CODES.INVALID_ARGUMENT]: 'Client specified an invalid argument',
  [GRPC_CODES.DEADLINE_EXCEEDED]: 'Deadline expired before operation could complete',
  [GRPC_CODES.NOT_FOUND]: 'Requested entity was not found',
  [GRPC_CODES.ALREADY_EXISTS]: 'The entity that a client attempted to create already exists',
  [GRPC_CODES.PERMISSION_DENIED]:
    'The caller does not have permission to execute the specified operation',
  [GRPC_CODES.RESOURCE_EXHAUSTED]: 'Some resource has been exhausted',
  [GRPC_CODES.FAILED_PRECONDITION]:
    'Operation was rejected because the system is not in a state required for the operation execution',
  [GRPC_CODES.ABORTED]: 'The operation was aborted',
  [GRPC_CODES.OUT_OF_RANGE]: 'Operation was attempted past the valid range',
  [GRPC_CODES.UNIMPLEMENTED]:
    'Operation is not implemented or not supported/enabled in this service',
  [GRPC_CODES.INTERNAL]: 'Internal server error',
  [GRPC_CODES.UNAVAILABLE]: 'The service is currently unavailable',
  [GRPC_CODES.DATA_LOSS]: 'Unrecoverable data loss or corruption',
  [GRPC_CODES.UNAUTHENTICATED]:
    'The request does not have valid authentication credentials for the operation',
} as const;
