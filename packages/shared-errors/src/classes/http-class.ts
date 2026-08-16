import { type HttpCode } from '../http/codes.js';
import { HTTP_MESSAGES } from '../http/messages.js';

export interface PlainHttpError {
  readonly __type: 'plain';
  status: HttpCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface HttpErrorOptions {
  status: HttpCode;
  message?: string;
  details?: Record<string, unknown>;
}

export class HttpError extends Error {
  public readonly __type = 'class' as const;
  public readonly status: HttpCode;
  public readonly details?: Record<string, unknown>;

  constructor(options: HttpErrorOptions) {
    const resolvedMessage =
      options.message ?? HTTP_MESSAGES[options.status] ?? 'Unknown HTTP error';
    super(resolvedMessage);

    this.name = this.constructor.name;
    this.status = options.status;
    this.details = options.details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toHttpError(): PlainHttpError {
    return {
      __type: 'plain',
      status: this.status,
      message: this.message,
      details: this.details,
    };
  }
}
