import { DOMAIN_ERROR_KINDS, type DomainErrorKind } from '../domain/kinds.js';
import { GRPC_CODES, type GrpcCode } from '../grpc/codes.js';
import { DomainError, type PlainDomainError } from '../classes/domain-class.js';
import { type PlainGrpcError } from '../classes/grpc-class.js';

export const DOMAIN_TO_GRPC_MAP: Record<DomainErrorKind, GrpcCode> = {
  [DOMAIN_ERROR_KINDS.NOT_FOUND]: GRPC_CODES.NOT_FOUND,
  [DOMAIN_ERROR_KINDS.UNAUTHENTICATED]: GRPC_CODES.UNAUTHENTICATED,
  [DOMAIN_ERROR_KINDS.FORBIDDEN]: GRPC_CODES.PERMISSION_DENIED,
  [DOMAIN_ERROR_KINDS.VALIDATION]: GRPC_CODES.INVALID_ARGUMENT,
  [DOMAIN_ERROR_KINDS.CONFLICT]: GRPC_CODES.ALREADY_EXISTS,
  [DOMAIN_ERROR_KINDS.RATE_LIMIT]: GRPC_CODES.RESOURCE_EXHAUSTED,
  [DOMAIN_ERROR_KINDS.BAD_REQUEST]: GRPC_CODES.INVALID_ARGUMENT,
  [DOMAIN_ERROR_KINDS.TIMEOUT]: GRPC_CODES.DEADLINE_EXCEEDED,
  [DOMAIN_ERROR_KINDS.UNAVAILABLE]: GRPC_CODES.UNAVAILABLE,
  [DOMAIN_ERROR_KINDS.INTERNAL]: GRPC_CODES.INTERNAL,
} as const;

export function domainKindToGrpcCode(kind: DomainErrorKind): GrpcCode {
  return DOMAIN_TO_GRPC_MAP[kind] ?? GRPC_CODES.INTERNAL;
}

export function domainErrorToGrpcError(error: DomainError | PlainDomainError): PlainGrpcError {
  const obj: PlainDomainError = error.__type === 'class' ? error.toDomainError() : error;
  return {
    __type: 'plain',
    code: domainKindToGrpcCode(obj.kind),
    message: obj.message,
    details: obj.details,
  };
}
