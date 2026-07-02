import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';
import * as Enums from './enums/status-map.enum';
import { E } from '@clarte/shared';

interface ProblemDetails {
  status?: number;
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

interface ExceptionWithMetadata {
  metadata?: unknown;
}

interface ExceptionWithStatusAndDetails {
  statusCode?: number;
  status?: number;
  code?: number;
  details?: string;
  message?: string;
}

export function extractProblemDetails(exception: unknown): ProblemDetails | null {
  try {
    if (!exception || typeof exception !== 'object') {
      return null;
    }

    const metadata = (exception as ExceptionWithMetadata).metadata;
    const getMeta = E.safeMetadataGrpcGetter(metadata);
    const raw = getMeta('problem-details') || getMeta('problem-details-bin');

    const bufferOrString = Array.isArray(raw) ? raw[0] : raw;

    if (bufferOrString) {
      const jsonString = Buffer.isBuffer(bufferOrString)
        ? bufferOrString.toString('utf-8')
        : String(bufferOrString);
      return JSON.parse(jsonString) as ProblemDetails;
    }
  } catch {
    // Fail silently on parsing errors
  }
  return null;
}

@Catch()
export class GrpcProblemDetailsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const problemDetails = extractProblemDetails(exception);

    const exceptionObj = (
      exception && typeof exception === 'object' ? exception : {}
    ) as ExceptionWithStatusAndDetails;

    const status =
      problemDetails?.status ||
      exceptionObj.statusCode ||
      exceptionObj.status ||
      (exceptionObj.code !== undefined
        ? Enums.GrpcToHttpStatusMap[exceptionObj.code]
        : undefined) ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      problemDetails ?? {
        statusCode: status,
        details: exceptionObj.details || exceptionObj.message || 'Unknown error',
      },
    );
  }
}
