import { DOMAIN_ERROR_KINDS, type DomainErrorKind } from './kinds.js';

export const DOMAIN_MESSAGES: Record<DomainErrorKind, string> = {
  [DOMAIN_ERROR_KINDS.NOT_FOUND]: 'Entity not found',
  [DOMAIN_ERROR_KINDS.UNAUTHENTICATED]: 'Authentication credentials are required',
  [DOMAIN_ERROR_KINDS.FORBIDDEN]: 'Permission denied to perform this operation',
  [DOMAIN_ERROR_KINDS.VALIDATION]: 'Domain validation failed',
  [DOMAIN_ERROR_KINDS.CONFLICT]: 'Resource conflict or invariant violation',
  [DOMAIN_ERROR_KINDS.RATE_LIMIT]: 'Operation rate limit exceeded',
  [DOMAIN_ERROR_KINDS.BAD_REQUEST]: 'Invalid request parameters',
  [DOMAIN_ERROR_KINDS.TIMEOUT]: 'Operation timed out',
  [DOMAIN_ERROR_KINDS.UNAVAILABLE]: 'Service or dependency is currently unavailable',
  [DOMAIN_ERROR_KINDS.INTERNAL]: 'An unexpected domain error occurred',
} as const;
