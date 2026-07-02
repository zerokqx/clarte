import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';
import * as Enums from './enums/status-map.enum';
import { E } from '@clarte/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractProblemDetails(exception: unknown): Record<string, any> | null {
  try {
    if (!exception || typeof exception !== 'object') {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = (exception as any).metadata;
    const getMeta = E.safeMetadataGrpcGetter(metadata);
    const raw = getMeta('problem-details') || getMeta('problem-details-bin');

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
