import { status as GrpcStatus, Metadata } from '@grpc/grpc-js';
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { ProblemDetailsException } from '@clarte/shared-domain/exceptions';
import * as Enums from '@/enums';

@Catch(ProblemDetailsException)
export class ProblemDetailsToGrpcExceptionFilter
  implements RpcExceptionFilter<ProblemDetailsException>
{
  catch(
    exception: ProblemDetailsException,
    _host: ArgumentsHost,
  ): Observable<any> {
    const grpcCode =
      Enums.HttpToGrpcStatusMap[exception.status] ??
      GrpcStatus.INTERNAL;
    const problemDetails = exception.toProblemDetails();

    const metadata = new Metadata();
    metadata.set('type', 'grpc');
    metadata.set(
      'problem-details-bin',
      Buffer.from(JSON.stringify(problemDetails), 'utf-8'),
    );

    return throwError(() => ({
      code: grpcCode,
      message: exception.message,
      metadata,
    }));
  }
}
