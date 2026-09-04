import { Metadata } from '@grpc/grpc-js';
import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { DomainError, GrpcError, GRPC_CODES, domainErrorToGrpcError } from '@clarte/shared-errors';

interface RpcExceptionObject {
  code?: number;
  message?: string;
  details?: Record<string, unknown>;
  metadata?: Metadata;
}

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter {
  catch(exception: unknown): Observable<unknown> {
    let code: number = GRPC_CODES.INTERNAL;
    let message = 'Internal server error';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof DomainError) {
      const plain = domainErrorToGrpcError(exception);
      code = plain.code;
      message = plain.message;
      details = plain.details;
    } else if (exception instanceof GrpcError) {
      const plain = exception.toGrpcError();
      code = plain.code;
      message = plain.message;
      details = plain.details;
    } else if (exception && typeof exception === 'object') {
      const rpcErr = exception as RpcExceptionObject;
      if (typeof rpcErr.code === 'number') {
        code = rpcErr.code;
      }
      if (typeof rpcErr.message === 'string') {
        message = rpcErr.message;
      }
      if (rpcErr.details && typeof rpcErr.details === 'object') {
        details = rpcErr.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const metadata = new Metadata();
    metadata.set('type', 'grpc');

    if (details && Object.keys(details).length > 0) {
      metadata.set('error-details-bin', Buffer.from(JSON.stringify(details), 'utf-8'));
    }

    return throwError(() => ({
      code,
      message,
      metadata,
    }));
  }
}
