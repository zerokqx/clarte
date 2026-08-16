import { DOMAIN_ERROR_KINDS, type DomainErrorKind } from '../domain/kinds.js';
import { HTTP_CODES, type HttpCode } from '../http/codes.js';
import { DomainError, type PlainDomainError } from '../classes/domain-class.js';
import { type PlainHttpError } from '../classes/http-class.js';

export const DOMAIN_TO_HTTP_MAP: Record<DomainErrorKind, HttpCode> = {
  [DOMAIN_ERROR_KINDS.NOT_FOUND]: HTTP_CODES.NOT_FOUND,
  [DOMAIN_ERROR_KINDS.UNAUTHENTICATED]: HTTP_CODES.UNAUTHORIZED,
  [DOMAIN_ERROR_KINDS.FORBIDDEN]: HTTP_CODES.FORBIDDEN,
  [DOMAIN_ERROR_KINDS.VALIDATION]: HTTP_CODES.UNPROCESSABLE_ENTITY,
  [DOMAIN_ERROR_KINDS.CONFLICT]: HTTP_CODES.CONFLICT,
  [DOMAIN_ERROR_KINDS.RATE_LIMIT]: HTTP_CODES.TOO_MANY_REQUESTS,
  [DOMAIN_ERROR_KINDS.BAD_REQUEST]: HTTP_CODES.BAD_REQUEST,
  [DOMAIN_ERROR_KINDS.TIMEOUT]: HTTP_CODES.GATEWAY_TIMEOUT,
  [DOMAIN_ERROR_KINDS.UNAVAILABLE]: HTTP_CODES.SERVICE_UNAVAILABLE,
  [DOMAIN_ERROR_KINDS.INTERNAL]: HTTP_CODES.INTERNAL_SERVER_ERROR,
} as const;

export function domainKindToHttpCode(kind: DomainErrorKind): HttpCode {
  return DOMAIN_TO_HTTP_MAP[kind] ?? HTTP_CODES.INTERNAL_SERVER_ERROR;
}

export function domainErrorToHttpError(error: DomainError | PlainDomainError): PlainHttpError {
  const obj: PlainDomainError = error.__type === 'class' ? error.toDomainError() : error;
  return {
    __type: 'plain',
    status: domainKindToHttpCode(obj.kind),
    message: obj.message,
    details: obj.details,
  };
}
