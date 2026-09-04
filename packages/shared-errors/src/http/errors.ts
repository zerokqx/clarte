import { HTTP_CODES } from './codes.js';
import { HttpError } from '../classes/http-class.js';

export interface HttpSpecificErrorOptions {
  message?: string;
  details?: Record<string, unknown>;
}

type ErrorInput = HttpSpecificErrorOptions | string;

function resolveOptions(
  input?: ErrorInput,
  maybeDetails?: Record<string, unknown>,
): HttpSpecificErrorOptions | undefined {
  if (typeof input === 'string') {
    return { message: input, details: maybeDetails };
  }
  return input;
}

// 4xx Client Errors
export class HttpBadRequestError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.BAD_REQUEST,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.UNAUTHORIZED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpPaymentRequiredError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.PAYMENT_REQUIRED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.FORBIDDEN,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.NOT_FOUND,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpMethodNotAllowedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.METHOD_NOT_ALLOWED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpNotAcceptableError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.NOT_ACCEPTABLE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpProxyAuthenticationRequiredError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.PROXY_AUTHENTICATION_REQUIRED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpRequestTimeoutError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.REQUEST_TIMEOUT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpConflictError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.CONFLICT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpGoneError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.GONE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpLengthRequiredError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.LENGTH_REQUIRED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpPreconditionFailedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.PRECONDITION_FAILED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpPayloadTooLargeError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.PAYLOAD_TOO_LARGE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUriTooLongError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.URI_TOO_LONG,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUnsupportedMediaTypeError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.UNSUPPORTED_MEDIA_TYPE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpRangeNotSatisfiableError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.RANGE_NOT_SATISFIABLE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpExpectationFailedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.EXPECTATION_FAILED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpIAmATeapotError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.I_AM_A_TEAPOT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpMisdirectedRequestError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.MISDIRECTED_REQUEST,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUnprocessableEntityError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.UNPROCESSABLE_ENTITY,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpLockedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.LOCKED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpFailedDependencyError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.FAILED_DEPENDENCY,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpTooEarlyError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.TOO_EARLY,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUpgradeRequiredError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.UPGRADE_REQUIRED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpPreconditionRequiredError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.PRECONDITION_REQUIRED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpTooManyRequestsError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.TOO_MANY_REQUESTS,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpRequestHeaderFieldsTooLargeError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpUnavailableForLegalReasonsError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.UNAVAILABLE_FOR_LEGAL_REASONS,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

// 5xx Server Errors
export class HttpInternalServerError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpNotImplementedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.NOT_IMPLEMENTED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpBadGatewayError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.BAD_GATEWAY,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpServiceUnavailableError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.SERVICE_UNAVAILABLE,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpGatewayTimeoutError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.GATEWAY_TIMEOUT,
      message: opts?.message,
      details: opts?.details,
    });
  }
}

export class HttpVersionNotSupportedError extends HttpError {
  constructor(options?: ErrorInput, details?: Record<string, unknown>) {
    const opts = resolveOptions(options, details);
    super({
      status: HTTP_CODES.HTTP_VERSION_NOT_SUPPORTED,
      message: opts?.message,
      details: opts?.details,
    });
  }
}
