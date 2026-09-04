import { DOMAIN_ERROR_KINDS } from './kinds.js';
import { DomainError } from '../classes/domain-class.js';

export interface DomainSpecificErrorOptions {
  message?: string;
  details?: Record<string, unknown>;
}

type ErrorInput = DomainSpecificErrorOptions | string;

function resolveOptions(
  input?: ErrorInput,
  maybeDetails?: Record<string, unknown>,
): DomainSpecificErrorOptions | undefined {
  if (typeof input === 'string') {
    return { message: input, details: maybeDetails };
  }
  return input;
}

export class EntityNotFoundError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.NOT_FOUND,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class AuthenticationError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.UNAUTHENTICATED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class AuthorizationError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.FORBIDDEN,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class ValidationError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.VALIDATION,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class ConflictError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.CONFLICT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class RateLimitError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.RATE_LIMIT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class BadRequestError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.BAD_REQUEST,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class TimeoutError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.TIMEOUT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class ServiceUnavailableError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.UNAVAILABLE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class InternalDomainError extends DomainError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      kind: DOMAIN_ERROR_KINDS.INTERNAL,
      message: opts?.message,
      details: opts?.details,
    });
  }
}
