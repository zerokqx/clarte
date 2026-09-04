import { GRPC_CODES } from './codes.js';
import { GrpcError } from '../classes/grpc-class.js';

export interface GrpcSpecificErrorOptions {
  message?: string;
  details?: Record<string, unknown>;
}

type ErrorInput = GrpcSpecificErrorOptions | string;

function resolveOptions(
  input?: ErrorInput,
  maybeDetails?: Record<string, unknown>,
): GrpcSpecificErrorOptions | undefined {
  if (typeof input === 'string') {
    return { message: input, details: maybeDetails };
  }
  return input;
}

export class GrpcCancelledError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.CANCELLED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcUnknownError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.UNKNOWN,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcInvalidArgumentError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.INVALID_ARGUMENT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcDeadlineExceededError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.DEADLINE_EXCEEDED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcNotFoundError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.NOT_FOUND,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcAlreadyExistsError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.ALREADY_EXISTS,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcPermissionDeniedError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.PERMISSION_DENIED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcResourceExhaustedError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.RESOURCE_EXHAUSTED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcFailedPreconditionError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.FAILED_PRECONDITION,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcAbortedError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.ABORTED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcOutOfRangeError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.OUT_OF_RANGE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcUnimplementedError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.UNIMPLEMENTED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcInternalError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.INTERNAL,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcUnavailableError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.UNAVAILABLE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcDataLossError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.DATA_LOSS,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class GrpcUnauthenticatedError extends GrpcError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      code: GRPC_CODES.UNAUTHENTICATED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}
