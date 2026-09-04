import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { type Response } from 'express';
import { E } from '@clarte/shared';
import {
  DomainError,
  GrpcError,
  HttpError,
  HTTP_CODES,
  domainErrorToHttpError,
  grpcErrorToHttpError,
  grpcCodeToHttpCode,
  type GrpcCode,
} from '@clarte/shared-errors';

interface ExceptionWithMetadata {
  metadata?: unknown;
  code?: number;
  message?: string;
  details?: string | Record<string, unknown>;
}

function extractMetadataDetails(metadata: unknown): Record<string, unknown> | null {
  try {
    if (!metadata || typeof metadata !== 'object') {
      return null;
    }
    const getMeta = E.safeMetadataGrpcGetter(metadata);
    const raw =
      getMeta('error-details-bin') || getMeta('problem-details-bin') || getMeta('problem-details');
    const first = Array.isArray(raw) ? raw[0] : raw;

    if (first) {
      const jsonStr = Buffer.isBuffer(first) ? first.toString('utf-8') : String(first);
      return JSON.parse(jsonStr) as Record<string, unknown>;
    }
  } catch {
    // Fail silently on parsing errors
  }
  return null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let status: number = HTTP_CODES.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string) || exception.message;
        const rest = { ...resObj };
        delete rest.message;
        delete rest.statusCode;
        if (Object.keys(rest).length > 0) {
          details = rest;
        }
      }
    } else if (exception instanceof HttpError) {
      const plain = exception.toHttpError();
      status = plain.status;
      message = plain.message;
      details = plain.details;
    } else if (exception instanceof DomainError) {
      const plain = domainErrorToHttpError(exception);
      status = plain.status;
      message = plain.message;
      details = plain.details;
    } else if (exception instanceof GrpcError) {
      const plain = grpcErrorToHttpError(exception);
      status = plain.status;
      message = plain.message;
      details = plain.details;
    } else if (exception && typeof exception === 'object') {
      const grpcLike = exception as ExceptionWithMetadata;
      if (typeof grpcLike.code === 'number') {
        status = grpcCodeToHttpCode(grpcLike.code as GrpcCode);
      }
      if (typeof grpcLike.message === 'string') {
        message = grpcLike.message;
      }
      const metaDetails = extractMetadataDetails(grpcLike.metadata);
      if (metaDetails) {
        details = metaDetails;
      } else if (
        grpcLike.details &&
        typeof grpcLike.details === 'object' &&
        !Array.isArray(grpcLike.details)
      ) {
        details = grpcLike.details as Record<string, unknown>;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details ? { details } : {}),
    });
  }
}
