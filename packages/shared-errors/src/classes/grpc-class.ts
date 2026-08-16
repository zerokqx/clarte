import { type GrpcCode } from '../grpc/codes.js';
import { GRPC_MESSAGES } from '../grpc/messages.js';

export interface PlainGrpcError {
  readonly __type: 'plain';
  code: GrpcCode;
  message: string;
  details?: Record<string, unknown>;
}

export type PlainRpcError = PlainGrpcError;

export interface GrpcErrorOptions {
  code: GrpcCode;
  message?: string;
  details?: Record<string, unknown>;
}

export class GrpcError extends Error {
  public readonly __type = 'class' as const;
  public readonly code: GrpcCode;
  public readonly details?: Record<string, unknown>;

  constructor(options: GrpcErrorOptions) {
    const resolvedMessage = options.message ?? GRPC_MESSAGES[options.code] ?? 'Unknown gRPC error';
    super(resolvedMessage);

    this.name = this.constructor.name;
    this.code = options.code;
    this.details = options.details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toGrpcError(): PlainGrpcError {
    return {
      __type: 'plain',
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
