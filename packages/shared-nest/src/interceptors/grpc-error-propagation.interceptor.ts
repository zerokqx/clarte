import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Effect, pipe } from 'effect';
import { GrpcError, type GrpcCode } from '@clarte/shared-errors';
import { E } from '@clarte/shared';

interface GrpcErrorLike {
  code?: number;
  message?: string;
  metadata?: {
    get(key: string): unknown;
  };
}

function isGrpcErrorLike(error: unknown): error is GrpcErrorLike {
  if (!error || typeof error !== 'object') return false;
  return 'code' in error || 'metadata' in error;
}

const parseGrpcError = (error: unknown) =>
  pipe(
    Effect.succeed(error),
    Effect.filterOrFail(isGrpcErrorLike, () => error),
    Effect.map((e) => {
      let details: Record<string, unknown> | undefined;

      if (e.metadata && typeof e.metadata === 'object' && 'get' in e.metadata) {
        const getMeta = E.safeMetadataGrpcGetter(e.metadata);
        const raw =
          getMeta('error-details-bin') ||
          getMeta('problem-details-bin') ||
          getMeta('problem-details');
        const first = Array.isArray(raw) ? raw[0] : raw;

        if (first) {
          try {
            const str = Buffer.isBuffer(first) ? first.toString('utf-8') : String(first);
            details = JSON.parse(str) as Record<string, unknown>;
          } catch {
            // Ignore parse errors
          }
        }
      }

      const code = (e.code ?? 13) as GrpcCode;
      const message = e.message || 'Unknown gRPC error';

      return new GrpcError({
        code,
        message,
        details,
      });
    }),
  );

@Injectable()
export class GrpcErrorPropagationInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        const resultException = Effect.runSync(
          Effect.match(parseGrpcError(error), {
            onFailure: (originalError) => originalError,
            onSuccess: (restoredError) => restoredError,
          }),
        );

        return throwError(() => resultException);
      }),
    );
  }
}
