import { type DomainErrorKind } from '../domain/kinds.js';
import { DOMAIN_MESSAGES } from '../domain/messages.js';

export interface PlainDomainError {
  readonly __type: 'plain';
  kind: DomainErrorKind;
  message: string;
  details?: Record<string, unknown>;
}

export interface DomainErrorOptions {
  kind: DomainErrorKind;
  message?: string;
  details?: Record<string, unknown>;
}

export class DomainError extends Error {
  public readonly __type = 'class' as const;
  public readonly kind: DomainErrorKind;
  public readonly details?: Record<string, unknown>;

  constructor(options: DomainErrorOptions) {
    const resolvedMessage =
      options.message ?? DOMAIN_MESSAGES[options.kind] ?? 'Unknown domain error';
    super(resolvedMessage);

    this.name = this.constructor.name;
    this.kind = options.kind;
    this.details = options.details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toDomainError(): PlainDomainError {
    return {
      __type: 'plain',
      kind: this.kind,
      message: this.message,
      details: this.details,
    };
  }
}
