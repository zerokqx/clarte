import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { type Response } from 'express';
import * as Enums from '@/enums';

export function extractProblemDetails(
  exception: any,
): Record<string, any> | null {
  try {
    const meta = exception?.metadata;
    const raw =
      meta?.get?.('problem-details') ||
      meta?.internalRepr?.get?.('problem-details') ||
      meta?.get?.('problem-details-bin') ||
      meta?.internalRepr?.get?.('problem-details-bin');

    const bufferOrString = Array.isArray(raw) ? raw[0] : raw;

    if (bufferOrString) {
      const jsonString = Buffer.isBuffer(bufferOrString)
        ? bufferOrString.toString('utf-8')
        : String(bufferOrString);
      return JSON.parse(jsonString);
    }
  } catch {
    // Fail silently on parsing errors
  }
  return null;
}

@Catch()
export class GrpcProblemDetailsExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const problemDetails = extractProblemDetails(exception);

    const status =
      problemDetails?.status ||
      exception.statusCode ||
      exception.status ||
      Enums.GrpcToHttpStatusMap[exception.code] ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      problemDetails ?? {
        statusCode: status,
        details: exception.details || exception.message,
      },
    );
  }
}
