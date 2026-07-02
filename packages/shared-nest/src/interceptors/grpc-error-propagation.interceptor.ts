import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Effect, pipe } from 'effect';
import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';
import { E } from '@clarte/shared';

interface ParsedDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  [key: string]: unknown;
}

interface GrpcErrorLike {
  metadata: {
    get(key: string): unknown;
  };
}

function isGrpcErrorLike(error: unknown): error is GrpcErrorLike {
  if (!error || typeof error !== 'object') return false;
  if (!('metadata' in error)) return false;

  const metadata = (error as Record<string, unknown>).metadata;
  return (
    !!metadata &&
    typeof metadata === 'object' &&
    'get' in metadata &&
    typeof (metadata as Record<string, unknown>).get === 'function'
  );
}

/**
 * Специальный класс для восстановления ошибки из gRPC-метаданных.
 * Так как ProblemDetailsException абстрактный, нам нужен конкретный класс для инстанцирования.
 */
class RestoredProblemDetailsException extends ProblemDetailsException {
  public readonly type: string;
  public readonly title: string;
  public readonly status: number;

  constructor(parsedDetails: ParsedDetails) {
    const { type, title, status, detail, ...extensions } = parsedDetails;

    super(detail || 'Произошла неизвестная ошибка', extensions);

    this.type = type || 'about:blank';
    this.title = title || 'Internal Server Error';
    this.status = status || 500;
  }
}

const parseGrpcError = (error: unknown) =>
  pipe(
    Effect.succeed(error),
    Effect.filterOrFail(
      isGrpcErrorLike,
      () => error,
    ),
    Effect.filterOrFail(
      (e) => {
        const typeHeader = e.metadata.get('type');
        const raw = Array.isArray(typeHeader) ? typeHeader[0] : typeHeader;
        return !!raw && raw.toString() === 'grpc';
      },
      () => error,
    ),
    Effect.flatMap((e) => {
      const getMeta = E.safeMetadataGrpcGetter(e.metadata);
      const raw = getMeta('problem-details-bin') || getMeta('problem-details');

      if (raw && raw.length > 0) {
        const val = raw[0];
        const str = Buffer.isBuffer(val) ? val.toString('utf-8') : String(val);
        return Effect.succeed(str);
      }
      return Effect.fail(error);
    }),
    // 4. Безопасно парсим JSON
    Effect.flatMap((jsonStr) =>
      Effect.try({
        try: () => JSON.parse(jsonStr) as ParsedDetails,
        catch: () => error,
      }),
    ),
    Effect.map((parsed) => new RestoredProblemDetailsException(parsed)),
  );

@Injectable()
export class GrpcErrorPropagationInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
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
